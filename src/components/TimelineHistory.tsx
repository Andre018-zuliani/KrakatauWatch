import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Filter, 
  AlertOctagon, 
  Activity, 
  Plane, 
  CloudRain, 
  ShieldCheck
} from 'lucide-react';
import { HistoryIncident } from '../types.ts';

export const TimelineHistory: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ERUPSI' | 'SEISMIK' | 'VONA' | 'CUACA'>('ALL');

  const incidents: HistoryIncident[] = [
    {
      id: 'inc-01',
      timestamp: '15 Sep 2026, 15:15 WIB',
      title: 'Erupsi Kolom Abu Kelabu Tebal Teramati',
      category: 'ERUPSI',
      severity: 'DANGER',
      details: 'Tinggi kolom letusan mencapai 1.450 meter di atas puncak (±1.607 m dpl). Asap kawah berwarna kelabu pekat mengarah ke Barat Daya (225°).',
      plumeHeight: 1450,
      rsamPeak: 1840
    },
    {
      id: 'inc-02',
      timestamp: '15 Sep 2026, 15:02 WIB',
      title: 'Lonjakan Amplitudo Tremor Harmonik Menerus',
      category: 'SEISMIK',
      severity: 'WARNING',
      details: 'Sensor KRAK01 mencatat tremor harmonik kontinu beramplitudo overscale 48 mm dengan spektrum dominan 2.8 Hz. Model analisis mendeteksi indeks kemiripan 86.4% dengan fase awal erupsi paroksismal 2018.',
      rsamPeak: 1840
    },
    {
      id: 'inc-03',
      timestamp: '15 Sep 2026, 14:45 WIB',
      title: 'Penerbitan VONA: Color Code ORANGE',
      category: 'VONA',
      severity: 'WARNING',
      details: 'AirNav Indonesia dan VAAC Darwin menerima transmisi peringatan sebaran abu vulkanik di Selat Sunda yang melintasi koridor penerbangan ATS W12 pada elevasi FL050-FL100.',
    },
    {
      id: 'inc-04',
      timestamp: '15 Sep 2026, 14:00 WIB',
      title: 'Pergeseran Vektor Angin Lapisan FL100 ke Barat Daya',
      category: 'CUACA',
      severity: 'INFO',
      details: 'Data radar cuaca BMKG mencatat kecepatan angin bertiup 26 knot menuju sektor Barat Daya, mengarahkan abu menjauhi permukiman Anyer.',
    },
    {
      id: 'inc-05',
      timestamp: '15 Sep 2026, 12:30 WIB',
      title: 'Pemberlakuan Radius Sterilisasi 5 KM',
      category: 'SOP',
      severity: 'WARNING',
      details: 'PVMBG Pos Pasauran menegaskan status Level III (Siaga). Dilarang melakukan aktivitas mendekati pulau dalam radius 5 km.',
    },
    {
      id: 'inc-06',
      timestamp: '15 Sep 2026, 09:15 WIB',
      title: 'Peningkatan Gempa Vulkanik Dalam (VA)',
      category: 'SEISMIK',
      severity: 'INFO',
      details: 'Tercatat 12 kejadian gempa vulkanik dalam dengan durasi 14–22 detik mengindikasikan migrasi fluida magmatik dari kedalaman.',
      rsamPeak: 720
    }
  ];

  const filteredIncidents = selectedFilter === 'ALL' 
    ? incidents 
    : incidents.filter(i => i.category === selectedFilter);

  const handleExportHistory = () => {
    const lines = [
      '======================================================================',
      'KRAKATAUWATCH: LOG AUDIT KEJADIAN & AKTIVITAS GUNUNG ANAK KRAKATAU',
      'Tanggal Ekspor: 15 September 2026 | Dokumen Resmi PVMBG / BNPB',
      '======================================================================\n',
      ...incidents.map(i => `[${i.timestamp}] [${i.category}] [STATUS: ${i.severity}]\nJudul: ${i.title}\nKeterangan: ${i.details}\n${i.plumeHeight ? `Tinggi Kolom: ${i.plumeHeight} m dpl | ` : ''}${i.rsamPeak ? `RSAM Peak: ${i.rsamPeak} unit` : ''}\n----------------------------------------------------------------------`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KrakatauWatch_Log_15Sep2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: HistoryIncident['category']) => {
    switch (category) {
      case 'ERUPSI': return <AlertOctagon className="w-4 h-4 text-red-400" />;
      case 'SEISMIK': return <Activity className="w-4 h-4 text-amber-400" />;
      case 'VONA': return <Plane className="w-4 h-4 text-blue-400" />;
      case 'CUACA': return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'SOP':
      default: return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div id="timeline-history-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-xs transition-colors flex flex-col h-full">
      {/* Header & Export button */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-200 dark:border-emerald-950 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Log Kronologi Kejadian & Audit Trail
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Perekaman Otomatis Kejadian Erupsi, Dinamika Tremor, dan Buletin Mitigasi
            </p>
          </div>
        </div>

        <button
          id="export-log-btn"
          onClick={handleExportHistory}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#05140e] dark:hover:bg-emerald-950 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs font-medium border border-slate-300 dark:border-emerald-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Ekspor Berkas (.txt)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-0.5 text-xs">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 px-1">
          <Filter className="w-3 h-3" /> Filter Kategori:
        </span>
        {(['ALL', 'ERUPSI', 'SEISMIK', 'VONA', 'CUACA'] as const).map(f => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              selectedFilter === f
                ? 'bg-emerald-700 text-white font-medium shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950'
            }`}
          >
            {f === 'ALL' ? 'Semua Kategori' : f}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[440px] pr-1">
        {filteredIncidents.map(item => (
          <div 
            key={item.id}
            className="p-3 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 hover:border-slate-300 dark:hover:border-emerald-850 transition-colors space-y-1 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(item.category)}
                <span className="font-semibold text-xs text-slate-900 dark:text-white">{item.title}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {item.timestamp}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.details}
            </p>

            {(item.plumeHeight || item.rsamPeak) && (
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-emerald-950">
                {item.plumeHeight && <span>KOLOM: <strong className="text-slate-900 dark:text-white">{item.plumeHeight} m dpl</strong></span>}
                {item.rsamPeak && <span>RSAM: <strong className="text-slate-900 dark:text-white">{item.rsamPeak} unit</strong></span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
