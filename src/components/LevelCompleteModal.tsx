import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelDefinition } from '../types/game';
import { sound } from '../services/audio';
import { Award, Sparkles, Key, CheckCircle, ArrowRight, RotateCcw, Home } from 'lucide-react';

interface Props {
  isOpen: boolean;
  level: LevelDefinition;
  totalScore: number;
  correctCount: number;
  totalOrders: number;
  earnedCoins: number;
  earnedStars: number;
  hasEarnedKey: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMenu: () => void;
  hasNextLevel: boolean;
}

export const LevelCompleteModal: React.FC<Props> = ({
  isOpen,
  level,
  totalScore,
  correctCount,
  totalOrders,
  earnedCoins,
  earnedStars,
  hasEarnedKey,
  onNextLevel,
  onReplay,
  onBackToMenu,
  hasNextLevel
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playFanfare();
      // Burst confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const accuracy = totalOrders > 0 ? Math.round((correctCount / totalOrders) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-center">
        {/* Badge & Crown */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg mb-3">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-amber-950">
            Level Selesai!
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 font-medium mt-0.5">
            {level.title} · {level.gradeTarget}
          </p>
        </div>

        {/* Score & Accuracy Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 font-mono-numbers">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-amber-700 font-sans font-medium">Akurasi</span>
            <span className="font-bold text-lg sm:text-xl text-amber-950">{accuracy}%</span>
          </div>
          <div className="flex flex-col items-center border-x border-amber-200">
            <span className="text-[11px] text-amber-700 font-sans font-medium">Pesanan Benar</span>
            <span className="font-bold text-lg sm:text-xl text-emerald-700">
              {correctCount} / {totalOrders}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-amber-700 font-sans font-medium">Total Skor</span>
            <span className="font-bold text-lg sm:text-xl text-amber-950">{totalScore}</span>
          </div>
        </div>

        {/* Rewards Earned Card */}
        <div className="bg-amber-100/50 border border-amber-300/80 rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Hadiah Diperoleh:
          </span>
          <div className="flex items-center justify-center gap-5 text-sm font-bold font-mono-numbers text-amber-950">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-[10px] text-amber-900">Rp</span>
              <span>+{earnedCoins} Koin</span>
            </span>
            <span className="text-amber-300">·</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>+{earnedStars} Bintang</span>
            </span>
            {hasEarnedKey && (
              <>
                <span className="text-amber-300">·</span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <Key className="w-4 h-4" />
                  <span>+1 Kunci Emas</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Learning Goal Check */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Capaian Pembelajaran Tercapai:</span>
            <p className="text-emerald-800 leading-snug mt-0.5">
              {level.learningGoal}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onBackToMenu}
            className="w-full sm:w-auto py-2.5 px-4 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Pilih Level</span>
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="w-full sm:w-auto py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi</span>
          </button>

          {hasNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-heading font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Lanjut ke Level Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
