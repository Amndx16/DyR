import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      text: "Hola Carlos, he analizado tu ruta de hoy. El cliente **\"La Esperanza\"** registra un riesgo crítico del **89%**. ¿Quieres que te sugiera un plan de rescate?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);
    setErrorText(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages, // Send full conversational history
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error consultando a la IA.");
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "No pude conectar con el servidor de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  // Predefined quick action trigger options
  const handleQuickAction = (actionTitle: string) => {
    handleSendMessage(`Acción rápida: ${actionTitle}`);
  };

  // Render text with markdown bold replacements for a professional visual style
  const renderFormattedText = (rawText: string) => {
    const parts = rawText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-neutral-900 font-extrabold bg-[#e30613]/5 px-1 rounded-sm">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur screen shadow */}
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-[80]" onClick={onClose} />

          {/* Sliding drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[400px] bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-[90] flex flex-col"
          >
            {/* Header portion */}
            <div className="p-6 bg-white border-b border-red-500/10 relative flex justify-between items-center select-none shrink-0">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#E30613] text-2xl">sparkles</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3
                      className="font-bold text-neutral-800"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      Asistente IA
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-semibold tracking-wide uppercase">
                    Asistente de Retención · Online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-neutral-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>

              {/* Decorative brand line under header */}
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#E30613]"></div>
            </div>

            {/* Chat list viewport */}
            <div
              ref={listRef}
              className="flex-grow p-6 overflow-y-auto space-y-4 bg-neutral-50/50 custom-scrollbar"
            >
              {messages.map((m) => {
                const isAI = m.sender === "ai";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isAI ? "justify-start" : "justify-end"} items-end gap-2`}
                  >
                    {isAI && (
                      <div className="w-7 h-7 bg-[#E30613] text-white flex items-center justify-center rounded-lg shadow-sm shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        isAI
                          ? "bg-white text-neutral-700 border-l-[3.5px] border-[#E30613]"
                          : "bg-[#E30613] text-white"
                      }`}
                    >
                      <div className="whitespace-pre-line">{renderFormattedText(m.text)}</div>
                      <div
                        className={`text-[9px] text-right mt-1.5 font-bold ${
                          isAI ? "text-neutral-400" : "text-white/75"
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading thinking cues */}
              {isLoading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-7 h-7 bg-[#E30613] text-white flex items-center justify-center rounded-lg shadow-sm shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-neutral-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              )}

              {/* Server-side connectivity errors feedback */}
              {errorText && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[11px] leading-normal font-medium flex flex-col gap-1.5">
                  <span>{errorText}</span>
                  <button
                    onClick={() => handleSendMessage(userInput)}
                    className="self-end text-[10px] font-bold underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reintentar
                  </button>
                </div>
              )}
            </div>

            {/* Quick Prompt Hooks panel */}
            <div className="px-6 py-4 bg-white border-t border-neutral-100 select-none">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2.5">
                Acciones sugeridas
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleQuickAction("Plan de rescate para La Esperanza")}
                  className="text-left py-2.5 px-4 rounded-xl bg-neutral-50 hover:bg-[#E30613]/5 hover:text-[#E30613] transition border border-neutral-100 text-xs font-semibold text-neutral-600 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E30613]" />
                  <span>Plan de rescate de La Esperanza</span>
                </button>
                <button
                  onClick={() => handleQuickAction("Generar propuesta de descuento exclusivo")}
                  className="text-left py-2.5 px-4 rounded-xl bg-neutral-50 hover:bg-[#E30613]/5 hover:text-[#E30613] transition border border-neutral-100 text-xs font-semibold text-neutral-600 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E30613]" />
                  <span>Generar cupón de reactivación</span>
                </button>
              </div>
            </div>

            {/* Input typing panel */}
            <div className="p-4 bg-white border-t border-neutral-100 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(userInput);
                }}
                className="relative flex items-center gap-2 bg-neutral-100 rounded-full px-4 py-2 border border-neutral-200/50"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Pregunta a la IA sobre tus rutas..."
                  className="flex-grow bg-transparent border-none text-xs text-neutral-800 focus:outline-none focus:ring-0 placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim() || isLoading}
                  className="w-9 h-9 rounded-full bg-[#E30613] text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-40 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
