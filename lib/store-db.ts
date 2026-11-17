import { neon } from "@neondatabase/serverless";
import { getProductBySlug } from "@/lib/catalog";
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

let schemaPromise: Promise<void> | undefined;

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
    })();
  }
  return schemaPromise;
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
  const product = getProductBySlug(input.slug);
  if (!product) throw new Error("The selected product is unavailable");
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 10) throw new Error("Invalid quantity");
  const pricing = calculateOrderPricing(product.priceBdt, input.quantity, input.districtEnglishName);
  const sql = sqlClient();
  await ensureSchema();
  const orderNumber = `TALBETAL-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;
  const rows = await sql`
    INSERT INTO luno_orders (
      order_number, product_slug, product_name, product_image, unit_price_bdt,
      quantity, product_subtotal_bdt, delivery_charge_bdt, discount_bdt, total_payable_bdt, delivery_area,
      customer_name, phone, district, upazila, address, customer_session_id, payment_method
    ) VALUES (
      ${orderNumber}, ${product.slug}, ${product.name}, ${product.image}, ${product.priceBdt},
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
