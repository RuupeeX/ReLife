import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import LogoImg from "../assets/ReLife_Icon3.png";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Recycle,
  Heart,
  Leaf,
  AlertCircle,
  Check,
} from "lucide-react";

// ═══════════════════════════════════════════
// AUTH LOGO — solo imagen, fallback icono+texto
// ═══════════════════════════════════════════
const AuthLogo = ({ size = "desktop" }) => {
  const [imgError, setImgError] = useState(false);
  const isDesktop = size === "desktop";

  if (imgError) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: isDesktop ? 44 : 36,
            height: isDesktop ? 44 : 36,
            borderRadius: isDesktop ? 14 : 10,
            background: "linear-gradient(135deg, #10b981, #14b8a6)",
          }}
        >
          <Recycle className="text-white" style={{ width: isDesktop ? 22 : 18, height: isDesktop ? 22 : 18 }} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`${isDesktop ? "text-2xl" : "text-xl"} font-black text-white tracking-tight`}>Re</span>
          <span className={`${isDesktop ? "text-2xl" : "text-xl"} font-black tracking-tight`} style={{ color: "#6ee7b7" }}>Life</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={LogoImg}
      alt="ReLife"
      className="object-contain flex-shrink-0"
      style={{
        height: isDesktop ? 75 : 65,
        width: "auto",
        maxWidth: isDesktop ? 200 : 160,
      }}
      onError={() => setImgError(true)}
    />
  );
};

