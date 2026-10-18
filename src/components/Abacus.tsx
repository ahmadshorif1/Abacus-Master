import React, { useMemo } from 'react';
import { RodData, ThemeType, Language } from '../types';
import { sound } from '../services/audio';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { getT } from '../constants/translations';

interface AbacusProps {
  rods: RodData[];
  onRodsChange: (newRods: RodData[]) => void;
  showValues?: boolean;
  onToggleShowValues?: () => void;
  interactive?: boolean;
  theme?: ThemeType;
  lang?: Language;
  highlightRodIndex?: number | null;
  className?: string;
}

// Rainbow colors matching user's uploaded Soroban image
const RAINBOW_PALETTE = [
  { name: 'pink', top: '#f472b6', ridge: '#ec4899', bot: '#db2777', text: '#831843' },
  { name: 'red', top: '#ef4444', ridge: '#dc2626', bot: '#b91c1c', text: '#7f1d1d' },
  { name: 'orange', top: '#fb923c', ridge: '#f97316', bot: '#ea580c', text: '#7c2d12' },
  { name: 'green', top: '#4ade80', ridge: '#22c55e', bot: '#16a34a', text: '#14532d' },
  { name: 'crimson', top: '#f87171', ridge: '#ef4444', bot: '#dc2626', text: '#7f1d1d' },
  { name: 'yellow', top: '#fde047', ridge: '#eab308', bot: '#ca8a04', text: '#713f12' },
  { name: 'pink', top: '#f472b6', ridge: '#ec4899', bot: '#db2777', text: '#831843' },
  { name: 'crimson', top: '#f87171', ridge: '#ef4444', bot: '#dc2626', text: '#7f1d1d' },
  { name: 'orange', top: '#fb923c', ridge: '#f97316', bot: '#ea580c', text: '#7c2d12' },
  { name: 'green', top: '#4ade80', ridge: '#22c55e', bot: '#16a34a', text: '#14532d' },
  { name: 'crimson', top: '#f87171', ridge: '#ef4444', bot: '#dc2626', text: '#7f1d1d' },
  { name: 'yellow', top: '#fde047', ridge: '#eab308', bot: '#ca8a04', text: '#713f12' },
  { name: 'pink', top: '#f472b6', ridge: '#ec4899', bot: '#db2777', text: '#831843' },
];

const WOODEN_PALETTE = {
  top: '#d97706',
  ridge: '#b45309',
  bot: '#92400e',
  text: '#451a03'
};

const MODERN_PALETTE = {
  top: '#38bdf8',
  ridge: '#0284c7',
  bot: '#0369a1',
  text: '#082f49'
};

