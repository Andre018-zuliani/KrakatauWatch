import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Waves, 
  ShieldAlert, 
  Navigation, 
  Layers, 
  Compass, 
  AlertTriangle, 
  ChevronRight, 
  Wind, 
  Clock, 
  Plane,
  Radio,
  MapPin,
  ExternalLink,
  Volume2,
  Info,
  Activity,
  Sliders,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { AffectedZone, WeatherData, TsunamiScenario, SeismicStats, SeismicIntensityLevel } from '../types.ts';
import { 
  TSUNAMI_SCENARIOS, 
  COASTAL_ZONES_GPS, 
  TELEMETRY_STATIONS,
  SEISMIC_INTENSITY_LEVELS,
  calculateInundationRadius,
  getSeismicIntensityFromRsam
} from '../data/tsunamiData.ts';

// Center on Mount Anak Krakatau
const KRAKATAU_COORDS: [number, number] = [-6.1021, 105.4230];

interface DispersionMapProps {
  weather: WeatherData;
  affectedZones?: AffectedZone[];
  exclusionRadiusKm: number;
  seismicStats?: SeismicStats;
}

export const DispersionMap: React.FC<DispersionMapProps> = ({
  weather,
  affectedZones,
  exclusionRadiusKm = 5,
  seismicStats
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Mode: Tsunami Simulation vs Ash Dispersion
  const [mapMode, setMapMode] = useState<'tsunami' | 'ash'>('tsunami');

  // Baselayer Selection
  const [basemap, setBasemap] = useState<'google_hybrid' | 'google_sat' | 'google_terrain' | 'osm'>('google_hybrid');

  // Tsunami Simulation State
  const [selectedScenario, setSelectedScenario] = useState<TsunamiScenario>(TSUNAMI_SCENARIOS[0]);
  const [simTimeMinutes, setSimTimeMinutes] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(2); // 2x default speed
  const [selectedZone, setSelectedZone] = useState<AffectedZone | null>(COASTAL_ZONES_GPS[0]);
  const [showIsochrones, setShowIsochrones] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);

  // Tsunami Risk Layer (Dynamic Inundation Zones & Seismic Intensity Calculation)
  const [showTsunamiRiskLayer, setShowTsunamiRiskLayer] = useState<boolean>(true);
  const [seismicMode, setSeismicMode] = useState<'auto' | 'manual'>('auto');
  const [manualMmiLevel, setManualMmiLevel] = useState<number>(6); // MMI VI Kuat by default

  // Active Seismic Intensity Level
  const currentSeismicLevel: SeismicIntensityLevel = 
    seismicMode === 'auto' && seismicStats
      ? getSeismicIntensityFromRsam(seismicStats.rsam)
      : (SEISMIC_INTENSITY_LEVELS.find(s => s.mmi === manualMmiLevel) || SEISMIC_INTENSITY_LEVELS[2]);

  // Ash Mode State
  const [projectionHours, setProjectionHours] = useState<6 | 12 | 24>(6);
  const [showHazardCircles, setShowHazardCircles] = useState<boolean>(true);
  const [showFlightAirways, setShowFlightAirways] = useState<boolean>(true);

  // Leaflet DOM ref and instance refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const tsunamiWaveLayerRef = useRef<L.LayerGroup | null>(null);
  const tsunamiRiskLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const ashLayerRef = useRef<L.LayerGroup | null>(null);

  // --- 1. Map Initialization ---
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-6.12, 105.65],
        zoom: 10,
        minZoom: 8,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);
      L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

      // Layer groups
      tsunamiWaveLayerRef.current = L.layerGroup().addTo(map);
      tsunamiRiskLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      ashLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // --- 2. Tile Layer Update on Basemap Change ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let url = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Google Hybrid
    let maxZoom = 18;

    if (basemap === 'google_sat') {
      url = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
    } else if (basemap === 'google_terrain') {
      url = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
    } else if (basemap === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    }

    const newLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    newLayer.addTo(map);
    baseTileLayerRef.current = newLayer;
  }, [basemap]);

  // --- 3. Simulation Timer Loop ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimTimeMinutes(prev => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return Math.min(60, prev + 0.5 * playSpeed);
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playSpeed]);

  // --- 4. Render Markers and Wavefront Layers ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    const waveGroup = tsunamiWaveLayerRef.current;
    const tsunamiRiskGroup = tsunamiRiskLayerRef.current;
    const markersGroup = markersLayerRef.current;
    const ashGroup = ashLayerRef.current;

    if (!map || !waveGroup || !tsunamiRiskGroup || !markersGroup || !ashGroup) return;

    waveGroup.clearLayers();
    tsunamiRiskGroup.clearLayers();
    markersGroup.clearLayers();
    ashGroup.clearLayers();

    // 4A. Anak Krakatau Center Marker (Always present)
    const volcanoIcon = L.divIcon({
      className: 'custom-volcano-marker',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-60"></span>
          <div class="relative w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            ▲
          </div>
          <div class="absolute left-10 whitespace-nowrap bg-slate-900/90 text-white text-[11px] px-2 py-0.5 rounded shadow border border-red-500 pointer-events-none font-bold">
            G. Anak Krakatau (157 m dpl)
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const krakatauMarker = L.marker(KRAKATAU_COORDS, { icon: volcanoIcon });
    krakatauMarker.bindPopup(`
      <div class="p-2 text-xs font-sans">
        <h4 class="font-bold text-red-600 text-sm">Gunung Anak Krakatau</h4>
        <p class="text-slate-600 text-[11px]">Pusat Letusan & Kaldera Selat Sunda</p>
        <div class="mt-1 font-mono text-[10px] space-y-0.5">
          <div>GPS: 6.1021° S, 105.4230° E</div>
          <div>Elevasi: 157 m dpl</div>
          <div>Status: Siaga (Level III)</div>
        </div>
      </div>
    `);
    markersGroup.addLayer(krakatauMarker);

    // Hazard Exclusion Circle around Krakatau
    if (showHazardCircles) {
      const krbZone = L.circle(KRAKATAU_COORDS, {
        radius: exclusionRadiusKm * 1000,
        color: '#dc2626',
        dashArray: '5, 6',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        weight: 2
      });
      krbZone.bindTooltip(`Radius Steril Bahaya KRB: ${exclusionRadiusKm} km`, { sticky: true });
      markersGroup.addLayer(krbZone);
    }

    // 4B. Tsunami Risk Layer: Dynamic Inundation Circles based on Coastal Geodata & Seismic Intensity
    if (showTsunamiRiskLayer) {
      const coastalData = affectedZones && affectedZones.length > 0 ? affectedZones : COASTAL_ZONES_GPS;

      coastalData.forEach(zone => {
        const inundation = calculateInundationRadius(
          zone,
          currentSeismicLevel.multiplier,
          selectedScenario.initialWaveHeightM
        );

        // Outer Circle: Maximum Inundation Extent (Genangan Air Pesisir)
        const outerCircle = L.circle([zone.lat, zone.lng], {
          radius: inundation.totalRadiusMeters,
          color: '#ea580c', // vivid orange
          weight: 2,
          dashArray: '5, 5',
          fillColor: '#f97316',
          fillOpacity: 0.16,
          className: 'tsunami-inundation-outer'
        });

        // Inner Circle: Extreme Danger Inundation Zone (Water Depth > 3m)
        const innerCircle = L.circle([zone.lat, zone.lng], {
          radius: inundation.extremeZoneMeters,
          color: '#dc2626', // crimson red
          weight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.28,
          className: 'tsunami-inundation-inner'
        });

        const tooltipContent = `
          <div class="p-2 text-xs font-sans space-y-1 min-w-[230px]">
            <div class="flex items-center justify-between border-b border-slate-200 pb-1">
              <span class="font-bold text-slate-900">${zone.name}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                zone.impactLevel === 'KRITIS' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
              }">${zone.impactLevel}</span>
            </div>
            <div class="text-[11px] text-slate-600">Wilayah: <strong>${zone.region}</strong> (${zone.distanceKm} km dari Krakatau)</div>
            <div class="p-1.5 rounded bg-orange-50 border border-orange-200 text-[10px] text-orange-950 space-y-0.5">
              <div>🌊 <strong>Radius Inundasi:</strong> ${(inundation.totalRadiusMeters / 1000).toFixed(2)} km (${inundation.totalRadiusMeters.toLocaleString('id-ID')} m)</div>
              <div>⚡ <strong>Tingkat Seismik:</strong> MMI ${currentSeismicLevel.roman} - ${currentSeismicLevel.label} (×${currentSeismicLevel.multiplier})</div>
              <div>⚠️ <strong>Zona Kritis (&gt;3m):</strong> ${(inundation.extremeZoneMeters / 1000).toFixed(2)} km (${inundation.extremeZoneMeters.toLocaleString('id-ID')} m)</div>
              <div>📏 <strong>Tinggi Run-up:</strong> ${inundation.estRunupHeightM} m</div>
            </div>
            <div class="text-[10px] text-slate-600">
              Populasi Rentan: <strong>${zone.population.toLocaleString('id-ID')} jiwa</strong>
            </div>
            <div class="text-[10px] text-emerald-800 bg-emerald-50 p-1 rounded border border-emerald-200">
              🏃 Elevasi Aman: &gt;${zone.safeZoneElevationMeters} mdpl
            </div>
          </div>
        `;

        outerCircle.bindTooltip(tooltipContent, { sticky: true });
        innerCircle.bindTooltip(tooltipContent, { sticky: true });

        outerCircle.on('click', () => setSelectedZone(zone));
        innerCircle.on('click', () => setSelectedZone(zone));

        tsunamiRiskGroup.addLayer(outerCircle);
        tsunamiRiskGroup.addLayer(innerCircle);

        // Center Pulsing Marker with Radius Tag
        const radiusTagHtml = `
          <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <div class="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-xs whitespace-nowrap bg-red-700/90 text-white border border-white flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></span>
              <span>R:${(inundation.totalRadiusMeters / 1000).toFixed(1)}km</span>
            </div>
          </div>
        `;

        const tagIcon = L.divIcon({
          className: 'custom-inundation-tag',
          html: radiusTagHtml,
          iconSize: [60, 20],
          iconAnchor: [30, 10]
        });

        const tagMarker = L.marker([zone.lat, zone.lng], { icon: tagIcon });
        tagMarker.on('click', () => setSelectedZone(zone));
        tagMarker.bindTooltip(tooltipContent, { sticky: true });
        tsunamiRiskGroup.addLayer(tagMarker);
      });
    }

    // 4C. Tsunami Mode: Wavefront Isochrones & Coastal Points
    if (mapMode === 'tsunami') {
      // Dynamic Wavefront Radius: in Sunda Strait (~120m avg depth), wave travels ~25km in 15min (~1.67km/min)
      const currentRadiusMeters = (simTimeMinutes * 1650) * (selectedScenario.initialWaveHeightM / 14.5);

      if (simTimeMinutes > 0 && currentRadiusMeters > 0) {
        // Active Wave Front (pulsing outer ring)
        const waveCircle = L.circle(KRAKATAU_COORDS, {
          radius: currentRadiusMeters,
          color: '#06b6d4',
          weight: 3,
          fillColor: '#0891b2',
          fillOpacity: Math.max(0.05, 0.25 - (simTimeMinutes / 180))
        });
        waveGroup.addLayer(waveCircle);

        // Multiple inner wave reverberation ripples
        for (let r = 1; r <= 3; r++) {
          const trailRadius = Math.max(0, currentRadiusMeters - (r * 4200));
          if (trailRadius > 0) {
            const ripple = L.circle(KRAKATAU_COORDS, {
              radius: trailRadius,
              color: '#38bdf8',
              weight: 1.5,
              opacity: 0.6 / r,
              fill: false,
              dashArray: '4, 4'
            });
            waveGroup.addLayer(ripple);
          }
        }
      }

      // Static Isochrone Guidance Rings (10, 20, 30, 45, 60 mins)
      if (showIsochrones) {
        const isochrones = [
          { min: 15, label: 'T+15m (Sebesi)' },
          { min: 30, label: 'T+30m (Anyer & Rajabasa)' },
          { min: 45, label: 'T+45m (Carita & Labuan)' },
          { min: 60, label: 'T+60m (Merak & Bakauheni)' }
        ];

        isochrones.forEach(iso => {
          const isoRadius = iso.min * 1650;
          const isoLine = L.circle(KRAKATAU_COORDS, {
            radius: isoRadius,
            color: '#0284c7',
            weight: 1,
            fill: false,
            dashArray: '3, 6',
            opacity: 0.4
          });
          isoLine.bindTooltip(`Garis Muka Gelombang: ${iso.label}`, { sticky: true });
          waveGroup.addLayer(isoLine);
        });
      }

      // Coastal Settlement Markers
      COASTAL_ZONES_GPS.forEach(zone => {
        const isHit = simTimeMinutes >= zone.estimatedArrivalMinutes;
        const minutesLeft = Math.max(0, Math.ceil(zone.estimatedArrivalMinutes - simTimeMinutes));

        const badgeColor = isHit 
          ? 'bg-red-600 text-white animate-pulse' 
          : zone.impactLevel === 'KRITIS' 
            ? 'bg-amber-600 text-white' 
            : 'bg-emerald-700 text-white';

        const markerHtml = `
          <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer">
            <div class="px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap border border-white/80 ${badgeColor} flex items-center gap-1">
              <span>${zone.name}</span>
              <span class="text-[9px] font-mono px-1 py-0.2 rounded bg-black/30">
                ${isHit ? 'TERDAMPAK' : `-${minutesLeft}m`}
              </span>
            </div>
            <div class="w-2.5 h-2.5 rotate-45 -mt-1 ${badgeColor} border-r border-b border-white/80"></div>
          </div>
        `;

        const coastalIcon = L.divIcon({
          className: 'custom-coastal-marker',
          html: markerHtml,
          iconSize: [120, 36],
          iconAnchor: [60, 36]
        });

        const coastalMarker = L.marker([zone.lat, zone.lng], { icon: coastalIcon });
        coastalMarker.on('click', () => {
          setSelectedZone(zone);
        });

        markersGroup.addLayer(coastalMarker);
      });

      // Telemetry Sensors (Tide Gauges & Buoys)
      if (showSensors) {
        TELEMETRY_STATIONS.forEach(st => {
          const sensorHtml = `
            <div class="p-1 rounded-full bg-cyan-600 text-white border-2 border-white shadow-sm flex items-center justify-center w-5 h-5 text-[10px] font-mono cursor-pointer" title="${st.name}">
              ◎
            </div>
          `;
          const sIcon = L.divIcon({
            className: 'custom-sensor-icon',
            html: sensorHtml,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          const sensorMarker = L.marker([st.lat, st.lng], { icon: sIcon });
          sensorMarker.bindPopup(`
            <div class="p-2 text-xs font-sans space-y-1">
              <div class="font-bold text-cyan-800">${st.name}</div>
              <div class="text-[11px] text-slate-600">Pengelola: <strong>${st.provider}</strong></div>
              <div class="font-mono text-[10px] text-slate-700 bg-cyan-50 p-1 rounded border border-cyan-200">
                ${st.currentReading}
              </div>
            </div>
          `);
          markersGroup.addLayer(sensorMarker);
        });
      }
    }

    // 4C. Ash Dispersion Mode
    if (mapMode === 'ash') {
      // Draw ash dispersion cone based on wind direction & hours
      // Krakatau wind vector: ~225° (Barat Daya)
      const distKm = projectionHours * 18;
      // Coordinates fan out towards Southwest (-6.10, 105.42 -> SW towards Indian Ocean & Panaitan)
      const latOffset = (distKm / 111) * 0.9;
      const lngOffset = (distKm / 111) * 0.7;

      const plumeCoords: [number, number][] = [
        KRAKATAU_COORDS,
        [-6.10 - latOffset - 0.2, 105.42 - lngOffset + 0.3],
        [-6.10 - latOffset - 0.4, 105.42 - lngOffset - 0.2],
        [-6.10 - (latOffset * 0.6), 105.42 - lngOffset - 0.4]
      ];

      const plumePolygon = L.polygon(plumeCoords, {
        color: '#f97316',
        weight: 2,
        fillColor: '#ea580c',
        fillOpacity: 0.35,
        dashArray: '4, 4'
      });
      plumePolygon.bindTooltip(`Trajektori Sebaran Abu HYSPLIT (+${projectionHours} Jam) - Kolom FL100`, { sticky: true });
      ashGroup.addLayer(plumePolygon);

      // Flight Airways
      if (showFlightAirways) {
        // Airway W45 (Jakarta - Bandar Lampung route across Sunda Strait)
        const airwayW45: [number, number][] = [
          [-5.75, 105.35],
          [-6.02, 105.65],
          [-6.28, 106.05]
        ];
        const airwayLine = L.polyline(airwayW45, {
          color: '#3b82f6',
          weight: 2,
          dashArray: '6, 6'
        });
        airwayLine.bindTooltip('Jalur Udara ATS W45 (FL240-FL380): Potensi Terpapar Abu', { sticky: true });
        ashGroup.addLayer(airwayLine);
      }
    }

  }, [
    mapMode,
    simTimeMinutes,
    selectedScenario,
    showIsochrones,
    showSensors,
    showHazardCircles,
    showFlightAirways,
    projectionHours,
    exclusionRadiusKm,
    showTsunamiRiskLayer,
    currentSeismicLevel.multiplier,
    currentSeismicLevel.roman,
    affectedZones
  ]);

  // Handle Quick Pan to Target
  const handlePanTo = (lat: number, lng: number, zoomLevel = 12) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoomLevel, {
        duration: 1.2
      });
    }
  };

  return (
    <div id="dispersion-tsunami-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 shadow-xs transition-colors flex flex-col overflow-hidden">
      
      {/* 1. Header Bar with Mode Switcher */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-emerald-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            {mapMode === 'tsunami' ? <Waves className="w-4 h-4 text-cyan-700 dark:text-cyan-400" /> : <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {mapMode === 'tsunami' 
                ? 'Peta Interaktif & Simulasi Propagasi Tsunami Selat Sunda' 
                : 'Peta Interaktif Trajektori Sebaran Abu HYSPLIT & Jalur Penerbangan'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Peta GPS riil dapat digeser (drag), di-zoom, dan menampilkan radius dampak gelombang pesisir Banten & Lampung.
            </p>
          </div>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-900/60 text-xs">
          <button
            id="tab-mode-tsunami"
            onClick={() => setMapMode('tsunami')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              mapMode === 'tsunami'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Simulasi Tsunami</span>
          </button>

          <button
            id="tab-mode-ash"
            onClick={() => setMapMode('ash')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              mapMode === 'ash'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Sebaran Abu Vulkanik</span>
          </button>
        </div>
      </div>

      {/* 2. Top Control Toolbar */}
      <div className="px-3 sm:px-4 py-2 bg-slate-50 dark:bg-[#061710] border-b border-slate-200 dark:border-emerald-950 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Basemap Selection */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pr-1 font-medium">
            <Layers className="w-3.5 h-3.5" /> Lapisan Peta:
          </span>
          <button
            onClick={() => setBasemap('google_hybrid')}
            className={`px-2 py-1 rounded border text-[11px] transition-colors ${
              basemap === 'google_hybrid'
                ? 'bg-emerald-700 text-white border-emerald-800 font-semibold'
                : 'bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-emerald-900'
            }`}
          >
            Google Satelit + Label
          </button>
          <button
            onClick={() => setBasemap('google_sat')}
            className={`px-2 py-1 rounded border text-[11px] transition-colors ${
              basemap === 'google_sat'
                ? 'bg-emerald-700 text-white border-emerald-800 font-semibold'
                : 'bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-emerald-900'
            }`}
          >
            Satelit Murni
          </button>
          <button
            onClick={() => setBasemap('google_terrain')}
            className={`px-2 py-1 rounded border text-[11px] transition-colors ${
              basemap === 'google_terrain'
                ? 'bg-emerald-700 text-white border-emerald-800 font-semibold'
                : 'bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-emerald-900'
            }`}
          >
            Topografi / Relief
          </button>
          <button
            onClick={() => setBasemap('osm')}
            className={`px-2 py-1 rounded border text-[11px] transition-colors ${
              basemap === 'osm'
                ? 'bg-emerald-700 text-white border-emerald-800 font-semibold'
                : 'bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-emerald-900'
            }`}
          >
            Peta Jalan OSM
          </button>
        </div>

        {/* Quick Pan Locations */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pusatkan ke:</span>
          <button
            onClick={() => handlePanTo(KRAKATAU_COORDS[0], KRAKATAU_COORDS[1], 12)}
            className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-900 text-[11px] hover:bg-red-200"
          >
            Anak Krakatau
          </button>
          <button
            onClick={() => handlePanTo(-6.15, 105.86, 11)}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-emerald-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-emerald-900 text-[11px]"
          >
            Pesisir Banten
          </button>
          <button
            onClick={() => handlePanTo(-5.85, 105.58, 11)}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-emerald-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-emerald-900 text-[11px]"
          >
            Pesisir Lampung
          </button>
        </div>

        {/* Tsunami Risk Layer Toggle */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-emerald-900/60">
          <button
            id="toggle-tsunami-risk-layer"
            onClick={() => setShowTsunamiRiskLayer(!showTsunamiRiskLayer)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              showTsunamiRiskLayer
                ? 'bg-red-600 text-white border-red-700 hover:bg-red-700'
                : 'bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-emerald-900 hover:bg-slate-100'
            }`}
            title="Aktifkan / Nonaktifkan Layer Risiko Tsunami & Genangan Inundasi Pesisir"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Layer Risiko Tsunami</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              showTsunamiRiskLayer ? 'bg-black/30 text-white' : 'bg-slate-200 dark:bg-emerald-950 text-slate-600 dark:text-slate-400'
            }`}>
              {showTsunamiRiskLayer ? 'AKTIF' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 2B. Tsunami Risk Layer & Dynamic Seismic Intensity Controls */}
      {showTsunamiRiskLayer && (
        <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-50 via-amber-50 to-red-50 dark:from-[#1a0e06] dark:via-[#150c05] dark:to-[#1c0806] border-b border-orange-200 dark:border-orange-950/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-orange-950 dark:text-orange-200 text-xs">
              <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Intensitas Seismik:</span>
            </div>

            {/* Mode: Auto Sensor vs Manual MMI */}
            <div className="flex items-center gap-1 bg-white/90 dark:bg-[#0c0806] p-0.5 rounded-lg border border-orange-300 dark:border-orange-900">
              <button
                id="seismic-mode-auto"
                onClick={() => setSeismicMode('auto')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  seismicMode === 'auto'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Sinkronisasi otomatis dengan sensor seismometer KRAK01"
              >
                <span>Auto Sensor</span>
                <span className="text-[10px] font-mono opacity-80">
                  ({seismicStats ? `${seismicStats.rsam.toLocaleString('id-ID')} mV` : '1.840 mV'})
                </span>
              </button>

              <button
                id="seismic-mode-manual"
                onClick={() => setSeismicMode('manual')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  seismicMode === 'manual'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Simulasi manual tingkat skala intensitas MMI"
              >
                Manual MMI
              </button>
            </div>

            {/* MMI Level Buttons */}
            <div className="flex items-center gap-1">
              {SEISMIC_INTENSITY_LEVELS.map(level => {
                const isSelected = currentSeismicLevel.mmi === level.mmi;
                return (
                  <button
                    key={level.mmi}
                    id={`mmi-level-${level.mmi}`}
                    onClick={() => {
                      setSeismicMode('manual');
                      setManualMmiLevel(level.mmi);
                    }}
                    className={`px-2 py-0.5 rounded border text-[11px] font-mono font-bold transition-all ${
                      isSelected
                        ? 'text-white shadow-xs border-transparent scale-105'
                        : 'bg-white dark:bg-[#0e0705] text-slate-700 dark:text-slate-300 border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 dark:hover:bg-orange-950/40'
                    }`}
                    style={{
                      backgroundColor: isSelected ? level.color : undefined
                    }}
                    title={`${level.label} (Pengali Radius: ×${level.multiplier})`}
                  >
                    MMI {level.roman}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Intensity summary pill */}
          <div className="flex items-center gap-2 text-[11px] text-orange-900 dark:text-orange-300 font-mono">
            <span className="font-semibold px-2 py-0.5 rounded bg-orange-200/70 dark:bg-orange-950 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-900">
              MMI {currentSeismicLevel.roman} • Pengali Radius: ×{currentSeismicLevel.multiplier}
            </span>
            <span className="text-[10px] hidden md:inline text-slate-600 dark:text-slate-400">
              {currentSeismicLevel.label}
            </span>
          </div>
        </div>
      )}

      {/* 3. Tsunami Simulation Player Bar (Active in Tsunami Mode) */}
      {mapMode === 'tsunami' && (
        <div className="p-3 bg-cyan-50 dark:bg-[#05181b] border-b border-cyan-200 dark:border-cyan-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Scenario Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-cyan-900 dark:text-cyan-200 whitespace-nowrap">
              Skenario Pemicu:
            </span>
            <select
              value={selectedScenario.id}
              onChange={e => {
                const sc = TSUNAMI_SCENARIOS.find(s => s.id === e.target.value);
                if (sc) setSelectedScenario(sc);
              }}
              className="px-2.5 py-1.5 rounded-md bg-white dark:bg-[#071912] border border-cyan-300 dark:border-cyan-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-1 focus:ring-cyan-500"
            >
              {TSUNAMI_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (Tinggi Inisiasi: {s.initialWaveHeightM}m)
                </option>
              ))}
            </select>
          </div>

          {/* Player Controls & Scrubber */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="btn-play-pause-sim"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-lg text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-cyan-700 hover:bg-cyan-800'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Jeda' : 'Jalankan Simulasi'}</span>
              </button>

              <button
                id="btn-reset-sim"
                onClick={() => {
                  setIsPlaying(false);
                  setSimTimeMinutes(0);
                }}
                className="p-1.5 rounded-lg bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-emerald-900 hover:bg-slate-100"
                title="Reset Waktu ke T+00"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center rounded border border-cyan-300 dark:border-cyan-900 bg-white dark:bg-[#071912] overflow-hidden text-[10px]">
                {[1, 2, 5].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setPlaySpeed(spd)}
                    className={`px-1.5 py-1 ${playSpeed === spd ? 'bg-cyan-700 text-white font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slider */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-cyan-900 dark:text-cyan-200 shrink-0">
                T+{String(Math.floor(simTimeMinutes)).padStart(2, '0')}:
                {String(Math.floor((simTimeMinutes % 1) * 60)).padStart(2, '0')} m
              </span>
              <input
                type="range"
                min="0"
                max="60"
                step="0.5"
                value={simTimeMinutes}
                onChange={e => setSimTimeMinutes(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-cyan-200 dark:bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                60 Menit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Ash Plume Controls (Active in Ash Mode) */}
      {mapMode === 'ash' && (
        <div className="p-3 bg-amber-50 dark:bg-[#1a1308] border-b border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
              Proyeksi Waktu HYSPLIT:
            </span>
            {([6, 12, 24] as const).map(hrs => (
              <button
                key={hrs}
                onClick={() => setProjectionHours(hrs)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  projectionHours === hrs
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white dark:bg-[#071912] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-amber-900'
                }`}
              >
                +{hrs} Jam
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHazardCircles(!showHazardCircles)}
              className={`px-2 py-1 rounded border text-xs flex items-center gap-1 ${
                showHazardCircles
                  ? 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                  : 'bg-white dark:bg-[#071912] text-slate-600 border-slate-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Radius Steril ({exclusionRadiusKm} km)
            </button>
            <button
              onClick={() => setShowFlightAirways(!showFlightAirways)}
              className={`px-2 py-1 rounded border text-xs flex items-center gap-1 ${
                showFlightAirways
                  ? 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-[#071912] text-slate-600 border-slate-300'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              Koridor Udara W45
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Map Viewport & Overlay Side Card */}
      <div className="relative w-full h-[480px] sm:h-[540px] bg-slate-900">
        {/* Real GPS Leaflet Map Container */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-0 cursor-grab active:cursor-grabbing" 
        />

        {/* Floating Map Legend Overlay */}
        <div className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-[#071912]/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 shadow-md text-[11px] space-y-1.5 max-w-[210px] pointer-events-auto">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1 border-b border-slate-200 dark:border-emerald-950 pb-1">
            <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Keterangan Peta GPS</span>
          </div>

          <div className="space-y-1 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white shrink-0"></span>
              <span>Kawah G. Anak Krakatau</span>
            </div>
            {mapMode === 'tsunami' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white shrink-0"></span>
                  <span>Muka Gelombang Tsunami</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-600 shrink-0"></span>
                  <span>Pesisir Siaga (ETA &lt;45m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse shrink-0"></span>
                  <span>Pesisir Terdampak</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-600 shrink-0"></span>
                  <span>Sensor InaTWS / Tide Gauge</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-orange-500/80 border border-orange-600 shrink-0"></span>
                  <span>Sebaran Abu HYSPLIT FL100</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-blue-500 shrink-0"></span>
                  <span>Jalur Penerbangan W45</span>
                </div>
              </>
            )}

            {/* Tsunami Risk Layer Legend Items */}
            {showTsunamiRiskLayer && (
              <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-emerald-950 space-y-1">
                <div className="text-[10px] font-bold text-orange-800 dark:text-orange-400">
                  Layer Risiko Tsunami (Seismik):
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border-2 border-orange-500 bg-orange-400/30 shrink-0"></span>
                  <span>Radius Genangan (MMI {currentSeismicLevel.roman})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600/40 border-2 border-red-600 shrink-0"></span>
                  <span>Zona Ekstrem (&gt;3m Run-up)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Coastal Zone Detail Drawer / Popup (Bottom Left) */}
        {selectedZone && mapMode === 'tsunami' && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-20 bg-white/95 dark:bg-[#071912]/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800 shadow-xl space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-950 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {selectedZone.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {selectedZone.region} • Jarak: {selectedZone.distanceKm} km
                  </span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                simTimeMinutes >= selectedZone.estimatedArrivalMinutes
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
              }`}>
                {simTimeMinutes >= selectedZone.estimatedArrivalMinutes 
                  ? 'GELOMBANG TELAH TIBA' 
                  : `Tiba dalam ${Math.max(0, Math.ceil(selectedZone.estimatedArrivalMinutes - simTimeMinutes))} Menit`}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Tinggi Gelombang</div>
                <div className="font-bold text-cyan-700 dark:text-cyan-400 text-sm font-mono">
                  {selectedZone.estWaveHeightMeters} m
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Waktu Tempuh (ETA)</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                  T+{selectedZone.estimatedArrivalMinutes}m
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Populasi Rentan</div>
                <div className="font-bold text-amber-700 dark:text-amber-400 text-sm font-mono">
                  {selectedZone.population.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Dynamic Seismic Inundation Metric for this Zone */}
            {showTsunamiRiskLayer && (
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[11px] text-orange-950 dark:text-orange-200 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    Radius Inundasi Seismik (MMI {currentSeismicLevel.roman}):
                  </span>
                  <span className="font-mono text-orange-700 dark:text-orange-300 text-xs">
                    {(calculateInundationRadius(selectedZone, currentSeismicLevel.multiplier, selectedScenario.initialWaveHeightM).totalRadiusMeters / 1000).toFixed(2)} km
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 dark:text-slate-400 pt-0.5">
                  <div>Zona Kritis (&gt;3m): <strong className="text-red-600 dark:text-red-400">{calculateInundationRadius(selectedZone, currentSeismicLevel.multiplier, selectedScenario.initialWaveHeightM).extremeZoneMeters.toLocaleString('id-ID')} m</strong></div>
                  <div>Elevasi Pantai: <strong>{selectedZone.safeZoneElevationMeters} mdpl</strong></div>
                </div>
              </div>
            )}

            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[11px] text-red-900 dark:text-red-200 leading-relaxed">
              <strong>SOP Evakuasi Cepat:</strong> {selectedZone.evacuationRoute} (Menuju elevasi minimum &gt;{selectedZone.safeZoneElevationMeters} m dpl).
            </div>
          </div>
        )}
      </div>

      {/* 6. Tsunami Regional Impact Matrix Table */}
      {mapMode === 'tsunami' && (
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-[#05140e] border-t border-slate-200 dark:border-emerald-950 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Matriks Estimasi Kedatangan Gelombang & Radius Inundasi di 9 Titik Pesisir Selat Sunda
            </h4>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Waktu Simulasi Aktif: T+{Math.floor(simTimeMinutes)} menit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-emerald-950 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2 px-2">Wilayah / Titik Pesisir</th>
                  <th className="py-2 px-2">Jarak dari Kawah</th>
                  <th className="py-2 px-2">Estimasi Tiba (ETA)</th>
                  <th className="py-2 px-2">Tinggi Gelombang</th>
                  {showTsunamiRiskLayer && (
                    <th className="py-2 px-2 text-orange-700 dark:text-orange-400">
                      Radius Inundasi (MMI {currentSeismicLevel.roman})
                    </th>
                  )}
                  <th className="py-2 px-2">Status Saat T+{Math.floor(simTimeMinutes)}m</th>
                  <th className="py-2 px-2 text-right">Aksi Peta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-emerald-950/60 text-slate-800 dark:text-slate-200 text-xs">
                {(affectedZones && affectedZones.length > 0 ? affectedZones : COASTAL_ZONES_GPS).map(zone => {
                  const isHit = simTimeMinutes >= zone.estimatedArrivalMinutes;
                  const minutesLeft = Math.max(0, Math.ceil(zone.estimatedArrivalMinutes - simTimeMinutes));
                  const zoneInundation = calculateInundationRadius(
                    zone,
                    currentSeismicLevel.multiplier,
                    selectedScenario.initialWaveHeightM
                  );

                  return (
                    <tr 
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        handlePanTo(zone.lat, zone.lng, 12);
                      }}
                      className={`hover:bg-slate-100 dark:hover:bg-[#071912] cursor-pointer transition-colors ${
                        selectedZone?.id === zone.id ? 'bg-emerald-50 dark:bg-emerald-950/40' : ''
                      }`}
                    >
                      <td className="py-2 px-2 font-medium">
                        <div className="font-semibold text-slate-900 dark:text-white">{zone.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{zone.region}</div>
                      </td>
                      <td className="py-2 px-2 font-mono text-[11px]">{zone.distanceKm} km</td>
                      <td className="py-2 px-2 font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">
                        T+{zone.estimatedArrivalMinutes} menit
                      </td>
                      <td className="py-2 px-2 font-mono text-[11px] font-bold text-red-600 dark:text-red-400">
                        {zone.estWaveHeightMeters} m
                      </td>
                      {showTsunamiRiskLayer && (
                        <td className="py-2 px-2 font-mono text-[11px] font-semibold text-orange-700 dark:text-orange-400">
                          {(zoneInundation.totalRadiusMeters / 1000).toFixed(2)} km
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-normal">
                            (Kritis: {zoneInundation.extremeZoneMeters}m)
                          </span>
                        </td>
                      )}
                      <td className="py-2 px-2">
                        {isHit ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                            TERDAMPAK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            Tersisa {minutesLeft}m
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedZone(zone);
                            handlePanTo(zone.lat, zone.lng, 13);
                          }}
                          className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-slate-200 text-[10px] font-medium"
                        >
                          Lihat Lokasi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Historical Context & Methodology Footnote */}
      <div className="p-3 bg-white dark:bg-[#071912] border-t border-slate-200 dark:border-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>
            Model perambatan gelombang tsunami dikalibrasi berdasarkan data batimetri Selat Sunda (kecepatan perambatan v = √(g·h) ~100-120 km/jam) dan arsip analog letusan 22 Desember 2018.
          </span>
        </div>
        <div className="shrink-0 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
          GPS WGS84 Datum • PVMBG / BMKG / BIG
        </div>
      </div>

    </div>
  );
};
