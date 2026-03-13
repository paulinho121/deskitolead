
import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, Database, Settings, 
  HelpCircle, LogOut, Bell, Menu, X, Sparkles, 
  ChevronRight, BrainCircuit, Activity, Globe, Map
} from 'lucide-react';
import LeadDiscovery from './components/LeadDiscovery';
import BentoDashboard from './components/BentoDashboard';
import LeadLab from './components/LeadLab';
import EnrichmentModal from './components/EnrichmentModal';
import SettingsPage from './components/SettingsPage';
import { Lead, LeadStatus } from './types';
import { LeadService } from './services/leadService';
import { useEffect } from 'react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discovery' | 'lab' | 'settings'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const data = await LeadService.getAllLeads();
      setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const handleAddLeads = async (newLeads: any[]) => {
    const formatted: Lead[] = newLeads.map(l => ({
      ...l,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: l.status || 'NEW'
    }));
    
    setLeads(prev => [...formatted, ...prev]);
    await LeadService.saveLeads(formatted);
    setActiveTab('lab');
  };

  const handleEnrichComplete = async (id: string, insights: string, details: any) => {
    setLeads(prev => prev.map(l => 
      l.id === id ? { ...l, status: LeadStatus.ENRICHED, aiInsights: insights, details } : l
    ));
    
    await LeadService.updateLeadStatus(id, LeadStatus.ENRICHED, insights, details);
    
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: LeadStatus.ENRICHED, aiInsights: insights, details } : null);
    }
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Immersive Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-500 bg-white border-r border-gray-200 flex flex-col z-50
      `}>
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-10 h-10 liquid-gradient rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ring-1 ring-orange-200">
              L
            </div>
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight text-gray-800">
              LeadFlow Pro
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Painel Central" 
            active={activeTab === 'dashboard'} 
            expanded={isSidebarOpen}
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Motor de Descoberta" 
            active={activeTab === 'discovery'} 
            expanded={isSidebarOpen}
            onClick={() => setActiveTab('discovery')} 
          />
          <NavItem 
            icon={<BrainCircuit size={20} />} 
            label="Laboratório de Leads" 
            active={activeTab === 'lab'} 
            expanded={isSidebarOpen}
            onClick={() => setActiveTab('lab')} 
          />
          <div className="pt-8 pb-4">
            <div className="mx-3 h-[1px] bg-gray-200 mb-6" />
            <NavItem 
              icon={<Activity size={20} />} 
              label="Logs de Atividade" 
              expanded={isSidebarOpen} 
              onClick={() => {}} 
            />
            <NavItem 
              icon={<Settings size={20} />} 
              label="Configurações" 
              active={activeTab === 'settings'}
              expanded={isSidebarOpen} 
              onClick={() => setActiveTab('settings')} 
            />
          </div>
        </nav>
      </aside>

      {/* Main Framework */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Floating Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:flex hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {activeTab === 'dashboard' ? 'Painel Neural' : 
                 activeTab === 'discovery' ? 'Laboratório de Extração' : 
                 activeTab === 'lab' ? 'Laboratório de Leads' : 
                 'Painel de Controle'}
              </h2>
              <p className="text-xs text-gray-500 font-mono">STATUS: SISTEMAS_NOMINAIS // SYNC_SUCESSO</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative">
              <input 
                type="text" 
                placeholder="Busca Global IA..."
                className="bg-white border border-gray-300 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none text-gray-800 transition-all placeholder:text-gray-400"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#ff6b35]"></span>
              </button>
              <div className="w-[1px] h-6 bg-gray-300 mx-2" />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                <Sparkles size={16} />
                Enriquecimento Rápido
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50">
          {activeTab === 'dashboard' && <BentoDashboard leads={leads} onEnrich={(lead) => setSelectedLead(lead)} />}
          {activeTab === 'discovery' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <LeadDiscovery onResultsFound={handleAddLeads} />
              <div className="bg-white p-8 rounded-2xl border border-gray-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Trabalhadores Autônomos Gemini</h3>
                    <p className="text-gray-600 text-sm max-w-md">Gemini está rastreando 42 fontes verificadas em segundo plano para identificar leads de alta intenção em {leads[0]?.location || 'Brasil'}.</p>
                  </div>
                  <button className="ml-auto bg-white border border-gray-300 px-6 py-2.5 rounded-xl font-bold text-gray-800 hover:bg-gray-50 transition-all">
                    Escalar Automação
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'lab' && (
            <div className="animate-in fade-in duration-500 h-full">
              <LeadLab 
                leads={leads} 
                onEnrich={(lead) => setSelectedLead(lead)} 
                onDelete={handleDeleteLead}
              />
            </div>
          )}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>

      {selectedLead && (
        <EnrichmentModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onEnrichComplete={handleEnrichComplete}
        />
      )}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, expanded, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group
      ${active 
        ? 'text-white bg-orange-500' 
        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
    `}
  >
    <div className={`transition-colors ${active ? 'text-white' : 'group-hover:text-gray-800'}`}>
      {icon}
    </div>
    {expanded && <span className="font-semibold text-sm whitespace-nowrap">{label}</span>}
    {!expanded && active && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </div>
    )}
  </button>
);

export default App;
