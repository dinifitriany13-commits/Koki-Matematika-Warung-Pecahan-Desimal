import { LevelDefinition, OrderTicket } from '../types/game';
import { CHARACTERS } from './characters';

export const DEFAULT_LEVELS: LevelDefinition[] = [
  {
    id: 'lvl_1_pecahan_dasar',
    title: 'Level 1: Dapur Martabak Manis',
    subtitle: 'Mengenal Pecahan Biasa (Pembilang & Penyebut)',
    gradeTarget: 'Kelas 5',
    problemType: 'pecahan',
    stationType: 'pizza',
    description: 'Pahami konsep bagian dari kesatuan. Potong loyang martabak dan pilih jumlah potongan yang tepat sesuai pesanan pembeli.',
    learningGoal: 'Peserta didik dapat memahami pecahan sebagai bagian dari keseluruhan (pembilang & penyebut) melalui model konkret loyang.',
    orders: [
      {
        id: 'ord_1_1',
        customer: CHARACTERS.budi,
        problemType: 'pecahan',
        stationType: 'pizza',
        recipeName: 'Martabak Cokelat Keju',
        recipeDescription: 'Martabak manis legit dengan taburan meses dan parutan keju gurih.',
        targetFraction: { numerator: 1, denominator: 2 },
        orderPrompt: 'Halo Koki! Saya pesan 1/2 loyang Martabak Cokelat Keju untuk dimakan berdua adik.',
        explanationNote: '1/2 loyang berarti 1 bagian dari 2 potongan utuh (atau kelipatannya seperti 2/4, 3/6, 4/8).',
        timeLimitSec: 45,
        rewardCoins: 50,
        rewardStars: 1
      },
      {
        id: 'ord_1_2',
        customer: CHARACTERS.siti,
        problemType: 'pecahan',
        stationType: 'pizza',
        recipeName: 'Martabak Spesial Jagung Manis',
        recipeDescription: 'Martabak manis bertabur butiran jagung manis dan susu kental.',
        targetFraction: { numerator: 3, denominator: 4 },
        orderPrompt: 'Tolong potongkan 3/4 loyang Martabak Manis ya, jangan sampai salah potong!',
        explanationNote: '3/4 loyang berarti membagi loyang menjadi 4 bagian lalu mengambil 3 bagian (atau 6 dari 8 potong).',
        timeLimitSec: 50,
        rewardCoins: 65,
        rewardStars: 1
      },
      {
        id: 'ord_1_3',
        customer: CHARACTERS.pak_joko,
        problemType: 'pecahan',
        stationType: 'pizza',
        recipeName: 'Bolu Pandan Panggang',
        recipeDescription: 'Bolu pandan wangi aromatik dengan taburan almond renyah.',
        targetFraction: { numerator: 2, denominator: 5 },
        orderPrompt: 'Selamat siang! Bapak ingin memesan 2/5 loyang Bolu Pandan untuk tamu rapat guru.',
        explanationNote: '2/5 loyang berarti memotong loyang menjadi 5 bagian sama besar dan mengambil 2 bagian.',
        timeLimitSec: 55,
        rewardCoins: 75,
        rewardStars: 1
      }
    ]
  },
  {
    id: 'lvl_2_sate_madura',
    title: 'Level 2: Panggangan Sate Madura',
    subtitle: 'Pecahan Kumpulan Benda (Objek Diskrit)',
    gradeTarget: 'Kelas 5',
    problemType: 'pecahan',
    stationType: 'sate',
    description: 'Sajikan tusuk sate ayam harum bumbu kacang ke piring daun pisang sesuai pecahan kumpulan benda.',
    learningGoal: 'Peserta didik memahami pecahan dari sekumpulan benda (misal: 6 dari 10 tusuk sate senilai dengan 3/5 bagian).',
    orders: [
      {
        id: 'ord_2_1',
        customer: CHARACTERS.budi,
        problemType: 'pecahan',
        stationType: 'sate',
        recipeName: 'Sate Ayam Bumbu Kacang',
        recipeDescription: 'Daging ayam empuk disiram saus kacang gurih dan kecap manis.',
        targetFraction: { numerator: 3, denominator: 5 },
        orderPrompt: 'Bang Koki! Tolong siapkan 3/5 bagian dari tusuk sate di panggangan ke piring saya ya!',
        explanationNote: 'Jika panggangan berisi 10 tusuk, maka 3/5 bagian adalah (3/5) × 10 = 6 tusuk sate.',
        timeLimitSec: 50,
        rewardCoins: 70,
        rewardStars: 1
      },
      {
        id: 'ord_2_2',
        customer: CHARACTERS.rina,
        problemType: 'pecahan',
        stationType: 'sate',
        recipeName: 'Sate Kambing Muda',
        recipeDescription: 'Sate bumbu kecap pedas manis favorit regu pramuka.',
        targetFraction: { numerator: 1, denominator: 2 },
        orderPrompt: 'Salam Pramuka! Kami pesan 1/2 porsi dari total tusuk sate di panggangan.',
        explanationNote: '1/2 porsi berarti mengambil setengah dari total tusuk sate (misal 5 dari 10 tusuk, atau 4 dari 8 tusuk).',
        timeLimitSec: 45,
        rewardCoins: 75,
        rewardStars: 1
      },
      {
        id: 'ord_2_3',
        customer: CHARACTERS.mochi_cat,
        problemType: 'pecahan',
        stationType: 'sate',
        recipeName: 'Sate Lilit Ikan Tuna',
        recipeDescription: 'Sate lilit wangi serai kesukaan Mochi!',
        targetFraction: { numerator: 4, denominator: 10 },
        orderPrompt: 'Meow! Mochi mau pesan 4/10 tusuk sate ikan ya!',
        explanationNote: '4/10 sama dengan 4 tusuk dari 10 tusuk (atau senilai dengan 2/5 porsi).',
        timeLimitSec: 45,
        rewardCoins: 80,
        rewardStars: 1
      }
    ]
  },
  {
    id: 'lvl_3_timbangan_kelontong',
    title: 'Level 3: Timbangan Warung Kelontong',
    subtitle: 'Mengenal Bilangan Desimal Satuan Berat (Kilogram & Ons)',
    gradeTarget: 'Kelas 5',
    problemType: 'desimal',
    stationType: 'timbangan',
    description: 'Bantu warung menimbang telur, beras, dan gula pasir menggunakan anak timbangan analog.',
    learningGoal: 'Peserta didik dapat merepresentasikan dan membaca bilangan desimal dalam konteks penimbangan berat (kg).',
    orders: [
      {
        id: 'ord_3_1',
        customer: CHARACTERS.bu_rt,
        problemType: 'desimal',
        stationType: 'timbangan',
        recipeName: 'Telur Ayam Negeri',
        recipeDescription: 'Telur ayam segar kaya protein untuk kue arisan.',
        targetDecimal: 0.5,
        orderPrompt: 'Permisi Koki, Ibu mau beli 0.5 kg (setengah kilo) telur ayam ya!',
        explanationNote: '0.5 kg adalah 5/10 kg atau tepat setengah kilogram.',
        timeLimitSec: 45,
        rewardCoins: 65,
        rewardStars: 1
      },
      {
        id: 'ord_3_2',
        customer: CHARACTERS.pak_joko,
        problemType: 'desimal',
        stationType: 'timbangan',
        recipeName: 'Beras Pandan Wangi',
        recipeDescription: 'Beras pulen aromatik dari Cianjur.',
        targetDecimal: 0.75,
        orderPrompt: 'Bapak ingin menimbang 0.75 kg beras wangi untuk contoh praktik matematika kelas.',
        explanationNote: '0.75 kg sama dengan 75/100 kg, atau tiga perempat (3/4) kilogram.',
        timeLimitSec: 50,
        rewardCoins: 75,
        rewardStars: 1
      },
      {
        id: 'ord_3_3',
        customer: CHARACTERS.siti,
        problemType: 'desimal',
        stationType: 'timbangan',
        recipeName: 'Gula Pasir Tebu Murni',
        recipeDescription: 'Gula pasir kristal putih untuk minuman manis.',
        targetDecimal: 0.25,
        orderPrompt: 'Saya beli 0.25 kg gula pasir ya untuk membuat puding!',
        explanationNote: '0.25 kg adalah seperempat (1/4) kilogram atau 25 perseratus kg.',
        timeLimitSec: 45,
        rewardCoins: 70,
        rewardStars: 1
      }
    ]
  },
  {
    id: 'lvl_4_bakso_campuran',
    title: 'Level 4: Warung Bakso & Mie Ayam',
    subtitle: 'Pecahan Campuran & Kombinasi Porsi',
    gradeTarget: 'Kelas 6',
    problemType: 'pecahan',
    stationType: 'bakso',
    description: 'Racik porsi mangkuk bakso ayam jago: mangkuk utuh (1, 2) ditambah mangkuk pecahan (1/4, 1/2, 3/4).',
    learningGoal: 'Peserta didik memahami konsep pecahan campuran sebagai gabungan bilangan bulat dan pecahan biasa.',
    orders: [
      {
        id: 'ord_4_1',
        customer: CHARACTERS.pak_joko,
        problemType: 'pecahan',
        stationType: 'bakso',
        recipeName: 'Bakso Urat Kuah Kaldu Sapi',
        recipeDescription: 'Bakso daging sapi kenyal dengan kuah sumsum gurih.',
        targetDecimal: 1.5,
        orderPrompt: 'Bapak sedang lapar sekali, tolong siapkan 1 1/2 porsi Bakso Urat ya!',
        explanationNote: '1 1/2 porsi berarti 1 mangkuk penuh ditambah 1/2 mangkuk lagi (senilai 1.5 porsi atau 3/2).',
        timeLimitSec: 50,
        rewardCoins: 85,
        rewardStars: 1
      },
      {
        id: 'ord_4_2',
        customer: CHARACTERS.rina,
        problemType: 'pecahan',
        stationType: 'bakso',
        recipeName: 'Mie Ayam Pangsit Komplit',
        recipeDescription: 'Mie kuning kenyal dengan potongan ayam kecap dan pangsit.',
        targetDecimal: 1.25,
        orderPrompt: 'Pramuka pesan 1 1/4 porsi Mie Ayam Pangsit untuk porsi juara lomba!',
        explanationNote: '1 1/4 porsi adalah 1 mangkuk utuh ditambah 1/4 porsi (senilai 1.25 porsi atau 5/4).',
        timeLimitSec: 50,
        rewardCoins: 90,
        rewardStars: 1
      },
      {
        id: 'ord_4_3',
        customer: CHARACTERS.budi,
        problemType: 'pecahan',
        stationType: 'bakso',
        recipeName: 'Bakso Telur Puyuh Spesial',
        recipeDescription: 'Pentol bakso isi telur puyuh gurih nikmat.',
        targetDecimal: 1.75,
        orderPrompt: 'Saya pesan 1 3/4 porsi Bakso Telur Puyuh untuk dimakan bersama teman!',
        explanationNote: '1 3/4 porsi adalah 1 mangkuk penuh ditambah 3/4 mangkuk (senilai 1.75 atau 7/4).',
        timeLimitSec: 55,
        rewardCoins: 95,
        rewardStars: 1
      }
    ]
  },
  {
    id: 'lvl_5_kedai_jus',
    title: 'Level 5: Kedai Jus Buah & Cendol',
    subtitle: 'Mengenal Bilangan Desimal Volume (Liter)',
    gradeTarget: 'Kelas 5',
    problemType: 'desimal',
    stationType: 'jus',
    description: 'Tuang sari buah ke tabung ukur. Amati garis skala persepuluhan dan perseratusan secara presisi.',
    learningGoal: 'Peserta didik dapat menuang dan membaca desimal liter pada wadah ukur bergradasi.',
    orders: [
      {
        id: 'ord_5_1',
        customer: CHARACTERS.rina,
        problemType: 'desimal',
        stationType: 'jus',
        recipeName: 'Jus Jeruk Manis Peras',
        recipeDescription: 'Segar dan kaya vitamin C dari jeruk pontianak pilihan.',
        targetDecimal: 0.5,
        orderPrompt: 'Hai Koki! Tolong tuangkan tepat 0.5 Liter Jus Jeruk segar ya!',
        explanationNote: '0.5 Liter sama dengan 5/10 Liter atau setengah (1/2) Liter air pada tabung ukur.',
        timeLimitSec: 45,
        rewardCoins: 50,
        rewardStars: 1
      },
      {
        id: 'ord_5_2',
        customer: CHARACTERS.siti,
        problemType: 'desimal',
        stationType: 'jus',
        recipeName: 'Jus Mangga Harum Manis',
        recipeDescription: 'Jus kental manis mangga aromatik dengan es serut.',
        targetDecimal: 0.75,
        orderPrompt: 'Saya pesan 0.75 Liter Jus Mangga ya! Cocok untuk bekal les sore.',
        explanationNote: '0.75 Liter adalah 75/100 Liter, atau senilai dengan pecahan 3/4 Liter.',
        timeLimitSec: 50,
        rewardCoins: 75,
        rewardStars: 1
      },
      {
        id: 'ord_5_3',
        customer: CHARACTERS.bu_rt,
        problemType: 'desimal',
        stationType: 'jus',
        recipeName: 'Jus Alpukat Madu',
        recipeDescription: 'Alpukat mentega super lembut disiram madu murni hutan.',
        targetDecimal: 0.65,
        orderPrompt: 'Halo Koki ganteng/cantik, Ibu mau pesan 0.65 Liter Jus Alpukat Madu ya.',
        explanationNote: '0.65 Liter berada di antara 0.6 L dan 0.7 L (tepatnya 65 perseratus Liter).',
        timeLimitSec: 55,
        rewardCoins: 85,
        rewardStars: 1
      }
    ]
  },
  {
    id: 'lvl_6_kasir_diskon',
    title: 'Level 6: Kasir Diskon Warung',
    subtitle: 'Menghitung Potongan Harga & Persentase',
    gradeTarget: 'Kelas 6',
    problemType: 'persen',
    stationType: 'diskon',
    description: 'Bantu kasir warung menghitung harga setelah diskon dan arsir petak perseratus (100-grid) kue cokelat!',
    learningGoal: 'Peserta didik dapat menghitung persentase dari suatu kuantitas dan menentukan harga akhir setelah diskon.',
    orders: [
      {
        id: 'ord_6_1',
        customer: CHARACTERS.bu_rt,
        problemType: 'persen',
        stationType: 'diskon',
        recipeName: 'Kue Lapis Legit Nyonya',
        recipeDescription: 'Kue lapis mentega wangi aroma rempah spekuk.',
        targetPercent: {
          originalPrice: 20000,
          discountPercent: 25,
          finalPrice: 15000,
          gridCellsNeeded: 25
        },
        orderPrompt: 'Ibu beli Kue Lapis Rp 20.000 dengan diskon 25%. Berapa total yang harus Ibu bayar?',
        explanationNote: 'Diskon 25% dari Rp 20.000 = (25/100) × 20.000 = Rp 5.000 hemat! Harga akhir = 20.000 - 5.000 = Rp 15.000.',
        timeLimitSec: 60,
        rewardCoins: 90,
        rewardStars: 1
      },
      {
        id: 'ord_6_2',
        customer: CHARACTERS.budi,
        problemType: 'persen',
        stationType: 'diskon',
        recipeName: 'Martabak Spesial Jumbo',
        recipeDescription: 'Martabak ukuran besar pas untuk sekeluarga.',
        targetPercent: {
          originalPrice: 40000,
          discountPercent: 50,
          finalPrice: 20000,
          gridCellsNeeded: 50
        },
        orderPrompt: 'Asyik! Martabak Jumbo Rp 40.000 lagi ada promo diskon 50%! Berapa bayarnya, Koki?',
        explanationNote: 'Diskon 50% sama dengan setengah harga! 40.000 ÷ 2 = Rp 20.000.',
        timeLimitSec: 50,
        rewardCoins: 85,
        rewardStars: 1
      }
    ]
  },
  {
    id: 'lvl_7_koki_master',
    title: 'Level 7: Koki Master - Tantangan Campuran',
    subtitle: 'Konversi Hubungan Pecahan, Desimal, & Persen',
    gradeTarget: 'Fase C Umum',
    problemType: 'campuran',
    stationType: 'timbangan',
    description: 'Tantangan koki bintang lima! Ubah pesanan pecahan ke desimal, atau sebaliknya secara presisi.',
    learningGoal: 'Peserta didik menguasai konversi luwes antara representasi pecahan, desimal, dan persentase.',
    orders: [
      {
        id: 'ord_7_1',
        customer: CHARACTERS.pak_joko,
        problemType: 'campuran',
        stationType: 'timbangan',
        recipeName: 'Kopi Luwak Istimewa',
        recipeDescription: 'Biji kopi pilihan kualitas ekspor.',
        targetFraction: { numerator: 3, denominator: 4 },
        targetDecimal: 0.75,
        orderPrompt: 'Bapak ingin 3/4 kg Kopi Luwak. Tolong timbang pada timbangan desimal dalam kg!',
        explanationNote: '3/4 kg diubah ke desimal menjadi 0.75 kg (75/100 kg).',
        timeLimitSec: 55,
        rewardCoins: 110,
        rewardStars: 2
      },
      {
        id: 'ord_7_2',
        customer: CHARACTERS.rina,
        problemType: 'campuran',
        stationType: 'sate',
        recipeName: 'Sate Ayam Jumbo',
        recipeDescription: 'Sate ayam porsi regu pramuka.',
        targetDecimal: 0.5,
        targetFraction: { numerator: 1, denominator: 2 },
        orderPrompt: 'Pramuka butuh 0.5 bagian dari tusuk sate di panggangan. Ambilkan tusuk sate senilai 0.5!',
        explanationNote: '0.5 sama dengan 1/2 bagian (misal 5 dari 10 tusuk sate).',
        timeLimitSec: 55,
        rewardCoins: 110,
        rewardStars: 2
      }
    ]
  }
];

export const SHOP_ITEMS = [
  {
    id: 'item_apron_batik',
    name: 'Celemek Batik Parang',
    category: 'apron' as const,
    description: 'Celemek motif batik tradisional Nusantara, membuat koki tampil berwibawa.',
    cost: 150,
    unlocked: false,
    iconSvg: 'apron_batik'
  },
  {
    id: 'item_hat_master',
    name: 'Topi Koki Bintang Emas',
    category: 'hat' as const,
    description: 'Topi koki tinggi dengan emblem bintang emas kelulusan Fase C.',
    cost: 250,
    unlocked: false,
    iconSvg: 'hat_gold'
  },
  {
    id: 'item_decor_lampion',
    name: 'Lampion Bambu Hangat',
    category: 'decor' as const,
    description: 'Dekorasi lampu bambu warung yang memberi suasana hangat dan ramah pembeli.',
    cost: 180,
    unlocked: false,
    iconSvg: 'decor_lamp'
  },
  {
    id: 'item_recipe_sultan',
    name: 'Resep Rahasia Martabak Sultan',
    category: 'recipe' as const,
    description: 'Resep legendaris dengan topping 10 rasa eksklusif.',
    cost: 300,
    unlocked: false,
    iconSvg: 'recipe_book'
  }
];
