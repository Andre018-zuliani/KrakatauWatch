import React from 'react';
import { 
  AlertTriangle, 
  Compass, 
  Flame, 
  Activity, 
  RefreshCw, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { VolcanoStatusLevel } from '../types.ts';

interface StatusBannerProps {
  currentLevel: VolcanoStatusLevel;
  proposedLevel: VolcanoStatusLevel;
  confidenceScore: number;
  precursor2018Score: number;
  radiusKm: number;
  onSimulateEruption: () => void;
  onResetNormal: () => void;
  onOpenReport: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  currentLevel,
  proposedLevel,
  confidenceScore,
  precursor2018Score,
  radiusKm,
  onSimulateEruption,
  onResetNormal,
  onOpenReport
}) => {
  const getLevelDetails = (level: VolcanoStatusLevel) => {
    switch (level) {
      case 'LEVEL_IV':
        return {
          name: 'LEVEL IV (AWAS)',
          desc: 'Erupsi paroksismal terus-menerus. Risiko gelombang tinggi akibat deformasi atau runtuhan kawah (flank collapse) sangat signifikan.',
          color: 'text-red-700 dark:text-red-400 border-red-300 dark:border-red-800',
          bg: 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800/60',
          dot: 'bg-red-600 dark:bg-red-500'
        };
      case 'LEVEL_III':
        return {
          name: 'LEVEL III (SIAGA)',
          desc: 'Tremor vulkanik menerus beramplitudo tinggi. Erupsi abu pekat berulang >1.000m. Larangan aktivitas radius 5 km dari kawah aktif.',
          color: 'text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60',
          dot: 'bg-amber-600 dark:bg-amber-500'
        };
      case 'LEVEL_II':
        return {
          name: 'LEVEL II (WASPADA)',
          desc: 'Peningkatan kegempaan vulkanik dan hembusan kawah. Radius bahaya 3 km dari pusat kawah.',
          color: 'text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
          bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-800/60',
          dot: 'bg-yellow-600 dark:bg-yellow-500'
        };
      case 'LEVEL_I':
      default:
        return {
          name: 'LEVEL I (NORMAL)',
          desc: 'Aktivitas visual dan seismik dalam batas fluktuasi dasar. Radius aman 2 km dari kawah.',
          color: 'text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60',
          dot: 'bg-emerald-600 dark:bg-emerald-500'
        };
    }
  };

  const levelInfo = getLevelDetails(currentLevel);

  return (
    <div id="status-banner-container" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
      <div className={`rounded-xl border p-4 sm:p-4.5 transition-colors shadow-sm ${levelInfo.bg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Main Status Indicators */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-xs tracking-wider border uppercase bg-white dark:bg-[#05140e] ${levelInfo.color}`}>
                <span className={`w-2 h-2 rounded-full ${levelInfo.dot}`} />
                STATUS RESMI: {levelInfo.name}
              </span>

              <div className="flex items-center gap-1 text-xs bg-white dark:bg-[#05140e] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-300 dark:border-emerald-900 font-mono shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Usulan Algoritma: <strong className="text-slate-900 dark:text-white font-semibold">{proposedLevel.replace('_', ' ')}</strong> ({confidenceScore.toFixed(1)}% conf)</span>
              </div>

              <div className="flex items-center gap-1 text-xs bg-white dark:bg-[#05140e] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-300 dark:border-emerald-900 font-mono shadow-xs">
                <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Kemiripan Prekursor 2018: <strong className="text-slate-900 dark:text-white font-semibold">{precursor2018Score.toFixed(1)}%</strong></span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {levelInfo.desc}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Zona Steril: <strong className="text-slate-900 dark:text-white">Radius {radiusKm} KM dari Kawah</strong>
              </span>
              <span>•</span>
              <span>Sektor: Selat Sunda (Lampung Selatan & Banten)</span>
              <span>•</span>
              <span>Otoritas Penetapan: PVMBG Badan Geologi</span>
            </div>
          </div>

          {/* Clean Action Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-300 dark:border-emerald-900/40">
            <button
              id="simulate-eruption-btn"
              onClick={onSimulateEruption}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 dark:bg-red-800/80 dark:hover:bg-red-700 text-white text-xs font-semibold border border-red-500/50 shadow-xs transition-colors"
              title="Uji coba kalkulasi respons saat terjadi erupsi paroksismal"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Simulasi Erupsi</span>
            </button>

            <button
              id="reset-normal-btn"
              onClick={onResetNormal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 dark:bg-[#05140e] dark:hover:bg-emerald-950 dark:border-emerald-800 dark:text-slate-200 dark:hover:text-white text-xs font-medium shadow-xs transition-colors"
              title="Kembalikan telemetri ke kondisi dasar"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kondisi Normal</span>
            </button>

            <button
              id="open-report-btn"
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-800/60 dark:hover:bg-emerald-700/80 border border-emerald-600 text-white text-xs font-medium shadow-xs transition-colors"
              title="Lihat format draf buletin PVMBG"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Draf Buletin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
