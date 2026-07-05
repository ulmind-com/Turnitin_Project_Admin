import { useState, useEffect } from 'react';
import api from '../services/api';
import { HiOutlineDocumentText, HiOutlineExternalLink, HiOutlineX, HiOutlineChartPie } from 'react-icons/hi';

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
    <div className="fade-in max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Scan Logs</h1>
        <p className="text-text-secondary mt-1">Platform-wide document analysis logs</p>
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-accent-primary">
                  <HiOutlineChartPie className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary truncate max-w-sm">{selectedDoc.original_file_name}</h2>
                  <p className="text-sm text-text-secondary mt-1">Uploaded by: <span className="font-medium text-text-primary">{selectedDoc.user_email}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
                <HiOutlineX className="text-xl" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {selectedDoc.scan_result ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-border rounded-xl p-6 text-center">
                      <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Plagiarism Index</p>
                      <p className={`text-4xl font-bold ${selectedDoc.scan_result.plagiarism_score > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {selectedDoc.scan_result.plagiarism_score}%
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-border rounded-xl p-6 text-center">
                      <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">AI Content</p>
                      <p className={`text-4xl font-bold ${selectedDoc.scan_result.ai_score > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {selectedDoc.scan_result.ai_score}%
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Summary</h3>
                    <div className="p-4 bg-slate-50 border border-border rounded-lg">
                      <p className="text-sm text-text-primary leading-relaxed">{selectedDoc.scan_result.summary}</p>
                    </div>
                  </div>
                  
                  {selectedDoc.scan_result.matched_sources?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Matched Sources</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar border border-border rounded-lg bg-white divide-y divide-border">
                        {selectedDoc.scan_result.matched_sources.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <HiOutlineExternalLink className="text-accent-primary flex-shrink-0" />
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-primary hover:underline truncate">
                                {s.url}
                              </a>
                            </div>
                            <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded ml-4">{s.similarity_score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-text-secondary">
                  <p>Scan report is not available for this document yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-slate-50 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <div className="col-span-4">Document / User</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-center">Plagiarism</div>
            <div className="col-span-2 text-center">AI Pattern</div>
            <div className="col-span-1 text-center">Date</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          
          <div className="divide-y divide-border bg-white">
            {documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <HiOutlineDocumentText className="text-accent-primary flex-shrink-0 text-lg" />
                    <span className="text-sm font-bold text-text-primary truncate">{doc.original_file_name}</span>
                  </div>
                  <div className="text-xs text-text-muted truncate mt-1 pl-6">{doc.user_email}</div>
                </div>
                
                <div className="col-span-2">
                  <span className={`badge ${doc.scan_status === 'completed' ? 'badge-success' : doc.scan_status === 'processing' ? 'badge-warning' : doc.scan_status === 'failed' ? 'badge-danger' : 'badge-info'}`}>
                    {doc.scan_status}
                  </span>
                </div>
                
                <div className="col-span-2 text-center">
                  <span className={`text-sm font-bold ${doc.scan_status === 'completed' ? (doc.plagiarism_score > 30 ? 'text-red-600' : 'text-emerald-600') : 'text-slate-400'}`}>
                    {doc.scan_status === 'completed' ? `${doc.plagiarism_score}%` : '—'}
                  </span>
                </div>
                
                <div className="col-span-2 text-center">
                  <span className={`text-sm font-bold ${doc.scan_status === 'completed' ? (doc.ai_score > 30 ? 'text-amber-600' : 'text-emerald-600') : 'text-slate-400'}`}>
                    {doc.scan_status === 'completed' ? `${doc.ai_score}%` : '—'}
                  </span>
                </div>
                
                <div className="col-span-1 text-center text-xs text-text-secondary">
                  {new Date(doc.created_at).toLocaleDateString()}
                </div>
                
                <div className="col-span-1 text-right">
                  <button onClick={() => viewReport(doc.id)} className="text-sm font-semibold text-accent-primary hover:underline" disabled={doc.scan_status !== 'completed'}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {documents.length === 0 && (
            <div className="p-16 text-center text-text-secondary bg-white">
              <p className="font-medium text-lg">No logs found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
