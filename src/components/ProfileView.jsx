import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  Heart,
  MessageCircle,
  Grid,
  Bookmark,
  Settings,
  Link as LinkIcon,
  Calendar,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  Share2,
  Check,
  Camera,
  Copy,
  ExternalLink,
  Award,
  Lock,
  Sparkles,
  Users,
  ShoppingBag,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Target,
  Search,
  Clock,
  Eye,
  Send,
  Smartphone,
  Download,
} from "lucide-react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════
// LAZY IMAGE
// ═══════════════════════════════════════════
const LazyImage = ({ src, alt, className, style }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <>
      {!loaded && (
        <div
          style={{
            ...style,
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #e7e5e4 25%, #f5f5f4 50%, #e7e5e4 75%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={className}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

// ═══════════════════════════════════════════
// DELETE POST MODAL
// ═══════════════════════════════════════════
const DeletePostModal = ({ isOpen, onClose, onConfirm, postTitle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar eliminación"
    >
      <div
        className="bg-white rounded-[28px] p-8 w-full max-w-sm"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Eliminar publicación
          </h3>
          <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
            ¿Estás seguro de que quieres eliminar esta publicación?
          </p>
          {postTitle && (
            <p
              className="text-sm font-medium bg-stone-100 px-3 py-2 rounded-lg mb-4 truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              "{postTitle}"
            </p>
          )}
          <p className="text-xs text-rose-500 mb-6">Esta acción no se puede deshacer.</p>
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
              className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors border-none cursor-pointer"
              style={{ boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════
const ProfilePostCard = React.memo(({ post, isOwn, onPostClick, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer relative rounded-[20px] overflow-hidden bg-white transition-all duration-500 hover:-translate-y-1"
      style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="article"
      aria-label={`Post: ${post.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPostClick(post)}
    >
      {/* Image */}
      <div
        onClick={() => onPostClick(post)}
        className="relative aspect-square overflow-hidden"
      >
        <LazyImage
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Category badge */}
        {post.category && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide z-10"
            style={{ background: "rgba(16,185,129,0.8)", backdropFilter: "blur(8px)" }}
          >
            {post.category}
          </div>
        )}

        {/* Delete button */}
        {isOwn && (
          <div
            className="absolute top-3 right-3 flex gap-2 transition-all duration-300 z-10"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(-6px)",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post);
              }}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-600 hover:text-rose-500 hover:bg-white transition-all border-none cursor-pointer"
              aria-label="Eliminar publicación"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hover stats */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Heart className="w-4 h-4" /> {post.likes}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold">
              <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div onClick={() => onPostClick(post)} className="p-4">
        <h4
          className="font-bold truncate group-hover:text-emerald-600 transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {post.title}
        </h4>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {post.tags && post.tags.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>
                #{post.tags[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            <Heart
              className={cn("w-[14px] h-[14px]", post.likedByUser && "fill-rose-500 text-rose-500")}
            />
            <span className="text-[12px] font-bold">{post.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfilePostCard.displayName = "ProfilePostCard";

// ═══════════════════════════════════════════
// ACHIEVEMENTS DATA — 15 logros con iconos Lucide
// ═══════════════════════════════════════════
const PROFILE_BADGES = [
  // Publicaciones
  { id: 1,  title: "Pionero",           desc: "Publica tu primer proyecto",              icon: Sparkles,       color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #14b8a6)", progress: 1,  total: 1,   unlocked: true,  rarity: "Común",      xp: 50 },
  { id: 2,  title: "Creador Activo",    desc: "Publica 10 proyectos",                   icon: Camera,         color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #06b6d4)", progress: 7,  total: 10,  unlocked: false, rarity: "Raro",       xp: 200 },
  { id: 3,  title: "Máquina de Ideas",  desc: "Alcanza 50 publicaciones",               icon: Zap,            color: "#059669", gradient: "linear-gradient(135deg, #059669, #10b981)", progress: 7,  total: 50,  unlocked: false, rarity: "Épico",      xp: 500 },
  // Social
  { id: 4,  title: "Primer Like",       desc: "Da like a una publicación",               icon: Heart,          color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #f43f5e)", progress: 1,  total: 1,   unlocked: true,  rarity: "Común",      xp: 25 },
  { id: 5,  title: "Comentarista",      desc: "Deja 25 comentarios",                     icon: MessageCircle,  color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)", progress: 18, total: 25,  unlocked: false, rarity: "Raro",       xp: 150 },
  { id: 6,  title: "Influencer Verde",  desc: "Consigue 100 seguidores",                 icon: Users,          color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", progress: 42, total: 100, unlocked: false, rarity: "Épico",      xp: 400 },
  { id: 7,  title: "Embajador",         desc: "Comparte 20 posts fuera de la app",       icon: Share2,         color: "#0d9488", gradient: "linear-gradient(135deg, #0d9488, #06b6d4)", progress: 5,  total: 20,  unlocked: false, rarity: "Raro",       xp: 175 },
  // Marketplace
  { id: 8,  title: "Primera Venta",     desc: "Vende tu primer producto",                icon: ShoppingBag,    color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #ea580c)", progress: 0,  total: 1,   unlocked: false, rarity: "Raro",       xp: 300 },
  { id: 9,  title: "Vendedor Estrella", desc: "Realiza 10 ventas exitosas",              icon: Star,           color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", progress: 0,  total: 10,  unlocked: false, rarity: "Épico",      xp: 600 },
  { id: 10, title: "Coleccionista",     desc: "Guarda 30 posts en colecciones",          icon: Bookmark,       color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #f472b6)", progress: 22, total: 30,  unlocked: false, rarity: "Raro",       xp: 125 },
  // Constancia
  { id: 11, title: "Streak Semanal",    desc: "Entra 7 días seguidos",                   icon: TrendingUp,     color: "#ea580c", gradient: "linear-gradient(135deg, #ea580c, #f59e0b)", progress: 7,  total: 7,   unlocked: true,  rarity: "Común",      xp: 100 },
  { id: 12, title: "Streak Mensual",    desc: "Racha de 30 días consecutivos",           icon: Target,         color: "#dc2626", gradient: "linear-gradient(135deg, #dc2626, #ea580c)", progress: 7,  total: 30,  unlocked: false, rarity: "Épico",      xp: 500 },
  { id: 13, title: "Madrugador",        desc: "Publica antes de las 8:00 AM",            icon: Clock,          color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", progress: 1,  total: 1,   unlocked: true,  rarity: "Raro",       xp: 75 },
  // Especial
  { id: 14, title: "Explorador",        desc: "Visita todas las secciones",              icon: Eye,            color: "#0891b2", gradient: "linear-gradient(135deg, #0891b2, #06b6d4)", progress: 6,  total: 8,   unlocked: false, rarity: "Común",      xp: 50 },
  { id: 15, title: "Leyenda Eco",       desc: "Desbloquea todos los demás logros",       icon: Shield,         color: "#7c3aed", gradient: "linear-gradient(160deg, #7c3aed, #ec4899, #f59e0b)", progress: 4, total: 14, unlocked: false, rarity: "Legendario", xp: 1000 },
];

const RARITY_COLORS = {
  "Común":      { color: "#78716c", bg: "rgba(120,113,108,0.08)" },
  "Raro":       { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  "Épico":      { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  "Legendario": { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
};

// ═══════════════════════════════════════════
// BADGE CARD
// ═══════════════════════════════════════════
const BadgeCard = ({ badge }) => {
  const [hovered, setHovered] = useState(false);
  const [animProg, setAnimProg] = useState(0);
  const Icon = badge.icon;
  const pct = (badge.progress / badge.total) * 100;
  const rc = RARITY_COLORS[badge.rarity] || RARITY_COLORS["Común"];

  useEffect(() => {
    const t = setTimeout(() => setAnimProg(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col"
      style={{
        background: "var(--bg-card)",
        border: `1px solid var(--border)`,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered && badge.unlocked
          ? `0 16px 40px ${badge.color}18`
          : hovered ? "0 12px 32px rgba(0,0,0,0.06)" : "var(--shadow-sm)",
        opacity: badge.unlocked ? 1 : 0.65,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-4 flex flex-col flex-1">
        {/* Rarity + XP */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: rc.bg, color: rc.color }}>
            {badge.rarity}
          </span>
          <span className="text-[9px] font-bold flex items-center gap-0.5" style={{ color: "var(--text-muted)" }}>
            <Zap className="w-2.5 h-2.5 text-amber-500" /> {badge.xp}
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 relative"
            style={{
              background: badge.unlocked ? badge.gradient : "var(--bg-input)",
              boxShadow: badge.unlocked ? `0 8px 20px ${badge.color}25` : "none",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {badge.unlocked
              ? <Icon className="w-6 h-6 text-white" />
              : <Lock className="w-5 h-5" style={{ color: "var(--text-faint)" }} />
            }
            {badge.unlocked && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#10b981", border: "2px solid var(--bg-card)" }}
              >
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        {/* Title + desc */}
        <h4
          className="text-[12px] font-black text-center mb-0.5"
          style={{ color: badge.unlocked ? "var(--text-primary)" : "var(--text-muted)" }}
        >
          {badge.title}
        </h4>
        <p className="text-[9px] text-center leading-relaxed mb-auto" style={{ color: "var(--text-muted)" }}>
          {badge.desc}
        </p>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-semibold" style={{ color: "var(--text-muted)" }}>
              {badge.progress}/{badge.total}
            </span>
            <span className="text-[8px] font-bold" style={{ color: badge.unlocked ? badge.color : "var(--text-muted)" }}>
              {Math.round(pct)}%
            </span>
          </div>
          <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animProg}%`, background: badge.unlocked ? badge.gradient : "var(--text-faint)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// BADGES SECTION (inside Profile tab)
// ═══════════════════════════════════════════
const BadgesSection = () => {
  const unlocked = PROFILE_BADGES.filter((b) => b.unlocked);
  const locked = PROFILE_BADGES.filter((b) => !b.unlocked);
  const totalXp = unlocked.reduce((s, b) => s + b.xp, 0);
  const overallPct = Math.round((unlocked.length / PROFILE_BADGES.length) * 100);

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div
        className="rounded-[24px] p-6 flex flex-col sm:flex-row items-center gap-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", boxShadow: "0 8px 24px rgba(245,158,11,0.25)" }}
        >
          <Award className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
            {unlocked.length} de {PROFILE_BADGES.length} logros
          </h3>
          <div className="h-2 rounded-full overflow-hidden mt-2 mb-1" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${overallPct}%`, background: "linear-gradient(90deg, #f59e0b, #10b981, #06b6d4)", transition: "width 1s ease-out" }}
            />
          </div>
          <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            {overallPct}% completado · {totalXp.toLocaleString()} XP ganados
          </p>
        </div>
        <div className="flex gap-5 flex-shrink-0">
          {Object.entries(RARITY_COLORS).map(([name, cfg]) => (
            <div key={name} className="text-center">
              <p className="text-[14px] font-black" style={{ color: cfg.color }}>
                {PROFILE_BADGES.filter((b) => b.rarity === name && b.unlocked).length}
              </p>
              <p className="text-[8px] font-bold uppercase" style={{ color: cfg.color }}>{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h4 className="text-[13px] font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Check className="w-4 h-4 text-emerald-500" /> Desbloqueados
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              {unlocked.length}
            </span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlocked.map((b) => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h4 className="text-[13px] font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
            <Lock className="w-4 h-4" /> Por desbloquear
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--bg-input)", color: "var(--text-muted)" }}>
              {locked.length}
            </span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {locked.map((b) => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// DOWNLOAD APP MODAL — premium landing style
// ═══════════════════════════════════════════
const DownloadModal = ({ onClose }) => {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setEntering(false)));
    document.body.style.overflow = "hidden";
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", h); };
  }, [onClose]);

  // Inject glow animation
  useEffect(() => {
    const id = "download-modal-anims";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes dlFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes dlPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      @keyframes dlSpin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  const features = [
    { icon: Heart, title: "Feed Social", desc: "Posts, stories y trending topics de reciclaje", color: "#ef4444" },
    { icon: ShoppingBag, title: "Marketplace", desc: "Compra y vende creaciones recicladas", color: "#f59e0b" },
    { icon: Award, title: "Gamificación", desc: "XP, logros, rachas y retos semanales", color: "#8b5cf6" },
    { icon: MessageCircle, title: "Mensajería", desc: "Chat directo entre creadores", color: "#3b82f6" },
    { icon: Eye, title: "Explorar", desc: "Descubre creadores y categorías", color: "#10b981" },
    { icon: Shield, title: "Perfil Pro", desc: "Verificación, estadísticas y más", color: "#0d9488" },
  ];

  const stats = [
    { value: "50k+", label: "Descargas" },
    { value: "4.8", label: "Valoración" },
    { value: "20k+", label: "Creadores" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
      style={{
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(20px)",
        opacity: entering ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[900px] max-h-[92vh] overflow-hidden rounded-[32px] flex flex-col md:flex-row"
        style={{
          boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
          transform: entering ? "translateY(30px) scale(0.96)" : "translateY(0) scale(1)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ LEFT PANEL — Dark hero ═══ */}
        <div
          className="relative w-full md:w-[45%] flex-shrink-0 overflow-hidden flex flex-col items-center justify-center p-8 md:p-10"
          style={{ background: "linear-gradient(160deg, #0a0f0c, #0c1810, #091a12)", minHeight: 340 }}
        >
          {/* Animated background orbs */}
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", animation: "dlPulse 4s ease-in-out infinite" }} />
          <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", animation: "dlPulse 5s ease-in-out infinite 1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.03)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.04)" }} />

          {/* Close (mobile top) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all hover:scale-110 z-20"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo text */}
          <div className="relative z-10 text-center mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl md:text-4xl font-black text-white tracking-tight">Re</span>
              <span
                className="text-3xl md:text-4xl font-black tracking-tight"
                style={{ background: "linear-gradient(135deg, #6ee7b7, #14b8a6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Life
              </span>
            </div>
            <p className="text-white/30 text-[12px] font-medium tracking-wide">
              Reciclaje creativo en tu bolsillo
            </p>
          </div>

          {/* QR — big, centered */}
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[9px] font-bold uppercase tracking-[2px] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              Escanea para descargar
            </p>
            <div
              className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden flex items-center justify-center"
              style={{ background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.4), 0 0 80px rgba(16,185,129,0.15)" }}
            >
              <img
                src={new URL("../assets/qr_relife.png", import.meta.url).href}
                alt="QR para descargar ReLife"
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;color:#999">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                      <span style="font-size:10px;font-weight:600">qr_relife.png</span>
                    </div>
                  `;
                }}
              />
            </div>
            {/* Glow behind QR */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full -z-10"
              style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", filter: "blur(40px)" }}
            />
            <p className="text-[10px] mt-3 font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>
              Apunta con la cámara de tu móvil
            </p>
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-6 mt-6">
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.06)" }} />}
                <div className="text-center">
                  <p className="text-white text-lg font-black">{s.value}</p>
                  <p className="text-white/25 text-[9px] font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Content ═══ */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--bg-card)" }}
        >
          {/* Features grid */}
          <div className="p-6 md:p-8">
            <h3 className="text-[13px] font-black mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Todo lo que incluye
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-3 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ background: `${f.color}12` }}
                  >
                    <f.icon className="w-4 h-4" style={{ color: f.color }} />
                  </div>
                  <p className="text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {f.title}
                  </p>
                  <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Download bar */}
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))",
                border: "1px solid rgba(16,185,129,0.12)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}
              >
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
                  ReLife para Android
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  v1.0 · 24 MB · Android 8.0+
                </p>
              </div>
              <span
                className="text-[11px] font-bold uppercase px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", color: "white", boxShadow: "0 4px 12px rgba(16,185,129,0.25)" }}
              >
                Gratis
              </span>
            </div>

            <p className="text-center text-[10px] mt-3 flex items-center justify-center gap-1.5" style={{ color: "var(--text-faint)" }}>
              <Smartphone className="w-3 h-3" /> Android · iOS próximamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// PROFILE VIEW
// ═══════════════════════════════════════════
const ProfileView = ({ onPostClick, onNavigateToSettings }) => {
  const { user, updateUser } = useAuth();
  const { posts, deletePost } = useData();
  const [activeTab, setActiveTab] = useState("posts");
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user?.bio || "");
  const [copied, setCopied] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const bioRef = useRef(null);
  const avatarInputRef = useRef(null);

  const userPosts = useMemo(
    () => posts.filter((p) => p.author === user?.name || p.author === "Tú"),
    [posts, user?.name]
  );

  const savedPosts = useMemo(
    () => posts.filter((p) => p.saved),
    [posts]
  );

  const likedPosts = useMemo(
    () => posts.filter((p) => p.likedByUser),
    [posts]
  );

  const totalLikes = useMemo(
    () => userPosts.reduce((acc, p) => acc + (p.likes || 0), 0),
    [userPosts]
  );

  const displayPosts = activeTab === "posts" ? userPosts : activeTab === "saved" ? savedPosts : likedPosts;

  const tabs = [
    { id: "posts", label: "Publicaciones", icon: Grid, count: userPosts.length },
    { id: "saved", label: "Guardados", icon: Bookmark, count: savedPosts.length },
    { id: "liked", label: "Me gusta", icon: Heart, count: likedPosts.length },
    { id: "achievements", label: "Logros", icon: Award, count: null },
  ];

  // Focus bio input when editing
  useEffect(() => {
    if (editingBio && bioRef.current) {
      bioRef.current.focus();
      bioRef.current.selectionStart = bioRef.current.value.length;
    }
  }, [editingBio]);

  // Inject animations
  useEffect(() => {
    const id = "profile-anims";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  const handleDeletePost = () => {
    if (postToDelete) {
      deletePost(postToDelete.id);
      setPostToDelete(null);
    }
  };

  const handleSaveBio = () => {
    if (updateUser) {
      updateUser({ bio: bioText.trim() });
    }
    setEditingBio(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (updateUser) updateUser({ avatar: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/profile/${user?.username}`;
    if (navigator.share) {
      navigator.share({ title: `${user?.name} en ReLife`, url });
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto" style={{ background: "var(--bg-primary)" }}>
      <DeletePostModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeletePost}
        postTitle={postToDelete?.title}
      />

      {/* Cover */}
      <div className="relative" style={{ height: 220, overflow: "hidden" }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #10b981, #0d9488, #06b6d4)" }}
        />
        {/* Decorative pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="coverPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="8" fill="white" />
              <circle cx="0" cy="0" r="4" fill="white" />
              <circle cx="60" cy="60" r="4" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#coverPattern)" />
        </svg>
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }}
        />

        {/* Share profile button */}
        <button
          onClick={handleShareProfile}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
          aria-label="Compartir perfil"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? "¡Copiado!" : "Compartir"}
        </button>
      </div>

      {/* Profile card */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        <div
          className="relative -mt-20 bg-white rounded-[28px] p-7 md:p-8"
          style={{ border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="-mt-[72px] relative">
              <div
                className="w-[120px] h-[120px] rounded-full p-1 bg-gradient-to-br from-emerald-500 to-teal-500"
                style={{ boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 bg-stone-900 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center transition-all border-none cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
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

            {/* Info */}
            <div className="text-center w-full max-w-[450px]">
              <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                {user?.name}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                @{user?.username}
              </p>

              {/* Editable bio */}
              <div className="mt-3 relative group">
                {editingBio ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      ref={bioRef}
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value.slice(0, 150))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSaveBio(); }
                        if (e.key === "Escape") { setBioText(user?.bio || ""); setEditingBio(false); }
                      }}
                      className="w-full p-3 rounded-xl bg-stone-50 text-sm outline-none resize-none text-center font-medium focus:ring-2 focus:ring-emerald-500/20"
                      style={{ border: "2px solid var(--border)", color: "var(--text-secondary)" }}
                      rows={2}
                      maxLength={150}
                      aria-label="Editar biografía"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium" style={{ color: "var(--text-faint)" }}>
                        {bioText.length}/150
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setBioText(user?.bio || ""); setEditingBio(false); }}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-stone-100 hover:bg-stone-200 transition-colors border-none cursor-pointer"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveBio}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-white border-none cursor-pointer transition-colors"
                          style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingBio(true)}
                    className="cursor-pointer rounded-xl px-3 py-2 transition-colors hover:bg-stone-50 relative"
                    role="button"
                    tabIndex={0}
                    aria-label="Editar biografía"
                    onKeyDown={(e) => e.key === "Enter" && setEditingBio(true)}
                  >
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {user?.bio || "¡Hola! Soy nuevo en ReLife. Toca para editar tu bio."}
                    </p>
                    <Edit3
                      className="absolute top-2 right-2 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm flex-wrap justify-center" style={{ color: "var(--text-muted)" }}>
              <button
                onClick={() => setShowDownload(true)}
                className="flex items-center gap-1 hover:text-emerald-600 transition-colors bg-transparent border-none cursor-pointer p-0 text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="font-medium">relife.app</span>
              </button>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">Se unió en 2024</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-2 flex-wrap justify-center">
              {[
                [userPosts.length, "Posts"],
                [user?.stats?.followers || 128, "Seguidores"],
                [user?.stats?.following || 89, "Siguiendo"],
                [totalLikes, "Likes"],
              ].map(([value, label]) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </p>
                  <p className="text-[11px] font-semibold uppercase" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={onNavigateToSettings}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border-none cursor-pointer"
              style={{ fontWeight: 700, fontSize: 13, color: "var(--text-secondary)" }}
              aria-label="Editar perfil"
            >
              <Settings className="w-4 h-4" /> Editar perfil
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8 mt-6">
        <div
          className="bg-white rounded-2xl p-1 inline-flex flex-wrap"
          style={{ border: "1px solid var(--border)" }}
          role="tablist"
          aria-label="Contenido del perfil"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-[9px] rounded-xl text-[13px] font-bold transition-all border-none cursor-pointer",
                  activeTab === tab.id
                    ? "bg-stone-900 text-white shadow-lg"
                    : "text-stone-500 hover:text-stone-700 bg-transparent"
                )}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-label={`${tab.label}: ${tab.count}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                <span
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full font-bold",
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 text-stone-500"
                  )}
                >
                  {tab.count}
                </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 pb-24">
        {activeTab === "achievements" ? (
          <BadgesSection />
        ) : displayPosts.length === 0 ? (
          <div
            className="bg-white rounded-[24px] p-12 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "posts" ? (
                <Grid className="w-8 h-8 text-emerald-500" />
              ) : activeTab === "saved" ? (
                <Bookmark className="w-8 h-8 text-emerald-500" />
              ) : (
                <Heart className="w-8 h-8 text-emerald-500" />
              )}
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {activeTab === "posts"
                ? "Sin publicaciones aún"
                : activeTab === "saved"
                ? "Sin guardados aún"
                : "Sin likes aún"}
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              {activeTab === "posts"
                ? "Comparte tu primer proyecto de reciclaje creativo."
                : activeTab === "saved"
                ? "Guarda posts que te inspiren para verlos más tarde."
                : "Da like a los posts que más te gusten."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {displayPosts.map((post) => (
              <ProfilePostCard
                key={post.id}
                post={post}
                isOwn={activeTab === "posts"}
                onPostClick={onPostClick}
                onDelete={setPostToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Download App Modal */}
      {showDownload && <DownloadModal onClose={() => setShowDownload(false)} />}
    </div>
  );
};

export default ProfileView;