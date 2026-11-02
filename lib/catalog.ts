export type CatalogProduct = {
  slug: string;
  name: string;
  category: string;
  priceBdt: number;
  image: string;
  description: string;
};

export const catalog: CatalogProduct[] = [
  { slug: "noir-oud-eau-de-parfum", name: "Noir Oud Eau de Parfum", category: "perfume", priceBdt: 3850, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85", description: "A warm, refined fragrance with oud, amber and soft spice notes." },
  { slug: "luno-classic-watch", name: "LUNO Classic Watch", category: "watches", priceBdt: 5250, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85", description: "A clean everyday timepiece with a polished steel case and leather strap." },
  { slug: "signature-tote-bag", name: "Signature Tote Bag", category: "bags", priceBdt: 2890, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85", description: "A structured, versatile tote made for workdays and weekends." },
  { slug: "wireless-audio-pro", name: "Wireless Audio Pro", category: "electronics-and-gadgets", priceBdt: 4490, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", description: "Comfortable wireless headphones with rich everyday audio." },
  { slug: "essentials-linen-shirt", name: "Essentials Linen Shirt", category: "mens-fashion", priceBdt: 2190, image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=900&q=85", description: "An airy, tailored shirt in a timeless neutral tone." },
  { slug: "luna-satin-scarf", name: "Luna Satin Scarf", category: "womens-fashion", priceBdt: 1290, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85", description: "A lightweight satin scarf that adds a polished finish to any look." },
  { slug: "eclipse-sunglasses", name: "Eclipse Sunglasses", category: "sunglasses", priceBdt: 1750, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85", description: "Modern UV-protective frames designed for effortless daily wear." },
  { slug: "leather-card-holder", name: "Leather Card Holder", category: "accessories", priceBdt: 950, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85", description: "A compact premium card holder with a clean, minimal profile." },
];

export function formatBdt(value: number) { return `৳ ${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(value)}`; }
