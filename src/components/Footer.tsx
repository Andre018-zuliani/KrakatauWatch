import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  PhoneCall, 
  CheckCircle2
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/mockKnowledgeBase.ts';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-slate-100 dark:bg-[#05140e] border-t border-slate-200 dark:border-emerald-950 mt-8 pt-8 pb-20 sm:pb-8 text-slate-600 dark:text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Disclaimer Box */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#071912] border border-slate-200 dark:border-emerald-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 dark:text-white tracking-wide">PEMBERITAHUAN OTORITAS RESMI:</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                KrakatauWatch adalah sistem otomasi pendukung keputusan (Decision Support System) berbasis kecerdasan buatan. Seluruh status resmi aktivitas vulkanik (Level I-IV) dan rekomendasi pengungsian ditetapkan secara tunggal oleh PVMBG - Badan Geologi.
              </p>
            </div>
          </div>
          <div className="shrink-0 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-slate-50 dark:bg-[#05140e] px-2.5 py-1 rounded border border-slate-200 dark:border-emerald-900">
            PRD v1.0 • September 2026
          </div>
        </div>

        {/* Middle Section: Emergency Contacts & Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 text-xs">
          {/* Brand & Purpose */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-700 dark:bg-emerald-800 flex items-center justify-center text-white">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Krakatau<span className="text-emerald-600 dark:text-emerald-400">Watch</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Sistem deteksi dini aktivitas erupsi, trajektori sebaran abu HYSPLIT, seismogram KRAK01, dan asisten SOP mitigasi bencana Selat Sunda.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Stasiun Telemetri Pasauran & Pulau Sertung</span>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
              <PhoneCall className="w-3.5 h-3.5" />
              Kontak Darurat Terpadu
            </h5>
            <div className="space-y-1.5 text-[11px]">
              {EMERGENCY_CONTACTS.slice(0, 3).map((c, i) => (
                <div key={i} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="truncate pr-2">{c.name}:</span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-mono shrink-0">{c.phone}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders & Accreditation */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Jaringan Instansi Terintegrasi
            </h5>
            <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              <li>• PVMBG (Pusat Vulkanologi dan Mitigasi Bencana Geologi)</li>
              <li>• BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</li>
              <li>• BNPB & BPBD Provinsi Banten / Lampung Selatan</li>
              <li>• AirNav Indonesia & VAAC Darwin (VONA Advisory)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Mandatory Watermark */}
        <div className="pt-4 border-t border-slate-200 dark:border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>© 2026 KrakatauWatch. Sistem Mitigasi Bencana Selat Sunda.</span>
          </div>

          {/* Mandatory Watermark */}
          <div 
            id="author-watermark"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#071912] border border-slate-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500 dark:text-slate-400">Watermark:</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              @makebyandrezuliani
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
