"use client";

import { useState } from "react";
import { Filter, Trash2, CheckCircle, ChevronDown, CheckSquare, Square, Sparkles, Search, Loader2 } from "lucide-react";

type Lead = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  projectType: string | null;
  budget: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  createdAt: string | null;
};

export default function LeadsClient({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [updating, setUpdating] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProspectorOpen, setIsProspectorOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isProspecting, setIsProspecting] = useState(false);
  const [isSendingToAI, setIsSendingToAI] = useState(false);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    const idsArray = Array.from(selectedIds);

    if (action === "send_to_ai") {
      const confirmAction = confirm(`Send ${selectedIds.size} lead(s) to AI for email drafting?`);
      if (!confirmAction) return;

      setIsSendingToAI(true);
      try {
        const res = await fetch("/api/admin/send-to-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadIds: idsArray }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`✅ ${data.message}`);
          setSelectedIds(new Set());
          // Update lead statuses in UI to draft_ready
          setLeads(prev => prev.map(l => idsArray.includes(l.id) ? { ...l, status: "draft_ready" } : l));
        } else {
          alert(`❌ Error: ${data.error}`);
        }
      } catch (err) {
        console.error("Send to AI error:", err);
        alert("Failed to contact Send-to-AI API.");
      } finally {
        setIsSendingToAI(false);
      }
      return;
    }

    if (action === "delete" || action === "mark_contacted") {
      const confirmAction = confirm(`Are you sure you want to perform this action on ${selectedIds.size} leads?`);
      if (!confirmAction) return;
      // Stub for delete/mark_contacted bulk API (can be expanded later)
      alert(`Bulk ${action} executed for ${selectedIds.size} leads.`);
      setSelectedIds(new Set());
    }
  };

  const filteredLeads = leads.filter(l => statusFilter === "all" || l.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white">Leads Inbox ({leads.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManualAddOpen(!isManualAddOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${isManualAddOpen ? "bg-white/10 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
          >
            Add Lead Manually
          </button>
          <button
            onClick={() => setIsProspectorOpen(!isProspectorOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${isProspectorOpen ? "bg-white/10 text-white" : "bg-brand-primary text-black hover:bg-brand-primary/90"}`}
          >
            <Search className="w-4 h-4" /> {isProspectorOpen ? "Close Prospector" : "Find Leads"}
          </button>
        </div>
      </div>

      {isProspectorOpen && (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-6 shadow-sm max-w-2xl animate-in slide-in-from-top-2">
          <h2 className="text-lg font-bold text-white mb-4">Run Prospector</h2>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setIsProspecting(true);
              const formData = new FormData(e.currentTarget);
              const country = formData.get("country");
              const city = formData.get("city");
              const category = formData.get("category");
              
              try {
                const res = await fetch("/api/admin/prospector", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ country, city, category }),
                });
                const data = await res.json();
                if (data.success) {
                  alert(`Successfully found and added ${data.count} leads! Refresh to see them.`);
                  setIsProspectorOpen(false);
                  window.location.reload();
                } else {
                  alert("Error: " + data.error);
                }
              } catch (err) {
                console.error("Prospector error:", err);
                alert("Failed to call Prospector API.");
              } finally {
                setIsProspecting(false);
              }
            }} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                <input name="country" type="text" placeholder="e.g., Pakistan" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">City (Optional)</label>
                <input name="city" type="text" placeholder="e.g., Karachi" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Business Field / Category</label>
              <input name="category" type="text" placeholder="e.g., Restaurant, Boutique, Tech Agency" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" required />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button 
                type="submit" 
                disabled={isProspecting}
                className="bg-brand-primary text-black font-bold px-6 py-2.5 rounded-lg transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center gap-2"
              >
                {isProspecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {isProspecting ? "Searching..." : "Find Leads"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isManualAddOpen && (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-6 shadow-sm max-w-2xl animate-in slide-in-from-top-2">
          <h2 className="text-lg font-bold text-white mb-4">Add Lead Manually</h2>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setIsAddingManual(true);
              const formData = new FormData(e.currentTarget);
              try {
                const res = await fetch("/api/admin/leads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(Object.fromEntries(formData)),
                });
                const data = await res.json();
                if (data.success) {
                  alert("Successfully added lead! Refresh to see it.");
                  setIsManualAddOpen(false);
                  window.location.reload();
                } else {
                  alert("Error: " + data.error);
                }
              } catch (err) {
                console.error("Add lead error:", err);
                alert("Failed to add lead.");
              } finally {
                setIsAddingManual(false);
              }
            }} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                <input name="companyName" type="text" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
                <input name="contactEmail" type="email" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contact Name (Optional)</label>
                <input name="contactName" type="text" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Niche / Category</label>
                <input name="projectType" type="text" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Notes / Context</label>
              <textarea name="message" rows={3} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" />
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button 
                type="submit" 
                disabled={isAddingManual}
                className="bg-brand-primary text-black font-bold px-6 py-2.5 rounded-lg transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center gap-2"
              >
                {isAddingManual ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isAddingManual ? "Adding..." : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
          {/* Mobile-friendly Filter & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-[#111118] border border-white/10 hover:bg-white/5 text-slate-300 px-4 py-2 rounded-lg text-sm transition w-full sm:w-auto justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-[#111118] border border-white/10 rounded-lg shadow-xl z-10 py-1">
              {['all', 'new', 'contacted', 'closed', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition ${statusFilter === s ? 'text-white bg-white/5' : 'text-slate-400'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-4 z-20 flex items-center justify-between bg-brand-primary/20 border border-brand-primary/30 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2">
          <div className="text-sm font-medium">
            <span className="bg-brand-primary px-2 py-0.5 rounded mr-2">{selectedIds.size}</span>
            leads selected
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction("delete")} className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-sm transition">
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
            </button>
            <button onClick={() => handleBulkAction("mark_contacted")} className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white px-3 py-1.5 rounded-lg text-sm transition">
              <CheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">Mark Contacted</span>
            </button>
            <button onClick={() => handleBulkAction("send_to_ai")} disabled={isSendingToAI} className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-60">
              {isSendingToAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} <span className="hidden sm:inline">{isSendingToAI ? "Drafting..." : "Send to AI"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Table container */}
      <div className="bg-[#111118] border border-white/10 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-12 text-center">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white transition">
                  {selectedIds.size === filteredLeads.length && filteredLeads.length > 0 ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">Contact Info</th>
              <th className="px-4 py-3">Project Details</th>
              <th className="px-4 py-3 max-w-xs">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className={`transition ${selectedIds.has(lead.id) ? 'bg-brand-primary/5' : 'hover:bg-white/5'}`}>
                <td className="px-4 py-4 text-center">
                  <button onClick={() => toggleSelect(lead.id)} className="text-slate-400 hover:text-brand-primary transition">
                    {selectedIds.has(lead.id) ? <CheckSquare className="w-4 h-4 text-brand-primary" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    {lead.name || "N/A"}
                    {lead.message?.includes("Website: http") ? (
                      <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-500/30">Has Website</span>
                    ) : (
                      <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">No Website</span>
                    )}
                  </div>
                  {/* TODO: Add dedicated is_enriched boolean column to DB for long-term robustness */}
                  {lead.email.includes("pending_enrichment_") ? (
                    <div className="text-xs mt-1 mb-1 bg-slate-800/80 text-slate-400 border border-slate-700 rounded px-2 py-0.5 inline-block">Not Enriched Yet</div>
                  ) : (
                    <div className="text-xs text-slate-400 mb-1 mt-1">{lead.email}</div>
                  )}
                  {lead.phone ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-primary">{lead.phone}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">No Phone</div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-brand-secondary">{lead.projectType || "N/A"}</div>
                  <div className="text-xs mt-1"><span className="text-slate-500">Budget:</span> {lead.budget || "N/A"}</div>
                </td>
                <td className="px-4 py-4 max-w-xs">
                  <div className="text-xs text-slate-300 line-clamp-3" title={lead.message || ""}>
                    {lead.message || "No message provided."}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select 
                    value={lead.status || "new"}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    disabled={updating === lead.id}
                    className={`bg-white/5 border border-white/10 rounded px-2 py-1.5 outline-none text-xs w-full focus:border-brand-primary ${
                      lead.status === 'contacted' ? 'text-blue-400' :
                      lead.status === 'closed' ? 'text-green-400' :
                      lead.status === 'rejected' ? 'text-red-400' :
                      lead.status === 'ai-failed' ? 'text-orange-400' :
                      lead.status === 'draft_ready' ? 'text-purple-400' : 'text-yellow-400'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="enriched">Enriched</option>
                    <option value="draft_ready">Draft Ready</option>
                    <option value="ai-failed">AI Failed ⚠️</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed / Won</option>
                    <option value="rejected">Rejected / Lost</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-xs whitespace-nowrap">
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                  No leads found matching the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        </div>
    </div>
  );
}
