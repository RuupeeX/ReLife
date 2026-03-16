import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Search, Heart, Bookmark, ShoppingBag, X, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Tag, MapPin, MessageCircle, Share2, Check, PlusCircle, Package, Eye, Sofa, Lightbulb, Palette, Shirt, Flower2, LayoutDashboard, Star, ImagePlus, Trash2, Sparkles, Clock, Shield, Truck, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";

const categories = [
  { id: "all", label: "Todo", icon: LayoutDashboard },
  { id: "furniture", label: "Muebles", icon: Sofa },
  { id: "lighting", label: "Iluminación", icon: Lightbulb },
  { id: "decor", label: "Decoración", icon: Palette },
  { id: "fashion", label: "Moda", icon: Shirt },
  { id: "garden", label: "Jardín", icon: Flower2 },
];
const sortOptions = [
  { id: "recent", label: "Recientes" },
  { id: "price-low", label: "Precio ↑" },
  { id: "price-high", label: "Precio ↓" },
  { id: "popular", label: "Populares" },
];
const conditions = ["Todos", "Nuevo", "Restaurado", "Usado"];

// ── PRICE SLIDER ──
const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [v, setV] = useState(value[1]);
  useEffect(() => setV(value[1]), [value]);
  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold" style={{ color: "var(--text-muted)" }}>Precio máx.</span>
        <span className="text-[13px] font-black" style={{ color: "var(--text-primary)" }}>{v}€</span>
      </div>
      <input type="range" min={min} max={max} step={5} value={v} onChange={(e) => setV(Number(e.target.value))} onMouseUp={() => onChange([value[0], v])} onTouchEnd={() => onChange([value[0], v])} className="w-full accent-emerald-500" style={{ height: 4 }} aria-label="Precio máximo" />
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{min}€</span>
        <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{max}€</span>
      </div>
    </div>
  );
};

// ── FEATURED BANNER ──
const FeaturedBanner = ({ items, onItemClick }) => {
  const [cur, setCur] = useState(0);
  const feat = items.filter((i) => i.likes > 30 && !i.sold).slice(0, 3);
  useEffect(() => { if (feat.length <= 1) return; const t = setInterval(() => setCur((p) => (p + 1) % feat.length), 5000); return () => clearInterval(t); }, [feat.length]);
  if (!feat.length) return null;
  const item = feat[cur];
  return (
    <div className="relative rounded-[24px] overflow-hidden cursor-pointer group mb-6" style={{ height: 220 }} onClick={() => onItemClick(item)}>
      <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white mb-3" style={{ background: "rgba(16,185,129,0.7)", backdropFilter: "blur(8px)" }}><Sparkles className="w-3 h-3" /> Destacado</span>
          <h2 className="text-white text-2xl md:text-3xl font-black max-w-md leading-tight">{item.title}</h2>
          <p className="text-white/60 text-sm mt-2 max-w-sm line-clamp-1">{item.description}</p>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white text-3xl font-black">{item.price}€</span>
            <div className="flex items-center gap-2">
              <img src={item.sellerAvatar} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white/30" />
              <span className="text-white/70 text-sm font-medium">{item.seller}</span>
            </div>
          </div>
          {feat.length > 1 && <div className="flex gap-1.5">{feat.map((_, i) => <button key={i} onClick={(e) => { e.stopPropagation(); setCur(i); }} className="border-none cursor-pointer p-0 rounded-full transition-all" style={{ width: i === cur ? 20 : 6, height: 6, background: i === cur ? "white" : "rgba(255,255,255,0.35)" }} />)}</div>}
        </div>
      </div>
    </div>
  );
};

