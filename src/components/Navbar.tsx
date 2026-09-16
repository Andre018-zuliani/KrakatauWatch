import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Activity, 
  Clock, 
  Menu,
  X,
  Radio,
  BrainCircuit,
  Bot,
  BellRing,
  History,
  Waves
} from 'lucide-react';
import { VolcanoStatusLevel } from '../types.ts';

interface NavbarProps {
  activeTab: 'monitoring' | 'dispersion' | 'seismic' | 'reasoning' | 'chatbot' | 'alerts' | 'history';
  onSelectTab: (tab: 'monitoring' | 'dispersion' | 'seismic' | 'reasoning' | 'chatbot' | 'alerts' | 'history') => void;
  currentLevel: VolcanoStatusLevel;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentLevel
}) => {
  const [wibTime, setWibTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const wibOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const utcOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setWibTime(new Intl.DateTimeFormat('id-ID', wibOptions).format(now));
      setUtcTime(new Intl.DateTimeFormat('en-US', utcOptions).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (currentLevel) {
      case 'LEVEL_IV':
        return { 
          text: 'LEVEL IV (AWAS)', 
          bg: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700/60' 
        };
      case 'LEVEL_III':
        return { 
          text: 'LEVEL III (SIAGA)', 
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60' 
        };
      case 'LEVEL_II':
        return { 
          text: 'LEVEL II (WASPADA)', 
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700/60' 
        };
      case 'LEVEL_I':
      default:
        return { 
          text: 'LEVEL I (NORMAL)', 
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700/60' 
        };
    }
  };

  const statusBadge = getStatusBadge();

  const navLinks: { id: 'monitoring' | 'dispersion' | 'seismic' | 'reasoning' | 'chatbot' | 'alerts' | 'history'; label: string; icon: React.ReactNode }[] = [
    { id: 'monitoring', label: 'Monitoring Terpadu', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'dispersion', label: 'Peta GPS & Tsunami', icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'seismic', label: 'Seismik KRAK01', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'reasoning', label: 'Sintesis & SOP', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
    { id: 'chatbot', label: 'Asisten RAG', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'alerts', label: 'Peringatan Dini', icon: <BellRing className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'Log Kejadian', icon: <History className="w-3.5 h-3.5" /> },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-white dark:bg-[#071912] border-b border-slate-200 dark:border-emerald-900/50 transition-colors shadow-sm">
      {/* Institutional Top Status Bar */}
      <div className="bg-slate-100 dark:bg-[#05140e] px-4 py-1.5 text-xs border-b border-slate-200 dark:border-emerald-950 flex flex-wrap items-center justify-between gap-2 text-slate-700 dark:text-slate-300 transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span className="font-semibold text-slate-900 dark:text-white tracking-wide">PUSDALOPS MITIGASI BENCANA:</span>
          <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400/90 font-mono">
            Stasiun Pasauran Banten & Pos Pulau Sertung (100 Hz Telemetri)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
            <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{wibTime} WIB</span>
          </span>
          <span className="text-slate-300 dark:text-emerald-900 hidden md:inline">|</span>
          <span className="text-slate-500 dark:text-slate-400 hidden md:inline">{utcTime} UTC</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand & Organization Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/60 dark:border-emerald-700/60 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  KRAKATAU<span className="text-emerald-600 dark:text-emerald-400">WATCH</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/60">
                  v1.0 PVMBG
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Sistem Deteksi Dini & Mitigasi Vulkanik Selat Sunda
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-[#05140e] p-1 rounded-xl border border-slate-200 dark:border-emerald-900/50 transition-colors">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => onSelectTab(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-emerald-900/40'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Controls: Official Status & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Official Status Badge */}
            <div 
              id="official-status-badge"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${statusBadge.bg}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>{statusBadge.text}</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-dropdown" className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 transition-colors shadow-md">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider px-2 py-1">
            Menu Modul Operasional
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                activeTab === link.id
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

