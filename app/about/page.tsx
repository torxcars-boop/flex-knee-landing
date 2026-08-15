import Link from "next/link";

export default function AboutPage() {
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
          ABOUT FLEX
        </div>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          من نحن
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-8 text-white/60 sm:text-base">
          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              عن FLEX
            </h2>

            <p>
              FLEX هو متجر إلكتروني يهدف إلى تقديم منتجات مختارة بطريقة
              واضحة وسهلة، مع توفير تجربة شراء بسيطة وسريعة للعملاء.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              هدفنا
            </h2>

            <p>
              نعمل على تقديم تجربة استخدام مريحة، ومعلومات واضحة عن
              المنتجات، وطريقة سهلة لإرسال طلبات الشراء والتواصل مع
              العملاء.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              تجربة العملاء
            </h2>

            <p>
              نحرص على أن تكون عملية تصفح المنتجات واختيارها وإرسال
              الطلبات مباشرة وواضحة قدر الإمكان.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[#b6ff00] px-6 py-4 font-black text-black transition hover:scale-[1.01]"
          >
            تصفح المتجر
          </Link>
        </div>
      </section>
    </main>
  );
}