export const Abacus: React.FC<AbacusProps> = ({
  rods,
  onRodsChange,
  showValues = true,
  onToggleShowValues,
  interactive = true,
  theme = 'rainbow',
  lang = 'bn',
  highlightRodIndex = null,
  className = ''
}) => {
  const t = getT(lang);

  // Calculate total number from rods (left to right, rightmost is 10^0)
  const totalValue = useMemo(() => {
    let sum = 0n;
    for (let i = 0; i < rods.length; i++) {
      const rod = rods[i];
      const rodVal = BigInt((rod.upper ? 5 : 0) + rod.lowerCount);
      const power = BigInt(rods.length - 1 - i);
      sum += rodVal * 10n ** power;
    }
    return sum.toLocaleString();
  }, [rods]);

  const handleUpperClick = (index: number) => {
    if (!interactive) return;
    const newRods = [...rods];
    const target = newRods[index];
    newRods[index] = {
      ...target,
      upper: !target.upper
    };
    sound.playBeadClick(newRods[index].upper ? 1.15 : 0.95);
    onRodsChange(newRods);
  };

  const handleLowerClick = (rodIndex: number, beadIndexFromBeam: number) => {
    if (!interactive) return;
    // beadIndexFromBeam: 0 is closest to beam, 3 is bottom-most
    const newRods = [...rods];
    const current = newRods[rodIndex];
    let newCount = current.lowerCount;

    // If tapping an active bead (beadIndexFromBeam < current.lowerCount), we can deactivate it and below
    if (beadIndexFromBeam < current.lowerCount) {
      newCount = beadIndexFromBeam;
    } else {
      // Tapping inactive bead pushes it and above up to the beam
      newCount = beadIndexFromBeam + 1;
    }

    newRods[rodIndex] = {
      ...current,
      lowerCount: newCount
    };
    sound.playBeadClick(1.0 + beadIndexFromBeam * 0.08);
    onRodsChange(newRods);
  };

  const handleReset = () => {
    if (!interactive) return;
    sound.playResetSweep();
    const cleared = rods.map(r => ({ ...r, upper: false, lowerCount: 0 }));
    onRodsChange(cleared);
  };

  const getBeadColors = (rodIndex: number) => {
    if (theme === 'classic') return WOODEN_PALETTE;
    if (theme === 'modern') return MODERN_PALETTE;
    return RAINBOW_PALETTE[rodIndex % RAINBOW_PALETTE.length];
  };

  // Unit dots on beam: typically marked on every 3rd or 4th rod (especially the middle and multiples)
  const hasUnitDot = (index: number) => {
    const fromRight = rods.length - 1 - index;
    return fromRight % 3 === 0 && fromRight > 0;
  };

  return (
    <div className={`flex flex-col items-center w-full select-none ${className}`}>
      {/* Abacus Readout & Quick Control Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 text-white rounded-t-xl border-b border-slate-800 shadow-inner">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={!interactive}
            title={t.resetAbacus}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-lg transition-transform cursor-pointer shadow-md disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetAbacus}</span>
          </button>

          {onToggleShowValues && (
            <button
              onClick={onToggleShowValues}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {showValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{t.beadsValue}</span>
            </button>
          )}
        </div>

        {/* Big Display Value */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{t.currentValue}:</span>
          <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider bg-slate-950 px-3 py-0.5 rounded border border-slate-700 min-w-24 text-right shadow-inner">
            {showValues ? totalValue : '••••'}
          </div>
        </div>
      </div>

      {/* Main Soroban Abacus Physical Frame Container */}
      <div className="w-full overflow-x-auto pb-2 pt-1 px-1 bg-neutral-900 flex justify-center rounded-b-xl shadow-2xl border-4 border-neutral-950">
        <div
          className="relative inline-flex p-3 sm:p-4 rounded-lg bg-neutral-900 border-8 border-neutral-950 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.5)]"
          style={{ minWidth: rods.length * 38 + 32 }}
        >
          {/* Outer wood grain texture overlay */}
          <div className="absolute inset-0 rounded-sm pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Rods Columns */}
          <div className="relative flex items-stretch gap-1 sm:gap-2 z-10">
            {rods.map((rod, rodIdx) => {
              const rodValue = (rod.upper ? 5 : 0) + rod.lowerCount;
              const isHighlighted = highlightRodIndex === rodIdx;
              const colors = getBeadColors(rodIdx);
              const showDot = hasUnitDot(rodIdx);
              const placePower = rods.length - 1 - rodIdx;

              return (
                <div
                  key={rod.id}
                  className={`flex flex-col items-center relative transition-colors duration-200 ${
                    isHighlighted ? 'bg-amber-500/10 rounded ring-2 ring-amber-400' : ''
                  }`}
                  style={{ width: '36px' }}
                >
                  {/* Place value indicator at top */}
                  <div className="h-5 text-[10px] font-mono text-neutral-400 font-semibold flex items-center justify-center">
                    {placePower === 0
                      ? '1s'
                      : placePower === 1
                      ? '10s'
                      : placePower === 2
                      ? '100s'
                      : placePower === 3
                      ? '1K'
                      : placePower === 4
                      ? '10K'
                      : placePower === 5
                      ? '100K'
                      : `${placePower}`}
                  </div>

                  {/* Upper Deck (Heaven Bead, value 5) */}
                  {/* Total height = 22px bead + 28px travel = 50px */}
                  <div
                    className="relative w-full h-[50px] cursor-pointer"
                    onClick={() => handleUpperClick(rodIdx)}
                    title={`Rod ${rodIdx + 1} - Upper Bead (5)`}
                  >
                    {/* Bamboo rod running down center */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 rounded-sm shadow-inner pointer-events-none" />

                    {/* Heaven bead (1 bead)
                        When INACTIVE (upper = false): at top (top: 0px, away from beam)
                        When ACTIVE (upper = true): moves DOWN to touch beam (top: 28px)
                    */}
                    <div
                      className="absolute left-0 right-0 h-[22px] transition-all duration-150 ease-out"
                      style={{
                        top: rod.upper ? '28px' : '0px'
                      }}
                    >
                      <BiconicalBead
                        color={colors}
                        active={rod.upper}
                        value={5}
                        showLabel={showValues}
                      />
                    </div>
                  </div>

                  {/* Horizontal Reckoning Beam (Divider Bar) */}
                  <div className="relative w-full h-3 bg-gradient-to-b from-stone-200 via-white to-stone-300 border-y border-stone-400 flex items-center justify-center shadow-md z-20">
                    {/* White/Black Unit Marker Dot */}
                    {showDot && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-white shadow-xs" />
                    )}
                  </div>

                  {/* Lower Deck (Earth Beads, 4 beads, each value 1)
                      Beads are tightly clustered with 1px gap.
                      Travel gap between beam and inactive beads is increased to 48px
                      for crystal-clear reading and counting separation.
                      Total height = 4 * 23px + 48px travel gap = 140px.
                  */}
                  <div className="relative w-full h-[140px]">
                    {/* Bamboo rod running down center */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 rounded-sm shadow-inner pointer-events-none" />

                    {/* 4 Earth Beads */}
                    {[0, 1, 2, 3].map((beadIdx) => {
                      const isActive = beadIdx < rod.lowerCount;
                      const topPos = isActive
                        ? beadIdx * 23
                        : beadIdx * 23 + 48;

                      return (
                        <div
                          key={beadIdx}
                          onClick={() => handleLowerClick(rodIdx, beadIdx)}
                          className="absolute left-0 right-0 h-[22px] cursor-pointer transition-all duration-150 ease-out"
                          style={{
                            top: `${topPos}px`
                          }}
                          title={`Rod ${rodIdx + 1} - Earth Bead ${beadIdx + 1} (1)`}
                        >
                          <BiconicalBead
                            color={colors}
                            active={isActive}
                            value={1}
                            showLabel={showValues && isActive}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Rod Digit Display */}
                  <div className="mt-2 h-6 flex items-center justify-center">
                    <span
                      className={`font-mono text-sm font-bold px-1.5 py-0.5 rounded transition-colors ${
                        rodValue > 0
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-neutral-500'
                      }`}
                    >
                      {showValues ? rodValue : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Realistic Soroban Biconical Diamond-Cut Bead
interface BeadProps {
  color: { top: string; ridge: string; bot: string; text: string };
  active: boolean;
  value: number;
  showLabel?: boolean;
}

const BiconicalBead: React.FC<BeadProps> = ({ color, active, value, showLabel = false }) => {
  return (
    <div
      className="relative w-full h-[22px] flex items-center justify-center group active:scale-95 transition-transform"
      style={{ filter: active ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
    >
      {/* 3D Rhomboid / Biconical SVG Bead matching the Japanese Soroban in the photo */}
      <svg
        viewBox="0 0 44 22"
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          <linearGradient id={`bead-top-${color.ridge}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color.top} />
            <stop offset="100%" stopColor={color.ridge} />
          </linearGradient>
          <linearGradient id={`bead-bot-${color.ridge}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color.ridge} />
            <stop offset="100%" stopColor={color.bot} />
          </linearGradient>
          <linearGradient id={`specular-${color.ridge}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Top half facet of diamond bead */}
        <polygon
          points="8,1 36,1 43,11 1,11"
          fill={`url(#bead-top-${color.ridge})`}
          stroke={color.bot}
          strokeWidth="0.8"
        />

        {/* Bottom half facet of diamond bead */}
        <polygon
          points="1,11 43,11 36,21 8,21"
          fill={`url(#bead-bot-${color.ridge})`}
          stroke={color.bot}
          strokeWidth="0.8"
        />

        {/* Sharp horizontal center ridge with highlight */}
        <line
          x1="1"
          y1="11"
          x2="43"
          y2="11"
          stroke="#ffffff"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />

        {/* Vertical specular sheen reflecting light on curved diamond body */}
        <polygon
          points="18,1 26,1 27,21 17,21"
          fill={`url(#specular-${color.ridge})`}
          opacity={active ? 0.85 : 0.65}
        />
      </svg>

      {/* Optional subtle bead value number inside */}
      {showLabel && (
        <span
          className="absolute inset-0 flex items-center justify-center text-[9px] font-black pointer-events-none drop-shadow-sm select-none"
          style={{ color: active ? '#ffffff' : color.text }}
        >
          {value}
        </span>
      )}
    </div>
  );
};
