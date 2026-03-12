
import React, { useState } from 'react';
import { 
  FlaskConical, Search, Filter, Mail, Phone, ExternalLink, 
  MoreHorizontal, ChevronDown, CheckCircle, Database, Sparkles,
  Zap, Globe, Download, LayoutList
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';

interface LeadLabProps {
  leads: Lead[];
  onEnrich: (lead: Lead) => void;
}

const LeadLab: React.FC<LeadLabProps> = ({ leads, onEnrich }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'ALL'>('ALL');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Bar / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-400">
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Lead Specimen Lab</h3>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">ENRICHMENT_QUEUE // v2.5.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search by name or industry..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 w-72 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === 'ALL' ? 'bg-cyan-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              ALL
            </button>
            <button 
              onClick={() => setFilterStatus(LeadStatus.ENRICHED)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === LeadStatus.ENRICHED ? 'bg-magenta-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]' : 'text-slate-400 hover:text-white'}`}
            >
              ENRICHED
            </button>
          </div>

          <button className="p-2.5 glass rounded-xl text-slate-400 hover:text-white transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Experimental Table */}
      <div className="flex-1 glass rounded-3xl overflow-hidden border border-white/5 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-5">Specimen ID / Company</th>
                <th className="px-8 py-5">Extraction Source</th>
                <th className="px-8 py-5">Signal Status</th>
                <th className="px-8 py-5">Sync Latency</th>
                <th className="px-8 py-5 text-right">Laboratory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-white/[0.03] transition-colors relative">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${lead.status === LeadStatus.ENRICHED ? 'bg-magenta-500' : 'bg-cyan-500'} shadow-[0_0_8px_currentColor]`}></div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{lead.name}</div>
                        <div className="text-xs text-slate-500 font-mono">CNPJ: {lead.details?.cnpj || 'PENDING_SCAN'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                        <Globe size={14} />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">{lead.website.replace('https://', '')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      lead.status === LeadStatus.ENRICHED 
                        ? 'border-magenta-500/30 text-magenta-400 bg-magenta-500/5' 
                        : 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'
                    }`}>
                      {lead.status === LeadStatus.ENRICHED ? <Sparkles size={10} /> : <Zap size={10} />}
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-mono">
                    {lead.lastUpdated}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEnrich(lead)}
                        className="p-2 glass text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 rounded-lg transition-all"
                        title="Process Sample"
                      >
                        <FlaskConical size={16} />
                      </button>
                      <button className="p-2 glass text-slate-400 hover:text-white rounded-lg transition-all">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 glass text-slate-400 hover:text-white rounded-lg transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLeads.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Search className="w-12 h-12 text-slate-600 mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">No Specimen Found</h4>
            <p className="text-slate-500 max-w-xs text-sm">Adjustment to the discovery filters required for neural matching.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadLab;
