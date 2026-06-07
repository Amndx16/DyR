import React, { useState } from "react";
import { Bell } from "lucide-react";

interface TopbarProps {
  activeView: string;
  activeGeoScope: "pais" | "estado" | "alcaldia";
  onGeoScopeChange: (scope: "pais" | "estado" | "alcaldia") => void;
}

export default function Topbar({
  activeView,
  activeGeoScope,
  onGeoScopeChange,
}: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Abarrotes 'La Esperanza' incrementó riesgo a 85%", time: "Hace 5m", unread: true },
    { id: 2, text: "Nueva alerta de inactividad para Super Don Memo", time: "Hace 1h", unread: true },
    { id: 3, text: "Reporte semanal de ruta disponible", time: "Hace 1d", unread: false },
  ]);

  const viewTitles: Record<string, string> = {
    home: "Dashboard",
    users: "Clientes y Rutas",
    map: "Rutas Geoespaciales",
    calendar: "Calendario de Visitas",
    package: "Portafolio y Campañas",
    settings: "Configuración de Cuenta",
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);

  return (
    <header className="h-16 px-10 flex justify-between items-center fixed top-0 right-0 w-[calc(100%-280px)] z-40 bg-white/70 backdrop-blur-xl border-b border-rose-100/30 select-none">
      {/* Title & Greeting labels */}
      <div className="flex flex-col">
        <h1
          className="text-2xl font-extrabold text-[#b5000b] leading-tight capitalize"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          {viewTitles[activeView] || "Dashboard"}
        </h1>
        <p className="text-xs text-neutral-500 font-medium">Buen día, Carlos 👋</p>
      </div>

      {/* Control Tools */}
      <div className="flex items-center gap-6">
        {/* Geo Filtering toggle pills */}
        <div className="flex bg-neutral-100 rounded-full p-1 border border-neutral-200/50">
          <button
            onClick={() => onGeoScopeChange("pais")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer transition ${
              activeGeoScope === "pais"
                ? "bg-white shadow-sm text-[#b5000b]"
                : "text-neutral-500 hover:text-[#b5000b]"
            }`}
          >
            País
          </button>
          <button
            onClick={() => onGeoScopeChange("estado")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer transition ${
              activeGeoScope === "estado"
                ? "bg-white shadow-sm text-[#b5000b]"
                : "text-neutral-500 hover:text-[#b5000b]"
            }`}
          >
            Estado
          </button>
          <button
            onClick={() => onGeoScopeChange("alcaldia")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer transition ${
              activeGeoScope === "alcaldia"
                ? "bg-white shadow-sm text-[#b5000b]"
                : "text-neutral-500 hover:text-[#b5000b]"
            }`}
          >
            Alcaldía
          </button>
        </div>

        {/* Alerts Center with interactive menu panel */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition relative"
          >
            <Bell className="w-5 h-5 shrink-0" />
            {hasUnread && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#b5000b] rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Bullet notification details panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-neutral-100 shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <span className="text-xs font-bold text-neutral-800">Alertas en tiempo real</span>
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-[#b5000b] hover:underline"
                >
                  Marcar leídas
                </button>
              </div>
              <div className="divide-y divide-neutral-50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3.5 transition hover:bg-neutral-50 flex flex-col gap-1 ${n.unread ? "bg-red-500/[0.02]" : ""}`}>
                    <p className={`text-xs ${n.unread ? "font-bold text-neutral-800" : "text-neutral-600"}`}>
                      {n.text}
                    </p>
                    <span className="text-[9px] text-neutral-400 font-bold">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rounded avatars profile button mirroring user mockup illustration */}
        <button className="w-10 h-10 rounded-full border border-neutral-200 overflow-hidden hover:scale-105 transition-transform duration-150 shadow-sm leading-none shrink-0 cursor-pointer">
          <img
            alt="Carlos M."
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
          />
        </button>
      </div>
    </header>
  );
}
