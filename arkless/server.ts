import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI client with robust options
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Import STORES context directly to ground the AI in actual database values
import { STORES } from "./src/data";

// API endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY no configurado en el servidor. Configure la llave en Ajustes > Secretos.",
      });
    }

    // Ground the generator with a comprehensive system instruction covering all available stores
    const systemInstruction = `
Eres un Asistente IA experto en Retención de Clientes y Prevención de Abandono (Churn prevention) de la plataforma corporativa **arkLess**.
Habla siempre en español, con un tono profesional, claro, proactivo y empático.
Tu objetivo es ayudar a Carlos M. (supervisor de ruta) a entender los factores de riesgo de sus tiendas y sugerir planes tácticos de rescate.

Lista actual de tiendas en la base de datos de arkLess para apoyar tus análisis:
${JSON.stringify(STORES, null, 2)}

Reglas de servicio:
1. Si te saludan, saluda amistosamente ("Hola Carlos...") y destaca que estás listo para guiar el rescate de su ruta.
2. Identifica con precisión qué tiendas tienen riesgo:
   - "Críticos" (>70% riesgo): Abarrotes "La Esperanza" (85%), Mini Super El Paso (72%), Super Don Memo (91%), Tienda El Oasis (88%).
   - "Alerta" (30-70% riesgo): Tienda Mary (48%), Miscelánea Gaby (35%).
   - "Saludables" (<30% riesgo): Abarrotes La Lupita (24%), La Esquina del Sol (15%).
3. Propón soluciones accionables según el análisis causal SHAP (p. ej. si no han comprado en 22 días, sugiere un cupón de reactivación, llamadas inmediatas, o promociones especiales del portafolio).
4. No menciones detalles de implementación interna de software, bases de datos o rutas tecnológicas a menos que sea necesario. Responde de forma muy directa y estructurada usando negrita.
5. Usa viñetas estructuradas para que Carlos pueda leer rápido desde su celular.
`;

    // Map conversation history to the parts expected by chats or contents
    const chatHistory = history.map((msg: any) => ({
      role: msg.sender === "ai" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // Add current greeting/message
    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const textResponse = response.text || "Lo siento, no pude procesar la consulta.";
    res.json({ response: textResponse });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ error: error?.message || "Ocurrió un error consultando a la IA." });
  }
});

// Configure Vite middleware in development, and serve static built files in production
async function run() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[arkLess Server] corriendo en el puerto http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error("Error arrancando el servidor:", err);
});
