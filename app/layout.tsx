import PageTransition from "@/components/page-transition";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXORA | Smart Online Store",
  description:
    "Discover products at NEXORA — a modern multilingual online store for everyday needs.",
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
        <meta
          name="google-adsense-account"
          content="ca-pub-7982982112293185"
        />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7982982112293185"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body>
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
