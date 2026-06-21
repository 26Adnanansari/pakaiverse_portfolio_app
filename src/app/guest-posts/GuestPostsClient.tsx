"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PACKAGES = [
  { 
    name: "Starter", 
    price: "$49", 
    da: "30+", 
    delivery: "5 days", 
    features: ["1 Do-Follow Link", "500+ Words Article", "1 Target Anchor Text", "Permanent Post"] 
  },
  { 
    name: "Pro", 
    price: "$149", 
    da: "50+", 
    delivery: "3 days", 
    features: ["1 Do-Follow Link", "1000+ Words Article", "2 Target Anchor Texts", "Social Signals", "Permanent Post"],
    popular: true 
  },
  { 
    name: "Premium", 
    price: "$299", 
    da: "70+", 
    delivery: "24h", 
    features: ["2 Do-Follow Links", "1500+ Words Article", "3 Target Anchor Texts", "Featured Homepage Placement", "Permanent Post"] 
  },
];

export default function GuestPostsClient() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    websiteUrl: "",
    targetKeyword: "",
  });

  const handleOrderClick = (pkgName: string) => {
    setSelectedPackage(pkgName);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, packageName: selectedPackage }),
      });
      const data = await res.json();
      
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to process order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Why Publish With Us? (Benefits) */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Why Publish on PakAiVerse?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get more than just a backlink. Our platform is optimized for the next generation of search engines, driving real authority to your digital assets.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10">
            <div className="text-2xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-white mb-2">SEO & AIO Rankings</h3>
            <p className="text-sm text-slate-400">Rank higher on Google and be cited by AI engines like ChatGPT and Perplexity.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-2xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-white mb-2">App Store Authority</h3>
            <p className="text-sm text-slate-400">Drive high-quality contextual links to your Play Store or App Store pages.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-2xl mb-4">🎥</div>
            <h3 className="text-lg font-bold text-white mb-2">YouTube Growth</h3>
            <p className="text-sm text-slate-400">Embed your videos to increase watch time and rank videos in Google Search.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-2xl mb-4">🏢</div>
            <h3 className="text-lg font-bold text-white mb-2">Brand PR</h3>
            <p className="text-sm text-slate-400">Build entity authority for your founders, brand names, or local business profiles.</p>
          </div>
        </div>
      </div>

      {/* Content Guidelines Section */}
      <div className="max-w-4xl mx-auto mb-24 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            How to Craft AI-Optimized Content?
          </h2>
          <p className="text-slate-400">
            To rank globally on AI Search Engines (ChatGPT, Perplexity) and Google, focus on worldwide trends. Here is what performs best:
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111118] p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-colors">
            <div className="text-brand-primary text-xl font-bold mb-3">01. &quot;How-to&quot; Guides</div>
            <p className="text-sm text-slate-300 italic mb-2">e.g., How to build an AI SaaS in 2026?</p>
            <p className="text-xs text-slate-400">Actionable, step-by-step global tutorials that AI can easily extract answers from.</p>
          </div>
          
          <div className="bg-[#111118] p-6 rounded-2xl border border-white/5 hover:border-brand-secondary/30 transition-colors">
            <div className="text-brand-secondary text-xl font-bold mb-3">02. Case Studies</div>
            <p className="text-sm text-slate-300 italic mb-2">e.g., How PakAiVerse Automated Lead Generation for XYZ Company</p>
            <p className="text-xs text-slate-400">Real data and results. LLMs love referencing data-backed success stories.</p>
          </div>
          
          <div className="bg-[#111118] p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-colors">
            <div className="text-brand-primary text-xl font-bold mb-3">03. Industry Insights</div>
            <p className="text-sm text-slate-300 italic mb-2">e.g., Top 5 Web Technologies for Global Agencies</p>
            <p className="text-xs text-slate-400">Target a worldwide audience with tech stacks and insights relevant globally.</p>
          </div>
        </div>
      </div>

      {/* Pricing Packages */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.name} 
            className={`glass rounded-3xl p-8 flex flex-col relative transition-transform hover:-translate-y-2 duration-300 ${pkg.popular ? 'border-brand-primary/50' : 'border-white/10'}`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                Most Popular
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-display font-bold text-white">{pkg.price}</span>
              <span className="text-slate-400">/post</span>
            </div>
            
            <div className="mb-8 space-y-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="font-semibold text-white">Domain Authority:</span> {pkg.da}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 pb-4 border-b border-white/10">
                <span className="font-semibold text-white">Delivery Time:</span> {pkg.delivery}
              </div>
              
              <ul className="space-y-3 pt-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => handleOrderClick(pkg.name)}
              className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
                pkg.popular 
                  ? "bg-brand-primary text-black hover:bg-brand-primary/90 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                  : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              Order Now
            </button>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111118] border border-white/10 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Complete Your Order</h2>
              <p className="text-slate-400 mb-6 text-sm">
                You selected the <span className="text-brand-primary font-semibold">{selectedPackage}</span> package. Fill out your details below.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-slate-300">Name</label>
                    <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-primary outline-none transition" placeholder="John Doe" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-slate-300">WhatsApp Number</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-primary outline-none transition" placeholder="+123456789" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-primary outline-none transition" placeholder="john@example.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300">Website URL (Where the link goes)</label>
                  <input required type="url" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-primary outline-none transition" placeholder="https://yourwebsite.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300">Target Keyword (Anchor Text)</label>
                  <input required type="text" value={formData.targetKeyword} onChange={e => setFormData({...formData, targetKeyword: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-brand-primary outline-none transition" placeholder="e.g. Best AI Software" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-brand-primary text-black font-bold py-3.5 rounded-xl transition hover:bg-brand-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Proceed to Checkout"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
