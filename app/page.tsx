'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function XSSSimulationLab() {
  // --- STATE MANAGEMENT ---
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState('');
  const [isSafeMode, setIsSafeMode] = useState(false); // Default: Unsafe
  
  // State Data Korban
  const [victimData, setVictimData] = useState({ 
    cookie: 'RAHASIA_ADMIN_12345', 
    localStorage: '0xABC_DOMPET_KRIPTO_KEY' 
  });

  // --- EFFECT: Setup Simulasi & Baca URL ---
  useEffect(() => {
    // 1. SIMULASI: Tanamkan Data Default ke Browser saat load pertama
    syncToBrowser('RAHASIA_ADMIN_12345', '0xABC_DOMPET_KRIPTO_KEY');

    // 2. LOGIKA REFLECTED XSS (BACA URL)
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      setInput(searchParam);
      setDisplay(searchParam); 
    }
  }, []);

  // --- HELPER: Sinkronisasi ke Browser Storage ---
  const syncToBrowser = (cookieVal: string, storageVal: string) => {
    // Set Cookie (Hanya update value untuk key session_token)
    document.cookie = `session_token=${cookieVal}; path=/`;
    // Set LocalStorage
    localStorage.setItem("user_wallet", storageVal);
  };

  // --- HANDLER: Edit Data Korban ---
  const handleVictimDataChange = (field: 'cookie' | 'localStorage', value: string) => {
    setVictimData(prev => {
      const newData = { ...prev, [field]: value };
      // Langsung update storage browser agar real-time
      if (field === 'cookie') {
        document.cookie = `session_token=${value}; path=/`;
      } else {
        localStorage.setItem("user_wallet", value);
      }
      return newData;
    });
  };

  const resetVictimData = () => {
    const defCookie = "RAHASIA_ADMIN_12345";
    const defStorage = "0xABC_DOMPET_KRIPTO_KEY";
    setVictimData({ cookie: defCookie, localStorage: defStorage });
    syncToBrowser(defCookie, defStorage);
  };

  // --- HANDLER: Tombol Render XSS ---
  const handleSimulate = () => {
    if (isSafeMode) {
      const cleanHtml = DOMPurify.sanitize(input);
      setDisplay(cleanHtml);
    } else {
      setDisplay(input);
    }
  };

  // --- HANDLER: Quick Payload & Reset ---
  const setPayload = (payload: string) => setInput(payload);

  const clearAll = () => {
    setInput('');
    setDisplay('');
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
      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: EDIT DATA KORBAN --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors ${isSafeMode ? 'bg-emerald-900/50 border-emerald-700/50' : 'bg-slate-800/50 border-slate-700/50'}`}>
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-lg">🕵️</span> Data Korban
              </h3>
              <button onClick={resetVictimData} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition">
                Reset Default
              </button>
            </div>
            
            <div className="space-y-5">
              {/* COOKIE INPUT */}
              <div>
                <label className="text-xs font-mono block mb-1 opacity-70 flex justify-between">
                  <span>document.cookie (session_token)</span>
                  <span className="text-green-400">Editable ✎</span>
                </label>
                <input
                  type="text"
                  value={victimData.cookie}
                  onChange={(e) => handleVictimDataChange('cookie', e.target.value)}
                  className="w-full bg-black/40 p-3 rounded border border-white/10 font-mono text-xs text-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-white/10"
                />
              </div>

              {/* LOCALSTORAGE INPUT */}
              <div>
                <label className="text-xs font-mono block mb-1 opacity-70 flex justify-between">
                  <span>localStorage (user_wallet)</span>
                  <span className="text-yellow-400">Editable ✎</span>
                </label>
                <input
                  type="text"
                  value={victimData.localStorage}
                  onChange={(e) => handleVictimDataChange('localStorage', e.target.value)}
                  className="w-full bg-black/40 p-3 rounded border border-white/10 font-mono text-xs text-yellow-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs leading-relaxed opacity-80 italic">
                Coba ubah data di atas, lalu jalankan payload <b>Steal Cookie</b>. Alert browser akan menampilkan data baru yang Anda ketik.
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
                  <span className="opacity-70">alert(document.cookie)</span>
                </button>
                <button 
                  onClick={() => setPayload('<img src=x onerror="document.body.innerHTML=\'<h1>HACKED</h1>\'">')}
                  className="text-left p-3 bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/20 rounded-lg text-xs font-mono transition group"
                >
                  <span className="block font-bold mb-1 text-yellow-400 group-hover:text-yellow-300">2. Deface Web</span>
                  <span className="opacity-70">body.innerHTML = ...</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. OUTPUT AREA (VULNERABLE) */}
          <div className="relative group">
            <div className={`absolute -top-3 left-6 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 border ${isSafeMode ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-600 text-white border-red-700 animate-pulse'}`}>
              {isSafeMode ? '✓ Sanitized Output' : '⚠ Unsafe Render Area'}
            </div>
            
            <div className={`bg-white text-slate-900 p-8 rounded-2xl min-h-[180px] shadow-2xl border-4 overflow-hidden break-words transition-all ${isSafeMode ? 'border-emerald-500/50' : 'border-red-500'}`}>
              
              {display ? (
                <div dangerouslySetInnerHTML={{ __html: display }} className="prose max-w-none" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <span className="text-4xl mb-2">🖥️</span>
                  <span className="text-sm italic">Hasil render HTML muncul di sini...</span>
                </div>
              )}
            </div>

            {isSafeMode && display && (
               <div className="mt-3 mx-2 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-200/80 flex gap-2 items-start">
                 <span className="text-lg">🛡️</span>
                 <p>
                   <strong>Info Keamanan:</strong> Payload berhasil dirender, tetapi tag berbahaya (script/handlers) telah dihapus oleh <code>DOMPurify</code>.
                 </p>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}