import React, { useState } from "react";
import { StoreItem } from "../types";
import { STORES } from "../data";
import {
  TrendingDown,
  TrendingUp,
  UserCheck,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp as TrendUp,
  Target,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Info,
  ChevronRight,
  MessageCircle,
  Clock,
  Calendar,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ActionPlanStore {
  storeId: string;
  storeName: string;
  currentRisk: number;
  planName: string;
  planType: "DESCUENTO" | "MODERNIZACION" | "CREDITO" | "AJUSTE_PRECIOS" | "STOCKOUT_SANEADO" | "ANALISIS_COOLER";
  planDescription: string;
  isApplied: boolean;
  advisorName: string;
  advisorRole: string;
  advisorPhone: string;
  advisorImage: string;
  projectedRiskDrop: number; // e.g. 15 for 15% predicted if executed correctly
  milestones: { title: string; desc: string; done: boolean }[];
  chartData: {
    week: string;
    real: number;        // Actual real-world observed risk line
    provisional: number; // Projected success line
  }[];
}

const ACTION_PLANS: ActionPlanStore[] = [
  {
    storeId: "MX-88421",
    storeName: "Abarrotes \"La Esperanza\"",
    currentRisk: 85,
    planName: "Plan de Activación de Ruta & Descuento Coaxial",
    planType: "DESCUENTO",
    planDescription: "Cupón directo del 15% para compras superiores a $3,500 en aguas purificadas Ciel y refrescos mix más ajuste de racks preferenciales.",
    isApplied: true,
    advisorName: "Ing. Roberto Salazar",
    advisorRole: "Asesor Senior CDMX",
    advisorPhone: "+525540391280",
    advisorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    projectedRiskDrop: 12,
    milestones: [
      { title: "Cupón del 15% enviado", desc: "Socio abrió notificación en portal oficial AC", done: true },
      { title: "Auditoría de exhibidores", desc: "Supervisor verificó espacios de competencia local", done: true },
      { title: "Captura de pedido reactivado", desc: "Colocación de volumen sugerido en almacén", done: false },
      { title: "Seguimiento post-venta", desc: "Llamada de satisfacción y abasto óptimo", done: false }
    ],
    chartData: [
      { week: "S1", real: 85, provisional: 85 },
      { week: "S2", real: 82, provisional: 60 },
      { week: "S3", real: 79, provisional: 35 },
      { week: "S4", real: 78, provisional: 12 }
    ]
  },
  {
    storeId: "MX-11209",
    storeName: "Mini Super El Paso",
    currentRisk: 72,
    planName: "Saneamiento de Abasto & Aseguramiento de Stockout",
    planType: "STOCKOUT_SANEADO",
    planDescription: "Garantía de inventario bajo contrato para evitar roturas de stock en líneas calientes de Coca-Cola saborizados.",
    isApplied: true,
    advisorName: "Jaime Ortega",
    advisorRole: "Gestor de Cuentas Clave",
    advisorPhone: "+525528374659",
    advisorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    projectedRiskDrop: 18,
    milestones: [
      { title: "Reserva de carga prioritaria", desc: "Alineación con el CEDIS para envío exprés", done: true },
      { title: "Instalación de kit de visibilidad", desc: "Material POP en barra de entrada principal", done: false },
      { title: "Compromiso de compra recurrente", desc: "Firma electrónica de frecuencia quincenal", done: false }
    ],
    chartData: [
      { week: "S1", real: 72, provisional: 72 },
      { week: "S2", real: 70, provisional: 55 },
      { week: "S3", real: 67, provisional: 32 },
      { week: "S4", real: 65, provisional: 18 }
    ]
  },
  {
    storeId: "MX-55234",
    storeName: "Tienda El Oasis",
    currentRisk: 88,
    planName: "Reestructuración Post-Suspensión de Canal de Ruta",
    planType: "AJUSTE_PRECIOS",
    planDescription: "Ajuste de precio preferencial frente a la competencia de conveniencia cercana acompañado de un descuento especial por apertura.",
    isApplied: true,
    advisorName: "Lic. Diana Pérez",
    advisorRole: "Coordinadora Comercial",
    advisorPhone: "+525519827364",
    advisorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    projectedRiskDrop: 15,
    milestones: [
      { title: "Plan de precios autorizado", desc: "Aprobación de tarifa especial de embotellado", done: true },
      { title: "Visita comercial especial", desc: "Reunión de reactivación directa en el local", done: true },
      { title: "Adquisición de primer lote", desc: "Pedido mínimo para validar el descuento", done: false }
    ],
    chartData: [
      { week: "S1", real: 88, provisional: 88 },
      { week: "S2", real: 85, provisional: 50 },
      { week: "S3", real: 84, provisional: 24 },
      { week: "S4", real: 82, provisional: 15 }
    ]
  },
  {
    storeId: "MX-99412",
    storeName: "Super Don Memo",
    currentRisk: 91,
    planName: "Modernización EcoDup & Crédito Flexible",
    planType: "MODERNIZACION",
    planDescription: "Cambio de enfriador comercial antiguo por uno de alta eficiencia Eco con subsidio y renegociación de crédito atrasado.",
    isApplied: false,
    advisorName: "Sofia Medina",
    advisorRole: "Especialista en Reactivación",
    advisorPhone: "+525590817263",
    advisorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    projectedRiskDrop: 22,
    milestones: [
      { title: "Evaluación técnica de energía", desc: "Validación de consumo de luz del enfriador actual", done: true },
      { title: "Aprobación de subsidio EcoDup", desc: "Descuento del 50% otorgado por comité", done: false },
      { title: "Saneamiento de deuda", desc: "Plan de pagos a 6 meses sin recargos", done: false }
    ],
    chartData: [
      { week: "S1", real: 91, provisional: 91 },
      { week: "S2", real: 90, provisional: 68 },
      { week: "S3", real: 89, provisional: 40 },
      { week: "S4", real: 89, provisional: 22 }
    ]
  },
  {
    storeId: "MX-40291",
    storeName: "Tienda Mary",
    currentRisk: 48,
    planName: "Plan Mix Segundarias de Mayor Margen",
    planType: "CREDITO",
    planDescription: "Ampliación de portafolio para incorporar aguas saborizadas exóticas y tés de alta demanda con apoyo en cartelería exterior.",
    isApplied: true,
    advisorName: "Jaime Ortega",
    advisorRole: "Gestor de Cuentas Clave",
    advisorPhone: "+525528374659",
    advisorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    projectedRiskDrop: 10,
    milestones: [
      { title: "Surtido piloto programado", desc: "Entrega de mix con 10% de volumen de regalo", done: true },
      { title: "Colocación de publicidad", desc: "Instalación de lona promocional frontal", done: true },
      { title: "Primer corte de ventas", desc: "Validación de rotación de producto semanal", done: true }
    ],
    chartData: [
      { week: "S1", real: 48, provisional: 48 },
      { week: "S2", real: 46, provisional: 30 },
      { week: "S3", real: 44, provisional: 18 },
      { week: "S4", real: 41, provisional: 10 }
    ]
  },
  {
    storeId: "MX-33054",
    storeName: "Miscelánea Gaby",
    currentRisk: 68,
    planName: "Plan de Optimización y Diagnóstico de Coolers Arca",
    planType: "ANALISIS_COOLER",
    planDescription: "Monitoreo preventivo de equipos de refrigeración comercial (coolers), análisis de eficiencia eléctrica, optimización del posicionamiento visual de las exhibiciones frías y purga planificada de enfriadores obsoletos.",
    isApplied: true,
    advisorName: "Ing. Alejandro Mendoza",
    advisorRole: "Inspector Técnico de Equipos",
    advisorPhone: "+525530182495",
    advisorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    projectedRiskDrop: 14,
    milestones: [
      { title: "Inspección técnica de coolers", desc: "Verificación de temperatura interior y estado del compresor", done: true },
      { title: "Limpieza profunda de parrillas condensadoras", desc: "Eliminación de obstrucciones para flujo óptimo de aire", done: true },
      { title: "Reubicación estratégica de equipos", desc: "Alineación en primera visual a la entrada del local", done: false },
      { title: "Sustitución de refacciones de iluminación", desc: "Cambio de tubos antiguos por tira LED ecológica", done: false }
    ],
    chartData: [
      { week: "S1", real: 68, provisional: 68 },
      { week: "S2", real: 64, provisional: 48 },
      { week: "S3", real: 61, provisional: 30 },
      { week: "S4", real: 58, provisional: 14 }
    ]
  }
];

export default function AnalyticsView() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("MX-88421");
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const [whatsAppSent, setWhatsAppSent] = useState(false);

  // Find the selected strategic action plan details
  const activePlan = ACTION_PLANS.find((p) => p.storeId === selectedPlanId) || ACTION_PLANS[0];

  // Helper colors for plan types
  const getPlanTypeBadge = (type: string) => {
    switch (type) {
      case "DESCUENTO":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "MODERNIZACION":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CREDITO":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "AJUSTE_PRECIOS":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ANALISIS_COOLER":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const currentHoveredPoint = hoveredWeek 
    ? activePlan.chartData.find(d => d.week === hoveredWeek) 
    : activePlan.chartData[activePlan.chartData.length - 1];

  const handleSendWhatsAppNotification = () => {
    const text = `Hola ${activePlan.advisorName}, te contacto desde el panel de Supervisión. Estoy revisando la proyección analítica de la tienda "${activePlan.storeName}" (Plan: ${activePlan.planName}). Si aplicas las metas de manera correcta, predecimos bajar el riesgo de Churn hasta un ${activePlan.projectedRiskDrop}% (actualmente en ${activePlan.currentRisk}%). Tu seguimiento asignado debe estar al día. ¡Cuento con tu apoyo!`;
    const url = `https://api.whatsapp.com/send?phone=${activePlan.advisorPhone}&text=${encodeURIComponent(text)}`;
    
    setWhatsAppSent(true);
    setTimeout(() => setWhatsAppSent(false), 3000);
    window.open("https://tuali.com/blog/ ", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header section */}
      <div>
        <span className="text-[#E30613] text-[10px] font-black uppercase tracking-widest block">
          MOTOR DE ANALÍTICA PREDICTIVA
        </span>
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Proyección del Plan de Acción y Contraste Real
        </h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">
          Visualiza el impacto predictivo de la retención activa frente a las métricas reales del punto de venta
        </p>
      </div>

      {/* Main layout setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start select-none">
        
        {/* Left column: List of high-risk enterprises with corresponding action plans & Tuali Blog */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-150 divide-y divide-neutral-100 overflow-hidden">
            <div className="p-4 bg-neutral-50/65">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">
                SELECCIÓN DE SOCIOS COMERCIALES
              </span>
              <p className="text-xs text-neutral-600 font-bold mt-1">
                Casos con Plan Activo de Mitigación
              </p>
            </div>
            
            <div className="divide-y divide-neutral-100 max-h-[460px] overflow-y-auto">
              {ACTION_PLANS.map((plan) => {
                const remainsCritical = plan.currentRisk >= 75;
                const isSelected = plan.storeId === selectedPlanId;

                return (
                  <div
                    key={plan.storeId}
                    onClick={() => setSelectedPlanId(plan.storeId)}
                    className={`p-4 transition cursor-pointer flex items-center justify-between gap-3 text-left ${
                      isSelected ? "bg-red-500/[0.02] border-l-4 border-[#E30613]" : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="min-w-0 flex-grow">
                      <p className={`text-xs font-black truncate transition ${isSelected ? "text-[#E30613]" : "text-neutral-800"}`}>
                        {plan.storeName}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-bold truncate mt-1">
                        {plan.planName}
                      </p>
                      
                      {/* Tiny badges summarizing info */}
                      <div className="flex gap-1.5 mt-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200/60 bg-white font-mono text-neutral-500 select-none">
                          {plan.storeId}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border text-center ${getPlanTypeBadge(plan.planType)}`}>
                          {plan.planType}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-neutral-400 block font-sans">Riesgo</span>
                        <span className={`text-base font-black ${remainsCritical ? "text-red-500" : "text-neutral-700"}`}>
                          {plan.currentRisk}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Bottom quick informative stats */}
            <div className="p-4 bg-neutral-50/60 flex justify-between items-center text-[10px] font-bold text-neutral-450 uppercase font-mono tracking-widest">
              <span>Ruta 14 CDMX</span>
              <span>Total: {ACTION_PLANS.length} Planes</span>
            </div>
          </div>

          {/* NUEVO MÓDULO: Conexión a Blog de Tuali */}
          <div className="bg-gradient-to-br from-red-50/50 to-white rounded-2xl p-6 border border-neutral-150 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#E30613] shrink-0 border border-red-100">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">
                  HERRAMIENTA INTEGRANTE
                </span>
                <h3 className="text-sm font-black text-neutral-850">
                  Capacitación y Blog de Tuali
                </h3>
              </div>
            </div>

            <p className="text-[11.5px] text-neutral-500 font-semibold leading-relaxed">
              Consulta las mejores guías de fidelización, capacitación de tenderos y tendencias del microcomercio redactadas por líderes de Arca Continental.
            </p>

            {/* Redirection Button for user insertable URL */}
            <button
              onClick={() => {
                // REDIRECT ACTION LINK: You can change the URL below to any blog URL.
                window.open("https://tuali.com/blog/", "_blank", "noopener,noreferrer");
              }}
              className="w-full bg-[#E30613] hover:bg-neutral-900 hover:scale-[1.02] text-white text-[11px] font-extrabold uppercase tracking-wide py-3 px-4 rounded-xl shadow-xs transition duration-150 flex items-center justify-center gap-2 border-0 cursor-pointer"
              title="Conectar a Blog de Tuali"
              id="tuali-blog-integration-btn"
            >
              <span>Ir a Blog de Tuali</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right column: Impact projections and dynamic comparative chart */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Core high accuracy detail block */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-150 space-y-6">
            
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">
                  ANÁLISIS ESTRATÉGICO SELECCIONADO
                </span>
                <h3 className="text-lg md:text-xl font-black text-neutral-900 tracking-tight">
                  {activePlan.storeName}
                </h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  Plan vigente: <strong className="text-neutral-700">{activePlan.planName}</strong>
                </p>
              </div>

              {/* Status Indicator Badge */}
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border  ${
                activePlan.isApplied 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-neutral-50 text-neutral-450 border-neutral-150"
              }`}>
                {activePlan.isApplied ? "● EJECUCION ACTIVA" : "○ REVISIÓN PENDIENTE"}
              </span>
            </div>

            {/* Plan dynamic descriptive content */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 text-xs font-semibold text-neutral-600 leading-relaxed">
              <p className="font-bold text-neutral-800 mb-1 uppercase text-[9.5px] tracking-wider text-[#b5000b]">
                Descripción del Plan de Acción asignado:
              </p>
              {activePlan.planDescription}
            </div>

            {/* THREE COLUMNS DETAILING THE PILLAR REQUESTS FROM USER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1: El Plan y su avance */}
              <div className="p-4 rounded-xl border border-neutral-150 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-[#E30613] uppercase tracking-widest block mb-2">
                    01 · Plan & Avance
                  </span>
                  <h4 className="text-xs font-bold text-neutral-800 uppercase">HITOS COMERCIALES</h4>
                  
                  {/* Staggered mini-checks */}
                  <div className="space-y-2.5 mt-3 select-none">
                    {activePlan.milestones.map((ms, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10.5px]">
                        <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${ms.done ? "text-emerald-500 fill-current" : "text-neutral-200"}`} />
                        <div className="min-w-0">
                          <p className={`font-black ${ms.done ? "text-neutral-700 line-through" : "text-neutral-550"}`}>{ms.title}</p>
                          <p className="text-[9.5px] text-neutral-400 font-semibold">{ms.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pillar 2: Asesor que da Seguimiento */}
              <div className="p-4 rounded-xl border border-neutral-150 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-2">
                    02 · Seguimiento Asignado
                  </span>
                  <h4 className="text-xs font-bold text-neutral-800 uppercase">ASESOR RESPONSABLE</h4>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={activePlan.advisorImage}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-150 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-neutral-800 leading-snug">{activePlan.advisorName}</p>
                      <p className="text-[9.5px] text-neutral-400 font-semibold mt-0.5">{activePlan.advisorRole}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-500 italic mt-3 leading-relaxed">
                    Soporte telefónico activo para visitas en terreno y cierres.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <button
                    onClick={handleSendWhatsAppNotification}
                    className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    Enviar WhatsApp
                  </button>
                  {whatsAppSent && (
                    <p className="text-center text-[9px] text-emerald-500 font-bold mt-1">¡Redirigiendo...!</p>
                  )}
                </div>
              </div>

              {/* Pillar 3: Predicción con ejecución correcta */}
              <div className="p-4 rounded-xl border border-neutral-150 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-1">
                    03 · Target de Éxito
                  </span>
                  <h4 className="text-xs font-bold text-neutral-800 uppercase">PREDICCIÓN DE ÉXITO</h4>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-baseline justify-between select-none border-b border-neutral-100 pb-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Riesgo Inicial</span>
                      <span className="text-base font-black text-neutral-800">{activePlan.currentRisk}%</span>
                    </div>

                    <div className="flex items-baseline justify-between select-none border-b border-neutral-100 pb-2">
                      <span className="text-[10px] font-bold text-neutral-405 uppercase">Proyección Éxito</span>
                      <span className="text-lg font-black text-emerald-500 tracking-tight">
                        {activePlan.projectedRiskDrop}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between select-none">
                      <span className="text-[10px] font-bold text-neutral-405 uppercase">Mejora Neta</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        -{activePlan.currentRisk - activePlan.projectedRiskDrop}% Churn
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[9.5px] text-neutral-400 font-semibold leading-relaxed mt-4 pt-2 border-t border-neutral-50 italic">
                  *Proyectado utilizando simulaciones neuronales sobre datos de ruta recurrentes.
                </div>
              </div>

            </div>

            {/* PREDICTIVE GRAPHS COMPARATIVE CONTRAST (SVGs) */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider">
                    GRÁFICA DE CONTRASTE: RIESGO REAL VS. PROYECTADO
                  </h4>
                  <p className="text-[10.5px] text-neutral-400 font-semibold mt-0.5">
                    Modula el escenario ideal (si hace correctamente el seguimiento) versus el estado real de la tienda
                  </p>
                </div>
                
                {/* Legends */}
                <div className="flex gap-4 text-[9.5px] font-bold uppercase select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#E30613]" />
                    <span className="text-neutral-500">CONTRASTE REAL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-dashed border-t-2 border-dashed border-emerald-500" />
                    <span className="text-neutral-500">PROYECCIÓN IDEAL</span>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Plotting layout */}
              <div className="h-56 bg-neutral-50/50 rounded-xl relative border border-neutral-100 flex flex-col justify-between p-6">
                
                {/* Visual coordinate Grid lines */}
                <div className="absolute inset-x-0 top-6 bottom-14 flex flex-col justify-between opacity-20 pointer-events-none">
                  {[100, 75, 50, 25, 0].map((val) => (
                    <div key={val} className="w-full flex items-center gap-3">
                      <span className="text-[8.5px] font-bold text-neutral-400 font-mono w-4 text-right">
                        {val}%
                      </span>
                      <div className="h-px bg-neutral-400 flex-grow" />
                    </div>
                  ))}
                </div>

                {/* Plot Area */}
                <div className="flex-grow w-full relative h-[140px] pl-8">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    
                    {/* Define gradients */}
                    <defs>
                      <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E30613" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#E30613" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Proyección Ideal Shaded area (weeks are spread as X: 10, 40, 70, 100) */}
                    {/* Points mapped: [85, 60, 35, 12] or matched based on activePlan.chartData */}
                    {(() => {
                      const data = activePlan.chartData;
                      const p1 = 100 - data[0].provisional;
                      const p2 = 100 - data[1].provisional;
                      const p3 = 100 - data[2].provisional;
                      const p4 = 100 - data[3].provisional;

                      const r1 = 100 - data[0].real;
                      const r2 = 100 - data[1].real;
                      const r3 = 100 - data[2].real;
                      const r4 = 100 - data[3].real;

                      return (
                        <>
                          {/* Ideal Area */}
                          <path
                            d={`M 10,${p1} L 40,${p2} L 70,${p3} L 100,${p4} L 100,100 L 10,100 Z`}
                            fill="url(#projGrad)"
                            className="transition-all duration-300"
                          />
                          {/* Ideal Line (Emerald) */}
                          <path
                            d={`M 10,${p1} L 40,${p2} L 70,${p3} L 100,${p4}`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeDasharray="4 3"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />

                          {/* Real Area */}
                          <path
                            d={`M 10,${r1} L 40,${r2} L 70,${r3} L 100,${r4} L 100,100 L 10,100 Z`}
                            fill="url(#realGrad)"
                            className="transition-all duration-300"
                          />
                          {/* Real Line (Red) */}
                          <path
                            d={`M 10,${r1} L 40,${r2} L 70,${r3} L 100,${r4}`}
                            fill="none"
                            stroke="#E30613"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />

                          {/* Interaction circles */}
                          {[
                            { x: 10, realVal: data[0].real, idealVal: data[0].provisional, label: "S1" },
                            { x: 40, realVal: data[1].real, idealVal: data[1].provisional, label: "S2" },
                            { x: 70, realVal: data[2].real, idealVal: data[2].provisional, label: "S3" },
                            { x: 100, realVal: data[3].real, idealVal: data[3].provisional, label: "S4" }
                          ].map((pt, idx) => {
                            const isAct = hoveredWeek === pt.label;
                            return (
                              <g key={idx} className="cursor-pointer">
                                <circle
                                  cx={pt.x}
                                  cy={100 - pt.realVal}
                                  r={isAct ? 5 : 3.5}
                                  fill="#E30613"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  onMouseEnter={() => setHoveredWeek(pt.label)}
                                  onMouseLeave={() => setHoveredWeek(null)}
                                />
                                <circle
                                  cx={pt.x}
                                  cy={100 - pt.idealVal}
                                  r={isAct ? 5 : 3.5}
                                  fill="#10b981"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  onMouseEnter={() => setHoveredWeek(pt.label)}
                                  onMouseLeave={() => setHoveredWeek(null)}
                                />
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}

                  </svg>
                </div>

                {/* Weeks axis row */}
                <div className="flex justify-between text-[10px] font-black text-neutral-400 uppercase font-mono tracking-wider pl-8 select-none z-15 mt-3">
                  <span>Semana 1 (Asignación)</span>
                  <span>Semana 2 (Visita)</span>
                  <span>Semana 3 (Ajuste)</span>
                  <span>Semana 4 (Reactivado)</span>
                </div>

                {/* Mini interactive tooltip overlay */}
                <div className="absolute top-2 left-6 bg-white/95 backdrop-blur-xs border border-neutral-150/70 rounded-lg p-2.5 shadow-xs text-[11px] flex gap-4 select-none z-20">
                  <div>
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase font-sans">Semana Activa</span>
                    <span className="font-extrabold text-neutral-800">{currentHoveredPoint ? currentHoveredPoint.week : "S4"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-red-500 block font-bold uppercase font-sans">Riesgo Real</span>
                    <span className="font-black text-[#E30613]">{currentHoveredPoint ? currentHoveredPoint.real : "78"}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-500 block font-bold uppercase font-sans">Proyección Éxito</span>
                    <span className="font-black text-emerald-600">{currentHoveredPoint ? currentHoveredPoint.provisional : "12"}%</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
