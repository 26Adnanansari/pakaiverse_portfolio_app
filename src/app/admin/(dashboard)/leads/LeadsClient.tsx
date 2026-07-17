"use client";

import { useState } from "react";
import { Filter, Trash2, CheckCircle, ChevronDown, CheckSquare, Square, Sparkles, Search, Loader2, Edit2, Globe, Bot } from "lucide-react";

type Lead = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  websiteUrl: string | null;
  projectType: string | null;
  budget: string | null;
  message: string | null;
  contextNotes: string | null;
  source: string | null;
  status: string | null;
  lastEmailedAt: string | null;
  createdAt: string | null;
};

export default function LeadsClient({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [updating, setUpdating] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);
  const [editingEmailId, setEditingEmailId] = useState<number | null>(null);
  const [editEmailValue, setEditEmailValue] = useState("");
  const [editingPhoneId, setEditingPhoneId] = useState<number | null>(null);
  const [editPhoneValue, setEditPhoneValue] = useState("");
  const [editingWebsiteId, setEditingWebsiteId] = useState<number | null>(null);
  const [editWebsiteValue, setEditWebsiteValue] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [editNotesValue, setEditNotesValue] = useState("");
  const [savingNotes, setSavingNotes] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isScraping, setIsScraping] = useState(false);
  const [isProspectorOpen, setIsProspectorOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isProspecting, setIsProspecting] = useState(false);
  const [isSendingToAI, setIsSendingToAI] = useState(false);
  // Prospector form state
  const [prospectorRadius, setProspectorRadius] = useState(2500);
  const [prospectorCategoryMode, setProspectorCategoryMode] = useState<"preset" | "custom">("preset");

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

    if (action === "scrape_emails") {
      const confirmAction = confirm(`Scrape websites for ${selectedIds.size} selected lead(s) to find emails?`);
      if (!confirmAction) return;

      setIsScraping(true);
      try {
        const res = await fetch("/api/admin/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadIds: idsArray }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`✅ Scraped successfully.`);
          setSelectedIds(new Set());
          // Update leads based on results
          const resultUpdates = new Map<number, { id: number; status: string; email?: string }>(
            data.results.map((r: { id: number; status: string; email?: string }) => [r.id, r])
          );
          setLeads(prev => prev.map(l => {
            const update = resultUpdates.get(l.id);
            if (update) {
              if (update.status === "enriched") return { ...l, email: update.email ?? l.email, status: "enriched" };
            }
            return l;
          }));
        } else {
          alert(`❌ Error: ${data.error}`);
        }
      } catch (err) {
        console.error("Scraping error:", err);
        alert("Failed to contact scraping API.");
      } finally {
        setIsScraping(false);
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

  const handleSaveNotes = async (id: number) => {
    setSavingNotes(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, contextNotes: editNotesValue }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, contextNotes: editNotesValue } : l));
        setEditingNotesId(null);
      } else {
        alert("Failed to save notes");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSavingNotes(null);
    }
  };

  const toggleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filteredLeads = leads
    .filter(l => {
      const statusMatch = statusFilter === "all" || l.status === statusFilter;
      const sourceMatch = sourceFilter === "all" ||
        (sourceFilter === "inbound" ? (l.source === "chatbot" || l.source === "contact-form") :
          (sourceFilter === "outbound" ? l.source === "prospector" : l.source === sourceFilter));
      const q = searchQuery.toLowerCase();
      const searchMatch = !q ||
        (l.name || "").toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.projectType || "").toLowerCase().includes(q) ||
        (l.message || "").toLowerCase().includes(q);
      return statusMatch && sourceMatch && searchMatch;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortCol === "name") return dir * ((a.name || "").localeCompare(b.name || ""));
      if (sortCol === "status") return dir * ((a.status || "").localeCompare(b.status || ""));
      if (sortCol === "projectType") return dir * ((a.projectType || "").localeCompare(b.projectType || ""));
      if (sortCol === "lastEmailedAt") {
        const ta = a.lastEmailedAt ? new Date(a.lastEmailedAt).getTime() : 0;
        const tb = b.lastEmailedAt ? new Date(b.lastEmailedAt).getTime() : 0;
        return dir * (ta - tb);
      }
      // default: createdAt
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dir * (ta - tb);
    });

  const handleSaveEmail = async (id: number) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email: editEmailValue }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, email: editEmailValue, status: l.status === "new" ? "enriched" : l.status } : l));
        setEditingEmailId(null);
      } else {
        alert("Failed to update email");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const handleSavePhone = async (id: number) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, phone: editPhoneValue }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, phone: editPhoneValue } : l));
        setEditingPhoneId(null);
      } else {
        alert("Failed to update phone");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveWebsite = async (id: number) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, websiteUrl: editWebsiteValue }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l.id === id ? { ...l, websiteUrl: editWebsiteValue } : l));
        setEditingWebsiteId(null);
      } else {
        alert("Failed to update website");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

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
          <h2 className="text-lg font-bold text-white mb-4">🔍 Run Prospector</h2>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setIsProspecting(true);
              const formData = new FormData(e.currentTarget);
              const location = formData.get("location") as string;
              const presetCategory = formData.get("presetCategory") as string;
              const customCategory = formData.get("customCategory") as string;
              const category = prospectorCategoryMode === "custom" ? customCategory : presetCategory;
              const websiteStatus = formData.get("websiteStatus") as string;
              const openNow = formData.get("openNow") === "on";
              
              try {
                const res = await fetch("/api/admin/prospector", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ location, category, radius: prospectorRadius, websiteStatus, openNow }),
                });
                const data = await res.json();
                if (data.success) {
                  alert(`✅ Found ${data.total_found} places → Added ${data.count} leads (${data.filtered} filtered out).`);
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
            className="space-y-5"
          >
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Location
                <span className="ml-2 text-xs text-slate-500 font-normal">(US: &quot;Austin, TX&quot; · International: &quot;Karachi, Pakistan&quot;)</span>
              </label>
              <input
                name="location"
                type="text"
                placeholder="e.g., Austin, TX  or  Karachi, Pakistan"
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <label className="block text-sm font-medium text-slate-300">Business Category</label>
                <div className="flex text-xs rounded-md overflow-hidden border border-white/10">
                  <button type="button" onClick={() => setProspectorCategoryMode("preset")}
                    className={`px-3 py-1 transition ${prospectorCategoryMode === "preset" ? "bg-brand-primary text-black font-semibold" : "bg-[#0A0A0F] text-slate-400 hover:text-white"}`}>
                    Preset
                  </button>
                  <button type="button" onClick={() => setProspectorCategoryMode("custom")}
                    className={`px-3 py-1 transition ${prospectorCategoryMode === "custom" ? "bg-brand-primary text-black font-semibold" : "bg-[#0A0A0F] text-slate-400 hover:text-white"}`}>
                    Custom
                  </button>
                </div>
              </div>
              {prospectorCategoryMode === "preset" ? (
                <select name="presetCategory" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary" required>
                  <option value="clothing_store">Clothing Store</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="beauty_salon">Beauty Salon</option>
                  <option value="real_estate_agency">Real Estate Agency</option>
                  <option value="lawyer">Law Firm / Lawyer</option>
                  <option value="dentist">Dentist / Dental Clinic</option>
                  <option value="gym">Gym / Fitness Center</option>
                  <option value="car_dealer">Car Dealer</option>
                  <option value="furniture_store">Furniture Store</option>
                  <option value="accounting">Accounting / CA Firm</option>
                  <option value="travel_agency">Travel Agency</option>
                  <option value="bakery">Bakery</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="school">School / Academy</option>
                  <option value="hospital">Hospital / Clinic</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="photographer">Photographer</option>
                  <option value="spa">Spa</option>
                  <option value="florist">Florist</option>
                </select>
              ) : (
                <input name="customCategory" type="text" placeholder="e.g., Boutique, Tech Agency, Wedding Planner"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary"
                  required />
              )}
            </div>

            {/* Radius + Website Status + Open Now — 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Radius */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Radius: <span className="text-brand-primary font-bold">{(prospectorRadius / 1000).toFixed(1)} km</span>
                </label>
                <input
                  type="range" min="1000" max="5000" step="500"
                  value={prospectorRadius}
                  onChange={(e) => setProspectorRadius(Number(e.target.value))}
                  className="w-full accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>1 km</span><span>5 km</span>
                </div>
              </div>

              {/* Website Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Website Status</label>
                <select name="websiteStatus" className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-brand-primary text-sm">
                  <option value="any">Any</option>
                  <option value="no_website">No Website 🎯</option>
                  <option value="has_website">Has Website</option>
                </select>
                <p className="text-xs text-slate-600 mt-1">&quot;No Website&quot; = best pitch targets</p>
              </div>

              {/* Open Now */}
              <div className="flex flex-col justify-center">
                <label className="block text-sm font-medium text-slate-300 mb-2">Open Now Only</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="openNow" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary peer-checked:after:bg-black"></div>
                  <span className="ml-2 text-sm text-slate-400">Off</span>
                </label>
              </div>
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
              <textarea name="contextNotes" rows={3} className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary" />
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
        <div className="relative">
          <button 
            onClick={() => setIsSourceFilterOpen(!isSourceFilterOpen)}
            className="flex items-center gap-2 bg-[#111118] border border-white/10 hover:bg-white/5 text-slate-300 px-4 py-2 rounded-lg text-sm transition w-full sm:w-auto justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Source: {sourceFilter.charAt(0).toUpperCase() + sourceFilter.slice(1)}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSourceFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSourceFilterOpen && (
             <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-[#111118] border border-white/10 rounded-lg shadow-xl z-10 py-1">
              {['all', 'inbound', 'chatbot', 'outbound', 'manual'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSourceFilter(s); setIsSourceFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition ${sourceFilter === s ? 'text-white bg-white/5' : 'text-slate-400'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111118] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition"
          />
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
            <button onClick={() => handleBulkAction("scrape_emails")} disabled={isScraping} className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-60">
              {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} <span className="hidden sm:inline">{isScraping ? "Scraping..." : "Scrape Emails"}</span>
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
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => toggleSort("name")}>Contact Info {sortCol === 'name' && (sortDir === 'asc' ? '↑' : '↓')}</th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => toggleSort("projectType")}>Project Details {sortCol === 'projectType' && (sortDir === 'asc' ? '↑' : '↓')}</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 max-w-xs">Context Notes</th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => toggleSort("status")}>Status {sortCol === 'status' && (sortDir === 'asc' ? '↑' : '↓')}</th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => toggleSort("createdAt")}>Date {sortCol === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}</th>
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
                    {lead.source === "chatbot" && (
                      <span title="Came from Chatbot" className="flex items-center">
                        <Bot className="w-4 h-4 text-fuchsia-400" />
                      </span>
                    )}
                  </div>
                  {editingEmailId === lead.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="text" 
                        value={editEmailValue} 
                        onChange={(e) => setEditEmailValue(e.target.value)} 
                        className="bg-[#0A0A0F] border border-white/20 rounded px-2 py-1 text-xs text-white w-full outline-none focus:border-brand-primary"
                        placeholder="Enter real email..."
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEmail(lead.id) }}
                      />
                      <button onClick={() => handleSaveEmail(lead.id)} disabled={updating === lead.id} className="text-green-400 hover:text-green-300">
                        {updating === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : lead.email.includes("pending_enrichment_") ? (
                    <div className="flex items-center gap-2 mt-1 mb-1 group">
                      <div className="text-xs bg-slate-800/80 text-slate-400 border border-slate-700 rounded px-2 py-0.5 inline-block">Not Enriched Yet</div>
                      <button onClick={() => { setEditingEmailId(lead.id); setEditEmailValue(""); }} className="text-slate-500 hover:text-brand-primary transition opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 mt-1 group">
                      {lead.email}
                      <button onClick={() => { setEditingEmailId(lead.id); setEditEmailValue(lead.email); }} className="text-slate-500 hover:text-brand-primary transition opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {editingPhoneId === lead.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="text" 
                        value={editPhoneValue} 
                        onChange={(e) => setEditPhoneValue(e.target.value)} 
                        className="bg-[#0A0A0F] border border-white/20 rounded px-2 py-1 text-xs text-white w-full outline-none focus:border-brand-primary"
                        placeholder="Enter phone..."
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSavePhone(lead.id) }}
                      />
                      <button onClick={() => handleSavePhone(lead.id)} disabled={updating === lead.id} className="text-green-400 hover:text-green-300">
                        {updating === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : lead.phone ? (
                    <div className="flex items-center gap-2 mt-1 group">
                      <span className="text-xs text-brand-primary">{lead.phone}</span>
                      <button onClick={() => { setEditingPhoneId(lead.id); setEditPhoneValue(lead.phone || ""); }} className="text-slate-500 hover:text-brand-primary transition opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 group">
                      <div className="text-xs text-slate-500">No Phone</div>
                      <button onClick={() => { setEditingPhoneId(lead.id); setEditPhoneValue(""); }} className="text-slate-500 hover:text-brand-primary transition opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {editingWebsiteId === lead.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="text" 
                        value={editWebsiteValue} 
                        onChange={(e) => setEditWebsiteValue(e.target.value)} 
                        className="bg-[#0A0A0F] border border-white/20 rounded px-2 py-1 text-xs text-white w-full outline-none focus:border-brand-primary"
                        placeholder="Enter website URL..."
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveWebsite(lead.id) }}
                      />
                      <button onClick={() => handleSaveWebsite(lead.id)} disabled={updating === lead.id} className="text-green-400 hover:text-green-300">
                        {updating === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : lead.websiteUrl || lead.message?.includes("Website: http") ? (
                    <div className="flex items-center gap-2 mt-1 group">
                      {lead.websiteUrl ? (
                        <a href={lead.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline max-w-[150px] truncate" title={lead.websiteUrl}>
                          {lead.websiteUrl}
                        </a>
                      ) : (
                        <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-500/30">Has Website (In Msg)</span>
                      )}
                      <button onClick={() => { setEditingWebsiteId(lead.id); setEditWebsiteValue(lead.websiteUrl || ""); }} className="text-slate-500 hover:text-brand-primary transition opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 group">
                      <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">No Website</span>
                      <button onClick={() => { setEditingWebsiteId(lead.id); setEditWebsiteValue(""); }} className="text-slate-500 hover:text-brand-primary transition opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-brand-secondary">{lead.projectType || "N/A"}</div>
                  <div className="text-xs mt-1"><span className="text-slate-500">Budget:</span> {lead.budget || "N/A"}</div>
                </td>
                <td className="px-4 py-4">
                  {lead.source === "chatbot" ? (
                    <span className="bg-fuchsia-500/20 text-fuchsia-400 text-xs px-2 py-1 rounded-md border border-fuchsia-500/30 font-bold flex items-center gap-1.5 w-fit"><Bot className="w-3.5 h-3.5" /> Chatbot</span>
                  ) : lead.source === "contact-form" ? (
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-md border border-yellow-500/30 font-medium">Contact Form ⭐</span>
                  ) : (
                    <span className="text-xs text-slate-400 capitalize">{lead.source || "Unknown"}</span>
                  )}
                </td>
                <td className="px-4 py-4 max-w-xs">
                  {editingNotesId === lead.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea 
                        value={editNotesValue} 
                        onChange={(e) => setEditNotesValue(e.target.value)} 
                        className="bg-[#0A0A0F] border border-white/20 rounded px-2 py-1 text-xs text-white w-full outline-none focus:border-brand-primary min-h-[60px]"
                        placeholder="Enter context notes..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveNotes(lead.id)} disabled={savingNotes === lead.id} className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1">
                          {savingNotes === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Save
                        </button>
                        <button onClick={() => setEditingNotesId(null)} className="text-slate-400 hover:text-slate-300 text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <div className="text-xs text-slate-300 line-clamp-3" title={lead.contextNotes || ""}>
                        {lead.contextNotes || <span className="text-slate-600 italic">No notes</span>}
                      </div>
                      <button onClick={() => { setEditingNotesId(lead.id); setEditNotesValue(lead.contextNotes || ""); }} className="absolute top-0 right-0 p-1 bg-[#111] border border-white/10 rounded text-slate-400 hover:text-brand-primary opacity-0 group-hover:opacity-100 transition shadow-lg">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {lead.message && (
                    <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-500 line-clamp-2" title={lead.message}>
                      Msg: {lead.message}
                    </div>
                  )}
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
                  <div className="text-slate-300">{lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</div>
                  {lead.lastEmailedAt && (
                    <div className="text-[10px] text-brand-primary mt-1 flex items-center gap-1" title={new Date(lead.lastEmailedAt).toLocaleString()}>
                      <CheckCircle className="w-3 h-3" /> Sent
                    </div>
                  )}
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
