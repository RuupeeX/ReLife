import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Search, MoreVertical, Phone, Video, Send, Smile, CheckCheck, Check,
  Mic, ArrowLeft, X, Trash2, Copy, Image, MessageCircle, Plus, Paperclip,
  Info, ChevronRight, Heart, ThumbsUp, Laugh, Flame, Star, Reply, Pin,
  Users, Clock, Bell, BellOff, Archive, UserPlus, Shield, ImagePlus,
  AtSign, Hash, Recycle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import chatsData from "../data/chats.json";

// ═══════════════════════════════════════════
// TYPING INDICATOR — improved dots
// ═══════════════════════════════════════════
const TypingIndicator = ({ userName }) => (
  <div className="flex justify-start items-end gap-2">
    <div
      className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md"
      style={{ background: "white", border: "1px solid var(--border)" }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[6px] h-[6px] rounded-full"
          style={{
            background: "#10b981",
            animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
    <span className="text-[10px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
      {userName} escribe...
    </span>
  </div>
);

// ═══════════════════════════════════════════
// EMOJI PICKER — expanded with categories
// ═══════════════════════════════════════════
const EMOJI_CATEGORIES = {
  frecuentes: ["😊", "😂", "❤️", "👍", "🔥", "✨", "🎉", "🙌", "💚", "♻️"],
  caritas: ["😀", "😁", "😅", "🤣", "😇", "😍", "🤩", "😘", "🥰", "😎"],
  naturaleza: ["🌱", "🌍", "🌿", "🍃", "🌻", "🌊", "☀️", "🌈", "🦋", "🐝"],
  objetos: ["💡", "🪵", "🎨", "🔨", "🪴", "🏠", "📦", "🛠️", "🎯", "💪"],
};

const EmojiPicker = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("frecuentes");
  const pickerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-14 left-0 bg-white rounded-2xl z-30 overflow-hidden"
      style={{
        boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        border: "1px solid var(--border)",
        animation: "emojiSlideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
        width: 280,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Category tabs */}
      <div className="flex border-b px-2 pt-2 gap-1" style={{ borderColor: "var(--border)" }}>
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-t-lg border-none cursor-pointer transition-all",
              activeCategory === cat
                ? "bg-emerald-50 text-emerald-600"
                : "bg-transparent text-stone-400 hover:text-stone-600"
            )}
          >
            {cat === "frecuentes" ? "⭐" : cat === "caritas" ? "😊" : cat === "naturaleza" ? "🌿" : "🔨"}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="p-2 grid grid-cols-5 gap-0.5 max-h-[180px] overflow-y-auto scrollbar-hide">
        {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-100 active:scale-90 transition-all border-none cursor-pointer bg-transparent text-xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MESSAGE REACTIONS — quick emoji reactions
// ═══════════════════════════════════════════
const QUICK_REACTIONS = ["❤️", "👍", "😂", "🔥", "😮"];

const ReactionPicker = ({ onReact, onClose }) => (
  <div
    className="absolute -top-10 left-0 flex items-center gap-0.5 px-2 py-1.5 rounded-full bg-white z-30"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      border: "1px solid var(--border)",
      animation: "emojiSlideUp 0.2s ease",
    }}
  >
    {QUICK_REACTIONS.map((emoji) => (
      <button
        key={emoji}
        onClick={(e) => { e.stopPropagation(); onReact(emoji); onClose(); }}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 active:scale-110 transition-all border-none cursor-pointer bg-transparent text-base hover:scale-125"
      >
        {emoji}
      </button>
    ))}
  </div>
);

// ═══════════════════════════════════════════
// MESSAGE BUBBLE — enhanced with reactions, reply preview
// ═══════════════════════════════════════════
const MessageBubble = React.memo(({ msg, onDelete, onCopy, onReact, onReply }) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [copied, setCopied] = useState(false);
  const longPressRef = useRef(null);

  const handleLongPress = () => {
    longPressRef.current = setTimeout(() => setShowActions(true), 400);
  };
  const handleRelease = () => clearTimeout(longPressRef.current);

  const handleCopy = () => {
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowActions(false); }, 1000);
  };

  return (
    <div
      className={cn("flex w-full group relative", msg.isMe ? "justify-end" : "justify-start")}
      onMouseLeave={() => { setShowActions(false); setShowReactions(false); }}
    >
      {/* Avatar for received messages */}
      {!msg.isMe && msg.showAvatar !== false && (
        <img
          src={msg.avatar}
          alt=""
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mr-2 mt-auto mb-1"
        />
      )}
      {!msg.isMe && msg.showAvatar === false && (
        <div className="w-7 mr-2 flex-shrink-0" />
      )}

      <div className="relative max-w-[72%]">
        {/* Reaction picker */}
        {showReactions && (
          <ReactionPicker
            onReact={(emoji) => onReact?.(msg.id, emoji)}
            onClose={() => setShowReactions(false)}
          />
        )}

        {/* Reply preview */}
        {msg.replyTo && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-t-2xl -mb-1 text-[11px]"
            style={{
              background: msg.isMe ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)",
              borderLeft: "2px solid #10b981",
              marginLeft: msg.isMe ? 0 : 0,
            }}
          >
            <Reply className="w-3 h-3 flex-shrink-0" style={{ color: "#10b981" }} />
            <span className="truncate" style={{ color: msg.isMe ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>
              {msg.replyTo}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div
          className="relative p-[10px_16px] text-[14px] font-medium"
          style={{
            borderRadius: msg.isMe ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
            background: msg.isMe
              ? "linear-gradient(135deg, #0c1810, #1a2e1f)"
              : "white",
            color: msg.isMe ? "white" : "var(--text-secondary)",
            border: msg.isMe ? "none" : "1px solid var(--border)",
            lineHeight: 1.55,
            boxShadow: msg.isMe ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          }}
          onTouchStart={handleLongPress}
          onTouchEnd={handleRelease}
          onContextMenu={(e) => { e.preventDefault(); setShowActions(true); }}
          onDoubleClick={() => setShowReactions(true)}
        >
          {/* Image attachment */}
          {msg.image && (
            <div className="rounded-xl overflow-hidden mb-2 -mx-2 -mt-1">
              <img src={msg.image} alt="Adjunto" className="w-full max-h-48 object-cover" />
            </div>
          )}

          {msg.text}

          {/* Time and read status */}
          <div
            className="flex items-center gap-1 mt-1"
            style={{
              fontSize: 10,
              color: msg.isMe ? "rgba(255,255,255,0.35)" : "var(--text-muted)",
              justifyContent: msg.isMe ? "flex-end" : "flex-start",
            }}
          >
            {msg.time}
            {msg.isMe && (
              msg.read
                ? <CheckCheck className="w-3 h-3" style={{ color: "#6ee7b7" }} />
                : <Check className="w-3 h-3" style={{ color: "rgba(255,255,255,0.35)" }} />
            )}
          </div>
        </div>

        {/* Reactions display */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div
            className={cn("flex gap-0.5 mt-0.5", msg.isMe ? "justify-end" : "justify-start")}
          >
            {msg.reactions.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] bg-white"
                style={{ border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {/* Context actions */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-all duration-200",
            msg.isMe ? "right-full mr-1.5" : "left-full ml-1.5",
            showActions ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
          )}
        >
          <button
            onClick={() => setShowReactions(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 border cursor-pointer transition-colors text-sm"
            style={{ borderColor: "var(--border)" }}
            aria-label="Reaccionar"
            title="Reaccionar"
          >
            😊
          </button>
          <button
            onClick={() => onReply?.(msg)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 border-none cursor-pointer transition-colors"
            style={{ border: "1px solid var(--border)" }}
            aria-label="Responder"
            title="Responder"
          >
            <Reply className="w-3 h-3 text-stone-400" />
          </button>
          <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 border-none cursor-pointer transition-colors"
            style={{ border: "1px solid var(--border)" }}
            aria-label="Copiar"
            title="Copiar"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-stone-400" />}
          </button>
          {msg.isMe && (
            <button
              onClick={() => onDelete(msg.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white hover:bg-rose-50 border-none cursor-pointer transition-colors"
              style={{ border: "1px solid var(--border)" }}
              aria-label="Eliminar"
              title="Eliminar"
            >
              <Trash2 className="w-3 h-3 text-stone-400 hover:text-rose-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
MessageBubble.displayName = "MessageBubble";

// ═══════════════════════════════════════════
// DATE SEPARATOR
// ═══════════════════════════════════════════
const DateSeparator = ({ text }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    <span
      className="text-[10px] font-bold uppercase px-3 py-1 rounded-full"
      style={{ color: "var(--text-muted)", background: "white", border: "1px solid var(--border)", letterSpacing: 1 }}
    >
      {text}
    </span>
    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
  </div>
);

// ═══════════════════════════════════════════
// CHAT INFO PANEL — sidebar with user details
// ═══════════════════════════════════════════
const ChatInfoPanel = ({ chat, onClose, messageCount }) => {
  if (!chat) return null;

  const sharedMedia = [
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=150&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&fit=crop",
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=150&fit=crop",
  ];

  const actions = [
    { icon: BellOff, label: "Silenciar notificaciones", color: "var(--text-secondary)" },
    { icon: Pin, label: "Fijar conversación", color: "var(--text-secondary)" },
    { icon: Archive, label: "Archivar chat", color: "var(--text-secondary)" },
    { icon: Trash2, label: "Eliminar conversación", color: "#ef4444" },
  ];

  return (
    <div
      className="w-[300px] bg-white flex-shrink-0 flex flex-col overflow-y-auto scrollbar-hide rounded-[24px]"
      style={{ border: "1px solid var(--border)", animation: "slideInPanel 0.3s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Header */}
      <div className="p-5 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 border-none cursor-pointer transition-colors"
          aria-label="Cerrar panel"
        >
          <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
        </button>

        <div className="relative inline-block mb-3">
          <img
            src={chat.avatar}
            alt={chat.user}
            className="w-20 h-20 rounded-full object-cover mx-auto"
            style={{ border: "3px solid rgba(16,185,129,0.2)" }}
          />
          {chat.online && (
            <span
              className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full"
              style={{ border: "3px solid white" }}
            />
          )}
        </div>
        <h3 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>{chat.user}</h3>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          {chat.online ? "En línea ahora" : "Última vez hace 2h"}
        </p>

        {/* Quick actions */}
        <div className="flex justify-center gap-3 mt-4">
          {[
            { icon: Phone, label: "Llamar" },
            { icon: Video, label: "Video" },
            { icon: UserPlus, label: "Perfil" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-stone-50 bg-transparent border-none cursor-pointer transition-colors"
              aria-label={label}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.08)" }}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <h4 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Información
        </h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{messageCount} mensajes</span>
          </div>
          <div className="flex items-center gap-3">
            <Recycle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Creador de upcycling</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Verificado</span>
          </div>
        </div>
      </div>

      {/* Shared media */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Multimedia compartida
          </h4>
          <button className="text-[11px] font-bold text-emerald-600 bg-transparent border-none cursor-pointer">
            Ver todo
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {sharedMedia.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer hover:bg-stone-50 transition-colors text-left"
          >
            <action.icon className="w-4 h-4" style={{ color: action.color }} />
            <span className="text-[13px] font-semibold" style={{ color: action.color }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// EMPTY CHAT STATE
// ═══════════════════════════════════════════
const EmptyChat = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <div
      className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
      style={{ background: "rgba(16,185,129,0.06)" }}
    >
      <MessageCircle className="w-10 h-10 text-emerald-300" />
    </div>
    <h3 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
      Tus mensajes
    </h3>
    <p className="text-sm max-w-[300px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
      Selecciona una conversación para empezar a chatear con otros creadores de la comunidad ReLife.
    </p>
    <div className="flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-[13px] font-bold" style={{ background: "rgba(16,185,129,0.08)", color: "#10b981" }}>
      <Users className="w-4 h-4" /> {chatsData.length} conversaciones activas
    </div>
  </div>
);

// ═══════════════════════════════════════════
// NEW CHAT MODAL
// ═══════════════════════════════════════════
const NewChatModal = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;

  const suggestedUsers = [
    { name: "EcoMaria", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", bio: "Creadora de lámparas recicladas" },
    { name: "CraftLuis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis", bio: "Experto en muebles de palets" },
    { name: "GreenAna", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", bio: "Amante del jardín sostenible" },
    { name: "VintageRosa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa", bio: "Restauradora vintage" },
    { name: "DIYCarlos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos", bio: "DIY y upcycling textil" },
  ].filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid #f5f5f4" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Nuevo mensaje</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-stone-200 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 text-[13px] font-medium outline-none border-2 border-transparent focus:border-emerald-400 focus:bg-white transition-all"
              style={{ color: "var(--text-primary)" }}
              autoFocus
            />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider mb-3 ml-1" style={{ color: "var(--text-muted)" }}>
            Sugeridos
          </p>

          <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-hide">
            {suggestedUsers.map((u) => (
              <button
                key={u.name}
                onClick={() => {
                  onSelect?.(u);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-transparent border-none cursor-pointer hover:bg-stone-50 transition-colors text-left"
              >
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{u.name}</p>
                  <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{u.bio}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-faint)" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// REPLY BAR — shows when replying to a message
// ═══════════════════════════════════════════
const ReplyBar = ({ message, onCancel }) => {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-3 px-5 py-2.5"
      style={{ background: "rgba(16,185,129,0.04)", borderTop: "1px solid rgba(16,185,129,0.1)" }}
    >
      <div className="w-1 h-8 rounded-full bg-emerald-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-emerald-600">
          Respondiendo a {message.isMe ? "ti mismo" : message.senderName || "mensaje"}
        </p>
        <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>
          {message.text}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 border-none cursor-pointer transition-colors flex-shrink-0"
        aria-label="Cancelar respuesta"
      >
        <X className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════
// MESSAGES VIEW — main component
// ═══════════════════════════════════════════
const MessagesView = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(() => {
    const initial = {};
    chatsData.forEach((chat) => {
      initial[chat.id] = [
        {
          id: 1,
          text: `¡Hola! Soy ${chat.user}. He visto tu proyecto de upcycling y me encantó.`,
          isMe: false,
          time: "10:00",
          read: true,
          avatar: chat.avatar,
          senderName: chat.user,
          reactions: [],
        },
        {
          id: 2,
          text: "Me encanta el acabado que le diste. ¿Qué materiales usaste?",
          isMe: false,
          time: "10:01",
          read: true,
          avatar: chat.avatar,
          senderName: chat.user,
          showAvatar: false,
          reactions: [],
        },
        {
          id: 3,
          text: "¡Muchas gracias! 🙏 Usé madera de pallets reciclados y barniz ecológico.",
          isMe: true,
          time: "10:05",
          read: true,
          reactions: ["❤️"],
        },
        {
          id: 4,
          text: "Quedó espectacular. ¿Haces envíos?",
          isMe: false,
          time: "10:08",
          read: true,
          avatar: chat.avatar,
          senderName: chat.user,
          reactions: [],
        },
      ];
    });
    return initial;
  });

  const currentMessages = chatMessages[selectedChat?.id] || [];

  // Inject animations
  useEffect(() => {
    const id = "messages-anims-v2";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      @keyframes emojiSlideUp {
        from { opacity: 0; transform: translateY(8px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes slideInPanel {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes msgAppear {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isTyping]);

  const handleSendMessage = useCallback(
    (e) => {
      e?.preventDefault();
      if (!inputText.trim() || !selectedChat) return;

      const newMessage = {
        id: Date.now(),
        text: inputText.trim(),
        isMe: true,
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        read: false,
        reactions: [],
        replyTo: replyingTo?.text || null,
      };

      setChatMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));
      setInputText("");
      setShowEmoji(false);
      setReplyingTo(null);
      inputRef.current?.focus();
      simulateResponse(selectedChat.id, newMessage.id);
    },
    [inputText, selectedChat, replyingTo]
  );

  const simulateResponse = (chatId, sentMsgId) => {
    const responses = [
      "¡Qué interesante! Me gustaría saber más sobre tu proceso creativo.",
      "Wow, eso es genial 😍 ¡El reciclaje creativo es el futuro!",
      "¿Podrías compartir un tutorial? Seguro que a la comunidad le encantaría.",
      "Me encanta la idea. Yo también estoy trabajando en un proyecto similar ♻️",
      "¡Increíble trabajo! 🎨 Se nota la dedicación.",
      "¿Cuánto tiempo te llevó hacerlo? El resultado es impresionante.",
      "Deberías venderlo en el Marketplace de ReLife 📦",
      "Yo hice algo parecido con botellas recicladas. ¡Comparemos técnicas!",
      "¡Me apunto a intentarlo! ¿Necesito herramientas especiales? 🔨",
      "Esto es justo lo que buscaba para inspirarme en mi próximo proyecto 💡",
    ];

    // Read receipt
    setTimeout(() => {
      setChatMessages((prev) => ({
        ...prev,
        [chatId]: prev[chatId]?.map((m) => (m.id === sentMsgId ? { ...m, read: true } : m)),
      }));
    }, 800);

    // Typing
    setTimeout(() => setIsTyping(true), 1200);

    // Response
    const delay = 2000 + Math.random() * 2500;
    setTimeout(() => {
      setIsTyping(false);
      const chat = chatsData.find((c) => c.id === chatId);
      setChatMessages((prev) => ({
        ...prev,
        [chatId]: [
          ...(prev[chatId] || []),
          {
            id: Date.now(),
            text: responses[Math.floor(Math.random() * responses.length)],
            isMe: false,
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            read: true,
            avatar: chat?.avatar,
            senderName: chat?.user,
            reactions: [],
          },
        ],
      }));
    }, delay);
  };

  const handleDeleteMessage = useCallback(
    (msgId) => {
      if (!selectedChat) return;
      setChatMessages((prev) => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id]?.filter((m) => m.id !== msgId),
      }));
    },
    [selectedChat]
  );

  const handleReaction = useCallback(
    (msgId, emoji) => {
      if (!selectedChat) return;
      setChatMessages((prev) => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id]?.map((m) => {
          if (m.id !== msgId) return m;
          const existing = m.reactions || [];
          if (existing.includes(emoji)) return { ...m, reactions: existing.filter((r) => r !== emoji) };
          return { ...m, reactions: [...existing, emoji] };
        }),
      }));
    },
    [selectedChat]
  );

  const handleReply = useCallback((msg) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  }, []);

  const handleEmojiSelect = useCallback((emoji) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  }, []);

  const filteredChats = useMemo(
    () => chatsData.filter((chat) => chat.user.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
    setIsTyping(false);
    setReplyingTo(null);
    setShowInfoPanel(false);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const getLastMessage = (chatId) => {
    const msgs = chatMessages[chatId];
    return msgs?.[msgs.length - 1];
  };

  return (
    <div className="flex flex-1 h-full p-4 md:p-5 gap-4 overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* ══════════════════════════════════════
         CHAT LIST SIDEBAR
         ══════════════════════════════════════ */}
      <div
        className={cn(
          "w-full md:w-[340px] bg-white rounded-[24px] flex flex-col overflow-hidden flex-shrink-0",
          showMobileChat ? "hidden md:flex" : "flex"
        )}
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[22px] font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              Mensajes
            </h2>
            <button
              onClick={() => setShowNewChat(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all hover:scale-110"
              style={{ background: "rgba(16,185,129,0.08)", color: "#10b981" }}
              aria-label="Nuevo mensaje"
              title="Nuevo mensaje"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Online users strip */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
            {chatsData
              .filter((c) => c.online)
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectChat(c)}
                  className="flex flex-col items-center gap-1 flex-shrink-0 bg-transparent border-none cursor-pointer p-0"
                  title={c.user}
                >
                  <div className="relative">
                    <img src={c.avatar} alt={c.user} className="w-11 h-11 rounded-full object-cover" />
                    <span
                      className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-emerald-500 rounded-full"
                      style={{ border: "2px solid white" }}
                    />
                  </div>
                  <span className="text-[9px] font-semibold truncate" style={{ color: "var(--text-muted)", maxWidth: 48 }}>
                    {c.user.split(/(?=[A-Z])/)[0]}
                  </span>
                </button>
              ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px]" style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Buscar chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 rounded-[14px] pl-10 pr-4 py-[10px] text-[13px] font-semibold outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
              style={{ border: "2px solid transparent", color: "var(--text-primary)" }}
              aria-label="Buscar conversaciones"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-200 rounded-full w-5 h-5 flex items-center justify-center border-none cursor-pointer hover:bg-stone-300"
                aria-label="Limpiar"
              >
                <X className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
              </button>
            )}
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-[10px] pb-3 space-y-[2px] scrollbar-hide" role="list" aria-label="Lista de conversaciones">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No se encontraron chats</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const lastMsg = getLastMessage(chat.id);
              const active = selectedChat?.id === chat.id;
              const unreadCount = chat.unread;

              return (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left border-none cursor-pointer",
                    active ? "shadow-lg" : "hover:bg-stone-50"
                  )}
                  style={{ background: active ? "var(--bg-sidebar)" : "transparent" }}
                  role="listitem"
                  aria-label={`Chat con ${chat.user}`}
                  aria-current={active ? "true" : undefined}
                >
                  <div className="relative flex-shrink-0">
                    <img src={chat.avatar} alt={`Avatar de ${chat.user}`} className="w-12 h-12 rounded-full object-cover" />
                    {chat.online && (
                      <span
                        className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-emerald-500 rounded-full"
                        style={{ border: active ? "2px solid var(--bg-sidebar)" : "2px solid white" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[13px]" style={{ color: active ? "white" : "var(--text-primary)" }}>
                        {chat.user}
                      </span>
                      <span className="text-[10px] font-semibold" style={{ color: active ? "rgba(255,255,255,0.4)" : "var(--text-muted)" }}>
                        {lastMsg?.time || chat.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-[2px]">
                      {lastMsg?.isMe && (
                        lastMsg.read
                          ? <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: active ? "rgba(110,231,183,0.7)" : "#10b981" }} />
                          : <Check className="w-3 h-3 flex-shrink-0" style={{ color: active ? "rgba(255,255,255,0.3)" : "var(--text-muted)" }} />
                      )}
                      <p className="text-[12px] truncate flex-1" style={{ color: active ? "rgba(255,255,255,0.4)" : "var(--text-secondary)" }}>
                        {lastMsg?.text || chat.lastMessage}
                      </p>
                      {unreadCount > 0 && !active && (
                        <span
                          className="ml-1 min-w-[20px] h-[20px] flex items-center justify-center text-[10px] font-black text-white rounded-full px-1 flex-shrink-0"
                          style={{ background: "#10b981" }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
         ACTIVE CHAT AREA
         ══════════════════════════════════════ */}
      <div
        className={cn(
          "flex-1 bg-white rounded-[24px] flex flex-col overflow-hidden",
          showMobileChat ? "flex" : "hidden md:flex"
        )}
        style={{ border: "1px solid var(--border)" }}
      >
        {!selectedChat ? (
          <EmptyChat />
        ) : (
          <>
            {/* Chat Header */}
            <div
              className="h-[72px] px-5 flex items-center justify-between flex-shrink-0"
              style={{ borderBottom: "1px solid #f5f5f4" }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowMobileChat(false);
                    setSelectedChat(null);
                    setShowInfoPanel(false);
                  }}
                  className="md:hidden p-1.5 bg-stone-100 rounded-xl border-none cursor-pointer hover:bg-stone-200 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setShowInfoPanel(!showInfoPanel)}
                >
                  <div className="relative">
                    <img
                      src={selectedChat.avatar}
                      className="w-[42px] h-[42px] rounded-full object-cover"
                      alt={`Avatar de ${selectedChat.user}`}
                    />
                    {selectedChat.online && (
                      <span
                        className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-emerald-500 rounded-full"
                        style={{ border: "2px solid white" }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>
                      {selectedChat.user}
                    </h3>
                    {isTyping ? (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Escribiendo...
                      </span>
                    ) : selectedChat.online ? (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-[5px] h-[5px] bg-emerald-500 rounded-full" />
                        En línea
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <Clock className="w-3 h-3" /> Hace 2h
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5">
                {[
                  { Icon: Phone, label: "Llamar" },
                  { Icon: Video, label: "Videollamada" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    className="p-2.5 rounded-xl transition-all bg-transparent border-none cursor-pointer hover:bg-stone-100"
                    style={{ color: "var(--text-muted)" }}
                    aria-label={label}
                    title={label}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </button>
                ))}
                <button
                  onClick={() => setShowInfoPanel(!showInfoPanel)}
                  className={cn(
                    "hidden md:flex p-2.5 rounded-xl transition-all border-none cursor-pointer",
                    showInfoPanel ? "bg-emerald-50 text-emerald-600" : "bg-transparent text-stone-400 hover:bg-stone-100"
                  )}
                  aria-label="Información del chat"
                  title="Info"
                >
                  <Info className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto p-5 flex flex-col gap-[10px] scrollbar-hide"
              style={{ background: "var(--bg-input)" }}
              role="log"
              aria-label="Mensajes"
              aria-live="polite"
            >
              {/* Chat start info */}
              <div className="text-center py-4 mb-2">
                <img
                  src={selectedChat.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  style={{ border: "3px solid rgba(16,185,129,0.15)" }}
                />
                <p className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {selectedChat.user}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Creador de upcycling · Miembro de ReLife
                </p>
                <p className="text-[10px] mt-2 px-3 py-1 rounded-full inline-block" style={{ background: "rgba(16,185,129,0.06)", color: "#10b981" }}>
                  Inicio de la conversación
                </p>
              </div>

              <DateSeparator text="Hoy" />

              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ animation: "msgAppear 0.3s ease" }}
                >
                  <MessageBubble
                    msg={msg}
                    onDelete={handleDeleteMessage}
                    onReact={handleReaction}
                    onReply={handleReply}
                  />
                </div>
              ))}

              {isTyping && <TypingIndicator userName={selectedChat.user} />}

              <div ref={messagesEndRef} />
            </div>

            {/* Reply bar */}
            <ReplyBar message={replyingTo} onCancel={() => setReplyingTo(null)} />

            {/* Message input */}
            <div
              className="p-[14px] bg-white flex-shrink-0 relative"
              style={{ borderTop: replyingTo ? "none" : "1px solid #f5f5f4" }}
            >
              {showEmoji && (
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmoji(false)}
                />
              )}

              <div
                className="flex items-center gap-2 rounded-[20px] p-[6px_8px_6px_6px]"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
              >
                {/* Attachment */}
                <button
                  type="button"
                  className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer bg-transparent hover:bg-stone-100 transition-colors flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Adjuntar archivo"
                  title="Adjuntar"
                >
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>

                {/* Emoji trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmoji(!showEmoji);
                  }}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors flex-shrink-0",
                    showEmoji ? "bg-emerald-100 text-emerald-600" : "bg-transparent hover:bg-stone-100"
                  )}
                  style={{ color: showEmoji ? undefined : "var(--text-muted)" }}
                  aria-label="Emojis"
                >
                  <Smile className="w-[18px] h-[18px]" />
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                    if (e.key === "Escape" && replyingTo) setReplyingTo(null);
                  }}
                  className="flex-1 bg-transparent outline-none text-sm font-medium min-w-0"
                  style={{ color: "var(--text-primary)", border: "none" }}
                  placeholder={replyingTo ? "Escribe tu respuesta..." : "Escribe un mensaje..."}
                  aria-label="Escribe un mensaje"
                />

                {/* Send / Mic */}
                {inputText.trim() ? (
                  <button
                    onClick={handleSendMessage}
                    className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer text-white flex-shrink-0 transition-all active:scale-90 hover:shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #14b8a6)",
                      boxShadow: "0 2px 10px rgba(16,185,129,0.3)",
                    }}
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-[15px] h-[15px]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0 bg-stone-200 text-stone-400 hover:bg-stone-300 transition-colors"
                    aria-label="Grabar audio (próximamente)"
                    title="Próximamente"
                  >
                    <Mic className="w-[15px] h-[15px]" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════
         CHAT INFO PANEL (desktop only)
         ══════════════════════════════════════ */}
      {showInfoPanel && selectedChat && (
        <div className="hidden md:block">
          <ChatInfoPanel
            chat={selectedChat}
            onClose={() => setShowInfoPanel(false)}
            messageCount={currentMessages.length}
          />
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSelect={(u) => toast?.info(`Chat con ${u.name} iniciado`)}
      />
    </div>
  );
};

export default MessagesView;