import React, { useState, useEffect } from 'react';
import { OrderTicket } from '../../types/game';
import { sound } from '../../services/audio';
import { Utensils, RotateCcw, Check, Sparkles } from 'lucide-react';

interface Props {
  order: OrderTicket;
  onServe: (userValue: { numerator: number; denominator: number; decimalValue: number }) => void;
  disabled?: boolean;
}

export const PizzaStation: React.FC<Props> = ({ order, onServe, disabled = false }) => {
  // Available slice division options
  const sliceOptions = [2, 3, 4, 5, 6, 8, 10, 12];

  // Pick initial denominator based on target or default to 4
  const targetDenom = order.targetFraction?.denominator || 4;
  const initialSlices = sliceOptions.includes(targetDenom) ? targetDenom : 4;

  const [totalSlices, setTotalSlices] = useState<number>(initialSlices);
  const [selectedSlices, setSelectedSlices] = useState<boolean[]>(
    new Array(initialSlices).fill(false)
  );

  // When order changes, reset
  useEffect(() => {
    const defaultDenom = order.targetFraction?.denominator || 4;
    const initial = sliceOptions.includes(defaultDenom) ? defaultDenom : 4;
    setTotalSlices(initial);
    setSelectedSlices(new Array(initial).fill(false));
  }, [order.id]);

  const handleSliceCountChange = (count: number) => {
    if (disabled) return;
    sound.playSlice();
    setTotalSlices(count);
    setSelectedSlices(new Array(count).fill(false));
  };

  const handleToggleSlice = (index: number) => {
    if (disabled) return;
    sound.playClick();
    setSelectedSlices(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleClear = () => {
    if (disabled) return;
    sound.playClick();
    setSelectedSlices(new Array(totalSlices).fill(false));
  };

  const handleSelectAll = () => {
    if (disabled) return;
    sound.playClick();
    setSelectedSlices(new Array(totalSlices).fill(true));
  };

  const selectedCount = selectedSlices.filter(Boolean).length;
  const currentDecimal = totalSlices > 0 ? selectedCount / totalSlices : 0;

  // Check if current selection is equivalent to target
  let isEquivalent = false;
  if (order.targetFraction) {
    const targetDec = order.targetFraction.numerator / order.targetFraction.denominator;
    isEquivalent = Math.abs(currentDecimal - targetDec) < 0.001;
  } else if (order.targetDecimal !== undefined) {
    isEquivalent = Math.abs(currentDecimal - order.targetDecimal) < 0.001;
  }

  const handleServeClick = () => {
    if (disabled) return;
    onServe({
      numerator: selectedCount,
      denominator: totalSlices,
      decimalValue: currentDecimal
    });
  };

  // Helper to generate SVG pie slices
  const renderSlices = () => {
    const slices = [];
    const center = 150;
    const radius = 130;
    const anglePerSlice = (2 * Math.PI) / totalSlices;

    for (let i = 0; i < totalSlices; i++) {
      const startAngle = i * anglePerSlice - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = anglePerSlice > Math.PI ? 1 : 0;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const isSelected = selectedSlices[i];

      // Mid-angle for topping coordinates
      const midAngle = startAngle + anglePerSlice / 2;
      const toppingR = radius * 0.65;
      const tx = center + toppingR * Math.cos(midAngle);
      const ty = center + toppingR * Math.sin(midAngle);

      slices.push(
        <g
          key={i}
          onClick={() => handleToggleSlice(i)}
          className="cursor-pointer group transition-transform"
        >
          {/* Slice Crust / Base */}
          <path
            d={pathData}
            fill={isSelected ? '#F59E0B' : '#FDE68A'}
            stroke="#92400E"
            strokeWidth="2.5"
            className="transition-colors duration-150 group-hover:brightness-95"
          />

          {/* Crust rim arc */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
            stroke="#78350F"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Delicious Toppings */}
          {isSelected && (
            <g pointerEvents="none">
              {/* Cheese & Chocolate drizzle */}
              <circle cx={tx} cy={ty} r="7" fill="#B45309" opacity="0.8" />
              <circle cx={tx - 4} cy={ty - 4} r="3" fill="#FEF08A" />
              <circle cx={tx + 5} cy={ty + 3} r="2.5" fill="#DC2626" />
            </g>
          )}

          {!isSelected && (
            <g pointerEvents="none">
              <circle cx={tx} cy={ty} r="4" fill="#D97706" opacity="0.4" />
            </g>
          )}

          {/* Slice number hint in subtle contrast */}
          <text
            x={center + (radius * 0.38) * Math.cos(midAngle)}
            y={center + (radius * 0.38) * Math.sin(midAngle) + 4}
            textAnchor="middle"
            fill={isSelected ? '#78350F' : '#92400E'}
            fontSize={totalSlices > 8 ? '10' : '13'}
            fontWeight="bold"
            pointerEvents="none"
            className="font-mono-numbers select-none"
          >
            {i + 1}
          </text>
        </g>
      );
    }
    return slices;
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Station Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold">
            <Utensils className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
              Dapur Pemotong: {order.recipeName}
            </h3>
            <p className="text-xs text-amber-800/80">
              Pilih jumlah potongan loyang, lalu klik potongan untuk disajikan
            </p>
          </div>
        </div>

        {/* Real-time Math Fraction Readout */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-xs font-medium text-amber-800">Bagian Terpilih:</span>
            <div className="flex items-center font-mono-numbers font-bold text-base text-amber-950">
              <span className="text-amber-800">{selectedCount}</span>
              <span className="mx-1 text-amber-400">/</span>
              <span>{totalSlices}</span>
            </div>
          </div>

          {isEquivalent && selectedCount > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Senilai ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Stage & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Pizza Pan Canvas */}
        <div className="md:col-span-7 flex flex-col items-center justify-center">
          <div className="relative p-2 rounded-full bg-gradient-to-b from-amber-100 to-amber-200/60 border-4 border-amber-300 shadow-inner">
            <svg
              viewBox="0 0 300 300"
              className="w-64 h-64 sm:w-72 sm:h-72 select-none touch-manipulation drop-shadow-sm"
            >
              {/* Outer Pan Rim */}
              <circle cx="150" cy="150" r="146" fill="#FBBF24" opacity="0.3" />
              <circle cx="150" cy="150" r="140" fill="#FFFBEB" stroke="#D97706" strokeWidth="3" />
              {/* Slices */}
              {renderSlices()}
              {/* Center Pan Hub */}
              <circle cx="150" cy="150" r="12" fill="#78350F" />
              <circle cx="150" cy="150" r="6" fill="#FDE68A" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-amber-700/80 italic text-center">
            *Klik setiap potongan untuk memilih atau membatalkan
          </p>
        </div>

        {/* Right: Slicer Controls & Fraction Tools */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Bagi Loyang Menjadi (Penyebut):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {sliceOptions.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSliceCountChange(num)}
                  disabled={disabled}
                  className={`py-2 px-2 text-xs font-bold font-mono-numbers rounded-xl border transition-all ${
                    totalSlices === num
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs scale-102'
                      : 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  {num} Bagian
                </button>
              ))}
            </div>
          </div>

          {/* Quick select helpers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || selectedCount === 0}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={disabled || selectedCount === totalSlices}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Pilih Semua</span>
            </button>
          </div>

          {/* Visual Fraction Insight Card */}
          <div className="bg-amber-50/60 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-900 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Nilai Pecahan:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {selectedCount} / {totalSlices}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Bentuk Desimal:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {currentDecimal.toFixed(3).replace(/\.?0+$/, '') || '0'}
              </span>
            </div>
            {order.targetFraction && (
              <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-700">Target Pesanan:</span>
                <span className="font-bold text-amber-900 font-mono-numbers">
                  {order.targetFraction.numerator}/{order.targetFraction.denominator} loyang
                </span>
              </div>
            )}
          </div>

          {/* Serve CTA */}
          <button
            type="button"
            onClick={handleServeClick}
            disabled={disabled || selectedCount === 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sajikan {selectedCount}/{totalSlices} Loyang ke Pembeli</span>
          </button>
        </div>
      </div>
    </div>
  );
};
