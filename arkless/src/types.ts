export interface StoreItem {
  id: string;
  name: string;
  risk: number; // percentage, e.g. 85 for 85%
  state: string;
  coords: { x: number; y: number; lat: number; lng: number }; // coords for layout map
  image: string;
  volume: string;
  lastVisit: string;
  creditScore: string;
  productMix: string;
  causals: { factor: string; effect: string }[];
  whatsapp: string;
}

export interface ChartDataPoint {
  label: string;
  risk: number;
  recovered: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}
