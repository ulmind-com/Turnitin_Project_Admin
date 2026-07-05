import { useState, useEffect } from 'react';
import api from '../services/api';
import { HiOutlineUsers, HiOutlineDocumentSearch, HiOutlineClock, HiOutlineCreditCard } from 'react-icons/hi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.total_users ?? 0, icon: HiOutlineUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Scans', value: data?.total_scans ?? 0, icon: HiOutlineDocumentSearch, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Payments', value: data?.pending_payments ?? 0, icon: HiOutlineClock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Credits Distributed', value: data?.total_credits_distributed ?? 0, icon: HiOutlineCreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="clean-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{label}</span>
              <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`text-xl ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {/* Plans breakdown */}
      {data?.plans_breakdown?.length > 0 && (
        <div className="clean-card overflow-hidden">
          <div className="p-6 border-b border-border bg-slate-50">
            <h2 className="text-lg font-bold text-text-primary">Active Subscriptions Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border bg-white">
            {data.plans_breakdown.map((plan) => (
              <div key={plan.slug} className="p-8 text-center hover:bg-slate-50 transition-colors">
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">{plan.name}</p>
                <p className="text-4xl font-bold text-text-primary">{plan.total_subscriptions}</p>
                <p className="text-sm text-text-muted mt-2">Active Users</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
