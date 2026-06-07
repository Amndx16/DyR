import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Tv, 
  Award, 
  Clock, 
  Brain, 
  ChevronRight, 
  ArrowRight, 
  Play, 
  Download,
  Users,
  Eye,
  Settings,
  ShieldCheck,
  TrendingUp,
  Volume2,
  Accessibility
} from "lucide-react";

interface TrainingViewProps {
  onRedirectToTualiEasy: () => void;
  userPoints?: number;
}

export default function TrainingView({ onRedirectToTualiEasy, userPoints = 850 }: TrainingViewProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCourseDetail, setShowCourseDetail] = useState<string | null>(null);

  const categories = ["Todos", "Ventas", "Digitalización", "Productos", "Finanzas"];

  const courses = [
    {
      id: "opt-inventario",
      title: "Optimización de Inventario",
      category: "Digitalización",
      points: 200,
      duration: "25 min",
      difficulty: "Intermedio",
      description: "Aprende a balancear tu stock de refrescos y aguas purificadas según las predicciones de Arca, evitando faltantes de producto en horas pico.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80",
      recommended: true
    },
    {
      id: "finanzas-micro",
      title: "Finanzas para Micro-negocios",
      category: "Finanzas",
      points: 100,
      duration: "20 min",
      difficulty: "Intermedio",
      description: "Estructura tus ingresos, gastos diarios y calcula márgenes reales para asegurar la rentabilidad de tu tiendita.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
      recommended: false
    },
    {
      id: "venta-cruzada",
      title: "Estrategias de Venta Cruzada",
      category: "Ventas",
      points: 50,
      duration: "10 min",
      progress: 50,
      difficulty: "Básico",
      description: "Descubre cómo emparejar bebidas específicas con botanas o alimentos preparados para incrementar tu ticket promedio hasta un 25%.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=80",
      recommended: false
    },
    {
      id: "productos-frescos",
      title: "Manejo de Productos Frescos",
      category: "Productos",
      points: 75,
      duration: "15 min",
      difficulty: "Básico",
      description: "Consejos clave para la rotación correcta de jugos y productos lácteos utilizando las vitrinas frías con máxima eficiencia energética.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
      recommended: false
    },
    {
      id: "digitalizar-3-pasos",
      title: "Cómo digitalizar tu tienda en 3 pasos",
      category: "Digitalización",
      points: 150,
      duration: "15 min",
      difficulty: "Básico",
      description: "Usa el celular para gestionar tus pedidos automáticos, registrar mermas fácil y ganar premios que mejoran tu visibilidad en mapas de reparto de Arca.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80",
      featured: true
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === "Todos" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedCourses = [
    { title: "Introducción a Churn Hunters", date: "Hace 2 días", points: 100 },
    { title: "Atención al Cliente Nivel 1", date: "15 Oct 2023", points: 150 },
    { title: "Inventario Básico", date: "02 Oct 2023", points: 100 }
  ];

  const handleDownloadBadge = () => {
    alert("¡Descargando tu Insignia de Socio Capacitado de Arca Continental! (Archivo PNG preparado).");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER BRANDED */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5 select-none">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            <GraduationCap className="w-7 h-7 text-[#E30613]" /> Centro de Capacitación
          </h2>
          <p className="text-xs text-neutral-500 font-bold mt-1">
            Aprende, gana puntos y mejora tu negocio
          </p>
        </div>

        {/* Big accessible redirect button specifically highlighting Tuali Easy Mode */}
        <button
          onClick={onRedirectToTualiEasy}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl transition shadow-lg shrink-0 flex items-center gap-2.5 border-0 cursor-pointer animate-pulse"
        >
          <Accessibility className="w-4 h-4 animate-bounce" />
          <span>Ingresar a Tuali (Modo Fácil Paso a Paso)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Learning Material (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* FEATURED COURSE CONTAINER HERO (Top banner of the image) */}
          <div className="bg-white rounded-3xl border border-neutral-150 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className="bg-neutral-900 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 leading-none select-none">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      CURSO DESTACADO
                    </span>
                    <span className="text-neutral-400 font-bold text-[10.5px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 15 min
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                    Cómo digitalizar tu tienda en 3 pasos
                  </h3>

                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                    Aprende las herramientas esenciales para llevar tu negocio al siguiente nivel, atraer más clientes y gestionar tu inventario desde el celular.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowCourseDetail("digitalizar-3-pasos")}
                    className="bg-[#b5000b] hover:bg-[#900008] text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition cursor-pointer border-0 shadow-sm shadow-red-500/25 flex items-center gap-1.5"
                  >
                    <span>Comenzar</span> <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 select-none text-[11px]">
                    🌿 +150 pts
                  </span>
                </div>
              </div>

              {/* Graphic Right Section (Illustration representation from layout image) */}
              <div className="md:col-span-5 relative bg-neutral-50 min-h-48 md:min-h-auto">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=80"
                  alt="Shop Digitalization representation"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:block hidden" />
              </div>
            </div>
          </div>

          {/* FILTER CATEGORY PILLS (Horizontal categories row matching screen) */}
          <div className="flex flex-wrap items-center gap-2 select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#eaf6ee] text-[#15803d] border-[#9eddb4] font-extrabold"
                    : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* DYNAMIC SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar capacitaciones..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs border border-neutral-200 focus:ring-1 focus:ring-red-500 rounded-xl text-neutral-700"
            />
          </div>

          {/* WHY ARE YOU HERE ACCESSIBLE ALIGNMENT BANNER (The highlighted recommendation box) */}
          <div className="bg-[#FFF2F2] border border-[#ffcccc]/45 rounded-3xl p-6 relative overflow-hidden select-none">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-700">
                <Brain className="w-5 h-5 text-[#b5000b] animate-bounce" />
                <h4 className="text-sm font-black uppercase tracking-wider text-rose-900">¿Por qué estás aquí?</h4>
              </div>
              
              <p className="text-xs text-neutral-600 font-bold leading-normal">
                ● Detectamos que tus ventas bajaron · Esta capacitación sugerida por la IA te ayudará a revertirlo al instante:
              </p>

              {/* RECOMMENDED TARGET COURSE CARD */}
              <div className="bg-white border border-[#ffcccc]/70 rounded-2xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-xs transition">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[9.5px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded">
                    RECOMENDADO PARA TI
                  </span>
                  <p className="text-base font-black text-neutral-800 tracking-tight">Optimización de Inventario</p>
                  <p className="text-[11px] text-neutral-400 font-bold flex items-center gap-3">
                    <span>⚙ Operaciones</span>
                    <span>·</span>
                    <span>⏱ 25 min</span>
                  </p>
                </div>

                <div className="flex items-center gap-3.5 shrink-0">
                  <span className="text-emerald-700 text-xs font-black bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-lg">
                    🍀 +200 pts
                  </span>
                  <button
                    onClick={() => setShowCourseDetail("opt-inventario")}
                    className="text-xs font-extrabold text-[#b5000b] hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
                  >
                    Ver curso <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AVAILABLE MODULES LIST SECTION */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-neutral-800 tracking-tight">
              Módulos Disponibles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCourses.filter(c => !c.featured && c.id !== "opt-inventario").map((course) => (
                <div 
                  key={course.id}
                  className="bg-white rounded-2xl border border-neutral-150 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail of Course */}
                    <div className="h-32 bg-neutral-100 relative">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <span className="absolute left-3 top-3 bg-white/90 backdrop-blur-xs text-[10px] text-neutral-700 font-extrabold px-2.5 py-0.5 rounded-md shadow-xs uppercase">
                        {course.category}
                      </span>
                      <span className="absolute right-3 top-3 bg-emerald-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded">
                        +{course.points} pts
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-black text-neutral-800 tracking-tight leading-tight line-clamp-2">
                        {course.title}
                      </h4>

                      {course.progress !== undefined && (
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                            <span>Progreso</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 overflow-hidden rounded-full">
                            <div className="h-full bg-[#10b981]" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-neutral-400 font-bold flex gap-2">
                        <span>⏱ {course.duration}</span>
                        <span>·</span>
                        <span>📊 {course.difficulty}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-1">
                    <button
                      onClick={() => setShowCourseDetail(course.id)}
                      className={`w-full py-2 text-xs font-black uppercase rounded-lg transition border cursor-pointer ${
                        course.progress !== undefined 
                          ? "bg-[#b5000b] hover:bg-[#900008] text-white border-transparent shadow-sm"
                          : "bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      {course.progress !== undefined ? "Continuar" : "Ver detalles"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PERSONAL ACHIEVEMENTS STATS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-neutral-150/70 shadow-2xs space-y-5 text-center select-none">
            
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-800 tracking-tight">Mis Logros</h3>
                <p className="text-[11px] text-neutral-400 font-semibold">Sigue aprendiendo para subir de nivel</p>
              </div>
            </div>

            {/* Total eco points indicator container matches mockup box */}
            <div className="bg-[#fcfdfc] border border-emerald-500/15 rounded-2xl p-4.5 space-y-1 text-center">
              <p className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">Total de puntos ganados</p>
              <h4 className="text-3xl font-black text-emerald-600 tracking-tight font-sans">
                {userPoints} <span className="text-xs font-bold text-neutral-500 uppercase">pts</span>
              </h4>
            </div>

            {/* COMPLETED LIST */}
            <div className="space-y-3.5 text-left pt-1">
              <p className="text-[10.5px] font-black text-neutral-400 uppercase tracking-wider">Cursos Completados</p>
              
              <div className="space-y-2.5">
                {completedCourses.map((c, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-neutral-50 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100/60 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                      <div>
                        <p className="font-extrabold text-neutral-800 text-[11px]">{c.title}</p>
                        <p className="text-[9.5px] text-neutral-400 font-semibold mt-0.5">{c.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 px-2 py-0.5 rounded">+{c.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownloadBadge}
              className="w-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 text-[11px] font-extrabold uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition flex items-center justify-center gap-2 shadow-3xs"
            >
              <Download className="w-4 h-4 text-neutral-400" /> Descargar Insignia (PNG)
            </button>
          </div>

          {/* SIMULATOR QUICK PORTAL */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white space-y-4 shadow-md select-none relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 w-24 h-24 bg-white/5 rounded-full" />
            
            <div className="space-y-2">
              <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase">TUALI MODO FÁCIL</span>
              <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Guías Adaptadas para Adultos Mayores</h3>
              <p className="text-xs text-emerald-100 leading-normal">
                Aprende de forma intuitiva con pantallas grandes, botones gigantes y narración por voz paso a paso para mermas, pedidos y canjes.
              </p>
            </div>

            <button
              onClick={onRedirectToTualiEasy}
              className="w-full bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-black uppercase py-3 rounded-xl transition cursor-pointer border-0 shadow-xs flex items-center justify-center gap-1.5"
            >
              Iniciar Tutorial Guiado <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
            </button>
          </div>

        </div>

      </div>

      {/* VIEW DETAILS MODAL overlay */}
      <AnimatePresence>
        {showCourseDetail && (() => {
          const course = courses.find(c => c.id === showCourseDetail);
          if (!course) return null;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[80] overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl w-full max-w-xl p-6 border border-neutral-150 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2.5 py-1 rounded">
                    {course.category}
                  </span>
                  <button 
                    onClick={() => setShowCourseDetail(null)}
                    className="text-neutral-400 hover:text-neutral-600 font-bold text-sm cursor-pointer"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight">{course.title}</h3>
                  <p className="text-xs text-neutral-500 font-bold flex gap-4">
                    <span>⏱ Duración: {course.duration}</span>
                    <span>·</span>
                    <span>📊 Dificultad: {course.difficulty}</span>
                    <span>·</span>
                    <span>🍀 Puntos: {course.points} pts</span>
                  </p>
                  <img src={course.image} alt={course.title} className="w-full h-44 object-cover rounded-2xl border border-neutral-150" />
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">{course.description}</p>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-500/10 space-y-1.5">
                  <p className="text-xs font-extrabold text-emerald-800">¿Qué aprenderás en este módulo?</p>
                  <ul className="list-disc pl-4 text-[11px] text-neutral-500 font-medium space-y-1">
                    <li>Conceptos básicos adaptados al comercio tradicional familiar.</li>
                    <li>Guía práctica de simulación paso a paso interactivo.</li>
                    <li>Ganar puntos EcoDup canjeables al culminar el módulo exitosamente.</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowCourseDetail(null);
                      onRedirectToTualiEasy();
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition cursor-pointer border-0 shadow-sm"
                  >
                    Comenzar con Tutorial Guiado 🌿
                  </button>
                  <button
                    onClick={() => {
                      setShowCourseDetail(null);
                      alert("Has iniciado la lectura del PDF de soporte para '" + course.title + "'.");
                    }}
                    className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-bold px-4 py-3 rounded-xl cursor-pointer transition"
                  >
                    Descargar Guía PDF
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
