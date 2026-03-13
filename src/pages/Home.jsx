import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import AuthView from "../components/AuthView";

import {
  Heart,
  MessageCircle,
  Share2,
  PlusCircle,
  Search,
  Bell,
  Bookmark,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Send,
  ImagePlus,
  Trash2,
  Link,
  ChevronLeft,
  ChevronRight,
  Flag,
  Copy,
  CheckCircle,
  Tag,
  FolderPlus,
  Moon,
  Sun,
  Filter,
  ArrowUp,
} from "lucide-react";
import { cn } from "../lib/utils";

// Views
import MessagesView from "../components/MessagesView";
import SettingsView from "../components/SettingsView";
import ProfileView from "../components/ProfileView";
import MarketplaceView from "../components/MarketplaceView";
import StatsView from "../components/StatsView";
import ExploreView from "../components/ExploreView";
import NotificationsView from "../components/NotificationsView";

import AppSidebar from "../components/AppSidebar";
import PostDetailModal from "../components/PostDetailModal";
import ViewTransition from "../components/ViewTransition";

// ═══════════════════════════════════════════
// LAZY IMAGE with skeleton placeholder
// ═══════════════════════════════════════════
const LazyImage = ({ src, alt, className, style, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
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
      {!loaded && !error && (
        <div
          className="animate-pulse"
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
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setError(true);
          onError?.(e);
        }}
      />
    </>
  );
};

