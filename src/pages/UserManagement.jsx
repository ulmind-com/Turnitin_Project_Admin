import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineBan, HiOutlineCheckCircle, HiOutlineLightningBolt } from 'react-icons/hi';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [plans, setPlans] = useState([]);
  const [editingCredits, setEditingCredits] = useState(null);
  const [creditValue, setCreditValue] = useState(0);
  const [assigningPlan, setAssigningPlan] = useState(null);

  useEffect(() => { fetchUsers(); fetchPlans(); }, []);

  const fetchUsers = async (searchTerm = '') => {
    setLoading(true);
    try {
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const res = await api.get(`/api/admin/users${params}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/api/plans');
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleEditCredits = async (userId) => {
    try {
      await api.put(`/api/admin/users/${userId}/credits`, { credits: creditValue });
      toast.success('Credits updated successfully');
      setEditingCredits(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update credits');
    }
  };

  const handleAssignPlan = async (userId, planId) => {
    try {
      await api.put(`/api/admin/users/${userId}/plan`, { plan_id: planId });
      toast.success('Plan assigned successfully');
      setAssigningPlan(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to assign plan');
    }
  };

  const handleSuspend = async (userId, suspend) => {
    try {
      await api.put(`/api/admin/users/${userId}/suspend`, { suspended: suspend });
      toast.success(suspend ? 'User suspended' : 'User access restored');
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change status');
    }
  };

  return (
    <div className="fade-in max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-1">Manage accounts, credits, and active plans</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="input-field pl-10 md:w-72" 
              placeholder="Search by name or email..." 
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-4 px-6 border-b border-border bg-slate-50 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <div className="col-span-3">User Details</div>
            <div className="col-span-2">Account Status</div>
            <div className="col-span-2">Active Plan</div>
            <div className="col-span-1 text-center">Credits</div>
            <div className="col-span-1 text-center">Scans</div>
            <div className="col-span-3 text-right">Manage</div>
          </div>

          <div className="divide-y divide-border bg-white">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-4 px-6 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-3 min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                  <p className="text-xs text-text-muted truncate mt-1">{user.email}</p>
                </div>

                <div className="col-span-2">
                  <span className={`badge ${user.account_status === 'active' ? 'badge-success' : user.account_status === 'suspended' ? 'badge-danger' : 'badge-warning'}`}>
                    {user.account_status}
                  </span>
                </div>

                <div className="col-span-2 relative">
                  {assigningPlan === user.id ? (
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 bg-white border border-border rounded-lg shadow-lg p-2 z-20 w-48">
                      <p className="text-xs font-semibold text-text-secondary mb-2 border-b border-border pb-1">Select Plan</p>
                      {plans.map((plan) => (
                        <button key={plan.id} onClick={() => handleAssignPlan(user.id, plan.id)}
                          className="block w-full text-left text-sm px-2 py-1.5 hover:bg-slate-100 text-text-primary rounded transition-colors">
                          {plan.name} <span className="text-text-muted text-xs">({plan.credits})</span>
                        </button>
                      ))}
                      <button onClick={() => setAssigningPlan(null)} className="text-xs font-medium text-red-500 hover:text-red-700 mt-2 px-2 w-full text-left">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-text-secondary truncate">
                      {user.active_plan?.name || 'No Active Plan'}
                    </p>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  {editingCredits === user.id ? (
                    <div className="flex flex-col items-center gap-1">
                      <input type="number" value={creditValue} onChange={(e) => setCreditValue(parseInt(e.target.value) || 0)}
                        className="input-field text-center !py-1 !px-2 text-sm w-16" min={0} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={() => handleEditCredits(user.id)} className="text-emerald-600 hover:text-emerald-700 text-lg"><HiOutlineCheckCircle /></button>
                        <button onClick={() => setEditingCredits(null)} className="text-slate-400 hover:text-slate-600 text-lg"><HiOutlineBan /></button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-accent-primary">{user.credits}</span>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  <span className="text-sm font-medium text-text-secondary">{user.total_scans}</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button onClick={() => { setEditingCredits(user.id); setCreditValue(user.credits); }} className="p-2 text-slate-400 hover:text-accent-primary hover:bg-blue-50 rounded-lg transition-colors" title="Edit Credits">
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button onClick={() => setAssigningPlan(user.id)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Assign Plan">
                    <HiOutlineLightningBolt className="text-lg" />
                  </button>
                  {user.account_status === 'active' ? (
                    <button onClick={() => handleSuspend(user.id, true)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend User">
                      <HiOutlineBan className="text-lg" />
                    </button>
                  ) : (
                    <button onClick={() => handleSuspend(user.id, false)} className="p-2 text-red-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Restore User">
                      <HiOutlineCheckCircle className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="p-16 text-center text-text-secondary bg-white">
              <p className="font-medium text-lg">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
