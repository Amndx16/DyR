import { StoreItem, ChartDataPoint } from "./types";

export const STORES: StoreItem[] = [
  {
    id: "MX-88421",
    name: "Abarrotes \"La Esperanza\"",
    risk: 85,
    state: "CDMX",
    coords: { x: 500, y: 320, lat: 19.4326, lng: -99.1332 },
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=60",
    volume: "$124,500",
    lastVisit: "12 May",
    creditScore: "A+",
    productMix: "Carbonatados",
    causals: [
      { factor: "Inactividad pedidos", effect: "22 días sin compras · +34%" },
      { factor: "Competencia cercana", effect: "Nuevos puntos de venta en 100m · +18%" },
      { factor: "Ticket promedio", effect: "-15% YoY acumulado · +12%" }
    ],
    whatsapp: "525512345678"
  },
  {
    id: "MX-11209",
    name: "Mini Super El Paso",
    risk: 72,
    state: "Jalisco",
    coords: { x: 380, y: 300, lat: 20.6597, lng: -103.3496 },
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60",
    volume: "$98,400",
    lastVisit: "18 May",
    creditScore: "B",
    productMix: "Lácteos y Bebidas",
    causals: [
      { factor: "Frecuencia de visita", effect: "Supervisor faltó en 2 ciclos · +25%" },
      { factor: "Rotura de stock", effect: "Líneas clave sin abastecer · +22%" }
    ],
    whatsapp: "523312345678"
  },
  {
    id: "MX-40291",
    name: "Tienda Mary",
    risk: 48,
    state: "Nuevo León",
    coords: { x: 480, y: 150, lat: 25.6866, lng: -100.3161 },
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=150&auto=format&fit=crop&q=60",
    volume: "$152,000",
    lastVisit: "22 May",
    creditScore: "A",
    productMix: "Snacks e Impulso",
    causals: [
      { factor: "Precios competencia", effect: "Oxxo cercano bajó precios · +15%" },
      { factor: "Mix de productos", effect: "Baja variedad de sabores · +11%" }
    ],
    whatsapp: "528112345678"
  },
  {
    id: "MX-33054",
    name: "Miscelánea Gaby",
    risk: 35,
    state: "Puebla",
    coords: { x: 550, y: 340, lat: 19.0413, lng: -98.2062 },
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=150&auto=format&fit=crop&q=60",
    volume: "$64,200",
    lastVisit: "29 May",
    creditScore: "C",
    productMix: "Abarrotes General",
    causals: [
      { factor: "Margen reducido", effect: "Incremento costos de flete · +12%" }
    ],
    whatsapp: "522212345678"
  },
  {
    id: "MX-99412",
    name: "Super Don Memo",
    risk: 91,
    state: "Baja California",
    coords: { x: 120, y: 60, lat: 32.5149, lng: -117.0382 },
    image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=150&auto=format&fit=crop&q=60",
    volume: "$210,000",
    lastVisit: "02 May",
    creditScore: "B-",
    productMix: "Cervezas y Alcohol",
    causals: [
      { factor: "Inactividad extrema", effect: "30 días sin orden activa · +45%" },
      { factor: "Disputa crediticia", effect: "Demora en cobro de factura · +28%" }
    ],
    whatsapp: "526612345678"
  },
  {
    id: "MX-66881",
    name: "Abarrotes La Lupita",
    risk: 24,
    state: "Guanajuato",
    coords: { x: 420, y: 270, lat: 21.1219, lng: -101.6850 },
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=60",
    volume: "$82,000",
    lastVisit: "05 Jun",
    creditScore: "A+",
    productMix: "Todo Mix",
    causals: [
      { factor: "Claves faltantes", effect: "Baja leve rotación snack · +5%" }
    ],
    whatsapp: "524712345678"
  },
  {
    id: "MX-24151",
    name: "La Esquina del Sol",
    risk: 15,
    state: "Veracruz",
    coords: { x: 620, y: 350, lat: 19.1738, lng: -96.1342 },
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60",
    volume: "$145,000",
    lastVisit: "06 Jun",
    creditScore: "AA",
    productMix: "Lácteos y Jugos",
    causals: [
      { factor: "Estabilidad", effect: "Excelente comportamiento de compra · -10%" }
    ],
    whatsapp: "522212345679"
  },
  {
    id: "MX-55234",
    name: "Tienda El Oasis",
    risk: 88,
    state: "CDMX",
    coords: { x: 512, y: 312, lat: 19.4124, lng: -99.1412 },
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=150&auto=format&fit=crop&q=60",
    volume: "$118,000",
    lastVisit: "10 May",
    creditScore: "C+",
    productMix: "Energéticas y Aguas",
    causals: [
      { factor: "Visita suspendida", effect: "Ruta cerrada transitoriamente · +38%" },
      { factor: "Queja de precio", effect: "Estructura de descuentos obsoleta · +21%" }
    ],
    whatsapp: "525543210987"
  }
];

export const EVOLUTION_DATA: ChartDataPoint[] = [
  { label: "ENE", risk: 40, recovered: 20 },
  { label: "FEB", risk: 45, recovered: 25 },
  { label: "MAR", risk: 60, recovered: 35 },
  { label: "ABR", risk: 55, recovered: 45 },
  { label: "MAY", risk: 75, recovered: 60 },
  { label: "JUN", risk: 90, recovered: 80 },
  { label: "JUL", risk: 80, recovered: 85 },
  { label: "AGO", risk: 65, recovered: 70 },
  { label: "SEP", risk: 50, recovered: 75 },
  { label: "OCT", risk: 40, recovered: 65 },
  { label: "NOV", risk: 35, recovered: 55 },
  { label: "DIC", risk: 30, recovered: 50 }
];

export const PRODUCT_DATA: ChartDataPoint[] = [
  { label: "Gaseosas", risk: 70, recovered: 45 },
  { label: "Agua", risk: 30, recovered: 60 },
  { label: "Jugos", risk: 50, recovered: 40 },
  { label: "Snacks", risk: 85, recovered: 55 },
  { label: "Lácteos", risk: 40, recovered: 70 },
  { label: "Cerveza", risk: 90, recovered: 25 }
];

export const ZONE_DATA: ChartDataPoint[] = [
  { label: "Norte", risk: 85, recovered: 40 },
  { label: "Centro", risk: 65, recovered: 75 },
  { label: "Sur", risk: 45, recovered: 50 },
  { label: "Oriente", risk: 92, recovered: 30 },
  { label: "Poniente", risk: 35, recovered: 80 }
];

export const AI_PRED_DATA: ChartDataPoint[] = [
  { label: "S. Actual", risk: 58, recovered: 62 },
  { label: "Suma Var+1", risk: 45, recovered: 78 },
  { label: "Suma Var+2", risk: 32, recovered: 89 },
  { label: "Suma Var+3", risk: 20, recovered: 95 }
];
