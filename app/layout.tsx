import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLEX | Premium Knee Support",
  description:
    "Premium knee support engineered for stability, flexibility and confident movement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
