import { neon } from "@neondatabase/serverless";
import { catalog, type CatalogProduct } from "@/lib/catalog";
import { calculateOrderPricing, type OrderPricing } from "@/lib/order-pricing";

export type StoreOrder = {
  orderNumber: string;
  productSlug: string;
  productName: string;
  productImage: string;
  unitPriceBdt: number;
  quantity: number;
  productSubtotalBdt?: number | null;
  deliveryChargeBdt?: number | null;
  discountBdt?: number | null;
  totalPayableBdt?: number | null;
  deliveryArea?: "inside_dhaka" | "outside_dhaka" | null;
  customerName: string;
  phone: string;
  district?: string | null;
  upazila?: string | null;
  address: string;
  paymentMethod: "cod";
  status: "pending" | "reviewed" | "received" | "delivered" | "cancelled";
  cancellationReason?: string | null;
  createdAt: string;
};

export type VisitorAnalytics = {
  totalVisitors: number;
  liveVisitors: number;
};

let schemaPromise: Promise<void> | undefined;
let catalogCache: { products: CatalogProduct[]; expiresAt: number } | undefined;

function databaseUrl() {
  return process.env.STORAGE_DATABASE_URL ?? process.env.DATABASE_URL;
}

function sqlClient() {
  const url = databaseUrl();
  if (!url) throw new Error("Store database is not configured");
  return neon(url);
}

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const sql = sqlClient();
      await sql`CREATE TABLE IF NOT EXISTS luno_orders (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        product_slug TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_image TEXT NOT NULL,
        unit_price_bdt INTEGER NOT NULL CHECK (unit_price_bdt >= 0),
        quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 10),
        product_subtotal_bdt INTEGER,
        delivery_charge_bdt INTEGER,
        discount_bdt INTEGER,
        total_payable_bdt INTEGER,
        delivery_area TEXT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        district TEXT,
        upazila TEXT,
        address TEXT NOT NULL,
        customer_session_id TEXT,
        payment_method TEXT NOT NULL DEFAULT 'cod',
        status TEXT NOT NULL DEFAULT 'pending',
        cancellation_reason TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS customer_session_id TEXT`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS district TEXT`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS upazila TEXT`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS product_subtotal_bdt INTEGER`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS delivery_charge_bdt INTEGER`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS discount_bdt INTEGER`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS total_payable_bdt INTEGER`;
      await sql`ALTER TABLE luno_orders ADD COLUMN IF NOT EXISTS delivery_area TEXT`;
      await sql`CREATE INDEX IF NOT EXISTS luno_orders_created_at_idx ON luno_orders (created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS luno_orders_customer_session_idx ON luno_orders (customer_session_id, created_at DESC)`;
      await sql`CREATE TABLE IF NOT EXISTS luno_products (
        slug TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price_bdt INTEGER NOT NULL CHECK (price_bdt >= 0),
        discount_price_bdt INTEGER CHECK (discount_price_bdt IS NULL OR discount_price_bdt >= 0),
        image TEXT NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
        sku TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS luno_products_category_active_idx ON luno_products (category, active)`;
      for (const product of catalog) {
        await sql`INSERT INTO luno_products (slug, name, category, price_bdt, discount_price_bdt, image, short_description, full_description, features, stock_quantity, sku, active)
          VALUES (${product.slug}, ${product.name}, ${product.category}, ${product.priceBdt}, ${product.discountPriceBdt ?? null}, ${product.image}, ${product.description}, ${product.fullDescription ?? null}, ${JSON.stringify(product.features ?? [])}::jsonb, ${product.stockQuantity ?? 100}, ${product.sku ?? null}, ${product.active ?? true})
          ON CONFLICT (slug) DO NOTHING`;
      }
      await sql`CREATE TABLE IF NOT EXISTS luno_visitor_sessions (
        visitor_id TEXT PRIMARY KEY,
        first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS luno_visitor_sessions_last_seen_idx ON luno_visitor_sessions (last_seen_at DESC)`;
    })();
  }
  return schemaPromise;
}

function rowToProduct(row: Record<string, unknown>): CatalogProduct {
  const features = typeof row.features === "string" ? JSON.parse(row.features) : row.features;
  return { slug: String(row.slug), name: String(row.name), category: String(row.category), priceBdt: Number(row.priceBdt), discountPriceBdt: row.discountPriceBdt == null ? null : Number(row.discountPriceBdt), image: String(row.image), description: String(row.shortDescription), fullDescription: row.fullDescription == null ? undefined : String(row.fullDescription), features: Array.isArray(features) ? features.filter((item): item is string => typeof item === "string") : [], stockQuantity: Number(row.stockQuantity ?? 0), sku: row.sku == null ? undefined : String(row.sku), active: Boolean(row.active) };
}

