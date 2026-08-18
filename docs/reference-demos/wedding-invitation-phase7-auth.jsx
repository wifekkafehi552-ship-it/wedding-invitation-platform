import React, { useState } from "react";
import { Mail, Lock, User, ArrowLeft, LogOut } from "lucide-react";

/**
 * PHASE 7 — Authentication
 *
 * UI + client-side flow for Supabase Auth. The actual calls are written
 * against the real supabase-js v2 API shape (see the `supabase.auth.*`
 * calls in comments) — wiring them up just needs a real project's
 * NEXT_PUBLIC_SUPABASE_URL / ANON_KEY, which this sandbox doesn't have
 * network access to. Everything else (validation, states, screens) is
 * fully functional here with a mocked auth layer so you can test the UX.
 *
 *   lib/supabase/client.ts
 *     import { createClient } from '@supabase/supabase-js'
 *     export const supabase = createClient(
 *       process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *     )
 *
 *   Sign up : supabase.auth.signUp({ email, password })
 *   Login   : supabase.auth.signInWithPassword({ email, password })
 *   Logout  : supabase.auth.signOut()
 *   Reset   : supabase.auth.resetPasswordForEmail(email, { redirectTo })
 */

function mockDelay(ms = 700) {
  return new Promise((res) => setTimeout(res, ms));
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8935A]" />
      <input
        {...props}
        className="w-full bg-white border border-[#E7D9BE] rounded-lg pr-10 pl-3 py-2.5 text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B8935A]/40"
      />
    </div>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] flex items-center justify-center px-6" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="w-full max-w-sm">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2 text-center">PHASE 7 — AUTHENTICATION</p>
        <div className="bg-white rounded-2xl border border-[#E7D9BE] p-7">
          <h1 className="text-2xl text-[#1E1A16] text-center mb-1" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
            {title}
          </h1>
          {subtitle && <p className="text-[#1E1A16]/50 text-xs text-center mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

function ErrorText({ children }) {
  if (!children) return null;
  return <p className="text-[#5B1F23] text-xs mt-1">{children}</p>;
}

export default function AuthDemo() {
  const [screen, setScreen] = useState("login"); // login | signup | forgot | dashboard
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = async () => {
    setError("");
    if (!form.name.trim()) return setError("الاسم مطلوب");
    if (!validEmail(form.email)) return setError("البريد الإلكتروني غير صالح");
    if (form.password.length < 8) return setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    setLoading(true);
    // await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } })
    await mockDelay();
    setLoading(false);
    setUser({ name: form.name, email: form.email });
    setScreen("dashboard");
  };

  const handleLogin = async () => {
    setError("");
    if (!validEmail(form.email)) return setError("البريد الإلكتروني غير صالح");
    if (!form.password) return setError("كلمة المرور مطلوبة");
    setLoading(true);
    // await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    await mockDelay();
    setLoading(false);
    setUser({ name: form.email.split("@")[0], email: form.email });
    setScreen("dashboard");
  };

  const handleForgot = async () => {
    setError("");
    if (!validEmail(form.email)) return setError("البريد الإلكتروني غير صالح");
    setLoading(true);
    // await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: 'https://yourapp.com/reset-password' })
    await mockDelay();
    setLoading(false);
    setResetSent(true);
  };

  const handleLogout = async () => {
    // await supabase.auth.signOut()
    setUser(null);
    setForm({ name: "", email: "", password: "" });
    setResetSent(false);
    setScreen("login");
  };

  if (screen === "dashboard" && user) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#F6F1E7] flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="w-16 h-16 rounded-full bg-[#B8935A]/15 flex items-center justify-center text-[#B8935A] text-xl mb-4" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          {user.name[0]?.toUpperCase()}
        </div>
        <h2 className="text-xl text-[#1E1A16] mb-1" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          أهلاً {user.name} 👋
        </h2>
        <p className="text-[#1E1A16]/50 text-xs mb-8">{user.email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-[#1E1A16] text-white px-6 py-2.5 rounded-full text-sm"
        >
          <LogOut size={14} /> تسجيل الخروج
        </button>
      </div>
    );
  }

  if (screen === "forgot") {
    return (
      <AuthShell title="نسيت كلمة المرور" subtitle="سنرسل لك رابط إعادة التعيين">
        {resetSent ? (
          <div className="text-center py-4">
            <p className="text-[#1E1A16] text-sm mb-4">
              تم إرسال رابط إعادة التعيين إلى <span className="text-[#B8935A]">{form.email}</span>
            </p>
            <button onClick={() => { setScreen("login"); setResetSent(false); }} className="text-xs text-[#B8935A] flex items-center gap-1 mx-auto">
              <ArrowLeft size={12} /> رجوع لتسجيل الدخول
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Field icon={Mail} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={update("email")} />
            <ErrorText>{error}</ErrorText>
            <button
              onClick={handleForgot}
              disabled={loading}
              className="bg-[#1E1A16] text-white py-2.5 rounded-lg text-sm mt-1 disabled:opacity-50"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
            </button>
            <button onClick={() => setScreen("login")} className="text-xs text-[#1E1A16]/50 flex items-center gap-1 justify-center mt-2">
              <ArrowLeft size={12} /> رجوع
            </button>
          </div>
        )}
      </AuthShell>
    );
  }

  if (screen === "signup") {
    return (
      <AuthShell title="إنشاء حساب" subtitle="ابدأ بإنشاء دعوة زفافك الآن">
        <div className="flex flex-col gap-3">
          <Field icon={User} placeholder="الاسم الكامل" value={form.name} onChange={update("name")} />
          <Field icon={Mail} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={update("email")} />
          <Field icon={Lock} type="password" placeholder="كلمة المرور" value={form.password} onChange={update("password")} />
          <ErrorText>{error}</ErrorText>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="bg-[#1E1A16] text-white py-2.5 rounded-lg text-sm mt-1 disabled:opacity-50"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
          </button>
        </div>
        <p className="text-center text-xs text-[#1E1A16]/50 mt-5">
          لديك حساب بالفعل؟{" "}
          <button onClick={() => { setScreen("login"); setError(""); }} className="text-[#B8935A]">تسجيل الدخول</button>
        </p>
      </AuthShell>
    );
  }

  // default: login
  return (
    <AuthShell title="تسجيل الدخول" subtitle="أدر دعوة زفافك من لوحة التحكم">
      <div className="flex flex-col gap-3">
        <Field icon={Mail} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={update("email")} />
        <Field icon={Lock} type="password" placeholder="كلمة المرور" value={form.password} onChange={update("password")} />
        <ErrorText>{error}</ErrorText>
        <button onClick={() => setScreen("forgot")} className="text-xs text-[#B8935A] self-start">
          نسيت كلمة المرور؟
        </button>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-[#1E1A16] text-white py-2.5 rounded-lg text-sm mt-1 disabled:opacity-50"
        >
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>
      </div>
      <p className="text-center text-xs text-[#1E1A16]/50 mt-5">
        ليس لديك حساب؟{" "}
        <button onClick={() => { setScreen("signup"); setError(""); }} className="text-[#B8935A]">إنشاء حساب جديد</button>
      </p>
    </AuthShell>
  );
}
