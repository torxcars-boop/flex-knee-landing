import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  category_id: string | null;
  image_url: string | null;
  stock: number;
};

type AIResult = {
  productIds: string[];
  answer: string;
};

type SearchIntent = {
  keywords: string[];
  maxPrice: number | null;
  minPrice: number | null;
  wantsCheapest: boolean;
  wantsDiscount: boolean;
  wantsAvailableOnly: boolean;
};

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Premium Store AI Search",
    },
  });
}

/*
 * تنظيف النص قبل إرساله للـ AI.
 * الهدف ليس تغيير معنى كلام العميل،
 * وإنما إزالة بعض الاختلافات الشائعة في الكتابة.
 */
function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * استخراج بعض القيود الواضحة من كلام العميل.
 *
 * هذا لا يستبدل الـAI.
 * هو طبقة أمان إضافية حتى لا يرشح الـAI منتجًا
 * خارج الميزانية المطلوبة.
 */
function extractSearchIntent(
  query: string
): SearchIntent {
  const normalized = normalizeSearchText(
    query.toLowerCase()
  );

  let maxPrice: number | null = null;
  let minPrice: number | null = null;

  const underMatch = normalized.match(
    /(?:اقل من|أقل من|تحت|حد اقصى|حد أقصى|maximum|max|under|below|less than)\s*(\d+(?:\.\d+)?)/
  );

  if (underMatch) {
    maxPrice = Number(underMatch[1]);
  }

  const rangeMatch = normalized.match(
    /(?:من|between)\s*(\d+(?:\.\d+)?)\s*(?:ل|الى|إلى|and|to|-)\s*(\d+(?:\.\d+)?)/
  );

  if (rangeMatch) {
    const first = Number(rangeMatch[1]);
    const second = Number(rangeMatch[2]);

    minPrice = Math.min(first, second);
    maxPrice = Math.max(first, second);
  }

  const aroundMatch = normalized.match(
    /(?:في حدود|حدود|حوالي|around|about)\s*(\d+(?:\.\d+)?)/
  );

  if (aroundMatch) {
    const value = Number(aroundMatch[1]);

    minPrice = Math.max(0, value * 0.8);
    maxPrice = value * 1.2;
  }

  const wantsCheapest =
    /ارخص|أرخص|رخيص|الأقل|الاقل|cheapest|cheaper|lowest|cheap/.test(
      normalized
    );

  const wantsDiscount =
    /خصم|تخفيض|عرض|عروض|discount|sale|offer|offers/.test(
      normalized
    );

  const wantsAvailableOnly =
    /متاح|موجود|متوفر|available|in stock/.test(
      normalized
    );

  return {
    keywords: normalized
      .split(/\s+/)
      .filter((word) => word.length >= 2)
      .slice(0, 40),

    maxPrice,
    minPrice,

    wantsCheapest,
    wantsDiscount,
    wantsAvailableOnly,
  };
}

function priceMatchesIntent(
  product: Product,
  intent: SearchIntent
) {
  const price = Number(product.price);

  if (
    intent.maxPrice !== null &&
    price > intent.maxPrice
  ) {
    return false;
  }

  if (
    intent.minPrice !== null &&
    price < intent.minPrice
  ) {
    return false;
  }

  return true;
}

function buildCatalog(products: Product[]) {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    old_price:
      product.old_price === null
        ? null
        : Number(product.old_price),
    category: product.category,
    stock: product.stock,
  }));
}

