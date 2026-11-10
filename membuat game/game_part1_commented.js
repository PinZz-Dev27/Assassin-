// =============================================================================
// GAME.JS - BAGIAN 1: INISIALISASI DASAR, ASSETS, AUDIO, INPUT, NAVIGASI & MAP DATA
// Game Steal / Assassin 2D Top-Down Berbasis HTML5 Canvas & Web Audio API
// =============================================================================

// Mengambil referensi elemen canvas dari dokumen HTML berdasarkan ID 'arenaGame'
const canvas = document.getElementById("arenaGame");

// Mengambil konteks rendering 2D untuk menggambar grafis permainan di atas canvas
const ctx = canvas.getContext("2d");

// Mengambil elemen HTML dengan ID 'teks-status' untuk menampilkan status HUD/objektif permainan
const teksStatus = document.getElementById("teks-status");

// Menetapkan lebar arena permainan sebesar 1000 piksel
canvas.width = 1000;

// Menetapkan tinggi arena permainan sebesar 700 piksel
canvas.height = 700;

// ==========================================
// 1. PEMUATAN ASET GAMBAR SPRITE 2D
// ==========================================

// Objek penampung seluruh referensi gambar/aset visual game (karakter, musuh, dan baju)
const assets = {
  // Kumpulan objek Image untuk spritesheet animasi karakter berdasarkan warna kostum
  spritesheets: {
    // Objek Image untuk spritesheet karakter kostum warna hitam
    hitam: new Image(),
    // Objek Image untuk spritesheet karakter kostum warna putih
    putih: new Image(),
    // Objek Image untuk spritesheet karakter kostum warna emas / gold
    emas: new Image(),
    // Objek Image untuk spritesheet karakter kostum warna navy / biru gelap
    navy: new Image(),
    // Objek Image untuk spritesheet karakter kostum warna abu-abu
    abu: new Image(),
    // Objek Image untuk spritesheet karakter kostum warna merah
    merah: new Image(),
    // Objek Image untuk spritesheet karakter kostum warna ungu
    ungu: new Image()
  },
  // Kumpulan objek Image untuk animasi karakter saat posisi diam (idle fallback)
  idle: {
    // Objek Image pose diam menghadap ke arah atas
    atas: new Image(),
    // Objek Image pose diam menghadap ke arah bawah
    bawah: new Image(),
    // Objek Image pose diam menghadap ke samping (kiri/kanan)
    samping: new Image()
  },
  // Kumpulan objek Image untuk animasi karakter saat berjalan (walk fallback)
  jalan: {
    // Objek Image pose berjalan menghadap ke arah atas
    atas: new Image(),
    // Objek Image pose berjalan menghadap ke arah bawah
    bawah: new Image(),
    // Objek Image pose berjalan menghadap ke samping (kiri/kanan)
    samping: new Image()
  },
  // Kumpulan objek Image untuk animasi aksi spesial karakter
  aksi: {
    // Objek Image pose menyerang (attack action)
    serang: new Image()
  },
  // Kumpulan objek Image untuk gambar ikon/tampilan baju kostum karakter
  baju: {
    // Ikon pakaian/baju varian warna hitam
    hitam: new Image(),
    // Ikon pakaian/baju varian warna navy
    navy: new Image(),
    // Ikon pakaian/baju varian warna putih
    putih: new Image(),
    // Ikon pakaian/baju varian warna abu-abu
    abu: new Image(),
    // Ikon pakaian/baju varian warna merah
    merah: new Image(),
    // Ikon pakaian/baju varian warna ungu
    ungu: new Image(),
    // Ikon pakaian/baju varian warna emas
    emas: new Image()
  },
  // Kumpulan objek Image untuk spritesheet visual musuh
  musuh: {
    // Spritesheet musuh keroco tipe jarak dekat (melee)
    keroco: new Image(),
    // Spritesheet musuh keroco tipe bersenjata api (pistol / ranged)
    keroco_pistol: new Image(),
    // Spritesheet musuh tipe pertahanan tinggi / bertubuh besar (juggernaut)
    juggernaut: new Image(),
    // Spritesheet musuh utama / bos besar (boss)
    boss: new Image(),
    // Spritesheet musuh spesialis pembunuh saingan (rival assassin)
    rival: new Image()
  }
};

// 1.0 Spritesheet Resmi Tiap Warna Karakter Sesuai File
// Mengatur sumber file gambar (src) untuk spritesheet karakter hitam
assets.spritesheets.hitam.src = "gerakan hitam.png";
// Mengatur sumber file gambar (src) untuk spritesheet karakter putih
assets.spritesheets.putih.src = "gerakan putih.png";
// Mengatur sumber file gambar (src) untuk spritesheet karakter emas
assets.spritesheets.emas.src = "gerakan emas.png";
// Mengatur sumber file gambar (src) untuk spritesheet karakter navy
assets.spritesheets.navy.src = "gerakan navy.png";
// Mengatur sumber file gambar (src) untuk spritesheet karakter abu-abu
assets.spritesheets.abu.src = "gerakan abu.png";
// Mengatur sumber file gambar (src) untuk spritesheet karakter merah
assets.spritesheets.merah.src = "gerakan merah.png";
// Mengatur sumber file gambar (src) untuk spritesheet karakter ungu
assets.spritesheets.ungu.src = "gerakan ungu.png";

// 1.0.1 Spritesheet Resmi Musuh
// Mengatur sumber file gambar untuk musuh kroco melee
assets.musuh.keroco.src = "musuh/keroco.png";
// Mengatur sumber file gambar untuk musuh kroco pistol
assets.musuh.keroco_pistol.src = "musuh/keroco pistol.png";
// Mengatur sumber file gambar untuk musuh juggernaut bertameng tebal
assets.musuh.juggernaut.src = "musuh/juggernut.png";
// Mengatur sumber file gambar untuk bos area
assets.musuh.boss.src = "musuh/boss.png";
// Mengatur sumber file gambar untuk musuh pembunuh bayaran tandingan (rival)
assets.musuh.rival.src = "musuh/rivalAssassin.png";

// 1.1 Fallback Aset Karakter
// Mengatur aset fallback ketika karakter diam menghadap atas
assets.idle.atas.src = "navy.png";
// Mengatur aset fallback ketika karakter diam menghadap bawah
assets.idle.bawah.src = "navy.png";
// Mengatur aset fallback ketika karakter diam menghadap samping
assets.idle.samping.src = "navy.png";

// 1.2 Walk / Jalan
// Mengatur aset fallback ketika karakter berjalan ke atas
assets.jalan.atas.src = "navy.png";
// Mengatur aset fallback ketika karakter berjalan ke bawah
assets.jalan.bawah.src = "navy.png";
// Mengatur aset fallback ketika karakter berjalan ke samping
assets.jalan.samping.src = "navy.png";

// 1.3 Aksi (Attack)
// Mengatur aset fallback animasi serangan
assets.aksi.serang.src = "navy.png";

// 1.4 Baju / 7 Warna Operative
// Sumber gambar ikon kostum hitam
assets.baju.hitam.src = "hitam.png";
// Sumber gambar ikon kostum navy
assets.baju.navy.src = "navy.png";
// Sumber gambar ikon kostum putih
assets.baju.putih.src = "putih.png";
// Sumber gambar ikon kostum abu-abu
assets.baju.abu.src = "abu.png";
// Sumber gambar ikon kostum merah
assets.baju.merah.src = "merah.png";
// Sumber gambar ikon kostum ungu
assets.baju.ungu.src = "ungu.png";
// Sumber gambar ikon kostum emas
assets.baju.emas.src = "emas.png";

// Mapping warna baju ke key karakter (7 Warna Resmi)
// Objek pemetaan antara kode warna hexadecimal atau string alias ke nama kunci warna standar
const mapBajuWarna = {
  // Kode hex hitam diarahkan ke kunci 'hitam'
  "#111111": "hitam",
  // Kode hex navy diarahkan ke kunci 'navy'
  "#2c3e50": "navy",
  // Kode hex emas diarahkan ke kunci 'emas'
  "#f1c40f": "emas",
  // Kode hex abu diarahkan ke kunci 'abu'
  "#95a5a6": "abu",
  // Kode hex ungu diarahkan ke kunci 'ungu'
  "#8e44ad": "ungu",
  // Kode hex merah diarahkan ke kunci 'merah'
  "#e74c3c": "merah",
  // Kode hex putih diarahkan ke kunci 'putih'
  "#ecf0f1": "putih",
  // String literal 'hitam'
  "hitam": "hitam",
  // String literal 'navy'
  "navy": "navy",
  // String literal 'emas'
  "emas": "emas",
  // String alias 'gold' dipetakan ke 'emas'
  "gold": "emas",
  // String literal 'abu'
  "abu": "abu",
  // String literal 'ungu'
  "ungu": "ungu",
  // String literal 'merah'
  "merah": "merah",
  // String literal 'putih'
  "putih": "putih"
};

