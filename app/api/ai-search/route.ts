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
      "X-Title": "FLEX Premium Store",
    },
  });
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
     * تحميل المنتجات المتاحة من Supabase
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

    /*
     * لا توجد منتجات
     */
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
     * إنشاء كتالوج صغير لإرساله للـ AI
     */
    const catalog = products.map((product) => ({
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

    const client = getOpenRouterClient();

    /*
     * تعليمات الـ AI
     */
    const systemPrompt =
      language === "ar"
        ? `
أنت مساعد بحث ذكي داخل متجر إلكتروني.

مهمتك الوحيدة هي مساعدة العميل في العثور على منتجات
من الكتالوج الذي سيتم إعطاؤه لك.

قواعد مهمة جدًا:

- لا تخترع أي منتج.
- لا تخترع أي سعر.
- لا تخترع خصائص للمنتجات.
- استخدم فقط المنتجات الموجودة في الكتالوج.
- إذا كان الطلب غامضًا اختر المنتجات الأقرب منطقيًا.
- إذا لم يوجد منتج مناسب أرجع productIds فارغة.
- افهم العربية الفصحى.
- افهم اللهجة المصرية.
- افهم الإنجليزية.
- افهم الميزانيات.
- افهم طلبات مثل:
  "أقل من 500"
  "أقل من 1000 جنيه"
  "في حدود 500"
  "أرخص حاجة"
  "منتج رياضي"
  "عايز حاجة للركبة"
- يمكنك الاعتماد فقط على بيانات المنتج الموجودة في الكتالوج.
- لا تقل إنك بحثت في الإنترنت.
- لا تقترح منتجًا غير موجود في الكتالوج.

يجب أن ترجع JSON فقط بهذا الشكل:

{
  "productIds": ["id1", "id2"],
  "answer": "رد قصير ومفيد للعميل"
}

لا تضف أي نص خارج JSON.
`
        : `
You are an intelligent product search assistant
inside an online store.

Your only job is to help customers find products
from the provided catalog.

Important rules:

- Never invent products.
- Never invent prices.
- Never invent product features.
- Use only products from the provided catalog.
- If the request is ambiguous, return the closest relevant products.
- If nothing matches, return an empty productIds array.
- Understand Arabic.
- Understand Egyptian Arabic.
- Understand English.
- Understand budgets.
- Understand requests such as:
  "under 500"
  "under 1000 EGP"
  "around 500"
  "cheapest"
  "sports product"
  "something for the knee"
- Only use information contained in the product catalog.
- Do not claim to have searched the internet.
- Never recommend products outside the catalog.

Return JSON only:

{
  "productIds": ["id1", "id2"],
  "answer": "A short helpful response"
}

Do not return anything outside the JSON.
`;

    /*
     * استدعاء OpenRouter
     */
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b:free",

      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `
Customer request:
${query}

Product catalog:
${JSON.stringify(catalog)}
`,
        },
      ],
    });

    /*
     * استخراج نتيجة الـ AI
     */
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
     * محاولة قراءة JSON
     */
    let result: AIResult;

    try {
      result = JSON.parse(output) as AIResult;
    } catch {
      console.error(
        "AI SEARCH INVALID JSON:",
        output
      );

      /*
       * محاولة تنظيف Markdown JSON
       */
      try {
        const cleaned = output
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        result = JSON.parse(cleaned) as AIResult;
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
     * حماية مهمة:
     * السماح فقط بـ IDs الموجودة فعلًا في Supabase
     */
    const validIds = new Set(
      products.map((product) => product.id)
    );

    const productIds = Array.isArray(
      result.productIds
    )
      ? result.productIds.filter(
          (id): id is string =>
            typeof id === "string" &&
            validIds.has(id)
        )
      : [];

    /*
     * الرد النهائي
     */
    const answer =
      typeof result.answer === "string" &&
      result.answer.trim()
        ? result.answer.trim()
        : language === "ar"
          ? "وجدت لك بعض المنتجات المناسبة."
          : "I found some products that may match your request.";

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
