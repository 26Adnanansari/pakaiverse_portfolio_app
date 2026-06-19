"use client";

import { useState } from "react";

type Order = {
  id: number;
  clientName: string;
  email: string;
  phone: string;
  packageName: string;
  websiteUrl: string;
  targetKeyword: string;
  paymentStatus: string | null;
  orderStatus: string | null;
  startDate: string | null;
  expireDate: string | null;
  createdAt: string | null;
};

export default function AdminDashboardClient({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updating, setUpdating] = useState<number | null>(null);

  const handleStatusChange = async (id: number, field: "paymentStatus" | "orderStatus", value: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === id ? { ...o, [field]: value } : o));
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
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Package & Details</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 rounded-tr-lg">Dates</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-white/5 transition">
              <td className="px-4 py-4 font-medium text-white">#{order.id}</td>
              <td className="px-4 py-4">
                <div className="font-bold text-white">{order.clientName}</div>
                <div className="text-xs text-slate-400">{order.email}</div>
                <div className="text-xs text-brand-primary">{order.phone}</div>
              </td>
              <td className="px-4 py-4">
                <div className="font-bold text-brand-secondary">{order.packageName}</div>
                <a href={order.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">{order.websiteUrl}</a>
                <div className="text-xs mt-1"><span className="text-slate-500">Keyword:</span> {order.targetKeyword}</div>
              </td>
              <td className="px-4 py-4">
                <select 
                  value={order.paymentStatus || "Unpaid"}
                  onChange={(e) => handleStatusChange(order.id, "paymentStatus", e.target.value)}
                  disabled={updating === order.id}
                  className={`bg-white/10 border border-white/10 rounded px-2 py-1 outline-none text-xs ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-red-400'}`}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </td>
              <td className="px-4 py-4">
                <select 
                  value={order.orderStatus || "Pending"}
                  onChange={(e) => handleStatusChange(order.id, "orderStatus", e.target.value)}
                  disabled={updating === order.id}
                  className="bg-white/10 border border-white/10 rounded px-2 py-1 outline-none text-xs text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Renewed">Renewed</option>
                </select>
              </td>
              <td className="px-4 py-4 text-xs">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
