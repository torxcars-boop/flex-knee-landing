import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawIds = url.searchParams.get("ids") || "";

    const ids = Array.from(
      new Set(
        rawIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      )
    ).slice(0, 12);

    if (ids.length === 0) {
      return NextResponse.json({
        products: [],
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,price,old_price,image_url"
      )
      .eq("active", true)
      .in("id", ids)
      .gt("stock", 0);

    if (error) {
      console.error(
        "AI SEARCH PRODUCT LOAD ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Could not load search products.",
        },
        { status: 500 }
      );
    }

    const productMap = new Map(
      (data || []).map((product) => [
        product.id,
        product,
      ])
    );

    const orderedProducts = ids
      .map((id) => productMap.get(id))
      .filter(Boolean);

    return NextResponse.json({
      products: orderedProducts,
    });
  } catch (error) {
    console.error(
      "AI SEARCH PRODUCTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not load search products.",
      },
      { status: 500 }
    );
  }
}
