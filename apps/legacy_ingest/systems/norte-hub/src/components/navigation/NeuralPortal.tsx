"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Activity, Book, BarChart3, Settings, Shield, Plus, Play, ExternalLink } from 'lucide-react';

export const NeuralPortal = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ backgroundColor: '#020202', height: '100vh' }} />;

  return (
    <div style={{ backgroundColor: '#020202', height: '100vh', display: 'flex', color: 'white', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar de Fundação */}
      <aside style={{ width: '80px', borderRight: '1px solid rgba(0,242,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '35px', background: '#050505' }}>
        <div style={{ width: '45px', height: '45px', backgroundColor: '#00F2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: '900' }}>N</div>
        <Activity size={22} color="rgba(0,242,255,0.3)" title="Bio-Status" />
        <Book size={22} color="rgba(0,242,255,0.3)" title="Study" />
        <BarChart3 size={22} color="rgba(0,242,255,0.3)" title="Services" />
        <Shield size={22} color="rgba(0,242,255,0.3)" title="Admin" />
      </aside>

      {/* Main Command Deck */}
      <main style={{ flex: 1, padding: '50px 70px', overflowY: 'auto', background: 'radial-gradient(circle at top right, #001a1d 0%, #020202 50%)' }}>
        <header style={{ marginBottom: '50px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-3px', margin: 0 }}>NORTE <span style={{ color: '#00F2FF' }}>SYSTEMS</span></h1>
          <p style={{ color: 'rgba(0,242,255,0.3)', fontSize: '12px', letterSpacing: '5px', textTransform: 'uppercase', marginTop: '10px' }}>Universal Digital Foundation // Services Active</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '25px' }}>
          
          {/* Norte Music */}
          <div style={{ gridColumn: 'span 7', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '35px', borderRadius: '35px', backdropFilter: 'blur(20px)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}><Music color="#00F2FF" /> Norte Music</h2>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Natural Mystic - active_session.mp3</span>
                <Play size={18} color="#00F2FF" />
            </div>
          </div>

          {/* Norte Fit */}
          <div style={{ gridColumn: 'span 5', background: 'rgba(0,242,255,0.03)', border: '1px solid rgba(0,242,255,0.1)', padding: '35px', borderRadius: '35px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#00F2FF' }}>Norte Fit</h2>
            <div style={{ fontSize: '32px', fontWeight: '900' }}>120.5 <span style={{ fontSize: '14px', color: 'rgba(0,242,255,0.5)' }}>KG</span></div>
            <p style={{ fontSize: '10px', color: 'rgba(0,242,255,0.3)', marginTop: '5px' }}>BIO-STATUS: STABLE</p>
          </div>

          {/* NORTH SERVICES (O antigo SaaS Hub) */}
          <div style={{ gridColumn: 'span 12', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '35px', borderRadius: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>North Services</h3>
                <span style={{ fontSize: '10px', color: '#00F2FF', border: '1px solid #00F2FF', padding: '4px 10px', borderRadius: '10px' }}>SYSTEM MAKERS READY</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                {['Agency Core', 'Medical Sync', 'Auto-Inventory', 'Neural Lab'].map(item => (
                    <div key={item} style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '20px', cursor: 'pointer' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: '14px' }}>{item}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(0,242,255,0.3)', marginTop: '5px' }}>FOUNDATION_LINKED</div>
                    </div>
                ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};