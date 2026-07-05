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
      toast.success('Payment approved! Credits provisioned.');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/admin/payments/${id}/reject`, { admin_note: rejectNote });
      toast.success('Payment rejected');
      setRejectingId(null);
      setRejectNote('');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Rejection failed');
    }
  };

  return (
    <div className="fade-in max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Payment Queue</h1>
          <p className="text-text-secondary mt-1">Review and approve pending payment requests</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-white text-accent-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white p-4 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
              <h3 className="font-bold text-text-primary">Payment Screenshot</h3>
              <button onClick={() => setPreviewUrl(null)} className="text-text-muted hover:text-text-primary">
                <HiOutlineX className="text-2xl" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 rounded-lg p-2 flex justify-center items-center">
              <img src={previewUrl} alt="Payment Screenshot" className="max-w-full max-h-[70vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : payments.length > 0 ? (
        <div className="clean-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-slate-50 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <div className="col-span-3">User</div>
            <div className="col-span-3">Plan Details</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-border bg-white">
            {payments.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                {/* User */}
                <div className="col-span-3 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{p.user_name}</p>
                  <p className="text-xs text-text-muted truncate mt-1">{p.user_email}</p>
                  <p className="text-xs text-text-muted mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                
                {/* Plan Details */}
                <div className="col-span-3 text-sm space-y-1">
                  <p className="text-text-secondary">Plan: <span className="font-semibold text-text-primary">{p.plan_name}</span></p>
                  <p className="text-text-secondary">Credits: <span className="font-semibold text-accent-primary">{p.plan_credits}</span></p>
                  <p className="text-xs text-text-muted truncate mt-1 font-mono">TXN: {p.transaction_id}</p>
                </div>
                
                {/* Status */}
                <div className="col-span-2">
                  <span className={`badge ${p.status === 'pending' ? 'badge-warning' : p.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                    {p.status}
                  </span>
                  {p.admin_note && (
                    <div className="mt-2 text-xs text-red-600 flex items-start gap-1 bg-red-50 p-1 rounded">
                      <HiOutlineExclamationCircle className="flex-shrink-0 mt-0.5" />
                      <span className="truncate" title={p.admin_note}>{p.admin_note}</span>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="col-span-4 flex flex-wrap items-center justify-end gap-2">
                  <button onClick={() => setPreviewUrl(p.screenshot_url)} className="btn-secondary !py-1 !px-2 flex items-center gap-1 text-sm" title="View Screenshot">
                    <HiOutlinePhotograph /> Proof
                  </button>

                  {p.status === 'pending' && (
                    <>
                      {rejectingId === p.id ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                          <input 
                            value={rejectNote} 
                            onChange={(e) => setRejectNote(e.target.value)} 
                            className="input-field !py-1 text-sm w-40" 
                            placeholder="Reason for rejection..." 
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button onClick={() => handleReject(p.id)} className="btn-danger !py-1 !px-2 text-sm">Reject</button>
                            <button onClick={() => setRejectingId(null)} className="text-sm font-semibold text-text-muted hover:text-text-primary px-2">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(p.id)} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1 transition-colors">
                            <HiOutlineCheck /> Approve
                          </button>
                          <button onClick={() => setRejectingId(p.id)} className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1 transition-colors">
                            <HiOutlineX /> Deny
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
        <div className="clean-card p-16 text-center bg-white text-text-secondary">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
            <HiOutlinePhotograph />
          </div>
          <p className="font-semibold text-lg mb-2">No payments found</p>
          <p className="text-sm">There are currently no {filter} payment requests in the queue.</p>
        </div>
      )}
    </div>
  );
}
