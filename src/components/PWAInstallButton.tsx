import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share2, PlusSquare } from 'lucide-react';
import { Language } from '../types';

interface PWAInstallButtonProps {
  lang: Language;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang, className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as installed standalone app, suppress prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 ${className}`}
        title={lang === 'bn' ? 'ফোনে ইনস্টল করুন' : 'Install App on Phone'}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{lang === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl cursor-pointer ${className}`}
          title={lang === 'bn' ? 'আইফোনে ইনস্টল করুন' : 'Install on iPhone'}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'bn' ? 'আইফোনে অ্যাপ যুক্ত করুন' : 'Install on iPhone / iPad'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'হোম স্ক্রিনে ইনস্টল করে সরাসরি অ্যাপ হিসেবে চালান' : 'Run fullscreen without browser address bar'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{lang === 'bn' ? 'Safari ব্রাউজারের নিচে' : 'Tap Safari'}</span>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'bn' ? 'Share বাটনে চাপ দিন' : 'Share button'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{lang === 'bn' ? 'তালিকা থেকে' : 'Scroll down & tap'}</span>
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">
                      {lang === 'bn' ? '"Add to Home Screen"' : '"Add to Home Screen"'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>{lang === 'bn' ? 'উপরে "Add" চাপুন। অ্যাপটি ফোনে চলে আসবে!' : 'Tap "Add". The app icon appears on your home screen!'}</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full mt-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that don't support beforeinstallprompt yet (or already installed)
  return (
    <button
      onClick={() => {
        alert(
          lang === 'bn'
            ? 'আপনার ব্রাউজারের মেনু (⋮) তে গিয়ে "Install App" অথবা "Add to Home Screen" সিলেক্ট করুন।'
            : 'Tap your browser menu (⋮) and select "Install app" or "Add to Home Screen".'
        );
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl cursor-pointer ${className}`}
      title={lang === 'bn' ? 'হোম স্ক্রিনে ইনস্টল করুন' : 'Add to Home Screen'}
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>{lang === 'bn' ? 'মোবাইল অ্যাপ' : 'Mobile App'}</span>
    </button>
  );
};
