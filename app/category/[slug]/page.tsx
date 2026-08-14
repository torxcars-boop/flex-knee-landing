"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  Loader2,
  Package,
  ShoppingCart,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Language = "ar" | "en";

type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  category_id: string | null;
  image_url: string | null;
  stock: number;
};

const translations = {
  ar: {
    store: "المتجر",
    admin: "لوحة التحكم",
    cart: "السلة",

    back: "العودة للمتجر",

    loading: "جاري التحميل...",
    categoryNotFound: "القسم غير موجود",
    categoryNotFoundDescription:
      "عذرًا، القسم الذي تبحث عنه غير موجود أو تم حذفه.",

    products: "المنتجات",
    productCount: "منتج",

    noProducts: "لا توجد منتجات في هذا القسم",
    noProductsDescription:
      "ستظهر المنتجات هنا تلقائيًا عند إضافة منتجات لهذا القسم.",

    noImage: "لا توجد صورة",
    details: "التفاصيل",
    egp: "جنيه",
    outOfStock: "غير متوفر",

    error: "حدث خطأ أثناء تحميل البيانات",
    errorDescription:
      "تعذر تحميل بيانات القسم والمنتجات. حاول تحديث الصفحة.",

    language: "English",

    footer:
      "جميع الحقوق محفوظة. متجر إلكتروني احترافي متعدد اللغات.",
  },

  en: {
    store: "Store",
    admin: "Admin",
    cart: "Cart",

    back: "Back to store",

    loading: "Loading...",
    categoryNotFound: "Category not found",
    categoryNotFoundDescription:
      "Sorry, the category you are looking for does not exist or has been removed.",

    products: "Products",
    productCount: "products",

    noProducts: "No products in this category",
    noProductsDescription:
      "Products will appear here automatically once they are added to this category.",

    noImage: "No image",
    details: "View details",
    egp: "EGP",
    outOfStock: "Out of stock",

    error: "Something went wrong while loading the data",
    errorDescription:
      "We couldn't load the category and products. Please refresh the page.",

    language: "العربية",

    footer:
      "All rights reserved. A professional multilingual online store.",
  },
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();

  const slug = params?.slug;

  const [language, setLanguage] =
    useState<Language>("ar");

  const [category, setCategory] =
    useState<Category | null>(null);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const t = translations[language];

  const isArabic = language === "ar";

  function changeLanguage() {
    const nextLanguage: Language =
      language === "ar" ? "en" : "ar";

    setLanguage(nextLanguage);

    localStorage.setItem(
      "store-language",
      nextLanguage
    );
  }

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "store-language"
      ) as Language | null;

    if (
      savedLanguage === "ar" ||
      savedLanguage === "en"
    ) {
      queueMicrotask(() => {
        setLanguage(savedLanguage);
      });
    }
  }, []);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(() => {
      async function loadCategory() {
        setLoading(true);
        setError(false);

        const { data, error: categoryError } =
          await supabase
            .from("categories")
            .select(
              "id,name_ar,name_en,slug,description_ar,description_en,image_url"
            )
            .eq("slug", slug)
            .maybeSingle();

        if (cancelled) {
          return;
        }

        if (categoryError) {
          console.error(
            "Category error:",
            {
              message:
                categoryError.message,
              details:
                categoryError.details,
              hint: categoryError.hint,
              code: categoryError.code,
            }
          );

          setCategory(null);
          setProducts([]);
          setError(true);
          setLoading(false);

          return;
        }

        if (!data) {
          setCategory(null);
          setProducts([]);
          setLoading(false);

          return;
        }

        const currentCategory =
          data as Category;

        setCategory(currentCategory);

        const {
          data: productsData,
          error: productsError,
        } = await supabase
          .from("products")
          .select(
            "id,name,description,price,old_price,category,category_id,image_url,stock"
          )
          .eq("active", true)
          .eq(
            "category_id",
            currentCategory.id
          )
          .order("created_at", {
            ascending: false,
          });

        if (cancelled) {
          return;
        }

        if (productsError) {
          console.error(
            "Category products error:",
            {
              message:
                productsError.message,
              details:
                productsError.details,
              hint: productsError.hint,
              code: productsError.code,
            }
          );

          setProducts([]);
          setError(true);
        } else {
          setProducts(
            (productsData ||
              []) as Product[]
          );
        }

        setLoading(false);
      }

      void loadCategory();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [slug]);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      className="min-h-screen bg-[#050505] text-white"
    >
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/85 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* LOGO */}
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

          {/* ACTIONS */}
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

              <span>{t.cart}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={38}
                className="mx-auto animate-spin text-[#b6ff00]"
              />

              <p className="mt-5 text-sm text-white/30">
                {t.loading}
              </p>
            </div>
          </div>
        ) : error ? (
          /* ERROR */
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-lg rounded-[2rem] border border-red-500/20 bg-red-500/[0.04] px-8 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <Package
                  size={32}
                  className="text-red-400"
                />
              </div>

              <h1 className="mt-6 text-2xl font-black text-red-300">
                {t.error}
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/35">
                {t.errorDescription}
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-3 text-sm font-black text-black transition hover:scale-105"
              >
                {t.back}

                {isArabic ? (
                  <ArrowLeft size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </Link>
            </div>
          </div>
        ) : !category ? (
          /* CATEGORY NOT FOUND */
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-lg rounded-[2rem] border border-white/10 bg-[#0a0a0a] px-8 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                <Package
                  size={32}
                  className="text-white/20"
                />
              </div>

              <h1 className="mt-6 text-2xl font-black">
                {t.categoryNotFound}
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/35">
                {t.categoryNotFoundDescription}
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-3 text-sm font-black text-black transition hover:scale-105"
              >
                {t.back}

                {isArabic ? (
                  <ArrowLeft size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* BACK */}
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/40 transition hover:text-[#b6ff00]"
            >
              {isArabic ? (
                <ArrowRight size={16} />
              ) : (
                <ArrowLeft size={16} />
              )}

              {t.back}
            </Link>

            {/* CATEGORY HERO */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
              {category.image_url && (
                <div className="absolute inset-0">
                  <img
                    src={category.image_url}
                    alt={
                      isArabic
                        ? category.name_ar
                        : category.name_en
                    }
                    className="h-full w-full object-cover opacity-25"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-[#050505]/40" />
                </div>
              )}

              <div className="relative px-6 py-16 sm:px-10 sm:py-20">
                <div className="max-w-3xl">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#b6ff00]" />

                    <span className="text-[11px] font-black tracking-[0.2em] text-[#b6ff00]">
                      {t.products}
                    </span>
                  </div>

                  <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                    {isArabic
                      ? category.name_ar
                      : category.name_en}
                  </h1>

                  {(isArabic
                    ? category.description_ar
                    : category.description_en) && (
                    <p className="mt-5 max-w-2xl text-sm leading-8 text-white/45 sm:text-base">
                      {isArabic
                        ? category.description_ar
                        : category.description_en}
                    </p>
                  )}

                  <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/40">
                    {products.length}{" "}
                    {t.productCount}
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="mt-12">
              {products.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-24 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <Package
                      size={32}
                      className="text-white/20"
                    />
                  </div>

                  <h2 className="mt-6 text-xl font-black">
                    {t.noProducts}
                  </h2>

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
                        {/* IMAGE */}
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

                        {/* INFO */}
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
                                  {Number(
                                    product.price
                                  ).toLocaleString(
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
                                    {Number(
                                      product.old_price
                                    ).toLocaleString(
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
                                <ArrowLeft
                                  size={14}
                                />
                              ) : (
                                <ArrowRight
                                  size={14}
                                />
                              )}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* FOOTER */}
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
