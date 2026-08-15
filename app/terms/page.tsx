import Link from "next/link";

export default function TermsPage() {
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

      <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="text-xs font-bold tracking-[0.2em] text-[#b6ff00]">
          TERMS & CONDITIONS
        </div>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          الشروط والأحكام
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-8 text-white/60 sm:text-base">
          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              استخدام الموقع
            </h2>

            <p>
              باستخدامك لموقع FLEX، فإنك توافق على استخدام الموقع
              بطريقة قانونية وعدم استخدامه لأي غرض غير مشروع أو
              يضر بالموقع أو مستخدميه.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              المنتجات والأسعار
            </h2>

            <p>
              نسعى إلى عرض معلومات المنتجات والأسعار بصورة واضحة.
              قد تتغير الأسعار أو توفر المنتجات من وقت لآخر دون
              إشعار مسبق.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              الطلبات
            </h2>

            <p>
              إرسال طلب من خلال الموقع لا يعني بالضرورة إتمام عملية
              البيع بشكل نهائي قبل تأكيد الطلب والتفاصيل المتعلقة
              بالتوصيل.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              بيانات العميل
            </h2>

            <p>
              يتحمل العميل مسؤولية تقديم معلومات صحيحة وكاملة عند
              إرسال الطلب، بما في ذلك الاسم ورقم الهاتف والعنوان.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              الشحن والتوصيل
            </h2>

            <p>
              قد تختلف تكلفة ومدة الشحن حسب المحافظة والعنوان
              وطريقة التوصيل. يتم تأكيد تفاصيل الشحن مع العميل عند
              معالجة الطلب.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              المحتوى
            </h2>

            <p>
              جميع النصوص والصور والعناصر الموجودة على الموقع مخصصة
              لاستخدام الموقع ولا يجوز نسخها أو إعادة استخدامها
              بطريقة تنتهك الحقوق المتعلقة بها.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              التعديلات
            </h2>

            <p>
              قد نقوم بتحديث هذه الشروط عند الحاجة. استمرار استخدام
              الموقع بعد نشر التغييرات يعني قبول الشروط المحدثة.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[#b6ff00] px-6 py-4 font-black text-black"
          >
            العودة للمتجر
          </Link>
        </div>
      </article>
    </main>
  );
}
