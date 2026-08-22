import React from 'react';
import { Zap, Clock, ShieldCheck, Database, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PipelineTrace({ response }) {
  if (!response) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No pipeline execution run yet. Record audio or click a sample query to inspect real-time latency trace.
        </p>
      </div>
    );
  }

  const { latency, guardrails, answer, refused, refusal_reason, stt_provider, chunk_strategy, chunks_retrieved } = response;
  const isSlaPass = latency.sla_met;

  const stages = [
    { name: 'Speech-to-Text', time: latency.stt_ms, icon: Clock, color: '#38bdf8', detail: stt_provider },
    { name: 'Guardrail Scan', time: latency.guardrail_ms, icon: ShieldCheck, color: guardrails.passed ? '#10b981' : '#f43f5e', detail: guardrails.passed ? 'Allowed' : 'Refused' },
    { name: 'Vector DB Retrieval', time: latency.retrieval_ms, icon: Database, color: '#a855f7', detail: `${chunks_retrieved.length} chunks (${chunk_strategy})` },
    { name: 'Model Harness', time: latency.harness_llm_ms, icon: Cpu, color: '#f59e0b', detail: 'Structured JSON' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* SLA Metric Banner */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        background: isSlaPass ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
        border: `1px solid ${isSlaPass ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={28} color={isSlaPass ? '#10b981' : '#f43f5e'} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              End-to-End Pipeline Latency
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
              {latency.total_e2e_ms} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>ms</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className={isSlaPass ? 'badge badge-sla-success' : 'badge badge-sla-warning'}>
            {isSlaPass ? <><CheckCircle2 size={14} /> SLA TARGET MET (&lt; 200ms)</> : <><AlertTriangle size={14} /> EXCEEDED SLA TARGET</>}
          </span>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Target: 200.00 ms
          </div>
        </div>
      </div>

      {/* Stage Breakdown Timeline */}
      <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
        Pipeline Stage Trace
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {stages.map((stg, i) => {
          const Icon = stg.icon;
          const pct = Math.min((stg.time / latency.total_e2e_ms) * 100, 100);
          return (
            <div key={i} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Icon size={18} color={stg.color} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: stg.color }}>
                  {stg.time} ms
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>{stg.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stg.detail}</div>

              {/* Progress bar */}
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: stg.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Answer Output / Refusal Display */}
      <div style={{
        background: refused ? 'rgba(244, 63, 94, 0.05)' : 'rgba(99, 102, 241, 0.05)',
        border: `1px solid ${refused ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {refused ? 'Guardrail Refusal Output' : 'Generated Answer Response'}
          </span>
          {refused && <span className="badge badge-refusal">Refusal Triggered</span>}
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
          {answer}
        </p>
      </div>
    </div>
  );
}
