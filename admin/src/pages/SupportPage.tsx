import React, { useState, useEffect } from 'react';
import { LifeBuoy, MessageSquare, Send } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchTickets = () => {
    setLoading(true);
    adminApi
      .listSupportTickets()
      .then((res) => setTickets(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    await adminApi.replySupportTicket(selectedTicket._id, replyText, 'RESOLVED');
    setReplyText('');
    setSelectedTicket(null);
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#321820] font-serif">Customer Support & Help Desk</h1>
        <p className="text-sm text-[#7C6870]">
          Review incoming tickets from members, provide direct answers, and resolve queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#F0E2E6] shadow-soft p-4 max-h-[750px] overflow-y-auto space-y-3">
          <h3 className="font-bold text-sm text-[#7C6870] uppercase px-2 mb-2">All Tickets ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <p className="text-sm text-[#7C6870] p-4 text-center">No support tickets found.</p>
          ) : (
            tickets.map((t) => (
              <div
                key={t._id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedTicket?._id === t._id
                    ? 'border-[#D62F5B] bg-[#FFF9FA] shadow-soft'
                    : 'border-[#F0E2E6] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FCEEF2] text-[#D62F5B]">
                    {t.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      t.status === 'RESOLVED' ? 'text-[#36B56A]' : 'text-[#E9A23B]'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#321820] truncate">{t.subject}</h4>
                <p className="text-xs text-[#7C6870] truncate mt-1">{t.message}</p>
                <p className="text-[10px] text-[#A59299] mt-2">{t.user?.email}</p>
              </div>
            ))
          )}
        </div>

        {/* Ticket Detail Stage */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0E2E6] shadow-soft p-6 flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <>
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-[#F0E2E6]">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FCEEF2] text-[#D62F5B]">
                      {selectedTicket.category}
                    </span>
                    <h2 className="text-xl font-bold text-[#321820] mt-2">{selectedTicket.subject}</h2>
                    <p className="text-xs text-[#7C6870]">
                      From: <strong>{selectedTicket.user?.email}</strong> • {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F0E2E6]">
                    <p className="text-xs font-bold text-[#7C6870] uppercase mb-1">User Query</p>
                    <p className="text-sm text-[#321820]">{selectedTicket.message}</p>
                  </div>

                  {selectedTicket.adminReply && (
                    <div className="p-4 rounded-2xl bg-[#E8F8EE] border border-[#D1F2DE]">
                      <p className="text-xs font-bold text-[#36B56A] uppercase mb-1">Admin Response</p>
                      <p className="text-sm text-[#321820]">{selectedTicket.adminReply}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-[#F0E2E6]">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official support response to the member..."
                  className="w-full p-3 border border-[#F0E2E6] rounded-xl text-sm focus:outline-none focus:border-[#D62F5B]"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleReply}
                    className="px-6 py-2.5 rounded-xl bg-[#D62F5B] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#B92349] transition shadow-soft"
                  >
                    <Send className="w-4 h-4" /> Send Reply & Resolve Ticket
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-[#7C6870]">
              <LifeBuoy className="w-12 h-12 text-[#D62F5B] mb-3 opacity-40" />
              <p className="font-bold text-base text-[#321820]">No Ticket Selected</p>
              <p className="text-xs max-w-sm mt-1">
                Select a ticket from the left panel to inspect customer communications and post responses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
