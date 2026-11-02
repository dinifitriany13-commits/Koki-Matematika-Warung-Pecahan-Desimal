import React, { useState } from 'react';
import {
  LevelDefinition,
  OrderTicket,
  TeacherConfig,
  TimerMode,
  ProblemType,
  StationType,
  SessionHistoryItem
} from '../types/game';
import { CHARACTERS } from '../data/characters';
import { sound } from '../services/audio';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Download,
  Upload,
  Settings,
  FileSpreadsheet,
  Check,
  AlertCircle,
  X,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: TeacherConfig;
  onUpdateConfig: (newConfig: TeacherConfig) => void;
  allLevels: LevelDefinition[];
  onSaveCustomLevels: (levels: LevelDefinition[]) => void;
  studentHistory: SessionHistoryItem[];
  onClearHistory: () => void;
}

export const TeacherPanelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  allLevels,
  onSaveCustomLevels,
  studentHistory,
  onClearHistory
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'levels' | 'settings' | 'reports' | 'data'>('levels');

  // New level creator state
  const [editingLevel, setEditingLevel] = useState<Partial<LevelDefinition> | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<OrderTicket[]>([]);

  // Export / Import message
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.pin || (config.pin === '' && pinInput === '1234')) {
      sound.playCorrect();
      setIsAuthenticated(true);
      setPinError('');
    } else {
      sound.playWrong();
      setPinError('PIN salah! Default PIN guru adalah 1234.');
    }
  };

  const handleTimerModeChange = (mode: TimerMode) => {
    sound.playClick();
    onUpdateConfig({ ...config, timerMode: mode });
  };

  const handleStartCreateLevel = () => {
    sound.playClick();
    const newId = `custom_lvl_${Date.now()}`;
    setEditingLevel({
      id: newId,
      title: 'Level Buatan Guru: ',
      subtitle: 'Tantangan Dibuat oleh Guru',
      gradeTarget: 'Kelas 5',
      problemType: 'pecahan',
      stationType: 'pizza',
      description: 'Latihan mandiri yang dirancang khusus oleh guru.',
      learningGoal: 'Meningkatkan pemahaman matematika melalui simulasi warung.',
      isCustom: true
    });

    // Provide default starting order
    setOrderDrafts([
      {
        id: `ord_${Date.now()}_1`,
        customer: CHARACTERS.budi,
        problemType: 'pecahan',
        stationType: 'pizza',
        recipeName: 'Martabak Manis Cokelat',
        recipeDescription: 'Resep kreasi khusus guru',
        targetFraction: { numerator: 2, denominator: 4 },
        orderPrompt: 'Tolong potongkan 2/4 loyang martabak!',
        explanationNote: '2/4 senilai dengan 1/2 loyang.',
        timeLimitSec: 50,
        rewardCoins: 70,
        rewardStars: 1
      }
    ]);
  };

  const handleAddOrderToDraft = () => {
    sound.playClick();
    const station = editingLevel?.stationType || 'pizza';
    const probType = editingLevel?.problemType || 'pecahan';

    const newOrder: OrderTicket = {
      id: `ord_${Date.now()}_${orderDrafts.length + 1}`,
      customer: CHARACTERS.siti,
      problemType: probType,
      stationType: station,
      recipeName: 'Menu Spesial Kelas',
      recipeDescription: 'Menu yang dibuat oleh guru',
      targetFraction: probType === 'pecahan' ? { numerator: 1, denominator: 3 } : undefined,
      targetDecimal: probType === 'desimal' ? 0.5 : undefined,
      targetPercent: probType === 'persen' ? { originalPrice: 20000, discountPercent: 20, finalPrice: 16000, gridCellsNeeded: 20 } : undefined,
      orderPrompt: 'Pesanan matematika dari guru!',
      explanationNote: 'Penjelasan konsep untuk siswa.',
      timeLimitSec: 50,
      rewardCoins: 75,
      rewardStars: 1
    };

    setOrderDrafts([...orderDrafts, newOrder]);
  };

  const handleSaveLevel = () => {
    if (!editingLevel || !editingLevel.title) return;
    sound.playCorrect();

    const fullLevel: LevelDefinition = {
      id: editingLevel.id || `custom_lvl_${Date.now()}`,
      title: editingLevel.title,
      subtitle: editingLevel.subtitle || 'Tantangan Khusus Guru',
      gradeTarget: editingLevel.gradeTarget || 'Kelas 5',
      problemType: editingLevel.problemType || 'pecahan',
      stationType: editingLevel.stationType || 'pizza',
      description: editingLevel.description || 'Latihan khusus.',
      learningGoal: editingLevel.learningGoal || 'Pemahaman konsep matematika.',
      orders: orderDrafts.length > 0 ? orderDrafts : (editingLevel.orders || []),
      isCustom: true
    };

    const existingCustoms = config.customLevels.filter(l => l.id !== fullLevel.id);
    const updatedCustoms = [...existingCustoms, fullLevel];

    onUpdateConfig({ ...config, customLevels: updatedCustoms });
    onSaveCustomLevels(updatedCustoms);
    setEditingLevel(null);
  };

  const handleDeleteCustomLevel = (lvlId: string) => {
    sound.playClick();
    const updated = config.customLevels.filter(l => l.id !== lvlId);
    onUpdateConfig({ ...config, customLevels: updated });
    onSaveCustomLevels(updated);
  };

  // Export JSON
  const handleExportJSON = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        customLevels: config.customLevels,
        timerMode: config.timerMode,
        exportedAt: new Date().toISOString(),
        game: 'Koki Matematika: Warung Pecahan & Desimal'
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `koki-matematika-levels-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.customLevels)) {
          sound.playCorrect();
          onUpdateConfig({ ...config, customLevels: parsed.customLevels });
          onSaveCustomLevels(parsed.customLevels);
          setImportStatus(`Berhasil mengimpor ${parsed.customLevels.length} level custom!`);
        } else {
          setImportStatus('Format file JSON tidak sesuai.');
        }
      } catch {
        setImportStatus('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-amber-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border border-amber-300 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-amber-100/70 border-b border-amber-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-amber-950 leading-tight">
                Panel Guru & Pengatur Level
              </h3>
              <p className="text-[11px] text-amber-800">
                SD Kelas 5-6 / Fase C Kurikulum Merdeka
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

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            /* PIN Gate Screen */
            <form onSubmit={handleLogin} className="max-w-sm mx-auto my-8 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-amber-950">
                  Masukkan PIN Guru
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Panel ini khusus guru untuk mengatur level dan melihat rekap capaian siswa.
                  <br />
                  <span className="font-semibold text-amber-900">(PIN Bawaan: 1234)</span>
                </p>
              </div>

              <div className="w-full">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN Guru..."
                  autoFocus
                  className="w-full text-center text-xl font-mono-numbers tracking-widest py-2.5 px-4 bg-amber-50 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs"
              >
                Buka Panel Guru
              </button>
            </form>
          ) : (
            /* Authenticated Teacher Workspace */
            <div className="flex flex-col gap-5">
              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-amber-200 pb-2">
                <button
                  onClick={() => { setActiveTab('levels'); setEditingLevel(null); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'levels'
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Kelola Level ({allLevels.length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Pengaturan Waktu & PIN
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'reports'
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Rekap Belajar Siswa ({studentHistory.length})
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'data'
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Ekspor / Impor JSON
                </button>
              </div>

              {/* Tab 1: Level Management & Creator */}
              {activeTab === 'levels' && !editingLevel && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-amber-950">
                        Daftar Level Pembelajaran
                      </h4>
                      <p className="text-xs text-amber-800">
                        Level standar kurikulum dan level custom yang dibuat guru.
                      </p>
                    </div>
                    <button
                      onClick={handleStartCreateLevel}
                      className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Level Baru</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {allLevels.map((lvl) => (
                      <div
                        key={lvl.id}
                        className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-amber-950">
                              {lvl.title}
                            </span>
                            <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded">
                              {lvl.gradeTarget}
                            </span>
                            {lvl.isCustom && (
                              <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
                                Level Guru
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-900/80 mt-0.5">
                            {lvl.subtitle} · {lvl.orders.length} Pesanan
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {lvl.isCustom && (
                            <button
                              onClick={() => handleDeleteCustomLevel(lvl.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Level Custom"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editing / Creating Level Form */}
              {activeTab === 'levels' && editingLevel && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <h4 className="font-heading font-bold text-sm text-amber-950">
                      Editor Level Custom Guru
                    </h4>
                    <button
                      onClick={() => setEditingLevel(null)}
                      className="text-xs text-amber-700 hover:underline"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Judul Level:
                      </label>
                      <input
                        type="text"
                        value={editingLevel.title || ''}
                        onChange={(e) => setEditingLevel({ ...editingLevel, title: e.target.value })}
                        className="w-full text-xs py-2 px-3 bg-white border border-amber-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                        placeholder="Contoh: Level Latihan Pecahan Senilai Kelas 5B"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Target Kelas / Fase:
                      </label>
                      <select
                        value={editingLevel.gradeTarget || 'Kelas 5'}
                        onChange={(e) => setEditingLevel({ ...editingLevel, gradeTarget: e.target.value as 'Kelas 5' | 'Kelas 6' | 'Fase C Umum' })}
                        className="w-full text-xs py-2 px-3 bg-white border border-amber-300 rounded-lg"
                      >
                        <option value="Kelas 5">Kelas 5 (Fase C)</option>
                        <option value="Kelas 6">Kelas 6 (Fase C)</option>
                        <option value="Fase C Umum">Fase C Umum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Tipe Masalah:
                      </label>
                      <select
                        value={editingLevel.problemType || 'pecahan'}
                        onChange={(e) => {
                          const pType = e.target.value as ProblemType;
                          const sType: StationType = pType === 'pecahan' ? 'pizza' : pType === 'desimal' ? 'jus' : 'diskon';
                          setEditingLevel({ ...editingLevel, problemType: pType, stationType: sType });
                        }}
                        className="w-full text-xs py-2 px-3 bg-white border border-amber-300 rounded-lg"
                      >
                        <option value="pecahan">Pecahan (Pizza / Martabak)</option>
                        <option value="desimal">Desimal (Jus / Gelas Ukur)</option>
                        <option value="persen">Persen (Diskon & Petak 100)</option>
                        <option value="campuran">Campuran (Konversi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Pilihan Warung & Stasiun Masak:
                      </label>
                      <select
                        value={editingLevel.stationType || 'sate'}
                        onChange={(e) => setEditingLevel({ ...editingLevel, stationType: e.target.value as StationType })}
                        className="w-full text-xs py-2 px-3 bg-white border border-amber-300 rounded-lg"
                      >
                        <option value="sate">🍢 Panggangan Sate Madura (Pecahan Kumpulan)</option>
                        <option value="timbangan">⚖️ Timbangan Kelontong (Desimal Kg)</option>
                        <option value="bakso">🍜 Bakso & Mie Ayam (Pecahan Campuran)</option>
                        <option value="pizza">🍕 Dapur Martabak Manis (Pecahan Loyang)</option>
                        <option value="jus">🍹 Kedai Jus Buah (Desimal Liter)</option>
                        <option value="diskon">🏷️ Kasir Diskon & Petak 100 (Persen)</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders inside Draft */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-900 uppercase">
                        Daftar Pesanan Soal ({orderDrafts.length}):
                      </span>
                      <button
                        type="button"
                        onClick={handleAddOrderToDraft}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Soal</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {orderDrafts.map((ord, idx) => (
                        <div key={ord.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-950">Soal #{idx + 1}: {ord.recipeName}</span>
                            <button
                              onClick={() => setOrderDrafts(orderDrafts.filter((_, i) => i !== idx))}
                              className="text-rose-600 hover:text-rose-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={ord.orderPrompt}
                            onChange={(e) => {
                              const next = [...orderDrafts];
                              next[idx].orderPrompt = e.target.value;
                              setOrderDrafts(next);
                            }}
                            className="w-full py-1.5 px-2 bg-white border border-amber-200 rounded text-xs"
                            placeholder="Kalimat pesanan pelanggan..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => setEditingLevel(null)}
                      className="py-2 px-4 text-xs font-bold text-amber-800 bg-white border border-amber-300 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLevel}
                      className="py-2 px-5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                    >
                      Simpan Level Baru
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Settings (Timer & PIN) */}
              {activeTab === 'settings' && (
                <div className="flex flex-col gap-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 uppercase tracking-wide mb-1.5">
                      Kecepatan Timer & Mode Inklusif:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleTimerModeChange('normal')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          config.timerMode === 'normal'
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                      >
                        <span className="font-bold text-xs block">Normal</span>
                        <span className="text-[11px] opacity-80">Waktu standar 45-60s</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTimerModeChange('relaxed')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          config.timerMode === 'relaxed'
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                      >
                        <span className="font-bold text-xs block">Santai (1.5x)</span>
                        <span className="text-[11px] opacity-80">Waktu lebih panjang</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTimerModeChange('untimed')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          config.timerMode === 'untimed'
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                      >
                        <span className="font-bold text-xs block">Tanpa Timer</span>
                        <span className="text-[11px] opacity-80">Inklusif / Tenang</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-200">
                    <label className="block text-xs font-bold text-amber-950 uppercase tracking-wide mb-1.5">
                      Ubah PIN Akses Guru:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={config.pin}
                      onChange={(e) => onUpdateConfig({ ...config, pin: e.target.value })}
                      placeholder="PIN Baru..."
                      className="w-40 py-2 px-3 text-xs font-mono-numbers bg-white border border-amber-300 rounded-xl"
                    />
                    <p className="text-[11px] text-amber-700 mt-1">
                      Catat PIN ini baik-baik. Bawaan sistem adalah 1234.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Rekap Belajar Siswa */}
              {activeTab === 'reports' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-amber-950">
                        Rekap Nilai & Diagnostik Siswa
                      </h4>
                      <p className="text-xs text-amber-800">
                        Catatan sesi permainan, tingkat akurasi, dan waktu pengerjaan.
                      </p>
                    </div>
                    {studentHistory.length > 0 && (
                      <button
                        onClick={onClearHistory}
                        className="py-1 px-2.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg"
                      >
                        Reset Riwayat
                      </button>
                    )}
                  </div>

                  {studentHistory.length === 0 ? (
                    <div className="text-center py-8 text-amber-800/70 text-xs">
                      Belum ada riwayat permainan siswa pada perangkat ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-amber-200 rounded-xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-amber-100/60 text-amber-950 font-bold border-b border-amber-200">
                          <tr>
                            <th className="py-2.5 px-3">Waktu</th>
                            <th className="py-2.5 px-3">Level</th>
                            <th className="py-2.5 px-3">Akurasi</th>
                            <th className="py-2.5 px-3">Benar / Total</th>
                            <th className="py-2.5 px-3">Skor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100 font-mono-numbers">
                          {studentHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-amber-50/50">
                              <td className="py-2 px-3 text-amber-800">
                                {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="py-2 px-3 font-sans font-medium text-amber-950">
                                {item.levelTitle}
                              </td>
                              <td className="py-2 px-3 font-bold text-emerald-700">
                                {item.accuracy}%
                              </td>
                              <td className="py-2 px-3">
                                {item.correctOrders} / {item.totalOrders}
                              </td>
                              <td className="py-2 px-3 text-amber-900 font-bold">
                                {item.score}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Export & Import JSON */}
              {activeTab === 'data' && (
                <div className="flex flex-col gap-4 max-w-lg">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-amber-950 mb-1">
                      Cadangkan / Bagikan Level Custom
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed mb-3">
                      Guru dapat mengekspor seluruh level yang sudah dibuat ke dalam berkas JSON untuk dibagikan ke kelas lain atau disimpan ke Google Drive / Komputer.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas JSON</span>
                    </button>

                    <label className="py-2 px-4 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-amber-700" />
                      <span>Impor Berkas JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {importStatus && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      {importStatus}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
