import React, { useState, useEffect } from 'react';
import { LESSONS } from '../constants/lessons';
import { Lesson, LessonStep, RodData, Language, ThemeType } from '../types';
import { Abacus } from './Abacus';
import { sound } from '../services/audio';
import confetti from 'canvas-confetti';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { getT } from '../constants/translations';

interface LessonViewerProps {
  lang: Language;
  theme: ThemeType;
  onCompleteStep: (lessonId: string, stepId: string, xpGain: number) => void;
  completedLessons: string[];
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lang,
  theme,
  onCompleteStep,
  completedLessons
}) => {
  const t = getT(lang);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Dedicated 7-rod abacus for lesson practice (easy to focus)
  const [lessonRods, setLessonRods] = useState<RodData[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({ id: i, upper: false, lowerCount: 0 }))
  );
  const [stepSuccess, setStepSuccess] = useState(false);

  const currentStep: LessonStep = selectedLesson.steps[currentStepIndex] || selectedLesson.steps[0];

  // Reset rods when step changes
  useEffect(() => {
    setLessonRods(Array.from({ length: 7 }, (_, i) => ({ id: i, upper: false, lowerCount: 0 })));
    setStepSuccess(false);
  }, [selectedLesson.id, currentStepIndex]);

  // Calculate current value of lesson abacus
  const currentValue = lessonRods.reduce((acc, rod, idx) => {
    const val = (rod.upper ? 5 : 0) + rod.lowerCount;
    const power = lessonRods.length - 1 - idx;
    return acc + val * Math.pow(10, power);
  }, 0);

  // Check if target reached
  useEffect(() => {
    if (currentStep.targetNumber !== undefined && !stepSuccess) {
      if (currentValue === currentStep.targetNumber && currentStep.targetNumber > 0) {
        setStepSuccess(true);
        sound.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        onCompleteStep(selectedLesson.id, currentStep.id, 25);
      }
    }
  }, [currentValue, currentStep, stepSuccess, selectedLesson.id, onCompleteStep]);

  const handleNextStep = () => {
    if (currentStepIndex < selectedLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Completed this whole lesson
      sound.playSuccess();
      confetti({ particleCount: 100, spread: 80 });
      onCompleteStep(selectedLesson.id, 'complete', 50);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Category / Lesson Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1.5 bg-slate-900/60 rounded-xl border border-slate-800">
        {LESSONS.map((lesson) => {
          const isSelected = selectedLesson.id === lesson.id;
          const isDone = completedLessons.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => {
                setSelectedLesson(lesson);
                setCurrentStepIndex(0);
              }}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <BookOpen className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold truncate">
                  {lang === 'bn' ? lesson.titleBn : lesson.titleEn}
                </div>
                <div
                  className={`text-[11px] truncate ${
                    isSelected ? 'text-slate-900/80' : 'text-slate-500'
                  }`}
                >
                  {lang === 'bn' ? lesson.descBn : lesson.descEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Card & Interactive Abacus */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col gap-5">
        {/* Step Progress & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'bn' ? 'ধাপ' : 'Step'} {currentStepIndex + 1} / {selectedLesson.steps.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {currentStep.title}
            </h2>
          </div>

          {currentStep.formula && (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-300 font-mono font-bold text-sm">
              <span>{lang === 'bn' ? 'সূত্র:' : 'Formula:'}</span>
              <span>{currentStep.formula}</span>
            </div>
          )}
        </div>

        {/* Step Explanation Text */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            {lang === 'bn' ? currentStep.instructionBn : currentStep.instructionEn}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-normal">
            💡 {lang === 'bn' ? currentStep.explanationBn : currentStep.explanationEn}
          </p>

          {currentStep.targetNumber !== undefined && currentStep.targetNumber > 0 && (
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs sm:text-sm">
              <span className="text-amber-400 font-semibold">
                🎯 {t.targetNumber}: <span className="font-mono text-base font-bold text-white">{currentStep.targetNumber}</span>
              </span>
              <span className="text-slate-400">
                {t.currentValue}: <span className="font-mono text-base font-bold text-amber-300">{currentValue}</span>
              </span>
            </div>
          )}
        </div>

        {/* Live Interactive Abacus for this lesson */}
        <div className="w-full flex justify-center py-2">
          <Abacus
            rods={lessonRods}
            onRodsChange={setLessonRods}
            showValues={true}
            theme={theme}
            lang={lang}
            highlightRodIndex={lessonRods.length - 1} // highlight unit column
          />
        </div>

        {/* Success Banner or Status */}
        {stepSuccess && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>{t.correctAnswer} (+25 XP)</span>
            </div>
            <button
              onClick={handleNextStep}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-colors"
            >
              {lang === 'bn' ? 'পরবর্তী ধাপে যান' : 'Continue'}
            </button>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg cursor-pointer shadow-md transition-colors"
          >
            <span>
              {currentStepIndex === selectedLesson.steps.length - 1
                ? (lang === 'bn' ? 'পাঠ সম্পন্ন করুন' : 'Finish Lesson')
                : (lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
