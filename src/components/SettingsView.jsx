import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  User,
  Bell,
  Lock,
  Globe,
  Save,
  Camera,
  LogOut,
  Check,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Trash2,
  AlertTriangle,
  X,
  Moon,
  Sun,

  Sparkles,
  Zap,
  Star,




  ShoppingBag,
  Award,
} from "lucide-react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════
// TOGGLE
// ═══════════════════════════════════════════
const Toggle = ({ label, description, checked, onChange, id }) => (
  <div
    className="flex items-center justify-between py-4"
    style={{ borderBottom: "1px solid #f5f5f4" }}
  >
    <label htmlFor={id} className="pr-4 cursor-pointer">
      <h4 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
        {label}
      </h4>
      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </label>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 border-none cursor-pointer"
      style={{
        background: checked ? "linear-gradient(135deg, #10b981, #14b8a6)" : "#d6d3d1",
      }}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  </div>
);

// ═══════════════════════════════════════════
// CONFIRM MODAL
// ═══════════════════════════════════════════
const ConfirmModal = ({ isOpen, onClose, onConfirm, icon: Icon, iconBg, title, message, confirmLabel, danger }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-[28px] p-8 w-full max-w-sm"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: iconBg || "#fef2f2" }}
          >
            <Icon className="w-8 h-8" style={{ color: danger ? "#ef4444" : "#10b981" }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-stone-100 font-bold rounded-xl hover:bg-stone-200 transition-colors border-none cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 text-white font-bold rounded-xl transition-colors border-none cursor-pointer"
              style={{
                background: danger ? "#ef4444" : "linear-gradient(135deg, #10b981, #14b8a6)",
                boxShadow: danger ? "0 4px 12px rgba(239,68,68,0.3)" : "0 4px 12px rgba(16,185,129,0.3)",
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// PRO SUBSCRIPTION SECTION — full pricing page
// ═══════════════════════════════════════════
const PLANS = {
  monthly: [
    {
      id: "basic",
      name: "Básico",
      price: 4.99,
      description: "Para creadores que empiezan",
      features: [
        { text: "Sin anuncios", included: true },
        { text: "50 publicaciones/mes", included: true },
        { text: "Estadísticas básicas", included: true },
        { text: "Badge verificado", included: true },
        { text: "Publicaciones ilimitadas", included: false },
        { text: "Estadísticas avanzadas", included: false },
        { text: "Soporte prioritario", included: false },
        { text: "Marketplace sin comisión", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 9.99,
      popular: true,
      description: "Para creadores serios",
      features: [
        { text: "Sin anuncios", included: true },
        { text: "Publicaciones ilimitadas", included: true },
        { text: "Estadísticas avanzadas", included: true },
        { text: "Badge verificado", included: true },
        { text: "Soporte prioritario 24/7", included: true },
        { text: "Marketplace sin comisión", included: true },
        { text: "Acceso beta a funciones", included: false },
        { text: "Insignia de fundador", included: false },
      ],
    },
    {
      id: "team",
      name: "Equipo",
      price: 24.99,
      description: "Para colectivos y talleres",
      features: [
        { text: "Todo lo de Pro", included: true },
        { text: "Hasta 5 miembros", included: true },
        { text: "Página de equipo", included: true },
        { text: "Analíticas de equipo", included: true },
        { text: "Soporte prioritario 24/7", included: true },
        { text: "Marketplace sin comisión", included: true },
        { text: "Acceso beta a funciones", included: true },
        { text: "Insignia de fundador", included: true },
      ],
    },
  ],
  yearly: [
    { id: "basic", name: "Básico", price: 3.99, originalPrice: 4.99, description: "Para creadores que empiezan" },
    { id: "pro", name: "Pro", price: 7.99, originalPrice: 9.99, popular: true, description: "Para creadores serios" },
    { id: "team", name: "Equipo", price: 19.99, originalPrice: 24.99, description: "Para colectivos y talleres" },
  ],
};

const ProSubscriptionSection = () => {
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"
  const [activePlan, setActivePlan] = useState(null); // null = free
  const [confirmPlan, setConfirmPlan] = useState(null); // plan to confirm
  const [successPlan, setSuccessPlan] = useState(null); // just subscribed

  const plans = billing === "yearly"
    ? PLANS.yearly.map((yp) => ({
        ...PLANS.monthly.find((mp) => mp.id === yp.id),
        ...yp,
      }))
    : PLANS.monthly;

  const handleSubscribe = (plan) => {
    if (activePlan === plan.id) return;
    setConfirmPlan(plan);
  };

  const confirmSubscription = () => {
    if (!confirmPlan) return;
    setActivePlan(confirmPlan.id);
    setSuccessPlan(confirmPlan.id);
    setConfirmPlan(null);
    setTimeout(() => setSuccessPlan(null), 3000);
  };

  const handleCancel = () => {
    setActivePlan(null);
  };

  const savingPct = 20;

  return (
    <div className="space-y-6">
      {/* ── Header banner ── */}
      <div
        className="relative rounded-[24px] overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0c1810, #0f2318, #0a1f14)" }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />
        <div className="absolute top-8 right-8 w-20 h-20 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.04)" }} />
        <div className="absolute bottom-4 right-24 w-12 h-12 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.03)" }} />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}
                >
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[2px]">Plan actual</p>
                  <p className="text-white text-2xl font-black">
                    {activePlan ? plans.find((p) => p.id === activePlan)?.name || "Pro" : "Free"}
                  </p>
                </div>
              </div>
              <p className="text-white/50 text-[14px] leading-relaxed max-w-lg">
                {activePlan
                  ? "Estás disfrutando de todas las ventajas de tu plan. Puedes cambiar o cancelar en cualquier momento."
                  : "Desbloquea todo el potencial de ReLife. Publicaciones ilimitadas, estadísticas avanzadas, soporte prioritario y mucho más."}
              </p>
            </div>

            {activePlan && (
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all hover:bg-white/10 flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Cancelar suscripción
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center p-1 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all border-none cursor-pointer",
              billing === "monthly"
                ? "text-white shadow-lg"
                : "text-stone-500 bg-transparent hover:text-stone-700"
            )}
            style={billing === "monthly" ? { background: "var(--text-primary)" } : {}}
          >
            Mensual
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all border-none cursor-pointer flex items-center gap-2",
              billing === "yearly"
                ? "text-white shadow-lg"
                : "text-stone-500 bg-transparent hover:text-stone-700"
            )}
            style={billing === "yearly" ? { background: "var(--text-primary)" } : {}}
          >
            Anual
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: billing === "yearly" ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.1)",
                color: billing === "yearly" ? "#6ee7b7" : "#10b981",
              }}
            >
              -{savingPct}%
            </span>
          </button>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isActive = activePlan === plan.id;
          const isPro = plan.popular;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-[24px] overflow-hidden transition-all duration-500",
                isPro ? "md:-mt-3 md:mb-[-12px]" : "",
                isActive && "ring-2 ring-emerald-500 ring-offset-2"
              )}
              style={{
                background: isPro
                  ? "linear-gradient(160deg, #10b981, #0d9488, #06b6d4)"
                  : "var(--bg-card)",
                border: isPro ? "none" : "1px solid var(--border)",
                boxShadow: isPro ? "0 20px 60px rgba(16,185,129,0.2)" : "var(--shadow-sm)",
              }}
            >
              {/* Popular / Active badge */}
              {(isPro || isActive) && (
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      background: isActive ? "#10b981" : "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {isActive ? <><Check className="w-3 h-3" /> Activo</> : <><Star className="w-3 h-3" /> Popular</>}
                  </span>
                </div>
              )}

              <div className="p-6 md:p-7">
                {/* Plan info */}
                <p
                  className="text-[12px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: isPro ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}
                >
                  {plan.description}
                </p>
                <h3
                  className="text-[22px] font-black mb-4"
                  style={{ color: isPro ? "white" : "var(--text-primary)", letterSpacing: "-0.02em" }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span
                    className="text-[40px] font-black"
                    style={{ color: isPro ? "white" : "#10b981", letterSpacing: "-0.04em", lineHeight: 1 }}
                  >
                    {plan.price}€
                  </span>
                  <span
                    className="text-[13px] font-medium"
                    style={{ color: isPro ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}
                  >
                    /{billing === "yearly" ? "mes" : "mes"}
                  </span>
                </div>
                {billing === "yearly" && plan.originalPrice && (
                  <p className="text-[12px] mb-4" style={{ color: isPro ? "rgba(255,255,255,0.4)" : "var(--text-faint)" }}>
                    <span style={{ textDecoration: "line-through" }}>{plan.originalPrice}€</span> facturado anualmente
                  </p>
                )}
                {billing !== "yearly" && <div className="mb-4" />}

                {/* Divider */}
                <div
                  className="h-px mb-5"
                  style={{ background: isPro ? "rgba(255,255,255,0.12)" : "var(--border)" }}
                />

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {plan.features?.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {feat.included ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: isPro ? "rgba(255,255,255,0.2)" : "rgba(16,185,129,0.1)" }}
                        >
                          <Check className="w-3 h-3" style={{ color: isPro ? "white" : "#10b981" }} />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: isPro ? "rgba(255,255,255,0.06)" : "var(--bg-input)" }}
                        >
                          <X className="w-2.5 h-2.5" style={{ color: isPro ? "rgba(255,255,255,0.2)" : "var(--text-faint)" }} />
                        </div>
                      )}
                      <span
                        className="text-[13px]"
                        style={{
                          color: feat.included
                            ? (isPro ? "rgba(255,255,255,0.9)" : "var(--text-secondary)")
                            : (isPro ? "rgba(255,255,255,0.25)" : "var(--text-faint)"),
                          fontWeight: feat.included ? 500 : 400,
                        }}
                      >
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isActive}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-[14px] border-none cursor-pointer transition-all",
                    isActive
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                  )}
                  style={{
                    background: isActive
                      ? (isPro ? "rgba(255,255,255,0.2)" : "var(--bg-input)")
                      : isPro
                        ? "white"
                        : "linear-gradient(135deg, #10b981, #14b8a6)",
                    color: isActive
                      ? (isPro ? "rgba(255,255,255,0.6)" : "var(--text-muted)")
                      : isPro ? "#059669" : "white",
                    boxShadow: isActive ? "none" : isPro
                      ? "0 4px 16px rgba(255,255,255,0.15)"
                      : "0 4px 16px rgba(16,185,129,0.25)",
                  }}
                >
                  {isActive ? "Plan actual" : `Elegir ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FAQ / Trust ── */}
      <div
        className="rounded-[24px] p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h4 className="font-bold text-[15px] mb-4" style={{ color: "var(--text-primary)" }}>
          Preguntas frecuentes
        </h4>
        <div className="space-y-3">
          {[
            { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, sin permanencia. Tu plan se mantiene activo hasta el final del período facturado." },
            { q: "¿Cómo funciona el período de prueba?", a: "Todos los planes incluyen 7 días de prueba gratuita. No se te cobrará durante ese tiempo." },
            { q: "¿Puedo cambiar de plan después?", a: "Sí, puedes subir o bajar de plan cuando quieras. El cambio se aplica en el siguiente ciclo de facturación." },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-xl overflow-hidden"
              style={{ background: "var(--bg-input)" }}
            >
              <summary
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer list-none text-[13px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.q}
                <span
                  className="text-[18px] transition-transform duration-200 group-open:rotate-45"
                  style={{ color: "var(--text-muted)" }}
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Shield, label: "Pago seguro", sub: "SSL 256-bit" },
          { icon: Zap, label: "Activa al instante", sub: "Sin esperas" },
          { icon: X, label: "Sin permanencia", sub: "Cancela cuando quieras" },
        ].map((badge) => (
          <div
            key={badge.label}
            className="text-center p-4 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <badge.icon className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
            <p className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>{badge.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{badge.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Confirm modal ── */}
      {confirmPlan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setConfirmPlan(null)}
        >
          <div
            className="bg-white rounded-[28px] w-full max-w-sm overflow-hidden"
            style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-8 text-center"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(6,182,212,0.05))" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}
              >
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
                Confirmar suscripción
              </h3>
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Te suscribirás al plan
              </p>
              <p className="text-2xl font-black mb-1" style={{ color: "#10b981" }}>
                {confirmPlan.name}
              </p>
              <p className="text-[28px] font-black" style={{ color: "var(--text-primary)" }}>
                {confirmPlan.price}€<span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>/{billing === "yearly" ? "mes" : "mes"}</span>
              </p>
              {billing === "yearly" && (
                <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Facturado como {(confirmPlan.price * 12).toFixed(2)}€/año
                </p>
              )}
            </div>
            <div className="p-6 flex gap-3">
              <button
                onClick={() => setConfirmPlan(null)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer transition-colors bg-stone-100 hover:bg-stone-200"
                style={{ color: "var(--text-secondary)" }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmSubscription}
                className="flex-[1.5] py-3.5 rounded-xl font-bold text-sm text-white border-none cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
              >
                Confirmar y pagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success notification ── */}
      {successPlan && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-medium"
          style={{
            background: "linear-gradient(135deg, #10b981, #14b8a6)",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
            animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Check className="w-5 h-5" />
          ¡Suscripción activada! Disfruta de {plans.find((p) => p.id === successPlan)?.name}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════
const SettingsView = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    email: user?.email || "",
    site: user?.site || "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    likes: true,
    comments: true,
    follows: true,
    newsletter: false,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    statusActive: true,
    showActivity: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [saved, setSaved] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Inject animations
  useEffect(() => {
    const id = "settings-anims";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .settings-input:focus {
        background: white !important;
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16,185,129,0.1) !important;
      }
      .settings-input.has-error {
        border-color: #ef4444 !important;
      }
      .settings-input.has-error:focus {
        box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  // Validation
  const validate = (data = formData) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "El nombre es obligatorio";
    if (!data.username.trim()) errs.username = "El usuario es obligatorio";
    else if (data.username.length < 3) errs.username = "Mínimo 3 caracteres";
    if (!data.email.trim()) errs.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Email no válido";
    if (data.site && !/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+/.test(data.site)) errs.site = "URL no válida";
    return errs;
  };

  const validatePasswords = () => {
    const errs = {};
    if (!passwords.current) errs.current = "Introduce tu contraseña actual";
    if (!passwords.new) errs.new = "Introduce la nueva contraseña";
    else if (passwords.new.length < 6) errs.new = "Mínimo 6 caracteres";
    if (passwords.new !== passwords.confirm) errs.confirm = "Las contraseñas no coinciden";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) {
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: errs[name] || undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate();
    setErrors((prev) => ({ ...prev, [name]: errs[name] || undefined }));
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, username: true, email: true, site: true, bio: true });
    if (Object.keys(errs).length > 0) return;

    if (updateUserProfile) updateUserProfile({ ...formData, avatar: avatarPreview || user?.avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = () => {
    const errs = validatePasswords();
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setPasswordSaved(true);
    setPasswords({ current: "", new: "", confirm: "" });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const showError = (field) => touched[field] && errors[field];

  const inputClass = (field) => `settings-input ${showError(field) ? "has-error" : ""}`;

  const navItems = [
    { id: "profile", label: "Editar Perfil", icon: User },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "privacy", label: "Privacidad", icon: Lock },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "pro", label: "Suscripción Pro", icon: Award },
  ];

  return (
    <div
      className="flex-1 h-full overflow-y-auto p-4 md:p-8 relative"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-[1200px] mx-auto space-y-8 relative z-10 pb-20">
        {/* Header */}
        <div>
          <h1
            className="text-[28px] font-black flex items-center gap-[10px]"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
            Ajustes
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
            Personaliza tu experiencia en ReLife
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ══════ Left column ══════ */}
          <div className="xl:col-span-4 space-y-5">
            {/* Profile card */}
            <div
              className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center relative overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-br from-emerald-50 to-teal-50/50" />
              <div className="relative mb-4 mt-2">
                <div className="p-1 rounded-full bg-white" style={{ boxShadow: "var(--shadow-md)" }}>
                  <img
                    src={avatarPreview || user?.avatar}
                    alt={user?.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-stone-50"
                  />
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-stone-900 text-white p-2 rounded-full hover:bg-emerald-500 transition-colors z-10 border-none cursor-pointer"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                  aria-label="Cambiar foto de perfil"
                  title="Cambiar foto"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                {formData.name || user?.name}
              </h2>
              <p className="font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                @{formData.username || user?.username}
              </p>
              {avatarPreview && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-medium text-emerald-600">Foto actualizada</span>
                  <button
                    onClick={() => setAvatarPreview(null)}
                    className="text-[11px] font-medium text-rose-400 hover:text-rose-600 bg-transparent border-none cursor-pointer underline"
                  >
                    Deshacer
                  </button>
                </div>
              )}
            </div>

            {/* Nav */}
            <div className="bg-white rounded-[24px] p-3" style={{ border: "1px solid var(--border)" }}>
              <nav className="space-y-1" role="navigation" aria-label="Secciones de ajustes">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all border-none cursor-pointer",
                      activeSection === item.id
                        ? "text-emerald-800 bg-emerald-50"
                        : "text-stone-500 hover:bg-stone-50 hover:text-stone-800 bg-transparent"
                    )}
                    aria-current={activeSection === item.id ? "true" : undefined}
                  >
                    <item.icon className="w-5 h-5" /> {item.label}
                  </button>
                ))}
                <div className="h-px bg-stone-100 my-2 mx-4" />
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border-none cursor-pointer bg-transparent"
                >
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>

          {/* ══════ Right column ══════ */}
          <div className="xl:col-span-8 space-y-6">
            {/* ── PROFILE SECTION ── */}
            {activeSection === "profile" && (
              <div
                className="bg-white rounded-[24px] p-8"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-7 gap-4">
                  <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span className="w-8 h-8 rounded-[10px] bg-emerald-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </span>
                    Información Personal
                  </h3>
                  <button
                    onClick={handleSave}
                    className="text-sm font-bold text-white px-6 py-[10px] rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-none cursor-pointer"
                    style={{
                      background: saved
                        ? "linear-gradient(135deg, #10b981, #14b8a6)"
                        : "var(--text-primary)",
                      boxShadow: "var(--shadow-md)",
                    }}
                    aria-label="Guardar cambios"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4" /> Guardado
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Guardar
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { name: "name", label: "Nombre", type: "text" },
                    { name: "username", label: "Usuario", prefix: "@" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "site", label: "Web", icon: Globe },
                  ].map((field) => (
                    <div key={field.name} className="space-y-[6px]">
                      <label
                        htmlFor={`settings-${field.name}`}
                        className="text-[11px] font-extrabold uppercase tracking-wide ml-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        {field.prefix && (
                          <span
                            className="absolute left-4 top-1/2 -translate-y-1/2 font-bold"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {field.prefix}
                          </span>
                        )}
                        {field.icon && (
                          <field.icon
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: "var(--text-muted)" }}
                          />
                        )}
                        <input
                          id={`settings-${field.name}`}
                          name={field.name}
                          type={field.type || "text"}
                          value={formData[field.name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={cn(
                            "w-full bg-stone-50 rounded-2xl py-3 text-sm font-semibold outline-none transition-all",
                            inputClass(field.name)
                          )}
                          style={{
                            border: "2px solid transparent",
                            color: "var(--text-primary)",
                            paddingLeft: field.prefix ? 34 : field.icon ? 40 : 18,
                            paddingRight: 18,
                            boxSizing: "border-box",
                          }}
                          aria-invalid={!!showError(field.name)}
                          aria-describedby={showError(field.name) ? `error-${field.name}` : undefined}
                        />
                      </div>
                      {showError(field.name) && (
                        <p
                          id={`error-${field.name}`}
                          className="flex items-center gap-1 ml-1 text-[11px] font-medium text-rose-500"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="space-y-[6px] md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="settings-bio"
                        className="text-[11px] font-extrabold uppercase tracking-wide ml-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Bio
                      </label>
                      <span className="text-[11px] font-medium" style={{ color: "var(--text-faint)" }}>
                        {formData.bio.length}/150
                      </span>
                    </div>
                    <textarea
                      id="settings-bio"
                      name="bio"
                      rows="3"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 150) })}
                      className="w-full bg-stone-50 rounded-2xl px-[18px] py-3 text-sm font-medium outline-none transition-all resize-none settings-input"
                      style={{
                        border: "2px solid transparent",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                      maxLength={150}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS SECTION ── */}
            {activeSection === "notifications" && (
              <div
                className="bg-white rounded-[24px] p-7"
                style={{ border: "1px solid var(--border)" }}
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-5" style={{ color: "var(--text-primary)" }}>
                  <span className="w-8 h-8 rounded-[10px] bg-emerald-100 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-emerald-600" />
                  </span>
                  Notificaciones
                </h3>
                <Toggle
                  id="notif-likes"
                  label="Likes"
                  description="Notificar cuando alguien da like a tu post."
                  checked={notifications.likes}
                  onChange={(v) => setNotifications({ ...notifications, likes: v })}
                />
                <Toggle
                  id="notif-comments"
                  label="Comentarios"
                  description="Notificar cuando alguien comenta en tu post."
                  checked={notifications.comments}
                  onChange={(v) => setNotifications({ ...notifications, comments: v })}
                />
                <Toggle
                  id="notif-follows"
                  label="Nuevos seguidores"
                  description="Notificar cuando alguien te sigue."
                  checked={notifications.follows}
                  onChange={(v) => setNotifications({ ...notifications, follows: v })}
                />
                <Toggle
                  id="notif-push"
                  label="Notificaciones Push"
                  description="Recibir notificaciones en el navegador."
                  checked={notifications.push}
                  onChange={(v) => setNotifications({ ...notifications, push: v })}
                />
                <Toggle
                  id="notif-email"
                  label="Email semanal"
                  description="Resumen de actividad semanal por email."
                  checked={notifications.email}
                  onChange={(v) => setNotifications({ ...notifications, email: v })}
                />
                <Toggle
                  id="notif-newsletter"
                  label="Newsletter"
                  description="Novedades y tips de reciclaje creativo."
                  checked={notifications.newsletter}
                  onChange={(v) => setNotifications({ ...notifications, newsletter: v })}
                />
              </div>
            )}

            {/* ── PRIVACY SECTION ── */}
            {activeSection === "privacy" && (
              <div
                className="bg-white rounded-[24px] p-7"
                style={{ border: "1px solid var(--border)" }}
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-5" style={{ color: "var(--text-primary)" }}>
                  <span className="w-8 h-8 rounded-[10px] bg-emerald-100 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </span>
                  Privacidad
                </h3>
                <Toggle
                  id="priv-public"
                  label="Perfil Público"
                  description="Tu perfil es visible para todos los usuarios."
                  checked={privacy.profilePublic}
                  onChange={(v) => setPrivacy({ ...privacy, profilePublic: v })}
                />
                <Toggle
                  id="priv-status"
                  label="Estado Online"
                  description="Mostrar cuándo estás conectado."
                  checked={privacy.statusActive}
                  onChange={(v) => setPrivacy({ ...privacy, statusActive: v })}
                />
                <Toggle
                  id="priv-activity"
                  label="Historial de actividad"
                  description="Otros pueden ver tus likes y comentarios."
                  checked={privacy.showActivity}
                  onChange={(v) => setPrivacy({ ...privacy, showActivity: v })}
                />

                {/* Theme toggle */}
                <div
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: "1px solid #f5f5f4" }}
                >
                  <label htmlFor="theme-toggle" className="pr-4 cursor-pointer">
                    <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                      {isDark ? <Moon className="w-4 h-4 text-violet-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      Modo oscuro
                    </h4>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {isDark ? "Tema oscuro activado. Pulsa para cambiar a claro." : "Tema claro activado. Pulsa para cambiar a oscuro."}
                    </p>
                  </label>
                  <button
                    id="theme-toggle"
                    role="switch"
                    aria-checked={isDark}
                    aria-label="Modo oscuro"
                    onClick={toggleTheme}
                    className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 border-none cursor-pointer"
                    style={{
                      background: isDark ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "#d6d3d1",
                    }}
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300",
                        isDark ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* ── SECURITY SECTION ── */}
            {activeSection === "security" && (
              <>
                {/* Change password */}
                <div
                  className="bg-white rounded-[24px] p-8"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-7 gap-4">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <span className="w-8 h-8 rounded-[10px] bg-emerald-100 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-emerald-600" />
                      </span>
                      Cambiar Contraseña
                    </h3>
                    <button
                      onClick={handlePasswordSave}
                      className="text-sm font-bold text-white px-6 py-[10px] rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-none cursor-pointer"
                      style={{
                        background: passwordSaved
                          ? "linear-gradient(135deg, #10b981, #14b8a6)"
                          : "var(--text-primary)",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      {passwordSaved ? (
                        <>
                          <Check className="w-4 h-4" /> Guardado
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Actualizar
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4 max-w-md">
                    {[
                      { key: "current", label: "Contraseña actual" },
                      { key: "new", label: "Nueva contraseña" },
                      { key: "confirm", label: "Confirmar contraseña" },
                    ].map((field) => (
                      <div key={field.key} className="space-y-[6px]">
                        <label
                          htmlFor={`pwd-${field.key}`}
                          className="text-[11px] font-extrabold uppercase tracking-wide ml-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            id={`pwd-${field.key}`}
                            type={showPasswords[field.key] ? "text" : "password"}
                            value={passwords[field.key]}
                            onChange={(e) => {
                              setPasswords({ ...passwords, [field.key]: e.target.value });
                              setPasswordErrors({ ...passwordErrors, [field.key]: undefined });
                            }}
                            className={cn(
                              "w-full bg-stone-50 rounded-2xl py-3 px-[18px] pr-12 text-sm font-semibold outline-none transition-all settings-input",
                              passwordErrors[field.key] && "has-error"
                            )}
                            style={{
                              border: "2px solid transparent",
                              color: "var(--text-primary)",
                              boxSizing: "border-box",
                            }}
                            autoComplete={field.key === "current" ? "current-password" : "new-password"}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({ ...showPasswords, [field.key]: !showPasswords[field.key] })
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                            style={{ color: "var(--text-muted)" }}
                            aria-label={showPasswords[field.key] ? "Ocultar" : "Mostrar"}
                          >
                            {showPasswords[field.key] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {passwordErrors[field.key] && (
                          <p className="flex items-center gap-1 ml-1 text-[11px] font-medium text-rose-500">
                            <AlertCircle className="w-3 h-3" />
                            {passwordErrors[field.key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger zone */}
                <div
                  className="bg-white rounded-[24px] p-7"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2" style={{ color: "#ef4444" }}>
                    <span className="w-8 h-8 rounded-[10px] bg-rose-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </span>
                    Zona peligrosa
                  </h3>
                  <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                    Estas acciones son permanentes y no se pueden deshacer.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-rose-600 border-none cursor-pointer transition-all hover:bg-rose-50"
                    style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar cuenta
                  </button>
                </div>
              </>
            )}

            {/* ── PRO SUBSCRIPTION SECTION ── */}
            {activeSection === "pro" && (
              <ProSubscriptionSection />
            )}
          </div>
        </div>
      </div>

      {/* Saved toast */}
      {(saved || passwordSaved) && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl text-white font-medium"
          style={{
            background: "linear-gradient(135deg, #10b981, #14b8a6)",
            boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
            animation: "slideUp 0.3s ease",
          }}
        >
          <Check className="w-5 h-5" />
          {saved ? "Perfil actualizado" : "Contraseña actualizada"}
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { setShowLogoutModal(false); logout(); }}
        icon={LogOut}
        iconBg="#fef2f2"
        title="¿Cerrar sesión?"
        message="Tendrás que volver a iniciar sesión para acceder a tu cuenta."
        confirmLabel="Cerrar sesión"
        danger
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => { setShowDeleteModal(false); logout(); }}
        icon={Trash2}
        iconBg="#fef2f2"
        title="¿Eliminar cuenta?"
        message="Se eliminarán todos tus datos, posts y conexiones de forma permanente."
        confirmLabel="Eliminar cuenta"
        danger
      />
    </div>
  );
};

export default SettingsView;