const productSelect = `slug, name, category, price_bdt AS "priceBdt", discount_price_bdt AS "discountPriceBdt", image, short_description AS "shortDescription", full_description AS "fullDescription", features, stock_quantity AS "stockQuantity", sku, active`;

export async function listCatalogProducts(includeInactive = false): Promise<CatalogProduct[]> {
  try {
    if (catalogCache && catalogCache.expiresAt > Date.now()) return includeInactive ? catalogCache.products : catalogCache.products.filter((product) => product.active !== false);
    const sql = sqlClient(); await ensureSchema();
    const rows = await sql.query(`SELECT ${productSelect} FROM luno_products ORDER BY created_at DESC`);
    const products = rows.map((row) => rowToProduct(row as Record<string, unknown>));
    catalogCache = { products, expiresAt: Date.now() + 60_000 };
    return includeInactive ? products : products.filter((product) => product.active !== false);
  } catch { return includeInactive ? catalog : catalog.filter((product) => product.active !== false); }
}

export async function getCatalogProductBySlug(slug: string, includeInactive = false): Promise<CatalogProduct | undefined> {
  const products = await listCatalogProducts(includeInactive);
  return products.find((product) => product.slug === slug);
}

export type AdminProductInput = Omit<CatalogProduct, "slug"> & { slug: string };

export async function saveCatalogProduct(input: AdminProductInput) {
  const sql = sqlClient(); await ensureSchema();
  const rows = await sql`INSERT INTO luno_products (slug, name, category, price_bdt, discount_price_bdt, image, short_description, full_description, features, stock_quantity, sku, active, updated_at)
    VALUES (${input.slug}, ${input.name}, ${input.category}, ${input.priceBdt}, ${input.discountPriceBdt ?? null}, ${input.image}, ${input.description}, ${input.fullDescription ?? null}, ${JSON.stringify(input.features ?? [])}::jsonb, ${input.stockQuantity ?? 0}, ${input.sku ?? null}, ${input.active !== false}, NOW())
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, price_bdt = EXCLUDED.price_bdt, discount_price_bdt = EXCLUDED.discount_price_bdt, image = EXCLUDED.image, short_description = EXCLUDED.short_description, full_description = EXCLUDED.full_description, features = EXCLUDED.features, stock_quantity = EXCLUDED.stock_quantity, sku = EXCLUDED.sku, active = EXCLUDED.active, updated_at = NOW()
    RETURNING slug, name, category, price_bdt AS "priceBdt", discount_price_bdt AS "discountPriceBdt", image, short_description AS "shortDescription", full_description AS "fullDescription", features, stock_quantity AS "stockQuantity", sku, active`;
  catalogCache = undefined;
  return rowToProduct(rows[0] as Record<string, unknown>);
}

export async function recordVisitor(visitorId: string) {
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(visitorId)) throw new Error("Invalid visitor identifier");
  const sql = sqlClient();
  await ensureSchema();
  await sql`
    INSERT INTO luno_visitor_sessions (visitor_id, first_seen_at, last_seen_at)
    VALUES (${visitorId}, NOW(), NOW())
    ON CONFLICT (visitor_id) DO UPDATE SET last_seen_at = NOW()
  `;
}

export async function getVisitorAnalytics(): Promise<VisitorAnalytics> {
  const sql = sqlClient();
  await ensureSchema();
  const rows = await sql`
    SELECT
      COUNT(*)::int AS "totalVisitors",
      COUNT(*) FILTER (WHERE last_seen_at >= NOW() - INTERVAL '2 minutes')::int AS "liveVisitors"
    FROM luno_visitor_sessions
  `;
  const row = rows[0] as VisitorAnalytics | undefined;
  return { totalVisitors: Number(row?.totalVisitors ?? 0), liveVisitors: Number(row?.liveVisitors ?? 0) };
}

