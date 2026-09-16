import React, { useState } from 'react';
import { 
  Activity, 
  Compass, 
  BrainCircuit, 
  Bot, 
  BellRing, 
  Radio, 
  X, 
  FileText, 
  Copy, 
  CheckCircle,
  Waves
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { StatusBanner } from './components/StatusBanner.tsx';
import { CCTVOverlay } from './components/CCTVOverlay.tsx';
import { DispersionMap } from './components/DispersionMap.tsx';
import { SeismicMonitor } from './components/SeismicMonitor.tsx';
import { ThermalWeatherSensors } from './components/ThermalWeatherSensors.tsx';
import { AIReasoningPanel } from './components/AIReasoningPanel.tsx';
import { RAGChatbot } from './components/RAGChatbot.tsx';
import { AlertsSimulator } from './components/AlertsSimulator.tsx';
import { TimelineHistory } from './components/TimelineHistory.tsx';
import { Footer } from './components/Footer.tsx';

import { 
  VolcanoStatusLevel, 
  AshDetectionResult, 
  SeismicStats, 
  WeatherData, 
  AffectedZone, 
  AIReasoningOutput 
} from './types.ts';
import { COASTAL_ZONES_GPS } from './data/tsunamiData.ts';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'monitoring' | 'dispersion' | 'seismic' | 'reasoning' | 'chatbot' | 'alerts' | 'history'>('monitoring');

  // Volcano Monitoring State
  const [currentLevel, setCurrentLevel] = useState<VolcanoStatusLevel>('LEVEL_III');
  const [proposedLevel, setProposedLevel] = useState<VolcanoStatusLevel>('LEVEL_III');
  const [confidenceScore, setConfidenceScore] = useState<number>(88.5);
  const [precursor2018Score, setPrecursor2018Score] = useState<number>(86.4);
  const [isSimulatingEruption, setIsSimulatingEruption] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportCopied, setReportCopied] = useState<boolean>(false);
  const [isLoadingReasoning, setIsLoadingReasoning] = useState<boolean>(false);

  // Ash Detection State
  const [ashData, setAshData] = useState<AshDetectionResult>({
    columnHeightMeters: 1450,
    confidenceScore: 92.4,
    classification: 'ABU_TEBAL_ERUPSI',
    ascentVelocityMs: 14.2,
    opticalDensityPercent: 84,
    hotspotTempCelsius: 385,
    btdIndex: -3.8,
    directionVector: 'Barat Daya (225°)'
  });

  // Seismic Sensor State
  const [seismicStats, setSeismicStats] = useState<SeismicStats>({
    rsam: 1840,
    dominantFrequency: 2.8,
    tremorDurationMinutes: 142,
    precursor2018Similarity: 86.4,
    status: 'HIGH_ALERT'
  });

  // Weather & Dispersion State
  const [weatherData] = useState<WeatherData>({
    surfaceWindSpeedKts: 12,
    surfaceWindDirDeg: 215,
    fl100WindSpeedKts: 26,
    fl100WindDirDeg: 225,
    fl200WindSpeedKts: 34,
    fl200WindDirDeg: 230,
    airPressureHpa: 1008.2,
    humidityPercent: 88,
    rainfallMmPerHour: 4.2
  });

  // Coastal Settlements Affected (9 GPS Coastal Stations around Sunda Strait)
  const [affectedZones] = useState<AffectedZone[]>(COASTAL_ZONES_GPS);

  // AI Reasoning & Action Recommendations State
  const [reasoningData, setReasoningData] = useState<AIReasoningOutput>({
    summaryPetugas: 'Aktivitas vulkanik Gunung Anak Krakatau menunjukkan eskalasi signifikan. Rekaman seismik didominasi tremor vulkanik menerus beramplitudo overscale (>48 mm) dengan frekuensi dominan 2.8 Hz, mengindikasikan pelepasan fluida magma dangkal ke saluran kawah. Citra kamera termal FLIR mendeteksi anomali suhu kawah 385°C serta semburan kolom abu kelabu pekat setinggi 1.450 meter. Indeks kemiripan sinyal dengan fase awal erupsi paroksismal Desember 2018 tercatat mencapai 86.4%, menandakan potensi risiko ketidakstabilan lereng (flank collapse) di sektor Barat Daya.',
    summaryPublik: 'Gunung Anak Krakatau saat ini berada dalam tingkat aktivitas SIAGA (Level III). Terjadi letusan abu vulkanik tebal yang membubung setinggi 1.450 meter di atas kawah dan bergerak ke arah Barat Daya. Seluruh wisatawan, nelayan, dan masyarakat dilarang mendekati pulau dalam radius 5 kilometer. Wilayah pesisir Banten (Anyer, Carita) dan Lampung Selatan saat ini masih berada di luar radius bahaya langsung, namun warga diimbau menyiapkan masker medis dan memantau rilis resmi PVMBG dan BMKG.',
    actionRecommendations: [
      {
        category: 'MARITIM',
        title: 'Sterilisasi Total Pelayaran Radius 5 KM',
        description: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP) Banten & Lampung menutup jalur pelayaran perahu wisata dan nelayan dalam radius 5 km dari pusat kawah.',
        priority: 'URGENT',
        sopReference: 'SOP PVMBG No. 04/2023 (Status Siaga)'
      },
      {
        category: 'PENERBANGAN',
        title: 'Penerbitan VONA & NOTAM Jalur ATS W12',
        description: 'Ketinggian kolom abu mencapai 1.450 m dpl (FL050) dengan sebaran ke arah Barat Daya. Terbitkan peringatan VONA Orange bagi maskapai rute Cengkareng-Sumatera.',
        priority: 'HIGH',
        sopReference: 'ICAO Annex 3 VONA Protocols'
      },
      {
        category: 'EVAKUASI',
        title: 'Aktivasi Kesiapsiagaan BPBD Lampung & Banten',
        description: 'Persiapkan Tempat Evakuasi Sementara (TES) di zona perbukitan Rajabasa dan Labuan. Lakukan pengecekan berkala sirene peringatan dini pantai.',
        priority: 'HIGH',
        sopReference: 'Perka BNPB No. 02/2012 Pedoman KRB'
      },
      {
        category: 'KESEHATAN',
        title: 'Distribusi Masker & Filter Udara di P. Sebesi',
        description: 'Potensi hujan abu lebat mengarah ke sektor Barat-Barat Daya. Dinas Kesehatan distribusikan 10.000 masker N95/bedah untuk antisipasi ISPA.',
        priority: 'NORMAL',
        sopReference: 'Pedoman Tanggap Darurat Abu Kemenkes RI'
      }
    ],
    officialDraftReport: {
      nomorLaporan: 'LAP-PVMBG/GAK/2026-09-15/003',
      tanggalWaktuWIB: '15 September 2026, 15:30 WIB',
      periodeEvaluasi: 'Pukul 06:00 - 15:00 WIB (9 Jam Pengamatan)',
      kesimpulanPengamatan: 'Tingkat aktivitas Gunung Anak Krakatau tetap pada LEVEL III (SIAGA). Teramati peningkatan gempa tremor menerus dan letusan abu tebal setinggi 1.450 m dpl mengarah ke Barat Daya. Pemantauan potensi bahaya deformasi lereng kawah tetap dilakukan secara kontinu.',
      rekomendasiPVMBG: '1. Masyarakat dan wisatawan tidak diperbolehkan mendekati kawah dalam radius 5 km.\n2. Warga pesisir diimbau tetap tenang dan hanya memantau kanal resmi PVMBG dan BMKG.\n3. Operator penerbangan mematuhi advisory VONA.',
      penandatanganDraft: 'Ketua Tim Pengamatan Gunungapi Selat Sunda (PVMBG)'
    },
    humanVerified: false,
    verifiedBy: undefined,
    verifiedAt: undefined,
    guardrailDisclaimer: 'Keputusan resmi status gunung api dan penetapan tanggap darurat bencana sepenuhnya berada di bawah wewenang PVMBG Badan Geologi dan BNPB.'
  });

  // Fetch AI Reasoning from server
  const fetchReasoning = async (level: VolcanoStatusLevel = currentLevel) => {
    setIsLoadingReasoning(true);
    try {
      const response = await fetch('/api/gemini/reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusLevel: level,
          ash: ashData,
          seismic: seismicStats,
          weather: weatherData
        })
      });

      if (response.ok) {
        const raw = await response.json();
        const data: AIReasoningOutput = (raw && raw.data) ? raw.data : raw;
        if (data && data.officialDraftReport) {
          setReasoningData(data);
        }
      }
    } catch (_err) {
      // Quietly retain existing reasoning data or fallback
    } finally {
      setIsLoadingReasoning(false);
    }
  };

  // Human Operator Verification Handler
  const handleVerifyHuman = () => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setReasoningData(prev => ({
      ...prev,
      humanVerified: true,
      verifiedBy: 'Ir. Ahmad Subandrio, M.Sc. (Koordinator Pos Pasauran PVMBG)',
      verifiedAt: `${timeNow} WIB`
    }));
  };

  // Quick Simulation Triggers
  const handleSimulateEruption = () => {
    setIsSimulatingEruption(true);
    setCurrentLevel('LEVEL_IV');
    setProposedLevel('LEVEL_IV');
    setConfidenceScore(95.8);
    setPrecursor2018Score(94.2);

    setAshData(prev => ({
      ...prev,
      columnHeightMeters: 3200,
      classification: 'ABU_TEBAL_ERUPSI',
      ascentVelocityMs: 28.5,
      opticalDensityPercent: 96,
      hotspotTempCelsius: 580,
      btdIndex: -5.4
    }));

    setSeismicStats({
      rsam: 3450,
      dominantFrequency: 3.1,
      tremorDurationMinutes: 280,
      precursor2018Similarity: 94.2,
      status: 'CRITICAL'
    });

    fetchReasoning('LEVEL_IV');
  };

  const handleResetNormal = () => {
    setIsSimulatingEruption(false);
    setCurrentLevel('LEVEL_I');
    setProposedLevel('LEVEL_I');
    setConfidenceScore(94.0);
    setPrecursor2018Score(12.5);

    setAshData({
      columnHeightMeters: 50,
      confidenceScore: 95.0,
      classification: 'NO_ASH',
      ascentVelocityMs: 1.2,
      opticalDensityPercent: 8,
      hotspotTempCelsius: 75,
      btdIndex: 1.2,
      directionVector: 'Tenang'
    });

    setSeismicStats({
      rsam: 240,
      dominantFrequency: 1.4,
      tremorDurationMinutes: 0,
      precursor2018Similarity: 12.5,
      status: 'NORMAL'
    });

    fetchReasoning('LEVEL_I');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. Navbar */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab}
        currentLevel={currentLevel}
      />

      {/* 2. Top Volcanic Status Alert Banner */}
      <StatusBanner 
        currentLevel={currentLevel}
        proposedLevel={proposedLevel}
        confidenceScore={confidenceScore}
        precursor2018Score={precursor2018Score}
        radiusKm={currentLevel === 'LEVEL_IV' ? 7 : currentLevel === 'LEVEL_III' ? 5 : currentLevel === 'LEVEL_II' ? 3 : 2}
        onSimulateEruption={handleSimulateEruption}
        onResetNormal={handleResetNormal}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* 3. Main Dynamic Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 space-y-4">
        {/* Weather & Satellite Sensor Strip */}
        <ThermalWeatherSensors 
          weather={weatherData}
          ash={ashData}
        />

        {/* Tab 1: Live Monitoring (Comprehensive dashboard) */}
        {activeTab === 'monitoring' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* CCTV Feed & Visual Detection */}
              <div className="min-h-[400px]">
                <CCTVOverlay 
                  ashData={ashData} 
                  onRefreshFeed={() => {}}
                />
              </div>

              {/* Seismograph & Precursor Anomaly */}
              <div className="min-h-[400px]">
                <SeismicMonitor 
                  stats={seismicStats}
                  isSimulatingEruption={isSimulatingEruption}
                />
              </div>
            </div>

            {/* Ash Dispersion & Affected Zone Map */}
            <div className="min-h-[440px]">
              <DispersionMap 
                weather={weatherData}
                affectedZones={affectedZones}
                exclusionRadiusKm={currentLevel === 'LEVEL_IV' ? 7 : 5}
                seismicStats={seismicStats}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Map Sebaran Abu (Dedicated full screen view) */}
        {activeTab === 'dispersion' && (
          <div className="space-y-4">
            <DispersionMap 
              weather={weatherData}
              affectedZones={affectedZones}
              exclusionRadiusKm={currentLevel === 'LEVEL_IV' ? 7 : 5}
              seismicStats={seismicStats}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Seismogram View */}
        {activeTab === 'seismic' && (
          <div className="space-y-4">
            <SeismicMonitor 
              stats={seismicStats}
              isSimulatingEruption={isSimulatingEruption}
            />
          </div>
        )}

        {/* Tab 4: LLM Reasoning & Action Recommendations */}
        {activeTab === 'reasoning' && (
          <div className="space-y-4">
            <AIReasoningPanel 
              reasoningData={reasoningData}
              isLoading={isLoadingReasoning}
              onRefreshReasoning={() => fetchReasoning()}
              onVerifyHuman={handleVerifyHuman}
            />
          </div>
        )}

        {/* Tab 5: RAG Chatbot Knowledge Assistant */}
        {activeTab === 'chatbot' && (
          <div className="space-y-4">
            <RAGChatbot />
          </div>
        )}

        {/* Tab 6: Multi-Channel Alerts Console */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <AlertsSimulator 
              currentLevel={currentLevel}
            />
          </div>
        )}

        {/* Tab 7: Riwayat & Log Audit */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <TimelineHistory />
          </div>
        )}
      </main>

      {/* 4. Footer with required watermark */}
      <Footer />

      {/* 5. Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#05140e]/95 backdrop-blur-xs border-t border-slate-200 dark:border-emerald-950 px-2 py-1.5 flex items-center justify-around text-[10px] font-medium transition-colors shadow-lg">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'monitoring' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Activity className="w-4 h-4" />
          <span>Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab('dispersion')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'dispersion' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Waves className="w-4 h-4" />
          <span>Peta Tsunami</span>
        </button>

        <button
          onClick={() => setActiveTab('seismic')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'seismic' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Radio className="w-4 h-4" />
          <span>Seismik</span>
        </button>

        <button
          onClick={() => setActiveTab('reasoning')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'reasoning' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Sintesis</span>
        </button>

        <button
          onClick={() => setActiveTab('chatbot')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'chatbot' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Bot className="w-4 h-4" />
          <span>SOP</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'alerts' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <BellRing className="w-4 h-4" />
          <span>Peringatan</span>
        </button>
      </div>

      {/* Modal: Official Draft Report Dialog */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071912] border border-slate-200 dark:border-emerald-800 rounded-xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-950 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">Draf Buletin Pengamatan PVMBG</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2.5 leading-relaxed shadow-xs">
              <div className="text-center border-b border-slate-200 dark:border-emerald-950 pb-2 text-slate-900 dark:text-white">
                <div className="font-bold text-xs">PUSAT VULKANOLOGI DAN MITIGASI BENCANA GEOLOGI</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400">BADAN GEOLOGI - KEMENTERIAN ENERGI DAN SUMBER DAYA MINERAL</div>
              </div>

              <div>
                <strong>NOMOR BULETIN:</strong> {reasoningData.officialDraftReport.nomorLaporan}<br />
                <strong>WAKTU PEMBARUAN:</strong> {reasoningData.officialDraftReport.tanggalWaktuWIB}<br />
                <strong>STATUS AKTIVITAS:</strong> {currentLevel.replace('_', ' ')}
              </div>

              <div>
                <strong className="text-emerald-700 dark:text-emerald-400">KESIMPULAN PENGAMATAN MULTI-SENSOR:</strong>
                <p className="text-slate-700 dark:text-slate-300 mt-1">{reasoningData.officialDraftReport.kesimpulanPengamatan}</p>
              </div>

              <div>
                <strong className="text-emerald-700 dark:text-emerald-400">REKOMENDASI STERILISASI:</strong>
                <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-line">{reasoningData.officialDraftReport.rekomendasiPVMBG}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                <span>Penandatangan: <strong className="text-slate-900 dark:text-white">{reasoningData.officialDraftReport.penandatanganDraft}</strong></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">TERVALIDASI SISTEM</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  const text = `
PUSAT VULKANOLOGI DAN MITIGASI BENCANA GEOLOGI
NOMOR: ${reasoningData.officialDraftReport.nomorLaporan}
WAKTU: ${reasoningData.officialDraftReport.tanggalWaktuWIB}
STATUS: ${currentLevel.replace('_', ' ')}

KESIMPULAN:
${reasoningData.officialDraftReport.kesimpulanPengamatan}

REKOMENDASI:
${reasoningData.officialDraftReport.rekomendasiPVMBG}

Penandatangan: ${reasoningData.officialDraftReport.penandatanganDraft}
                  `.trim();
                  navigator.clipboard.writeText(text);
                  setReportCopied(true);
                  setTimeout(() => setReportCopied(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#05140e] dark:hover:bg-emerald-950 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs font-medium border border-slate-300 dark:border-emerald-800 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {reportCopied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{reportCopied ? 'Tersalin' : 'Salin Laporan'}</span>
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
