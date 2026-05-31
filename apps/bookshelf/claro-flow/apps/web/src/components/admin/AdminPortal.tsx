'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Users, MousePointerClick, ShieldCheck, Settings, Radio } from 'lucide-react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useContentStore } from '../../store/useContentStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const AdminPortal = () => {
  const { networkHistory, clickEvents } = useTelemetryStore();
  const { globalNotification, isNotificationActive, agenda, setGlobalNotification, setAgendaLive } = useContentStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'control'>('telemetry');
  
  // Local state for the notification form
  const [notifText, setNotifText] = useState(globalNotification);
  const [notifActive, setNotifActive] = useState(isNotificationActive);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen p-8 flex flex-col gap-8 max-w-[1440px] mx-auto">
      {/* Admin Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-400" />
            <h1 className="text-3xl font-black tracking-tighter text-white">Gestão e Telemetria</h1>
          </div>
          <p className="text-slate-500 mt-1">Centro de Comando de Inteligência de Dados - Claro Conecta</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-sm text-slate-400 font-mono">LIVE_STREAM_ACTIVE</span>
          </div>
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab('telemetry')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'telemetry' ? 'border-[#ee1d23] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" /> Telemetria de Rede
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('control')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'control' ? 'border-[#ee1d23] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Controle do Evento
          </div>
        </button>
      </div>

      {activeTab === 'telemetry' ? (
        <>
          {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Activity className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider font-bold">Latência Média</span>
          </div>
          <div className="text-4xl font-black text-white">
            {networkHistory.length > 0 ? (networkHistory.reduce((acc, curr) => acc + curr.latency, 0) / networkHistory.length).toFixed(1) : '--'}
            <span className="text-lg text-slate-500 font-normal ml-2">ms</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Users className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider font-bold">Usuários Ativos (Sim)</span>
          </div>
          <div className="text-4xl font-black text-white">
            2,451
            <span className="text-lg text-[#10b981] font-normal ml-2">↑ 12%</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <MousePointerClick className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider font-bold">Eventos de Click (Sessão)</span>
          </div>
          <div className="text-4xl font-black text-white">
            {clickEvents.length}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Network Area Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Estabilidade de Rede 5G (Jitter vs Latência)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkHistory}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ee1d23" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ee1d23" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#334155" fontSize={12} tickMargin={10} />
                <YAxis stroke="#334155" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#ee1d23" fillOpacity={1} fill="url(#colorLatency)" isAnimationActive={false} />
                <Area type="monotone" dataKey="jitter" stroke="#3b82f6" fillOpacity={0} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap/Click Logs */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Log de Interações (Heatmap Data)</h3>
            <span className="text-xs text-slate-500 bg-black/50 px-3 py-1 rounded-full border border-white/5">Últimos {clickEvents.length} eventos</span>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 space-y-3">
            {clickEvents.slice().reverse().map(event => (
              <div key={event.id} className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">{event.element}</span>
                  <span className="text-slate-500 text-[10px] font-mono">ID: {event.id} | X: {event.x} Y: {event.y}</span>
                </div>
                <span className="text-slate-400 text-xs font-mono">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {clickEvents.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                Nenhuma interação registrada ainda. Navegue na plataforma principal para gerar dados.
              </div>
            )}
          </div>
        </div>

          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Producer Event Control */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#ee1d23]" /> 
              Grade de Atrações (Ao Vivo)
            </h3>
            <p className="text-sm text-slate-400">Selecione qual atração está acontecendo agora no evento principal para notificar os painéis do Dashboard.</p>
            
            <div className="flex flex-col gap-3 mt-2">
              {agenda.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${item.isLive ? 'bg-[#ee1d23]/10 border-[#ee1d23]/30' : 'bg-black/40 border-white/5'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{item.time}</span>
                      {item.isLive && <span className="bg-[#ee1d23] text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">Live</span>}
                    </div>
                    <span className="text-white font-bold block mt-1">{item.title}</span>
                    <span className="text-slate-500 text-xs">{item.location}</span>
                  </div>
                  <button 
                    onClick={() => setAgendaLive(item.id)}
                    disabled={item.isLive}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${item.isLive ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-[#ee1d23] text-white hover:bg-[#c9181e] shadow-[0_0_15px_rgba(238,29,35,0.4)]'}`}
                  >
                    {item.isLive ? 'Transmitindo' : 'Marcar Ao Vivo'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Producer Notifications */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" /> 
              Alerta Flutuante (Global)
            </h3>
            <p className="text-sm text-slate-400">Edite a mensagem que aparece fixada na parte inferior do Dashboard para todos os usuários.</p>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Texto do Alerta</label>
                <textarea 
                  value={notifText}
                  onChange={(e) => setNotifText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-[#ee1d23]/50 transition-colors h-24 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                <span className="text-sm text-white font-bold">Status do Alerta</span>
                <button 
                  onClick={() => setNotifActive(!notifActive)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${notifActive ? 'bg-[#10b981]' : 'bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notifActive ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <button 
                onClick={() => setGlobalNotification(notifText, notifActive)}
                className="w-full py-3 mt-2 bg-gradient-to-r from-[#ee1d23] to-[#c9181e] text-white text-sm font-bold rounded-xl shadow-[0_4px_15px_rgba(238,29,35,0.4)] hover:shadow-[0_6px_25px_rgba(238,29,35,0.6)] transition-all"
              >
                Salvar Configurações &gt;
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
