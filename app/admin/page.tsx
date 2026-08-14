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
  Folder,
  Image as ImageIcon,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

/* =========================================================
   TYPES
========================================================= */

type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
};

type Product = {
  id: string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
  description: string | null;
  description_ar: string | null;
  description_en: string | null;
  category: string | null;
  category_ar: string | null;
  category_en: string | null;
  category_id: string | null;
  price: number;
  old_price: number | null;
  sizes: string[] | null;
  features: string[] | null;
  stock: number;
  image_url: string | null;
  images: string[] | null;
  active: boolean;
  created_at: string;
};

/* =========================================================
   FORMS
========================================================= */

type ProductForm = {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category_id: string;
  price: string;
  old_price: string;
  sizes: string;
  features: string;
  stock: string;
  image_url: string;
  images: string[];
  active: boolean;
};

type CategoryForm = {
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  image_url: string;
};

const emptyProductForm: ProductForm = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  category_id: "",
  price: "",
  old_price: "",
  sizes: "",
  features: "",
  stock: "0",
  image_url: "",
  images: [],
  active: true,
};

const emptyCategoryForm: CategoryForm = {
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  image_url: "",
};

/* =========================================================
   PAGE
========================================================= */

export default function AdminPage() {
  const router = useRouter();

  /* =======================================================
     PRODUCTS
  ======================================================= */

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] =
    useState(true);

  const [savingProduct, setSavingProduct] =
    useState(false);

  const [uploadingProductImages, setUploadingProductImages] =
    useState(false);

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  const [productForm, setProductForm] =
    useState<ProductForm>(emptyProductForm);

  const [selectedProductFiles, setSelectedProductFiles] =
    useState<File[]>([]);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [savingCategory, setSavingCategory] =
    useState(false);

  const [uploadingCategoryImage, setUploadingCategoryImage] =
    useState(false);

  const [showCategoryForm, setShowCategoryForm] =
    useState(false);

  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null);

  const [categoryForm, setCategoryForm] =
    useState<CategoryForm>(emptyCategoryForm);

  const [selectedCategoryFile, setSelectedCategoryFile] =
    useState<File | null>(null);

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    void checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data, error } =
        await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      await Promise.all([
        loadProducts(),
        loadCategories(),
      ]);
    } catch (error) {
      console.error("AUTH ERROR:", error);
      router.replace("/admin/login");
    }
  }

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  async function loadCategories() {
    setCategoriesLoading(true);

    try {
      const { data, error } =
        await supabase
          .from("categories")
          .select(
            "id,name_ar,name_en,slug,description_ar,description_en,image_url"
          )
          .order("name_ar", {
            ascending: true,
          });

      if (error) {
        console.error(
          "LOAD CATEGORIES ERROR:",
          error
        );

        setCategories([]);
        return;
      }

      setCategories(
        (data || []) as Category[]
      );
    } catch (error) {
      console.error(
        "LOAD CATEGORIES ERROR:",
        error
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  async function loadProducts() {
    setProductsLoading(true);

    try {
      const { data, error } =
        await supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        console.error(
          "LOAD PRODUCTS ERROR:",
          error
        );

        setProducts([]);
        return;
      }

      setProducts(
        (data || []) as Product[]
      );
    } catch (error) {
      console.error(
        "LOAD PRODUCTS ERROR:",
        error
      );

      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  /* =======================================================
     GENERATE SLUG
  ======================================================= */

  function generateSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^\p{L}\p{N}\s-]/gu,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /* =======================================================
     UPDATE PRODUCT FIELD
  ======================================================= */

  function updateProductField(
    field: keyof ProductForm,
    value: string | boolean | string[]
  ) {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =======================================================
     UPDATE CATEGORY FIELD
  ======================================================= */

  function updateCategoryField(
    field: keyof CategoryForm,
    value: string
  ) {
    setCategoryForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =======================================================
     CREATE PRODUCT
  ======================================================= */

  function startCreateProduct() {
    setEditingProductId(null);

    setProductForm({
      ...emptyProductForm,
    });

    setSelectedProductFiles([]);

    setShowProductForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     EDIT PRODUCT
  ======================================================= */

  function startEditProduct(
    product: Product
  ) {
    const existingImages =
      product.images &&
      product.images.length > 0
        ? product.images
        : product.image_url
          ? [product.image_url]
          : [];

    setEditingProductId(product.id);

    setProductForm({
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

      category_id:
        product.category_id || "",

      price:
        product.price !== null &&
        product.price !== undefined
          ? String(product.price)
          : "",

      old_price:
        product.old_price !== null &&
        product.old_price !== undefined
          ? String(product.old_price)
          : "",

      sizes:
        (product.sizes || []).join(","),

      features:
        (product.features || []).join(","),

      stock:
        product.stock !== null &&
        product.stock !== undefined
          ? String(product.stock)
          : "0",

      image_url:
        product.image_url || "",

      images:
        existingImages,

      active:
        product.active,
    });

    setSelectedProductFiles([]);
    setShowProductForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     CANCEL PRODUCT
  ======================================================= */

  function cancelProductForm() {
    setShowProductForm(false);

    setEditingProductId(null);

    setSelectedProductFiles([]);

    setProductForm({
      ...emptyProductForm,
    });
  }

  /* =======================================================
     UPLOAD FILE
     
     IMPORTANT:
     - Bucket: products
     - folder: products / categories
  ======================================================= */

  async function uploadFile(
    file: File,
    folder: "products" | "categories"
  ): Promise<string> {
    if (!file) {
      throw new Error(
        "لم يتم اختيار ملف."
      );
    }

    if (!file.type.startsWith("image/")) {
      throw new Error(
        "الملف المختار ليس صورة."
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const safeExtension =
      extension.replace(
        /[^a-z0-9]/g,
        ""
      ) || "jpg";

    let fileId = "";

    try {
      fileId =
        crypto.randomUUID();
    } catch {
      fileId =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}`;
    }

    const fileName =
      `${folder}/${fileId}.${safeExtension}`;

    console.log(
      "UPLOAD START:",
      {
        bucket: "products",
        path: fileName,
        name: file.name,
        type: file.type,
        size: file.size,
      }
    );

    const {
      data,
      error,
    } =
      await supabase.storage
        .from("products")
        .upload(
          fileName,
          file,
          {
            cacheControl: "3600",
            contentType:
              file.type || "image/jpeg",
            upsert: false,
          }
        );

    if (error) {
      console.error(
        "SUPABASE STORAGE UPLOAD ERROR:",
        error
      );

      throw new Error(
        `فشل رفع الصورة: ${error.message}`
      );
    }

    console.log(
      "UPLOAD SUCCESS:",
      data
    );

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("products")
        .getPublicUrl(
          fileName
        );

    if (
      !publicUrlData?.publicUrl
    ) {
      throw new Error(
        "تم رفع الصورة ولكن لم يتم الحصول على الرابط العام."
      );
    }

    console.log(
      "PUBLIC URL:",
      publicUrlData.publicUrl
    );

    return publicUrlData.publicUrl;
  }

  /* =======================================================
     PRODUCT FILE CHANGE
  ======================================================= */

  function handleProductFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    if (files.length > 10) {
      alert(
        "الحد الأقصى 10 صور للمنتج."
      );

      event.target.value = "";

      return;
    }

    for (const file of files) {
      if (
        !file.type.startsWith("image/")
      ) {
        alert(
          "يجب اختيار صور فقط."
        );

        event.target.value = "";

        return;
      }

      if (
        file.size >
        8 * 1024 * 1024
      ) {
        alert(
          `الصورة ${file.name} أكبر من 8MB.`
        );

        event.target.value = "";

        return;
      }
    }

    setSelectedProductFiles(files);
  }

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  async function saveProduct(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!productForm.name_ar.trim()) {
      alert(
        "اكتب اسم المنتج بالعربية."
      );

      return;
    }

    if (!productForm.name_en.trim()) {
      alert(
        "اكتب اسم المنتج بالإنجليزية."
      );

      return;
    }

    if (!productForm.category_id) {
      alert(
        "اختر قسم المنتج."
      );

      return;
    }

    if (
      !productForm.price ||
      Number(productForm.price) <= 0
    ) {
      alert(
        "أدخل سعرًا صحيحًا."
      );

      return;
    }

    setSavingProduct(true);

    try {
      let imageUrls =
        productForm.images || [];

      /* رفع الصور الجديدة */

      if (
        selectedProductFiles.length > 0
      ) {
        setUploadingProductImages(true);

        const uploadedUrls: string[] =
          [];

        for (
          const file of selectedProductFiles
        ) {
          const url =
            await uploadFile(
              file,
              "products"
            );

          uploadedUrls.push(url);
        }

        imageUrls =
          uploadedUrls;

        setUploadingProductImages(false);
      }

      const mainImage =
        imageUrls[0] ||
        productForm.image_url ||
        null;

      const sizes =
        productForm.sizes
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

      const features =
        productForm.features
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

      const selectedCategory =
        categories.find(
          (category) =>
            category.id ===
            productForm.category_id
        );

      const productData = {
        name_ar:
          productForm.name_ar.trim(),

        name_en:
          productForm.name_en.trim(),

        name:
          productForm.name_en.trim(),

        description_ar:
          productForm.description_ar.trim(),

        description_en:
          productForm.description_en.trim(),

        description:
          productForm.description_en.trim(),

        category_id:
          productForm.category_id,

        category_ar:
          selectedCategory?.name_ar ||
          "",

        category_en:
          selectedCategory?.name_en ||
          "",

        category:
          selectedCategory?.name_en ||
          "",

        price:
          Number(productForm.price),

        old_price:
          productForm.old_price
            ? Number(
                productForm.old_price
              )
            : null,

        sizes,

        features,

        stock:
          Number(productForm.stock) || 0,

        image_url:
          mainImage,

        images:
          imageUrls,

        active:
          productForm.active,
      };

      if (editingProductId) {
        const { error } =
          await supabase
            .from("products")
            .update(productData)
            .eq(
              "id",
              editingProductId
            );

        if (error) {
          throw error;
        }

        alert(
          "تم تحديث المنتج بنجاح."
        );
      } else {
        const { error } =
          await supabase
            .from("products")
            .insert(
              productData
            );

        if (error) {
          throw error;
        }

        alert(
          "تمت إضافة المنتج بنجاح."
        );
      }

      cancelProductForm();

      await loadProducts();
    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "خطأ غير معروف";

      alert(
        `حدث خطأ أثناء حفظ المنتج:\n\n${message}\n\nافتح Console لمعرفة التفاصيل.`
      );
    } finally {
      setSavingProduct(false);

      setUploadingProductImages(
        false
      );
    }
  }

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  async function deleteProduct(
    product: Product
  ) {
    const name =
      product.name_ar ||
      product.name_en ||
      product.name ||
      "هذا المنتج";

    if (
      !window.confirm(
        `هل تريد حذف "${name}"؟`
      )
    ) {
      return;
    }

    if (
      !window.confirm(
        "تأكيد نهائي: سيتم حذف المنتج نهائيًا."
      )
    ) {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("products")
          .delete()
          .eq(
            "id",
            product.id
          );

      if (error) {
        throw error;
      }

      setProducts(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              product.id
          )
      );

      alert(
        "تم حذف المنتج."
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        "تعذر حذف المنتج. تحقق من صلاحيات Supabase."
      );
    }
  }

  /* =======================================================
     TOGGLE PRODUCT
  ======================================================= */

  async function toggleProduct(
    product: Product
  ) {
    const newActive =
      !product.active;

    const { error } =
      await supabase
        .from("products")
        .update({
          active: newActive,
        })
        .eq(
          "id",
          product.id
        );

    if (error) {
      console.error(error);

      alert(
        "تعذر تغيير حالة المنتج."
      );

      return;
    }

    setProducts(
      (current) =>
        current.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  active:
                    newActive,
                }
              : item
        )
    );
  }

  /* =======================================================
     CREATE CATEGORY
  ======================================================= */

  function startCreateCategory() {
    setEditingCategoryId(null);

    setCategoryForm({
      ...emptyCategoryForm,
    });

    setSelectedCategoryFile(null);

    setShowCategoryForm(true);
  }

  /* =======================================================
     EDIT CATEGORY
  ======================================================= */

  function startEditCategory(
    category: Category
  ) {
    setEditingCategoryId(
      category.id
    );

    setCategoryForm({
      name_ar:
        category.name_ar || "",

      name_en:
        category.name_en || "",

      slug:
        category.slug || "",

      description_ar:
        category.description_ar || "",

      description_en:
        category.description_en || "",

      image_url:
        category.image_url || "",
    });

    setSelectedCategoryFile(null);

    setShowCategoryForm(true);
  }

  /* =======================================================
     CANCEL CATEGORY
  ======================================================= */

  function cancelCategoryForm() {
    setShowCategoryForm(false);

    setEditingCategoryId(null);

    setSelectedCategoryFile(null);

    setCategoryForm({
      ...emptyCategoryForm,
    });
  }

  /* =======================================================
     CATEGORY IMAGE
  ======================================================= */

  function handleCategoryFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "اختر صورة فقط."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {
      alert(
        "الصورة يجب ألا تتجاوز 8MB."
      );

      event.target.value = "";

      return;
    }

    setSelectedCategoryFile(file);
  }

  /* =======================================================
     SAVE CATEGORY
  ======================================================= */

  async function saveCategory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !categoryForm.name_ar.trim()
    ) {
      alert(
        "اكتب اسم القسم بالعربية."
      );

      return;
    }

    if (
      !categoryForm.name_en.trim()
    ) {
      alert(
        "اكتب اسم القسم بالإنجليزية."
      );

      return;
    }

    setSavingCategory(true);

    try {
      let imageUrl =
        categoryForm.image_url ||
        null;

      /* رفع صورة القسم */

      if (selectedCategoryFile) {
        setUploadingCategoryImage(
          true
        );

        imageUrl =
          await uploadFile(
            selectedCategoryFile,
            "categories"
          );

        setUploadingCategoryImage(
          false
        );
      }

      let slug =
        categoryForm.slug.trim();

      if (!slug) {
        slug =
          generateSlug(
            categoryForm.name_en
          );
      }

      /* منع slug فارغ */

      if (!slug) {
        slug =
          `category-${Date.now()}`;
      }

      const categoryData = {
        name_ar:
          categoryForm.name_ar.trim(),

        name_en:
          categoryForm.name_en.trim(),

        slug,

        description_ar:
          categoryForm.description_ar.trim() ||
          null,

        description_en:
          categoryForm.description_en.trim() ||
          null,

        image_url:
          imageUrl,
      };

      if (editingCategoryId) {
        const { error } =
          await supabase
            .from("categories")
            .update(
              categoryData
            )
            .eq(
              "id",
              editingCategoryId
            );

        if (error) {
          throw error;
        }

        alert(
          "تم تحديث القسم بنجاح."
        );
      } else {
        const { error } =
          await supabase
            .from("categories")
            .insert(
              categoryData
            );

        if (error) {
          throw error;
        }

        alert(
          "تمت إضافة القسم بنجاح."
        );
      }

      cancelCategoryForm();

      await loadCategories();
    } catch (error) {
      console.error(
        "SAVE CATEGORY ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "خطأ غير معروف";

      alert(
        `حدث خطأ أثناء حفظ القسم:\n\n${message}\n\nافتح Console لمعرفة التفاصيل.`
      );
    } finally {
      setSavingCategory(false);

      setUploadingCategoryImage(
        false
      );
    }
  }

  /* =======================================================
     DELETE CATEGORY
  ======================================================= */

  async function deleteCategory(
    category: Category
  ) {
    const hasProducts =
      products.some(
        (product) =>
          product.category_id ===
          category.id
      );

    if (hasProducts) {
      alert(
        "لا يمكن حذف هذا القسم لأنه يحتوي على منتجات. انقل المنتجات إلى قسم آخر أولًا."
      );

      return;
    }

    if (
      !window.confirm(
        `هل تريد حذف قسم "${category.name_ar}"؟`
      )
    ) {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("categories")
          .delete()
          .eq(
            "id",
            category.id
          );

      if (error) {
        throw error;
      }

      setCategories(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              category.id
          )
      );

      alert(
        "تم حذف القسم."
      );
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      alert(
        "تعذر حذف القسم. تأكد أنه لا توجد منتجات مرتبطة به."
      );
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#050505] text-white"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-black">
              ADMIN

              <span className="text-[#b6ff00]">
                STORE
              </span>
            </div>

            <div className="mt-1 text-xs text-white/30">
              إدارة المتجر والمنتجات والأقسام
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                startCreateCategory
              }
              className="hidden items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-[#b6ff00]/40 hover:text-[#b6ff00] sm:flex"
            >
              <Folder size={17} />

              إضافة قسم
            </button>

            <button
              type="button"
              onClick={
                startCreateProduct
              }
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

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">

        {/* =================================================
            CATEGORY FORM
        ================================================= */}

        {showCategoryForm && (
          <section className="mb-10 rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl sm:p-8">

            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#b6ff00]">
                  <Folder size={17} />

                  {editingCategoryId
                    ? "تعديل القسم"
                    : "قسم جديد"}
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  {editingCategoryId
                    ? "تعديل بيانات القسم"
                    : "إضافة قسم جديد"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/30">
                  أضف اسم ووصف وصورة القسم باللغتين.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  cancelCategoryForm
                }
                className="rounded-full border border-white/10 p-2 text-white/40 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                saveCategory
              }
              className="space-y-7"
            >

              {/* NAMES */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  اسم القسم
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      الاسم بالعربية *
                    </label>

                    <input
                      value={
                        categoryForm.name_ar
                      }
                      onChange={(event) =>
                        updateCategoryField(
                          "name_ar",
                          event.target.value
                        )
                      }
                      placeholder="الإلكترونيات"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Name in English *
                    </label>

                    <input
                      value={
                        categoryForm.name_en
                      }
                      onChange={(event) =>
                        updateCategoryField(
                          "name_en",
                          event.target.value
                        )
                      }
                      placeholder="Electronics"
                      dir="ltr"
                      className="admin-input text-left"
                    />
                  </div>
                </div>
              </div>

              {/* SLUG */}

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Slug
                </label>

                <input
                  value={
                    categoryForm.slug
                  }
                  onChange={(event) =>
                    updateCategoryField(
                      "slug",
                      event.target.value
                    )
                  }
                  placeholder="electronics"
                  dir="ltr"
                  className="admin-input text-left"
                />

                <p className="mt-2 text-xs text-white/25">
                  إذا تركته فارغًا سيتم إنشاؤه تلقائيًا من الاسم الإنجليزي.
                </p>
              </div>

              {/* DESCRIPTIONS */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  وصف القسم
                </div>

                <div className="grid gap-5 lg:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      الوصف بالعربية
                    </label>

                    <textarea
                      value={
                        categoryForm.description_ar
                      }
                      onChange={(event) =>
                        updateCategoryField(
                          "description_ar",
                          event.target.value
                        )
                      }
                      rows={5}
                      placeholder="اكتشف أحدث الأجهزة والتقنيات الذكية..."
                      className="admin-input resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Description in English
                    </label>

                    <textarea
                      value={
                        categoryForm.description_en
                      }
                      onChange={(event) =>
                        updateCategoryField(
                          "description_en",
                          event.target.value
                        )
                      }
                      rows={5}
                      placeholder="Discover the latest smart devices and technology..."
                      dir="ltr"
                      className="admin-input resize-none text-left"
                    />
                  </div>

                </div>
              </div>

              {/* IMAGE */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  صورة القسم
                </div>

                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5">

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 px-5 py-10 transition hover:border-[#b6ff00]/40">

                    <ImageIcon
                      size={32}
                      className="mb-3 text-[#b6ff00]"
                    />

                    <span className="font-bold">
                      اختر صورة القسم
                    </span>

                    <span className="mt-2 text-xs text-white/30">
                      PNG / JPG / WEBP — حتى 8MB
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleCategoryFile
                      }
                      className="hidden"
                    />

                  </label>

                  {/* NEW */}

                  {selectedCategoryFile && (
                    <div className="mt-5">
                      <img
                        src={URL.createObjectURL(
                          selectedCategoryFile
                        )}
                        alt="Category preview"
                        className="mx-auto aspect-video max-h-64 rounded-2xl object-cover"
                      />
                    </div>
                  )}

                  {/* OLD */}

                  {!selectedCategoryFile &&
                    categoryForm.image_url && (
                      <div className="mt-5">
                        <img
                          src={
                            categoryForm.image_url
                          }
                          alt={
                            categoryForm.name_ar
                          }
                          className="mx-auto aspect-video max-h-64 rounded-2xl object-cover"
                        />
                      </div>
                    )}

                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={
                    savingCategory
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black disabled:opacity-50"
                >
                  {savingCategory ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      {uploadingCategoryImage
                        ? "جاري رفع الصورة..."
                        : "جاري الحفظ..."}
                    </>
                  ) : (
                    <>
                      <Save size={19} />

                      {editingCategoryId
                        ? "حفظ التعديلات"
                        : "إضافة القسم"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    cancelCategoryForm
                  }
                  className="rounded-xl border border-white/10 px-8 py-4 font-bold text-white/50 transition hover:text-white"
                >
                  إلغاء
                </button>

              </div>

            </form>
          </section>
        )}

        {/* =================================================
            PRODUCT FORM
        ================================================= */}

        {showProductForm && (
          <section className="mb-10 rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl sm:p-8">

            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#b6ff00]">
                  <Languages size={17} />

                  {editingProductId
                    ? "تعديل المنتج"
                    : "منتج جديد"}
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  {editingProductId
                    ? "تعديل بيانات المنتج"
                    : "إضافة منتج جديد"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  cancelProductForm
                }
                className="rounded-full border border-white/10 p-2 text-white/40 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                saveProduct
              }
              className="space-y-8"
            >

              {/* PRODUCT NAME */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  اسم المنتج
                </div>

                <div className="grid gap-5 lg:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      الاسم بالعربية *
                    </label>

                    <input
                      value={
                        productForm.name_ar
                      }
                      onChange={(event) =>
                        updateProductField(
                          "name_ar",
                          event.target.value
                        )
                      }
                      placeholder="اسم المنتج"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Product Name *
                    </label>

                    <input
                      value={
                        productForm.name_en
                      }
                      onChange={(event) =>
                        updateProductField(
                          "name_en",
                          event.target.value
                        )
                      }
                      placeholder="Product Name"
                      dir="ltr"
                      className="admin-input text-left"
                    />
                  </div>

                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-bold">
                  قسم المنتج *
                </label>

                <select
                  value={
                    productForm.category_id
                  }
                  onChange={(event) =>
                    updateProductField(
                      "category_id",
                      event.target.value
                    )
                  }
                  className="admin-input"
                >
                  <option
                    value=""
                    className="bg-[#111]"
                  >
                    اختر قسم المنتج
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                        className="bg-[#111]"
                      >
                        {category.name_ar} —{" "}
                        {
                          category.name_en
                        }
                      </option>
                    )
                  )}
                </select>

                {categories.length ===
                  0 && (
                  <p className="mt-2 text-xs text-red-300">
                    لا توجد أقسام. أضف قسمًا أولًا.
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}

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
                      value={
                        productForm.description_ar
                      }
                      onChange={(event) =>
                        updateProductField(
                          "description_ar",
                          event.target.value
                        )
                      }
                      rows={5}
                      className="admin-input resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Description
                    </label>

                    <textarea
                      value={
                        productForm.description_en
                      }
                      onChange={(event) =>
                        updateProductField(
                          "description_en",
                          event.target.value
                        )
                      }
                      rows={5}
                      dir="ltr"
                      className="admin-input resize-none text-left"
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
                      value={
                        productForm.price
                      }
                      onChange={(event) =>
                        updateProductField(
                          "price",
                          event.target.value
                        )
                      }
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
                      value={
                        productForm.old_price
                      }
                      onChange={(event) =>
                        updateProductField(
                          "old_price",
                          event.target.value
                        )
                      }
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
                      value={
                        productForm.stock
                      }
                      onChange={(event) =>
                        updateProductField(
                          "stock",
                          event.target.value
                        )
                      }
                      className="admin-input"
                    />
                  </div>

                </div>
              </div>

              {/* SIZES FEATURES */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  المواصفات
                </div>

                <div className="grid gap-5 lg:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      المقاسات
                    </label>

                    <input
                      value={
                        productForm.sizes
                      }
                      onChange={(event) =>
                        updateProductField(
                          "sizes",
                          event.target.value
                        )
                      }
                      placeholder="S,M,L,XL"
                      dir="ltr"
                      className="admin-input text-left"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      المميزات
                    </label>

                    <input
                      value={
                        productForm.features
                      }
                      onChange={(event) =>
                        updateProductField(
                          "features",
                          event.target.value
                        )
                      }
                      placeholder="جودة عالية,خفيف,مريح"
                      className="admin-input"
                    />
                  </div>

                </div>
              </div>

              {/* IMAGES */}

              <div>
                <div className="mb-4 text-sm font-black text-white/70">
                  صور المنتج
                </div>

                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5">

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 px-5 py-10 transition hover:border-[#b6ff00]/40">

                    <Upload
                      size={30}
                      className="mb-3 text-[#b6ff00]"
                    />

                    <span className="font-bold">
                      اختر صور المنتج
                    </span>

                    <span className="mt-2 text-center text-xs text-white/30">
                      حتى 10 صور — 8MB للصورة
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={
                        handleProductFiles
                      }
                      className="hidden"
                    />

                  </label>

                  {/* NEW */}

                  {selectedProductFiles.length >
                    0 && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">

                      {selectedProductFiles.map(
                        (
                          file,
                          index
                        ) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="relative overflow-hidden rounded-xl border border-white/10 bg-black"
                          >
                            <img
                              src={URL.createObjectURL(
                                file
                              )}
                              alt={`Preview ${
                                index + 1
                              }`}
                              className="aspect-square w-full object-contain"
                            />

                            {index ===
                              0 && (
                              <div className="absolute bottom-2 right-2 rounded-lg bg-[#b6ff00] px-2 py-1 text-[10px] font-black text-black">
                                الرئيسية
                              </div>
                            )}
                          </div>
                        )
                      )}

                    </div>
                  )}

                  {/* EXISTING */}

                  {selectedProductFiles.length ===
                    0 &&
                    productForm.images.length >
                      0 && (
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">

                        {productForm.images.map(
                          (
                            image,
                            index
                          ) => (
                            <div
                              key={`${image}-${index}`}
                              className="relative overflow-hidden rounded-xl border border-white/10 bg-black"
                            >
                              <img
                                src={image}
                                alt={`Product ${
                                  index + 1
                                }`}
                                className="aspect-square w-full object-contain"
                              />

                              {index ===
                                0 && (
                                <div className="absolute bottom-2 right-2 rounded-lg bg-[#b6ff00] px-2 py-1 text-[10px] font-black text-black">
                                  الرئيسية
                                </div>
                              )}
                            </div>
                          )
                        )}

                      </div>
                    )}

                </div>
              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                <input
                  type="checkbox"
                  checked={
                    productForm.active
                  }
                  onChange={(event) =>
                    updateProductField(
                      "active",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#b6ff00]"
                />

                <div>
                  <div className="text-sm font-bold">
                    إظهار المنتج في المتجر
                  </div>

                  <div className="mt-1 text-xs text-white/30">
                    عند إلغاء التفعيل لن يظهر المنتج للزوار.
                  </div>
                </div>

              </label>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={
                    savingProduct
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black disabled:opacity-50"
                >
                  {savingProduct ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      {uploadingProductImages
                        ? "جاري رفع الصور..."
                        : "جاري الحفظ..."}
                    </>
                  ) : (
                    <>
                      <Save size={19} />

                      {editingProductId
                        ? "حفظ التعديلات"
                        : "إضافة المنتج"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    cancelProductForm
                  }
                  className="rounded-xl border border-white/10 px-8 py-4 font-bold text-white/50 transition hover:text-white"
                >
                  إلغاء
                </button>

              </div>

            </form>
          </section>
        )}

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section className="mb-12">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-black tracking-[0.2em] text-[#b6ff00]">
                <Folder size={15} />

                CATEGORIES
              </div>

              <h2 className="text-3xl font-black">
                الأقسام
              </h2>

              <p className="mt-2 text-sm text-white/30">
                الأقسام التي سيتم ربط المنتجات بها.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
                {categories.length} قسم
              </div>

              <button
                type="button"
                onClick={
                  startCreateCategory
                }
                className="flex items-center gap-2 rounded-xl bg-[#b6ff00] px-4 py-3 font-black text-black"
              >
                <Plus size={17} />

                إضافة
              </button>

            </div>
          </div>

          {categoriesLoading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-[#0a0a0a]">
              <Loader2
                size={30}
                className="animate-spin text-[#b6ff00]"
              />
            </div>
          ) : categories.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-16 text-center">

              <Folder
                size={42}
                className="mx-auto mb-5 text-white/15"
              />

              <h3 className="text-xl font-black">
                لا توجد أقسام
              </h3>

              <p className="mt-3 text-sm text-white/30">
                أضف أول قسم للمتجر.
              </p>

              <button
                type="button"
                onClick={
                  startCreateCategory
                }
                className="mt-6 rounded-xl bg-[#b6ff00] px-6 py-3 font-black text-black"
              >
                إضافة قسم
              </button>

            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {categories.map(
                (category) => {
                  const productCount =
                    products.filter(
                      (product) =>
                        product.category_id ===
                        category.id
                    ).length;

                  return (
                    <article
                      key={
                        category.id
                      }
                      className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
                    >

                      <div className="relative aspect-video overflow-hidden bg-black">

                        {category.image_url ? (
                          <img
                            src={
                              category.image_url
                            }
                            alt={
                              category.name_ar
                            }
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">

                            <Folder
                              size={42}
                              className="text-white/10"
                            />

                          </div>
                        )}

                      </div>

                      <div className="p-5">

                        <div className="text-xs font-bold text-[#b6ff00]">
                          {category.slug}
                        </div>

                        <h3 className="mt-2 text-xl font-black">
                          {
                            category.name_ar
                          }
                        </h3>

                        <div className="mt-1 text-sm text-white/40">
                          {
                            category.name_en
                          }
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/30">
                          {category.description_ar ||
                            category.description_en ||
                            "لا يوجد وصف للقسم."}
                        </p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/40">
                          المنتجات في القسم:{" "}

                          <span className="font-black text-[#b6ff00]">
                            {
                              productCount
                            }
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEditCategory(
                                category
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/60 transition hover:text-white"
                          >
                            <Edit3
                              size={16}
                            />

                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteCategory(
                                category
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/10 py-3 text-sm font-bold text-red-400/70 transition hover:border-red-500/30 hover:text-red-400"
                          >
                            <Trash2
                              size={16}
                            />

                            حذف
                          </button>

                        </div>

                      </div>
                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section>

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>

              <div className="mb-2 text-xs font-black tracking-[0.2em] text-[#b6ff00]">
                PRODUCTS
              </div>

              <h2 className="text-3xl font-black">
                المنتجات
              </h2>

              <p className="mt-2 text-sm text-white/30">
                كل منتج مرتبط بالقسم الخاص به.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">

              <Package size={17} />

              {products.length}

            </div>

          </div>

          {productsLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-[#0a0a0a]">
              <Loader2
                size={30}
                className="animate-spin text-[#b6ff00]"
              />
            </div>
          ) : products.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-20 text-center">

              <Package
                size={42}
                className="mx-auto mb-5 text-white/15"
              />

              <h3 className="text-xl font-black">
                لا توجد منتجات
              </h3>

              <p className="mt-3 text-sm text-white/30">
                ابدأ بإضافة أول منتج.
              </p>

              <button
                type="button"
                onClick={
                  startCreateProduct
                }
                className="mt-6 rounded-xl bg-[#b6ff00] px-6 py-3 font-black text-black"
              >
                إضافة منتج
              </button>

            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {products.map(
                (product) => {
                  const productName =
                    product.name_ar ||
                    product.name_en ||
                    product.name ||
                    "منتج";

                  const mainImage =
                    product.images?.[0] ||
                    product.image_url;

                  const category =
                    categories.find(
                      (item) =>
                        item.id ===
                        product.category_id
                    );

                  const imageCount =
                    product.images?.length ||
                    (product.image_url
                      ? 1
                      : 0);

                  return (
                    <article
                      key={
                        product.id
                      }
                      className={`overflow-hidden rounded-3xl border bg-[#0a0a0a] ${
                        product.active
                          ? "border-white/10"
                          : "border-red-500/20 opacity-60"
                      }`}
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-square overflow-hidden bg-black">

                        {mainImage ? (
                          <img
                            src={
                              mainImage
                            }
                            alt={
                              productName
                            }
                            loading="lazy"
                            className="h-full w-full object-contain p-3 transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-white/20">

                            <Package
                              size={35}
                            />

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

                        {imageCount >
                          1 && (
                          <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/75 px-3 py-1.5 text-xs font-bold text-white">
                            {
                              imageCount
                            }{" "}
                            صور
                          </div>
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="p-5">

                        <div className="flex items-center justify-between gap-2">

                          <div className="text-xs font-bold text-[#b6ff00]">
                            {category
                              ?.name_ar ||
                              product.category_ar ||
                              product.category_en ||
                              "بدون قسم"}
                          </div>

                          <div className="text-xs text-white/25">
                            {category
                              ?.name_en ||
                              ""}
                          </div>

                        </div>

                        <h3 className="mt-2 line-clamp-2 text-xl font-black">
                          {
                            productName
                          }
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-white/35">
                          {product.description_ar ||
                            product.description_en ||
                            product.description ||
                            "لا يوجد وصف."}
                        </p>

                        <div className="mt-5 flex items-center justify-between">

                          <div>

                            <span className="text-2xl font-black text-[#b6ff00]">
                              {Number(
                                product.price
                              ).toLocaleString(
                                "ar-EG"
                              )}
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
                            {
                              product.stock
                            }
                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEditProduct(
                                product
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/65 transition hover:border-white/30 hover:text-white"
                          >
                            <Edit3
                              size={16}
                            />

                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleProduct(
                                product
                              )
                            }
                            className="rounded-xl border border-white/10 px-3 text-white/50 transition hover:text-[#b6ff00]"
                            title={
                              product.active
                                ? "إخفاء المنتج"
                                : "إظهار المنتج"
                            }
                          >
                            {product.active ? (
                              <EyeOff
                                size={
                                  17
                                }
                              />
                            ) : (
                              <Eye
                                size={
                                  17
                                }
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(
                                product
                              )
                            }
                            className="rounded-xl border border-red-500/10 px-3 text-red-400/60 transition hover:border-red-500/30 hover:text-red-400"
                            title="حذف المنتج"
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>

                        </div>

                      </div>
                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>

      {/* ===================================================
          GLOBAL CSS
      =================================================== */}

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

        select.admin-input {
          appearance: auto;
        }

        select.admin-input option {
          background: #111111;
          color: white;
        }
      `}</style>
    </main>
  );
}
