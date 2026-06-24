"use client";

import { useState } from "react";

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-white/5 text-slate-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 rounded-tl-lg">ID</th>
            <th className="px-4 py-3">Contact Info</th>
            <th className="px-4 py-3">Project Details</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 rounded-tr-lg">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-white/5 transition">
              <td className="px-4 py-4 font-medium text-white">#{lead.id}</td>
              <td className="px-4 py-4">
                <div className="font-bold text-white">{lead.name || "N/A"}</div>
                <div className="text-xs text-slate-400 mb-1">{lead.email}</div>
                {lead.phone ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-primary">{lead.phone}</span>
                    <a 
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 px-2 py-0.5 rounded text-[10px] font-medium transition"
                    >
                      WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">No Phone</div>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="font-bold text-brand-secondary">{lead.projectType || "N/A"}</div>
                <div className="text-xs mt-1"><span className="text-slate-500">Budget:</span> {lead.budget || "N/A"}</div>
                <div className="text-xs mt-1"><span className="text-slate-500">Source:</span> {lead.source || "Website"}</div>
              </td>
              <td className="px-4 py-4">
                <div className="text-xs text-slate-400 line-clamp-3 max-w-xs" title={lead.message || ""}>
                  {lead.message || "No message provided."}
                </div>
              </td>
              <td className="px-4 py-4">
                <select 
                  value={lead.status || "new"}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  disabled={updating === lead.id}
                  className={`bg-white/10 border border-white/10 rounded px-2 py-1 outline-none text-xs ${
                    lead.status === 'contacted' ? 'text-blue-400' :
                    lead.status === 'closed' ? 'text-green-400' :
                    lead.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed / Won</option>
                  <option value="rejected">Rejected / Lost</option>
                </select>
              </td>
              <td className="px-4 py-4 text-xs">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No leads found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