// Data Koordinat Sprite Sheet Standar 8-Arah & Aksi (Basis 1536 x 1024 - Hitam & Merah)
// Menentukan koordinat potongan (crop box) x, y, w, h dan titik tumpu (anchorX, anchorY) pada gambar
const BASE_SPRITES = {
  // Frame pose diam umum
  idle: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  // Frame pose diam menghadap ke depan/bawah
  idle_depan: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  // Frame pose diam menghadap ke atas/belakang
  idle_atas: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  // Frame pose diam menghadap belakang
  idle_belakang: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  // Rangkaian 8 frame siklus animasi langkah kaki berjalan (walking cycle)
  walk: [
    // Frame langkah 1
    { x: 34, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 1
    // Frame langkah 2
    { x: 237, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 2
    // Frame langkah 3
    { x: 426, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 3
    // Frame langkah 4
    { x: 625, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 4
    // Frame langkah 5
    { x: 805, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 5
    // Frame langkah 6
    { x: 986, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 6
    // Frame langkah 7
    { x: 1167, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 7
    // Frame langkah 8
    { x: 1358, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }  // WALK 8
  ],
  // Rangkaian 8 frame animasi berlari cepat (running cycle)
  run: [
    // Frame lari 1
    { x: 34, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 2
    { x: 237, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 3
    { x: 426, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 4
    { x: 625, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 5
    { x: 805, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 6
    { x: 986, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 7
    { x: 1167, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 8
    { x: 1358, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }
  ],
  // Rangkaian 3 frame kombo tebasan serangan jarak dekat (melee combo)
  attack: [
    // Serangan kombo tahap 1
    { x: 452, y: 457, w: 190, h: 195, anchorX: 0.50, anchorY: 0.5 }, // ATTACK 1
    // Serangan kombo tahap 2 dengan pergeseran anchor ke arah ayunan
    { x: 813, y: 470, w: 256, h: 186, anchorX: 0.35, anchorY: 0.5 }, // ATTACK 2
    // Serangan kombo tahap 3 (tebasan pamungkas)
    { x: 1187, y: 478, w: 251, h: 178, anchorX: 0.36, anchorY: 0.5 }  // ATTACK 3
  ],
  // Frame aksi tebasan pembunuh pamungkas (finisher slash)
  slashFinisher: { x: 445, y: 770, w: 304, h: 148, anchorX: 0.4, anchorY: 0.5 },
  // Frame potongan kepala untuk efek visual/takedown
  head: { x: 922, y: 782, w: 124, h: 122, anchorX: 0.5, anchorY: 0.5 }
};

// Data Koordinat Sprite Sheet Karakter Emas (Basis 600 x 400 - Presisi Tanpa Terpotong)
// Menentukan koordinat pemotongan khusus untuk spritesheet karakter berkostum emas yang beresolusi 600x400
const GOLD_SPRITES = {
  // Pose diam menghadap kamera
  idle: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  // Pose diam menghadap ke depan
  idle_depan: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  // Pose diam menghadap ke atas
  idle_atas: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  // Pose diam menghadap ke belakang
  idle_belakang: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  // Rangkaian 8 frame animasi jalan karakter emas
  walk: [
    // Frame jalan 1 karakter emas
    { x: 12, y: 53, w: 55, h: 69, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 2 karakter emas
    { x: 88, y: 52, w: 54, h: 70, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 3 karakter emas
    { x: 163, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 4 karakter emas
    { x: 239, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 5 karakter emas
    { x: 313, y: 50, w: 54, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 6 karakter emas
    { x: 386, y: 51, w: 59, h: 70, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 7 karakter emas
    { x: 462, y: 49, w: 53, h: 73, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 8 karakter emas
    { x: 535, y: 49, w: 54, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  // Rangkaian 8 frame animasi lari karakter emas
  run: [
    // Frame lari 1 karakter emas
    { x: 12, y: 53, w: 55, h: 69, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 2 karakter emas
    { x: 88, y: 52, w: 54, h: 70, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 3 karakter emas
    { x: 163, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 4 karakter emas
    { x: 239, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 5 karakter emas
    { x: 313, y: 50, w: 54, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 6 karakter emas
    { x: 386, y: 51, w: 59, h: 70, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 7 karakter emas
    { x: 462, y: 49, w: 53, h: 73, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 8 karakter emas
    { x: 535, y: 49, w: 54, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  // Rangkaian 3 frame tebasan karakter emas
  attack: [
    // Serangan 1 karakter emas
    { x: 172, y: 180, w: 74, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Serangan 2 karakter emas
    { x: 311, y: 184, w: 106, h: 71, anchorX: 0.44, anchorY: 0.5 },
    // Serangan 3 karakter emas
    { x: 462, y: 181, w: 99, h: 73, anchorX: 0.44, anchorY: 0.5 }
  ],
  // Finisher tebasan pedang emas
  slashFinisher: { x: 168, y: 270, w: 127, h: 95, anchorX: 0.45, anchorY: 0.5 },
  // Bagian kepala karakter emas
  head: { x: 337, y: 270, w: 164, h: 89, anchorX: 0.5, anchorY: 0.5 }
};

// Data Koordinat Sprite Sheet Standar 600 x 400 (Navy, Abu, Putih, Ungu)
// Menentukan koordinat pemotongan untuk varian kostum navy, abu, putih, dan ungu beresolusi 600x400
const BASE_SPRITES_600 = {
  // Pose diam kostum standar 600x400
  idle: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  // Pose diam depan
  idle_depan: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  // Pose diam atas
  idle_atas: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  // Pose diam belakang
  idle_belakang: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  // 8 frame animasi langkah jalan
  walk: [
    // Frame jalan 1
    { x: 12, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 2
    { x: 86, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 3
    { x: 162, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 4
    { x: 238, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 5
    { x: 312, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 6
    { x: 386, y: 50, w: 58, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 7
    { x: 460, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 },
    // Frame jalan 8
    { x: 534, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  // 8 frame animasi berlari
  run: [
    // Frame lari 1
    { x: 12, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 2
    { x: 86, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 3
    { x: 162, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 4
    { x: 238, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 5
    { x: 312, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 6
    { x: 386, y: 50, w: 58, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 7
    { x: 460, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 },
    // Frame lari 8
    { x: 534, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  // 3 frame kombo tebasan
  attack: [
    // Serangan kombo 1
    { x: 170, y: 178, w: 76, h: 72, anchorX: 0.5, anchorY: 0.5 },
    // Serangan kombo 2
    { x: 312, y: 180, w: 104, h: 72, anchorX: 0.45, anchorY: 0.5 },
    // Serangan kombo 3
    { x: 462, y: 180, w: 102, h: 74, anchorX: 0.45, anchorY: 0.5 }
  ],
  // Tebasan pamungkas
  slashFinisher: { x: 168, y: 270, w: 127, h: 95, anchorX: 0.45, anchorY: 0.5 }
};

// Data Koordinat Sprite Sheet Musuh Resmi (Basis 600 x 400 - Bersih Tanpa Label Text)
// Menentukan koordinat potongan spritesheet untuk seluruh jenis musuh di dalam game
const MUSUH_SPRITES = {
  // Karakter musuh kroco bertarung jarak dekat (melee guard)
  keroco: {
    // Pose berdiri patroli/diam musuh kroco
    idle: { x: 35, y: 177, w: 66, h: 80, anchorX: 0.5, anchorY: 0.5 },
    // Rangkaian 8 frame langkah berjalan musuh kroco
    walk: [
      // Frame 1 jalan kroco
      { x: 10, y: 49, w: 64, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 2 jalan kroco
      { x: 84, y: 49, w: 65, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 3 jalan kroco
      { x: 160, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 4 jalan kroco
      { x: 234, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 5 jalan kroco
      { x: 309, y: 49, w: 64, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 6 jalan kroco
      { x: 383, y: 48, w: 64, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 7 jalan kroco
      { x: 457, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame 8 jalan kroco
      { x: 530, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 }
    ],
    // Rangkaian 3 frame animasi serangan pukulan/tebasan kroco
    attack: [
      // Serangan 1 kroco
      { x: 169, y: 170, w: 81, h: 85, anchorX: 0.5, anchorY: 0.45 },
      // Serangan 2 kroco
      { x: 300, y: 178, w: 112, h: 80, anchorX: 0.45, anchorY: 0.45 },
      // Serangan 3 kroco
      { x: 453, y: 174, w: 113, h: 82, anchorX: 0.42, anchorY: 0.45 }
    ]
  },
  // Karakter musuh kroco bersenjata pistol (ranged guard)
  keroco_pistol: {
    // Pose diam mengincar kroco pistol
    idle: { x: 39, y: 176, w: 62, h: 80, anchorX: 0.5, anchorY: 0.5 },
    // 8 frame berjalan kroco pistol
    walk: [
      // Frame jalan 1
      { x: 16, y: 48, w: 58, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 2
      { x: 90, y: 48, w: 58, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 3
      { x: 165, y: 48, w: 58, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 4
      { x: 240, y: 48, w: 57, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 5
      { x: 315, y: 48, w: 57, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 6
      { x: 390, y: 48, w: 57, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 7
      { x: 464, y: 47, w: 56, h: 80, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 8
      { x: 538, y: 48, w: 56, h: 80, anchorX: 0.5, anchorY: 0.5 }
    ],
    // 3 frame tembakan pistol kroco
    attack: [
      // Pose membidik
      { x: 166, y: 175, w: 98, h: 80, anchorX: 0.5, anchorY: 0.48 },
      // Pose menembak
      { x: 297, y: 180, w: 101, h: 77, anchorX: 0.5, anchorY: 0.48 },
      // Pose hentakan recoil pistol
      { x: 450, y: 181, w: 101, h: 76, anchorX: 0.48, anchorY: 0.48 }
    ]
  },
  // Karakter musuh tipe Juggernaut dengan armor dan tameng tebal
  juggernaut: {
    // Pose berdiri tegap Juggernaut
    idle: { x: 33, y: 168, w: 79, h: 88, anchorX: 0.5, anchorY: 0.5 },
    // 8 frame berjalan berbobot berat Juggernaut
    walk: [
      // Frame langkah 1
      { x: 11, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 2
      { x: 85, y: 45, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 3
      { x: 160, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 4
      { x: 235, y: 46, w: 66, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 5
      { x: 309, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 6
      { x: 384, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 7
      { x: 458, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 8
      { x: 529, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 }
    ],
    // 3 frame serangan hantaman berat tameng Juggernaut
    attack: [
      // Ancang-ancang hantaman
      { x: 165, y: 168, w: 99, h: 88, anchorX: 0.5, anchorY: 0.48 },
      // Dorongan tameng ke depan
      { x: 302, y: 171, w: 110, h: 86, anchorX: 0.48, anchorY: 0.48 },
      // Hantaman penuh
      { x: 452, y: 170, w: 113, h: 87, anchorX: 0.48, anchorY: 0.48 }
    ]
  },
  // Karakter Boss musuh besar dengan HP tinggi dan serangan mematikan
  boss: {
    // Pose diam mengintimidasi Boss
    idle: { x: 48, y: 164, w: 69, h: 92, anchorX: 0.5, anchorY: 0.5 },
    // 8 frame berjalan Boss
    walk: [
      // Frame jalan 1 Boss
      { x: 9, y: 43, w: 64, h: 86, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 2 Boss
      { x: 85, y: 41, w: 65, h: 86, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 3 Boss
      { x: 163, y: 42, w: 62, h: 86, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 4 Boss
      { x: 235, y: 43, w: 64, h: 86, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 5 Boss
      { x: 314, y: 43, w: 62, h: 86, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 6 Boss
      { x: 376, y: 42, w: 74, h: 86, anchorX: 0.55, anchorY: 0.5 },
      // Frame jalan 7 Boss
      { x: 461, y: 42, w: 61, h: 86, anchorX: 0.5, anchorY: 0.5 },
      // Frame jalan 8 Boss
      { x: 533, y: 43, w: 62, h: 86, anchorX: 0.5, anchorY: 0.5 }
    ],
    // 3 frame kombo serangan brutal Boss
    attack: [
      // Tebasan 1 Boss
      { x: 179, y: 158, w: 87, h: 96, anchorX: 0.52, anchorY: 0.48 },
      // Tebasan 2 Boss
      { x: 296, y: 149, w: 119, h: 104, anchorX: 0.55, anchorY: 0.5 },
      // Serangan tebasan melompat Boss
      { x: 444, y: 170, w: 140, h: 87, anchorX: 0.46, anchorY: 0.48 }
    ]
  },
  // Karakter Rival Assassin: Musuh terkuat dengan kelincahan tinggi di tahap rahasia
  rival: {
    // Pose siaga membunuh Rival
    idle: { x: 40, y: 158, w: 65, h: 96, anchorX: 0.5, anchorY: 0.5 },
    // 8 frame langkah bayangan Rival
    walk: [
      // Frame langkah 1
      { x: 9, y: 37, w: 64, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 2
      { x: 85, y: 37, w: 60, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 3
      { x: 161, y: 37, w: 63, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 4
      { x: 236, y: 37, w: 60, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 5
      { x: 311, y: 38, w: 60, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 6
      { x: 383, y: 36, w: 63, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 7
      { x: 459, y: 36, w: 59, h: 92, anchorX: 0.5, anchorY: 0.5 },
      // Frame langkah 8
      { x: 533, y: 38, w: 61, h: 92, anchorX: 0.5, anchorY: 0.5 }
    ],
    // 3 frame kombo kilat mematikan Rival
    attack: [
      // Serangan kilat 1
      { x: 165, y: 159, w: 93, h: 96, anchorX: 0.5, anchorY: 0.48 },
      // Serangan kilat 2
      { x: 307, y: 166, w: 120, h: 92, anchorX: 0.48, anchorY: 0.48 },
      // Serangan tebasan silang mematikan
      { x: 452, y: 162, w: 124, h: 94, anchorX: 0.5, anchorY: 0.48 }
    ]
  }
};

// Objek pemetaan untuk mengaitkan nama warna karakter ke dataset konfigurasi koordinat sprite yang tepat
const SPRITE_SHEET_DATA = {
  // Karakter hitam menggunakan konfigurasi BASE_SPRITES (1536x1024)
  hitam: BASE_SPRITES,
  // Karakter navy menggunakan konfigurasi BASE_SPRITES_600 (600x400)
  navy: BASE_SPRITES_600,
  // Karakter putih menggunakan konfigurasi BASE_SPRITES_600 (600x400)
  putih: BASE_SPRITES_600,
  // Karakter abu-abu menggunakan konfigurasi BASE_SPRITES_600 (600x400)
  abu: BASE_SPRITES_600,
  // Karakter emas menggunakan konfigurasi GOLD_SPRITES (600x400 khusus)
  emas: GOLD_SPRITES,
  // Karakter merah menggunakan konfigurasi BASE_SPRITES (1536x1024)
  merah: BASE_SPRITES,
  // Karakter ungu menggunakan konfigurasi BASE_SPRITES_600 (600x400)
  ungu: BASE_SPRITES_600
};

// Helper rotasi sudut halus (anti-kaku 360 & 8 arah)
// Menghitung interpolasi linier antar sudut rotasi (dalam radian) dengan rute terpendek agar tidak terbalik saat melewati batas 2*PI
function lerpAngle(a, b, t) {
  // Menghitung selisih sudut dalam kelipatan 2*PI
  let diff = (b - a) % (Math.PI * 2);
  // Koreksi bila putaran melewati batas minus PI
  if (diff < -Math.PI) diff += Math.PI * 2;
  // Koreksi bila putaran melewati batas positif PI
  if (diff > Math.PI) diff -= Math.PI * 2;
  // Mengembalikan hasil interpolasi dari sudut a ke sudut b dengan faktor t
  return a + diff * t;
}

// Tema visual & identitas untuk masing-masing 7 warna (Menggunakan aset sprite asli tanpa filter)
// Mendefinisikan palet warna efek khusus (cahaya glow, jejak trail, dan teks status) untuk masing-masing varian kostum pemain
const WARNA_TEMA = {
  // Tema visual agen hitam
  hitam: { utama: "#111111", glow: "#64748b", filter: "none", trail: "rgba(15, 23, 42, 0.4)", text: "#cbd5e1" },
  // Tema visual agen navy
  navy: { utama: "#2c3e50", glow: "#38bdf8", filter: "none", trail: "rgba(30, 41, 59, 0.4)", text: "#38bdf8" },
  // Tema visual agen emas
  emas: { utama: "#f1c40f", glow: "#f59e0b", filter: "none", trail: "rgba(245, 158, 11, 0.4)", text: "#facc15" },
  // Tema visual agen abu-abu
  abu: { utama: "#95a5a6", glow: "#94a3b8", filter: "none", trail: "rgba(100, 116, 139, 0.4)", text: "#94a3b8" },
  // Tema visual agen ungu
  ungu: { utama: "#8e44ad", glow: "#a855f7", filter: "none", trail: "rgba(126, 34, 206, 0.4)", text: "#c084fc" },
  // Tema visual agen merah
  merah: { utama: "#e74c3c", glow: "#ef4444", filter: "none", trail: "rgba(185, 28, 28, 0.4)", text: "#ef4444" },
  // Tema visual agen putih
  putih: { utama: "#ecf0f1", glow: "#cbd5e1", filter: "none", trail: "rgba(203, 213, 225, 0.4)", text: "#ffffff" }
};

// Helper konversi hex ke RGBA untuk tint transparan
// Mengonversi string format warna hex (#RRGGBB atau #RGB) menjadi format fungsi CSS 'rgba(r, g, b, alpha)'
function hexToRgba(hex, alpha = 0.5) {
  // Memeriksa validitas masukan string hex; kembalikan warna merah semi-transparan jika tidak valid
  if (!hex || typeof hex !== 'string' || hex[0] !== '#') return `rgba(220, 38, 38, ${alpha})`;
  // Menghapus karakter tanda pagar '#' di awal string
  let c = hex.substring(1);
  // Menangani format penulisan 3 digit hex (#RGB diubah ke #RRGGBB)
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  // Mengonversi string heksadesimal ke bilangan bulat desimal
  let num = parseInt(c, 16);
  // Memeriksa jika terjadi kesalahan konversi NaN
  if (isNaN(num)) return `rgba(220, 38, 38, ${alpha})`;
  // Mengekstrak komponen warna merah (Red)
  let r = (num >> 16) & 255;
  // Mengekstrak komponen warna hijau (Green)
  let g = (num >> 8) & 255;
  // Mengekstrak komponen warna biru (Blue)
  let b = num & 255;
  // Mengembalikan string rgba lengkap dengan nilai transparansi alpha
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// KAMUS (BILINGUAL)
// Mengambil preferensi bahasa aktif dari local storage browser (default: Bahasa Indonesia 'id')
const currentLang = localStorage.getItem('gameLang') || 'id';

// Objek kamus teks dwi-bahasa (Inggris & Indonesia) untuk seluruh antarmuka dan notifikasi permainan
const Teks = {
  // Label tulisan level
  lvl: currentLang === 'en' ? "Level" : "Level",
  // Label tulisan babak / tahap
  stage: currentLang === 'en' ? "Stage" : "Tahap",
  // Label tulisan dokumen intel rahasia
  intelStatus: currentLang === 'en' ? "Intel" : "Intel",
  // Pesan pemberitahuan ketika semua dokumen intel berhasil dikumpulkan pemain
  intelLengkap: currentLang === 'en' ? "ALL INTEL SECURED - HEAD TO EXTRACTION!" : "SEMUA INTEL DIAMBIL - MENUJU TITIK KABUR!",
  // Pesan objektif ketika musuh Boss harus dihabisi terlebih dahulu sebelum pintu ekstraksi terbuka
  bosHidup: currentLang === 'en' ? "ELIMINATE THE BOSS TO UNLOCK EXIT!" : "HABISI BOSS UNTUK MEMBUKA PINTU KABUR!",
  // Pesan kekalahan ketika pemain tertangkap oleh musuh
  tertangkap: currentLang === 'en' ? "YOU ARE BUSTED!" : "KAMU TERTANGKAP!",
  // Petunjuk tombol untuk mengulang tahap yang gagal
  ulang: currentLang === 'en' ? "Press [ R ] to restart Stage " : "Tekan [ R ] untuk mengulang Tahap ",
  // Pesan konfirmasi tahap berhasil diselesaikan
  selesai: currentLang === 'en' ? " CLEARED!" : " SELESAI!",
  // Petunjuk tombol untuk melanjutkan ke babak berikutnya
  lanjut: currentLang === 'en' ? " Coins. Press [ ENTER ] to continue" : " Koin. Tekan [ ENTER ] untuk lanjut",
  // Petunjuk tombol untuk kembali ke menu lobi utama
  kembali: currentLang === 'en' ? "Press [ ENTER ] to return to Lobby" : "Tekan [ ENTER ] untuk kembali ke Lobi",
  // Label ringkasan total musuh yang dieksekusi
  totalKill: currentLang === 'en' ? "Total Kills: " : "Total Kill: ",
  // Label penambahan perolehan koin ke tabungan lobi
  totalKoin: currentLang === 'en' ? " | Lobby Coins Added: +" : " | Total Koin Lobi Bertambah: +",
  // Label amunisi senjata pisau/shuriken
  pisau: currentLang === 'en' ? "Knife: " : "Pisau: ",
  // Teks melayang saat serangan dibendung oleh perisai musuh
  blocked: currentLang === 'en' ? "SHIELD BLOCKED!" : "DITAHAN TAMENG!",
  // Teks melayang saat eksekusi senyap berhasil dilakukan
  assassinated: currentLang === 'en' ? "ASSASSINATED!" : "DIEKSEKUSI!",
  // Teks melayang saat musuh terbunuh tepat di kepala
  headshot: currentLang === 'en' ? "HEADSHOT!" : "HEADSHOT!",
  // Teks melayang saat pembunuhan dilakukan menggunakan skill kilat blink
  blinkKill: currentLang === 'en' ? "BLINK KILL!" : "KILAT MAUT!",
  // Teks melayang saat skill manipulasi pembekuan waktu diaktifkan
  timeFreeze: currentLang === 'en' ? "TIME FREEZE!" : "WAKTU BEKU!",
  // Teks melayang saat bayangan umpan klon dilepaskan
  shadowClone: currentLang === 'en' ? "SHADOW CLONE!" : "BAYANGAN PENIPU!",
  // Tanda seru visual saat musuh menyadari keberadaan pemain
  alert: "!",
  // Pesan peringatan sirine ketika pemain terdeteksi oleh kamera CCTV
  cctvAlert: currentLang === 'en' ? "CCTV ALARM!" : "ALARM CCTV!",
  // Judul babak rahasia tingkat 4
  secretStage: currentLang === 'en' ? "SECRET STAGE 4: IMPOSSIBLE TRIAL" : "TAHAP 4 RAHASIA: UJIAN MUSTAHIL",
  // Objektif khusus untuk mengalahkan Rival Assassin di tahap rahasia
  rivalHidup: currentLang === 'en' ? "DEFEAT THE RIVAL ASSASSIN TO UNLOCK EXIT!" : "KALAHKAN RIVAL ASSASSIN UNTUK MEMBUKA PINTU!",
  // Pesan pemberian gelar istimewa setelah memenangkan tahap rahasia
  titleUnlocked: currentLang === 'en' ? "TITLE UNLOCKED: THE IMPOSSIBLE ASSASSIN" : "GELAR TERBUKA: SANG LEGENDA MUSTAHIL",
  // Pesan selamat atas penaklukan tahap rahasia tersulit
  secretCleared: currentLang === 'en' ? "SECRET IMPOSSIBLE TRIAL CONQUERED!" : "TAHAP SECRET IMPOSSIBLE DITAKLUKKAN!"
};

// Objek pemetaan warna atau string ke kunci status kepemilikan baju di local storage
let keyBajuMap = {
  // Pemetaan hex hitam ke kunci status 'baju_hitam'
  '#111111': 'baju_hitam',
  // Pemetaan hex navy ke kunci status 'baju_navy'
  '#2c3e50': 'baju_navy',
  // Pemetaan hex putih ke kunci status 'baju_putih'
  '#ecf0f1': 'baju_putih',
  // Pemetaan hex abu ke kunci status 'baju_abu'
  '#95a5a6': 'baju_abu',
  // Pemetaan hex merah ke kunci status 'baju_merah'
  '#e74c3c': 'baju_merah',
  // Pemetaan hex ungu ke kunci status 'baju_ungu'
  '#8e44ad': 'baju_ungu',
  // Pemetaan hex emas ke kunci status 'baju_emas'
  '#f1c40f': 'baju_emas',
  // Pemetaan string hitam
  'hitam': 'baju_hitam',
  // Pemetaan string navy
  'navy': 'baju_navy',
  // Pemetaan string putih
  'putih': 'baju_putih',
  // Pemetaan string abu
  'abu': 'baju_abu',
  // Pemetaan string merah
  'merah': 'baju_merah',
  // Pemetaan string ungu
  'ungu': 'baju_ungu',
  // Pemetaan string emas
  'emas': 'baju_emas'
};

// Mengambil pilihan warna karakter ninja yang tersimpan di local storage (default hitam #111111)
let playerColor = localStorage.getItem('ninjaColor') || "#111111";

// Menentukan kunci kepemilikan baju untuk verifikasi apakah pemain telah membeli baju tersebut
let checkKey = keyBajuMap[playerColor] || 'baju_hitam';

// Verifikasi integritas: jika warna terpilih bukan baju dasar (hitam) dan belum dibeli, kembalikan ke warna default hitam
if (checkKey !== 'baju_hitam' && localStorage.getItem(checkKey) !== 'true') {
  // Mereset warna karakter pemain kembali ke hitam
  playerColor = "#111111";
  // Menyimpan pengaturan reset ke local storage
  localStorage.setItem('ninjaColor', '#111111');
}

// Mengambil tema arena map yang dipilih dari local storage (default: 'gedung')
const mapTheme = localStorage.getItem('selectedMap') || "gedung";

// Menetapkan tipe senjata yang digunakan oleh pemain (terkunci ke bentuk kayu untuk versi saat ini)
const weaponType = "bentuk-kayu"; // Terkunci pedang kayu untuk versi demo

// Menetapkan kode warna visual bilah senjata kayu
const weaponColor = "#8B4513";

// Fungsi ganti warna dinamis langsung in-game
// Memungkinkan pergantian kostum pemain secara seketika saat permainan sedang berlangsung
window.gantiWarnaPlayer = function (hex) {
  // Memperbarui variabel warna karakter aktif
  playerColor = hex;
  // Memeriksa keberadaan objek pemain di arena
  if (typeof pemain !== "undefined" && pemain) {
    // Memperbarui warna dasar pemain
    pemain.warnaBase = hex;
    // Mencari kunci tema warna yang sesuai
    let bKey = mapBajuWarna[hex] || 'navy';
    // Mengambil palet visual tema yang sesuai
    let theme = WARNA_TEMA[bKey] || WARNA_TEMA['navy'];
    // Menampilkan teks melayang di atas kepala karakter pemain
    munculkanTeks(pemain.x, pemain.y - 25, "SUIT: " + bKey.toUpperCase(), theme.glow);
    // Memunculkan partikel efek visual di sekitar karakter
    tambahVFX(pemain.x, pemain.y, theme.glow, "partikel");
    // Memainkan efek suara saat mengenakan perlengkapan baru
    mainkanSuara('equip');
  }
  // Menyimpan pilihan warna terbaru ke local storage
  localStorage.setItem('ninjaColor', hex);
};

// Deklarasi variabel palet warna lingkungan arena (lantai, tembok, bagian atas tembok, dan noda kotoran)
let warnaLantai, warnaTembok, warnaAtasTembok, kotoranColor, opacityKotoran;

// Penyesuaian skema palet warna lingkungan sesuai tema map 'hutan'
if (mapTheme === "hutan") {
  // Warna permukaan lantai hutan
  warnaLantai = "#142b15";
  // Warna dinding penghalang tema hutan
  warnaTembok = "#1b4d22";
  // Warna bibir atas dinding tema hutan
  warnaAtasTembok = "#22662c";
  // Warna kotoran / lumut di tanah
  kotoranColor = "#0a180b";
  // Tingkat transparansi noda kotoran hutan
  opacityKotoran = 0.4;
// Penyesuaian skema palet warna lingkungan sesuai tema map 'lab' (laboratorium futuristik)
} else if (mapTheme === "lab") {
  // Warna permukaan lantai laboratorium
  warnaLantai = "#0b101a";
  // Warna dinding neon laboratorium
  warnaTembok = "#00e5ff";
  // Warna bibir atas dinding lab
  warnaAtasTembok = "#1a252f";
  // Warna detail lantai bercahaya lab
  kotoranColor = "#00e5ff";
  // Tingkat transparansi detail lab
  opacityKotoran = 0.06;
// Skema warna default untuk tema perkantoran / gedung fasilitas rahasia
} else {
  // Warna permukaan lantai gedung
  warnaLantai = "#303236";
  // Warna dinding beton gedung
  warnaTembok = "#202428";
  // Warna bibir atas dinding beton
  warnaAtasTembok = "#34495e";
  // Warna noda lantai gedung
  kotoranColor = "#1a1a1a";
  // Tingkat transparansi noda gedung
  opacityKotoran = 0.2;
}

// Mengambil pengaturan volume suara global dari local storage (rentang 0.0 - 1.0)
let globalVolume = parseFloat(localStorage.getItem('volumeGame'));
// Jika belum disetel di local storage, berikan nilai default volume maksimal (1.0)
if (isNaN(globalVolume)) globalVolume = 1.0;

// AUDIO ENGINE SYNTHESIZER
// Mendeteksi ketersediaan API AudioContext standar peramban modern atau versi WebKit
const AudioCtxEngine = window.AudioContext || window.webkitAudioContext;
// Variabel penampung instans AudioContext
let actx;
// Variabel pengontrol gain/volume utama (Master Gain Node)
let masterGain;

// Menginisialisasi sistem audio synthesizer secara aman saat interaksi pertama pengguna
function inisialisasiAudio() {
  // Memeriksa apakah AudioContext belum pernah dibuat sebelumnya
  if (!actx) {
    try {
      // Membuat instans baru AudioContext
      actx = new AudioCtxEngine();
      // Membuat node pengatur volume master
      masterGain = actx.createGain();
      // Menghubungkan node master gain langsung ke speaker/output suara peramban
      masterGain.connect(actx.destination);
      // Mengatur volume awal node master gain sesuai preferensi global
      masterGain.gain.value = globalVolume;
    } catch (e) {
      // Menampilkan pesan peringatan di konsol apabila inisialisasi audio gagal
      console.warn("Audio Context init error:", e);
    }
  }
  // Membangunkan status audio jika sedang dalam kondisi suspended (kebijakan autoplay browser)
  if (actx && actx.state === 'suspended') actx.resume();
}

// Mengatur tingkat volume master audio secara dinamis
function aturVolume(vol) {
  // Memperbarui variabel volume global
  globalVolume = parseFloat(vol);
  // Mengatur nilai gain pada masterGain node audio synthesizer seketika
  if (masterGain && actx) masterGain.gain.setValueAtTime(globalVolume, actx.currentTime);
}

// Memainkan nada sintetis gelombang frekuensi (synthesizer tone generator)
// Parameter: type (tipe gelombang oscillator), f0 (frekuensi awal), f1 (frekuensi akhir), dur (durasi detik), gVal (volume gain), isRamp (interpolasi eksponensial)
function playTone(type, f0, f1, dur, gVal = 0.3, isRamp = true) {
  // Membatalkan pemutaran jika volume disetel hening (mute)
  if (globalVolume <= 0) return;
  // Memastikan audio context telah diinisialisasi
  inisialisasiAudio();
  // Membatalkan jika instans audio context atau master gain tidak tersedia
  if (!actx || !masterGain) return;
  // Menyiapkan waktu audio saat ini, node oscillator untuk frekuensi, dan node gain untuk amplop volume
  let now = actx.currentTime, osc = actx.createOscillator(), g = actx.createGain();
  // Menentukan jenis bentuk gelombang ('sine', 'sawtooth', 'triangle', 'square')
  osc.type = type;
  // Menyetel frekuensi dasar nada awal
  osc.frequency.setValueAtTime(f0, now);
  // Mengatur pergeseran nada (pitch bend / glide) jika frekuensi akhir berbeda
  if (f1 && f1 !== f0) {
    if (isRamp) osc.frequency.exponentialRampToValueAtTime(Math.max(10, f1), now + dur);
    else osc.frequency.setValueAtTime(f1, now + dur * 0.4);
  }
  // Mengatur volume awal nada
  g.gain.setValueAtTime(gVal, now);
  // Menerapkan efek fade-out linear hingga suara menghilang di akhir durasi
  g.gain.linearRampToValueAtTime(0.001, now + dur);
  // Menghubungkan oscillator ke amplifier gain lokal
  osc.connect(g); g.connect(masterGain);
  // Memulai pembangkitan nada pada waktu sekarang
  osc.start(now); osc.stop(now + dur);
}

// Memutar efek suara prosedural sintesis berdasarkan jenis peristiwa dalam permainan
function mainkanSuara(jenis) {
  // Efek suara sabetan pedang tajam (sawtooth berkecepatan tinggi)
  if (jenis === 'slash') playTone('sawtooth', 550, 80, 0.12, 0.4);
  // Efek suara denting saat memungut koin atau berlian (sine pitch naik)
  else if (jenis === 'coin') playTone('sine', 980, 1320, 0.25, 0.35, false);
  // Efek suara desingan lemparan shuriken tajam
  else if (jenis === 'shuriken') playTone('triangle', 900, 120, 0.1, 0.3);
  // Efek suara benturan logam saat serangan terblokir tameng juggernaut
  else if (jenis === 'block') playTone('square', 220, 60, 0.2, 0.6);
  // Efek suara peringatan radar senter musuh (tanda seru)
  else if (jenis === 'alert') playTone('sine', 520, 680, 0.14, 0.18, false);
  // Efek suara gerakan menerjang cepat (dash ninja)
  else if (jenis === 'dash') playTone('triangle', 160, 40, 0.15, 0.3);
  // Efek nada rendah saat kalah tertangkap musuh
  else if (jenis === 'lose') playTone('sawtooth', 320, 45, 0.8, 0.35);
  // Efek suara aktifnya sihir skill bayangan / waktu
  else if (jenis === 'magic') playTone('sine', 450, 950, 0.5, 0.35);
  // Efek nada eror saat aksi gagal atau tidak mencukupi energi
  else if (jenis === 'error') playTone('square', 140, 110, 0.2, 0.3, false);
  // Efek nada sirine alarm cctv berulang melengking
  else if (jenis === 'alarm') playTone('sawtooth', 800, 1200, 0.2, 0.25);
  // Nada kemenangan akor arpeggio saat menyelesaikan tahap permainan
  else if (jenis === 'win' && actx && masterGain) {
    // Memainkan susunan 4 tangga nada C mayor melodi kemenangan
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      let t = actx.currentTime + i * 0.12, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.25, t); g.gain.linearRampToValueAtTime(0.001, t + 0.4);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.4);
    });
  }
}

// KONTROL INPUT
// Objek penyimpan status tombol navigasi kibor yang sedang ditekan
const keys = { w: false, a: false, s: false, d: false, shift: false };

// Event listener saat tombol pada kibor ditekan ke bawah (keydown)
window.addEventListener("keydown", (e) => {
  // Inisialisasi audio pada interaksi tombol pertama
  inisialisasiAudio();
  // Mengonversi karakter tombol ke huruf kecil
  let k = e.key.toLowerCase();

  // WASD & Arrow Keys
  // Bergerak maju / ke atas
  if (k === "w" || e.key === "ArrowUp") keys.w = true;
  // Bergerak ke kiri
  if (k === "a" || e.key === "ArrowLeft") keys.a = true;
  // Bergerak mundur / ke bawah
  if (k === "s" || e.key === "ArrowDown") keys.s = true;
  // Bergerak ke kanan
  if (k === "d" || e.key === "ArrowRight") keys.d = true;
  // Tombol Shift untuk berlari kencang / sprint
  if (e.key === "Shift") keys.shift = true;

  // Aksi & Skill
  // Tombol L: Eksekusi serangan jarak dekat / bunuh musuh
  if (k === "l") bunuhMusuh();
  // Tombol J: Mengaktifkan jurus tebasan beruntun (Rapid Slash)
  if (k === "j") gunakanSkillRapidSlash();
  // Tombol Q: Mengaktifkan mode siluman hantu (Ghost Mode)
  if (k === "q") gunakanSkillGhost();
  // Tombol P: Melakukan teleportasi kilat ke depan (Blink Strike)
  if (k === "p") gunakanSkillBlink();
  // Tombol C: Melemparkan senjata bintang shuriken
  if (k === "c") lemparShuriken();
  // Tombol I: Mengaktifkan skill manipulasi waktu (Time Freeze)
  if (k === "i") gunakanSkillTime();
  // Tombol T: Mengeluarkan bayangan penipu (Shadow Clone)
  if (k === "t") gunakanSkillClone();

  // Restart & Lanjut
  // Tombol R: Mengulang permainan saat berada di layar kekalahan (Game Over)
  if (k === "r" && window.gameState === "lose") resetGame(currentLevel, currentStage);
  // Tombol Enter: Melanjutkan ke level/tahap berikutnya setelah menang
  if (e.key === "Enter" && window.gameState === "win") {
    // Jika baru saja menamatkan Level 3 Tahap 3, buka Tahap 4 Rahasia (Secret Trial)
    if (currentLevel === 3 && currentStage === 3) {
      resetGame(3, 4);
    // Jika masih ada tahap selanjutnya dalam sektor yang sama
    } else if (currentStage < 3) {
      resetGame(currentLevel, currentStage + 1);
    // Jika seluruh level telah tamat, kembalikan pemain ke halaman menu utama (index.html)
    } else {
      window.location.href = "index.html";
    }
  }

  // Pause Menu [ESC]
  // Menjeda atau melanjutkan permainan saat tombol Escape ditekan
  if (e.key === "Escape") {
    // Buka pengaturan jeda jika sedang dalam mode bermain
    if (window.gameState === "playing") {
      if (typeof bukaPengaturan === "function") bukaPengaturan();
    // Lanjutkan permainan jika saat ini sedang dijeda
    } else if (window.gameState === "paused") {
      if (typeof lanjutMain === "function") lanjutMain();
    }
  }
});

// Event listener saat tombol kibor dilepaskan (keyup)
window.addEventListener("keyup", (e) => {
  let k = e.key.toLowerCase();
  // Melepaskan tombol W atau panah atas
  if (k === "w" || e.key === "ArrowUp") keys.w = false;
  // Melepaskan tombol A atau panah kiri
  if (k === "a" || e.key === "ArrowLeft") keys.a = false;
  // Melepaskan tombol S atau panah bawah
  if (k === "s" || e.key === "ArrowDown") keys.s = false;
  // Melepaskan tombol D atau panah kanan
  if (k === "d" || e.key === "ArrowRight") keys.d = false;
  // Melepaskan tombol Shift
  if (e.key === "Shift") keys.shift = false;
});

// Event listener saat jendela browser kehilangan fokus (tab berganti / blur)
window.addEventListener("blur", () => {
  // Mereset seluruh status input gerakan agar karakter tidak terus berjalan otomatis
  keys.w = false;
  keys.a = false;
  keys.s = false;
  keys.d = false;
  keys.shift = false;
});

// STATUS GAME & VARIABLE DUNIA
// Menunjukkan nomor sektor level permainan aktif saat ini (1 sampai 3)
let currentLevel = 1;
// Menunjukkan nomor tahap babak aktif saat ini (1 sampai 4)
let currentStage = 1;

// Objek penyimpan catatan performa dan statistik ronde yang sedang berlangsung
let stats = {
  // Jumlah total musuh yang telah dibunuh di tahap ini
  killCount: 0,
  // Jumlah pembunuhan senyap tanpa terdeteksi
  stealthKills: 0,
  // Jumlah berapa kali alarm peringatan terpancing
  alarmsTriggered: 0,
  // Jumlah total dokumen intel yang harus diambil di tahap ini
  intelMaks: 0,
  // Jumlah koin yang sedang berada dan terkumpul di arena
  koinDiArena: 0,
  // Jumlah simpanan mata uang permata berlian (diamankan di local storage)
  diamonds: parseInt(localStorage.getItem('ninjaDiamonds')) || 0
};

// Deklarasi kumpulan variabel entitas dan rintangan arena permainan
let pemain, musuh, intels, slashes, kotoran = [], tembok, sembunyi, hazards = [], koinMaps = [], shurikens = [], teksMelayang = [], vfxArray = [], regenItems = [];
// Deklarasi variabel proyektil musuh, permata di arena, dan koordinat helipad portal keluar
let enemyBullets = [], diamonds = [], exitPortal = { x: 920, y: 350, active: false };
// Array penampung partikel debu/cahaya atmosfer di latar belakang
let partikelAmbien = [];
// Jarak jangkauan pandangan senter musuh (dalam piksel)
let JARAK_PANDANG = 250;
// Magnitudo efek guncangan layar saat terjadi benturan/ledakan
let getarLayar = 0;
// Penghitung siklus frame animasi permainan yang berjalan
let frameCount = 0;
// Sudut lebar busur kerucut pandang penglihatan musuh (dalam radian: 45 derajat)
const LEBAR_PANDANG = Math.PI / 4;
// Penanda status apakah pemain sedang melakukan manuver menerjang (dashing)
let isDashing = false;
// Waktu durasi sirine alarm CCTV yang sedang berbunyi
let cctvAlarmTimer = 0;
// Waktu jeda agar efek suara tanda seru musuh tidak bertabrakan berisik
let alertSoundCooldown = 0; // Throttle cooldown agar suara senter tidak berulang-ulang berlebihan

// TRACKING DAILY QUEST STATS UNTUK LOBBY
// Mencatat kemajuan misi harian pengguna dan meresetnya secara berkala per hari
function recordDailyStat(key, amount = 1) {
  // Mengambil tanggal hari ini dalam format lokal
  let today = new Date().toLocaleDateString();
  // Memeriksa jika tanggal berganti, lakukan reset misi harian baru
  if (localStorage.getItem('daily_quest_date') !== today) {
    localStorage.setItem('daily_quest_date', today);
    localStorage.setItem('daily_kills', '0');
    localStorage.setItem('daily_intel', '0');
    localStorage.setItem('daily_stages', '0');
    localStorage.setItem('daily_boss', '0');
  }
  // Menambahkan progres angka statistik harian pada key tertentu
  let cur = parseInt(localStorage.getItem(key)) || 0;
  localStorage.setItem(key, cur + amount);
}

// Mouse click attack / takedown
// Menangani serangan eksekusi jarak dekat saat tombol kiri mouse diklik
canvas.addEventListener("mousedown", (e) => {
  // Menginisialisasi sistem audio jika belum aktif
  inisialisasiAudio();
  // Hanya proses jika permainan sedang berlangsung
  if (window.gameState !== "playing") return;
  // Tombol mouse 0 adalah klik kiri
  if (e.button === 0) {
    bunuhMusuh();
  }
});

// UPDATE DISPLAY HP PLAYER KE UI
// Memperbarui indikator angka dan bilah bar HP pemain di bagian atas antarmuka
function updateHpUI() {
  // Mengambil elemen teks tampilan angka HP
  let hpElem = document.getElementById("angka-player-hp");
  // Mengambil elemen bilah bar pengisi HP
  let barElem = document.getElementById("bar-player-hp-fill");
  // Memperbarui teks HP (misal: "12 / 12")
  if (hpElem && pemain) hpElem.innerText = `${Math.max(0, Math.ceil(pemain.hp))} / ${pemain.maxHp}`;
  // Memperbarui lebar persentase dan warna gradien bilah HP
  if (barElem && pemain) {
    let pct = Math.max(0, Math.min(100, (pemain.hp / pemain.maxHp) * 100));
    barElem.style.width = pct + "%";
    // Warna hijau kekuningan jika darah di atas 45%
    if (pct > 45) barElem.style.background = "linear-gradient(90deg, #f59e0b, #22c55e)";
    // Warna kuning oranye jika darah antara 25% hingga 45%
    else if (pct > 25) barElem.style.background = "linear-gradient(90deg, #ef4444, #f59e0b)";
    // Warna merah kritis jika darah di bawah 25%
    else barElem.style.background = "#ef4444";
  }
}

// JATUHKAN REGEN ITEM SAAT MUSUH MATI
// Menjatuhkan paket pemulih darah (Health Pack) pada koordinat musuh yang terbunuh
function dropRegenItem(x, y) {
  regenItems.push({
    // Posisi horizontal titik jatuh item
    x: x,
    // Posisi vertikal titik jatuh item
    y: y,
    // Jumlah penambahan poin HP saat dipungut
    heal: 3,
    // Offset acak untuk animasi mengapung item
    frame: Math.random() * 100,
    // Status apakah item telah diambil oleh pemain
    collected: false
  });
}

// SISTEM TEKS MELAYANG (FLOATING TEXT)
// Memunculkan pesan melayang di atas koordinat tertentu di arena
function munculkanTeks(x, y, teks, warna) {
  teksMelayang.push({
    // Koordinat x kemunculan teks
    x: x,
    // Koordinat y kemunculan teks
    y: y,
    // Kalimat/pesan teks yang ditampilkan
    t: teks,
    // Warna tulisan teks
    c: warna || "#fff",
    // Tingkat transparansi teks (mulai dari 1.0 penuh)
    a: 1.0,
    // Ukuran skala teks
    scale: 1.0,
    // Kecepatan gerak melayang vertikal ke atas
    vy: -1.2
  });
}

// SISTEM PARTIKEL VFX
// Menghasilkan efek visual percikan ledakan atau gelombang kejut di arena
function tambahVFX(x, y, warna, tipe) {
  // Jumlah partikel yang akan diciptakan
  let count = 16;
  // Menangani efek visual tipe ledakan menyebar
  if (tipe === 'ledakan') {
    for (let i = 0; i < count; i++) {
      // Sudut acak lingkaran penuh 360 derajat
      let sudut = Math.random() * Math.PI * 2;
      // Kecepatan dorongan partikel secara acak
      let kec = Math.random() * 8 + 2;
      vfxArray.push({
        x: x,
        y: y,
        // Komponen kecepatan horizontal
        dx: Math.cos(sudut) * kec,
        // Komponen kecepatan vertikal
        dy: Math.sin(sudut) * kec,
        // Radius ukuran partikel
        r: Math.random() * 5 + 2,
        // Warna partikel
        c: warna,
        // Opasitas awal partikel
        a: 1,
        tipe: 'partikel'
      });
    }
  // Menangani efek visual tipe gelombang membesar
  } else if (tipe === 'gelombang') {
    vfxArray.push({
      x: x,
      y: y,
      // Radius awal gelombang
      r: 10,
      // Kecepatan ekspansi pertambahan radius gelombang
      dr: 12,
      c: warna,
      a: 0.8,
      tipe: 'gelombang'
    });
  }
}

// SISTEM PARTIKEL AMBIEN
// Menciptakan partikel debu halus atmosfer di latar belakang arena
function inisialisasiPartikelAmbien() {
  // Mengosongkan daftar partikel sebelumnya
  partikelAmbien = [];
  // Jumlah batas maksimal partikel di layar
  let maxCount = 35;
  for (let i = 0; i < maxCount; i++) {
    partikelAmbien.push({
      // Posisi horizontal acak di seluruh lebar canvas
      x: Math.random() * canvas.width,
      // Posisi vertikal acak di seluruh tinggi canvas
      y: Math.random() * canvas.height,
      // Radius partikel
      r: Math.random() * 2.5 + 1,
      // Kecepatan gerak horizontal halus
      dx: (Math.random() - 0.5) * 0.6,
      // Kecepatan gerak vertikal halus
      dy: (Math.random() - 0.5) * 0.6,
      // Tingkat transparansi partikel
      a: Math.random() * 0.4 + 0.2,
      // Warna cahaya partikel menyesuaikan tema lingkungan map
      glow: mapTheme === 'hutan' ? '#a3e635' : (mapTheme === 'lab' ? '#00e5ff' : '#e2e8f0')
    });
  }
}

// RAYCASTING KE TEMBOK (Slab Method - Exact & Fast)
// Menghitung jarak perpotongan sinar garis lurus terhadap kotak dinding menggunakan metode pemotongan slab
function hitRayWall(ox, oy, dx, dy, maxDist) {
  // Menginisialisasi jarak terdekat dengan jarak maksimal jangkauan pandang
  let closestDist = maxDist;
  // Memeriksa setiap rintangan dinding di arena
  for (let i = 0; i < tembok.length; i++) {
    let t = tembok[i];
    // Menghitung invers arah kecepatan untuk menghindari pembagian dengan nol
    let invX = dx !== 0 ? 1 / dx : 1e9;
    let invY = dy !== 0 ? 1 / dy : 1e9;
    // Jarak perpotongan batas horizontal kiri dan kanan dinding
    let t1 = (t.x - ox) * invX;
    let t2 = (t.x + t.w - ox) * invX;
    // Jarak perpotongan batas vertikal atas dan bawah dinding
    let t3 = (t.y - oy) * invY;
    let t4 = (t.y + t.h - oy) * invY;
    // Mengambil titik masuk sinar ke kotak batas
    let tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    // Mengambil titik keluar sinar dari kotak batas
    let tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    // Jika sinar memotong kotak dinding dan jaraknya lebih dekat dari rekor saat ini
    if (tmax >= 0 && tmin <= tmax && tmin < closestDist) {
      if (tmin > 0) closestDist = tmin;
    }
  }
  // Mengembalikan jarak benturan dinding terdekat
  return closestDist;
}

// ==========================================
// SISTEM NAVIGASI & PATHFINDING MUSUH (A*)
// ==========================================
// Ukuran per kotak grid sel navigasi dalam piksel (20x20 piksel)
const NAV_CELL = 20;
// Jumlah kolom pada grid navigasi horizontal (1000 / 20 = 50 kolom)
const NAV_COLS = 50; // 1000 / 20
// Jumlah baris pada grid navigasi vertikal (700 / 20 = 35 baris)
const NAV_ROWS = 35; // 700 / 20
// Array byte 1-dimensi untuk menandai sel navigasi yang bisa dilalui (0) atau terhalang dinding (1)
let navGrid = new Uint8Array(NAV_COLS * NAV_ROWS);

// Membangun peta petak navigasi rintangan dinding untuk pencarian jalur musuh
function bangunNavGrid() {
  // Memastikan data array tembok tersedia sebelum diproses
  if (!tembok || !Array.isArray(tembok)) return;
  // Mereset seluruh sel grid menjadi 0 (bisa dilewati)
  navGrid.fill(0);
  // Jarak radius bantalan aman agar tubuh musuh tidak menyenggol dinding saat berbelok
  const padding = 14; // Jarak radius aman terhadap tembok agar musuh tidak tersangkut
  // Melakukan iterasi di setiap baris petak navigasi
  for (let gy = 0; gy < NAV_ROWS; gy++) {
    // Melakukan iterasi di setiap kolom petak navigasi
    for (let gx = 0; gx < NAV_COLS; gx++) {
      // Titik tengah sel grid horizontal
      let cx = gx * NAV_CELL + NAV_CELL / 2;
      // Titik tengah sel grid vertikal
      let cy = gy * NAV_CELL + NAV_CELL / 2;
      // Penanda sel terblokir
      let blocked = false;
      // Memeriksa tabrakan titik tengah sel terhadap setiap balok tembok
      for (let t of tembok) {
        if (cx + padding > t.x && cx - padding < t.x + t.w &&
          cy + padding > t.y && cy - padding < t.y + t.h) {
          blocked = true;
          break;
        }
      }
      // Menandai sel grid sebagai terhalang (nilai 1) jika menabrak tembok
      if (blocked) {
        navGrid[gy * NAV_COLS + gx] = 1;
      }
    }
  }
}

// Memeriksa apakah terdapat garis pandang langsung tanpa terhalang tembok antara dua titik koordinat
function hasLineOfSight(x1, y1, x2, y2, radius = 12) {
  // Selisih jarak horizontal
  let dx = x2 - x1;
  // Selisih jarak vertikal
  let dy = y2 - y1;
  // Jarak lurus Euclidean total
  let dist = Math.hypot(dx, dy);
  // Jika jarak sangat dekat, pandangan dianggap langsung tembus
  if (dist < 1) return true;
  // Membagi garis menjadi sejumlah langkah pengujian tabrakan
  let steps = Math.ceil(dist / 14);
  let stepX = dx / steps;
  let stepY = dy / steps;
  // Menelusuri setiap titik sampel di sepanjang garis
  for (let i = 1; i < steps; i++) {
    let px = x1 + stepX * i;
    let py = y1 + stepY * i;
    // Jika titik sampel menabrak tembok, garis pandang terputus
    if (cekTabrakanTembok(px, py, radius)) {
      return false;
    }
  }
  // Tidak ada rintangan dinding yang menghalangi
  return true;
}

// Algoritma pencarian rute terpendek A* (A-Star Pathfinding) untuk pergerakan cerdas musuh mengitari rintangan
function cariJalanAStar(startX, startY, targetX, targetY, maxSteps = 450) {
  // Jika target langsung terlihat tanpa terhalang dinding, tuju langsung!
  if (hasLineOfSight(startX, startY, targetX, targetY, 12)) {
    return [{ x: targetX, y: targetY }];
  }

  // Menentukan indeks kolom dan baris sel awal
  let sGx = Math.max(0, Math.min(NAV_COLS - 1, Math.floor(startX / NAV_CELL)));
  let sGy = Math.max(0, Math.min(NAV_ROWS - 1, Math.floor(startY / NAV_CELL)));
  // Menentukan indeks kolom dan baris sel target
  let tGx = Math.max(0, Math.min(NAV_COLS - 1, Math.floor(targetX / NAV_CELL)));
  let tGy = Math.max(0, Math.min(NAV_ROWS - 1, Math.floor(targetY / NAV_CELL)));

  // Jika target cell terblokir (misal player dekat dinding), cari tetangga terdekat yang bebas
  if (navGrid[tGy * NAV_COLS + tGx] === 1) {
    let bestDist = Infinity, bestX = tGx, bestY = tGy;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        let nx = tGx + dx, ny = tGy + dy;
        if (nx >= 0 && nx < NAV_COLS && ny >= 0 && ny < NAV_ROWS && navGrid[ny * NAV_COLS + nx] === 0) {
          let d = Math.hypot(nx - tGx, ny - tGy);
          if (d < bestDist) {
            bestDist = d; bestX = nx; bestY = ny;
          }
        }
      }
    }
    tGx = bestX; tGy = bestY;
  }

  // Jika start cell terblokir, cari tetangga terdekat yang bebas
  if (navGrid[sGy * NAV_COLS + sGx] === 1) {
    let bestDist = Infinity, bestX = sGx, bestY = sGy;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        let nx = sGx + dx, ny = sGy + dy;
        if (nx >= 0 && nx < NAV_COLS && ny >= 0 && ny < NAV_ROWS && navGrid[ny * NAV_COLS + nx] === 0) {
          let d = Math.hypot(nx - sGx, ny - sGy);
          if (d < bestDist) {
            bestDist = d; bestX = nx; bestY = ny;
          }
        }
      }
    }
    sGx = bestX; sGy = bestY;
  }

  // Jika titik awal dan tujuan berada pada petak yang sama, langsung kembalikan titik target
  if (sGx === tGx && sGy === tGy) {
    return [{ x: targetX, y: targetY }];
  }

  // Menghitung jumlah total sel grid
  const numCells = NAV_COLS * NAV_ROWS;
  // Array skor biaya perjalanan dari titik awal ke sel tertentu (gScore)
  const gScore = new Float32Array(numCells).fill(1e9);
  // Array estimasi biaya total dari awal ke tujuan melewati sel tertentu (fScore)
  const fScore = new Float32Array(numCells).fill(1e9);
  // Array pelacak jejak asal rute sel sebelumnya
  const cameFrom = new Int32Array(numCells).fill(-1);
  // Himpunan sel yang telah selesai dievaluasi (closed set)
  const closed = new Uint8Array(numCells);

  // Indeks indeks array 1D untuk titik awal dan akhir
  const startIdx = sGy * NAV_COLS + sGx;
  const targetIdx = tGy * NAV_COLS + tGx;

  // Biaya gScore awal adalah 0
  gScore[startIdx] = 0;
  // Nilai heuristik awal adalah jarak garis lurus ke target
  fScore[startIdx] = Math.hypot(tGx - sGx, tGy - sGy);

  // Daftar antrean sel terbuka yang akan diperiksa (open set)
  const openSet = [startIdx];
  let steps = 0;
  let found = false;

  // Daftar 8 arah pergerakan (4 mata angin utama dengan biaya 1, dan 4 diagonal dengan biaya akar 2 / 1.414)
  const dirs = [
    { dx: 1, dy: 0, cost: 1 }, { dx: -1, dy: 0, cost: 1 },
    { dx: 0, dy: 1, cost: 1 }, { dx: 0, dy: -1, cost: 1 },
    { dx: 1, dy: 1, cost: 1.414 }, { dx: -1, dy: 1, cost: 1.414 },
    { dx: 1, dy: -1, cost: 1.414 }, { dx: -1, dy: -1, cost: 1.414 }
  ];

  // Loop utama pencarian jalur A*
  while (openSet.length > 0 && steps++ < maxSteps) {
    let bestI = 0;
    let current = openSet[0];
    // Mencari simpul dengan nilai fScore paling rendah di dalam openSet
    for (let i = 1; i < openSet.length; i++) {
      if (fScore[openSet[i]] < fScore[current]) {
        current = openSet[i];
        bestI = i;
      }
    }

    // Jika simpul tujuan telah tercapai, hentikan pencarian
    if (current === targetIdx) {
      found = true;
      break;
    }

    // Pindahkan simpul terpilih dari openSet ke himpunan tertutup (closed set)
    openSet.splice(bestI, 1);
    closed[current] = 1;

    // Mendapatkan koordinat grid kolom dan baris sel saat ini
    let cx = current % NAV_COLS;
    let cy = Math.floor(current / NAV_COLS);

    // Memeriksa ke-8 arah tetangga
    for (let d of dirs) {
      let nx = cx + d.dx;
      let ny = cy + d.dy;
      // Lewati jika koordinat berada di luar batas arena permainan
      if (nx < 0 || nx >= NAV_COLS || ny < 0 || ny >= NAV_ROWS) continue;

      let nIdx = ny * NAV_COLS + nx;
      // Lewati jika sudah dievaluasi atau terhalang dinding
      if (closed[nIdx] || navGrid[nIdx] === 1) continue;

      // Cegah memotong sudut dinding pada diagonal
      if (d.dx !== 0 && d.dy !== 0) {
        if (navGrid[cy * NAV_COLS + nx] === 1 || navGrid[ny * NAV_COLS + cx] === 1) {
          continue;
        }
      }

      // Menghitung biaya perjalanan sementara menuju simpul tetangga
      let tentativeG = gScore[current] + d.cost;
      // Jika ditemukan jalur yang lebih baik menuju simpul ini
      if (tentativeG < gScore[nIdx]) {
        cameFrom[nIdx] = current;
        gScore[nIdx] = tentativeG;
        fScore[nIdx] = tentativeG + Math.hypot(tGx - nx, tGy - ny);
        if (!openSet.includes(nIdx)) {
          openSet.push(nIdx);
        }
      }
    }
  }

  // Jika jalur tidak ditemukan hingga batas langkah maksimal, langsung arahkan ke target
  if (!found) {
    return [{ x: targetX, y: targetY }];
  }

  // Rekonstruksi jalur rute dari target kembali ke titik awal
  let path = [];
  let curr = targetIdx;
  while (curr !== -1 && curr !== startIdx) {
    let px = (curr % NAV_COLS) * NAV_CELL + NAV_CELL / 2;
    let py = Math.floor(curr / NAV_COLS) * NAV_CELL + NAV_CELL / 2;
    path.unshift({ x: px, y: py });
    curr = cameFrom[curr];
  }
  // Menambahkan titik koordinat akhir target
  path.push({ x: targetX, y: targetY });

  // String pulling / Smoothing agar musuh berjalan melingkar halus mengitari sudut tembok
  // Menghapus titik-titik simpul tengah yang tidak perlu jika garis pandang langsung tersedia
  if (path.length > 2) {
    let smoothed = [path[0]];
    let curIdx = 0;
    while (curIdx < path.length - 1) {
      let furthest = curIdx + 1;
      // Mencari simpul terjauh di depan yang masih memiliki garis pandang bebas tembok
      for (let testIdx = path.length - 1; testIdx > curIdx + 1; testIdx--) {
        if (hasLineOfSight(path[curIdx].x, path[curIdx].y, path[testIdx].x, path[testIdx].y, 12)) {
          furthest = testIdx;
          break;
        }
      }
      smoothed.push(path[furthest]);
      curIdx = furthest;
    }
    path = smoothed;
  }

  // Mengembalikan rangkaian koordinat jalur yang telah dihaluskan
  return path;
}

// DATA MAP & ARENA
// DATA MAP & ARENA (HUNTER ASSASSIN COMPOUNDS - MULTI-ROOM MAZES)
// Struktur data konfigurasi seluruh level (1 sampai 3) beserta tahapan (stage) di dalamnya
const mapData = {
  // =========================================================================
  // SEKTOR 1: WAREHOUSE & LOGISTICS DISTRICT
  // =========================================================================
  1: {
    // SEKTOR 1 - TAHAP 1
    1: {
      // SEKTOR 1 TAHAP 1: WAREHOUSE DEPOT INFILTRATION
      // Daftar balok tembok rintangan (x: posisi x, y: posisi y, w: lebar, h: tinggi)
      tembok: [
        // Dinding pembatas luar arena (atas dan bawah)
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        // Dinding pembatas luar arena (kiri dan kanan)
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // West Wing Rooms & Hallways: Koridor dan ruangan sayap barat
        { x: 190, y: 20, w: 24, h: 260 }, { x: 190, y: 400, w: 24, h: 280 },
        // Central Office & Corridor Walls: Dinding ruangan kantor tengah
        { x: 380, y: 140, w: 240, h: 24 }, { x: 490, y: 164, w: 24, h: 230 },
        { x: 380, y: 510, w: 260, h: 24 },
        // East Vault & Storage Walls: Ruang penyimpanan brankas timur
        { x: 730, y: 20, w: 24, h: 280 }, { x: 730, y: 420, w: 24, h: 260 },
        // Tactical Crates & Cover Pillars: Kotak kargo taktis tempat berlindung dari tembakan & pandangan
        { x: 70, y: 310, w: 50, h: 50 }, { x: 260, y: 260, w: 45, h: 45 },
        { x: 620, y: 230, w: 45, h: 45 }, { x: 320, y: 560, w: 50, h: 50 },
        { x: 630, y: 570, w: 45, h: 45 }, { x: 840, y: 260, w: 50, h: 50 },
        { x: 840, y: 450, w: 50, h: 50 }
      ],
      // Zona persembunyian (semak/ventilasi) tempat pemain tidak terlihat oleh musuh
      sembunyi: [
        // Zona sembunyi barat daya
        { x: 35, y: 560, w: 80, h: 80 },
        // Zona sembunyi utara tengah
        { x: 420, y: 35, w: 80, h: 70 },
        // Zona sembunyi timur laut
        { x: 880, y: 35, w: 80, h: 70 }
      ],
      // Daftar penempatan musuh patroli awal (x, y: posisi; r: radius; tipe: jenis; hp, maxHp: darah; pDx, pDy: laju patroli)
      musuh: [
        // Kroco patroli horizontal di koridor utara
        { x: 300, y: 75, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 2.5, pDy: 0 },
        // Kroco patroli vertikal di dekat kantor tengah
        { x: 640, y: 310, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 2.5 },
        // Kroco patroli horizontal di koridor selatan
        { x: 540, y: 620, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: -2.5, pDy: 0 },
        // Kroco patroli vertikal di lorong timur
        { x: 860, y: 460, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: -2.5 }
      ],
      // Daftar koordinat berkas rahasia intel yang wajib dikoleksi
      intels: [{ x: 90, y: 90 }, { x: 430, y: 260 }, { x: 900, y: 90 }],
      // Daftar koordinat permata berlian bonus (val: nilai perolehan)
      diamonds: [
        { x: 80, y: 80, val: 5 },
        { x: 440, y: 280, val: 10 },
        { x: 900, y: 120, val: 5 },
        { x: 260, y: 620, val: 5 }
      ],
      // Daftar jebakan dan bahaya lingkungan (cctv: kamera pemantau berputar; trap: jebakan lantai)
      hazards: [
        // Kamera CCTV pemantau di koridor kantor (sBase: sudut dasar, sw: rentang sapuan)
        { tipe: "cctv", x: 490, y: 140, sBase: Math.PI / 2, sw: Math.PI / 4 },
        // Perangkap lantai paku di koridor tengah bawah
        { tipe: "trap", x: 500, y: 420, w: 40, h: 40 }
      ],
      // Lokasi kantong koin emas di arena
      koin: [{ x: 100, y: 600 }, { x: 600, y: 100 }],
      // Titik pintu keluar helipad ekstraksi
      exit: { x: 900, y: 580 }
    },
    // SEKTOR 1 - TAHAP 2
    2: {
      // SEKTOR 1 TAHAP 2: CARGO VAULT & CHOKEPOINTS
      // Rintangan dinding koridor bersiku dan brankas kargo
      tembok: [
        // Tembok pembatas terluar
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // L-Shaped Hallways & Rooms: Koridor berbentuk L dan sekat kamar brankas
        { x: 200, y: 140, w: 320, h: 24 }, { x: 200, y: 140, w: 24, h: 360 },
        { x: 420, y: 280, w: 340, h: 24 }, { x: 740, y: 140, w: 24, h: 380 },
        { x: 280, y: 480, w: 360, h: 24 },
        // Crates & Barricades: Barikade tumpukan peti logistik
        { x: 90, y: 80, w: 50, h: 50 }, { x: 80, y: 380, w: 45, h: 45 },
        { x: 320, y: 210, w: 50, h: 45 }, { x: 580, y: 210, w: 45, h: 45 },
        { x: 580, y: 380, w: 50, h: 50 }, { x: 860, y: 240, w: 45, h: 45 },
        { x: 860, y: 460, w: 50, h: 50 }
      ],
      // Tempat sembunyi pemain
      sembunyi: [
        { x: 45, y: 45, w: 80, h: 80 },
        { x: 460, y: 45, w: 80, h: 70 },
        { x: 870, y: 560, w: 80, h: 80 }
      ],
      // Musuh penjaga gudang kargo
      musuh: [
        // Kroco patroli horizontal atas
        { x: 340, y: 80, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 2.8, pDy: 0 },
        // Juggernaut bertameng tebal di koridor tengah
        { x: 500, y: 200, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 2.0, pDy: 0 },
        // Kroco patroli vertikal barat
        { x: 120, y: 320, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 2.5 },
        // Kroco patroli vertikal timur
        { x: 840, y: 340, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: -2.5 },
        // Kroco patroli horizontal lorong selatan
        { x: 500, y: 600, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: -2.8, pDy: 0 }
      ],
      // Berkas intelijen yang harus diambil
      intels: [{ x: 100, y: 600 }, { x: 500, y: 340 }, { x: 900, y: 80 }],
      // Berlian tersembunyi
      diamonds: [
        { x: 90, y: 240, val: 5 }, { x: 480, y: 240, val: 10 },
        { x: 910, y: 320, val: 5 }, { x: 360, y: 600, val: 5 }
      ],
      // Rintangan CCTV dan jebakan lantai
      hazards: [
        // Kamera CCTV di sudut dinding brankas timur
        { tipe: "cctv", x: 740, y: 140, sBase: Math.PI, sw: Math.PI / 3 },
        // Jebakan perangkap di lorong selatan
        { tipe: "trap", x: 260, y: 540, w: 50, h: 50 }
      ],
      // Koin emas
      koin: [{ x: 400, y: 340 }, { x: 800, y: 500 }],
      // Titik keluar
      exit: { x: 900, y: 120 }
    },
    // SEKTOR 1 - TAHAP 3
    3: {
      // SEKTOR 1 TAHAP 3: SYNDICATE EXECUTIVE LAIR (BOSS COMPOUND)
      // Dinding ruang markas eksekutif sindikat
      tembok: [
        // Tembok pembatas arena
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Executive Chamber: Dinding aula ruang utama pertemuan eksekutif
        { x: 160, y: 140, w: 680, h: 24 }, { x: 160, y: 520, w: 680, h: 24 },
        { x: 320, y: 240, w: 24, h: 200 }, { x: 660, y: 240, w: 24, h: 200 },
        // Pillars & Crates: Pilar penopang bangunan dan peti pelindung
        { x: 80, y: 260, w: 45, h: 45 }, { x: 80, y: 400, w: 45, h: 45 },
        { x: 440, y: 240, w: 120, h: 24 }, { x: 440, y: 420, w: 120, h: 24 },
        { x: 880, y: 260, w: 45, h: 45 }, { x: 880, y: 400, w: 45, h: 45 }
      ],
      // Tempat bersembunyi di sekitar ruangan bos
      sembunyi: [
        { x: 45, y: 560, w: 80, h: 80 }, { x: 870, y: 560, w: 80, h: 80 },
        { x: 460, y: 45, w: 80, h: 70 }
      ],
      // Musuh termasuk Bos Sindikat
      musuh: [
        // Boss utama sektor 1 (darah tebal 16 HP, kecepatan tinggi)
        { x: 500, y: 340, r: 28, tipe: "boss", hp: 16, maxHp: 16, pDx: 3.2, pDy: 3.2 },
        // Pengawal Juggernaut sisi kiri
        { x: 240, y: 220, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 0, pDy: 2.2 },
        // Pengawal Juggernaut sisi kanan
        { x: 760, y: 440, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 0, pDy: -2.2 }
      ],
      // Berkas rahasia intelijen
      intels: [{ x: 500, y: 200 }, { x: 90, y: 90 }, { x: 910, y: 90 }],
      // Hadiah permata bernilai tinggi
      diamonds: [
        { x: 80, y: 80, val: 10 }, { x: 910, y: 80, val: 10 },
        { x: 500, y: 480, val: 15 }, { x: 240, y: 600, val: 5 }
      ],
      // CCTV pemantau aula dan jebakan ganda
      hazards: [
        { tipe: "cctv", x: 500, y: 140, sBase: Math.PI / 2, sw: Math.PI / 2.5 },
        { tipe: "trap", x: 240, y: 340, w: 45, h: 45 },
        { tipe: "trap", x: 730, y: 340, w: 45, h: 45 }
      ],
      // Koin emas
      koin: [{ x: 240, y: 300 }, { x: 760, y: 300 }],
      // Titik keluar ekstraksi
      exit: { x: 900, y: 580 }
    }
  },
  // =========================================================================
  // SEKTOR 2: BIO-RESEARCH LABS & JUNGLE FACILITY
  // =========================================================================
  2: {
    // SEKTOR 2 - TAHAP 1
    1: {
      // SEKTOR 2 TAHAP 1: BIO-RESEARCH JUNGLE OUTPOST
      // Tembok laboratorium penelitian hayati di pedalaman hutan
      tembok: [
        // Pembatas luar arena
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Dinding isolasi laboratorium
        { x: 220, y: 140, w: 24, h: 420 }, { x: 740, y: 140, w: 24, h: 420 },
        { x: 380, y: 240, w: 240, h: 24 }, { x: 380, y: 440, w: 240, h: 24 },
        // Pilar penahan beban struktur
        { x: 100, y: 320, w: 45, h: 45 }, { x: 860, y: 320, w: 45, h: 45 },
        { x: 480, y: 330, w: 45, h: 45 }
      ],
      // Tempat persembunyian lebat
      sembunyi: [
        { x: 45, y: 45, w: 90, h: 90 }, { x: 860, y: 550, w: 90, h: 90 },
        { x: 455, y: 45, w: 90, h: 75 }
      ],
      // Pasukan patroli pos bio-riset
      musuh: [
        // Kroco patroli vertikal sisi kiri
        { x: 140, y: 120, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 2.5 },
        // Kroco patroli vertikal sisi kanan
        { x: 860, y: 560, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: -2.5 },
        // Kroco patroli koridor horizontal atas
        { x: 490, y: 160, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 2.8, pDy: 0 },
        // Kroco patroli koridor horizontal bawah
        { x: 490, y: 520, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: -2.8, pDy: 0 }
      ],
      // Dokumen hasil riset biologi yang dicari
      intels: [{ x: 300, y: 330 }, { x: 100, y: 600 }, { x: 900, y: 100 }],
      // Berlian tersembunyi
      diamonds: [
        { x: 90, y: 80, val: 5 }, { x: 490, y: 395, val: 10 },
        { x: 900, y: 120, val: 5 }, { x: 300, y: 600, val: 5 }
      ],
      // Jebakan daun rimbun dan perangkap paku
      hazards: [
        // Tumpukan dedaunan yang dapat memperlambat gerakan
        { tipe: "daun", x: 300, y: 300, r: 50 },
        // Perangkap paku tersembunyi di tanah
        { tipe: "trap", x: 490, y: 80, w: 50, h: 50 }
      ],
      // Koin di arena
      koin: [{ x: 500, y: 100 }, { x: 200, y: 400 }],
      // Helipad pintu evakuasi
      exit: { x: 900, y: 580 }
    },
    // SEKTOR 2 - TAHAP 2
    2: {
      // SEKTOR 2 TAHAP 2: JUNGLE BARRACKS
      // Tembok barak militer di kawasan hutan
      tembok: [
        // Dinding pembatas luar
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Sekat dinding barak panjang
        { x: 200, y: 100, w: 30, h: 500 }, { x: 750, y: 100, w: 30, h: 500 },
        { x: 360, y: 220, w: 280, h: 24 }, { x: 360, y: 460, w: 280, h: 24 },
        { x: 480, y: 330, w: 45, h: 45 }
      ],
      // Titik sembunyi di sekitar barak
      sembunyi: [
        { x: 45, y: 300, w: 80, h: 80 }, { x: 450, y: 300, w: 90, h: 90 },
        { x: 860, y: 300, w: 80, h: 80 }
      ],
      // Pasukan penjaga barak gabungan Juggernaut dan Kroco
      musuh: [
        // Juggernaut patroli lorong utara
        { x: 450, y: 150, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 2.2, pDy: 0 },
        // Juggernaut patroli lorong selatan
        { x: 550, y: 530, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: -2.2, pDy: 0 },
        // Kroco patroli lorong barat
        { x: 120, y: 250, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 2.5 },
        // Kroco patroli tengah
        { x: 500, y: 350, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 2.5, pDy: 0 },
        // Kroco patroli lorong timur
        { x: 880, y: 450, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: -2.5 }
      ],
      // Dokumen rahasia intelijen militer
      intels: [{ x: 500, y: 410 }, { x: 100, y: 600 }, { x: 880, y: 350 }],
      // Simpanan berlian
      diamonds: [
        { x: 80, y: 80, val: 5 }, { x: 500, y: 170, val: 10 },
        { x: 910, y: 100, val: 5 }, { x: 680, y: 580, val: 5 }
      ],
      // Rintangan tumpukan daun dan perangkap ranjau
      hazards: [
        { tipe: "daun", x: 500, y: 180, r: 50 },
        { tipe: "trap", x: 500, y: 580, w: 50, h: 50 }
      ],
      // Koin emas di barak
      koin: [{ x: 350, y: 350 }, { x: 650, y: 350 }],
      // Pintu keluar evakuasi
      exit: { x: 900, y: 120 }
    },
    // SEKTOR 2 - TAHAP 3
    3: {
      // SEKTOR 2 TAHAP 3: JUNGLE COMMAND FORTRESS
      // Benteng komando pusat di jantung rimba hutan
      tembok: [
        // Pembatas arena
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Dinding benteng pertahanan lapis ganda
        { x: 150, y: 150, w: 200, h: 30 }, { x: 650, y: 150, w: 200, h: 30 },
        { x: 150, y: 500, w: 200, h: 30 }, { x: 650, y: 500, w: 200, h: 30 },
        { x: 380, y: 280, w: 24, h: 140 }, { x: 600, y: 280, w: 24, h: 140 }
      ],
      // Tempat sembunyi sudut
      sembunyi: [{ x: 45, y: 45, w: 80, h: 80 }, { x: 870, y: 45, w: 80, h: 80 }],
      // Bos Panglima Rimba dan pengawal pribadinya
      musuh: [
        // Boss Komando Hutan (HP sangat tinggi: 18)
        { x: 500, y: 350, r: 28, tipe: "boss", hp: 18, maxHp: 18, pDx: 3.5, pDy: 3.5 },
        // Juggernaut pelindung sayap kiri
        { x: 260, y: 120, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 2.2, pDy: 0 },
        // Juggernaut pelindung sayap kanan
        { x: 740, y: 580, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: -2.2, pDy: 0 }
      ],
      // Berkas dokumen cetak biru komando
      intels: [{ x: 500, y: 220 }, { x: 250, y: 90 }, { x: 750, y: 90 }],
      // Hadiah berlian berharga
      diamonds: [
        { x: 80, y: 80, val: 10 }, { x: 910, y: 80, val: 10 },
        { x: 500, y: 470, val: 15 }
      ],
      // Perangkap paku ganda di dekat ruang pusat
      hazards: [
        { tipe: "trap", x: 320, y: 320, w: 50, h: 50 },
        { tipe: "trap", x: 630, y: 320, w: 50, h: 50 }
      ],
      // Koin emas
      koin: [{ x: 500, y: 200 }, { x: 500, y: 500 }],
      // Helipad pintu evakuasi
      exit: { x: 900, y: 580 }
    }
  },
  // =========================================================================
  // SEKTOR 3: CYBER CITADEL HIGH-TECH COMPLEX & SECRET LEVEL
  // =========================================================================
  3: {
    // SEKTOR 3 - TAHAP 1
    1: {
      // SEKTOR 3 TAHAP 1: CYBER CITADEL SECURITY GRID
      // Struktur pertahanan berteknologi siber tingkat tinggi
      tembok: [
        // Dinding pembatas luar
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Sekat dinding laser dan pilar pengaman
        { x: 300, y: 20, w: 26, h: 420 }, { x: 660, y: 260, w: 26, h: 420 },
        { x: 120, y: 240, w: 50, h: 50 }, { x: 480, y: 240, w: 50, h: 50 },
        { x: 840, y: 440, w: 50, h: 50 }
      ],
      // Tempat sembunyi berkamuflase siber
      sembunyi: [{ x: 45, y: 580, w: 80, h: 80 }, { x: 870, y: 45, w: 80, h: 80 }],
      // Penjaga keamanan berteknologi siber dengan gerakan sangat gesit
      musuh: [
        // Penjaga kroco siber kiri
        { x: 150, y: 90, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 3.0 },
        // Penjaga kroco siber kanan
        { x: 850, y: 590, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: -3.0 },
        // Penjaga kroco siber tengah atas
        { x: 480, y: 140, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 3.0, pDy: 0 },
        // Penjaga kroco siber tengah bawah
        { x: 480, y: 560, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: -3.0, pDy: 0 }
      ],
      // Kartu akses kunci data terenkripsi (Intel)
      intels: [{ x: 150, y: 350 }, { x: 500, y: 600 }, { x: 850, y: 350 }],
      // Berlian siber
      diamonds: [
        { x: 80, y: 80, val: 5 }, { x: 480, y: 330, val: 10 },
        { x: 900, y: 100, val: 5 }
      ],
      // Rintangan sinar laser pembatas koridor dan perangkap lantai
      hazards: [
        // Sinar laser mematikan horizontal (w: panjang balok laser, h: ketebalan)
        { tipe: "laser", x: 330, y: 300, w: 320, h: 6 },
        // Jebakan perangkap
        { tipe: "trap", x: 490, y: 150, w: 50, h: 50 }
      ],
      // Koin di arena
      koin: [{ x: 500, y: 200 }, { x: 500, y: 400 }],
      // Portal keluar ekstraksi
      exit: { x: 900, y: 580 }
    },
    // SEKTOR 3 - TAHAP 2
    2: {
      // SEKTOR 3 TAHAP 2: CYBER CORE GENERATOR
      // Ruang reaktor inti tenaga siber
      tembok: [
        // Pembatas arena
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Dinding pelindung reaktor generator
        { x: 150, y: 150, w: 700, h: 30 }, { x: 150, y: 510, w: 700, h: 30 },
        { x: 340, y: 260, w: 30, h: 180 }, { x: 630, y: 260, w: 30, h: 180 }
      ],
      // Zona sembunyi
      sembunyi: [{ x: 45, y: 45, w: 80, h: 80 }, { x: 870, y: 570, w: 80, h: 80 }],
      // Pengawal lapis baja reaktor dan penjaga patroli
      musuh: [
        // Juggernaut pelindung lorong generator atas
        { x: 490, y: 90, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 3.0, pDy: 0 },
        // Juggernaut pelindung lorong generator bawah
        { x: 490, y: 600, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: -3.0, pDy: 0 },
        // Kroco patroli sayap barat
        { x: 240, y: 350, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 2.5 },
        // Kroco patroli tengah
        { x: 490, y: 350, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 2.5, pDy: 0 },
        // Kroco patroli sayap timur
        { x: 740, y: 350, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: -2.5 }
      ],
      // Data kode akses reaktor nuklir/siber
      intels: [{ x: 300, y: 90 }, { x: 700, y: 90 }, { x: 300, y: 600 }],
      // Berlian berharga tinggi
      diamonds: [
        { x: 80, y: 80, val: 10 }, { x: 490, y: 230, val: 10 },
        { x: 900, y: 100, val: 10 }
      ],
      // Laser pengaman inti dan jebakan lantai
      hazards: [
        { tipe: "laser", x: 150, y: 350, w: 330, h: 6 },
        { tipe: "trap", x: 490, y: 300, w: 50, h: 50 }
      ],
      // Koin emas
      koin: [{ x: 100, y: 350 }, { x: 900, y: 350 }],
      // Titik ekstraksi
      exit: { x: 900, y: 120 }
    },
    // SEKTOR 3 - TAHAP 3
    3: {
      // SEKTOR 3 TAHAP 3: CYBER CITADEL PENTHOUSE (BOSS)
      // Lantai puncak gedung penthouse pusat citadel siber
      tembok: [
        // Pembatas arena
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Dinding ruang singgasana Boss Cyber
        { x: 200, y: 180, w: 220, h: 30 }, { x: 580, y: 180, w: 220, h: 30 },
        { x: 200, y: 480, w: 220, h: 30 }, { x: 580, y: 480, w: 220, h: 30 }
      ],
      // Tempat bersembunyi sempit di koridor samping
      sembunyi: [{ x: 45, y: 310, w: 60, h: 90 }, { x: 890, y: 310, w: 60, h: 90 }],
      // Boss Terkuat Utama Game (Cyber Boss Master)
      musuh: [
        // Pemimpin tertinggi siber (darah masif 20 HP, kecepatan patroli 4.0)
        { x: 500, y: 340, r: 28, tipe: "boss", hp: 20, maxHp: 20, pDx: 4.0, pDy: 4.0 },
        // Juggernaut pengawal pribadi kiri
        { x: 260, y: 110, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 0, pDy: 2.5 },
        // Juggernaut pengawal pribadi kanan
        { x: 740, y: 580, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 0, pDy: -2.5 }
      ],
      // Data rahasia utama sindikat global
      intels: [{ x: 500, y: 240 }, { x: 90, y: 90 }, { x: 910, y: 90 }],
      // Hadiah permata berlian bernilai sangat tinggi
      diamonds: [
        { x: 80, y: 80, val: 15 }, { x: 910, y: 80, val: 15 },
        { x: 500, y: 460, val: 20 }
      ],
      // Hambatan laser keamanan gerbang tengah dan jebakan maut
      hazards: [
        { tipe: "laser", x: 420, y: 180, w: 160, h: 6 },
        { tipe: "trap", x: 490, y: 500, w: 60, h: 60 }
      ],
      // Koin di arena
      koin: [{ x: 300, y: 350 }, { x: 700, y: 350 }],
      // Helipad ekstraksi akhir
      exit: { x: 900, y: 580 }
    },
    // SEKTOR 3 - TAHAP 4 (RAHASIA)
    4: {
      // SEKTOR 3 TAHAP 4: SECRET IMPOSSIBLE TRIAL (RIVAL ASSASSIN)
      // Arena Ujian Mustahil: Menghadapi Rival Assassin tandingan dengan kelincahan super
      tembok: [
        // Pembatas luar arena rahasia
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Dinding labirin arena duel gladiator bayangan
        { x: 220, y: 150, w: 35, h: 400 }, { x: 740, y: 150, w: 35, h: 400 },
        { x: 390, y: 190, w: 220, h: 28 }, { x: 390, y: 470, w: 220, h: 28 },
        { x: 100, y: 320, w: 50, h: 50 }, { x: 850, y: 320, w: 50, h: 50 }
      ],
      // Zona persembunyian taktis
      sembunyi: [
        { x: 45, y: 45, w: 80, h: 80 }, { x: 870, y: 45, w: 80, h: 80 },
        { x: 45, y: 560, w: 80, h: 80 }
      ],
      // Susunan musuh terberat: Pasukan elite Kroco, Juggernaut, dan sang Rival Assassin
      musuh: [
        // Kroco patroli cepat atas
        { x: 320, y: 90, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 3.0, pDy: 0 },
        // Kroco patroli cepat bawah
        { x: 680, y: 600, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: -3.0, pDy: 0 },
        // Kroco patroli lorong kiri
        { x: 120, y: 390, r: 16, tipe: "kroco", hp: 2, maxHp: 2, pDx: 0, pDy: 3.0 },
        // Juggernaut penjaga sayap atas
        { x: 390, y: 110, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: 2.5, pDy: 0 },
        // Juggernaut penjaga sayap bawah
        { x: 610, y: 580, r: 21, tipe: "juggernaut", hp: 4, maxHp: 4, pDx: -2.5, pDy: 0 },
        // Sang Rival Assassin Legendaris: HP luar biasa tebal (24 HP) dan kecepatan dahsyat (5.2 piksel/frame)
        { x: 500, y: 335, r: 18, tipe: "rival", hp: 24, maxHp: 24, pDx: 5.2, pDy: 5.2 }
      ],
      // Berkas dokumen master bukti kemenangan
      intels: [{ x: 500, y: 120 }, { x: 500, y: 550 }, { x: 120, y: 200 }],
      // Hadiah permata permata langka terbesar
      diamonds: [
        { x: 80, y: 80, val: 20 }, { x: 910, y: 80, val: 20 },
        { x: 500, y: 400, val: 30 }
      ],
      // Laser ganda dan jebakan mematikan di pusat arena duel
      hazards: [
        { tipe: "laser", x: 260, y: 350, w: 130, h: 6 },
        { tipe: "laser", x: 610, y: 350, w: 130, h: 6 },
        { tipe: "trap", x: 470, y: 320, w: 60, h: 60 }
      ],
      // Koin di arena
      koin: [{ x: 150, y: 550 }, { x: 850, y: 150 }],
      // Helipad evakuasi pamungkas
      exit: { x: 900, y: 580 }
    }
  }
};
