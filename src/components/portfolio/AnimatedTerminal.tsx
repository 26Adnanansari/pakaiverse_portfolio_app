"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOGS = [
  { text: "$ Deploying PakaiVerse...", type: "cmd", delay: 0.5 },
  { text: "✓ pakaiverse.com — Live", type: "success", delay: 1.2 },
  { text: "$ Deploying Bushra's Collections...", type: "cmd", delay: 2.0 },
  { text: "✓ bushrascollections.com — Live", type: "success", delay: 2.7 },
  { text: "$ Deploying ProTax US...", type: "cmd", delay: 3.5 },
  { text: "✓ usta-xweb.vercel.app — Live", type: "success", delay: 4.2 },
  { text: "$ Deploying Zamzam Press...", type: "cmd", delay: 5.0 },
  { text: "✓ zamzampress.pakaiverse.com — Live", type: "success", delay: 5.7 },
];

export default function AnimatedTerminal() {
  const [visibleLogs, setVisibleLogs] = useState<number>(0);

  useEffect(() => {
    const timeouts = LOGS.map((log, i) =>
      setTimeout(() => setVisibleLogs(i + 1), log.delay * 1000)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0A0A0F] shadow-2xl overflow-hidden font-mono text-sm sm:text-base">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-slate-400">deploy.sh</span>
      </div>

      {/* Terminal Body */}
      <div className="min-h-[280px] p-4 text-slate-300">
        {LOGS.slice(0, visibleLogs).map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 ${
              log.type === "success" ? "text-brand-primary" : "text-slate-300"
            }`}
          >
            {log.text}
          </motion.div>
        ))}
        {visibleLogs < LOGS.length && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-5 w-2 bg-slate-300 align-middle"
          />
        )}
      </div>
    </div>
  );
}
