import React, { useState, useEffect, useRef } from 'react';
import { OrderTicket } from '../../types/game';
import { sound } from '../../services/audio';
import { GlassWater, RotateCcw, Sparkles, Droplets, Plus, Minus } from 'lucide-react';

interface Props {
  order: OrderTicket;
  onServe: (userValue: { decimalValue: number; fractionEquivalent?: string }) => void;
  disabled?: boolean;
}

export const JuiceStation: React.FC<Props> = ({ order, onServe, disabled = false }) => {
  const [currentLiters, setCurrentLiters] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const pourIntervalRef = useRef<number | null>(null);

  // Target decimal
  const targetDecimal = order.targetDecimal !== undefined
    ? order.targetDecimal
    : (order.targetFraction ? order.targetFraction.numerator / order.targetFraction.denominator : 0.5);

  useEffect(() => {
    setCurrentLiters(0);
    setIsPouring(false);
    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
  }, [order.id]);

  const addAmount = (delta: number) => {
    if (disabled) return;
    sound.playPour();
    setCurrentLiters(prev => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.max(0, Math.min(1.0, next));
    });
  };

  const handleEmpty = () => {
    if (disabled) return;
    sound.playClick();
    setCurrentLiters(0);
  };

  // Continuous hold-to-pour handler
  const startPouring = () => {
    if (disabled || currentLiters >= 1.0) return;
    setIsPouring(true);
    sound.playPour();

    pourIntervalRef.current = window.setInterval(() => {
      setCurrentLiters(prev => {
        if (prev >= 1.0) {
          if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
          setIsPouring(false);
          return 1.0;
        }
        sound.playPour();
        return Math.round((prev + 0.02) * 100) / 100;
      });
    }, 150);
  };

  const stopPouring = () => {
    setIsPouring(false);
    if (pourIntervalRef.current) {
      clearInterval(pourIntervalRef.current);
      pourIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    };
  }, []);

  // Determine juice color based on recipe name
  let juiceColor1 = '#F59E0B';
  let juiceColor2 = '#EA580C';
  const name = order.recipeName.toLowerCase();
  if (name.includes('alpukat') || name.includes('melon')) {
    juiceColor1 = '#84CC16';
    juiceColor2 = '#4D7C0F';
  } else if (name.includes('teh')) {
    juiceColor1 = '#D97706';
    juiceColor2 = '#78350F';
  } else if (name.includes('stroberi') || name.includes('naga')) {
    juiceColor1 = '#F43F5E';
    juiceColor2 = '#BE123C';
  } else if (name.includes('mangga')) {
    juiceColor1 = '#FBBF24';
    juiceColor2 = '#D97706';
  }

  // Fraction equivalent simplification helper
  const getFractionText = (val: number): string => {
    if (Math.abs(val - 0.5) < 0.005) return '1/2 Liter';
    if (Math.abs(val - 0.25) < 0.005) return '1/4 Liter';
    if (Math.abs(val - 0.75) < 0.005) return '3/4 Liter';
    if (Math.abs(val - 0.2) < 0.005) return '1/5 Liter';
    if (Math.abs(val - 0.4) < 0.005) return '2/5 Liter';
    if (Math.abs(val - 0.6) < 0.005) return '3/5 Liter';
    if (Math.abs(val - 0.8) < 0.005) return '4/5 Liter';
    const hundredths = Math.round(val * 100);
    return `${hundredths}/100 Liter`;
  };

  const isExact = Math.abs(currentLiters - targetDecimal) < 0.01;

  const handleServe = () => {
    if (disabled || currentLiters <= 0) return;
    onServe({
      decimalValue: currentLiters,
      fractionEquivalent: getFractionText(currentLiters)
    });
  };

  // Cylinder SVG coordinate helpers
  // Height = 220px, bottom = 260, top = 40 (span = 220)
  const liquidHeight = Math.min(220, Math.max(0, currentLiters * 220));
  const liquidTopY = 260 - liquidHeight;

  // Render ticks (0.1, 0.2, ... 1.0)
  const ticks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Station Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-800 flex items-center justify-center font-bold">
            <GlassWater className="w-4 h-4 text-orange-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
              Dispenser Jus: {order.recipeName}
            </h3>
            <p className="text-xs text-amber-800/80">
              Isi tabung ukur hingga mencapai volume desimal yang diminta
            </p>
          </div>
        </div>

        {/* Current Volume Display */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 border border-orange-300 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-xs font-medium text-orange-800">Volume Terisi:</span>
            <span className="font-mono-numbers font-bold text-lg text-amber-950">
              {currentLiters.toFixed(2)} Liter
            </span>
          </div>

          {isExact && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tepat Sasaran! ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Graduated Measuring Cylinder SVG */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative p-4 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-inner flex flex-col items-center">
            {/* Dispenser Faucet Tap */}
            <div className="flex flex-col items-center mb-1">
              <div className="w-8 h-4 bg-amber-700 rounded-t-sm" />
              <div className="w-3 h-5 bg-amber-800" />
              {isPouring && (
                <div
                  className="w-1.5 h-6 animate-pulse"
                  style={{ backgroundColor: juiceColor1 }}
                />
              )}
            </div>

            {/* Cylinder SVG */}
            <svg viewBox="0 0 160 290" className="w-48 h-72 select-none">
              <defs>
                <linearGradient id="juiceGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={juiceColor1} />
                  <stop offset="100%" stopColor={juiceColor2} />
                </linearGradient>
                <clipPath id="cylinderClip">
                  <rect x="40" y="40" width="80" height="220" rx="8" />
                </clipPath>
              </defs>

              {/* Cylinder Outer Glass */}
              <rect
                x="38"
                y="38"
                width="84"
                height="224"
                rx="10"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="3"
                opacity="0.9"
              />

              {/* Liquid Body (Clipped inside glass) */}
              <g clipPath="url(#cylinderClip)">
                <rect
                  x="40"
                  y={liquidTopY}
                  width="80"
                  height={liquidHeight}
                  fill="url(#juiceGrad)"
                  className="transition-all duration-150"
                />

                {/* Liquid meniscus curve on top */}
                {currentLiters > 0 && (
                  <ellipse
                    cx="80"
                    cy={liquidTopY}
                    rx="40"
                    ry="6"
                    fill={juiceColor1}
                    className="transition-all duration-150 brightness-110"
                  />
                )}

                {/* Bubbles if pouring */}
                {isPouring && (
                  <g opacity="0.6">
                    <circle cx="65" cy={liquidTopY + 20} r="3" fill="#FFFFFF" />
                    <circle cx="95" cy={liquidTopY + 40} r="2.5" fill="#FFFFFF" />
                    <circle cx="75" cy={liquidTopY + 70} r="3.5" fill="#FFFFFF" />
                  </g>
                )}
              </g>

              {/* Graduation Ticks & Labels */}
              {ticks.map(val => {
                const tickY = 260 - val * 220;
                const isMajor = val === 0.5 || val === 1.0;
                return (
                  <g key={val}>
                    <line
                      x1="105"
                      y1={tickY}
                      x2={isMajor ? "124" : "118"}
                      stroke="#475569"
                      strokeWidth={isMajor ? "2" : "1.2"}
                    />
                    <text
                      x="130"
                      y={tickY + 3.5}
                      fontSize={isMajor ? "10" : "8"}
                      fontWeight={isMajor ? "bold" : "normal"}
                      fill="#334155"
                      className="font-mono-numbers select-none"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Target Line Marker (visual guide) */}
              <line
                x1="36"
                y1={260 - targetDecimal * 220}
                x2="124"
                y2={260 - targetDecimal * 220}
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text
                x="20"
                y={260 - targetDecimal * 220 + 3}
                fontSize="8"
                fontWeight="bold"
                fill="#DC2626"
                textAnchor="end"
              >
                Target
              </text>

              {/* Cylinder Base Stand */}
              <rect x="25" y="262" width="110" height="12" rx="4" fill="#64748B" />
            </svg>
          </div>
        </div>

        {/* Right: Controls Deck */}
        <div className="md:col-span-6 flex flex-col gap-4">
          {/* Pour Tap Button (Hold or Click) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Kran Dispenser (Tuang Otomatis):
            </label>
            <button
              type="button"
              onMouseDown={startPouring}
              onMouseUp={stopPouring}
              onMouseLeave={stopPouring}
              onTouchStart={startPouring}
              onTouchEnd={stopPouring}
              disabled={disabled || currentLiters >= 1.0}
              className={`w-full py-4 px-4 rounded-xl font-heading font-bold text-base flex items-center justify-center gap-2 border shadow-xs transition-all select-none ${
                isPouring
                  ? 'bg-amber-600 text-white border-amber-700 scale-98'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
              }`}
            >
              <Droplets className="w-5 h-5 text-amber-800" />
              <span>{isPouring ? 'Sedang Menuang...' : 'Tahan / Klik untuk Tuang Sari Buah'}</span>
            </button>
            <span className="text-[11px] text-amber-700/80 italic text-center">
              *Tahan tombol di atas, atau gunakan tombol presisi di bawah
            </span>
          </div>

          {/* Micro Adjustment Buttons */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Tombol Takaran Presisi:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => addAmount(0.1)}
                disabled={disabled || currentLiters >= 1.0}
                className="py-2 px-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg text-xs font-bold font-mono-numbers flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span>+0.1 L</span>
              </button>
              <button
                type="button"
                onClick={() => addAmount(0.05)}
                disabled={disabled || currentLiters >= 1.0}
                className="py-2 px-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg text-xs font-bold font-mono-numbers flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span>+0.05 L</span>
              </button>
              <button
                type="button"
                onClick={() => addAmount(-0.05)}
                disabled={disabled || currentLiters <= 0}
                className="py-2 px-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg text-xs font-bold font-mono-numbers flex items-center justify-center gap-1 transition-colors"
              >
                <Minus className="w-3 h-3 text-amber-600" />
                <span>-0.05 L</span>
              </button>
              <button
                type="button"
                onClick={handleEmpty}
                disabled={disabled || currentLiters === 0}
                className="py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Kosongkan</span>
              </button>
            </div>
          </div>

          {/* Math Conversion Insight */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Angka Desimal:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {currentLiters.toFixed(2)} Liter
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Pecahan Senilai:</span>
              <span className="font-mono-numbers font-bold text-amber-950">
                {getFractionText(currentLiters)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-amber-700">Target Pesanan:</span>
              <span className="font-bold text-amber-950 font-mono-numbers">
                {targetDecimal} Liter
                {order.targetFraction && ` (${order.targetFraction.numerator}/${order.targetFraction.denominator} L)`}
              </span>
            </div>
          </div>

          {/* Serve CTA */}
          <button
            type="button"
            onClick={handleServe}
            disabled={disabled || currentLiters <= 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sajikan {currentLiters.toFixed(2)} Liter ke Meja Pembeli</span>
          </button>
        </div>
      </div>
    </div>
  );
};
