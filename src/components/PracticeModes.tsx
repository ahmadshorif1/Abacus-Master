import React, { useState, useEffect, useRef } from 'react';
import { RodData, ThemeType, Language, PracticeTab } from '../types';
import { Abacus } from './Abacus';
import { sound } from '../services/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  Zap,
  CheckCircle,
  XCircle,
  Play,
  Volume2,
  Sliders,
  Flame,
  HelpCircle
} from 'lucide-react';
import { getT } from '../constants/translations';
import { AdBanner } from './AdBanner';

interface PracticeModesProps {
  lang: Language;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onRecordResult: (correct: boolean, xpEarned: number) => void;
  streak: number;
}

export const PracticeModes: React.FC<PracticeModesProps> = ({
  lang,
  theme,
  onThemeChange,
  onRecordResult,
  streak
}) => {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<PracticeTab>('free');

  // Rod count configuration (5, 7, 9, 13)
  const [rodCount, setRodCount] = useState<number>(13);
  const [rods, setRods] = useState<RodData[]>(() =>
    Array.from({ length: 13 }, (_, i) => ({ id: i, upper: false, lowerCount: 0 }))
  );
  const [showValues, setShowValues] = useState<boolean>(true);

  // Resize rods when rodCount changes
  useEffect(() => {
    setRods(Array.from({ length: rodCount }, (_, i) => ({ id: i, upper: false, lowerCount: 0 })));
  }, [rodCount]);

  // Read the Abacus state
  const [readTarget, setReadTarget] = useState<number>(0);
  const [readInput, setReadInput] = useState<string>('');
  const [readFeedback, setReadFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Set the Beads state
  const [setTarget, setSetTarget] = useState<number>(24);
  const [setFeedback, setSetFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Anzan State
  const [anzanSpeed, setAnzanSpeed] = useState<number>(1.2);
  const [anzanCount, setAnzanCount] = useState<number>(4);
  const [anzanMaxDigit, setAnzanMaxDigit] = useState<number>(9);
  const [anzanPlaying, setAnzanPlaying] = useState<boolean>(false);
  const [anzanCurrentNum, setAnzanCurrentNum] = useState<number | string>('Ready');
  const [anzanTotal, setAnzanTotal] = useState<number>(0);
  const [anzanUserAnswer, setAnzanUserAnswer] = useState<string>('');
  const [anzanResult, setAnzanResult] = useState<boolean | null>(null);
  const anzanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Challenge Mode State
  const [challengeActive, setChallengeActive] = useState<boolean>(false);
  const [challengeTime, setChallengeTime] = useState<number>(60);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [challengeQuestion, setChallengeQuestion] = useState<{ q: string; ans: number }>({ q: '4 + 5', ans: 9 });
  const [challengeInput, setChallengeInput] = useState<string>('');
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Calculate current numeric value of rods
  const calculateRodsValue = (rodList: RodData[]): number => {
    let sum = 0;
    for (let i = 0; i < rodList.length; i++) {
      const val = (rodList[i].upper ? 5 : 0) + rodList[i].lowerCount;
      const power = rodList.length - 1 - i;
      sum += val * Math.pow(10, power);
    }
    return sum;
  };

  const currentRodsValue = calculateRodsValue(rods);

  // Helper: Set rods to match a target number
  const setRodsFromNumber = (num: number, count: number = rodCount) => {
    const str = num.toString().padStart(count, '0');
    const newRods: RodData[] = [];
    for (let i = 0; i < count; i++) {
      const digit = parseInt(str[i] || '0', 10);
      newRods.push({
        id: i,
        upper: digit >= 5,
        lowerCount: digit % 5
      });
    }
    return newRods;
  };

  // Generate new Read challenge
  const generateReadChallenge = () => {
    const maxVal = rodCount <= 5 ? 99 : rodCount <= 7 ? 999 : 9999;
    const minVal = 1;
    const target = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    setReadTarget(target);
    setRods(setRodsFromNumber(target, rodCount));
    setReadInput('');
    setReadFeedback(null);
  };

  // Generate new Set challenge
  const generateSetChallenge = () => {
    const maxVal = rodCount <= 5 ? 50 : 250;
    const target = Math.floor(Math.random() * maxVal) + 5;
    setSetTarget(target);
    // Clear rods to 0
    setRods(Array.from({ length: rodCount }, (_, i) => ({ id: i, upper: false, lowerCount: 0 })));
    setSetFeedback(null);
  };

  // Initialize challenges when switching tabs
  useEffect(() => {
    if (activeTab === 'read') {
      setShowValues(false);
      generateReadChallenge();
    } else if (activeTab === 'set') {
      setShowValues(true);
      generateSetChallenge();
    } else {
      setShowValues(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, rodCount]);

  // Check Read answer
  const handleCheckRead = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(readInput.trim(), 10);
    if (val === readTarget) {
      setReadFeedback('correct');
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 50 });
      onRecordResult(true, 15);
      setTimeout(() => {
        generateReadChallenge();
      }, 1200);
    } else {
      setReadFeedback('wrong');
      sound.playError();
      onRecordResult(false, 0);
    }
  };

  // Check Set answer
  const handleCheckSet = () => {
    if (currentRodsValue === setTarget) {
      setSetFeedback('correct');
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
      onRecordResult(true, 20);
      setTimeout(() => {
        generateSetChallenge();
      }, 1200);
    } else {
      setSetFeedback('wrong');
      sound.playError();
      onRecordResult(false, 0);
    }
  };

  // Start Anzan flash sequence
  const startAnzanSequence = () => {
    if (anzanPlaying) return;
    setAnzanPlaying(true);
    setAnzanResult(null);
    setAnzanUserAnswer('');

    const sequence: number[] = [];
    let sum = 0;

    for (let i = 0; i < anzanCount; i++) {
      // Pick numbers
      const n = Math.floor(Math.random() * anzanMaxDigit) + 1;
      // Occasionally subtract if sum > n
      if (i > 0 && Math.random() > 0.65 && sum > n) {
        sequence.push(-n);
        sum -= n;
      } else {
        sequence.push(n);
        sum += n;
      }
    }
    setAnzanTotal(sum);

    let idx = 0;
    setAnzanCurrentNum(lang === 'bn' ? 'প্রস্তুত হন...' : 'Ready...');

    anzanTimerRef.current = setInterval(() => {
      if (idx < sequence.length) {
        const num = sequence[idx];
        setAnzanCurrentNum(num > 0 ? `+${num}` : `${num}`);
        sound.playBeadClick(1.2);
        idx++;
      } else {
        if (anzanTimerRef.current) clearInterval(anzanTimerRef.current);
        setAnzanCurrentNum(lang === 'bn' ? 'মোট কত?' : 'Total?');
        setAnzanPlaying(false);
      }
    }, anzanSpeed * 1000);
  };

  const handleCheckAnzan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ans = parseInt(anzanUserAnswer.trim(), 10);
    if (ans === anzanTotal) {
      setAnzanResult(true);
      sound.playSuccess();
      confetti({ particleCount: 60, spread: 70 });
      onRecordResult(true, 30);
    } else {
      setAnzanResult(false);
      sound.playError();
      onRecordResult(false, 0);
    }
  };

  // Challenge Mode logic
  const generateChallengeQ = () => {
    const a = Math.floor(Math.random() * 45) + 5;
    const b = Math.floor(Math.random() * 45) + 5;
    const isSub = Math.random() > 0.5 && a > b;
    if (isSub) {
      setChallengeQuestion({ q: `${a} - ${b}`, ans: a - b });
    } else {
      setChallengeQuestion({ q: `${a} + ${b}`, ans: a + b });
    }
    setChallengeInput('');
  };

  const startChallenge = () => {
    setChallengeActive(true);
    setChallengeTime(60);
    setChallengeScore(0);
    generateChallengeQ();

    if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
    challengeTimerRef.current = setInterval(() => {
      setChallengeTime(prev => {
        if (prev <= 1) {
          clearInterval(challengeTimerRef.current!);
          setChallengeActive(false);
          sound.playSuccess();
          confetti({ particleCount: 90, spread: 80 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCheckChallenge = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!challengeActive) return;
    const ans = parseInt(challengeInput.trim(), 10);
    if (ans === challengeQuestion.ans) {
      sound.playSuccess();
      setChallengeScore(prev => prev + 10);
      onRecordResult(true, 10);
      generateChallengeQ();
    } else {
      sound.playError();
      onRecordResult(false, 0);
    }
  };

  // Text-to-speech for reading numbers
  const speakCurrentNumber = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentRodsValue.toString());
      utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Sub-mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/80 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'free'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.modeFree}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'read'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.modeRead}
          </button>
          <button
            onClick={() => setActiveTab('set')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'set'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.modeSet}
          </button>
          <button
            onClick={() => setActiveTab('anzan')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'anzan'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.modeAnzan}</span>
          </button>
          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'challenge'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.modeChallenge}</span>
          </button>
        </div>

        {/* Global Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{t.streak}: {streak}</span>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      {activeTab === 'free' && (
        <div className="flex flex-col gap-4 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">{t.rodsCount}:</span>
              {[5, 7, 9, 13].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setRodCount(cnt)}
                  className={`px-2.5 py-1 rounded-md font-mono text-xs cursor-pointer ${
                    rodCount === cnt
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">{t.theme}:</span>
              <button
                onClick={() => onThemeChange('rainbow')}
                className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                  theme === 'rainbow'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
                title={t.themeRainbow}
              >
                🌈 {lang === 'bn' ? 'রংধনু' : 'Rainbow'}
              </button>
              <button
                onClick={() => onThemeChange('classic')}
                className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                  theme === 'classic'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
                title={t.themeClassic}
              >
                🪵 {lang === 'bn' ? 'কাঠ' : 'Wood'}
              </button>
              <button
                onClick={() => onThemeChange('modern')}
                className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                  theme === 'modern'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
                title={t.themeModern}
              >
                ✨ Modern
              </button>

              <button
                onClick={speakCurrentNumber}
                title="Pronounce Number"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Abacus Container */}
          <div className="w-full flex justify-center py-2">
            <Abacus
              rods={rods}
              onRodsChange={setRods}
              showValues={showValues}
              onToggleShowValues={() => setShowValues(!showValues)}
              theme={theme}
              lang={lang}
            />
          </div>

          {/* Educational Quick Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="font-bold text-amber-400 block mb-1">👆 {t.heavenBead}</span>
              <p>{lang === 'bn' ? 'বিমে নামালে ৫ মান যোগ হয়। সরালে ০ হয়।' : 'Pushed down to beam adds 5. Away is 0.'}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="font-bold text-emerald-400 block mb-1">🖐️ {t.earthBeads}</span>
              <p>{lang === 'bn' ? 'প্রতিটি ১ মান বহন করে। বৃদ্ধাঙ্গুলি দিয়ে উপরে তুলুন।' : 'Each worth 1. Push up with thumb to add.'}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="font-bold text-cyan-400 block mb-1">⚪ {t.unitDot}</span>
              <p>{lang === 'bn' ? 'বিমের সাদা বিন্দু এককের ঘর (Units / 1s) চিহ্নিত করে।' : 'Dots on beam mark unit reckoning columns.'}</p>
            </div>
          </div>

          {/* Adsterra / Monetag Banner Unit */}
          <div className="pt-2 border-t border-slate-800">
            <AdBanner network="adsterra" />
          </div>
        </div>
      )}

      {/* Mode: Read the Abacus */}
      {activeTab === 'read' && (
        <div className="flex flex-col gap-5 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.modeRead}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn'
                  ? 'অ্যাবাকাসের পুঁতিগুলো দেখে মোট সংখ্যাটি নির্ণয় করুন এবং নিচে লিখুন।'
                  : 'Look at the beads on the Soroban and type the represented number.'}
              </p>
            </div>
            <button
              onClick={generateReadChallenge}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'নতুন সংখ্যা দিন' : 'New Question'}
            </button>
          </div>

          {/* Target Abacus (Values hidden) */}
          <div className="w-full flex justify-center py-2">
            <Abacus
              rods={rods}
              onRodsChange={() => {}} // readonly for test
              showValues={false}
              interactive={false}
              theme={theme}
              lang={lang}
            />
          </div>

          {/* User Answer Form */}
          <form onSubmit={handleCheckRead} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <input
              type="number"
              placeholder={lang === 'bn' ? 'এখানে সংখ্যা লিখুন' : 'Enter number'}
              value={readInput}
              onChange={e => setReadInput(e.target.value)}
              autoFocus
              className="w-full sm:w-64 px-4 py-3 bg-slate-950 border border-slate-700 text-white font-mono text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl cursor-pointer shadow-md transition-colors"
            >
              {t.checkAnswer}
            </button>
          </form>

          {/* Feedback message */}
          {readFeedback === 'correct' && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{t.correctAnswer}</span>
            </div>
          )}
          {readFeedback === 'wrong' && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center justify-center gap-2 text-red-300 font-bold text-sm">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>{t.wrongAnswer} ({lang === 'bn' ? 'সঠিক সংখ্যা:' : 'Correct was:'} {readTarget})</span>
            </div>
          )}
        </div>
      )}

      {/* Mode: Set the Beads */}
      {activeTab === 'set' && (
        <div className="flex flex-col gap-5 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">{t.modeSet}</h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn'
                  ? 'নিচের অ্যাবাকাসে পুঁতি সরিয়ে লক্ষ্য সংখ্যাটি তৈরি করুন।'
                  : 'Move the beads on the abacus to represent the target number.'}
              </p>
            </div>
            <button
              onClick={generateSetChallenge}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'আরেকটি সংখ্যা' : 'New Target'}
            </button>
          </div>

          {/* Big Target Badge */}
          <div className="flex items-center justify-center gap-4 py-2">
            <span className="text-xs sm:text-sm text-slate-400 font-bold uppercase">{t.targetNumber}:</span>
            <div className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-3xl sm:text-4xl rounded-2xl shadow-lg font-mono">
              {setTarget}
            </div>
          </div>

          {/* Interactive Abacus */}
          <div className="w-full flex justify-center py-2">
            <Abacus
              rods={rods}
              onRodsChange={setRods}
              showValues={true}
              theme={theme}
              lang={lang}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCheckSet}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-md transition-all text-sm sm:text-base flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{t.checkAnswer}</span>
            </button>
          </div>

          {setFeedback === 'correct' && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{t.correctAnswer}</span>
            </div>
          )}
          {setFeedback === 'wrong' && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center justify-center gap-2 text-red-300 font-bold text-sm">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>{t.wrongAnswer} ({t.currentValue}: {currentRodsValue})</span>
            </div>
          )}
        </div>
      )}

      {/* Mode: Anzan Flash Mental Math */}
      {activeTab === 'anzan' && (
        <div className="flex flex-col gap-6 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl max-w-2xl mx-auto w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-bold mb-2">
              <Zap className="w-4 h-4" />
              <span>{lang === 'bn' ? 'সোরোবান আঞ্জান প্রযুক্তি' : 'Soroban Flash Anzan'}</span>
            </div>
            <h3 className="text-xl font-black text-white">{t.modeAnzan}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {lang === 'bn'
                ? 'স্ক্রিনে একটার পর একটা সংখ্যা ভেসে উঠবে। মনে মনে কাল্পনিক সোরোবানে হিসাব করুন এবং শেষে মোট ফলাফল লিখুন।'
                : 'Numbers will flash rapidly. Mentally visualize the beads moving and type the final sum.'}
            </p>
          </div>

          {/* Flash Screen Display */}
          <div className="w-full h-44 sm:h-52 bg-slate-950 rounded-2xl border-2 border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="text-5xl sm:text-7xl font-mono font-black text-amber-300 tracking-wider animate-in fade-in zoom-in-95 duration-100">
              {anzanCurrentNum}
            </div>
          </div>

          {/* Controls & Configuration */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">{t.anzanSpeed}</label>
              <select
                value={anzanSpeed}
                onChange={e => setAnzanSpeed(parseFloat(e.target.value))}
                disabled={anzanPlaying}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 font-mono cursor-pointer"
              >
                <option value={1.8}>1.8s ({lang === 'bn' ? 'সহজ' : 'Easy'})</option>
                <option value={1.2}>1.2s ({lang === 'bn' ? 'মাঝারি' : 'Medium'})</option>
                <option value={0.8}>0.8s ({lang === 'bn' ? 'দ্রুত' : 'Fast'})</option>
                <option value={0.5}>0.5s ({lang === 'bn' ? 'মাস্টার' : 'Master'})</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">{t.anzanRounds}</label>
              <select
                value={anzanCount}
                onChange={e => setAnzanCount(parseInt(e.target.value, 10))}
                disabled={anzanPlaying}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 font-mono cursor-pointer"
              >
                <option value={3}>3 Numbers</option>
                <option value={4}>4 Numbers</option>
                <option value={5}>5 Numbers</option>
                <option value={7}>7 Numbers</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-slate-400 block mb-1">{t.anzanDigits}</label>
              <select
                value={anzanMaxDigit}
                onChange={e => setAnzanMaxDigit(parseInt(e.target.value, 10))}
                disabled={anzanPlaying}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 font-mono cursor-pointer"
              >
                <option value={9}>1 Digit (1 - 9)</option>
                <option value={20}>2 Digits (1 - 20)</option>
                <option value={50}>2 Digits (1 - 50)</option>
              </select>
            </div>
          </div>

          {/* Action Button & Answer Form */}
          {!anzanPlaying && anzanCurrentNum === (lang === 'bn' ? 'মোট কত?' : 'Total?') ? (
            <form onSubmit={handleCheckAnzan} className="flex gap-2">
              <input
                type="number"
                placeholder={t.yourAnswer}
                value={anzanUserAnswer}
                onChange={e => setAnzanUserAnswer(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 text-white font-mono text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl cursor-pointer"
              >
                {t.checkAnswer}
              </button>
            </form>
          ) : (
            <button
              onClick={startAnzanSequence}
              disabled={anzanPlaying}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-base rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{anzanPlaying ? (lang === 'bn' ? 'গণনা চলছে...' : 'Flashing...') : t.anzanStart}</span>
            </button>
          )}

          {anzanResult === true && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{t.correctAnswer} (+30 XP)</span>
            </div>
          )}
          {anzanResult === false && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center justify-center gap-2 text-red-300 font-bold text-sm">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>{t.wrongAnswer} ({lang === 'bn' ? 'সঠিক যোগফল ছিল:' : 'Correct Total was:'} {anzanTotal})</span>
            </div>
          )}
        </div>
      )}

      {/* Mode: Timed Challenge */}
      {activeTab === 'challenge' && (
        <div className="flex flex-col gap-6 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">{t.modeChallenge}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">{t.timeRemaining}: <span className="font-bold text-amber-300 text-sm">{challengeTime}s</span></span>
              <span className="text-slate-400">{t.score}: <span className="font-bold text-emerald-400 text-sm">{challengeScore}</span></span>
            </div>
          </div>

          {!challengeActive && challengeTime === 60 ? (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{lang === 'bn' ? '৬০ সেকেন্ডের মানসিক প্রতিযোগিতা' : '60 Seconds Speed Challenge'}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn'
                    ? 'যতগুলো সম্ভব যোগ ও বিয়োগ সমাধান করুন। নির্ভুল উত্তরের জন্য পয়েন্ট বাড়বে!'
                    : 'Solve as many arithmetic questions as you can before the clock expires.'}
                </p>
              </div>
              <button
                onClick={startChallenge}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg"
              >
                {t.startPractice}
              </button>
            </div>
          ) : !challengeActive && challengeTime === 0 ? (
            <div className="text-center py-6 flex flex-col items-center gap-3">
              <div className="text-3xl">🎉</div>
              <h4 className="text-xl font-bold text-white">{t.finishPractice}</h4>
              <p className="text-sm text-amber-300 font-mono font-bold">
                {t.score}: {challengeScore}
              </p>
              <button
                onClick={startChallenge}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
              >
                {t.playAgain}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 py-4">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-mono font-black text-amber-300 tracking-wider">
                  {challengeQuestion.q} = ?
                </span>
              </div>

              <form onSubmit={handleCheckChallenge} className="flex gap-2 justify-center">
                <input
                  type="number"
                  placeholder="?"
                  value={challengeInput}
                  onChange={e => setChallengeInput(e.target.value)}
                  autoFocus
                  className="w-48 px-4 py-3 bg-slate-950 border border-slate-700 text-white font-mono text-2xl rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  {t.checkAnswer}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
