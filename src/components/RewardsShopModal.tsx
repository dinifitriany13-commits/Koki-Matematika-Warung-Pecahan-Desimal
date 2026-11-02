import React from 'react';
import { PlayerStats, ShopItem } from '../types/game';
import { SHOP_ITEMS } from '../data/defaultLevels';
import { sound } from '../services/audio';
import { ShoppingBag, X, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (category: 'apron' | 'hat', itemId: string) => void;
}

export const RewardsShopModal: React.FC<Props> = ({
  isOpen,
  onClose,
  stats,
  onBuyItem,
  onEquipItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-amber-300 shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="bg-amber-100/70 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
                Toko Perlengkapan Warung Koki
              </h3>
              <p className="text-[11px] text-amber-800">
                Gunakan Koin Warung dari hasil melayani pesanan untuk membuka aksesori keren!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-amber-300 px-3 py-1 rounded-xl text-xs font-bold font-mono-numbers text-amber-950 flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-[9px] text-amber-900">Rp</span>
              <span>{stats.coins} Koin</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHOP_ITEMS.map((item) => {
            const isUnlocked = stats.unlockedItemIds.includes(item.id);
            const isEquipped =
              (item.category === 'apron' && stats.activeApron === item.id) ||
              (item.category === 'hat' && stats.activeHat === item.id);
            const canAfford = stats.coins >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-heading font-bold text-sm text-amber-950">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                      {item.category === 'apron' ? 'Celemek' : item.category === 'hat' ? 'Topi Koki' : item.category === 'decor' ? 'Dekorasi' : 'Resep'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono-numbers text-amber-950">
                    {item.cost} Koin
                  </span>

                  {isUnlocked ? (
                    item.category === 'apron' || item.category === 'hat' ? (
                      <button
                        type="button"
                        onClick={() => onEquipItem(item.category, item.id)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                          isEquipped
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isEquipped && <Check className="w-3.5 h-3.5" />}
                        <span>{isEquipped ? 'Dipakai' : 'Pasang'}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Terbuka</span>
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBuyItem(item)}
                      disabled={!canAfford}
                      className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Beli</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
