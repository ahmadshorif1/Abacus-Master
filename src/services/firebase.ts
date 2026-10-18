import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { UserProfile, UserStats } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyArLtISxMf6kOHXpH7pEeu1guI5-hERqo4",
  authDomain: "abacus-master-b7d57.firebaseapp.com",
  databaseURL: "https://abacus-master-b7d57-default-rtdb.firebaseio.com",
  projectId: "abacus-master-b7d57",
  storageBucket: "abacus-master-b7d57.firebasestorage.app",
  messagingSenderId: "1098234177030",
  appId: "1:1098234177030:web:0198913031dfdc69c3c587",
  measurementId: "G-NE366QFH24"
};

export const vapidKey = "BI8clKYd0CVi0hugxsjYEHbQyU9azVUoQlyoVov9Z8jIzH__z0Mxia8mJHgjhDKWeW06AR0PAx1eCFmAu_3dDPw";

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const database = getDatabase(app);

const LOCAL_STORAGE_KEY = 'abacus_user_profile_v1';

export const defaultStats: UserStats = {
  solvedCount: 0,
  correctCount: 0,
  streak: 0,
  bestStreak: 0,
  xp: 0,
  level: 1,
  completedLessons: [],
  lastActive: new Date().toISOString()
};

export const defaultGuestProfile: UserProfile = {
  uid: 'guest-' + Math.random().toString(36).substring(2, 9),
  email: null,
  displayName: 'Student / শিক্ষার্থী',
  isAnonymous: true,
  stats: defaultStats
};

// Local storage helpers for instant offline fallback
export function getLocalProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultGuestProfile,
        ...parsed,
        stats: { ...defaultStats, ...(parsed.stats || {}) }
      };
    }
  } catch {
    // ignore
  }
  return defaultGuestProfile;
}

export function saveLocalProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

// Sync user stats to Firebase Realtime Database
export async function syncStatsToCloud(uid: string, stats: UserStats): Promise<boolean> {
  try {
    const dbRef = ref(database, `users/${uid}/stats`);
    await set(dbRef, stats);
    return true;
  } catch (err) {
    console.warn('Realtime DB sync error (using local storage fallback):', err);
    return false;
  }
}

// Load stats from Firebase Realtime Database
export async function loadStatsFromCloud(uid: string): Promise<UserStats | null> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${uid}/stats`));
    if (snapshot.exists()) {
      return snapshot.val() as UserStats;
    }
  } catch (err) {
    console.warn('Could not fetch remote stats, relying on local storage:', err);
  }
  return null;
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile
};
export type { User };
