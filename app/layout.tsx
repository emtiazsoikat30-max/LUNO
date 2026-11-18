import type { Metadata } from "next";
import "./globals.css";
import { MetaPixel } from "@/components/meta-pixel";

export const metadata: Metadata = {
  title: "TALBETAL — Trends & Gadgets",
  description: "Trends, gadgets and everyday essentials from TALBETAL.",
  metadataBase: new URL("https://talbetal.vercel.app"),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/talbetal-logo.jpeg",
    shortcut: "/talbetal-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><MetaPixel />{children}</body>
    </html>
  );
}
