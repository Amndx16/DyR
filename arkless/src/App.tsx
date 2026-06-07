import React, { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Map from "./components/Map";
import EvolutionChart from "./components/EvolutionChart";
import ClientDetailsModal from "./components/ClientDetailsModal";
import AIAssistant from "./components/AIAssistant";
import LandingView from "./components/LandingView";
import CustomerView from "./components/CustomerView";
import ChurnRisksDetail from "./components/ChurnRisksDetail";
import AnalyticsView from "./components/AnalyticsView";
import TrainingView from "./components/TrainingView";
import { STORES } from "./data";
import { StoreItem } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Filter, CheckCircle2, ChevronRight, AlertTriangle, Users, BookOpen, Layers } from "lucide-react";

export default function App() {
  const [userRole, setUserRole] = useState<"landing" | "seller" | "customer">("landing");
  const [activeView, setActiveView] = useState("home");
  const [activeGeoScope, setActiveGeoScope] = useState<"pais" | "estado" | "alcaldia">("pais");
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [selectedStoreForDetail, setSelectedStoreForDetail] = useState<StoreItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [autoOpenTutorial, setAutoOpenTutorial] = useState(false);

  // Filter list parameters
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "critical">("all");

  // Filter stores logically based on query and tabs
  const filteredStores = useMemo(() => {
    return STORES.filter((store) => {
      // 1. Text Query
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        store.name.toLowerCase().includes(query) ||
        store.id.toLowerCase().includes(query) ||
        store.state.toLowerCase().includes(query);

      // 2. Risk Level Threshold tabs
      const matchesRisk = riskFilter === "all" || store.risk >= 70;

      // 3. GeoScope scope boundaries
      let matchesGeo = true;
      if (activeGeoScope === "estado") {
        matchesGeo = store.state !== "CDMX"; // Show stores outside CDMX for state view
      } else if (activeGeoScope === "alcaldia") {
        matchesGeo = store.state === "CDMX"; // Isolate CDMX stores for local municipal view
      }

      return matchesSearch && matchesRisk && matchesGeo;
    });
  }, [searchTerm, riskFilter, activeGeoScope]);

  // Dynamic calculable metrics
  const highRiskCount = STORES.filter((s) => s.risk >= 70).length;
  const mediumRiskCount = STORES.filter((s) => s.risk >= 30 && s.risk < 70).length;
  const rescuedCount = STORES.filter((s) => s.risk < 30).length;

  const handleSelectStore = (store: StoreItem) => {
    setSelectedStoreForDetail(store);
    setActiveView("churn_risks");
  };

  const getProgressColor = (risk: number) => {
    if (risk >= 70) return "bg-red-500";
    if (risk >= 30) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getBorderColor = (risk: number) => {
    if (risk >= 70) return "border-l-red-500";
    if (risk >= 30) return "border-l-amber-500";
    return "border-l-emerald-500";
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "home":
        return (
          <div className="space-y-10">
            {/* Dynamic KPIs Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 select-none">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-red-500 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 duration-150">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Clientes riesgo alto
                  </p>
                  <span className="material-symbols-outlined text-red-500 text-xl font-bold leading-none shrink-0">
                    warning
                  </span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <h2 className="text-3xl font-black text-neutral-800 leading-none">
                    {highRiskCount}
                  </h2>
                  <div className="h-6 w-20 bg-red-50 rounded-md overflow-hidden relative border border-red-100">
                    <div className="h-full bg-red-100/90 w-[80%] absolute left-0 top-0"></div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 duration-150">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Riesgo medio
                  </p>
                  <span className="material-symbols-outlined text-amber-500 text-xl font-bold leading-none shrink-0">
                    priority_high
                  </span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <h2 className="text-3xl font-black text-neutral-800 leading-none">
                    {mediumRiskCount}
                  </h2>
                  <div className="h-6 w-20 bg-amber-50 rounded-md overflow-hidden relative border border-amber-100">
                    <div className="h-full bg-amber-100/90 w-[45%] absolute left-0 top-0"></div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-[#b5000b] shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 duration-150">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Valor en riesgo
                  </p>
                  <span className="material-symbols-outlined text-[#b5000b] text-xl font-bold leading-none shrink-0">
                    payments
                  </span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <h2 className="text-3xl font-black text-neutral-800 leading-none">
                    $48.2k
                  </h2>
                  <div className="text-red-500 text-[10px] font-bold shrink-0">
                    +12% vs m.a.
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 duration-150">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Rescatados este mes
                  </p>
                  <span className="material-symbols-outlined text-emerald-500 text-xl font-bold leading-none shrink-0">
                    verified_user
                  </span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <h2 className="text-3xl font-black text-neutral-800 leading-none">
                    {rescuedCount + 4}
                  </h2>
                  <div className="text-emerald-600 text-[10px] font-bold shrink-0">
                    Meta: 15
                  </div>
                </div>
              </div>
            </div>

            {/* Core Workspace Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
              {/* Left Column Map Panel (60%) */}
              <div className="xl:col-span-6">
                <Map
                  stores={STORES}
                  selectedStore={selectedStore}
                  onSelectStore={handleSelectStore}
                  activeFilter={riskFilter}
                />
              </div>

              {/* Right Column Shops List (40%) */}
              <div className="xl:col-span-4 bg-white rounded-2xl shadow-lg border border-neutral-100 flex flex-col h-[520px]">
                {/* Search & Tabs portion */}
                <div className="p-6 border-b border-neutral-100 space-y-4">
                  <div className="flex justify-between items-center select-none">
                    <h3
                      className="text-lg font-bold text-neutral-800"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      Clientes en riesgo
                    </h3>
                    <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/45">
                      <button
                        onClick={() => setRiskFilter("all")}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                          riskFilter === "all"
                            ? "bg-white text-neutral-700 shadow-sm"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setRiskFilter("critical")}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                          riskFilter === "critical"
                            ? "bg-white text-red-500 shadow-sm"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        Solo críticos
                      </button>
                    </div>
                  </div>

                  {/* Input search handle */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar tienda o ID..."
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white text-xs border border-neutral-200/60 transition rounded-xl text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-500/10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-[10px] font-bold hover:underline"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>

                {/* Vertical Scroll view of stores */}
                <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {filteredStores.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
                      <Search className="w-8 h-8 text-neutral-300 stroke-1 mb-2" />
                      <p className="text-xs text-neutral-400 font-bold">
                        No se encontraron tiendas
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Intenta con otra búsqueda o cambia de filtro
                      </p>
                    </div>
                  ) : (
                    filteredStores.map((store) => {
                      const isSelected = selectedStore?.id === store.id;
                      return (
                        <div
                          key={store.id}
                          onClick={() => handleSelectStore(store)}
                          className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50/70 border-l-4 transition duration-150 cursor-pointer ${getBorderColor(
                            store.risk
                          )} ${isSelected ? "bg-neutral-50 shadow-inner" : ""}`}
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-200/50 shrink-0">
                            <img
                              alt={store.name}
                              className="w-full h-full object-cover"
                              src={store.image}
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-bold text-neutral-800 truncate mb-1.5 leading-none">
                              {store.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-grow h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(store.risk)}`}
                                  style={{ width: `${store.risk}%` }}
                                ></div>
                              </div>
                              <span
                                className={`text-[9px] font-black leading-none ${
                                  store.risk >= 70
                                    ? "text-red-500"
                                    : store.risk >= 30
                                    ? "text-amber-500"
                                    : "text-emerald-500"
                                }`}
                              >
                                {store.risk}%
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Tabbed Chart Area */}
            <div>
              <EvolutionChart />
            </div>
          </div>
        );

      case "churn_risks":
        if (selectedStoreForDetail) {
          return (
            <ChurnRisksDetail
              store={selectedStoreForDetail}
              onBack={() => setSelectedStoreForDetail(null)}
            />
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none">
              <div>
                <h3 className="text-xl font-bold text-neutral-800" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Análisis Táctico de Deserción (Churn Risks)
                </h3>
                <p className="text-xs text-neutral-400 font-medium mt-1">
                  Listado inteligente de tiendas de la Ruta 14 ordenadas según su probabilidad de abandono
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STORES.map((s) => {
                const getRiskStatus = (risk: number) => {
                  if (risk >= 70) return { label: "Alto Riesgo", color: "text-red-655 bg-gradient-to-r from-red-500/10 to-red-100/10 border-red-200" };
                  if (risk >= 30) return { label: "Riesgo Medio", color: "text-amber-655 bg-gradient-to-r from-amber-500/10 to-amber-100/10 border-amber-200" };
                  return { label: "Bajo Riesgo", color: "text-emerald-655 bg-gradient-to-r from-emerald-500/10 to-emerald-100/10 border-emerald-200" };
                };
                const status = getRiskStatus(s.risk);
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStoreForDetail(s)}
                    className="bg-white p-6 rounded-2xl border border-neutral-150 flex flex-col justify-between hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img src={s.image} className="w-12 h-12 rounded-xl object-cover border border-neutral-150" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-neutral-800 truncate group-hover:text-[#E30613] transition">{s.name}</h4>
                          <span className="text-[10px] text-neutral-400 font-bold font-mono tracking-wider">{s.id}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase">
                          <span>Probabilidad de Abandono</span>
                          <span className={s.risk >= 70 ? "text-[#E30613] font-black" : "text-neutral-600"}>{s.risk}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full ${s.risk >= 70 ? "bg-[#E30613]" : s.risk >= 30 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${s.risk}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold select-none">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] uppercase border ${status.color}`}>{status.label}</span>
                      <span className="text-[#E30613] group-hover:underline flex items-center gap-0.5 font-bold">
                        Ver análisis <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "users":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none">
              <div>
                <h3 className="text-xl font-bold text-neutral-800">
                  Panel de Clientes y Gestión de Rutas
                </h3>
                <p className="text-xs text-neutral-400 font-medium mt-1">
                  Listado global con filtros e historiales de visitas
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/60 border-b border-neutral-100 text-[10px] font-black tracking-wider text-neutral-400 uppercase select-none">
                    <th className="p-4">ID / Sucursal</th>
                    <th className="p-4">Región/Estado</th>
                    <th className="p-4 text-center">Nivel Riesgo</th>
                    <th className="p-4">Vol. Compras</th>
                    <th className="p-4">Última Visita</th>
                    <th className="p-4">Análisis Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-xs text-neutral-700">
                  {STORES.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => handleSelectStore(s)}
                      className="hover:bg-neutral-50/50 cursor-pointer transition"
                    >
                      <td className="p-4 flex items-center gap-3 font-semibold">
                        <img
                          src={s.image}
                          className="w-8 h-8 rounded-lg object-cover border border-neutral-100 shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-neutral-800 truncate">{s.name}</span>
                          <span className="text-[9px] text-neutral-400 font-mono tracking-wider">
                            {s.id}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-neutral-500">{s.state}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                            s.risk >= 70
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : s.risk >= 30
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {s.risk}%
                        </span>
                      </td>
                      <td className="p-4 font-bold text-neutral-800">{s.volume}</td>
                      <td className="p-4 font-bold text-neutral-500">{s.lastVisit}</td>
                      <td className="p-4 font-semibold text-[#b5000b] truncate max-w-[200px]">
                        {s.causals[0]?.factor || "Estable"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch select-none">
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Calendario de Visita</h3>
                <p className="text-xs text-neutral-400 font-medium">Programación semanal de rutas tácticas</p>
              </div>

              {/* Quick interactive grid illustrating a high-fidelity visual layout */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs mt-4">
                {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((day) => (
                  <div key={day} className="font-bold text-neutral-400 font-mono text-[10px] pb-2 border-b border-neutral-150">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 28 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isScheduled = dayNum === 12 || dayNum === 18 || dayNum === 22 || dayNum === 29;
                  return (
                    <div
                      key={idx}
                      className={`h-16 rounded-xl p-2 border border-neutral-100/60 flex flex-col justify-between text-left transition ${
                        isScheduled
                          ? "bg-red-500/5 border-red-200/50 hover:bg-red-500/10 cursor-pointer"
                          : "bg-white hover:bg-neutral-50/50"
                      }`}
                      onClick={() => {
                        if (isScheduled) {
                          const matchedStore = STORES[idx % STORES.length];
                          handleSelectStore(matchedStore);
                        }
                      }}
                    >
                      <span className="text-[10px] font-mono text-neutral-400 font-bold">{dayNum}</span>
                      {isScheduled && (
                        <span className="w-2 h-2 rounded-full bg-[#E30613] self-end animate-pulse"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 flex flex-col gap-4">
              <h4 className="font-bold text-neutral-800">Visitas Críticas Prioritarias</h4>
              <div className="space-y-3 flex-grow overflow-y-auto">
                {STORES.filter(s => s.risk >= 70).map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectStore(s)}
                    className="p-3 bg-red-500/[0.02] border border-red-100 rounded-xl hover:bg-red-500/5 transition cursor-pointer flex items-center gap-3"
                  >
                    <img src={s.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-neutral-800 text-xs truncate">{s.name}</p>
                      <p className="text-[10px] text-red-500 font-bold mt-1">Riesgo Crítico: {s.risk}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "package":
        return <AnalyticsView />;

      case "training":
        return (
          <TrainingView 
            onRedirectToTualiEasy={() => {
              setAutoOpenTutorial(true);
              setUserRole("customer");
            }}
          />
        );

      case "settings":
        return (
          <div className="max-w-xl bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 flex flex-col gap-6 select-none">
            <h3 className="text-xl font-bold text-neutral-800">Configuración del Supervisor</h3>
            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-neutral-800 text-sm">Carlos M.</p>
                <p className="text-xs text-neutral-500">Ruta 14 · Supervisor Principal</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">correo electrónico</label>
                <input
                  type="text"
                  disabled
                  value="villalpandozurita@gmail.com"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Ruta Asignada</label>
                <input
                  type="text"
                  disabled
                  value="Ruta Tradicional CDMX - Zona Polanco/Anáhuac"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (userRole === "landing") {
    return (
      <LandingView
        onEnterAsSeller={() => setUserRole("seller")}
        onEnterAsCustomer={() => setUserRole("customer")}
      />
    );
  }

  if (userRole === "customer") {
    return (
      <CustomerView
        onBackToLanding={() => {
          setAutoOpenTutorial(false);
          setUserRole("landing");
        }}
        autoOpenEasyTutorial={autoOpenTutorial}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-neutral-800 selection:bg-red-500/10 select-text">
      {/* 1. Left Menu Navigation Bar */}
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === "churn_risks" && !selectedStoreForDetail) {
            setSelectedStoreForDetail(STORES[0]);
          }
        }}
        onLogOut={() => setUserRole("landing")}
      />

      {/* 2. Main content container */}
      <main className="ml-[280px] min-h-screen flex flex-col">
        {/* Top Header navbar with geofilters */}
        <Topbar
          activeView={activeView}
          activeGeoScope={activeGeoScope}
          onGeoScopeChange={setActiveGeoScope}
        />

        {/* Dynamic page context placeholder views with padding */}
        <section className="mt-16 p-10 flex-grow relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView + activeGeoScope}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* 3. Global Popups & Overlays */}
      <AnimatePresence>
        {isDetailsOpen && selectedStore && (
          <ClientDetailsModal
            store={selectedStore}
            onClose={() => setIsDetailsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 4. Chat Guidance Assistant (Slide-out Right Drawer) */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* 5. Floating sparkles AI trigger bubble */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#E30613] shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200 z-[70] cursor-pointer group"
        title="Consultar Asistente de Retención"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>
    </div>
  );
}
