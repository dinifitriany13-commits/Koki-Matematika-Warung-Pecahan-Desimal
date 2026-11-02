import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, ShoppingBag, BookOpen, Sparkles, Key } from 'lucide-react';
import { sound } from '../services/audio';
import { PlayerStats } from '../types/game';

interface Props {
  stats: PlayerStats;
  currentView: 'game' | 'levels' | 'shop' | 'teacher' | 'help';
  onNavigate: (view: 'game' | 'levels' | 'shop' | 'teacher' | 'help') => void;
  onOpenTeacherModal: () => void;
  onOpenShopModal: () => void;
  onOpenHelpModal: () => void;
}

export const TopBar: React.FC<Props> = ({
  stats,
  currentView,
  onNavigate,
  onOpenTeacherModal,
  onOpenShopModal,
  onOpenHelpModal
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggleSound = () => {
    const nextState = !isMuted;
    sound.setMuted(nextState);
    setIsMuted(nextState);
    if (!nextState) {
      sound.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-amber-200/80 px-4 lg:px-8 py-3 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('levels')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-0.5"
            aria-label="Kembali ke Beranda Warung"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
              <span className="font-heading font-bold text-lg leading-none">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg md:text-xl text-amber-950 tracking-tight leading-none whitespace-nowrap">
                Koki Matematika
              </span>
              <span className="text-[11px] font-medium text-amber-700/80 leading-tight">
                Warung Pecahan & Desimal
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, unboxed links with subtle hover) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-900/80">
          <button
            onClick={() => onNavigate('levels')}
            className={`whitespace-nowrap transition-colors hover:text-amber-950 ${
              currentView === 'levels' || currentView === 'game'
                ? 'text-amber-950 font-bold border-b-2 border-amber-600 pb-0.5'
                : ''
            }`}
          >
            Daftar Level
          </button>
          <button
            onClick={onOpenShopModal}
            className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-amber-950"
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Toko Warung</span>
          </button>
          <button
            onClick={onOpenHelpModal}
            className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-amber-950"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Rumus & Bantuan</span>
          </button>
        </nav>

        {/* Zone 3: Stats, Audio Toggle, and Panel Guru CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Player currency & stars */}
          <div className="flex items-center gap-2 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-950 font-mono-numbers">
            <span className="flex items-center gap-1" title="Bintang Koki">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{stats.stars}</span>
            </span>
            <span className="text-amber-300" aria-hidden="true">|</span>
            <span className="flex items-center gap-1" title="Koin Warung">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-900">Rp</span>
              <span>{stats.coins}</span>
            </span>
            <span className="text-amber-300 hidden sm:inline" aria-hidden="true">|</span>
            <span className="hidden sm:flex items-center gap-1" title="Kunci Emas Master">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>{stats.keys}</span>
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl text-amber-800 hover:text-amber-950 hover:bg-amber-100/80 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
            title={isMuted ? 'Nyalakan Suara (Mute)' : 'Matikan Suara (Unmute)'}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-amber-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-800" />
            )}
          </button>

          {/* Panel Guru Button */}
          <button
            onClick={onOpenTeacherModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-200/80 hover:bg-amber-300 border border-amber-300 rounded-xl transition-all shadow-2xs active:scale-95 whitespace-nowrap"
            title="Panel Guru & Pengaturan Level (PIN: 1234)"
          >
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Panel Guru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
