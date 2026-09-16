import React from 'react';
import { 
  Wind, 
  Gauge, 
  Satellite, 
  ThermometerSun
} from 'lucide-react';
import { WeatherData, AshDetectionResult } from '../types.ts';

interface ThermalWeatherSensorsProps {
  weather: WeatherData;
  ash: AshDetectionResult;
}

export const ThermalWeatherSensors: React.FC<ThermalWeatherSensorsProps> = ({
  weather,
  ash
}) => {
  return (
    <div id="weather-telemetry-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {/* 1. Vektor Angin BMKG */}
      <div className="bg-white dark:bg-[#071912] p-3 rounded-xl border border-slate-200 dark:border-emerald-900/40 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="font-semibold flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Vektor Angin BMKG
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">FL100</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-full border border-slate-300 dark:border-emerald-800 bg-slate-100 dark:bg-[#05140e] flex items-center justify-center shrink-0">
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotate(${weather.fl100WindDirDeg}deg)` }}
            >
              <div className="w-1 h-6 bg-gradient-to-t from-transparent to-red-500 dark:to-red-400 rounded-full" />
            </div>
            <div className="absolute w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {weather.fl100WindSpeedKts} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">knot</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              Arah: <strong className="text-amber-700 dark:text-amber-300 font-mono">{weather.fl100WindDirDeg}°</strong> (Barat Daya)
            </div>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-emerald-950 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>Permukaan: {weather.surfaceWindSpeedKts} kts</span>
          <span>FL200: {weather.fl200WindSpeedKts} kts</span>
        </div>
      </div>

      {/* 2. Satelit Sentinel-5P */}
      <div className="bg-white dark:bg-[#071912] p-3 rounded-xl border border-slate-200 dark:border-emerald-900/40 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="font-semibold flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Sentinel-5P (SO2)
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 font-mono">
            TROPOMI
          </span>
        </div>

        <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
          14.8 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kTon/hari (32.4 DU)</span>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
          Fluks emisi sulfur dioksida terindikasi tinggi
        </p>

        <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
          <span>Lintas: 13:40 WIB</span>
          <span className="text-purple-600 dark:text-purple-400 font-medium">Anomali Terdeteksi</span>
        </div>
      </div>

      {/* 3. Termal Himawari-9 */}
      <div className="bg-white dark:bg-[#071912] p-3 rounded-xl border border-slate-200 dark:border-emerald-900/40 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="font-semibold flex items-center gap-1.5">
            <ThermometerSun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Anomali Termal Satelit
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Band 14</span>
        </div>

        <div className="text-base font-bold text-amber-700 dark:text-amber-400 font-mono">
          {ash.hotspotTempCelsius}°C <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Vent Kawah</span>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
          BTD Split-Window: <strong className="text-slate-900 dark:text-white font-mono">-{ash.btdIndex.toFixed(1)} K</strong>
        </p>

        <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
          <span>Radiasi: 184 MW</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">Hotspot Aktif</span>
        </div>
      </div>

      {/* 4. Cuaca Maritim BMKG */}
      <div className="bg-white dark:bg-[#071912] p-3 rounded-xl border border-slate-200 dark:border-emerald-900/40 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="font-semibold flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Stasiun Maritim BMKG
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Pasauran</span>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">Tekanan Udara</div>
            <div className="font-bold text-slate-900 dark:text-white font-mono">{weather.airPressureHpa} hPa</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">Kelembapan</div>
            <div className="font-bold text-slate-900 dark:text-white font-mono">{weather.humidityPercent}%</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">Curah Hujan</div>
            <div className="font-bold text-slate-900 dark:text-white font-mono">{weather.rainfallMmPerHour} mm/j</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">Partikulat</div>
            <div className="font-bold text-amber-700 dark:text-amber-400 font-mono">PM2.5: 64 µg</div>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
          <span>Gelombang: 1.2 - 2.0 m</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Kondisi Sedang</span>
        </div>
      </div>
    </div>
  );
};
