import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-anatomy',
    category: 'basics',
    titleBn: '১. সোরোবান অ্যাবাকাসের পরিচিতি',
    titleEn: '1. Anatomy of Soroban Abacus',
    descBn: 'অ্যাবাকাসের বিভিন্ন অংশ, স্বর্গীয় ও পার্থিব পুঁতি এবং বিমের কাজ জানুন।',
    descEn: 'Learn frame components, heaven bead, earth beads, and the reckoning beam.',
    icon: 'Layers',
    steps: [
      {
        id: 'step-1-1',
        title: 'বিভেদক বার (Reckoning Beam)',
        instructionBn: 'সোরোবানের মাঝখানের অনুভূমিক দণ্ডটিকে বিম (Beam) বলে। কোনো পুঁতি বিমের সাথে স্পর্শ করলেই তার মান গণনা করা হয়। বিম থেকে দূরে থাকা অবস্থায় এর মান ০।',
        instructionEn: 'The horizontal bar in the middle is the reckoning beam. Beads are only counted when they touch this beam. When away from the beam, their value is 0.',
        explanationBn: 'উপরের অংশে ১টি পুঁতি (স্বর্গীয় পুঁতি) এবং নিচের অংশে ৪টি পুঁতি (পার্থিব পুঁতি) থাকে।',
        explanationEn: 'The upper deck has 1 bead (Heaven bead) and the lower deck has 4 beads (Earth beads).',
        targetNumber: 0
      },
      {
        id: 'step-1-2',
        title: 'পার্থিব পুঁতি (Earth Beads = 1)',
        instructionBn: 'নিচের প্রতিটি পুঁতির মান ১ (One)। বৃদ্ধাঙ্গুলি (Thumb) দিয়ে নিচের ১টি পুঁতি উপরে উঠিয়ে বিমে স্পর্শ করান। এটি ১ নির্দেশ করে।',
        instructionEn: 'Each lower bead is worth 1. Use your thumb to push one lower bead UP to touch the beam. This represents 1.',
        explanationBn: 'বৃদ্ধাঙ্গুলি দিয়ে নিচে থেকে উপরে উঠানো হয়, তর্জনী দিয়ে নিচে নামানো হয়।',
        explanationEn: 'Use thumb to push lower beads up, and index finger to pull them down.',
        targetNumber: 1
      },
      {
        id: 'step-1-3',
        title: 'স্বর্গীয় পুঁতি (Heaven Bead = 5)',
        instructionBn: 'উপরের ডেকে থাকা প্রতিটি পুঁতির মান ৫ (Five)। তর্জনী (Index finger) দিয়ে উপরের ১টি পুঁতি নিচে নামিয়ে বিমে স্পর্শ করান। এটি ৫ নির্দেশ করে।',
        instructionEn: 'The upper bead is worth 5. Use your index finger to push the top bead DOWN to touch the beam. This represents 5.',
        explanationBn: 'যখন উপরের পুঁতি বিমে নামে এবং নিচের সব পুঁতি দূরে থাকে, তখন মান হয় ৫।',
        explanationEn: 'When the upper bead touches the beam and lower beads are away, the value is 5.',
        targetNumber: 5
      },
      {
        id: 'step-1-4',
        title: '৬ সংখ্যা তৈরি করা (Combining 5 + 1)',
        instructionBn: '৬ বানাতে হলে উপরের ৫-এর পুঁতিটি নামান এবং নিচের ১টি পুঁতি উপরে তুলুন।',
        instructionEn: 'To make 6, push the top 5-bead down and one bottom 1-bead up together (pinch movement).',
        explanationBn: '৫ + ১ = ৬। এভাবে ৭ (৫+২), ৮ (৫+৩) এবং ৯ (৫+৪) তৈরি করা যায়।',
        explanationEn: '5 + 1 = 6. Similarly, 7 is 5+2, 8 is 5+3, and 9 is 5+4.',
        targetNumber: 6
      }
    ]
  },
  {
    id: 'lesson-reading',
    category: 'basics',
    titleBn: '২. ১ থেকে ৯ এবং স্থানীয় মান',
    titleEn: '2. Digits 1 to 9 & Place Values',
    descBn: 'একটি রডে ০ থেকে ৯ পর্যন্ত সংখ্যা এবং দশক-শতকের স্থানিক ধারণা শিখুন।',
    descEn: 'Master numbers 0 to 9 on a rod and understand place values (1s, 10s, 100s).',
    icon: 'Hash',
    steps: [
      {
        id: 'step-2-1',
        title: '৪ (Four) সংখ্যা তৈরি',
        instructionBn: 'নিচের ৪টি পুঁতি একসাথে বৃদ্ধাঙ্গুলি দিয়ে উপরে তুলে বিমে লাগান।',
        instructionEn: 'Push all 4 bottom beads up toward the beam using your thumb.',
        explanationBn: '৪টি পার্থিব পুঁতি বিম স্পর্শ করলে মান হয় ৪।',
        explanationEn: 'All 4 earth beads touching the beam equal 4.',
        targetNumber: 4
      },
      {
        id: 'step-2-2',
        title: '৯ (Nine) সংখ্যা তৈরি',
        instructionBn: 'একই সাথে উপরের ৫-এর পুঁতি এবং নিচের ৪টি পুঁতি বিমের দিকে আনুন।',
        instructionEn: 'Pinch both the top 5-bead and all 4 bottom beads towards the beam.',
        explanationBn: '৫ + ৪ = ৯। একটি রডে সর্বোচ্চ মান ৯ হতে পারে।',
        explanationEn: '5 + 4 = 9. This is the maximum single-digit value on one rod.',
        targetNumber: 9
      },
      {
        id: 'step-2-3',
        title: '১০ (Ten) তৈরি করা',
        instructionBn: 'এককের ঘরে ০ (সব পুঁতি দূরে) এবং বাম পাশের দশকের ঘরে ১টি নিচের পুঁতি উপরে তুলুন।',
        instructionEn: 'Clear the units rod to 0, and push one lower bead UP on the tens rod (to the left).',
        explanationBn: 'বাম দিকে প্রতি কলাম ১০ গুণ বৃদ্ধি পায়: একক -> দশক -> শতক -> হাজার।',
        explanationEn: 'Columns increase tenfold leftwards: Units -> Tens -> Hundreds -> Thousands.',
        targetNumber: 10
      }
    ]
  },
  {
    id: 'lesson-small-friends',
    category: 'small_friend',
    titleBn: '৩. ছোট বন্ধুর সূত্র (৫-এর পরিপূরক)',
    titleEn: '3. Small Friends (5s Complement)',
    descBn: 'যখন নিচের পুঁতি পর্যাপ্ত থাকে না, তখন ৫-এর সাহায্যে যোগ ও বিয়োগ।',
    descEn: 'Use 5-complement formulas when earth beads are exhausted.',
    icon: 'Users',
    steps: [
      {
        id: 'step-3-1',
        title: '+৪ এর সূত্র (+৫ - ১)',
        formula: '+4 = +5 - 1',
        instructionBn: 'ধরুন রডে ১ আছে, এখন ৪ যোগ করতে হবে। নিচের পুঁতি ৩টি থাকায় সরাসরি ৪ সম্ভব নয়। তাই উপরের ৫ নামান এবং নিচের ১টি নামিয়ে নিন (+৫ - ১)।',
        instructionEn: 'If you have 1 and need to add 4: there are not enough bottom beads. Move the top 5 bead down, and remove 1 bottom bead (+5 - 1).',
        explanationBn: '৪ এর ছোট বন্ধু হলো ১ (যেহেতু ৪ + ১ = ৫)। সূত্র: +৪ = +৫ - ১।',
        explanationEn: 'Small friend of 4 is 1 (4 + 1 = 5). Formula: +4 = +5 - 1.',
        targetNumber: 5
      },
      {
        id: 'step-3-2',
        title: '+৩ এর সূত্র (+৫ - ২)',
        formula: '+3 = +5 - 2',
        instructionBn: 'ধরুন রডে ২ বা ৩ আছে, ৩ যোগ করতে হলে উপরের ৫ নামান এবং নিচের ২টি পুঁতি সরিয়ে দিন।',
        instructionEn: 'To add 3 using small friends: Add 5 down, subtract 2 bottom beads (+5 - 2).',
        explanationBn: '৩ এর ছোট বন্ধু হলো ২ (৩ + ২ = ৫)।',
        explanationEn: 'Small friend of 3 is 2 (3 + 2 = 5).',
        targetNumber: 5
      },
      {
        id: 'step-3-3',
        title: '+২ এর সূত্র (+৫ - ৩)',
        formula: '+2 = +5 - 3',
        instructionBn: '২ যোগ করার জন্য উপরের ৫ নামান এবং নিচের ৩টি পুঁতি সরিয়ে দিন (+৫ - ৩)।',
        instructionEn: 'To add 2: Add 5 down, subtract 3 bottom beads (+5 - 3).',
        explanationBn: '২ এর ছোট বন্ধু ৩ (২ + ৩ = ৫)।',
        explanationEn: 'Small friend of 2 is 3 (2 + 3 = 5).',
        targetNumber: 5
      },
      {
        id: 'step-3-4',
        title: '+১ এর সূত্র (+৫ - ৪)',
        formula: '+1 = +5 - 4',
        instructionBn: 'রডে ৪ আছে। ১ যোগ করার জন্য উপরের ৫ নামান এবং নিচের ৪টিই সরিয়ে দিন।',
        instructionEn: 'When you have 4 and need to add 1: Add 5 down, push all 4 bottom beads down (+5 - 4).',
        explanationBn: '১ এর ছোট বন্ধু ৪ (১ + ৪ = ৫)।',
        explanationEn: 'Small friend of 1 is 4 (1 + 4 = 5).',
        targetNumber: 5
      }
    ]
  },
  {
    id: 'lesson-big-friends',
    category: 'big_friend',
    titleBn: '৪. বড় বন্ধুর সূত্র (১০-এর পরিপূরক)',
    titleEn: '4. Big Friends (10s Complement)',
    descBn: 'একটি রডের ধারণক্ষমতা ৯ পূর্ণ হলে বাম পাশের কলামে ক্যারি (Carry) নিয়ে যোগ।',
    descEn: 'Carry to the left tens column using 10-complement rules when exceeding 9.',
    icon: 'TrendingUp',
    steps: [
      {
        id: 'step-4-1',
        title: '+৯ এর সূত্র (-১ + ১০)',
        formula: '+9 = -1 + 10',
        instructionBn: 'রডে ৭ আছে, ৯ যোগ করতে হবে। এককের ঘর থেকে ১ বাদ দিন এবং বামের দশকের ঘরে ১ যোগ করুন (-১ + ১০)।',
        instructionEn: 'To add 9: Subtract 1 on the current unit rod, and add 1 on the left tens rod (-1 + 10).',
        explanationBn: '৯ এর বড় বন্ধু হলো ১ (৯ + ১ = ১০)।',
        explanationEn: 'Big friend of 9 is 1 (9 + 1 = 10).',
        targetNumber: 16
      },
      {
        id: 'step-4-2',
        title: '+৮ এর সূত্র (-২ + ১০)',
        formula: '+8 = -2 + 10',
        instructionBn: '৮ যোগ করতে হলে এককের ঘর থেকে ২ বাদ দিন এবং দশকের ঘরে ১ যোগ করুন।',
        instructionEn: 'To add 8: Subtract 2 on the units rod, add 1 on the tens rod (-2 + 10).',
        explanationBn: '৮ এর বড় বন্ধু হলো ২ (৮ + ২ = ১০)।',
        explanationEn: 'Big friend of 8 is 2 (8 + 2 = 10).',
        targetNumber: 18
      },
      {
        id: 'step-4-3',
        title: '+৭ ও +৬ এর সূত্র',
        formula: '+7 = -3 + 10 | +6 = -4 + 10',
        instructionBn: '৭ যোগ করতে -৩ + ১০ এবং ৬ যোগ করতে -৪ + ১০ প্রয়োগ করতে হয়।',
        instructionEn: 'For +7: -3 + 10. For +6: -4 + 10.',
        explanationBn: 'প্রতিটি অঙ্কের সাথে ১০ তৈরির জন্য যে সংখ্যা দরকার, সেটিই তার বড় বন্ধু।',
        explanationEn: 'Each pair summing to 10 constitutes big friends.',
        targetNumber: 20
      }
    ]
  },
  {
    id: 'lesson-anzan',
    category: 'anzan',
    titleBn: '৫. আঞ্জান (মানসিক অ্যাবাকাস কৌশল)',
    titleEn: '5. Anzan (Mental Abacus Mastery)',
    descBn: 'চোখ বন্ধ করে মনের ভেতরে সোরোবানের পুঁতি কল্পনা করে অতি দ্রুত গণনার পদ্ধতি।',
    descEn: 'Mentally visualize the beads moving in your mind for lightning arithmetic.',
    icon: 'Zap',
    steps: [
      {
        id: 'step-5-1',
        title: 'মানসিক চিত্রকল্প (Image Visualization)',
        instructionBn: 'চোখের সামনে কাল্পনিক সোরোবান এনে হাত দিয়ে বাতাসেই বিম ও পুঁতি স্পর্শের ভঙ্গি করুন।',
        instructionEn: 'Visualize a virtual Soroban in front of your eyes and mimic the finger movements in the air.',
        explanationBn: 'জাপানে এই পদ্ধতিকে সোরোবান আঞ্জান (Soroban Anzan) বলা হয়, যা মস্তিষ্কের ডান ও বাম উভয় অংশকে উদ্দীপ্ত করে।',
        explanationEn: 'Known as Soroban Anzan in Japan, activating both logical and visual brain hemispheres.',
        targetNumber: 0
      }
    ]
  }
];
