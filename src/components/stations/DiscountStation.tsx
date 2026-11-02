import React, { useState, useEffect } from 'react';
import { OrderTicket } from '../../types/game';
import { sound } from '../../services/audio';
import { Percent, Receipt, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';

interface Props {
  order: OrderTicket;
  onServe: (userValue: { enteredFinalPrice?: number; gridPercent?: number }) => void;
  disabled?: boolean;
}

export const DiscountStation: React.FC<Props> = ({ order, onServe, disabled = false }) => {
  const targetPercent = order.targetPercent || {
    originalPrice: 20000,
    discountPercent: 25,
    finalPrice: 15000,
    gridCellsNeeded: 25
  };

  // State for Price Calculation
  const [selectedFinalPrice, setSelectedFinalPrice] = useState<number | null>(null);

  // State for 10x10 Grid (Hundredths Petak Perseratus)
  const [gridCells, setGridCells] = useState<boolean[]>(new Array(100).fill(false));
  const [activeTab, setActiveTab] = useState<'kalkulator' | 'petak100'>('kalkulator');

  useEffect(() => {
    setSelectedFinalPrice(null);
    setGridCells(new Array(100).fill(false));
  }, [order.id]);

  const filledCount = gridCells.filter(Boolean).length;

  // Generate 4 multiple-choice price options (one correct, 3 plausible distractors)
  const correctPrice = targetPercent.finalPrice;
  const discountAmount = targetPercent.originalPrice * (targetPercent.discountPercent / 100);

  const priceOptions = [
    correctPrice,
    targetPercent.originalPrice - (discountAmount / 2),
    discountAmount, // distractor: only the discount amount
    targetPercent.originalPrice + discountAmount // distractor: added instead of subtracted
  ].sort(() => 0.5 - Math.random());

  const handlePriceSelect = (price: number) => {
    if (disabled) return;
    sound.playClick();
    setSelectedFinalPrice(price);
  };

  const handleToggleCell = (idx: number) => {
    if (disabled) return;
    sound.playClick();
    setGridCells(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleFillRows = (percent: number) => {
    if (disabled) return;
    sound.playClick();
    const count = Math.min(100, Math.max(0, percent));
    const next = new Array(100).fill(false);
    for (let i = 0; i < count; i++) {
      next[i] = true;
    }
    setGridCells(next);
  };

  const handleClearGrid = () => {
    if (disabled) return;
    sound.playClick();
    setGridCells(new Array(100).fill(false));
  };

  const handleServe = () => {
    if (disabled) return;
    if (activeTab === 'kalkulator') {
      if (selectedFinalPrice === null) return;
      onServe({ enteredFinalPrice: selectedFinalPrice });
    } else {
      if (filledCount === 0) return;
      onServe({ gridPercent: filledCount });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Station Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-800 flex items-center justify-center font-bold">
            <Percent className="w-4 h-4 text-rose-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
              Kasir Diskon: {order.recipeName}
            </h3>
            <p className="text-xs text-amber-800/80">
              Hitung potongan harga promo atau visualisasikan persentase pada petak 100
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-amber-100/70 rounded-xl border border-amber-200">
          <button
            type="button"
            onClick={() => setActiveTab('kalkulator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'kalkulator'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            Kasir Hitung Harga
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('petak100')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'petak100'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            Petak Perseratus (10x10)
          </button>
        </div>
      </div>

      {/* Mode 1: Kasir Hitung Harga */}
      {activeTab === 'kalkulator' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Struk Belanja Warung */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-sm bg-amber-50/50 border border-amber-200 rounded-2xl p-5 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-amber-700" />
                  <span className="font-heading font-bold text-sm text-amber-950">
                    Struk Belanja Warung
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 border border-rose-200 px-2 py-0.5 rounded-md">
                  DISKON {targetPercent.discountPercent}%
                </span>
              </div>

              <div className="space-y-2 text-xs text-amber-900 font-mono-numbers">
                <div className="flex justify-between">
                  <span>Nama Menu:</span>
                  <span className="font-bold font-sans text-amber-950">{order.recipeName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga Awal:</span>
                  <span className="font-bold">
                    Rp {targetPercent.originalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Potongan Promo:</span>
                  <span className="font-bold">
                    - {targetPercent.discountPercent}% (Hemat Rp {discountAmount.toLocaleString('id-ID')})
                  </span>
                </div>
                <div className="border-t border-dashed border-amber-300 pt-2 flex justify-between text-sm font-bold text-amber-950">
                  <span>Harga Akhir (Bayar):</span>
                  <span className="text-emerald-700">
                    {selectedFinalPrice !== null
                      ? `Rp ${selectedFinalPrice.toLocaleString('id-ID')}`
                      : '...?'}
                  </span>
                </div>
              </div>

              {/* Formula Step Callout */}
              <div className="mt-4 bg-white/90 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                <div className="flex items-center gap-1 font-bold text-amber-950 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cara Menghitung:</span>
                </div>
                <p>
                  1. Diskon = ({targetPercent.discountPercent}/100) × Rp {targetPercent.originalPrice.toLocaleString('id-ID')} = Rp {discountAmount.toLocaleString('id-ID')}
                </p>
                <p>
                  2. Bayar = Rp {targetPercent.originalPrice.toLocaleString('id-ID')} - Rp {discountAmount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Price Options Picker */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
                Pilih Total Harga yang Harus Dibayar:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {priceOptions.map((price, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePriceSelect(price)}
                    disabled={disabled}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedFinalPrice === price
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        : 'bg-amber-50/70 hover:bg-amber-100/90 text-amber-950 border-amber-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold opacity-75 block">Pilihan {String.fromCharCode(65 + idx)}</span>
                    <span className="font-mono-numbers font-bold text-base">
                      Rp {price.toLocaleString('id-ID')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Serve CTA */}
            <button
              type="button"
              onClick={handleServe}
              disabled={disabled || selectedFinalPrice === null}
              className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {selectedFinalPrice !== null
                  ? `Kirim Tagihan Rp ${selectedFinalPrice.toLocaleString('id-ID')} ke Kasir`
                  : 'Pilih Jumlah Bayar di Atas'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Petak Perseratus (10x10 Hundred-Grid) */}
      {activeTab === 'petak100' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* 10x10 Grid Canvas */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="grid grid-cols-10 gap-1 w-64 h-64 sm:w-72 sm:h-72">
                {gridCells.map((isActive, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleCell(idx)}
                    disabled={disabled}
                    aria-label={`Petak ke-${idx + 1}`}
                    className={`rounded-xs transition-colors duration-100 ${
                      isActive
                        ? 'bg-amber-600 border border-amber-700 shadow-2xs'
                        : 'bg-white hover:bg-amber-100 border border-amber-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-amber-700/80 italic text-center">
              *Klik petak untuk mengarsir persentase (1 petak = 1% = 0.01)
            </p>
          </div>

          {/* Right: Grid Controls */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Petak Terarsir:</span>
                <span className="font-mono-numbers font-bold text-amber-950">
                  {filledCount} dari 100 kotak
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Bentuk Persen:</span>
                <span className="font-mono-numbers font-bold text-rose-700 text-sm">
                  {filledCount}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Bentuk Desimal:</span>
                <span className="font-mono-numbers font-bold text-amber-950">
                  {(filledCount / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick Fill Helpers */}
            <div>
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1.5">
                Bantu Arsir Cepat:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[10, 25, 50, 75, targetPercent.discountPercent].map((val, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFillRows(val)}
                    disabled={disabled}
                    className="py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold font-mono-numbers transition-colors"
                  >
                    {val}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearGrid}
                  disabled={disabled || filledCount === 0}
                  className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Serve CTA */}
            <button
              type="button"
              onClick={handleServe}
              disabled={disabled || filledCount === 0}
              className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-40 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sajikan Petak {filledCount}%</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
