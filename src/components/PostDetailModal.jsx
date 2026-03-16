import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Smile,
  Send,
  Trash2,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useData } from "../context/DataContext";

const EMOJIS = [
  "😊", "😂", "❤️", "👍", "🔥", "✨", "🎉", "🙌",
  "💚", "♻️", "🌱", "🌍", "💡", "🎨", "👏", "😍",
  "🤩", "💪", "🫶", "👀",
];

const EmojiPicker = ({ onSelect, onClose }) => (
  <div
    className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl p-3 z-30"
    style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="grid grid-cols-5 gap-1">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => { onSelect(emoji); onClose(); }}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors border-none cursor-pointer bg-transparent text-lg"
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
);

const CommentItem = React.memo(({ comment, isOwn, onDelete, onReply }) => {
  const [liked, setLiked] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="flex gap-3 group" onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)}>
      {comment.avatar ? (
        <img src={comment.avatar} alt="" className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white">
          {comment.user?.[0]?.toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl px-4 py-3" style={{ background: "var(--bg-input)" }}>
          <span className="font-bold text-[13px] hover:text-emerald-600 cursor-pointer transition-colors" style={{ color: "var(--text-primary)" }}>
            {comment.user}
          </span>
          <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {comment.text}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-1.5 ml-2">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{comment.time || "Ahora"}</span>
          <button onClick={() => setLiked(!liked)} className="flex items-center gap-1 text-[11px] font-semibold transition-colors bg-transparent border-none cursor-pointer p-0" style={{ color: liked ? "#ef4444" : "var(--text-muted)" }}>
            <Heart className={cn("w-3 h-3", liked && "fill-current")} />{liked ? "1" : ""}
          </button>
          <button onClick={() => onReply(comment.user)} className="text-[11px] font-semibold hover:text-emerald-600 transition-colors bg-transparent border-none cursor-pointer" style={{ color: "var(--text-muted)" }}>
            Responder
          </button>
          {isOwn && showDelete && (
            <button onClick={() => onDelete(comment.id)} className="text-[11px] font-semibold text-rose-400 hover:text-rose-600 transition-colors bg-transparent border-none cursor-pointer p-0">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
CommentItem.displayName = "CommentItem";

const PostDetailModal = ({ isOpen, onClose, post, currentUser, onLike }) => {
  const [commentText, setCommentText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [doubleTapAnim, setDoubleTapAnim] = useState(false);
  const [copied, setCopied] = useState(false);
  const [entering, setEntering] = useState(true);
  const { addComment, getPostById, toggleSave, deleteComment } = useData();
  const inputRef = useRef(null);
  const commentsRef = useRef(null);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (isOpen) { setEntering(true); requestAnimationFrame(() => requestAnimationFrame(() => setEntering(false))); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!showEmoji) return;
    const c = () => setShowEmoji(false);
    document.addEventListener("click", c);
    return () => document.removeEventListener("click", c);
  }, [showEmoji]);

  useEffect(() => {
    const id = "postdetail-anims";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes dtHeart { 0%{transform:scale(0);opacity:0} 15%{transform:scale(1.3);opacity:1} 30%{transform:scale(.95)} 45%{transform:scale(1.1)} 80%{transform:scale(1);opacity:1} 100%{transform:scale(1);opacity:0} }
      @keyframes mobileSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
    `;
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, []);

  if (!isOpen || !post) return null;
  const currentPost = getPostById(post.id) || post;
  const comments = currentPost.comments || [];

  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!currentPost.likedByUser) onLike(currentPost.id);
      setDoubleTapAnim(true);
      setTimeout(() => setDoubleTapAnim(false), 900);
      lastTapRef.current = 0;
    } else { lastTapRef.current = now; }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, { user: currentUser.name, text: commentText.trim(), avatar: currentUser.avatar });
    setCommentText(""); setShowEmoji(false);
    setTimeout(() => { commentsRef.current?.scrollTo({ top: commentsRef.current.scrollHeight, behavior: "smooth" }); }, 100);
  };

  const handleReply = (u) => { setCommentText(`@${u} `); inputRef.current?.focus(); };
  const handleDeleteComment = (id) => { if (deleteComment) deleteComment(post.id, id); };
  const handleShare = () => {
    const url = `${window.location.origin}/post/${currentPost.id}`;
    if (navigator.share) navigator.share({ title: currentPost.title, url });
    else { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };
  const handleSave = () => { if (toggleSave) toggleSave(currentPost.id); };
  const handleEmojiSelect = (e) => { setCommentText((p) => p + e); inputRef.current?.focus(); };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={`Post de ${currentPost.author}: ${currentPost.title}`}>
      <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", opacity: entering ? 0 : 1 }} onClick={onClose} />

      {/* ═══ DESKTOP ═══ */}
      <div className="hidden md:flex h-full w-full relative z-10">
        <button onClick={onClose} className="absolute top-5 right-5 z-50 w-11 h-11 rounded-2xl flex items-center justify-center border-none cursor-pointer transition-all hover:scale-110 hover:bg-white/20" style={{ background: "#10b981", backdropFilter: "blur(12px)", color: "black", border: "1px solid rgba(255,255,255,0.15)" }} aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={handleImageTap}
          style={{ opacity: entering ? 0 : 1, transform: entering ? "scale(0.95)" : "scale(1)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="absolute inset-0" style={{ backgroundImage: `url(${currentPost.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(60px) brightness(0.3)", transform: "scale(1.2)" }} />
          <img src={currentPost.image} alt={currentPost.title} className="relative z-10 max-w-[85%] max-h-[85vh] object-contain rounded-lg" style={{ boxShadow: "0 20px 80px rgba(0,0,0,0.5)" }} />
          {doubleTapAnim && <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"><Heart size={90} fill="white" color="white" style={{ filter: "drop-shadow(0 4px 30px rgba(239,68,68,0.6))", animation: "dtHeart 0.9s ease forwards" }} /></div>}
          <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 flex-wrap">
            {currentPost.category && <span className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wide" style={{ background: "rgba(16,185,129,0.75)", backdropFilter: "blur(12px)" }}>{currentPost.category}</span>}
            {currentPost.tags?.slice(0, 3).map((t, i) => <span key={i} className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white/80" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>#{t}</span>)}
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 bg-white flex flex-col h-full" style={{ borderLeft: "1px solid var(--border)", transform: entering ? "translateX(40px)" : "translateX(0)", opacity: entering ? 0 : 1, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s" }} onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 flex items-center gap-3.5 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400">
              <img src={currentPost.avatar} alt="" className="w-11 h-11 rounded-full border-[2.5px] border-white object-cover" />
            </div>
            <div className="flex-1"><h3 className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{currentPost.author}</h3><p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Creador verificado</p></div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors hover:bg-stone-200 flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-[18px] h-[18px]" style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>

          <div ref={commentsRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-hide">
            <div><h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{currentPost.title}</h2>{currentPost.description && currentPost.description !== currentPost.title && <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{currentPost.description}</p>}<p className="text-[12px] mt-2 font-medium" style={{ color: "var(--text-muted)" }}>Hace 2 horas</p></div>
            <div className="flex items-center gap-3"><div className="flex-1 h-px" style={{ background: "var(--border)" }} /><span className="text-[10px] font-bold uppercase px-2" style={{ color: "var(--text-faint)", letterSpacing: 1.5 }}>{comments.length} {comments.length === 1 ? "comentario" : "comentarios"}</span><div className="flex-1 h-px" style={{ background: "var(--border)" }} /></div>
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center"><div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--bg-input)" }}><MessageCircle className="w-6 h-6" style={{ color: "var(--text-faint)" }} /></div><p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Sin comentarios aún</p><p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>Sé el primero en opinar</p></div>
            ) : comments.map((c) => <CommentItem key={c.id} comment={c} isOwn={c.user === currentUser?.name} onDelete={handleDeleteComment} onReply={handleReply} />)}
          </div>

          <div className="flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button onClick={() => onLike(currentPost.id)} className="p-2 rounded-xl hover:bg-stone-50 transition-all active:scale-90 bg-transparent border-none cursor-pointer" aria-label="Like"><Heart className={cn("w-[22px] h-[22px]", currentPost.likedByUser ? "fill-rose-500 text-rose-500" : "text-stone-700")} /></button>
                <button onClick={() => inputRef.current?.focus()} className="p-2 rounded-xl hover:bg-stone-50 transition-all bg-transparent border-none cursor-pointer text-stone-700" aria-label="Comentar"><MessageCircle className="w-[22px] h-[22px]" /></button>
                <button onClick={handleShare} className="p-2 rounded-xl hover:bg-stone-50 transition-all bg-transparent border-none cursor-pointer" aria-label="Compartir">{copied ? <Check className="w-[22px] h-[22px] text-emerald-500" /> : <Share2 className="w-[22px] h-[22px] text-stone-700" />}</button>
              </div>
              <button onClick={handleSave} className="p-2 rounded-xl hover:bg-stone-50 transition-all bg-transparent border-none cursor-pointer" aria-label="Guardar"><Bookmark className={cn("w-[20px] h-[20px]", currentPost.saved ? "fill-amber-500 text-amber-500" : "text-stone-700")} /></button>
            </div>
            <div className="px-6 pb-2"><p className="font-bold text-[14px]" style={{ color: "var(--text-primary)" }}>{currentPost.likes?.toLocaleString() || 0} Me gusta</p></div>
            <form onSubmit={handleAddComment} className="flex items-center gap-2 px-5 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
              <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => setShowEmoji(!showEmoji)} className={cn("p-1.5 rounded-full transition-colors border-none cursor-pointer", showEmoji ? "bg-emerald-100 text-emerald-600" : "bg-transparent hover:bg-stone-100")} style={{ color: showEmoji ? undefined : "var(--text-muted)" }} aria-label="Emojis"><Smile className="w-5 h-5" /></button>
                {showEmoji && <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />}
              </div>
              <input ref={inputRef} type="text" placeholder="Añade un comentario..." className="flex-1 text-[14px] outline-none bg-transparent min-w-0 font-medium" style={{ color: "var(--text-primary)", border: "none" }} value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              <button type="submit" disabled={!commentText.trim()} className={cn("p-2 rounded-xl transition-all bg-transparent border-none cursor-pointer", commentText.trim() ? "text-emerald-500 hover:bg-emerald-50" : "text-stone-300 cursor-default")}><Send className="w-[18px] h-[18px]" /></button>
            </form>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE ═══ */}
      <div className="md:hidden flex flex-col h-full w-full relative z-10">
        <div className="flex-shrink-0 relative flex items-center justify-center" style={{ height: "45vh" }} onClick={handleImageTap}>
          <div className="absolute inset-0" style={{ backgroundImage: `url(${currentPost.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(40px) brightness(0.3)", transform: "scale(1.3)" }} />
          <img src={currentPost.image} alt={currentPost.title} className="relative z-10 max-w-[90%] max-h-[90%] object-contain rounded-lg" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }} />
          <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl flex items-center justify-center border-none cursor-pointer" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Cerrar"><X className="w-5 h-5" /></button>
          {doubleTapAnim && <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"><Heart size={70} fill="white" color="white" style={{ filter: "drop-shadow(0 4px 20px rgba(239,68,68,0.5))", animation: "dtHeart 0.9s ease forwards" }} /></div>}
          <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">{currentPost.category && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase" style={{ background: "rgba(16,185,129,0.7)", backdropFilter: "blur(8px)" }}>{currentPost.category}</span>}</div>
        </div>

        <div className="flex-1 bg-white flex flex-col overflow-hidden" style={{ borderRadius: "24px 24px 0 0", marginTop: -16, position: "relative", zIndex: 20, animation: "mobileSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)" }} onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0"><div className="w-10 h-1 rounded-full bg-stone-200" /></div>
          <div className="px-5 pb-3 flex items-center gap-3 flex-shrink-0">
            <img src={currentPost.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0"><h3 className="font-bold text-[14px] truncate" style={{ color: "var(--text-primary)" }}>{currentPost.title}</h3><p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{currentPost.author} · Hace 2h</p></div>
          </div>
          <div className="px-5 pb-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-5">
              <button onClick={() => onLike(currentPost.id)} className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"><Heart className={cn("w-5 h-5", currentPost.likedByUser ? "fill-rose-500 text-rose-500" : "text-stone-600")} /><span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{currentPost.likes || 0}</span></button>
              <button onClick={() => inputRef.current?.focus()} className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 text-stone-600"><MessageCircle className="w-5 h-5" /><span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{comments.length}</span></button>
              <button onClick={handleShare} className="bg-transparent border-none cursor-pointer p-0">{copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5 text-stone-600" />}</button>
            </div>
            <button onClick={handleSave} className="bg-transparent border-none cursor-pointer p-0"><Bookmark className={cn("w-5 h-5", currentPost.saved ? "fill-amber-500 text-amber-500" : "text-stone-600")} /></button>
          </div>
          <div ref={commentsRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
            {comments.length === 0 ? <div className="text-center py-6"><p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Sin comentarios aún</p></div> : comments.map((c) => <CommentItem key={c.id} comment={c} isOwn={c.user === currentUser?.name} onDelete={handleDeleteComment} onReply={handleReply} />)}
          </div>
          <form onSubmit={handleAddComment} className="flex items-center gap-2 px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
            <div className="flex-1 flex items-center gap-1 px-4 py-2.5 rounded-full" style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
              <input ref={inputRef} type="text" placeholder="Comentar..." className="flex-1 text-[14px] outline-none bg-transparent min-w-0 font-medium" style={{ color: "var(--text-primary)", border: "none" }} value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            </div>
            <button type="submit" disabled={!commentText.trim()} className={cn("w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all flex-shrink-0", commentText.trim() ? "text-white" : "text-stone-300 cursor-default")} style={{ background: commentText.trim() ? "linear-gradient(135deg,#10b981,#14b8a6)" : "var(--bg-input)" }}><Send className="w-4 h-4" /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;