"use client";

import { useState } from "react";
import { Loader2, Check, CreditCard, Mail, Search, Sparkles, Building2, Save } from "lucide-react";

export default function AdminSettingsClient({ initialBankDetails }: { initialBankDetails: string }) {
  const [bankDetails, setBankDetails] = useState(initialBankDetails);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mocked Usage Stats
  const usageStats = [
    {
      title: "Resend Email Quota",
      used: 450,
      total: 3000,
      unit: "emails",
      icon: <Mail className="w-5 h-5 text-emerald-400" />,
      color: "emerald"
    },
    {
      title: "LeadMagic Search Quota",
      used: 120,
      total: 500,
      unit: "credits",
      icon: <Search className="w-5 h-5 text-brand-primary" />,
      color: "brand"
    },
    {
      title: "Apollo Enrichment (Fallback)",
      used: 15,
      total: 100,
      unit: "credits",
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
      color: "amber"
    },
    {
      title: "AI Generations (Gemini/Claude)",
      used: 85,
      total: null, // Unlimited/Pay as you go
      unit: "drafts",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: "purple"
    }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "bankDetails", value: bankDetails }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Usage Stats Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-primary" /> API Usage & Quotas
          </h2>
          <p className="text-sm text-slate-400">Monthly limits for connected third-party services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {usageStats.map((stat, i) => {
            const percentage = stat.total ? Math.min(100, (stat.used / stat.total) * 100) : 0;
            return (
              <div key={i} className="bg-[#111118] border border-white/10 rounded-xl p-5 space-y-4 shadow-sm hover:border-white/20 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    {stat.icon}
                  </div>
                  <h3 className="font-medium text-slate-300 text-sm">{stat.title}</h3>
                </div>
                
                <div>
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className="text-2xl font-bold text-white">{stat.used.toLocaleString()}</span>
                    {stat.total ? (
                      <span className="text-sm text-slate-500 mb-1">/ {stat.total.toLocaleString()} {stat.unit}</span>
                    ) : (
                      <span className="text-sm text-slate-500 mb-1">{stat.unit} (Pay-as-you-go)</span>
                    )}
                  </div>
                  
                  {stat.total && (
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${percentage > 85 ? 'bg-red-500' : 'bg-brand-primary'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Global Configuration Section */}
      <section className="space-y-4 pt-6 border-t border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-primary" /> Global Configuration
          </h2>
          <p className="text-sm text-slate-400">Settings applied across the main website and client dashboard.</p>
        </div>

        <form onSubmit={handleSave} className="bg-[#111118] border border-white/10 rounded-xl p-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <label className="text-sm font-semibold text-slate-300">Bank Details for Checkout</label>
            <p className="text-xs text-slate-500 mb-2">
              This text will be displayed to clients on the checkout page when they need to make a transfer.
            </p>
            <textarea
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              rows={6}
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-brand-primary outline-none transition font-mono text-sm resize-y"
              placeholder="Bank Name: XYZ Bank\nAccount Title: John Doe\nAccount Number: 123456789\nIBAN: PK00XYZ0123456789\n\nJazzCash / EasyPaisa: 0300-1234567"
            />
          </div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-primary text-black font-bold px-6 py-2.5 rounded-lg transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center gap-2 text-sm"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-1.5 animate-in fade-in">
                <Check size={16} /> Saved Successfully
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
