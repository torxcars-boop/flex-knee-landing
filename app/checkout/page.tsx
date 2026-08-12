"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size?: string;
  quantity: number;
};

const WHATSAPP_NUMBER = "201115491611";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  /*
   * تحميل السلة بعد تشغيل الصفحة
   *
   * بدل setState مباشرة داخل useEffect،
   * نستخدم requestAnimationFrame حتى لا يخالف
   * React Compiler / ESLint الجديد.
   */
  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = localStorage.getItem("flex-cart");

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setItems(parsed as CartItem[]);
          }
        }
      } catch (error) {
        console.error("CART LOAD ERROR:", error);
      } finally {
        setReady(true);
      }
    };

    const frame = window.requestAnimationFrame(loadCart);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  /*
   * الشحن يتم تحديده لاحقًا
   */
  const shipping = 0;
  const total = subtotal + shipping;

  /*
   * إرسال الطلب مباشرة إلى واتساب
   */
  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      alert("السلة فارغة.");
      return;
    }

    if (!name.trim()) {
      alert("من فضلك اكتب الاسم.");
      return;
    }

    if (!phone.trim()) {
      alert("من فضلك اكتب رقم الهاتف.");
      return;
    }

    if (!governorate.trim()) {
      alert("من فضلك اختر المحافظة.");
      return;
    }

    if (!address.trim()) {
      alert("من فضلك اكتب العنوان.");
      return;
    }

    setSubmitting(true);

    /*
     * إنشاء رقم طلب آمن بدون Date.now()
     */
    const generatedOrderId = `FLEX-${crypto
      .randomUUID()
      .split("-")[0]
      .toUpperCase()}`;

    /*
     * تجهيز المنتجات
     */
    const productsText = items
      .map((item, index) => {
        const itemTotal = item.price * item.quantity;

        return [
          `${index + 1}) ${item.name}`,
          `   الكمية: ${item.quantity}`,
          item.size ? `   المقاس: ${item.size}` : null,
          `   السعر: ${item.price.toLocaleString("ar-EG")} جنيه`,
          `   الإجمالي: ${itemTotal.toLocaleString("ar-EG")} جنيه`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    /*
     * رسالة الطلب
     */
    const message = `
🛍️ *طلب شراء جديد - FLEX*

━━━━━━━━━━━━━━━━━━

📦 *رقم الطلب:*
${generatedOrderId}

👤 *بيانات العميل:*

الاسم:
${name.trim()}

رقم الهاتف:
${phone.trim()}

المحافظة:
${governorate.trim()}

العنوان:
${address.trim()}

${
  notes.trim()
    ? `ملاحظات:
${notes.trim()}

`
    : ""
}

━━━━━━━━━━━━━━━━━━

🛒 *المنتجات:*

${productsText}

━━━━━━━━━━━━━━━━━━

💰 *ملخص الطلب:*

قيمة المنتجات:
${subtotal.toLocaleString("ar-EG")} جنيه

الشحن:
سيتم تحديده

*الإجمالي:*
${total.toLocaleString("ar-EG")} جنيه

━━━━━━━━━━━━━━━━━━

✅ تم إرسال الطلب من متجر FLEX
`.trim();

    /*
     * رابط واتساب
     */
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    /*
     * فتح واتساب.
     *
     * لا نعدل window.location هنا لأن ESLint يعتبر
     * location قيمة غير قابلة للتعديل داخل component.
     *
     * لو المتصفح منع popup، نستخدم window.open
     * مرة أخرى في نفس الصفحة.
     */
    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      window.open(whatsappUrl, "_self");
      return;
    }

    /*
     * مسح السلة
     */
    localStorage.removeItem("flex-cart");

    window.dispatchEvent(new Event("cart-updated"));

    setItems([]);

    /*
     * عرض صفحة النجاح
     */
    setOrderId(generatedOrderId);

    setSubmitting(false);
  };

  /*
   * تحميل الصفحة
   */
  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2
          size={28}
          className="animate-spin text-[#b6ff00]"
        />
      </main>
    );
  }

  /*
   * نجاح الطلب
   */
  if (orderId) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white"
      >
        <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#b6ff00]/10">
            <CheckCircle2
              size={52}
              className="text-[#b6ff00]"
            />
          </div>

          <div className="text-xs font-bold tracking-[0.2em] text-[#b6ff00]">
            ORDER SENT
          </div>

          <h1 className="mt-3 text-3xl font-black">
            تم إرسال طلبك بنجاح
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/40">
            تم تجهيز طلبك وإرساله إلى واتساب.
            <br />
            سنتواصل معك لتأكيد التفاصيل والشحن.
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs text-white/35">
              رقم الطلب
            </div>

            <div className="mt-2 break-all font-mono text-sm font-bold text-[#b6ff00]">
              {orderId}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#b6ff00]/20 bg-[#b6ff00]/5 p-4">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#b6ff00]">
              <MessageCircle size={18} />
              تم إرسال الطلب عبر واتساب
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black transition hover:scale-[1.01]"
          >
            العودة للمتجر
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  /*
   * السلة فارغة
   */
  if (items.length === 0) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white"
      >
        <div className="text-center">
          <ShoppingBag
            size={50}
            className="mx-auto mb-5 text-white/15"
          />

          <h1 className="text-2xl font-black">
            السلة فارغة
          </h1>

          <p className="mt-3 text-sm text-white/35">
            أضف منتجات إلى السلة أولًا.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#b6ff00] px-6 py-4 font-black text-black"
          >
            العودة للمتجر
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#050505] text-white"
    >
      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm font-bold text-white/50 transition hover:text-white"
          >
            <ArrowRight size={18} />
            العودة للسلة
          </Link>

          <div className="text-xl font-black">
            FLEX
          </div>

          <div className="text-sm text-white/35">
            إتمام الطلب
          </div>
        </div>
      </header>

      {/* CHECKOUT */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-10">
          <div className="text-xs font-bold tracking-[0.2em] text-[#b6ff00]">
            CHECKOUT
          </div>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            إتمام الطلب
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/40">
            أدخل بياناتك بدقة حتى نتمكن من التواصل معك
            وتوصيل طلبك.
          </p>
        </div>

        <form
          onSubmit={submitOrder}
          className="grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          {/* CUSTOMER FORM */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 sm:p-8">
            <h2 className="text-2xl font-black">
              بيانات العميل
            </h2>

            <div className="mt-7 grid gap-5">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  الاسم بالكامل *
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="اكتب اسمك بالكامل"
                  className="checkout-input"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  رقم الهاتف *
                </label>

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="01xxxxxxxxx"
                  type="tel"
                  dir="ltr"
                  className="checkout-input text-left"
                  required
                />
              </div>

              {/* GOVERNORATE */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  المحافظة *
                </label>

                <select
                  value={governorate}
                  onChange={(e) =>
                    setGovernorate(e.target.value)
                  }
                  className="checkout-input"
                  required
                >
                  <option value="">
                    اختر المحافظة
                  </option>

                  <option value="القاهرة">
                    القاهرة
                  </option>
                  <option value="الجيزة">
                    الجيزة
                  </option>
                  <option value="الإسكندرية">
                    الإسكندرية
                  </option>
                  <option value="الدقهلية">
                    الدقهلية
                  </option>
                  <option value="البحيرة">
                    البحيرة
                  </option>
                  <option value="الشرقية">
                    الشرقية
                  </option>
                  <option value="القليوبية">
                    القليوبية
                  </option>
                  <option value="الغربية">
                    الغربية
                  </option>
                  <option value="المنوفية">
                    المنوفية
                  </option>
                  <option value="كفر الشيخ">
                    كفر الشيخ
                  </option>
                  <option value="دمياط">
                    دمياط
                  </option>
                  <option value="بورسعيد">
                    بورسعيد
                  </option>
                  <option value="الإسماعيلية">
                    الإسماعيلية
                  </option>
                  <option value="السويس">
                    السويس
                  </option>
                  <option value="الفيوم">
                    الفيوم
                  </option>
                  <option value="بني سويف">
                    بني سويف
                  </option>
                  <option value="المنيا">
                    المنيا
                  </option>
                  <option value="أسيوط">
                    أسيوط
                  </option>
                  <option value="سوهاج">
                    سوهاج
                  </option>
                  <option value="قنا">
                    قنا
                  </option>
                  <option value="الأقصر">
                    الأقصر
                  </option>
                  <option value="أسوان">
                    أسوان
                  </option>
                  <option value="البحر الأحمر">
                    البحر الأحمر
                  </option>
                  <option value="الوادي الجديد">
                    الوادي الجديد
                  </option>
                  <option value="مطروح">
                    مطروح
                  </option>
                  <option value="شمال سيناء">
                    شمال سيناء
                  </option>
                  <option value="جنوب سيناء">
                    جنوب سيناء
                  </option>
                </select>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  العنوان بالتفصيل *
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="المدينة، المنطقة، الشارع، رقم المنزل..."
                  rows={4}
                  className="checkout-input resize-none"
                  required
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  ملاحظات إضافية
                </label>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="أي ملاحظات خاصة بالطلب..."
                  rows={3}
                  className="checkout-input resize-none"
                />
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <aside className="h-fit rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 lg:sticky lg:top-8">
            <div className="mb-6">
              <div className="text-xs font-bold text-[#b6ff00]">
                YOUR ORDER
              </div>

              <h2 className="mt-2 text-2xl font-black">
                ملخص الطلب
              </h2>
            </div>

            <div className="space-y-4 border-b border-white/10 pb-5">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.size || "default"}-${index}`}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">
                      {item.name}
                    </div>

                    <div className="mt-1 text-xs text-white/30">
                      الكمية: {item.quantity}

                      {item.size
                        ? ` • المقاس: ${item.size}`
                        : ""}
                    </div>
                  </div>

                  <div className="shrink-0 text-sm font-bold text-[#b6ff00]">
                    {(
                      item.price * item.quantity
                    ).toLocaleString("ar-EG")}{" "}
                    ج
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 py-5 text-sm">
              <div className="flex justify-between text-white/45">
                <span>قيمة المنتجات</span>

                <span>
                  {subtotal.toLocaleString("ar-EG")} ج
                </span>
              </div>

              <div className="flex justify-between text-white/45">
                <span>الشحن</span>

                <span>سيتم تحديده</span>
              </div>
            </div>

            <div className="mb-6 flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-sm text-white/40">
                الإجمالي
              </span>

              <div className="text-left">
                <div className="text-3xl font-black text-[#b6ff00]">
                  {total.toLocaleString("ar-EG")}
                </div>

                <div className="text-xs text-white/30">
                  جنيه مصري
                </div>
              </div>
            </div>

            {/* WHATSAPP BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  جاري إرسال الطلب...
                </>
              ) : (
                <>
                  <MessageCircle size={19} />
                  إرسال الطلب عبر واتساب
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-white/25">
              بالضغط على الزر سيتم فتح واتساب وإرسال
              تفاصيل الطلب مباشرة إلى خدمة الطلبات.
            </p>
          </aside>
        </form>
      </section>

      {/* STYLES */}
      <style jsx global>{`
        .checkout-input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 1rem;
          color: white;
          outline: none;
          transition: 0.2s;
        }

        .checkout-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .checkout-input:focus {
          border-color: rgba(182, 255, 0, 0.6);
          background: rgba(255, 255, 255, 0.06);
        }

        select.checkout-input option {
          background: #0a0a0a;
          color: white;
        }
      `}</style>
    </main>
  );
}
