"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function AdminSettingsClient({ initialBankDetails }: { initialBankDetails: string }) {
  const [bankDetails, setBankDetails] = useState(initialBankDetails);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-300">Bank Details for Checkout</label>
        <p className="text-xs text-slate-500 mb-1">
          This text will be displayed to clients on the checkout page when they need to make a transfer.
        </p>
        <textarea
          value={bankDetails}
          onChange={(e) => setBankDetails(e.target.value)}
          rows={6}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-brand-primary outline-none transition font-mono text-sm"
          placeholder="Bank Name: XYZ Bank\nAccount Title: John Doe\nAccount Number: 123456789\nIBAN: PK00XYZ0123456789\n\nJazzCash / EasyPaisa: 0300-1234567"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-brand-primary text-black font-bold px-6 py-2.5 rounded-lg transition hover:bg-brand-primary/90 disabled:opacity-60 flex items-center gap-2"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <Check size={16} /> Saved!
          </span>
        )}
      </div>
    </form>
  );
}
