import { TsunamiScenario, AffectedZone, SeismicIntensityLevel, InundationZoneCalculation } from '../types.ts';

export const TSUNAMI_SCENARIOS: TsunamiScenario[] = [
  {
    id: 'kasus_2018',
    name: 'Longsoran Lereng Sektor Barat Daya (Flank Collapse 64 Juta m³)',
    description: 'Runtuhnya ~64 juta meter kubik material lereng barat daya Gunung Anak Krakatau ke laut secara mendadak (Analog Erupsi 22 Desember 2018). Memicu gelombang tsunami non-tektonik tanpa sinyal peringatan gempa awal yang kuat.',
    initialWaveHeightM: 14.5,
    sourceType: 'LONGSORAN_LERENG',
    energyEquivalent: 'Setara energi kinetik 8.4 x 10^14 Joule'
  },
  {
    id: 'gempa_tektonik',
    name: 'Gempa Sesar Aktif Graben Selat Sunda (M 6.9, Kedalaman 10 km)',
    description: 'Patahan sesar normal ekstensional di graben Selat Sunda dekat kompleks Krakatau, memicu dislokasi vertikal batimetri laut dangkal.',
    initialWaveHeightM: 11.2,
    sourceType: 'GEMPA_TEKTONIK',
    energyEquivalent: 'Momen Seismik Mw 6.9'
  },
  {
    id: 'erupsi_paroksismal',
    name: 'Erupsi Kolaps Kaldera Paroksismal (Freatomagmatik Masif VEI 4+)',
    description: 'Ledakan hidrovulkanik dahsyat akibat percampuran magma bersuhu >1000°C dengan volume air laut masif di saluran kawah, memicu gelombang kejut dan runtuhan kaldera.',
    initialWaveHeightM: 16.8,
    sourceType: 'ERUPSI_PAROKSISMAL',
    energyEquivalent: 'Indeks Letusan Vulkanik VEI 4+'
  }
];

