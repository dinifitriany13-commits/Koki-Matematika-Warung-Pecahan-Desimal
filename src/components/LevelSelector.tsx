import React, { useState } from 'react';
import { LevelDefinition, PlayerStats, ProblemType } from '../types/game';
import { Sparkles, Play, Award, Infinity, Shield, ChevronRight, Filter } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  levels: LevelDefinition[];
  playerStats: PlayerStats;
  onSelectLevel: (level: LevelDefinition) => void;
  onStartInfiniteMode: () => void;
  onOpenTeacherModal: () => void;
}

export const LevelSelector: React.FC<Props> = ({
  levels,
  playerStats,
  onSelectLevel,
  onStartInfiniteMode,
  onOpenTeacherModal
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLevels = filterType === 'all'
    ? levels
    : levels.filter(lvl => lvl.problemType === filterType);

  const getStationBadge = (type: string) => {
    switch (type) {
      case 'sate':
        return { label: 'Warung Sate Madura', icon: '🍢', color: 'bg-orange-100 text-orange-900 border-orange-200' };
      case 'timbangan':
        return { label: 'Timbangan Kelontong', icon: '⚖️', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'bakso':
        return { label: 'Bakso & Mie Ayam', icon: '🍜', color: 'bg-red-100 text-red-900 border-red-200' };
      case 'jus':
        return { label: 'Kedai Jus Segar', icon: '🍹', color: 'bg-yellow-100 text-yellow-900 border-yellow-200' };
      case 'diskon':
        return { label: 'Kasir Diskon Promo', icon: '🏷️', color: 'bg-rose-100 text-rose-900 border-rose-200' };
      default:
        return { label: 'Dapur Martabak', icon: '🍕', color: 'bg-amber-100 text-amber-900 border-amber-200' };
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full px-2 sm:px-4 py-2">
      {/* Warung Welcome Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-5 sm:p-7 text-white shadow-md border-2 border-amber-400/40">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="inline-flex items-center gap-1.5 self-start bg-amber-950/40 backdrop-blur-xs text-amber-100 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Katalog Kuliner Warung Matematika · SD Fase C (Kelas 5-6)</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
            Pusat Jajanan & Warung Matematika
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed max-w-2xl">
            Buka berbagai warung kuliner Nusantara: dari <strong>Warung Sate Madura</strong>, <strong>Toko Kelontong Timbangan Kiloan</strong>, <strong>Warung Bakso Mangkuk</strong>, <strong>Dapur Martabak Manis</strong>, hingga <strong>Kasir Diskon</strong>!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onSelectLevel(levels[0]);
              }}
              className="py-2.5 px-5 bg-white hover:bg-amber-50 text-amber-950 font-heading font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-98 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-amber-900 text-amber-900" />
              <span>Mulai dari Level 1</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onStartInfiniteMode();
              }}
              className="py-2.5 px-4 bg-amber-950/40 hover:bg-amber-950/60 backdrop-blur-xs text-white border border-amber-300/40 font-heading font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-98 flex items-center gap-2"
            >
              <Infinity className="w-4 h-4 text-amber-200" />
              <span>Shift Bebas (Tanpa Batas)</span>
            </button>
          </div>
        </div>

        {/* Ambient background ornament */}
        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Filter Tabs & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-amber-950">
            Daftar Warung Kuliner ({filteredLevels.length} Level)
          </h2>
          <p className="text-xs text-amber-800">
            Pilih jenis warung dan materi yang ingin dipelajari:
          </p>
        </div>

        {/* Interactive Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-amber-100/70 border border-amber-200 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'Semua Warung' },
            { id: 'pecahan', label: 'Pecahan' },
            { id: 'desimal', label: 'Desimal' },
            { id: 'persen', label: 'Persen' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilterType(tab.id);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Levels Grid (Consistent unified cards on mobile and laptop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredLevels.map((lvl) => {
          const isCompleted = playerStats.completedLevels.includes(lvl.id);
          const badge = getStationBadge(lvl.stationType);

          return (
            <div
              key={lvl.id}
              onClick={() => {
                sound.playClick();
                onSelectLevel(lvl);
              }}
              className="group cursor-pointer bg-white hover:bg-amber-50/50 rounded-2xl border border-amber-200 hover:border-amber-400 p-4 shadow-2xs transition-all duration-150 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${badge.color}`}>
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">
                      <Award className="w-3 h-3 text-emerald-600" />
                      <span>Selesai ✓</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 font-mono-numbers">
                      {lvl.gradeTarget}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-base text-amber-950 group-hover:text-amber-800 transition-colors leading-tight">
                  {lvl.title}
                </h3>
                <p className="text-xs font-medium text-amber-700/90 mt-0.5 mb-1.5">
                  {lvl.subtitle}
                </p>
                <p className="text-xs text-amber-900/80 leading-relaxed line-clamp-2">
                  {lvl.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-amber-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-amber-700">
                  {lvl.orders.length} Pesanan Pelanggan
                </span>

                <div className="w-7 h-7 rounded-lg bg-amber-100 group-hover:bg-amber-600 text-amber-800 group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
