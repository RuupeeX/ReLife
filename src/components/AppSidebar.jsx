import React, { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import LogoImg from "../assets/ReLife_Icon3.png";
import {
  Grid,
  Compass,
  Bell,
  Mail,
  BarChart2,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  X,
  User,
  ShoppingBag,
  ChevronRight,
  Leaf,
} from "lucide-react";

const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 500);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative w-full flex items-center gap-3 rounded-2xl text-[13px] font-semibold transition-all duration-300 border-none cursor-pointer overflow-hidden group px-4 py-[11px]",
        isActive
          ? "text-white"
          : "bg-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
      )}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(20,184,166,0.15) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            backdropFilter: "blur(8px)",
          }}
        />
      )}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{
            background: "linear-gradient(to bottom, #34d399, #14b8a6)",
            boxShadow: "0 0 12px rgba(52,211,153,0.6)",
          }}
        />
      )}
      {ripple && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, transparent 70%)",
            animation: "navRipple 0.5s ease-out forwards",
          }}
        />
      )}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center transition-all duration-300",
          isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
        )}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
        {isActive && (
          <div
            className="absolute inset-0 blur-lg pointer-events-none"
            style={{ background: "rgba(52,211,153,0.3)" }}
          />
        )}
      </div>
      <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
      {item.badge > 0 && (
        <span
          className={cn(
            "relative z-10 text-[10px] font-extrabold rounded-full transition-all px-[7px] py-[2px]",
            isActive ? "bg-emerald-400 text-stone-900" : "bg-rose-500 text-white"
          )}
          style={!isActive ? { boxShadow: "0 0 8px rgba(244,63,94,0.4)" } : {}}
        >
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
      {isActive && <ChevronRight className="relative z-10 w-3.5 h-3.5 text-emerald-400/60" />}
    </button>
  );
};

