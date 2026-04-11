import React, { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine
} from 'recharts';

const compilationData = [
  { name: 'Jan', Aurelia: 12, Python: 145, Cpp: 78, Rust: 34 },
  { name: 'Feb', Aurelia: 11, Python: 152, Cpp: 82, Rust: 33 },
  { name: 'Mar', Aurelia: 10, Python: 149, Cpp: 79, Rust: 31 },
  { name: 'Apr', Aurelia: 9, Python: 158, Cpp: 83, Rust: 30 },
  { name: 'May', Aurelia: 8, Python: 162, Cpp: 85, Rust: 28 },
  { name: 'Jun', Aurelia: 7, Python: 170, Cpp: 80, Rust: 27 },
  { name: 'Jul', Aurelia: 6, Python: 175, Cpp: 87, Rust: 26 },
  { name: 'Aug', Aurelia: 5, Python: 180, Cpp: 82, Rust: 24 },
];

const inferenceData = [
  { name: '10M', Aurelia_NPU: 0.4, Python_GPU: 8.2, Cpp_CPU: 3.1 },
  { name: '50M', Aurelia_NPU: 1.2, Python_GPU: 24.5, Cpp_CPU: 9.8 },
  { name: '100M', Aurelia_NPU: 2.1, Python_GPU: 48.3, Cpp_CPU: 19.2 },
  { name: '250M', Aurelia_NPU: 4.8, Python_GPU: 112.7, Cpp_CPU: 45.1 },
  { name: '500M', Aurelia_NPU: 9.2, Python_GPU: 218.4, Cpp_CPU: 88.6 },
  { name: '1B', Aurelia_NPU: 17.5, Python_GPU: 421.8, Cpp_CPU: 172.3 },
];

const memoryData = [
  { name: 'Alloc', Aurelia: 0.8, Rust: 1.1, Cpp: 2.4, Java: 8.2, Python: 15.6 },
  { name: 'Hold', Aurelia: 1.2, Rust: 1.8, Cpp: 4.1, Java: 12.4, Python: 22.3 },
  { name: 'Release', Aurelia: 0.2, Rust: 0.3, Cpp: 0.8, Java: 6.1, Python: 9.4 },
  { name: 'GC Pause', Aurelia: 0, Rust: 0, Cpp: 0, Java: 18.7, Python: 34.2 },
  { name: 'Peak', Aurelia: 2.1, Rust: 2.9, Cpp: 6.8, Java: 28.4, Python: 52.1 },
];

type ChartMode = 'compilation' | 'inference' | 'memory';

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
        borderRadius: 10,
        padding: '10px 16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <p style={{ color: '#a1a1aa', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, fontSize: 13, fontWeight: 600, margin: '2px 0', fontFamily: 'JetBrains Mono, monospace' }}>
            {entry.name}: <span style={{ color: '#e4e4e7' }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InteractiveChart() {
  const [mode, setMode] = useState<ChartMode>('compilation');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const tabs: { id: ChartMode; label: string }[] = [
    { id: 'compilation', label: 'Compile Time (ms)' },
    { id: 'inference', label: 'Inference Latency (ms)' },
    { id: 'memory', label: 'Memory Ops (ms)' },
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#00f0ff', background: 'rgba(0,240,255,0.08)',
            border: '1px solid rgba(0,240,255,0.2)', borderRadius: 9999,
            padding: '3px 12px', marginBottom: 8,
          }}>Live Benchmark</span>
          <h3 style={{ color: '#e4e4e7', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Performance Comparison
          </h3>
          <p style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>Aurelia vs. leading systems languages across key metrics</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setAnimated(false); setTimeout(() => setAnimated(true), 100); }}
              style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600,
                borderRadius: 8, cursor: 'pointer', border: 'none',
                transition: 'all 0.3s ease',
                background: mode === tab.id ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.04)',
                color: mode === tab.id ? '#00f0ff' : '#71717a',
                boxShadow: mode === tab.id ? '0 0 16px rgba(0,240,255,0.15)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'compilation' ? (
            <AreaChart data={compilationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAurelia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPython" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCpp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
              <Area type="monotone" dataKey="Aurelia" stroke="#00f0ff" strokeWidth={2.5} fill="url(#colorAurelia)" dot={{ fill: '#00f0ff', r: 3 }} isAnimationActive={animated} />
              <Area type="monotone" dataKey="Python" stroke="#ec4899" strokeWidth={1.5} fill="url(#colorPython)" dot={false} isAnimationActive={animated} />
              <Area type="monotone" dataKey="Cpp" stroke="#f97316" strokeWidth={1.5} fill="url(#colorCpp)" dot={false} isAnimationActive={animated} />
              <Area type="monotone" dataKey="Rust" stroke="#22d3ee" strokeWidth={1.5} fill="url(#colorRust)" dot={false} isAnimationActive={animated} />
            </AreaChart>
          ) : mode === 'inference' ? (
            <LineChart data={inferenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} label={{ value: 'Model Params', position: 'insideBottom', offset: -5, fill: '#52525b', fontSize: 10 }} />
              <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
              <ReferenceLine y={10} stroke="rgba(0,240,255,0.2)" strokeDasharray="4 4" label={{ value: '10ms target', fill: 'rgba(0,240,255,0.5)', fontSize: 10 }} />
              <Line type="monotone" dataKey="Aurelia_NPU" name="Aurelia (NPU)" stroke="#00f0ff" strokeWidth={2.5} dot={{ fill: '#00f0ff', r: 4 }} isAnimationActive={animated} />
              <Line type="monotone" dataKey="Python_GPU" name="Python (GPU)" stroke="#ec4899" strokeWidth={1.5} dot={{ fill: '#ec4899', r: 3 }} isAnimationActive={animated} />
              <Line type="monotone" dataKey="Cpp_CPU" name="C++ (CPU)" stroke="#f97316" strokeWidth={1.5} dot={{ fill: '#f97316', r: 3 }} isAnimationActive={animated} />
            </LineChart>
          ) : (
            <BarChart data={memoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
              <Bar dataKey="Aurelia" fill="#00f0ff" opacity={0.9} radius={[4, 4, 0, 0]} isAnimationActive={animated} />
              <Bar dataKey="Rust" fill="#22d3ee" opacity={0.7} radius={[4, 4, 0, 0]} isAnimationActive={animated} />
              <Bar dataKey="Cpp" fill="#f97316" opacity={0.7} radius={[4, 4, 0, 0]} isAnimationActive={animated} />
              <Bar dataKey="Java" fill="#a855f7" opacity={0.7} radius={[4, 4, 0, 0]} isAnimationActive={animated} />
              <Bar dataKey="Python" fill="#ec4899" opacity={0.7} radius={[4, 4, 0, 0]} isAnimationActive={animated} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Aurelia Advantage', value: '10x', color: '#00f0ff' },
          { label: 'Zero GC Pauses', value: '100%', color: '#22d3ee' },
          { label: 'NPU Utilization', value: '94%', color: '#00f0ff' },
        ].map((s) => (
          <div key={s.label} style={{
            flex: '1 1 100px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '10px 14px',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#71717a', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
