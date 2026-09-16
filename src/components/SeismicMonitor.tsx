import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Radio, 
  BarChart2, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import { SeismicStats } from '../types.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface SeismicMonitorProps {
  stats: SeismicStats;
  isSimulatingEruption: boolean;
}

export const SeismicMonitor: React.FC<SeismicMonitorProps> = ({ stats, isSimulatingEruption }) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedStation, setSelectedStation] = useState<'KRAK01' | 'KRAK02' | 'KRAK03'>('KRAK01');
  const [gainLevel, setGainLevel] = useState<number>(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    const points: number[] = new Array(300).fill(0);

    const isLight = theme === 'light';

    const render = () => {
      step++;
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      const baseFreq = stats.dominantFrequency * 0.05;
      const noise = (Math.random() - 0.5) * 6;
      
      let currentAmp = 0;
      if (isSimulatingEruption || stats.status === 'CRITICAL' || stats.status === 'HIGH_ALERT') {
        const harmonic = Math.sin(step * baseFreq) * 24 * gainLevel;
        const subHarmonic = Math.sin(step * baseFreq * 0.5) * 14 * gainLevel;
        const burst = (step % 45 < 6) ? (Math.random() - 0.5) * 45 * gainLevel : 0;
        currentAmp = harmonic + subHarmonic + noise * gainLevel + burst;
      } else {
        currentAmp = Math.sin(step * 0.08) * 5 * gainLevel + noise * 1.2;
      }

      currentAmp = Math.max(-midY + 8, Math.min(midY - 8, currentAmp));
      points.push(currentAmp);
      if (points.length > width) {
        points.shift();
      }

      // Draw Seismograph Grid
      ctx.fillStyle = isLight ? '#f8fafc' : '#05140e';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = isLight ? '#e2e8f0' : '#0a2318';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Baseline
      ctx.strokeStyle = isLight ? '#cbd5e1' : '#14432f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Trace line
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      if (isLight) {
        ctx.strokeStyle = (isSimulatingEruption || stats.status === 'HIGH_ALERT') ? '#dc2626' : '#059669';
      } else {
        ctx.strokeStyle = (isSimulatingEruption || stats.status === 'HIGH_ALERT') ? '#ef4444' : '#10b981';
      }

      for (let i = 0; i < points.length; i++) {
        const x = (i / points.length) * width;
        const y = midY - points[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stats, gainLevel, isSimulatingEruption, theme]);

  return (
    <div id="seismic-monitor-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-xs transition-colors flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Seismogram Digital Stasiun BroadBand PVMBG
              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 font-mono">
                100 HZ CONTINUOUS
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Sensor: {selectedStation} • RSAM Rata-rata: {stats.rsam} unit
            </p>
          </div>
        </div>

        {/* Station Tabs & Gain Multiplier */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-100 dark:bg-[#05140e] p-0.5 rounded-lg border border-slate-300 dark:border-emerald-900/60 flex items-center">
            {(['KRAK01', 'KRAK02', 'KRAK03'] as const).map(st => (
              <button
                key={st}
                id={`station-${st}-btn`}
                onClick={() => setSelectedStation(st)}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                  selectedStation === st
                    ? 'bg-emerald-700 dark:bg-emerald-800 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#05140e] px-2 py-1 rounded-lg border border-slate-300 dark:border-emerald-900/60 text-xs text-slate-600 dark:text-slate-400">
            <span>Skala:</span>
            {[1, 2, 4].map(g => (
              <button
                key={g}
                onClick={() => setGainLevel(g)}
                className={`px-1 rounded text-[10px] font-mono ${
                  gainLevel === g ? 'bg-emerald-700 dark:bg-emerald-800 text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {g}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seismograph Viewport */}
      <div className="relative w-full h-44 sm:h-52 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-900/60">
        <canvas 
          ref={canvasRef} 
          width={700} 
          height={210} 
          className="w-full h-full object-cover"
        />

        {/* Telemetry HUD */}
        <div className="absolute top-2 left-2 bg-white/90 dark:bg-[#05140e]/90 px-2 py-1 rounded border border-slate-300 dark:border-emerald-900 text-[10px] font-mono text-slate-800 dark:text-slate-300 space-y-0.5 pointer-events-none shadow-xs">
          <div>STA: {selectedStation} (PVMBG)</div>
          <div>FREK DOMINAN: {stats.dominantFrequency} Hz (Harmonik)</div>
          <div>STATUS: <span className={stats.status === 'HIGH_ALERT' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>{stats.status}</span></div>
        </div>

        {/* Anomaly Label */}
        {(isSimulatingEruption || stats.status === 'HIGH_ALERT') && (
          <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-950/90 border border-red-300 dark:border-red-800 px-2.5 py-1 rounded text-[10px] font-mono text-red-800 dark:text-red-200 shadow-xs">
            ANOMALI: TREMOR VULKANIK MENERUS (OVERSCALE)
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-50 dark:bg-[#05140e] p-3 rounded-lg border border-slate-200 dark:border-emerald-950 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <span>Amplitudo Seismik (RSAM)</span>
            <BarChart2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {stats.rsam} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">unit</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Batas fluktuasi normal: &lt;400 unit
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-[#05140e] p-3 rounded-lg border border-slate-200 dark:border-emerald-950 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <span>Kemiripan Pola 2018</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-base font-bold text-amber-700 dark:text-amber-400 font-mono">
            {stats.precursor2018Similarity.toFixed(1)}% <span className="text-xs font-normal text-slate-500 dark:text-slate-400">korelasi</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Model time-series LSTM prekursor flank collapse
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-[#05140e] p-3 rounded-lg border border-slate-200 dark:border-emerald-950 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] mb-1">
            <span>Durasi Tremor Menerus</span>
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
            {stats.tremorDurationMinutes} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">menit</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Harmonik 2.8 Hz (pelepasan fluida magma dangkal)
          </p>
        </div>
      </div>
    </div>
  );
};
