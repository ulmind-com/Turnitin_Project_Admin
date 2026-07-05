import { useState, useEffect } from 'react';
import api from '../services/api';
import { HiOutlineDocumentText, HiOutlineExternalLink } from 'react-icons/hi';

export default function ScanLogs() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try {
      const res = await api.get('/api/admin/documents');
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (docId) => {
    try {
      const res = await api.get(`/api/admin/documents/${docId}`);
      setSelectedDoc(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Scan Logs</h1>
      <p className="text-text-secondary mb-8">View all document scans across the platform</p>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
          <div className="glass-card rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">{selectedDoc.original_file_name}</h2>
                <p className="text-xs text-text-muted">Uploaded by: {selectedDoc.user_email}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            {selectedDoc.scan_result && (
              <div className="space-y-4">
                <div className="flex gap-6">
                  <div className="glass-card p-4 rounded-xl flex-1 text-center">
                    <p className="text-xs text-text-muted uppercase mb-1">Plagiarism</p>
                    <p className={`text-2xl font-bold font-mono ${selectedDoc.scan_result.plagiarism_score > 50 ? 'text-accent-danger' : 'text-accent-success'}`}>
                      {selectedDoc.scan_result.plagiarism_score}%
                    </p>
                  </div>
                  <div className="glass-card p-4 rounded-xl flex-1 text-center">
                    <p className="text-xs text-text-muted uppercase mb-1">AI Content</p>
                    <p className={`text-2xl font-bold font-mono ${selectedDoc.scan_result.ai_score > 50 ? 'text-accent-danger' : 'text-accent-success'}`}>
                      {selectedDoc.scan_result.ai_score}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{selectedDoc.scan_result.summary}</p>
                {selectedDoc.scan_result.matched_sources?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-2">Matched Sources</h3>
                    <div className="space-y-2">
                      {selectedDoc.scan_result.matched_sources.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <HiOutlineExternalLink className="text-accent-primary flex-shrink-0" />
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline truncate">{s.url}</a>
                          <span className="font-mono text-text-muted">{s.similarity_score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 px-6 border-b border-border text-xs text-text-muted uppercase tracking-wider font-medium">
            <div className="col-span-3">Document</div>
            <div className="col-span-2">User</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-center">Plagiarism</div>
            <div className="col-span-1 text-center">AI</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 px-6 items-center hover:bg-bg-elevated/30 transition-colors">
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <HiOutlineDocumentText className="text-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-primary truncate">{doc.original_file_name}</span>
                </div>
                <div className="col-span-2 text-xs text-text-muted truncate">{doc.user_email}</div>
                <div className="col-span-2">
                  <span className={`badge ${doc.scan_status === 'completed' ? 'badge-success' : doc.scan_status === 'processing' ? 'badge-warning' : doc.scan_status === 'failed' ? 'badge-danger' : 'badge-info'}`}>
                    {doc.scan_status}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`text-sm font-mono font-bold ${doc.plagiarism_score > 50 ? 'text-accent-danger' : doc.plagiarism_score > 20 ? 'text-accent-warning' : 'text-accent-success'}`}>
                    {doc.scan_status === 'completed' ? `${doc.plagiarism_score}%` : '—'}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`text-sm font-mono font-bold ${doc.ai_score > 50 ? 'text-accent-danger' : doc.ai_score > 20 ? 'text-accent-warning' : 'text-accent-success'}`}>
                    {doc.scan_status === 'completed' ? `${doc.ai_score}%` : '—'}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-text-muted">{new Date(doc.created_at).toLocaleString()}</div>
                <div className="col-span-1 text-right">
                  <button onClick={() => viewReport(doc.id)} className="text-accent-primary hover:underline text-xs">View</button>
                </div>
              </div>
            ))}
          </div>
          {documents.length === 0 && <div className="p-12 text-center text-text-secondary">No documents found</div>}
        </div>
      )}
    </div>
  );
}
