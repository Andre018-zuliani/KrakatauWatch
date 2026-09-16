export type VolcanoStatusLevel = 'LEVEL_I' | 'LEVEL_II' | 'LEVEL_III' | 'LEVEL_IV';

export interface VolcanoStatusInfo {
  level: VolcanoStatusLevel;
  indonesianName: string; // Normal, Waspada, Siaga, Awas
  englishName: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  radiusKm: number;
  vonaColor: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  description: string;
}

export interface SeismicDataPoint {
  timestamp: string;
  amplitude: number; // in mm or mV
  frequency: number; // in Hz
  isAnomaly: boolean;
  anomalyType?: 'TREMOR_MENERUS' | 'VULKANIK_DANGKAL' | 'VULKANIK_DALAM' | 'HEMBUSAN';
}

export interface SeismicStats {
  rsam: number; // Real-time Seismic Amplitude Measurement
  dominantFrequency: number;
  tremorDurationMinutes: number;
  precursor2018Similarity: number; // 0 - 100%
  lastRecordedEvent: string;
  stationName: string;
  status: 'STABLE' | 'ELEVATED' | 'HIGH_ALERT' | 'CRITICAL';
}

export interface AshDetectionResult {
  detected: boolean;
  classification: 'NO_ASH' | 'ABU_RINGAN' | 'ABU_SEDANG' | 'ABU_TEBAL_ERUPSI';
  columnHeightMeters: number; // e.g. 1500 m dpl
  ascentVelocityMs: number; // e.g. 14.2 m/s
  opticalDensityPercent: number; // e.g. 78%
  colorIndex: string; // Kelabu kehitaman pekat
  directionVector: string; // Barat Daya (225°)
  confidenceScore: number; // e.g. 94.6%
  hotspotTempCelsius: number; // Thermal infrared detection
  btdIndex: number; // Brightness Temperature Difference (K)
}

export interface WeatherData {
  surfaceWindSpeedKts: number;
  surfaceWindDirDeg: number;
  fl100WindSpeedKts: number;
  fl100WindDirDeg: number;
  fl200WindSpeedKts: number;
  fl200WindDirDeg: number;
  rainfallMmPerHour: number;
  humidityPercent: number;
  airPressureHpa: number;
  temperatureCelsius: number;
  source: string;
  lastUpdated: string;
}

export interface AffectedZone {
  id: string;
  name: string;
  region: 'Banten' | 'Lampung Selatan' | 'Selat Sunda';
  distanceKm: number;
  direction: string;
  estimatedArrivalMinutes: number;
  impactLevel: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS';
  population: number;
  evacuationStatus: 'WASPADA' | 'SIAGA_EVAKUASI' | 'JALUR_DITUTUP';
  coordinates: { x: number; y: number }; // relative for fallback
  lat: number;
  lng: number;
  estWaveHeightMeters: number;
  safeZoneElevationMeters: number;
  evacuationRoute: string;
}

export interface TsunamiScenario {
  id: string;
  name: string;
  description: string;
  initialWaveHeightM: number;
  sourceType: 'LONGSORAN_LERENG' | 'GEMPA_TEKTONIK' | 'ERUPSI_PAROKSISMAL';
  energyEquivalent: string;
}

export interface AIReasoningOutput {
  summaryPetugas: string;
  summaryPublik: string;
  recommendedOfficialLevel: VolcanoStatusLevel;
  confidenceScore: number;
  actionRecommendations: {
    category: 'MARITIM' | 'PENERBANGAN' | 'EVAKUASI' | 'KESEHATAN' | 'INFRASTRUKTUR';
    title: string;
    description: string;
    priority: 'URGENT' | 'HIGH' | 'MEDIUM';
    sopReference: string;
  }[];
  officialDraftReport: {
    nomorLaporan: string;
    tanggalWaktuWIB: string;
    periodeEvaluasi: string;
    kesimpulanPengamatan: string;
    rekomendasiPVMBG: string;
    penandatanganDraft: string;
  };
  guardrailDisclaimer: string;
  humanVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  mode?: 'petugas' | 'publik';
  text: string;
  timestamp: string;
  sources?: {
    title: string;
    section: string;
    quote?: string;
  }[];
}

export interface MultiChannelAlert {
  id: string;
  type: 'SMS_CELL_BROADCAST' | 'PUSH_NOTIFICATION' | 'VONA_AVIATION' | 'SIREN_SYSTEM';
  timestamp: string;
  status: 'TERKIRIM' | 'TERJADWAL' | 'AKTIF' | 'SIAGA';
  targetAudience: string;
  title: string;
  body: string;
  recipientsCount?: number;
  coordinatesZone?: string;
}

export interface HistoryIncident {
  id: string;
  timestamp: string;
  title: string;
  category: 'ERUPSI' | 'SEISMIK' | 'CUACA' | 'VONA' | 'SOP';
  severity: 'INFO' | 'WARNING' | 'DANGER';
  details: string;
  plumeHeight?: number;
  rsamPeak?: number;
}

export interface SeismicIntensityLevel {
  mmi: number;
  roman: string;
  label: string;
  rsamRange: string;
  multiplier: number;
  color: string;
  description: string;
}

export interface InundationZoneCalculation {
  totalRadiusMeters: number;
  extremeZoneMeters: number;
  estRunupHeightM: number;
}
