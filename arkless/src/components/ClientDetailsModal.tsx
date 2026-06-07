import React from "react";
import { StoreItem } from "../types";
import { X, MessageCircle, AlertCircle, TrendingUp, Calendar, ShieldCheck, Clipboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClientDetailsModalProps {
  store: StoreItem | null;
  onClose: () => void;
}

export default function ClientDetailsModal({
  store,
  onClose,
}: ClientDetailsModalProps) {
  if (!store) return null;

  // Build a pre-composed template text for Carlos to shoot quick WhatsApp follow ups
  const whatsappText = encodeURIComponent(
    `Hola, un saludo de parte de arkLess. Nos comunicamos de parte de la supervisoría de ruta. Esperamos que se encuentre excelente. Notamos que tiene ${store.risk > 70 ? "algunos ciclos sin registrar su pedido habitual" : "cierta baja en su inventario de productos estrella"}. Nos encantaría coordinar una visita táctica o aplicar algún cupón exclusivo de reactivación para usted. ¿Le parece bien?`
  );

  const getRiskLabel = (risk: number) => {
    if (risk >= 70) return `RIESGO CRÍTICO (${risk}%)`;
    if (risk >= 30) return `RIESGO ALERTA (${risk}%)`;
    return `SALUDABLE (${risk}%)`;
  };

  const getRiskColorClass = (risk: number) => {
    if (risk >= 70) return "bg-red-50 text-red-600 border-red-200/50";
    if (risk >= 30) return "bg-amber-50 text-amber-600 border-amber-200/50";
    return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Back drop overlay blur */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Glass panel modal block */}
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-white/85 backdrop-blur-xl w-full max-w-2xl rounded-3xl p-8 relative z-10 border border-white/65 shadow-2xl flex flex-col gap-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Store summary layout */}
        <div className="flex items-start gap-6 pb-2">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-neutral-200 shadow-md shrink-0">
            <img
              alt={store.name}
              className="w-full h-full object-cover"
              src={store.image}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h2
              className="text-2xl font-bold text-neutral-800 tracking-tight leading-tight mb-2 truncate"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {store.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 leading-none shrink-0 ${getRiskColorClass(
                  store.risk
                )}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    store.risk >= 70
                      ? "bg-red-500 animate-pulse"
                      : store.risk >= 30
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                {getRiskLabel(store.risk)}
              </span>
              <span className="text-xs text-neutral-400 font-bold shrink-0">
                ID: {store.id}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* SHAP explanation */}
          <div className="space-y-3.5 flex flex-col">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-[#b5000b] flex items-center gap-1.5"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              <AlertCircle className="w-4 h-4" /> Causales Probabilísticas (SHAP)
            </h4>
            <div className="space-y-2 flex-grow">
              {store.causals.map((causal, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/60 border border-neutral-100 flex justify-between items-center gap-4 hover:shadow-sm transition"
                >
                  <span className="text-xs text-neutral-700 font-semibold leading-relaxed">
                    {causal.factor}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#b5000b] text-right shrink-0">
                    {causal.effect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-neutral-50/50 border border-neutral-100 rounded-2xl p-5 flex flex-col gap-3.5">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-neutral-600"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Métricas Operativas
            </h4>
            <div className="grid grid-cols-2 gap-3 flex-grow">
              <div className="p-3 rounded-xl bg-white border border-neutral-100 text-center flex flex-col justify-center shadow-sm">
                <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
                  VOL. ANUAL
                </p>
                <p className="text-sm font-black text-neutral-800">{store.volume}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-100 text-center flex flex-col justify-center shadow-sm">
                <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
                  ÚLT. VISITA
                </p>
                <span className="text-xs font-bold text-neutral-800 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-500 shrink-0" />
                  {store.lastVisit}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-100 text-center flex flex-col justify-center shadow-sm">
                <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
                  CREDIT SCORE
                </p>
                <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-0.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {store.creditScore}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-100 text-center flex flex-col justify-center shadow-sm">
                <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1">
                  PRODUCT MIX
                </p>
                <p className="text-[11px] font-bold text-neutral-600 truncate">{store.productMix}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Action Buttons Footers */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-100 select-none">
          <button
            onClick={() => alert(`Seguimiento agendado para: ${store.name}`)}
            className="flex-1 bg-[#b5000b] hover:bg-[#920007] text-white py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-transform hover:scale-[1.01] shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" /> Ver seguimiento
          </button>
          <button
            onClick={() => alert(`Incidencias registradas para ${store.name} han sido cargadas.`)}
            className="flex-1 bg-white hover:bg-neutral-50 text-neutral-700 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition border border-neutral-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clipboard className="w-4 h-4" /> Buscar incidencias
          </button>

          {/* Secure external real WhatsApp link API integration */}
          <a
            href={`https://api.whatsapp.com/send?phone=${store.whatsapp}&text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl flex items-center justify-center hover:scale-[1.03] transition-all shadow-md shrink-0 cursor-pointer"
            title="Enviar WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