export const COASTAL_ZONES_GPS: AffectedZone[] = [
  {
    id: 'zn-01',
    name: 'Pulau Sebesi',
    region: 'Lampung Selatan',
    distanceKm: 18.5,
    direction: 'Utara',
    estimatedArrivalMinutes: 14,
    impactLevel: 'KRITIS',
    population: 2850,
    evacuationStatus: 'SIAGA_EVAKUASI',
    coordinates: { x: 380, y: 140 },
    lat: -5.9620,
    lng: 105.4975,
    estWaveHeightMeters: 8.8,
    safeZoneElevationMeters: 30,
    evacuationRoute: 'Mendaki ke arah Perbukitan Gunung Sebesi (elevasi >50 mdpl)'
  },
  {
    id: 'zn-02',
    name: 'Pantai Pasauran / Anyer',
    region: 'Banten',
    distanceKm: 42.0,
    direction: 'Timur - Timur Laut',
    estimatedArrivalMinutes: 33,
    impactLevel: 'TINGGI',
    population: 48900,
    evacuationStatus: 'SIAGA_EVAKUASI',
    coordinates: { x: 670, y: 310 },
    lat: -6.0520,
    lng: 105.8850,
    estWaveHeightMeters: 4.8,
    safeZoneElevationMeters: 25,
    evacuationRoute: 'Jalur Evakuasi Jl. Raya Anyer menjauh 1.5 km ke perbukitan Mancak'
  },
  {
    id: 'zn-03',
    name: 'Kecamatan Rajabasa & Way Muli',
    region: 'Lampung Selatan',
    distanceKm: 34.2,
    direction: 'Barat Laut',
    estimatedArrivalMinutes: 31,
    impactLevel: 'KRITIS',
    population: 24300,
    evacuationStatus: 'SIAGA_EVAKUASI',
    coordinates: { x: 230, y: 190 },
    lat: -5.7350,
    lng: 105.5890,
    estWaveHeightMeters: 6.2,
    safeZoneElevationMeters: 35,
    evacuationRoute: 'Evakuasi lereng Gunung Rajabasa (titik kumpul Desa Canti / Kunjir atas)'
  },
  {
    id: 'zn-04',
    name: 'Pantai Carita & Labuan',
    region: 'Banten',
    distanceKm: 46.5,
    direction: 'Tenggara',
    estimatedArrivalMinutes: 37,
    impactLevel: 'TINGGI',
    population: 62400,
    evacuationStatus: 'SIAGA_EVAKUASI',
    coordinates: { x: 650, y: 440 },
    lat: -6.3010,
    lng: 105.8340,
    estWaveHeightMeters: 5.4,
    safeZoneElevationMeters: 25,
    evacuationRoute: 'Evakuasi ke arah Hutan Wisata Perhutani Carita & Bukit Sukarame'
  },
  {
    id: 'zn-05',
    name: 'Kecamatan Panimbang & Labuan',
    region: 'Banten',
    distanceKm: 50.0,
    direction: 'Tenggara',
    estimatedArrivalMinutes: 42,
    impactLevel: 'TINGGI',
    population: 41200,
    evacuationStatus: 'SIAGA_EVAKUASI',
    coordinates: { x: 640, y: 490 },
    lat: -6.3850,
    lng: 105.8280,
    estWaveHeightMeters: 4.1,
    safeZoneElevationMeters: 20,
    evacuationRoute: 'Evakuasi ke arah perbukitan Tarogong & Kompleks Kantor Camat Labuan'
  },
  {
    id: 'zn-06',
    name: 'Kawasan Wisata Tanjung Lesung',
    region: 'Banten',
    distanceKm: 46.0,
    direction: 'Selatan - Tenggara',
    estimatedArrivalMinutes: 39,
    impactLevel: 'SEDANG',
    population: 15800,
    evacuationStatus: 'WASPADA',
    coordinates: { x: 590, y: 530 },
    lat: -6.4820,
    lng: 105.6580,
    estWaveHeightMeters: 3.8,
    safeZoneElevationMeters: 20,
    evacuationRoute: 'Evakuasi darat ke area bukit Cikadu dan Desa Tanjungjaya atas'
  },
  {
    id: 'zn-07',
    name: 'Pelabuhan ASDP Bakauheni',
    region: 'Lampung Selatan',
    distanceKm: 41.5,
    direction: 'Utara - Timur Laut',
    estimatedArrivalMinutes: 46,
    impactLevel: 'SEDANG',
    population: 18500,
    evacuationStatus: 'WASPADA',
    coordinates: { x: 420, y: 80 },
    lat: -5.8670,
    lng: 105.7530,
    estWaveHeightMeters: 2.6,
    safeZoneElevationMeters: 20,
    evacuationRoute: 'Evakuasi ke Menara Siger Lampung (elevasi 110 mdpl)'
  },
  {
    id: 'zn-08',
    name: 'Pelabuhan Feri Merak',
    region: 'Banten',
    distanceKm: 58.0,
    direction: 'Timur Laut',
    estimatedArrivalMinutes: 54,
    impactLevel: 'SEDANG',
    population: 32400,
    evacuationStatus: 'WASPADA',
    coordinates: { x: 730, y: 190 },
    lat: -5.9320,
    lng: 105.9980,
    estWaveHeightMeters: 1.8,
    safeZoneElevationMeters: 15,
    evacuationRoute: 'Evakuasi dermaga feri menuju Jl. Terusan Tol Cilegon Barat / Bukit Grogol'
  },
  {
    id: 'zn-09',
    name: 'Taman Nasional Ujung Kulon',
    region: 'Banten',
    distanceKm: 54.0,
    direction: 'Barat Daya',
    estimatedArrivalMinutes: 48,
    impactLevel: 'SEDANG',
    population: 3200,
    evacuationStatus: 'WASPADA',
    coordinates: { x: 310, y: 560 },
    lat: -6.5500,
    lng: 105.2100,
    estWaveHeightMeters: 3.2,
    safeZoneElevationMeters: 25,
    evacuationRoute: 'Pusat konservasi & pos jaga Taman Jaya menuju perbukitan Honje'
  }
];

export interface TelemetrySensorStation {
  id: string;
  name: string;
  type: 'TIDE_GAUGE' | 'BUOY' | 'SEISMOMETER';
  lat: number;
  lng: number;
  provider: 'BMKG' | 'BIG' | 'PVMBG';
  status: 'ONLINE' | 'STANDBY';
  currentReading: string;
}

export const TELEMETRY_STATIONS: TelemetrySensorStation[] = [
  {
    id: 'tg-01',
    name: 'Tide Gauge Marina Jasa Kartini Anyer',
    type: 'TIDE_GAUGE',
    lat: -6.0580,
    lng: 105.8820,
    provider: 'BIG',
    status: 'ONLINE',
    currentReading: 'Elevasi Permukaan: +0.42 m (Normal pasang surut)'
  },
  {
    id: 'tg-02',
    name: 'Tide Gauge Ciwandan Cilegon',
    type: 'TIDE_GAUGE',
    lat: -6.0120,
    lng: 105.9520,
    provider: 'BIG',
    status: 'ONLINE',
    currentReading: 'Elevasi Permukaan: +0.38 m'
  },
  {
    id: 'buoy-01',
    name: 'InaTWS Deep Ocean Tsunami Buoy #03',
    type: 'BUOY',
    lat: -6.0200,
    lng: 105.3500,
    provider: 'BMKG',
    status: 'ONLINE',
    currentReading: 'Sensor Tekanan BPR: 14.82 bar (Stabil)'
  },
  {
    id: 'seis-krak',
    name: 'Stasiun Seismik KRAK01 Pulau Sertung',
    type: 'SEISMOMETER',
    lat: -6.0940,
    lng: 105.3880,
    provider: 'PVMBG',
    status: 'ONLINE',
    currentReading: 'Tremor Amplitudo: 32 mm kontinu'
  }
];

