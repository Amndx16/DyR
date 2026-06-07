import React, { useState } from "react";

interface ArklessLogoProps {
  className?: string;
  type?: "icono" | "completo" | "nombre";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
}

export default function ArklessLogo({
  className = "",
  type = "completo", // "icono" | "completo" | "nombre"
  size = "md",
  theme = "dark",
}: ArklessLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Dimensions configuration map representing heights
  const dimensions = {
    sm: { heightClass: "h-6 md:h-7", width: "w-7", height: "h-7", fontSize: "text-lg" },
    md: { heightClass: "h-9 md:h-10", width: "w-10", height: "h-10", fontSize: "text-xl" },
    lg: { heightClass: "h-12 md:h-14", width: "w-14", height: "h-14", fontSize: "text-3xl" },
    xl: { heightClass: "h-16 md:h-20", width: "w-20", height: "h-20", fontSize: "text-4xl" },
  };

  const { heightClass, width, height, fontSize } = dimensions[size];

  // Helper to render the vector SVG fallback "A" icon with the white 4-point star in case image fails to load
  const renderSVGIcon = () => (
    <svg
      className={`${width} ${height} shrink-0 drop-shadow-md`}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="arklessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="60%" stopColor="#b30006" />
          <stop offset="100%" stopColor="#730003" />
        </linearGradient>
      </defs>

      {/* Curved letter 'A' shape */}
      <path
        d="M256 32C240 32 210 50 180 110L42 390C28 420 32 448 64 464C96 480 128 472 144 440L190 350C195 340 210 320 220 320C230 320 236 332 242 342L282 430C294 456 320 476 352 476C432 476 488 410 452 332L340 110C310 50 272 32 256 32Z"
        fill="url(#arklessGradient)"
      />

      {/* Curved inner overlap shadow */}
      <path
        d="M256 32C264 32 290 48 308 84L380 228C350 200 310 190 270 200C220 210 180 250 170 300L144 350L180 110C210 50 240 32 256 32Z"
        fill="#8b0000"
        opacity="0.32"
      />

      {/* White 4-point star shine cutout */}
      <path
        d="M256 160C256 210 266 224 304 224C266 224 256 238 256 288C256 238 246 224 208 224C246 224 256 210 256 160Z"
        fill="#FFFFFF"
        className="animate-pulse"
        style={{ animationDuration: "3s" }}
      />
    </svg>
  );

  // If type is "icono" (solo icono), we prioritize loading logo.png
  if (type === "icono") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {!imgError ? (
          <img
            src="/logo.png"
            alt="arkLess Icon"
            className={`${heightClass} w-auto object-contain`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          renderSVGIcon()
        )}
      </div>
    );
  }

  // If type is "completo" or "nombre", we load the original elegant image logo ("Nombre y logo.png") as specified!
  // This satisfies your rule: "el nombre siempre va con el png de logo y png solo lo vas a estar escalando cuando lo quieras poner completo"
  return (
    <div className={`flex items-center select-none ${className}`}>
      {!imgError ? (
        <img
          src="/Nombre y logo.png"
          alt="arkLess Branding"
          className={`${heightClass} w-auto object-contain select-none`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex items-center gap-2.5">
          {renderSVGIcon()}
          <span
            className={`${fontSize} font-extrabold tracking-tight select-none`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="text-[#E30613] font-extrabold">ark</span>
            <span className={theme === "light" ? "text-neutral-850" : "text-white"}>Less</span>
          </span>
        </div>
      )}
    </div>
  );
}
