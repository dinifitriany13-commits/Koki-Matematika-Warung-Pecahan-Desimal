import React from 'react';
import { BookOpen, X, Sparkles, PieChart, Layers, Percent } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpMathModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-amber-300 shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="bg-amber-100/70 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
                Buku Resep & Rumus Koki Cilik
              </h3>
              <p className="text-[11px] text-amber-800">
                Panduan Fase C: Pecahan, Desimal, dan Persentase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-amber-950">
          {/* Card 1: Pecahan Biasa & Senilai */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-amber-950">
              <PieChart className="w-4 h-4 text-amber-700" />
              <span>1. Mengenal Pecahan Biasa & Pecahan Senilai</span>
            </div>
            <p className="leading-relaxed text-amber-900">
              Pecahan dinyatakan sebagai <strong className="font-mono-numbers">a / b</strong>.
              <br />
              • <strong>Pembilang (a)</strong>: Jumlah potongan yang diambil atau disajikan.
              <br />
              • <strong>Penyebut (b)</strong>: Total semua potongan yang membagi 1 loyang utuh sama besar.
            </p>
            <div className="bg-white border border-amber-200 rounded-xl p-3 font-mono-numbers text-xs">
              <span className="font-sans font-bold text-amber-950 block mb-1">Tabel Pecahan Senilai Populer:</span>
              <div className="grid grid-cols-2 gap-2 text-amber-900">
                <div>• 1/2 = 2/4 = 3/6 = 4/8 = 5/10</div>
                <div>• 1/4 = 2/8 = 3/12 = 25/100</div>
                <div>• 3/4 = 6/8 = 9/12 = 75/100</div>
                <div>• 2/3 = 4/6 = 6/9 = 8/12</div>
              </div>
            </div>
          </div>

          {/* Card 2: Hubungan Pecahan ke Desimal */}
          <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-orange-950">
              <Layers className="w-4 h-4 text-orange-700" />
              <span>2. Hubungan Pecahan dengan Desimal</span>
            </div>
            <p className="leading-relaxed text-orange-950">
              Untuk mengubah pecahan ke desimal, ubah penyebutnya menjadi 10, 100, atau bagi pembilang dengan penyebut:
            </p>
            <div className="bg-white border border-orange-200 rounded-xl p-3 font-mono-numbers text-xs space-y-1">
              <div>• 1/2 = 5/10 = <strong>0.5 Liter</strong></div>
              <div>• 1/4 = 25/100 = <strong>0.25 Liter</strong></div>
              <div>• 3/4 = 75/100 = <strong>0.75 Liter</strong></div>
              <div>• 1/5 = 2/10 = <strong>0.2 Liter</strong> | 2/5 = <strong>0.4 Liter</strong> | 3/5 = <strong>0.6 Liter</strong> | 4/5 = <strong>0.8 Liter</strong></div>
            </div>
          </div>

          {/* Card 3: Persentase & Diskon */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-rose-950">
              <Percent className="w-4 h-4 text-rose-700" />
              <span>3. Menghitung Persentase Diskon Toko</span>
            </div>
            <p className="leading-relaxed text-rose-950">
              Persen artinya <em>per seratus</em>.
            </p>
            <div className="bg-white border border-rose-200 rounded-xl p-3 text-xs space-y-2">
              <p>
                <strong>Rumus Diskon:</strong>
                <br />
                Jumlah Diskon = (Persen Diskon ÷ 100) × Harga Normal
              </p>
              <p>
                <strong>Harga Bayar Kasir:</strong>
                <br />
                Harga Bayar = Harga Normal - Jumlah Diskon
              </p>
              <div className="p-2 bg-rose-50 rounded-lg text-[11px] text-rose-900 font-mono-numbers">
                Contoh: Kue Rp 20.000 diskon 25%
                <br />
                Diskon = 25/100 × 20.000 = Rp 5.000
                <br />
                Bayar = Rp 20.000 - Rp 5.000 = <strong>Rp 15.000</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