// ═══════════════════════════════════════════
// POST CARD (Bento Style) — improved
// ═══════════════════════════════════════════
const PostCard = React.memo(({ post, onLike, onSave, onClick, onReport, onAddToCollection, variant = "standard" }) => {
  const [hovered, setHovered] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [doubleTapAnim, setDoubleTapAnim] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const lastTapRef = useRef(0);
  const isLarge = variant === "large" || variant === "tall";

  const handleLike = (e) => {
    e.stopPropagation();
    onLike(post.id);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
  };

  // Double-tap to like
  const handleTap = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.stopPropagation();
      if (!post.likedByUser) {
        onLike(post.id);
      }
      setDoubleTapAnim(true);
      setTimeout(() => setDoubleTapAnim(false), 900);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current !== 0) {
          onClick?.();
          lastTapRef.current = 0;
        }
      }, 300);
    }
  };

  return (
    <div
      onClick={handleTap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowActions(false); }}
      className={cn(
        "group cursor-pointer w-full h-full min-h-[200px]",
        variant === "large" && "md:col-span-2 md:row-span-2",
        variant === "tall" && "md:row-span-2",
        variant === "wide" && "md:col-span-2"
      )}
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        background: "#1c1917",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.05)",
      }}
      role="article"
      aria-label={`Post: ${post.title} por ${post.author}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick?.(); }}
    >
      <LazyImage
        src={post.image}
        alt={post.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Gradient overlay — enhanced for text contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, rgba(0,0,0,${hovered ? 0.85 : 0.6}) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.05) 70%, transparent 100%)`,
          transition: "all 0.3s",
        }}
      />

      {/* Double-tap heart animation */}
      {doubleTapAnim && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <Heart
            size={80}
            fill="white"
            color="white"
            style={{
              filter: "drop-shadow(0 4px 20px rgba(239,68,68,0.5))",
              animation: "doubleTapHeart 0.9s ease forwards",
            }}
          />
        </div>
      )}

      {/* Author pill */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px 6px 6px",
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(12px)",
          borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.1)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-8px)",
          transition: "all 0.3s ease",
        }}
      >
        <img
          src={post.avatar}
          alt={`Avatar de ${post.author}`}
          style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
        />
        <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{post.author}</span>
      </div>

      {/* Category badge */}
      {post.category && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: hovered ? 999 : 16,
            padding: "4px 10px",
            background: "rgba(16,185,129,0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 800,
            color: "white",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            opacity: hovered ? 0 : 1,
            transition: "all 0.3s ease",
          }}
        >
          {post.category}
        </div>
      )}

      {/* Action buttons (top right) */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <button
          onClick={handleLike}
          className="border-none cursor-pointer"
          aria-label={post.likedByUser ? "Quitar like" : "Dar like"}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
            background: post.likedByUser ? "#ef4444" : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(12px)",
            color: "white",
            transform: likeAnim ? "scale(1.2)" : "scale(1)",
          }}
        >
          <Heart size={16} fill={post.likedByUser ? "currentColor" : "none"} />
        </button>

        {/* More actions menu */}
        {hovered && (
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
              className="border-none cursor-pointer"
              aria-label="Más acciones"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(12px)",
                color: "white",
                fontSize: 18,
                fontWeight: 800,
                opacity: hovered ? 1 : 0,
                transition: "all 0.3s",
              }}
            >
              ···
            </button>
            {showActions && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: 44,
                  right: 0,
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 16,
                  padding: 6,
                  minWidth: 180,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                  zIndex: 50,
                }}
              >
                {[
                  { icon: FolderPlus, label: "Guardar en colección", action: () => onAddToCollection?.(post.id) },
                  { icon: Copy, label: "Copiar enlace", action: () => { navigator.clipboard?.writeText(window.location.href + "/post/" + post.id); } },
                  { icon: Flag, label: "Reportar", action: () => onReport?.(post.id), danger: true },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); item.action(); setShowActions(false); }}
                    className="border-none cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-stone-100 text-left"
                    style={{
                      background: "transparent",
                      color: item.danger ? "#ef4444" : "#1c1917",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && hovered && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 20,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            opacity: hovered ? 1 : 0,
            transition: "all 0.3s ease 0.1s",
          }}
        >
          {post.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              style={{
                padding: "3px 10px",
                background: "rgba(16,185,129,0.7)",
                backdropFilter: "blur(8px)",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                color: "white",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: isLarge ? 24 : 20,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "all 0.3s ease",
        }}
      >
        <h3
          className="font-display"
          style={{
            color: "white",
            fontWeight: 800,
            fontSize: isLarge ? 28 : 18,
            lineHeight: 1.15,
            textShadow: "0 2px 16px rgba(0,0,0,0.7)",
            marginBottom: isLarge ? 6 : 8,
            letterSpacing: "-0.02em",
          }}
        >
          {post.title}
        </h3>

        {/* Description only on large cards */}
        {isLarge && post.description && (
          <p
            className="line-clamp-2"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              lineHeight: 1.5,
              marginBottom: 10,
              opacity: hovered ? 1 : 0,
              maxHeight: hovered ? 60 : 0,
              overflow: "hidden",
              transition: "all 0.3s ease 0.05s",
            }}
          >
            {post.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: hovered ? 1 : 0,
            maxHeight: hovered ? 40 : 0,
            overflow: "hidden",
            transition: "all 0.3s ease 0.05s",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
              }}
            >
              <Heart size={14} /> {post.likes}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
              }}
            >
              <MessageCircle size={14} /> {post.comments?.length || 0}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.(post.id);
              }}
              className="border-none cursor-pointer"
              aria-label={post.saved ? "Quitar de guardados" : "Guardar post"}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: post.saved ? "#f59e0b" : "white",
              }}
            >
              <Bookmark size={14} fill={post.saved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="border-none cursor-pointer"
              aria-label="Compartir post"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "white",
              }}
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = "PostCard";

