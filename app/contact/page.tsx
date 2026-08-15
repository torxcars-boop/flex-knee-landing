import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "201115491611";

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <main dir="rtl" className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-2xl font-black">
            FLEX
          </Link>

          <Link
            href="/"
            className="text-sm font-bold text-white/50 transition hover:text-white"
          >
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="text-xs font-bold tracking-[0.2em] text-[#b6ff00]">
          CONTACT
        </div>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          تواصل معنا
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-8 text-white/50 sm:text-base">
          إذا كان لديك سؤال عن المنتجات أو الطلبات أو الشحن، يمكنك
          التواصل معنا مباشرة.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#b6ff00]/40"
          >
            <MessageCircle
              size={28}
              className="text-[#b6ff00]"
            />

            <h2 className="mt-5 text-xl font-black">
              واتساب
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/40">
              تواصل معنا مباشرة عبر واتساب للاستفسارات والطلبات.
            </p>

            <div className="mt-5 text-sm font-bold text-[#b6ff00]">
              بدء المحادثة
            </div>
          </a>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-xl font-black">
              خدمة العملاء
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/40">
              يمكنك استخدام وسيلة التواصل المتاحة على الموقع
              للاستفسار عن طلبك أو المنتج الذي ترغب في شرائه.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[#b6ff00] px-6 py-4 font-black text-black"
          >
            العودة للمتجر
          </Link>
        </div>
      </section>
    </main>
  );
}
