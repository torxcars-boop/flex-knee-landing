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
    store: "المتجر",
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
    allProducts: "كل المنتجات",

    searchPlaceholder:
      "اسأل الذكاء الاصطناعي عن المنتج الذي تبحث عنه...",

    searchButton: "بحث ذكي",
    searching: "جاري البحث...",
    searchTitle: "ابحث عن المنتج بطريقة ذكية",
    searchDescription:
      "اكتب احتياجك أو ميزانيتك وسأبحث لك داخل منتجات المتجر.",
    searchExample:
      'مثال: "عايز حاجة للركبة أقل من 500 جنيه"',
    searchClose: "إغلاق",

    searchNoResults:
      "لم أجد منتجًا مناسبًا لطلبك داخل المتجر.",

    searchError:
      "تعذر تشغيل البحث الذكي حاليًا. حاول مرة أخرى.",

    footer:
      "جميع الحقوق محفوظة. متجر إلكتروني احترافي متعدد اللغات.",
  },

  en: {
    store: "Store",
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
    allProducts: "All products",

    searchPlaceholder:
      "Ask AI about the product you are looking for...",

    searchButton: "Smart Search",
    searching: "Searching...",
    searchTitle: "Find products intelligently",
    searchDescription:
      "Describe what you need or your budget and I'll search the store catalog.",
    searchExample:
      'Example: "I need something for my knee under 500 EGP"',
    searchClose: "Close",

    searchNoResults:
      "I couldn't find a suitable product in the store.",

    searchError:
      "Smart search is temporarily unavailable. Please try again.",

    footer:
      "All rights reserved. A professional multilingual online store.",
  },
};

