import React, { useState } from "react";
import { EVOLUTION_DATA, PRODUCT_DATA, ZONE_DATA, AI_PRED_DATA } from "../data";
import { ChartDataPoint } from "../types";
import { motion } from "motion/react";
import { Sparkles, Bolt } from "lucide-react";

export default function EvolutionChart() {
  const [activeTab, setActiveTab] = useState<"annual" | "product" | "zone" | "ai">("annual");

  // Map tabs to active dataset
  const getDataset = (): ChartDataPoint[] => {
    switch (activeTab) {
      case "annual":
        return EVOLUTION_DATA;
      case "product":
        return PRODUCT_DATA;
      case "zone":
        return ZONE_DATA;
      case "ai":
        return AI_PRED_DATA;
    }
  };

  const data = getDataset();

  // Dimensions configuration for customized SVG graph layout
  const width = 1000;
  const height = 240;
  const paddingX = 60;
  const paddingY = 30;

  const maxVal = 100;

  // Coordinate projection mapping
  const getCoords = (index: number, val: number) => {
    const spaceX = (width - paddingX * 2) / (data.length - 1 || 1);
    const x = paddingX + index * spaceX;
    const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
    return { x, y };
  };

  // Build the responsive Bezier curve path string for the line
  const buildSmoothPath = () => {
    if (data.length === 0) return "";
    let path = "";
    data.forEach((d, i) => {
      const { x, y } = getCoords(i, d.recovered);
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prev = getCoords(i - 1, data[i - 1].recovered);
        // Controls point offsets to shape a beautiful smooth continuous S-curve
        const cp1x = prev.x + (x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (x - prev.x) / 2;
        const cp2y = y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    });
    return path;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 flex flex-col gap-6">
      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Tab pills */}
        <div className="flex border-b border-neutral-100 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("annual")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 tracking-wide transition ${
              activeTab === "annual"
                ? "border-[#b5000b] text-[#b5000b]"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Evolución anual
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 tracking-wide transition ${
              activeTab === "product"
                ? "border-[#b5000b] text-[#b5000b]"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Por producto
          </button>
          <button
            onClick={() => setActiveTab("zone")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 tracking-wide transition ${
              activeTab === "zone"
                ? "border-[#b5000b] text-[#b5000b]"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Por zona
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 tracking-wide transition flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "border-[#b5000b] text-[#b5000b]"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Predicción IA
          </button>
        </div>

        {/* Legend block */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#E30613] rounded-sm shrink-0"></span>
              <span>Riesgo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#10B981] rounded-sm shrink-0"></span>
              <span>Recuperados</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#b5000b]/5 px-3 py-1.5 rounded-xl border border-[#b5000b]/15">
            <Bolt className="w-3.5 h-3.5 text-[#b5000b] animate-bounce" />
            <span className="text-[9px] font-bold text-[#b5000b] uppercase tracking-wider">
              Powered by XGBoost
            </span>
          </div>
        </div>
      </div>

      {/* Actual SVG Chart plotting area */}
      <div className="relative h-[250px] w-full">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Chart Background Horizontal Rules */}
          {[0, 25, 50, 75, 100].map((level) => {
            const tempY = height - paddingY - (level / maxVal) * (height - paddingY * 2);
            return (
              <g key={level} opacity="0.4">
                <line
                  x1={paddingX}
                  y1={tempY}
                  x2={width - paddingX}
                  y2={tempY}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingX - 12}
                  y={tempY + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  className="font-mono text-[10px] font-bold"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Render columns representing Risk volume */}
          {data.map((d, i) => {
            const spaceX = (width - paddingX * 2) / (data.length - 1 || 1);
            const barWidth = Math.min(spaceX * 0.45, 45);
            const { x, y } = getCoords(i, d.risk);
            const bottomY = height - paddingY;
            const barHeight = bottomY - y;

            return (
              <g key={`bar-${i}`}>
                {/* Visual glow backdrop on hovering */}
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#E30613"
                  rx="6"
                  className="transition-all hover:fill-[#ff333d] cursor-pointer"
                />
                {/* Floating exact value over column bars */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#7f1d1d"
                  className="text-[10px] font-mono font-bold"
                >
                  {d.risk}%
                </text>
              </g>
            );
          })}

          {/* Glowing gradient stroke for line */}
          <path
            d={buildSmoothPath()}
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
          />

          {/* Bullet coordinate dots plotting Recovered values */}
          {data.map((d, i) => {
            const { x, y } = getCoords(i, d.recovered);
            return (
              <g key={`dot-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#10B981"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all hover:r-7"
                />
                <text
                  x={x}
                  y={y + 16}
                  textAnchor="middle"
                  fill="#064e3b"
                  className="text-[9px] font-mono font-extrabold"
                >
                  {d.recovered}%
                </text>
              </g>
            );
          })}

          {/* Footer categorical labels */}
          {data.map((d, i) => {
            const { x } = getCoords(i, 0);
            return (
              <text
                key={`lbl-${i}`}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fill="#64748b"
                className="text-[10px] font-bold tracking-wider"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