export async function createStoreOrder(input: {
  slug: string;
  name: string;
  phone: string;
  district: string;
  districtEnglishName: string;
  upazila: string;
  address: string;
  quantity: number;
  customerSessionId: string;
}) {
  const product = await getCatalogProductBySlug(input.slug);
  if (!product) throw new Error("The selected product is unavailable");
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 10) throw new Error("Invalid quantity");
  const unitPriceBdt = product.discountPriceBdt ?? product.priceBdt;
  const pricing = calculateOrderPricing(unitPriceBdt, input.quantity, input.districtEnglishName);
  const sql = sqlClient();
  await ensureSchema();
  const orderNumber = `TALBETAL-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;
  const rows = await sql`
    INSERT INTO luno_orders (
      order_number, product_slug, product_name, product_image, unit_price_bdt,
      quantity, product_subtotal_bdt, delivery_charge_bdt, discount_bdt, total_payable_bdt, delivery_area,
      customer_name, phone, district, upazila, address, customer_session_id, payment_method
    ) VALUES (
      ${orderNumber}, ${product.slug}, ${product.name}, ${product.image}, ${unitPriceBdt},
      ${input.quantity}, ${pricing.productSubtotalBdt}, ${pricing.deliveryChargeBdt}, ${pricing.discountBdt}, ${pricing.totalPayableBdt}, ${pricing.deliveryArea},
      ${input.name}, ${input.phone}, ${input.district}, ${input.upazila}, ${input.address}, ${input.customerSessionId}, 'cod'
    )
    RETURNING order_number AS "orderNumber", unit_price_bdt AS "unitPriceBdt", product_subtotal_bdt AS "productSubtotalBdt", delivery_charge_bdt AS "deliveryChargeBdt", discount_bdt AS "discountBdt", total_payable_bdt AS "totalPayableBdt", delivery_area AS "deliveryArea"
  `;
  return rows[0] as { orderNumber: string; unitPriceBdt: number } & OrderPricing;
}

export async function listStoreOrders(): Promise<StoreOrder[]> {
  const sql = sqlClient();
  await ensureSchema();
  const rows = await sql`
    SELECT order_number AS "orderNumber", product_slug AS "productSlug",
      product_name AS "productName", product_image AS "productImage",
      unit_price_bdt AS "unitPriceBdt", quantity, product_subtotal_bdt AS "productSubtotalBdt", delivery_charge_bdt AS "deliveryChargeBdt", discount_bdt AS "discountBdt", total_payable_bdt AS "totalPayableBdt", delivery_area AS "deliveryArea", customer_name AS "customerName",
      phone, district, upazila, address, payment_method AS "paymentMethod", status,
      cancellation_reason AS "cancellationReason",
      created_at AS "createdAt"
    FROM luno_orders
    ORDER BY created_at DESC
  `;
  return rows as StoreOrder[];
}

export async function listCustomerOrders(customerSessionId: string): Promise<StoreOrder[]> {
  const sql = sqlClient(); await ensureSchema();
  const rows = await sql`SELECT order_number AS "orderNumber", product_slug AS "productSlug", product_name AS "productName", product_image AS "productImage", unit_price_bdt AS "unitPriceBdt", quantity, product_subtotal_bdt AS "productSubtotalBdt", delivery_charge_bdt AS "deliveryChargeBdt", discount_bdt AS "discountBdt", total_payable_bdt AS "totalPayableBdt", delivery_area AS "deliveryArea", customer_name AS "customerName", phone, district, upazila, address, payment_method AS "paymentMethod", status, cancellation_reason AS "cancellationReason", created_at AS "createdAt" FROM luno_orders WHERE customer_session_id = ${customerSessionId} ORDER BY created_at DESC`;
  return rows as StoreOrder[];
}

export async function cancelCustomerOrder(customerSessionId: string, orderNumber: string, reason: string) {
  const sql = sqlClient(); await ensureSchema();
  const rows = await sql`UPDATE luno_orders SET status = 'cancelled', cancellation_reason = ${reason} WHERE order_number = ${orderNumber} AND customer_session_id = ${customerSessionId} AND status = 'pending' RETURNING order_number AS "orderNumber", status, cancellation_reason AS "cancellationReason"`;
  return rows[0] as { orderNumber: string; status: StoreOrder["status"]; cancellationReason: string } | undefined;
}

export async function updateStoreOrderStatus(orderNumber: string, status: StoreOrder["status"]) {
  const allowed = ["pending", "reviewed", "received", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Invalid order status");
  const sql = sqlClient();
  await ensureSchema();
  const rows = await sql`UPDATE luno_orders SET status = ${status} WHERE order_number = ${orderNumber} RETURNING order_number AS "orderNumber", status`;
  return rows[0] as { orderNumber: string; status: StoreOrder["status"] } | undefined;
}

export async function deleteStoreOrder(orderNumber: string) {
  const sql = sqlClient(); await ensureSchema();
  const rows = await sql`DELETE FROM luno_orders WHERE order_number = ${orderNumber} RETURNING order_number AS "orderNumber"`;
  return rows[0] as { orderNumber: string } | undefined;
}
