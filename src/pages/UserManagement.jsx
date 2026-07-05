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
      toast.success('Credits updated');
      setEditingCredits(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed');
    }
  };

  const handleAssignPlan = async (userId, planId) => {
    try {
      await api.put(`/api/admin/users/${userId}/plan`, { plan_id: planId });
      toast.success('Plan assigned & credits added');
      setAssigningPlan(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed');
    }
  };

  const handleSuspend = async (userId, suspend) => {
    try {
      await api.put(`/api/admin/users/${userId}/suspend`, { suspended: suspend });
      toast.success(suspend ? 'User suspended' : 'User unsuspended');
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-1">Manage users, credits, plans, and account status</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-64" placeholder="Search by name or email..." />
          </div>
          <button type="submit" className="btn-secondary">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-4 px-6 border-b border-border text-xs text-text-muted uppercase tracking-wider font-medium">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-1 text-center">Credits</div>
            <div className="col-span-1 text-center">Scans</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-4 px-6 items-center hover:bg-bg-elevated/30 transition-colors">
                <div className="col-span-3">
                  <p className="text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>

                <div className="col-span-2">
                  <span className={`badge ${user.account_status === 'active' ? 'badge-success' : user.account_status === 'suspended' ? 'badge-danger' : 'badge-warning'}`}>
                    {user.account_status}
                  </span>
                </div>

                <div className="col-span-2">
                  {assigningPlan === user.id ? (
                    <div className="space-y-1">
                      {plans.map((plan) => (
                        <button key={plan.id} onClick={() => handleAssignPlan(user.id, plan.id)}
                          className="block w-full text-left text-xs px-2 py-1 rounded-lg hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary transition-colors">
                          {plan.name} ({plan.credits} cr)
                        </button>
                      ))}
                      <button onClick={() => setAssigningPlan(null)} className="text-xs text-text-muted">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">{user.active_plan?.name || 'No Plan'}</p>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  {editingCredits === user.id ? (
                    <div className="flex items-center gap-1">
                      <input type="number" value={creditValue} onChange={(e) => setCreditValue(parseInt(e.target.value) || 0)}
                        className="input-field text-center text-sm py-1 w-16" min={0} />
                      <button onClick={() => handleEditCredits(user.id)} className="text-accent-success text-lg"><HiOutlineCheckCircle /></button>
                    </div>
                  ) : (
                    <span className="text-sm font-mono font-bold text-accent-primary">{user.credits}</span>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  <span className="text-sm font-mono text-text-secondary">{user.total_scans}</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button onClick={() => { setEditingCredits(user.id); setCreditValue(user.credits); }} className="text-text-muted hover:text-accent-primary transition-colors" title="Edit Credits">
                    <HiOutlinePencil />
                  </button>
                  <button onClick={() => setAssigningPlan(user.id)} className="text-text-muted hover:text-accent-secondary transition-colors" title="Assign Plan">
                    <HiOutlineLightningBolt />
                  </button>
                  {user.account_status === 'active' ? (
                    <button onClick={() => handleSuspend(user.id, true)} className="text-text-muted hover:text-accent-danger transition-colors" title="Suspend">
                      <HiOutlineBan />
                    </button>
                  ) : (
                    <button onClick={() => handleSuspend(user.id, false)} className="text-text-muted hover:text-accent-success transition-colors" title="Unsuspend">
                      <HiOutlineCheckCircle />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="p-12 text-center text-text-secondary">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