export default function HomePage() {
  /*
   * مهم جدًا:
   *
   * اللغة تبدأ دائمًا بـ ar أثناء أول render.
   * بعد hydration نقرأ localStorage.
   *
   * بهذه الطريقة لا يحدث اختلاف بين HTML السيرفر
   * وHTML أول render على العميل.
   */
  const [language, setLanguage] = useState<Language>("ar");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState(false);

  /*
   * AI SEARCH
   *
   * مهم:
   * يبدأ false دائمًا.
   * لا نستخدم window/localStorage هنا.
   * هذا يمنع hydration mismatch.
   */
  const [aiSearching, setAiSearching] = useState(false);

  const [aiQuery, setAiQuery] = useState("");

  const [aiAnswer, setAiAnswer] = useState("");

  const [aiResults, setAiResults] = useState<string[]>(
    []
  );

  const [aiError, setAiError] = useState("");

  const [showAISearch, setShowAISearch] =
    useState(false);

  const t = translations[language];

  const isArabic = language === "ar";

  /*
   * بعد تركيب الصفحة نقرأ اللغة المحفوظة.
   */
  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem("store-language");

    if (
      savedLanguage === "ar" ||
      savedLanguage === "en"
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  /*
   * تحميل الأقسام.
   */
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
      console.error("Categories error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setCategories([]);
      setCategoriesError(true);
    } else {
      setCategories(
        (data || []) as Category[]
      );
    }

    setCategoriesLoading(false);
  }

  /*
   * تحميل المنتجات.
   */
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
      console.error("Products error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setProducts([]);
    } else {
      setProducts(
        (data || []) as Product[]
      );
    }

    setProductsLoading(false);
  }

  /*
   * تحميل البيانات.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories();
      void loadProducts();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /*
   * تغيير اللغة.
   */
  function changeLanguage() {
    const nextLanguage: Language =
      language === "ar" ? "en" : "ar";

    setLanguage(nextLanguage);

    window.localStorage.setItem(
      "store-language",
      nextLanguage
    );
  }

  /*
   * اسم القسم.
   */
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

  /*
   * وصف القسم.
   */
  function getCategoryDescription(
    category: Category
  ) {
    return isArabic
      ? category.description_ar
      : category.description_en;
  }

  /*
   * فتح AI Search.
   */
  function openAISearch() {
    setAiError("");
    setAiAnswer("");
    setAiResults([]);
    setShowAISearch(true);
  }

  /*
   * إغلاق AI Search.
   */
  function closeAISearch() {
    if (aiSearching) {
      return;
    }

    setShowAISearch(false);
  }

  /*
   * تنفيذ AI Search.
   */
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
          data.error ||
            t.searchError
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

  /*
   * المنتجات التي وجدها AI.
   *
   * نعيد ترتيب المنتجات طبقًا للـ IDs
   * التي رجعها الذكاء الاصطناعي.
   */
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
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      className="min-h-screen bg-[#050505] text-white"
    >
      {/* HEADER */}

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
            {/* LANGUAGE */}

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

            {/* ADMIN */}

            <Link
              href="/admin"
              className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/50 transition hover:border-white/20 hover:text-white sm:block"
            >
              {t.admin}
            </Link>

            {/* CART */}

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

      {/* HERO */}

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

            {/* AI SEARCH */}

            <div className="mt-10 max-w-3xl">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-2 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-2 sm:flex-row">
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
                          event.key === "Enter"
                        ) {
                          void runAISearch();
                        }
                      }}
                      placeholder={
                        t.searchPlaceholder
                      }
                      className={`h-[58px] w-full rounded-[1.4rem] border border-white/10 bg-black/30 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#b6ff00]/40 ${
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
                    disabled={aiSearching}
                    className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-[1.4rem] bg-[#b6ff00] px-6 text-sm font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                  >
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

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#categories"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#b6ff00] px-6 py-4 text-sm font-black text-black transition hover:scale-[1.02]"
              >
                {t.categoriesTitle}

                {isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </Link>

              <Link
                href="#products"
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-black text-white transition hover:border-white/20"
              >
                {t.latestProducts}
              </Link>
            </div>

            {/* AI RESPONSE */}

            {(aiAnswer ||
              aiError ||
              aiSearching) && (
              <div className="mt-6 max-w-3xl">
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
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
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
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white/40 transition hover:border-white/20 hover:text-white"
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
              {aiProducts.map((product) => {
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
                    className="group overflow-hidden rounded-[1.75rem] border border-[#b6ff00]/20 bg-[#0a0a0a] transition duration-300 hover:-translate-y-1 hover:border-[#b6ff00]/50 hover:shadow-2xl"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#080808]">
                      {product.image_url ? (
                        <img
                          src={
                            product.image_url
                          }
                          alt={
                            product.name
                          }
                          loading="lazy"
                          className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={32}
                            className="text-white/20"
                          />
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
                          {
                            product.description
                          }
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
        </section>
      )}

      {/* CATEGORIES */}

      <section
        id="categories"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-[11px] font-black tracking-[0.2em] text-[#b6ff00]">
              {t.categoriesLabel}
            </div>

            <h2 className="text-3xl font-black sm:text-4xl">
              {t.categoriesTitle}
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/40">
            {categories.length}{" "}
            {t.categoryCount}
          </div>
        </div>

        {categoriesLoading ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-[#b6ff00]"
              />

              <p className="mt-4 text-sm text-white/30">
                {t.loading}
              </p>
            </div>
          </div>
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
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-20 text-center">
            <FolderOpen
              size={40}
              className="mx-auto text-white/20"
            />

            <h3 className="mt-5 text-xl font-black">
              {t.noCategories}
            </h3>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map(
              (category) => {
                const description =
                  getCategoryDescription(
                    category
                  );

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] transition duration-300 hover:-translate-y-1 hover:border-[#b6ff00]/40 hover:shadow-2xl"
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
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
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
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
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

        {productsLoading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-[#b6ff00]"
              />

              <p className="mt-4 text-sm text-white/30">
                {t.loading}
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

              const categoryName =
                getCategoryName(
                  product.category_id,
                  product.category
                );

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#080808]">
                    {product.image_url ? (
                      <img
                        src={
                          product.image_url
                        }
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
                          <ArrowLeft size={14} />
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
