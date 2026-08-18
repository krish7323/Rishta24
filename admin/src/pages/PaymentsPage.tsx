import React, { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle2, ArrowDownLeft } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .listPayments()
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#321820] font-serif">Transactions & Subscriptions</h1>
        <p className="text-sm text-[#7C6870]">
          Audit all VIP membership payments processed via Razorpay payment gateway.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E2E6] shadow-soft overflow-hidden">
        <table className="w-full text-left text-sm text-[#321820]">
          <thead className="bg-[#FFF9FA] border-b border-[#F0E2E6] text-xs font-bold uppercase text-[#7C6870]">
            <tr>
              <th className="px-6 py-4">Transaction / Order ID</th>
              <th className="px-6 py-4">Customer Member</th>
              <th className="px-6 py-4">Subscription Plan</th>
              <th className="px-6 py-4">Amount Paid</th>
              <th className="px-6 py-4">Gateway Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E2E6]">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  Loading transaction records...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  No transaction records found.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="hover:bg-[#FFF9FA] transition">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs font-bold text-[#321820]">{p.razorpayOrderId}</p>
                    <p className="font-mono text-[10px] text-[#7C6870]">{p.razorpayPaymentId || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#321820]">{p.user?.email}</p>
                    <p className="text-xs text-[#7C6870]">{p.user?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-[#FFFBEB] text-[#D9A441] border border-[#F7D070] text-xs font-bold">
                      {p.planId}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#321820]">
                    ₹{(p.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === 'SUCCESS' || p.status === 'PAID'
                          ? 'bg-[#E8F8EE] text-[#36B56A]'
                          : 'bg-[#FFF5E6] text-[#E9A23B]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#7C6870] text-right">
                    {new Date(p.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
