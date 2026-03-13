import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
// SETTINGS VIEW
// ═══════════════════════════════════════════
const SettingsView = () => {
  const { user, updateUserProfile, logout } = useAuth();
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