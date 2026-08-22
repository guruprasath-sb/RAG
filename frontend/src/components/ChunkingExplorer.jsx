import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, FileText, Split, Check } from 'lucide-react';

export default function ChunkingExplorer({ currentStrategy, setStrategy }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chunking/compare');
      const data = await res.json();
      setComparison(data);
    } catch (e) {
      console.error('Failed to fetch chunking comparison:', e);
    } finally {
      setLoading(false);
    }
  };

  const strategiesList = [
    { key: 'semantic', name: 'Semantic Splitting', desc: 'Sentence & paragraph boundary detection' },
    { key: 'overlap', name: 'Overlapping Window', desc: 'Sliding window preserving edge context' },
    { key: 'fixed', name: 'Fixed-Size (Naive)', desc: 'Rigid character/token length split' },
    { key: 'metadata', name: 'Metadata-Aware', desc: 'Injects passage context tags & titles' },
    { key: 'hierarchical', name: 'Hierarchical (Parent-Child)', desc: 'Parent macro-chunks + Child micro-chunks' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers style={{ color: '#a855f7' }} /> Vast Multi-Chunking Strategy Explorer
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Compare split characteristics, chunk counts, and execution metrics across 5 strategies.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {strategiesList.map((st) => {
          const stats = comparison ? comparison[st.key] : null;
          const isSelected = currentStrategy === st.key;

          return (
            <div
              key={st.key}
              onClick={() => setStrategy(st.key)}
              className={`glass-panel glass-card-interactive`}
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-purple)' : 'var(--border-color)',
                background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-secondary)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isSelected ? '#c084fc' : 'var(--text-muted)' }}>
                  {st.key.toUpperCase()}
                </span>
                {isSelected && <Check size={16} color="#c084fc" />}
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {st.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minHeight: '32px', marginBottom: '12px' }}>
                {st.desc}
              </div>

              {stats && (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '8px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Chunks:</span>
                    <span style={{ fontWeight: '700' }}>{stats.chunk_count}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Avg Size:</span>
                    <span style={{ fontWeight: '700' }}>{stats.avg_chunk_size}c</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Split Time:</span>
                    <span style={{ color: '#34d399', fontWeight: '700' }}>{stats.execution_time_ms}ms</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Chunk Preview */}
      {comparison && comparison[currentStrategy] && (
        <div style={{
          background: 'rgba(10, 12, 20, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Sample Output Preview ({comparison[currentStrategy].strategy_name})
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: '#e2e8f0',
            background: 'var(--bg-secondary)',
            padding: '12px',
            borderRadius: '8px',
            borderLeft: '4px solid var(--accent-purple)',
            whiteSpace: 'pre-wrap'
          }}>
            {comparison[currentStrategy].sample_chunk}
          </div>
        </div>
      )}
    </div>
  );
}