// ═══════════════════════════════════════════
// STORY VIEWER MODAL
// ═══════════════════════════════════════════
const StoryViewerModal = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const STORY_DURATION = 5000;

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current);
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onClose();
        }
      }
    }, 30);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, stories.length, onClose]);

  const goNext = () => {
    clearInterval(timerRef.current);
    if (currentIndex < stories.length - 1) setCurrentIndex((prev) => prev + 1);
    else onClose();
  };

  const goPrev = () => {
    clearInterval(timerRef.current);
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    else setProgress(0);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
      role="dialog"
      aria-label="Visor de stories"
    >
      <div
        className="relative w-full max-w-[420px] mx-4"
        style={{ aspectRatio: "9/16", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          {stories.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  background: "white",
                  width: i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%",
                  transition: i === currentIndex ? "none" : "width 0.3s",
                }}
              />
            </div>
          ))}
        </div>

        {/* Story header */}
        <div
          className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentStory.avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid white" }}
            />
            <div>
              <p className="text-white font-bold text-sm">{currentStory.name}</p>
              <p className="text-white/50 text-xs">Hace 2h</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            aria-label="Cerrar story"
          >
            <X size={18} />
          </button>
        </div>

        {/* Story content */}
        <div className="w-full h-full rounded-3xl overflow-hidden">
          <img
            src={currentStory.storyImage || `https://images.unsplash.com/photo-${1500000000000 + currentIndex * 100}?w=500&h=900&fit=crop`}
            alt=""
            className="w-full h-full object-cover"
            style={{
              background: `linear-gradient(135deg, hsl(${currentIndex * 60}, 70%, 40%), hsl(${currentIndex * 60 + 40}, 70%, 50%))`,
            }}
          />
        </div>

        {/* Navigation zones */}
        <div
          className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
          onClick={goPrev}
          role="button"
          aria-label="Story anterior"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && goPrev()}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
          onClick={goNext}
          role="button"
          aria-label="Story siguiente"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && goNext()}
        />

        {/* Nav arrows */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// STORY BUBBLE — improved with keyboard nav
// ═══════════════════════════════════════════
const StoryBubble = ({ user, isCreate, onClick }) => {
  const [tapped, setTapped] = useState(false);

  const handleClick = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 200);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center gap-2 cursor-pointer group"
      style={{ minWidth: 80 }}
      role="button"
      tabIndex={0}
      aria-label={isCreate ? "Crear tu historia" : `Ver historia de ${user?.name}`}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="relative">
        <div
          className="rounded-full transition-all duration-300 group-hover:scale-105"
          style={{
            width: 72,
            height: 72,
            padding: 3,
            background: isCreate
              ? "linear-gradient(135deg, #10b981, #14b8a6)"
              : user?.hasNewStory
              ? "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6, #06b6d4)"
              : "#e7e5e4",
            backgroundSize: user?.hasNewStory ? "300% 300%" : "100%",
            animation: user?.hasNewStory ? "storyRingRotate 4s linear infinite" : "none",
            transform: tapped ? "scale(0.92)" : "scale(1)",
          }}
        >
          {isCreate ? (
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-90"
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}
              >
                <PlusCircle className="w-[22px] h-[22px] text-white" />
              </div>
            </div>
          ) : (
            <img
              src={user?.avatar}
              alt={`Avatar de ${user?.name}`}
              className="w-full h-full rounded-full object-cover"
              style={{ border: "3px solid white" }}
            />
          )}
        </div>
        {/* New story dot */}
        {!isCreate && user?.hasNewStory && (
          <div
            className="absolute -bottom-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
      <span
        className="text-[11px] font-semibold truncate text-center"
        style={{ color: isCreate ? "var(--accent)" : "var(--text-secondary)", maxWidth: 72 }}
      >
        {isCreate ? "Tu historia" : user?.name}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════
// TRENDING CARD
// ═══════════════════════════════════════════
const TrendingCard = React.memo(({ tag, posts: p, gradient }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Tendencia: ${tag}, ${p} posts`}
      style={{
        padding: "20px 22px",
        background: gradient,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "scale(1.04) translateY(-2px)" : "scale(1)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.18)" : "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
        style={{
          background: "rgba(255,255,255,0.08)",
          transition: "all 0.4s ease",
          transform: hovered ? "scale(1.3)" : "scale(1)",
        }}
      />
      <div
        className="absolute bottom-2 right-3"
        style={{
          opacity: 0.08,
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-2px) scale(1.1)" : "none",
        }}
      >
        <TrendingUp size={36} />
      </div>

      <p className="text-[9px] font-extrabold uppercase relative z-10" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginBottom: 6 }}>
        Trending
      </p>
      <p className="text-xl font-black text-white relative z-10" style={{ letterSpacing: "-0.02em" }}>
        #{tag}
      </p>
      <p className="text-[11px] mt-1.5 font-semibold relative z-10" style={{ color: "rgba(255,255,255,0.45)" }}>
        {p} posts
      </p>
    </div>
  );
});

TrendingCard.displayName = "TrendingCard";

// ═══════════════════════════════════════════
// REPORT MODAL
// ═══════════════════════════════════════════
const ReportModal = ({ isOpen, onClose, postId }) => {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason("");
      onClose();
    }, 1500);
  };

  const reasons = [
    "Contenido inapropiado",
    "Spam o publicidad",
    "Información falsa",
    "Contenido robado / plagio",
    "Acoso o intimidación",
    "Otro",
  ];

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
// COLLECTION MODAL (Save to collection)
// ═══════════════════════════════════════════
const CollectionModal = ({ isOpen, onClose, postId }) => {
  const [collections, setCollections] = useState([
    { id: 1, name: "Favoritos", count: 12, emoji: "⭐" },
    { id: 2, name: "Inspiración", count: 8, emoji: "💡" },
    { id: 3, name: "Para hacer", count: 5, emoji: "🔨" },
  ]);
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [savedTo, setSavedTo] = useState(null);

  if (!isOpen) return null;

  const handleSave = (collectionId) => {
    setSavedTo(collectionId);
    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, count: c.count + 1 } : c))
    );
    setTimeout(() => {
      setSavedTo(null);
      onClose();
    }, 800);
  };

  const handleCreateNew = () => {
    if (!newName.trim()) return;
    const newCol = { id: Date.now(), name: newName, count: 1, emoji: "📁" };
    setCollections((prev) => [...prev, newCol]);
    setSavedTo(newCol.id);
    setNewName("");
    setShowNew(false);
    setTimeout(() => {
      setSavedTo(null);
      onClose();
    }, 800);
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
          <button
            onClick={onClose}
            className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-stone-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => handleSave(col.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-none cursor-pointer transition-all hover:bg-stone-50"
              style={{
                background: savedTo === col.id ? "rgba(16,185,129,0.1)" : "transparent",
              }}
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
              <button
                onClick={handleCreateNew}
                className="px-4 rounded-xl bg-emerald-500 text-white font-bold border-none cursor-pointer text-sm"
              >
                Crear
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNew(true)}
              className="w-full py-3 rounded-xl font-bold border-2 border-dashed border-stone-200 cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 text-sm flex items-center justify-center gap-2"
              style={{ background: "transparent", color: "var(--text-secondary)" }}
            >
              <PlusCircle size={16} /> Nueva colección
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// CREATE POST MODAL — improved with drag & drop, tags, preview
// ═══════════════════════════════════════════
const CreatePostModal = ({ isOpen, onClose }) => {
  const { addPost } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [category, setCategory] = useState("decor");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "El título es obligatorio";
    else if (title.trim().length < 3) newErrors.title = "Mínimo 3 caracteres";
    if (imageUrl && !isValidUrl(imageUrl)) newErrors.imageUrl = "URL no válida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try { new URL(string); return true; } catch { return false; }
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setImageUrl("");
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const effectiveImage = imagePreview || imageUrl;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addPost({
      id: Date.now(),
      title: title.trim(),
      description,
      author: user?.name || "Tú",
      avatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Tu",
      image: effectiveImage || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      likes: 0,
      likedByUser: false,
      comments: [],
      category,
      tags,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setImageUrl(""); setImageFile(null);
    setImagePreview(""); setTags([]); setTagInput(""); setErrors({});
    setShowPreview(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const formInputStyle = "w-full p-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-400 outline-none transition-all font-medium";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(12,24,16,0.8)", backdropFilter: "blur(8px)" }}
      onClick={handleClose}
      role="dialog"
      aria-label="Crear nuevo post"
    >
      <div
        className="bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid #f5f5f4" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Crear Post</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Comparte tu proyecto</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(title || effectiveImage) && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all"
                style={{
                  background: showPreview ? "rgba(16,185,129,0.1)" : "#f5f5f4",
                  color: showPreview ? "#059669" : "var(--text-secondary)",
                }}
              >
                {showPreview ? "Editar" : "Preview"}
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center hover:bg-rose-100 hover:text-rose-500 transition-colors border-none cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {showPreview ? (
            /* Preview mode */
            <div className="space-y-4">
              {effectiveImage && (
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <img src={effectiveImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                {title || "Sin título"}
              </h3>
              {description && (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
                >
                  {category}
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "#f5f5f4", color: "var(--text-secondary)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid #f5f5f4" }}>
                <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {user?.name}
                </span>
              </div>
            </div>
          ) : (
            /* Edit mode */
            <>
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <p className="font-bold" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Publicación pública</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: null }); }}
                    placeholder="¿Qué has reciclado hoy?"
                    className={cn(formInputStyle, "text-lg", errors.title && "!border-rose-400 !bg-rose-50")}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 font-medium mt-1.5 ml-2">{errors.title}</p>
                  )}
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cuéntanos más sobre tu proyecto..."
                  rows={3}
                  className={cn(formInputStyle, "resize-none")}
                />

                {/* Image upload area */}
                {!effectiveImage ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-2xl p-8 text-center transition-all"
                    style={{
                      border: `2px dashed ${isDragging ? "#10b981" : "#d6d3d1"}`,
                      background: isDragging ? "rgba(16,185,129,0.05)" : "#fafaf9",
                    }}
                  >
                    <ImagePlus
                      className="w-10 h-10 mx-auto mb-3"
                      style={{ color: isDragging ? "#10b981" : "#a8a29e" }}
                    />
                    <p className="text-sm font-bold mb-1" style={{ color: "var(--text-secondary)" }}>
                      Arrastra una imagen o haz clic
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      JPG, PNG, WebP — o pega una URL
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={effectiveImage}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageUrl(""); setImageFile(null); setImagePreview(""); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-rose-500 hover:bg-white transition-colors border-none cursor-pointer shadow-lg"
                      aria-label="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* URL fallback */}
                {!imagePreview && (
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                      <input
                        value={imageUrl}
                        onChange={(e) => { setImageUrl(e.target.value); setErrors({ ...errors, imageUrl: null }); }}
                        placeholder="o pega una URL de imagen"
                        type="url"
                        className={cn(formInputStyle, "pl-10", errors.imageUrl && "!border-rose-400")}
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="border-none cursor-pointer bg-transparent p-0 text-emerald-400 hover:text-rose-500 transition-colors"
                          aria-label={`Eliminar tag ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {tags.length < 5 && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                          placeholder={`Añadir tag (${5 - tags.length} restantes)`}
                          className={cn(formInputStyle, "pl-10 !py-3")}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addTag}
                        disabled={!tagInput.trim()}
                        className="px-4 rounded-2xl font-bold border-none cursor-pointer text-sm transition-all"
                        style={{
                          background: tagInput.trim() ? "#10b981" : "#e7e5e4",
                          color: tagInput.trim() ? "white" : "#a8a29e",
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(formInputStyle, "cursor-pointer appearance-none")}
                  aria-label="Categoría"
                >
                  <option value="decor">Decoración</option>
                  <option value="furniture">Muebles</option>
                  <option value="lighting">Iluminación</option>
                  <option value="fashion">Moda</option>
                  <option value="garden">Jardín</option>
                </select>

                <button
                  type="submit"
                  disabled={!title.trim()}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-none cursor-pointer",
                    title.trim()
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02]"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-5 h-5" /> Publicar Proyecto
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MOBILE SEARCH BAR
// ═══════════════════════════════════════════
const MobileSearchBar = ({ isOpen, searchQuery, setSearchQuery, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 p-3 lg:hidden"
      style={{ background: "rgba(250,250,249,0.97)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center bg-white px-4 py-3 rounded-2xl gap-3"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar inspiración..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full font-medium border-none"
            style={{ color: "var(--text-secondary)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="bg-transparent border-none cursor-pointer p-0 flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-3 rounded-2xl bg-stone-100 border-none cursor-pointer font-bold text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCROLL TO TOP BUTTON
// ═══════════════════════════════════════════
const ScrollToTopButton = ({ containerRef }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    const handleScroll = () => setVisible(container.scrollTop > 600);
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
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
// BENTO CONFIG
// ═══════════════════════════════════════════
const getBentoConfig = (index) => {
  const position = index % 10;
  if (position === 0) return { variant: "large" };
  if (position === 1) return { variant: "tall" };
  if (position === 4) return { variant: "wide" };
  if (position === 7) return { variant: "tall" };
  return { variant: "standard" };
};

// ═══════════════════════════════════════════
// FEED HEADER (extracted component)
// ═══════════════════════════════════════════
const FeedHeader = React.memo(({ user, searchQuery, setSearchQuery, setActiveTab, notifications, onSearchOpen }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <header
      className="px-4 md:px-8 py-5 flex items-center justify-between flex-shrink-0 sticky top-0 z-40"
      style={{
        background: "rgba(250,250,249,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <div>
        <h1
          className="text-[28px] font-black tracking-tight flex items-center gap-[10px]"
          style={{ color: "var(--text-primary)" }}
        >
          <span className="w-1 h-7 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
          Inicio
        </h1>
        <p className="text-[13px] font-medium mt-1" style={{ color: "var(--text-muted)" }}>
          {greeting}, {user.name.split(" ")[0]}! Descubre proyectos increíbles
        </p>
      </div>
    <div className="flex items-center gap-[10px]">
      {/* Mobile search trigger */}
      <button
        onClick={onSearchOpen}
        className="lg:hidden p-[10px] bg-white rounded-2xl cursor-pointer transition-all border-none"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        aria-label="Buscar"
      >
        <Search className="w-[18px] h-[18px]" style={{ color: "var(--text-secondary)" }} />
      </button>

      {/* Desktop search */}
      <div
        className="hidden lg:flex items-center bg-white px-5 py-[10px] rounded-2xl gap-[10px] w-72 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <Search className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Buscar inspiración..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none text-[13px] w-full font-medium border-none"
          style={{ color: "var(--text-secondary)" }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="bg-transparent border-none cursor-pointer p-0"
            style={{ color: "var(--text-muted)" }}
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <button
        onClick={() => setActiveTab("Notifications")}
        className="relative p-[10px] bg-white rounded-2xl cursor-pointer transition-all border-none"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        aria-label={`Notificaciones${notifications.some((n) => !n.read) ? " - tienes nuevas" : ""}`}
      >
        <Bell className="w-[18px] h-[18px]" style={{ color: "var(--text-secondary)" }} />
        {notifications.some((n) => !n.read) && (
          <span
            className="absolute top-[6px] right-[6px] flex items-center justify-center min-w-[18px] h-[18px] text-[9px] font-black text-white rounded-full px-1"
            style={{ background: "#ef4444", border: "2px solid white" }}
          >
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>
    </div>
  </header>
  );
});

FeedHeader.displayName = "FeedHeader";

// ═══════════════════════════════════════════
// FEED CONTROLS (extracted component)
// ═══════════════════════════════════════════
const FeedControls = React.memo(({ categories, categoryFilter, setCategoryFilter, feedFilter, setFeedFilter, searchQuery, filteredCount }) => (
  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
      <h2
        className="text-lg font-black flex items-center gap-2 whitespace-nowrap"
        style={{ color: "var(--text-primary)" }}
      >
        <Sparkles className="w-[18px] h-[18px] text-emerald-500" />
        Descubre
        {searchQuery && (
          <span
            className="text-[12px] font-medium bg-stone-100 px-[10px] py-1 rounded-full"
            style={{ color: "var(--text-muted)" }}
          >
            {filteredCount} resultados
          </span>
        )}
      </h2>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => setCategoryFilter(c.id)}
          className="px-[14px] py-[6px] rounded-[10px] text-[12px] font-bold whitespace-nowrap transition-all border-none cursor-pointer"
          style={{
            background: categoryFilter === c.id ? "var(--text-primary)" : "white",
            color: categoryFilter === c.id ? "white" : "var(--text-secondary)",
            boxShadow: categoryFilter === c.id ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          }}
          aria-pressed={categoryFilter === c.id}
        >
          {c.label}
        </button>
      ))}
    </div>
    <div className="flex bg-white p-1 rounded-[14px]" style={{ border: "1px solid var(--border)" }}>
      {[
        ["trending", "Tendencias", TrendingUp],
        ["following", "Seguidos", Users],
      ].map(([val, label, Icon]) => (
        <button
          key={val}
          onClick={() => setFeedFilter(val)}
          className="px-[14px] py-[7px] rounded-[10px] text-[12px] font-bold flex items-center gap-[6px] transition-all border-none cursor-pointer"
          style={{
            background: feedFilter === val ? "linear-gradient(135deg, #10b981, #14b8a6)" : "transparent",
            color: feedFilter === val ? "white" : "var(--text-secondary)",
          }}
          aria-pressed={feedFilter === val}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  </div>
));

FeedControls.displayName = "FeedControls";

// ═══════════════════════════════════════════
// INFINITE SCROLL HOOK
// ═══════════════════════════════════════════
const useInfiniteScroll = (items, pageSize = 12) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items.length, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < items.length && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
            setLoading(false);
          }, 300);
        }
      },
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, items.length, loading, pageSize]);

  return {
    visibleItems: items.slice(0, visibleCount),
    sentinelRef,
    loading,
    hasMore: visibleCount < items.length,
  };
};

// ═══════════════════════════════════════════
// FEED VIEW — improved
// ═══════════════════════════════════════════
const FeedView = ({ user, onCreatePost, setActiveTab, setSelectedPost }) => {
  const { posts, toggleLike, toggleSave, notifications } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("trending");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [storyInitialIndex, setStoryInitialIndex] = useState(0);
  const [reportPostId, setReportPostId] = useState(null);
  const [collectionPostId, setCollectionPostId] = useState(null);
  const mainRef = useRef(null);

  const categories = useMemo(() => [
    { id: "all", label: "Todo" },
    { id: "furniture", label: "Muebles" },
    { id: "lighting", label: "Iluminación" },
    { id: "decor", label: "Decoración" },
    { id: "fashion", label: "Moda" },
    { id: "garden", label: "Jardín" },
  ], []);

  const filteredPosts = useMemo(() =>
    posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    }),
    [posts, searchQuery, categoryFilter]
  );

  const { visibleItems, sentinelRef, loading, hasMore } = useInfiniteScroll(filteredPosts);

  const stories = useMemo(() => [
    { id: 1, name: "EcoMaria", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", hasNewStory: true, storyImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=900&fit=crop" },
    { id: 2, name: "GreenJuan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", hasNewStory: true, storyImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=900&fit=crop" },
    { id: 3, name: "ReUsaAna", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", hasNewStory: false, storyImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&h=900&fit=crop" },
    { id: 4, name: "CraftLuis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis", hasNewStory: true, storyImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=900&fit=crop" },
    { id: 5, name: "VintageRosa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa", hasNewStory: false, storyImage: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&h=900&fit=crop" },
  ], []);

  const handleStoryClick = useCallback((index) => {
    setStoryInitialIndex(index);
    setStoryViewerOpen(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative" style={{ background: "var(--bg-primary)" }}>
      {/* Subtle bg glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
        }}
      />

      <FeedHeader
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onSearchOpen={() => setMobileSearchOpen(true)}
      />

      <MobileSearchBar
        isOpen={mobileSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClose={() => setMobileSearchOpen(false)}
      />

      <main ref={mainRef} className="flex-1 overflow-y-auto px-4 md:px-8 pb-10 relative z-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          {/* Stories */}
          <div className="py-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold" style={{ color: "var(--text-secondary)" }}>
                Historias
              </h3>
              <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                Ver todas
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <StoryBubble isCreate onClick={onCreatePost} />
              {stories.map((story, index) => (
                <StoryBubble
                  key={story.id}
                  user={story}
                  onClick={() => handleStoryClick(index)}
                />
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <TrendingCard tag="Upcycling" posts="2.4k" gradient="linear-gradient(135deg, #10b981 0%, #0d9488 100%)" />
            <TrendingCard tag="Muebles" posts="1.8k" gradient="linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)" />
            <TrendingCard tag="Textil" posts="1.2k" gradient="linear-gradient(135deg, #ef4444 0%, #ec4899 100%)" />
            <TrendingCard tag="Decoración" posts="980" gradient="linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" />
          </div>

          {/* Feed Controls */}
          <FeedControls
            categories={categories}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            feedFilter={feedFilter}
            setFeedFilter={setFeedFilter}
            searchQuery={searchQuery}
            filteredCount={filteredPosts.length}
          />

          {/* Bento Grid */}
          {filteredPosts.length === 0 ? (
            <div
              className="bg-white rounded-[24px] p-16 text-center"
              style={{ border: "1px solid var(--border)" }}
            >
              <Search className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--text-faint)" }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                No se encontraron posts
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                Intenta con otra búsqueda o categoría
              </p>
            </div>
          ) : (
            <>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20"
                style={{ gridAutoRows: 260, gridAutoFlow: "dense" }}
              >
                {visibleItems.map((post, index) => {
                  const config = getBentoConfig(index);
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={toggleLike}
                      onSave={toggleSave}
                      onClick={() => setSelectedPost(post)}
                      onReport={(id) => setReportPostId(id)}
                      onAddToCollection={(id) => setCollectionPostId(id)}
                      variant={config.variant}
                    />
                  );
                })}
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
      </main>

      <ScrollToTopButton containerRef={mainRef} />

      {/* Story Viewer */}
      {storyViewerOpen && (
        <StoryViewerModal
          stories={stories}
          initialIndex={storyInitialIndex}
          onClose={() => setStoryViewerOpen(false)}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportPostId !== null}
        onClose={() => setReportPostId(null)}
        postId={reportPostId}
      />

      {/* Collection Modal */}
      <CollectionModal
        isOpen={collectionPostId !== null}
        onClose={() => setCollectionPostId(null)}
        postId={collectionPostId}
      />
    </div>
  );
};

// ═══════════════════════════════════════════
// GLOBAL ANIMATIONS (inject once)
// ═══════════════════════════════════════════
const GlobalStyles = () => {
  useEffect(() => {
    const id = "relife-global-animations";
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
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes storyRingRotate {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-fadeIn { animation: fadeIn 0.2s ease; }
      .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  return null;
};

// ═══════════════════════════════════════════
// HOME (Router)
// ═══════════════════════════════════════════
const Home = () => {
  const { user, logout } = useAuth();
  const { posts, toggleLike, notifications } = useData();
  const [activeTab, setActiveTab] = useState("Feed");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  if (!user) return <AuthView />;

  const renderContent = () => {
    switch (activeTab) {
      case "Messages":
        return <MessagesView />;
      case "Settings":
        return <SettingsView />;
      case "Explore":
        return <ExploreView />;
      case "Notifications":
        return <NotificationsView />;
      case "Stats":
        return <StatsView />;
      case "Profile":
        return (
          <ProfileView
            onPostClick={(post) => setSelectedPost(post)}
            onNavigateToSettings={() => setActiveTab("Settings")}
          />
        );
      case "Marketplace":
        return <MarketplaceView />;
      case "Feed":
      default:
        return (
          <FeedView
            user={user}
            onCreatePost={() => setIsCreateOpen(true)}
            setActiveTab={setActiveTab}
            setSelectedPost={setSelectedPost}
          />
        );
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row w-full h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <GlobalStyles />

      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
        notifications={notifications}
        onCreatePost={() => setIsCreateOpen(true)}
      />

      <ViewTransition viewKey={activeTab}>
        {renderContent()}
      </ViewTransition>

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <PostDetailModal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
        currentUser={user}
        onLike={toggleLike}
      />
    </div>
  );
};

export default Home;