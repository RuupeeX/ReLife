import React, { useState, useMemo, useCallback } from "react";
import { useData } from "../context/DataContext";
import {
  Heart,
  MessageCircle,
  UserPlus,
  ShoppingBag,
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  TrendingUp,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════
const typeConfig = {
  like: { icon: Heart, color: "#ef4444", bg: "#fef2f2", label: "Like" },
  comment: { icon: MessageCircle, color: "#3b82f6", bg: "#eff6ff", label: "Comentario" },
  follow: { icon: UserPlus, color: "#8b5cf6", bg: "#f5f3ff", label: "Seguidor" },
  sale: { icon: ShoppingBag, color: "#f59e0b", bg: "#fffbeb", label: "Venta" },
};

const filters = [
  { id: "all", label: "Todas" },
  { id: "unread", label: "Sin leer" },
  { id: "like", label: "Likes" },
  { id: "comment", label: "Comentarios" },
  { id: "follow", label: "Seguidores" },
  { id: "sale", label: "Ventas" },
];

// ═══════════════════════════════════════════
// NOTIFICATION ITEM (deduplicated)
// ═══════════════════════════════════════════
const NotificationItem = React.memo(({ n, onRead, onDelete }) => {
  const [swiped, setSwiped] = useState(false);
  const config = typeConfig[n.type] || typeConfig.like;
  const Icon = config.icon;

  return (
    <div
      className="relative overflow-hidden group"
      style={{ borderBottom: "1px solid #fafaf9" }}
    >
      {/* Delete background on swipe */}
      {swiped && (
        <div
          className="absolute inset-0 flex items-center justify-end pr-6"
          style={{ background: "#fef2f2" }}
        >
          <Trash2 className="w-5 h-5 text-rose-400" />
        </div>
      )}

      <div
        onClick={() => onRead(n.id)}
        className="flex gap-[14px] p-[16px_20px] cursor-pointer transition-all hover:bg-stone-50/80 relative"
        style={{
          background: n.read ? "transparent" : "rgba(16,185,129,0.03)",
          borderLeft: n.read ? "3px solid transparent" : "3px solid #10b981",
        }}
        role="listitem"
        aria-label={`${n.user} ${n.action}${n.read ? "" : " — sin leer"}`}
      >
        {/* Avatar + type badge */}
        <div className="relative flex-shrink-0">
          {n.avatar ? (
            <img
              src={n.avatar}
              alt={`Avatar de ${n.user}`}
              className="w-12 h-12 rounded-full object-cover"
              style={{ border: n.read ? "2px solid transparent" : "2px solid rgba(16,185,129,0.2)" }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: config.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: config.color }} />
            </div>
          )}
          <div
            className="absolute -bottom-[2px] -right-[2px] w-[22px] h-[22px] rounded-full flex items-center justify-center"
            style={{ background: config.bg, border: "2.5px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <Icon className="w-[10px] h-[10px]" style={{ color: config.color }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <span className="font-bold" style={{ color: n.read ? "var(--text-primary)" : "#0f766e" }}>
              {n.user}
            </span>{" "}
            {n.action}
          </p>
          {n.target && (
            <p className="text-[12px] mt-[3px] line-clamp-1 font-medium" style={{ color: "var(--text-muted)" }}>
              {n.target}
            </p>
          )}
          <p className="text-[11px] mt-1.5 font-semibold" style={{ color: "var(--text-faint)" }}>
            {n.time}
          </p>
        </div>

        {/* Post image thumbnail */}
        {n.image && (
          <img
            src={n.image}
            alt=""
            className="w-[52px] h-[52px] rounded-xl object-cover flex-shrink-0"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
          />
        )}

        {/* Unread dot */}
        {!n.read && (
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 self-center"
            style={{ background: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.15)" }}
          />
        )}

        {/* Delete button (hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(n.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-100 rounded-lg transition-all self-center bg-transparent border-none cursor-pointer flex-shrink-0"
          aria-label={`Eliminar notificación de ${n.user}`}
          title="Eliminar"
        >
          <Trash2 className="w-[14px] h-[14px] text-rose-400" />
        </button>
      </div>
    </div>
  );
});

NotificationItem.displayName = "NotificationItem";

// ═══════════════════════════════════════════
// CONFIRM DIALOG
// ═══════════════════════════════════════════
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, danger }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 text-center"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: danger ? "#fef2f2" : "rgba(16,185,129,0.08)" }}
        >
          {danger ? (
            <Trash2 className="w-6 h-6 text-rose-500" />
          ) : (
            <CheckCheck className="w-6 h-6 text-emerald-500" />
          )}
        </div>
        <h3 className="text-lg font-black mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-colors bg-stone-100 hover:bg-stone-200"
            style={{ color: "var(--text-secondary)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-colors text-white"
            style={{
              background: danger
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #10b981, #14b8a6)",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// NOTIFICATIONS VIEW
// ═══════════════════════════════════════════
const NotificationsView = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setNotifications } = useData();
  const [activeFilter, setActiveFilter] = useState("all");
  const [confirmAction, setConfirmAction] = useState(null); // "markAll" | "deleteAll" | null

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() =>
    notifications.filter((n) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "unread") return !n.read;
      return n.type === activeFilter;
    }),
    [notifications, activeFilter]
  );

  // Group notifications by time period
  const grouped = useMemo(() => {
    const today = [];
    const earlier = [];

    filteredNotifications.forEach((n) => {
      if (n.time.includes("min") || n.time.includes("hora")) {
        today.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, earlier };
  }, [filteredNotifications]);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, [setNotifications]);

  const deleteAllNotifications = useCallback(() => {
    if (activeFilter === "all") {
      setNotifications([]);
    } else if (activeFilter === "unread") {
      setNotifications((prev) => prev.filter((n) => n.read));
    } else {
      setNotifications((prev) => prev.filter((n) => n.type !== activeFilter));
    }
    setConfirmAction(null);
  }, [activeFilter, setNotifications]);

  const handleMarkAll = useCallback(() => {
    markAllNotificationsRead();
    setConfirmAction(null);
  }, [markAllNotificationsRead]);

  // Activity summary from real data
  const activityStats = useMemo(() => {
    const counts = { like: 0, comment: 0, follow: 0, sale: 0 };
    notifications.forEach((n) => {
      if (counts[n.type] !== undefined) counts[n.type]++;
    });
    return [
      { type: "like", icon: Heart, label: "Likes", value: counts.like, bg: "#fef2f2", color: "#ef4444" },
      { type: "comment", icon: MessageCircle, label: "Comentarios", value: counts.comment, bg: "#eff6ff", color: "#3b82f6" },
      { type: "follow", icon: UserPlus, label: "Seguidores", value: counts.follow, bg: "#f5f3ff", color: "#8b5cf6" },
      { type: "sale", icon: ShoppingBag, label: "Ventas", value: counts.sale, bg: "#fffbeb", color: "#f59e0b" },
    ];
  }, [notifications]);

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <React.Fragment key={title}>
        <div className="px-5 py-3 bg-stone-50" style={{ borderBottom: "1px solid #f5f5f4", borderTop: "1px solid #f5f5f4" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
        </div>
        <div role="list">
          {items.map((n) => (
            <NotificationItem
              key={n.id}
              n={n}
              onRead={markNotificationRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30"
        style={{
          background: "rgba(250,250,249,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-[28px] font-black flex items-center gap-[10px]"
                style={{ color: "var(--text-primary)" }}
              >
                <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                Notificaciones
                {unreadCount > 0 && (
                  <span className="ml-2 px-2.5 py-1 bg-rose-500 text-white text-[12px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                Mantente al día con tu actividad
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {filteredNotifications.length > 0 && (
                <button
                  onClick={() => setConfirmAction("deleteAll")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:bg-rose-50"
                  style={{ background: "transparent", color: "var(--text-muted)" }}
                  aria-label="Eliminar notificaciones"
                  title="Eliminar todas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={() => setConfirmAction("markAll")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-xl text-[13px] border-none cursor-pointer transition-all hover:bg-emerald-600"
                  aria-label="Marcar todas como leídas"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Marcar todas</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Filtrar notificaciones">
            {filters.map((filter) => {
              const count = filter.id === "unread"
                ? unreadCount
                : filter.id === "all"
                ? null
                : notifications.filter((n) => n.type === filter.id).length;

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all border-none cursor-pointer flex items-center gap-1.5",
                    activeFilter === filter.id
                      ? "bg-stone-900 text-white shadow-lg"
                      : "bg-white text-stone-600 hover:bg-stone-50"
                  )}
                  style={activeFilter !== filter.id ? { border: "1px solid var(--border)" } : {}}
                  role="tab"
                  aria-selected={activeFilter === filter.id}
                  aria-label={`${filter.label}${count ? `, ${count}` : ""}`}
                >
                  {filter.label}
                  {count > 0 && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[10px] font-extrabold rounded-full",
                        activeFilter === filter.id
                          ? "bg-white/20 text-white"
                          : filter.id === "unread"
                          ? "bg-rose-500 text-white"
                          : "bg-stone-100 text-stone-500"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {filteredNotifications.length === 0 ? (
          <div
            className="bg-white rounded-[24px] p-16 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.06)" }}>
              <BellOff className="w-9 h-9" style={{ color: "var(--text-faint)" }} />
            </div>
            <h3 className="text-lg font-black mb-2" style={{ color: "var(--text-primary)" }}>
              No hay notificaciones
            </h3>
            <p className="text-sm mb-5 max-w-xs mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {activeFilter === "all"
                ? "Cuando tengas actividad en tu cuenta, las notificaciones aparecerán aquí"
                : "No hay notificaciones en esta categoría"}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="px-6 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer transition-all hover:scale-105 text-white"
                style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 16px rgba(16,185,129,0.2)" }}
              >
                Ver todas
              </button>
            )}
          </div>
        ) : (
          <div
            className="bg-white rounded-[24px] overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {renderGroup("Hoy", grouped.today)}
            {renderGroup("Anteriores", grouped.earlier)}
          </div>
        )}

        {/* Activity Summary — computed from real data */}
        <div className="mt-6 bg-white rounded-[24px] p-6" style={{ border: "1px solid var(--border)" }}>
          <h3 className="font-bold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Resumen de actividad
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityStats.map((stat) => {
              const maxVal = Math.max(...activityStats.map((s) => s.value), 1);
              const pct = Math.round((stat.value / maxVal) * 100);
              return (
                <button
                  key={stat.type}
                  onClick={() => setActiveFilter(stat.type)}
                  className={cn(
                    "text-center p-4 rounded-xl border-none cursor-pointer transition-all hover:scale-[1.03] relative overflow-hidden",
                    activeFilter === stat.type && "ring-2 ring-offset-2"
                  )}
                  style={{
                    background: stat.bg,
                    ringColor: activeFilter === stat.type ? stat.color : undefined,
                  }}
                  aria-label={`${stat.label}: ${stat.value}. Pulsa para filtrar.`}
                >
                  {/* Background bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-700"
                    style={{ height: `${pct * 0.4}%`, background: `${stat.color}15`, borderRadius: "0 0 12px 12px" }}
                  />
                  <div className="relative z-10">
                    <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                    <p className="text-[24px] font-black" style={{ color: "var(--text-primary)" }}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                      {stat.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm dialogs */}
      <ConfirmDialog
        isOpen={confirmAction === "markAll"}
        title="Marcar todas como leídas"
        message={`Se marcarán ${unreadCount} notificaciones como leídas.`}
        onConfirm={handleMarkAll}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        isOpen={confirmAction === "deleteAll"}
        title="Eliminar notificaciones"
        message={
          activeFilter === "all"
            ? "Se eliminarán todas las notificaciones. Esta acción no se puede deshacer."
            : `Se eliminarán las notificaciones de "${filters.find((f) => f.id === activeFilter)?.label}".`
        }
        onConfirm={deleteAllNotifications}
        onCancel={() => setConfirmAction(null)}
        danger
      />
    </div>
  );
};

export default NotificationsView;