export const SEISMIC_INTENSITY_LEVELS: SeismicIntensityLevel[] = [
  {
    mmi: 4,
    roman: 'IV',
    label: 'Ringan (Tremor Lemah)',
    rsamRange: '< 2.000 mV',
    multiplier: 0.70,
    color: '#10b981',
    description: 'Getaran dirasakan beberapa orang di pesisir, goncangan minor tidak memicu likuefaksi tanggul pantai.'
  },
  {
    mmi: 5,
    roman: 'V',
    label: 'Sedang (Tremor Menerus)',
    rsamRange: '2.000 - 4.500 mV',
    multiplier: 0.95,
    color: '#3b82f6',
    description: 'Getaran dirasakan luas, air tambak dan muara berguncang, kerentanan struktur pesisir moderat.'
  },
  {
    mmi: 6,
    roman: 'VI',
    label: 'Kuat (Gempa Vulkanik Signifikan)',
    rsamRange: '4.500 - 7.500 mV',
    multiplier: 1.25,
    color: '#eab308',
    description: 'Dinding retak ringan, memicu longsoran tebing laut parsial dan menambah percepatan massa air pesisir.'
  },
  {
    mmi: 7,
    roman: 'VII',
    label: 'Sangat Kuat (Eksplosif Paroksismal)',
    rsamRange: '7.500 - 12.000 mV',
    multiplier: 1.70,
    color: '#f97316',
    description: 'Kerusakan pada tanggul pantai dan dermaga, penetrasi genangan tsunami meluas melampaui garis vegetasi pantai.'
  },
  {
    mmi: 8,
    roman: 'VIII',
    label: 'Ekstrem / Kolaps Kaldera (Analog 2018)',
    rsamRange: '> 12.000 mV',
    multiplier: 2.25,
    color: '#ef4444',
    description: 'Runtuhnya struktur lereng bawah laut kaldera secara masif, inundasi air laut menembus hingga 3-5 km ke dataran rendah.'
  }
];

export function getSeismicIntensityFromRsam(rsam: number): SeismicIntensityLevel {
  if (rsam >= 12000) return SEISMIC_INTENSITY_LEVELS[4];
  if (rsam >= 7500) return SEISMIC_INTENSITY_LEVELS[3];
  if (rsam >= 4500) return SEISMIC_INTENSITY_LEVELS[2];
  if (rsam >= 2000) return SEISMIC_INTENSITY_LEVELS[1];
  return SEISMIC_INTENSITY_LEVELS[0];
}

export function calculateInundationRadius(
  zone: AffectedZone,
  multiplier: number,
  scenarioInitialWaveHeightM = 14.5
): InundationZoneCalculation {
  // Scaling ratio against reference scenario (2018 flank collapse = 14.5m)
  const scenarioScale = Math.max(0.6, Math.min(2.0, scenarioInitialWaveHeightM / 14.5));
  
  // Base wave height at this specific coastal geodata point
  const baseWaveAtCoast = (zone.estWaveHeightMeters || 4.0) * scenarioScale;

  // Coastal topography slope factor:
  // Low elevation safe zones (<= 20m) like Carita/Anyer have flatter coastal plains -> higher inland water penetration
  const slopeFactor = zone.safeZoneElevationMeters <= 20 ? 1.35 : 1.05;

  // Base run-up horizontal penetration: ~260m per 1 meter of tsunami wave height on Sunda Strait coastal plain
  const basePenetrationM = baseWaveAtCoast * 260 * slopeFactor;

  // Dynamic radius based on seismic intensity level multiplier
  const totalRadiusMeters = Math.round(basePenetrationM * multiplier);

  // Severe inundation zone (run-up depth > 3.0 meters)
  const extremeZoneMeters = Math.round(totalRadiusMeters * 0.52);

  return {
    totalRadiusMeters,
    extremeZoneMeters,
    estRunupHeightM: Number(baseWaveAtCoast.toFixed(1))
  };
}
