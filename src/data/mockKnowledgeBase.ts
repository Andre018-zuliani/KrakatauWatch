export interface RAGDocument {
  id: string;
  category: 'SOP' | 'HISTORI' | 'DEMOGRAFI' | 'PENERBANGAN' | 'KONTAK';
  title: string;
  sourceCode: string;
  institution: string;
  year: string;
  summary: string;
  fullText: string;
}

export const KRAKATAU_RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: 'sop-pvmbg-04',
    category: 'SOP',
    title: 'SOP No. 04/PVMBG/2023: Pedoman Standar Operasional Pemantauan & Peningkatan Status Gunungapi Anak Krakatau',
    sourceCode: 'SOP PVMBG No. 04/2023',
    institution: 'Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG - Badan Geologi)',
    year: '2023',
    summary: 'Ketentuan teknis kriteria peningkatan status Level I (Normal) hingga Level IV (Awas), batasan radius bahaya, dan kewajiban notifikasi ke BNPB/BPBD.',
    fullText: `
KETENTUAN STATUS VULKANIK:
1. Level I (Normal): Aktivitas visual dan seismik dasar. Radius bahaya: 2 km dari kawah aktif.
2. Level II (Waspada): Teramati peningkatan kegempaan vulkanik (VA/VB) dan hembusan asap kawah. Radius bahaya: 3 km dari kawah aktif.
3. Level III (Siaga): Gempa tremor menerus terekam konsisten, letusan abu berulang dengan kolom >1000m, anomali termal satelit signifikan. Radius bahaya: 5 km dari pusat kawah. Rekomendasi: larangan seluruh aktivitas wisata/nelayan di dalam radius 5 km; kesiapsiagaan mitigasi tsunami lokal di pesisir Selat Sunda.
4. Level IV (Awas): Erupsi eksplosif paroksismal terus-menerus, deformasi lereng kawah masif terdeteksi (risiko flank collapse/longsor bawah laut). Radius bahaya: minimal 7 km atau perluasan kontinjensi ke pesisir Banten dan Lampung Selatan.`
  },
  {
    id: 'perka-bnpb-02',
    category: 'SOP',
    title: 'Peraturan Kepala BNPB No. 02 Tahun 2012: Pedoman Rencana Kontinjensi Bencana Erupsi & Tsunami Vulkanik',
    sourceCode: 'Perka BNPB No. 02/2012',
    institution: 'Badan Nasional Penanggulangan Bencana (BNPB)',
    year: '2012',
    summary: 'Prosedur mobilisasi evakuasi darurat, aktivasi pos komando, rantai komando peringatan dini, dan manajemen pengungsi pesisir.',
    fullText: `
MANAJEMEN EVAKUASI & RUTE AMAN:
1. Waktu evakuasi mandiri (Golden Time) untuk tsunami akibat longsor kawah vulkanik Selat Sunda berkisar antara 25 hingga 35 menit pasca kejadian runtuhan.
2. Tempat Evakuasi Sementara (TES): Bangunan bertingkat kokoh minimal ketinggian elevasi +15 meter di atas permukaan laut (dpl) atau perbukitan berjarak minimal 500 meter dari garis pasang pantai.
3. Rute Evakuasi Utama:
   - Lampung Selatan: Jalur Lintas Sumatera arah Kalianda pedalaman (Bukit Rajabasa, GOR Way Handak).
   - Banten: Jalur Labuan - Menes, Simpang Anyer - Mancak, Jalur Carita - Cinangka perbukitan.
4. Logistik masker standar minimal N95 atau masker bedah rangkap untuk pencegahan ISPA akibat hujan abu vulkanik pekat.`
  },
  {
    id: 'histori-erupsi-2018',
    category: 'HISTORI',
    title: 'Laporan Analisis Komparatif Erupsi Paroksismal & Flank Collapse Anak Krakatau 22 Desember 2018',
    sourceCode: 'BMKG/PVMBG Arsip Bencana 2018',
    institution: 'PVMBG, BMKG & Geoscience Research',
    year: '2018',
    summary: 'Prekursor seismik, runtuhan dinding kawah barat daya seluas 64 hektar, dan mekanisme pemicu tsunami tanpa gempa tektonik besar.',
    fullText: `
PREKURSOR DAN POLA ERUPSI 2018:
1. Terjadi peningkatan tremor vulkanik berfrekuensi rendah (harmonic tremor 2-4 Hz) selama 6 bulan sebelum runtuhan, dengan lonjakan tajam 48 jam sebelum insiden.
2. Volume material longsor ke laut mencapai ~0.2 km³ (dinding kawah barat-daya), ketinggian pulau menyusut drastis dari 338 m dpl menjadi 110 m dpl.
3. Tsunami melanda pesisir Banten (Anyer, Carita, Sumur) dan Lampung Selatan (Kalianda, Rajabasa) dengan run-up tertinggi mencapai 13.5 meter tanpa didahului gempa tektonik yang dirasakan masyarakat.
4. Pelajaran Utama: Sistem deteksi wajib mendeteksi penurunan/perubahan frekuensi seismik kontinu dan anomali deformasi/termal kawah secara otomatis.`
  },
  {
    id: 'histori-erupsi-1883',
    category: 'HISTORI',
    title: 'Rekam Sejarah Letusan Kataklismik Krakatau 26-27 Agustus 1883',
    sourceCode: 'Monograf Sejarah Krakatau 1883',
    institution: 'Verbeek & Royal Society Geological Monograph',
    year: '1883',
    summary: 'Letusan skala VEI 6, runtuhnya kaldera purba, gelombang tsunami global 36 meter, dan sebaran abu stratosfer.',
    fullText: `
LELESTARI ANOMALI:
1. Kolom abu mencapai ketinggian 80 km (lapisan mesosfer), menghasilkan abu vulkanik yang mengelilingi bumi dan memicu pendinginan iklim global sebesar 1.2°C selama 5 tahun.
2. Runtuhnya badan gunung ke dalam laut membentuk kaldera bawah laut yang menjadi pondasi kelahiran Anak Krakatau pada tahun 1927.
3. Dampak historis menegaskan kompleks Krakatau memiliki potensi hidro-vulkanik (freatomagmatik) eksplosif ekstrem akibat interaksi magma dengan air laut dangkal.`
  },
  {
    id: 'vona-icao-standard',
    category: 'PENERBANGAN',
    title: 'ICAO Annex 3 & VONA (Volcano Observatory Notice for Aviation) Standard Guide',
    sourceCode: 'ICAO Doc 9766 / AirNav Indonesia',
    institution: 'International Civil Aviation Organization & AirNav Indonesia',
    year: '2024',
    summary: 'Standar pelaporan kode warna penerbangan (GREEN, YELLOW, ORANGE, RED) dan keselamatan koridor udara Selat Sunda.',
    fullText: `
KODE WARNA PENERBANGAN:
- GREEN: Gunung api dalam status normal/tidur.
- YELLOW: Aktivitas meningkat, tidak ada erupsi abu.
- ORANGE: Erupsi abu vulkanik sedang terjadi dengan ketinggian kolom di bawah FL200 (<20,000 kaki), atau potensi erupsi tinggi.
- RED: Erupsi signifikan sedang berlangsung dengan semburan abu mencapai atau diproyeksikan melebihi FL200 (>20,000 kaki), mengancam jalur udara internasional.
Jalur udara rawan: ATS Route W12, W15, R465 (koridor Cengkareng - Sumatera - Singapura).`
  },
  {
    id: 'demografi-rawan',
    category: 'DEMOGRAFI',
    title: 'Data Demografi Wilayah Pesisir Rawan Bencana Selat Sunda (Banten & Lampung Selatan)',
    sourceCode: 'BPS & Data BPBD 2025/2026',
    institution: 'Badan Pusat Statistik & BPBD Provinsi',
    year: '2026',
    summary: 'Estimasi penduduk terpapar, sarana fasilitas publik, dan koordinat posko penampungan.',
    fullText: `
SEBARAN PENDUDUK & FASILITAS:
- Kabupaten Lampung Selatan (Kecamatan Rajabasa & Kalianda): ~84,200 jiwa berada dalam radius paparan tsunami/abu pekat. Posko utama: Lapangan Tenis Kalianda & GOR Way Handak.
- Kabupaten Pandeglang (Kecamatan Sumur, Labuan, Panimbang): ~112,000 jiwa. Posko utama: Kantor Camat Menes, Puskesmas Panimbang (elevasi aman).
- Kabupaten Serang / Cilegon (Anyer, Cinangka, Ciwandan): ~95,000 jiwa + kawasan industri vital pesisir. Posko utama: Kantor Kecamatan Mancak & Area Perbukitan Pakupatan.`
  }
];

export const EMERGENCY_CONTACTS = [
  { name: 'Pos Pengamatan Gunungapi Anak Krakatau (Pasauran)', phone: '(0254) 601-443', role: 'Pengamat PVMBG 24 Jam' },
  { name: 'Pusdalops BNPB Jakarta', phone: '117 / (021) 2982-7799', role: 'Pusat Krisis Bencana Nasional' },
  { name: 'BPBD Provinsi Banten (Serang)', phone: '(0254) 848-1111', role: 'Koordinator Lapangan Banten' },
  { name: 'BPBD Kabupaten Lampung Selatan', phone: '(0727) 321-199', role: 'Koordinator Lapangan Lampung' },
  { name: 'Basarnas Kantor Pencarian & Pertolongan Banten', phone: '115 / (0254) 387-511', role: 'Operasi SAR & Evakuasi Laut' },
  { name: 'AirNav Indonesia Unit VONA Cengkareng', phone: '(021) 5591-5000', role: 'Keselamatan Navigasi Penerbangan' }
];
