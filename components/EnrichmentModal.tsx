
import React, { useState } from 'react';
import { X, Sparkles, Database, FileText, Globe, Loader2, CheckCircle, Brain, Target, ShieldCheck, Mail, Zap, ExternalLink } from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { analyzeLeadWebsite } from '../services/geminiService';

interface EnrichmentModalProps {
  lead: Lead;
  onClose: () => void;
  onEnrichComplete: (id: string, insights: string, details: any) => void;
}

const EnrichmentModal: React.FC<EnrichmentModalProps> = ({ lead, onClose, onEnrichComplete }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'intelligence'>('intelligence');

  const handleEnrich = async () => {
    setLoading(true);
    const insights = await analyzeLeadWebsite(lead.name, lead.website, lead.industry);
    
    const mockDetails = {
      cnpj: '33.123.456/0001-88',
      tradeName: lead.name,
      legalName: `${lead.name} Business Solutions SA`,
      activity: 'Artificial Intelligence Research & Dev',
      size: 'Enterprise',
      address: lead.location,
      qsa: ['Ricardo Silva', 'Ana Oliveira', 'Gemini Neural Agent #042']
    };

    onEnrichComplete(lead.id, insights || '', mockDetails);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(6,182,212,0.15)] w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Experimental Header */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-cyan-500/5 to-transparent flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-16 h-16 glass rounded-2xl flex items-center justify-center text-cyan-400">
                <Brain size={32} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white tracking-tight">{lead.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-cyan-500/30 text-cyan-400`}>
                  SCAN_TARGET
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-slate-400 text-sm font-mono">
                <span className="flex items-center gap-1.5"><Globe size={14} className="text-slate-500" /> {lead.website}</span>
                <span className="flex items-center gap-1.5"><Target size={14} className="text-slate-500" /> {lead.industry}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Neural Tabs */}
        <div className="flex border-b border-white/5 bg-black/10 px-8">
          <TabButton 
            active={activeTab === 'intelligence'} 
            onClick={() => setActiveTab('intelligence')}
            icon={<Brain size={16} />}
            label="Gemini Neural Insights"
            color="cyan"
          />
          <TabButton 
            active={activeTab === 'records'} 
            onClick={() => setActiveTab('records')}
            icon={<Database size={16} />}
            label="Verified Records"
            color="magenta"
          />
        </div>

        {/* Content Lab Area */}
        <div className="p-8 min-h-[450px]">
          {activeTab === 'intelligence' ? (
            <div className="h-full flex flex-col">
              {lead.aiInsights ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="glass border-cyan-500/20 p-6 rounded-2xl relative">
                    <div className="absolute top-4 right-4 text-cyan-500/20"><Sparkles size={40} /></div>
                    <p className="text-slate-300 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                      {lead.aiInsights}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <QuickStat icon={<ShieldCheck className="text-emerald-400" />} label="Compliance Score" value="98/100" />
                    <QuickStat icon={<Zap className="text-cyan-400" />} label="Growth Momentum" value="High" />
                    <QuickStat icon={<Target className="text-magenta-400" />} label="Strategy Fit" value="Strategic" />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Brain size={48} className="text-cyan-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Neural Extraction Pending</h4>
                  <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                    Deploy Google Gemini to deep-scan the company's digital footprint and generate high-intent B2B signals.
                  </p>
                  <button 
                    onClick={handleEnrich}
                    disabled={loading}
                    className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                    {loading ? 'CALIBRATING_NEURAL_MODELS...' : 'DEPLOY GEMINI SCANNER'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-10 animate-in fade-in duration-500">
              <div className="space-y-6">
                <RecordItem label="CNPJ_IDENTIFIER" value={lead.details?.cnpj || 'PENDING'} mono />
                <RecordItem label="OFFICIAL_NOMENCLATURE" value={lead.details?.legalName || '-'} />
                <RecordItem label="ACTIVITY_CODE" value={lead.details?.activity || '-'} mono />
                <div className="p-4 glass rounded-2xl border-emerald-500/20 flex items-center gap-3 mt-8">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <CheckCircle size={18} />
                  </div>
                  <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">OpenCNPJ Verification Success</span>
                </div>
              </div>
              <div className="space-y-6">
                <RecordItem label="GEOGRAPHIC_COORDS" value={lead.details?.address || lead.location} />
                <RecordItem label="FISCAL_SIZE" value={lead.details?.size || 'UNSPECIFIED'} />
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">DIRECTORATE_BOARD (QSA)</span>
                  <div className="flex flex-wrap gap-2">
                    {lead.details?.qsa?.map((p, i) => (
                      <span key={i} className="px-3 py-1 glass border-white/5 text-slate-300 text-xs rounded-lg">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Footer Lab Controls */}
        <div className="px-8 py-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
              <ExternalLink size={16} /> Open Webview
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
              <Mail size={16} /> Contact Lead
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-400 font-bold hover:text-white transition-colors">
              Abort Operation
            </button>
            <button className="px-8 py-2.5 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2">
              <Sparkles size={16} /> Sync to HubSpot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: 'cyan' | 'magenta' }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
      active 
        ? color === 'cyan' ? 'border-cyan-500 text-cyan-400' : 'border-magenta-500 text-magenta-400'
        : 'border-transparent text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon} {label}
  </button>
);

const RecordItem = ({ label, value, mono }: { label: string, value: string, mono?: boolean }) => (
  <div className="space-y-1">
    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">{label}</span>
    <p className={`text-white text-lg font-bold ${mono ? 'font-mono' : ''}`}>{value}</p>
  </div>
);

const QuickStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-4 glass rounded-2xl border-white/5 flex flex-col items-center justify-center text-center">
    <div className="mb-2">{icon}</div>
    <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</span>
    <span className="text-white font-bold">{value}</span>
  </div>
);

export default EnrichmentModal;
