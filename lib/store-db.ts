import { neon } from "@neondatabase/serverless";
import { getProductBySlug } from "@/lib/catalog";

export type StoreOrder = {
  orderNumber: string;
  productSlug: string;
  productName: string;
  productImage: string;
  unitPriceBdt: number;
  quantity: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: "cod";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'cod',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS luno_orders_created_at_idx ON luno_orders (created_at DESC)`;
    })();
  }
  return schemaPromise;
}

export async function createStoreOrder(input: {
  slug: string;
  name: string;
  phone: string;
  address: string;
}) {
  const product = getProductBySlug(input.slug);
  if (!product) throw new Error("The selected product is unavailable");
  const sql = sqlClient();
  await ensureSchema();
  const orderNumber = `LUNO-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;
  const rows = await sql`
    INSERT INTO luno_orders (
      order_number, product_slug, product_name, product_image, unit_price_bdt,
      quantity, customer_name, phone, address, payment_method
    ) VALUES (
      ${orderNumber}, ${product.slug}, ${product.name}, ${product.image}, ${product.priceBdt},
      1, ${input.name}, ${input.phone}, ${input.address}, 'cod'
    )
    RETURNING order_number AS "orderNumber", unit_price_bdt AS "unitPriceBdt"
  `;
  return rows[0] as { orderNumber: string; unitPriceBdt: number };
}

export async function listStoreOrders(): Promise<StoreOrder[]> {
  const sql = sqlClient();
  await ensureSchema();
  const rows = await sql`
    SELECT order_number AS "orderNumber", product_slug AS "productSlug",
      product_name AS "productName", product_image AS "productImage",
      unit_price_bdt AS "unitPriceBdt", quantity, customer_name AS "customerName",
      phone, address, payment_method AS "paymentMethod", status,
      created_at AS "createdAt"
    FROM luno_orders
    ORDER BY created_at DESC
  `;
  return rows as StoreOrder[];
}
