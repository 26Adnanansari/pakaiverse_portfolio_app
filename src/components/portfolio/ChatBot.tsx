"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  role: "user" | "bot";
  text: string;
};

type LeadData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const WELCOME_MSG: Message = {
  role: "bot",
  text: "Assalam o Alaikum! 👋 I'm **PakAiBot** — PakAiVerse ka official AI assistant.\n\nAap ki kya madad kar sakta hoon? (Feel free to ask in English or Roman Urdu)",
};

// Simple check: does the bot reply contain lead collection trigger?
function needsLeadForm(text: string): boolean {
  return (
    text.toLowerCase().includes("name, email") ||
    text.toLowerCase().includes("whatsapp number") ||
    text.toLowerCase().includes("your name")
  );
}

// Format bold markdown (**text**) inside message
function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({ name: "", email: "", phone: "", message: "" });
  const [hasNewMsg, setHasNewMsg] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showLeadForm]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMsg(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Pulse the bubble after 4 seconds to grab attention
  useEffect(() => {
    const t = setTimeout(() => setHasNewMsg(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role === "user" ? "user" : "bot", text: m.text })),
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "Sorry, kuch problem aa gayi. Dobara try karein.";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);

      if (needsLeadForm(botReply) && !leadSaved) {
        setTimeout(() => setShowLeadForm(true), 500);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Network error. Please check your connection and try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.email) return;

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: leadData.message || "Via PakAiBot",
          source: "chatbot",
        }),
      });

      setLeadSaved(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Shukriya ${leadData.name || ""}! 🙏 Aapki details receive ho gayi hain. Hamari team jald aapse rabta karegi. Koi aur sawaal ho to zaroor puchein!`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Details save karne mein problem aayi. Please contact@pakaiverse.com pe email karein." },
      ]);
    }
  };

  return (
    <>
      {/* ── Floating Bubble ─────────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        <AnimatePresence>
          {!isOpen && hasNewMsg && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-1 max-w-[200px] rounded-xl rounded-bl-none bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-lg"
            >
              Hi! Got a project idea? Let&apos;s talk 💬
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #00DC82, #9B59F5)",
          }}
          aria-label="Open PakAiBot"
        >
          {hasNewMsg && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              1
            </span>
          )}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="relative z-10">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white"
              opacity="0"
            />
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" opacity="0.3" />
            <path
              d="M8 9.5C8 8.67 8.67 8 9.5 8h5c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5H11l-3 2V14H9.5C8.67 14 8 13.33 8 12.5v-3z"
              fill="white"
            />
          </svg>
          <span className="absolute inset-0 animate-ping rounded-full opacity-20"
            style={{ background: "linear-gradient(135deg, #00DC82, #9B59F5)" }}
          />
        </motion.button>
      </div>

      {/* ── Chat Window ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 left-6 z-50 flex w-[340px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0d0d1a 0%, #111128 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "linear-gradient(90deg, #00DC82 0%, #9B59F5 100%)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm">
                  P
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">PakAiBot</p>
                  <p className="text-[10px] text-white/75 leading-none mt-0.5">PakAiVerse Assistant • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 hover:bg-white/20 transition"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 scrollbar-thin" style={{ maxHeight: "340px", minHeight: "240px" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "bot" && (
                    <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold mt-1"
                      style={{ background: "linear-gradient(135deg, #00DC82, #9B59F5)" }}>
                      P
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "rounded-tr-none bg-brand-primary/20 text-white"
                        : "rounded-tl-none bg-white/8 text-slate-200"
                    }`}
                    style={msg.role === "bot" ? { background: "rgba(255,255,255,0.07)" } : {}}
                  >
                    {formatText(msg.text)}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold"
                    style={{ background: "linear-gradient(135deg, #00DC82, #9B59F5)" }}>
                    P
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.07)" }}>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Lead Form */}
              {showLeadForm && !leadSaved && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleLeadSubmit}
                  className="mt-1 rounded-xl border border-brand-primary/30 p-3 space-y-2"
                  style={{ background: "rgba(0,220,130,0.05)" }}
                >
                  <p className="text-[11px] font-semibold text-brand-primary">📋 Apni details share karein:</p>
                  {[
                    { field: "name", placeholder: "Aapka naam *", type: "text" },
                    { field: "email", placeholder: "Email address *", type: "email" },
                    { field: "phone", placeholder: "WhatsApp number", type: "tel" },
                    { field: "message", placeholder: "Project brief (optional)", type: "text" },
                  ].map(({ field, placeholder, type }) => (
                    <input
                      key={field}
                      type={type}
                      required={field === "email" || field === "name"}
                      placeholder={placeholder}
                      value={leadData[field as keyof LeadData]}
                      onChange={(e) => setLeadData((prev) => ({ ...prev, [field]: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-primary/50"
                    />
                  ))}
                  <button
                    type="submit"
                    className="w-full rounded-lg py-2 text-xs font-bold text-black transition hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #00DC82, #9B59F5)" }}
                  >
                    Submit Details
                  </button>
                </motion.form>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-3 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  placeholder="Message PakAiBot..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg disabled:opacity-40 transition"
                  style={{ background: "linear-gradient(135deg, #00DC82, #9B59F5)" }}
                  aria-label="Send"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-slate-600">
                Powered by PakAiVerse × Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
