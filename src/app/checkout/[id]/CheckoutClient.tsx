"use client";

import { useState } from "react";
import { CheckCircle2, UploadCloud, Check } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface Order {
  id: number;
  clientName: string;
  email: string | null;
  packageName: string;
  paymentStatus: string | null;
  paymentProofUrl: string | null;
}

export default function CheckoutClient({
  order,
  bankDetails,
  price,
  whatsapp
}: {
  order: Order;
  bankDetails: string;
  price: string;
  whatsapp: string;
}) {
  const [proofUrl, setProofUrl] = useState<string | null>(order.paymentProofUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = async (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;
    
    setProofUrl(url);
  };

  const submitProof = async () => {
    if (!proofUrl) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/orders/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, paymentProofUrl: proofUrl }),
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Failed to submit proof. Please try again.");
      }
    } catch {
      alert("Error submitting proof.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Bank Details */}
      <div className="bg-[#111118] border border-white/10 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Payment Instructions</h2>
        <p className="text-slate-400 mb-6 text-sm">
          Please transfer <strong className="text-white text-lg">{price}</strong> to the account below. Once the transfer is complete, upload the screenshot or receipt.
        </p>

        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-5 mb-8">
          <pre className="text-sm text-brand-primary font-mono whitespace-pre-wrap font-bold">
            {bankDetails}
          </pre>
        </div>

        <div className="text-sm text-slate-500">
          <p>Questions? Contact us on WhatsApp:</p>
          <p className="text-white mt-1">{whatsapp}</p>
        </div>
      </div>

      {/* Right: Upload Proof */}
      <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
        {submitted ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Received</h2>
            <p className="text-slate-400">
              Your payment proof has been successfully submitted. Our team will verify it shortly and begin work on your order.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-6">Upload Payment Proof</h2>
            
            {!proofUrl ? (
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => {
                  return (
                    <button 
                      onClick={() => open()}
                      className="w-full border-2 border-dashed border-white/20 hover:border-brand-primary/50 bg-white/5 hover:bg-white/10 rounded-2xl p-10 flex flex-col items-center justify-center transition-all group"
                    >
                      <UploadCloud className="w-12 h-12 text-slate-500 group-hover:text-brand-primary mb-4 transition-colors" />
                      <span className="text-white font-semibold">Click to upload receipt</span>
                      <span className="text-xs text-slate-500 mt-2">Supports JPG, PNG, PDF</span>
                    </button>
                  );
                }}
              </CldUploadWidget>
            ) : (
              <div className="w-full border-2 border-solid border-brand-primary/50 bg-brand-primary/5 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Receipt Uploaded</p>
                    <a href={proofUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-primary hover:underline">
                      View File
                    </a>
                  </div>
                </div>
                <button 
                  onClick={() => setProofUrl(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Change
                </button>
              </div>
            )}

            <button 
              onClick={submitProof}
              disabled={!proofUrl || isSubmitting}
              className="mt-8 w-full bg-brand-primary text-black font-bold py-4 rounded-xl transition hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Payment Proof"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
