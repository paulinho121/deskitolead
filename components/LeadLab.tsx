
import React, { useState } from 'react';
import { 
  FlaskConical, Search, Filter, Mail, Phone, ExternalLink, 
  MoreHorizontal, ChevronDown, CheckCircle, Database, Sparkles,
  Zap, Globe, Download, LayoutList, Trash2
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { LeadService } from '../services/leadService';

interface LeadLabProps {
  leads: Lead[];
  onEnrich: (lead: Lead) => void;
  onDelete?: (id: string) => void;
}

const LeadLab: React.FC<LeadLabProps> = ({ leads, onEnrich, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'ALL'>('ALL');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.industry || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este lead?')) {
      const success = await LeadService.deleteLead(id);
      if (success && onDelete) {
        onDelete(id);
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Bar / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Laboratório de Amostras</h3>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">FILA_DE_ENRIQUECIMENTO // V2.5.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Buscar por nome ou nicho..."
              className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 w-72 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none text-gray-800 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          
          <div className="flex bg-gray-100 rounded-xl border border-gray-200 p-1">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === 'ALL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              TODOS
            </button>
            <button 
              onClick={() => setFilterStatus(LeadStatus.ENRICHED)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === LeadStatus.ENRICHED ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              ENRIQUECIDOS
            </button>
          </div>

          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-800 transition-all shadow-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Experimental Table */}
      <div className="flex-1 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-5">Specimen ID / Empresa</th>
                <th className="px-8 py-5">Fonte de Extração</th>
                <th className="px-8 py-5">Status do Sinal</th>
                <th className="px-8 py-5">Latência Sync</th>
                <th className="px-8 py-5 text-right">Ações de Laboratório</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors relative">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${lead.status === LeadStatus.ENRICHED ? 'bg-orange-500' : 'bg-orange-300'}`}></div>
                      <div>
                        <div className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{lead.name}</div>
                        <div className="text-xs text-gray-400 font-mono italic">CNPJ: {lead.details?.cnpj || 'PENDING_SCAN'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                        <Globe size={14} />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{lead.website.replace('https://', '').replace('http://', '')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      lead.status === LeadStatus.ENRICHED 
                        ? 'border-orange-500/30 text-orange-600 bg-orange-50' 
                        : 'border-gray-200 text-gray-400 bg-gray-50'
                    }`}>
                      {lead.status === LeadStatus.ENRICHED ? <Sparkles size={10} /> : <Zap size={10} />}
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-gray-400 font-mono">
                    {lead.lastUpdated}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEnrich(lead)}
                        className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg transition-all"
                        title="Processar Amostra"
                      >
                        <FlaskConical size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                        title="Excluir Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-800 rounded-lg transition-all">
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
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-200" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">Nenhuma Amostra Encontrada</h4>
            <p className="text-gray-400 max-w-xs text-sm">Ajuste os filtros de descoberta para iniciar a extração neural.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadLab;
