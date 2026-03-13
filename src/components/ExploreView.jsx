import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useData } from "../context/DataContext";
import {
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Sparkles,
  X,
  Eye,
  Sofa,
  Lightbulb,
  Palette,
  Shirt,
  Flower2,
  LayoutDashboard,
  LayoutGrid,
  Grid,
  Share2,
  Flag,
  FolderPlus,
  Copy,
  CheckCircle,
  UserPlus,
  UserCheck,
  ArrowUp,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════
const categories = [
  { id: "all", label: "Todo", icon: LayoutDashboard },
  { id: "furniture", label: "Muebles", icon: Sofa },
  { id: "lighting", label: "Iluminación", icon: Lightbulb },
  { id: "decor", label: "Decoración", icon: Palette },
  { id: "fashion", label: "Moda", icon: Shirt },
  { id: "garden", label: "Jardín", icon: Flower2 },
];

const trendingTopics = [
  { tag: "Upcycling", posts: "12.4k", gradient: "linear-gradient(135deg, #10b981, #0d9488)" },
  { tag: "PaletDIY", posts: "8.2k", gradient: "linear-gradient(135deg, #f59e0b, #ea580c)" },
  { tag: "ZeroWaste", posts: "6.8k", gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
  { tag: "VintageDecor", posts: "5.1k", gradient: "linear-gradient(135deg, #ef4444, #ec4899)" },
];

const popularTags = [
  "#Upcycling", "#DIY", "#Sostenible", "#Vintage",
  "#Handmade", "#EcoFriendly", "#Reciclaje", "#ZeroWaste",
];

const SORT_OPTIONS = [
  { id: "trending", label: "Tendencias" },
  { id: "recent", label: "Recientes" },
  { id: "popular", label: "Más populares" },
];

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
      { rootMargin: "300px" }
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
            background: "linear-gradient(135deg, #d6d3d1 25%, #e7e5e4 50%, #d6d3d1 75%)",
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
// REPORT MODAL
// ═══════════════════════════════════════════
const ReportModal = ({ isOpen, onClose }) => {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    "Contenido inapropiado",
    "Spam o publicidad",
    "Información falsa",
    "Contenido robado / plagio",
    "Acoso o intimidación",
    "Otro",
  ];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setReason(""); onClose(); }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>Reporte enviado</h3>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              Gracias por ayudar a mantener la comunidad segura.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid #f5f5f4" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <Flag className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Reportar Post</h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-stone-200 transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className="w-full text-left px-4 py-3 rounded-xl border-none cursor-pointer transition-all text-sm font-semibold"
                  style={{
                    background: reason === r ? "rgba(16,185,129,0.1)" : "#fafaf9",
                    color: reason === r ? "#059669" : "var(--text-secondary)",
                    border: reason === r ? "2px solid #10b981" : "2px solid transparent",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={handleSubmit}
                disabled={!reason}
                className="w-full py-3.5 rounded-xl font-bold border-none cursor-pointer transition-all text-sm"
                style={{
                  background: reason ? "linear-gradient(135deg, #ef4444, #dc2626)" : "#e7e5e4",
                  color: reason ? "white" : "#a8a29e",
                }}
              >
                Enviar Reporte
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// COLLECTION MODAL
// ═══════════════════════════════════════════
const CollectionModal = ({ isOpen, onClose }) => {
  const [collections, setCollections] = useState([
    { id: 1, name: "Favoritos", count: 12, emoji: "⭐" },
    { id: 2, name: "Inspiración", count: 8, emoji: "💡" },
    { id: 3, name: "Para hacer", count: 5, emoji: "🔨" },
  ]);
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [savedTo, setSavedTo] = useState(null);

  if (!isOpen) return null;

  const handleSave = (colId) => {
    setSavedTo(colId);
    setCollections((prev) => prev.map((c) => (c.id === colId ? { ...c, count: c.count + 1 } : c)));
    setTimeout(() => { setSavedTo(null); onClose(); }, 800);
  };

  const handleCreateNew = () => {
    if (!newName.trim()) return;
    const col = { id: Date.now(), name: newName, count: 1, emoji: "📁" };
    setCollections((prev) => [...prev, col]);
    setSavedTo(col.id);
    setNewName("");
    setShowNew(false);
    setTimeout(() => { setSavedTo(null); onClose(); }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid #f5f5f4" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Guardar en</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center border-none cursor-pointer" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => handleSave(col.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-none cursor-pointer transition-all hover:bg-stone-50"
              style={{ background: savedTo === col.id ? "rgba(16,185,129,0.1)" : "transparent" }}
            >
              <span className="text-2xl">{col.emoji}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{col.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{col.count} posts</p>
              </div>
              {savedTo === col.id && <CheckCircle size={20} className="text-emerald-500" />}
            </button>
          ))}
        </div>
        <div className="p-4 pt-0">
          {showNew ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre de la colección"
                className="flex-1 p-3 rounded-xl bg-stone-50 border-2 border-transparent focus:border-emerald-400 outline-none text-sm font-medium"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
              />
              <button onClick={handleCreateNew} className="px-4 rounded-xl bg-emerald-500 text-white font-bold border-none cursor-pointer text-sm">
                Crear
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNew(true)}
              className="w-full py-3 rounded-xl font-bold border-2 border-dashed border-stone-200 cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 text-sm flex items-center justify-center gap-2"
              style={{ background: "transparent", color: "var(--text-secondary)" }}
            >
              <FolderPlus size={16} /> Nueva colección
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// EXPLORE POST CARD — improved
// ═══════════════════════════════════════════
const ExplorePostCard = React.memo(({ post, stableViews, onReport, onAddToCollection, onPostClick }) => {
  const { toggleLike, toggleSave } = useData();
  const [hovered, setHovered] = useState(false);
  const [doubleTapAnim, setDoubleTapAnim] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastTapRef = useRef(0);

  // Double-tap to like
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!post.likedByUser) toggleLike(post.id);
      setDoubleTapAnim(true);
      setTimeout(() => setDoubleTapAnim(false), 900);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current !== 0) {
          onPostClick?.(post);
          lastTapRef.current = 0;
        }
      }, 300);
    }
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/post/${post.id}`);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowActions(false); }, 1200);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: post.title, url: `${window.location.origin}/post/${post.id}` });
    } else {
      handleCopyLink(e);
    }
  };

  return (
    <div
      className="group relative rounded-[18px] overflow-hidden cursor-pointer h-full"
      style={{ background: "#1c1917", minHeight: 200 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowActions(false); }}
      onClick={handleTap}
      role="article"
      aria-label={`Post: ${post.title} por ${post.author}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPostClick?.(post)}
    >
      <LazyImage
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{
          position: "absolute",
          inset: 0,
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Gradient overlay — improved contrast */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,${hovered ? 0.8 : 0.55}) 0%, rgba(0,0,0,${hovered ? 0.2 : 0.1}) 40%, transparent 100%)`,
        }}
      />

      {/* Double-tap heart animation */}
      {doubleTapAnim && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <Heart
            size={64}
            fill="white"
            color="white"
            style={{
              filter: "drop-shadow(0 4px 20px rgba(239,68,68,0.5))",
              animation: "doubleTapHeart 0.9s ease forwards",
            }}
          />
        </div>
      )}

      {/* Top-right actions */}
      <div
        className="absolute top-3 right-3 flex gap-1.5 transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-6px)" }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave(post.id); }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all border-none cursor-pointer",
            post.saved
              ? "bg-amber-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-amber-500 hover:text-white"
          )}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
          aria-label={post.saved ? "Quitar de guardados" : "Guardar"}
        >
          <Bookmark className={cn("w-[14px] h-[14px]", post.saved && "fill-current")} />
        </button>

        {/* Context menu trigger */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-stone-200 transition-all border-none cursor-pointer"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)", fontSize: 16, fontWeight: 800, lineHeight: 1 }}
            aria-label="Más opciones"
          >
            ···
          </button>
          {showActions && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-10 right-0 bg-white rounded-2xl p-1.5 min-w-[170px] z-50"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
            >
              {[
                { icon: FolderPlus, label: "Guardar en colección", action: (e) => { e.stopPropagation(); onAddToCollection?.(post.id); setShowActions(false); } },
                { icon: Share2, label: "Compartir", action: handleShare },
                { icon: copied ? CheckCircle : Copy, label: copied ? "¡Copiado!" : "Copiar enlace", action: handleCopyLink },
                { icon: Flag, label: "Reportar", action: (e) => { e.stopPropagation(); onReport?.(post.id); setShowActions(false); }, danger: true },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors hover:bg-stone-100 text-left border-none cursor-pointer"
                  style={{ background: "transparent", color: item.danger ? "#ef4444" : "#1c1917", fontSize: 12, fontWeight: 600 }}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Views badge */}
      <div
        className="absolute top-3 left-3 transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-[11px] font-semibold">
          <Eye className="w-3 h-3" />
          {stableViews}
        </div>
      </div>

      {/* Category badge (visible without hover) */}
      {post.category && (
        <div
          className="absolute top-3 left-3 transition-all duration-300"
          style={{
            opacity: hovered ? 0 : 1,
            padding: "3px 8px",
            background: "rgba(16,185,129,0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 800,
            color: "white",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {post.category}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && hovered && (
        <div
          className="absolute left-4 flex gap-1.5 flex-wrap transition-all duration-300"
          style={{ bottom: 72, opacity: hovered ? 1 : 0 }}
        >
          {post.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-emerald-500/70 backdrop-blur-sm rounded-full text-[10px] font-bold text-white"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom content */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0.9, transform: hovered ? "translateY(0)" : "translateY(4px)" }}
      >
        <h3 className="text-white font-bold text-[14px] mb-2 line-clamp-1" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)", letterSpacing: "-0.01em" }}>
          {post.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={post.avatar}
              alt={`Avatar de ${post.author}`}
              className="w-6 h-6 rounded-full ring-1 ring-white/30 object-cover"
            />
            <span className="text-white/80 text-[11px] font-semibold">{post.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
              className="flex items-center gap-1 text-white/80 hover:text-rose-400 transition-colors bg-transparent border-none cursor-pointer p-0"
              aria-label={post.likedByUser ? "Quitar like" : "Dar like"}
            >
              <Heart className={cn("w-[14px] h-[14px] transition-all", post.likedByUser && "fill-rose-500 text-rose-500 scale-110")} />
              <span className="text-[11px] font-bold">{post.likes}</span>
            </button>
            <div className="flex items-center gap-1 text-white/60">
              <Eye className="w-[14px] h-[14px]" />
              <span className="text-[11px] font-bold">{stableViews || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ExplorePostCard.displayName = "ExplorePostCard";

// ═══════════════════════════════════════════
// FEATURED CREATOR CARD — improved with follow state
// ═══════════════════════════════════════════
const CreatorCard = React.memo(({ creator, isFollowing, onToggleFollow }) => (
  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-all cursor-pointer">
    <div className="relative flex-shrink-0">
      <img src={creator.avatar} alt={`Avatar de ${creator.name}`} className="w-10 h-10 rounded-full object-cover" />
      {creator.verified && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
          <Sparkles className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-[13px] truncate" style={{ color: "var(--text-primary)" }}>{creator.name}</p>
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{creator.followers} seguidores</p>
    </div>
    <button
      onClick={() => onToggleFollow(creator.name)}
      className={cn(
        "px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border-none cursor-pointer flex items-center gap-1.5",
        isFollowing
          ? "bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-500"
          : "bg-stone-900 hover:bg-emerald-500 text-white"
      )}
      aria-label={isFollowing ? `Dejar de seguir a ${creator.name}` : `Seguir a ${creator.name}`}
    >
      {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
      {isFollowing ? "Siguiendo" : "Seguir"}
    </button>
  </div>
));

CreatorCard.displayName = "CreatorCard";

// ═══════════════════════════════════════════
// SCROLL TO TOP
// ═══════════════════════════════════════════
const ScrollToTop = ({ containerRef }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onScroll = () => setVisible(el.scrollTop > 500);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  if (!visible) return null;

  return (
    <button
      onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:scale-110"
      style={{
        background: "linear-gradient(135deg, #10b981, #14b8a6)",
        color: "white",
        boxShadow: "0 8px 30px rgba(16,185,129,0.35)",
      }}
      aria-label="Volver arriba"
    >
      <ArrowUp size={20} />
    </button>
  );
};

// ═══════════════════════════════════════════
// INFINITE SCROLL HOOK
// ═══════════════════════════════════════════
const useInfiniteScroll = (items, pageSize = 12) => {
  const [count, setCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => setCount(pageSize), [items.length, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && count < items.length && !loading) {
          setLoading(true);
          setTimeout(() => {
            setCount((prev) => Math.min(prev + pageSize, items.length));
            setLoading(false);
          }, 300);
        }
      },
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [count, items.length, loading, pageSize]);

  return { visible: items.slice(0, count), sentinelRef, loading, hasMore: count < items.length };
};

// ═══════════════════════════════════════════
// GLOBAL ANIMATIONS
// ═══════════════════════════════════════════
const ExploreAnimations = () => {
  useEffect(() => {
    const id = "explore-animations";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes doubleTapHeart {
        0% { transform: scale(0); opacity: 0; }
        15% { transform: scale(1.3); opacity: 1; }
        30% { transform: scale(0.95); opacity: 1; }
        45% { transform: scale(1.1); opacity: 1; }
        80% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);
  return null;
};

// ═══════════════════════════════════════════
// EXPLORE VIEW — main component
// ═══════════════════════════════════════════
const ExploreView = () => {
  const { posts } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("masonry");
  const [sortBy, setSortBy] = useState("trending");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [followedCreators, setFollowedCreators] = useState(new Set());
  const [reportPostId, setReportPostId] = useState(null);
  const [collectionPostId, setCollectionPostId] = useState(null);
  const scrollRef = useRef(null);

  const featuredCreators = useMemo(() => [
    { name: "EcoMaria", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", followers: "12.4k", verified: true },
    { name: "CraftLuis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis", followers: "8.9k", verified: true },
    { name: "GreenAna", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", followers: "6.2k", verified: false },
    { name: "ReUsaJuan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", followers: "5.8k", verified: true },
  ], []);

  // Stable shuffled posts — only re-shuffles when posts array changes, not on every render
  const shuffledPosts = useMemo(() => {
    const expanded = [...posts, ...posts.map((p) => ({ ...p, id: p.id + 10000 }))];
    // Deterministic shuffle using post IDs as seed
    return expanded.sort((a, b) => {
      const hashA = ((a.id * 2654435761) >>> 0) % 1000;
      const hashB = ((b.id * 2654435761) >>> 0) % 1000;
      return hashA - hashB;
    });
  }, [posts]);

  // Stable view counts per post
  const stableViews = useMemo(() => {
    const map = {};
    shuffledPosts.forEach((p) => {
      if (!map[p.id]) map[p.id] = ((p.id * 7919) % 900) + 100;
    });
    return map;
  }, [shuffledPosts]);

  // Filtering
  const filteredPosts = useMemo(() => {
    let result = shuffledPosts.filter((p) => {
      const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });

    // Sorting
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "recent") {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [shuffledPosts, selectedCategory, searchQuery, sortBy]);

  const { visible: visiblePosts, sentinelRef, loading, hasMore } = useInfiniteScroll(filteredPosts);

  const toggleFollow = useCallback((name) => {
    setFollowedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleTagClick = useCallback((tag) => {
    const clean = tag.replace(/^#/, "");
    setSearchQuery(clean);
  }, []);

  const handleTrendingClick = useCallback((tag) => {
    setSearchQuery(tag);
  }, []);

  const getSize = (index) => {
    if (index === 0 || index === 5) return "row-span-2";
    if (index === 3 || index === 8) return "col-span-2";
    return "";
  };

  return (
    <div ref={scrollRef} className="flex-1 h-full overflow-y-auto" style={{ background: "var(--bg-primary)" }}>
      <ExploreAnimations />

      {/* Header */}
      <div className="sticky top-0 z-30" style={{ background: "rgba(250,250,249,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-black flex items-center gap-[10px]" style={{ color: "var(--text-primary)" }}>
                <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                Explorar
              </h1>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                Descubre nuevas ideas y creadores · {filteredPosts.length} proyectos
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:bg-stone-50"
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  aria-label="Ordenar por"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {SORT_OPTIONS.find((o) => o.id === sortBy)?.label}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showSortMenu && "rotate-180")} />
                </button>
                {showSortMenu && (
                  <div
                    className="absolute top-11 right-0 bg-white rounded-xl p-1 min-w-[150px] z-50"
                    style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all hover:bg-stone-50"
                        style={{
                          background: sortBy === opt.id ? "rgba(16,185,129,0.1)" : "transparent",
                          color: sortBy === opt.id ? "#059669" : "var(--text-secondary)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-white rounded-xl p-1" style={{ border: "1px solid var(--border)" }}>
                <button
                  onClick={() => setViewMode("masonry")}
                  className={cn("p-2 rounded-lg transition-all border-none cursor-pointer",
                    viewMode === "masonry" ? "bg-stone-900 text-white" : "text-stone-400 hover:text-stone-600 bg-transparent")}
                  aria-label="Vista mosaico"
                  aria-pressed={viewMode === "masonry"}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2 rounded-lg transition-all border-none cursor-pointer",
                    viewMode === "grid" ? "bg-stone-900 text-white" : "text-stone-400 hover:text-stone-600 bg-transparent")}
                  aria-label="Vista cuadrícula"
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar ideas, creadores, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white outline-none transition-all font-medium text-sm focus:ring-2 focus:ring-emerald-500/20"
              style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}
              aria-label="Buscar en explorar"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-stone-100 rounded-full w-6 h-6 flex items-center justify-center border-none cursor-pointer hover:bg-stone-200 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
              </button>
            )}
          </div>

          {/* Active search indicator */}
          {searchQuery && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {filteredPosts.length} resultados para
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-transparent border-none cursor-pointer p-0 text-emerald-400 hover:text-emerald-700 transition-colors"
                  aria-label="Eliminar filtro"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all border-none cursor-pointer",
                    selectedCategory === cat.id
                      ? "bg-stone-900 text-white shadow-lg"
                      : "bg-white text-stone-600 hover:bg-stone-50"
                  )}
                  style={selectedCategory !== cat.id ? { border: "1px solid var(--border)" } : {}}
                  aria-pressed={selectedCategory === cat.id}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Trending */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.tag}
                  onClick={() => handleTrendingClick(topic.tag)}
                  className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group transition-all duration-400 hover:scale-[1.03] hover:shadow-lg"
                  style={{ background: topic.gradient }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Tendencia: ${topic.tag}`}
                  onKeyDown={(e) => e.key === "Enter" && handleTrendingClick(topic.tag)}
                >
                  <div
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full transition-transform duration-500 group-hover:scale-150"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <p className="text-white/50 text-[9px] font-bold uppercase tracking-[2px] mb-1.5 relative z-10">Trending</p>
                  <p className="text-white font-black text-xl relative z-10" style={{ letterSpacing: "-0.02em" }}>#{topic.tag}</p>
                  <p className="text-white/40 text-[11px] mt-1.5 font-semibold relative z-10">{topic.posts} posts</p>
                  <TrendingUp className="absolute bottom-2 right-3 w-7 h-7 text-white/10 group-hover:text-white/25 transition-all duration-300 group-hover:translate-y-[-2px]" />
                </div>
              ))}
            </div>

            {/* Post Grid */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-[24px] p-16 text-center mt-6" style={{ border: "1px solid var(--border)" }}>
                <Search className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--text-faint)" }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sin resultados</h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Prueba con otra búsqueda o categoría</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer transition-all"
                  style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", color: "white" }}
                >
                  Ver todo
                </button>
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-3",
                  viewMode === "masonry"
                    ? "grid-cols-2 md:grid-cols-3 auto-rows-[200px]"
                    : "grid-cols-2 md:grid-cols-3 auto-rows-[260px]"
                )}>
                  {visiblePosts.map((post, index) => (
                    <div key={`${post.id}-${index}`} className={cn("h-full", viewMode === "masonry" ? getSize(index) : "")}>
                      <ExplorePostCard
                        post={post}
                        stableViews={stableViews[post.id]}
                        onReport={(id) => setReportPostId(id)}
                        onAddToCollection={(id) => setCollectionPostId(id)}
                        onPostClick={() => {}}
                      />
                    </div>
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={sentinelRef} className="flex justify-center py-8">
                    {loading && (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent"
                          style={{ animation: "spin 0.8s linear infinite" }}
                        />
                        <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                          Cargando más...
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Creators */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Sparkles className="w-5 h-5 text-amber-500" />
                Creadores destacados
              </h3>
              <div className="space-y-1">
                {featuredCreators.map((creator) => (
                  <CreatorCard
                    key={creator.name}
                    creator={creator}
                    isFollowing={followedCreators.has(creator.name)}
                    onToggleFollow={toggleFollow}
                  />
                ))}
              </div>
            </div>

            {/* Popular tags — now clickable and functional */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Tags populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => {
                  const isActive = searchQuery.toLowerCase() === tag.replace("#", "").toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border-none cursor-pointer",
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600"
                      )}
                      aria-pressed={isActive}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-6 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-black text-lg mb-1.5">¿Tienes algo que compartir?</h4>
                <p className="text-white/60 text-[13px] mb-4 leading-relaxed">
                  Sube tu proyecto de reciclaje creativo y llega a miles de personas.
                </p>
                <button className="w-full py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/90 transition-all hover:shadow-lg border-none cursor-pointer text-sm">
                  Crear post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop containerRef={scrollRef} />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportPostId !== null}
        onClose={() => setReportPostId(null)}
      />

      {/* Collection Modal */}
      <CollectionModal
        isOpen={collectionPostId !== null}
        onClose={() => setCollectionPostId(null)}
      />
    </div>
  );
};

export default ExploreView;