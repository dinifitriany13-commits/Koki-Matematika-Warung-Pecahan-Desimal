import { CustomerCharacter } from '../types/game';

export const CHARACTERS: Record<string, CustomerCharacter> = {
  budi: {
    id: 'char_budi',
    name: 'Budi (Siswa SD)',
    role: 'Siswa Kelas 5 SD Teladan',
    avatarKey: 'budi',
    dialogueGreet: 'Halo Koki! Sepulang sekolah enak makan martabak hangat!',
    dialogueHappy: 'Nyam! Potongan martabaknya pas banget dengan yang kuminta. Makasih ya!',
    dialogueDisappointed: 'Wah, sepertinya potongannya belum pas dengan pesananku. Boleh hitung lagi?'
  },
  siti: {
    id: 'char_siti',
    name: 'Siti (Siswi Berbakat)',
    role: 'Siswi Kelas 6 SD',
    avatarKey: 'siti',
    dialogueGreet: 'Permisi Koki, siang ini terik sekali. Aku butuh minuman segar!',
    dialogueHappy: 'Alhamdulillah pas takarannya! Jus ini segar dan sehat sekali!',
    dialogueDisappointed: 'Aduh, takaran airnya agak kelebihan atau kurang ya. Coba periksa garis liter nya!'
  },
  pak_joko: {
    id: 'char_pak_joko',
    name: 'Pak Joko (Guru Matematika)',
    role: 'Guru Matematika SD Merdeka',
    avatarKey: 'pak_joko',
    dialogueGreet: 'Selamat siang Koki Cilik! Bapak ingin menguji pesanan pecahan senilai.',
    dialogueHappy: 'Luar biasa! Konsep pecahan senilaimu sangat matang. Bapak beri nilai A+!',
    dialogueDisappointed: 'Ingat konsep penyederhanaan pecahan ya, coba bagi pembilang dan penyebut dengan bilangan yang sama.'
  },
  bu_rt: {
    id: 'char_bu_rt',
    name: 'Bu RT Dewi',
    role: 'Pelanggan Setia Warung',
    avatarKey: 'bu_rt',
    dialogueGreet: 'Halo Koki! Ibu mau beli paket kue untuk arisan PKK, ada diskon kan?',
    dialogueHappy: 'Pintar sekali menghitung diskonnya! Ini uang pasnya ya, pertahankan!',
    dialogueDisappointed: 'Lho, hitungan diskonnya kok beda dengan catatan Ibu? Coba dicek lagi potongannya.'
  },
  mochi_cat: {
    id: 'char_mochi',
    name: 'Mochi Si Kucing Warung',
    role: 'Maskot Warung Pecahan',
    avatarKey: 'mochi_cat',
    dialogueGreet: 'Meoow! Mochi mau pesan porsi camilan ikan istimewa!',
    dialogueHappy: 'Purrr! Meong kenyang sekali! Dapet bonus tepukan kepala!',
    dialogueDisappointed: 'Meoong... porsinya belum pas untuk mangkuk Mochi.'
  },
  rina: {
    id: 'char_rina',
    name: 'Rina (Ketua Regu Pramuka)',
    role: 'Siswi Kelas 6 SD',
    avatarKey: 'rina',
    dialogueGreet: 'Salam Pramuka! Kami butuh bekal bernutrisi untuk penjelajahan regu.',
    dialogueHappy: 'Mantap Koki! Siap dibawa jelajah alam bersama regu Melati!',
    dialogueDisappointed: 'Wah, belum sesuai target timbangan bekal kami nih.'
  }
};
