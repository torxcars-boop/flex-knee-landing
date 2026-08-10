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
  Wind,
  X,
  Zap,
} from "lucide-react";

const PRICE = 464;
const WHATSAPP = "201115491611";

const sizes = ["M", "L", "XL", "XXL"];

const translations = {
  en: {
    product: "PRODUCT",
    benefits: "BENEFITS",
    sizeGuide: "SIZE GUIDE",
    orderNow: "ORDER NOW",

    badge: "PREMIUM KNEE SUPPORT",
    heroTitle: "MOVE WITHOUT LIMITS.",
    heroText:
      "Advanced knee support engineered for stability, flexibility and everyday comfort.",
    heroButton: "ORDER NOW",
    explore: "EXPLORE PRODUCT",

    cash: "Cash on Delivery",
    delivery: "Free Delivery",
    premium: "Premium Compression",

    why: "WHY FLEX?",
    whyTitle: "Support that keeps up with you.",
    whyText:
      "Built for everyday movement, training and active lifestyles. FLEX gives you the support you need without getting in your way.",

    stability: "STABILITY",
    stabilityText:
      "Targeted compression provides reliable support while you move.",

    flexibility: "FLEXIBILITY",
    flexibilityText:
      "Stretch construction follows your natural movement without feeling bulky.",

    comfort: "COMFORT",
    comfortText:
      "Lightweight breathable material keeps you comfortable throughout the day.",

    showcase: "PRODUCT",
    showcaseTitle: "Built for movement.",
    showcaseText:
      "A premium compression design that combines support, flexibility and comfort in one lightweight knee brace.",

    technology: "TECHNOLOGY",
    technologyTitle: "Designed around your movement.",
    technologyText:
      "Every detail of FLEX is focused on creating a secure, comfortable fit while preserving natural movement.",

    size: "SIZE GUIDE",
    sizeTitle: "Find your perfect fit.",
    sizeText:
      "Choose the size that feels secure and comfortable around your knee.",

    order: "ORDER FLEX",
    orderTitle: "Get yours today.",
    orderText:
      "Complete your information and send your order directly through WhatsApp.",

    chooseSize: "SIZE",
    quantity: "QUANTITY",
    total: "TOTAL",

    name: "Full Name",
    phone: "Phone Number",
    address: "Delivery Address",
    notes: "Order Notes",
    optional: "Optional",

    complete: "COMPLETE ORDER",
    whatsappNote: "Your order will be sent securely through WhatsApp.",

    footer:
      "Premium knee support designed for comfortable everyday movement.",
  },

  ar: {
    product: "المنتج",
    benefits: "المميزات",
    sizeGuide: "دليل المقاسات",
    orderNow: "اطلب الآن",

    badge: "دعامة ركبة احترافية",
    heroTitle: "تحرك بلا حدود.",
    heroText:
      "دعامة ركبة متطورة مصممة لتحقيق الثبات والمرونة والراحة أثناء الحركة اليومية.",
    heroButton: "اطلب الآن",
    explore: "اكتشف المنتج",

    cash: "الدفع عند الاستلام",
    delivery: "شحن مجاني",
    premium: "ضغط ودعم احترافي",

    why: "لماذا FLEX؟",
    whyTitle: "دعم يتحرك معك.",
    whyText:
      "مصممة للحركة اليومية والتمارين والنشاط. تمنحك FLEX الدعم الذي تحتاجه بدون أن تعيق حركتك.",

    stability: "ثبات",
    stabilityText:
      "ضغط موجه يوفر دعمًا ثابتًا ومريحًا أثناء الحركة.",

    flexibility: "مرونة",
    flexibilityText:
      "خامة مرنة تتكيف مع حركتك الطبيعية بدون إحساس بالثقل.",

    comfort: "راحة",
    comfortText:
      "خامة خفيفة وجيدة التهوية تساعدك على الشعور بالراحة طوال اليوم.",

    showcase: "المنتج",
    showcaseTitle: "مصممة للحركة.",
    showcaseText:
      "تصميم احترافي يجمع بين الدعم والمرونة والراحة في دعامة ركبة خفيفة.",

    technology: "التقنية",
    technologyTitle: "مصممة حول حركتك.",
    technologyText:
      "كل تفصيلة في FLEX مصممة لتوفير ثبات وراحة مع الحفاظ على الحركة الطبيعية.",

    size: "دليل المقاسات",
    sizeTitle: "اختر المقاس المناسب.",
    sizeText:
      "اختر المقاس الذي يمنحك إحساسًا مريحًا وثابتًا حول الركبة.",

    order: "اطلب FLEX",
    orderTitle: "احصل عليها الآن.",
    orderText:
      "أدخل بياناتك وأرسل طلبك مباشرة من خلال WhatsApp.",

    chooseSize: "المقاس",
    quantity: "الكمية",
    total: "الإجمالي",

    name: "الاسم بالكامل",
    phone: "رقم الهاتف",
    address: "عنوان التوصيل",
    notes: "ملاحظات الطلب",
    optional: "اختياري",

    complete: "إتمام الشراء",
    whatsappNote: "سيتم إرسال طلبك مباشرة عبر WhatsApp.",

    footer:
      "دعامة ركبة احترافية مصممة للراحة والحركة اليومية.",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [size, setSize] = useState("L");
  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const t = translations[lang];
  const arabic = lang === "ar";
  const total = PRICE * quantity;

  const scrollToOrder = () => {
    document
      .getElementById("order")
      ?.scrollIntoView({ behavior: "smooth" });

    setMobileMenu(false);
  };

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  };

  const sendOrder = () => {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      alert(
        arabic
          ? "من فضلك أدخل الاسم ورقم الهاتف والعنوان."
          : "Please enter your name, phone number and address."
      );
      return;
    }

    const message = arabic
      ? `طلب جديد من FLEX

المنتج: FLEX Premium Knee Support
المقاس: ${size}
الكمية: ${quantity}
السعر: ${PRICE} جنيه
الإجمالي: ${total} جنيه

بيانات العميل:
الاسم: ${form.name}
الهاتف: ${form.phone}
العنوان: ${form.address}
ملاحظات: ${form.notes || "لا توجد"}

الدفع: عند الاستلام
الشحن: مجاني`
      : `NEW FLEX ORDER

Product: FLEX Premium Knee Support
Size: ${size}
Quantity: ${quantity}
Price: ${PRICE} EGP
Total: ${total} EGP

CUSTOMER INFORMATION

Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}
Notes: ${form.notes || "None"}

Payment: Cash on Delivery
Delivery: Free`;

    const url =
      `https://wa.me/${WHATSAPP}?text=` +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main
      dir={arabic ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-hidden bg-[#050505] text-white"
    >
      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.07] bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="FLEX"
              width={180}
              height={55}
              priority
              className="h-auto w-[135px] sm:w-[155px]"
            />
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            <a
              href="#product"
              className="text-[13px] font-medium tracking-wide text-white/55 transition hover:text-white"
            >
              {t.product}
            </a>

            <a
              href="#benefits"
              className="text-[13px] font-medium tracking-wide text-white/55 transition hover:text-white"
            >
              {t.benefits}
            </a>

            <a
              href="#size"
              className="text-[13px] font-medium tracking-wide text-white/55 transition hover:text-white"
            >
              {t.sizeGuide}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setLang(arabic ? "en" : "ar")
              }
              className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:border-[#b8ff00]/40 hover:text-[#b8ff00] sm:flex"
            >
              <Globe size={15} />
              {arabic ? "English" : "العربية"}
            </button>

            <button
              onClick={scrollToOrder}
              className="hidden rounded-full bg-[#b8ff00] px-5 py-2.5 text-xs font-black tracking-wide text-black transition hover:scale-105 md:block"
            >
              {t.orderNow}
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="rounded-full border border-white/10 p-2 md:hidden"
            >
              {mobileMenu ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-white/10 bg-black px-5 py-5 md:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="#product"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 text-sm text-white/70"
              >
                {t.product}
              </a>

              <a
                href="#benefits"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 text-sm text-white/70"
              >
                {t.benefits}
              </a>

              <a
                href="#size"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 text-sm text-white/70"
              >
                {t.sizeGuide}
              </a>

              <button
                onClick={() => {
                  setLang(arabic ? "en" : "ar");
                  setMobileMenu(false);
                }}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm"
              >
                {arabic ? "English" : "العربية"}
              </button>

              <button
                onClick={scrollToOrder}
                className="rounded-xl bg-[#b8ff00] px-4 py-3 text-sm font-black text-black"
              >
                {t.orderNow}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden pt-[76px]">
        <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-[#b8ff00]/10 blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#b8ff00]/5 blur-[140px]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          {/* HERO TEXT */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8ff00]/20 bg-[#b8ff00]/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff00]" />
              {t.badge}
            </div>

            <h1 className="max-w-3xl text-6xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
              {t.heroTitle}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              {t.heroText}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={scrollToOrder}
                className="group flex items-center justify-center gap-3 rounded-full bg-[#b8ff00] px-7 py-4 text-sm font-black text-black transition hover:scale-[1.03]"
              >
                <ShoppingBag size={18} />
                {t.heroButton}
                <span className="text-black/50">
                  — {PRICE} EGP
                </span>
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#product"
                className="flex items-center justify-center rounded-full border border-white/10 px-7 py-4 text-sm font-bold text-white/65 transition hover:border-white/25 hover:text-white"
              >
                {t.explore}
              </a>
            </div>

            {/* TRUST */}
            <div className="mt-9 grid max-w-xl grid-cols-3 border-y border-white/10 py-5">
              <div className="border-r border-white/10 px-3 first:pl-0">
                <Check
                  size={17}
                  className="mb-2 text-[#b8ff00]"
                />
                <p className="text-[11px] font-bold text-white/65">
                  {t.cash}
                </p>
              </div>

              <div className="border-r border-white/10 px-3">
                <Check
                  size={17}
                  className="mb-2 text-[#b8ff00]"
                />
                <p className="text-[11px] font-bold text-white/65">
                  {t.delivery}
                </p>
              </div>

              <div className="px-3">
                <Check
                  size={17}
                  className="mb-2 text-[#b8ff00]"
                />
                <p className="text-[11px] font-bold text-white/65">
                  {t.premium}
                </p>
              </div>
            </div>
          </div>

          {/* HERO PRODUCT */}
          <div className="relative flex min-h-[450px] items-center justify-center lg:min-h-[650px]">
            <div className="absolute h-[360px] w-[360px] rounded-full bg-[#b8ff00]/10 blur-[100px] sm:h-[500px] sm:w-[500px]" />

            <div className="absolute h-[420px] w-[420px] rounded-full border border-white/[0.05] sm:h-[550px] sm:w-[550px]" />

            <Image
              src="/product/hero-premium.png"
              alt="FLEX Premium Knee Support"
              width={1100}
              height={1100}
              priority
              className="relative z-10 max-h-[650px] w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
            />

            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/75 px-5 py-2 text-[10px] font-bold tracking-[0.2em] text-white/50 backdrop-blur-xl">
              FLEX PERFORMANCE
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        id="benefits"
        className="border-t border-white/[0.07] bg-[#080808] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b8ff00]">
              {t.why}
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              {t.whyTitle}
            </h2>

            <p className="mt-5 leading-7 text-white/40">
              {t.whyText}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: ShieldCheck,
                title: t.stability,
                text: t.stabilityText,
              },
              {
                number: "02",
                icon: Zap,
                title: t.flexibility,
                text: t.flexibilityText,
              },
              {
                number: "03",
                icon: Wind,
                title: t.comfort,
                text: t.comfortText,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 transition hover:-translate-y-1 hover:border-[#b8ff00]/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b8ff00]/10 text-[#b8ff00]">
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-black text-white/15">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-12 text-xl font-black">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/40">
                    {item.text}
                  </p>

                  <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#b8ff00]/5 blur-3xl transition group-hover:bg-[#b8ff00]/10" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section
        id="product"
        className="border-t border-white/[0.07] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]">
                <Image
                  src="/product/detail-closeup.png"
                  alt="FLEX close-up"
                  width={1200}
                  height={900}
                  className="h-[390px] w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]">
                <Image
                  src="/product/performance.png"
                  alt="FLEX performance"
                  width={700}
                  height={700}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]">
                <Image
                  src="/product/activities.png"
                  alt="FLEX activities"
                  width={700}
                  height={700}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b8ff00]">
                {t.showcase}
              </span>

              <h2 className="mt-4 text-4xl font-black sm:text-6xl">
                {t.showcaseTitle}
              </h2>

              <p className="mt-6 leading-8 text-white/40">
                {t.showcaseText}
              </p>

              <div className="mt-8 space-y-4">
                {[
                  t.stability,
                  t.flexibility,
                  t.comfort,
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border-b border-white/10 pb-4"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b8ff00] text-black">
                      <Check size={15} />
                    </div>

                    <span className="font-bold">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToOrder}
                className="mt-9 flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-[#b8ff00]"
              >
                {t.orderNow}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="border-y border-white/[0.07] bg-[#080808] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b8ff00]">
                {t.technology}
              </span>

              <h2 className="mt-4 text-4xl font-black sm:text-6xl">
                {t.technologyTitle}
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-white/40">
                {t.technologyText}
              </p>

              <div className="mt-8 space-y-5">
                {[
                  t.stability,
                  t.flexibility,
                  t.comfort,
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4"
                  >
                    <div className="h-2 w-2 rounded-full bg-[#b8ff00]" />
                    <span className="text-sm font-bold text-white/70">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
              <Image
                src="/product/why-flex.png"
                alt="FLEX technology"
                width={1200}
                height={900}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SIZE */}
      <section
        id="size"
        className="border-b border-white/[0.07] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b8ff00]">
                {t.size}
              </span>

              <h2 className="mt-4 text-4xl font-black sm:text-6xl">
                {t.sizeTitle}
              </h2>

              <p className="mt-5 leading-8 text-white/40">
                {t.sizeText}
              </p>

              <button
                onClick={scrollToOrder}
                className="mt-8 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white/70 transition hover:border-[#b8ff00]/50 hover:text-[#b8ff00]"
              >
                {t.orderNow}
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#090909] p-6 sm:p-8">
              <Image
                src="/product/sizes.png"
                alt="FLEX size guide"
                width={1200}
                height={800}
                className="mb-8 w-full rounded-2xl object-cover"
              />

              <div className="grid grid-cols-4 gap-2">
                {sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`rounded-xl py-4 text-sm font-black transition ${
                      size === item
                        ? "bg-[#b8ff00] text-black"
                        : "border border-white/10 bg-white/[0.03] text-white/50 hover:border-white/25"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER */}
      <section
        id="order"
        className="bg-[#080808] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b8ff00]">
                {t.order}
              </span>

              <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
                {t.orderTitle}
              </h2>

              <p className="mt-6 max-w-md leading-8 text-white/40">
                {t.orderText}
              </p>

              <div className="mt-10">
                <div className="text-sm font-bold text-white/45">
                  FLEX PREMIUM KNEE SUPPORT
                </div>

                <div className="mt-2 text-5xl font-black text-[#b8ff00]">
                  {PRICE} EGP
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50">
                    {t.cash}
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50">
                    {t.delivery}
                  </span>
                </div>
              </div>
            </div>

            {/* ORDER CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-black p-6 sm:p-9">
              {/* SIZE */}
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-widest text-white/45">
                  {t.chooseSize}
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSize(item)}
                      className={`rounded-xl border py-3 text-sm font-black transition ${
                        size === item
                          ? "border-[#b8ff00] bg-[#b8ff00] text-black"
                          : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/25"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mt-7">
                <label className="mb-3 block text-xs font-black uppercase tracking-widest text-white/45">
                  {t.quantity}
                </label>

                <div className="flex w-fit items-center rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.max(1, value - 1)
                      )
                    }
                    className="p-3 text-white/45 hover:text-white"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="min-w-12 text-center text-sm font-black">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(10, value + 1)
                      )
                    }
                    className="p-3 text-white/45 hover:text-white"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {/* INPUTS */}
              <div className="mt-7 grid gap-3">
                <input
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  placeholder={t.name}
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#b8ff00]/50"
                />

                <input
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  placeholder={t.phone}
                  type="tel"
                  dir="ltr"
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#b8ff00]/50"
                />

                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  placeholder={t.address}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#b8ff00]/50"
                />

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateField("notes", e.target.value)
                  }
                  placeholder={`${t.notes} — ${t.optional}`}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#b8ff00]/50"
                />
              </div>

              {/* SUMMARY */}
              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/35">
                      {t.total}
                    </p>

                    <p className="mt-1 text-sm text-white/50">
                      {size} × {quantity}
                    </p>
                  </div>

                  <div className="text-3xl font-black">
                    {total} EGP
                  </div>
                </div>

                <button
                  type="button"
                  onClick={sendOrder}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#b8ff00] px-6 py-5 text-sm font-black text-black transition hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(184,255,0,0.15)]"
                >
                  <ShoppingBag size={19} />
                  {t.complete}
                  <ArrowRight size={18} />
                </button>

                <p className="mt-4 text-center text-[11px] text-white/25">
                  {t.whatsappNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07] bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:px-8 md:flex-row">
          <Image
            src="/logo.svg"
            alt="FLEX"
            width={150}
            height={50}
            className="w-[130px]"
          />

          <p className="text-center text-xs text-white/25">
            © {new Date().getFullYear()} FLEX Performance.{" "}
            {t.footer}
          </p>

          <button
            onClick={() =>
              setLang(arabic ? "en" : "ar")
            }
            className="flex items-center gap-2 text-xs font-bold text-white/35 transition hover:text-[#b8ff00]"
          >
            <Globe size={15} />
            {arabic ? "English" : "العربية"}
            <ChevronDown size={13} />
          </button>
        </div>
      </footer>
    </main>
  );
}
