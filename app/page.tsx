'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function XSSSimulationLab() {
  // --- STATE MANAGEMENT ---
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState('');
  const [isSafeMode, setIsSafeMode] = useState(false); // Default: Unsafe
  const [victimData, setVictimData] = useState({ cookie: '', localStorage: '' });

  // --- EFFECT: Setup Simulasi & Baca URL ---
  useEffect(() => {
    // 1. SIMULASI: Tanamkan Data Palsu di Browser
    document.cookie = "session_token=RAHASIA_ADMIN_12345; path=/";
    localStorage.setItem("user_wallet", "0xABC_DOMPET_KRIPTO_KEY");
    
    setVictimData({
      cookie: "session_token=RAHASIA_ADMIN_12345",
      localStorage: "0xABC_DOMPET_KRIPTO_KEY"
    });

    // 2. LOGIKA REFLECTED XSS (BACA URL)
    // Cek apakah ada parameter '?search=' di URL saat halaman dimuat
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      // Jika ada, masukkan ke input dan langsung render (Reflected)
      setInput(searchParam);
      
      // Catatan: Saat load awal, kita anggap mode sesuai default (Unsafe)
      // atau bisa ditambahkan logika cek isSafeMode jika ingin persist
      setDisplay(searchParam); 
    }
  }, []); // Array kosong = hanya jalan sekali saat mount

  // --- HANDLER: Tombol Render ---
  const handleSimulate = () => {
    if (isSafeMode) {
      // MITIGASI: Bersihkan input dari script berbahaya
      const cleanHtml = DOMPurify.sanitize(input);
      setDisplay(cleanHtml);
    } else {
      // VULNERABLE: Render apa adanya
      setDisplay(input);
    }
  };

  // --- HANDLER: Quick Payload Buttons ---
  const setPayload = (payload: string) => {
    setInput(payload);
  };

  const clearAll = () => {
    setInput('');
    setDisplay('');
    // Opsional: Bersihkan URL agar bersih
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isSafeMode ? 'bg-emerald-950 text-emerald-100' : 'bg-slate-900 text-slate-200'}`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-500 ${isSafeMode ? 'bg-emerald-900/90 border-emerald-700 backdrop-blur' : 'bg-slate-900/90 border-slate-700 backdrop-blur'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg transition-colors duration-500 ${isSafeMode ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
              JS
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">
                XSS <span className={isSafeMode ? 'text-emerald-300' : 'text-indigo-400'}>Simulation Lab</span>
              </h1>
              <p className="text-[10px] opacity-70 font-mono mt-0.5">Next.js • Tailwind • DOMPurify</p>
            </div>
          </div>

          {/* TOGGLE SWITCH */}
          <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <span className={`text-xs font-bold tracking-wider ${!isSafeMode ? 'text-red-400' : 'text-white/30'}`}>UNSAFE</span>
            <button 
              onClick={() => setIsSafeMode(!isSafeMode)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${isSafeMode ? 'bg-emerald-500' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isSafeMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-xs font-bold tracking-wider ${isSafeMode ? 'text-emerald-300' : 'text-white/30'}`}>SAFE</span>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: INFO KORBAN --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${isSafeMode ? 'bg-emerald-900/50 border-emerald-700/50' : 'bg-slate-800/50 border-slate-700/50'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
              <span className="text-lg">🕵️</span> Data Korban (Simulasi)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono block mb-1 opacity-70">document.cookie</label>
                <div className="text-xs bg-black/40 p-3 rounded border border-white/10 font-mono break-all text-green-400">
                  {victimData.cookie || 'Loading...'}
                </div>
              </div>
              <div>
                <label className="text-xs font-mono block mb-1 opacity-70">localStorage</label>
                <div className="text-xs bg-black/40 p-3 rounded border border-white/10 font-mono break-all text-yellow-400">
                  {victimData.localStorage || 'Loading...'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs leading-relaxed opacity-80">
                Data di atas tersimpan di browser Anda saat ini. XSS dapat digunakan untuk mencuri data ini jika website rentan.
              </p>
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: AREA SERANGAN --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. INPUT CARD */}
          <div className={`rounded-2xl shadow-xl border p-6 transition-colors ${isSafeMode ? 'bg-emerald-900/80 border-emerald-700' : 'bg-slate-800 border-slate-700'}`}>
            <label className="block text-sm font-medium mb-3 opacity-90">
              Inject Payload (HTML/JavaScript)
            </label>
            
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-current outline-none mb-4 placeholder:text-white/20 transition-all"
              placeholder='<img src=x onerror=alert(1)>'
            />
            
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={handleSimulate}
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg transform active:scale-95 transition-all ${isSafeMode ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'}`}
                >
                  {isSafeMode ? '🛡️ Render Aman' : '🚀 Execute Attack'}
                </button>
                <button onClick={clearAll} className="px-4 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors opacity-70 hover:opacity-100">
                  Reset
                </button>
              </div>
            </div>

            {/* PRESETS */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase mb-3 opacity-50 tracking-widest">Quick Payloads</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => setPayload('<img src=x onerror="alert(\'COOKIE: \' + document.cookie)">')}
                  className="text-left p-3 bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/20 rounded-lg text-xs font-mono transition group"
                >
                  <span className="block font-bold mb-1 text-red-400 group-hover:text-red-300">1. Steal Cookie</span>
                  alert(document.cookie)
                </button>
                <button 
                  onClick={() => setPayload('<img src=x onerror="document.body.innerHTML=\'<h1>HACKED</h1>\'">')}
                  className="text-left p-3 bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/20 rounded-lg text-xs font-mono transition group"
                >
                  <span className="block font-bold mb-1 text-yellow-400 group-hover:text-yellow-300">2. Deface Web</span>
                  body.innerHTML = ...
                </button>
              </div>
            </div>
          </div>

          {/* 2. OUTPUT AREA (VULNERABLE) */}
          <div className="relative group">
            {/* Label Status */}
            <div className={`absolute -top-3 left-6 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 border ${isSafeMode ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-600 text-white border-red-700 animate-pulse'}`}>
              {isSafeMode ? '✓ Sanitized Output' : '⚠ Unsafe Render Area'}
            </div>
            
            {/* Kotak Render */}
            <div className={`bg-white text-slate-900 p-8 rounded-2xl min-h-[180px] shadow-2xl border-4 overflow-hidden break-words transition-all ${isSafeMode ? 'border-emerald-500/50' : 'border-red-500'}`}>
              
              {display ? (
                // --- INI ADALAH TITIK VULNERABLE ---
                // dangerouslySetInnerHTML akan merender apapun isi 'display'
                // Jika Safe Mode ON, isinya sudah dibersihkan. Jika OFF, isinya raw HTML.
                <div dangerouslySetInnerHTML={{ __html: display }} className="prose max-w-none" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <span className="text-4xl mb-2">🖥️</span>
                  <span className="text-sm italic">Hasil render HTML muncul di sini...</span>
                </div>
              )}
            </div>

            {/* Info Teknis Tambahan */}
            {isSafeMode && display && (
               <div className="mt-3 mx-2 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-200/80 flex gap-2 items-start">
                 <span className="text-lg">🛡️</span>
                 <p>
                   <strong>Info Keamanan:</strong> Payload berhasil dirender, tetapi tag berbahaya (script/handlers) telah dihapus oleh <code>DOMPurify</code>. Tidak ada eksekusi kode yang terjadi.
                 </p>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}