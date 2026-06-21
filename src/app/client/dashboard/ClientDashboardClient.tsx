"use client";

type Order = {
  id: number;
  clientName: string;
  email: string;
  packageName: string;
  websiteUrl: string;
  targetKeyword: string;
  paymentStatus: string | null;
  orderStatus: string | null;
  createdAt: string | null;
};

export default function ClientDashboardClient({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
        <p className="text-slate-400 mb-6">You haven&apos;t placed any Guest Post orders yet.</p>
        <a href="/guest-posts" className="bg-brand-primary text-black font-bold px-6 py-3 rounded-xl transition hover:bg-brand-primary/90">
          Explore Packages
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Package & Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-5 font-medium text-white">#{order.id}</td>
                <td className="px-6 py-5">
                  <div className="font-bold text-brand-secondary">{order.packageName}</div>
                  <a href={order.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">{order.websiteUrl}</a>
                  <div className="text-xs mt-1"><span className="text-slate-500">Keyword:</span> {order.targetKeyword}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex px-2 py-1 rounded text-[11px] font-bold w-fit ${
                      order.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400' : 
                      order.paymentStatus === 'Under Review' ? 'bg-yellow-500/10 text-yellow-400' : 
                      'bg-red-500/10 text-red-400'
                    }`}>
                      Payment: {order.paymentStatus || 'Unpaid'}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded text-[11px] font-bold w-fit ${
                      order.orderStatus === 'Active' ? 'bg-blue-500/10 text-blue-400' : 
                      'bg-white/10 text-white'
                    }`}>
                      Order: {order.orderStatus || 'Pending'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs text-slate-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-5 text-right">
                  {(!order.paymentStatus || order.paymentStatus === 'Unpaid') && (
                    <a 
                      href={`/checkout/${order.id}`}
                      className="inline-block bg-brand-primary text-black font-bold px-4 py-2 rounded-lg text-xs hover:bg-brand-primary/90 transition"
                    >
                      Pay Now
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
