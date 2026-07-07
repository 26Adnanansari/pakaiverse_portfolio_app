"use client";

import { useState } from "react";
import { Mail, PenTool, CheckCircle, Eye, AlertCircle, X } from "lucide-react";

type TabMode = "AI_DRAFTS" | "CUSTOM_COMPOSE";

const MOCK_DRAFTS = [
  {
    id: "1",
    prospectName: "John Doe",
    company: "Acme Corp",
    subject: "Accelerate your AI development",
    body: "Hi John,\n\nI noticed Acme Corp is expanding its tech stack. We offer specialized solutions that can help.\n\nBest,\nAdmin\n\n{{unsubscribe_link}}",
    status: "pending",
  },
  {
    id: "2",
    prospectName: "Jane Smith",
    company: "TechFlow",
    subject: "Partnership opportunity",
    body: "Hello Jane,\n\nI loved your recent post about TechFlow. Let's chat about a potential partnership.\n\nThanks,\nAdmin\n\n{{unsubscribe_link}}",
    status: "pending",
  }
];

export function EmailsClient() {
  const [activeTab, setActiveTab] = useState<TabMode>("AI_DRAFTS");
  const [previewEmail, setPreviewEmail] = useState<typeof MOCK_DRAFTS[0] | null>(null);

  const renderBodyWithHighlights = (body: string) => {
    const parts = body.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        return (
          <span key={i} className="bg-brand-primary/20 text-brand-primary px-1 py-0.5 rounded text-xs font-mono">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("AI_DRAFTS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "AI_DRAFTS" 
              ? "bg-white/10 text-white" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Mail className="w-4 h-4" />
          AI Drafts
        </button>
        <button
          onClick={() => setActiveTab("CUSTOM_COMPOSE")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "CUSTOM_COMPOSE" 
              ? "bg-white/10 text-white" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <PenTool className="w-4 h-4" />
          Custom Compose
        </button>
      </div>

      {/* Content */}
      {activeTab === "AI_DRAFTS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DRAFTS.map((draft) => (
              <div key={draft.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium">{draft.subject}</h3>
                    <p className="text-slate-400 text-sm">To: {draft.prospectName} ({draft.company})</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button 
                    onClick={() => setPreviewEmail(draft)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg text-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/80 text-white py-2 rounded-lg text-sm transition">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "CUSTOM_COMPOSE" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
              <input 
                type="text" 
                placeholder="Enter email subject..."
                className="w-full bg-[#111118] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Body</label>
              <textarea 
                rows={8}
                placeholder="Write your email here..."
                className="w-full bg-[#111118] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary resize-y"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-amber-500/80 text-sm bg-amber-500/10 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Custom compose emails will be wrapped in the standard CAN-SPAM footer upon sending.
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
              Save as Draft
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display">Email Preview</h2>
              <button onClick={() => setPreviewEmail(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1 text-sm border-b border-white/10 pb-4">
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <span className="text-slate-500">To:</span>
                  <span className="text-white">{previewEmail.prospectName} ({previewEmail.company})</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <span className="text-slate-500">Subject:</span>
                  <span className="text-white font-medium">{previewEmail.subject}</span>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-5 text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                {renderBodyWithHighlights(previewEmail.body)}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button 
                onClick={() => setPreviewEmail(null)}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm text-white bg-brand-primary hover:bg-brand-primary/80 rounded-lg transition flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
