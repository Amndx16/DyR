import React from "react";
import ArklessLogo from "./ArklessLogo";
import { LayoutDashboard, Users, Map, Calendar, Package, Settings, LogOut, ChevronRight } from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogOut?: () => void;
}

export default function Sidebar({ activeView, onViewChange, onLogOut }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "map", label: "Map", icon: Map },
  ];

  // Map icons safely to fit screenshots: Churn Risks, Retention Tasks, Customer Health, Analytics, Settings
  const navigationConfig = [
    { id: "home", label: "Dashboard", icon: "dashboard" },
    { id: "churn_risks", label: "Churn Risks", icon: "warning" },
    { id: "calendar", label: "Retention Tasks", icon: "assignment_turned_in" },
    { id: "users", label: "Customer Health", icon: "favorite" },
    { id: "package", label: "Analytics", icon: "insert_chart" },
    { id: "training", label: "Training", icon: "school" },
  ];

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 bg-gradient-to-b from-[#0D0D0D] to-[#8B0000] shadow-2xl flex flex-col z-50 select-none">
      {/* Rebranded brand name and logo */}
      <div className="p-6 flex items-center justify-start border-b border-white/5">
        <ArklessLogo size="md" />
      </div>

      {/* Analyst profile card */}
      <div className="px-4 py-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/5 shadow-md">
          <div className="w-11 h-11 rounded-full bg-neutral-200 overflow-hidden border-2 border-[#ff4d4d]/50 shrink-0">
            <img
              alt="Carlos M. Profile"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-sm tracking-wide truncate">Carlos M.</span>
            <span className="text-white/60 text-xs truncate">Ruta 14 · Supervisor</span>
          </div>
        </div>
      </div>

      {/* Navigation Links with custom active state backgrounds */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navigationConfig.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-150 border-l-4 group ${
                isActive
                  ? "bg-white/10 border-[#ff4d4d] text-white font-bold backdrop-blur-md shadow-inner"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-lg tracking-normal group-hover:scale-110 transition duration-150">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition ${isActive ? "opacity-40" : ""}`} />
            </button>
          );
        })}
      </nav>

      {/* Settings & Logs Out Footer section */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button
          onClick={() => onViewChange("settings")}
          className="w-full flex items-center gap-3.5 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          <span className="text-xs font-semibold tracking-wide">Settings</span>
        </button>
        <button
          onClick={() => {
            if (onLogOut) {
              onLogOut();
            } else {
              alert("Sesión Cerrada. Redirigiendo...");
            }
          }}
          className="w-full flex items-center gap-3.5 p-3 rounded-xl text-white/70 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="text-xs font-semibold tracking-wide">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
