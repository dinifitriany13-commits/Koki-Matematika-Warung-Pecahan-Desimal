/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LevelDefinition,
  OrderTicket,
  PlayerStats,
  TeacherConfig,
  ShopItem,
  TimerMode
} from './types/game';
import { DEFAULT_LEVELS } from './data/defaultLevels';
import { CHARACTERS } from './data/characters';
import { sound } from './services/audio';

import { WarungBackground } from './components/WarungBackground';
import { TopBar } from './components/TopBar';
import { LevelSelector } from './components/LevelSelector';
import { CustomerQueue } from './components/CustomerQueue';
import { PizzaStation } from './components/stations/PizzaStation';
import { JuiceStation } from './components/stations/JuiceStation';
import { DiscountStation } from './components/stations/DiscountStation';
import { SateStation } from './components/stations/SateStation';
import { TimbanganStation } from './components/stations/TimbanganStation';
import { BaksoStation } from './components/stations/BaksoStation';
import { ResultModal } from './components/ResultModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { TeacherPanelModal } from './components/TeacherPanelModal';
import { RewardsShopModal } from './components/RewardsShopModal';
import { HelpMathModal } from './components/HelpMathModal';

const STATS_KEY = 'warung_math_player_stats_v2';
const TEACHER_KEY = 'warung_math_teacher_config_v2';

