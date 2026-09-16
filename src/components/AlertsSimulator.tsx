import React, { useState } from 'react';
import { 
  BellRing, 
  Smartphone, 
  Plane, 
  Volume2, 
  Send, 
  AlertTriangle,
  Clock,
  Copy,
  CheckCircle
} from 'lucide-react';
import { MultiChannelAlert, VolcanoStatusLevel } from '../types.ts';

interface AlertsSimulatorProps {
  currentLevel: VolcanoStatusLevel;
  onSendCustomAlert?: (alert: MultiChannelAlert) => void;
}

export const AlertsSimulator: React.FC<AlertsSimulatorProps> = () => {
  const [activeTab, setActiveTab] = useState<'sms' | 'push' | 'vona' | 'sirens'>('sms');
  const [copiedVona, setCopiedVona] = useState<boolean>(false);

  const [alertsHistory, setAlertsHistory] = useState<MultiChannelAlert[]>([
    {
      id: 'alt-01',
      type: 'SMS_CELL_BROADCAST',
      timestamp: '15:15 WIB',
      status: 'TERKIRIM',
      targetAudience: 'Geofence BTS: Pesisir Lampung Selatan & Pandeglang Banten (Radius 30 km)',
      title: 'PERINGATAN DINI KRAKATAU (LEVEL III SIAGA)',
      body: 'BPBD/PVMBG: Teramati peningkatan aktivitas erupsi G. Anak Krakatau. Dilarang mendekati kawah dalam radius 5 km. Siapkan masker pelindung. Pantau kanal resmi bnpb.go.id.',
      recipientsCount: 142850
    },
    {
      id: 'alt-02',
      type: 'VONA_AVIATION',
      timestamp: '15:10 WIB',
      status: 'TERKIRIM',
      targetAudience: 'AirNav Indonesia, ICAO Darwin VAAC, Maskapai Koridor Selat Sunda',
      title: 'VONA NOTICE CODE: ORANGE',
      body: 'Ash cloud observed to FL050 drifting South-West at 26 knots. ATS route W12 aircraft advised caution.',
      coordinatesZone: 'ATS Route W12 / Selat Sunda'
    }
  ]);

  const sirenStations = [
    { id: 'sir-1', name: 'Pasauran Pantai Anyer (Banten)', status: 'SIAGA_READY', battery: '98%', testDate: 'Hari Ini' },
    { id: 'sir-2', name: 'Carita Cinangka (Banten)', status: 'SIAGA_READY', battery: '95%', testDate: 'Hari Ini' },
    { id: 'sir-3', name: 'Labuan Menes (Pandeglang)', status: 'SIAGA_READY', battery: '94%', testDate: 'Hari Ini' },
    { id: 'sir-4', name: 'Kalianda Dermaga Bom (Lampung)', status: 'SIAGA_READY', battery: '99%', testDate: 'Hari Ini' },
    { id: 'sir-5', name: 'Rajabasa Canti (Lampung)', status: 'SIAGA_READY', battery: '92%', testDate: 'Hari Ini' },
    { id: 'sir-6', name: 'Bakauheni Pelabuhan (Lampung)', status: 'SIAGA_READY', battery: '100%', testDate: 'Hari Ini' },
  ];

  const vonaDocument = `
(1) VOLCANO: Anak Krakatau - 262000
(2) CURRENT CODE: ORANGE
(3) PREVIOUS CODE: YELLOW
(4) SOURCE: Krakatau Volcano Observatory (PVMBG)
(5) NOTICE NUMBER: 2026/09/AK-01
(6) LOCATION: 06°06'07"S 105°25'23"E, Sunda Strait, Indonesia
(7) ELEVATION: 157 m (515 FT)
(8) VOLCANIC ACTIVITY SUMMARY: Eruptive activity ongoing. Dense dark-gray ash plume continuously rising to estimated 1,450 m above sea level (~FL050). Continuous volcanic tremor recorded.
(9) VOLCANIC ASH CLOUD: Ash plume moving South-West (225 deg) at 26 kts (FL100).
(10) REMARKS: Maritime exclusion zone 5 km enforced. Hazard to ATS routes W12 and W15.
  `.trim();

  const handleCopyVona = () => {
    navigator.clipboard.writeText(vonaDocument);
    setCopiedVona(true);
    setTimeout(() => setCopiedVona(false), 2000);
  };

  const handleSendTestSms = () => {
    const newAlert: MultiChannelAlert = {
      id: `alt-${Date.now()}`,
      type: 'SMS_CELL_BROADCAST',
      timestamp: 'Baru saja',
      status: 'TERKIRIM',
      targetAudience: 'Simulasi Cell Broadcast Tower Telekomunikasi: Selat Sunda',
      title: 'UJI SISTEM CELL BROADCAST',
      body: 'KRAKATAUWATCH: Uji coba berkala transmisi peringatan dini mitigasi bencana. Informasi resmi PVMBG.',
      recipientsCount: 84200
    };
    setAlertsHistory(prev => [newAlert, ...prev]);
  };

  return (
    <div id="alerts-simulator-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-xs transition-colors flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-200 dark:border-emerald-950 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Pusat Notifikasi Multi-Kanal & Diseminasi Peringatan Dini
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              SMS Cell Broadcast Telekomunikasi • Buletin VONA ICAO • Jaringan Sirene Tsunami Pesisir
            </p>
          </div>
        </div>

        {/* Channel Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#05140e] p-0.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-xs">
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'sms' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS Broadcast</span>
          </button>
          <button
            onClick={() => setActiveTab('push')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'push' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Push Aplikasi</span>
          </button>
          <button
            onClick={() => setActiveTab('vona')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'vona' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>VONA Penerbangan</span>
          </button>
          <button
            onClick={() => setActiveTab('sirens')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'sirens' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sirene Pesisir</span>
          </button>
        </div>
      </div>

      {/* Tab 1: SMS Cell Broadcast */}
      {activeTab === 'sms' && (
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Simulasi Protokol Cell Broadcast Melalui Operator Telekomunikasi</span>
            <button
              id="send-test-sms-btn"
              onClick={handleSendTestSms}
              className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Kirim Uji Transmisi</span>
            </button>
          </div>

          <div className="max-w-md mx-auto bg-slate-100 dark:bg-black/80 p-4 rounded-xl border border-slate-200 dark:border-emerald-900 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono border-b border-slate-200 dark:border-emerald-950 pb-1.5">
              <span>BTS GEOFENCE: PESISIR SELAT SUNDA</span>
              <span>15:30 WIB</span>
            </div>

            <div className="bg-red-50 border border-red-300 text-red-950 dark:bg-red-950/40 dark:border-red-800 dark:text-white rounded-lg p-3 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <h4 className="font-semibold text-xs text-red-800 dark:text-red-200">PERINGATAN DARURAT BENCANA (PVMBG / BNPB)</h4>
              </div>
              <p className="text-xs text-red-900 dark:text-slate-200 leading-relaxed font-normal">
                G. ANAK KRAKATAU STATUS SIAGA (LEVEL III). Larangan beraktivitas dalam radius 5 km dari kawah aktif. Warga pesisir diimbau waspada dan menyiapkan masker pelindung.
              </p>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 flex justify-between pt-1 border-t border-red-200 dark:border-red-950 font-mono">
                <span>Kanal Prioritas: Siaga Bencana</span>
                <span>Cakupan: 30 km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Push Notification */}
      {activeTab === 'push' && (
        <div className="space-y-3 flex-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pratinjau notifikasi aplikasi bergerak pada perangkat petugas lapangan dan masyarakat terdaftar:
          </p>

          <div className="max-w-sm mx-auto bg-slate-50 dark:bg-[#05140e] p-3 rounded-lg border border-slate-200 dark:border-emerald-850 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="font-medium text-slate-900 dark:text-white">KrakatauWatch Mobile</span>
              <span>Baru saja</span>
            </div>
            <div className="font-semibold text-xs text-slate-900 dark:text-white">
              Anomali Erupsi Abu: Kolom 1.450 m dpl
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Analisis citra visual mendeteksi kolom abu tebal mengarah ke Barat Daya. Jalur pelayaran perikanan radius 5 km ditutup sementara.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: VONA (Penerbangan) */}
      {activeTab === 'vona' && (
        <div className="space-y-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-300 font-mono">Format ICAO Annex 3 VONA Advisory</span>
              <span className="px-2 py-0.2 rounded font-mono font-medium text-xs bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                KODE WARNA: ORANGE
              </span>
            </div>
            <button
              onClick={handleCopyVona}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 dark:bg-[#05140e] dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 text-xs border border-slate-300 dark:border-emerald-800 transition-colors shadow-xs"
            >
              {copiedVona ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedVona ? 'Tersalin' : 'Salin VONA'}</span>
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto select-all flex-1 shadow-xs">
            {vonaDocument}
          </pre>
        </div>
      )}

      {/* Tab 4: Sirene Laut */}
      {activeTab === 'sirens' && (
        <div className="space-y-2.5 flex-1">
          <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Status Kesiapan Menara Sirene Peringatan Dini Pesisir Selat Sunda:</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">6 / 6 Menara Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sirenStations.map(s => (
              <div key={s.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 flex items-center justify-between text-xs shadow-xs">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white text-[11px]">{s.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Baterai: {s.battery} • Uji Akustik: {s.testDate}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                  SIAGA
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riwayat Notifikasi */}
      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-emerald-950">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Log Transmisi Peringatan
        </h4>
        <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-xs font-mono">
          {alertsHistory.map(alt => (
            <div key={alt.id} className="p-1.5 rounded bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 flex items-center justify-between gap-2 shadow-xs">
              <div className="truncate">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">[{alt.timestamp}]</span>{' '}
                <span className="text-slate-900 dark:text-white">{alt.title}</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] dark:text-emerald-300 shrink-0 font-medium">
                {alt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