// ── PRODUCT CARD ──
const ProductCard = React.memo(({ item, onLike, onSave, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <div className="group bg-white rounded-[20px] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => onClick(item)} role="article" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick(item)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: h ? "scale(1.08)" : "scale(1)" }} loading="lazy" />
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)", opacity: h ? 1 : 0 }} />
        {item.sold && <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"><span className="px-4 py-2 bg-white rounded-xl text-sm font-black" style={{ color: "var(--text-primary)" }}>VENDIDO</span></div>}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide z-10" style={{ background: "rgba(16,185,129,0.8)", backdropFilter: "blur(8px)" }}>{item.condition}</div>
        <div className="absolute top-3 right-3 flex gap-1.5 z-10 transition-all duration-300" style={{ opacity: h ? 1 : 0, transform: h ? "translateY(0)" : "translateY(-6px)" }}>
          <button onClick={(e) => { e.stopPropagation(); onLike(item.id); }} className={cn("w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all", item.likedByUser ? "bg-rose-500 text-white" : "bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-rose-500 hover:text-white")} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}><Heart className={cn("w-[14px] h-[14px]", item.likedByUser && "fill-current")} /></button>
          <button onClick={(e) => { e.stopPropagation(); onSave(item.id); }} className={cn("w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all", item.saved ? "bg-amber-500 text-white" : "bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-amber-500 hover:text-white")} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}><Bookmark className={cn("w-[14px] h-[14px]", item.saved && "fill-current")} /></button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between transition-all duration-300" style={{ opacity: h ? 1 : 0 }}>
          <div className="flex items-center gap-2 text-white/80">
            <span className="flex items-center gap-1 text-[11px] font-semibold"><Heart className="w-3 h-3" /> {item.likes}</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold"><Eye className="w-3 h-3" /> {Math.floor(item.likes * 3.5)}</span>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl text-sm font-black text-white" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>{item.price}€</div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[14px] truncate group-hover:text-emerald-600 transition-colors" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
        <p className="text-[12px] mt-1 line-clamp-1" style={{ color: "var(--text-muted)" }}>{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2"><img src={item.sellerAvatar} alt="" className="w-6 h-6 rounded-full object-cover" /><span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>{item.seller}</span></div>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}><Clock className="w-3 h-3 inline mr-0.5" />Reciente</span>
        </div>
      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

// ── PRODUCT DETAIL ──
const ProductDetailModal = ({ item, allItems, onClose, onLike, onSave, onContact, onItemClick }) => {
  const [copied, setCopied] = useState(false);
  const [entering, setEntering] = useState(true);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setEntering(false))); document.body.style.overflow = "hidden"; const h = (e) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", h); return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", h); }; }, [onClose]);
  if (!item) return null;
  const related = allItems.filter((i) => i.id !== item.id && i.category === item.category && !i.sold).slice(0, 3);
  const handleShare = () => { const url = `${window.location.origin}/marketplace/${item.id}`; if (navigator.share) navigator.share({ title: item.title, url }); else { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } };
  const trust = [{ icon: Shield, label: "Vendedor verificado" }, { icon: Truck, label: "Envío nacional" }, { icon: DollarSign, label: "Pago seguro" }];

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)", opacity: entering ? 0 : 1 }} onClick={onClose} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10" style={{ opacity: entering ? 0 : 1, transform: entering ? "translateY(20px)" : "translateY(0)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }} onClick={(e) => e.stopPropagation()}>
          {/* Close button  */}
          <div className="sticky top-0 z-50 flex justify-end px-4 md:px-0 pt-4 md:pt-0 mb-4 mt-5 mr-5">
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-2xl flex items-center justify-center border-none cursor-pointer transition-all hover:scale-110"
              style={{ background: "#10b981", backdropFilter: "blur(12px)", color: "black", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-white rounded-[28px] overflow-hidden" style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[55%] relative" style={{ minHeight: 350 }}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" style={{ minHeight: 350 }} />
                {item.sold && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="px-8 py-4 bg-white rounded-2xl text-xl font-black">VENDIDO</span></div>}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white uppercase" style={{ background: "rgba(16,185,129,0.8)" }}>{item.condition}</div>
              </div>
              <div className="w-full md:w-[45%] flex flex-col">
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{categories.find((c) => c.id === item.category)?.label}</span>
                  </div>
                  <h2 className="text-2xl font-black mt-1 mb-3" style={{ color: "var(--text-primary)" }}>{item.title}</h2>
                  <p className="text-[36px] font-black mb-5" style={{ color: "#10b981" }}>{item.price}€</p>
                  <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                  <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
                    <img src={item.sellerAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{item.seller}</p>
                      <div className="flex items-center gap-1 mt-0.5">{[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5" style={{ color: s <= 4 ? "#f59e0b" : "var(--text-faint)" }} fill={s <= 4 ? "#f59e0b" : "none"} />)}<span className="text-[12px] ml-1" style={{ color: "var(--text-muted)" }}>4.0 · 12 ventas</span></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">{trust.map((b) => <span key={b.label} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium" style={{ background: "var(--bg-input)", color: "var(--text-secondary)" }}><b.icon className="w-3.5 h-3.5 text-emerald-500" /> {b.label}</span>)}</div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[{ icon: Tag, t: item.condition }, { icon: MapPin, t: "España" }, { icon: Eye, t: `${Math.floor(item.likes * 3.5)} visitas` }, { icon: Heart, t: `${item.likes} likes` }].map((m, i) => <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "var(--bg-input)", color: "var(--text-secondary)" }}><m.icon className="w-3.5 h-3.5" /> {m.t}</span>)}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button onClick={() => onLike(item.id)} className={cn("flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all", item.likedByUser ? "bg-rose-50 text-rose-500" : "hover:bg-stone-50")} style={!item.likedByUser ? { background: "var(--bg-input)", color: "var(--text-secondary)" } : {}}><Heart className={cn("w-4 h-4", item.likedByUser && "fill-current")} /> {item.likedByUser ? "Te gusta" : "Me gusta"}</button>
                    <button onClick={handleShare} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all hover:bg-stone-50" style={{ background: "var(--bg-input)", color: "var(--text-secondary)" }}>{copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />} {copied ? "Copiado" : "Compartir"}</button>
                    <button onClick={() => onSave(item.id)} className={cn("flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all", item.saved ? "bg-amber-50 text-amber-600" : "hover:bg-stone-50")} style={!item.saved ? { background: "var(--bg-input)", color: "var(--text-secondary)" } : {}}><Bookmark className={cn("w-4 h-4", item.saved && "fill-current")} /> {item.saved ? "Guardado" : "Guardar"}</button>
                  </div>
                </div>
                {!item.sold && (
                  <div className="p-6 md:px-8" style={{ borderTop: "1px solid var(--border)" }}>
                    <button onClick={() => { onContact(item); onClose(); }} className="w-full py-4 rounded-2xl font-bold text-[15px] text-white border-none cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}><MessageCircle className="w-5 h-5" /> Contactar vendedor</button>
                    <p className="text-center text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>Respuesta media: 2 horas</p>
                  </div>
                )}
              </div>
            </div>
            {related.length > 0 && (
              <div className="p-6 md:p-8" style={{ borderTop: "1px solid var(--border)" }}>
                <h3 className="font-bold text-[15px] mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Sparkles className="w-4 h-4 text-emerald-500" /> Productos similares</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{related.map((r) => <div key={r.id} onClick={() => onItemClick(r)} className="flex gap-3 p-3 rounded-2xl cursor-pointer hover:bg-stone-50 transition-colors" style={{ border: "1px solid var(--border)" }}><img src={r.image} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" /><div className="flex-1 min-w-0"><p className="font-bold text-[13px] truncate" style={{ color: "var(--text-primary)" }}>{r.title}</p><p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{r.seller}</p><p className="text-[16px] font-black mt-1" style={{ color: "#10b981" }}>{r.price}€</p></div></div>)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SELL FORM ──
const SellFormModal = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: "", image: "", category: "decor", condition: "Nuevo" });
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const fileRef = useRef(null);
  if (!isOpen) return null;
  const validate = () => { const e = {}; if (!form.title.trim()) e.title = "Obligatorio"; if (!form.price || Number(form.price) <= 0) e.price = "Precio obligatorio"; if (!form.description.trim() || form.description.length < 10) e.description = "Mín. 10 caracteres"; return e; };
  const handleFile = (f) => { if (!f?.type.startsWith("image/")) return; const r = new FileReader(); r.onload = (e) => { setPreview(e.target.result); setForm({ ...form, image: "" }); }; r.readAsDataURL(f); };
  const img = preview || form.image;
  const handleSubmit = (ev) => { ev.preventDefault(); const e = validate(); setErrors(e); if (Object.keys(e).length) { setStep(1); return; } onSubmit({ ...form, price: Number(form.price), seller: user?.name || "Tú", sellerAvatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Tu", image: img || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&fit=crop" }); setForm({ title: "", description: "", price: "", image: "", category: "decor", condition: "Nuevo" }); setPreview(""); setStep(1); onClose(); };
  const inp = "w-full p-3.5 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-400 outline-none transition-all text-sm font-medium";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Vender producto</h2><p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Paso {step} de 2</p></div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center border-none cursor-pointer"><X className="w-[18px] h-[18px]" /></button>
        </div>
        <div className="px-6 pt-5 flex gap-2">{[1, 2].map((s) => <div key={s} className="flex-1 h-1 rounded-full" style={{ background: s <= step ? "linear-gradient(135deg, #10b981, #14b8a6)" : "#e7e5e4" }} />)}</div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 && <>
            {!img ? (
              <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} className="cursor-pointer rounded-2xl p-10 text-center hover:bg-emerald-50 transition-all" style={{ border: "2px dashed #d6d3d1" }}>
                <ImagePlus className="w-10 h-10 mx-auto mb-3" style={{ color: "#a8a29e" }} /><p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Arrastra o selecciona imagen</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>JPG, PNG, WebP</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden"><img src={img} alt="" className="w-full h-48 object-cover" /><button type="button" onClick={() => { setPreview(""); setForm({ ...form, image: "" }); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-rose-500 border-none cursor-pointer shadow-lg"><Trash2 className="w-4 h-4" /></button></div>
            )}
            {!preview && <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="o pega URL de imagen" type="url" className={inp} />}
            <div><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nombre del producto" className={cn(inp, errors.title && "!border-rose-400")} />{errors.title && <p className="text-[11px] text-rose-500 mt-1 ml-1">{errors.title}</p>}</div>
            <div><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción detallada..." rows={3} className={cn(inp, "resize-none", errors.description && "!border-rose-400")} /><div className="flex justify-between mt-1 mx-1">{errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}<span className="text-[11px] ml-auto" style={{ color: "var(--text-faint)" }}>{form.description.length}/500</span></div></div>
            <button type="button" onClick={() => { const e = validate(); setErrors(e); if (!e.title && !e.description) setStep(2); }} className="w-full py-3.5 rounded-xl font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>Siguiente <ChevronRight className="w-4 h-4" /></button>
          </>}
          {step === 2 && <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[11px] font-bold uppercase ml-1 mb-1.5 block" style={{ color: "var(--text-muted)" }}>Precio</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: "var(--text-muted)" }}>€</span><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" type="number" min="0" step="0.01" className={cn(inp, "pl-8", errors.price && "!border-rose-400")} /></div>{errors.price && <p className="text-[11px] text-rose-500 mt-1 ml-1">{errors.price}</p>}</div>
              <div><label className="text-[11px] font-bold uppercase ml-1 mb-1.5 block" style={{ color: "var(--text-muted)" }}>Estado</label><select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className={cn(inp, "cursor-pointer appearance-none")}><option value="Nuevo">Nuevo</option><option value="Restaurado">Restaurado</option><option value="Usado">Usado</option></select></div>
            </div>
            <div><label className="text-[11px] font-bold uppercase ml-1 mb-1.5 block" style={{ color: "var(--text-muted)" }}>Categoría</label><div className="grid grid-cols-3 gap-2">{categories.filter((c) => c.id !== "all").map((c) => { const I = c.icon; const a = form.category === c.id; return <button key={c.id} type="button" onClick={() => setForm({ ...form, category: c.id })} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl text-[11px] font-bold border-none cursor-pointer transition-all", a ? "text-emerald-700" : "text-stone-500")} style={{ background: a ? "rgba(16,185,129,0.1)" : "var(--bg-input)", border: a ? "2px solid #10b981" : "2px solid transparent" }}><I className="w-5 h-5" /> {c.label}</button>; })}</div></div>
            <div className="rounded-2xl p-4" style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}><p className="text-[11px] font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Vista previa</p><div className="flex gap-3">{img && <img src={img} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}<div className="flex-1 min-w-0"><p className="font-bold text-[14px] truncate" style={{ color: "var(--text-primary)" }}>{form.title || "Producto"}</p><p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{form.description || "..."}</p><p className="text-[18px] font-black mt-1" style={{ color: "#10b981" }}>{form.price ? `${form.price}€` : "0€"}</p></div></div></div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl font-bold border-none cursor-pointer bg-stone-100 hover:bg-stone-200 flex items-center justify-center gap-2" style={{ color: "var(--text-secondary)" }}><ChevronLeft className="w-4 h-4" /> Atrás</button>
              <button type="submit" className="flex-[2] py-3.5 rounded-xl font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}><Package className="w-5 h-5" /> Publicar</button>
            </div>
          </>}
        </form>
      </div>
    </div>
  );
};

// ── MAIN VIEW ──
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

  const filteredItems = useMemo(() => {
    let src = activeTab === "saved" ? marketplaceItems.filter((i) => i.saved) : marketplaceItems;
    let res = src.filter((i) => {
      const cat = selectedCategory === "all" || i.category === selectedCategory;
      const q = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.seller.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase());
      const cond = conditionFilter === "Todos" || i.condition === conditionFilter;
      const price = i.price >= priceRange[0] && i.price <= priceRange[1];
      return cat && q && cond && price;
    });
    switch (sortBy) { case "price-low": res = [...res].sort((a, b) => a.price - b.price); break; case "price-high": res = [...res].sort((a, b) => b.price - a.price); break; case "popular": res = [...res].sort((a, b) => b.likes - a.likes); break; default: res = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
    return res;
  }, [marketplaceItems, selectedCategory, searchQuery, conditionFilter, sortBy, priceRange, activeTab]);

  const savedCount = useMemo(() => marketplaceItems.filter((i) => i.saved).length, [marketplaceItems]);
  const handleContact = useCallback((item) => { alert(`Contactar con ${item.seller} sobre "${item.title}"`); }, []);
  const handleItemClick = useCallback((item) => setSelectedItem(item), []);

  return (
    <div className="flex-1 h-full overflow-y-auto" style={{ background: "var(--bg-primary)" }}>
      <div className="sticky top-0 z-30" style={{ background: "rgba(250,250,249,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-black flex items-center gap-[10px]" style={{ color: "var(--text-primary)" }}><span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" /> Marketplace</h1>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>{marketplaceItems.filter((i) => !i.sold).length} productos disponibles</p>
            </div>
            <button onClick={() => setShowSellForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}><PlusCircle className="w-4 h-4" /> Vender</button>
          </div>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex bg-white rounded-xl p-1" style={{ border: "1px solid var(--border)" }}>
              <button onClick={() => setActiveTab("browse")} className={cn("px-4 py-2 rounded-lg text-[13px] font-bold transition-all border-none cursor-pointer flex items-center gap-2", activeTab === "browse" ? "bg-stone-900 text-white" : "bg-transparent text-stone-500")}><ShoppingBag className="w-4 h-4" /> Explorar</button>
              <button onClick={() => setActiveTab("saved")} className={cn("px-4 py-2 rounded-lg text-[13px] font-bold transition-all border-none cursor-pointer flex items-center gap-2", activeTab === "saved" ? "bg-stone-900 text-white" : "bg-transparent text-stone-500")}><Bookmark className="w-4 h-4" /> Guardados {savedCount > 0 && <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", activeTab === "saved" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700")}>{savedCount}</span>}</button>
            </div>
            <div className="flex-1" />
            <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-xl gap-2 w-72" style={{ border: "1px solid var(--border)" }}>
              <Search className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-[13px] w-full font-medium border-none" style={{ color: "var(--text-secondary)" }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="bg-transparent border-none cursor-pointer p-0" style={{ color: "var(--text-muted)" }}><X size={14} /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all", showFilters ? "bg-emerald-50 text-emerald-700" : "bg-white text-stone-500")} style={{ border: "1px solid var(--border)" }}><SlidersHorizontal className="w-3.5 h-3.5" /> Filtros</button>
          </div>
          <div className="md:hidden mt-3 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} /><input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white outline-none text-sm font-medium" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>

          {showFilters && (
            <div className="mt-4 p-5 bg-white rounded-2xl space-y-4" style={{ border: "1px solid var(--border)" }}>
              <div><p className="text-[11px] font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Categoría</p><div className="flex gap-2 flex-wrap">{categories.map((c) => { const I = c.icon; return <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer", selectedCategory === c.id ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100")}><I className="w-3.5 h-3.5" /> {c.label}</button>; })}</div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><p className="text-[11px] font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Estado</p><div className="flex gap-2 flex-wrap">{conditions.map((c) => <button key={c} onClick={() => setConditionFilter(c)} className={cn("px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer", conditionFilter === c ? "bg-emerald-500 text-white" : "bg-stone-50 text-stone-500")}>{c}</button>)}</div></div>
                <PriceRangeSlider min={0} max={500} value={priceRange} onChange={setPriceRange} />
                <div><p className="text-[11px] font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Ordenar</p><div className="flex gap-2 flex-wrap">{sortOptions.map((o) => <button key={o.id} onClick={() => setSortBy(o.id)} className={cn("px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer", sortBy === o.id ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-500")}>{o.label}</button>)}</div></div>
              </div>
              {(selectedCategory !== "all" || conditionFilter !== "Todos" || priceRange[1] < 500) && (
                <div className="flex items-center gap-2 pt-2 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Activos:</span>
                  {selectedCategory !== "all" && <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">{categories.find((c) => c.id === selectedCategory)?.label}<button onClick={() => setSelectedCategory("all")} className="bg-transparent border-none cursor-pointer p-0 text-emerald-400"><X size={10} /></button></span>}
                  {conditionFilter !== "Todos" && <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">{conditionFilter}<button onClick={() => setConditionFilter("Todos")} className="bg-transparent border-none cursor-pointer p-0 text-emerald-400"><X size={10} /></button></span>}
                  {priceRange[1] < 500 && <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">≤{priceRange[1]}€<button onClick={() => setPriceRange([0, 500])} className="bg-transparent border-none cursor-pointer p-0 text-emerald-400"><X size={10} /></button></span>}
                  <button onClick={() => { setSelectedCategory("all"); setConditionFilter("Todos"); setPriceRange([0, 500]); setSortBy("recent"); }} className="text-[11px] font-bold text-rose-500 bg-transparent border-none cursor-pointer ml-auto">Limpiar</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-24">
        {activeTab === "browse" && !searchQuery && selectedCategory === "all" && <FeaturedBanner items={marketplaceItems} onItemClick={handleItemClick} />}
        <div className="flex items-center justify-between mb-5"><p className="text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>{filteredItems.length} producto{filteredItems.length !== 1 ? "s" : ""}{activeTab === "saved" ? " guardado" + (filteredItems.length !== 1 ? "s" : "") : ""}{searchQuery && <> para "<strong style={{ color: "var(--text-secondary)" }}>{searchQuery}</strong>"</>}</p></div>
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-[24px] p-16 text-center" style={{ border: "1px solid var(--border)" }}>
            {activeTab === "saved" ? <><Bookmark className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--text-faint)" }} /><h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sin guardados</h3><p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Guarda productos que te interesen</p><button onClick={() => setActiveTab("browse")} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>Explorar</button></> : <><ShoppingBag className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--text-faint)" }} /><h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sin resultados</h3><p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Prueba con otros filtros</p><button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setConditionFilter("Todos"); setPriceRange([0, 500]); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>Ver todo</button></>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filteredItems.map((item) => <ProductCard key={item.id} item={item} onLike={toggleMarketplaceLike} onSave={toggleMarketplaceSave} onClick={handleItemClick} />)}</div>
        )}
      </div>

      {selectedItem && <ProductDetailModal item={marketplaceItems.find((i) => i.id === selectedItem.id) || selectedItem} allItems={marketplaceItems} onClose={() => setSelectedItem(null)} onLike={toggleMarketplaceLike} onSave={toggleMarketplaceSave} onContact={handleContact} onItemClick={handleItemClick} />}
      <SellFormModal isOpen={showSellForm} onClose={() => setShowSellForm(false)} onSubmit={addMarketplaceItem} />
    </div>
  );
};

export default MarketplaceView;