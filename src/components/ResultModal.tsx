import React from 'react';
import { OrderTicket } from '../types/game';
import { CustomerAvatar } from './CustomerAvatar';
import { Sparkles, XCircle, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isCorrect: boolean;
  order: OrderTicket;
  feedbackDetail: string;
  earnedCoins: number;
  earnedStars: number;
  onNext: () => void;
  onRetry: () => void;
}

export const ResultModal: React.FC<Props> = ({
  isOpen,
  isCorrect,
  order,
  feedbackDetail,
  earnedCoins,
  earnedStars,
  onNext,
  onRetry
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-amber-300 shadow-xl p-5 sm:p-6 flex flex-col gap-4 text-center">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${
              isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}
          >
            {isCorrect ? (
              <Sparkles className="w-8 h-8 fill-emerald-400" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>

          <h3 className="font-heading font-bold text-xl sm:text-2xl text-amber-950">
            {isCorrect ? 'Pesanan Sempurna!' : 'Takaran Belum Tepat'}
          </h3>
          <p className="text-xs text-amber-800/80">
            {isCorrect ? 'Pelanggan sangat puas dengan masakanmu!' : 'Jangan menyerah, coba periksa kembali hitungannya!'}
          </p>
        </div>

        {/* Customer Reaction Dialogue */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-center gap-3 text-left">
          <CustomerAvatar
            avatarKey={order.customer.avatarKey}
            size={56}
            mood={isCorrect ? 'happy' : 'disappointed'}
          />
          <div className="flex-1">
            <span className="font-heading font-bold text-xs text-amber-950 block">
              {order.customer.name}
            </span>
            <p className="text-xs text-amber-900 italic mt-0.5 leading-snug">
              "{isCorrect ? order.customer.dialogueHappy : order.customer.dialogueDisappointed}"
            </p>
          </div>
        </div>

        {/* Feedback & Educational Explanation */}
        <div className="bg-white border border-amber-200 rounded-xl p-3 text-left space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Penjelasan Konsep Koki Matematika:</span>
          </div>
          <p className="text-amber-900 leading-relaxed">
            {feedbackDetail}
          </p>
          {order.explanationNote && (
            <p className="text-amber-800/90 bg-amber-50 p-2 rounded-lg text-[11px] border border-amber-100">
              💡 {order.explanationNote}
            </p>
          )}
        </div>

        {/* Reward summary if correct */}
        {isCorrect && (
          <div className="flex items-center justify-center gap-4 bg-amber-100/60 border border-amber-200 py-2.5 px-4 rounded-xl text-xs font-bold font-mono-numbers text-amber-950">
            <span>+{earnedCoins} Koin Warung</span>
            <span className="text-amber-300">|</span>
            <span className="text-amber-800">+{earnedStars} Bintang Koki</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {!isCorrect && (
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className={`flex-1 py-2.5 px-4 text-white font-heading font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
            }`}
          >
            <span>{isCorrect ? 'Pesanan Berikutnya' : 'Lewati Pesanan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
