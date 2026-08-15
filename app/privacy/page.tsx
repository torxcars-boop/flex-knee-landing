import Link from "next/link";

export default function PrivacyPage() {
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
          PRIVACY POLICY
        </div>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          سياسة الخصوصية
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-8 text-white/60 sm:text-base">
          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              مقدمة
            </h2>

            <p>
              نحترم خصوصية زوار موقع FLEX ونسعى إلى التعامل مع
              المعلومات التي يتم تقديمها من خلال الموقع بطريقة مسؤولة
              وواضحة.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              المعلومات التي قد يتم جمعها
            </h2>

            <p>
              عند إرسال طلب شراء، قد نطلب معلومات مثل الاسم ورقم
              الهاتف والمحافظة والعنوان والملاحظات المتعلقة بالطلب.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              استخدام المعلومات
            </h2>

            <p>
              يتم استخدام المعلومات التي يقدمها العميل بهدف معالجة
              الطلب والتواصل معه بخصوص الطلب والتوصيل وخدمة العملاء.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              ملفات تعريف الارتباط والتقنيات المشابهة
            </h2>

            <p>
              قد يستخدم الموقع تقنيات مثل ملفات تعريف الارتباط
              والتخزين المحلي في المتصفح لتحسين تجربة الاستخدام، مثل
              الاحتفاظ بمحتويات سلة المشتريات.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              الإعلانات
            </h2>

            <p>
              قد يستخدم الموقع خدمات إعلانية تابعة لجهات خارجية
              لعرض الإعلانات. قد تستخدم هذه الجهات تقنيات مثل ملفات
              تعريف الارتباط لتقديم إعلانات أكثر ملاءمة للمستخدمين.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              حماية المعلومات
            </h2>

            <p>
              نتخذ خطوات مناسبة للمساعدة في حماية المعلومات التي يتم
              تقديمها من خلال الموقع، مع العلم أنه لا توجد وسيلة نقل
              أو تخزين إلكترونية يمكن ضمان أمانها بشكل مطلق.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black text-white">
              التغييرات على سياسة الخصوصية
            </h2>

            <p>
              قد يتم تحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي
              تغييرات على هذه الصفحة.
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
