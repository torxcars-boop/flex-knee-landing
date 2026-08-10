"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const PRODUCT_PRICE = 464;
const WHATSAPP_NUMBER = "201115491611";

const sizes = ["M", "L", "XL", "XXL"];

const content = {
  en: {
    navProduct: "Product",
    navTechnology: "Technology",
    navOrder: "Order",
    buyNow: "BUY NOW",

    badge: "NEXT-GEN KNEE SUPPORT",
    heroTitle1: "STRONGER",
    heroTitle2: "SUPPORT.",
    heroTitle3: "BETTER",
    heroTitle4: "MOVEMENT.",
    heroText:
      "Premium compression knee support engineered for stability, flexibility and confident movement.",

    shopNow: "SHOP NOW",
    discover: "DISCOVER PRODUCT",

    flexible: "Flexible Knit",
    antiSlip: "Anti-Slip",
    breathable: "Breathable",

    productLabel: "PREMIUM SUPPORT",
    productTitle: "Support that moves with you.",
    productText:
      "Designed for everyday movement, training and active lifestyles. FLEX provides comfortable compression while keeping your movement natural.",

    feature1Title: "Stable Support",
    feature1Text:
      "A structured compression design helps keep the knee comfortably supported during movement.",

    feature2Title: "Flexible Comfort",
    feature2Text:
      "Stretch fabric follows your movement without feeling bulky.",

    feature3Title: "Breathable Fabric",
    feature3Text:
      "Lightweight knitted material helps keep the product comfortable during extended use.",

    technology: "TECHNOLOGY",
    technologyTitle: "Engineered for everyday performance.",
    technologyText:
      "Every detail of FLEX is designed around comfort, support and freedom of movement.",

    chooseSize: "Choose your size",
    quantity: "Quantity",
    total: "Total",

    orderTitle: "Complete your order",
    orderText:
      "Enter your information and your order will be prepared through WhatsApp.",

    fullName: "Full name",
    phone: "Phone number",
    address: "Delivery address",
    notes: "Order notes",
    notesPlaceholder: "Optional",

    selectSize: "Select size",
    completeOrder: "COMPLETE ORDER",
    orderWhatsapp: "Your order will be sent via WhatsApp.",
    cashOnDelivery: "Cash on delivery",
    freeDelivery: "Free delivery",

    footerText:
      "Premium knee support designed for comfortable everyday movement.",

    required: "Please fill in your name, phone, address and size.",
  },

  ar: {
    navProduct: "المنتج",
    navTechnology: "التقنية",
    navOrder: "اطلب الآن",
    buyNow: "اطلب الآن",

    badge: "دعامة ركبة متطورة",
    heroTitle1: "دعم أقوى",
    heroTitle2: "حركة أفضل.",
    heroTitle3: "",
    heroTitle4: "",

    heroText:
      "دعامة ركبة احترافية مصممة لتوفير الثبات والمرونة والراحة أثناء الحركة.",

    shopNow: "اطلب الآن",
    discover: "اكتشف المنتج",

    flexible: "نسيج مرن",
    antiSlip: "ثبات ضد الانزلاق",
    breathable: "خامة جيدة التهوية",

    productLabel: "دعم احترافي",
    productTitle: "دعم يتحرك معك.",
    productText:
      "مصممة للحركة اليومية والتمارين والنشاط. توفر FLEX ضغطًا مريحًا مع الحفاظ على حرية الحركة.",

    feature1Title: "ثبات أفضل",
    feature1Text:
      "تصميم ضغط متدرج يساعد على توفير دعم مريح للركبة أثناء الحركة.",

    feature2Title: "مرونة وراحة",
    feature2Text:
      "خامة مرنة تتكيف مع الحركة بدون إحساس بالثقل.",

    feature3Title: "خامة جيدة التهوية",
    feature3Text:
      "نسيج خفيف يساعد على الحفاظ على الراحة أثناء الاستخدام لفترات طويلة.",

    technology: "التقنية",
    technologyTitle: "مصممة للأداء اليومي.",
    technologyText:
      "كل تفصيلة في FLEX مصممة لتحقيق التوازن بين الراحة والدعم وحرية الحركة.",

    chooseSize: "اختر المقاس",
    quantity: "الكمية",
    total: "الإجمالي",

    orderTitle: "أكمل طلبك",
    orderText:
      "أدخل بياناتك وسيتم تجهيز طلبك وإرساله عبر WhatsApp.",

    fullName: "الاسم بالكامل",
    phone: "رقم الهاتف",
    address: "عنوان التوصيل",
    notes: "ملاحظات الطلب",
    notesPlaceholder: "اختياري",

    selectSize: "اختر المقاس",
    completeOrder: "إتمام الشراء",
    orderWhatsapp: "سيتم إرسال الطلب عبر WhatsApp.",
    cashOnDelivery: "الدفع عند الاستلام",
    freeDelivery: "الشحن مجاني",

    footerText:
      "دعامة ركبة احترافية مصممة للراحة والحركة اليومية.",

    required: "من فضلك أدخل الاسم والهاتف والعنوان والمقاس.",
  },
};

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const t = content[language];
  const isArabic = language === "ar";
  const total = PRODUCT_PRICE * quantity;

  const scrollToOrder = () => {
    document
      .getElementById("order")
      ?.scrollIntoView({ behavior: "smooth" });

    setMenuOpen(false);
  };

  const updateForm = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitOrder = () => {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !selectedSize
    ) {
      alert(t.required);
      return;
    }

    const message = isArabic
      ? `طلب جديد - FLEX

المنتج: FLEX Premium Knee Support
المقاس: ${selectedSize}
الكمية: ${quantity}
السعر: ${PRODUCT_PRICE} جنيه
الإجمالي: ${total} جنيه

بيانات العميل:
الاسم: ${form.name}
الهاتف: ${form.phone}
العنوان: ${form.address}
ملاحظات: ${form.notes || "لا توجد"}

الدفع: عند الاستلام
الشحن: مجاني`
      : `New FLEX Order

Product: FLEX Premium Knee Support
Size: ${selectedSize}
Quantity: ${quantity}
Price: ${PRODUCT_PRICE} EGP
Total: ${total} EGP

Customer Information:
Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}
Notes: ${form.notes || "None"}

Payment: Cash on delivery
Delivery: Free`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-hidden bg-[#050505] text-white"
    >
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="FLEX Performance"
              width={180}
              height={52}
              priority
              className="h-auto w-[135px] sm:w-[165px]"
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-sm text-white/65 transition hover:text-[#b6ff00]"
            >
              {t.navProduct}
            </a>

            <a
              href="#technology"
              className="text-sm text-white/65 transition hover:text-[#b6ff00]"
            >
              {t.navTechnology}
            </a>

            <a
              href="#order"
              className="text-sm text-white/65 transition hover:text-[#b6ff00]"
            >
              {t.navOrder}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setLanguage(isArabic ? "en" : "ar")
              }
              className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-[#b6ff00]/50 hover:text-[#b6ff00] sm:flex"
            >
              <Globe size={16} />
              {isArabic ? "English" : "العربية"}
            </button>

            <button
              onClick={scrollToOrder}
              className="hidden rounded-full bg-[#b6ff00] px-5 py-2.5 text-sm font-black text-black transition hover:scale-105 md:block"
            >
              {t.buyNow}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full border border-white/10 p-2 md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-black px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#product" onClick={() => setMenuOpen(false)}>
                {t.navProduct}
              </a>

              <a
                href="#technology"
                onClick={() => setMenuOpen(false)}
              >
                {t.navTechnology}
              </a>

              <button
                onClick={scrollToOrder}
                className="w-full rounded-xl bg-[#b6ff00] px-5 py-3 font-black text-black"
              >
                {t.buyNow}
              </button>

              <button
                onClick={() =>
                  setLanguage(isArabic ? "en" : "ar")
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3"
              >
                <Globe size={17} />
                {isArabic ? "English" : "العربية"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden pt-28">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#b6ff00]/10 blur-[150px]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-2">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b6ff00]/20 bg-[#b6ff00]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b6ff00]">
              <Sparkles size={14} />
              {t.badge}
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
              {isArabic ? (
                <>
                  <span className="block">دعم أقوى.</span>
                  <span className="block text-[#b6ff00]">
                    حركة أفضل.
                  </span>
                </>
              ) : (
                <>
                  <span className="block">STRONGER</span>
                  <span className="block text-[#b6ff00]">
                    SUPPORT.
                  </span>
                  <span className="block">BETTER</span>
                  <span className="block text-[#b6ff00]">
                    MOVEMENT.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/55 sm:text-lg">
              {t.heroText}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={scrollToOrder}
                className="group flex items-center justify-center gap-3 rounded-full bg-[#b6ff00] px-7 py-4 font-black text-black transition hover:scale-[1.03]"
              >
                <ShoppingBag size={19} />
                {t.shopNow}
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#product"
                className="flex items-center justify-center rounded-full border border-white/15 px-7 py-4 font-bold text-white transition hover:border-[#b6ff00]/50 hover:text-[#b6ff00]"
              >
                {t.discover}
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {[t.flexible, t.antiSlip, t.breathable].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/65"
                  >
                    <Check
                      size={14}
                      className="text-[#b6ff00]"
                    />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#b6ff00]/10 blur-[100px]" />

            <div className="relative w-full max-w-[650px]">
              <div className="absolute left-1/2 top-1/2 h-[75%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b6ff00]/10 blur-[70px]" />

              <Image
                src="/product/hero-premium.png"
                alt="FLEX Premium Knee Support"
                width={1000}
                height={1000}
                priority
                className="relative z-10 mx-auto w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
              />

              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/75 px-5 py-2 text-xs font-bold text-white/70 backdrop-blur-xl">
                FLEX PERFORMANCE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT */}
      <section
        id="product"
        className="border-t border-white/10 bg-[#090909] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#b6ff00]">
                {t.productLabel}
              </div>

              <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
                {t.productTitle}
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-white/55">
                {t.productText}
              </p>

              <div className="mt-9 grid gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: t.feature1Title,
                    text: t.feature1Text,
                  },
                  {
                    icon: Zap,
                    title: t.feature2Title,
                    text: t.feature2Text,
                  },
                  {
                    icon: Sparkles,
                    title: t.feature3Title,
                    text: t.feature3Text,
                  },
                ].map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#b6ff00]/10 text-[#b6ff00]">
                        <Icon size={20} />
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-white/45">
                          {feature.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] sm:row-span-2">
                <Image
                  src="/product/detail-closeup.png"
                  alt="FLEX knee support close-up"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <Image
                  src="/product/performance.png"
                  alt="FLEX performance"
                  width={700}
                  height={700}
                  className="w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                <Image
                  src="/product/activities.png"
                  alt="FLEX activities"
                  width={700}
                  height={700}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section
        id="technology"
        className="border-t border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#b6ff00]">
              {t.technology}
            </div>

            <h2 className="text-4xl font-black sm:text-6xl">
              {t.technologyTitle}
            </h2>

            <p className="mt-5 leading-8 text-white/50">
              {t.technologyText}
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]">
            <Image
              src="/product/why-flex.png"
              alt="FLEX technology"
              width={1600}
              height={900}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ORDER */}
      <section
        id="order"
        className="border-t border-white/10 bg-[#090909] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#b6ff00]">
                FLEX
              </div>

              <h2 className="text-4xl font-black sm:text-6xl">
                {t.orderTitle}
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-white/50">
                {t.orderText}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65">
                  {t.cashOnDelivery}
                </div>

                <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65">
                  {t.freeDelivery}
                </div>
              </div>

              <div className="mt-10 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-black">
                <Image
                  src="/product/sizes.png"
                  alt="FLEX sizes"
                  width={900}
                  height={700}
                  className="w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black">
                    FLEX Knee Support
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    Premium compression support
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-[#b6ff00]">
                    {PRODUCT_PRICE}
                  </div>
                  <div className="text-xs text-white/40">
                    EGP / piece
                  </div>
                </div>
              </div>

              {/* SIZE */}
              <div className="mt-8">
                <label className="mb-3 block text-sm font-bold">
                  {t.chooseSize}
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border py-3 font-bold transition ${
                        selectedSize === size
                          ? "border-[#b6ff00] bg-[#b6ff00] text-black"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mt-6">
                <label className="mb-3 block text-sm font-bold">
                  {t.quantity}
                </label>

                <div className="flex w-fit items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    className="p-3 text-white/60 hover:text-white"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="min-w-12 text-center font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(10, q + 1))
                    }
                    className="p-3 text-white/60 hover:text-white"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* FORM */}
              <div className="mt-8 space-y-4">
                <input
                  value={form.name}
                  onChange={(e) =>
                    updateForm("name", e.target.value)
                  }
                  placeholder={t.fullName}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/30 focus:border-[#b6ff00]/60"
                />

                <input
                  value={form.phone}
                  onChange={(e) =>
                    updateForm("phone", e.target.value)
                  }
                  placeholder={t.phone}
                  type="tel"
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/30 focus:border-[#b6ff00]/60"
                />

                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateForm("address", e.target.value)
                  }
                  placeholder={t.address}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/30 focus:border-[#b6ff00]/60"
                />

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateForm("notes", e.target.value)
                  }
                  placeholder={`${t.notes} (${t.notesPlaceholder})`}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/30 focus:border-[#b6ff00]/60"
                />
              </div>

              {/* TOTAL */}
              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    {t.total}
                  </span>

                  <span className="text-3xl font-black">
                    {total} EGP
                  </span>
                </div>

                <button
                  type="button"
                  onClick={submitOrder}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#b6ff00] px-6 py-4 font-black text-black transition hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(182,255,0,0.18)]"
                >
                  <ShoppingBag size={20} />
                  {t.completeOrder}
                  <ArrowRight size={19} />
                </button>

                <p className="mt-4 text-center text-xs text-white/35">
                  {t.orderWhatsapp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:px-8 md:flex-row">
          <Image
            src="/logo.svg"
            alt="FLEX Performance"
            width={150}
            height={44}
            className="w-[130px]"
          />

          <p className="text-center text-xs text-white/35">
            © {new Date().getFullYear()} FLEX Performance.{" "}
            {t.footerText}
          </p>

          <button
            onClick={() =>
              setLanguage(isArabic ? "en" : "ar")
            }
            className="flex items-center gap-2 text-sm text-white/50 transition hover:text-[#b6ff00]"
          >
            <Globe size={16} />
            <ChevronDown size={14} />
            {isArabic ? "English" : "العربية"}
          </button>
        </div>
      </footer>
    </main>
  );
}
