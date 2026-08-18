import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAuditLogs()
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#321820] font-serif">System Audit Logs</h1>
        <p className="text-sm text-[#7C6870]">
          Immutable log trail of all administrative actions, moderation decisions, and sensitive operations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E2E6] shadow-soft overflow-hidden">
        <table className="w-full text-left text-sm text-[#321820]">
          <thead className="bg-[#FFF9FA] border-b border-[#F0E2E6] text-xs font-bold uppercase text-[#7C6870]">
            <tr>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Actor Email</th>
              <th className="px-6 py-4">Target Entity</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E2E6]">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#7C6870]">
                  Loading security audit trail...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#7C6870]">
                  No audit entries recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-[#FFF9FA] transition">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FCEEF2] text-[#D62F5B]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{log.adminUser?.email || 'SYSTEM_DAEMON'}</td>
                  <td className="px-6 py-4 text-xs font-mono text-[#7C6870]">
                    {log.targetEntity || 'GLOBAL'} ({log.targetId || 'N/A'})
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#7C6870]">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="px-6 py-4 text-xs text-[#7C6870] text-right">
                    {new Date(log.createdAt).toLocaleString()}
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
