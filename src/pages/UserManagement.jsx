import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineBan, HiOutlineCheckCircle, HiOutlineLightningBolt, HiOutlineShieldExclamation } from 'react-icons/hi';

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
      toast.success('CREDIT ALLOCATION UPDATED', { style: { background: '#000', color: '#00ff41', border: '1px solid #00ff41' }});
      setEditingCredits(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ALLOCATION FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    }
  };

  const handleAssignPlan = async (userId, planId) => {
    try {
      await api.put(`/api/admin/users/${userId}/plan`, { plan_id: planId });
      toast.success('CLEARANCE PROTOCOL ASSIGNED', { style: { background: '#000', color: '#00ff41', border: '1px solid #00ff41' }});
      setAssigningPlan(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ASSIGNMENT FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    }
  };

  const handleSuspend = async (userId, suspend) => {
    try {
      await api.put(`/api/admin/users/${userId}/suspend`, { suspended: suspend });
      toast.success(suspend ? 'OPERATIVE SUSPENDED' : 'OPERATIVE REINSTATED', { style: { background: '#000', color: suspend ? '#ff003c' : '#00ff41', border: `1px solid ${suspend ? '#ff003c' : '#00ff41'}` }});
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ACTION FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    }
  };

  return (
    <div className="fade-in relative z-10">
      <div className="border-b border-accent-primary/20 pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
        <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-accent-primary shadow-[0_0_10px_rgba(255,0,60,1)]" />
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary uppercase tracking-widest">
            Operative <span className="text-neon-red glitch-hover">Registry</span>
          </h1>
          <p className="text-accent-primary font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-80">Manage personnel clearance & allocations</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-primary/50" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="input-cyber pl-9 w-64" 
              placeholder="QUERY REGISTRY..." 
            />
          </div>
          <button type="submit" className="btn-cyber !px-4">EXECUTE</button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 cyber-card" />)}
        </div>
      ) : (
        <div className="cyber-card bg-black/40 overflow-hidden relative">
          {/* Terminal Table header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-accent-primary/30 bg-accent-primary/10 text-[10px] text-accent-primary uppercase tracking-[0.2em] font-display font-bold">
            <div className="col-span-3">Operative ID</div>
            <div className="col-span-2">System Status</div>
            <div className="col-span-2">Clearance Level</div>
            <div className="col-span-1 text-center">Credits</div>
            <div className="col-span-1 text-center">Data Scans</div>
            <div className="col-span-3 text-right">Overrides</div>
          </div>

          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto terminal-table-container">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent-primary/5 transition-colors group relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-accent-primary opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(255,0,60,1)] transition-opacity" />
                
                <div className="col-span-3 min-w-0">
                  <p className="text-xs font-mono font-bold text-text-primary group-hover:text-neon-cyan truncate">{user.name}</p>
                  <p className="text-[10px] font-mono text-text-muted truncate mt-1">{user.email}</p>
                </div>

                <div className="col-span-2">
                  <span className={`cyber-badge ${user.account_status === 'active' ? 'badge-green' : user.account_status === 'suspended' ? 'badge-red animate-pulse' : 'badge-orange'}`}>
                    {user.account_status}
                  </span>
                </div>

                <div className="col-span-2 relative">
                  {assigningPlan === user.id ? (
                    <div className="absolute top-0 left-0 w-48 bg-black border border-accent-secondary/50 p-2 z-20" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
                      <p className="text-[9px] font-mono text-accent-secondary uppercase tracking-widest mb-2 border-b border-accent-secondary/20 pb-1">Select Protocol</p>
                      {plans.map((plan) => (
                        <button key={plan.id} onClick={() => handleAssignPlan(user.id, plan.id)}
                          className="block w-full text-left text-[10px] font-mono px-2 py-1.5 hover:bg-accent-secondary/20 text-text-secondary hover:text-neon-purple transition-colors uppercase">
                          &gt; {plan.name} <span className="text-text-muted opacity-50">({plan.credits} CR)</span>
                        </button>
                      ))}
                      <button onClick={() => setAssigningPlan(null)} className="text-[9px] font-mono text-text-muted hover:text-white mt-2 px-2">ABORT</button>
                    </div>
                  ) : (
                    <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest truncate">{user.active_plan?.name || 'NO CLEARANCE'}</p>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  {editingCredits === user.id ? (
                    <div className="flex flex-col items-center gap-1">
                      <input type="number" value={creditValue} onChange={(e) => setCreditValue(parseInt(e.target.value) || 0)}
                        className="input-cyber text-center !p-1 text-[10px] w-12" min={0} autoFocus />
                      <div className="flex gap-1">
                        <button onClick={() => handleEditCredits(user.id)} className="text-neon-green text-sm hover:text-white"><HiOutlineCheckCircle /></button>
                        <button onClick={() => setEditingCredits(null)} className="text-text-muted text-xs hover:text-white"><HiOutlineBan /></button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-accent-primary">{user.credits}</span>
                  )}
                </div>

                <div className="col-span-1 text-center">
                  <span className="text-xs font-mono text-text-secondary">{user.total_scans}</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-3">
                  <button onClick={() => { setEditingCredits(user.id); setCreditValue(user.credits); }} className="text-text-muted hover:text-neon-cyan transition-colors" title="Modify Allocation">
                    <HiOutlinePencil />
                  </button>
                  <button onClick={() => setAssigningPlan(user.id)} className="text-text-muted hover:text-neon-purple transition-colors" title="Force Protocol Assignment">
                    <HiOutlineLightningBolt />
                  </button>
                  {user.account_status === 'active' ? (
                    <button onClick={() => handleSuspend(user.id, true)} className="text-text-muted hover:text-neon-red transition-colors" title="REVOKE ACCESS">
                      <HiOutlineShieldExclamation />
                    </button>
                  ) : (
                    <button onClick={() => handleSuspend(user.id, false)} className="text-neon-red hover:text-neon-green transition-colors" title="RESTORE ACCESS">
                      <HiOutlineCheckCircle />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="p-16 text-center text-text-secondary bg-black/50">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-primary/50">No operatives found matching query.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
