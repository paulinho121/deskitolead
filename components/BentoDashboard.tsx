
import React from 'react';
import { 
  Users, Sparkles, CheckCircle, TrendingUp, 
  Globe, Activity, Zap, Brain, Map as MapIcon,
  MousePointer2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { Lead, LeadStatus } from '../types';

interface BentoDashboardProps {
  leads: Lead[];
  onEnrich: (lead: Lead) => void;
}

const BentoDashboard: React.FC<BentoDashboardProps> = ({ leads, onEnrich }) => {
  const hasLeads = leads.length > 0;
  
  const chartData = hasLeads ? [
    { name: 'Seg', leads: leads.length * 0.4 },
    { name: 'Ter', leads: leads.length * 0.6 },
    { name: 'Qua', leads: leads.length * 0.5 },
    { name: 'Qui', leads: leads.length * 0.8 },
    { name: 'Sex', leads: leads.length },
  ] : [
    { name: 'Aguardando Dados', leads: 0 },
  ];

  const industryData = [
    { name: 'Identificados', value: leads.length, color: '#ff6b35' },
    { name: 'Pendente', value: 0, color: '#ff8c5a' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-6 gap-6 h-[1200px] lg:h-full max-w-7xl mx-auto animate-in zoom-in-95 duration-700">
      
      {/* 1. Main Performance (Large) */}
      <div className="col-span-1 md:col-span-4 lg:col-span-4 row-span-2 bg-white rounded-3xl p-8 border border-gray-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-orange-500/20"></div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Inteligência de Fluxo de Leads</h3>
            <p className="text-sm text-gray-500 font-mono italic">FEED_DE_EXTRAÇÃO_TEMPO_REAL</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/20 flex items-center gap-1">
              <Zap size={12} fill="currentColor" /> Ao Vivo
            </span>
          </div>
        </div>
        
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#1f2937' }}
                itemStyle={{ color: '#ff6b35' }}
              />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#ff6b35" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorLeads)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Key Metrics (Vertical Bento) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-3 bg-white rounded-3xl p-8 flex flex-col justify-between group overflow-hidden border border-gray-200">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mb-32"></div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="text-orange-500" size={18} /> Estatísticas Neurais
        </h3>
        
        <div className="space-y-8">
          <StatBox label="Total Escaneado" value={leads.length.toString()} color="text-orange-500" icon={<Users size={20} />} />
          <StatBox label="Enriquecido por IA" value={leads.filter(l => l.status === LeadStatus.ENRICHED).length.toString()} color="text-orange-600" icon={<Sparkles size={20} />} />
          <StatBox label="Sucesso de Sync" value="98.2%" color="text-green-500" icon={<CheckCircle size={20} />} />
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Taxa Global de Sucesso</span>
            <span className="text-xs font-bold text-orange-500">12.5%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 w-[12.5%] rounded-full shadow-[0_0_8px_rgba(255,107,53,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* 3. AI Insights Feed (Glassmorphism Card) */}
      <div className="col-span-1 md:col-span-4 lg:col-span-3 row-span-3 bg-white rounded-3xl p-8 border border-gray-200 relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Brain className="text-orange-500" size={18} /> Feed de Sinais Gemini
          </h3>
          <button className="text-xs font-bold text-orange-500 hover:text-orange-600">Limpar Logs</button>
        </div>
        
        <div className="space-y-4 font-mono text-xs">
          {hasLeads ? (
            <>
              <InsightLog 
                status="SUCESSO" 
                msg={`Localizados ${leads.length} leads em sua base real.`} 
                time="Agora" 
              />
              <InsightLog 
                status="SYNC" 
                msg="Conexão com Supabase ativa e nominal." 
                time="Status" 
              />
            </>
          ) : (
            <div className="py-20 text-center opacity-30 italic">
              Aguardando primeira extração para gerar insights neurais...
            </div>
          )}
        </div>
      </div>

      {/* 4. Geographic Heatmap (Mock) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2 bg-white border border-gray-200 rounded-3xl p-6 flex flex-col group cursor-pointer hover:border-orange-300 transition-all">
        <MapIcon className="text-gray-500 mb-auto" size={24} />
        <div>
          <h4 className="text-gray-800 font-bold mb-1">Pulso Geográfico</h4>
          <p className="text-gray-600 text-xs leading-tight">Hotspots de densidade: SP, RJ, MG</p>
        </div>
        <div className="mt-4 flex gap-1">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < 4 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
          ))}
        </div>
      </div>

      {/* 5. Quick Action Button */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 flex items-center justify-between group cursor-pointer shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all">
        <div>
          <h4 className="text-white font-bold text-lg">Extração Explosiva</h4>
          <p className="text-orange-100 text-xs">Escaneie instantaneamente 100+ empresas locais</p>
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          <Zap size={24} fill="currentColor" />
        </div>
      </div>
      
    </div>
  );
};

const StatBox = ({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) => (
  <div className="group/stat">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg bg-gray-50 ${color} transition-all group-hover/stat:scale-110`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
    <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
  </div>
);

const InsightLog = ({ status, msg, time, type = 'normal' }: { status: string, msg: string, time: string, type?: 'normal' | 'alert' }) => (
  <div className={`p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3 transition-colors hover:bg-gray-100`}>
    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${type === 'alert' ? 'bg-orange-500 animate-pulse' : 'bg-orange-400'}`}></div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-0.5">
        <span className={`font-bold ${type === 'alert' ? 'text-orange-500' : 'text-gray-700'}`}>{status}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{time}</span>
      </div>
      <p className="text-gray-600 leading-tight tracking-tight">{msg}</p>
    </div>
  </div>
);

export default BentoDashboard;
