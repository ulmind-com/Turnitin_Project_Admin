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
    <div className="fade-in relative z-10">
      <div className="border-b border-accent-primary/20 pb-4 mb-8 relative">
        <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-accent-primary shadow-[0_0_10px_rgba(255,0,60,1)]" />
        <h1 className="text-3xl font-display font-bold text-text-primary uppercase tracking-widest">
          Global Data <span className="text-neon-orange glitch-hover">Logs</span>
        </h1>
        <p className="text-accent-primary font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-80">Platform-wide scan telemetry</p>
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 border border-accent-primary/20" onClick={() => setSelectedDoc(null)}>
          <div className="cyber-card p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-black relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-primary shadow-[0_0_15px_rgba(255,0,60,0.8)] z-10" />
            
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-accent-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-primary/10 border border-accent-primary flex items-center justify-center" style={{ clipPath: 'polygon(25% 0%, 100% 0, 100% 75%, 75% 100%, 0 100%, 0% 25%)' }}>
                  <HiOutlineChartPie className="text-2xl text-neon-red" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-neon-orange uppercase tracking-widest truncate max-w-sm">{selectedDoc.original_file_name}</h2>
                  <p className="text-[10px] font-mono text-text-muted mt-1 uppercase tracking-widest">Operative: {selectedDoc.user_email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-text-muted hover:text-neon-red transition-colors text-2xl">
                <HiOutlineX />
              </button>
            </div>
            
            {selectedDoc.scan_result && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/50 border border-accent-primary/30 p-6 relative group overflow-hidden" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary" />
                    <p className="text-[10px] font-display font-bold text-accent-primary uppercase tracking-[0.2em] mb-2">Plagiarism Index</p>
                    <p className={`text-4xl font-bold font-mono tracking-wider ${selectedDoc.scan_result.plagiarism_score > 50 ? 'text-neon-red drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]' : 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]'}`}>
                      {selectedDoc.scan_result.plagiarism_score}%
                    </p>
                  </div>
                  <div className="bg-black/50 border border-accent-secondary/30 p-6 relative group overflow-hidden" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-secondary" />
                    <p className="text-[10px] font-display font-bold text-accent-secondary uppercase tracking-[0.2em] mb-2">AI Probability</p>
                    <p className={`text-4xl font-bold font-mono tracking-wider ${selectedDoc.scan_result.ai_score > 50 ? 'text-neon-red drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]' : 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]'}`}>
                      {selectedDoc.scan_result.ai_score}%
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-accent-primary/5 border border-accent-primary/20">
                  <p className="text-xs font-mono text-text-primary leading-relaxed">{selectedDoc.scan_result.summary}</p>
                </div>
                
                {selectedDoc.scan_result.matched_sources?.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-display font-bold text-accent-primary uppercase tracking-[0.2em] mb-3">Matched Vectors</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {selectedDoc.scan_result.matched_sources.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-black/60 border border-white/5 hover:border-accent-primary/30 transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <HiOutlineExternalLink className="text-accent-primary/50 group-hover:text-neon-cyan flex-shrink-0" />
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-text-secondary group-hover:text-white truncate transition-colors">
                              {s.url}
                            </a>
                          </div>
                          <span className="font-mono text-[10px] font-bold text-neon-red ml-4">{s.similarity_score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,0,60,0.2) 1px, transparent 1px)', backgroundSize: '100% 4px' }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-10 w-full bg-accent-primary/10" />
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 cyber-card" />)}
        </div>
      ) : (
        <div className="cyber-card bg-black/40 overflow-hidden relative">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-accent-primary/30 bg-accent-primary/10 text-[10px] text-accent-primary uppercase tracking-[0.2em] font-display font-bold">
            <div className="col-span-3">Target / Operative</div>
            <div className="col-span-2">System Status</div>
            <div className="col-span-2 text-center">Plagiarism</div>
            <div className="col-span-2 text-center">AI Pattern</div>
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          
          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto terminal-table-container">
            {documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent-primary/5 transition-colors group relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-accent-primary opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(255,0,60,1)] transition-opacity" />
                
                <div className="col-span-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <HiOutlineDocumentText className="text-accent-primary/50 group-hover:text-neon-cyan flex-shrink-0" />
                    <span className="text-xs font-mono font-bold text-text-primary group-hover:text-white truncate">{doc.original_file_name}</span>
                  </div>
                  <div className="text-[9px] font-mono text-text-muted truncate mt-1 pl-6 uppercase tracking-wider">{doc.user_email}</div>
                </div>
                
                <div className="col-span-2">
                  <span className={`cyber-badge ${doc.scan_status === 'completed' ? 'badge-green' : doc.scan_status === 'processing' ? 'badge-warning animate-pulse' : doc.scan_status === 'failed' ? 'badge-red' : 'badge-cyan'}`}>
                    {doc.scan_status}
                  </span>
                </div>
                
                <div className="col-span-2 text-center">
                  <span className={`text-xs font-mono font-bold tracking-widest ${doc.plagiarism_score > 50 ? 'text-neon-red' : doc.plagiarism_score > 20 ? 'text-accent-warning' : 'text-neon-green'}`}>
                    {doc.scan_status === 'completed' ? `${doc.plagiarism_score}%` : '—'}
                  </span>
                </div>
                
                <div className="col-span-2 text-center">
                  <span className={`text-xs font-mono font-bold tracking-widest ${doc.ai_score > 50 ? 'text-neon-red' : doc.ai_score > 20 ? 'text-accent-warning' : 'text-neon-green'}`}>
                    {doc.scan_status === 'completed' ? `${doc.ai_score}%` : '—'}
                  </span>
                </div>
                
                <div className="col-span-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">{new Date(doc.created_at).toISOString().split('T')[0]}</div>
                
                <div className="col-span-1 text-right">
                  <button onClick={() => viewReport(doc.id)} className="text-[10px] font-display font-bold text-accent-primary hover:text-neon-cyan hover:underline uppercase tracking-[0.2em] transition-colors">
                    [VIEW]
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {documents.length === 0 && (
            <div className="p-16 text-center text-text-secondary bg-black/50">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-primary/50">System Logs Empty.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
