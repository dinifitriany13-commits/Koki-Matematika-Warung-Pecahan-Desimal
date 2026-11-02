import React, { useState, useEffect } from 'react';
import { OrderTicket } from '../../types/game';
import { sound } from '../../services/audio';
import { Scale, RotateCcw, Plus, Minus, Sparkles } from 'lucide-react';

interface Props {
  order: OrderTicket;
  onServe: (userValue: { decimalValue: number; fractionEquivalent?: string }) => void;
  disabled?: boolean;
}

export const TimbanganStation: React.FC<Props> = ({ order, onServe, disabled = false }) => {
  const [currentKg, setCurrentKg] = useState<number>(0);

  const targetKg = order.targetDecimal !== undefined
    ? order.targetDecimal
    : (order.targetFraction ? order.targetFraction.numerator / order.targetFraction.denominator : 0.5);

  useEffect(() => {
    setCurrentKg(0);
  }, [order.id]);

  const addWeight = (delta: number) => {
    if (disabled) return;
    sound.playPour();
    setCurrentKg(prev => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.max(0, Math.min(2.0, next));
    });
  };

  const handleClear = () => {
    if (disabled) return;
    sound.playClick();
    setCurrentKg(0);
  };

  const getFractionText = (val: number): string => {
    if (Math.abs(val - 0.5) < 0.005) return '1/2 kg (Setengah Kilo)';
    if (Math.abs(val - 0.25) < 0.005) return '1/4 kg (Seperempat Kilo)';
    if (Math.abs(val - 0.75) < 0.005) return '3/4 kg (Tiga Perempat Kilo)';
    if (Math.abs(val - 1.0) < 0.005) return '1 kg Utuh';
    if (Math.abs(val - 1.25) < 0.005) return '1 1/4 kg';
    if (Math.abs(val - 1.5) < 0.005) return '1 1/2 kg';
    const hundredths = Math.round(val * 100);
    return `${hundredths}/100 kg`;
  };

  const isExact = Math.abs(currentKg - targetKg) < 0.01;

  const handleServe = () => {
    if (disabled || currentKg <= 0) return;
    onServe({
      decimalValue: currentKg,
      fractionEquivalent: getFractionText(currentKg)
    });
  };

  // Needle angle for analog balance dial (0 to 2 kg -> -120 deg to +120 deg)
  const needleAngle = -120 + (Math.min(2, currentKg) / 2) * 240;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-800 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
              Timbangan Warung Kelontong: {order.recipeName}
            </h3>
            <p className="text-xs text-amber-800/80">
              Gunakan anak timbangan untuk menimbang tepat berat desimal dalam Kilogram
            </p>
          </div>
        </div>

        {/* Current Weight Readout */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-mono-numbers">
            <span className="text-xs text-amber-800 font-sans font-medium">Berat Ditimbang:</span>
            <span className="font-bold text-base text-amber-950">
              {currentKg.toFixed(2)} kg
            </span>
          </div>

          {isExact && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Presisi! ✓</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage: Visual Indonesian Scale */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Vintage Indonesian Scale SVG */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200 flex flex-col items-center relative">
            <svg viewBox="0 0 200 220" className="w-52 h-56 select-none">
              {/* Scale Tray / Piring Timbangan */}
              <ellipse cx="100" cy="40" rx="70" ry="14" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />

              {/* Items on the tray if loaded */}
              {currentKg > 0 && (
                <g className="transition-all duration-200">
                  {/* Visual Goods (Telur / Beras / Bumbu) */}
                  <ellipse cx="100" cy="34" rx="45" ry="10" fill="#FBBF24" opacity="0.8" />
                  <circle cx="85" cy="30" r="8" fill="#D97706" />
                  <circle cx="100" cy="28" r="9" fill="#B45309" />
                  <circle cx="115" cy="30" r="8" fill="#D97706" />
                  <text x="100" y="32" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
                    {currentKg.toFixed(2)} kg
                  </text>
                </g>
              )}

              {/* Connecting Tray Struts */}
              <line x1="100" y1="45" x2="100" y2="70" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Scale Dial Base Body (Classic Round Clock Scale) */}
              <rect x="75" y="160" width="50" height="45" rx="6" fill="#334155" />
              <circle cx="100" cy="120" r="50" fill="#F8FAFC" stroke="#334155" strokeWidth="6" />

              {/* Graduation Ticks (0, 0.5, 1.0, 1.5, 2.0 kg) */}
              {[0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map(tick => {
                const angle = (-120 + (tick / 2) * 240) * (Math.PI / 180);
                const x1 = 100 + 44 * Math.sin(angle);
                const y1 = 120 - 44 * Math.cos(angle);
                const x2 = 100 + 36 * Math.sin(angle);
                const y2 = 120 - 36 * Math.cos(angle);
                return (
                  <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth={tick % 0.5 === 0 ? "2.5" : "1.2"} />
                );
              })}

              {/* Key numbers */}
              <text x="70" y="145" fontSize="8" fontWeight="bold" fill="#1E293B">0 kg</text>
              <text x="100" y="86" fontSize="8" fontWeight="bold" fill="#1E293B" textAnchor="middle">1.0 kg</text>
              <text x="130" y="145" fontSize="8" fontWeight="bold" fill="#1E293B" textAnchor="end">2.0 kg</text>

              {/* Dial Center Hub */}
              <circle cx="100" cy="120" r="5" fill="#DC2626" />

              {/* Rotating Needle */}
              <g transform={`rotate(${needleAngle} 100 120)`} className="transition-transform duration-200 ease-out">
                <line x1="100" y1="120" x2="100" y2="82" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* Scale Foot Stand */}
              <rect x="60" y="200" width="80" height="10" rx="3" fill="#1E293B" />
            </svg>
          </div>
        </div>

        {/* Right: Anak Timbangan / Weights & Controls */}
        <div className="md:col-span-6 flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              Tambahkan Anak Timbangan (Beban Gram/Kg):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => addWeight(0.5)}
                disabled={disabled || currentKg >= 2.0}
                className="py-2.5 px-2 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 rounded-xl text-xs font-bold font-mono-numbers text-amber-950 flex flex-col items-center justify-center gap-0.5 transition-colors shadow-2xs"
              >
                <span>+0.5 kg</span>
                <span className="text-[10px] font-sans font-medium text-amber-700">(1/2 Kilo)</span>
              </button>

              <button
                type="button"
                onClick={() => addWeight(0.25)}
                disabled={disabled || currentKg >= 2.0}
                className="py-2.5 px-2 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 rounded-xl text-xs font-bold font-mono-numbers text-amber-950 flex flex-col items-center justify-center gap-0.5 transition-colors shadow-2xs"
              >
                <span>+0.25 kg</span>
                <span className="text-[10px] font-sans font-medium text-amber-700">(1/4 Kilo)</span>
              </button>

              <button
                type="button"
                onClick={() => addWeight(0.1)}
                disabled={disabled || currentKg >= 2.0}
                className="py-2.5 px-2 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 rounded-xl text-xs font-bold font-mono-numbers text-amber-950 flex flex-col items-center justify-center gap-0.5 transition-colors shadow-2xs"
              >
                <span>+0.1 kg</span>
                <span className="text-[10px] font-sans font-medium text-amber-700">(1 Ons)</span>
              </button>

              <button
                type="button"
                onClick={() => addWeight(0.05)}
                disabled={disabled || currentKg >= 2.0}
                className="py-2.5 px-2 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 rounded-xl text-xs font-bold font-mono-numbers text-amber-950 flex flex-col items-center justify-center gap-0.5 transition-colors shadow-2xs"
              >
                <span>+0.05 kg</span>
                <span className="text-[10px] font-sans font-medium text-amber-700">(1/2 Ons)</span>
              </button>
            </div>
          </div>

          {/* Subtraction and Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addWeight(-0.1)}
              disabled={disabled || currentKg <= 0}
              className="flex-1 py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold font-mono-numbers flex items-center justify-center gap-1 transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-amber-600" />
              <span>-0.1 kg</span>
            </button>
            <button
              type="button"
              onClick={() => addWeight(-0.05)}
              disabled={disabled || currentKg <= 0}
              className="flex-1 py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold font-mono-numbers flex items-center justify-center gap-1 transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-amber-600" />
              <span>-0.05 kg</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || currentKg === 0}
              className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Mathematical Insight */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Angka Desimal Berat:</span>
              <span className="font-mono-numbers font-bold text-amber-950 text-sm">
                {currentKg.toFixed(2)} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Pecahan Senilai:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {getFractionText(currentKg)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-amber-700">Target Pelanggan:</span>
              <span className="font-bold text-amber-950 font-mono-numbers">
                {targetKg} kg
              </span>
            </div>
          </div>

          {/* Serve CTA */}
          <button
            type="button"
            onClick={handleServe}
            disabled={disabled || currentKg <= 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bungkus {currentKg.toFixed(2)} kg ke Timbangan Pelanggan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
