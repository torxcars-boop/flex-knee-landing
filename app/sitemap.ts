import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://flex-knee-landing.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  if (!supabaseUrl || !supabaseAnonKey) {
    return staticPages;
  }

  try {
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    const [{ data: products }, { data: categories }] =
      await Promise.all([
        supabase
          .from("products")
          .select("id, updated_at, active")
          .eq("active", true),

        supabase
          .from("categories")
          .select("slug, updated_at, active")
          .eq("active", true),
      ]);

    const productPages: MetadataRoute.Sitemap =
      (products || [])
        .filter((product) => product.id)
        .map((product) => ({
          url: `${SITE_URL}/products/${product.id}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));

    const categoryPages: MetadataRoute.Sitemap =
      (categories || [])
        .filter((category) => category.slug)
        .map((category) => ({
          url: `${SITE_URL}/category/${category.slug}`,
          lastModified: category.updated_at
            ? new Date(category.updated_at)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));

    return [
      ...staticPages,
      ...categoryPages,
      ...productPages,
    ];
  } catch (error) {
    console.error("SITEMAP ERROR:", error);

    return staticPages;
  }
}
