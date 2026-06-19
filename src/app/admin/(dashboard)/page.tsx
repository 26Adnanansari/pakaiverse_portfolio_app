import { db } from "@/db";
import { guest_post_orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allOrders = await db.select().from(guest_post_orders).orderBy(desc(guest_post_orders.createdAt));

  const serialized = allOrders.map(order => ({
    ...order,
    startDate: order.startDate ? order.startDate.toISOString() : null,
    expireDate: order.expireDate ? order.expireDate.toISOString() : null,
    createdAt: order.createdAt ? order.createdAt.toISOString() : null,
  }));

  return (
    <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-6">Guest Post Orders</h2>
      <AdminDashboardClient orders={serialized} />
    </div>
  );
}
