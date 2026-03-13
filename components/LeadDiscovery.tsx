
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Target, Zap, ChevronDown } from 'lucide-react';
import { BR_STATES, BR_CITIES } from '../constants';
import { SearchFilters } from '../types';
import { SerperService } from '../services/serperService';

interface LeadDiscoveryProps {
  onResultsFound: (results: any[]) => void;
}

type DiscoveryTab = 'neural' | 'cnpj' | 'individual' | 'excel';

const LeadDiscovery: React.FC<LeadDiscoveryProps> = ({ onResultsFound }) => {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('neural');
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    location: '',
    state: '',
    city: '',
    cnae: '',
    radius: 10,
    leadCount: 50
  });
  const [loading, setLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (filters.state) {
      setAvailableCities(BR_CITIES[filters.state] || []);
      setFilters(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [filters.state]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const locationStr = filters.city ? `${filters.city}, ${filters.state}` : filters.state;
    
    if (!filters.keyword.trim() || !locationStr) {
      alert('Por favor, preencha o nicho e a localização.');
      return;
    }
    
    setLoading(true);
    
    try {
      const serperResults = await SerperService.searchPlacesWithPagination(
        filters.keyword,
        locationStr,
        filters.leadCount
      );
      
      const leads = serperResults.map(place => 
        SerperService.convertSerperToLead(place, filters.keyword, locationStr)
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
    <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-xl relative overflow-hidden">
      {/* Search Engine Selection Tabs */}
      <div className="mb-10 overflow-x-auto custom-scrollbar pb-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">SELECIONE O MOTOR DE BUSCA</label>
        <div className="flex gap-4">
          <TabButton 
            active={activeTab === 'neural'} 
            onClick={() => setActiveTab('neural')}
            label="NEURAL DISCOVERY"
          />
          <TabButton 
            active={activeTab === 'cnpj'} 
            onClick={() => setActiveTab('cnpj')}
            label="CNPJ EM MASSA"
          />
          <TabButton 
            active={activeTab === 'individual'} 
            onClick={() => setActiveTab('individual')}
            label="ENRIQUECER INDIVIDUAL"
          />
          <TabButton 
            active={activeTab === 'excel'} 
            onClick={() => setActiveTab('excel')}
            label="IMPORTAR EXCEL"
          />
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Row 1, Col 1: Nicho */}
          <DiscoveryInput 
            icon={<Search size={20} className="text-gray-400" />} 
            label="NICHO OU ATIVIDADE" 
            placeholder="Ex: Academias, Restaurantes..." 
            value={filters.keyword}
            onChange={(val) => setFilters({...filters, keyword: val})}
          />

          {/* Row 1, Col 2: Estado */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">ESTADO (UF)</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                className="w-full pl-14 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all appearance-none cursor-pointer hover:bg-gray-100"
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
              >
                <option value="">Selecione o Estado</option>
                {BR_STATES.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Row 2, Col 1: Cidade */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">CIDADE</label>
            <div className="relative">
              <select 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all appearance-none cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                disabled={!filters.state}
              >
                <option value="">
                  {filters.state ? "Selecione a cidade" : "Selecione o Estado primeiro"}
                </option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Row 2, Col 2: Qtd Leads */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">QTD. LEADS ALMEJADA</label>
            <div className="relative">
              <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="number"
                min="10"
                max="1000"
                className="w-full pl-14 pr-20 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm font-bold focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                value={filters.leadCount}
                onChange={(e) => setFilters({...filters, leadCount: parseInt(e.target.value) || 0})}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 tracking-widest">LEADS</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-orange-500/20"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Zap className="w-6 h-6 fill-current" />
              <span className="uppercase tracking-[0.15em] text-sm text-white">Iniciar Neural Extraction</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${
      active 
        ? 'bg-orange-500 text-white' 
        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const DiscoveryInput = ({ 
  icon, 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text"
}: { 
  icon: React.ReactNode; 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
  type?: string;
}) => (
  <div className="space-y-3">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors">
        {icon}
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default LeadDiscovery;
