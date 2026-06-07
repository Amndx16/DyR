import React from "react";
import { motion } from "motion/react";
import { TrendingUp, Store, ChevronRight } from "lucide-react";
import ArklessLogo from "./ArklessLogo";

interface LandingViewProps {
  onEnterAsSeller: () => void;
  onEnterAsCustomer: () => void;
}

export default function LandingView({ onEnterAsSeller, onEnterAsCustomer }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFF2F2] via-[#FFFFFF] to-[#FFEAEA] flex flex-col justify-between p-8 relative overflow-hidden select-none">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-50/50 blur-3xl pointer-events-none" />

      {/* Header Container */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        {/* Arca Continental Left Side Logo + arkLess tiny tag */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Stylized Red triangle structure of Arca Continental */}
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15L85 75H15L50 15Z" fill="#b5000b" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-black tracking-widest text-[#4A4A4A] uppercase">ARCA</span>
              <span className="text-[7.5px] font-bold tracking-widest text-neutral-400 uppercase">CONTINENTAL</span>
            </div>
          </div>
          
          <div className="h-5 w-px bg-neutral-200" />
          
          {/* Subtle branding representation */}
          <ArklessLogo size="sm" type="icono" />
        </div>

        {/* Small subtle badge */}
        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider bg-neutral-100/80 px-3.5 py-1.5 rounded-full border border-neutral-200/40">
          Entorno Demo V2.4
        </div>
      </header>

      {/* Main Focus Split Selector Container */}
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto gap-12 z-10">
        
        {/* arkLess Brand Icon & Titles */}
        <div className="text-center space-y-4 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <ArklessLogo size="xl" type="completo" theme="light" className="transition hover:scale-105 duration-350 cursor-pointer" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[#8A8A8A] uppercase tracking-[0.25em]">
              PLATAFORMA DE RETENCIÓN INTELIGENTE
            </p>
            <p className="text-[11px] font-extrabold text-[#E30613] flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]" />
              Arca Continental Corporativo
            </p>
          </div>
        </div>

        {/* Double Column Choices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Vista Vendedor */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/85 backdrop-blur-md rounded-[32px] p-8 border border-red-500/10 shadow-[0_15px_40px_rgba(227,6,19,0.03)] hover:shadow-[0_20px_50px_rgba(227,6,19,0.06)] flex flex-col justify-between gap-8 text-left transition relative overflow-hidden"
          >
            {/* Icon Block */}
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-7 h-7 text-[#E30613]" />
              </div>

              {/* Text content block */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-neutral-800" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Vista Vendedor
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                  Visualiza el churn de tu zona, identifica clientes en riesgo y lanza acciones de retención automatizadas antes de perderlos.
                </p>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <span className="text-[10px] font-black bg-red-50 text-red-500 px-3.5 py-1.5 rounded-full border border-red-100">
                  8 EN RIESGO ALTO
                </span>
                <span className="text-[10px] font-black bg-neutral-50 text-neutral-600 px-3.5 py-1.5 rounded-full border border-neutral-150">
                  $48,200 MXN EN RIESGO
                </span>
              </div>
            </div>

            {/* Entry button */}
            <button
              onClick={onEnterAsSeller}
              className="w-full bg-[#1F1F1F] hover:bg-neutral-900 text-white font-bold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Entrar como vendedor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Card 2: Vista Cliente */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/85 backdrop-blur-md rounded-[32px] p-8 border border-red-500/10 shadow-[0_15px_40px_rgba(227,6,19,0.03)] hover:shadow-[0_20px_50px_rgba(227,6,19,0.06)] flex flex-col justify-between gap-8 text-left transition relative overflow-hidden"
          >
            {/* Icon Block */}
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm">
                <Store className="w-7 h-7 text-emerald-600" />
              </div>

              {/* Text content block */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-neutral-800" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Vista Cliente
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                  Consulta tus predicciones de stock, registra tus ventas diarias, gana recompensas EcoDup y optimiza tus entregas.
                </p>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3.5 py-1.5 rounded-full border border-emerald-100">
                  340 PTS ECODUP
                </span>
                <span className="text-[10px] font-black bg-neutral-50 text-neutral-600 px-3.5 py-1.5 rounded-full border border-neutral-150">
                  PRÓXIMO RESURTIDO: 16 JUN
                </span>
              </div>
            </div>

            {/* Entry button */}
            <button
              onClick={onEnterAsCustomer}
              className="w-full bg-[#1F1F1F] hover:bg-neutral-900 text-white font-bold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Entrar como tienda</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      </main>

      {/* Footer Meta Sections */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col items-center gap-6 z-10 pt-8 border-t border-red-500/5">
        
        {/* Central Thumbnail visual indicators */}
        <div className="flex gap-4">
          <div className="w-14 h-12 rounded-xl overflow-hidden border border-neutral-200/80 shadow-inner bg-neutral-900/5 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=40" 
              alt="Analytics Thumbnail 1"
              className="w-full h-full object-cover opacity-60 filter grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
          <div className="w-14 h-12 rounded-xl overflow-hidden border border-neutral-200/80 shadow-inner bg-neutral-900/5 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=40" 
              alt="Analytics Thumbnail 2"
              className="w-full h-full object-cover opacity-60 filter grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        </div>

        {/* Corporate Legal Text and Credits */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9.5px] font-black tracking-widest text-[#7E7E7E]/80 uppercase">
            ADVANCED ANALYTICS DIVISION • 2026
          </span>
          <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-neutral-400">
            <span>© ARCA CONTINENTAL S.A.B. DE C.V.</span>
            <span>•</span>
            <span className="text-[#E30613]/80 uppercase tracking-widest">arkLess PRO v2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
