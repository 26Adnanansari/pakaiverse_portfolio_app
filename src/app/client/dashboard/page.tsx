import { auth } from "@/auth";
import { db } from "@/db";
import { guest_post_orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import ClientDashboardClient from "./ClientDashboardClient";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/client/dashboard");
  }

  // Fetch orders for this user
  const userOrders = await db.select()
    .from(guest_post_orders)
    .where(eq(guest_post_orders.email, session.user.email))
    .orderBy(desc(guest_post_orders.createdAt));

  const serialized = userOrders.map(o => ({
    ...o,
    startDate: o.startDate ? o.startDate.toISOString() : null,
    expireDate: o.expireDate ? o.expireDate.toISOString() : null,
    createdAt: o.createdAt ? o.createdAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome, {session.user.name}</h1>
            <p className="text-slate-400">Manage your Guest Post orders and track their progress.</p>
          </div>
        </div>

        <ClientDashboardClient orders={serialized} />
      </div>
    </div>
  );
}
