import React, { useState } from 'react';
import { Mic, Layers, Cpu, BarChart3, Zap, Shield, Sparkles, Code, CheckCircle } from 'lucide-react';
import VoiceStudio from './components/VoiceStudio';
import PipelineTrace from './components/PipelineTrace';
import ChunkingExplorer from './components/ChunkingExplorer';
import HarnessMonitor from './components/HarnessMonitor';
import LatencyAnalytics from './components/LatencyAnalytics';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [strategy, setStrategy] = useState('semantic');
  const [sttProvider, setSttProvider] = useState('Sarvam AI');
  const [pipelineResponse, setPipelineResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProcessVoice = async (audioBlob, provider, chunkStrategy) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_input.wav');
      formData.append('stt_provider', provider);
      formData.append('chunk_strategy', chunkStrategy);

      const res = await fetch('/api/rag/process-voice', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setPipelineResponse(data);
    } catch (e) {
      console.error('Error processing voice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessText = async (text, provider, chunkStrategy) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rag/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          stt_provider: provider,
          chunk_strategy: chunkStrategy
        })
      });
      const data = await res.json();
      setPipelineResponse(data);
    } catch (e) {
      console.error('Error processing text:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
              <span className="gradient-text">HH Goa 2026</span> Voice RAG Architecture
            </h1>
            <span className="badge badge-sla-success" style={{ fontSize: '0.7rem' }}>
              <Zap size={12} /> SUB-200ms TARGET
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Task 2 Shortlisting | Sarvam AI & ElevenLabs STT • Vast Multi-Chunking • Structured Harness • Guardrails • P50/P70/P100 Analytics
          </p>
        </div>

        {/* Top Metric Pills */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color="#06b6d4" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>DATASET</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>MSMARCO-XI</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>SLA BOUND</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#34d399' }}>&lt; 200 ms</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'studio', label: 'Voice Studio & Pipeline Trace', icon: Mic },
          { id: 'chunking', label: 'Vast Multi-Chunking Explorer', icon: Layers },
          { id: 'harness', label: 'Structured Harness & Guardrails', icon: Cpu },
          { id: 'analytics', label: 'P50 / P70 / P100 Latency Analytics', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))' : 'var(--bg-card)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: '1px solid ' + (isActive ? 'transparent' : 'var(--border-color)'),
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main View Area */}
      {activeTab === 'studio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <VoiceStudio
            onProcessVoice={handleProcessVoice}
            onProcessText={handleProcessText}
            isLoading={isLoading}
            currentStrategy={strategy}
            setStrategy={setStrategy}
            sttProvider={sttProvider}
            setSttProvider={setSttProvider}
          />
          <PipelineTrace response={pipelineResponse} />
        </div>
      )}

      {activeTab === 'chunking' && (
        <ChunkingExplorer currentStrategy={strategy} setStrategy={setStrategy} />
      )}

      {activeTab === 'harness' && (
        <HarnessMonitor response={pipelineResponse} />
      )}

      {activeTab === 'analytics' && (
        <LatencyAnalytics />
      )}
    </div>
  );
}

// Helper icon component
function Database(props) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  );
}
