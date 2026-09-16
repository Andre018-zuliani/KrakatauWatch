import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Thermometer, 
  Scan, 
  Zap, 
  Video,
  Layers
} from 'lucide-react';
import { AshDetectionResult } from '../types.ts';

interface CCTVOverlayProps {
  ashData: AshDetectionResult;
  onRefreshFeed?: () => void;
}

export const CCTVOverlay: React.FC<CCTVOverlayProps> = ({ ashData }) => {
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);
  const [thermalMode, setThermalMode] = useState<boolean>(false);
  const [selectedCamera, setSelectedCamera] = useState<number>(1);
  const [frameTick, setFrameTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameTick(prev => (prev + 1) % 100);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const cameras = [
    { id: 1, name: 'Kawah Utama', loc: '0.8 km Kawah Aktif', fov: 'Tele 85mm' },
    { id: 2, name: 'Pulau Sertung', loc: '4.2 km Barat Laut', fov: 'Wide 24mm' },
    { id: 3, name: 'Pos Pasauran', loc: '42 km Pesisir Banten', fov: 'Optic 600mm' },
    { id: 4, name: 'Himawari-9 BTD', loc: 'Satelit Geostasioner', fov: 'Band 14 IR' }
  ];

  const getAshClassificationBadge = (cls: AshDetectionResult['classification']) => {
    switch (cls) {
      case 'ABU_TEBAL_ERUPSI':
        return { label: 'ABU TEBAL / ERUPSI', color: 'bg-red-950/60 text-red-300 border-red-800' };
      case 'ABU_SEDANG':
        return { label: 'ABU SEDANG', color: 'bg-amber-950/60 text-amber-300 border-amber-800' };
      case 'ABU_RINGAN':
        return { label: 'ABU RINGAN / GAS', color: 'bg-yellow-950/60 text-yellow-300 border-yellow-800' };
      case 'NO_ASH':
      default:
        return { label: 'NORMAL / TANPA ABU', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
    }
  };

  const badge = getAshClassificationBadge(ashData.classification);

  return (
    <div id="cctv-monitoring-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-xs transition-colors flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Observasi Visual & Deteksi Citra Kawah
              <span className="text-[10px] px-2 py-0.2 rounded bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/60 dark:text-red-200 dark:border-red-700/60 font-mono font-medium">
                LIVE TELEMETRI
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {cameras.find(c => c.id === selectedCamera)?.name} • {cameras.find(c => c.id === selectedCamera)?.loc}
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            id="toggle-ai-overlay-btn"
            onClick={() => setShowAiOverlay(!showAiOverlay)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              showAiOverlay
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white border-emerald-600'
                : 'bg-slate-100 dark:bg-[#05140e] text-slate-700 dark:text-slate-400 border-slate-300 dark:border-emerald-950 hover:bg-slate-200 dark:hover:text-slate-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Overlay Analisis: {showAiOverlay ? 'ON' : 'OFF'}</span>
          </button>

          <button
            id="toggle-thermal-btn"
            onClick={() => setThermalMode(!thermalMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              thermalMode
                ? 'bg-amber-700 dark:bg-amber-800 text-white border-amber-600'
                : 'bg-slate-100 dark:bg-[#05140e] text-slate-700 dark:text-slate-400 border-slate-300 dark:border-emerald-950 hover:bg-slate-200 dark:hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Kanal Termal: {thermalMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Camera Selector Tabs */}
      <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
        {cameras.map(cam => (
          <button
            key={cam.id}
            id={`camera-btn-${cam.id}`}
            onClick={() => setSelectedCamera(cam.id)}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap text-xs transition-colors ${
              selectedCamera === cam.id
                ? 'bg-emerald-700 dark:bg-emerald-800/80 text-white font-medium border border-emerald-600'
                : 'bg-slate-100 dark:bg-[#05140e] text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-slate-200 hover:dark:bg-emerald-950/60 border border-slate-300 dark:border-emerald-950'
            }`}
          >
            {cam.name}
          </button>
        ))}
      </div>

      {/* Camera Viewport */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-emerald-900/60 flex items-center justify-center select-none">
        {selectedCamera === 4 ? (
          // Satelit Himawari-9 BTD
          <div className="w-full h-full relative bg-[#061410] flex items-center justify-center">
            <div 
              className="w-44 h-44 rounded-full blur-xl opacity-75"
              style={{
                background: thermalMode 
                  ? 'radial-gradient(circle, rgba(220,38,38,0.85) 0%, rgba(217,119,6,0.6) 45%, rgba(16,185,129,0.15) 80%)'
                  : 'radial-gradient(circle, rgba(71,85,105,0.9) 0%, rgba(100,116,139,0.5) 50%, transparent 80%)'
              }}
            />
            <div className="absolute text-center text-xs font-mono text-emerald-400/90">
              <div>HIMAWARI-9 KANAL SPLIT-WINDOW BTD (BAND 14 - BAND 15)</div>
              <div className="text-[10px] text-slate-400 mt-1">Resolusi Spasial: 2.0 km • Pembaruan Interval: 10 Menit</div>
            </div>
          </div>
        ) : (
          // Optical Webcam Scene
          <div className={`w-full h-full relative overflow-hidden ${
            thermalMode 
              ? 'bg-gradient-to-t from-red-950/90 via-slate-900 to-indigo-950/80' 
              : 'bg-gradient-to-t from-[#061711] via-[#0b2118] to-[#112d22]'
          }`}>
            <svg 
              viewBox="0 0 1000 600" 
              className="absolute inset-0 w-full h-full object-cover" 
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Sea Water */}
              <rect x="0" y="440" width="1000" height="160" fill={thermalMode ? '#0a101d' : '#051610'} />
              <line x1="0" y1="440" x2="1000" y2="440" stroke={thermalMode ? '#f59e0b' : '#047857'} strokeWidth="1" opacity="0.3" />

              {/* Volcano Silhouette */}
              <polygon 
                points="240,460 380,310 460,260 520,260 620,330 760,460" 
                fill={thermalMode ? '#2e1065' : '#0a2318'} 
                stroke={thermalMode ? '#d946ef' : '#059669'} 
                strokeWidth="1.2"
              />
              
              {/* Crater Detail */}
              <polygon 
                points="450,265 470,278 510,278 530,265 490,260" 
                fill={thermalMode ? '#b91c1c' : '#0d2d20'} 
              />

              {/* Thermal Hotspot at Vent */}
              {thermalMode && (
                <circle cx="490" cy="272" r="12" fill="#ef4444" opacity="0.9" />
              )}

              {/* Erupting Ash Column */}
              <g opacity={ashData.classification === 'NO_ASH' ? 0.2 : 0.85}>
                <ellipse 
                  cx={490 - (frameTick % 6)} 
                  cy={240 - (frameTick % 4) * 2} 
                  rx={32} 
                  ry={26} 
                  fill={thermalMode ? '#ea580c' : '#334155'} 
                  opacity="0.85"
                />
                <ellipse 
                  cx={476 - (frameTick % 8)} 
                  cy={180 - (frameTick % 5) * 2} 
                  rx={50} 
                  ry={36} 
                  fill={thermalMode ? '#d97706' : '#475569'} 
                  opacity="0.75"
                />
                <ellipse 
                  cx={456 - (frameTick % 10)} 
                  cy={120 - (frameTick % 6) * 3} 
                  rx={78} 
                  ry={46} 
                  fill={thermalMode ? '#c026d3' : '#64748b'} 
                  opacity="0.65"
                />
              </g>
            </svg>
          </div>
        )}

        {/* Camera HUD Metadata (Top Left) */}
        <div className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-1.5 rounded border border-emerald-900 font-mono text-[10px] text-slate-300 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="font-semibold text-white">POS-CAM {selectedCamera}</span>
          </div>
          <div>FOV: {cameras.find(c => c.id === selectedCamera)?.fov}</div>
        </div>

        {/* Environmental HUD (Top Right) */}
        <div className="absolute top-2.5 right-2.5 bg-black/80 px-2.5 py-1.5 rounded border border-emerald-900 font-mono text-[10px] text-slate-300 text-right space-y-0.5">
          <div>SUHU KAWAH: <strong className="text-amber-400">{ashData.hotspotTempCelsius}°C</strong></div>
          <div>EST. TINGGI KOLOM: <strong className="text-white">{ashData.columnHeightMeters} M</strong></div>
          <div>KECEPATAN NAIK: {ashData.ascentVelocityMs} m/s</div>
        </div>

        {/* Bounding Box Overlay */}
        {showAiOverlay && (
          <div className="absolute inset-0 pointer-events-none p-4 flex items-center justify-center">
            <div 
              className="relative border border-emerald-400/80 bg-emerald-500/5 rounded"
              style={{
                width: '40%',
                height: '65%',
                transform: 'translate(-4%, -8%)'
              }}
            >
              {/* Corner Targets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-emerald-400" />

              {/* Bounding Box Label */}
              <div className="absolute -top-5 left-0 bg-[#05140e] px-1.5 py-0.5 rounded border border-emerald-700 text-[9px] font-mono text-emerald-300">
                CV-DETEKSI: KOLOM ABU [{ashData.confidenceScore.toFixed(1)}%]
              </div>

              <div className="absolute bottom-1.5 left-1.5 bg-[#05140e]/90 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300 border border-emerald-900">
                Densitas: {ashData.opticalDensityPercent}% • Arah: {ashData.directionVector}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400">Klasifikasi Emisi:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
          <span>Kepadatan Optik: <strong className="text-slate-900 dark:text-white">{ashData.opticalDensityPercent}%</strong></span>
          <span>BTD Split-Window: <strong className="text-amber-700 dark:text-amber-400">-{ashData.btdIndex.toFixed(1)} K</strong></span>
        </div>
      </div>
    </div>
  );
};
