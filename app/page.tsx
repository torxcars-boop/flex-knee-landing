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
  FolderOpen,
  Search,
  Sparkles,
  X,
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

type AISearchResult = {
  productIds: string[];
  answer: string;
};

const translations = {
  ar: {
    store: "NEXORA",
    admin: "لوحة التحكم",
    cart: "السلة",
    heroLabel: "تسوق بثقة",
    heroTitle: "منتجات مختارة",
    heroTitleMuted: "مصممة لتناسب احتياجاتك.",
    heroDescription:
      "اكتشف مجموعة المنتجات المتاحة في متجرنا، وتصفح الأقسام والمنتجات واختر ما يناسبك بسهولة.",
    categoriesLabel: "الأقسام",
    categoriesTitle: "تصفح الأقسام",
    productsLabel: "المنتجات",
    latestProducts: "أحدث المنتجات",
    productCount: "منتج",
    categoryCount: "قسم",
    noCategories: "لا توجد أقسام حاليًا",
    categoriesError: "تعذر تحميل الأقسام",
    noProducts: "لا توجد منتجات حاليًا",
    noProductsDescription:
      "ستظهر المنتجات هنا تلقائيًا بمجرد إضافتها من لوحة التحكم.",
    noImage: "لا توجد صورة",
    details: "التفاصيل",
    egp: "جنيه",
    outOfStock: "غير متوفر",
    language: "English",
    loading: "جاري التحميل...",
    viewProducts: "عرض المنتجات",
    searchPlaceholder:
      "اسأل الذكاء الاصطناعي عن المنتج الذي تبحث عنه...",
    searchDescription:
      "اكتب ما تبحث عنه، ودع الذكاء الاصطناعي يساعدك في العثور على المنتج المناسب.",
    searchButton: "بحث ذكي",
    searching: "جاري البحث...",
    searchExample:
      'مثال: "عايز حاجة للركبة أقل من 500 جنيه"',
    searchClose: "إغلاق",
    searchNoResults:
      "لم أجد منتجًا مناسبًا لطلبك داخل المتجر.",
    searchError:
      "تعذر تشغيل البحث الذكي حاليًا. حاول مرة أخرى.",
    footer:
      "جميع الحقوق محفوظة. متجر NEXORA الإلكتروني الاحترافي.",
  },

  en: {
    store: "NEXORA",
    admin: "Admin",
    cart: "Cart",
    heroLabel: "SHOP WITH CONFIDENCE",
    heroTitle: "Curated products",
    heroTitleMuted: "made for your needs.",
    heroDescription:
      "Explore our categories and products, view details and prices, and choose what works best for you.",
    categoriesLabel: "CATEGORIES",
    categoriesTitle: "Browse categories",
    productsLabel: "PRODUCTS",
    latestProducts: "Latest products",
    productCount: "products",
    categoryCount: "categories",
    noCategories: "No categories available",
    categoriesError: "Could not load categories",
    noProducts: "No products available",
    noProductsDescription:
      "Products will appear here automatically once they are added from the admin dashboard.",
    noImage: "No image",
    details: "View details",
    egp: "EGP",
    outOfStock: "Out of stock",
    language: "العربية",
    loading: "Loading...",
    viewProducts: "View products",
    searchPlaceholder:
      "Ask AI about the product you are looking for...",
    searchDescription:
      "Describe what you need and let AI help you find the right product.",
    searchButton: "Smart Search",
    searching: "Searching...",
    searchExample:
      'Example: "I need something for my knee under 500 EGP"',
    searchClose: "Close",
    searchNoResults:
      "I couldn't find a suitable product in the store.",
    searchError:
      "Smart search is temporarily unavailable. Please try again.",
    footer:
      "All rights reserved. NEXORA is a professional multilingual online store.",
  },
};

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ar");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState(false);

  const [aiSearching, setAiSearching] =
    useState(false);

  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiError, setAiError] = useState("");
  const [showAISearch, setShowAISearch] =
    useState(false);

  const t = translations[language];
  const isArabic = language === "ar";

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem("store-language");

    if (
      savedLanguage === "ar" ||
      savedLanguage === "en"
    ) {
      window.setTimeout(() => {
        setLanguage(savedLanguage);
      }, 0);
    }
  }, []);

  async function loadCategories() {
    setCategoriesLoading(true);
    setCategoriesError(false);

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id,name_ar,name_en,slug,description_ar,description_en,image_url"
      )
      .order("name_ar", {
        ascending: true,
      });

    if (error) {
      console.error("Categories error:", error);
      setCategories([]);
      setCategoriesError(true);
    } else {
      setCategories((data || []) as Category[]);
    }

    setCategoriesLoading(false);
  }

  async function loadProducts() {
    setProductsLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,description,price,old_price,category,category_id,image_url,stock"
      )
      .eq("active", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Products error:", error);
      setProducts([]);
    } else {
      setProducts((data || []) as Product[]);
    }

    setProductsLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories();
      void loadProducts();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  function changeLanguage() {
    const nextLanguage: Language =
      language === "ar" ? "en" : "ar";

    setLanguage(nextLanguage);

    window.localStorage.setItem(
      "store-language",
      nextLanguage
    );
  }

  function getCategoryName(
    categoryId: string | null,
    fallback: string | null
  ) {
    if (!categoryId) {
      return fallback;
    }

    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (!category) {
      return fallback;
    }

    return isArabic
      ? category.name_ar
      : category.name_en;
  }

  function getCategoryDescription(
    category: Category
  ) {
    return isArabic
      ? category.description_ar
      : category.description_en;
  }

  function openAISearch() {
    setAiError("");
    setAiAnswer("");
    setAiResults([]);
    setShowAISearch(true);
  }

  function closeAISearch() {
    if (aiSearching) {
      return;
    }

    setShowAISearch(false);
  }

  async function runAISearch() {
    const query = aiQuery.trim();

    if (!query || aiSearching) {
      return;
    }

    setAiSearching(true);
    setAiError("");
    setAiAnswer("");
    setAiResults([]);

    try {
      const response = await fetch(
        "/api/ai-search",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            query,
            language,
          }),
        }
      );

      const data =
        (await response.json()) as Partial<AISearchResult> & {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.error || t.searchError
        );
      }

      const productIds =
        Array.isArray(data.productIds)
          ? data.productIds.filter(
              (id): id is string =>
                typeof id === "string"
            )
          : [];

      const answer =
        typeof data.answer === "string"
          ? data.answer
          : "";

      setAiResults(productIds);

      setAiAnswer(
        answer || t.searchNoResults
      );
    } catch (error) {
      console.error(
        "AI SEARCH CLIENT ERROR:",
        error
      );

      setAiError(t.searchError);
      setAiResults([]);
      setAiAnswer("");
    } finally {
      setAiSearching(false);
    }
  }

  const aiProducts = aiResults
    .map((id) =>
      products.find(
        (product) => product.id === id
      )
    )
    .filter(
      (product): product is Product =>
        Boolean(product)
    );

  return (
    <>
      <main
        dir={isArabic ? "rtl" : "ltr"}
        lang={language}
        className="min-h-screen overflow-hidden bg-[#050505] text-white"
      >
        {/* BACKGROUND */}

        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-[#b6ff00]/10 blur-[170px] animate-pulse-slow" />

          <div className="absolute bottom-[-300px] right-[-150px] h-[500px] w-[500px] rounded-full bg-[#b6ff00]/[0.04] blur-[140px] animate-float-slow" />

          <div className="absolute left-[-200px] top-[45%] h-[350px] w-[350px] rounded-full bg-white/[0.025] blur-[130px] animate-float-reverse" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_75%)]" />
        </div>

        {/* HEADER */}

        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl animate-header">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#b6ff00] text-xl font-black text-black transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="relative z-10">
                  N
                </span>

                <span className="absolute inset-0 rounded-xl bg-[#b6ff00] opacity-40 blur-md transition group-hover:opacity-70" />
              </div>

              <div>
                <div className="text-lg font-black tracking-tight">
                  {t.store}
                </div>

                <div className="text-[10px] font-medium tracking-[0.15em] text-white/30">
                  PREMIUM STORE
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={changeLanguage}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-bold text-white/60 transition duration-300 hover:border-[#b6ff00]/30 hover:bg-[#b6ff00]/5 hover:text-white"
              >
                <Globe2 size={16} />

                <span className="hidden sm:inline">
                  {t.language}
                </span>
              </button>

              <Link
                href="/admin"
                className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/50 transition duration-300 hover:border-[#b6ff00]/30 hover:text-white sm:block"
              >
                {t.admin}
              </Link>

              <Link
                href="/cart"
                className="group relative flex items-center gap-2 rounded-xl bg-[#b6ff00] px-3 py-2.5 text-sm font-black text-black transition duration-300 hover:scale-105 sm:px-4"
              >
                <ShoppingCart
                  size={17}
                  className="transition group-hover:rotate-[-8deg]"
                />

                <span>{t.cart}</span>

                <span className="absolute inset-0 rounded-xl bg-[#b6ff00] opacity-0 blur-md transition group-hover:opacity-40" />
              </Link>
            </div>
          </div>
        </header>

        {/* HERO */}

        <section className="relative z-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#b6ff00]/10 blur-[150px] animate-hero-glow" />

            <div className="absolute bottom-[-250px] right-[-100px] h-[400px] w-[400px] rounded-full bg-white/[0.03] blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
            <div className="max-w-4xl">
              {/* LABEL */}

              <div className="mb-5 flex items-center gap-3 animate-fade-up animation-delay-100">
                <span className="h-px w-8 bg-[#b6ff00] animate-line-grow" />

                <span className="text-xs font-black tracking-[0.2em] text-[#b6ff00]">
                  {t.heroLabel}
                </span>
              </div>

              {/* TITLE */}

              <h1 className="animate-fade-up animation-delay-200 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
                {t.heroTitle}

                <br />

                <span className="text-white/30">
                  {t.heroTitleMuted}
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-7 max-w-2xl animate-fade-up animation-delay-300 text-sm leading-8 text-white/45 sm:text-lg sm:leading-9">
                {t.heroDescription}
              </p>

              {/* AI SEARCH */}

              <div className="mt-10 max-w-3xl animate-fade-up animation-delay-400">
                <div className="group relative rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-2 shadow-2xl backdrop-blur-xl transition duration-500 hover:border-[#b6ff00]/20">
                  <div className="pointer-events-none absolute -inset-px rounded-[1.75rem] bg-gradient-to-r from-[#b6ff00]/0 via-[#b6ff00]/10 to-[#b6ff00]/0 opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />

                  <div className="relative flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Search
                        size={19}
                        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/30 ${
                          isArabic
                            ? "right-4"
                            : "left-4"
                        }`}
                      />

                      <input
                        type="text"
                        value={aiQuery}
                        onChange={(event) =>
                          setAiQuery(
                            event.target.value
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            void runAISearch();
                          }
                        }}
                        placeholder={
                          t.searchPlaceholder
                        }
                        className={`h-[58px] w-full rounded-[1.4rem] border border-white/10 bg-black/30 text-sm text-white outline-none transition focus:border-[#b6ff00]/40 ${
                          isArabic
                            ? "pr-12 pl-4"
                            : "pl-12 pr-4"
                        }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void runAISearch()
                      }
                      disabled={
                        aiSearching ||
                        !aiQuery.trim()
                      }
                      className="relative inline-flex min-h-[58px] items-center justify-center gap-2 overflow-hidden rounded-[1.4rem] bg-[#b6ff00] px-6 text-sm font-black text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(182,255,0,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {aiSearching ? (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Sparkles size={18} />
                        )}

                        <span>
                          {aiSearching
                            ? t.searching
                            : t.searchButton}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 px-2 text-xs text-white/25">
                  <Sparkles
                    size={13}
                    className="text-[#b6ff00]"
                  />

                  <span>
                    {t.searchExample}
                  </span>
                </div>
              </div>

              {/* HERO BUTTONS */}

              <div className="mt-7 flex flex-wrap gap-3 animate-fade-up animation-delay-500">
                <Link
                  href="#categories"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-[#b6ff00] px-6 py-4 text-sm font-black text-black transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(182,255,0,0.15)]"
                >
                  {t.categoriesTitle}

                  {isArabic ? (
                    <ArrowLeft
                      size={18}
                      className="transition group-hover:-translate-x-1"
                    />
                  ) : (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </Link>

                <Link
                  href="#products"
                  className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-black text-white transition duration-300 hover:-translate-y-1 hover:border-[#b6ff00]/30"
                >
                  {t.latestProducts}
                </Link>
              </div>

              {/* AI RESPONSE */}

              {(aiAnswer ||
                aiError ||
                aiSearching) && (
                <div className="mt-6 max-w-3xl animate-fade-up">
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] p-5">
                    {aiSearching && (
                      <div className="flex items-center gap-3 text-sm text-white/50">
                        <Loader2
                          size={18}
                          className="animate-spin text-[#b6ff00]"
                        />

                        <span>
                          {t.searching}
                        </span>
                      </div>
                    )}

                    {!aiSearching &&
                      aiError && (
                        <div className="text-sm font-bold text-red-300">
                          {aiError}
                        </div>
                      )}

                    {!aiSearching &&
                      !aiError &&
                      aiAnswer && (
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Sparkles
                              size={16}
                              className="text-[#b6ff00]"
                            />

                            <span className="text-xs font-black uppercase tracking-wider text-[#b6ff00]">
                              AI Search
                            </span>
                          </div>

                          <p className="text-sm leading-7 text-white/65">
                            {aiAnswer}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AI RESULTS */}

        {aiResults.length > 0 && (
          <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 animate-fade-up">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 text-[11px] font-black tracking-[0.2em] text-[#b6ff00]">
                  AI RESULTS
                </div>

                <h2 className="text-3xl font-black sm:text-4xl">
                  {isArabic
                    ? "المنتجات المناسبة لك"
                    : "Products matched for you"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAiResults([]);
                  setAiAnswer("");
                  setAiQuery("");
                }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white/40 transition hover:border-[#b6ff00]/30 hover:text-white"
                aria-label={t.searchClose}
              >
                <X size={17} />
              </button>
            </div>

            {aiProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-20 text-center">
                <Package
                  size={38}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-5 text-xl font-black">
                  {t.searchNoResults}
                </h3>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {aiProducts.map(
                  (product, index) => {
                    const outOfStock =
                      product.stock <= 0;

                    const categoryName =
                      getCategoryName(
                        product.category_id,
                        product.category
                      );

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                        className="group animate-card-in overflow-hidden rounded-[1.75rem] border border-[#b6ff00]/20 bg-[#0a0a0a] transition duration-500 hover:-translate-y-2 hover:border-[#b6ff00]/50 hover:shadow-[0_20px_60px_rgba(182,255,0,0.08)]"
                      >
                        <ProductCardImage
                          product={product}
                          outOfStock={outOfStock}
                          noImage={t.noImage}
                          outOfStockText={
                            t.outOfStock
                          }
                        />

                        <div className="p-5 sm:p-6">
                          {categoryName && (
                            <div className="text-[11px] font-black tracking-wide text-[#b6ff00]">
                              {categoryName}
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

                          <ProductPrice
                            product={product}
                            isArabic={isArabic}
                            currency={t.egp}
                            details={t.details}
                            arrow={
                              isArabic ? (
                                <ArrowLeft size={14} />
                              ) : (
                                <ArrowRight size={14} />
                              )
                            }
                          />
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* CATEGORIES */}

        <section
          id="categories"
          className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
        >
          <SectionHeading
            label={t.categoriesLabel}
            title={t.categoriesTitle}
            count={categories.length}
            countText={t.categoryCount}
          />

          {categoriesLoading ? (
            <LoadingBox text={t.loading} />
          ) : categoriesError ? (
            <div className="rounded-[2rem] border border-red-500/30 bg-red-500/[0.04] px-6 py-20 text-center">
              <FolderOpen
                size={40}
                className="mx-auto text-red-400"
              />

              <h3 className="mt-5 text-xl font-black text-red-300">
                {t.categoriesError}
              </h3>

              <p className="mt-3 text-sm text-white/30">
                {isArabic
                  ? "افتح Console في المتصفح لمعرفة سبب الخطأ."
                  : "Open the browser console to see the exact database error."}
              </p>
            </div>
          ) : categories.length === 0 ? (
            <EmptyBox
              icon={
                <FolderOpen
                  size={40}
                  className="mx-auto text-white/20"
                />
              }
              title={t.noCategories}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map(
                (category, index) => {
                  const description =
                    getCategoryDescription(
                      category
                    );

                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      style={{
                        animationDelay: `${index * 90}ms`,
                      }}
                      className="group animate-card-in overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] transition duration-500 hover:-translate-y-2 hover:border-[#b6ff00]/40 hover:shadow-[0_20px_60px_rgba(182,255,0,0.06)]"
                    >
                      <div className="relative aspect-[1.25] overflow-hidden bg-[#080808]">
                        {category.image_url ? (
                          <img
                            src={
                              category.image_url
                            }
                            alt={
                              isArabic
                                ? category.name_ar
                                : category.name_en
                            }
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b6ff00]/10">
                              <FolderOpen
                                size={30}
                                className="text-[#b6ff00]"
                              />
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-flex rounded-full border border-[#b6ff00]/20 bg-black/60 px-3 py-1.5 text-[10px] font-black text-[#b6ff00] backdrop-blur">
                            {t.viewProducts}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-black transition group-hover:text-[#b6ff00]">
                          {isArabic
                            ? category.name_ar
                            : category.name_en}
                        </h3>

                        {description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/35">
                            {description}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-xs text-white/25">
                            #{category.slug}
                          </span>

                          {isArabic ? (
                            <ArrowLeft
                              size={17}
                              className="text-[#b6ff00] transition group-hover:-translate-x-1"
                            />
                          ) : (
                            <ArrowRight
                              size={17}
                              className="text-[#b6ff00] transition group-hover:translate-x-1"
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* PRODUCTS */}

        <section
          id="products"
          className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
        >
          <SectionHeading
            label={t.productsLabel}
            title={t.latestProducts}
            count={products.length}
            countText={t.productCount}
          />

          {productsLoading ? (
            <LoadingBox text={t.loading} />
          ) : products.length === 0 ? (
            <EmptyBox
              icon={
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <Package
                    size={32}
                    className="text-white/20"
                  />
                </div>
              }
              title={t.noProducts}
              description={
                t.noProductsDescription
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(
                (product, index) => {
                  const outOfStock =
                    product.stock <= 0;

                  const categoryName =
                    getCategoryName(
                      product.category_id,
                      product.category
                    );

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      style={{
                        animationDelay: `${index * 90}ms`,
                      }}
                      className="group animate-card-in overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] transition duration-500 hover:-translate-y-2 hover:border-[#b6ff00]/40 hover:shadow-[0_20px_60px_rgba(182,255,0,0.06)]"
                    >
                      <ProductCardImage
                        product={product}
                        outOfStock={outOfStock}
                        noImage={t.noImage}
                        outOfStockText={
                          t.outOfStock
                        }
                      />

                      <div className="p-5 sm:p-6">
                        {categoryName && (
                          <div className="text-[11px] font-black tracking-wide text-[#b6ff00]">
                            {categoryName}
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

                        <ProductPrice
                          product={product}
                          isArabic={isArabic}
                          currency={t.egp}
                          details={t.details}
                          arrow={
                            isArabic ? (
                              <ArrowLeft size={14} />
                            ) : (
                              <ArrowRight size={14} />
                            )
                          }
                        />
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* FOOTER */}

        <footer className="relative z-10 border-t border-white/10">
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

      {/* AI SEARCH FLOATING BUTTON */}

      {!showAISearch && (
        <button
          type="button"
          onClick={openAISearch}
          className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b6ff00] text-black shadow-[0_10px_40px_rgba(182,255,0,0.2)] transition duration-300 hover:scale-110 sm:bottom-7 sm:right-7"
          aria-label="AI Search"
        >
          <Sparkles
            size={23}
            className="animate-sparkle"
          />
        </button>
      )}

      {/* AI SEARCH MODAL */}

      {showAISearch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-modal-bg">
          <div className="relative w-full max-w-2xl animate-modal-in rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={closeAISearch}
              disabled={aiSearching}
              className="absolute right-4 top-4 rounded-xl border border-white/10 p-2 text-white/40 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              <X size={18} />
            </button>

            <div className="mb-6 pr-10">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles
                  size={18}
                  className="text-[#b6ff00]"
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#b6ff00]">
                  AI SEARCH
                </span>
              </div>

              <h2 className="text-2xl font-black sm:text-3xl">
                {isArabic
                  ? "ابحث عن أي منتج"
                  : "Find any product"}
              </h2>

              <p className="mt-2 text-sm leading-7 text-white/40">
                {t.searchDescription}
              </p>
            </div>

            <div className="relative">
              <Search
                size={19}
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/30 ${
                  isArabic
                    ? "right-4"
                    : "left-4"
                }`}
              />

              <input
                autoFocus
                type="text"
                value={aiQuery}
                onChange={(event) =>
                  setAiQuery(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    void runAISearch();
                  }
                }}
                placeholder={
                  t.searchPlaceholder
                }
                className={`h-[60px] w-full rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white outline-none transition focus:border-[#b6ff00]/40 ${
                  isArabic
                    ? "pr-12 pl-4"
                    : "pl-12 pr-4"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                void runAISearch()
              }
              disabled={
                aiSearching ||
                !aiQuery.trim()
              }
              className="mt-3 flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-[#b6ff00] text-sm font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {aiSearching ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Sparkles size={18} />
              )}

              {aiSearching
                ? t.searching
                : t.searchButton}
            </button>

            {aiError && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm font-bold text-red-300">
                {aiError}
              </div>
            )}

            {aiAnswer && !aiError && (
              <div className="mt-4 rounded-2xl border border-[#b6ff00]/10 bg-[#b6ff00]/[0.03] p-4">
                <div className="flex items-center gap-2 text-xs font-black text-[#b6ff00]">
                  <Sparkles size={14} />
                  AI SEARCH
                </div>

                <p className="mt-2 text-sm leading-7 text-white/60">
                  {aiAnswer}
                </p>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-white/20">
              {t.searchExample}
            </p>
          </div>
        </div>
      )}

      {/* ANIMATION CSS */}

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(35px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalBg {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes headerIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lineGrow {
          from {
            width: 0;
            opacity: 0;
          }

          to {
            width: 32px;
            opacity: 1;
          }
        }

        @keyframes heroGlow {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.7;
          }

          50% {
            transform: translateX(-50%) scale(1.12);
            opacity: 1;
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-25px, -30px, 0);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(30px, 25px, 0);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(12deg) scale(1.12);
          }
        }

        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.8s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .animate-card-in {
          opacity: 0;
          animation: cardIn 0.7s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .animate-modal-in {
          animation: modalIn 0.35s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .animate-modal-bg {
          animation: modalBg 0.25s ease-out
            forwards;
        }

        .animate-header {
          animation: headerIn 0.6s ease-out
            forwards;
        }

        .animate-line-grow {
          animation: lineGrow 0.8s ease-out
            forwards;
        }

        .animate-hero-glow {
          animation: heroGlow 7s ease-in-out
            infinite;
        }

        .animate-float-slow {
          animation: floatSlow 10s ease-in-out
            infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 12s ease-in-out
            infinite;
        }

        .animate-sparkle {
          animation: sparkle 2.5s ease-in-out
            infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}

/* -------------------------------- */
/* SECTION HEADING */
/* -------------------------------- */

function SectionHeading({
  label,
  title,
  count,
  countText,
}: {
  label: string;
  title: string;
  count: number;
  countText: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="animate-fade-up">
        <div className="mb-2 text-[11px] font-black tracking-[0.2em] text-[#b6ff00]">
          {label}
        </div>

        <h2 className="text-3xl font-black sm:text-4xl">
          {title}
        </h2>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/40">
        {count} {countText}
      </div>
    </div>
  );
}

/* -------------------------------- */
/* LOADING */
/* -------------------------------- */

function LoadingBox({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
      <div className="text-center">
        <Loader2
          size={32}
          className="mx-auto animate-spin text-[#b6ff00]"
        />

        <p className="mt-4 text-sm text-white/30">
          {text}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* EMPTY BOX */
/* -------------------------------- */

function EmptyBox({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-24 text-center">
      {icon}

      <h3 className="mt-6 text-xl font-black">
        {title}
      </h3>

      {description && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- */
/* PRODUCT IMAGE */
/* -------------------------------- */

function ProductCardImage({
  product,
  outOfStock,
  noImage,
  outOfStockText,
}: {
  product: Product;
  outOfStock: boolean;
  noImage: string;
  outOfStockText: string;
}) {
  return (
    <div className="relative aspect-square overflow-hidden bg-[#080808]">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white/20">
            <Package
              size={32}
              className="mx-auto mb-3"
            />

            <span className="text-xs">
              {noImage}
            </span>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      {outOfStock && (
        <div className="absolute inset-x-4 top-4">
          <span className="inline-flex rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white/60 backdrop-blur">
            {outOfStockText}
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- */
/* PRODUCT PRICE */
/* -------------------------------- */

function ProductPrice({
  product,
  isArabic,
  currency,
  details,
  arrow,
}: {
  product: Product;
  isArabic: boolean;
  currency: string;
  details: string;
  arrow: React.ReactNode;
}) {
  return (
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
            {currency}
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
              {currency}
            </span>
          )}
      </div>

      <span className="flex items-center gap-1.5 text-xs font-black text-white/35 transition group-hover:text-white">
        {details}
        {arrow}
      </span>
    </div>
  );
}
