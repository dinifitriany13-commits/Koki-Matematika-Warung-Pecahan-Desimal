import React, { useState, useEffect } from 'react';
import { OrderTicket } from '../../types/game';
import { sound } from '../../services/audio';
import { Flame, RotateCcw, Sparkles, Check } from 'lucide-react';

interface Props {
  order: OrderTicket;
  onServe: (userValue: { numerator: number; denominator: number; decimalValue: number }) => void;
  disabled?: boolean;
}

export const SateStation: React.FC<Props> = ({ order, onServe, disabled = false }) => {
  // Available skewers options on grill
  const skewerCapacities = [6, 8, 10, 12];

  // Calculate default based on denominator or default to 10
  const defaultTotal = order.targetFraction
    ? (order.targetFraction.denominator === 5 ? 10 : (skewerCapacities.includes(order.targetFraction.denominator) ? order.targetFraction.denominator : 10))
    : 10;

  const [totalSkewers, setTotalSkewers] = useState<number>(defaultTotal);
  const [selectedOnPlate, setSelectedOnPlate] = useState<boolean[]>(
    new Array(defaultTotal).fill(false)
  );

  useEffect(() => {
    const denom = order.targetFraction?.denominator || 5;
    const initial = denom === 5 ? 10 : (skewerCapacities.includes(denom) ? denom : 10);
    setTotalSkewers(initial);
    setSelectedOnPlate(new Array(initial).fill(false));
  }, [order.id]);

  const handleCapacityChange = (cap: number) => {
    if (disabled) return;
    sound.playClick();
    setTotalSkewers(cap);
    setSelectedOnPlate(new Array(cap).fill(false));
  };

  const handleToggleSkewer = (index: number) => {
    if (disabled) return;
    sound.playSlice();
    setSelectedOnPlate(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleClear = () => {
    if (disabled) return;
    sound.playClick();
    setSelectedOnPlate(new Array(totalSkewers).fill(false));
  };

  const handleSelectAll = () => {
    if (disabled) return;
    sound.playClick();
    setSelectedOnPlate(new Array(totalSkewers).fill(true));
  };

  const plateCount = selectedOnPlate.filter(Boolean).length;
  const currentDecimal = totalSkewers > 0 ? plateCount / totalSkewers : 0;

  let isEquivalent = false;
  if (order.targetFraction) {
    const targetDec = order.targetFraction.numerator / order.targetFraction.denominator;
    isEquivalent = Math.abs(currentDecimal - targetDec) < 0.005;
  } else if (order.targetDecimal !== undefined) {
    isEquivalent = Math.abs(currentDecimal - order.targetDecimal) < 0.005;
  }

  const handleServe = () => {
    if (disabled || plateCount === 0) return;
    onServe({
      numerator: plateCount,
      denominator: totalSkewers,
      decimalValue: currentDecimal
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-800 flex items-center justify-center font-bold">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
              Panggangan Sate Madura: {order.recipeName}
            </h3>
            <p className="text-xs text-amber-800/80">
              Pindahkan tusuk sate dari panggangan arang ke piring saji daun pisang
            </p>
          </div>
        </div>

        {/* Readout Fraction */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-mono-numbers">
            <span className="text-xs text-amber-800 font-sans font-medium">Di Piring:</span>
            <span className="font-bold text-base text-amber-950">
              {plateCount} <span className="text-amber-400">/</span> {totalSkewers}
            </span>
          </div>

          {isEquivalent && plateCount > 0 && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pas! ✓</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage: Sate Grill & Banana Leaf Plate */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: The Sate Charcoal Grill (Panggangan Arang) */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {/* Charcoal Grill Box */}
          <div className="relative bg-[#292524] border-4 border-[#1C1917] rounded-2xl p-4 shadow-inner flex flex-col gap-2">
            {/* Glowing charcoal coals effect */}
            <div className="absolute inset-x-2 top-2 h-4 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full opacity-60 blur-xs pointer-events-none" />

            <div className="flex items-center justify-between text-xs text-amber-200 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>Panggangan Arang ({totalSkewers - plateCount} tusuk tersisa)</span>
              </span>
              <span className="text-[11px] text-amber-300/80 italic font-normal">
                *Klik tusuk sate untuk memindahkan
              </span>
            </div>

            {/* Skewers Rack */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 py-2">
              {Array.from({ length: totalSkewers }).map((_, idx) => {
                const isOnPlate = selectedOnPlate[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleSkewer(idx)}
                    disabled={disabled}
                    className={`relative p-2 rounded-xl flex flex-col items-center justify-center border-2 transition-all transform duration-150 ${
                      isOnPlate
                        ? 'opacity-25 scale-90 border-dashed border-amber-800 bg-black/20'
                        : 'bg-[#44403C] hover:bg-[#57534E] border-[#78716C] shadow-md hover:-translate-y-1'
                    }`}
                  >
                    {/* SVG Skewer Illustration */}
                    <svg viewBox="0 0 24 50" className="w-6 h-12">
                      {/* Skewer Bamboo Stick */}
                      <line x1="12" y1="2" x2="12" y2="48" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                      {/* 3 Meat Chunks */}
                      <circle cx="12" cy="12" r="5" fill="#78350F" stroke="#451A03" strokeWidth="1" />
                      <circle cx="12" cy="22" r="5.5" fill="#92400E" stroke="#451A03" strokeWidth="1" />
                      <circle cx="12" cy="32" r="5" fill="#78350F" stroke="#451A03" strokeWidth="1" />
                      {/* Peanut Sauce Drizzle */}
                      <path d="M 8 12 Q 12 16 16 22 Q 12 28 8 32" stroke="#B45309" strokeWidth="2" fill="none" />
                    </svg>
                    <span className="text-[10px] font-bold font-mono-numbers text-amber-200 mt-1">
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banana Leaf Serving Plate (Piring Daun Pisang) */}
          <div className="bg-[#15803D]/15 border-2 border-[#16A34A] rounded-2xl p-3 flex flex-col gap-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
              <span>🍃 Piring Saji Daun Pisang: {plateCount} Tusuk Sate Disajikan</span>
              <span className="font-mono-numbers text-emerald-800">
                Pecahan: {plateCount} / {totalSkewers}
              </span>
            </div>

            {/* Visual Skewers on Plate */}
            <div className="min-h-12 flex flex-wrap items-center gap-1.5 bg-[#DCFCE7]/60 p-2 rounded-xl border border-[#86EFAC]">
              {plateCount === 0 ? (
                <span className="text-xs text-emerald-700/70 italic mx-auto">
                  Piring masih kosong. Klik tusuk sate di panggangan untuk menyajikannya ke sini!
                </span>
              ) : (
                Array.from({ length: plateCount }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1 bg-white border border-emerald-300 px-2 py-1 rounded-lg text-xs font-bold text-amber-950 font-mono-numbers shadow-2xs">
                    <span>🍢</span>
                    <span>1</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Sate Controls Deck */}
        <div className="md:col-span-5 flex flex-col gap-3.5">
          {/* Capacity Switcher */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              Kapasitas Tusuk Sate di Panggangan:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {skewerCapacities.map(cap => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => handleCapacityChange(cap)}
                  disabled={disabled}
                  className={`py-1.5 px-2 text-xs font-bold font-mono-numbers rounded-xl border transition-all ${
                    totalSkewers === cap
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  {cap} Tusuk
                </button>
              ))}
            </div>
          </div>

          {/* Quick Helpers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || plateCount === 0}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={disabled || plateCount === totalSkewers}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Pilih Semua</span>
            </button>
          </div>

          {/* Concept Insight Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Nilai Pecahan:</span>
              <span className="font-mono-numbers font-bold text-amber-950 text-sm">
                {plateCount} / {totalSkewers} porsi
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Bentuk Desimal:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {currentDecimal.toFixed(2)}
              </span>
            </div>
            {order.targetFraction && (
              <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-700">Target Pelanggan:</span>
                <span className="font-bold text-amber-950 font-mono-numbers">
                  {order.targetFraction.numerator}/{order.targetFraction.denominator} porsi
                </span>
              </div>
            )}
          </div>

          {/* Serve CTA */}
          <button
            type="button"
            onClick={handleServe}
            disabled={disabled || plateCount === 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sajikan {plateCount}/{totalSkewers} Tusuk Sate Madura</span>
          </button>
        </div>
      </div>
    </div>
  );
};
