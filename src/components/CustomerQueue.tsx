import React from 'react';
import { OrderTicket, TimerMode } from '../types/game';
import { CustomerAvatar } from './CustomerAvatar';
import { Clock, MessageCircle, AlertCircle } from 'lucide-react';

interface Props {
  currentOrder: OrderTicket;
  orderIndex: number;
  totalOrders: number;
  timeLeft: number;
  maxTime: number;
  timerMode: TimerMode;
  upcomingOrders: OrderTicket[];
  lastResultMood?: 'normal' | 'happy' | 'disappointed';
}

export const CustomerQueue: React.FC<Props> = ({
  currentOrder,
  orderIndex,
  totalOrders,
  timeLeft,
  maxTime,
  timerMode,
  upcomingOrders,
  lastResultMood = 'normal'
}) => {
  const percentageTime = maxTime > 0 ? Math.max(0, Math.min(100, (timeLeft / maxTime) * 100)) : 100;

  let timeBarColor = 'bg-emerald-500';
  if (percentageTime < 25) {
    timeBarColor = 'bg-rose-500 animate-pulse';
  } else if (percentageTime < 50) {
    timeBarColor = 'bg-amber-500';
  }

  return (
    <div className="bg-[#FFFBF5] rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      {/* Top row: Order progress and queue preview */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Pesanan Meja:
          </span>
          <span className="font-mono-numbers font-bold text-xs bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300">
            {orderIndex + 1} / {totalOrders}
          </span>
        </div>

        {/* Mini Upcoming Queue */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-amber-800/80 mr-1 hidden sm:inline">
            Antrean Berikutnya:
          </span>
          {upcomingOrders.length > 0 ? (
            upcomingOrders.slice(0, 3).map((ord, i) => (
              <div key={ord.id + i} title={ord.customer.name} className="opacity-80 hover:opacity-100 transition-opacity">
                <CustomerAvatar avatarKey={ord.customer.avatarKey} size={28} />
              </div>
            ))
          ) : (
            <span className="text-[11px] text-amber-700 font-medium">Pelanggan Terakhir!</span>
          )}
        </div>
      </div>

      {/* Main active customer block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Customer Avatar */}
        <div className="shrink-0 flex items-center gap-3">
          <CustomerAvatar
            avatarKey={currentOrder.customer.avatarKey}
            size={72}
            mood={lastResultMood}
            className="ring-2 ring-amber-300 ring-offset-2"
          />
          <div className="sm:hidden">
            <h4 className="font-heading font-bold text-sm text-amber-950 leading-tight">
              {currentOrder.customer.name}
            </h4>
            <p className="text-[11px] text-amber-700">{currentOrder.customer.role}</p>
          </div>
        </div>

        {/* Speech Bubble & Order Prompt */}
        <div className="flex-1 relative bg-white border border-amber-200 rounded-2xl p-4 shadow-xs">
          {/* Triangle bubble arrow for desktop */}
          <div className="hidden sm:block absolute -left-2 top-6 w-3 h-3 bg-white border-b border-l border-amber-200 rotate-45" />

          <div className="hidden sm:block mb-1">
            <span className="font-heading font-bold text-sm text-amber-950">
              {currentOrder.customer.name}
            </span>
            <span className="text-xs text-amber-700 ml-2">({currentOrder.customer.role})</span>
          </div>

          {/* Dialogue text */}
          <div className="flex items-start gap-2 text-amber-900 text-xs sm:text-sm font-medium leading-relaxed">
            <MessageCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="italic">
              "{currentOrder.orderPrompt}"
            </p>
          </div>

          {/* Order target badge highlight */}
          <div className="mt-3 pt-2.5 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-amber-800 font-semibold">Menu:</span>
              <span className="font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {currentOrder.recipeName}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono-numbers text-xs">
              <span className="text-amber-800 font-medium">Imbalan:</span>
              <span className="font-bold text-amber-950">+{currentOrder.rewardCoins} Koin</span>
              <span className="text-amber-300">·</span>
              <span className="font-bold text-amber-700">+{currentOrder.rewardStars} Bintang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Patience / Timer Bar */}
      {timerMode !== 'untimed' ? (
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center justify-between text-xs text-amber-900 font-mono-numbers">
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-800">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Kesabaran Pelanggan:</span>
            </span>
            <span className="font-bold">{timeLeft} detik</span>
          </div>
          <div className="w-full h-2.5 bg-amber-200/80 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-linear ${timeBarColor}`}
              style={{ width: `${percentageTime}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mode Santai Inklusif Aktif (Tanpa Batas Waktu) - Pikirkan dengan tenang!</span>
        </div>
      )}
    </div>
  );
};
