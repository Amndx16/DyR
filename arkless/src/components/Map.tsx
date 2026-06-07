import React, { useState } from "react";
import { StoreItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface MapProps {
  stores: StoreItem[];
  selectedStore: StoreItem | null;
  onSelectStore: (store: StoreItem) => void;
  activeFilter: string;
}

export default function Map({
  stores,
  selectedStore,
  onSelectStore,
  activeFilter,
}: MapProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomScale(1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Abstracted stylized geometric paths of Mexico States to render a stunning vector map
  // Maps simplified coordinate representation for aesthetic and interactive accuracy
  const MEXICO_STATES_SHAPES = [
    {
      name: "Baja California",
      path: "M 30,20 Q 50,40 60,80 L 100,120 L 70,165 Q 60,130 50,70 Z",
      fill: "#f8f9fa",
      avgRisk: 91,
    },
    {
      name: "Chihuahua",
      path: "M 130,50 L 220,70 L 200,160 L 160,180 L 110,130 Z",
      fill: "#fef3c7",
      avgRisk: 42,
    },
    {
      name: "Sonora",
      path: "M 60,80 Q 90,90 120,50 L 130,125 L 110,180 Z",
      fill: "#f0fdf4",
      avgRisk: 18,
    },
    {
      name: "Coahuila",
      path: "M 220,70 L 280,100 L 260,200 L 200,160 Z",
      fill: "#fef3c7",
      avgRisk: 33,
    },
    {
      name: "Nuevo León",
      path: "M 280,100 L 310,120 L 290,210 L 260,200 Z",
      fill: "#fee2e2",
      avgRisk: 48,
    },
    {
      name: "Tamaulipas",
      path: "M 310,121 C 330,160 320,220 300,250 L 290,210 Z",
      fill: "#f0fdf4",
      avgRisk: 25,
    },
    {
      name: "Sinaloa & Durango",
      path: "M 110,180 L 160,180 L 200,160 L 200,240 L 150,220 Z",
      fill: "#fef3c7",
      avgRisk: 39,
    },
    {
      name: "San Luis Potosí",
      path: "M 230,210 L 280,210 L 280,260 L 220,250 Z",
      fill: "#fee2e2",
      avgRisk: 61,
    },
    {
      name: "Jalisco",
      path: "M 160,240 L 220,250 L 210,310 L 170,300 Z",
      fill: "#fee2e2",
      avgRisk: 72,
    },
    {
      name: "Guanajuato & Querétaro",
      path: "M 220,250 L 250,252 L 250,285 L 220,280 Z",
      fill: "#f0fdf4",
      avgRisk: 24,
    },
    {
      name: "CDMX & El Centro",
      path: "M 250,285 H 275 V 315 H 250 Z",
      fill: "#fee2e2",
      avgRisk: 86,
    },
    {
      name: "Puebla",
      path: "M 275,285 L 300,290 L 290,340 L 270,330 Z",
      fill: "#fef3c7",
      avgRisk: 35,
    },
    {
      name: "Veracruz",
      path: "M 290,240 C 330,290 380,330 420,340 L 370,360 L 300,290 Z",
      fill: "#f0fdf4",
      avgRisk: 15,
    },
    {
      name: "Oaxaca & Guerrero",
      path: "M 210,310 C 270,320 330,350 370,360 L 340,410 L 220,380 Z",
      fill: "#f0fdf4",
      avgRisk: 22,
    },
    {
      name: "Chiapas",
      path: "M 370,360 L 440,380 L 410,430 L 340,410 Z",
      fill: "#fef3c7",
      avgRisk: 31,
    },
    {
      name: "Península de Yucatán",
      path: "M 420,340 L 500,310 L 520,360 L 450,380 Z",
      fill: "#f0fdf4",
      avgRisk: 12,
    },
  ];

  // Helper to color state shapes by their simulated core risk level
  const getStateFill = (avgRisk: number, name: string) => {
    if (hoveredState === name) return "rgba(181, 0, 11, 0.18)"; // Hover color
    if (avgRisk > 70) return "#fee2e2"; // Red
    if (avgRisk > 30) return "#fef3c7"; // Yellow/Orange
    return "#f0fdf4"; // Green
  };

  const getMarkerColor = (risk: number) => {
    if (risk >= 70) return "#E30613"; // Critical
    if (risk >= 30) return "#F59E0B"; // Alert
    return "#10B981"; // Healthy
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 relative shadow-lg border border-neutral-100 flex flex-col h-[520px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-800" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Mapa de Calor: Riesgo Territorial
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            Visualización geoespacial e indicadores tácticos por sucursales
          </p>
        </div>

        {/* Custom styled zoom control rails */}
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-neutral-50 text-neutral-700 shadow-sm transition"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-neutral-50 text-neutral-700 shadow-sm transition"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-neutral-50 text-neutral-700 shadow-sm transition"
            title="Restablecer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div
        className="relative flex-1 bg-neutral-50 rounded-xl border border-neutral-200/60 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          viewBox="0 0 600 450"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Inner Transform Group controlled by custom zoom handlers */}
          <g
            transform={`translate(${dragOffset.x}, ${dragOffset.y}) scale(${zoomScale})`}
            style={{ transition: isDragging ? "none" : "transform 0.15s ease-out" }}
          >
            {/* Base grid lines for a professional blueprint/cartography style */}
            <g stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.6">
              <line x1="0" y1="50" x2="600" y2="50" />
              <line x1="0" y1="150" x2="600" y2="150" />
              <line x1="0" y1="250" x2="600" y2="250" />
              <line x1="0" y1="350" x2="600" y2="350" />
              <line x1="100" y1="0" x2="100" y2="450" />
              <line x1="250" y1="0" x2="250" y2="450" />
              <line x1="400" y1="0" x2="400" y2="450" />
              <line x1="550" y1="0" x2="550" y2="450" />
            </g>

            {/* Stylized vector paths for Mexico's states */}
            <g stroke="#ffffff" strokeWidth="1.5">
              {MEXICO_STATES_SHAPES.map((state) => (
                <path
                  key={state.name}
                  d={state.path}
                  fill={getStateFill(state.avgRisk, state.name)}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => {
                    // Quick state filtering triggers
                    const stateStore = stores.find((s) => s.state === state.name || (state.name.includes(s.state)));
                    if (stateStore) {
                      onSelectStore(stateStore);
                    }
                  }}
                />
              ))}
            </g>

            {/* Render interactive markers on top of states */}
            {stores.map((store) => {
              const isSelected = selectedStore?.id === store.id;
              const markerColor = getMarkerColor(store.risk);

              return (
                <g
                  key={store.id}
                  transform={`translate(${store.coords.x}, ${store.coords.y})`}
                  onClick={() => onSelectStore(store)}
                  className="cursor-pointer"
                >
                  {/* Outer pulse effect for high-risk / critical clients */}
                  {store.risk >= 70 && (
                    <circle
                      r="12"
                      fill={markerColor}
                      opacity="0.3"
                      className="animate-ping"
                      style={{ animationDuration: "2.5s" }}
                    />
                  )}

                  {/* Selecting highlight ring */}
                  {isSelected && (
                    <circle
                      r="9"
                      fill="none"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                      className="animate-spin"
                      style={{ animationDuration: "8s" }}
                    />
                  )}

                  {/* Solid core pinpoint marker */}
                  <circle
                    r={isSelected ? "6" : "4.5"}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "2" : "1.5"}
                    className="transition-all hover:scale-135 duration-100"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic Map Hover Tooltip overlay */}
        <AnimatePresence>
          {hoveredState && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-4 left-4 bg-neutral-900/90 text-white px-3 py-1.5 rounded-xl border border-neutral-700/50 backdrop-blur-sm shadow-lg text-[11px] font-medium pointer-events-none flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>
                <strong>Región:</strong> {hoveredState}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating heat map status label keys */}
        <div className="absolute right-4 bottom-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-neutral-200/50 text-[10px] space-y-1.5 shadow-sm max-w-[140px]">
          <div className="font-bold text-neutral-700 tracking-wide uppercase text-[9px] mb-1">
            Niveles de Riesgo
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E30613]"></span>
            <span className="text-neutral-600 font-semibold">Crítico (&gt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-neutral-600 font-semibold">Alerta (30-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span className="text-neutral-600 font-semibold">Saludable (&lt;30%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
