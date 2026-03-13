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
              {user?.site && (
                <a
                  href={user.site.startsWith("http") ? user.site : `https://${user.site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="font-medium">{user.site}</span>
                </a>
              )}
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 pb-24">
        {displayPosts.length === 0 ? (
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
    </div>
  );
};

export default ProfileView;