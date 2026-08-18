import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Lock, Mail, ShieldAlert } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdminStore } from '../store/adminStore';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@rishta24.test');
  const [password, setPassword] = useState('AdminSecure2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setAuth = useAdminStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.login({ identifier, password });
      setAuth(
        {
          id: res.data.user.id || res.data.user._id,
          email: res.data.user.email,
          role: res.data.user.role,
        },
        res.data.accessToken
      );
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#F0E2E6] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#D62F5B] mx-auto flex items-center justify-center text-white shadow-soft mb-3">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#321820]">
            Rishta<span className="text-[#D62F5B]">24</span>
          </h1>
          <p className="text-xs font-semibold text-[#7C6870] uppercase tracking-widest mt-1">
            Admin Management Console
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#FCECEB] border border-[#F5C2C0] flex items-center gap-3 text-[#D64545] text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#7C6870] mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A59299] absolute left-3 top-3.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-[#FFF9FA] border border-[#F0E2E6] rounded-xl text-sm focus:outline-none focus:border-[#D62F5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#7C6870] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A59299] absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-[#FFF9FA] border border-[#F0E2E6] rounded-xl text-sm focus:outline-none focus:border-[#D62F5B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D62F5B] text-white rounded-xl font-bold text-sm hover:bg-[#B92349] transition shadow-soft mt-6 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal →'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#F0E2E6] text-center">
          <p className="text-xs text-[#7C6870]">
            Preloaded SuperAdmin: <strong className="text-[#321820]">admin@rishta24.test</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
