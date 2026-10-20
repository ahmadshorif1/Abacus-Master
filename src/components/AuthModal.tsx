import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  auth
} from '../services/firebase';
import { UserProfile, Language } from '../types';
import { X, Mail, Lock, User, Sparkles, LogIn, UserPlus, LogOut, Award, Flame, CheckCircle2 } from 'lucide-react';
import { getT } from '../constants/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
  onLogout: () => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  lang
}) => {
  const t = getT(lang);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLocalAccountLogin = () => {
    onLoginSuccess({
      uid: 'local-' + Date.now().toString(36),
      email: email || 'student@abacus.local',
      displayName: displayName || email?.split('@')[0] || 'Learner',
      isAnonymous: false
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsOperationNotAllowed(false);
    setLoading(true);

    try {
      if (isRegister) {
        if (!email || !password) {
          throw new Error(lang === 'bn' ? 'ইমেইল এবং পাসওয়ার্ড দিন' : 'Email and password required');
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && userCred.user) {
          await updateProfile(userCred.user, { displayName });
        }
        onLoginSuccess({
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: displayName || userCred.user.email?.split('@')[0] || 'Learner',
          isAnonymous: false
        });
        onClose();
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess({
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: userCred.user.displayName || userCred.user.email?.split('@')[0] || 'Learner',
          isAnonymous: false
        });
        onClose();
      }
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      console.error('Firebase Auth Error:', e);
      if (e.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        setErrorMsg(
          lang === 'bn'
            ? 'ফায়ারবেজ কনসোলে Email/Password সাইন-ইন পদ্ধতি এখনও সক্রিয় (Enable) করা হয়নি।'
            : 'Email/Password sign-in provider is not enabled in Firebase Console yet.'
        );
      } else if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
        setErrorMsg(lang === 'bn' ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' : 'Invalid email or password.');
      } else if (e.code === 'auth/email-already-in-use') {
        setErrorMsg(lang === 'bn' ? 'এই ইমেইলটি ইতিপূর্বে ব্যবহৃত হয়েছে।' : 'Email is already registered.');
      } else if (e.code === 'auth/weak-password') {
        setErrorMsg(lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      } else {
        setErrorMsg(e.message || (lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Authentication failed.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    setIsOperationNotAllowed(false);
    try {
      const cred = await signInAnonymously(auth);
      onLoginSuccess({
        uid: cred.user.uid,
        email: null,
        displayName: lang === 'bn' ? 'গেস্ট শিক্ষার্থী' : 'Guest Student',
        isAnonymous: true
      });
      onClose();
    } catch (err) {
      console.warn('Anonymous login error, continuing with local session:', err);
      // Fallback local guest
      onLoginSuccess({
        uid: 'guest-' + Date.now().toString(36),
        displayName: lang === 'bn' ? 'গেস্ট শিক্ষার্থী' : 'Guest Student',
        isAnonymous: true
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in with email: Show Profile & Stats View */}
        {!currentUser.isAnonymous && currentUser.email ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xl font-bold">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentUser.displayName}</h3>
                <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.level} & {t.xp}</span>
                </span>
                <span className="text-lg font-bold text-amber-300 font-mono">
                  Lvl {currentUser.stats.level} ({currentUser.stats.xp} XP)
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.streak}</span>
                </span>
                <span className="text-lg font-bold text-orange-400 font-mono">
                  {currentUser.stats.streak} {lang === 'bn' ? 'দিন' : 'Days'}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.solved}</span>
                </span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {currentUser.stats.solvedCount}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">
                  <span>{t.accuracy}</span>
                </span>
                <span className="text-lg font-bold text-cyan-400 font-mono">
                  {currentUser.stats.solvedCount > 0
                    ? Math.round((currentUser.stats.correctCount / currentUser.stats.solvedCount) * 100)
                    : 100}
                  %
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              <span>Firebase UID: </span>
              <span className="font-mono text-[10px] text-slate-400">{currentUser.uid}</span>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 bg-red-950/50 hover:bg-red-900/50 text-red-300 border border-red-800/60 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isRegister ? t.signup : t.login}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn'
                  ? 'আপনার প্র্যাকটিস স্কোর এবং লেভেল ক্লাউডে সুরক্ষিত রাখতে অ্যাকাউন্ট তৈরি করুন।'
                  : 'Sync your abacus progress and XP across devices with Firebase.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-950/90 border border-red-500/50 text-red-200 text-xs rounded-xl space-y-2.5">
                <div className="font-semibold text-red-300 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>

                {isOperationNotAllowed && (
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-red-900/60 text-[11px] text-slate-300 space-y-2">
                    <p className="font-medium text-amber-300">
                      {lang === 'bn'
                        ? '🛠️ ফায়ারবেজে যেভাবে এটি সমাধান করবেন (১ মিনিট):'
                        : '🛠️ How to fix in Firebase Console (1 minute):'}
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                      <li><a href="https://console.firebase.google.com/project/abacus-master-b7d57/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-mono">Firebase Console</a> এ যান</li>
                      <li><strong>Authentication ➔ Sign-in method</strong> ট্যাবে ক্লিক করুন</li>
                      <li><strong>Email/Password</strong> সিলেক্ট করে <strong>Enable</strong> চালু করুন</li>
                      <li><strong>Save</strong> বাটনে চাপ দিন</li>
                    </ol>

                    <div className="pt-1 border-t border-slate-800">
                      <p className="text-[11px] text-slate-300 mb-1.5">
                        {lang === 'bn'
                          ? 'কনসোল সেটআপ না হওয়া পর্যন্ত আপনি এখনই লোকাল প্রোফাইলে প্রবেশ করতে পারেন:'
                          : 'Or continue immediately with this profile locally:'}
                      </p>
                      <button
                        type="button"
                        onClick={handleLocalAccountLogin}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-colors"
                      >
                        ⚡ {lang === 'bn' ? `"${displayName || 'ahmad'}" হিসেবে এখনই প্রবেশ করুন` : 'Continue with this Profile Now'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {isRegister && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    {lang === 'bn' ? 'শিক্ষার্থীর নাম' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'আপনার নাম' : 'Student Name'}
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  {lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>
                  {loading
                    ? (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Processing...')
                    : isRegister
                    ? t.signup
                    : t.login}
                </span>
              </button>
            </form>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-500">{lang === 'bn' ? 'অথবা' : 'OR'}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Instant Anonymous Guest Access */}
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
            >
              {lang === 'bn' ? '⚡ লগইন ছাড়াই অতিথি হিসেবে প্রবেশ' : '⚡ Quick Continue as Guest'}
            </button>

            <div className="text-center pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg(null);
                }}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                {isRegister
                  ? (lang === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Login')
                  : (lang === 'bn' ? 'নতুন অ্যাকাউন্ট খুলতে চান? রেজিস্ট্রেশন করুন' : "Don't have an account? Sign Up")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
