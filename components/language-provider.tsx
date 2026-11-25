"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "bn";

const translations = {
  en: {
    "nav.shop": "SHOP", "nav.categories": "CATEGORIES", "nav.about": "ABOUT", "nav.contact": "CONTACT", "nav.account": "ACCOUNT", "nav.bag": "BAG (0)",
    "search.placeholder": "Search products...", "search.label": "Search products", "search.button": "SEARCH",
    "common.sale": "SALE", "common.buyNow": "BUY NOW →", "common.cancel": "CANCEL", "common.viewAll": "VIEW ALL →", "common.outOfStock": "OUT OF STOCK", "common.inStock": "In stock", "common.available": "available",
    "footer": "© 2026 TALBETAL · DHAKA, BANGLADESH",
    "category.perfume": "Perfume", "category.electronics-and-gadgets": "Electronics & Gadgets", "category.mens-fashion": "Men's Fashion", "category.womens-fashion": "Women's Fashion", "category.sunglasses": "Sunglasses", "category.watches": "Watches", "category.bags": "Bags", "category.shoes": "Shoes", "category.accessories": "Accessories", "category.more": "More",
    "home.eyebrow": "CURATED EVERYDAY LUXURY", "home.title": "A more considered way to live.", "home.description": "Premium essentials across style, technology, fragrance and more—selected for every version of your day.", "home.shopAll": "SHOP ALL PRODUCTS →", "home.explore": "EXPLORE CATEGORIES", "home.imageCaption": "Trends and gadgets, delivered with care.", "home.shopByCategory": "SHOP BY CATEGORY", "home.foundation": "SECURE COMMERCE FOUNDATION", "home.foundationTitle": "TALBETAL is taking shape.", "home.protected": "Protected accounts", "home.protectedText": "Sign in is handled by the platform; customer records and orders are always tied to the signed-in identity.", "home.serverOrders": "Server-side orders", "home.serverOrdersText": "Prices are calculated from the product database, never accepted from a browser checkout.", "home.admin": "Private admin controls", "home.adminText": "Admin APIs require a server-side email allowlist—there is no client-side admin switch.",
    "checkout.deliveryDetails": "Delivery details", "checkout.fullName": "Full name", "checkout.namePlaceholder": "Your full name", "checkout.mobile": "Mobile number", "checkout.quantity": "Quantity", "checkout.district": "District", "checkout.districtPlaceholder": "Search district", "checkout.districtSearch": "Type to search all 64 districts", "checkout.upazila": "Thana / Upazila", "checkout.upazilaPlaceholder": "Search thana or upazila", "checkout.upazilaSearch": "Type to search in the selected district", "checkout.address": "Full delivery address", "checkout.addressPlaceholder": "Village, house number, road, area, market or landmark", "checkout.orderSummary": "ORDER SUMMARY", "checkout.subtotal": "Product subtotal", "checkout.delivery": "Delivery charge", "checkout.discount": "Discount", "checkout.grandTotal": "Grand total", "checkout.insideDhaka": "Inside Dhaka", "checkout.outsideDhaka": "Outside Dhaka", "checkout.selectDistrict": "Select your district to view the delivery charge and grand total.", "checkout.confirm": "CONFIRM ORDER →", "checkout.saving": "SAVING ORDER…", "checkout.confirmed": "ORDER CONFIRMED ✓", "checkout.viewOrder": "VIEW MY ORDER →", "checkout.cashOnDelivery": "Cash on Delivery is selected.", "checkout.selectLocation": "Please select your district and thana / upazila.", "checkout.orderFailed": "Order could not be confirmed.", "checkout.noDistrict": "No matching district found.", "checkout.noUpazila": "No matching thana / upazila found.",
    "cart.eyebrow": "YOUR BAG", "cart.title": "Shopping cart.", "cart.empty": "Your bag is empty. Browse the TALBETAL collection to add your first item.", "cart.shop": "SHOP TALBETAL →", "cart.calculated": "Calculated at checkout",
    "product.specialPrice": "Special price", "product.cod": "Cash on Delivery available across Bangladesh.", "product.details": "PRODUCT DETAILS", "product.detailTitle": "Made for everyday listening.", "product.features": "KEY FEATURES", "product.more": "MORE TO EXPLORE", "product.related": "Related products.",
    "products.collection": "TALBETAL COLLECTION", "products.allTitle": "Shop all products.", "products.intro": "A curated edit of premium lifestyle essentials, selected for every version of your day.", "products.none": "No products found.", "products.try": "Try searching by product name or category, such as perfume, watch or bag.",
    "categories.discover": "DISCOVER TALBETAL", "categories.title": "Shop by category.", "categories.category": "CATEGORY", "categories.coming": "New pieces are being added to this TALBETAL collection.", "categories.all": "VIEW ALL PRODUCTS →",
    "about.eyebrow": "ABOUT TALBETAL", "about.title": "Your trends. Your choice. Your TALBETAL.", "contact.eyebrow": "WE'RE HERE TO HELP", "contact.title": "Contact TALBETAL.", "contact.text": "For product, order and delivery support, message us directly on WhatsApp.", "contact.cta": "CHAT ON WHATSAPP",
    "account.eyebrow": "MY TALBETAL", "account.title": "Your account.", "account.signIn": "Sign in to continue", "account.text": "Customer accounts keep orders private and tied to the signed-in customer.", "account.orders": "MY ORDERS →", "orders.title": "My orders.", "orders.text": "Your orders are private. You can cancel a pending order and include a cancellation reason.",
  },
  bn: {
    "nav.shop": "শপ", "nav.categories": "ক্যাটাগরি", "nav.about": "আমাদের সম্পর্কে", "nav.contact": "যোগাযোগ", "nav.account": "অ্যাকাউন্ট", "nav.bag": "ব্যাগ (০)",
    "search.placeholder": "পণ্য খুঁজুন...", "search.label": "পণ্য খুঁজুন", "search.button": "খুঁজুন",
    "common.sale": "সেল", "common.buyNow": "এখনই কিনুন →", "common.cancel": "বাতিল", "common.viewAll": "সব দেখুন →", "common.outOfStock": "স্টকে নেই", "common.inStock": "স্টকে আছে", "common.available": "টি উপলভ্য",
    "footer": "© ২০২৬ TALBETAL · ঢাকা, বাংলাদেশ",
    "category.perfume": "পারফিউম", "category.electronics-and-gadgets": "ইলেকট্রনিকস ও গ্যাজেটস", "category.mens-fashion": "পুরুষদের ফ্যাশন", "category.womens-fashion": "নারীদের ফ্যাশন", "category.sunglasses": "সানগ্লাস", "category.watches": "ঘড়ি", "category.bags": "ব্যাগ", "category.shoes": "জুতা", "category.accessories": "অ্যাক্সেসরিজ", "category.more": "আরও",
    "home.eyebrow": "আপনার প্রতিদিনের জন্য বাছাই করা প্রিমিয়াম পণ্য", "home.title": "আরও সচেতনভাবে বাঁচার একটি উপায়।", "home.description": "স্টাইল, প্রযুক্তি, সুগন্ধি এবং আরও অনেক প্রয়োজনীয় প্রিমিয়াম পণ্য—আপনার প্রতিটি দিনের জন্য বাছাই করা।", "home.shopAll": "সব পণ্য দেখুন →", "home.explore": "ক্যাটাগরি দেখুন", "home.imageCaption": "যত্নের সঙ্গে ট্রেন্ডস ও গ্যাজেটস পৌঁছে দিই।", "home.shopByCategory": "ক্যাটাগরি অনুযায়ী শপ করুন", "home.foundation": "নিরাপদ ই-কমার্স ভিত্তি", "home.foundationTitle": "TALBETAL এগিয়ে যাচ্ছে।", "home.protected": "সুরক্ষিত অ্যাকাউন্ট", "home.protectedText": "সাইন-ইন প্ল্যাটফর্মে পরিচালিত হয়; কাস্টমারের রেকর্ড ও অর্ডার তাদের নিজের পরিচয়ের সঙ্গে যুক্ত থাকে।", "home.serverOrders": "সার্ভার-ভিত্তিক অর্ডার", "home.serverOrdersText": "পণ্যের ডাটাবেস থেকে দাম হিসাব করা হয়, ব্রাউজার থেকে দেওয়া দাম গ্রহণ করা হয় না।", "home.admin": "ব্যক্তিগত অ্যাডমিন নিয়ন্ত্রণ", "home.adminText": "অ্যাডমিন API সার্ভার-সাইড ইমেইল অনুমতির মাধ্যমে সুরক্ষিত—কোনো client-side admin switch নেই।",
    "checkout.deliveryDetails": "ডেলিভারির তথ্য", "checkout.fullName": "পূর্ণ নাম", "checkout.namePlaceholder": "আপনার পূর্ণ নাম", "checkout.mobile": "মোবাইল নম্বর", "checkout.quantity": "পরিমাণ", "checkout.district": "জেলা", "checkout.districtPlaceholder": "জেলা খুঁজুন", "checkout.districtSearch": "সব ৬৪টি জেলায় খুঁজতে লিখুন", "checkout.upazila": "থানা / উপজেলা", "checkout.upazilaPlaceholder": "থানা বা উপজেলা খুঁজুন", "checkout.upazilaSearch": "নির্বাচিত জেলার মধ্যে খুঁজতে লিখুন", "checkout.address": "সম্পূর্ণ ডেলিভারি ঠিকানা", "checkout.addressPlaceholder": "গ্রাম, বাড়ি নম্বর, রোড, এলাকা, বাজার বা ল্যান্ডমার্ক", "checkout.orderSummary": "অর্ডার সারাংশ", "checkout.subtotal": "পণ্যের মোট দাম", "checkout.delivery": "ডেলিভারি চার্জ", "checkout.discount": "ডিসকাউন্ট", "checkout.grandTotal": "সর্বমোট", "checkout.insideDhaka": "ঢাকার ভিতরে", "checkout.outsideDhaka": "ঢাকার বাইরে", "checkout.selectDistrict": "ডেলিভারি চার্জ ও সর্বমোট দেখতে আপনার জেলা নির্বাচন করুন।", "checkout.confirm": "অর্ডার নিশ্চিত করুন →", "checkout.saving": "অর্ডার সংরক্ষণ হচ্ছে…", "checkout.confirmed": "অর্ডার নিশ্চিত হয়েছে ✓", "checkout.viewOrder": "আমার অর্ডার দেখুন →", "checkout.cashOnDelivery": "ক্যাশ অন ডেলিভারি নির্বাচিত হয়েছে।", "checkout.selectLocation": "অনুগ্রহ করে জেলা এবং থানা / উপজেলা নির্বাচন করুন।", "checkout.orderFailed": "অর্ডার নিশ্চিত করা যায়নি।", "checkout.noDistrict": "মিলে এমন কোনো জেলা পাওয়া যায়নি।", "checkout.noUpazila": "মিলে এমন কোনো থানা / উপজেলা পাওয়া যায়নি।",
    "cart.eyebrow": "আপনার ব্যাগ", "cart.title": "শপিং কার্ট।", "cart.empty": "আপনার ব্যাগ খালি। প্রথম পণ্য যোগ করতে TALBETAL কালেকশন দেখুন।", "cart.shop": "TALBETAL শপ করুন →", "cart.calculated": "চেকআউটে নির্ধারিত হবে",
    "product.specialPrice": "বিশেষ মূল্য", "product.cod": "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা আছে।", "product.details": "পণ্যের বিস্তারিত", "product.detailTitle": "প্রতিদিনের ব্যবহারের জন্য তৈরি।", "product.features": "মূল বৈশিষ্ট্য", "product.more": "আরও দেখুন", "product.related": "সম্পর্কিত পণ্য।",
    "products.collection": "TALBETAL কালেকশন", "products.allTitle": "সব পণ্য দেখুন।", "products.intro": "আপনার প্রতিটি দিনের জন্য বাছাই করা প্রিমিয়াম লাইফস্টাইল পণ্যের কালেকশন।", "products.none": "কোনো পণ্য পাওয়া যায়নি।", "products.try": "পণ্যের নাম বা ক্যাটাগরি দিয়ে খুঁজুন, যেমন পারফিউম, ঘড়ি বা ব্যাগ।",
    "categories.discover": "TALBETAL আবিষ্কার করুন", "categories.title": "ক্যাটাগরি অনুযায়ী শপ করুন।", "categories.category": "ক্যাটাগরি", "categories.coming": "এই TALBETAL কালেকশনে নতুন পণ্য যোগ করা হচ্ছে।", "categories.all": "সব পণ্য দেখুন →",
    "about.eyebrow": "TALBETAL সম্পর্কে", "about.title": "আপনার ট্রেন্ড। আপনার পছন্দ। আপনার TALBETAL।", "contact.eyebrow": "আমরা সাহায্যের জন্য আছি", "contact.title": "TALBETAL-এ যোগাযোগ করুন।", "contact.text": "পণ্য, অর্ডার ও ডেলিভারি সহায়তার জন্য সরাসরি WhatsApp-এ মেসেজ দিন।", "contact.cta": "WHATSAPP-এ কথা বলুন",
    "account.eyebrow": "আমার TALBETAL", "account.title": "আপনার অ্যাকাউন্ট।", "account.signIn": "চালিয়ে যেতে সাইন ইন করুন", "account.text": "কাস্টমার অ্যাকাউন্ট অর্ডারকে ব্যক্তিগত ও সংশ্লিষ্ট কাস্টমারের সঙ্গে সংযুক্ত রাখে।", "account.orders": "আমার অর্ডার →", "orders.title": "আমার অর্ডার।", "orders.text": "আপনার অর্ডার ব্যক্তিগত। পেন্ডিং অর্ডার বাতিল করে তার কারণ লিখতে পারবেন।",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem("talbetal-language");
    if (stored === "bn" || stored === "en") setLanguageState(stored);
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage: (next: Language) => { window.localStorage.setItem("talbetal-language", next); setLanguageState(next); }, t: (key: TranslationKey) => translations[language][key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
