import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Ban } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    adminApi
      .listReports({ status: 'PENDING' })
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (reportId: string, action: string) => {
    await adminApi.resolveReport(reportId, action, `Action ${action} taken by admin`);
    fetchReports();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#321820] font-serif">Member Safety & Reports Moderation</h1>
        <p className="text-sm text-[#7C6870]">
          Investigate abuse reports, inappropriate chat messages, and suspicious accounts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E2E6] shadow-soft overflow-hidden">
        <table className="w-full text-left text-sm text-[#321820]">
          <thead className="bg-[#FFF9FA] border-b border-[#F0E2E6] text-xs font-bold uppercase text-[#7C6870]">
            <tr>
              <th className="px-6 py-4">Reported Member</th>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Reason Category</th>
              <th className="px-6 py-4">Details / Description</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Enforcement Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E2E6]">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  Loading moderation reports...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  ✨ No pending reports. Rishta24 community is safe and respectful!
                </td>
              </tr>
            ) : (
              reports.map((item) => {
                const rep = item.report;
                const reportedProfile = item.reportedProfile;
                const reporterProfile = item.reporterProfile;
                return (
                  <tr key={rep._id} className="hover:bg-[#FFF9FA] transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#D64545]">
                        {reportedProfile ? `${reportedProfile.firstName} ${reportedProfile.lastName}` : 'Member'}
                      </p>
                      <p className="text-xs text-[#7C6870]">{rep.reportedUser?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {reporterProfile ? `${reporterProfile.firstName} ${reporterProfile.lastName}` : 'Reporter'}
                      </p>
                      <p className="text-xs text-[#7C6870]">{rep.reporter?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FCECEB] text-[#D64545]">
                        {rep.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7C6870] max-w-xs truncate">
                      {rep.description || 'No additional remarks'}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7C6870]">
                      {new Date(rep.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResolve(rep._id, 'DISMISSED')}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolve(rep._id, 'WARNED')}
                          className="px-3 py-1.5 rounded-lg bg-[#FFF5E6] text-[#E9A23B] text-xs font-bold hover:bg-[#E9A23B] hover:text-white transition"
                        >
                          Warn Member
                        </button>
                        <button
                          onClick={() => handleResolve(rep._id, 'BANNED')}
                          className="px-3 py-1.5 rounded-lg bg-[#FCECEB] text-[#D64545] text-xs font-bold hover:bg-[#D64545] hover:text-white transition flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" /> Ban User
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
