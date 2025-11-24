'use client';

import { useState, useEffect } from 'react';

export default function XSSAdvancedLab() {
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState('');
  const [victimData, setVictimData] = useState({ cookie: '', localStorage: '' });

  useEffect(() => {
    // Set Fake Cookie
    document.cookie = "session_token=RAHASIA_USER_12345; path=/";
    // Set Fake LocalStorage
    localStorage.setItem("user_wallet", "0xABC_DUMMY_WALLET_KEY");
    
    setVictimData({
      cookie: "session_token=RAHASIA_USER_12345",
      localStorage: "0xABC_DUMMY_WALLET_KEY"
    });
  }, []);

  const handleSimulate = () => {
    setDisplay(input);
  };

  const setPayload = (payload: string) => {
    setInput(payload);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      {/* --- Navbar --- */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/50">
              JS
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Advanced <span className="text-indigo-400">XSS Lab</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-mono px-2 py-1 bg-slate-700 rounded text-slate-400">
               Next.js v14+
             </span>
             <span className="text-xs font-bold px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/50 animate-pulse">
              UNSAFE MODE
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: Informasi Target --- */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Data Korban (Simulasi)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-indigo-400 font-mono block mb-1">document.cookie</label>
                <div className="text-xs bg-slate-950 p-2 rounded border border-slate-700 font-mono break-all text-green-400">
                  {victimData.cookie}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  *Cookie ini tidak memiliki flag HttpOnly, jadi bisa dicuri.
                </p>
              </div>
              <div>
                <label className="text-xs text-indigo-400 font-mono block mb-1">localStorage</label>
                <div className="text-xs bg-slate-950 p-2 rounded border border-slate-700 font-mono break-all text-yellow-400">
                  user_wallet: "{victimData.localStorage}"
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 p-5 rounded-xl border border-blue-800/50">
             <h4 className="text-blue-400 font-bold text-sm mb-2">Misi Anda:</h4>
             <p className="text-xs text-blue-200 leading-relaxed">
               Gunakan celah XSS di sebelah kanan untuk memunculkan (alert) isi <b>Cookie</b> atau <b>LocalStorage</b> milik korban.
             </p>
          </div>
        </div>

        {/* --- KOLOM KANAN: Area Serangan --- */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Input Card */}
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Inject Payload (HTML/JS)
            </label>
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-600 rounded-lg p-3 text-sm font-mono text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-4 placeholder:text-slate-600"
              placeholder='<img src=x onerror=alert("Hello")>'
            />
            
            <div className="flex justify-between items-center">
               <div className="flex gap-2">
                 <button
                  onClick={handleSimulate}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20 text-sm"
                 >
                   Execute Attack
                 </button>
                 <button
                  onClick={() => {setInput(''); setDisplay('');}}
                  className="text-slate-400 hover:text-white px-3 py-2 text-sm"
                 >
                   Reset
                 </button>
               </div>
            </div>

            {/* Quick Payloads */}
            <div className="mt-6 border-t border-slate-700 pt-4">
              <p className="text-xs text-slate-500 font-bold uppercase mb-2">Preset Serangan:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  onClick={() => setPayload('<img src=x onerror=alert(document.cookie)>')}
                  className="text-left px-3 py-2 bg-slate-700/50 hover:bg-red-900/30 hover:border-red-500/50 border border-transparent rounded text-xs font-mono text-red-300 transition group"
                >
                  <span className="block text-white font-bold mb-1 group-hover:text-red-400">1. Steal Cookie</span>
                  alert(document.cookie)
                </button>

                <button 
                  onClick={() => setPayload("<img src=x onerror=alert(localStorage.getItem('user_wallet'))>")}
                  className="text-left px-3 py-2 bg-slate-700/50 hover:bg-yellow-900/30 hover:border-yellow-500/50 border border-transparent rounded text-xs font-mono text-yellow-300 transition group"
                >
                  <span className="block text-white font-bold mb-1 group-hover:text-yellow-400">2. Steal LocalStorage</span>
                  alert(localStorage...)
                </button>
                
                <button 
                  onClick={() => setPayload("<img src=x onerror=\"document.body.innerHTML='<h1>HACKED BY XSS</h1>'\">")}
                  className="text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600 border border-transparent rounded text-xs font-mono text-slate-300 transition"
                >
                  <span className="block text-white font-bold mb-1">3. Deface Page</span>
                  document.body.innerHTML...
                </button>

                <button 
                  onClick={() => setPayload("<img src=x onerror=\"alert('Browser User Agent: ' + navigator.userAgent)\">")}
                  className="text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600 border border-transparent rounded text-xs font-mono text-slate-300 transition"
                >
                  <span className="block text-white font-bold mb-1">4. Get User Info</span>
                  alert(navigator.userAgent)
                </button>
              </div>
            </div>
          </div>

          {/* Vulnerable Output Area - BAGIAN YANG DIPERBAIKI */}
          <div className="relative">
            <div className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm z-10">
              Browser Render Area
            </div>
            
            <div className="bg-white text-black p-6 rounded-xl min-h-[150px] shadow-2xl border-2 border-slate-700 overflow-hidden break-words">
              {/* LOGIKA PERBAIKAN: Jika ada display, render HTML bahaya. Jika tidak, render teks biasa. */}
              {display ? (
                <div dangerouslySetInnerHTML={{ __html: display }} />
              ) : (
                <span className="text-slate-300 italic text-sm">Hasil render HTML akan muncul di sini...</span>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}