// ═══════════════════════════════════════════
// PASSWORD STRENGTH INDICATOR
// ═══════════════════════════════════════════
const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: "6+ caracteres", pass: password.length >= 6 },
    { label: "Mayúscula", pass: /[A-Z]/.test(password) },
    { label: "Número", pass: /[0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.pass).length;
  const colors = ["#ef4444", "#f59e0b", "#10b981"];
  const labels = ["Débil", "Media", "Fuerte"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{
              background: i < strength ? colors[strength - 1] : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold transition-colors"
          style={{ color: strength > 0 ? colors[strength - 1] : "rgba(255,255,255,0.2)" }}
        >
          {strength > 0 ? labels[strength - 1] : ""}
        </span>
        <div className="flex gap-3">
          {checks.map((c) => (
            <span
              key={c.label}
              className="text-[10px] font-medium flex items-center gap-1 transition-colors"
              style={{ color: c.pass ? "#6ee7b7" : "rgba(255,255,255,0.2)" }}
            >
              {c.pass && <Check className="w-2.5 h-2.5" />}
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// AUTH VIEW
// ═══════════════════════════════════════════
const AuthView = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [socialTooltip, setSocialTooltip] = useState(null);
  const emailRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setFormData({ name: "", username: "", email: "", password: "" });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setTimeout(() => emailRef.current?.focus(), 100);
  }, [isLogin]);

  useEffect(() => {
    const id = "auth-animations";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes authFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .auth-fade-in { animation: authFadeIn 0.3s ease forwards; }
      .auth-input:focus {
        background: rgba(255,255,255,0.08) !important;
        border-color: rgba(16,185,129,0.5) !important;
        box-shadow: 0 0 0 3px rgba(16,185,129,0.1) !important;
      }
      .auth-input::placeholder { color: rgba(255,255,255,0.25); }
      .auth-input.has-error { border-color: rgba(239,68,68,0.5) !important; }
      .auth-input.has-error:focus { 
        border-color: rgba(239,68,68,0.5) !important; 
        box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  const validate = (data = formData) => {
    const errs = {};
    if (!data.email.trim()) errs.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Email no válido";

    if (!data.password) errs.password = "La contraseña es obligatoria";
    else if (data.password.length < 6) errs.password = "Mínimo 6 caracteres";

    if (!isLogin) {
      if (!data.name.trim()) errs.name = "El nombre es obligatorio";
      if (!data.username.trim()) errs.username = "El usuario es obligatorio";
      else if (data.username.length < 3) errs.username = "Mínimo 3 caracteres";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, username: true, email: true, password: true });
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (isLogin) {
      login(formData.email, formData.password);
    } else {
      register(formData);
    }
    setIsLoading(false);
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

  const showError = (field) => touched[field] && errors[field];

  const inputClass = (field) =>
    `auth-input ${showError(field) ? "has-error" : ""}`;

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
  };

  const features = [
    { icon: Recycle, text: "Comparte proyectos de reciclaje" },
    { icon: Heart, text: "Conecta con creadores" },
    { icon: Leaf, text: "Inspira a la comunidad" },
  ];

  const FieldError = ({ field }) => {
    if (!showError(field)) return null;
    return (
      <p className="flex items-center gap-1 mt-1.5 ml-1 text-[11px] font-medium auth-fade-in" style={{ color: "#f87171" }}>
        <AlertCircle className="w-3 h-3" />
        {errors[field]}
      </p>
    );
  };

  return (
    <div
      className="h-screen w-full flex overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0c1810 0%, #0f2318 30%, #0a1f14 60%, #081810 100%)",
      }}
    >
      {/* ── LEFT: Branding ── */}
      <div className="hidden lg:flex relative overflow-hidden" style={{ width: "48%" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "15%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "20%",
            right: "15%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Logo Desktop */}
          <AuthLogo size="desktop" />

          {/* Main headline */}
          <div className="max-w-[420px]">
            <h1
              className="font-display leading-tight mb-5"
              style={{ fontSize: 52, fontWeight: 900, color: "white" }}
            >
              Dale una nueva
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #6ee7b7, #14b8a6, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                vida
              </span>{" "}
              a todo
            </h1>
            <p
              className="mb-10"
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.7,
              }}
            >
              La comunidad donde el reciclaje creativo se convierte en arte.
              Comparte, inspira y transforma.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    opacity: 0,
                    animation: `authFadeIn 0.4s ease ${0.3 + index * 0.15}s forwards`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.08)" }}
                  >
                    <feature.icon className="w-[17px] h-[17px] text-emerald-400" />
                  </div>
                  <span className="text-[14px] font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              ["50k+", "Creadores"],
              ["120k+", "Proyectos"],
              ["98%", "Satisfacción"],
            ].map(([value, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.06)" }} />
                )}
                <div>
                  <p className="text-[30px] font-black text-white tracking-tight">{value}</p>
                  <p
                    className="text-[10px] font-bold uppercase"
                    style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}
                  >
                    {label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo — centrado */}
          <div className="mb-8 lg:hidden flex justify-center">
            <AuthLogo size="mobile" />
          </div>

          {/* Card */}
          <div
            className="rounded-[28px] p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Toggle */}
            <div
              className="flex p-1 rounded-[14px] mb-7"
              style={{ background: "rgba(255,255,255,0.05)" }}
              role="tablist"
            >
              {["Iniciar Sesión", "Registrarse"].map((label, i) => {
                const active = i === 0 ? isLogin : !isLogin;
                return (
                  <button
                    key={label}
                    onClick={() => setIsLogin(i === 0)}
                    className="flex-1 py-[10px] rounded-[10px] text-sm font-bold border-none cursor-pointer transition-all"
                    style={{
                      background: active ? "rgba(16,185,129,0.15)" : "transparent",
                      color: active ? "#6ee7b7" : "rgba(255,255,255,0.3)",
                    }}
                    role="tab"
                    aria-selected={active}
                    aria-label={label}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Header */}
            <div key={isLogin ? "login" : "register"} className="auth-fade-in">
              <h2 className="text-2xl font-black text-white mb-1">
                {isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isLogin ? "Te echábamos de menos" : "Únete a la revolución verde"}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ gap: 14 }}
              noValidate
            >
              {!isLogin && (
                <div key="register-fields" className="grid grid-cols-2 gap-[10px] auth-fade-in">
                  <div>
                    <input
                      name="name"
                      value={formData.name}
                      placeholder="Nombre"
                      required={!isLogin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass("name")}
                      style={inputStyle}
                      aria-label="Nombre"
                      aria-invalid={!!showError("name")}
                    />
                    <FieldError field="name" />
                  </div>
                  <div>
                    <input
                      name="username"
                      value={formData.username}
                      placeholder="@usuario"
                      required={!isLogin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass("username")}
                      style={inputStyle}
                      aria-label="Nombre de usuario"
                      aria-invalid={!!showError("username")}
                    />
                    <FieldError field="username" />
                  </div>
                </div>
              )}

              <div>
                <input
                  ref={emailRef}
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("email")}
                  style={inputStyle}
                  aria-label="Email"
                  aria-invalid={!!showError("email")}
                  autoComplete="email"
                />
                <FieldError field="email" />
              </div>

              <div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="Contraseña"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("password")}
                    style={{ ...inputStyle, paddingRight: 44 }}
                    aria-label="Contraseña"
                    aria-invalid={!!showError("password")}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <FieldError field="password" />
                {!isLogin && <PasswordStrength password={formData.password} />}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-[14px] text-white font-extrabold text-[15px] rounded-[14px] border-none cursor-pointer flex items-center justify-center gap-2 mt-2 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0d9488, #06b6d4)",
                  boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>o</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Social buttons */}
            <div className="flex gap-2">
              {["Google", "Twitter", "GitHub"].map((provider) => (
                <div key={provider} className="flex-1 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSocialTooltip(provider);
                      setTimeout(() => setSocialTooltip(null), 1500);
                    }}
                    className="w-full flex items-center justify-center py-[10px] rounded-xl text-sm font-semibold transition-all border-none cursor-pointer hover:bg-white/[0.08]"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    aria-label={`Iniciar sesión con ${provider} (próximamente)`}
                  >
                    {provider}
                  </button>
                  {socialTooltip === provider && (
                    <div
                      className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap auth-fade-in"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      Próximamente
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[13px] mt-5" style={{ color: "rgba(255,255,255,0.25)" }}>
            {isLogin ? "¿Nuevo aquí? " : "¿Ya tienes cuenta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="bg-transparent border-none cursor-pointer font-bold transition-colors hover:underline"
              style={{ color: "#6ee7b7" }}
            >
              {isLogin ? "Crea una cuenta" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;