export default function App() {
  // --- Persistent Player Stats ---
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      stars: 0,
      coins: 100, // starting gift
      keys: 0,
      completedLevels: [],
      activeApron: '',
      activeHat: '',
      unlockedItemIds: [],
      history: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(playerStats));
    } catch {}
  }, [playerStats]);

  // --- Persistent Teacher Config ---
  const [teacherConfig, setTeacherConfig] = useState<TeacherConfig>(() => {
    try {
      const saved = localStorage.getItem(TEACHER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      pin: '1234',
      timerMode: 'normal',
      allowHints: true,
      customLevels: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEACHER_KEY, JSON.stringify(teacherConfig));
    } catch {}
  }, [teacherConfig]);

  // All levels combine defaults with custom teacher levels
  const allLevels = useMemo(() => {
    return [...DEFAULT_LEVELS, ...teacherConfig.customLevels];
  }, [teacherConfig.customLevels]);

  // Navigation & Modals
  const [currentView, setCurrentView] = useState<'levels' | 'game'>('levels');
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Active Game State
  const [currentLevel, setCurrentLevel] = useState<LevelDefinition | null>(null);
  const [isInfiniteMode, setIsInfiniteMode] = useState<boolean>(false);
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [activeOrders, setActiveOrders] = useState<OrderTicket[]>([]);

  // Timers
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [maxTime, setMaxTime] = useState<number>(45);
  const timerRef = useRef<number | null>(null);

  // Level Session Tracking
  const [levelScore, setLevelScore] = useState<number>(0);
  const [correctOrdersCount, setCorrectOrdersCount] = useState<number>(0);
  const [totalEarnedCoins, setTotalEarnedCoins] = useState<number>(0);
  const [totalEarnedStars, setTotalEarnedStars] = useState<number>(0);
  const [levelStartTime, setLevelStartTime] = useState<number>(0);

  // Modals for Feedback
  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    order: OrderTicket | null;
    feedbackDetail: string;
    earnedCoins: number;
    earnedStars: number;
  }>({
    isOpen: false,
    isCorrect: false,
    order: null,
    feedbackDetail: '',
    earnedCoins: 0,
    earnedStars: 0
  });

  const [levelCompleteState, setLevelCompleteState] = useState<{
    isOpen: boolean;
    hasEarnedKey: boolean;
  }>({
    isOpen: false,
    hasEarnedKey: false
  });

  // Current active order
  const currentOrder: OrderTicket | null = activeOrders[orderIndex] || null;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (currentView !== 'game' || !currentOrder || resultModalState.isOpen || levelCompleteState.isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (teacherConfig.timerMode === 'untimed') {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentView, currentOrder?.id, resultModalState.isOpen, levelCompleteState.isOpen, teacherConfig.timerMode]);

  // Handle timeout
  const handleTimeOut = () => {
    if (!currentOrder) return;
    sound.playWrong();
    setResultModalState({
      isOpen: true,
      isCorrect: false,
      order: currentOrder,
      feedbackDetail: 'Waktu habis! Pelanggan harus segera beraktivitas, namun jangan berkecil hati. Coba periksa pesanan dan selesaikan lebih cepat.',
      earnedCoins: 0,
      earnedStars: 0
    });
  };

  // Start a specific level
  const handleStartLevel = (level: LevelDefinition) => {
    sound.playBell();
    setCurrentLevel(level);
    setIsInfiniteMode(false);
    setActiveOrders(level.orders);
    setOrderIndex(0);
    setLevelScore(0);
    setCorrectOrdersCount(0);
    setTotalEarnedCoins(0);
    setTotalEarnedStars(0);
    setLevelStartTime(Date.now());

    // Setup timer
    const baseTime = level.orders[0]?.timeLimitSec || 50;
    const effectiveTime = teacherConfig.timerMode === 'relaxed' ? Math.round(baseTime * 1.5) : baseTime;
    setMaxTime(effectiveTime);
    setTimeLeft(effectiveTime);

    setCurrentView('game');
  };

  // Start Infinite Mode (Shift Bebas Warung Buka)
  const handleStartInfiniteMode = () => {
    sound.playBell();
    setIsInfiniteMode(true);
    const infiniteLevel: LevelDefinition = {
      id: 'infinite_shift',
      title: 'Shift Bebas: Warung Buka Terus',
      subtitle: 'Latihan Tak Terbatas Aneka Resep Warung Nusantara',
      gradeTarget: 'Fase C Umum',
      problemType: 'campuran',
      stationType: 'sate',
      description: 'Pesanan datang silih berganti dari 6 warung kuliner!',
      learningGoal: 'Refleks cepat menyelesaikan pecahan, desimal, dan persentase.',
      orders: [generateRandomOrder()]
    };

    setCurrentLevel(infiniteLevel);
    setActiveOrders(infiniteLevel.orders);
    setOrderIndex(0);
    setLevelScore(0);
    setCorrectOrdersCount(0);
    setTotalEarnedCoins(0);
    setTotalEarnedStars(0);
    setLevelStartTime(Date.now());

    const baseTime = 55;
    const effectiveTime = teacherConfig.timerMode === 'relaxed' ? 80 : baseTime;
    setMaxTime(effectiveTime);
    setTimeLeft(effectiveTime);

    setCurrentView('game');
  };

  // Procedural order generator across all 6 warung stations
  function generateRandomOrder(): OrderTicket {
    const charactersList = Object.values(CHARACTERS);
    const char = charactersList[Math.floor(Math.random() * charactersList.length)];
    const stations: ('pizza' | 'jus' | 'diskon' | 'sate' | 'timbangan' | 'bakso')[] = [
      'sate', 'timbangan', 'bakso', 'pizza', 'jus', 'diskon'
    ];
    const chosenStation = stations[Math.floor(Math.random() * stations.length)];

    if (chosenStation === 'sate') {
      const fractions = [
        { n: 1, d: 2, name: '1/2' },
        { n: 3, d: 5, name: '3/5' },
        { n: 2, d: 5, name: '2/5' },
        { n: 4, d: 5, name: '4/5' },
        { n: 3, d: 4, name: '3/4' }
      ];
      const frac = fractions[Math.floor(Math.random() * fractions.length)];
      return {
        id: `inf_sate_${Date.now()}_${Math.random()}`,
        customer: char,
        problemType: 'pecahan',
        stationType: 'sate',
        recipeName: 'Sate Ayam Madura Istimewa',
        recipeDescription: 'Sate bumbu kacang gurih pesanan shift bebas.',
        targetFraction: { numerator: frac.n, denominator: frac.d },
        orderPrompt: `Tolong ambilkan ${frac.name} bagian tusuk sate di panggangan ke piring saya ya!`,
        explanationNote: `${frac.name} porsi berarti mengambil ${frac.n} bagian dari total ${frac.d} bagian kelompok sate.`,
        timeLimitSec: 50,
        rewardCoins: 75,
        rewardStars: 1
      };
    } else if (chosenStation === 'timbangan') {
      const weights = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5];
      const w = weights[Math.floor(Math.random() * weights.length)];
      return {
        id: `inf_timb_${Date.now()}_${Math.random()}`,
        customer: char,
        problemType: 'desimal',
        stationType: 'timbangan',
        recipeName: 'Beras & Telur Segar',
        recipeDescription: 'Bahan pokok warung kelontong.',
        targetDecimal: w,
        orderPrompt: `Koki, tolong timbang tepat ${w} kg pada timbangan kelontong ya!`,
        explanationNote: `${w} kg setara dengan ${Math.round(w * 100)}/100 kg.`,
        timeLimitSec: 50,
        rewardCoins: 80,
        rewardStars: 1
      };
    } else if (chosenStation === 'bakso') {
      const portions = [1.25, 1.5, 1.75, 2.0, 2.5];
      const p = portions[Math.floor(Math.random() * portions.length)];
      return {
        id: `inf_bakso_${Date.now()}_${Math.random()}`,
        customer: char,
        problemType: 'pecahan',
        stationType: 'bakso',
        recipeName: 'Bakso Komplit Kuah Kaldu',
        recipeDescription: 'Porsi pecahan campuran mangkuk ayam jago.',
        targetDecimal: p,
        orderPrompt: `Saya mau pesan ${p} porsi mangkuk Bakso Komplit untuk dibungkus!`,
        explanationNote: `${p} porsi adalah bentuk pecahan campuran dari mangkuk utuh dan pecahan mangkuk.`,
        timeLimitSec: 50,
        rewardCoins: 85,
        rewardStars: 1
      };
    } else if (chosenStation === 'pizza') {
      const fractions = [
        { n: 1, d: 2, name: '1/2' },
        { n: 1, d: 4, name: '1/4' },
        { n: 3, d: 4, name: '3/4' },
        { n: 2, d: 3, name: '2/3' }
      ];
      const frac = fractions[Math.floor(Math.random() * fractions.length)];
      return {
        id: `inf_ord_${Date.now()}_${Math.random()}`,
        customer: char,
        problemType: 'pecahan',
        stationType: 'pizza',
        recipeName: 'Martabak Manis Spesial',
        recipeDescription: 'Resep martabak legit aneka topping.',
        targetFraction: { numerator: frac.n, denominator: frac.d },
        orderPrompt: `Halo Koki! Saya pesan ${frac.name} loyang Martabak Manis ya.`,
        explanationNote: `${frac.name} loyang berarti membagi loyang ke ${frac.d} bagian dan mengambil ${frac.n} bagian.`,
        timeLimitSec: 50,
        rewardCoins: 75,
        rewardStars: 1
      };
    } else if (chosenStation === 'jus') {
      const decimals = [0.25, 0.4, 0.5, 0.6, 0.75];
      const dec = decimals[Math.floor(Math.random() * decimals.length)];
      return {
        id: `inf_ord_${Date.now()}_${Math.random()}`,
        customer: char,
        problemType: 'desimal',
        stationType: 'jus',
        recipeName: 'Jus Buah Segar',
        recipeDescription: 'Minuman dingin segar kaya vitamin.',
        targetDecimal: dec,
        orderPrompt: `Koki, tolong tuangkan ${dec} Liter Jus Buah ke tabung ukur ya!`,
        explanationNote: `${dec} Liter setara dengan pecahan ${Math.round(dec * 100)}/100 Liter.`,
        timeLimitSec: 50,
        rewardCoins: 75,
        rewardStars: 1
      };
    } else {
      const discounts = [
        { price: 20000, disc: 25, final: 15000 },
        { price: 40000, disc: 50, final: 20000 },
        { price: 30000, disc: 10, final: 27000 }
      ];
      const d = discounts[Math.floor(Math.random() * discounts.length)];
      return {
        id: `inf_ord_${Date.now()}_${Math.random()}`,
        customer: char,
        problemType: 'persen',
        stationType: 'diskon',
        recipeName: 'Kue Lapis Spesial',
        recipeDescription: 'Kue lezat dengan promo diskon.',
        targetPercent: {
          originalPrice: d.price,
          discountPercent: d.disc,
          finalPrice: d.final,
          gridCellsNeeded: d.disc
        },
        orderPrompt: `Saya beli Kue Lapis Rp ${d.price.toLocaleString('id-ID')} diskon ${d.disc}%. Berapa bayarnya?`,
        explanationNote: `Diskon ${d.disc}% dari Rp ${d.price.toLocaleString('id-ID')} menghemat Rp ${(d.price * (d.disc / 100)).toLocaleString('id-ID')}. Bayar = Rp ${d.final.toLocaleString('id-ID')}.`,
        timeLimitSec: 55,
        rewardCoins: 85,
        rewardStars: 1
      };
    }
  }

  // Verification & Evaluation Engine
  const handleServeFractionStation = (userValue: { numerator: number; denominator: number; decimalValue: number }) => {
    if (!currentOrder) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let isCorrect = false;
    let feedback = '';

    if (currentOrder.targetFraction) {
      const targetDec = currentOrder.targetFraction.numerator / currentOrder.targetFraction.denominator;
      isCorrect = Math.abs(userValue.decimalValue - targetDec) < 0.005;

      if (isCorrect) {
        if (
          userValue.numerator === currentOrder.targetFraction.numerator &&
          userValue.denominator === currentOrder.targetFraction.denominator
        ) {
          feedback = `Tepat sekali! Kamu menyajikan persis ${userValue.numerator}/${userValue.denominator} porsi sesuai pesanan pembeli!`;
        } else {
          feedback = `Luar biasa! Konsep Pecahan Senilai berhasil kamu terapkan! ${userValue.numerator}/${userValue.denominator} senilai dengan ${currentOrder.targetFraction.numerator}/${currentOrder.targetFraction.denominator} karena nilainya sama-sama ${(targetDec).toFixed(2)}.`;
        }
      } else {
        feedback = `Belum tepat. Kamu menyajikan ${userValue.numerator}/${userValue.denominator} (${userValue.decimalValue.toFixed(2)}), sedangkan pembeli meminta ${currentOrder.targetFraction.numerator}/${currentOrder.targetFraction.denominator} (${targetDec.toFixed(2)}).`;
      }
    } else if (currentOrder.targetDecimal !== undefined) {
      isCorrect = Math.abs(userValue.decimalValue - currentOrder.targetDecimal) < 0.005;
      if (isCorrect) {
        feedback = `Hebat! Kamu berhasil menyajikan bentuk pecahan ${userValue.numerator}/${userValue.denominator} senilai dengan desimal ${currentOrder.targetDecimal}!`;
      } else {
        feedback = `Belum tepat. ${userValue.numerator}/${userValue.denominator} bernilai ${userValue.decimalValue.toFixed(2)}, padahal pesanan meminta ${currentOrder.targetDecimal}.`;
      }
    }

    finalizeEvaluation(isCorrect, feedback);
  };

  const handleServeDecimalStation = (userValue: { decimalValue: number; fractionEquivalent?: string }) => {
    if (!currentOrder) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const target = currentOrder.targetDecimal !== undefined
      ? currentOrder.targetDecimal
      : (currentOrder.targetFraction ? currentOrder.targetFraction.numerator / currentOrder.targetFraction.denominator : 0.5);

    // Tolerance of 0.02
    const isCorrect = Math.abs(userValue.decimalValue - target) <= 0.02;
    let feedback = '';

    if (isCorrect) {
      feedback = `Takaran sangat presisi! Kamu menyajikan ${userValue.decimalValue.toFixed(2)}, pas sesuai permintaan pembeli (${target}).`;
    } else {
      const diff = userValue.decimalValue - target;
      if (diff > 0) {
        feedback = `Takaran kelebihan ${diff.toFixed(2)}. Kamu menyajikan ${userValue.decimalValue.toFixed(2)}, sedangkan pembeli meminta ${target}.`;
      } else {
        feedback = `Takaran kurang ${Math.abs(diff).toFixed(2)}. Kamu menyajikan ${userValue.decimalValue.toFixed(2)}, sedangkan pembeli meminta ${target}.`;
      }
    }

    finalizeEvaluation(isCorrect, feedback);
  };

  const handleServeDiscount = (userValue: { enteredFinalPrice?: number; gridPercent?: number }) => {
    if (!currentOrder) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const target = currentOrder.targetPercent || {
      originalPrice: 20000,
      discountPercent: 25,
      finalPrice: 15000,
      gridCellsNeeded: 25
    };

    let isCorrect = false;
    let feedback = '';

    if (userValue.enteredFinalPrice !== undefined) {
      isCorrect = userValue.enteredFinalPrice === target.finalPrice;
      if (isCorrect) {
        feedback = `Hitungan kasirmu sempurna! Diskon ${target.discountPercent}% dari Rp ${target.originalPrice.toLocaleString('id-ID')} menghemat Rp ${(target.originalPrice - target.finalPrice).toLocaleString('id-ID')}. Total bayar adalah Rp ${target.finalPrice.toLocaleString('id-ID')}.`;
      } else {
        feedback = `Hitungan harga belum pas. Kamu memilih Rp ${userValue.enteredFinalPrice.toLocaleString('id-ID')}, padahal setelah diskon ${target.discountPercent}% dari Rp ${target.originalPrice.toLocaleString('id-ID')}, yang harus dibayar adalah Rp ${target.finalPrice.toLocaleString('id-ID')}.`;
      }
    } else if (userValue.gridPercent !== undefined) {
      isCorrect = userValue.gridPercent === target.discountPercent;
      if (isCorrect) {
        feedback = `Visualisasi petak perseratus tepat sekali! Mengarsir ${userValue.gridPercent} kotak dari 100 kotak berarti mewakili ${target.discountPercent}% (${(target.discountPercent / 100).toFixed(2)}).`;
      } else {
        feedback = `Belum tepat. Kamu mengarsir ${userValue.gridPercent} kotak, padahal untuk diskon ${target.discountPercent}% dibutuhkan tepat ${target.discountPercent} kotak dari 100 kotak.`;
      }
    }

    finalizeEvaluation(isCorrect, feedback);
  };

  const finalizeEvaluation = (isCorrect: boolean, feedback: string) => {
    if (!currentOrder) return;

    if (isCorrect) {
      sound.playCorrect();
      const bonusSpeed = Math.floor(timeLeft / 5);
      const earnedCoins = currentOrder.rewardCoins + bonusSpeed;
      const earnedStars = currentOrder.rewardStars;

      setLevelScore(prev => prev + 100 + bonusSpeed * 5);
      setCorrectOrdersCount(prev => prev + 10);
      setTotalEarnedCoins(prev => prev + earnedCoins);
      setTotalEarnedStars(prev => prev + earnedStars);

      // Update player profile
      setPlayerStats(prev => ({
        ...prev,
        coins: prev.coins + earnedCoins,
        stars: prev.stars + earnedStars
      }));

      setResultModalState({
        isOpen: true,
        isCorrect: true,
        order: currentOrder,
        feedbackDetail: feedback,
        earnedCoins,
        earnedStars
      });
    } else {
      sound.playWrong();
      setResultModalState({
        isOpen: true,
        isCorrect: false,
        order: currentOrder,
        feedbackDetail: feedback,
        earnedCoins: 0,
        earnedStars: 0
      });
    }
  };

  // Next order or Level Complete
  const handleNextOrder = () => {
    setResultModalState(prev => ({ ...prev, isOpen: false }));

    if (isInfiniteMode) {
      const nextOrder = generateRandomOrder();
      setActiveOrders([nextOrder]);
      setOrderIndex(0);
      const baseTime = 55;
      const effectiveTime = teacherConfig.timerMode === 'relaxed' ? 80 : baseTime;
      setMaxTime(effectiveTime);
      setTimeLeft(effectiveTime);
      sound.playBell();
      return;
    }

    const nextIndex = orderIndex + 1;
    if (nextIndex < activeOrders.length) {
      setOrderIndex(nextIndex);
      const baseTime = activeOrders[nextIndex].timeLimitSec;
      const effectiveTime = teacherConfig.timerMode === 'relaxed' ? Math.round(baseTime * 1.5) : baseTime;
      setMaxTime(effectiveTime);
      setTimeLeft(effectiveTime);
      sound.playBell();
    } else {
      handleLevelFinished();
    }
  };

  // Level Finished
  const handleLevelFinished = () => {
    if (!currentLevel) return;

    const accuracy = activeOrders.length > 0 ? Math.round((correctOrdersCount / (activeOrders.length * 10)) * 100) : 100;
    const hasKey = accuracy >= 70;

    // Record session history
    const historyEntry = {
      id: `session_${Date.now()}`,
      timestamp: Date.now(),
      levelTitle: currentLevel.title,
      gradeTarget: currentLevel.gradeTarget,
      score: levelScore,
      totalOrders: activeOrders.length,
      correctOrders: Math.round(correctOrdersCount / 10),
      accuracy,
      timeSpentSec: Math.round((Date.now() - levelStartTime) / 1000),
      notes: []
    };

    setPlayerStats(prev => {
      const completed = prev.completedLevels.includes(currentLevel.id)
        ? prev.completedLevels
        : [...prev.completedLevels, currentLevel.id];

      return {
        ...prev,
        keys: hasKey ? prev.keys + 1 : prev.keys,
        completedLevels: completed,
        history: [historyEntry, ...prev.history.slice(0, 49)]
      };
    });

    setLevelCompleteState({
      isOpen: true,
      hasEarnedKey: hasKey
    });
  };

  // Retry current order
  const handleRetryOrder = () => {
    setResultModalState(prev => ({ ...prev, isOpen: false }));
    if (!currentOrder) return;
    const baseTime = currentOrder.timeLimitSec;
    const effectiveTime = teacherConfig.timerMode === 'relaxed' ? Math.round(baseTime * 1.5) : baseTime;
    setMaxTime(effectiveTime);
    setTimeLeft(effectiveTime);
  };

  // Shop purchase
  const handleBuyShopItem = (item: ShopItem) => {
    if (playerStats.coins < item.cost) return;
    sound.playCorrect();
    setPlayerStats(prev => ({
      ...prev,
      coins: prev.coins - item.cost,
      unlockedItemIds: [...prev.unlockedItemIds, item.id],
      activeApron: item.category === 'apron' ? item.id : prev.activeApron,
      activeHat: item.category === 'hat' ? item.id : prev.activeHat
    }));
  };

  // Equip shop item
  const handleEquipItem = (category: 'apron' | 'hat', itemId: string) => {
    sound.playClick();
    setPlayerStats(prev => ({
      ...prev,
      activeApron: category === 'apron' ? itemId : prev.activeApron,
      activeHat: category === 'hat' ? itemId : prev.activeHat
    }));
  };

  // Next level navigation from complete modal
  const handleNextLevelFromModal = () => {
    setLevelCompleteState({ isOpen: false, hasEarnedKey: false });
    if (!currentLevel) return;

    const currentIndex = allLevels.findIndex(l => l.id === currentLevel.id);
    if (currentIndex >= 0 && currentIndex + 1 < allLevels.length) {
      handleStartLevel(allLevels[currentIndex + 1]);
    } else {
      setCurrentView('levels');
    }
  };

  return (
    <WarungBackground>
      {/* Top Bar Navigation */}
      <TopBar
        stats={playerStats}
        currentView={currentView}
        onNavigate={(view) => {
          sound.playClick();
          if (view === 'levels') {
            setCurrentView('levels');
          }
        }}
        onOpenTeacherModal={() => {
          sound.playClick();
          setIsTeacherModalOpen(true);
        }}
        onOpenShopModal={() => {
          sound.playClick();
          setIsShopModalOpen(true);
        }}
        onOpenHelpModal={() => {
          sound.playClick();
          setIsHelpModalOpen(true);
        }}
      />

      {/* Main App Container - Unified layout on both HP and Laptop */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col justify-start">
        {currentView === 'levels' && (
          <LevelSelector
            levels={allLevels}
            playerStats={playerStats}
            onSelectLevel={handleStartLevel}
            onStartInfiniteMode={handleStartInfiniteMode}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
          />
        )}

        {currentView === 'game' && currentOrder && currentLevel && (
          <div className="flex flex-col gap-4 w-full">
            {/* Top Level Title Bar */}
            <div className="bg-white/90 backdrop-blur-xs border border-amber-200 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-base sm:text-lg text-amber-950">
                    {currentLevel.title}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    {currentLevel.gradeTarget}
                  </span>
                </div>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  {currentLevel.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentView('levels');
                }}
                className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Pilih Warung Lain
              </button>
            </div>

            {/* Customer Queue & Speech Bubble */}
            <CustomerQueue
              currentOrder={currentOrder}
              orderIndex={orderIndex}
              totalOrders={activeOrders.length}
              timeLeft={timeLeft}
              maxTime={maxTime}
              timerMode={teacherConfig.timerMode}
              upcomingOrders={activeOrders.slice(orderIndex + 1)}
              lastResultMood={resultModalState.isOpen ? (resultModalState.isCorrect ? 'happy' : 'disappointed') : 'normal'}
            />

            {/* Interactive Cooking Prep Stations (6 Warung Options) */}
            {currentOrder.stationType === 'sate' && (
              <SateStation
                key={currentOrder.id}
                order={currentOrder}
                onServe={handleServeFractionStation}
                disabled={resultModalState.isOpen || levelCompleteState.isOpen}
              />
            )}

            {currentOrder.stationType === 'timbangan' && (
              <TimbanganStation
                key={currentOrder.id}
                order={currentOrder}
                onServe={handleServeDecimalStation}
                disabled={resultModalState.isOpen || levelCompleteState.isOpen}
              />
            )}

            {currentOrder.stationType === 'bakso' && (
              <BaksoStation
                key={currentOrder.id}
                order={currentOrder}
                onServe={handleServeDecimalStation}
                disabled={resultModalState.isOpen || levelCompleteState.isOpen}
              />
            )}

            {currentOrder.stationType === 'pizza' && (
              <PizzaStation
                key={currentOrder.id}
                order={currentOrder}
                onServe={handleServeFractionStation}
                disabled={resultModalState.isOpen || levelCompleteState.isOpen}
              />
            )}

            {currentOrder.stationType === 'jus' && (
              <JuiceStation
                key={currentOrder.id}
                order={currentOrder}
                onServe={handleServeDecimalStation}
                disabled={resultModalState.isOpen || levelCompleteState.isOpen}
              />
            )}

            {currentOrder.stationType === 'diskon' && (
              <DiscountStation
                key={currentOrder.id}
                order={currentOrder}
                onServe={handleServeDiscount}
                disabled={resultModalState.isOpen || levelCompleteState.isOpen}
              />
            )}
          </div>
        )}
      </main>

      {/* Result Feedback Modal */}
      {currentOrder && (
        <ResultModal
          isOpen={resultModalState.isOpen}
          isCorrect={resultModalState.isCorrect}
          order={currentOrder}
          feedbackDetail={resultModalState.feedbackDetail}
          earnedCoins={resultModalState.earnedCoins}
          earnedStars={resultModalState.earnedStars}
          onNext={handleNextOrder}
          onRetry={handleRetryOrder}
        />
      )}

      {/* Level Complete Celebration Modal */}
      {currentLevel && (
        <LevelCompleteModal
          isOpen={levelCompleteState.isOpen}
          level={currentLevel}
          totalScore={levelScore}
          correctCount={Math.round(correctOrdersCount / 10)}
          totalOrders={activeOrders.length}
          earnedCoins={totalEarnedCoins}
          earnedStars={totalEarnedStars}
          hasEarnedKey={levelCompleteState.hasEarnedKey}
          onNextLevel={handleNextLevelFromModal}
          onReplay={() => handleStartLevel(currentLevel)}
          onBackToMenu={() => {
            setLevelCompleteState({ isOpen: false, hasEarnedKey: false });
            setCurrentView('levels');
          }}
          hasNextLevel={
            allLevels.findIndex(l => l.id === currentLevel.id) + 1 < allLevels.length
          }
        />
      )}

      {/* Teacher Panel Modal (PIN 1234) */}
      <TeacherPanelModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        config={teacherConfig}
        onUpdateConfig={setTeacherConfig}
        allLevels={allLevels}
        onSaveCustomLevels={(customs) => {
          setTeacherConfig(prev => ({ ...prev, customLevels: customs }));
        }}
        studentHistory={playerStats.history}
        onClearHistory={() => {
          setPlayerStats(prev => ({ ...prev, history: [] }));
        }}
      />

      {/* Rewards Shop Modal */}
      <RewardsShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        stats={playerStats}
        onBuyItem={handleBuyShopItem}
        onEquipItem={handleEquipItem}
      />

      {/* Math Help / Cheat Sheet Modal */}
      <HelpMathModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </WarungBackground>
  );
}