const LogoIcon = ({ size = "desktop" }) => {
  const [imgError, setImgError] = useState(false);
  const isDesktop = size === "desktop";

  // Fallback si la imagen no carga
  if (imgError) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center flex-shrink-0 overflow-hidden",
            isDesktop ? "w-10 h-10 rounded-[13px]" : "w-9 h-9 rounded-[11px]"
          )}
          style={{
            background: "linear-gradient(145deg, #10b981, #0d9488)",
            boxShadow: isDesktop
              ? "0 4px 20px rgba(16,185,129,0.3)"
              : "0 3px 12px rgba(16,185,129,0.25)",
          }}
        >
          <Leaf className={cn("text-white", isDesktop ? "w-5 h-5" : "w-4 h-4")} />
        </div>
        <div className="flex items-baseline gap-1.5">
          {isDesktop ? (
            <>
              <span className="text-[22px] font-black text-white tracking-tight">Re</span>
              <span className="text-[22px] font-black tracking-tight" style={{ color: "#34d399" }}>Life</span>
            </>
          ) : (
            <>
              <span className="text-lg font-black text-stone-800">Re</span>
              <span className="text-lg font-black text-emerald-600">Life</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Solo la imagen — ocupa bien el espacio
  return (
    <img
      src={LogoImg}
      alt="ReLife"
      className={cn("object-contain flex-shrink-0", isDesktop && "ml-8 mb-3")}
      style={{
        height: isDesktop ? 65 : 60,
        width: "auto",
        maxWidth: isDesktop ? 200 : 150,
      }}
      onError={() => setImgError(true)}
    />
  );
};

const AppSidebar = ({ activeTab, setActiveTab, user, logout, notifications = [], onCreatePost }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [createHovered, setCreateHovered] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isMobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const id = "sidebar-anims";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes navRipple { 0% { opacity: 1; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.2); } }
      @keyframes slideInDrawer { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
      @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.15); } 50% { box-shadow: 0 0 30px rgba(16,185,129,0.3); } }
      @keyframes floatLeaf { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.04; } 50% { transform: translateY(-8px) rotate(10deg); opacity: 0.08; } }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  const mainMenuItems = [
    { id: "Feed", label: "Inicio", icon: Grid },
    { id: "Explore", label: "Explorar", icon: Compass },
    { id: "Marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "Notifications", label: "Notificaciones", icon: Bell, badge: unreadCount },
    { id: "Messages", label: "Mensajes", icon: Mail, badge: 2 },
  ];

  const utilMenuItems = [
    { id: "Profile", label: "Perfil", icon: User },
    { id: "Stats", label: "Estadísticas", icon: BarChart2 },
    { id: "Settings", label: "Ajustes", icon: Settings },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={cn("flex flex-col h-full relative", isMobile && "pb-20")}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
        />
        <Leaf
          className="absolute top-[30%] right-4 w-6 h-6"
          style={{ color: "rgba(255,255,255,0.03)", animation: "floatLeaf 6s ease-in-out infinite" }}
        />
      </div>

      {/* Logo + Subtítulo — solo en desktop, en mobile lo muestra el drawer header */}
      {!isMobile && (
        <div className="relative z-10 flex-shrink-0 pt-5 pb-2 px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <LogoIcon size="desktop" />
          <p
            className="text-[9px] font-semibold uppercase mt-1 ml-1 mb-1"
            style={{ color: "rgba(255,255,255,0.12)", letterSpacing: "2px" }}
          >
            Reciclaje creativo
          </p>
        </div>
      )}

      {/* Botón Crear Post */}
      <div className="relative z-10 flex-shrink-0 p-3">
        <button
          onClick={() => {
            onCreatePost();
            setIsMobileOpen(false);
          }}
          onMouseEnter={() => setCreateHovered(true)}
          onMouseLeave={() => setCreateHovered(false)}
          className="w-full py-3.5 px-4 font-extrabold text-sm rounded-2xl border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.96]"
          style={{
            background: createHovered
              ? "linear-gradient(135deg, #34d399, #2dd4bf)"
              : "linear-gradient(135deg, #10b981, #14b8a6)",
            color: "white",
            boxShadow: createHovered
              ? "0 8px 30px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "0 4px 20px rgba(16,185,129,0.25)",
            transform: createHovered ? "translateY(-1px)" : "none",
          }}
        >
          <PlusCircle
            className={cn("w-[18px] h-[18px] transition-transform duration-300", createHovered && "rotate-90")}
          />
          Crear Post
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="px-[10px] space-y-[2px]">
          {mainMenuItems.map((item) => (
            <NavItem key={item.id} item={item} isActive={activeTab === item.id} onClick={() => handleTabChange(item.id)} />
          ))}
          <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} />
          {utilMenuItems.map((item) => (
            <NavItem key={item.id} item={item} isActive={activeTab === item.id} onClick={() => handleTabChange(item.id)} />
          ))}
        </div>
      </nav>

      {/* Perfil de Usuario */}
      <div className="relative z-10 flex-shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/[0.04] transition-all duration-200">
          <button
            onClick={() => handleTabChange("Profile")}
            className="flex items-center gap-3 flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 group"
          >
            <div className="relative flex-shrink-0">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: "2px solid rgba(16,185,129,0.3)", boxShadow: "0 0 0 3px rgba(16,185,129,0.08)" }}
              />
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                style={{ border: "2.5px solid #0c1810", background: "#34d399" }}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                {user?.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
                @{user?.username}
              </p>
            </div>
          </button>
          <button
            onClick={() => logout()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border-none cursor-pointer transition-all duration-200 bg-transparent text-white/20 hover:text-rose-400 hover:bg-white/[0.06]"
          >
            <LogOut className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col h-full w-[260px] flex-shrink-0 z-20 relative overflow-hidden"
        style={{ background: "var(--bg-sidebar)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button — flotante, sin barra */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 right-3 z-40 w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Menu className="w-5 h-5 text-stone-700" />
      </button>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              animation: "fadeInOverlay 0.2s ease",
            }}
            onClick={() => setIsMobileOpen(false)}
          />
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 h-full w-[300px] overflow-y-auto"
            style={{
              background: "var(--bg-sidebar)",
              animation: "slideInDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="px-4 py-3 flex justify-between items-center"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <LogoIcon size="mobile" />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.06] border-none cursor-pointer"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <SidebarContent isMobile />
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;