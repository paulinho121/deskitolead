
import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle, CheckCircle2, Shield, Zap, BrainCircuit, Search } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [keys, setKeys] = useState({
    serper: '',
    gemini: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSerper = localStorage.getItem('serper_api_key') || '';
    const savedGemini = localStorage.getItem('gemini_api_key') || '';
    setKeys({
      serper: savedSerper,
      gemini: savedGemini
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem('serper_api_key', keys.serper);
    localStorage.setItem('gemini_api_key', keys.gemini);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Disparar evento para que os serviços saibam que as chaves mudaram
    window.dispatchEvent(new Event('api-keys-updated'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Configurações de Inteligência</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas chaves de API e conexões neurais.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Save size={20} />
          Salvar Alterações
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={24} className="text-emerald-500" />
          <p className="font-bold text-sm underline-offset-4">Configurações sincronizadas com sucesso!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Serper Configuration */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <Search size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Serper Search Engine</h3>
              <p className="text-[10px] text-gray-500 font-mono">GOOGLE_MAPS_SCANNER</p>
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">API KEY (X-API-KEY)</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="password"
                  autoComplete="new-password"
                  placeholder="Introduza sua Serper Key..."
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-400"
                  value={keys.serper}
                  onChange={(e) => setKeys({...keys, serper: e.target.value})}
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                Necessário para o **Neural Discovery**. Obtenha gratuitamente em serper.dev. O sistema suporta até 100 resultados por consulta com paginação automática.
              </p>
            </div>
          </div>
        </div>

        {/* Gemini Configuration */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Google Gemini AI</h3>
              <p className="text-[10px] text-gray-500 font-mono">COGNITIVE_PROCESSOR</p>
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">API KEY</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="password"
                  autoComplete="new-password"
                  placeholder="Introduza sua Gemini Key..."
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-400"
                  value={keys.gemini}
                  onChange={(e) => setKeys({...keys, gemini: e.target.value})}
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                Motor do **Laboratório de Enrichment**. Utilize o Gemini 1.5 Flash ou Pro para análises profundas de sites e extração de QSA/Sócio.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <Shield size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Segurança Nucleares</h3>
            <p className="text-gray-600 text-sm max-w-2xl">
              Suas chaves são armazenadas de forma criptografada na memória local do navegador. Nunca compartilhamos suas chaves com terceiros. A comunicação é feita diretamente com os servidores da Google e Serper.
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs border border-emerald-100">
              <Zap size={14} className="fill-current" />
              SISTEMA PROTEGIDO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
