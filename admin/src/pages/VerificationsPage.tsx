import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Eye } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const VerificationsPage: React.FC = () => {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const fetchVerifications = () => {
    setLoading(true);
    adminApi
      .listVerifications({ status: 'PENDING' })
      .then((res) => setVerifications(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleReview = async (id: string, action: 'APPROVE' | 'REJECT') => {
    await adminApi.reviewVerification(id, action);
    fetchVerifications();
    setPreviewDoc(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#321820] font-serif">ID & Photo Verification Queue</h1>
        <p className="text-sm text-[#7C6870]">
          Review submitted Government IDs and live selfies to grant the official Verified Trust Badge.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E2E6] shadow-soft overflow-hidden">
        <table className="w-full text-left text-sm text-[#321820]">
          <thead className="bg-[#FFF9FA] border-b border-[#F0E2E6] text-xs font-bold uppercase text-[#7C6870]">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Document Type</th>
              <th className="px-6 py-4">Masked Number</th>
              <th className="px-6 py-4">Submission Date</th>
              <th className="px-6 py-4">Inspect Documents</th>
              <th className="px-6 py-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E2E6]">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  Loading pending verification queue...
                </td>
              </tr>
            ) : verifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  🎉 All verification requests have been reviewed! No pending documents in queue.
                </td>
              </tr>
            ) : (
              verifications.map((item) => {
                const v = item.verification;
                const p = item.profile;
                return (
                  <tr key={v._id} className="hover:bg-[#FFF9FA] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-[#F0E2E6]"
                        />
                        <div>
                          <p className="font-bold">{p ? `${p.firstName} ${p.lastName}` : 'Member'}</p>
                          <p className="text-xs text-[#7C6870]">{v.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#D62F5B]">{v.documentType}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{v.documentNumberMasked}</td>
                    <td className="px-6 py-4 text-xs text-[#7C6870]">
                      {new Date(v.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setPreviewDoc(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCEEF2] text-[#D62F5B] text-xs font-bold hover:bg-[#D62F5B] hover:text-white transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect ID & Selfie
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReview(v._id, 'REJECT')}
                          className="px-3 py-1.5 rounded-lg bg-[#FCECEB] text-[#D64545] text-xs font-bold hover:bg-[#D64545] hover:text-white transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleReview(v._id, 'APPROVE')}
                          className="px-3 py-1.5 rounded-lg bg-[#E8F8EE] text-[#36B56A] text-xs font-bold hover:bg-[#36B56A] hover:text-white transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Badge
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

      {/* Preview Documents Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E2E6]">
              <h3 className="text-lg font-bold text-[#321820]">
                Document Inspection — {previewDoc.profile?.firstName} {previewDoc.profile?.lastName}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6">
              <div>
                <p className="text-xs font-bold text-[#7C6870] uppercase mb-2">
                  Submitted {previewDoc.verification?.documentType} Document
                </p>
                <img
                  src={previewDoc.verification?.documentFrontUrl}
                  alt="Govt ID Document"
                  className="w-full h-64 object-cover rounded-2xl border border-[#F0E2E6]"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-[#7C6870] uppercase mb-2">Live Verification Selfie</p>
                <img
                  src={previewDoc.verification?.selfieUrl}
                  alt="Verification Selfie"
                  className="w-full h-64 object-cover rounded-2xl border border-[#F0E2E6]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0E2E6] flex justify-end gap-3">
              <button
                onClick={() => handleReview(previewDoc.verification?._id, 'REJECT')}
                className="px-5 py-2.5 rounded-xl bg-[#FCECEB] text-[#D64545] font-bold text-sm hover:bg-[#D64545] hover:text-white transition"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleReview(previewDoc.verification?._id, 'APPROVE')}
                className="px-6 py-2.5 rounded-xl bg-[#36B56A] text-white font-bold text-sm hover:bg-[#2E9B5A] shadow-soft transition"
              >
                Approve & Grant Verified Badge ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
