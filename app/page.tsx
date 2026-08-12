"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Package,
  Loader2,
  Globe2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  image_url: string | null;
  stock: number;
};

type Language = "ar" | "en";

const translations = {
  ar: {
    store: "المتجر",
    admin: "لوحة التحكم",
    heroLabel: "تسوق بثقة",
    heroTitle: "منتجات مختارة",
    heroTitleMuted: "مصممة لتناسب احتياجاتك.",
    heroDescription:
      "اكتشف مجموعة المنتجات المتاحة في متجرنا، وتصفح التفاصيل والأسعار واختر ما يناسبك بسهولة.",
    productsLabel: "المنتجات",
    latestProducts: "أحدث المنتجات",
    productCount: "منتج",
    noProducts: "لا توجد منتجات حاليًا",
    noProductsDescription:
      "ستظهر المنتجات هنا تلقائيًا بمجرد إضافتها من لوحة التحكم.",
    noImage: "لا توجد صورة",
    details: "التفاصيل",
    egp: "جنيه",
    outOfStock: "غير متوفر",
    footer:
      "جميع الحقوق محفوظة. متجر إلكتروني احترافي متعدد اللغات.",
    language: "English",
  },

  en: {
    store: "Store",
    admin: "Admin",
    heroLabel: "Shop with confidence",
    heroTitle: "Curated products",
    heroTitleMuted: "made for your needs.",
    heroDescription:
      "Explore the products available in our store, view their details and prices, and choose what works best for you.",
    productsLabel: "PRODUCTS",
    latestProducts: "Latest products",
    productCount: "products",
    noProducts: "No products available",
    noProductsDescription:
      "Products will appear here automatically once they are added from the admin dashboard.",
    noImage: "No image",
    details: "View details",
    egp: "EGP",
    outOfStock: "Out of stock",
    footer:
      "All rights reserved. A professional multilingual online store.",
    language: "العربية",
  },
};

export default function HomePage() {
  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [language, setLanguage] =
    useState<Language>("ar");

  const t = translations[language];

  const isArabic = language === "ar";

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,description,price,old_price,category,image_url,stock"
      )
      .eq("active", true)
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setProducts(data as Product[]);
    } else {
      console.error(
        "Products error:",
        error
      );

      setProducts([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(
      () => {
        const savedLanguage =
          localStorage.getItem(
            "store-language"
          ) as Language | null;

        if (
          savedLanguage === "ar" ||
          savedLanguage === "en"
        ) {
          setLanguage(savedLanguage);
        }

        void loadProducts();
      }
    );

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function changeLanguage() {
    const nextLanguage: Language =
      language === "ar" ? "en" : "ar";

    setLanguage(nextLanguage);

    localStorage.setItem(
      "store-language",
      nextLanguage
    );
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      className="min-h-screen bg-[#050505] text-white"
    >
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/85 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b6ff00] text-xl font-black text-black transition group-hover:scale-105">
              F
            </div>

            <div>
              <div className="text-lg font-black tracking-tight">
                {t.store}
              </div>

              <div className="text-[10px] font-medium text-white/30">
                PREMIUM STORE
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={changeLanguage}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-bold text-white/60 transition hover:border-white/20 hover:text-white"
            >
              <Globe2 size={16} />

              <span className="hidden sm:inline">
                {t.language}
              </span>
            </button>

            <Link
              href="/admin"
              className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/50 transition hover:border-white/20 hover:text-white sm:block"
            >
              {t.admin}
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-xl bg-[#b6ff00] px-3 py-2.5 text-sm font-black text-black transition hover:scale-105 sm:px-4"
            >
              <ShoppingCart size={17} />

              <span>
                {isArabic ? "السلة" : "Cart"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#b6ff00]/10 blur-[150px]" />

          <div className="absolute bottom-[-250px] right-[-100px] h-[400px] w-[400px] rounded-full bg-white/[0.03] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#b6ff00]" />

              <span className="text-xs font-black tracking-[0.2em] text-[#b6ff00]">
                {t.heroLabel}
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              {t.heroTitle}
              <br />

              <span className="text-white/30">
                {t.heroTitleMuted}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-white/45 sm:text-lg sm:leading-9">
              {t.heroDescription}
            </p>

            <div className="mt-9">
              <a
                href="#products"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#b6ff00] px-6 py-4 text-sm font-black text-black transition hover:scale-[1.02]"
              >
                {t.latestProducts}

                {isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-[11px] font-black tracking-[0.2em] text-[#b6ff00]">
              {t.productsLabel}
            </div>

            <h2 className="text-3xl font-black sm:text-4xl">
              {t.latestProducts}
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/40">
            {products.length}{" "}
            {t.productCount}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-[#b6ff00]"
              />

              <p className="mt-4 text-sm text-white/30">
                {isArabic
                  ? "جاري تحميل المنتجات..."
                  : "Loading products..."}
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Package
                size={32}
                className="text-white/20"
              />
            </div>

            <h3 className="mt-6 text-xl font-black">
              {t.noProducts}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
              {t.noProductsDescription}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const outOfStock =
                product.stock <= 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#080808]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center text-white/20">
                          <Package
                            size={32}
                            className="mx-auto mb-3"
                          />

                          <span className="text-xs">
                            {t.noImage}
                          </span>
                        </div>
                      </div>
                    )}

                    {outOfStock && (
                      <div className="absolute inset-x-4 top-4">
                        <span className="inline-flex rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white/60 backdrop-blur">
                          {t.outOfStock}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    {product.category && (
                      <div className="text-[11px] font-black tracking-wide text-[#b6ff00]">
                        {product.category}
                      </div>
                    )}

                    <h3 className="mt-2 line-clamp-1 text-xl font-black">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-white/35">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#b6ff00]">
                            {product.price.toLocaleString(
                              isArabic
                                ? "ar-EG"
                                : "en-EG"
                            )}
                          </span>

                          <span className="text-[11px] font-bold text-white/30">
                            {t.egp}
                          </span>
                        </div>

                        {product.old_price &&
                          product.old_price >
                            product.price && (
                            <span className="text-xs text-white/25 line-through">
                              {product.old_price.toLocaleString(
                                isArabic
                                  ? "ar-EG"
                                  : "en-EG"
                              )}{" "}
                              {t.egp}
                            </span>
                          )}
                      </div>

                      <span className="flex items-center gap-1.5 text-xs font-black text-white/35 transition group-hover:text-white">
                        {t.details}

                        {isArabic ? (
                          <ArrowLeft size={14} />
                        ) : (
                          <ArrowRight size={14} />
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-right">
          <div className="text-xs text-white/25">
            © {new Date().getFullYear()} —{" "}
            {t.footer}
          </div>

          <div className="text-xs font-bold text-white/20">
            {isArabic
              ? "العربية / English"
              : "English / العربية"}
          </div>
        </div>
      </footer>
    </main>
  );
}
