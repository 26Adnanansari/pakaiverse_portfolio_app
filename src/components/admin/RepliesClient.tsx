"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle, XCircle, Pencil, ChevronDown, ChevronUp, Sparkles, User } from "lucide-react";

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

const MOCK_REPLIES: Reply[] = [
  {
    id: 1,
    prospectName: "Ahmed Raza",
    company: "TechFlow Pvt Ltd",
    email: "ahmed@techflow.com",
    sentiment: "interested",
    originalMessage: "Thanks for reaching out! We've actually been looking for an AI partner. Can we schedule a call this week?",
    replyBody: "Absolutely interested! Please send over a proposal.",
    suggestedResponse: "Hi Ahmed,\n\nGreat to hear from you! I'd love to set up a call — are you available Thursday or Friday this week?\n\nBest,\nPakAiVerse Team",
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    prospectName: "Sara Khan",
    company: "Nova Systems",
    email: "sara@novasys.io",
    sentiment: "interested",
    originalMessage: "Yes! We need this for our Q3 roadmap. What are your rates?",
    replyBody: "Send pricing please.",
    suggestedResponse: "Hi Sara,\n\nThank you for your interest! Our pricing depends on the scope — I'll send a detailed breakdown shortly.\n\nBest,\nPakAiVerse Team",
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    prospectName: "Bilal Mirza",
    company: "Crescent Corp",
    email: "bilal@crescent.com",
    sentiment: "neutral",
    originalMessage: "I'll forward this to our CTO. Not sure if we have budget right now.",
    replyBody: "We'll keep this on file.",
    suggestedResponse: "Hi Bilal,\n\nThank you! Please do share with your CTO — I'm happy to answer any technical questions.\n\nBest,\nPakAiVerse Team",
    receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    prospectName: "Zainab Hussain",
    company: "Orbit Digital",
    email: "zainab@orbit.pk",
    sentiment: "not_interested",
    originalMessage: "Thanks but we have an in-house team. Not looking for external partners.",
    replyBody: "Not interested, please remove from list.",
    suggestedResponse: "",
    receivedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function RepliesClient() {
  const [replies, setReplies] = useState<Reply[]>(
    [...MOCK_REPLIES].sort((a, b) => {
      // Sort: interested first, then neutral, then not_interested
      const order = { interested: 0, neutral: 1, not_interested: 2 };
      return order[a.sentiment] - order[b.sentiment];
    })
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedResponse, setEditedResponse] = useState<string>("");

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

  const saveEdit = (id: number) => {
    setReplies(prev => prev.map(r => r.id === id ? { ...r, suggestedResponse: editedResponse } : r));
    setEditingId(null);
  };

  const markSent = (id: number) => {
    setReplies(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Interested</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Neutral</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span> Not Interested</div>
      </div>

      {/* Reply Cards */}
      <div className="space-y-3">
        {replies.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-white/[0.02] border border-white/10 rounded-xl">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No replies yet — send some emails first!</p>
          </div>
        )}

        {replies.map((reply) => {
          const cfg = sentimentConfig[reply.sentiment];
          const isExpanded = expandedId === reply.id;
          const isEditing = editingId === reply.id;

          return (
            <div
              key={reply.id}
              className={`border rounded-xl transition-all duration-300 overflow-hidden ${cfg.card}`}
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : reply.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Pulse dot for interested */}
                  {cfg.pulse && (
                    <span className="relative flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping"></span>
                      <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    </span>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{reply.prospectName}</span>
                      <span className="text-slate-500 text-xs">— {reply.company}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xs sm:max-w-sm">
                      &ldquo;{reply.originalMessage}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-slate-500">{timeAgo(reply.receivedAt)}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4">
                  {/* Original reply from prospect */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Their Reply
                    </p>
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-slate-200 leading-relaxed">
                      {reply.originalMessage}
                    </div>
                  </div>

                  {/* AI Suggested Response */}
                  {reply.sentiment !== "not_interested" && reply.suggestedResponse && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-brand-primary" /> AI Suggested Response
                      </p>

                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            rows={5}
                            className="w-full bg-[#0A0A0F] border border-brand-primary/50 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary resize-y"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(reply.id)}
                              className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Save Edit
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-1.5 rounded-lg text-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#0A0A0F] border border-white/10 rounded-lg p-3 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {reply.suggestedResponse}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {reply.sentiment !== "not_interested" && (
                      <>
                        {!isEditing && (
                          <button
                            onClick={() => startEdit(reply)}
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit Response
                          </button>
                        )}
                        <button
                          onClick={() => markSent(reply.id)}
                          className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark as Replied
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => markSent(reply.id)}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs transition ml-auto"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </button>
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
