import React, { useState, useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const techData = [
  { subject: 'AI/ML', Aurelia: 98, Rust: 52, Python: 90, Cpp: 45 },
  { subject: 'Performance', Aurelia: 96, Rust: 95, Python: 40, Cpp: 92 },
  { subject: 'Safety', Aurelia: 95, Rust: 93, Python: 60, Cpp: 30 },
  { subject: 'NPU Targeting', Aurelia: 98, Rust: 25, Python: 55, Cpp: 35 },
  { subject: 'Ergonomics', Aurelia: 85, Rust: 72, Python: 95, Cpp: 55 },
  { subject: 'Ecosystem', Aurelia: 60, Rust: 75, Python: 98, Cpp: 85 },
  { subject: 'Compile Speed', Aurelia: 90, Rust: 65, Python: 98, Cpp: 70 },
  { subject: 'Concurrency', Aurelia: 92, Rust: 95, Python: 45, Cpp: 75 },
];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(12, 12, 20, 0.95)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: 10, padding: '10px 16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <p style={{ color: '#a1a1aa', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, fontSize: 13, fontWeight: 600, margin: '2px 0', fontFamily: 'JetBrains Mono, monospace' }}>
            {entry.name}: <span style={{ color: '#e4e4e7' }}>{entry.value}/100</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TechRadar() {
  const [animated, setAnimated] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { key: 'performance', label: 'Raw Performance', value: 96, color: '#00f0ff', desc: 'Zero-overhead abstractions, direct NPU instructions' },
    { key: 'safety', label: 'Memory Safety', value: 95, color: '#22d3ee', desc: 'Compile-time ownership, no GC pauses, no dangling ptrs' },
    { key: 'ai', label: 'AI/ML Native', value: 98, color: '#00f0ff', desc: 'First-class tensors, auto-diff compiler intrinsics' },
    { key: 'hardware', label: 'Hardware Control', value: 94, color: '#22d3ee', desc: 'MLIR pipeline, NPU/GPU/CPU targeting via @target' },
  ];

  return (
    <div style={{
      background: 'rgba(12, 12, 20, 0.7)',
      border: '1px solid rgba(0, 240, 255, 0.1)',
      borderRadius: 20,
      padding: '2rem',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)',
      }} />

      <div style={{ marginBottom: '1.75rem' }}>
        <span style={{
          display: 'inline-block', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#00f0ff', background: 'rgba(0,240,255,0.08)',
          border: '1px solid rgba(0,240,255,0.2)', borderRadius: 9999,
          padding: '3px 12px', marginBottom: 8,
        }}>Capability Matrix</span>
        <h3 style={{ color: '#e4e4e7', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
          Language Capability Radar
        </h3>
        <p style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>Multi-dimensional comparison across 8 critical axes</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={techData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#52525b', fontSize: 9 }} />
              <Tooltip content={<CustomTooltip />} />
              <Radar name="Aurelia" dataKey="Aurelia" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.25} strokeWidth={2} isAnimationActive={animated} />
              <Radar name="Rust" dataKey="Rust" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={animated} />
              <Radar name="Python" dataKey="Python" stroke="#ec4899" fill="#ec4899" fillOpacity={0.08} strokeWidth={1} isAnimationActive={animated} />
              <Radar name="C++" dataKey="Cpp" stroke="#f97316" fill="#f97316" fillOpacity={0.08} strokeWidth={1} isAnimationActive={animated} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {metrics.map((m) => (
            <div
              key={m.key}
              onMouseEnter={() => setActiveMetric(m.key)}
              onMouseLeave={() => setActiveMetric(null)}
              style={{
                background: activeMetric === m.key ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeMetric === m.key ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 10, padding: '10px 14px',
                cursor: 'default',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa' }}>{m.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: animated ? `${m.value}%` : '0%',
                  background: `linear-gradient(90deg, ${m.color}, rgba(168,85,247,0.6))`,
                  borderRadius: 4,
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 8px ${m.color}60`,
                }} />
              </div>
              {activeMetric === m.key && (
                <p style={{ fontSize: 11, color: '#71717a', marginTop: 6, lineHeight: 1.5 }}>{m.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
