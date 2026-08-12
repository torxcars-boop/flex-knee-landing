import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  size: string | null;
  quantity: number;
  image_url: string | null;
};

type CreateOrderBody = {
  customer_name: string;
  customer_phone: string;
  customer_governorate: string;
  customer_address: string;
  customer_notes?: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;

    if (
      !body.customer_name?.trim() ||
      !body.customer_phone?.trim() ||
      !body.customer_governorate?.trim() ||
      !body.customer_address?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "بيانات العميل غير مكتملة.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "السلة فارغة.",
        },
        { status: 400 }
      );
    }

    const subtotal = Number(body.subtotal);
    const shipping = Number(body.shipping ?? 0);
    const total = Number(body.total);

    if (
      !Number.isFinite(subtotal) ||
      !Number.isFinite(shipping) ||
      !Number.isFinite(total)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "قيمة الطلب غير صحيحة.",
        },
        { status: 400 }
      );
    }

    const orderItems = body.items.map((item) => ({
      product_id: String(item.product_id),
      name: String(item.name),
      price: Number(item.price),
      size: item.size || null,
      quantity: Number(item.quantity),
      image_url: item.image_url || null,
    }));

    const { data, error } = await supabaseServer
      .from("orders")
      .insert({
        customer_name: body.customer_name.trim(),
        customer_phone: body.customer_phone.trim(),
        customer_governorate: body.customer_governorate.trim(),
        customer_address: body.customer_address.trim(),
        customer_notes: body.customer_notes?.trim() || null,
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("CREATE ORDER ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message || "تعذر إنشاء الطلب.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      message: "تم إنشاء الطلب بنجاح.",
    });
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ غير متوقع.",
      },
      { status: 500 }
    );
  }
}
