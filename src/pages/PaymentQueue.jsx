import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineCheck, HiOutlineX, HiOutlinePhotograph, HiOutlineExclamationCircle } from 'react-icons/hi';

export default function PaymentQueue() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => { fetchPayments(); }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'pending' ? '/api/admin/payments/pending' : `/api/admin/payments/all?payment_status=${filter}`;
      const res = await api.get(filter === 'all' ? '/api/admin/payments/all' : endpoint);
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/admin/payments/${id}/approve`);
      toast.success('CLEARANCE GRANTED', { style: { background: '#000', color: '#00ff41', border: '1px solid #00ff41' }});
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ACTION FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/admin/payments/${id}/reject`, { admin_note: rejectNote });
      toast.success('CLEARANCE DENIED', { style: { background: '#000', color: '#f59e0b', border: '1px solid #f59e0b' }});
      setRejectingId(null);
      setRejectNote('');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ACTION FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    }
  };

  return (
    <div className="fade-in relative z-10">
      <div className="border-b border-accent-primary/20 pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-accent-primary shadow-[0_0_10px_rgba(255,0,60,1)]" />
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary uppercase tracking-widest">
            Clearance <span className="text-neon-orange glitch-hover">Queue</span>
          </h1>
          <p className="text-accent-primary font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-80">Review pending access requests</p>
        </div>
        
        <div className="flex gap-2 bg-black/50 p-1 border border-accent-primary/20" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${filter === f ? 'bg-accent-primary/20 text-neon-red' : 'text-text-muted hover:text-accent-primary hover:bg-white/5'}`}
            >
              [{f}]
            </button>
          ))}
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 border border-accent-primary/20" onClick={() => setPreviewUrl(null)}>
          <div className="max-w-2xl max-h-[80vh] relative cyber-card p-2 bg-black" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-primary shadow-[0_0_15px_rgba(255,0,60,0.8)] z-10" />
            <div className="flex justify-between items-center p-2 border-b border-accent-primary/20 mb-2">
              <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest">VISUAL PROOF.DAT</span>
              <button onClick={() => setPreviewUrl(null)} className="text-text-muted hover:text-neon-red transition-colors text-lg">
                <HiOutlineX />
              </button>
            </div>
            <img src={previewUrl} alt="Payment Screenshot" className="max-w-full max-h-[70vh] object-contain opacity-90" />
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,0,60,0.2) 1px, transparent 1px)', backgroundSize: '100% 4px' }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-10 w-full bg-accent-primary/10" />
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 cyber-card" />)}
        </div>
      ) : payments.length > 0 ? (
        <div className="cyber-card bg-black/40 overflow-hidden">
          {/* Terminal Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-accent-primary/30 bg-accent-primary/10 text-[10px] font-display font-bold text-accent-primary uppercase tracking-[0.2em]">
            <div className="col-span-3">Operative</div>
            <div className="col-span-3">Request Details</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto terminal-table-container">
            {payments.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent-primary/5 transition-colors group">
                {/* Operative */}
                <div className="col-span-3 min-w-0">
                  <p className="text-xs font-mono font-bold text-text-primary truncate group-hover:text-neon-cyan">{p.user_name}</p>
                  <p className="text-[10px] font-mono text-text-muted truncate mt-1">{p.user_email}</p>
                  <p className="text-[9px] font-mono text-accent-primary/50 uppercase tracking-widest mt-1">{new Date(p.created_at).toISOString().replace('T', ' ').substring(0, 19)}</p>
                </div>
                
                {/* Request Details */}
                <div className="col-span-3 text-[10px] font-mono uppercase tracking-widest space-y-1">
                  <p className="text-text-secondary">Req: <span className="text-neon-purple">{p.plan_name}</span></p>
                  <p className="text-text-secondary">Lvl: <span className="text-neon-green">{p.plan_credits} Scans</span></p>
                  <p className="text-text-muted truncate">TXN: {p.transaction_id}</p>
                </div>
                
                {/* Status */}
                <div className="col-span-2">
                  <span className={`cyber-badge ${p.status === 'pending' ? 'badge-orange animate-pulse' : p.status === 'approved' ? 'badge-green' : 'badge-red'}`}>
                    {p.status}
                  </span>
                  {p.admin_note && (
                    <div className="mt-2 text-[9px] font-mono text-neon-red flex items-start gap-1">
                      <HiOutlineExclamationCircle className="flex-shrink-0 mt-0.5" />
                      <span className="truncate" title={p.admin_note}>{p.admin_note}</span>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="col-span-4 flex flex-wrap items-center justify-end gap-2">
                  <button onClick={() => setPreviewUrl(p.screenshot_url)} className="btn-cyber !px-2 !py-1 flex items-center gap-1" title="View Visual Proof">
                    <HiOutlinePhotograph />
                  </button>

                  {p.status === 'pending' && (
                    <>
                      {rejectingId === p.id ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 bg-black/80 p-2 border border-accent-secondary/30" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
                          <input 
                            value={rejectNote} 
                            onChange={(e) => setRejectNote(e.target.value)} 
                            className="input-cyber !p-1 text-[10px] w-32" 
                            placeholder="Reason for denial..." 
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button onClick={() => handleReject(p.id)} className="btn-cyber !border-accent-secondary !text-accent-secondary !px-2 !py-1 hover:!bg-accent-secondary/20">EXECUTE</button>
                            <button onClick={() => setRejectingId(null)} className="text-[10px] font-mono text-text-muted hover:text-white px-2">ABORT</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(p.id)} className="btn-cyber btn-cyber-success !px-3 !py-1 flex items-center gap-1">
                            <HiOutlineCheck /> APPROVE
                          </button>
                          <button onClick={() => setRejectingId(p.id)} className="btn-cyber !border-accent-secondary !text-accent-secondary !px-3 !py-1 flex items-center gap-1 hover:!bg-accent-secondary/20 hover:shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                            <HiOutlineX /> DENY
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="cyber-card p-16 text-center bg-black/40">
          <div className="w-16 h-16 bg-accent-primary/5 border border-accent-primary/20 flex items-center justify-center mx-auto mb-4" style={{ clipPath: 'polygon(25% 0%, 100% 0, 100% 75%, 75% 100%, 0 100%, 0% 25%)' }}>
            <HiOutlineClock className="text-3xl text-accent-primary/40" />
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Queue Empty. No pending requests found.</p>
        </div>
      )}
    </div>
  );
}
