import { db } from "@/db";
import { guest_post_orders, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { PORTFOLIO } from "@/config/portfolio";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const orderId = parseInt(params.id);
  if (isNaN(orderId)) return notFound();

  const [order] = await db.select().from(guest_post_orders).where(eq(guest_post_orders.id, orderId));
  if (!order) return notFound();

  // Fetch admin bank details from settings table
  const [bankDetailsSetting] = await db.select().from(settings).where(eq(settings.id, "bankDetails"));
  
  // Default to a friendly message if not configured
  const bankDetails = bankDetailsSetting?.value || "Bank details are currently being updated. Please contact support.";

  // Determine price based on package
  let price = "$49";
  if (order.packageName === "Pro") price = "$149";
  if (order.packageName === "Premium") price = "$299";

  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Complete Your Payment</h1>
        <p className="text-slate-400 mb-8">
          Order #{order.id} • {order.packageName} Package • {price}
        </p>
        
        <CheckoutClient 
          order={order} 
          bankDetails={bankDetails} 
          price={price} 
          whatsapp={PORTFOLIO.whatsapp}
        />
      </div>
    </div>
  );
}
