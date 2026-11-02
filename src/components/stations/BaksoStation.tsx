import React, { useState, useEffect } from 'react';
import { OrderTicket } from '../../types/game';
import { sound } from '../../services/audio';
import { Soup, RotateCcw, Plus, Sparkles, Check } from 'lucide-react';

interface Props {
  order: OrderTicket;
  onServe: (userValue: { decimalValue: number; fractionEquivalent?: string }) => void;
  disabled?: boolean;
}

export const BaksoStation: React.FC<Props> = ({ order, onServe, disabled = false }) => {
  // Whole bowls (0, 1, 2)
  const [wholeBowls, setWholeBowls] = useState<number>(1);
  // Fraction of bowl (0, 0.25, 0.5, 0.75)
  const [fractionPart, setFractionPart] = useState<number>(0);

  // Target decimal (e.g. 1.5 for 1 1/2, or 1.25 for 1 1/4)
  const targetVal = order.targetDecimal !== undefined
    ? order.targetDecimal
    : (order.targetFraction ? order.targetFraction.numerator / order.targetFraction.denominator : 1.5);

  useEffect(() => {
    setWholeBowls(1);
    setFractionPart(0);
  }, [order.id]);

  const totalPortion = wholeBowls + fractionPart;

  const handleSelectWhole = (w: number) => {
    if (disabled) return;
    sound.playClick();
    setWholeBowls(w);
  };

  const handleSelectFraction = (f: number) => {
    if (disabled) return;
    sound.playClick();
    setFractionPart(f);
  };

  const handleReset = () => {
    if (disabled) return;
    sound.playClick();
    setWholeBowls(0);
    setFractionPart(0);
  };

  const isExact = Math.abs(totalPortion - targetVal) < 0.01;

  const getFractionText = (w: number, f: number): string => {
    let fStr = '';
    if (Math.abs(f - 0.25) < 0.01) fStr = '1/4';
    else if (Math.abs(f - 0.5) < 0.01) fStr = '1/2';
    else if (Math.abs(f - 0.75) < 0.01) fStr = '3/4';

    if (w === 0 && fStr) return `${fStr} Porsi`;
    if (w > 0 && fStr) return `${w} ${fStr} Porsi (Pecahan Campuran)`;
    if (w > 0 && !fStr) return `${w} Porsi Utuh`;
    return '0 Porsi';
  };

  const handleServe = () => {
    if (disabled || totalPortion <= 0) return;
    onServe({
      decimalValue: totalPortion,
      fractionEquivalent: getFractionText(wholeBowls, fractionPart)
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-800 flex items-center justify-center font-bold">
            <Soup className="w-4 h-4 text-red-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
              Warung Bakso & Mie Ayam: {order.recipeName}
            </h3>
            <p className="text-xs text-amber-800/80">
              Racik porsi pecahan campuran (mangkuk utuh + mangkuk pecahan)
            </p>
          </div>
        </div>

        {/* Current Readout */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-mono-numbers">
            <span className="text-xs text-amber-800 font-sans font-medium">Disajikan:</span>
            <span className="font-bold text-base text-amber-950">
              {getFractionText(wholeBowls, fractionPart)}
            </span>
          </div>

          {isExact && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesuai! ✓</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Classic Indonesian Rooster Bowl Visualizer */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200 flex flex-col items-center gap-2 w-full">
            <span className="text-xs font-bold text-amber-900 uppercase">
              Mangkuk Ayam Jago di Meja Saji:
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3 py-2 min-h-36">
              {/* Render Whole Bowls */}
              {Array.from({ length: wholeBowls }).map((_, idx) => (
                <div key={`whole_${idx}`} className="flex flex-col items-center">
                  <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                    {/* Bowl Rim & Body */}
                    <ellipse cx="50" cy="30" rx="42" ry="14" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M 8 30 C 10 70, 90 70, 92 30 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                    {/* Bowl Base */}
                    <ellipse cx="50" cy="65" rx="20" ry="5" fill="#E2E8F0" />
                    {/* Indonesian Rooster Motif (Ayam Jago) */}
                    <path d="M 40 46 Q 46 38 52 46 Q 58 40 62 48" stroke="#DC2626" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="56" cy="42" r="2" fill="#16A34A" />
                    {/* Filled Meatballs & Soup */}
                    <ellipse cx="50" cy="30" rx="36" ry="10" fill="#FEF08A" opacity="0.6" />
                    <circle cx="42" cy="28" r="7" fill="#78350F" />
                    <circle cx="56" cy="26" r="8" fill="#92400E" />
                    <circle cx="50" cy="34" r="7" fill="#78350F" />
                  </svg>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full mt-1">
                    1 Porsi Utuh
                  </span>
                </div>
              ))}

              {/* Render Fraction Bowl if selected */}
              {fractionPart > 0 && (
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                    <ellipse cx="50" cy="30" rx="42" ry="14" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M 8 30 C 10 70, 90 70, 92 30 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                    <ellipse cx="50" cy="65" rx="20" ry="5" fill="#E2E8F0" />
                    {/* Rooster */}
                    <path d="M 40 46 Q 46 38 52 46 Q 58 40 62 48" stroke="#DC2626" strokeWidth="3" fill="none" />
                    {/* Partial Soup level */}
                    <ellipse cx="50" cy="38" rx="26" ry="7" fill="#FEF08A" opacity="0.6" />
                    <circle cx="46" cy="36" r="6" fill="#92400E" />
                  </svg>
                  <span className="text-[10px] font-bold text-red-900 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full mt-1">
                    {fractionPart === 0.5 ? '1/2 Porsi' : fractionPart === 0.25 ? '1/4 Porsi' : '3/4 Porsi'}
                  </span>
                </div>
              )}

              {totalPortion === 0 && (
                <span className="text-xs text-amber-700/80 italic">
                  Pilih jumlah mangkuk utuh dan pecahan di sebelah kanan
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Fraction & Portion Controls */}
        <div className="md:col-span-6 flex flex-col gap-3.5">
          {/* 1. Mangkuk Utuh (Bilangan Bulat) */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              1. Jumlah Mangkuk Utuh (Bilangan Bulat):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => handleSelectWhole(w)}
                  disabled={disabled}
                  className={`py-2 px-2 text-xs font-bold font-mono-numbers rounded-xl border transition-all ${
                    wholeBowls === w
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  {w} Mangkuk
                </button>
              ))}
            </div>
          </div>

          {/* 2. Tambahan Pecahan Mangkuk */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              2. Tambahan Porsi Pecahan:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: 0, label: '0' },
                { val: 0.25, label: '+1/4' },
                { val: 0.5, label: '+1/2' },
                { val: 0.75, label: '+3/4' }
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSelectFraction(item.val)}
                  disabled={disabled}
                  className={`py-2 px-2 text-xs font-bold font-mono-numbers rounded-xl border transition-all ${
                    fractionPart === item.val
                      ? 'bg-red-600 text-white border-red-700 shadow-xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Insight */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Bentuk Pecahan Campuran:</span>
              <span className="font-mono-numbers font-bold text-amber-950 text-sm">
                {getFractionText(wholeBowls, fractionPart)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Bentuk Desimal:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {totalPortion.toFixed(2)} porsi
              </span>
            </div>
            <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-amber-700">Target Pelanggan:</span>
              <span className="font-bold text-amber-950 font-mono-numbers">
                {targetVal} porsi
              </span>
            </div>
          </div>

          {/* Serve CTA */}
          <button
            type="button"
            onClick={handleServe}
            disabled={disabled || totalPortion <= 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sajikan Mangkuk Bakso ({totalPortion.toFixed(2)} Porsi)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
