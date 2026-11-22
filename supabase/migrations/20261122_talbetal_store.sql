-- TALBETAL secure commerce schema for Supabase.
-- It mirrors the current server-side order and catalog records. RLS remains
-- enabled: only the server's service-role client can access these tables.

create table if not exists public.luno_products (
  slug text primary key,
  name text not null,
  category text not null,
  price_bdt integer not null check (price_bdt >= 0),
  discount_price_bdt integer check (discount_price_bdt is null or (discount_price_bdt >= 0 and discount_price_bdt <= price_bdt)),
  image text not null,
  short_description text not null,
  full_description text,
  features jsonb not null default '[]'::jsonb,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  sku text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists luno_products_category_active_idx on public.luno_products (category, active);

create table if not exists public.luno_orders (
  id bigint generated always as identity primary key,
  order_number text not null unique,
  product_slug text not null,
  product_name text not null,
  product_image text not null,
  unit_price_bdt integer not null check (unit_price_bdt >= 0),
  quantity integer not null check (quantity > 0 and quantity <= 10),
  product_subtotal_bdt integer,
  delivery_charge_bdt integer,
  discount_bdt integer,
  total_payable_bdt integer,
  delivery_area text,
  customer_name text not null,
  phone text not null,
  district text,
  upazila text,
  address text not null,
  customer_session_id text,
  payment_method text not null default 'cod',
  status text not null default 'pending',
  cancellation_reason text,
  created_at timestamptz not null default now()
);

create index if not exists luno_orders_created_at_idx on public.luno_orders (created_at desc);
create index if not exists luno_orders_customer_session_idx on public.luno_orders (customer_session_id, created_at desc);

create table if not exists public.luno_visitor_sessions (
  visitor_id text primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists luno_visitor_sessions_last_seen_idx on public.luno_visitor_sessions (last_seen_at desc);

alter table public.luno_products enable row level security;
alter table public.luno_orders enable row level security;
alter table public.luno_visitor_sessions enable row level security;
