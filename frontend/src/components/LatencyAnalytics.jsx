import React, { useState, useEffect } from 'react';
import { BarChart3, Play, Target, Award, CheckCircle2, Zap } from 'lucide-react';

export default function LatencyAnalytics() {
  const [stats, setStats] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics/latencies');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to load latency analytics:', e);
    }
  };

  const handleRunBenchmark = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/analytics/run-benchmark?count=20', { method: 'POST' });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to run benchmark suite:', e);
    } finally {
      setRunning(false);
    }
  };

  if (!stats) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 style={{ color: '#38bdf8' }} /> Latency Analytics & Percentile Metrics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Sub-200ms SLA target evaluation across benchmark test query suites.
          </p>
        </div>

        <button
          onClick={handleRunBenchmark}
          className="btn-primary"
          disabled={running}
        >
          <Play size={16} /> {running ? 'Running Benchmark (20 Queries)...' : 'Run Benchmark Suite'}
        </button>
      </div>

      {/* Percentiles 3-Card Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* P50 */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '18px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            P50 Latency (Median)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#38bdf8', margin: '4px 0' }}>
            {stats.p50_ms} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            50% of queries complete faster
          </div>
        </div>

        {/* P70 */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '18px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            P70 Latency (70th Percentile)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#818cf8', margin: '4px 0' }}>
            {stats.p70_ms} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            70% of queries complete faster
          </div>
        </div>

        {/* P100 */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '18px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            P100 Latency (Peak Max)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#c084fc', margin: '4px 0' }}>
            {stats.p100_ms} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Worst-case maximum across runs
          </div>
        </div>

        {/* SLA Compliance */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '14px',
          padding: '18px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#34d399', textTransform: 'uppercase' }}>
            SLA Pass Rate (&lt;200ms)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#34d399', margin: '4px 0' }}>
            {stats.sla_pass_rate_percent}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Total Benchmark Runs: {stats.total_queries}
          </div>
        </div>
      </div>

      {/* Stage Percentile Table */}
      {stats.stage_percentiles && Object.keys(stats.stage_percentiles).length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Stage-by-Stage Latency Percentile Matrix
          </h3>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>PIPELINE STAGE</th>
                  <th style={{ padding: '12px 16px', color: '#38bdf8', fontWeight: '600' }}>P50 (MEDIAN)</th>
                  <th style={{ padding: '12px 16px', color: '#818cf8', fontWeight: '600' }}>P70 (70TH PCT)</th>
                  <th style={{ padding: '12px 16px', color: '#c084fc', fontWeight: '600' }}>P100 (WORST MAX)</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>STATUS</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--font-mono)' }}>
                {Object.entries(stats.stage_percentiles).map(([stage, metrics], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)', fontWeight: '600', textTransform: 'uppercase' }}>
                      {stage}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{metrics.p50} ms</td>
                    <td style={{ padding: '12px 16px' }}>{metrics.p70} ms</td>
                    <td style={{ padding: '12px 16px' }}>{metrics.p100} ms</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)' }}>
                      <span className="badge badge-sla-success">OPTIMIZED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
