
import React, { useState } from 'react';
import { Search, MapPin, Building2, Filter, Loader2, Target, Globe, Crosshair, Users } from 'lucide-react';
import { CNAE_LIST } from '../constants';
import { SearchFilters } from '../types';
import { SerperService } from '../services/serperService';

interface LeadDiscoveryProps {
  onResultsFound: (results: any[]) => void;
}

const LeadDiscovery: React.FC<LeadDiscoveryProps> = ({ onResultsFound }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    location: '',
    cnae: '',
    radius: 10,
    leadCount: 10 // Valor padrão de 10 leads
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!filters.keyword.trim() || !filters.location.trim()) {
      alert('Por favor, preencha a palavra-chave e a localização.');
      return;
    }
    
    if (filters.leadCount < 1 || filters.leadCount > 1000) {
      alert('A quantidade de leads deve estar entre 1 e 1000.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Busca usando a API do Serper
      const serperResults = await SerperService.searchPlacesWithPagination(
        filters.keyword,
        filters.location,
        filters.leadCount
      );
      
      // Converte os resultados para o formato de leads
      const leads = serperResults.map(place => 
        SerperService.convertSerperToLead(place, filters.keyword, filters.location)
      );
      
      onResultsFound(leads);
      
    } catch (error) {
      console.error('Erro na busca de leads:', error);
      alert('Ocorreu um erro ao buscar os leads. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <Crosshair size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Discovery Engine</h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">MODULE_SCANNER // ACTIVATED</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <DiscoveryInput 
            icon={<Target size={18} />} 
            label="Palavra-Chave Neural" 
            placeholder="Ex: CyberSecurity, Fintech" 
            value={filters.keyword}
            onChange={(val) => setFilters({...filters, keyword: val})}
          />
          <DiscoveryInput 
            icon={<MapPin size={18} />} 
            label="Alvo Geográfico" 
            placeholder="Cidade, Estado, Região" 
            value={filters.location}
            onChange={(val) => setFilters({...filters, location: val})}
          />
          
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Vetor de Setor</label>
            <div className="relative group/select">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors group-focus-within/select:text-cyan-400" />
              <select 
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                value={filters.cnae}
                onChange={(e) => setFilters({...filters, cnae: e.target.value})}
              >
                <option value="" className="bg-slate-900">Todos os Setores Industriais</option>
                {CNAE_LIST.map(item => (
                  <option key={item.code} value={item.code} className="bg-slate-900">{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          <DiscoveryInput 
            icon={<Users size={18} />} 
            label="Qtd. Leads" 
            placeholder="Ex: 50" 
            value={filters.leadCount.toString()}
            onChange={(val) => setFilters({...filters, leadCount: parseInt(val) || 0})}
            type="number"
            min="1"
            max="1000"
          />
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-white/10 disabled:opacity-50 group/btn overflow-hidden relative"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span className="uppercase tracking-widest text-xs">Inicializar Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const DiscoveryInput = ({ 
  icon, 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  min,
  max
}: { 
  icon: React.ReactNode; 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
  type?: string;
  min?: string;
  max?: string;
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400">
        {icon}
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default LeadDiscovery;
