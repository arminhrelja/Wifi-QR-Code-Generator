import { useState, useEffect } from 'react';
import * as QRCode from 'qrcode';
import { Wifi, Eye, EyeOff, Printer } from 'lucide-react';

export default function WifiQrForm() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const wifiQrValue = `WIFI:T:WPA;S:${ssid};P:${password};;`;

  useEffect(() => {
    if (ssid) {
      QRCode.toDataURL(wifiQrValue, { width: 220, margin: 2 })
        .then(setQrUrl)
        .catch(() => setQrUrl(null));
    } else {
      setQrUrl(null);
    }
  }, [ssid, password, wifiQrValue]);

  const handlePrint = () => {
    if (!qrUrl) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print QR</title></head><body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fff;color:#222;">');
      printWindow.document.write(`<h2 style='font-size:2rem;font-family:sans-serif;margin-bottom:1.5rem;'>WiFi: <span style='font-weight:700;'>${ssid}</span></h2>`);
      printWindow.document.write(`<img src='${qrUrl}' width='220' height='220' style='margin:0 0 1.5rem 0;display:block;border-radius:16px;box-shadow:0 2px 12px #0001;' />`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 200);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f1f5f9] to-[#f0fdfa] flex items-center justify-center py-10">
      <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-0 md:p-10 flex flex-col md:flex-row gap-8 items-stretch justify-center border border-zinc-100">
        {/* Forma za unos */}
        <div className="flex-1 flex flex-col justify-center gap-8 pr-0 md:pr-10 border-r-0 md:border-r border-zinc-100 py-10 md:py-0">
          <div className="flex items-center mb-2 gap-2.5">
            <Wifi className="w-10 h-10 text-indigo-500 mr-2" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 tracking-tight">WiFi QR Code Generator</h1>
          </div>
          <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-zinc-700 mb-1 font-semibold">WiFi naziv (SSID)</label>
              <input
                className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md text-lg"
                type="text"
                value={ssid}
                onChange={e => setSsid(e.target.value)}
                required
                placeholder="Unesite naziv mreže"
                autoFocus
              />
            </div>
            <div className="relative">
              <label className="block text-zinc-700 mb-1 font-semibold">WiFi šifra</label>
              <input
                className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12 shadow-md text-lg"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Unesite šifru mreže"
              />
              <button
                type="button"
                className="absolute right-3 top-14 -translate-y-1/2 text-zinc-500 hover:text-indigo-500 bg-zinc-100 rounded-full p-1 border border-zinc-200 shadow"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </form>
        </div>
        {/* QR kod prikaz */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-10 md:py-0">
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-lg p-8 flex flex-col items-center min-h-[320px] min-w-[260px]">
            {qrUrl ? (
              <>
                <img src={qrUrl || undefined} alt="WiFi QR code" width={220} height={220} className="rounded bg-white shadow mb-4" />
                <div className="flex flex-col items-center gap-1 mb-2">
                  <span className="text-zinc-700 text-base">Naziv: <b>{ssid}</b></span>
                  <span className="text-zinc-700 text-base">Šifra: <b>{password}</b></span>
                </div>
                <button
                  onClick={handlePrint}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors mt-2 shadow"
                >
                  <Printer size={20} /> Printaj QR kod
                </button>
              </>
            ) : (
              <span className="text-zinc-400 text-center">Unesite podatke za WiFi da generišete QR kod.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
