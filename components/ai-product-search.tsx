"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Loader2,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";

type SearchProduct = {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  image_url: string | null;
};

type Props = {
  language: "ar" | "en";
};

export function AIProductSearch({
  language,
}: Props) {
  const isArabic = language === "ar";

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [products, setProducts] = useState<
    SearchProduct[]
  >([]);
  const [error, setError] = useState("");

  async function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setProducts([]);

    try {
      const response = await fetch(
        "/api/ai-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: cleanQuery,
            language,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : isArabic
              ? "حدث خطأ أثناء البحث."
              : "Something went wrong."
        );
      }

      setAnswer(result.answer || "");

      const ids = Array.isArray(result.productIds)
        ? result.productIds
        : [];

      if (ids.length === 0) {
        return;
      }

      const productsResponse = await fetch(
        `/api/ai-search/products?ids=${encodeURIComponent(
          ids.join(",")
        )}`
      );

      if (!productsResponse.ok) {
        throw new Error(
          isArabic
            ? "تعذر تحميل المنتجات."
            : "Could not load products."
        );
      }

      const productsResult =
        await productsResponse.json();

      setProducts(
        Array.isArray(productsResult.products)
          ? productsResult.products
          : []
      );
    } catch (searchError) {
      console.error(
        "AI SEARCH UI ERROR:",
        searchError
      );

      setError(
        searchError instanceof Error
          ? searchError.message
          : isArabic
            ? "حدث خطأ أثناء البحث."
            : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setAnswer("");
    setProducts([]);
    setError("");
  }

  return (
    <section
      id="ai-search"
      className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#b6ff00]/10 blur-[100px]" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b6ff00]/10 text-[#b6ff00]">
              <Sparkles size={19} />
            </div>

            <div>
              <div className="text-[10px] font-black tracking-[0.2em] text-[#b6ff00]">
                {isArabic
                  ? "AI SMART SEARCH"
                  : "AI SMART SEARCH"}
              </div>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                {isArabic
                  ? "ابحث بطريقة طبيعية"
                  : "Search naturally"}
              </h2>
            </div>
          </div>

          <p className="mb-5 max-w-2xl text-sm leading-7 text-white/40">
            {isArabic
              ? "اكتب ما تريده بطريقتك، والذكاء الاصطناعي سيساعدك في العثور على المنتجات المناسبة."
              : "Describe what you need in your own words and AI will help you find matching products."}
          </p>

          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className={`absolute top-1/2 -translate-y-1/2 text-white/30 ${
                    isArabic
                      ? "right-5"
                      : "left-5"
                  }`}
                />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  disabled={loading}
                  dir={isArabic ? "rtl" : "ltr"}
                  placeholder={
                    isArabic
                      ? "مثال: عاوز منتج للركبة أقل من 500 جنيه..."
                      : "Example: I need a knee product under 500 EGP..."
                  }
                  className={`h-14 w-full rounded-2xl border border-white/10 bg-black/60 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#b6ff00]/50 focus:ring-2 focus:ring-[#b6ff00]/10 ${
                    isArabic
                      ? "pl-12 pr-14"
                      : "pl-14 pr-12"
                  }`}
                />

                {query && !loading && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label={
                      isArabic
                        ? "مسح البحث"
                        : "Clear search"
                    }
                    className={`absolute top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white ${
                      isArabic
                        ? "left-5"
                        : "right-5"
                    }`}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading || !query.trim()
                }
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#b6ff00] px-7 text-sm font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles size={18} />
                )}

                {loading
                  ? isArabic
                    ? "جاري البحث..."
                    : "Searching..."
                  : isArabic
                    ? "ابحث بالذكاء الاصطناعي"
                    : "AI Search"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {answer && !error && (
            <div
              className="mt-5 rounded-2xl border border-[#b6ff00]/10 bg-[#b6ff00]/[0.04] p-4 text-sm leading-7 text-white/70"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <div className="mb-1 flex items-center gap-2 font-black text-[#b6ff00]">
                <Sparkles size={15} />
                {isArabic
                  ? "اقتراح الذكاء الاصطناعي"
                  : "AI recommendation"}
              </div>

              {answer}
            </div>
          )}

          {products.length > 0 && (
            <div
              className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              dir={isArabic ? "rtl" : "ltr"}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition hover:-translate-y-1 hover:border-[#b6ff00]/30"
                >
                  <div className="aspect-[1.2] overflow-hidden bg-[#070707]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20">
                        <Search size={28} />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 font-black">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-black text-[#b6ff00]">
                        {Number(
                          product.price
                        ).toLocaleString(
                          isArabic
                            ? "ar-EG"
                            : "en-EG"
                        )}{" "}
                        {isArabic
                          ? "جنيه"
                          : "EGP"}
                      </span>

                      {isArabic ? (
                        <ArrowLeft
                          size={17}
                          className="text-white/30 transition group-hover:-translate-x-1 group-hover:text-[#b6ff00]"
                        />
                      ) : (
                        <ArrowRight
                          size={17}
                          className="text-white/30 transition group-hover:translate-x-1 group-hover:text-[#b6ff00]"
                        />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
