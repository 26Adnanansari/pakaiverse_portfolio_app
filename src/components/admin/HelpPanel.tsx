"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-brand-primary text-white rounded-full shadow-lg hover:bg-white/20 border border-white/10 transition z-40"
        title="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Panel */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-[#111118] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-bold text-white font-display text-lg">Contextual Help</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-slate-300 space-y-6">
          <div>
            <h3 className="text-white font-medium mb-2">End-to-End Overview:</h3>
            <p className="text-sm leading-relaxed">Prospector -&gt; Enrichment -&gt; AI Copywriter -&gt; Human Approval -&gt; Sending</p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Contextual Tips:</h3>
            <p className="text-sm leading-relaxed">To approve an email, review the draft and click Approve. Placeholders like <code>{`{{unsubscribe_link}}`}</code> will be replaced automatically.</p>
          </div>
        </div>
      </div>
    </>
  );
}
