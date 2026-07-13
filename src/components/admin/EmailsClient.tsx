"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, PenTool, Eye, AlertCircle, X, Loader2, Send, RefreshCw, Trash2 } from "lucide-react";

type TabMode = "AI_DRAFTS" | "CUSTOM_COMPOSE";

type Draft = {
  id: string;
  prospectName: string;
  company: string;
  subject: string;
  body: string;
  status: string;
};

export function EmailsClient({ initialDrafts = [] }: { initialDrafts?: Draft[] }) {
  const [activeTab, setActiveTab] = useState<TabMode>("AI_DRAFTS");
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [previewEmail, setPreviewEmail] = useState<Draft | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [customRecipientEmail, setCustomRecipientEmail] = useState("");
  const [isSavingCustom, setIsSavingCustom] = useState(false);

  // Always fetch fresh drafts from API on mount (fixes stale data from client-side navigation)
  const fetchDrafts = useCallback(async (showLoader = true) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/email-drafts");
      const data = await res.json();
      if (data.success) {
        setDrafts(data.drafts);
      }
    } catch (err) {
      console.error("Failed to refresh drafts:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts(false); // Silent fetch on mount, no spinner needed
  }, [fetchDrafts]);

  const handleApprove = async (draft: Draft) => {
    if (!confirm(`Send this email to ${draft.prospectName}?`)) return;
    setApprovingId(draft.id);
    try {
      const res = await fetch("/api/admin/approve-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailQueueId: draft.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Email sent to ${draft.prospectName}!`);
        setPreviewEmail(null);
        // Remove from drafts list
        setDrafts(prev => prev.filter(d => d.id !== draft.id));
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve email.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    setDeletingId(draftId);
    try {
      const res = await fetch(`/api/admin/email-drafts?id=${draftId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDrafts(prev => prev.filter(d => d.id !== draftId));
        if (previewEmail?.id === draftId) {
          setPreviewEmail(null);
        }
      } else {
        alert("Failed to delete draft: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete draft.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveCustomDraft = async () => {
    if (!customSubject || !customBody || !customRecipientEmail) {
      alert("Please fill in recipient email, subject, and body.");
      return;
    }
    setIsSavingCustom(true);
    try {
      const res = await fetch("/api/admin/custom-compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: customRecipientEmail,
          subject: customSubject,
          body: customBody
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Draft saved!");
        setCustomSubject("");
        setCustomBody("");
        setCustomRecipientEmail("");
        fetchDrafts();
        setActiveTab("AI_DRAFTS");
      } else {
        alert("Error saving draft: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save draft.");
    } finally {
      setIsSavingCustom(false);
    }
  };

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
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
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
            {drafts.length > 0 && (
              <span className="bg-brand-primary text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{drafts.length}</span>
            )}
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
        <button
          onClick={() => fetchDrafts(true)}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
          title="Refresh drafts"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === "AI_DRAFTS" && (
        <div className="space-y-4">
          <div className="bg-[#111118] border border-white/10 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
              <thead className="bg-white/5 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 max-w-xs">Body Excerpt</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-4">
                      <div className="font-bold text-white">{draft.prospectName || "N/A"}</div>
                      <div className="text-xs text-slate-400">{draft.company}</div>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">{draft.subject}</td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-xs text-slate-300 line-clamp-2" title={draft.body}>
                        {draft.body.replace(/\n/g, " ")}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setPreviewEmail(draft)}
                          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button 
                          onClick={() => handleApprove(draft)}
                          disabled={approvingId === draft.id || deletingId === draft.id}
                          className="flex items-center justify-center gap-1.5 bg-brand-primary hover:bg-brand-primary/80 text-black px-3 py-1.5 rounded text-xs transition font-bold disabled:opacity-60"
                        >
                          {approvingId === draft.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          {approvingId === draft.id ? "Sending..." : "Approve & Send"}
                        </button>
                        <button 
                          onClick={() => handleDeleteDraft(draft.id)}
                          disabled={approvingId === draft.id || deletingId === draft.id}
                          className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded text-xs transition disabled:opacity-60"
                          title="Delete Draft"
                        >
                          {deletingId === draft.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {drafts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                      No AI drafts pending approval.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "CUSTOM_COMPOSE" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Recipient Email</label>
              <input 
                type="email" 
                value={customRecipientEmail}
                onChange={(e) => setCustomRecipientEmail(e.target.value)}
                placeholder="Enter recipient email..."
                className="w-full bg-[#111118] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
              <input 
                type="text" 
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full bg-[#111118] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Body</label>
              <textarea 
                rows={8}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
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
            <button 
              onClick={handleSaveCustomDraft}
              disabled={isSavingCustom}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
            >
              {isSavingCustom ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSavingCustom ? "Saving..." : "Save as Draft"}
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
                onClick={() => previewEmail && handleDeleteDraft(previewEmail.id)}
                disabled={!!approvingId || !!deletingId}
                className="px-4 py-2 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition mr-auto flex items-center gap-2 disabled:opacity-60"
              >
                {deletingId === previewEmail?.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
              </button>
              <button 
                onClick={() => setPreviewEmail(null)}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
              >
                Close
              </button>
              <button 
                onClick={() => previewEmail && handleApprove(previewEmail)}
                disabled={!!approvingId || !!deletingId}
                className="px-4 py-2 text-sm text-black bg-brand-primary hover:bg-brand-primary/80 rounded-lg transition flex items-center gap-2 font-bold disabled:opacity-60"
              >
                {approvingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {approvingId ? "Sending..." : "Approve & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
