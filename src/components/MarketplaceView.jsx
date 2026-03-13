import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  Search, Heart, Bookmark, ShoppingBag, X, SlidersHorizontal,
  ChevronDown, ChevronLeft, ChevronRight, Tag, MapPin, MessageCircle,
  Share2, Check, PlusCircle, Package, Eye, Sofa, Lightbulb, Palette,
  Shirt, Flower2, LayoutDashboard, Star, ImagePlus, Trash2, Sparkles,
  Clock, Shield, Truck, DollarSign, TrendingUp,
} from "lucide-react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════
const categories = [
  { id: "all", label: "Todo", icon: LayoutDashboard, color: "#6b7280" },
  { id: "furniture", label: "Muebles", icon: Sofa, color: "#f59e0b" },
  { id: "lighting", label: "Iluminación", icon: Lightbulb, color: "#8b5cf6" },
  { id: "decor", label: "Decoración", icon: Palette, color: "#ec4899" },
  { id: "fashion", label: "Moda", icon: Shirt, color: "#3b82f6" },
  { id: "garden", label: "Jardín", icon: Flower2, color: "#10b981" },
];

const sortOptions = [
  { id: "recent", label: "Recientes", icon: Clock },
  { id: "price-low", label: "Precio ↑", icon: TrendingUp },
  { id: "price-high", label: "Precio ↓", icon: ChevronDown },
  { id: "popular", label: "Populares", icon: Star },
];

const conditions = ["Todos", "Nuevo", "Restaurado", "Usado"];

