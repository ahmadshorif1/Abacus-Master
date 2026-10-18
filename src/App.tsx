/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Language,
  ThemeType
} from './types';
import {
  getLocalProfile,
  saveLocalProfile,
  syncStatsToCloud,
  loadStatsFromCloud,
  auth,
  onAuthStateChanged,
  signOut
} from './services/firebase';
import { sound } from './services/audio';
import { getT } from './constants/translations';
import { PracticeModes } from './components/PracticeModes';
import { LessonViewer } from './components/LessonViewer';
import { MonetizationCenter } from './components/MonetizationCenter';
import { DocumentationModal } from './components/DocumentationModal';
import { AuthModal } from './components/AuthModal';

import {
  Calculator,
  BookOpen,
  DollarSign,
  FileCode,
  User,
  Volume2,
  VolumeX,
  Flame,
  Award,
  Globe
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [theme, setTheme] = useState<ThemeType>('rainbow');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentNav, setCurrentNav] = useState<'practice' | 'lessons' | 'monetization' | 'docs'>('practice');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getLocalProfile());

  const t = getT(lang);

  // Sync sound setting to audio engine
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fireUser) => {
      if (fireUser) {
        const cloudStats = await loadStatsFromCloud(fireUser.uid);
        setUserProfile(prev => {
          const updated: UserProfile = {
            uid: fireUser.uid,
            email: fireUser.email,
            displayName: fireUser.displayName || prev.displayName,
            isAnonymous: fireUser.isAnonymous,
            stats: cloudStats || prev.stats
          };
          saveLocalProfile(updated);
          return updated;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Update Stats & XP helper
  const handleRecordResult = (correct: boolean, xpEarned: number) => {
    setUserProfile(prev => {
      const stats = { ...prev.stats };
      stats.solvedCount += 1;
      if (correct) {
        stats.correctCount += 1;
        stats.streak += 1;
        if (stats.streak > stats.bestStreak) {
          stats.bestStreak = stats.streak;
        }
        stats.xp += xpEarned;
        // Level up every 100 XP
        stats.level = Math.floor(stats.xp / 100) + 1;
      } else {
        stats.streak = 0;
      }
      stats.lastActive = new Date().toISOString();

      const updated = { ...prev, stats };
      saveLocalProfile(updated);
      syncStatsToCloud(updated.uid, stats);
      return updated;
    });
  };

  // Complete lesson step handler
  const handleCompleteLessonStep = (lessonId: string, _stepId: string, xpGain: number) => {
    setUserProfile(prev => {
      const stats = { ...prev.stats };
      if (!stats.completedLessons.includes(lessonId)) {
        stats.completedLessons.push(lessonId);
      }
      stats.xp += xpGain;
      stats.level = Math.floor(stats.xp / 100) + 1;
      stats.lastActive = new Date().toISOString();

      const updated = { ...prev, stats };
      saveLocalProfile(updated);
      syncStatsToCloud(updated.uid, stats);
      return updated;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const guest = getLocalProfile();
      setUserProfile(guest);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentNav('practice')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>{t.appTitle}</span>
              </h1>
              <span className="text-[10px] text-amber-400/90 font-medium tracking-wide">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => setCurrentNav('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentNav === 'practice'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.navPractice}</span>
            </button>

            <button
              onClick={() => setCurrentNav('lessons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentNav === 'lessons'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.navLearn}</span>
            </button>

            <button
              onClick={() => setCurrentNav('monetization')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentNav === 'monetization'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{t.navMonetization}</span>
            </button>

            <button
              onClick={() => setCurrentNav('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentNav === 'docs'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{t.navDocs}</span>
            </button>
          </nav>

          {/* Right Header Controls (Sound, Language, Auth Profile) */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? t.soundOn : t.soundOff}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              title="Toggle Language (বাংলা / English)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'বাং' : 'EN'}</span>
            </button>

            {/* User Profile / Level Pill */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs cursor-pointer transition-colors shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                <User className="w-3 h-3" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-bold text-slate-200 block text-[11px] leading-tight">
                  {userProfile.displayName || (lang === 'bn' ? 'শিক্ষার্থী' : 'Student')}
                </span>
                <span className="text-[9px] font-mono text-amber-400">
                  Lvl {userProfile.stats.level} · {userProfile.stats.xp} XP
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 pb-24 md:pb-8">
        {currentNav === 'practice' && (
          <PracticeModes
            lang={lang}
            theme={theme}
            onThemeChange={setTheme}
            onRecordResult={handleRecordResult}
            streak={userProfile.stats.streak}
          />
        )}

        {currentNav === 'lessons' && (
          <LessonViewer
            lang={lang}
            theme={theme}
            onCompleteStep={handleCompleteLessonStep}
            completedLessons={userProfile.stats.completedLessons}
          />
        )}

        {currentNav === 'monetization' && (
          <MonetizationCenter lang={lang} />
        )}

        {currentNav === 'docs' && (
          <DocumentationModal lang={lang} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex justify-around">
        <button
          onClick={() => setCurrentNav('practice')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
            currentNav === 'practice' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{t.navPractice}</span>
        </button>

        <button
          onClick={() => setCurrentNav('lessons')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
            currentNav === 'lessons' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.navLearn}</span>
        </button>

        <button
          onClick={() => setCurrentNav('monetization')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
            currentNav === 'monetization' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{lang === 'bn' ? 'বিজ্ঞাপন' : 'Ads'}</span>
        </button>

        <button
          onClick={() => setCurrentNav('docs')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
            currentNav === 'docs' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ডকস' : 'Docs'}</span>
        </button>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={userProfile}
        onLoginSuccess={(newProfile) => {
          setUserProfile(prev => {
            const updated = { ...prev, ...newProfile };
            saveLocalProfile(updated);
            return updated;
          });
        }}
        onLogout={handleLogout}
        lang={lang}
      />
    </div>
  );
}
