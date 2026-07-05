import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineCheck, HiOutlineX, HiOutlineExternalLink, HiOutlinePhotograph } from 'react-icons/hi';

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
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Payment Verification</h1>
          <p className="text-text-secondary mt-1">Review and approve/reject payment submissions</p>
        </div>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' : 'text-text-secondary hover:bg-bg-elevated border border-transparent'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="max-w-2xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-secondary hover:text-accent-danger">
              <HiOutlineX />
            </button>
            <img src={previewUrl} alt="Payment Screenshot" className="max-w-full max-h-[80vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-text-primary">{p.user_name}</span>
                    <span className="text-xs text-text-muted">{p.user_email}</span>
                    <span className={`badge ${p.status === 'pending' ? 'badge-warning' : p.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-text-secondary">Plan: <strong className="text-accent-primary">{p.plan_name}</strong></span>
                    <span className="text-text-secondary">Credits: <strong className="text-accent-success">{p.plan_credits}</strong></span>
                    <span className="text-text-secondary">TXN: <strong className="font-mono text-text-primary">{p.transaction_id}</strong></span>
                  </div>
                  <p className="text-xs text-text-muted">{new Date(p.created_at).toLocaleString()}</p>
                  {p.admin_note && <p className="text-xs text-accent-danger mt-1">Note: {p.admin_note}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setPreviewUrl(p.screenshot_url)} className="btn-secondary flex items-center gap-2 text-sm py-2 px-3">
                    <HiOutlinePhotograph /> View Screenshot
                  </button>

                  {p.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(p.id)} className="bg-accent-success/15 text-accent-success border border-accent-success/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent-success/25 transition-all flex items-center gap-1">
                        <HiOutlineCheck /> Approve
                      </button>
                      {rejectingId === p.id ? (
                        <div className="flex items-center gap-2">
                          <input value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} className="input-field text-sm py-2" placeholder="Reason..." />
                          <button onClick={() => handleReject(p.id)} className="btn-danger text-sm py-2 px-3">Send</button>
                          <button onClick={() => setRejectingId(null)} className="text-text-muted text-sm">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setRejectingId(p.id)} className="btn-danger text-sm py-2 px-3 flex items-center gap-1">
                          <HiOutlineX /> Reject
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-text-secondary">No {filter} payments found</p>
        </div>
      )}
    </div>
  );
}