// ═══════════════════════════════════════════
// PRICE RANGE SLIDER — improved with dual track
// ═══════════════════════════════════════════
const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [v, setV] = useState(value[1]);
  useEffect(() => setV(value[1]), [value]);

  const pct = ((v - min) / (max - min)) * 100;

  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Precio máx.
        </span>
        <span
          className="text-[15px] font-black px-3 py-1 rounded-lg"
          style={{ color: "#10b981", background: "rgba(16,185,129,0.08)" }}
        >
          {v}€
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "var(--border)" }}>
        <div
          className="absolute h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #10b981, #14b8a6)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          onMouseUp={() => onChange([value[0], v])}
          onTouchEnd={() => onChange([value[0], v])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%" }}
          aria-label="Precio máximo"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white"
          style={{
            left: `calc(${pct}% - 10px)`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 0 0 3px rgba(16,185,129,0.2)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-semibold" style={{ color: "var(--text-faint)" }}>{min}€</span>
        <span className="text-[10px] font-semibold" style={{ color: "var(--text-faint)" }}>{max}€</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// FEATURED BANNER — hero carousel with enhanced visuals
// ═══════════════════════════════════════════
const FeaturedBanner = ({ items, onItemClick }) => {
  const [cur, setCur] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const feat = items.filter((i) => i.likes > 30 && !i.sold).slice(0, 4);

  useEffect(() => {
    if (feat.length <= 1) return;
    const t = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCur((p) => (p + 1) % feat.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);
    return () => clearInterval(t);
  }, [feat.length]);

  if (!feat.length) return null;
  const item = feat[cur];

  return (
    <div
      className="relative rounded-[28px] overflow-hidden cursor-pointer group mb-8"
      style={{ height: 260 }}
      onClick={() => onItemClick(item)}
    >
      {/* Background image */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s]"
        style={{ transform: isTransitioning ? "scale(1.15)" : "scale(1.05)" }}
      />

      {/* Multi-layer gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(12,24,16,0.85) 0%, rgba(12,24,16,0.4) 50%, transparent 100%),
            linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)
          `,
        }}
      />

      {/* Decorative accent line */}
      <div
        className="absolute top-0 left-0 h-full w-1"
        style={{ background: "linear-gradient(to bottom, #10b981, #06b6d4, transparent)" }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(10px)" : "translateY(0)",
          transition: "all 0.4s ease",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white"
                style={{ background: "rgba(16,185,129,0.7)", backdropFilter: "blur(8px)" }}
              >
                <Sparkles className="w-3 h-3" /> Destacado
              </span>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white/70"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
              >
                <Heart className="w-3 h-3" /> {item.likes}
              </span>
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-black max-w-md leading-tight tracking-tight">
              {item.title}
            </h2>
            <p className="text-white/50 text-sm mt-2 max-w-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-5">
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Precio</p>
              <span className="text-white text-3xl font-black">{item.price}€</span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <img
                src={item.sellerAvatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.2)" }}
              />
              <div>
                <p className="text-white/80 text-[13px] font-bold">{item.seller}</p>
                <p className="text-white/30 text-[10px] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Verificado
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dots */}
            {feat.length > 1 && (
              <div className="flex gap-1.5">
                {feat.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTransitioning(true);
                      setTimeout(() => { setCur(i); setIsTransitioning(false); }, 300);
                    }}
                    className="border-none cursor-pointer p-0 rounded-full transition-all duration-300"
                    style={{
                      width: i === cur ? 24 : 6,
                      height: 6,
                      background: i === cur ? "white" : "rgba(255,255,255,0.3)",
                    }}
                    aria-label={`Producto destacado ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* CTA */}
            <div
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all group-hover:gap-3"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              Ver <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// QUICK STATS BAR
// ═══════════════════════════════════════════
const QuickStats = ({ items }) => {
  const total = items.filter((i) => !i.sold).length;
  const sold = items.filter((i) => i.sold).length;
  const avgPrice = Math.round(items.reduce((a, i) => a + i.price, 0) / items.length);

  const stats = [
    { label: "Disponibles", value: total, icon: Package, color: "#10b981" },
    { label: "Vendidos", value: sold, icon: Check, color: "#8b5cf6" },
    { label: "Precio medio", value: `${avgPrice}€`, icon: TrendingUp, color: "#f59e0b" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${s.color}15` }}
          >
            <s.icon className="w-4 h-4" style={{ color: s.color }} />
          </div>
          <div>
            <p className="text-[17px] font-black" style={{ color: "var(--text-primary)" }}>
              {s.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════
// PRODUCT CARD — enhanced with better hover, layout, badges
// ═══════════════════════════════════════════
const ProductCard = React.memo(({ item, onLike, onSave, onClick, viewMode = "grid" }) => {
  const [hovered, setHovered] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    onLike(item.id);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(item.id);
  };

  // ── List mode ──
  if (viewMode === "list") {
    return (
      <div
        onClick={() => onClick(item)}
        className="flex bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group"
        style={{ border: "1px solid var(--border)" }}
        role="article"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick(item)}
      >
        <div className="relative w-40 md:w-52 flex-shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {item.sold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-black">VENDIDO</span>
            </div>
          )}
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-wide"
            style={{ background: "rgba(16,185,129,0.85)", backdropFilter: "blur(4px)" }}
          >
            {item.condition}
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-[15px] group-hover:text-emerald-600 transition-colors truncate" style={{ color: "var(--text-primary)" }}>
                {item.title}
              </h3>
              <span className="text-lg font-black flex-shrink-0" style={{ color: "#10b981" }}>{item.price}€</span>
            </div>
            <p className="text-[12px] mt-1.5 line-clamp-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <img src={item.sellerAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>{item.seller}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all",
                  item.likedByUser ? "bg-rose-50 text-rose-500" : "bg-stone-50 text-stone-400 hover:text-rose-500"
                )}
                style={{ transform: likeAnim ? "scale(1.2)" : "scale(1)" }}
                aria-label={item.likedByUser ? "Quitar like" : "Dar like"}
              >
                <Heart className={cn("w-[14px] h-[14px]", item.likedByUser && "fill-current")} />
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all",
                  item.saved ? "bg-amber-50 text-amber-500" : "bg-stone-50 text-stone-400 hover:text-amber-500"
                )}
                aria-label={item.saved ? "Quitar de guardados" : "Guardar"}
              >
                <Bookmark className={cn("w-[14px] h-[14px]", item.saved && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid mode (default) ──
  return (
    <div
      className="group bg-white rounded-[22px] overflow-hidden cursor-pointer transition-all duration-500"
      style={{
        border: "1px solid var(--border)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.1)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
            opacity: hovered ? 1 : 0.4,
          }}
        />

        {/* Sold overlay */}
        {item.sold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="px-5 py-2.5 bg-white rounded-xl text-sm font-black" style={{ color: "var(--text-primary)" }}>
              VENDIDO
            </span>
          </div>
        )}

        {/* Condition badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide z-10"
          style={{ background: "rgba(16,185,129,0.85)", backdropFilter: "blur(8px)" }}
        >
          {item.condition}
        </div>

        {/* Action buttons */}
        <div
          className="absolute top-3 right-3 flex gap-1.5 z-10 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <button
            onClick={handleLike}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all",
              item.likedByUser
                ? "bg-rose-500 text-white"
                : "bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-rose-500 hover:text-white"
            )}
            style={{
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              transform: likeAnim ? "scale(1.25)" : "scale(1)",
            }}
            aria-label={item.likedByUser ? "Quitar like" : "Dar like"}
          >
            <Heart className={cn("w-[15px] h-[15px]", item.likedByUser && "fill-current")} />
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all",
              item.saved
                ? "bg-amber-500 text-white"
                : "bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-amber-500 hover:text-white"
            )}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
            aria-label={item.saved ? "Quitar de guardados" : "Guardar"}
          >
            <Bookmark className={cn("w-[15px] h-[15px]", item.saved && "fill-current")} />
          </button>
        </div>

        {/* Bottom stats overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between z-10 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          <div className="flex items-center gap-3 text-white/80">
            <span className="flex items-center gap-1 text-[11px] font-semibold">
              <Heart className="w-3 h-3" /> {item.likes}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold">
              <Eye className="w-3 h-3" /> {Math.floor(item.likes * 3.5)}
            </span>
          </div>
        </div>

        {/* Price tag */}
        <div
          className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl font-black text-white transition-all duration-300"
          style={{
            background: hovered ? "linear-gradient(135deg, #10b981, #14b8a6)" : "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            fontSize: hovered ? 16 : 14,
            boxShadow: hovered ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
          }}
        >
          {item.price}€
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-bold text-[14px] truncate group-hover:text-emerald-600 transition-colors flex-1"
            style={{ color: "var(--text-primary)" }}
          >
            {item.title}
          </h3>
          {/* Category dot */}
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
            style={{ background: categories.find((c) => c.id === item.category)?.color || "#6b7280" }}
          />
        </div>
        <p className="text-[12px] mt-1.5 line-clamp-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <img src={item.sellerAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
              {item.seller}
            </span>
          </div>
          <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            <Clock className="w-3 h-3" /> Reciente
          </span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

