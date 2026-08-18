import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Crown, MoreVertical, Ban, CheckCircle, Eye } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .listUsers({ search, status: statusFilter })
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    await adminApi.updateUserStatus(userId, newStatus);
    fetchUsers();
    if (selectedUser?.user?._id === userId) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#321820] font-serif">Member Directory & Profiles</h1>
          <p className="text-sm text-[#7C6870]">
            Manage user accounts, inspect dossiers, and handle account status.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A59299] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              className="pl-9 pr-4 py-2 bg-white border border-[#F0E2E6] rounded-xl text-sm w-64 focus:outline-none focus:border-[#D62F5B]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#F0E2E6] rounded-xl text-sm focus:outline-none focus:border-[#D62F5B]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#F0E2E6] shadow-soft overflow-hidden">
        <table className="w-full text-left text-sm text-[#321820]">
          <thead className="bg-[#FFF9FA] border-b border-[#F0E2E6] text-xs font-bold uppercase text-[#7C6870]">
            <tr>
              <th className="px-6 py-4">Member Name & ID</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Location & Religion</th>
              <th className="px-6 py-4">Tier & Verification</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E2E6]">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  Loading member directory...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#7C6870]">
                  No members match the search criteria.
                </td>
              </tr>
            ) : (
              users.map((item) => {
                const u = item.user;
                const p = item.profile;
                return (
                  <tr key={u._id} className="hover:bg-[#FFF9FA] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-[#F0E2E6]"
                        />
                        <div>
                          <p className="font-bold text-[#321820]">
                            {p ? `${p.firstName} ${p.lastName}` : 'Profile Incomplete'}
                          </p>
                          <p className="text-xs text-[#7C6870]">{p?.gender || 'N/A'} • {p?.age || 25} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#321820]">{u.email}</p>
                      <p className="text-xs text-[#7C6870]">{u.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{p?.city || 'N/A'}, {p?.state || ''}</p>
                      <p className="text-xs text-[#7C6870]">{p?.religion} ({p?.community || 'General'})</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {p?.isPremium && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D9A441] border border-[#F7D070]">
                            <Crown className="w-3 h-3" /> VIP
                          </span>
                        )}
                        {p?.verificationBadge ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#E8F8EE] text-[#36B56A]">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-xs text-[#A59299]">Unverified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          u.status === 'ACTIVE'
                            ? 'bg-[#E8F8EE] text-[#36B56A]'
                            : u.status === 'BANNED'
                            ? 'bg-[#FCECEB] text-[#D64545]'
                            : 'bg-[#FFF5E6] text-[#E9A23B]'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(item)}
                          className="p-1.5 text-[#7C6870] hover:text-[#D62F5B] hover:bg-[#FCEEF2] rounded-lg transition"
                          title="View Profile Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleStatusChange(u._id, 'BANNED')}
                            className="p-1.5 text-[#7C6870] hover:text-[#D64545] hover:bg-[#FCECEB] rounded-lg transition"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(u._id, 'ACTIVE')}
                            className="p-1.5 text-[#7C6870] hover:text-[#36B56A] hover:bg-[#E8F8EE] rounded-lg transition"
                            title="Reactivate User"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* User Dossier Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-[#F0E2E6]">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.profile?.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D62F5B]"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#321820]">
                    {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
                  </h3>
                  <p className="text-xs text-[#7C6870]">{selectedUser.user?.email} • {selectedUser.user?.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="py-6 space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-xs uppercase text-[#7C6870] tracking-wider mb-1">
                  Bio / About Me
                </h4>
                <p className="text-[#321820] bg-[#FFF9FA] p-3 rounded-xl border border-[#F0E2E6]">
                  "{selectedUser.profile?.about || 'No bio provided'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFF9FA] p-3 rounded-xl border border-[#F0E2E6]">
                  <p className="text-xs text-[#7C6870]">Career & Education</p>
                  <p className="font-bold mt-0.5">{selectedUser.profile?.occupation}</p>
                  <p className="text-xs text-[#7C6870]">{selectedUser.profile?.degree}</p>
                </div>
                <div className="bg-[#FFF9FA] p-3 rounded-xl border border-[#F0E2E6]">
                  <p className="text-xs text-[#7C6870]">Family & Background</p>
                  <p className="font-bold mt-0.5">{selectedUser.profile?.familyType} Family</p>
                  <p className="text-xs text-[#7C6870]">Father: {selectedUser.profile?.fatherOccupation}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0E2E6] flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 rounded-xl border border-[#F0E2E6] font-semibold text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
