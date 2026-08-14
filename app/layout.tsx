import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLEX | Premium Knee Support",
  description:
    "FLEX Premium Knee Support provides comfortable and reliable support for everyday movement, exercise, and active lifestyles.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://flex-knee-landing.vercel.app/",
  },
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
