import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Crown,
  IndianRupee,
  Heart,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { adminApi } from '../services/adminApi';
import { DashboardStats, RegistrationTrendItem } from '../types/admin';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<{ registrationTrend: RegistrationTrendItem[] }>({
    registrationTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboardMetrics()
      .then((res) => {
        setStats(res.data.stats);
        setCharts(res.data.charts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#D62F5B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Registered Profiles',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-[#D62F5B]',
      bg: 'bg-[#FCEEF2]',
      change: '+14% this week',
    },
    {
      label: 'Verified Members (Govt ID)',
      value: stats?.verifiedProfiles || 0,
      icon: ShieldCheck,
      color: 'text-[#36B56A]',
      bg: 'bg-[#E8F8EE]',
      change: 'Trust score: 98%',
    },
    {
      label: 'Premium VIP Subscribers',
      value: stats?.premiumUsers || 0,
      icon: Crown,
      color: 'text-[#D9A441]',
      bg: 'bg-[#FFFBEB]',
      change: `${stats?.conversionRate}% conversion`,
    },
    {
      label: 'Total Platform Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-[#4A1525]',
      bg: 'bg-[#F4EAEE]',
      change: 'Via Razorpay Gateway',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-bold text-[#321820] font-serif">Platform Overview & Live Analytics</h1>
        <p className="text-sm text-[#7C6870] mt-1">
          Real-time metrics on member onboarding, verifications, match volume, and transactions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-[#F0E2E6] shadow-soft hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-[#7C6870] tracking-wider">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-[#321820]">{card.value}</h3>
                <p className="text-xs font-medium text-[#7C6870] mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#36B56A]" /> {card.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Operations Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#F0E2E6] shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-[#321820]">New Member Registrations & Activity</h3>
              <p className="text-xs text-[#7C6870]">Daily influx across metro cities</p>
            </div>
            <span className="px-3 py-1 bg-[#FCEEF2] text-[#D62F5B] text-xs font-bold rounded-full">
              Last 7 Days
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.registrationTrend}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D62F5B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D62F5B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E2E6" />
                <XAxis dataKey="date" stroke="#7C6870" fontSize={12} tickLine={false} />
                <YAxis stroke="#7C6870" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#F0E2E6',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="#D62F5B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorReg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Action Queue */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0E2E6] shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#321820] mb-4">Operations Queue</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFF9FA] border border-[#F0E2E6]">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-[#E9A23B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#321820]">Pending Verifications</h4>
                    <p className="text-xs text-[#7C6870]">Govt ID / Selfie reviews</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#E9A23B] text-white">
                  {stats?.pendingVerifications || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFF9FA] border border-[#F0E2E6]">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#D64545]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#321820]">Reported Profiles</h4>
                    <p className="text-xs text-[#7C6870]">Safety & fraud alerts</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#D64545] text-white">
                  {stats?.pendingReports || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFF9FA] border border-[#F0E2E6]">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#D62F5B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#321820]">Total Mutual Matches</h4>
                    <p className="text-xs text-[#7C6870]">Connections established</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FCEEF2] text-[#D62F5B]">
                  {stats?.totalMatches || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E2E6]">
            <p className="text-xs text-center text-[#7C6870]">
              System Version: <strong>Rishta24 v1.0.0-PROD</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
