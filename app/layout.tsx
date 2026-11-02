import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUNO — Your lifestyle, our priority",
  description: "Premium lifestyle essentials from LUNO.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
