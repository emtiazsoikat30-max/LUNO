CREATE TABLE `customers` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `auth_user_id` text NOT NULL UNIQUE,
  `email` text NOT NULL,
  `full_name` text,
  `phone` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `name` text NOT NULL,
  `image_url` text,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `category_id` integer REFERENCES `categories`(`id`),
  `slug` text NOT NULL UNIQUE,
  `name` text NOT NULL,
  `description` text DEFAULT '' NOT NULL,
  `price_bdt` integer NOT NULL,
  `stock` integer DEFAULT 0 NOT NULL,
  `image_url` text,
  `is_active` integer DEFAULT true NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_number` text NOT NULL UNIQUE,
  `customer_auth_user_id` text NOT NULL,
  `customer_name` text NOT NULL,
  `customer_email` text NOT NULL,
  `phone` text NOT NULL,
  `shipping_address` text NOT NULL,
  `payment_method` text NOT NULL,
  `payment_status` text DEFAULT 'pending' NOT NULL,
  `order_status` text DEFAULT 'placed' NOT NULL,
  `subtotal_bdt` integer NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_id` integer NOT NULL REFERENCES `orders`(`id`),
  `product_id` integer NOT NULL REFERENCES `products`(`id`),
  `product_name` text NOT NULL,
  `unit_price_bdt` integer NOT NULL,
  `quantity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coupons` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `code` text NOT NULL UNIQUE,
  `discount_type` text NOT NULL,
  `discount_value` integer NOT NULL,
  `minimum_order_bdt` integer DEFAULT 0 NOT NULL,
  `is_active` integer DEFAULT true NOT NULL,
  `expires_at` text,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `banners` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `subtitle` text DEFAULT '' NOT NULL,
  `image_url` text,
  `link_url` text,
  `is_active` integer DEFAULT true NOT NULL,
  `updated_at` text NOT NULL
);
