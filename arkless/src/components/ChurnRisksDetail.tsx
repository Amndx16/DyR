import React, { useState } from "react";
import { StoreItem } from "../types";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  UserCheck,
  Send,
  Building,
  Activity,
  AlertCircle,
  MessageCircle,
  CheckCircle,
  Plus,
  Clock,
  Sparkles,
  Award,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ArklessLogo from "./ArklessLogo";

interface ChurnRisksDetailProps {
  store: StoreItem;
  onBack: () => void;
}

interface TimelineEntry {
  author: string;
  role: string;
  date: string;
  text: string;
  status: "PENDIENTE" | "SANEADO" | "EN PROCESO";
}

interface DeliveryHistoryItem {
  date: string;
  amount: string;
  status: string;
  details: string[];
}

export default function ChurnRisksDetail({ store, onBack }: ChurnRisksDetailProps) {
  const [activeTab, setActiveTab] = useState<"historial" | "seguimiento" | "gamificacion" | "contacto">("historial");
  
  // Expose expandable states for delivery history items
  const [expandedDelivery, setExpandedDelivery] = useState<number | null>(0);

  // Dynamic timeline notes with capability to append custom values
  const [timelineNotes, setTimelineNotes] = useState<TimelineEntry[]>([
    {
      author: "Carlos M.",
      role: "Manager Regional",
      date: "10 JUN, 2026",
      text: "Se envió cupón de descuento del 15% para la categoría de aguas. Cliente menciona que la competencia ofreció mejores exhibidores.",
      status: "PENDIENTE"
    },
    {
      author: "Soporte Técnico arkLess",
      role: "Sistema Automático",
      date: "01 JUN, 2026",
      text: "Alerta de inactividad de pedido enviada automáticamente al portal del socio.",
      status: "EN PROCESO"
    }
  ]);
  
  const [newNoteText, setNewNoteText] = useState("");
  const [addNoteStatus, setAddNoteStatus] = useState<"PENDIENTE" | "SANEADO" | "EN PROCESO">("PENDIENTE");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Dropdown list of route advisors to choose from ("Solo en la parte de whatsapp ponle como asignar a un asesor")
  const advisors = [
    { name: "Ing. Roberto Salazar", role: "Asesor Senior CDMX", phone: "+525540391280", email: "rsalazar@arkless.com" },
    { name: "Lic. Diana Pérez", role: "Coordinadora Comercial", phone: "+525519827364", email: "dperez@arkless.com" },
    { name: "Jaime Ortega", role: "Gestor de Cuentas Clave", phone: "+525528374659", email: "jortega@arkless.com" },
    { name: "Sofia Medina", role: "Especialista en Reactivación", phone: "+525590817263", email: "smedina@arkless.com" }
  ];
  const [selectedAdvisor, setSelectedAdvisor] = useState(advisors[0]);
  const [assignReason, setAssignReason] = useState("Reactivación Urgente de Ruta");
  const [isAssignedMessage, setIsAssignedMessage] = useState(false);

  // Expandable Delivery items
  const deliveries: DeliveryHistoryItem[] = [
    {
      date: "15 Jun, 2026",
      amount: "$4,250.00",
      status: "ENTREGADO",
      details: ["15px Coca-Cola Original 2.5L", "5px Agua Ciel 1L", "4px Sidral Mundet 600ml"]
    },
    {
      date: "02 Jun, 2026",
      amount: "$5,120.00",
      status: "ENTREGADO",
      details: ["20px Gaseosas Mix Saborizados", "8px Powerade Ion4 500ml", "10px Santa Clara Leche Entera"]
    },
    {
      date: "18 May, 2026",
      amount: "$3,810.00",
      status: "ENTREGADO",
      details: ["10px Coca-Cola Sin Azúcar 355ml", "5px Fuze Tea Té Verde", "3px Monster Energy"]
    }
  ];

  // Specific variables for the 3 data boxes requested by the user
  // (tiempo sin pedir, estabilidad o inestabilidad, la consolidación del cliente, el número de meses, y la frecuencia de compra)
  const getSpecificDataDetails = () => {
    // We calibrate these stats based on the store's current risk level to reflect real data.
    const score = store.risk;
    const isHigh = score >= 70;
    const isMedium = score >= 30 && score < 70;

    // 1. Tiempo sin pedir (Days active or inactive)
    const tiempoSinPedir = isHigh
      ? "22 días sin pedidos activos (Último ciclo saltado el 12 de Mayo)"
      : isMedium
      ? "12 días desde la última interacción de surtido de ruta"
      : "5 días (Ciclo de abasto regular y saludable)";

    // 2. Estabilidad o Inestabilidad
    const estabilidad = isHigh
      ? "Inestabilidad severa detectada en volumen acumulado con caída de -15% YoY"
      : isMedium
      ? "Inestabilidad moderada en la consistencia de marcas secundarias (Jugos / Té)"
      : "Alta Estabilidad (Desviación estándar de compra inferior al 5% mensual)";

    // 3. Consolidación del cliente
    const consolidacion = isHigh
      ? `Segmento A (Socio Oro) con alta consolidación de marca histórica pero riesgo inminente de stockout`
      : isMedium
      ? "Segmento B - Consolidación Media con brecha de portafolio sin cubrir"
      : "Segmento C - Consolidación Regular y fidelidad comercial óptima";

    // 4. Número de meses
    const numeroDeMeses = isHigh
      ? "Socio activo de Arca Continental durante 18 meses consecutivos"
      : isMedium
      ? "Socio activo en la plataforma por 12 meses"
      : "Socio activo por 24 meses (Historial de pago impecable)";

    // 5. Frecuencia con la que ha comprado
    const frecuenciaCompra = isHigh
      ? "Ciclo típico de compra: registrado cada 4.2 días hábiles de supervisor"
      : isMedium
      ? "Ciclo típico de compra: cada 6.5 días en la ruta programada"
      : "Ciclo típico de compra: cada 5.0 días constantes de atención directa";

    return {
      tiempoSinPedir,
      estabilidad,
      consolidacion,
      numeroDeMeses,
      frecuenciaCompra
    };
  };

  const dataDetails = getSpecificDataDetails();

  // Helper to get descriptive risk label
  const getRiskTitle = (risk: number) => {
    if (risk >= 70) return "Riesgo de Tienda: ALTO PRIORITARIO";
    if (risk >= 30) return "Riesgo de Tienda: MEDIO";
    return "Riesgo de Tienda: BAJO (Socio Saludable)";
  };

  const getRiskBadgeColor = (risk: number) => {
    if (risk >= 70) return "bg-red-500 text-white";
    if (risk >= 30) return "bg-amber-500 text-white";
    return "bg-emerald-500 text-white";
  };

  // Add notes timeline interactively
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newEntry: TimelineEntry = {
      author: "Carlos M.",
      role: "Manager Regional",
      date: "Hoy",
      text: newNoteText,
      status: addNoteStatus
    };
    setTimelineNotes([newEntry, ...timelineNotes]);
    setNewNoteText("");
    setIsAddingNote(false);
  };

  // Pre-filled WhatsApp action logic with advisor assignment
  const handleAssignAdvisorWhatsApp = () => {
    const textMessage = `Hola ${selectedAdvisor.name}, te saludo de parte de arkLess. He revisado tu ruta en Carlos M. (retención de abasto) y te he ASIGNADO directamente a la tienda "${store.name}" (ID: ${store.id}) la cual presenta un nivel de riesgo de ${store.risk}%. Motivo de la asignación: ${assignReason}. Por favor coordina una llamada o visita de inmediato. Detalles: Frecuencia de compra típica: ${dataDetails.frecuenciaCompra}. ¡Gracias de antemano!`;
    const encodedText = encodeURIComponent(textMessage);
    
    // Simulate assigning feedback
    setIsAssignedMessage(true);
    setTimeout(() => {
      setIsAssignedMessage(false);
    }, 4000);

    // Open real WhatsApp API
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${selectedAdvisor.phone}&text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 select-none pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
          <button onClick={onBack} className="hover:text-[#E30613] transition">
            Dashboard
          </button>
          <ChevronRight className="w-3 h-3 text-neutral-300" />
          <span className="text-neutral-500">Clientes</span>
          <ChevronRight className="w-3 h-3 text-neutral-300" />
          <span className="text-[#E30613] font-bold">{store.name}</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al listado
        </button>
      </div>

      {/* Main header block matching screenshot text fields exactly */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight" style={{ fontFamily: "DM Sans, sans-serif" }}>
              {store.name}
            </h1>
            <span className="px-2.5 py-1 text-[9.5px] font-black uppercase bg-[#E30613]/5 text-[#E30613] border border-[#E30613]/10 rounded-md tracking-wider">
              Segmento A
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1.5">
            Portal del Supervisor de Ruta · Arca Continental
          </p>
        </div>
      </div>

      {/* RISK LEVEL TOP HIGH-FIDELITY PRIORITY CONTAINER */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
        {/* Subtle decorative glow behind */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-[#E30613] uppercase block">
              ESTADO DEL CLIENTE
            </span>
            <h3 className="text-base md:text-lg font-extrabold text-neutral-800 uppercase tracking-tight">
              {store.risk >= 70 ? "RISK LEVEL: HIGH PRIORITY" : store.risk >= 30 ? "RISK LEVEL: MEDIUM WARNING" : "RISK LEVEL: HEALTHY SOCIO"}
            </h3>
            <p className="text-xs font-medium text-neutral-400">
              El riesgo aumentó {store.risk >= 70 ? "un 14%" : "un 4%"} desde la última visita programada de supervisor. Se requiere intervención estratégica de retención.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-5xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-none block">
              {store.risk}%
            </span>
            <span className="text-[9.5px] font-extrabold text-[#E30613] uppercase tracking-widest mt-1 block">
              DESERCIÓN PROBABLE
            </span>
          </div>
        </div>

        {/* Dynamic score progress-bar */}
        <div className="mt-6 h-3.5 bg-neutral-100 rounded-full overflow-hidden relative border border-neutral-200/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${store.risk}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r from-red-500 to-[#E30613] rounded-full relative`}
          >
            {/* Animated white shine effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* USER REQUESTED: MODULE WITH 100% SPECIFIC 3 DATA RECUADROS DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* BOX 1: Porcentaje de predicción en detalle */}
        <div className="bg-white rounded-2xl p-6 border-t-4 border-red-500 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                01 · Predicción Churn
              </span>
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-neutral-800">Porcentaje de Predicción</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                El algoritmo predictivo de <strong>arkLess</strong> calcula la probabilidad de stockout o abandono de compra para este socio.
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-red-500/[0.03] border border-red-500/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-neutral-850 block">Probabilidad</span>
              <span className="text-xs text-neutral-500 block font-medium">Algoritmo arkLess v2.1</span>
            </div>
            <span className="text-3xl font-black text-[#E30613] tracking-tight">{store.risk}%</span>
          </div>
        </div>

        {/* BOX 2: Riesgo de la tienda (Bajo, Medio, Alto) */}
        <div className="bg-white rounded-2xl p-6 border-t-4 border-amber-500 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                02 · Nivel de Riesgo
              </span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-neutral-800">Riesgo de la Tienda</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Estado operativo del punto de venta según la criticidad de su desabasto. Clasificado explícitamente para ruta táctica.
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-neutral-850 block">Criticidad</span>
              <span className="text-xs text-neutral-500 block font-medium">Segmentación de Alertas</span>
            </div>
            <span className={`px-4 py-1.5 text-xs font-black rounded-lg tracking-wide shrink-0 ${
              store.risk >= 70 ? "bg-red-500 text-white" : store.risk >= 30 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
            }`}>
              {store.risk >= 70 ? "ALTO PRIO" : store.risk >= 30 ? "MEDIO" : "BAJO"}
            </span>
          </div>
        </div>

        {/* BOX 3: Razones de la Data (tiempo sin pedir, estabilidad, consolidación, número de meses, frecuencia) */}
        <div className="bg-white rounded-2xl p-6 border-t-4 border-[#b5000b] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#b5000b] uppercase tracking-widest">
                03 · Razones de la Data
              </span>
              <Sparkles className="w-4 h-4 text-[#b5000b]" />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-black text-neutral-800">Métricas Principales (SHAP)</h4>
              
              {/* Internal items specifically addressing the five requested datapoints */}
              <div className="space-y-2 text-[11px] text-neutral-600 font-semibold leading-snug">
                <div className="flex items-start gap-1">
                  <span className="text-red-500 shrink-0">•</span>
                  <span><strong>Tiempo sin pedir:</strong> {dataDetails.tiempoSinPedir}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-red-500 shrink-0">•</span>
                  <span><strong>Estabilidad/Inestabilidad:</strong> {dataDetails.estabilidad}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-red-500 shrink-0">•</span>
                  <span><strong>Consolidación del cliente:</strong> {dataDetails.consolidacion}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-red-500 shrink-0">•</span>
                  <span><strong>Número de meses:</strong> {dataDetails.numeroDeMeses}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-red-500 shrink-0">•</span>
                  <span><strong>Frecuencia de compra:</strong> {dataDetails.frecuenciaCompra}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE INTERACTIVE SYSTEM: MAIN TAB AND GENERAL SALES PROFILE */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Left Side: Dynamic Interactive Tabs Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-neutral-100 flex flex-col min-h-[420px]">
          {/* Tab Selection Row */}
          <div className="flex border-b border-neutral-100 px-6 pt-4 select-none">
            {(["historial", "seguimiento", "gamificacion", "contacto"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider relative transition-all duration-150 cursor-pointer ${
                  activeTab === tab
                    ? "text-[#E30613]"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {tab === "historial" && "Historial"}
                {tab === "seguimiento" && "Seguimiento"}
                {tab === "gamificacion" && "Gamificación"}
                {tab === "contacto" && "Contacto"}
                
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E30613]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* ACTIVE TAB BODY BLOCK */}
          <div className="p-6 flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                
                {/* 1. HISTORIAL TAB */}
                {activeTab === "historial" && (
                  <div className="space-y-4">
                    <p className="text-xs text-neutral-400 font-bold mb-4 select-none">
                      REGISTRO DE ÓRDENES Y ENTREGAS PROGRAMADAS
                    </p>
                    <div className="space-y-2.5">
                      {deliveries.map((item, idx) => {
                        const isExpanded = expandedDelivery === idx;
                        return (
                          <div
                            key={idx}
                            className="border border-neutral-150/60 rounded-xl overflow-hidden hover:bg-neutral-50/[0.02] transition"
                          >
                            <div
                              onClick={() => setExpandedDelivery(isExpanded ? null : idx)}
                              className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-3.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-neutral-700">{item.date}</span>
                                <span className="text-xs font-black text-neutral-900">{item.amount}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 text-[9px] font-black text-emerald-500 bg-emerald-50 rounded uppercase tracking-wider">
                                  {item.status}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                                )}
                              </div>
                            </div>

                            {/* Collapsible list elements details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-neutral-100 bg-neutral-50/50 overflow-hidden"
                                >
                                  <div className="p-4 space-y-1.5 text-xs text-neutral-500 font-semibold pl-10">
                                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider mb-2">
                                      Productos Surtidos:
                                    </p>
                                    {item.details.map((sub, sIdx) => (
                                      <p key={sIdx} className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                        {sub}
                                      </p>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. SEGUIMIENTO TAB (Timeline + New Interaction notes) */}
                {activeTab === "seguimiento" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between select-none">
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                        Bitácora de Retención del Cliente
                      </p>
                      
                      {!isAddingNote ? (
                        <button
                          onClick={() => setIsAddingNote(true)}
                          className="flex items-center gap-1 px-3 py-1 bg-[#E30613] hover:bg-[#c20510] text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Agregar seguimiento
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAddingNote(false)}
                          className="text-xs text-neutral-400 hover:text-neutral-600 font-bold"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>

                    {/* Interactive add follow up note box */}
                    {isAddingNote && (
                      <motion.form
                        onSubmit={handleAddNote}
                        className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 space-y-3"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <textarea
                          required
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Escribe un comentario sobre la visita comercial o acuerdo..."
                          className="w-full h-20 p-3 bg-white text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-neutral-400"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {(["PENDIENTE", "SANEADO", "EN PROCESO"] as const).map((st) => (
                              <button
                                type="button"
                                key={st}
                                onClick={() => setAddNoteStatus(st)}
                                className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                                  addNoteStatus === st
                                    ? "bg-[#6b7280] text-white"
                                    : "bg-white hover:bg-neutral-100 text-neutral-500 border border-neutral-200"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E30613] text-white font-bold rounded-lg text-xs hover:bg-[#b5000b] transition cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> Guardar
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Timeline logs */}
                    <div className="space-y-4">
                      {timelineNotes.map((note, idx) => (
                        <div key={idx} className="p-4 bg-neutral-50/50 rounded-xl border border-neutral-100 flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-black text-[#E30613]">
                              {note.author.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs font-bold text-neutral-800">
                                {note.author} <span className="text-neutral-400 font-semibold text-[10px]">· {note.role}</span>
                              </p>
                              <span className="text-[10px] font-semibold text-neutral-400">{note.date}</span>
                            </div>
                            <p className="text-xs text-neutral-600 mt-2 italic leading-relaxed">
                              "{note.text}"
                            </p>
                            
                            {/* Follow up status badge */}
                            <div className="mt-3 flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md ${
                                note.status === "PENDIENTE"
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : note.status === "SANEADO"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-105"
                                  : "bg-blue-50 text-blue-605 border border-blue-105"
                              }`}>
                                {note.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. GAMIFICACIÓN TAB */}
                {activeTab === "gamificacion" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full select-none">
                    
                    {/* EcoDup points accumulator log card */}
                    <div className="bg-neutral-50/40 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-black uppercase text-amber-500 tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                            NIVEL ORO
                          </span>
                          <Award className="w-5 h-5 text-amber-400" />
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-neutral-400 font-bold">EcoDup Status del Socio</p>
                          <h4 className="text-2xl font-black text-neutral-800 tracking-tight">2,450 puntos</h4>
                          <span className="text-[10px] font-bold text-neutral-400">PUNTOS ACUMULADOS</span>
                        </div>

                        {/* Progress Bar representation */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                            <span>Siguiente meta: 3,000 pts</span>
                            <span>81%</span>
                          </div>
                          <div className="h-2 bg-neutral-200/70 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: "81%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500 font-bold">
                        <Clock className="w-4 h-4 text-amber-505" />
                        <span>Próximo premio: Enfriador eficiente (Subsidio 50%)</span>
                      </div>
                    </div>

                    {/* EcoDup Active campaigns */}
                    <div className="bg-neutral-50/40 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h4 className="text-sm font-black text-neutral-800">Programa de Modernización EcoDup</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                          Incentiva a este cliente a modernizar su tienda con un enfriador Eco. Al registrarse, ambos ganarán bonos de fidelidad y abasto de Arca Continental.
                        </p>
                      </div>

                      <div className="mt-6 select-none">
                        <button
                          onClick={() => alert(`Invitación para el Programa EcoDup enviada con éxito a ${store.name}`)}
                          className="w-full bg-[#E30613] hover:bg-[#b5000b] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Enviar invitación
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CONTACTO TAB AND ADVISOR SUB-MODULE */}
                {activeTab === "contacto" && (
                  <div className="space-y-6">
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider select-none">
                      Herramientas de Contacto Táctico
                    </p>

                    {/* Three custom specific cards from image 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
                      
                      <div className="p-4 rounded-xl border border-neutral-150 text-center space-y-2 hover:bg-neutral-50/30 transition">
                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                          <Activity className="w-4 h-4" />
                        </span>
                        <h5 className="text-xs font-black text-neutral-850">Buscar incidencias</h5>
                        <p className="text-[10px] text-neutral-400 font-medium">Analizar tickets de servicio abiertos</p>
                      </div>

                      <div className="p-4 rounded-xl border border-neutral-150 text-center space-y-2 hover:bg-neutral-50/30 transition">
                        <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                          <Building className="w-4 h-4" />
                        </span>
                        <h5 className="text-xs font-black text-neutral-850">Problemas en su zona</h5>
                        <p className="text-[10px] text-neutral-400 font-medium">Ver alertas logísticas regionales</p>
                      </div>

                      <div className="p-4 rounded-xl border border-neutral-150 text-center space-y-2 hover:bg-neutral-50/30 transition">
                        <span className="w-8 h-8 rounded-full bg-blue-105 text-blue-600 flex items-center justify-center mx-auto">
                          <UserCheck className="w-4 h-4" />
                        </span>
                        <h5 className="text-xs font-black text-neutral-850">Contactar para seguimiento</h5>
                        <p className="text-[10px] text-neutral-400 font-medium">Chat directo con soporte técnico</p>
                      </div>
                    </div>

                    {/* SPECIAL USER REQUEST: WhatsApp "Asignar a un asesor" sub-module */}
                    <div className="bg-neutral-50/60 rounded-xl p-5 border border-neutral-150 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                          MÓDULO WHATSAPP
                        </span>
                        <span className="text-xs text-neutral-850 font-bold">Asignar a un Asesor Especialista</span>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                        Para brindar una solución efectiva al riesgo de Churn, puedes delegar este caso de inmediato. Selecciona un asesor y el motivo correspondiente para enviarle un Whatsapp pre-llenado con todos los detalles de la tienda.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selector de Asesor */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase block">Seleccionar Asesor de Ruta</label>
                          <select
                            value={selectedAdvisor.name}
                            onChange={(e) => {
                              const match = advisors.find(a => a.name === e.target.value);
                              if (match) setSelectedAdvisor(match);
                            }}
                            className="w-full bg-white text-xs border border-neutral-150 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500/40 text-neutral-700 font-bold"
                          >
                            {advisors.map((adv) => (
                              <option key={adv.name} value={adv.name}>
                                {adv.name} ({adv.role})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Plantilla de Motivo */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase block">Plan de Acción / Motivo</label>
                          <select
                            value={assignReason}
                            onChange={(e) => setAssignReason(e.target.value)}
                            className="w-full bg-white text-xs border border-neutral-150 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500/40 text-neutral-700 font-bold"
                          >
                            <option value="Reactivación Urgente de Ruta">Reactivación Urgente de Ruta (Churn Alto)</option>
                            <option value="Reestructuración de Precios vs Competencia">Reestructuración de Precios vs Competencia</option>
                            <option value="Saneamiento de Crédito Pendiente">Saneamiento de Crédito Pendiente</option>
                            <option value="Impulso de Portafolio Mix Segundarias">Impulso de Portafolio Mix Segundarias</option>
                            <option value="Inscripción de Enfriador Eficiente EcoDup">Inscripción de Enfriador Eficiente EcoDup</option>
                          </select>
                        </div>
                      </div>

                      {/* Display advisor brief contact details */}
                      <div className="p-3.5 rounded-lg bg-white border border-neutral-150 flex flex-wrap gap-4 items-center justify-between">
                        <div className="text-xs">
                          <p className="font-bold text-neutral-800">{selectedAdvisor.name}</p>
                          <p className="text-neutral-400 text-[10px] mt-0.5">{selectedAdvisor.role} · {selectedAdvisor.email}</p>
                        </div>
                        <div className="text-xs text-right">
                          <span className="font-mono text-neutral-500">{selectedAdvisor.phone}</span>
                        </div>
                      </div>

                      {isAssignedMessage && (
                        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>¡Socio asignado correctamente! Redirigiendo WhatsApp...</span>
                        </div>
                      )}

                      {/* Green button modified with high preference for Assign advisor as requested */}
                      <button
                        onClick={handleAssignAdvisorWhatsApp}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.01] shadow-md flex items-center justify-center gap-2.5 cursor-pointer leading-none mt-2"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        Asignar a un asesor por WhatsApp
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Graph displaying Sales Trend (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase block">
              HISTÓRICO COMERCIAL
            </span>
            <h4 className="text-sm font-black text-neutral-800 leading-tight">
              SALES TREND (90 DAYS)
            </h4>
            
            <div className="flex items-baseline gap-2 pt-1 font-semibold select-none">
              <span className="text-2xl font-black text-neutral-900">$124.5k</span>
              <span className="text-[10px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> -12%
              </span>
            </div>
          </div>

          {/* High fidelity inline aesthetic SVG preview line chart */}
          <div className="h-44 w-full relative flex items-end justify-center select-none py-2 my-auto">
            {/* Draw a subtle grid */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-30 pointer-events-none">
              <div className="w-full h-px bg-neutral-200" />
              <div className="w-full h-px bg-neutral-200" />
              <div className="w-full h-px bg-neutral-200" />
              <div className="w-full h-px bg-neutral-200" />
            </div>

            {/* Simulated nice curves matching the exact mockup trend graph */}
            <svg className="w-full h-32 overflow-visible relative z-10" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E30613" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E30613" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <path
                d="M 0,25 C 20,40 30,10 50,30 C 70,50 80,10 100,28 L 100,50 L 0,50 Z"
                fill="url(#salesTrendGrad)"
              />
              {/* Line */}
              <path
                d="M 0,25 C 20,40 30,10 50,30 C 70,50 80,10 100,28"
                fill="none"
                stroke="#E30613"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Highlight interactive dot */}
              <circle cx="50" cy="30" r="3" fill="#E30613" stroke="white" strokeWidth="1.5" />
              <circle cx="100" cy="28" r="3" fill="#E30613" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-black text-neutral-450 uppercase font-mono tracking-widest pt-4 border-t border-neutral-100 select-none">
            <span>CDMX</span>
            <span>Ruta 14</span>
            <span>2026</span>
          </div>
        </div>

      </div>

    </div>
  );
}
