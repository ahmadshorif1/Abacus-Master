# 🧮 Abacus Master (সোরোবান মাস্টার) - Professional Technical Documentation & Architecture

---

## ১. নির্বাহী সারসংক্ষেপ (Executive Summary)

**Abacus Master** হলো একটি উচ্চমানের ওয়েব ও মোবাইল-বান্ধব এডুকেশনাল প্ল্যাটফর্ম, যা ঐতিহ্যবাহী জাপানিজ **সোরোবান (Soroban 算盤)** অ্যাবাকাসের নীতি অনুসরণ করে নির্মিত। ব্যবহারকারীর সরবরাহকৃত সোরোবান টুলের চিত্রের ভিত্তিতে অ্যাপটিতে ১৩টি কলাম (দণ্ড), উপরের ডেকে ১টি ৫-মানের স্বর্গীয় পুঁতি (Heaven Bead), এবং নিচের ডেকে ৪টি ১-মানের পার্থিব পুঁতি (Earth Beads) বাস্তবসম্মত ৩ডি ডায়মন্ড শেপে ডিজাইন করা হয়েছে।

অ্যাপ্লিকেশনটিতে একই সাথে রয়েছে:
1. **বাস্তবসম্মত ইন্টারঅ্যাক্টিভ সোরোবান**: স্পর্শ, ক্লিক ও ড্র্যাগিংয়ে বাস্তব কাঠের পুঁতির শব্দ (Web Audio API) এবং একক বিন্দু (Unit marker dots)।
2. **ধাপে ধাপে শিক্ষামূলক পাঠ (Curriculum)**: সোরোবানের পরিচিতি, স্থানিক মান, ছোট বন্ধু (5's complement) ও বড় বন্ধু (10's complement) সূত্র।
3. **৪টি প্র্যাকটিস মোড**: মুক্ত অনুশীলন (Sandbox), সংখ্যা চেনা (Read Abacus), সংখ্যা বসানো (Set Beads), এবং জাপানিজ আঞ্জান ফ্ল্যাশ মানসিক গণিত (Anzan Flash Mental Math)।
4. **ফায়ারবেজ (Firebase) সংযোগ**: ইমেইল/পাসওয়ার্ড ও গেস্ট লগইনসহ ক্লাউড ডেটাবেজে এক্সপি (XP), লেভেল এবং ধারাবাহিকতা (Streak) সংরক্ষণ।
5. **মনিটাইজেশন ইকোসিস্টেম**: শিক্ষা-বান্ধব Adsterra এবং Monetag বিজ্ঞাপন আর্কিটেকচার এবং অ্যান্ড্রয়েড মোবাইল অ্যাপে (APK/AAB) রূপান্তরের পূর্ণাঙ্গ প্রক্রিয়া।

---

## ২. সোরোবান অ্যাবাকাসের গাণিতিক আর্কিটেকচার (Soroban Mechanics)

### ২.১ ডেকের গঠন ও পুঁতির মান
- **উপরের ডেক (Upper Deck / Heaven Bead 天珠):** প্রতি রডে ১টি পুঁতি। গণনার সময় পুঁতিটি **নিচের দিকে নেমে বিভাজক বিমকে (Reckoning Beam) স্পর্শ করে** এবং এর মান হয় **+৫**। বিম থেকে দূরে উপরে ফ্রেমের সাথে থাকলে মান **০**।
- **নিচের ডেক (Lower Deck / Earth Beads 地珠):** প্রতি রডে ৪টি পুঁতি। পরস্পর পুঁতির মধ্যকার ফাঁকা দূরত্ব ন্যূনতম (১ পিক্সেল) রেখে একত্রে নিবিড়ভাবে অবস্থান করে। বিভাজক বিম থেকে নিষ্ক্রিয় পুঁতির মধ্যকার ট্রাভেল দূরত্ব বৃদ্ধি করে **৪৮ পিক্সেল (48px)** করা হয়েছে, ফলে গণনার সময় বিমে স্পর্শ করা সক্রিয় পুঁতি এবং নিচে থাকা নিষ্ক্রিয় পুঁতির পার্থক্য অত্যন্ত স্পষ্ট ও সহজে চোখে পড়ে। গণনার সময় পুঁতিগুলো উপরে উঠে বিভাজক বিমকে স্পর্শ করে (প্রতিটি সক্রিয় পুঁতির মান **+১**)।
- **কেন্দ্রীয় গণনা নীতি (Center Reckoning Principle):** গণনাকৃত সকল পুঁতি (উপরের ৫ এবং নিচের ১, ২, ৩ বা ৪) বিভাজক বিমের কাছে একত্রিত হয়, ফলে শিক্ষার্থী বা ব্যবহারকারী সহজেই এক নজরে বিমের সাথে স্পর্শ করা পুঁতিগুলো দেখে যোগফল ও মোট সংখ্যা নির্ণয় করতে পারেন।

