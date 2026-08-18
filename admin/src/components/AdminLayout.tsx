import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Flag,
  CreditCard,
  LifeBuoy,
  FileText,
  LogOut,
  HeartHandshake,
} from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = useAdminStore((state) => state.admin);
  const logout = useAdminStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'User Directory', icon: Users, path: '/users' },
    { label: 'ID Verifications', icon: ShieldCheck, path: '/verifications' },
    { label: 'Reports & Safety', icon: Flag, path: '/reports' },
    { label: 'Payments & Revenue', icon: CreditCard, path: '/payments' },
    { label: 'Support Desk', icon: LifeBuoy, path: '/support' },
    { label: 'System Audit Logs', icon: FileText, path: '/audit-logs' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFF9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#F0E2E6] flex flex-col fixed inset-y-0 z-20 shadow-soft">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#F0E2E6] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D62F5B] flex items-center justify-center text-white shadow-soft">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#321820]">
              Rishta<span className="text-[#D62F5B]">24</span>
            </h1>
            <p className="text-xs text-[#7C6870] italic">Admin Control Center</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#D62F5B] text-white shadow-soft font-semibold'
                    : 'text-[#7C6870] hover:bg-[#FFF5F7] hover:text-[#D62F5B]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#A59299]'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-[#F0E2E6] bg-[#FFF9FA]">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-bold text-[#321820] truncate">{admin?.email || 'admin@rishta24.test'}</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#FCEEF2] text-[#D62F5B]">
                {admin?.role || 'SUPER_ADMIN'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#7C6870] hover:text-[#D64545] hover:bg-white rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#F0E2E6] px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36B56A] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#7C6870] uppercase tracking-wider">
              Rishta24 Core Services: Operational
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#7C6870]">
              Logged in as: <strong className="text-[#321820]">{admin?.email}</strong>
            </span>
          </div>
        </header>

        {/* Page View */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
