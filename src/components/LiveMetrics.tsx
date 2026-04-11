import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

function useAnimatedCounter(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}

function generateSparkline(base: number, variance: number, points = 20) {
  return Array.from({ length: points }, (_, i) => ({
    v: Math.max(0, base + (Math.random() - 0.5) * variance * 2 * Math.sin(i * 0.4)),
  }));
}

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  sparkBase: number;
  sparkVariance: number;
  trend: string;
  trendUp: boolean;
  suffix?: string;
}

function MetricCard({ label, value, unit, color, sparkBase, sparkVariance, trend, trendUp, suffix }: MetricCardProps) {
  const animatedValue = useAnimatedCounter(value, 1800);
  const [sparkData] = useState(() => generateSparkline(sparkBase, sparkVariance));
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(0,240,255,0.05)' : 'rgba(12,12,20,0.7)',
        border: `1px solid ${hovered ? `${color}30` : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16, padding: '1.25rem',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
      }} />

      <div style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {animatedValue.toLocaleString()}
          </span>
          <span style={{ fontSize: 14, color: '#a1a1aa', marginLeft: 6 }}>{unit}</span>
          {suffix && <span style={{ fontSize: 11, color: '#71717a', marginLeft: 4 }}>{suffix}</span>}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: trendUp ? 'rgba(34,211,238,0.1)' : 'rgba(236,72,153,0.1)',
          border: `1px solid ${trendUp ? 'rgba(34,211,238,0.2)' : 'rgba(236,72,153,0.2)'}`,
          borderRadius: 6, padding: '3px 8px',
        }}>
          <span style={{ fontSize: 12, color: trendUp ? '#22d3ee' : '#ec4899', fontWeight: 700 }}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        </div>
      </div>

      <div style={{ height: 48 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <Tooltip content={() => null} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function LiveMetrics() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const metrics: MetricCardProps[] = [
    { label: 'Compilation Throughput', value: 2847, unit: 'LOC/s', color: '#00f0ff', sparkBase: 2800, sparkVariance: 200, trend: '12.4%', trendUp: true },
    { label: 'Inference Latency', value: 4, unit: 'ms', color: '#22d3ee', sparkBase: 4, sparkVariance: 0.8, trend: '38%', trendUp: false, suffix: 'avg' },
    { label: 'NPU Utilization', value: 94, unit: '%', color: '#00f0ff', sparkBase: 92, sparkVariance: 4, trend: '8.1%', trendUp: true },
    { label: 'Memory Efficiency', value: 99, unit: '%', color: '#22d3ee', sparkBase: 98, sparkVariance: 2, trend: '2.3%', trendUp: true },
    { label: 'Zero-Day Blocks', value: 1284, unit: 'events', color: '#00f0ff', sparkBase: 1200, sparkVariance: 150, trend: '22%', trendUp: true, suffix: '/day' },
    { label: 'Gradient Ops/sec', value: 58400, unit: 'GOps', color: '#22d3ee', sparkBase: 57000, sparkVariance: 2000, trend: '5.7%', trendUp: true },
  ];

  return (
    <div ref={ref}>
      <div style={{
        background: 'rgba(12, 12, 20, 0.7)',
        border: '1px solid rgba(0, 240, 255, 0.1)',
        borderRadius: 20, padding: '2rem',
        backdropFilter: 'blur(20px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#00f0ff', background: 'rgba(0,240,255,0.08)',
              border: '1px solid rgba(0,240,255,0.2)', borderRadius: 9999,
              padding: '3px 12px', marginBottom: 8,
            }}>System Telemetry</span>
            <h3 style={{ color: '#e4e4e7', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
              Real-Time Stack Metrics
            </h3>
            <p style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>Live performance data from the Deepcomet AI ecosystem</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22d3ee',
              boxShadow: '0 0 8px #22d3ee',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {visible && metrics.map((m, i) => (
            <div key={m.label} style={{
              opacity: 0,
              animation: `fadeInUp 0.6s ease-out ${i * 0.1}s forwards`,
            }}>
              <MetricCard {...m} />
            </div>
          ))}
          {!visible && metrics.map((m) => (
            <div key={m.label} style={{
              background: 'rgba(12,12,20,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '1.25rem', height: 140,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
