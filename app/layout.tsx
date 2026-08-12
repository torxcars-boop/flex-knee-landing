import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";

export const metadata: Metadata = {
  title: "متجرك",
  description: "متجر إلكتروني احترافي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