// ═══════════════════════════════════════════
// PRODUCT DETAIL MODAL — completely redesigned
// ═══════════════════════════════════════════
const ProductDetailModal = ({ item, allItems, onClose, onLike, onSave, onContact, onItemClick }) => {
  const [copied, setCopied] = useState(false);
  const [entering, setEntering] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setEntering(false)));
    document.body.style.overflow = "hidden";
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", h); };
  }, [onClose]);

  if (!item) return null;

  const related = allItems.filter((i) => i.id !== item.id && i.category === item.category && !i.sold).slice(0, 4);
  const catInfo = categories.find((c) => c.id === item.category);

  const handleShare = () => {
    const url = `${window.location.origin}/marketplace/${item.id}`;
    if (navigator.share) {
      navigator.share({ title: item.title, url });
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const trust = [
    { icon: Shield, label: "Vendedor verificado", desc: "Identidad confirmada" },
    { icon: Truck, label: "Envío nacional", desc: "3-5 días laborables" },
    { icon: DollarSign, label: "Pago seguro", desc: "Protección al comprador" },
  ];

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={`Detalle: ${item.title}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(20px)",
          opacity: entering ? 0 : 1,
        }}
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto scrollbar-hide">
        <div
          className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10"
          style={{
            opacity: entering ? 0 : 1,
            transform: entering ? "translateY(30px) scale(0.98)" : "translateY(0) scale(1)",
            transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white/70 hover:text-white bg-transparent border-none cursor-pointer transition-colors text-sm font-semibold group"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Volver al Marketplace
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Copiado!</> : <><Share2 className="w-4 h-4" /> Compartir</>}
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl flex items-center justify-center border-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product card */}
          <div
            className="bg-white rounded-[28px] overflow-hidden"
            style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="w-full md:w-[55%] relative overflow-hidden" style={{ minHeight: 380 }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: 380 }}
                />
                {item.sold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-8 py-4 bg-white rounded-2xl text-xl font-black">VENDIDO</span>
                  </div>
                )}
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white uppercase"
                  style={{ background: "rgba(16,185,129,0.85)", backdropFilter: "blur(8px)" }}
                >
                  {item.condition}
                </div>

                {/* Image action bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onLike(item.id); }}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all",
                        item.likedByUser ? "bg-rose-500 text-white" : "bg-white/90 text-stone-700"
                      )}
                      style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    >
                      <Heart className={cn("w-4 h-4", item.likedByUser && "fill-current")} />
                      {item.likes}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSave(item.id); }}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all",
                        item.saved ? "bg-amber-500 text-white" : "bg-white/90 text-stone-700"
                      )}
                      style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    >
                      <Bookmark className={cn("w-4 h-4", item.saved && "fill-current")} />
                      {item.saved ? "Guardado" : "Guardar"}
                    </button>
                  </div>
                  <span
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-semibold text-white/70"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}
                  >
                    <Eye className="w-3.5 h-3.5" /> {Math.floor(item.likes * 3.5)} vistas
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="w-full md:w-[45%] flex flex-col">
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                  {/* Category and meta */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                      style={{ color: catInfo?.color, background: `${catInfo?.color}12` }}
                    >
                      {catInfo && <catInfo.icon className="w-3 h-3" />}
                      {catInfo?.label}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : "Reciente"}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-[28px] font-black leading-tight mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    {item.title}
                  </h1>

                  <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>

                  {/* Price section */}
                  <div
                    className="flex items-center justify-between p-4 rounded-2xl mb-6"
                    style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Precio</p>
                      <p className="text-3xl font-black" style={{ color: "#10b981" }}>{item.price}€</p>
                    </div>
                    {!item.sold && (
                      <button
                        onClick={() => onContact(item)}
                        className="px-6 py-3 rounded-xl font-bold text-white border-none cursor-pointer transition-all hover:scale-105 flex items-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #10b981, #14b8a6)",
                          boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                        }}
                      >
                        <MessageCircle className="w-4 h-4" /> Contactar
                      </button>
                    )}
                  </div>

                  {/* Seller */}
                  <div
                    className="flex items-center gap-3 p-4 rounded-2xl mb-6"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
                  >
                    <img
                      src={item.sellerAvatar}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                      style={{ border: "2px solid rgba(16,185,129,0.2)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-[14px]" style={{ color: "var(--text-primary)" }}>
                          {item.seller}
                        </p>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                        Vendedor verificado · {Math.floor(Math.random() * 20 + 5)} ventas
                      </p>
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-lg text-[12px] font-bold border-none cursor-pointer transition-colors"
                      style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}
                    >
                      Ver perfil
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {trust.map((t) => (
                      <div key={t.label} className="text-center p-3 rounded-xl" style={{ background: "var(--bg-input)" }}>
                        <t.icon className="w-5 h-5 mx-auto mb-1.5 text-emerald-500" />
                        <p className="text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>{t.label}</p>
                        <p className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <div className="px-6 md:px-8 pb-8">
                <div className="pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                  <h3 className="text-[15px] font-black mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <Sparkles className="w-4 h-4 text-emerald-500" /> Productos similares
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {related.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => onItemClick(r)}
                        className="rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-md"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={r.image}
                            alt={r.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div
                            className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[11px] font-black text-white"
                            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
                          >
                            {r.price}€
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[12px] font-bold truncate" style={{ color: "var(--text-primary)" }}>
                            {r.title}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {r.seller}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SELL FORM MODAL — enhanced multi-step
// ═══════════════════════════════════════════
const SellFormModal = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "decor", condition: "Nuevo", image: "" });
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);
  const totalSteps = 2;

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Obligatorio";
    else if (form.title.trim().length < 3) e.title = "Mín. 3 caracteres";
    if (!form.description.trim()) e.description = "Obligatorio";
    else if (form.description.trim().length < 10) e.description = "Mín. 10 caracteres";
    if (step === 2 && (!form.price || Number(form.price) <= 0)) e.price = "Precio inválido";
    return e;
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target.result); setForm({ ...form, image: "" }); };
    reader.readAsDataURL(file);
  };

  const img = preview || form.image;
  const inp = "w-full p-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-400 outline-none transition-all font-medium text-sm";

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      image: img || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&fit=crop",
      seller: user?.name || "Anónimo",
      sellerAvatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default",
    });
    
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setForm({ title: "", description: "", price: "", category: "decor", condition: "Nuevo", image: "" });
    setPreview("");
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={resetAndClose}
    >
      <div
        className="bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid #f5f5f4" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Vender producto</h2>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Paso {step} de {totalSteps}</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-stone-200 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-5 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i < step ? "linear-gradient(135deg, #10b981, #14b8a6)" : "#e7e5e4",
              }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 && (
            <>
              {/* Image upload */}
              {!img ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  className="cursor-pointer rounded-2xl p-10 text-center hover:bg-emerald-50 transition-all group"
                  style={{ border: "2px dashed #d6d3d1" }}
                >
                  <ImagePlus className="w-12 h-12 mx-auto mb-3 group-hover:text-emerald-500 transition-colors" style={{ color: "#a8a29e" }} />
                  <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                    Arrastra o selecciona imagen
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    JPG, PNG, WebP — máx. 10MB
                  </p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(""); setForm({ ...form, image: "" }); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-rose-500 border-none cursor-pointer shadow-lg hover:bg-white transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!preview && (
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="o pega URL de imagen"
                  type="url"
                  className={inp}
                />
              )}

              <div>
                <input
                  value={form.title}
                  onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: null }); }}
                  placeholder="Nombre del producto"
                  className={cn(inp, errors.title && "!border-rose-400 !bg-rose-50")}
                  autoFocus
                />
                {errors.title && <p className="text-[11px] text-rose-500 mt-1 ml-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  value={form.description}
                  onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: null }); }}
                  placeholder="Descripción detallada..."
                  rows={3}
                  className={cn(inp, "resize-none", errors.description && "!border-rose-400 !bg-rose-50")}
                />
                <div className="flex justify-between mt-1 mx-1">
                  {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
                  <span className="text-[11px] ml-auto" style={{ color: "var(--text-faint)" }}>{form.description.length}/500</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const e = validate();
                  setErrors(e);
                  if (!e.title && !e.description) setStep(2);
                }}
                className="w-full py-3.5 rounded-xl font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase ml-1 mb-1.5 block" style={{ color: "var(--text-muted)" }}>Precio</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: "var(--text-muted)" }}>€</span>
                    <input
                      value={form.price}
                      onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrors({ ...errors, price: null }); }}
                      placeholder="0"
                      type="number"
                      min="0"
                      step="0.01"
                      className={cn(inp, "pl-8", errors.price && "!border-rose-400")}
                      autoFocus
                    />
                  </div>
                  {errors.price && <p className="text-[11px] text-rose-500 mt-1 ml-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase ml-1 mb-1.5 block" style={{ color: "var(--text-muted)" }}>Estado</label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className={cn(inp, "cursor-pointer appearance-none")}
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Restaurado">Restaurado</option>
                    <option value="Usado">Usado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase ml-1 mb-1.5 block" style={{ color: "var(--text-muted)" }}>Categoría</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.filter((c) => c.id !== "all").map((c) => {
                    const I = c.icon;
                    const active = form.category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setForm({ ...form, category: c.id })}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl text-[11px] font-bold border-none cursor-pointer transition-all",
                          active ? "text-emerald-700" : "text-stone-500 hover:bg-stone-100"
                        )}
                        style={{
                          background: active ? "rgba(16,185,129,0.1)" : "var(--bg-input)",
                          border: active ? "2px solid #10b981" : "2px solid transparent",
                        }}
                      >
                        <I className="w-5 h-5" style={{ color: active ? c.color : undefined }} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview card */}
              <div className="rounded-2xl p-4" style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
                <p className="text-[11px] font-bold uppercase mb-3" style={{ color: "var(--text-muted)" }}>Vista previa</p>
                <div className="flex gap-3">
                  {img && <img src={img} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] truncate" style={{ color: "var(--text-primary)" }}>
                      {form.title || "Producto"}
                    </p>
                    <p className="text-[12px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {form.description || "Descripción..."}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-[20px] font-black" style={{ color: "#10b981" }}>
                        {form.price ? `${form.price}€` : "0€"}
                      </p>
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                      >
                        {form.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl font-bold border-none cursor-pointer bg-stone-100 hover:bg-stone-200 flex items-center justify-center gap-2 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3.5 rounded-xl font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #14b8a6)",
                    boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
                  }}
                >
                  <Package className="w-5 h-5" /> Publicar
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// CATEGORY PILLS — scrollable horizontal
// ═══════════════════════════════════════════
const CategoryPills = ({ selected, onChange }) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
    {categories.map((c) => {
      const I = c.icon;
      const active = selected === c.id;
      return (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all border-none cursor-pointer flex-shrink-0",
            active
              ? "text-white shadow-lg"
              : "bg-white text-stone-500 hover:bg-stone-50"
          )}
          style={{
            background: active ? "var(--text-primary)" : undefined,
            border: active ? "none" : "1px solid var(--border)",
            boxShadow: active ? "0 4px 12px rgba(0,0,0,0.12)" : undefined,
          }}
          aria-pressed={active}
        >
          <I className="w-3.5 h-3.5" /> {c.label}
        </button>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════
// MAIN MARKETPLACE VIEW
// ═══════════════════════════════════════════
const MarketplaceView = () => {
  const { marketplaceItems, toggleMarketplaceLike, toggleMarketplaceSave, addMarketplaceItem } = useData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [conditionFilter, setConditionFilter] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSellForm, setShowSellForm] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [activeTab, setActiveTab] = useState("browse");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const filteredItems = useMemo(() => {
    let src = activeTab === "saved" ? marketplaceItems.filter((i) => i.saved) : marketplaceItems;
    let res = src.filter((i) => {
      const cat = selectedCategory === "all" || i.category === selectedCategory;
      const q = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.seller.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase());
      const cond = conditionFilter === "Todos" || i.condition === conditionFilter;
      const price = i.price >= priceRange[0] && i.price <= priceRange[1];
      return cat && q && cond && price;
    });
    switch (sortBy) {
      case "price-low": res = [...res].sort((a, b) => a.price - b.price); break;
      case "price-high": res = [...res].sort((a, b) => b.price - a.price); break;
      case "popular": res = [...res].sort((a, b) => b.likes - a.likes); break;
      default: res = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return res;
  }, [marketplaceItems, selectedCategory, searchQuery, conditionFilter, sortBy, priceRange, activeTab]);

  const savedCount = useMemo(() => marketplaceItems.filter((i) => i.saved).length, [marketplaceItems]);

  const handleContact = useCallback((item) => {
    
  }, []);

  const handleItemClick = useCallback((item) => setSelectedItem(item), []);

  const hasActiveFilters = selectedCategory !== "all" || conditionFilter !== "Todos" || priceRange[1] < 500;
  const activeFilterCount = [selectedCategory !== "all", conditionFilter !== "Todos", priceRange[1] < 500].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("all");
    setConditionFilter("Todos");
    setPriceRange([0, 500]);
    setSortBy("recent");
    setSearchQuery("");
  };

  return (
    <div className="flex-1 h-full overflow-y-auto scrollbar-hide" style={{ background: "var(--bg-primary)" }}>
      {/* ═══ STICKY HEADER ═══ */}
      <div
        className="sticky top-0 z-30"
        style={{ background: "rgba(250,250,249,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-black flex items-center gap-[10px]" style={{ color: "var(--text-primary)" }}>
                <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                Marketplace
              </h1>
              <p className="text-[13px] font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                {marketplaceItems.filter((i) => !i.sold).length} productos disponibles · Compra y vende creaciones recicladas
              </p>
            </div>
            <button
              onClick={() => setShowSellForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
              }}
            >
              <PlusCircle className="w-4 h-4" /> Vender producto
            </button>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {/* Tab switcher */}
            <div className="flex bg-white rounded-xl p-1" style={{ border: "1px solid var(--border)" }}>
              {[
                { id: "browse", label: "Explorar", icon: ShoppingBag },
                { id: "saved", label: "Guardados", icon: Bookmark, badge: savedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[13px] font-bold transition-all border-none cursor-pointer flex items-center gap-2",
                    activeTab === tab.id ? "bg-stone-900 text-white" : "bg-transparent text-stone-500 hover:text-stone-700"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.badge > 0 && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        activeTab === tab.id ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Search desktop */}
            <div
              className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-xl gap-2 w-72 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20"
              style={{ border: "1px solid var(--border)" }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-[13px] w-full font-medium border-none"
                style={{ color: "var(--text-secondary)" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="bg-transparent border-none cursor-pointer p-0 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View mode toggle */}
            <div className="hidden md:flex bg-white rounded-xl p-1" style={{ border: "1px solid var(--border)" }}>
              {[
                { id: "grid", icon: LayoutDashboard },
                { id: "list", icon: Tag },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={cn(
                    "p-2 rounded-lg transition-all border-none cursor-pointer",
                    viewMode === v.id ? "bg-stone-900 text-white" : "bg-transparent text-stone-400 hover:text-stone-600"
                  )}
                  aria-label={`Vista ${v.id}`}
                >
                  <v.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all relative",
                showFilters ? "bg-emerald-50 text-emerald-700" : "bg-white text-stone-500 hover:bg-stone-50"
              )}
              style={{ border: "1px solid var(--border)" }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full text-[9px] font-black text-white flex items-center justify-center"
                  style={{ background: "#10b981" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white outline-none text-sm font-medium"
              style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Categories */}
          <div className="mt-4">
            <CategoryPills selected={selectedCategory} onChange={setSelectedCategory} />
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div
              className="mt-4 p-5 bg-white rounded-2xl space-y-4"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <p className="text-[11px] font-bold uppercase mb-2.5 tracking-wider" style={{ color: "var(--text-muted)" }}>Estado</p>
                  <div className="flex gap-2 flex-wrap">
                    {conditions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setConditionFilter(c)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer",
                          conditionFilter === c ? "bg-emerald-500 text-white shadow-md" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <PriceRangeSlider min={0} max={500} value={priceRange} onChange={setPriceRange} />
                <div>
                  <p className="text-[11px] font-bold uppercase mb-2.5 tracking-wider" style={{ color: "var(--text-muted)" }}>Ordenar por</p>
                  <div className="flex gap-2 flex-wrap">
                    {sortOptions.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSortBy(o.id)}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer",
                          sortBy === o.id ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                        )}
                      >
                        <o.icon className="w-3 h-3" /> {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 pt-3 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Activos:</span>
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">
                      {categories.find((c) => c.id === selectedCategory)?.label}
                      <button onClick={() => setSelectedCategory("all")} className="bg-transparent border-none cursor-pointer p-0 text-emerald-400 hover:text-rose-500">
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {conditionFilter !== "Todos" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">
                      {conditionFilter}
                      <button onClick={() => setConditionFilter("Todos")} className="bg-transparent border-none cursor-pointer p-0 text-emerald-400 hover:text-rose-500">
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {priceRange[1] < 500 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">
                      ≤{priceRange[1]}€
                      <button onClick={() => setPriceRange([0, 500])} className="bg-transparent border-none cursor-pointer p-0 text-emerald-400 hover:text-rose-500">
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-rose-500 bg-transparent border-none cursor-pointer ml-auto hover:underline"
                  >
                    Limpiar todo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-24">
        {/* Featured banner */}
        {activeTab === "browse" && !searchQuery && selectedCategory === "all" && !hasActiveFilters && (
          <FeaturedBanner items={marketplaceItems} onItemClick={handleItemClick} />
        )}

        {/* Quick stats */}
        {activeTab === "browse" && !searchQuery && selectedCategory === "all" && !hasActiveFilters && (
          <QuickStats items={marketplaceItems} />
        )}

        {/* Results info */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>
            {filteredItems.length} producto{filteredItems.length !== 1 ? "s" : ""}
            {activeTab === "saved" ? ` guardado${filteredItems.length !== 1 ? "s" : ""}` : ""}
            {searchQuery && (
              <> para "<strong style={{ color: "var(--text-secondary)" }}>{searchQuery}</strong>"</>
            )}
          </p>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-[24px] p-16 text-center" style={{ border: "1px solid var(--border)" }}>
            {activeTab === "saved" ? (
              <>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.08)" }}>
                  <Bookmark className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-black mb-2" style={{ color: "var(--text-primary)" }}>Sin guardados</h3>
                <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                  Guarda productos que te interesen para verlos después
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.2)" }}
                >
                  Explorar productos
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.08)" }}>
                  <ShoppingBag className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black mb-2" style={{ color: "var(--text-primary)" }}>Sin resultados</h3>
                <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                  Prueba con otros filtros o categorías
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.2)" }}
                >
                  Ver todo
                </button>
              </>
            )}
          </div>
        ) : (
          /* Product grid / list */
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-4"
            )}
          >
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onLike={toggleMarketplaceLike}
                onSave={toggleMarketplaceSave}
                onClick={handleItemClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ MODALS ═══ */}
      {selectedItem && (
        <ProductDetailModal
          item={marketplaceItems.find((i) => i.id === selectedItem.id) || selectedItem}
          allItems={marketplaceItems}
          onClose={() => setSelectedItem(null)}
          onLike={toggleMarketplaceLike}
          onSave={toggleMarketplaceSave}
          onContact={handleContact}
          onItemClick={handleItemClick}
        />
      )}

      <SellFormModal
        isOpen={showSellForm}
        onClose={() => setShowSellForm(false)}
        onSubmit={addMarketplaceItem}
      />
    </div>
  );
};

export default MarketplaceView;