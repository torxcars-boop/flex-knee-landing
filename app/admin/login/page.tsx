"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const { data } =
        await supabase.auth.getSession();

      if (data.session) {
        router.replace("/admin");
      } else {
        setChecking(false);
      }
    }

    checkSession();
  }, [router]);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      console.error(error);

      setError(
        "تعذر تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور."
      );

      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2
          className="animate-spin text-[#b6ff00]"
          size={28}
        />
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#b6ff00]/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b6ff00] text-3xl font-black text-black">
            M
          </div>

          <h1 className="text-3xl font-black">
            لوحة الإدارة
          </h1>

          <p className="mt-2 text-sm text-white/40">
            سجّل الدخول لإدارة منتجات المتجر
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@example.com"
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-4 pl-4 pr-12 text-sm outline-none transition focus:border-[#b6ff00]/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                كلمة المرور
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-4 pl-4 pr-12 text-sm outline-none transition focus:border-[#b6ff00]/60"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#b6ff00] px-5 py-4 font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-white/25">
          لوحة إدارة المتجر © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
