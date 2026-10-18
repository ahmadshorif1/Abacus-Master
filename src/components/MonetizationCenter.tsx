import React, { useState } from 'react';
import { Language, AdConfiguration } from '../types';
import { DollarSign, ShieldAlert, CheckCircle, Code, Eye, Settings, Play, Award, HelpCircle } from 'lucide-react';
import { sound } from '../services/audio';

interface MonetizationCenterProps {
  lang: Language;
}

const DEFAULT_CONFIG: AdConfiguration = {
  adsterraEnabled: true,
  monetagEnabled: true,
  adsterraNativeBannerKey: '4a9b8c7d6e5f4123890abc',
  adsterraSocialBarKey: '//pl22345678.profitablegatecpm.com/4a/9b/8c/...',
  monetagZoneId: '8934521',
  monetagInPagePushKey: 'https://al5sm.com/pfe/current/tag.min.js?z=8934521',
  testMode: true
};

export const MonetizationCenter: React.FC<MonetizationCenterProps> = ({ lang }) => {
  const [config, setConfig] = useState<AdConfiguration>(() => {
    try {
      const saved = localStorage.getItem('abacus_ad_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'preview' | 'setup' | 'guidelines'>('preview');
  const [rewardedAdOpen, setRewardedAdOpen] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const saveConfig = (newCfg: AdConfiguration) => {
    setConfig(newCfg);
    localStorage.setItem('abacus_ad_config', JSON.stringify(newCfg));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSimulateRewardedAd = () => {
    setRewardedAdOpen(true);
    setRewardClaimed(false);
  };

  const handleFinishRewardedAd = () => {
    setRewardedAdOpen(false);
    setRewardClaimed(true);
    sound.playSuccess();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-slate-200">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold mb-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মনিটাইজেশন ও বিজ্ঞাপন হাব' : 'Monetization & Ad Networks'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Adsterra & Monetag Integration Center
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {lang === 'bn'
              ? 'অ্যাবাকাস অ্যাপটিতে শিক্ষা ব্যাহত না করে কিভাবে Adsterra ও Monetag বিজ্ঞাপন যুক্ত করতে হবে এবং গুগল প্লে স্টোর ও ওয়েব থেকে আয় করা যাবে।'
              : 'Configure safe, non-intrusive educational ad units, placements, and publishing requirements.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              activeTab === 'preview' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'বিজ্ঞাপন প্রিভিউ' : 'Live Preview'}
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              activeTab === 'setup' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'কোড ও সেটিংস' : 'Script Setup'}
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              activeTab === 'guidelines' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'প্রফেশনাল গাইড' : 'App Guidelines'}
          </button>
        </div>
      </div>

      {/* Tab: Preview */}
      {activeTab === 'preview' && (
        <div className="flex flex-col gap-6">
          {/* Adsterra Native Banner Unit Preview */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-amber-400">Adsterra - Native Banner (300x250 / 728x90)</span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {config.testMode ? 'Sandbox Mode' : 'Live Mode'}
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-2xl">
                  🧮
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-amber-400 font-bold">Sponsored</span>
                  <h4 className="text-sm font-bold text-white">Smart Math Olympiad 2026</h4>
                  <p className="text-xs text-slate-400">Join the national mental arithmetic contest for students aged 6-15.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer shadow-md">
                Learn More
              </button>
            </div>
          </div>

          {/* Monetag In-Page Push (Social Bar) Preview */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-cyan-400">Monetag - In-Page Push (IPP) & Vignette</span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">High CPM Non-Intrusive</span>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-sm font-bold">
                  🔔
                </div>
                <div>
                  <p className="font-bold text-white">Daily Math Challenge is Live!</p>
                  <p className="text-slate-400 text-[11px]">Boost your streak and unlock the Gold Soroban skin.</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer">
                View
              </button>
            </div>
          </div>

          {/* Rewarded Video Ad Simulator */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-emerald-400">Rewarded Video Ad (Monetag / Adsterra)</span>
              <span className="text-[11px] text-emerald-400 font-bold">+50 XP Reward</span>
            </div>

            <p className="text-xs text-slate-300">
              {lang === 'bn'
                ? 'শিক্ষার্থীদের জন্য সবচেয়ে জনপ্রিয় বিজ্ঞাপন মডেল। ব্যবহারকারী স্বেচ্ছায় ৫-১০ সেকেন্ডের বিজ্ঞাপন দেখে অতিরিক্ত এক্সপি বা লাইফ অর্জন করে।'
                : 'Highest paying user-friendly format. Learners willingly watch a short sponsor clip to earn bonus XP or hints.'}
            </p>

            <button
              onClick={handleSimulateRewardedAd}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'bn' ? 'রিওয়ার্ডেড বিজ্ঞাপন টেস্ট করুন (Earn +50 XP)' : 'Simulate Rewarded Ad (Earn +50 XP)'}</span>
            </button>

            {rewardClaimed && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-bold animate-in fade-in duration-200">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'বিজ্ঞাপন সফলভাবে দেখা হয়েছে! ৫০ এক্সপি যোগ হয়েছে 🎉' : 'Ad completed! 50 XP credited successfully! 🎉'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Setup & Configuration */}
      {activeTab === 'setup' && (
        <div className="bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'বিজ্ঞাপন নেটওয়ার্কের কি এবং স্ক্রিপ্ট কনফিগারেশন' : 'Ad Network Keys & Script Setup'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn'
                ? 'আপনার Adsterra এবং Monetag ড্যাশবোর্ড থেকে প্রাপ্ত জোন আইডি বা স্ক্রিপ্ট এখানে যুক্ত করতে পারেন।'
                : 'Enter your Zone IDs and script tokens generated from your publisher dashboards.'}
            </p>
          </div>

          {savedNotice && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{lang === 'bn' ? 'কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!' : 'Configuration saved successfully!'}</span>
            </div>
          )}

          <div className="flex flex-col gap-4 text-xs">
            {/* Adsterra Native Banner Key */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Adsterra Native Banner Zone Key
              </label>
              <input
                type="text"
                value={config.adsterraNativeBannerKey}
                onChange={e => setConfig({ ...config, adsterraNativeBannerKey: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            {/* Monetag Zone ID */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Monetag Zone ID / Tag URL
              </label>
              <input
                type="text"
                value={config.monetagZoneId}
                onChange={e => setConfig({ ...config, monetagZoneId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Test Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-200 font-bold block">Sandbox Test Mode</span>
                <span className="text-slate-400 text-[11px]">
                  {lang === 'bn' ? 'সরাসরি লাইভ বিজ্ঞাপনের বদলে পরীক্ষামূলক ব্যানার দেখাবে।' : 'Display simulated ads to avoid invalid impressions while developing.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.testMode}
                onChange={e => setConfig({ ...config, testMode: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
            </div>

            <button
              onClick={() => saveConfig(config)}
              className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer text-xs transition-colors"
            >
              {lang === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save Configuration'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Professional App Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>{lang === 'bn' ? 'প্রফেশনাল এডুকেশনাল অ্যাপ তৈরির সম্পূর্ণ গাইডলাইন' : 'Professional App & Monetization Strategy Guide'}</span>
            </h3>
          </div>

          {/* 1. Firebase Checklist */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-amber-400">১. ফায়ারবেজ (Firebase) সেটআপের আবশ্যকীয় তথ্য</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <li><strong>Authentication Providers:</strong> Firebase Console -&gt; Build -&gt; Authentication -&gt; Sign-in method এ গিয়ে <code className="text-amber-300">Email/Password</code> এবং <code className="text-amber-300">Anonymous</code> (গেস্ট ইউজারদের জন্য) এনেবল করতে হবে।</li>
              <li><strong>Realtime Database Rules:</strong> ডেটাবেজ রিড ও রাইট অনুমতির জন্য Security Rules এ <code className="text-amber-300">{`"rules": { "users": { "$uid": { ".read": "$uid === auth.uid", ".write": "$uid === auth.uid" } } }`}</code> কনফিগার করতে হবে।</li>
              <li><strong>Authorized Domains:</strong> Firebase Console -&gt; Authentication -&gt; Settings -&gt; Authorized domains এ আপনার লাইভ ডোমেইন বা Cloud Run URL যোগ করতে হবে।</li>
            </ul>
          </div>

          {/* 2. Adsterra Policy for Kids / Educational Apps */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-cyan-400">২. Adsterra ও Monetag পলিসি সতর্কতা (শিক্ষা অ্যাপের জন্য জরুরি)</h4>
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <p>
                ⚠️ <strong>অপ্রাপ্তবয়স্ক/শিক্ষা কনটেন্ট সুরক্ষা:</strong> অ্যাবাকাস মূলত শিক্ষার্থী এবং বাচ্চাদের গণিত শেখার জন্য। Adsterra ড্যাশবোর্ডে ডোমেইন যুক্ত করার সময় অবশ্যই <strong>"Adult/18+ Ads" ফিল্টার টিকমার্ক দিয়ে বন্ধ (Disable) করবেন</strong>। শুধুমাত্র Clean Mainstream Ads নির্বাচন করবেন।
              </p>
              <p>
                🎯 <strong>বিজ্ঞাপনের প্লেসমেন্ট নীতি:</strong> স্ক্রিনে অ্যাবাকাস নাড়াচাড়ার স্থানে কখনোই পপ-আপ বা ইন্টারস্টিশিয়াল রাখবেন না। প্রতি ৩-৫টি প্র্যাকটিস অংক সমাধান করার পর অথবা দৈনিক রিওয়ার্ডের ক্ষেত্রে Rewarded Ad দেখানো সবচেয়ে লাভজনক ও ইতিবাচক অভিজ্ঞতা তৈরি করে।
              </p>
            </div>
          </div>

          {/* 3. Mobile APK / AAB Conversion */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-emerald-400">৩. মোবাইল অ্যাপ (Android APK / AAB) হিসেবে গুগল প্লে স্টোরে প্রকাশ</h4>
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <p className="text-slate-300 font-sans text-xs">ক্যাপাসিটর (CapacitorJS) দিয়ে এই ওয়েবসাইটের কোডকে ১ কমান্ডে নেটিভ অ্যান্ড্রয়েড অ্যাপে রূপান্তর করা যায়:</p>
              <div className="bg-black/60 p-2.5 rounded-lg text-emerald-400">
                1. npm install @capacitor/core @capacitor/cli @capacitor/android<br/>
                2. npx cap init "Abacus Master" com.abacusmaster.soroban<br/>
                3. npm run build<br/>
                4. npx cap add android<br/>
                5. npx cap open android (Android Studio তে খুলে Build Signed APK / AAB)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rewarded Ad Simulated Modal */}
      {rewardedAdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
              🎬
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sponsor Message (Adsterra / Monetag)</h3>
              <p className="text-xs text-slate-400 mt-1">Watching short educational sponsor ad... Please wait 3 seconds.</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[pulse_1s_infinite] w-full" />
            </div>
            <button
              onClick={handleFinishRewardedAd}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Claim +50 XP Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