function createSystemPrompt(language: "ar" | "en") {
  if (language === "ar") {
    return `
أنت مساعد بحث ذكي ومتخصص داخل متجر إلكتروني.

مهمتك هي فهم ما يريده العميل ثم اختيار المنتجات
الأكثر ملاءمة من الكتالوج المرسل لك.

أنت لا تبحث على الإنترنت.
أنت لا تملك أي منتجات غير الموجودة في الكتالوج.

========================
أولاً: فهم مقصد العميل
========================

لا تعتمد على تطابق الكلمات حرفيًا.

افهم معنى الطلب حتى لو كان:

- باللهجة المصرية.
- باللغة العربية الفصحى.
- مكتوبًا بأخطاء إملائية.
- مكتوبًا بسرعة أو بطريقة غير مرتبة.
- عربي + English.
- Arabizi / Franco Arabic.
- يستخدم كلمات عامية.
- لا يحتوي على اسم المنتج بشكل مباشر.
- يصف استخدام المنتج بدل اسمه.
- يذكر ميزانية أو نطاق سعري.

أمثلة:

"عايز حاجه رخيصه"
"محتاج حاجة للبيت"
"عايز حاجة اقل من 300"
"هاتلي حاجة في حدود 500"
"عايز ارخص حاجة"
"فيه عروض؟"
"محتاج هدية"
"عايز حاجة للشغل"
"عايز حاجة عملية"
"عايز حاجة كويسة ومش غالية"
"3ayz haga r5esa"
"3ayz haga lel beit"

يجب أن تحاول فهم المقصود وليس مجرد البحث عن نفس الكلمات.

========================
ثانيًا: التعامل مع الأخطاء
========================

تعامل مع الأخطاء الشائعة مثل:

منتج / منتجج
حاجه / حاجة
رخيصه / رخيصة
عروض / عرض
هديه / هدية
مناسب / مناسبه
البيت / للبيت
شغل / للشغل

وكذلك اختلاف كتابة الكلمات الإنجليزية.

========================
ثالثًا: الأسعار
========================

افهم:

"أقل من 300"
"تحت 500"
"بحد أقصى 1000"
"من 200 لـ 500"
"بين 200 و500"
"في حدود 500"
"حوالي 500"
"أرخص حاجة"
"أغلى حاجة"

إذا طلب العميل حدًا سعريًا واضحًا،
لا ترشح منتجًا يتجاوز الحد.

========================
رابعًا: اختيار المنتجات
========================

رتب المنتجات حسب مدى مناسبتها للطلب.

الأولوية:

1. المنتج الذي يطابق مقصد العميل مباشرة.
2. المنتج الذي يطابق الاستخدام المطلوب.
3. المنتج الذي يطابق الصفات المطلوبة.
4. المنتج الذي يطابق الميزانية.
5. المنتج القريب منطقيًا إذا لم يوجد تطابق كامل.

لا تعرض عددًا كبيرًا من النتائج.

يفضل اختيار أفضل 3 إلى 6 منتجات فقط.

========================
خامسًا: منع الاختراع
========================

ممنوع تمامًا:

- اختراع منتج.
- اختراع سعر.
- اختراع لون.
- اختراع مقاس.
- اختراع خامة.
- اختراع وظيفة.
- اختراع خصائص غير موجودة.
- اختراع خصم.
- اختراع توفر.

استخدم فقط المعلومات الموجودة في الكتالوج.

========================
سادسًا: إذا لم تجد تطابقًا
========================

إذا لم تجد منتجًا مناسبًا فعلًا:

productIds يجب أن تكون [].

وفي answer أخبر العميل باختصار أنه لم تجد تطابقًا مناسبًا.

لا تحاول إجبار منتج غير مناسب على الظهور.

========================
سابعًا: الأسئلة الغامضة
========================

إذا كان الطلب عامًا جدًا مثل:

"عايز حاجة"
"محتاج منتج"
"هاتلي حاجة كويسة"

يمكنك عرض أفضل المنتجات المتاحة.

أما إذا كان الطلب يحتوي على تفضيل واضح،
يجب احترامه.

========================
ثامنًا: الإجابة
========================

الرد يجب أن يكون قصيرًا وطبيعيًا.

مثال:

"لقيت لك شوية منتجات مناسبة لطلبك."

أو:

"دي أقرب المنتجات لميزانيتك وطلبك."

لا تذكر أنك نموذج AI.

لا تقل إنك استخدمت الإنترنت.

لا تشرح طريقة عمل النظام.

========================
الإخراج
========================

يجب أن ترجع JSON فقط:

{
  "productIds": ["id1", "id2"],
  "answer": "رد قصير للعميل"
}

لا تضع Markdown.
لا تضع code fences.
لا تضع أي كلام خارج JSON.
`;
  }

  return `
You are an intelligent product search assistant inside an online store.

Your job is to understand the customer's intent and select
the most relevant products from the provided catalog.

You do NOT search the internet.
You may ONLY use products contained in the catalog.

========================
UNDERSTAND CUSTOMER INTENT
========================

Do not rely on exact keyword matching.

Understand the meaning even when the customer:

- Uses informal language.
- Makes spelling mistakes.
- Mixes Arabic and English.
- Uses Arabizi / Franco Arabic.
- Describes a use case instead of the product name.
- Does not know the exact product name.
- Includes a budget.
- Writes an incomplete sentence.

Examples:

"I need something cheap"
"something for my home"
"under 300"
"around 500"
"between 200 and 500"
"cheapest"
"anything on sale"
"something useful for work"
"3ayz haga r5esa"

========================
PRICE UNDERSTANDING
========================

Understand:

"under 300"
"below 500"
"maximum 1000"
"between 200 and 500"
"around 500"
"cheapest"

If the customer specifies a clear maximum price,
DO NOT recommend products above that price.

========================
PRODUCT MATCHING
========================

Rank products by relevance.

Priority:

1. Direct intent match.
2. Use-case match.
3. Attribute match.
4. Budget match.
5. Closest logical alternative.

Return only the best 3 to 6 products.

========================
NO HALLUCINATION
========================

Never invent:

- Products.
- Prices.
- Colors.
- Sizes.
- Materials.
- Features.
- Discounts.
- Availability.

Only use information contained in the catalog.

========================
NO MATCH
========================

If there is no suitable product:

productIds MUST be [].

Do not force an unrelated product into the results.

========================
VAGUE REQUESTS
========================

For requests like:

"I need something"
"I need a product"
"show me something good"

You may return a few of the best available products.

========================
ANSWER
========================

Keep the answer short and natural.

Example:

"I found a few products that match your request."

Do not mention that you are an AI model.
Do not claim to have searched the internet.
Do not explain your internal process.

========================
OUTPUT
========================

Return JSON only:

{
  "productIds": ["id1", "id2"],
  "answer": "Short helpful answer"
}

No Markdown.
No code fences.
No text outside JSON.
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const query =
      typeof body?.query === "string"
        ? body.query.trim()
        : "";

    const language =
      body?.language === "en" ? "en" : "ar";

    if (!query) {
      return NextResponse.json(
        {
          error:
            language === "ar"
              ? "اكتب ما الذي تبحث عنه."
              : "Please describe what you are looking for.",
        },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        {
          error:
            language === "ar"
              ? "البحث طويل جدًا."
              : "Search query is too long.",
        },
        { status: 400 }
      );
    }

    /*
     * تحميل المنتجات المتاحة فقط
     */
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,description,price,old_price,category,category_id,image_url,stock"
      )
      .eq("active", true)
      .gt("stock", 0)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "AI SEARCH PRODUCTS ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            language === "ar"
              ? "تعذر تحميل المنتجات."
              : "Could not load products.",
        },
        { status: 500 }
      );
    }

    const products = (data || []) as Product[];

    if (products.length === 0) {
      return NextResponse.json({
        productIds: [],
        answer:
          language === "ar"
            ? "لا توجد منتجات متاحة حاليًا."
            : "There are no products available right now.",
      });
    }

    /*
     * فهم بعض القيود الواضحة من السؤال.
     */
    const intent = extractSearchIntent(query);

    /*
     * لو العميل حدد ميزانية واضحة،
     * نرسل للـAI المنتجات التي تحقق الميزانية
     * بالإضافة إلى المنتجات المتاحة عمومًا كمرجع.
     *
     * وفي النهاية نتحقق مرة أخرى من الأسعار.
     */
    let candidateProducts = products;

    if (
      intent.maxPrice !== null ||
      intent.minPrice !== null
    ) {
      const filtered = products.filter(
        (product) =>
          priceMatchesIntent(product, intent)
      );

      /*
       * إذا لم نجد أي منتج داخل الميزانية،
       * نرسل الكتالوج الكامل للـAI حتى يستطيع
       * إخبار العميل بأنه لا يوجد تطابق مناسب.
       */
      if (filtered.length > 0) {
        candidateProducts = filtered;
      }
    }

    /*
     * لو العميل طلب الأرخص،
     * نرتب المنتجات من الأرخص للأغلى.
     */
    if (intent.wantsCheapest) {
      candidateProducts = [
        ...candidateProducts,
      ].sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    /*
     * تقليل حجم البيانات المرسلة للـAI.
     *
     * لا نحتاج إرسال الصورة أو category_id
     * لأن البحث يعتمد على البيانات النصية والسعر.
     */
    const catalog = buildCatalog(
      candidateProducts.slice(0, 250)
    );

    const client = getOpenRouterClient();

    const systemPrompt =
      createSystemPrompt(language);

    const normalizedQuery =
      normalizeSearchText(query);

    const response =
      await client.responses.create({
        model: "openai/gpt-oss-20b:free",
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `
Customer original request:
${query}

Normalized request:
${normalizedQuery}

Detected search information:
${JSON.stringify(intent)}

Product catalog:
${JSON.stringify(catalog)}
`,
          },
        ],
      });

    const output =
      response.output_text?.trim() || "";

    if (!output) {
      console.error(
        "AI SEARCH EMPTY RESPONSE"
      );

      return NextResponse.json(
        {
          error:
            language === "ar"
              ? "لم يرجع الذكاء الاصطناعي نتيجة."
              : "The AI returned an empty response.",
        },
        { status: 502 }
      );
    }

    /*
     * محاولة قراءة JSON.
     */
    let result: AIResult;

    try {
      result = JSON.parse(output) as AIResult;
    } catch {
      console.error(
        "AI SEARCH INVALID JSON:",
        output
      );

      try {
        const cleaned = output
          .replace(
            /^```json\s*/i,
            ""
          )
          .replace(
            /^```\s*/i,
            ""
          )
          .replace(
            /\s*```$/i,
            ""
          )
          .trim();

        result =
          JSON.parse(cleaned) as AIResult;
      } catch {
        return NextResponse.json(
          {
            error:
              language === "ar"
                ? "تعذر فهم نتيجة البحث."
                : "Could not understand the search result.",
          },
          { status: 502 }
        );
      }
    }

    /*
     * حماية أساسية:
     * لا نسمح للـAI بإرجاع IDs غير موجودة.
     */
    const validProductsById =
      new Map(
        products.map((product) => [
          product.id,
          product,
        ])
      );

    let productIds = Array.isArray(
      result.productIds
    )
      ? result.productIds.filter(
          (id): id is string =>
            typeof id === "string" &&
            validProductsById.has(id)
        )
      : [];

    /*
     * حماية السعر:
     *
     * حتى لو الـAI أخطأ وأعاد منتجًا خارج
     * الميزانية، نحذفه هنا.
     */
    if (
      intent.maxPrice !== null ||
      intent.minPrice !== null
    ) {
      productIds = productIds.filter(
        (id) => {
          const product =
            validProductsById.get(id);

          return product
            ? priceMatchesIntent(
                product,
                intent
              )
            : false;
        }
      );
    }

    /*
     * منع التكرار.
     */
    productIds = [
      ...new Set(productIds),
    ].slice(0, 6);

    /*
     * لو طلب الأرخص، نضمن ترتيب النتائج
     * من الأرخص للأغلى.
     */
    if (intent.wantsCheapest) {
      productIds.sort(
        (a, b) => {
          const productA =
            validProductsById.get(a);

          const productB =
            validProductsById.get(b);

          return (
            Number(
              productA?.price ?? Infinity
            ) -
            Number(
              productB?.price ?? Infinity
            )
          );
        }
      );
    }

    /*
     * لو طلب خصم/عروض،
     * نفضل المنتجات التي لديها old_price.
     */
    if (intent.wantsDiscount) {
      productIds.sort(
        (a, b) => {
          const productA =
            validProductsById.get(a);

          const productB =
            validProductsById.get(b);

          const discountA =
            productA?.old_price &&
            Number(productA.old_price) >
              Number(productA.price);

          const discountB =
            productB?.old_price &&
            Number(productB.old_price) >
              Number(productB.price);

          return (
            Number(Boolean(discountB)) -
            Number(Boolean(discountA))
          );
        }
      );
    }

    let answer =
      typeof result.answer === "string"
        ? result.answer.trim()
        : "";

    /*
     * Fallback للرد.
     */
    if (!answer) {
      if (productIds.length > 0) {
        answer =
          language === "ar"
            ? "لقيت لك بعض المنتجات المناسبة لطلبك."
            : "I found a few products that match your request.";
      } else {
        answer =
          language === "ar"
            ? "لم أجد منتجًا مناسبًا لطلبك حاليًا."
            : "I couldn't find a suitable product for your request.";
      }
    }

    return NextResponse.json({
      productIds,
      answer,
    });
  } catch (error) {
    console.error(
      "AI SEARCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "AI search is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
