import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  Heart,
  Users,
  Eye,
  ShoppingBag,
  DollarSign,
  Package,
  MessageCircle,
  Share2,
  Bookmark,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  TrendingUp,
} from "lucide-react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════
const StatCard = React.memo(({ title, value, change, icon: Icon, iconColor, iconBg, negative }) => (
  <div
    className="bg-white rounded-[20px] p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
    style={{ border: "1px solid var(--border)" }}
    role="group"
    aria-label={`${title}: ${value}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      {change && (
        <span
          className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-bold"
          style={{
            background: negative ? "#fef2f2" : "#ecfdf5",
            color: negative ? "#dc2626" : "#059669",
          }}
        >
          {negative ? (
            <ArrowDownRight className="w-3 h-3" />
          ) : (
            <ArrowUpRight className="w-3 h-3" />
          )}
          {change}
        </span>
      )}
    </div>
    <p className="text-[12px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
      {title}
    </p>
    <p className="text-[28px] font-black" style={{ color: "var(--text-primary)" }}>
      {value}
    </p>
  </div>
));

StatCard.displayName = "StatCard";

// ═══════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════
const ProgressBar = React.memo(({ label, value, max, color }) => {
  const [animated, setAnimated] = useState(false);
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {value} <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${pct}%` : "0%",
            background: color,
          }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

// ═══════════════════════════════════════════
// BAR CHART
// ═══════════════════════════════════════════
const BarChart = ({ data, label }) => {
  const [animated, setAnimated] = useState(false);
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, [data]);

  return (
    <div
      className="flex items-end justify-between gap-[10px]"
      style={{ height: 160 }}
      role="img"
      aria-label={label}
    >
      {data.map((item, i) => {
        const pct = (item.value / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full flex flex-col justify-end" style={{ height: 130 }}>
              <div
                className="w-full rounded-xl transition-all duration-700 ease-out group-hover:opacity-80 relative cursor-default"
                style={{
                  height: animated ? `${pct}%` : "0%",
                  background: item.highlight
                    ? "linear-gradient(to top, #059669, #34d399)"
                    : "linear-gradient(to top, #10b981, #6ee7b7)",
                  transitionDelay: `${i * 60}ms`,
                  minHeight: animated ? 8 : 0,
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {item.value} {item.tooltip || ""}
                </div>
              </div>
            </div>
            <span
              className={cn(
                "text-[11px] font-bold group-hover:text-stone-600 transition-colors",
                item.highlight ? "text-emerald-600" : ""
              )}
              style={{ color: item.highlight ? undefined : "var(--text-muted)" }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════
// STATS VIEW
// ═══════════════════════════════════════════
const StatsView = () => {
  const { user } = useAuth();
  const { posts } = useData();
  const [timeRange, setTimeRange] = useState("week");

  const userPosts = useMemo(
    () => posts.filter((p) => p.author === user?.name || p.author === "Tú"),
    [posts, user?.name]
  );

  const totalLikes = useMemo(
    () => posts.reduce((acc, p) => acc + (p.likes || 0), 0),
    [posts]
  );

  const totalComments = useMemo(
    () => posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0),
    [posts]
  );

  const savedCount = useMemo(
    () => posts.filter((p) => p.saved).length,
    [posts]
  );

  // Multipliers based on time range to make the selector functional
  const multiplier = useMemo(() => {
    switch (timeRange) {
      case "week": return 1;
      case "month": return 3.8;
      case "year": return 42;
      default: return 1;
    }
  }, [timeRange]);

  const scale = (base) => Math.round(base * multiplier);
  const formatNum = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  // Chart data changes with time range
  const activityData = useMemo(() => {
    const bases = {
      week: [
        { label: "L", value: 40, tooltip: "interacciones" },
        { label: "M", value: 65, tooltip: "interacciones" },
        { label: "X", value: 35, tooltip: "interacciones" },
        { label: "J", value: 85, tooltip: "interacciones" },
        { label: "V", value: 55, tooltip: "interacciones" },
        { label: "S", value: 95, tooltip: "interacciones", highlight: true },
        { label: "D", value: 50, tooltip: "interacciones" },
      ],
      month: [
        { label: "S1", value: 280, tooltip: "interacciones" },
        { label: "S2", value: 350, tooltip: "interacciones" },
        { label: "S3", value: 420, tooltip: "interacciones", highlight: true },
        { label: "S4", value: 310, tooltip: "interacciones" },
      ],
      year: [
        { label: "E", value: 800, tooltip: "interacciones" },
        { label: "F", value: 920, tooltip: "interacciones" },
        { label: "M", value: 1100, tooltip: "interacciones" },
        { label: "A", value: 980, tooltip: "interacciones" },
        { label: "M", value: 1250, tooltip: "interacciones" },
        { label: "J", value: 1400, tooltip: "interacciones", highlight: true },
        { label: "J", value: 1100, tooltip: "interacciones" },
        { label: "A", value: 950, tooltip: "interacciones" },
        { label: "S", value: 1300, tooltip: "interacciones" },
        { label: "O", value: 1500, tooltip: "interacciones", highlight: true },
        { label: "N", value: 1200, tooltip: "interacciones" },
        { label: "D", value: 1350, tooltip: "interacciones" },
      ],
    };
    return bases[timeRange] || bases.week;
  }, [timeRange]);

  const engagementTotal = totalLikes + totalComments + savedCount;

  const recentTransactions = [
    { id: 1, title: "Lámpara de botellas", date: "Hace 2 días", amount: 45, type: "income", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=100" },
    { id: 2, title: "Mesa de palet", date: "Hace 5 días", amount: 120, type: "income", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100" },
    { id: 3, title: "Comisión plataforma", date: "Hace 1 semana", amount: 16.50, type: "expense", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100" },
    { id: 4, title: "Maceteros neumáticos", date: "Hace 1 semana", amount: 25, type: "income", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=100" },
  ];

  const totalIncome = recentTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const handleExport = () => {
    const data = {
      period: timeRange,
      stats: {
        views: formatNum(scale(12500)),
        followers: formatNum(scale(1234)),
        likes: totalLikes,
        comments: totalComments,
        posts: userPosts.length,
        saved: savedCount,
      },
      exported: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relife-stats-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1
                className="text-[28px] font-black flex items-center gap-[10px]"
                style={{ color: "var(--text-primary)" }}
              >
                <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                Estadísticas
              </h1>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                Analiza el rendimiento de tu cuenta y ventas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:bg-stone-100"
                style={{ background: "white", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                aria-label="Exportar estadísticas"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar
              </button>
              <div
                className="flex items-center gap-1 bg-white rounded-xl p-1"
                style={{ border: "1px solid var(--border)" }}
                role="tablist"
                aria-label="Rango de tiempo"
              >
                {[
                  ["week", "Semana"],
                  ["month", "Mes"],
                  ["year", "Año"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTimeRange(id)}
                    className={cn(
                      "px-4 py-[7px] rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer",
                      timeRange === id
                        ? "bg-stone-900 text-white shadow-lg"
                        : "text-stone-500 hover:text-stone-700 bg-transparent"
                    )}
                    role="tab"
                    aria-selected={timeRange === id}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-24">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Visualizaciones"
            value={formatNum(scale(12500))}
            change="14%"
            icon={Eye}
            iconColor="#3b82f6"
            iconBg="#eff6ff"
          />
          <StatCard
            title="Seguidores"
            value={formatNum(scale(1234))}
            change="8%"
            icon={Users}
            iconColor="#8b5cf6"
            iconBg="#f5f3ff"
          />
          <StatCard
            title="Total Likes"
            value={totalLikes.toLocaleString()}
            change="12%"
            icon={Heart}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            title="Comentarios"
            value={totalComments.toString()}
            change={totalComments > 10 ? "5%" : "2%"}
            icon={MessageCircle}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
        </div>

        {/* Sales + Quick summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-[24px] p-8 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #10b981, #0d9488, #06b6d4)" }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/60 font-medium text-sm mb-1">
                    Ingresos {timeRange === "week" ? "esta semana" : timeRange === "month" ? "este mes" : "este año"}
                  </p>
                  <p className="text-[44px] font-black">
                    {(totalIncome * multiplier).toFixed(0)}€
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  [`${Math.round(totalIncome * (multiplier * 0.3))}€`, "Período actual"],
                  [userPosts.length.toString(), "Productos"],
                  ["2", "Pendientes"],
                ].map(([v, l]) => (
                  <div
                    key={l}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
                  >
                    <p className="text-white/50 text-[11px] font-medium">{l}</p>
                    <p className="text-[22px] font-black mt-1">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-[24px] p-6"
            style={{ border: "1px solid var(--border)" }}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Activity className="w-5 h-5 text-emerald-500" /> Resumen rápido
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Posts", value: userPosts.length, icon: Package, color: "#3b82f6" },
                { title: "Guardados", value: savedCount, icon: Bookmark, color: "#f59e0b" },
                { title: "Compartidos", value: formatNum(scale(234)), icon: Share2, color: "#8b5cf6" },
                { title: "Alcance", value: formatNum(scale(5200)), icon: Target, color: "#10b981" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-stone-50 rounded-xl p-4 hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    <span className="text-[11px] font-bold" style={{ color: "var(--text-muted)" }}>
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[22px] font-black" style={{ color: "var(--text-primary)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity chart */}
          <div
            className="bg-white rounded-[24px] p-6"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                Actividad {timeRange === "week" ? "semanal" : timeRange === "month" ? "mensual" : "anual"}
              </h3>
            </div>
            <BarChart
              key={timeRange}
              data={activityData}
              label={`Gráfico de actividad ${timeRange === "week" ? "semanal" : timeRange === "month" ? "mensual" : "anual"}`}
            />
          </div>

          {/* Engagement */}
          <div
            className="bg-white rounded-[24px] p-6"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <PieChart className="w-5 h-5 text-violet-500" /> Engagement
              </h3>
              <span className="text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: "#f5f5f4", color: "var(--text-muted)" }}>
                Total: {engagementTotal}
              </span>
            </div>
            <div className="space-y-4">
              <ProgressBar
                label="Likes"
                value={totalLikes}
                max={engagementTotal}
                color="linear-gradient(90deg, #ef4444, #ec4899)"
              />
              <ProgressBar
                label="Comentarios"
                value={totalComments}
                max={engagementTotal}
                color="linear-gradient(90deg, #f59e0b, #ea580c)"
              />
              <ProgressBar
                label="Guardados"
                value={savedCount}
                max={engagementTotal}
                color="linear-gradient(90deg, #3b82f6, #06b6d4)"
              />
            </div>
            <div className="mt-5 p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    {totalLikes > 20 ? "¡Gran trabajo!" : "¡Sigue así!"}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {totalLikes > 20
                      ? "Tu engagement está por encima de la media"
                      : "Publica más para aumentar tu engagement"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div
          className="bg-white rounded-[24px] p-6"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <ShoppingBag className="w-5 h-5 text-emerald-500" /> Transacciones recientes
            </h3>
          </div>
          <div className="space-y-1" role="list" aria-label="Transacciones recientes">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-xl transition-colors"
                role="listitem"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={tx.image} alt={tx.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: "var(--text-primary)" }}>
                    {tx.title}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {tx.date}
                  </p>
                </div>
                <span
                  className={cn("font-bold", tx.type === "income" ? "text-emerald-600" : "text-rose-500")}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div
          className="bg-white rounded-[24px] p-6"
          style={{ border: "1px solid var(--border)" }}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Users className="w-5 h-5 text-violet-500" /> Insights de audiencia
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["25-34", "Edad principal", "45% de tu audiencia"],
              ["Madrid", "Ciudad top", "28% de visitas"],
              ["19:00", "Mejor hora", "Mayor engagement"],
              ["Sábado", "Mejor día", "+35% interacciones"],
            ].map(([value, title, subtitle]) => (
              <div key={title}>
                <p className="text-[12px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                  {title}
                </p>
                <p className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                  {value}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;