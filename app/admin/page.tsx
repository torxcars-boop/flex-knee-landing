"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit3,
  LogOut,
  Upload,
  X,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Package,
  Languages,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;

  name: string | null;
  name_ar: string | null;
  name_en: string | null;

  description: string | null;
  description_ar: string | null;
  description_en: string | null;

  price: number;
  old_price: number | null;

  category: string | null;
  category_ar: string | null;
  category_en: string | null;

  image_url: string | null;

  sizes: string[] | null;
  features: string[] | null;

  stock: number;
  active: boolean;

  created_at: string;
};

type ProductForm = {
  name_ar: string;
  name_en: string;

  description_ar: string;
  description_en: string;

  category_ar: string;
  category_en: string;

  price: string;
  old_price: string;

  sizes: string;
  features: string;

  stock: string;
  image_url: string;

  active: boolean;
};

const emptyForm: ProductForm = {
  name_ar: "",
  name_en: "",

  description_ar: "",
  description_en: "",

  category_ar: "",
  category_en: "",

  price: "",
  old_price: "",

  sizes: "",
  features: "",

  stock: "0",
  image_url: "",

  active: true,
};

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data } =
      await supabase.auth.getSession();

    if (!data.session) {
      router.replace("/admin/login");
      return;
    }

    await loadProducts();
  }

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    router.replace("/admin/login");
  }

  function updateField(
    field: keyof ProductForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startCreate() {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setSelectedFile(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startEdit(product: Product) {
    setEditingId(product.id);

    setForm({
      name_ar:
        product.name_ar ||
        product.name ||
        "",

      name_en:
        product.name_en ||
        product.name ||
        "",

      description_ar:
        product.description_ar ||
        product.description ||
        "",

      description_en:
        product.description_en ||
        product.description ||
        "",

      category_ar:
        product.category_ar ||
        product.category ||
        "",

      category_en:
        product.category_en ||
        product.category ||
        "",

      price: String(product.price ?? ""),

      old_price:
        product.old_price !== null &&
        product.old_price !== undefined
          ? String(product.old_price)
          : "",

      sizes: (product.sizes || []).join(","),

      features: (product.features || []).join(","),

      stock: String(product.stock ?? 0),

      image_url:
        product.image_url || "",

      active: product.active,
    });

    setSelectedFile(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelForm() {
    setShowForm(false);

    setEditingId(null);

    setSelectedFile(null);

    setForm({
      ...emptyForm,
    });
  }

  async function uploadImage(file: File) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("products")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (error) {
      throw error;
    }

    const { data } =
      supabase.storage
        .from("products")
        .getPublicUrl(fileName);

    return data.publicUrl;
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("من فضلك اختر ملف صورة فقط.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert(
        "حجم الصورة يجب ألا يتجاوز 8 ميجابايت."
      );
      return;
    }

    setSelectedFile(file);
  }

  async function saveProduct(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name_ar.trim()) {
      alert("اكتب اسم المنتج باللغة العربية.");
      return;
    }

    if (!form.name_en.trim()) {
      alert("اكتب اسم المنتج باللغة الإنجليزية.");
      return;
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      alert("اكتب سعرًا صحيحًا للمنتج.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image_url;

      if (selectedFile) {
        setUploading(true);

        imageUrl =
          await uploadImage(selectedFile);

        setUploading(false);
      }

      const sizes = form.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const features = form.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const productData = {
        name_ar: form.name_ar.trim(),
        name_en: form.name_en.trim(),

        description_ar:
          form.description_ar.trim(),

        description_en:
          form.description_en.trim(),

        category_ar:
          form.category_ar.trim(),

        category_en:
          form.category_en.trim(),

        price: Number(form.price),

        old_price: form.old_price
          ? Number(form.old_price)
          : null,

        sizes,

        features,

        stock:
          Number(form.stock) || 0,

        image_url: imageUrl || null,

        active: form.active,

        // التوافق مع البيانات القديمة
        name: form.name_en.trim(),

        description:
          form.description_en.trim(),

        category:
          form.category_en.trim(),
      };

      if (editingId) {
        const { error } =
          await supabase
            .from("products")
            .update(productData)
            .eq("id", editingId);

        if (error) {
          throw error;
        }

        alert("تم تحديث المنتج بنجاح.");
      } else {
        const { error } =
          await supabase
            .from("products")
            .insert(productData);

        if (error) {
          throw error;
        }

        alert("تمت إضافة المنتج بنجاح.");
      }

      cancelForm();

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        "حدث خطأ أثناء حفظ المنتج. تأكد من إعدادات Supabase وصلاحيات قاعدة البيانات والتخزين."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function deleteProduct(
    product: Product
  ) {
    const productName =
      product.name_ar ||
      product.name_en ||
      product.name ||
      "هذا المنتج";

    const firstConfirm =
      window.confirm(
        `هل أنت متأكد من حذف "${productName}"؟\n\nسيتم حذف المنتج من المتجر.`
      );

    if (!firstConfirm) {
      return;
    }

    const secondConfirm =
      window.confirm(
        `تأكيد نهائي\n\nهل تريد بالفعل حذف "${productName}" نهائيًا؟`
      );

    if (!secondConfirm) {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

      if (error) {
        throw error;
      }

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );

      alert("تم حذف المنتج بنجاح.");
    } catch (error) {
      console.error(error);

      alert(
        "تعذر حذف المنتج. تحقق من صلاحيات الحذف في Supabase."
      );
    }
  }

  async function toggleProduct(
    product: Product
  ) {
    const { error } =
      await supabase
        .from("products")
        .update({
          active: !product.active,
        })
        .eq("id", product.id);

    if (error) {
      console.error(error);

      alert(
        "تعذر تغيير حالة المنتج."
      );

      return;
    }

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              active: !item.active,
            }
          : item
      )
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#050505] text-white"
    >
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-black">
              STORE
              <span className="text-[#b6ff00]">
                ADMIN
              </span>
            </div>

            <div className="mt-1 text-xs text-white/30">
              إدارة المنتجات والمتجر
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startCreate}
              className="flex items-center gap-2 rounded-xl bg-[#b6ff00] px-4 py-3 text-sm font-black text-black transition hover:scale-105"
            >
              <Plus size={18} />

              <span className="hidden sm:inline">
                إضافة منتج
              </span>

              <span className="sm:hidden">
                إضافة
              </span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-white/50 transition hover:border-red-500/30 hover:text-red-300 sm:px-4"
            >
              <LogOut size={17} />

              <span className="hidden sm:block">
                تسجيل الخروج
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        {/* FORM */}

        {showForm && (
          <section className="mb-10 rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl sm:p-8">
            {/* FORM HEADER */}

            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#b6ff00]">
                  <Languages size={17} />

                  {editingId
                    ? "تعديل المنتج"
                    : "منتج جديد"}
                </div>

                <h1 className="text-2xl font-black sm:text-3xl">
                  {editingId
                    ? "تعديل بيانات المنتج"
                    : "إضافة منتج جديد"}
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/30">
                  أدخل بيانات المنتج باللغتين ليظهر
                  المحتوى بالشكل المناسب للزائر.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                className="rounded-full border border-white/10 p-2 text-white/40 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={saveProduct}
              className="space-y-8"
            >
              {/* NAMES */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  أسماء المنتج
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      اسم المنتج بالعربية *
                    </label>

                    <input
                      value={form.name_ar}
                      onChange={(e) =>
                        updateField(
                          "name_ar",
                          e.target.value
                        )
                      }
                      placeholder="مثال: دعامة ركبة احترافية"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Product name in English *
                    </label>

                    <input
                      value={form.name_en}
                      onChange={(e) =>
                        updateField(
                          "name_en",
                          e.target.value
                        )
                      }
                      placeholder="Example: Premium Knee Support"
                      dir="ltr"
                      className="admin-input text-left"
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTIONS */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  وصف المنتج
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      الوصف بالعربية
                    </label>

                    <textarea
                      value={form.description_ar}
                      onChange={(e) =>
                        updateField(
                          "description_ar",
                          e.target.value
                        )
                      }
                      rows={5}
                      placeholder="اكتب وصفًا احترافيًا للمنتج..."
                      className="admin-input resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Description in English
                    </label>

                    <textarea
                      value={form.description_en}
                      onChange={(e) =>
                        updateField(
                          "description_en",
                          e.target.value
                        )
                      }
                      rows={5}
                      placeholder="Write a professional product description..."
                      dir="ltr"
                      className="admin-input resize-none text-left"
                    />
                  </div>
                </div>
              </div>

              {/* CATEGORIES */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  التصنيف
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      التصنيف بالعربية
                    </label>

                    <input
                      value={form.category_ar}
                      onChange={(e) =>
                        updateField(
                          "category_ar",
                          e.target.value
                        )
                      }
                      placeholder="مثال: مستلزمات رياضية"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Category in English
                    </label>

                    <input
                      value={form.category_en}
                      onChange={(e) =>
                        updateField(
                          "category_en",
                          e.target.value
                        )
                      }
                      placeholder="Example: Sports Equipment"
                      dir="ltr"
                      className="admin-input text-left"
                    />
                  </div>
                </div>
              </div>

              {/* PRICE */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  السعر والمخزون
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      السعر *
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        updateField(
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      السعر القديم
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.old_price}
                      onChange={(e) =>
                        updateField(
                          "old_price",
                          e.target.value
                        )
                      }
                      placeholder="اختياري"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      المخزون
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) =>
                        updateField(
                          "stock",
                          e.target.value
                        )
                      }
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>

              {/* SIZES + FEATURES */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  مواصفات المنتج
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      المقاسات
                    </label>

                    <input
                      value={form.sizes}
                      onChange={(e) =>
                        updateField(
                          "sizes",
                          e.target.value
                        )
                      }
                      placeholder="S,M,L,XL,XXL"
                      dir="ltr"
                      className="admin-input text-left"
                    />

                    <p className="mt-2 text-xs text-white/25">
                      افصل كل مقاس بفاصلة.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      المميزات
                    </label>

                    <input
                      value={form.features}
                      onChange={(e) =>
                        updateField(
                          "features",
                          e.target.value
                        )
                      }
                      placeholder="جودة عالية,خفيف,مريح"
                      className="admin-input"
                    />

                    <p className="mt-2 text-xs text-white/25">
                      افصل كل ميزة بفاصلة.
                    </p>
                  </div>
                </div>
              </div>

              {/* IMAGE */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  صورة المنتج
                </div>

                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 sm:p-6">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 px-5 py-10 transition hover:border-[#b6ff00]/40 hover:bg-[#b6ff00]/[0.02]">
                    <Upload
                      size={30}
                      className="mb-3 text-[#b6ff00]"
                    />

                    <span className="text-center font-bold">
                      {selectedFile
                        ? selectedFile.name
                        : "اختر صورة المنتج"}
                    </span>

                    <span className="mt-2 text-center text-xs text-white/30">
                      PNG / JPG / WEBP — حتى 8MB
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {form.image_url &&
                    !selectedFile && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black">
                        <img
                          src={form.image_url}
                          alt="Product preview"
                          className="h-64 w-full object-contain"
                        />
                      </div>
                    )}

                  {selectedFile && (
                    <div className="mt-4 rounded-xl border border-[#b6ff00]/20 bg-[#b6ff00]/5 p-4 text-sm text-[#b6ff00]">
                      تم اختيار صورة جديدة:
                      <span className="mr-2 font-bold">
                        {selectedFile.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIVE */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      updateField(
                        "active",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-[#b6ff00]"
                  />

                  <div>
                    <div className="text-sm font-bold">
                      إظهار المنتج في المتجر
                    </div>

                    <div className="mt-1 text-xs text-white/30">
                      عند إلغاء التفعيل سيظل المنتج محفوظًا
                      في لوحة الإدارة ولكنه لن يظهر للزوار.
                    </div>
                  </div>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      {uploading
                        ? "جاري رفع الصورة..."
                        : "جاري الحفظ..."}
                    </>
                  ) : (
                    <>
                      <Save size={19} />

                      {editingId
                        ? "حفظ التعديلات"
                        : "إضافة المنتج"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={cancelForm}
                  className="rounded-xl border border-white/10 px-8 py-4 font-bold text-white/50 transition hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PRODUCTS HEADER */}

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-black tracking-[0.2em] text-[#b6ff00]">
              PRODUCTS
            </div>

            <h2 className="text-3xl font-black">
              المنتجات
            </h2>

            <p className="mt-2 text-sm text-white/30">
              إدارة المنتجات المعروضة في المتجر.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/50">
            <Package size={17} />

            {products.length}
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-[#0a0a0a]">
            <Loader2
              size={30}
              className="animate-spin text-[#b6ff00]"
            />
          </div>
        ) : products.length === 0 ? (
          /* EMPTY */

          <div className="rounded-3xl border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-20 text-center">
            <Package
              size={42}
              className="mx-auto mb-5 text-white/15"
            />

            <h3 className="text-xl font-black">
              لا توجد منتجات
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
              ابدأ بإضافة أول منتج إلى المتجر.
            </p>

            <button
              type="button"
              onClick={startCreate}
              className="mt-6 rounded-xl bg-[#b6ff00] px-6 py-3 font-black text-black transition hover:scale-105"
            >
              إضافة أول منتج
            </button>
          </div>
        ) : (
          /* PRODUCTS */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const productName =
                product.name_ar ||
                product.name_en ||
                product.name ||
                "منتج";

              return (
                <article
                  key={product.id}
                  className={`overflow-hidden rounded-3xl border bg-[#0a0a0a] transition ${
                    product.active
                      ? "border-white/10"
                      : "border-red-500/20 opacity-60"
                  }`}
                >
                  {/* IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-black">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={productName}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/20">
                        <div className="text-center">
                          <Package
                            size={32}
                            className="mx-auto mb-3"
                          />
                          لا توجد صورة
                        </div>
                      </div>
                    )}

                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          product.active
                            ? "bg-[#b6ff00] text-black"
                            : "bg-red-500/80 text-white"
                        }`}
                      >
                        {product.active
                          ? "نشط"
                          : "مخفي"}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-5">
                    <div className="text-xs font-bold text-[#b6ff00]">
                      {product.category_ar ||
                        product.category_en ||
                        product.category ||
                        "بدون تصنيف"}
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-xl font-black">
                      {productName}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-white/35">
                      {product.description_ar ||
                        product.description_en ||
                        product.description ||
                        "لا يوجد وصف لهذا المنتج."}
                    </p>

                    {/* PRICE */}

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-[#b6ff00]">
                          {Number(
                            product.price
                          ).toLocaleString("ar-EG")}
                        </span>

                        <span className="mr-1 text-xs text-white/30">
                          جنيه
                        </span>

                        {product.old_price &&
                          product.old_price >
                            product.price && (
                            <div className="text-xs text-white/25 line-through">
                              {Number(
                                product.old_price
                              ).toLocaleString(
                                "ar-EG"
                              )}{" "}
                              جنيه
                            </div>
                          )}
                      </div>

                      <div className="text-xs text-white/30">
                        المخزون:{" "}
                        {product.stock ?? 0}
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(product)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/65 transition hover:border-white/30 hover:text-white"
                      >
                        <Edit3 size={16} />
                        تعديل
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleProduct(product)
                        }
                        className="rounded-xl border border-white/10 px-3 text-white/50 transition hover:text-[#b6ff00]"
                        title={
                          product.active
                            ? "إخفاء المنتج"
                            : "إظهار المنتج"
                        }
                      >
                        {product.active ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(product)
                        }
                        className="rounded-xl border border-red-500/10 px-3 text-red-400/60 transition hover:border-red-500/30 hover:text-red-400"
                        title="حذف المنتج"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 1rem;
          color: white;
          outline: none;
          transition: 0.2s;
        }

        .admin-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .admin-input:focus {
          border-color: rgba(182, 255, 0, 0.6);
          background: rgba(255, 255, 255, 0.055);
        }

        textarea.admin-input {
          line-height: 1.8;
        }

        input[type="number"] {
          direction: ltr;
          text-align: left;
        }
      `}</style>
    </main>
  );
}
