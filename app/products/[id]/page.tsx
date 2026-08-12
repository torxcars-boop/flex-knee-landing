"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
  Loader2,
  Package,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { addToCart, getCart } from "@/lib/cart";

type Product = {
  id: string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;

  description: string | null;
  description_ar: string | null;
  description_en: string | null;

  price: number;
  old_price: number | null;

  category: string | null;
  category_ar: string | null;
  category_en: string | null;

  image_url: string | null;

  sizes: string[] | null;
  features: string[] | null;

  stock: number;
  active: boolean;
};

export default function ProductPage() {
  const params = useParams();

  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  );

  const [added, setAdded] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  /*
   * تحميل المنتج
   */
  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .eq("active", true)
          .single();

        if (error) {
          console.error("PRODUCT LOAD ERROR:", error);
          setProduct(null);
          return;
        }

        if (!data) {
          setProduct(null);
          return;
        }

        const item = data as Product;

        setProduct(item);

        /*
         * لو المنتج له مقاسات،
         * نختار أول مقاس تلقائيًا.
         */
        if (item.sizes && item.sizes.length > 0) {
          setSelectedSize(item.sizes[0]);
        }
      } catch (error) {
        console.error("PRODUCT ERROR:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  /*
   * تحديث عدد المنتجات الموجود في السلة
   */
  useEffect(() => {
    function updateCartCount() {
      try {
        const cart = getCart();

        const count = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setCartCount(count);
      } catch (error) {
        console.error("CART COUNT ERROR:", error);
      }
    }

    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  /*
   * إضافة المنتج للسلة
   */
  function handleAddToCart() {
    if (!product) {
      return;
    }

    /*
     * التأكد من اختيار المقاس
     */
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      alert("من فضلك اختر المقاس أولًا.");
      return;
    }

    /*
     * التأكد من وجود مخزون
     */
    if (product.stock <= 0) {
      alert("هذا المنتج غير متوفر حاليًا.");
      return;
    }

    /*
     * التأكد أن الكمية صحيحة
     */
    const safeQuantity = Math.min(
      Math.max(quantity, 1),
      product.stock
    );

    /*
     * استخدام نفس نظام السلة الموجود في lib/cart.ts
     *
     * مهم جدًا:
     * lib/cart.ts يستخدم flex_cart
     * وصفحة السلة تقرأ من نفس المكان.
     */
    addToCart({
      productId: product.id,

      name:
        product.name_ar ||
        product.name ||
        product.name_en ||
        "منتج",

      price: Number(product.price),

      imageUrl: product.image_url,

      quantity: safeQuantity,

      size: selectedSize,
    });

    /*
     * تحديث الواجهة
     */
    setAdded(true);

    /*
     * إخفاء رسالة النجاح بعد فترة
     */
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  /*
   * زيادة الكمية
   */
  function increaseQuantity() {
    if (!product) return;

    setQuantity((current) =>
      Math.min(current + 1, Math.max(product.stock, 1))
    );
  }

  /*
   * تقليل الكمية
   */
  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#050505] text-white"
      >
        <Loader2
          size={32}
          className="animate-spin text-[#b6ff00]"
        />
      </main>
    );
  }

  /*
   * المنتج غير موجود
   */
  if (!product) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#050505] px-5 py-20 text-white"
      >
        <div className="mx-auto max-w-xl text-center">
          <Package
            size={50}
            className="mx-auto mb-5 text-white/20"
          />

          <h1 className="text-3xl font-black">
            المنتج غير موجود
          </h1>

          <p className="mt-3 text-white/35">
            ربما تم حذف المنتج أو لم يعد متاحًا.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b6ff00] px-6 py-3 font-black text-black"
          >
            العودة للمتجر

            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  /*
   * أسماء المنتج
   */
  const nameAr =
    product.name_ar ||
    product.name ||
    "منتج";

  const nameEn =
    product.name_en ||
    product.name ||
    "Product";

  /*
   * وصف المنتج
   */
  const descriptionAr =
    product.description_ar ||
    product.description ||
    "";

  const descriptionEn =
    product.description_en ||
    product.description ||
    "";

  /*
   * التصنيف
   */
  const categoryAr =
    product.category_ar ||
    product.category ||
    "";

  const categoryEn =
    product.category_en ||
    product.category ||
    "";

  /*
   * السعر
   */
  const price = Number(product.price) || 0;

  const oldPrice =
    product.old_price !== null
      ? Number(product.old_price)
      : null;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#050505] text-white"
    >
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo / Store */}

          <Link
            href="/"
            className="text-2xl font-black"
          >
            المتجر
          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-white/20 hover:text-white"
          >
            <ShoppingCart size={18} />

            <span>
              السلة
            </span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#b6ff00] px-1 text-[11px] font-black text-black">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ================= PRODUCT ================= */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">

        {/* Back */}

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/40 transition hover:text-white"
        >
          <ArrowRight size={17} />

          العودة للمتجر
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

          {/* ================= IMAGE ================= */}

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a]">

            <div className="aspect-square bg-black">

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={nameAr}
                  className="h-full w-full object-contain p-4 sm:p-8"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/20">
                  <Package size={50} />
                </div>
              )}

            </div>
          </div>

          {/* ================= INFO ================= */}

          <div className="lg:pt-6">

            {/* CATEGORY */}

            {(categoryAr || categoryEn) && (
              <div className="mb-4">
                <span className="rounded-full bg-[#b6ff00]/10 px-4 py-2 text-xs font-black text-[#b6ff00]">
                  {categoryAr || categoryEn}
                </span>
              </div>
            )}

            {/* TITLE */}

            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              {nameAr}
            </h1>

            {nameEn && nameEn !== nameAr && (
              <div
                dir="ltr"
                className="mt-2 text-lg font-medium text-white/25"
              >
                {nameEn}
              </div>
            )}

            {/* DESCRIPTION */}

            {(descriptionAr || descriptionEn) && (
              <div className="mt-8 space-y-4">

                {descriptionAr && (
                  <p className="text-base leading-8 text-white/55">
                    {descriptionAr}
                  </p>
                )}

                {descriptionEn && (
                  <p
                    dir="ltr"
                    className="text-sm leading-7 text-white/30"
                  >
                    {descriptionEn}
                  </p>
                )}

              </div>
            )}

            {/* PRICE */}

            <div className="mt-8 flex flex-wrap items-end gap-3">

              <span className="text-4xl font-black text-[#b6ff00]">
                {price.toLocaleString("ar-EG")}
              </span>

              <span className="mb-1 text-sm text-white/35">
                جنيه
              </span>

              {oldPrice &&
                oldPrice > price && (
                  <span className="mb-1 text-lg text-white/25 line-through">
                    {oldPrice.toLocaleString("ar-EG")} جنيه
                  </span>
                )}

            </div>

            {/* ================= SIZES ================= */}

            {product.sizes &&
              product.sizes.length > 0 && (
                <div className="mt-9">

                  <div className="mb-3 text-sm font-black">
                    اختر المقاس
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        className={`min-w-14 rounded-xl border px-4 py-3 text-sm font-black transition ${
                          selectedSize === size
                            ? "border-[#b6ff00] bg-[#b6ff00] text-black"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}

                  </div>
                </div>
              )}

            {/* ================= QUANTITY ================= */}

            <div className="mt-8">

              <div className="mb-3 text-sm font-black">
                الكمية
              </div>

              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-4 text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={17} />
                </button>

                <span className="min-w-12 text-center font-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    product.stock <= 0 ||
                    quantity >= product.stock
                  }
                  className="p-4 text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={17} />
                </button>

              </div>
            </div>

            {/* ================= STOCK ================= */}

            <div className="mt-5 text-sm">

              {product.stock > 0 ? (
                <span className="text-[#b6ff00]">
                  متوفر في المخزون
                </span>
              ) : (
                <span className="text-red-400">
                  غير متوفر حاليًا
                </span>
              )}

            </div>

            {/* ================= ADD TO CART ================= */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                product.stock <= 0 ||
                added
              }
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#b6ff00] px-6 py-5 text-lg font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {added ? (
                <>
                  <CheckCircle2 size={21} />

                  تمت الإضافة إلى السلة ✓
                </>
              ) : (
                <>
                  <ShoppingCart size={21} />

                  {product.stock <= 0
                    ? "غير متوفر حاليًا"
                    : "أضف إلى السلة"}
                </>
              )}

            </button>

            {/* ================= VIEW CART ================= */}

            <Link
              href="/cart"
              className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/10 px-6 py-4 text-sm font-bold text-white/60 transition hover:border-white/25 hover:text-white"
            >
              عرض السلة وإتمام الطلب
            </Link>

          </div>
        </div>

        {/* ================= FEATURES ================= */}

        {product.features &&
          product.features.length > 0 && (
            <section className="mt-16 border-t border-white/10 pt-12">

              <h2 className="text-2xl font-black">
                مميزات المنتج
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {product.features.map(
                  (feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-bold text-white/65"
                    >
                      <span className="mr-2 text-[#b6ff00]">
                        ✓
                      </span>

                      {feature}
                    </div>
                  )
                )}

              </div>
            </section>
          )}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 py-8">

        <div className="mx-auto max-w-7xl px-5 text-center text-xs text-white/25 sm:px-8">
          جميع الحقوق محفوظة ©{" "}
          {new Date().getFullYear()} FLEX
        </div>

      </footer>
    </main>
  );
}
