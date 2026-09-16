import React, { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  Copy, 
  AlertTriangle, 
  UserCheck, 
  Bookmark, 
  RefreshCw
} from 'lucide-react';
import { AIReasoningOutput } from '../types.ts';

interface AIReasoningPanelProps {
  reasoningData: AIReasoningOutput;
  isLoading: boolean;
  onRefreshReasoning: () => void;
  onVerifyHuman: () => void;
}

export const AIReasoningPanel: React.FC<AIReasoningPanelProps> = ({
  reasoningData,
  isLoading,
  onRefreshReasoning,
  onVerifyHuman
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'recommendations' | 'draftReport'>('summary');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopyReport = () => {
    const reportText = `
LAPORAN RESMI PENGAMATAN AKTIVITAS GUNUNG ANAK KRAKATAU
Nomor: ${reasoningData.officialDraftReport.nomorLaporan}
Waktu: ${reasoningData.officialDraftReport.tanggalWaktuWIB}
Periode Evaluasi: ${reasoningData.officialDraftReport.periodeEvaluasi}

I. KESIMPULAN PENGAMATAN MULTI-SENSOR:
${reasoningData.officialDraftReport.kesimpulanPengamatan}

II. REKOMENDASI PVMBG / PUSDALOPS BNPB:
${reasoningData.officialDraftReport.rekomendasiPVMBG}

III. TINDAKAN OPERASIONAL MITIGASI:
${reasoningData.actionRecommendations.map((r, i) => `${i + 1}. [${r.category}] ${r.title} (Prioritas: ${r.priority})\n   ${r.description}\n   Rujukan: ${r.sopReference}`).join('\n\n')}

Verifikator: ${reasoningData.officialDraftReport.penandatanganDraft}
${reasoningData.guardrailDisclaimer}
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div id="ai-reasoning-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-xs transition-colors flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Sintesis Analisis Multivariat & Rekomendasi Mitigasi
              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 font-mono">
                RAG ENGINE
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Integrasi Data Seismik, Citra Termal Satelit, Vektor Angin BMKG, dan SOP PVMBG No. 04/2023
            </p>
          </div>
        </div>

        <button
          id="refresh-ai-reasoning-btn"
          onClick={onRefreshReasoning}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-[#05140e] dark:hover:bg-emerald-950 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs font-medium border border-slate-300 dark:border-emerald-850 transition-colors disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Menganalisis...' : 'Perbarui Analisis'}</span>
        </button>
      </div>

      {/* Human-in-the-Loop Status Bar */}
      <div className={`p-2.5 rounded-lg mb-3 border flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
        reasoningData.humanVerified 
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200' 
          : 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/80 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2">
          {reasoningData.humanVerified ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span>
            {reasoningData.humanVerified ? (
              <>
                <strong className="text-slate-900 dark:text-white">STATUS TERVERIFIKASI:</strong> Disetujui oleh {reasoningData.verifiedBy} ({reasoningData.verifiedAt})
              </>
            ) : (
              <>
                <strong className="text-slate-900 dark:text-white">MENUNGGU VERIFIKASI OPERATOR:</strong> Rekomendasi memerlukan pengesahan petugas sebelum didistribusikan ke instansi terkait.
              </>
            )}
          </span>
        </div>

        {!reasoningData.humanVerified && (
          <button
            id="verify-human-btn"
            onClick={onVerifyHuman}
            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verifikasi & Setujui</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-1 mb-3 border-b border-slate-200 dark:border-emerald-950 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3 py-1 rounded-md font-medium transition-colors ${
            activeTab === 'summary'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950'
          }`}
        >
          Ringkasan Situasi
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'recommendations'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950'
          }`}
        >
          <span>Rekomendasi Tindakan</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#05140e] text-[10px] text-emerald-800 dark:text-emerald-300 border border-slate-300 dark:border-emerald-900 font-mono">
            {reasoningData.actionRecommendations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('draftReport')}
          className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
            activeTab === 'draftReport'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Draf Buletin Resmi</span>
        </button>
      </div>

      {/* Tab 1: Ringkasan Situasi */}
      {activeTab === 'summary' && (
        <div className="space-y-3 flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {/* Evaluasi Teknis Vulkanologi */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Evaluasi Teknis Vulkanologi & Sensor</span>
                </div>
                <p className="text-slate-700 font-normal leading-relaxed pt-1">
                  {reasoningData.summaryPetugas}
                </p>
              </div>
            </div>

            {/* Panduan Keselamatan Masyarakat */}
            <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 text-slate-800 text-xs leading-relaxed transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-200/80 pb-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Panduan Keselamatan Warga & Wisatawan</span>
                </div>
                <p className="text-slate-700 font-normal leading-relaxed pt-1">
                  {reasoningData.summaryPublik}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rekomendasi Tindakan */}
      {activeTab === 'recommendations' && (
        <div className="space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
          {reasoningData.actionRecommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="p-3 rounded-lg bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 hover:border-slate-300 dark:hover:border-emerald-850 transition-colors space-y-1 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                    {rec.category}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{rec.title}</h4>
                </div>

                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                  rec.priority === 'URGENT' ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800' :
                  rec.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                }`}>
                  PRIORITAS: {rec.priority}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {rec.description}
              </p>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200 dark:border-emerald-950">
                <Bookmark className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Rujukan SOP: <strong>{rec.sopReference}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Draf Buletin Resmi */}
      {activeTab === 'draftReport' && (
        <div className="space-y-2.5 flex-1 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-mono">Format Buletin Berkala PVMBG / BNPB</span>
            <button
              id="copy-draft-report-btn"
              onClick={handleCopyReport}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 dark:bg-[#05140e] dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 text-xs border border-slate-300 dark:border-emerald-800 transition-colors shadow-xs"
            >
              {copySuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? 'Tersalin' : 'Salin Laporan'}</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-emerald-950 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2.5 leading-relaxed flex-1 overflow-y-auto max-h-[350px] shadow-xs">
            <div className="border-b border-slate-200 dark:border-emerald-950 pb-2 text-center text-slate-900 dark:text-white">
              <div className="font-bold text-xs">PUSAT VULKANOLOGI DAN MITIGASI BENCANA GEOLOGI</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400">BADAN GEOLOGI - KEMENTERIAN ESDM</div>
            </div>

            <div>
              <strong>NOMOR LAPORAN:</strong> {reasoningData.officialDraftReport.nomorLaporan}<br />
              <strong>TANGGAL/WAKTU:</strong> {reasoningData.officialDraftReport.tanggalWaktuWIB}<br />
              <strong>PERIODE EVALUASI:</strong> {reasoningData.officialDraftReport.periodeEvaluasi}
            </div>

            <div>
              <strong className="text-emerald-700 dark:text-emerald-400">I. KESIMPULAN HASIL PENGAMATAN:</strong>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{reasoningData.officialDraftReport.kesimpulanPengamatan}</p>
            </div>

            <div>
              <strong className="text-emerald-700 dark:text-emerald-400">II. REKOMENDASI PVMBG:</strong>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{reasoningData.officialDraftReport.rekomendasiPVMBG}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400">
              Penandatangan Draft: <strong>{reasoningData.officialDraftReport.penandatanganDraft}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-2.5 pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-emerald-950 flex items-center justify-between">
        <span>{reasoningData.guardrailDisclaimer}</span>
        <span className="hidden sm:inline text-emerald-600 dark:text-emerald-500 font-mono font-medium">Decision Support System</span>
      </div>
    </div>
  );
};
