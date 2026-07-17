"use client";

import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, Pencil, ChevronDown, ChevronUp, Sparkles, User, RefreshCw } from "lucide-react";

type DbReply = {
  id: number;
  leadId: number;
  content: string;
  sentiment: "interested" | "neutral" | "not_interested";
  aiSuggestedResponse: string | null;
  status: string;
  receivedAt: string;
  leadName: string | null;
  leadEmail: string | null;
  leadProjectType: string | null;
};

// Map DB reply to UI reply
type Reply = {
  id: number;
  prospectName: string;
  company: string;
  email: string;
  sentiment: "interested" | "not_interested" | "neutral";
  originalMessage: string;
  replyBody: string;
  suggestedResponse: string;
  receivedAt: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function RepliesClient() {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedResponse, setEditedResponse] = useState<string>("");

  const fetchReplies = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/replies");
      const data = await res.json();
      if (data.success && data.replies) {
        const mapped: Reply[] = data.replies.map((r: DbReply) => {
          const isUnmapped = r.content?.startsWith("[UNMATCHED SENDER:");
          let extractedEmail = r.leadEmail;
          if (isUnmapped) {
             const m = r.content.match(/\[UNMATCHED SENDER: (.*?)\]/);
             if (m) extractedEmail = m[1];
          }

          return {
            id: r.id,
            prospectName: r.leadName || (isUnmapped ? "Unmapped Sender" : "Unknown"),
            company: r.leadProjectType || "Unknown Project",
            email: extractedEmail || "Unknown",
            sentiment: r.sentiment || "neutral",
            originalMessage: "Previous email thread...", // We don't store original email in replies table yet
            replyBody: r.content,
            suggestedResponse: r.aiSuggestedResponse || "",
            receivedAt: r.receivedAt,
          };
        });
        
        // Sort interested first
        mapped.sort((a, b) => {
          const order = { interested: 0, neutral: 1, not_interested: 2 };
          return order[a.sentiment] - order[b.sentiment];
        });
        
        setReplies(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch replies", error);
      alert("Failed to fetch replies");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  const sentimentConfig = {
    interested: {
      label: "Interested",
      badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      card: "border-emerald-500/40 bg-emerald-500/5",
      pulse: true,
    },
    neutral: {
      label: "Neutral",
      badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      card: "border-white/10 bg-white/[0.02]",
      pulse: false,
    },
    not_interested: {
      label: "Not Interested",
      badge: "bg-red-500/20 text-red-400 border border-red-500/30",
      card: "border-red-500/20 bg-white/[0.01] opacity-60",
      pulse: false,
    },
  };

  const startEdit = (reply: Reply) => {
    setEditingId(reply.id);
    setEditedResponse(reply.suggestedResponse);
    setExpandedId(reply.id);
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch("/api/admin/replies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, aiSuggestedResponse: editedResponse })
      });
      if (res.ok) {
        setReplies(prev => prev.map(r => r.id === id ? { ...r, suggestedResponse: editedResponse } : r));
        alert("Draft updated");
      } else {
        alert("Failed to update");
      }
    } catch {
      alert("Error saving");
    } finally {
      setEditingId(null);
    }
  };

  const markSent = async (id: number) => {
    try {
      const res = await fetch("/api/admin/replies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "handled" })
      });
      if (res.ok) {
        setReplies(prev => prev.filter(r => r.id !== id));
        alert("Marked as handled");
      } else {
        alert("Failed to mark handled");
      }
    } catch {
      alert("Error marking handled");
    }
  };

  if (loading) {
    return <div className="text-slate-400 animate-pulse">Loading replies...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Legend & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Interested</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Neutral</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span> Not Interested</div>
        </div>
        <button 
          onClick={fetchReplies} 
          disabled={refreshing}
          className="flex items-center gap-2 text-sm bg-brand-surface border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Reply Cards */}
      <div className="grid grid-cols-1 gap-4">
        {replies.length === 0 && (
          <div className="text-center py-12 bg-brand-surface border border-white/5 rounded-xl text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p>No pending replies!</p>
          </div>
        )}

        {replies.map((reply) => {
          const isExpanded = expandedId === reply.id;
          const isEditing = editingId === reply.id;
          const cfg = sentimentConfig[reply.sentiment];

          return (
            <div key={reply.id} className={`rounded-xl border ${cfg.card} transition-all duration-300`}>
              {/* Header */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => !isEditing && setExpandedId(isExpanded ? null : reply.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{reply.prospectName}</h3>
                      <span className="text-xs text-slate-500">({reply.company})</span>
                    </div>
                    <p className="text-sm text-slate-400">{reply.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 ${cfg.badge}`}>
                    {cfg.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                    {cfg.label}
                  </div>
                  <div className="text-xs text-slate-500 w-16 text-right">
                    {timeAgo(reply.receivedAt)}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {/* Body (Expanded) */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Email Thread */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Thread</h4>
                      
                      {/* Received Reply */}
                      <div className="bg-[#1e1e2d] border border-white/10 rounded-lg p-4 relative">
                        <div className="absolute -left-2 top-4 w-1 h-8 bg-blue-500 rounded-r-md"></div>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{reply.replyBody}</p>
                      </div>
                    </div>

                    {/* Right: AI Draft */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                          AI Suggested Response
                        </h4>
                        {!isEditing && reply.suggestedResponse && (
                          <button onClick={() => startEdit(reply)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            className="w-full h-40 bg-black/40 border border-brand-primary/30 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-primary resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-white/5 rounded-md"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => saveEdit(reply.id)}
                              className="px-3 py-1.5 text-xs text-brand-bg font-semibold bg-brand-primary hover:bg-brand-primary/90 rounded-md shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                            >
                              Save Draft
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-brand-bg border border-white/5 rounded-lg p-4 h-full min-h-[160px]">
                          {reply.suggestedResponse ? (
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{reply.suggestedResponse}</p>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No AI response generated for this sentiment.</p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {!isEditing && (
                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            onClick={() => markSent(reply.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-lg transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Handled
                          </button>
                          
                          {reply.suggestedResponse && (
                            <a 
                              href={`mailto:${reply.email}?subject=Re: PakAiVerse Inquiry&body=${encodeURIComponent(reply.suggestedResponse)}`}
                              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-brand-bg font-semibold text-sm rounded-lg shadow-lg hover:shadow-brand-primary/25 transition"
                            >
                              Send via Gmail
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
