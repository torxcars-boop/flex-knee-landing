import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLEX | Premium Knee Support",
  description:
    "Premium knee support designed for stability, comfort, and better movement.",
  verification: {
    google: "FZMQJFMYJMuTGEZWk3iEhFbKV0OSkbw1flZwM2tmVMM",
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
