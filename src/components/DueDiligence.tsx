import React, { useState, useEffect } from 'react';
import { FolderKanban, Upload, FileText, CheckCircle2, AlertCircle, Clock, Search, Database, Shield, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { generateDueDiligenceReport } from '../services/geminiService';

interface ReportData {
  financials: { title: string; description: string; status: 'success' | 'warning' | 'error' };
  legal: { title: string; description: string; status: 'success' | 'warning' | 'error' };
  market: { title: string; description: string; status: 'success' | 'warning' | 'error' };
}

export function DueDiligence() {
  const [activeProject, setActiveProject] = useState('Project Phoenix (Safaricom)');
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: 'Safaricom_Financials_2025.xlsx', type: 'Financials', date: 'Oct 20, 2025', status: 'Analyzed' },
    { name: 'Safaricom_PitchDeck_v3.pdf', type: 'Pitch Deck', date: 'Oct 19, 2025', status: 'Analyzed' },
    { name: 'Safaricom_IP_Schedule.pdf', type: 'Legal', date: 'Oct 18, 2025', status: 'Flagged' },
    { name: 'CapTable_Current.csv', type: 'Cap Table', date: 'Oct 18, 2025', status: 'Analyzed' }
  ]);

  const fetchReport = async (projectName: string) => {
    setIsLoading(true);
    const data = await generateDueDiligenceReport(projectName);
    setReport(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReport(activeProject);
  }, [activeProject]);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-[#FFFFFF] shrink-0 mt-0.5" />;
      case 'error': return <Shield className="w-5 h-5 text-[#FF3B3B] shrink-0 mt-0.5" />;
      default: return <Clock className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload delay
    setTimeout(() => {
      const newDoc = {
        name: file.name,
        type: file.name.includes('pdf') ? 'Legal / Pitch Deck' : 'Financials',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Analyzing'
      };
      
      setUploadedDocs(prev => [newDoc, ...prev]);
      setIsUploading(false);
      
      // Trigger AI analysis after upload
      fetchReport(activeProject + ' with new document: ' + file.name);
      
      // Update document status after analysis
      setTimeout(() => {
        setUploadedDocs(prev => prev.map(doc => 
          doc.name === file.name ? { ...doc, status: 'Analyzed' } : doc
        ));
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 inset-x-0 h-1 bg-[#00C896]" />
      
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00C896]/20 flex items-center justify-center border border-white/10">
            <FolderKanban className="w-6 h-6 text-[#00C896]" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-xl">Due Diligence Data Room</h2>
            <p className="text-sm text-zinc-400 mt-1">Upload and analyze startup documents against market signals.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <label className="px-4 py-2 bg-[#00C896] hover:bg-[#00C896]/80 text-black rounded-xl text-sm font-bold transition-colors shadow-[0_0_15px_rgba(0,200,150,0.3)] flex items-center gap-2 cursor-pointer">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload Documents'}
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
            />
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {/* Active Data Rooms */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-400" />
            Active Data Rooms
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { name: 'Project Phoenix (Safaricom)', status: 'Analyzing', docs: 12, progress: 65, color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/10' },
              { name: 'MTN Group Seed Round', status: 'Complete', docs: 8, progress: 100, color: 'text-[#00C896]', bg: 'bg-[#00C896]/10' }
            ].map((room, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveProject(room.name)}
                className={`p-5 rounded-2xl bg-white/5 border ${activeProject === room.name ? 'border-[#00C896]/50' : 'border-white/10'} hover:bg-white/10 transition-colors cursor-pointer group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-[#00C896] transition-colors">{room.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{room.docs} documents uploaded</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    room.status === 'Complete' ? 'bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20' : 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20'
                  }`}>
                    {room.status}
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${room.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${room.status === 'Complete' ? 'bg-[#00C896]' : 'bg-[#0066FF]'} relative`}
                  >
                    {room.status !== 'Complete' && <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Results */}
        <div className="p-6 rounded-2xl bg-[#00C896]/5 border border-white/10 relative overflow-hidden">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <Search className="w-4 h-4 text-[#00C896]" />
            AI Analysis: {activeProject}
          </h3>
          <div className="space-y-4 relative z-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#00C896]" />
                <p>Running deep AI analysis on {activeProject} documents...</p>
              </div>
            ) : report ? (
              <>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-start gap-3">
                  {renderStatusIcon(report.financials.status)}
                  <div>
                    <h4 className="text-sm font-bold text-white">{report.financials.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{report.financials.description}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-start gap-3">
                  {renderStatusIcon(report.legal.status)}
                  <div>
                    <h4 className="text-sm font-bold text-white">{report.legal.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{report.legal.description}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-start gap-3">
                  {renderStatusIcon(report.market.status)}
                  <div>
                    <h4 className="text-sm font-bold text-white">{report.market.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{report.market.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                <p>Failed to load analysis. Please try again.</p>
              </div>
            )}
          </div>
        </div>

        {/* Document List */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            Uploaded Documents ({activeProject})
          </h3>
          <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Document Name</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Upload Date</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {uploadedDocs.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-zinc-500 group-hover:text-[#00C896] transition-colors" />
                        <span className="text-sm font-medium text-white group-hover:text-[#00C896] transition-colors">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{doc.type}</td>
                    <td className="p-4 text-sm text-zinc-500">{doc.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        doc.status === 'Analyzed' ? 'bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20' :
                        doc.status === 'Analyzing' ? 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20 animate-pulse' :
                        'bg-[#FFFFFF]/10 text-[#FFFFFF] border-[#FFFFFF]/20'
                      }`}>
                        {doc.status === 'Analyzing' && <Loader2 className="w-3 h-3 mr-1 animate-spin inline" />}
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
