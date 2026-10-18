import React, { useState } from 'react';
import { Language } from '../types';
import { BookOpen, Copy, Check, FileText, Smartphone, Database, DollarSign, Cpu } from 'lucide-react';

interface DocumentationModalProps {
  lang: Language;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ lang }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const firebaseRulesSnippet = `{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}`;

  const capacitorCommands = `# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Android Project
npx cap init "Abacus Master" "com.abacusmaster.soroban" --web-dir "dist"

# 3. Build Web Assets
npm run build

# 4. Add Android Platform
npx cap add android

# 5. Sync and Open in Android Studio
npx cap sync
npx cap open android`;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-slate-200">
      {/* Title */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'bn' ? 'টেকনিক্যাল ডকুমেন্টেশন ও আর্কিটেকচার' : 'Technical Documentation & Architecture'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'সোরোবান লার্নিং প্ল্যাটফর্ম, ফায়ারবেজ ও অ্যাপ পাবলিশিং সহায়িকা' : 'Complete developer reference, Firebase setup, and release guide'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: System Architecture */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
          <Cpu className="w-4 h-4" />
          <span>{lang === 'bn' ? '১. সিস্টেম ও টেকনোলজি আর্কিটেকচার' : '1. System & Technology Stack'}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'bn'
            ? 'এই এপ্লিকেশনটি আধুনিক React 19, TypeScript, Tailwind CSS এবং Web Audio API দিয়ে নির্মিত। প্রতিটি সোরোবান রডে ১টি স্বর্গীয় পুঁতি (মান ৫) এবং ৪টি পার্থিব পুঁতি (মান ১ প্রতিটি) রয়েছে। ৩ডি ডায়মন্ড শেপ এসভিজি (Biconical Rhombus) রেন্ডারিং এর মাধ্যমে বাস্তব সোরোবানের অনুরূপ অনুভূতি দেওয়া হয়েছে।'
            : 'Built with React 19, TypeScript, Tailwind CSS, and zero-latency Web Audio API synthesis. The Japanese Soroban model implements 1 heaven bead (5) and 4 earth beads (1 each) with authentic biconical 3D diamond geometry.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Frontend</span>
            <span className="font-bold text-white">React 19 + Vite</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Database & Auth</span>
            <span className="font-bold text-amber-300">Firebase RTDB</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tactile Audio</span>
            <span className="font-bold text-emerald-300">Web Audio API</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Mobile Wrapper</span>
            <span className="font-bold text-cyan-300">Capacitor Android</span>
          </div>
        </div>
      </div>

      {/* Section 2: Firebase Configuration & Security Rules */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-bold text-cyan-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>{lang === 'bn' ? '২. ফায়ারবেজ কনফিগারেশন ও সিকিউরিটি রুলস' : '2. Firebase Setup & Security Rules'}</span>
          </div>
          <button
            onClick={() => copyToClipboard(firebaseRulesSnippet, 'rules')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            {copiedSection === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>

        <p className="text-xs text-slate-300">
          {lang === 'bn'
            ? 'প্রদত্ত Firebase Realtime Database URL (abacus-master-b7d57-default-rtdb.firebaseio.com) এ ইউজারদের তথ্য নিরাপদ রাখতে নিচের সিকিউরিটি রুলসটি Firebase Console এ পেস্ট করুন:'
            : 'Paste this security rule into your Firebase Console -> Realtime Database -> Rules tab to ensure users only read and write their own progress:'}
        </p>

        <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
          {firebaseRulesSnippet}
        </pre>
      </div>

      {/* Section 3: Android APK Generation Guide */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-bold text-emerald-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'bn' ? '৩. গুগল প্লে স্টোরের জন্য Android APK / AAB তৈরি' : '3. Android APK & Google Play Release'}</span>
          </div>
          <button
            onClick={() => copyToClipboard(capacitorCommands, 'cap')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            {copiedSection === 'cap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Commands</span>
          </button>
        </div>

        <p className="text-xs text-slate-300">
          {lang === 'bn'
            ? 'এই প্রজেক্টটিকে পূর্ণাঙ্গ মোবাইল অ্যাপ বানাতে আপনার টার্মিনালে নিচের কমান্ডগুলো রান করুন:'
            : 'Convert this web project into a standalone Android APK / AAB package using Capacitor:'}
        </p>

        <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
          {capacitorCommands}
        </pre>
      </div>

      {/* Section 4: Monetization & Ad Network Strategy */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
          <DollarSign className="w-4 h-4" />
          <span>{lang === 'bn' ? '৪. Adsterra ও Monetag মনিটাইজেশন কৌশল' : '4. Monetization Strategy'}</span>
        </div>
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>Adsterra Social Bar:</strong> সোশ্যাল বার মোবাইল স্ক্রিনের নিচে বা পাশে ছোট আইকন হিসেবে আসে যা সিলেকশন বা ড্র্যাগিংয়ে ব্যাঘাত ঘটায় না এবং সর্বোচ্চ ক্লিক থ্রু রেট (CTR) দেয়।
          </p>
          <p>
            <strong>Monetag Vignette & Rewarded:</strong> শিক্ষার্থী যখন লেভেল সম্পন্ন করে বা আঞ্জান রাউন্ড শেষ করে, তখন ৫ সেকেন্ডের রিওয়ার্ডেড অ্যাড দেখানো প্লে স্টোর ও ব্যবহারকারী উভয়ের কাছে গ্রহণযোগ্য।
          </p>
        </div>
      </div>
    </div>
  );
};
