import React from 'react';
import { Cpu, ShieldCheck, Wrench, RefreshCw, AlertCircle, CheckCircle, FileCode } from 'lucide-react';

export default function HarnessMonitor({ response }) {
  if (!response) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Harness log empty. Process a query to view tool calls, retries, and guardrail decisions.
        </p>
      </div>
    );
  }

  const { tool_calls, retries_count, guardrails, refused, refusal_reason } = response;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu style={{ color: '#f59e0b' }} /> Structured Harness & Guardrail Monitor
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Tool call traces, retry resilience counters, groundedness scores & refusal triggers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <RefreshCw size={14} color="#f59e0b" />
            <span>Retries: <strong>{retries_count}</strong></span>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} color={guardrails.passed ? '#10b981' : '#f43f5e'} />
            <span>Groundedness: <strong>{(guardrails.groundedness_score * 100).toFixed(0)}%</strong></span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Tool Call Invocation Stream */}
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Harness Tool Invocations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tool_calls.map((t, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#f59e0b' }}>
                    <Wrench size={14} /> {t.tool_name}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                    {t.latency_ms} ms
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Args: {JSON.stringify(t.arguments)}
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Output: {JSON.stringify(t.output)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guardrail Safety & Refusal Panel */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Guardrail Decisions
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Input Safety Scanner</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: guardrails.passed ? '#34d399' : '#f43f5e' }}>
              {guardrails.passed ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {guardrails.reason}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Fact Groundedness Score</div>
            <div style={{
              height: '8px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '6px'
            }}>
              <div style={{
                height: '100%',
                width: `${guardrails.groundedness_score * 100}%`,
                background: guardrails.hallucination_detected ? '#f43f5e' : '#10b981'
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{(guardrails.groundedness_score * 100).toFixed(0)}% grounded</span>
              <span>{guardrails.hallucination_detected ? 'Hallucination Warning' : 'Zero Hallucination'}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Refusal Controller Status</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: refused ? '#fb7185' : 'var(--text-primary)' }}>
              {refused ? `REFUSED (${refusal_reason})` : 'PASSED (Answer Generated)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
