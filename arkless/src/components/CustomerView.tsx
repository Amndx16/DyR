import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Store,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Award,
  ArrowUpRight,
  CheckCircle2,
  Truck,
  TrendingUp,
  Clock,
  ChevronRight,
  ChevronDown,
  Calendar,
  Eye,
  MessageSquare,
  Send,
  HelpCircle,
  ExternalLink,
  BookOpen,
  MapPin,
  Smile,
  ShieldCheck,
  Zap,
  Info,
  Gift,
  Volume2
} from "lucide-react";
import { STORES } from "../data";
import ArklessLogo from "./ArklessLogo";

interface CustomerViewProps {
  onBackToLanding: () => void;
  autoOpenEasyTutorial?: boolean;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string | React.ReactNode;
  time: string;
}

export default function CustomerView({ onBackToLanding, autoOpenEasyTutorial = false }: CustomerViewProps) {
  // Assume logged in store is "Abarrotes La Esperanza" (from data.ts / STORES)
  const store = STORES.find((s) => s.id === "MX-88421") || STORES[0];

  // Senior Accessibility Tutorial states
  const [viewTualiEasyTutorial, setViewTualiEasyTutorial] = useState(autoOpenEasyTutorial);
  const [activeTutorialTask, setActiveTutorialTask] = useState<"sales" | "actionPlan" | "rewards" | null>(null);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [speakingText, setSpeakingText] = useState("¡Hola Don Carlos! Bienvenido a tu ayudante de Tuali. Presiona un botón para guiarte paso a paso.");
  const [demoProduct, setDemoProduct] = useState("Coca-Cola Original 2.5L");
  const [demoQuantity, setDemoQuantity] = useState(12);
  const [demoMerma, setDemoMerma] = useState(0);
  const [demoRewardClaimed, setDemoRewardClaimed] = useState(false);

  // EcoDup point counters
  const [ecoDupPoints, setEcoDupPoints] = useState(340);
  const [currentRank, setCurrentRank] = useState(3);
  const [activePlanId, setActivePlanId] = useState("plan-1");
  const [unidadesSugeridas, setUnidadesSugeridas] = useState({
    coke: 24,
    ciel: 18,
    sprite: 12
  });

  const [notification, setNotification] = useState<string | null>(null);

  // EcoDup view state and variables
  const [viewEcoDup, setViewEcoDup] = useState(false);
  const [ecoPoints, setEcoPoints] = useState(840);
  const [totalPoints, setTotalPoints] = useState(840);
  const [redeemablePoints, setRedeemablePoints] = useState(420);

  // EcoDup form variables
  const [selectedEcoProduct, setSelectedEcoProduct] = useState("");
  const [ecoUnitsSold, setEcoUnitsSold] = useState("");
  const [ecoUnitsRemaining, setEcoUnitsRemaining] = useState("");
  const [ecoUnitsMerma, setEcoUnitsMerma] = useState("");

  const [reportedSales, setReportedSales] = useState([
    { id: 1, date: "05 Jun", product: "Coca-Cola Original 2.5L", unitsSold: 18, unitsLeft: 6, waste: 0, pointsGained: 50 },
    { id: 2, date: "02 Jun", product: "Agua Ciel Purificada 1L", unitsSold: 24, unitsLeft: 12, waste: 2, pointsGained: 50 },
  ]);

  // Selector list of client-side strategic plans
  const clientPlans = [
    {
      id: "plan-1",
      name: "Plan Más Vendidos de Tuali",
      description: "Maximiza rotación incorporando canastas de Coca-Cola Original, tés Ciel y pack premium.",
      savings: "$350 MXN de bonificación",
      units: { coke: 24, ciel: 18, sprite: 12 }
    },
    {
      id: "plan-2",
      name: "Plan Impulso Verano Saborizados",
      description: "Alineación de vitrina con refrigeradores eficientes y stock duplicado de jugos secundarios.",
      savings: "$520 MXN + 80 pts EcoDup",
      units: { coke: 36, ciel: 12, sprite: 24 }
    },
    {
      id: "plan-3",
      name: "Plan Reactivación Básica de Almacén",
      description: "Reabastece racks críticos con bajo presupuesto y un plazo de crédito extendido a 15 días.",
      savings: "Plazo ampliado + Envío exprés gratis",
      units: { coke: 12, ciel: 48, sprite: 6 }
    }
  ];

  const activePlan = clientPlans.find(p => p.id === activePlanId) || clientPlans[0];

  // Chat message logs and states for tuali custom chat requested
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "¡Hola! Soy tu asistente virtual de Tuali. ¿Cómo te puedo apoyar el día de hoy? Selecciona una de las opciones rápidas o escribe tu consulta.",
      time: "9:40 AM"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Trigger brief alert banner notifications
  const triggerAlert = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const speakText = (text: string, force = false) => {
    setSpeakingText(text);
    if ((isVoiceOn || force) && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-MX";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setActivePlanId(planId);
    const plan = clientPlans.find(p => p.id === planId);
    if (plan) {
      setUnidadesSugeridas(plan.units);
      triggerAlert(`Has seleccionado el "${plan.name}". Unidades actualizadas en tu previsualización.`);
    }
  };

  // Pre-loaded custom dialog action scripts for the four queries requested by the user
  const handleKeywordAction = (actionKey: "especifico" | "planes" | "acceder" | "blog") => {
    let userText = "";
    let assistantResponse: React.ReactNode = "";

    switch (actionKey) {
      case "especifico":
        userText = "🔍 Encontrar algo en específico para mi tienda";
        assistantResponse = (
          <div className="space-y-2">
            <p>Claro, he buscado en el catálogo de abasto de Arca Continental asociado a tu zona (Miguel Hidalgo, CDMX). Aquí tienes los productos disponibles con ofertas reservadas para ti hoy:</p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-sans text-neutral-850">
              <div className="p-2 rounded bg-neutral-100/60 border border-neutral-150">
                <p className="font-extrabold text-[#E30613]">Coca-Cola 2.5L</p>
                <p className="text-[10px] text-neutral-400">12% Descuento directo</p>
              </div>
              <div className="p-2 rounded bg-neutral-100/60 border border-neutral-150">
                <p className="font-extrabold text-[#E30613]">Agua Ciel 1L</p>
                <p className="text-[10px] text-neutral-400">Paga 5 lleva 6</p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 italic">Puedes añadir estas promociones directo de tu panel de Plan de Acción haciendo clic en "Aceptar y Pedir".</p>
          </div>
        );
        break;

      case "planes":
        userText = "📈 Encontrar planes para mejorar mis ventas de tuali";
        assistantResponse = (
          <div className="space-y-2 text-neutral-700">
            <p>¡Excelente decisión! He preparado tres recomendaciones personalizadas en la sección de planes de acción:</p>
            <ol className="list-decimal pl-4 space-y-1 text-xs">
              <li><strong>Plan Más Vendidos:</strong> Surtido veloz optimizando la visibilidad del portafolio.</li>
              <li><strong>Plan Impulso Verano:</strong> Prioriza la rotación de jugos del segmento secundario.</li>
              <li><strong>Plan Reactivación Básica:</strong> Ideal para recuperar volumen de compra con baja inversión inicial.</li>
            </ol>
            <p>Te sugerimos coordinar con tu asesor <strong>Carlos M.</strong> para su implementación en ruta de mañana.</p>
          </div>
        );
        break;

      case "acceder":
        userText = "🔑 ¿Cómo acceder a tuali?";
        assistantResponse = (
          <div className="space-y-1.5 text-neutral-700">
            <p>Acceder a la plataforma de <strong>Tuali</strong> es rápido siguiendo estos simples pasos:</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>Introduce tu número de identificador de cliente <strong>(ID: MX-88421)</strong>.</li>
              <li>La app móvil te enviará un PIN seguro vía SMS al celular registrado de tu tienda.</li>
              <li>¡Listo! Podrás canjear tus puntos <strong>EcoDup</strong> y consultar fechas de resurtido al instante.</li>
            </ul>
          </div>
        );
        break;

      case "blog":
        userText = "📰 Ir al blog de tuali";
        assistantResponse = (
          <div className="space-y-2">
            <p>¡Te damos la bienvenida al blog oficial de éxito para tiendas tradicionales de Tuali!</p>
            <p>Últimos artículos publicados del mes de Junio 2026:</p>
            <div className="space-y-1.5 text-[11px] text-neutral-500 font-sans">
              <a href="#art1" className="text-[#E30613] hover:underline block font-semibold flex items-center gap-1">
                • 5 formas de combatir las mermas de tus neveras de bebida <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#art2" className="text-[#E30613] hover:underline block font-semibold flex items-center gap-1">
                • Cómo los enfriadores eficientes EcoDup te ahorran hasta 35% de luz <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        );
        break;
    }

    // Add user message to state
    const newMsgList: ChatMessage[] = [
      ...messages,
      { sender: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMsgList);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: assistantResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const newMsgList: ChatMessage[] = [
      ...messages,
      { sender: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMsgList);
    setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: `Entendido sobre "${userText}". Estoy analizando tu base de datos para ofrecerte mejores sugerencias y actualizar tu stock sugerido de ruta de manera automática. Te sugiero también revisar los Planes de Acción de la izquierda.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1100);
  };

  const executeOrderCheckout = () => {
    setEcoDupPoints(prev => prev + 45);
    triggerAlert(`¡Hecho! Unidades confirmadas y cargadas en tu próximo resurtido de Ruta (16 de Jun). +45 Puntos EcoDup.`);
  };

  if (viewEcoDup) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] text-neutral-800 flex flex-col justify-between">
        
        {/* 1. TOP BANNER HEADER */}
        <header className="h-16 px-6 md:px-10 flex justify-between items-center bg-white border-b border-neutral-100 shadow-xs z-30 select-none">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewEcoDup(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-all cursor-pointer"
              title="Volver a la vista general"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700" />
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-neutral-900 font-sans tracking-tight flex items-center gap-1.5 text-emerald-600">
                <span>Tablero Eco-Dup</span>
              </h1>
              <span className="bg-[#22c55e]/10 text-[#15803d] border border-[#22c55e]/15 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold select-none">
                Socio Activo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-neutral-400 hover:text-neutral-700 transition relative">
              <div className="absolute right-1.5 top-1.5 w-2 h-2 bg-[#10b981] rounded-full" />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="flex items-center gap-2 p-1.5 rounded-full border border-neutral-150 bg-white select-none">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80"
                alt="Avatar Tienda"
                className="w-6 h-6 rounded-full object-cover border border-neutral-100"
              />
              <span className="text-[10px] font-bold text-neutral-600 pr-2 truncate max-w-[130px] hidden sm:inline">
                Don Carlos Ortiz
              </span>
            </div>
          </div>

        </header>

        {/* Dynamic Alerts */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-20 right-6 left-6 md:left-auto md:w-96 z-50 p-4 bg-emerald-650 text-white font-bold rounded-xl shadow-lg flex items-center gap-2.5 text-xs select-none"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. MAIN CONTAINER */}
        <main className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-grow space-y-6">
          
          {/* EcoDup Title block with leaf conifer icon matching image */}
          <div className="bg-[#eaf6ee] border border-[#cbeadd] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none">
            <div className="absolute right-6 bottom-0 translate-y-1/4 opacity-10 text-emerald-600 transform scale-150 pointer-events-none">
              <svg className="w-44 h-44" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 4l6.5 11.5H5.5L12 6z"/>
              </svg>
            </div>

            <div className="space-y-2.5 max-w-2xl z-10">
              <div className="flex items-center gap-2.5 text-[#16a34a]">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 1a1 1 0 011-1h10a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V1zm1 1v16h10V2H5z"/>
                  <path d="M8 4a1 1 0 000 2h4a1 1 0 100-2H8zm-2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"/>
                </svg>
                <h1 className="text-3xl font-black tracking-tight text-neutral-900" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  EcoDup
                </h1>
              </div>
              <p className="text-xs text-neutral-600 font-bold leading-relaxed">
                Registra tus ventas, gana puntos y ayuda a Arca a predecir mejor. Juntos reducimos la merma y aumentamos la frescura.
              </p>
            </div>
            
            <button
              onClick={() => setViewEcoDup(false)}
              className="bg-white border border-[#cbeadd] text-xs font-bold text-neutral-700 px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition shrink-0 cursor-pointer shadow-2xs"
            >
              ← Volver al Portal de Socios
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Puntos + Formulario Reportar (col-span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Puntos e Indicadores de Nivel */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-150/70 shadow-2xs space-y-5">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Circular Arc-Gauge */}
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center select-none bg-[#e8f6f0]/40 rounded-full border border-[#10b981]/10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="55"
                        className="stroke-neutral-100"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="55"
                        stroke="currentColor"
                        className="text-emerald-500 transition-all duration-500"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 55}
                        strokeDashoffset={2 * Math.PI * 55 * (1 - ecoPoints / 1000)}
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-neutral-900 tracking-tight font-sans">
                        {ecoPoints}
                      </span>
                      <span className="text-[9.5px] text-neutral-450 font-extrabold uppercase mt-0.5">
                        / 1000 pts
                      </span>
                    </div>
                  </div>

                  {/* Level text details */}
                  <div className="space-y-4 flex-grow text-center md:text-left">
                    <div className="space-y-1.5">
                      <span className="bg-[#10b981]/10 text-emerald-700 border border-[#10b981]/25 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                        ★ NIVEL 2 - TIENDA ACTIVA ⚡
                      </span>
                      <p className="text-xs text-neutral-500 font-bold">
                        Has desbloqueado promociones de volumen preferenciales y bonos en refrescos.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-b border-neutral-100 py-3 text-center">
                      <div>
                        <p className="text-[9px] font-black text-neutral-400 uppercase">Este Mes</p>
                        <p className="text-base font-black text-neutral-800">+150</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-neutral-400 uppercase">Total</p>
                        <p className="text-base font-black text-neutral-800">{totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-neutral-400 uppercase">Canjeables</p>
                        <p className="text-base font-black text-emerald-600">{redeemablePoints}</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#10b981] font-bold italic flex items-center justify-center md:justify-start gap-1">
                      <span>🌿 A {1000 - ecoPoints} pts del Nivel 3 - Tienda Comprometida</span>
                    </p>
                  </div>

                </div>
              </div>

              {/* Card 2: Reporte de Ventas Form & Merma */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-150/70 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-neutral-800 tracking-tight">
                      Reporta tus ventas
                    </h3>
                    <p className="text-[11px] text-neutral-450 font-semibold mt-0.5">
                      Registra el movimiento diario para optimizar tus márgenes y envíos
                    </p>
                  </div>
                  <span className="bg-[#10b981]/10 text-[#15803d] text-[9.5px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg">
                    🟢 gana 50 pts por reporte
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!selectedEcoProduct) {
                      triggerAlert("Por favor selecciona un producto válido.");
                      return;
                    }
                    const sold = parseInt(ecoUnitsSold) || 0;
                    const left = parseInt(ecoUnitsRemaining) || 0;
                    const mermed = parseInt(ecoUnitsMerma) || 0;

                    // Append to reported log
                    const newReport = {
                      id: Date.now(),
                      date: "Hoy",
                      product: selectedEcoProduct,
                      unitsSold: sold,
                      unitsLeft: left,
                      waste: mermed,
                      pointsGained: 50
                    };

                    setReportedSales([newReport, ...reportedSales]);
                    setEcoPoints(prev => Math.min(1000, prev + 50));
                    setTotalPoints(prev => prev + 50);
                    setRedeemablePoints(prev => prev + 50);

                    // Reset form inputs
                    setSelectedEcoProduct("");
                    setEcoUnitsSold("");
                    setEcoUnitsRemaining("");
                    setEcoUnitsMerma("");

                    triggerAlert(`¡Reporte enviado exitosamente! +50 puntos sumados a tu cuenta EcoDup.`);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Producto</label>
                    <select
                      required
                      value={selectedEcoProduct}
                      onChange={(e) => setSelectedEcoProduct(e.target.value)}
                      className="w-full p-3 bg-neutral-100 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-550 text-neutral-800"
                    >
                      <option value="">Selecciona un producto...</option>
                      <option value="Coca-Cola Original 2.5L">Coca-Cola Original 2.5L</option>
                      <option value="Agua Ciel Purificada 1L">Agua Ciel Purificada 1L</option>
                      <option value="Sprite Sin Azúcar 600ml">Sprite Sin Azúcar 600ml</option>
                      <option value="Sidral Mundet 2L">Sidral Mundet 2L</option>
                      <option value="Jugo Del Valle Durazno 1L">Jugo Del Valle Durazno 1L</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-neutral-500 uppercase">Unidades Vendidas</label>
                      <input
                        required
                        type="number"
                        min="0"
                        placeholder="0"
                        value={ecoUnitsSold}
                        onChange={(e) => setEcoUnitsSold(e.target.value)}
                        className="w-full p-3 bg-neutral-100 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-neutral-800"
                      />
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-neutral-500 uppercase">Unidades Restantes</label>
                      <input
                        required
                        type="number"
                        min="0"
                        placeholder="0"
                        value={ecoUnitsRemaining}
                        onChange={(e) => setEcoUnitsRemaining(e.target.value)}
                        className="w-full p-3 bg-neutral-100 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-neutral-800"
                      />
                    </div>

                    {/* MERMA INPUT */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1">
                        Unidades en Merma ⚠️
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={ecoUnitsMerma}
                        onChange={(e) => setEcoUnitsMerma(e.target.value)}
                        className="w-full p-3 bg-amber-500/[0.04] text-xs border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-neutral-850 font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#10b981] hover:bg-[#0d9488] text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-[#10b981]/20 border-0"
                  >
                    <Send className="w-4 h-4" /> Enviar reporte (+50 pts)
                  </button>
                </form>

                {/* History list */}
                <div className="border border-neutral-150 rounded-2xl p-4 text-xs space-y-3 bg-neutral-50/50">
                  <div className="flex items-center justify-between select-none">
                    <span className="font-bold text-neutral-600 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-neutral-400" /> Historial de reportes recientes
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold">Últimos {reportedSales.length} reportes</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reportedSales.map((r: any) => (
                      <div key={r.id} className="bg-white p-2.5 rounded-lg border border-neutral-100 flex items-center justify-between text-[11px] hover:shadow-2xs transition">
                        <div>
                          <p className="font-extrabold text-neutral-800">{r.product}</p>
                          <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                            Fecha: {r.date} · Vendido: <span className="text-neutral-700 font-bold">{r.unitsSold}u</span> · Stock restante: <span className="text-neutral-700 font-bold">{r.unitsLeft}u</span>
                            {r.waste > 0 && <span className="text-red-500 ml-1.5 font-bold">· Merma: {r.waste}u</span>}
                          </p>
                        </div>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          +{r.pointsGained} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 3: Recompensas list */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-150/70 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-neutral-800 tracking-tight flex items-center gap-1">
                    <Gift className="w-4 h-4 text-neutral-500" /> Recompensas
                  </h3>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                    {redeemablePoints} pts disp.
                  </span>
                </div>

                <div className="space-y-3">
                  
                  {/* Reward 1 */}
                  <div className="border border-neutral-150 rounded-2xl p-4 bg-neutral-50/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-neutral-800">Envío Prioritario</p>
                        <p className="text-[10px] text-neutral-400 font-bold">300 pts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (redeemablePoints >= 300) {
                          setRedeemablePoints(prev => prev - 300);
                          triggerAlert("¡Increíble! Has canjeado 'Envío Prioritario'. Tu próximo pedido llegará prioritario de ruta. -300 pts.");
                        } else {
                          triggerAlert("Ups, necesitas 300 puntos canjeables para reclamar esta recompensa.");
                        }
                      }}
                      className="px-4 py-1.5 bg-[#10b981] hover:bg-[#0d9488] text-white text-[10px] font-black uppercase rounded-lg transition cursor-pointer border-0"
                    >
                      Canjear
                    </button>
                  </div>

                  {/* Reward 2 */}
                  <div className="border border-neutral-150 rounded-2xl p-4 bg-neutral-50/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-neutral-800">Caja Promo Ciel</p>
                        <p className="text-[10px] text-neutral-400 font-bold">400 pts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (redeemablePoints >= 400) {
                          setRedeemablePoints(prev => prev - 400);
                          triggerAlert("¡Felicidades! Se ha añadido una Caja Promocional de Agua Ciel de regalo a tu pedido. -400 pts.");
                        } else {
                          triggerAlert("Necesitas tener 400 puntos canjeables para reclamar la Caja de Agua Ciel.");
                        }
                      }}
                      className="px-4 py-1.5 bg-[#10b981] hover:bg-[#0d9488] text-white text-[10px] font-black uppercase rounded-lg transition cursor-pointer border-0"
                    >
                      Canjear
                    </button>
                  </div>

                </div>
              </div>

              {/* Card 4: Metas reales de la tienda */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-150/70 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-neutral-800 tracking-tight">
                    Metas de la Tienda
                  </h3>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Ciclo Junio</span>
                </div>

                <div className="space-y-3.5 text-xs text-neutral-700 leading-normal">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>Meta de Abasto de Ruta</span>
                      <span className="text-[#E30613]">120u recomendadas</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-neutral-500 font-semibold">
                      <span>Llevas surtidas: 98u</span>
                      <span>81% de la meta</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "81%" }} />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-emerald-700 flex items-center gap-1 font-extrabold text-[#15803d]">Meta de Reducción de Merma</span>
                      <span className="text-[#15803d] font-extrabold">-2.8% registrada</span>
                    </div>
                    <p className="text-[10.5px] text-neutral-500 font-semibold leading-relaxed">
                      ¡Tu meta es mantener la merma por debajo del <strong className="text-neutral-700">5.0%</strong> para calificar al bono trimestral tuali! Estás en excelente camino.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 5: Tu impacto en Arca */}
              <div className="bg-white rounded-3xl p-6 border border-[#c1e2cb]/35 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-neutral-800 tracking-tight">
                  Tu impacto en Arca
                </h3>
                
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex justify-between items-center">
                    <span className="font-bold text-neutral-500">📄 Reportes enviados</span>
                    <span className="font-extrabold text-neutral-800 text-sm">124</span>
                  </div>

                  <div className="p-3 bg-[#e8f6f0] rounded-xl border border-[#cbebe0] flex justify-between items-center">
                    <span className="font-bold text-emerald-800">🌱 Merma evitada</span>
                    <span className="font-extrabold text-emerald-900 text-sm">-15%</span>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex justify-between items-center">
                    <span className="font-bold text-neutral-500">🎯 Mejora predicción</span>
                    <span className="font-extrabold text-neutral-800 text-sm">+8.2%</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Consistencia de Reportes (30d)
                  </p>
                  <div className="h-14 bg-gradient-to-b from-[#e8f6f0]/60 to-[#f5f8f6] rounded-xl border border-[#cbebe0]/50 relative overflow-hidden flex items-end">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path
                        d="M 0,25 C 20,5 40,30 60,10 C 80,-5 90,20 100,5"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 0,25 C 20,5 40,30 60,10 C 80,-5 90,20 100,5 L 100,30 L 0,30 Z"
                        fill="rgba(16, 185, 129, 0.1)"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 text-emerald-800 rounded-xl border border-emerald-500/15 text-center text-[10.5px] font-extrabold select-none">
                  ✓ Aliado Sostenible Arca 2026
                </div>

              </div>

            </div>

          </div>
        </main>

        <footer className="bg-white border-t border-neutral-150 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>EcoDup Engine v4.27 🌿</span>
          </div>
          <span>Portal del Socio Arca Continental · Tuali Coaxial © 2026</span>
        </footer>
      </div>
    );
  }

  if (viewTualiEasyTutorial) {
    return (
      <div className="min-h-screen bg-[#f5f7f5] text-neutral-900 flex flex-col justify-between selection:bg-emerald-500/10 font-sans">
        
        {/* 1. TUTORIAL ACCESSIBILITY NAV BAR */}
        <header className="h-20 px-6 bg-white border-b-2 border-neutral-200/80 shadow-sm flex items-center justify-between sticky top-0 z-40 select-none">
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setViewTualiEasyTutorial(false);
            }}
            className="px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black text-sm flex items-center gap-2 border-0 cursor-pointer shadow-sm transition"
          >
            ← Volver a Mi Tienda Estándar
          </button>

          <div className="flex items-center gap-4">
            {/* Real-time points indicator of the tutorial */}
            <div className="bg-emerald-50 border border-emerald-150 px-4 py-2 rounded-2xl flex items-center gap-2 select-none">
              <span className="text-xs font-black text-emerald-700 uppercase">Mis Puntos Tuali:</span>
              <span className="text-lg font-black text-emerald-600">{ecoPoints} pts</span>
            </div>

            {/* Giant Speak Assistant Toggle Button */}
            <button
              onClick={() => {
                const nextVoiceState = !isVoiceOn;
                setIsVoiceOn(nextVoiceState);
                if (nextVoiceState) {
                  speakText("¡Ayudante por voz activado! Te iré guiando con sonido cada paso del camino, Don Carlos.", true);
                } else {
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }
              }}
              className={`px-5 py-3.5 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition cursor-pointer border shadow-sm ${
                isVoiceOn 
                  ? "bg-rose-600 text-white border-transparent hover:bg-rose-700 animate-bounce"
                  : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
              }`}
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>{isVoiceOn ? "🔊 Voz: Activada" : "🔇 Activar Voz (Lectura)"}</span>
            </button>
          </div>
        </header>

        {/* 2. CHAT ASSISTANT PERSONA SUBTITLE PANEL (Senior Readability layout) */}
        <div className="max-w-4xl w-full mx-auto px-4 py-6 flex-grow flex flex-col gap-6">
          
          <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center gap-6 relative select-none">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500 text-emerald-600 font-black text-3xl shrink-0 animate-pulse">
              👴
            </div>
            
            <div className="space-y-2 flex-grow text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">
                Tu Guía Tuali Fácil
              </p>
              <h3 className="text-2xl font-black text-neutral-800 leading-tight">
                Instrucciones para Don Carlos
              </h3>
              
              {/* Giant pulsing assistance speech bubble text */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/60 relative">
                <p className="text-base md:text-[18px] font-extrabold text-neutral-800 leading-relaxed">
                  "{speakingText}"
                </p>
              </div>
            </div>
          </div>

          {/* 3. MULTI-STEP INTERACTIVE CHOCES WORKSPACE */}
          <div className="bg-white border border-neutral-150 rounded-4xl p-6 md:p-10 shadow-sm flex-grow flex flex-col justify-between min-h-[380px]">
            
            {activeTutorialTask === null ? (
              /* DASHBOARD SCREEN - INITIAL STATE */
              <div className="space-y-6 flex-grow flex flex-col justify-center">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <h4 className="text-xl font-black text-neutral-800">Selecciona una tarea para entrenar hoy:</h4>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                    Estas son las 3 tareas básicas de tu negocio. Hemos simplificado las pantallas con botones grandes de colores para que las aprendas sin esfuerzo. ¡Al terminar ganarás puntos reales!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  
                  {/* Task card 1 */}
                  <div
                    onClick={() => {
                      setActiveTutorialTask("sales");
                      setTutorialStep(1);
                      setDemoProduct("Coca-Cola Original 2.5L");
                      setDemoQuantity(12);
                      setDemoMerma(0);
                      speakText("¡Excelente! Paso 1: Selecciona qué producto vendiste hoy. Presiona una de las imágenes de refrescos.");
                    }}
                    className="bg-[#FFFDF9] hover:bg-[#FFF9EE] border-2 border-amber-300/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-14 h-14 bg-amber-100 text-amber-700 text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        📋
                      </div>
                      <h5 className="text-[17px] font-black text-neutral-800">1. Reportar Ventas Rápidas</h5>
                      <p className="text-[12px] text-neutral-500 font-semibold leading-relaxed">
                        Informa qué botellas vendiste hoy de forma sencilla sin tener que escribir nada en botones complicados.
                      </p>
                    </div>
                    <span className="inline-block mt-4 text-[11px] font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 uppercase">
                      🎁 Gana +50 pts EcoDup
                    </span>
                  </div>

                  {/* Task card 2 */}
                  <div
                    onClick={() => {
                      setActiveTutorialTask("actionPlan");
                      setTutorialStep(1);
                      speakText("¡Muy bien! Paso 1: Revisa el pedido de reabastecimiento que la computadora de Arca calculó para que nunca te quedes sin Coca-Cola.");
                    }}
                    className="bg-[#FAFCFA] hover:bg-[#F2FAF3] border-2 border-emerald-300/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-700 text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        👍
                      </div>
                      <h5 className="text-[17px] font-black text-neutral-800">2. Aceptar mi Pedido Sugerido</h5>
                      <p className="text-[12px] text-neutral-500 font-semibold leading-relaxed">
                        Ahorra tiempo. Mira el camión seguro semanal calculado por la IA y confírmalo con una cara feliz.
                      </p>
                    </div>
                    <span className="inline-block mt-4 text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 uppercase">
                      🎁 Gana +50 pts EcoDup
                    </span>
                  </div>

                  {/* Task card 3 */}
                  <div
                    onClick={() => {
                      setActiveTutorialTask("rewards");
                      setTutorialStep(1);
                      speakText("¡Fabuloso! Paso 1: Tienes 840 puntos tuali ganados. Selecciona el regalo que te gustaría reclamar de forma gratuita.");
                    }}
                    className="bg-[#FFFDFD] hover:bg-[#FFEAEA]/40 border-2 border-rose-300/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-14 h-14 bg-rose-100 text-rose-700 text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        🎁
                      </div>
                      <h5 className="text-[17px] font-black text-neutral-800">3. Canjear mis Regalitos EcoDup</h5>
                      <p className="text-[12px] text-neutral-500 font-semibold leading-relaxed">
                        Reclama tus recompensas por cuidar tu stock. Canjea tus puntos por cajas gratis del portafolio Arca.
                      </p>
                    </div>
                    <span className="inline-block mt-4 text-[11px] font-black text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 uppercase">
                      🎁 Gana +55 pts EcoDup
                    </span>
                  </div>

                </div>
              </div>
            ) : (
              /* DETAILED INTERACTIVE STEP SESSIONS */
              <div className="flex-grow flex flex-col justify-between h-full">
                
                {/* Visual progression circles */}
                <div className="flex justify-center items-center gap-1.5 pb-6 border-b border-neutral-100 select-none">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div key={stepNum} className="flex items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        tutorialStep === stepNum 
                          ? "bg-[#b5000b] text-white animate-pulse"
                          : tutorialStep > stepNum 
                          ? "bg-emerald-600 text-white"
                          : "bg-neutral-100 text-neutral-400"
                      }`}>
                        {tutorialStep > stepNum ? "✓" : stepNum}
                      </div>
                      {stepNum < 4 && <div className={`w-10 h-1 bg-neutral-100 rounded-full ${tutorialStep > stepNum ? "bg-emerald-500" : ""}`} />}
                    </div>
                  ))}
                </div>

                {/* TASK 1: SALES REPORTING WORKFLOW */}
                {activeTutorialTask === "sales" && (
                  <div className="py-6 flex-grow flex flex-col justify-center">
                    
                    {tutorialStep === 1 && (
                      <div className="space-y-5 text-center">
                        <p className="text-base font-extrabold text-neutral-600">Presiona con tu dedo la bebida que vendiste hoy:</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                          {[
                            { name: "Coca-Cola Original 2.5L", price: "24 botellas sug.", desc: "Refresco icónico", icon: "🥤" },
                            { name: "Agua Purificada Ciel 1L", price: "18 botellas sug.", desc: "Agua limpia y fresca", icon: "💧" },
                            { name: "Sprite Limón 600ml", price: "12 botellas sug.", desc: "Refresco sabor limón", icon: "🍋" }
                          ].map((prod) => (
                            <div
                              key={prod.name}
                              onClick={() => {
                                setDemoProduct(prod.name);
                                setTutorialStep(2);
                                speakText(`¡Perfecto! Seleccionaste ${prod.name}. Ahora dinos cuántos botellas vendiste usando los botones gigantes de MÁS y MENOS.`);
                              }}
                              className="bg-white border-3 border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/25 p-5 rounded-2xl cursor-pointer transition text-center space-y-2 shadow-2xs"
                            >
                              <span className="text-3xl block">{prod.icon}</span>
                              <p className="font-black text-neutral-800 text-[15px]">{prod.name}</p>
                              <p className="text-xs text-neutral-400 font-semibold">{prod.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tutorialStep === 2 && (
                      <div className="space-y-6 text-center max-w-md mx-auto">
                        <p className="text-base font-extrabold text-neutral-700">
                          ¿Cuántas unidades de <strong className="text-[#b5000b]">{demoProduct}</strong> vendiste hoy?
                        </p>

                        <div className="flex justify-center items-center gap-8 py-4">
                          {/* Giant minus button */}
                          <button
                            onClick={() => {
                              const nextVal = Math.max(1, demoQuantity - 1);
                              setDemoQuantity(nextVal);
                              speakText(`Menos 1. Llevas ${nextVal} botellas vendidas.`);
                            }}
                            className="w-18 h-18 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 text-3xl font-black flex items-center justify-center border-0 cursor-pointer shadow-sm active:scale-95 transition"
                          >
                            -
                          </button>

                          {/* Large value output */}
                          <span className="text-6xl font-black text-neutral-800 font-sans tracking-tight min-w-24">
                            {demoQuantity}
                          </span>

                          {/* Giant plus button */}
                          <button
                            onClick={() => {
                              const nextVal = demoQuantity + 1;
                              setDemoQuantity(nextVal);
                              speakText(`Más 1. Llevas ${nextVal} botellas vendidas.`);
                            }}
                            className="w-18 h-18 rounded-full bg-emerald-150 hover:bg-emerald-200 text-emerald-800 text-3xl font-black flex items-center justify-center border-0 cursor-pointer shadow-sm active:scale-95 transition"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-[13px] text-neutral-400 font-semibold italic">
                          Don Carlos, presiona el gran botón rojo de abajo para continuar.
                        </p>

                        <button
                          onClick={() => {
                            setTutorialStep(3);
                            speakText("Paso 3: ¿Se te rompió o dañó alguna botella? Si ninguna se dañó presiona el botón verde de NO TUVE MERMAS.");
                          }}
                          className="w-full bg-[#E30613] hover:bg-neutral-900 text-white font-black uppercase text-xs tracking-wider py-4 rounded-2xl border-0 cursor-pointer shadow-md transition"
                        >
                          Confirmar Cantidad e Ir al Paso 3 →
                        </button>
                      </div>
                    )}

                    {tutorialStep === 3 && (
                      <div className="space-y-5 text-center max-w-sm mx-auto">
                        <p className="text-base font-extrabold text-neutral-700">¿Tuviste mermas (botellas dañadas que no se pueden vender)?</p>
                        
                        <div className="flex flex-col gap-3 py-2">
                          <button
                            onClick={() => {
                              setDemoMerma(0);
                              setTutorialStep(4);
                              speakText("¡Felicidades! Completaste tu reporte. Presiona el gran botón de enviar hoy mismo.");
                            }}
                            className="w-full p-4 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl border-0 shadow-sm cursor-pointer transition uppercase"
                          >
                            👍 No tuve botellas dañadas (0)
                          </button>

                          <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-150 mt-1">
                            <span className="text-xs font-bold text-neutral-505">Tengo botellas dañadas:</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setDemoMerma(Math.max(0, demoMerma - 1))}
                                className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 font-black border-0 cursor-pointer flex items-center justify-center text-sm"
                              >
                                -
                              </button>
                              <span className="font-extrabold text-sm">{demoMerma}</span>
                              <button
                                onClick={() => setDemoMerma(demoMerma + 1)}
                                className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-black border-0 cursor-pointer flex items-center justify-center text-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setTutorialStep(4);
                            speakText("¡Excelente! Presiona el botón verde gigante de ENVIAR REPORTE AHORA.");
                          }}
                          className="w-full bg-[#E30613] hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl shadow-md border-0 cursor-pointer transition mt-2"
                        >
                          Confirmar e Ir al Envío →
                        </button>
                      </div>
                    )}

                    {tutorialStep === 4 && (
                      <div className="space-y-5 text-center max-w-md mx-auto select-none">
                        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 border-2 border-emerald-250 rounded-full flex items-center justify-center text-4xl leading-none shrink-0 animate-bounce">
                          ✓
                        </div>
                        <h4 className="text-xl font-black text-neutral-800">¡Reporte listo! Envías esta información a Arca:</h4>
                        
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-150 text-left font-semibold text-xs text-neutral-700 space-y-2">
                          <p>● <strong>Producto:</strong> {demoProduct}</p>
                          <p>● <strong>Vendido hoy:</strong> {demoQuantity} botellas</p>
                          <p>● <strong>Con merma:</strong> {demoMerma} unidades</p>
                          <p className="text-[#10b981] font-black">• <strong>Comisión estimada:</strong> +50 Puntos Tuali</p>
                        </div>

                        {/* GIANT GREEN CONFfirm BUTTON */}
                        <button
                          onClick={() => {
                            setEcoPoints(prev => prev + 50);
                            setTotalPoints(prev => prev + 50);
                            setTutorialStep(1);
                            setActiveTutorialTask(null);
                            triggerAlert("¡Maravilloso! El tutorial de Ventas ha sido enviado. Recibes un bono de +50 pts.");
                            speakText("¡Felicidades Don Carlos! Terminaste la simulación exitosamente. Has ganado cincuenta puntos EcoDup reales para canjear en la tienda.");
                          }}
                          className="w-full bg-[#22c55e] hover:bg-emerald-700 py-4.5 rounded-2xl text-white font-extrabold uppercase text-xs tracking-wider cursor-pointer border-0 shadow-lg transition animate-pulse"
                        >
                          🚀 ¡Enviar Reporte a Arca Continental Ahora! 🚀
                        </button>
                      </div>
                    )}

                  </div>
                )}


                {/* TASK 2: ACTION PLAN CONFIRMATION WORKFLOW */}
                {activeTutorialTask === "actionPlan" && (
                  <div className="py-6 flex-grow flex flex-col justify-center">
                    
                    {tutorialStep === 1 && (
                      <div className="space-y-5 text-center max-w-xl mx-auto">
                        <p className="text-base font-extrabold text-neutral-600">Este es el pedido inteligente calculado por la computadora de Arca Continental para tu negocio:</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[#FFFDF9] border-2 border-amber-200 rounded-2xl text-center space-y-1">
                            <span className="text-3xl">🥤</span>
                            <h5 className="font-black text-neutral-800">24 Cajas</h5>
                            <p className="text-[11px] text-neutral-400 font-extrabold uppercase">Coca-Cola 2.5L</p>
                          </div>
                          <div className="p-4 bg-[#F2FAF5] border-2 border-emerald-200 rounded-2xl text-center space-y-1">
                            <span className="text-3xl">💧</span>
                            <h5 className="font-black text-neutral-800">18 Cajas</h5>
                            <p className="text-[11px] text-neutral-400 font-extrabold uppercase">Agua Ciel 1L</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setTutorialStep(2);
                            speakText("Paso 2: Dinos si te parece correcto el stock semanal sugerido. Presiona una de las caras grandes de abajo.");
                          }}
                          className="w-full bg-[#E30613] hover:bg-neutral-900 text-white font-black uppercase text-xs tracking-wider py-4 rounded-2xl border-0 cursor-pointer shadow-md transition"
                        >
                          Verificar mis sugerencias →
                        </button>
                      </div>
                    )}

                    {tutorialStep === 2 && (
                      <div className="space-y-6 text-center max-w-md mx-auto">
                        <p className="text-base font-extrabold text-neutral-700">Dinos, ¿te parece correcto el pedido sugerido?</p>
                        
                        <div className="flex gap-4 py-2">
                          <button
                            onClick={() => {
                              setTutorialStep(3);
                              speakText("¡Excelente! Todo de acuerdo. Paso 3: Presiona el botón grande y rojo para confirmar el envío del camión.");
                            }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase p-5 rounded-2xl border-0 cursor-pointer shadow-sm transition flex flex-col items-center gap-2"
                          >
                            <span className="text-3xl">👍</span>
                            <span>Sí, me parece bien</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              alert("¡No te preocupes! El supervisor Carlos M. te ayudará mañana en su visita presencial.");
                              setTutorialStep(3);
                              speakText("¡Entendido! Lo coordinaremos con el supervisor. Ahora presiona el gran botón de confirmación de ruta.");
                            }}
                            className="flex-1 bg-amber-400 hover:bg-amber-500 text-neutral-800 font-black text-xs uppercase p-5 rounded-2xl border-0 cursor-pointer shadow-sm transition flex flex-col items-center gap-2"
                          >
                            <span className="text-3xl">✏️</span>
                            <span>Quiero un poco más</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {tutorialStep === 3 && (
                      <div className="space-y-5 text-center max-w-sm mx-auto">
                        <p className="text-base font-extrabold text-neutral-700">¡Perfecto! Don Carlos, para programar el camión de reparto para el miércoles, presiona el gran botón rojo asignado abajo:</p>
                        
                        <button
                          onClick={() => {
                            setTutorialStep(4);
                            speakText("¡Pedido enviado! Presiona FINALIZAR para sumarte cincuenta puntos EcoDup reales.");
                          }}
                          className="w-full bg-[#E30613] hover:bg-rose-700 font-black text-sm uppercase py-5 px-4 rounded-3xl cursor-pointer border-0 shadow-lg text-white animate-pulse"
                        >
                          🚚 ¡CONFIRMAR MI PEDIDO DE RUTA! 🚚
                        </button>
                      </div>
                    )}

                    {tutorialStep === 4 && (
                      <div className="space-y-5 text-center max-w-md mx-auto">
                        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-603 border-2 border-emerald-250 rounded-full flex items-center justify-center text-4xl leading-none shrink-0 animate-bounce">
                          ✓
                        </div>
                        <h4 className="text-xl font-black text-neutral-800">¡Pedido Agendado Exitosamente!</h4>
                        <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                          Has completado la lección sobre Planes de Abasto Sugeridos de Tuali. ¡Excelente trabajo de capacitación!
                        </p>

                        <button
                          onClick={() => {
                            setEcoPoints(prev => prev + 50);
                            setTotalPoints(prev => prev + 50);
                            setTutorialStep(1);
                            setActiveTutorialTask(null);
                            triggerAlert("¡Felicidades! Pedido confirmado en tu capacitación de Ruta. +50 Puntos adicionados.");
                            speakText("¡Felicidades Don Carlos! Has completado el módulo de abasto recomendado. Has ganado cincuenta puntos EcoDup reales.");
                          }}
                          className="w-full bg-[#22c55e] hover:bg-emerald-700 py-4 rounded-xl text-white font-extrabold uppercase text-xs cursor-pointer border-0 shadow-md transition"
                        >
                          Finalzar este módulo y Guardar mis Puntos ✓
                        </button>
                      </div>
                    )}

                  </div>
                )}


                {/* TASK 3: REWARDS REDEMPTION WORKFLOW */}
                {activeTutorialTask === "rewards" && (
                  <div className="py-6 flex-grow flex flex-col justify-center">
                    
                    {tutorialStep === 1 && (
                      <div className="space-y-5 text-center max-w-xl mx-auto">
                        <p className="text-base font-extrabold text-neutral-600">Tienes 840 puntos utilizables. Elige qué regalo gratis deseas revalidar hoy:</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div 
                            onClick={() => {
                              setTutorialStep(2);
                              speakText("¡Estupenda opción! Vas a canjear la Caja de refresco Ciel por 400 puntos. Confírmala presionando el botón brillante de regalo.");
                            }}
                            className="bg-white border-3 border-neutral-200 hover:border-[#E30613] p-5 rounded-3xl cursor-pointer text-center space-y-3"
                          >
                            <span className="text-4xl block">🎁</span>
                            <h5 className="font-black text-neutral-800 text-[16px]">Caja Promo Agua Ciel gratis</h5>
                            <p className="text-xs text-neutral-400 font-semibold">Cuesta 400 de tus Puntos EcoDup</p>
                          </div>

                          <div 
                            onClick={() => {
                              setTutorialStep(2);
                              speakText("Ayuda excelente. Un cupón de 300 pesos de saldo gratis en tu próximo pedido. Pulsa el botón para continuar.");
                            }}
                            className="bg-white border-3 border-neutral-200 hover:border-[#E30613] p-5 rounded-3xl cursor-pointer text-center space-y-3"
                          >
                            <span className="text-4xl block">🎟️</span>
                            <h5 className="font-black text-neutral-800 text-[16px]">Cupón de $300 MXN de Saldo</h5>
                            <p className="text-xs text-neutral-400 font-semibold">Cuesta 300 de tus Puntos EcoDup</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {tutorialStep === 2 && (
                      <div className="space-y-6 text-center max-w-sm mx-auto">
                        <p className="text-base font-extrabold text-neutral-700">¿Revalidas tu canje de premio gratis?</p>
                        
                        <button
                          onClick={() => {
                            setTutorialStep(3);
                            speakText("¡Felicidades! Se ha canjeado el premio. Presiona el botón verde para guardarlo.");
                          }}
                          className="w-full bg-[#f5df4d] hover:bg-[#ebd43f] text-neutral-900 border-0 shadow-md p-5 rounded-3xl font-black text-base uppercase cursor-pointer transition animate-pulse flex flex-col items-center gap-1.5"
                        >
                          <span>🎁 ¡SÍ, QUIERO MI REGALO GRATIS! 🎁</span>
                        </button>
                      </div>
                    )}

                    {tutorialStep === 3 && (
                      <div className="space-y-5 text-center max-w-md mx-auto">
                        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-603 border-2 border-emerald-250 rounded-full flex items-center justify-center text-4xl leading-none shrink-0 animate-bounce">
                          🎉
                        </div>
                        <h4 className="text-xl font-black text-neutral-900">¡Recompensa Simbólica Validada!</h4>
                        <p className="text-xs text-neutral-400 font-semibold">
                          Con el portal de premios de Tuali, podrás usar tus Eco-Puntos para obtener ganancias netas adicionales en el abasto presencial de Arca.
                        </p>

                        <button
                          onClick={() => {
                            setEcoPoints(prev => prev + 55);
                            setTotalPoints(prev => prev + 55);
                            setTutorialStep(1);
                            setActiveTutorialTask(null);
                            triggerAlert("¡Excepcional! Has canjeado tu premio simbólico paso a paso. +55 Puntos agregados.");
                            speakText("¡Genial Don Carlos! Lograste completar los tres cursos guiados. Has ganado cincuenta y cinco puntos EcoDup adicionales.");
                          }}
                          className="w-full bg-[#22c55e] hover:bg-emerald-700 py-4 rounded-xl text-white font-extrabold uppercase text-xs cursor-pointer border-0 shadow-md transition"
                        >
                          Concluir Capacitación y Ganar +55 pts ✓
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* Return to Tutorial Dashboard option */}
                <button
                  onClick={() => {
                    setActiveTutorialTask(null);
                    setTutorialStep(1);
                    speakText("Regresaste al tablero de tareas guiadas de Tuali. Presiona cualquiera de los tres botones grandes para reanudar el aprendizaje.");
                  }}
                  className="mt-6 text-neutral-400 hover:text-neutral-700 font-black text-xs uppercase border-0 bg-transparent cursor-pointer hover:underline text-center block mx-auto select-none"
                >
                  ⇠ Cancelar y volver al listado de guías
                </button>

              </div>
            )}

          </div>

        </div>

        {/* 4. DESIGNED FOOTER ACCESSIBILITY */}
        <footer className="bg-white border-t-2 border-neutral-200 py-6 px-10 text-center select-none space-y-1 mt-6">
          <p className="text-[12px] font-black text-neutral-500 uppercase tracking-wide">
            ✓ Tuali Senior Modo Fácil: Comprometidos con los Adultos Mayores de México • 2026 ☀️
          </p>
          <div className="text-[10px] text-neutral-400 font-semibold">
            Asistencia en audios de ruta automatizados asociados a Arca Continental.
          </div>
        </footer>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] text-neutral-800 flex flex-col justify-between">
      
      {/* 1. TOP BANNER HEADER MATCHING SCREENSHOT EXACT FORMAT */}
      <header className="h-16 px-6 md:px-10 flex justify-between items-center bg-white border-b border-neutral-100 shadow-xs z-30 select-none">
        
        {/* Breadcrumb section with alarm */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-500/5 hover:text-[#E30613] flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
            title="Volver al Selector"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-neutral-900 font-sans tracking-tight">
              Mi tienda · <span className="text-[#E30613]">{store.name}</span>
            </h1>
            
            {/* Green Badge matching screenshot header */}
            <span className="flex items-center gap-1 bg-[#22c55e]/10 text-[#15803d] border border-[#22c55e]/15 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold select-none">
              <Calendar className="w-3 h-3 text-[#16a34a]" /> Próximo resurtido: 16 de Jun
            </span>
          </div>
        </div>

        {/* Right action control icons */}
        <div className="flex items-center gap-3">
          {/* Notification bell and status avatar info */}
          <button className="p-2 text-neutral-400 hover:text-neutral-700 transition relative">
            <div className="absolute right-1.5 top-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <div className="absolute right-1.5 top-1.5 w-2 h-2 bg-[#E30613] rounded-full" />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* User badge pill matching design guidelines */}
          <div className="flex items-center gap-2 p-1.5 rounded-full border border-neutral-150 bg-white select-none">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80"
              alt="Avatar Tienda"
              className="w-6 h-6 rounded-full object-cover border border-neutral-100"
            />
            <span className="text-[10px] font-bold text-neutral-600 pr-2 truncate max-w-[130px] hidden sm:inline">
              Don Carlos Ortiz
            </span>
          </div>
        </div>

      </header>

      {/* 2. DYNAMIC ALERTS BLOCK */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-6 left-6 md:left-auto md:w-96 z-50 p-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2.5 text-xs select-none"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTAINER BODY */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-grow space-y-6">
        
        {/* BIENVENIDA HERO CARD WITH ECO-DUP INTEGRATION (FITS SCREENSHOT 5) */}
        <div className="bg-[#e2f0e6]/70 border border-[#c1e2cb]/50 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-stretch justify-between gap-6 relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute left-0 bottom-0 w-36 h-36 bg-emerald-300/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Welcome message */}
          <div className="flex flex-col justify-between space-y-4 max-w-xl z-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Bienvenida, Tienda La Esperanza 👋
              </h2>
              <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
                Tu compromiso con la eficiencia está rindiendo frutos. Hemos calculado tus existencias seguras para el ciclo de distribución de esta semana.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setViewEcoDup(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-[#00743f] hover:bg-[#005c31] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-sm shadow-[#00743f]/15 border-0"
              >
                Ingresar a Eco-Dup 🌿 <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setViewTualiEasyTutorial(true);
                  speakText("¡Bienvenido al modo de práctica paso a paso Don Carlos! Presiona cualquiera de los tres botones amarillos abajo para iniciar tu entrenamiento guiado.", true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-sm border-0"
              >
                🎓 Tutorial Modo Fácil
              </button>
            </div>
          </div>

          {/* Gamification Ranking Badge / Card */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col justify-between w-full lg:max-w-xs shrink-0 relative hover:shadow-md transition-all select-none duration-300">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  RANKING RUTA CDMX
                </span>
                <Award className="w-5 h-5 text-amber-500 fill-amber-100" />
              </div>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-neutral-900 font-sans">#3</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-150">
                  Miguel Hidalgo
                </span>
              </div>
            </div>

            {/* Micro ranking competitor tracker */}
            <div className="space-y-2 mt-4 pt-3 border-t border-neutral-100">
              <div className="flex justify-between items-center text-[11px] font-bold text-neutral-600">
                <span>Tu puntuación activa:</span>
                <span className="text-emerald-600 font-extrabold">{ecoPoints} pts</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500 font-semibold leading-tight">
                <span>A solo 100 ptos de Mini Super El Paso (Rank #2).</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "82%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* THREE STAT CORES (TICKET PROMEDIO, PRÓXIMO RESURTIDO, AHORRO EVITANDO MERMA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          
          {/* Card 1: Próximo Resurtido */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-150/70 hover:shadow-xs transition flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">PRÓXIMO RESURTIDO</p>
                <h3 className="text-2xl font-black text-neutral-800 tracking-tight">16 jun</h3>
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-semibold mt-3 flex items-center gap-1.5 border-t border-neutral-50 pt-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Preparación en curso · Ruta programada
            </p>
          </div>

          {/* Card 2: Ticket Promedio */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-150/70 hover:shadow-xs transition flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">TICKET PROMEDIO</p>
                <h3 className="text-2xl font-black text-neutral-800 tracking-tight">$3,200 <span className="text-xs font-semibold text-neutral-500">MXN</span></h3>
              </div>
              <span className="w-8 h-8 rounded-full bg-red-50 text-red-650 flex items-center justify-center">
                <Eye className="w-4 h-4 text-red-500" />
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-semibold mt-3 flex items-center gap-1 border-t border-neutral-50 pt-2.5">
              Últimos 30 días de entrega verificados
            </p>
          </div>

          {/* Card 3: Ahorro Evitando Merma */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-150/70 hover:shadow-xs transition flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">AHORRO EVITANDO MERMA</p>
                <h3 className="text-2xl font-black text-emerald-600 tracking-tight">$480 <span className="text-xs font-semibold text-neutral-500">MXN</span></h3>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#10b981]/10 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-semibold mt-3 flex items-center gap-1 border-t border-neutral-50 pt-2.5">
              Estimado este mes · Planificación segura
            </p>
          </div>

        </div>

        {/* MAIN SPLIT COLUMNS LAYOUT DESIGN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE BLOCK (col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD A: TU PRÓXIMO PEDIDO ESTIMADO (SCREENSHOT FORMAT WITH GRAPH BARS) */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-150/70 space-y-5">
              <div className="flex items-center justify-between select-none">
                <div>
                  <h3 className="text-base font-black text-neutral-800 tracking-tight">
                    Tu próximo pedido estimado
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-semibold mt-0.5">
                    Análisis predictivo de tus inventarios semanales recomendados
                  </p>
                </div>
                
                <button
                  onClick={() => triggerAlert("Mostrando analítica detallada de la alcaldía...")}
                  className="text-xs font-extrabold text-[#E30613] hover:underline flex items-center gap-0.5 mr-1"
                >
                  Ver predicción completa <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Weekly bar alignment representing top SKUs from image 5 */}
              <div className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-100 flex flex-col gap-6 select-none relative min-h-[190px]">
                
                <div className="grid grid-cols-4 gap-4 items-end justify-center h-28 relative">
                  
                  {/* Grid lines inside */}
                  <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between opacity-10 pointer-events-none">
                    <div className="w-full h-px bg-neutral-900" />
                    <div className="w-full h-px bg-neutral-900" />
                    <div className="w-full h-px bg-neutral-900" />
                  </div>

                  {/* Week 1 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 flex gap-[3px] items-end h-full">
                      <div className="w-1/3 bg-[#f87171] rounded-t-sm" style={{ height: "70%" }} title="Top SKU 1: 24u" />
                      <div className="w-1/3 bg-[#b91c1c] rounded-t-sm" style={{ height: "45%" }} title="Top SKU 2: 12u" />
                      <div className="w-1/3 bg-[#10b981] rounded-t-sm" style={{ height: "30%" }} title="Top SKU 3: 8u" />
                    </div>
                  </div>

                  {/* Week 2 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 flex gap-[3px] items-end h-full">
                      <div className="w-1/3 bg-[#f87171] rounded-t-sm" style={{ height: "85%" }} />
                      <div className="w-1/3 bg-[#b91c1c] rounded-t-sm" style={{ height: "55%" }} />
                      <div className="w-1/3 bg-[#10b981] rounded-t-sm" style={{ height: "40%" }} />
                    </div>
                  </div>

                  {/* Week 3 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 flex gap-[3px] items-end h-full">
                      <div className="w-1/3 bg-[#f87171] rounded-t-sm" style={{ height: "60%" }} />
                      <div className="w-1/3 bg-[#b91c1c] rounded-t-sm" style={{ height: "35%" }} />
                      <div className="w-1/3 bg-[#10b981] rounded-t-sm" style={{ height: "25%" }} />
                    </div>
                  </div>

                  {/* Week 4 */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 flex gap-[3px] items-end h-full">
                      <div className="w-1/3 bg-[#f87171] rounded-t-sm" style={{ height: "75%" }} />
                      <div className="w-1/3 bg-[#b91c1c] rounded-t-sm" style={{ height: "65%" }} />
                      <div className="w-1/3 bg-[#10b981] rounded-t-sm" style={{ height: "50%" }} />
                    </div>
                  </div>

                </div>

                {/* Sub-label axis matching design mock precisely */}
                <div className="grid grid-cols-4 text-center text-[10px] font-black text-neutral-400 uppercase font-mono tracking-wider mt-1.5">
                  <span>Sem 1</span>
                  <span>Sem 2</span>
                  <span>Sem 3</span>
                  <span>Sem 4</span>
                </div>

                {/* Legend markers matching screenshot 5 */}
                <div className="flex flex-wrap gap-4 items-center justify-center pt-4 border-t border-neutral-100 font-sans text-[10px] font-black text-neutral-500 uppercase select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                    <span>Top SKU 1</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" />
                    <span>Top SKU 2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span>Top SKU 3</span>
                  </div>
                </div>

              </div>
            </div>

            {/* CARD B: PLANES DE ACCION RECOMENDADOS & PREVISUALIZACION DE UNIDADES (USER REQUEST) */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-150/70 space-y-4">
              <div>
                <span className="text-[10px] font-black text-[#E30613] uppercase tracking-widest block">
                  MIS PLANES DE ACCIÓN RECOMENDADOS
                </span>
                <h3 className="text-base font-black text-neutral-800 tracking-tight mt-1">
                  Selecciona y previsualiza las unidades óptimas sugeridas tuali
                </h3>
              </div>

              {/* Selector horizontal de planes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {clientPlans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPlan(p.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer select-none text-left flex flex-col justify-between ${
                      activePlanId === p.id
                        ? "bg-red-500/[0.02] border-[#E30613] shadow-xs"
                        : "bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className={`text-[11px] font-black leading-snug transition-colors ${activePlanId === p.id ? "text-[#E30613]" : "text-neutral-800"}`}>
                        {p.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed mt-1.5">
                        {p.description}
                      </p>
                    </div>

                    <div className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 mt-3.5 w-max leading-none">
                      {p.savings}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Preview block of units specified inside */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-150 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                  <ShoppingBag className="w-20 h-20 text-[#b5000b]" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 pb-3">
                  <div>
                    <span className="text-[9.5px] font-black text-neutral-405 uppercase tracking-wider block">PREVISUALIZACIÓN DE COMPRA SUGERIDA</span>
                    <h4 className="text-xs font-black text-neutral-800 uppercase mt-0.5">Surtido para: {activePlan.name}</h4>
                  </div>
                  <span className="text-xs font-black text-neutral-700 bg-white border border-neutral-200 px-2.5 py-1 rounded-lg">
                    {unidadesSugeridas.coke + unidadesSugeridas.ciel + unidadesSugeridas.sprite} unidades en total
                  </span>
                </div>

                {/* Units previsualizer rows */}
                <div className="space-y-2.5 mt-4 text-xs font-semibold text-neutral-700">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-150">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-red-100 text-red-600 font-black text-[10px] flex items-center justify-center">C</span>
                      <span>Coca-Cola Original 2.5L</span>
                    </div>
                    <span className="font-extrabold text-[#E30613]">{unidadesSugeridas.coke} unidades sugeridas</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-150">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 font-black text-[10px] flex items-center justify-center">A</span>
                      <span>Agua Purificada Ciel 1L</span>
                    </div>
                    <span className="font-extrabold text-[#E30613]">{unidadesSugeridas.ciel} unidades sugeridas</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-150">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 font-black text-[10px] flex items-center justify-center">S</span>
                      <span>Sprite Sin Azúcar 600ml</span>
                    </div>
                    <span className="font-extrabold text-[#E30613]">{unidadesSugeridas.sprite} unidades sugeridas</span>
                  </div>
                </div>

                {/* CTA Action button checkout */}
                <div className="pt-4 flex flex-wrap gap-4 items-center justify-between">
                  <p className="text-[10px] text-neutral-400 font-bold max-w-sm">
                    *Al aceptar, se enviará el pre-llenado de abasto directo al CEDIS de Arca Continental.
                  </p>
                  
                  <button
                    onClick={executeOrderCheckout}
                    className="px-5 py-2.5 bg-[#E30613] hover:bg-[#b5000b] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm shadow-[#E30613]/10"
                  >
                    Confirmar pedido sugerido
                  </button>
                </div>
              </div>
            </div>

            {/* CARD C: GAMIFICACIÓN ESTILO ALCALDÍA & LOCAL RANKING (USER REQUEST) */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-150/70 space-y-4">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">
                  CUIDA TU MARGEN · COMPETENCIA DE RUTA
                </span>
                <h3 className="text-base font-black text-neutral-800 tracking-tight mt-1">
                  Análisis de Gamificación por Alcaldía
                </h3>
              </div>

              {/* Custom message prompt user asked for */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/70 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
                <div className="space-y-1">
                  <p className="text-xs font-black text-neutral-850">
                    🏆 ¡En la alcaldía <strong className="text-amber-700">Miguel Hidalgo</strong> estás en el ranking #3 de tiendas!
                  </p>
                  <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                    Sigue así sumando puntos EcoDup de sustentabilidad para desbloquear tarifas preferenciales de Arca Continental.
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 shrink-0">
                  <span className="text-3xl font-black text-amber-500">#3</span>
                </div>
              </div>

              {/* High fidelity Leaderboard list display */}
              <div className="border border-neutral-150 rounded-xl overflow-hidden divide-y divide-neutral-100 text-xs">
                
                <div className="p-3 bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-wider flex justify-between">
                  <span>Tienda</span>
                  <span>Alcaldía CDMX</span>
                  <span>Puntos Acumulados</span>
                </div>

                <div className="p-3 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-[10px]">1</span>
                    <span className="font-bold text-neutral-700">Super Don Memo</span>
                  </div>
                  <span className="text-neutral-405 font-semibold">Miguel Hidalgo</span>
                  <span className="font-extrabold text-neutral-800">2,800 pts</span>
                </div>

                <div className="p-3 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-300 text-white font-extrabold flex items-center justify-center text-[10px]">2</span>
                    <span className="font-bold text-neutral-700">Mini Super El Paso</span>
                  </div>
                  <span className="text-neutral-405 font-semibold">Miguel Hidalgo</span>
                  <span className="font-extrabold text-neutral-800">2,550 pts</span>
                </div>

                {/* You */}
                <div className="p-3 flex justify-between items-center bg-amber-500/[0.03] font-sans border-l-4 border-amber-505">
                  <div className="flex items-center gap-2 pl-1">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-[10px]">3</span>
                    <span className="font-black text-[#E30613]">Tienda La Esperanza (Tú)</span>
                  </div>
                  <span className="text-neutral-500 font-bold">Miguel Hidalgo</span>
                  <span className="font-black text-[#E30613]">2,450 pts</span>
                </div>

              </div>

              {/* Double CTA layout: "contactar a asesor o buscar con el chat" */}
              <div className="pt-2 flex flex-wrap gap-3 items-center justify-between select-none">
                <span className="text-[10.5px] text-neutral-400 font-semibold">
                  ¿Quieres escalar el ranking? Ejecuta acciones recomendadas en terreno
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textDesc = `Hola Carlos M., soy el socio de la tienda "La Esperanza". Estoy revisando mi ranking #3 de sustentabilidad EcoDup CDMX y quiero saber cómo puedo acumular más puntos en mi ruta de abasto. ¡Gracias!`;
                      window.open(`https://api.whatsapp.com/send?phone=+525540391280&text=${encodeURIComponent(textDesc)}`, "_blank");
                    }}
                    className="px-4 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold uppercase tracking-wide rounded-lg hover:bg-emerald-100/50 transition cursor-pointer flex items-center gap-1"
                  >
                    Contactar Asesor
                  </button>

                  <button
                    onClick={() => handleKeywordAction("planes")}
                    className="px-4 py-2 bg-neutral-900 text-white text-[10.5px] font-extrabold uppercase tracking-wide rounded-lg hover:bg-[#1a1a1a] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Buscar con Chat
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE BLOCK (col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD D: SEGUIMIENTO DE ENTREGA (MOCKUP ACCORDING TO SCREENSHOT 5) */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-150/70 space-y-4">
              <h3 className="text-base font-black text-neutral-800 tracking-tight font-sans">
                Seguimiento de Entrega
              </h3>

              {/* Graphic map mockup panel */}
              <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-4 overflow-hidden border border-neutral-200 select-none min-h-[174px] flex flex-col justify-between">
                
                {/* Background grid representation */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#1f1f1f 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

                {/* Draw bezier path tracking */}
                <svg className="absolute inset-0 w-full h-full p-6 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                  {/* Dotted path red */}
                  <path
                    d="M 10,40 Q 50,10 90,15"
                    fill="none"
                    stroke="#E30613"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  {/* CEDI DOT */}
                  <circle cx="10" cy="40" r="3" fill="#E30613" stroke="white" strokeWidth="1" />
                  
                  {/* Target Door marker */}
                  <g transform="translate(90, 15)">
                    <circle cx="0" cy="0" r="4.5" fill="#1e3a8a" stroke="white" strokeWidth="1.2" />
                    <rect x="-1" y="-1" width="2" height="2" fill="white" />
                  </g>
                </svg>

                {/* Map Pins Labels positioning */}
                <div className="absolute left-6 bottom-11 p-1 bg-white border border-neutral-150 rounded shadow-xs text-[8.5px] font-mono font-black text-neutral-400">
                  CEDI
                </div>

                <div className="absolute right-6 top-10 p-1.5 bg-neutral-900 border border-neutral-200 rounded shadow-xs text-[8.5px] font-mono font-black text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] animate-ping" />
                  <span>ETA: 9:45 AM</span>
                </div>

                {/* Bottom empty spacing to match beautiful layout */}
                <div className="h-28" />

                {/* Interval and estimates columns of screenshot 5 */}
                <div className="relative z-10 flex items-center gap-3.5 p-3 rounded-xl bg-white/90 border border-neutral-150 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                    <Clock className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[9.5px] text-neutral-400 font-extrabold uppercase tracking-wide">ENTREGA ESTIMADA</p>
                    <p className="text-xs font-black text-neutral-800 leading-none mt-1">
                      Lun 16 jun · 9:00 - 11:00 am
                    </p>
                  </div>
                </div>

              </div>

              {/* Schedule adjustment action button */}
              <button
                onClick={() => {
                  const reason = prompt("Describe el horario sugerido para tu resurtido de ruta de Arca Continental:", "Lunes antes de las 10:00 AM");
                  if (reason) triggerAlert(`Solicitud de ajuste de horario enviada al CEDIS y supervisor.`);
                }}
                className="w-full bg-neutral-100 hover:bg-neutral-200/60 text-neutral-700 text-xs font-bold py-2.5 rounded-xl border border-neutral-200 transition select-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Solicitar cambio de horario
              </button>

            </div>

            {/* CARD E: TUALI CHAT ASSISTANT (USER REQUEST WITH PRE-LOADED CHIPS & AUTOMATED OUTPUTS) */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-150/70 space-y-4">
              <div>
                <span className="text-[10px] font-black text-[#E30613] uppercase tracking-widest block">
                  ASISTENTE DE RETENCIÓN DE RUTA
                </span>
                <h3 className="text-base font-black text-neutral-800 tracking-tight mt-1">
                  Chat de Consultas Tuali
                </h3>
              </div>

              {/* Preloaded search custom chips requested by the user */}
              <div className="flex flex-wrap gap-2 pt-1 select-none text-[11px] font-semibold">
                
                <button
                  onClick={() => handleKeywordAction("especifico")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition cursor-pointer text-left"
                >
                  🔍 Buscar algo en específico
                </button>

                <button
                  onClick={() => handleKeywordAction("planes")}
                  className="px-3 py-1.5 rounded-lg border border-rose-100 bg-[#E30613]/5 hover:bg-[#E30613]/10 text-[#E30613] transition cursor-pointer text-left"
                >
                  📈 Planes para mejorar mis ventas de tuali
                </button>

                <button
                  onClick={() => handleKeywordAction("acceder")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition cursor-pointer text-left"
                >
                  🔑 Cómo acceder a tuali
                </button>

                <button
                  onClick={() => handleKeywordAction("blog")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition cursor-pointer text-left"
                >
                  📰 Ir al blog de tuali
                </button>
              </div>

              {/* Chat history interface layout */}
              <div className="border border-neutral-150 rounded-2xl h-80 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 flex flex-col justify-between">
                
                <div className="space-y-4 flex-grow overflow-y-auto">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${m.sender === "user" ? "ml-auto items-end" : "items-start"}`}
                    >
                      <div className={`p-3 rounded-2xl text-[11.5px] leading-relaxed font-medium ${
                        m.sender === "user"
                          ? "bg-neutral-900 text-white rounded-br-none"
                          : "bg-white text-neutral-800 border border-neutral-150 rounded-bl-none shadow-2xs"
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-neutral-400 font-bold tracking-tight mt-1 px-1">{m.time}</span>
                    </div>
                  ))}

                  {/* Typing animation element */}
                  {isTyping && (
                    <div className="flex items-center gap-1 bg-white p-2.5 rounded-xl border border-neutral-100 w-max pr-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  )}
                </div>

              </div>

              {/* Custom input submission handler form */}
              <form onSubmit={handleSendCustomMessage} className="flex gap-2">
                <input
                  required
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Escribe tu duda sobre abasto, EcoDup o tuali..."
                  className="flex-grow p-3 bg-white text-xs border border-neutral-150 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-505 placeholder:text-neutral-400"
                />
                
                <button
                  type="submit"
                  className="p-3 bg-[#E30613] hover:bg-[#b5000b] text-white rounded-xl transition cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>

        {/* CÓMO PARTICIPAR EN PUNTOS ECO-DUP BANNER */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/[0.03] to-neutral-50 border border-emerald-500/20 rounded-3xl p-6 md:p-8 space-y-6 select-none mt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Guía de Alianzas 🌿
              </span>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                ¿Cómo participar en Puntos Eco-Dup?
              </h3>
              <p className="text-xs text-neutral-600 font-medium">
                Sigue estos simple pasos para reducir la merma de producto en tu colonia y ganar hasta un 15% de bonos extra tuali de ruta.
              </p>
            </div>
            
            <button
              onClick={() => {
                setViewEcoDup(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
                triggerAlert("¡Perfecto! Iniciando participación Eco-Dup...");
              }}
              className="bg-[#10b981] hover:bg-[#0d9488] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition shrink-0 cursor-pointer border-0 shadow-sm shadow-emerald-500/20"
            >
              Iniciar participación Eco-Dupe ⚡
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white p-4.5 rounded-2xl border border-neutral-150 space-y-1.5 shadow-3xs">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">1</span>
              <p className="text-xs font-extrabold text-neutral-800">Recibe recomendaciones</p>
              <p className="text-[10.5px] text-neutral-500 leading-normal font-semibold">
                Nuestra Inteligencia Artificial sugiere el stock seguro semanal basado en tus historiales tuali.
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-neutral-150 space-y-1.5 shadow-3xs">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">2</span>
              <p className="text-xs font-extrabold text-[#0d9488]">Envía tu reporte diario</p>
              <p className="text-[10.5px] text-neutral-500 leading-normal font-semibold">
                Registra tus ventas y mermas en el panel de Eco-Dup para que Arca recalcule la ruta con exactitud.
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#9eddb4]/60 space-y-1.5 shadow-3xs">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">3</span>
              <p className="text-xs font-extrabold text-neutral-800">Suma Eco-puntos de Ruta</p>
              <p className="text-[10.5px] text-neutral-500 leading-normal font-semibold">
                Gana +50 puntos por cada entrega con reporte verificado y sube en el ranking de tu delegación.
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-neutral-150 space-y-1.5 shadow-3xs">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-xs">4</span>
              <p className="text-xs font-extrabold text-neutral-800">Reclama tus recompensas</p>
              <p className="text-[10.5px] text-neutral-500 leading-normal font-semibold">
                Canjea tus puntos acumulados por envíos prioritarios urgentes u obsequios de volumen.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Corporate Metadata Bottom Footer block */}
      <footer className="bg-white border-t border-neutral-150 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Servidor de Tienda Seguro</span>
        </div>
        <span>Portal del Socio Arca Continental · Tuali Coaxial © 2026</span>
      </footer>

    </div>
  );
}
