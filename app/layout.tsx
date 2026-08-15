import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLEX | Premium Knee Support",
  description:
    "Discover FLEX premium knee support designed for comfort, stability, and everyday movement.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7982982112293185"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