### ২.২ স্থানিক মান (Place Value Progression)
ডান থেকে বামে কলামগুলোর মান দশগুণ হারে বৃদ্ধি পায়:
$$\text{Rod}_0 (\text{Units } 10^0) \longleftarrow \text{Rod}_1 (\text{Tens } 10^1) \longleftarrow \text{Rod}_2 (\text{Hundreds } 10^2) \longleftarrow \text{Rod}_3 (\text{Thousands } 10^3)$$

### ২.৩ পরিপূরক সূত্রাবলী (Complement Formulas)
1. **ছোট বন্ধু (Small Friends - 5's Complement):**
   - $+4 = +5 - 1$
   - $+3 = +5 - 2$
   - $+2 = +5 - 3$
   - $+1 = +5 - 4$
2. **বড় বন্ধু (Big Friends - 10's Complement):**
   - $+9 = -1 + 10$
   - $+8 = -2 + 10$
   - $+7 = -3 + 10$
   - $+6 = -4 + 10$
   - $+5 = -5 + 10$
   - $+4 = -6 + 10$
   - $+3 = -7 + 10$
   - $+2 = -8 + 10$
   - $+1 = -9 + 10$

---

## ৩. ফায়ারবেজ (Firebase) ইন্টিগ্রেশন ও কনফিগারেশন

### ৩.১ প্রদত্ত কনফিগারেশন
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyArLtISxMf6kOHXpH7pEeu1guI5-hERqo4",
  authDomain: "abacus-master-b7d57.firebaseapp.com",
  databaseURL: "https://abacus-master-b7d57-default-rtdb.firebaseio.com",
  projectId: "abacus-master-b7d57",
  storageBucket: "abacus-master-b7d57.firebasestorage.app",
  messagingSenderId: "1098234177030",
  appId: "1:1098234177030:web:0198913031dfdc69c3c587",
  measurementId: "G-NE366QFH24"
};
```
- **VAPID Key Pair (Web Push):** `BI8clKYd0CVi0hugxsjYEHbQyU9azVUoQlyoVov9Z8jIzH__z0Mxia8mJHgjhDKWeW06AR0PAx1eCFmAu_3dDPw`

### ৩.২ ফায়ারবেজ কনসোলে যা যা সেটআপ করতে হবে
1. **Authentication:**
   - [Firebase Console](https://console.firebase.google.com/) -> `abacus-master-b7d57` প্রকল্পে প্রবেশ করুন।
   - **Build -> Authentication -> Sign-in method** এ ক্লিক করুন।
   - **Email/Password** অপশনটি `Enable` করুন।
   - **Anonymous** অপশনটি `Enable` করুন (যাতে ব্যবহারকারীরা রেজিস্ট্রেশন ছাড়াই এক ক্লিকে অতিথি হিসেবে অনুশীলন করতে পারেন)।
2. **Authorized Domains:**
   - **Authentication -> Settings -> Authorized Domains** এ আপনার লাইভ ডোমেন এবং AI Studio ক্লাউড রান ইউআরএল যোগ করুন।
3. **Realtime Database Security Rules:**
   - **Build -> Realtime Database -> Rules** ট্যাবে নিচের রুলসটি বসিয়ে পাবলিশ করুন:
   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```

---

## ৪. মনিটাইজেশন আর্কিটেকচার (Adsterra & Monetag Integration)

শিক্ষামূলক গণিত অ্যাপ্লিকেশনে বিজ্ঞাপন ব্যবহারে বিশেষ সতর্কতা প্রয়োজন যাতে শিশুদের মনোযোগ এবং অনুশীলনে বাধা না পড়ে।

### ৪.১ Adsterra ইন্টিগ্রেশন কৌশল
1. **Social Bar (সর্বোচ্চ CTR ও ইউজার ফ্রেন্ডলি):**
   - স্ক্রিনের নিচে ভাসমান আকারে থাকে।
   - সোরোবানের উপর কোনো ওভারলে তৈরি করে না।
2. **Native Banners (300x250 বা 728x90):**
   - প্র্যাকটিস এরিয়ার নিচে এবং লেসন সম্পূর্ণ হওয়ার স্ক্রিনে বসানো আদর্শ।
3. **নিরাপত্তা নীতি (Child-Safe Filter):**
   - Adsterra Publisher ড্যাশবোর্ডে গিয়ে ওয়েবসাইটের জন্য **"Adult / 18+ Ads"** এবং **"Gambling"** ক্যাটাগরি অবশ্যই আনচেক / ব্লক করে রাখবেন।

### ৪.২ Monetag ইন্টিগ্রেশন কৌশল
1. **In-Page Push (IPP):**
   - ব্রাউজার পুশ নোটিফিকেশনের বিকল্প হিসেবে কাজ করে, উচ্চ সিপিএম (High eCPM) প্রদান করে।
2. **Rewarded Video Ads (রিওয়ার্ডেড ভিডিও বিজ্ঞাপন):**
   - ব্যবহারকারী স্বেচ্ছায় ৫-১০ সেকেন্ডের বিজ্ঞাপন দেখে **+৫০ এক্সপি** বা অতিরিক্ত লেসন আনলক করতে পারে।

---

## ৫. মোবাইল অ্যাপ্লিকেশন (Android APK / AAB) তৈরির গাইডলাইন

ক্যাপাসিটর (Capacitor) ব্যবহার করে এই পূর্ণাঙ্গ ওয়েব কোডকে সরাসরি অ্যান্ড্রয়েড অ্যাপ্লিকেশনে রূপান্তর করা সম্ভব।

### ৫.১ কমান্ড লাইন ধাপসমূহ:
```bash
# ১. ডিপেনডেন্সি ইনস্টল করুন
npm install @capacitor/core @capacitor/cli @capacitor/android

# ২. ক্যাপাসিটর কনফিগার করুন
npx cap init "Abacus Master" "com.abacusmaster.soroban" --web-dir "dist"

# ৩. প্রোডাকশন বিল্ড তৈরি করুন
npm run build

# ৪. অ্যান্ড্রয়েড প্ল্যাটফর্ম যোগ করুন
npx cap add android

# ৫. কোড সিঙ্ক করুন এবং অ্যান্ড্রয়েড স্টুডিও খুলুন
npx cap sync
npx cap open android
```

### ৫.২ গুগল প্লে কনসোল রিলিজের জন্য যা প্রয়োজন:
1. **App Icon & Splash Screen:** ৫১২x৫১২ পিক্সেল স্বচ্ছ আইকন।
2. **Keystore Signing:** `keytool` দিয়ে সাইনড রিলিজ কি তৈরি।
3. **Data Safety & COPPA Declaration:** অ্যাপটি শিশুদের গণিত শেখার জন্য তৈরি হওয়ায় গুগল প্লে স্টোরে "Target Age: Families / Children" অথবা "General Audience" সিলেক্ট করার সময় বিজ্ঞাপন নীতি মেনে ঘোষণা দিতে হবে।

---

## ৬. কোডবেস ডিরেক্টরি পরিচিতি

```
/src
├── /components
│   ├── Abacus.tsx              # রিয়েলিস্টিক ১৩-রড সোরোবান, ৩ডি পুঁতি, স্থানিক মান
│   ├── PracticeModes.tsx       # স্যান্ডবক্স, রিড অ্যাবাকাস, সেট বিডস, আঞ্জান ফ্ল্যাশ
│   ├── LessonViewer.tsx        # ৫-কমপ্লিমেন্ট ও ১০-কমপ্লিমেন্ট ইন্টারঅ্যাক্টিভ লেসন
│   ├── AuthModal.tsx           # ফায়ারবেজ লগইন, সাইনআপ ও গেস্ট মোড
│   ├── MonetizationCenter.tsx  # Adsterra ও Monetag বিজ্ঞাপন কন্ট্রোল সেন্টার
│   └── DocumentationModal.tsx  # ইন-অ্যাপ টেকনিক্যাল ডকুমেন্টেশন ভিউ
├── /constants
│   ├── lessons.ts              # সোরোবানের বিস্তারিত লেসন ডাটা ও সূত্র
│   └── translations.ts         # বাংলা ও ইংরেজি দ্বিভাষিক অভিধান
├── /services
│   ├── firebase.ts             # ফায়ারবেজ SDK ইনিশিয়ালাইজেশন ও ক্লাউড সিঙ্ক
│   └── audio.ts                # Web Audio API দিয়ে তৈরি বাস্তব কাঠের পুঁতির শব্দ
├── /types
│   └── index.ts                # টাইপস্ক্রিপ্ট ইন্টারফেস ও ডেটা মডেল
├── App.tsx                     # মূল মোবাইল ও ডেস্কটপ শেল এবং রাউটার
└── main.tsx                    # রিয়্যাক্ট ১৯ এন্ট্রি পয়েন্ট
```
