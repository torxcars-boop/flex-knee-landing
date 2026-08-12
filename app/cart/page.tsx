"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import {
  CartItem,
  getCart,
  saveCart,
  getCartTotal,
  getCartCount,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadCart = () => {
      setItems(getCart());
      setReady(true);
    };

    const frame = window.requestAnimationFrame(loadCart);

    const handleCartUpdate = () => {
      setItems(getCart());
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );
    };
  }, []);

  const updateQuantity = (
    index: number,
    change: number
  ) => {
    setItems((current) => {
      const updated = current
        .map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  item.quantity + change
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      saveCart(updated);

      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((current) => {
      const updated = current.filter(
        (_, itemIndex) => itemIndex !== index
      );

      saveCart(updated);

      return updated;
    });
  };

  const clearCart = () => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف جميع المنتجات من السلة؟"
    );

    if (!confirmed) return;

    saveCart([]);
    setItems([]);
  };

  const subtotal = getCartTotal(items);
  const itemCount = getCartCount(items);

  if (!ready) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#050505] text-white"
      >
        <div className="text-sm text-white/40">
          جاري تحميل السلة...
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#050505] text-white"
    >
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
          >
            <ArrowRight size={18} />
            العودة للمتجر
          </Link>

          <div className="text-xl font-black">
            المتجر
          </div>

          <div className="flex items-center gap-2 text-sm text-white/50">
            <ShoppingBag size={18} />
            <span>{itemCount}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-10">
          <div className="mb-2 text-xs font-bold tracking-[0.2em] text-[#b6ff00]">
            SHOPPING CART
          </div>

          <h1 className="text-4xl font-black sm:text-5xl">
            سلة المشتريات
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/40">
            راجع المنتجات والكميات قبل الانتقال إلى إتمام الطلب.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-24 text-center">
            <ShoppingBag
              size={50}
              className="mx-auto mb-6 text-white/15"
            />

            <h2 className="text-2xl font-black">
              السلة فارغة
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/35">
              لم تضف أي منتجات إلى السلة حتى الآن.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b6ff00] px-6 py-4 font-black text-black"
            >
              تصفح المنتجات
              <ArrowLeft size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-white/40">
                  {itemCount} منتج
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-2 text-sm font-bold text-red-400/70 transition hover:text-red-400"
                >
                  <Trash2 size={16} />
                  إفراغ السلة
                </button>
              </div>

              {items.map((item, index) => (
                <article
                  key={`${item.productId}-${item.size || "default"}-${index}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-black sm:h-36 sm:w-36">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/20">
                          بدون صورة
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-black sm:text-xl">
                            {item.name}
                          </h2>

                          {item.size && (
                            <div className="mt-2 text-xs text-white/35">
                              المقاس:
                              <span className="mr-1 font-bold text-white/60">
                                {item.size}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          className="rounded-xl p-2 text-white/25 transition hover:bg-red-500/10 hover:text-red-400"
                          title="حذف المنتج"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-xl font-black text-[#b6ff00]">
                            {item.price.toLocaleString(
                              "ar-EG"
                            )}
                          </span>

                          <span className="mr-1 text-xs text-white/30">
                            جنيه
                          </span>
                        </div>

                        <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                index,
                                -1
                              )
                            }
                            className="p-3 text-white/50 transition hover:text-white"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-10 text-center text-sm font-black">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                index,
                                1
                              )
                            }
                            className="p-3 text-white/50 transition hover:text-white"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-white/25">
                        الإجمالي:
                        <span className="mr-1 font-bold text-white/60">
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "ar-EG"
                          )}{" "}
                          جنيه
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 sm:p-7 lg:sticky lg:top-28">
              <div className="mb-6">
                <div className="text-xs font-bold text-[#b6ff00]">
                  ORDER SUMMARY
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  ملخص الطلب
                </h2>
              </div>

              <div className="space-y-4 border-b border-white/10 pb-6 text-sm">
                <div className="flex items-center justify-between text-white/45">
                  <span>قيمة المنتجات</span>

                  <span className="font-bold text-white">
                    {subtotal.toLocaleString(
                      "ar-EG"
                    )}{" "}
                    جنيه
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/45">
                  <span>الشحن</span>

                  <span className="font-bold text-[#b6ff00]">
                    سيتم تحديده
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between py-6">
                <span className="text-sm text-white/45">
                  الإجمالي
                </span>

                <div className="text-left">
                  <div className="text-3xl font-black text-[#b6ff00]">
                    {subtotal.toLocaleString(
                      "ar-EG"
                    )}
                  </div>

                  <div className="text-xs text-white/30">
                    جنيه مصري
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black transition hover:scale-[1.01]"
              >
                إتمام الطلب
                <ArrowLeft size={18} />
              </Link>

              <Link
                href="/"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-4 text-sm font-bold text-white/50 transition hover:text-white"
              >
                متابعة التسوق
              </Link>
            </aside>
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-5 text-center text-xs text-white/25 sm:px-8">
          جميع الحقوق محفوظة © {new Date().getFullYear()} المتجر
        </div>
      </footer>
    </main>
  );
}
