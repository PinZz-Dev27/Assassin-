const canvas = document.getElementById("arenaGame");
const ctx = canvas.getContext("2d");
const teksStatus = document.getElementById("teks-status");
canvas.width = 1000;
canvas.height = 700;

// ==========================================
// 1. PEMUATAN ASET GAMBAR SPRITE 2D
// ==========================================
const asetGame = {
  spritesheets: {
    hitam: new Image(),
    putih: new Image(),
    emas: new Image(),
    navy: new Image(),
    abu: new Image(),
    merah: new Image(),
    ungu: new Image()
  },
  idle: {
    atas: new Image(),
    bawah: new Image(),
    samping: new Image()
  },
  jalan: {
    atas: new Image(),
    bawah: new Image(),
    samping: new Image()
  },
  aksi: {
    serang: new Image()
  },
  baju: {
    hitam: new Image(),
    navy: new Image(),
    putih: new Image(),
    abu: new Image(),
    merah: new Image(),
    ungu: new Image(),
    emas: new Image()
  },
  musuh: {
    keroco: new Image(),
    keroco_pistol: new Image(),
    juggernaut: new Image(),
    boss: new Image(),
    rival: new Image(),
    viplevel1: new Image(),
    viplevel2: new Image(),
    viplevel3: new Image()
  }
};

// 1.0 Spritesheet Resmi Tiap Warna Karakter Sesuai File
asetGame.spritesheets.hitam.src = "gerakan hitam.png";
asetGame.spritesheets.putih.src = "gerakan putih.png";
asetGame.spritesheets.emas.src = "gerakan emas.png";
asetGame.spritesheets.navy.src = "gerakan navy.png";
asetGame.spritesheets.abu.src = "gerakan abu.png";
asetGame.spritesheets.merah.src = "gerakan merah.png";
asetGame.spritesheets.ungu.src = "gerakan ungu.png";

// 1.0.1 Spritesheet Resmi Musuh & VIP
asetGame.musuh.keroco.src = "musuh/keroco.png";
asetGame.musuh.keroco_pistol.src = "musuh/keroco pistol.png";
asetGame.musuh.juggernaut.src = "musuh/juggernut.png";
asetGame.musuh.boss.src = "musuh/boss.png";
asetGame.musuh.rival.src = "musuh/rivalAssassin.png";
asetGame.musuh.viplevel1.src = "musuh/VIPlevel1.png";
asetGame.musuh.viplevel2.src = "musuh/VIPlevel2.png";
asetGame.musuh.viplevel3.src = "musuh/VIPlevel3.png";

// 1.1 Fallback Aset Karakter
asetGame.idle.atas.src = "navy.png";
asetGame.idle.bawah.src = "navy.png";
asetGame.idle.samping.src = "navy.png";

// 1.2 Walk / Jalan
asetGame.jalan.atas.src = "navy.png";
asetGame.jalan.bawah.src = "navy.png";
asetGame.jalan.samping.src = "navy.png";

// 1.3 Aksi (Attack)
asetGame.aksi.serang.src = "navy.png";

// 1.4 Baju / 7 Warna Operative
asetGame.baju.hitam.src = "hitam.png";
asetGame.baju.navy.src = "navy.png";
asetGame.baju.putih.src = "putih.png";
asetGame.baju.abu.src = "abu.png";
asetGame.baju.merah.src = "merah.png";
asetGame.baju.ungu.src = "ungu.png";
asetGame.baju.emas.src = "emas.png";

// Mapping warna baju ke key karakter (7 Warna Resmi)
const petaWarnaBaju = {
  "#111111": "hitam",
  "#2c3e50": "navy",
  "#f1c40f": "emas",
  "#95a5a6": "abu",
  "#8e44ad": "ungu",
  "#e74c3c": "merah",
  "#ecf0f1": "putih",
  "hitam": "hitam",
  "navy": "navy",
  "emas": "emas",
  "gold": "emas",
  "abu": "abu",
  "ungu": "ungu",
  "merah": "merah",
  "putih": "putih"
};

// Data Koordinat Sprite Sheet Standar 8-Arah & Aksi (Basis 1536 x 1024 - Hitam & Merah)
const SPRITE_DASAR = {
  idle: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  idle_depan: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  idle_atas: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  idle_belakang: { x: 169, y: 455, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
  walk: [
    { x: 34, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 1
    { x: 237, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 2
    { x: 426, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 3
    { x: 625, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 4
    { x: 805, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 5
    { x: 986, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 6
    { x: 1167, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }, // WALK 7
    { x: 1358, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }  // WALK 8
  ],
  run: [
    { x: 34, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 237, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 426, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 625, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 805, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 986, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 1167, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 },
    { x: 1358, y: 118, w: 150, h: 190, anchorX: 0.5, anchorY: 0.5 }
  ],
  attack: [
    { x: 452, y: 457, w: 190, h: 195, anchorX: 0.50, anchorY: 0.5 }, // ATTACK 1
    { x: 813, y: 470, w: 256, h: 186, anchorX: 0.35, anchorY: 0.5 }, // ATTACK 2
    { x: 1187, y: 478, w: 251, h: 178, anchorX: 0.36, anchorY: 0.5 }  // ATTACK 3
  ],
  slashFinisher: { x: 445, y: 770, w: 304, h: 148, anchorX: 0.4, anchorY: 0.5 },
  head: { x: 922, y: 782, w: 124, h: 122, anchorX: 0.5, anchorY: 0.5 }
};

// Data Koordinat Sprite Sheet Karakter Emas (Basis 600 x 400 - Presisi Tanpa Terpotong)
const SPRITE_EMAS = {
  idle: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  idle_depan: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  idle_atas: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  idle_belakang: { x: 44, y: 180, w: 62, h: 70, anchorX: 0.5, anchorY: 0.5 },
  walk: [
    { x: 12, y: 53, w: 55, h: 69, anchorX: 0.5, anchorY: 0.5 },
    { x: 88, y: 52, w: 54, h: 70, anchorX: 0.5, anchorY: 0.5 },
    { x: 163, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    { x: 239, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    { x: 313, y: 50, w: 54, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 386, y: 51, w: 59, h: 70, anchorX: 0.5, anchorY: 0.5 },
    { x: 462, y: 49, w: 53, h: 73, anchorX: 0.5, anchorY: 0.5 },
    { x: 535, y: 49, w: 54, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  run: [
    { x: 12, y: 53, w: 55, h: 69, anchorX: 0.5, anchorY: 0.5 },
    { x: 88, y: 52, w: 54, h: 70, anchorX: 0.5, anchorY: 0.5 },
    { x: 163, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    { x: 239, y: 51, w: 53, h: 71, anchorX: 0.5, anchorY: 0.5 },
    { x: 313, y: 50, w: 54, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 386, y: 51, w: 59, h: 70, anchorX: 0.5, anchorY: 0.5 },
    { x: 462, y: 49, w: 53, h: 73, anchorX: 0.5, anchorY: 0.5 },
    { x: 535, y: 49, w: 54, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  attack: [
    { x: 172, y: 180, w: 74, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 311, y: 184, w: 106, h: 71, anchorX: 0.44, anchorY: 0.5 },
    { x: 462, y: 181, w: 99, h: 73, anchorX: 0.44, anchorY: 0.5 }
  ],
  slashFinisher: { x: 168, y: 270, w: 127, h: 95, anchorX: 0.45, anchorY: 0.5 },
  head: { x: 337, y: 270, w: 164, h: 89, anchorX: 0.5, anchorY: 0.5 }
};

// Data Koordinat Sprite Sheet Standar 600 x 400 (Navy, Abu, Putih, Ungu)
const SPRITE_DASAR_600 = {
  idle: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  idle_depan: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  idle_atas: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  idle_belakang: { x: 46, y: 178, w: 62, h: 72, anchorX: 0.5, anchorY: 0.5 },
  walk: [
    { x: 12, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 86, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 162, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 238, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 312, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 386, y: 50, w: 58, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 460, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 },
    { x: 534, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  run: [
    { x: 12, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 86, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 162, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 238, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 312, y: 50, w: 56, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 386, y: 50, w: 58, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 460, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 },
    { x: 534, y: 49, w: 56, h: 73, anchorX: 0.5, anchorY: 0.5 }
  ],
  attack: [
    { x: 170, y: 178, w: 76, h: 72, anchorX: 0.5, anchorY: 0.5 },
    { x: 312, y: 180, w: 104, h: 72, anchorX: 0.45, anchorY: 0.5 },
    { x: 462, y: 180, w: 102, h: 74, anchorX: 0.45, anchorY: 0.5 }
  ],
  slashFinisher: { x: 168, y: 270, w: 127, h: 95, anchorX: 0.45, anchorY: 0.5 }
};

// Data Koordinat Sprite Sheet Musuh Resmi (Basis 600 x 400 - Bersih Tanpa Label Text)
const SPRITE_MUSUH = {
  keroco: {
    idle: { x: 35, y: 177, w: 66, h: 80, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 10, y: 49, w: 64, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 84, y: 49, w: 65, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 160, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 234, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 309, y: 49, w: 64, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 383, y: 48, w: 64, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 457, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 530, y: 48, w: 63, h: 80, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 169, y: 170, w: 81, h: 85, anchorX: 0.5, anchorY: 0.45 },
      { x: 300, y: 178, w: 112, h: 80, anchorX: 0.45, anchorY: 0.45 },
      { x: 453, y: 174, w: 113, h: 82, anchorX: 0.42, anchorY: 0.45 }
    ]
  },
  keroco_pistol: {
    idle: { x: 39, y: 176, w: 62, h: 80, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 16, y: 48, w: 58, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 90, y: 48, w: 58, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 165, y: 48, w: 58, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 240, y: 48, w: 57, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 315, y: 48, w: 57, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 390, y: 48, w: 57, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 464, y: 47, w: 56, h: 80, anchorX: 0.5, anchorY: 0.5 },
      { x: 538, y: 48, w: 56, h: 80, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 166, y: 175, w: 98, h: 80, anchorX: 0.5, anchorY: 0.48 },
      { x: 297, y: 180, w: 101, h: 77, anchorX: 0.5, anchorY: 0.48 },
      { x: 450, y: 181, w: 101, h: 76, anchorX: 0.48, anchorY: 0.48 }
    ]
  },
  juggernaut: {
    idle: { x: 33, y: 168, w: 79, h: 88, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 11, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 85, y: 45, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 160, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 235, y: 46, w: 66, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 309, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 384, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 458, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 },
      { x: 529, y: 46, w: 65, h: 83, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 165, y: 168, w: 99, h: 88, anchorX: 0.5, anchorY: 0.48 },
      { x: 302, y: 171, w: 110, h: 86, anchorX: 0.48, anchorY: 0.48 },
      { x: 452, y: 170, w: 113, h: 87, anchorX: 0.48, anchorY: 0.48 }
    ]
  },
  boss: {
    idle: { x: 48, y: 164, w: 69, h: 92, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 9, y: 43, w: 64, h: 86, anchorX: 0.5, anchorY: 0.5 },
      { x: 85, y: 41, w: 65, h: 86, anchorX: 0.5, anchorY: 0.5 },
      { x: 163, y: 42, w: 62, h: 86, anchorX: 0.5, anchorY: 0.5 },
      { x: 235, y: 43, w: 64, h: 86, anchorX: 0.5, anchorY: 0.5 },
      { x: 314, y: 43, w: 62, h: 86, anchorX: 0.5, anchorY: 0.5 },
      { x: 376, y: 42, w: 74, h: 86, anchorX: 0.55, anchorY: 0.5 },
      { x: 461, y: 42, w: 61, h: 86, anchorX: 0.5, anchorY: 0.5 },
      { x: 533, y: 43, w: 62, h: 86, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 179, y: 158, w: 87, h: 96, anchorX: 0.52, anchorY: 0.48 },
      { x: 296, y: 149, w: 119, h: 104, anchorX: 0.55, anchorY: 0.5 },
      { x: 444, y: 170, w: 140, h: 87, anchorX: 0.46, anchorY: 0.48 }
    ]
  },
  rival: {
    idle: { x: 40, y: 158, w: 65, h: 96, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 9, y: 37, w: 64, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 85, y: 37, w: 60, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 161, y: 37, w: 63, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 236, y: 37, w: 60, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 311, y: 38, w: 60, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 383, y: 36, w: 63, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 459, y: 36, w: 59, h: 92, anchorX: 0.5, anchorY: 0.5 },
      { x: 533, y: 38, w: 61, h: 92, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 165, y: 159, w: 93, h: 96, anchorX: 0.5, anchorY: 0.48 },
      { x: 307, y: 166, w: 120, h: 92, anchorX: 0.48, anchorY: 0.48 },
      { x: 452, y: 162, w: 124, h: 94, anchorX: 0.5, anchorY: 0.48 }
    ]
  },
  viplevel1: {
    idle: { x: 26, y: 247, w: 302, h: 342, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 26, y: 247, w: 302, h: 342, anchorX: 0.5, anchorY: 0.5 },
      { x: 340, y: 254, w: 290, h: 347, anchorX: 0.5, anchorY: 0.5 },
      { x: 639, y: 256, w: 296, h: 331, anchorX: 0.5, anchorY: 0.5 },
      { x: 943, y: 260, w: 301, h: 344, anchorX: 0.5, anchorY: 0.5 },
      { x: 639, y: 256, w: 296, h: 331, anchorX: 0.5, anchorY: 0.5 },
      { x: 340, y: 254, w: 290, h: 347, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 35, y: 755, w: 307, h: 354, anchorX: 0.5, anchorY: 0.5 },
      { x: 345, y: 759, w: 287, h: 350, anchorX: 0.5, anchorY: 0.5 },
      { x: 632, y: 766, w: 306, h: 345, anchorX: 0.5, anchorY: 0.5 },
      { x: 938, y: 774, w: 309, h: 337, anchorX: 0.5, anchorY: 0.5 }
    ]
  },
  viplevel2: {
    idle: { x: 42, y: 237, w: 278, h: 328, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 42, y: 237, w: 278, h: 328, anchorX: 0.5, anchorY: 0.5 },
      { x: 351, y: 237, w: 265, h: 330, anchorX: 0.5, anchorY: 0.5 },
      { x: 649, y: 237, w: 259, h: 330, anchorX: 0.5, anchorY: 0.5 },
      { x: 947, y: 237, w: 272, h: 330, anchorX: 0.5, anchorY: 0.5 },
      { x: 649, y: 237, w: 259, h: 330, anchorX: 0.5, anchorY: 0.5 },
      { x: 351, y: 237, w: 265, h: 330, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 56, y: 720, w: 267, h: 340, anchorX: 0.5, anchorY: 0.5 },
      { x: 353, y: 720, w: 263, h: 340, anchorX: 0.5, anchorY: 0.5 },
      { x: 646, y: 720, w: 269, h: 340, anchorX: 0.5, anchorY: 0.5 },
      { x: 952, y: 720, w: 267, h: 337, anchorX: 0.5, anchorY: 0.5 }
    ]
  },
  viplevel3: {
    idle: { x: 21, y: 234, w: 304, h: 425, anchorX: 0.5, anchorY: 0.5 },
    walk: [
      { x: 21, y: 234, w: 304, h: 425, anchorX: 0.5, anchorY: 0.5 },
      { x: 339, y: 238, w: 292, h: 421, anchorX: 0.5, anchorY: 0.5 },
      { x: 643, y: 234, w: 297, h: 425, anchorX: 0.5, anchorY: 0.5 },
      { x: 945, y: 234, w: 293, h: 425, anchorX: 0.5, anchorY: 0.5 },
      { x: 643, y: 234, w: 297, h: 425, anchorX: 0.5, anchorY: 0.5 },
      { x: 339, y: 238, w: 292, h: 421, anchorX: 0.5, anchorY: 0.5 }
    ],
    attack: [
      { x: 18, y: 726, w: 314, h: 439, anchorX: 0.5, anchorY: 0.5 },
      { x: 338, y: 726, w: 301, h: 439, anchorX: 0.5, anchorY: 0.5 },
      { x: 644, y: 726, w: 302, h: 439, anchorX: 0.5, anchorY: 0.5 },
      { x: 947, y: 726, w: 302, h: 439, anchorX: 0.5, anchorY: 0.5 }
    ]
  }
};

const DATA_LEMBAR_SPRITE = {
  hitam: SPRITE_DASAR,
  navy: SPRITE_DASAR_600,
  putih: SPRITE_DASAR_600,
  abu: SPRITE_DASAR_600,
  emas: SPRITE_EMAS,
  merah: SPRITE_DASAR,
  ungu: SPRITE_DASAR_600
};

// Helper rotasi sudut halus (anti-kaku 360 & 8 arah)
function lerpAngle(sudutAwal, sudutTujuan, faktorInterpolasi) {
  let selisih = (sudutTujuan - sudutAwal) % (Math.PI * 2);
  if (selisih < -Math.PI) selisih += Math.PI * 2;
  if (selisih > Math.PI) selisih -= Math.PI * 2;
  return sudutAwal + selisih * faktorInterpolasi;
}

// Tema visual & identitas untuk masing-masing 7 warna (Menggunakan aset sprite asli tanpa filter)
const WARNA_TEMA = {
  hitam: { utama: "#111111", glow: "#64748b", filter: "none", trail: "rgba(15, 23, 42, 0.4)", text: "#cbd5e1" },
  navy: { utama: "#2c3e50", glow: "#38bdf8", filter: "none", trail: "rgba(30, 41, 59, 0.4)", text: "#38bdf8" },
  emas: { utama: "#f1c40f", glow: "#f59e0b", filter: "none", trail: "rgba(245, 158, 11, 0.4)", text: "#facc15" },
  abu: { utama: "#95a5a6", glow: "#94a3b8", filter: "none", trail: "rgba(100, 116, 139, 0.4)", text: "#94a3b8" },
  ungu: { utama: "#8e44ad", glow: "#a855f7", filter: "none", trail: "rgba(126, 34, 206, 0.4)", text: "#c084fc" },
  merah: { utama: "#e74c3c", glow: "#ef4444", filter: "none", trail: "rgba(185, 28, 28, 0.4)", text: "#ef4444" },
  putih: { utama: "#ecf0f1", glow: "#cbd5e1", filter: "none", trail: "rgba(203, 213, 225, 0.4)", text: "#ffffff" }
};

// Helper konversi hex ke RGBA untuk tint transparan
function hexToRgba(kodeHex, nilaiAlpha = 0.5) {
  if (!kodeHex || typeof kodeHex !== 'string' || kodeHex[0] !== '#') return `rgba(220, 38, 38, ${nilaiAlpha})`;
  let stringWarna = kodeHex.substring(1);
  if (stringWarna.length === 3) stringWarna = stringWarna.split('').map(x => x + x).join('');
  let nilaiAngka = parseInt(stringWarna, 16);
  if (isNaN(nilaiAngka)) return `rgba(220, 38, 38, ${nilaiAlpha})`;
  let merah = (nilaiAngka >> 16) & 255;
  let hijau = (nilaiAngka >> 8) & 255;
  let biru = nilaiAngka & 255;
  return `rgba(${merah}, ${hijau}, ${biru}, ${nilaiAlpha})`;
}

// KAMUS (BILINGUAL)
const bahasaSekarang = localStorage.getItem('gameLang') || 'id';
const Teks = {
  lvl: bahasaSekarang === 'en' ? "Level" : "Level",
  stage: bahasaSekarang === 'en' ? "Stage" : "Tahap",
  intelStatus: bahasaSekarang === 'en' ? "Intel" : "Intel",
  intelLengkap: bahasaSekarang === 'en' ? "ALL INTEL SECURED - HEAD TO EXTRACTION!" : "SEMUA INTEL DIAMBIL - MENUJU TITIK KABUR!",
  bosHidup: bahasaSekarang === 'en' ? "ELIMINATE THE VIP & BOSS TO UNLOCK DOOR!" : "HABISI VIP & BOSS UNTUK MEMBUKA PINTU!",
  tertangkap: bahasaSekarang === 'en' ? "YOU ARE BUSTED!" : "KAMU TERTANGKAP!",
  ulang: bahasaSekarang === 'en' ? "Press [ R ] to restart Stage " : "Tekan [ R ] untuk mengulang Tahap ",
  selesai: bahasaSekarang === 'en' ? " CLEARED!" : " SELESAI!",
  lanjut: bahasaSekarang === 'en' ? " Coins. Press [ ENTER ] to continue" : " Koin. Tekan [ ENTER ] untuk lanjut",
  kembali: bahasaSekarang === 'en' ? "Press [ ENTER ] to return to Lobby" : "Tekan [ ENTER ] untuk kembali ke Lobi",
  totalKill: bahasaSekarang === 'en' ? "Total Kills: " : "Total Kill: ",
  totalKoin: bahasaSekarang === 'en' ? " | Lobby Coins Added: +" : " | Total Koin Lobi Bertambah: +",
  pisau: bahasaSekarang === 'en' ? "Knife: " : "Pisau: ",
  blocked: bahasaSekarang === 'en' ? "SHIELD BLOCKED!" : "DITAHAN TAMENG!",
  assassinated: bahasaSekarang === 'en' ? "ASSASSINATED!" : "DIEKSEKUSI!",
  headshot: bahasaSekarang === 'en' ? "HEADSHOT!" : "HEADSHOT!",
  blinkKill: bahasaSekarang === 'en' ? "BLINK KILL!" : "KILAT MAUT!",
  timeFreeze: bahasaSekarang === 'en' ? "TIME FREEZE!" : "WAKTU BEKU!",
  shadowClone: bahasaSekarang === 'en' ? "SHADOW CLONE!" : "BAYANGAN PENIPU!",
  alert: "!",
  cctvAlert: bahasaSekarang === 'en' ? "CCTV ALARM!" : "ALARM CCTV!",
  secretStage: bahasaSekarang === 'en' ? "SECRET STAGE 4: IMPOSSIBLE TRIAL" : "TAHAP 4 RAHASIA: UJIAN MUSTAHIL",
  rivalHidup: bahasaSekarang === 'en' ? "DEFEAT THE RIVAL ASSASSIN TO UNLOCK EXIT!" : "KALAHKAN RIVAL ASSASSIN UNTUK MEMBUKA PINTU!",
  titleUnlocked: bahasaSekarang === 'en' ? "TITLE UNLOCKED: THE IMPOSSIBLE ASSASSIN" : "GELAR TERBUKA: SANG LEGENDA MUSTAHIL",
  secretCleared: bahasaSekarang === 'en' ? "SECRET IMPOSSIBLE TRIAL CONQUERED!" : "TAHAP SECRET IMPOSSIBLE DITAKLUKKAN!"
};

let petaKunciBaju = {
  '#111111': 'baju_hitam',
  '#2c3e50': 'baju_navy',
  '#ecf0f1': 'baju_putih',
  '#95a5a6': 'baju_abu',
  '#e74c3c': 'baju_merah',
  '#8e44ad': 'baju_ungu',
  '#f1c40f': 'baju_emas',
  'hitam': 'baju_hitam',
  'navy': 'baju_navy',
  'putih': 'baju_putih',
  'abu': 'baju_abu',
  'merah': 'baju_merah',
  'ungu': 'baju_ungu',
  'emas': 'baju_emas'
};
let warnaPemain = localStorage.getItem('ninjaColor') || "#111111";
let kunciPemeriksaan = petaKunciBaju[warnaPemain] || 'baju_hitam';
if (kunciPemeriksaan !== 'baju_hitam' && localStorage.getItem(kunciPemeriksaan) !== 'true') {
  warnaPemain = "#111111";
  localStorage.setItem('ninjaColor', '#111111');
}
const temaPeta = localStorage.getItem('selectedMap') || "gedung";
const tipeSenjata = "bentuk-kayu"; // Terkunci pedang kayu untuk versi demo
const warnaSenjata = "#8B4513";

// Fungsi ganti warna dinamis langsung in-game
window.gantiWarnaPlayer = function (hex) {
  warnaPemain = hex;
  if (typeof pemain !== "undefined" && pemain) {
    pemain.warnaBase = hex;
    let kunciBaju = petaWarnaBaju[hex] || 'navy';
    let tema = WARNA_TEMA[kunciBaju] || WARNA_TEMA['navy'];
    munculkanTeks(pemain.x, pemain.y - 25, "SUIT: " + kunciBaju.toUpperCase(), tema.glow);
    tambahVFX(pemain.x, pemain.y, tema.glow, "partikel");
    mainkanSuara('equip');
  }
  localStorage.setItem('ninjaColor', hex);
};

let warnaLantai, warnaTembok, warnaAtasTembok, warnaKotoran, opasitasKotoran;
if (temaPeta === "hutan") {
  warnaLantai = "#142b15";
  warnaTembok = "#1b4d22";
  warnaAtasTembok = "#22662c";
  warnaKotoran = "#0a180b";
  opasitasKotoran = 0.4;
} else if (temaPeta === "lab") {
  warnaLantai = "#0b101a";
  warnaTembok = "#00e5ff";
  warnaAtasTembok = "#1a252f";
  warnaKotoran = "#00e5ff";
  opasitasKotoran = 0.06;
} else {
  warnaLantai = "#303236";
  warnaTembok = "#202428";
  warnaAtasTembok = "#34495e";
  warnaKotoran = "#1a1a1a";
  opasitasKotoran = 0.2;
}

let volumeGlobal = parseFloat(localStorage.getItem('volumeGame'));
if (isNaN(volumeGlobal)) volumeGlobal = 1.0;

// AUDIO ENGINE SYNTHESIZER
const MesinAudioCtx = window.AudioContext || window.webkitAudioContext;
let konteksAudio;
let penguatUtama;

function inisialisasiAudio() {
  if (!konteksAudio) {
    try {
      konteksAudio = new MesinAudioCtx();
      penguatUtama = konteksAudio.createGain();
      penguatUtama.connect(konteksAudio.destination);
      penguatUtama.gain.value = volumeGlobal;
    } catch (e) {
      console.warn("Audio Context init error:", e);
    }
  }
  if (konteksAudio && konteksAudio.state === 'suspended') konteksAudio.resume();
}

function aturVolume(nilaiVolume) {
  volumeGlobal = parseFloat(nilaiVolume);
  if (penguatUtama && konteksAudio) penguatUtama.gain.setValueAtTime(volumeGlobal, konteksAudio.currentTime);
}

function playTone(tipeGelombang, frekuensiAwal, frekuensiAkhir, durasi, nilaiPenguat = 0.3, gunakanRamp = true) {
  if (volumeGlobal <= 0) return;
  inisialisasiAudio();
  if (!konteksAudio || !penguatUtama) return;
  let waktuSekarang = konteksAudio.currentTime, osilator = konteksAudio.createOscillator(), nodePenguat = konteksAudio.createGain();
  osilator.type = tipeGelombang;
  osilator.frequency.setValueAtTime(frekuensiAwal, waktuSekarang);
  if (frekuensiAkhir && frekuensiAkhir !== frekuensiAwal) {
    if (gunakanRamp) osilator.frequency.exponentialRampToValueAtTime(Math.max(10, frekuensiAkhir), waktuSekarang + durasi);
    else osilator.frequency.setValueAtTime(frekuensiAkhir, waktuSekarang + durasi * 0.4);
  }
  nodePenguat.gain.setValueAtTime(nilaiPenguat, waktuSekarang);
  nodePenguat.gain.linearRampToValueAtTime(0.001, waktuSekarang + durasi);
  osilator.connect(nodePenguat); nodePenguat.connect(penguatUtama);
  osilator.start(waktuSekarang); osilator.stop(waktuSekarang + durasi);
}

function mainkanSuara(jenis) {
  if (jenis === 'slash') playTone('sawtooth', 550, 80, 0.12, 0.4);
  else if (jenis === 'coin') playTone('sine', 980, 1320, 0.25, 0.35, false);
  else if (jenis === 'shuriken') playTone('triangle', 900, 120, 0.1, 0.3);
  else if (jenis === 'block') playTone('square', 220, 60, 0.2, 0.6);
  else if (jenis === 'alert') playTone('sine', 520, 680, 0.14, 0.18, false);
  else if (jenis === 'dash') playTone('triangle', 160, 40, 0.15, 0.3);
  else if (jenis === 'lose') playTone('sawtooth', 320, 45, 0.8, 0.35);
  else if (jenis === 'magic') playTone('sine', 450, 950, 0.5, 0.35);
  else if (jenis === 'error') playTone('square', 140, 110, 0.2, 0.3, false);
  else if (jenis === 'alarm') playTone('sawtooth', 800, 1200, 0.2, 0.25);
  else if (jenis === 'win' && konteksAudio && penguatUtama) {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      let t = konteksAudio.currentTime + i * 0.12, o = konteksAudio.createOscillator(), g = konteksAudio.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.25, t); g.gain.linearRampToValueAtTime(0.001, t + 0.4);
      o.connect(g); g.connect(penguatUtama); o.start(t); o.stop(t + 0.4);
    });
  }
}

// KONTROL INPUT
const statusTombol = { w: false, a: false, s: false, d: false, shift: false };
window.addEventListener("keydown", (peristiwa) => {
  inisialisasiAudio();
  let tombol = peristiwa.key.toLowerCase();

  // WASD & Arrow Keys
  if (tombol === "w" || peristiwa.key === "ArrowUp") statusTombol.w = true;
  if (tombol === "a" || peristiwa.key === "ArrowLeft") statusTombol.a = true;
  if (tombol === "s" || peristiwa.key === "ArrowDown") statusTombol.s = true;
  if (tombol === "d" || peristiwa.key === "ArrowRight") statusTombol.d = true;
  if (peristiwa.key === "Shift") statusTombol.shift = true;

  // Aksi & Skill
  if (tombol === "l") bunuhMusuh();
  if (tombol === "j") gunakanSkillRapidSlash();
  if (tombol === "q") gunakanSkillGhost();
  if (tombol === "p") gunakanSkillBlink();
  if (tombol === "c") lemparShuriken();
  if (tombol === "i") gunakanSkillTime();
  if (tombol === "t") gunakanSkillClone();

  // Restart & Lanjut
  if (tombol === "r" && window.gameState === "lose") resetGame(levelSekarang, tahapSekarang);
  if (peristiwa.key === "Enter" && window.gameState === "win") {
    if (tahapSekarang < 3) {
      resetGame(levelSekarang, tahapSekarang + 1);
    } else {
      window.location.href = "index.html";
    }
  }

  // Pause Menu [ESC]
  if (peristiwa.key === "Escape") {
    if (window.gameState === "playing") {
      if (typeof bukaPengaturan === "function") bukaPengaturan();
    } else if (window.gameState === "paused") {
      if (typeof lanjutMain === "function") lanjutMain();
    }
  }
});

window.addEventListener("keyup", (peristiwa) => {
  let tombol = peristiwa.key.toLowerCase();
  if (tombol === "w" || peristiwa.key === "ArrowUp") statusTombol.w = false;
  if (tombol === "a" || peristiwa.key === "ArrowLeft") statusTombol.a = false;
  if (tombol === "s" || peristiwa.key === "ArrowDown") statusTombol.s = false;
  if (tombol === "d" || peristiwa.key === "ArrowRight") statusTombol.d = false;
  if (peristiwa.key === "Shift") statusTombol.shift = false;
});

window.addEventListener("blur", () => {
  statusTombol.w = false;
  statusTombol.a = false;
  statusTombol.s = false;
  statusTombol.d = false;
  statusTombol.shift = false;
});

// STATUS GAME & VARIABLE DUNIA
let levelSekarang = 1;
let tahapSekarang = 1;
let statistikPermainan = {
  killCount: 0,
  stealthKills: 0,
  alarmsTriggered: 0,
  intelMaks: 0,
  koinDiArena: 0,
  diamonds: parseInt(localStorage.getItem('ninjaDiamonds')) || 0
};
let pemain, musuh, daftarIntel, daftarTebasan, kotoran = [], tembok, sembunyi, daftarJebakan = [], daftarKoinPeta = [], daftarShuriken = [], teksMelayang = [], daftarVFX = [], daftarItemPemulih = [];
let daftarPeluruMusuh = [], daftarBerlian = [], portalKeluar = { x: 930, y: 24, active: false, radius: 34 };
let partikelAmbien = [];
let JARAK_PANDANG = 250;
let getarLayar = 0;
let penghitungBingkai = 0;
const LEBAR_PANDANG = Math.PI / 4;
let sedangNgedash = false;
let penghitungAlarmCCTV = 0;
let jedaSuaraWaspada = 0; // Throttle cooldown agar suara senter tidak berulang-ulang berlebihan

// TRACKING DAILY QUEST STATS UNTUK LOBBY
function recordDailyStat(kunciStat, jumlah = 1) {
  let tanggalHariIni = new Date().toLocaleDateString();
  if (localStorage.getItem('daily_quest_date') !== tanggalHariIni) {
    localStorage.setItem('daily_quest_date', tanggalHariIni);
    localStorage.setItem('daily_kills', '0');
    localStorage.setItem('daily_intel', '0');
    localStorage.setItem('daily_stages', '0');
    localStorage.setItem('daily_boss', '0');
  }
  let nilaiSaatIni = parseInt(localStorage.getItem(kunciStat)) || 0;
  localStorage.setItem(kunciStat, nilaiSaatIni + jumlah);
}

// Mouse click attack / takedown & screen continue
canvas.addEventListener("mousedown", (e) => {
  inisialisasiAudio();
  if (e.button === 0) {
    if (window.gameState === "lose") {
      resetGame(levelSekarang, tahapSekarang);
      return;
    }
    if (window.gameState === "win") {
      if (tahapSekarang < 3) {
        resetGame(levelSekarang, tahapSekarang + 1);
      } else {
        window.location.href = "index.html";
      }
      return;
    }
    if (window.gameState === "playing") {
      bunuhMusuh();
    }
  }
});

// UPDATE DISPLAY HP PLAYER KE UI
function updateHpUI() {
  let elemenHp = document.getElementById("angka-player-hp");
  let elemenBar = document.getElementById("bar-player-hp-fill");
  if (elemenHp && pemain) elemenHp.innerText = `${Math.max(0, Math.ceil(pemain.hp))} / ${pemain.maxHp}`;
  if (elemenBar && pemain) {
    let pct = Math.max(0, Math.min(100, (pemain.hp / pemain.maxHp) * 100));
    elemenBar.style.width = pct + "%";
    if (pct > 45) elemenBar.style.background = "linear-gradient(90deg, #f59e0b, #22c55e)";
    else if (pct > 25) elemenBar.style.background = "linear-gradient(90deg, #ef4444, #f59e0b)";
    else elemenBar.style.background = "#ef4444";
  }
}

// JATUHKAN REGEN ITEM SAAT MUSUH MATI
function dropRegenItem(x, y) {
  daftarItemPemulih.push({
    x: x,
    y: y,
    heal: 3,
    frame: Math.random() * 100,
    collected: false
  });
}

// SISTEM TEKS MELAYANG (FLOATING TEXT) - ANTI-SPAM DEDUPLICATION
function munculkanTeks(x, y, teks, warna) {
  if (!teks) return;
  // Filter anti-spam: Jangan memunculkan teks yang sama berdekatan di koordinat berdekatan
  let isSpam = teksMelayang.some(item => item.t === teks && Math.hypot(item.x - x, item.y - y) < 55 && item.a > 0.3);
  if (isSpam) return;
  teksMelayang.push({
    x: x,
    y: y,
    t: teks,
    c: warna || "#fff",
    a: 1.0,
    scale: 1.0,
    vy: -1.2
  });
}

// SISTEM PARTIKEL VFX
function tambahVFX(x, y, warna, tipe) {
  let count = 16;
  if (tipe === 'ledakan') {
    for (let i = 0; i < count; i++) {
      let sudut = Math.random() * Math.PI * 2;
      let kec = Math.random() * 8 + 2;
      daftarVFX.push({
        x: x,
        y: y,
        dx: Math.cos(sudut) * kec,
        dy: Math.sin(sudut) * kec,
        r: Math.random() * 5 + 2,
        c: warna,
        a: 1,
        tipe: 'partikel'
      });
    }
  } else if (tipe === 'gelombang') {
    daftarVFX.push({
      x: x,
      y: y,
      r: 10,
      dr: 12,
      c: warna,
      a: 0.8,
      tipe: 'gelombang'
    });
  }
}

// SISTEM PARTIKEL AMBIEN
function inisialisasiPartikelAmbien() {
  partikelAmbien = [];
  let maxCount = 35;
  for (let i = 0; i < maxCount; i++) {
    partikelAmbien.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      a: Math.random() * 0.4 + 0.2,
      glow: temaPeta === 'hutan' ? '#a3e635' : (temaPeta === 'lab' ? '#00e5ff' : '#e2e8f0')
    });
  }
}

// RAYCASTING KE TEMBOK (Slab Method - Exact & Fast)
function hitRayWall(asalX, asalY, arahX, arahY, jarakMaksimal) {
  let jarakTerdekat = jarakMaksimal;
  for (let i = 0; i < tembok.length; i++) {
    let t = tembok[i];
    let invX = arahX !== 0 ? 1 / arahX : 1e9;
    let invY = arahY !== 0 ? 1 / arahY : 1e9;
    let t1 = (t.x - asalX) * invX;
    let t2 = (t.x + t.w - asalX) * invX;
    let t3 = (t.y - asalY) * invY;
    let t4 = (t.y + t.h - asalY) * invY;
    let tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    let tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    if (tmax >= 0 && tmin <= tmax && tmin < jarakTerdekat) {
      if (tmin > 0) jarakTerdekat = tmin;
    }
  }
  return jarakTerdekat;
}

// ==========================================
// SISTEM NAVIGASI & PATHFINDING MUSUH (A*)
// ==========================================
const UKURAN_SEL_NAV = 20;
const KOLOM_NAV = 50; // 1000 / 20
const BARIS_NAV = 35; // 700 / 20
let kisiNavigasi = new Uint8Array(KOLOM_NAV * BARIS_NAV);

function bangunNavGrid() {
  if (!tembok || !Array.isArray(tembok)) return;
  kisiNavigasi.fill(0);
  const padding = 14; // Jarak radius aman terhadap tembok agar musuh tidak tersangkut
  for (let gy = 0; gy < BARIS_NAV; gy++) {
    for (let gx = 0; gx < KOLOM_NAV; gx++) {
      let cx = gx * UKURAN_SEL_NAV + UKURAN_SEL_NAV / 2;
      let cy = gy * UKURAN_SEL_NAV + UKURAN_SEL_NAV / 2;
      let blocked = false;
      for (let t of tembok) {
        if (cx + padding > t.x && cx - padding < t.x + t.w &&
          cy + padding > t.y && cy - padding < t.y + t.h) {
          blocked = true;
          break;
        }
      }
      if (blocked) {
        kisiNavigasi[gy * KOLOM_NAV + gx] = 1;
      }
    }
  }
}

function hasLineOfSight(titikX1, titikY1, titikX2, titikY2, radius = 12) {
  let dx = titikX2 - titikX1;
  let dy = titikY2 - titikY1;
  let dist = Math.hypot(dx, dy);
  if (dist < 1) return true;
  let steps = Math.ceil(dist / 14);
  let stepX = dx / steps;
  let stepY = dy / steps;
  for (let i = 1; i < steps; i++) {
    let px = titikX1 + stepX * i;
    let py = titikY1 + stepY * i;
    if (cekTabrakanTembok(px, py, radius)) {
      return false;
    }
  }
  return true;
}

function cariJalanAStar(titikAwalX, titikAwalY, targetX, targetY, langkahMaksimal = 450) {
  // Jika target langsung terlihat tanpa terhalang dinding, tuju langsung!
  if (hasLineOfSight(titikAwalX, titikAwalY, targetX, targetY, 12)) {
    return [{ x: targetX, y: targetY }];
  }

  let sGx = Math.max(0, Math.min(KOLOM_NAV - 1, Math.floor(titikAwalX / UKURAN_SEL_NAV)));
  let sGy = Math.max(0, Math.min(BARIS_NAV - 1, Math.floor(titikAwalY / UKURAN_SEL_NAV)));
  let tGx = Math.max(0, Math.min(KOLOM_NAV - 1, Math.floor(targetX / UKURAN_SEL_NAV)));
  let tGy = Math.max(0, Math.min(BARIS_NAV - 1, Math.floor(targetY / UKURAN_SEL_NAV)));

  // Jika target cell terblokir (misal player dekat dinding), cari tetangga terdekat yang bebas
  if (kisiNavigasi[tGy * KOLOM_NAV + tGx] === 1) {
    let bestDist = Infinity, bestX = tGx, bestY = tGy;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        let nx = tGx + dx, ny = tGy + dy;
        if (nx >= 0 && nx < KOLOM_NAV && ny >= 0 && ny < BARIS_NAV && kisiNavigasi[ny * KOLOM_NAV + nx] === 0) {
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
  if (kisiNavigasi[sGy * KOLOM_NAV + sGx] === 1) {
    let bestDist = Infinity, bestX = sGx, bestY = sGy;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        let nx = sGx + dx, ny = sGy + dy;
        if (nx >= 0 && nx < KOLOM_NAV && ny >= 0 && ny < BARIS_NAV && kisiNavigasi[ny * KOLOM_NAV + nx] === 0) {
          let d = Math.hypot(nx - sGx, ny - sGy);
          if (d < bestDist) {
            bestDist = d; bestX = nx; bestY = ny;
          }
        }
      }
    }
    sGx = bestX; sGy = bestY;
  }

  if (sGx === tGx && sGy === tGy) {
    return [{ x: targetX, y: targetY }];
  }

  const numCells = KOLOM_NAV * BARIS_NAV;
  const skorG = new Float32Array(numCells).fill(1e9);
  const skorF = new Float32Array(numCells).fill(1e9);
  const asalLangkah = new Int32Array(numCells).fill(-1);
  const himpunanTutup = new Uint8Array(numCells);

  const startIdx = sGy * KOLOM_NAV + sGx;
  const targetIdx = tGy * KOLOM_NAV + tGx;

  skorG[startIdx] = 0;
  skorF[startIdx] = Math.hypot(tGx - sGx, tGy - sGy);

  const himpunanBuka = [startIdx];
  let steps = 0;
  let found = false;

  const dirs = [
    { dx: 1, dy: 0, cost: 1 }, { dx: -1, dy: 0, cost: 1 },
    { dx: 0, dy: 1, cost: 1 }, { dx: 0, dy: -1, cost: 1 },
    { dx: 1, dy: 1, cost: 1.414 }, { dx: -1, dy: 1, cost: 1.414 },
    { dx: 1, dy: -1, cost: 1.414 }, { dx: -1, dy: -1, cost: 1.414 }
  ];

  while (himpunanBuka.length > 0 && steps++ < langkahMaksimal) {
    let bestI = 0;
    let current = himpunanBuka[0];
    for (let i = 1; i < himpunanBuka.length; i++) {
      if (skorF[himpunanBuka[i]] < skorF[current]) {
        current = himpunanBuka[i];
        bestI = i;
      }
    }

    if (current === targetIdx) {
      found = true;
      break;
    }

    himpunanBuka.splice(bestI, 1);
    himpunanTutup[current] = 1;

    let cx = current % KOLOM_NAV;
    let cy = Math.floor(current / KOLOM_NAV);

    for (let d of dirs) {
      let nx = cx + d.dx;
      let ny = cy + d.dy;
      if (nx < 0 || nx >= KOLOM_NAV || ny < 0 || ny >= BARIS_NAV) continue;

      let nIdx = ny * KOLOM_NAV + nx;
      if (himpunanTutup[nIdx] || kisiNavigasi[nIdx] === 1) continue;

      // Cegah memotong sudut dinding pada diagonal
      if (d.dx !== 0 && d.dy !== 0) {
        if (kisiNavigasi[cy * KOLOM_NAV + nx] === 1 || kisiNavigasi[ny * KOLOM_NAV + cx] === 1) {
          continue;
        }
      }

      let tentativeG = skorG[current] + d.cost;
      if (tentativeG < skorG[nIdx]) {
        asalLangkah[nIdx] = current;
        skorG[nIdx] = tentativeG;
        skorF[nIdx] = tentativeG + Math.hypot(tGx - nx, tGy - ny);
        if (!himpunanBuka.includes(nIdx)) {
          himpunanBuka.push(nIdx);
        }
      }
    }
  }

  if (!found) {
    return [{ x: targetX, y: targetY }];
  }

  let path = [];
  let curr = targetIdx;
  while (curr !== -1 && curr !== startIdx) {
    let px = (curr % KOLOM_NAV) * UKURAN_SEL_NAV + UKURAN_SEL_NAV / 2;
    let py = Math.floor(curr / KOLOM_NAV) * UKURAN_SEL_NAV + UKURAN_SEL_NAV / 2;
    path.unshift({ x: px, y: py });
    curr = asalLangkah[curr];
  }
  path.push({ x: targetX, y: targetY });

  // String pulling / Smoothing agar musuh berjalan melingkar halus mengitari sudut tembok
  if (path.length > 2) {
    let smoothed = [path[0]];
    let curIdx = 0;
    while (curIdx < path.length - 1) {
      let furthest = curIdx + 1;
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

  return path;
}

// DATA MAP & ARENA
// DATA MAP & ARENA (HUNTER ASSASSIN COMPOUNDS - MULTI-ROOM MAZES)
const mapData = {
  1: {
    1: {
      // SEKTOR 1 TAHAP 1: WAREHOUSE DEPOT INFILTRATION
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // West Wing Rooms & Hallways
        { x: 190, y: 20, w: 24, h: 260 }, { x: 190, y: 400, w: 24, h: 280 },
        // Central Office & Corridor Walls
        { x: 380, y: 140, w: 240, h: 24 }, { x: 490, y: 164, w: 24, h: 230 },
        { x: 380, y: 510, w: 260, h: 24 },
        // East Vault & Storage Walls
        { x: 730, y: 20, w: 24, h: 280 }, { x: 730, y: 420, w: 24, h: 260 },
        // Tactical Crates & Cover Pillars (Blocks sight & bullets)
        { x: 70, y: 310, w: 50, h: 50 }, { x: 260, y: 260, w: 45, h: 45 },
        { x: 620, y: 230, w: 45, h: 45 }, { x: 320, y: 560, w: 50, h: 50 },
        { x: 630, y: 570, w: 45, h: 45 }, { x: 840, y: 260, w: 50, h: 50 },
        { x: 840, y: 450, w: 50, h: 50 }
      ],
      sembunyi: [
        { x: 35, y: 560, w: 80, h: 80 },
        { x: 420, y: 35, w: 80, h: 70 },
        { x: 775, y: 35, w: 75, h: 70 }
      ],
      musuh: [
        { x: 300, y: 75, r: 16, tipe: "keroco", hp: 4, maxHp: 5, damage: 3, pDx: 2.5, pDy: 0 },
        { x: 640, y: 310, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 3, pDx: 0, pDy: 2.5 },
        { x: 540, y: 620, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 3, pDx: -2.5, pDy: 0 },
        { x: 860, y: 460, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 3, pDx: 0, pDy: -2.5 }
      ],
      daftarIntel: [{ x: 90, y: 90 }, { x: 430, y: 260 }, { x: 810, y: 110 }],
      daftarBerlian: [
        { x: 840, y: 160, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "cctv", x: 490, y: 140, sBase: Math.PI / 2, sw: Math.PI / 4 },
        { tipe: "trap", x: 500, y: 420, w: 40, h: 40 }
      ],
      koin: [{ x: 100, y: 600 }, { x: 600, y: 100 }],
      exit: { x: 930, y: 24 }
    },
    2: {
      // SEKTOR 1 TAHAP 2: CARGO VAULT & CHOKEPOINTS
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // L-Shaped Hallways & Rooms
        { x: 200, y: 140, w: 320, h: 24 }, { x: 200, y: 140, w: 24, h: 360 },
        { x: 420, y: 280, w: 340, h: 24 }, { x: 740, y: 140, w: 24, h: 380 },
        { x: 280, y: 480, w: 360, h: 24 },
        // Crates & Barricades
        { x: 90, y: 80, w: 50, h: 50 }, { x: 80, y: 380, w: 45, h: 45 },
        { x: 320, y: 210, w: 50, h: 45 }, { x: 580, y: 210, w: 45, h: 45 },
        { x: 580, y: 380, w: 50, h: 50 }, { x: 860, y: 240, w: 45, h: 45 },
        { x: 860, y: 460, w: 50, h: 50 }
      ],
      sembunyi: [
        { x: 45, y: 45, w: 80, h: 80 },
        { x: 460, y: 45, w: 80, h: 70 },
        { x: 870, y: 560, w: 80, h: 80 }
      ],
      musuh: [
        { x: 340, y: 80, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 5, pDx: 2.8, pDy: 0 },
        { x: 500, y: 200, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 2.0, pDy: 0 },
        { x: 120, y: 320, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 4, pDx: 0, pDy: 2.5 },
        { x: 840, y: 340, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 4, pDx: 0, pDy: -2.5 },
        { x: 500, y: 600, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 5, pDx: -2.8, pDy: 0 }
      ],
      daftarIntel: [{ x: 100, y: 600 }, { x: 500, y: 340 }, { x: 860, y: 90 }],
      daftarBerlian: [
        { x: 90, y: 240, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "cctv", x: 740, y: 140, sBase: Math.PI, sw: Math.PI / 3 },
        { tipe: "trap", x: 260, y: 540, w: 50, h: 50 }
      ],
      koin: [{ x: 400, y: 340 }, { x: 800, y: 500 }],
      exit: { x: 930, y: 24 }
    },
    3: {
      // SEKTOR 1 TAHAP 3: SYNDICATE EXECUTIVE LAIR - TARGET VIP LEVEL 1
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Ruang Eksekutif VIP Utama
        { x: 160, y: 140, w: 680, h: 24 }, { x: 160, y: 520, w: 680, h: 24 },
        { x: 320, y: 220, w: 24, h: 240 }, { x: 660, y: 220, w: 24, h: 240 },
        // Pilar Pertahanan Dalam Ruang VIP
        { x: 420, y: 240, w: 50, h: 24 }, { x: 530, y: 240, w: 50, h: 24 },
        { x: 420, y: 420, w: 50, h: 24 }, { x: 530, y: 420, w: 50, h: 24 },
        // Tactical Crates & Cover Luar
        { x: 80, y: 260, w: 45, h: 45 }, { x: 80, y: 400, w: 45, h: 45 },
        { x: 880, y: 260, w: 45, h: 45 }, { x: 880, y: 400, w: 45, h: 45 }
      ],
      sembunyi: [
        { x: 45, y: 560, w: 80, h: 80 }, { x: 870, y: 560, w: 80, h: 80 },
        { x: 460, y: 45, w: 80, h: 70 }
      ],
      musuh: [
        // TARGET UTAMA: VIP LEVEL 1 (DI DALAM RUANG VIP, HANYA BISA DIAM & DILINDUNGI BODYGUARD)
        { x: 500, y: 330, r: 16, tipe: "viplevel1", hp: 1, maxHp: 1, damage: 0, pDx: 0, pDy: 0, isVIP: true },
        // BOSS PENGAWAL KHUSUS VIP (boss.png)
        { x: 500, y: 380, r: 28, tipe: "boss", hp: 20, maxHp: 20, damage: 6, pDx: 2.2, pDy: 0 },
        // BODYGUARD JUGGERNAUT (MENJAGA PINTU MASUK RUANG VIP)
        { x: 380, y: 340, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 0, pDy: 2.2 },
        { x: 620, y: 340, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 0, pDy: -2.2 },
        // BODYGUARD PISTOL (MENJAGA KORIDOR DEKAT VIP)
        { x: 260, y: 200, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 3, pDx: 2.5, pDy: 0 },
        { x: 740, y: 460, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 3, pDx: -2.5, pDy: 0 },
        // PENJAGA KEROCO PATROLI KELILING RUANG VIP
        { x: 200, y: 580, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 3, pDx: 2.8, pDy: 0 },
        { x: 800, y: 100, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 3, pDx: -2.8, pDy: 0 }
      ],
      daftarIntel: [{ x: 500, y: 200 }, { x: 90, y: 90 }, { x: 860, y: 90 }],
      daftarBerlian: [
        { x: 500, y: 270, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "cctv", x: 500, y: 140, sBase: Math.PI / 2, sw: Math.PI / 2.5 },
        { tipe: "trap", x: 240, y: 340, w: 45, h: 45 },
        { tipe: "trap", x: 730, y: 340, w: 45, h: 45 }
      ],
      koin: [{ x: 240, y: 300 }, { x: 760, y: 300 }],
      exit: { x: 930, y: 24 }
    }
  },
  2: {
    1: {
      // SEKTOR 2 TAHAP 1: BIO-RESEARCH JUNGLE OUTPOST
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        { x: 220, y: 140, w: 24, h: 420 }, { x: 740, y: 140, w: 24, h: 420 },
        { x: 380, y: 240, w: 240, h: 24 }, { x: 380, y: 440, w: 240, h: 24 },
        { x: 100, y: 320, w: 45, h: 45 }, { x: 860, y: 320, w: 45, h: 45 },
        { x: 480, y: 330, w: 45, h: 45 }
      ],
      sembunyi: [
        { x: 45, y: 45, w: 90, h: 90 }, { x: 860, y: 550, w: 90, h: 90 },
        { x: 455, y: 45, w: 90, h: 75 }
      ],
      musuh: [
        { x: 140, y: 120, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 5, pDx: 0, pDy: 2.8 },
        { x: 860, y: 560, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 4, pDx: 0, pDy: -2.8 },
        { x: 490, y: 160, r: 16, tipe: "ker oco_pistol", hp: 5, maxHp: 5, damage: 4, pDx: 3.0, pDy: 0 },
        { x: 490, y: 520, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 5, pDx: -3.0, pDy: 0 }
      ],
      daftarIntel: [{ x: 300, y: 330 }, { x: 100, y: 600 }, { x: 860, y: 100 }],
      daftarBerlian: [
        { x: 490, y: 395, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "daun", x: 300, y: 300, r: 50 },
        { tipe: "trap", x: 490, y: 80, w: 50, h: 50 }
      ],
      koin: [{ x: 500, y: 100 }, { x: 200, y: 400 }],
      exit: { x: 930, y: 24 }
    },
    2: {
      // SEKTOR 2 TAHAP 2: JUNGLE BARRACKS
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        { x: 200, y: 100, w: 30, h: 500 }, { x: 750, y: 100, w: 30, h: 500 },
        { x: 360, y: 220, w: 280, h: 24 }, { x: 360, y: 460, w: 280, h: 24 },
        { x: 480, y: 330, w: 45, h: 45 }
      ],
      sembunyi: [
        { x: 45, y: 300, w: 80, h: 80 }, { x: 450, y: 300, w: 90, h: 90 },
        { x: 860, y: 300, w: 80, h: 80 }
      ],
      musuh: [
        { x: 450, y: 150, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 2.2, pDy: 0 },
        { x: 550, y: 530, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: -2.2, pDy: 0 },
        { x: 120, y: 250, r: 16, tipe: "keroco", hp: 5, maxHp: 5, damage: 5, pDx: 0, pDy: 2.6 },
        { x: 500, y: 350, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 4, pDx: 2.6, pDy: 0 },
        { x: 880, y: 450, r: 16, tipe: "keroco_pistol", hp: 5, maxHp: 5, damage: 4, pDx: 0, pDy: -2.6 }
      ],
      daftarIntel: [{ x: 500, y: 410 }, { x: 100, y: 600 }, { x: 880, y: 350 }],
      daftarBerlian: [
        { x: 500, y: 170, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "daun", x: 500, y: 180, r: 50 },
        { tipe: "trap", x: 500, y: 580, w: 50, h: 50 }
      ],
      koin: [{ x: 350, y: 350 }, { x: 650, y: 350 }],
      exit: { x: 930, y: 24 }
    },
    3: {
      // SEKTOR 2 TAHAP 3: JUNGLE COMMAND FORTRESS - TARGET VIP LEVEL 2
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Benteng Markas Komando
        { x: 150, y: 150, w: 200, h: 30 }, { x: 650, y: 150, w: 200, h: 30 },
        { x: 150, y: 500, w: 200, h: 30 }, { x: 650, y: 500, w: 200, h: 30 },
        { x: 360, y: 250, w: 24, h: 180 }, { x: 620, y: 250, w: 24, h: 180 },
        // Barikade Dalam Ruang VIP
        { x: 440, y: 250, w: 120, h: 24 }, { x: 440, y: 420, w: 120, h: 24 }
      ],
      sembunyi: [{ x: 45, y: 45, w: 80, h: 80 }, { x: 760, y: 45, w: 80, h: 75 }],
      musuh: [
        // TARGET UTAMA: VIP LEVEL 2 (DI DALAM BENTENG RIMBA, HANYA BISA DIAM & DILINDUNGI BODYGUARD)
        { x: 500, y: 340, r: 16, tipe: "viplevel2", hp: 1, maxHp: 1, damage: 0, pDx: 0, pDy: 0, isVIP: true },
        // BOSS RIMBA PENGAWAL KHUSUS VIP (boss.png)
        { x: 500, y: 375, r: 28, tipe: "boss", hp: 24, maxHp: 24, damage: 7, pDx: 2.4, pDy: 0 },
        // BARISAN BODYGUARD JUGGERNAUT
        { x: 400, y: 340, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 0, pDy: 2.2 },
        { x: 600, y: 340, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 0, pDy: -2.2 },
        { x: 500, y: 200, r: 21, tipe: "juggernaut", hp: 12, maxHp: 12, damage: 7, pDx: 2.2, pDy: 0 },
        // BODYGUARD PISTOL SNIPER RIMBA
        { x: 260, y: 120, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 2.6, pDy: 0 },
        { x: 740, y: 580, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: -2.6, pDy: 0 },
        // PATROLI PENJAGA BENTENG
        { x: 180, y: 320, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: 0, pDy: 2.8 },
        { x: 820, y: 320, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: 0, pDy: -2.8 }
      ],
      daftarIntel: [{ x: 500, y: 220 }, { x: 250, y: 90 }, { x: 750, y: 90 }],
      daftarBerlian: [
        { x: 500, y: 470, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "trap", x: 300, y: 320, w: 50, h: 50 },
        { tipe: "trap", x: 650, y: 320, w: 50, h: 50 }
      ],
      koin: [{ x: 500, y: 160 }, { x: 500, y: 520 }],
      exit: { x: 930, y: 24 }
    }
  },
  3: {
    1: {
      // SEKTOR 3 TAHAP 1: CYBER CITADEL SECURITY GRID
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        { x: 300, y: 20, w: 26, h: 420 }, { x: 660, y: 260, w: 26, h: 420 },
        { x: 120, y: 240, w: 50, h: 50 }, { x: 480, y: 240, w: 50, h: 50 },
        { x: 840, y: 440, w: 50, h: 50 }
      ],
      sembunyi: [{ x: 45, y: 580, w: 80, h: 80 }, { x: 760, y: 45, w: 80, h: 75 }],
      musuh: [
        { x: 150, y: 90, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: 0, pDy: 3.2 },
        { x: 850, y: 590, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 0, pDy: -3.2 },
        { x: 480, y: 140, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 3.2, pDy: 0 },
        { x: 480, y: 560, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: -3.2, pDy: 0 }
      ],
      daftarIntel: [{ x: 150, y: 350 }, { x: 500, y: 600 }, { x: 850, y: 350 }],
      daftarBerlian: [
        { x: 480, y: 330, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "laser", x: 330, y: 300, w: 320, h: 6 },
        { tipe: "trap", x: 490, y: 150, w: 50, h: 50 }
      ],
      koin: [{ x: 500, y: 200 }, { x: 500, y: 400 }],
      exit: { x: 930, y: 24 }
    },
    2: {
      // SEKTOR 3 TAHAP 2: CYBER CORE GENERATOR
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        { x: 150, y: 150, w: 700, h: 30 }, { x: 150, y: 510, w: 700, h: 30 },
        { x: 340, y: 260, w: 30, h: 180 }, { x: 630, y: 260, w: 30, h: 180 }
      ],
      sembunyi: [{ x: 45, y: 45, w: 80, h: 80 }, { x: 870, y: 570, w: 80, h: 80 }],
      musuh: [
        { x: 490, y: 90, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: 3.0, pDy: 0 },
        { x: 490, y: 600, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: -3.0, pDy: 0 },
        { x: 240, y: 350, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: 0, pDy: 2.8 },
        { x: 490, y: 350, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 2.8, pDy: 0 },
        { x: 740, y: 350, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 0, pDy: -2.8 }
      ],
      daftarIntel: [{ x: 300, y: 90 }, { x: 700, y: 90 }, { x: 300, y: 600 }],
      daftarBerlian: [
        { x: 490, y: 230, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "laser", x: 150, y: 350, w: 330, h: 6 },
        { tipe: "trap", x: 490, y: 300, w: 50, h: 50 }
      ],
      koin: [{ x: 100, y: 350 }, { x: 900, y: 350 }],
      exit: { x: 930, y: 24 }
    },
    3: {
      // SEKTOR 3 TAHAP 3: CYBER CITADEL PENTHOUSE - TARGET VIP LEVEL 3 & SUPREME BOSS
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        { x: 200, y: 180, w: 220, h: 30 }, { x: 580, y: 180, w: 220, h: 30 },
        { x: 200, y: 480, w: 220, h: 30 }, { x: 580, y: 480, w: 220, h: 30 }
      ],
      sembunyi: [{ x: 45, y: 310, w: 60, h: 90 }, { x: 890, y: 310, w: 60, h: 90 }],
      musuh: [
        // TARGET UTAMA: VIP LEVEL 3 (TAKHTA UTAMA CYBER CITADEL)
        { x: 500, y: 300, r: 16, tipe: "viplevel3", hp: 1, maxHp: 1, damage: 0, pDx: 0, pDy: 0, isVIP: true },
        // SUPREME BOSS PENGAWAL VIP (boss.png)
        { x: 500, y: 360, r: 28, tipe: "boss", hp: 28, maxHp: 28, damage: 8, pDx: 3.2, pDy: 0 },
        { x: 260, y: 110, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: 0, pDy: 2.6 },
        { x: 740, y: 580, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: 0, pDy: -2.6 },
        { x: 350, y: 340, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 2.8, pDy: 0 },
        { x: 650, y: 340, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: -2.8, pDy: 0 }
      ],
      daftarIntel: [{ x: 500, y: 240 }, { x: 90, y: 90 }, { x: 910, y: 90 }],
      daftarBerlian: [
        { x: 500, y: 460, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "laser", x: 420, y: 180, w: 160, h: 6 },
        { tipe: "trap", x: 490, y: 500, w: 60, h: 60 }
      ],
      koin: [{ x: 300, y: 350 }, { x: 700, y: 350 }],
      exit: { x: 930, y: 24 }
    },
    4: {
      // SEKTOR 3 TAHAP 4: THE SUPREME CYBER MASTERMIND THRONE - TARGET VIP LEVEL 3
      tembok: [
        { x: 0, y: 0, w: 1000, h: 20 }, { x: 0, y: 680, w: 1000, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 }, { x: 980, y: 0, w: 20, h: 700 },
        // Sayap Pelindung Takhta Tertinggi
        { x: 220, y: 150, w: 35, h: 400 }, { x: 740, y: 150, w: 35, h: 400 },
        { x: 390, y: 190, w: 220, h: 28 }, { x: 390, y: 470, w: 220, h: 28 },
        { x: 100, y: 320, w: 50, h: 50 }, { x: 850, y: 320, w: 50, h: 50 }
      ],
      sembunyi: [
        { x: 45, y: 45, w: 80, h: 80 }, { x: 760, y: 45, w: 80, h: 75 },
        { x: 45, y: 560, w: 80, h: 80 }
      ],
      musuh: [
        // TARGET VIP TERAKHIR: VIP LEVEL 3 (TAKHTA UTAMA, HANYA BISA DIAM & DILINDUNGI BODYGUARD)
        { x: 500, y: 310, r: 16, tipe: "viplevel3", hp: 1, maxHp: 1, damage: 0, pDx: 0, pDy: 0, isVIP: true },
        // SUPREME BOSS (MELINDUNGI VIP LEVEL 3)
        { x: 500, y: 370, r: 28, tipe: "boss", hp: 28, maxHp: 28, damage: 8, pDx: 2.6, pDy: 0 },
        // BODYGUARD ELIT CYBER JUGGERNAUT
        { x: 420, y: 250, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: 2.5, pDy: 0 },
        { x: 580, y: 410, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: -2.5, pDy: 0 },
        { x: 500, y: 550, r: 21, tipe: "juggernaut", hp: 14, maxHp: 14, damage: 7, pDx: 0, pDy: 2.5 },
        // BODYGUARD PENEMBAK CYBER PISTOL
        { x: 320, y: 90, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 3.2, pDy: 0 },
        { x: 680, y: 90, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: -3.2, pDy: 0 },
        { x: 500, y: 140, r: 16, tipe: "keroco_pistol", hp: 6, maxHp: 6, damage: 4, pDx: 0, pDy: 3.0 },
        // PENGAWAL KEROCO CYBER
        { x: 120, y: 390, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: 0, pDy: 3.2 },
        { x: 880, y: 390, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: 0, pDy: -3.2 },
        { x: 500, y: 620, r: 16, tipe: "keroco", hp: 6, maxHp: 6, damage: 5, pDx: -3.2, pDy: 0 }
      ],
      daftarIntel: [{ x: 500, y: 120 }, { x: 500, y: 550 }, { x: 120, y: 200 }],
      daftarBerlian: [
        { x: 80, y: 80, val: 1 }, { x: 910, y: 80, val: 1 }
      ],
      daftarJebakan: [
        { tipe: "laser", x: 260, y: 350, w: 130, h: 6 },
        { tipe: "laser", x: 610, y: 350, w: 130, h: 6 },
        { tipe: "trap", x: 470, y: 320, w: 60, h: 60 }
      ],
      koin: [{ x: 150, y: 550 }, { x: 850, y: 150 }],
      exit: { x: 930, y: 24 }
    }
  }
};

// RESET & INISIALISASI GAME
function resetGame(levelDimuat, tahapDimuat = 1) {
  levelSekarang = levelDimuat;
  tahapSekarang = tahapDimuat;
  window.gameState = "playing";
  statistikPermainan.killCount = 0;
  statistikPermainan.koinDiArena = 0;
  penghitungBingkai = 0;
  penghitungAlarmCCTV = 0;

  // Reset input statusTombol to prevent auto-drifting
  statusTombol.w = false;
  statusTombol.a = false;
  statusTombol.s = false;
  statusTombol.d = false;
  statusTombol.shift = false;

  pemain = {
    x: 70,
    y: 70,
    radius: 15,
    maxHp: 12,
    hp: 12,
    state: 'diam',
    arah: 'bawah',
    visualSudut: Math.PI / 2,
    actionTimer: 0,
    actionMaxTimer: 18,
    animFrame: 0,
    walkDistance: 0,
    vx: 0,
    vy: 0,
    leanAngle: 0,
    invincibleTimer: 0,
    kecepatanNormal: 3.5,
    kecepatanDash: 14,
    energiDash: 100,
    sudut: 0,
    trail: [],
    isHiding: false,
    warnaBase: warnaPemain,
    noiseR: 0,
    ammo: 5,
    ghostActive: false,
    ghostTimer: 0,
    ghostCooldown: 0,
    blinkCooldown: 0,
    timeActive: false,
    timeTimer: 0,
    timeCooldown: 0,
    cloneActive: false,
    cloneX: 0,
    cloneY: 0,
    cloneTimer: 0,
    cloneCooldown: 0,
    slashCharges: 2,
    slashCooldown: 0,
    slashResetTimer: 0,
    rapidActive: false,
    rapidTimer: 0,
    rapidCooldown: 0,
    rapidHitDone: 0
  };

  daftarTebasan = [];
  daftarShuriken = [];
  daftarItemPemulih = [];
  teksMelayang = [];
  daftarPeluruMusuh = [];
  daftarBerlian = [];
  statistikPermainan.stealthKills = 0;
  statistikPermainan.alarmsTriggered = 0;
  inisialisasiPartikelAmbien();
  updateHpUI();

  let mData = mapData[levelSekarang][tahapSekarang];
  tembok = JSON.parse(JSON.stringify(mData.tembok));
  sembunyi = JSON.parse(JSON.stringify(mData.sembunyi));
  bangunNavGrid();

  musuh = [];
  mData.musuh.forEach((m, mIdx) => {
    let kecepatanDasar = 3.0;
    let hpBawaan = 2;
    let damageBawaan = 3;
    let radiusBawaan = 16;
    let warnaKarakterMusuh = "#c0392b";

    let enemyType = m.tipe;
    if (enemyType === "kroco" || enemyType === "keroco") {
      enemyType = (mIdx % 2 === 1) ? "keroco_pistol" : "keroco";
    }

    let adalahVIP = false;
    let namaVIP = "";
    if (enemyType === "viplevel1") {
      kecepatanDasar = 0;
      hpBawaan = 1;
      damageBawaan = 0;
      radiusBawaan = 16;
      warnaKarakterMusuh = "#dc2626";
      adalahVIP = true;
      namaVIP = "VIP LEVEL 1 (DEFENSELESS)";
    } else if (enemyType === "viplevel2") {
      kecepatanDasar = 0;
      hpBawaan = 1;
      damageBawaan = 0;
      radiusBawaan = 16;
      warnaKarakterMusuh = "#e11d48";
      adalahVIP = true;
      namaVIP = "VIP LEVEL 2 (DEFENSELESS)";
    } else if (enemyType === "viplevel3") {
      kecepatanDasar = 0;
      hpBawaan = 1;
      damageBawaan = 0;
      radiusBawaan = 16;
      warnaKarakterMusuh = "#9333ea";
      adalahVIP = true;
      namaVIP = "VIP LEVEL 3 (DEFENSELESS)";
    } else if (enemyType === "rival") {
      kecepatanDasar = 5.0;
      hpBawaan = 28;
      damageBawaan = 7;
      radiusBawaan = 18;
      warnaKarakterMusuh = "#dc2626";
    } else if (enemyType === "boss") {
      kecepatanDasar = 3.2;
      hpBawaan = 24;
      damageBawaan = 7;
      radiusBawaan = 28;
      warnaKarakterMusuh = "#8e44ad";
    } else if (enemyType === "juggernaut") {
      kecepatanDasar = 2.2;
      hpBawaan = 12;
      damageBawaan = 7;
      radiusBawaan = 21;
      warnaKarakterMusuh = "#475569";
    } else if (enemyType === "keroco_pistol") {
      kecepatanDasar = 3.0;
      hpBawaan = 5;
      damageBawaan = 4;
      radiusBawaan = 16;
      warnaKarakterMusuh = "#f97316";
    } else {
      // Keroco (Melee)
      kecepatanDasar = 3.2;
      hpBawaan = 5;
      damageBawaan = 5;
      radiusBawaan = 16;
      warnaKarakterMusuh = "#c0392b";
    }

    let dx = m.pDx > 0 ? kecepatanDasar : (m.pDx < 0 ? -kecepatanDasar : 0);
    let dy = m.pDy > 0 ? kecepatanDasar : (m.pDy < 0 ? -kecepatanDasar : 0);

    musuh.push({
      x: m.x,
      y: m.y,
      radius: m.r || radiusBawaan,
      warnaBase: warnaKarakterMusuh,
      tipe: enemyType,
      isVIP: adalahVIP || !!m.isVIP,
      namaVIP: namaVIP || m.vipName || "",
      hp: m.hp || hpBawaan,
      maxHp: m.maxHp || hpBawaan,
      damage: m.damage || damageBawaan,
      patrolDx: dx,
      patrolDy: dy,
      dx: dx,
      dy: dy,
      sudut: Math.atan2(dy, dx) || 0,
      status: "patrol",
      prevStatus: "patrol",
      alertTimer: 0,
      stunTimer: 0,
      shootCooldown: Math.floor(Math.random() * 40),
      isAlerted: false,
      canTakedown: false,
      dashTimer: 0,
      dashCooldown: 120,
      cloneCooldown: 360,
      smokeCooldown: 600,
      shurikenCooldown: 220,
      vulnerableTimer: 0,
      parryCooldown: 180,
      stealthTimer: 0,
      isStealth: false,
      walkDistance: 0,
      attackTimer: 0,
      path: null,
      pathTimer: 0,
      stuckCount: 0,
      trail: []
    });
  });

  daftarIntel = [];

  daftarJebakan = [];
  if (mData.hazards) {
    mData.hazards.forEach(h => daftarJebakan.push(Object.assign({ active: false, alertActive: false }, h)));
  }

  daftarKoinPeta = [];
  if (mData.koin) {
    mData.koin.forEach(k => daftarKoinPeta.push({ x: k.x, y: k.y, collected: false }));
  }

  // Muat Berlian / Diamonds dari mapData (langka)
  if (mData.diamonds) {
    mData.diamonds.forEach(d => daftarBerlian.push({ x: d.x, y: d.y, value: d.val || 1, collected: false, frame: Math.random() * 100 }));
  }

  // Titik Pintu Berpindah Tempat / Pintu Keluar (TERKUNCI DI SETIAP TAHAP SAMPAI SEMUA MUSUH DIHABISI)
  portalKeluar = {
    x: mData.exit ? mData.exit.x : 930,
    y: mData.exit ? mData.exit.y : 24,
    active: false,
    radius: 34
  };

  JARAK_PANDANG = 220 + (levelSekarang * 15) + (tahapSekarang * 15);
  updateTeksStatus();
}

function cekTabrakanTembok(posisiX, posisiY, radius) {
  for (let t of tembok) {
    if (posisiX + radius > t.x && posisiX - radius < t.x + t.w && posisiY + radius > t.y && posisiY - radius < t.y + t.h) {
      return true;
    }
  }
  return false;
}

// ANTI-NYANGKUT: Mengeluarkan musuh/boss jika sedikit terperangkap di tepi tembok
function bebaskanMusuhDariTembok(m) {
  for (let iter = 0; iter < 2; iter++) {
    let collided = false;
    for (let t of tembok) {
      if (m.x + m.radius > t.x && m.x - m.radius < t.x + t.w &&
        m.y + m.radius > t.y && m.y - m.radius < t.y + t.h) {
        collided = true;
        let dKiri = (m.x + m.radius) - t.x;
        let dKanan = (t.x + t.w) - (m.x - m.radius);
        let dAtas = (m.y + m.radius) - t.y;
        let dBawah = (t.y + t.h) - (m.y - m.radius);
        let minD = Math.min(dKiri, dKanan, dAtas, dBawah);
        if (minD === dKiri) m.x = t.x - m.radius - 0.5;
        else if (minD === dKanan) m.x = t.x + t.w + m.radius + 0.5;
        else if (minD === dAtas) m.y = t.y - m.radius - 0.5;
        else if (minD === dBawah) m.y = t.y + t.h + m.radius + 0.5;
      }
    }
    if (!collided) break;
  }
  // Cegah musuh terdorong ke luar batas arena kanvas
  m.x = Math.max(m.radius + 2, Math.min(canvas.width - m.radius - 2, m.x));
  m.y = Math.max(m.radius + 2, Math.min(canvas.height - m.radius - 2, m.y));
}

// ==========================================
// INI LOGIKA PENGECEKAN SENTER MUSUH KE PEMAIN (CONE VISION & RAYCAST)
// ==========================================
function cekMelihatPemain(m) {
  // 1. Jika pemain sedang sembunyi di kardus / menggunakan skill ghost invisible -> tidak terdeteksi
  if (pemain.isHiding || pemain.ghostActive) return false;

  let jX = pemain.x - m.x;
  let jY = pemain.y - m.y;
  let jTot = Math.hypot(jX, jY);

  // 2. Logika batas jarak pandang: jika di luar jangkauan senter -> tidak terlihat
  if (jTot > JARAK_PANDANG) return false;

  // 3. Logika sudut pandang (cone): menghitung apakah pemain berada di dalam kerucut cahaya senter
  let sPemain = Math.atan2(jY, jX);
  let selisih = Math.abs(sPemain - m.sudut);
  if (selisih > Math.PI) selisih = 2 * Math.PI - selisih;
  if (selisih > LEBAR_PANDANG) return false;

  // 4. Logika raycast (garis pandang): cek apakah ada tembok yang menghalangi cahaya senter ke pemain
  let hitDist = hitRayWall(m.x, m.y, jX / jTot, jY / jTot, jTot);
  return hitDist >= jTot - 5;
}

function picuSuara(x, y, radius) {
  for (let m of musuh) {
    if (Math.hypot(x - m.x, y - m.y) < radius) {
      m.status = "investigate";
      m.targetX = x;
      m.targetY = y;
      m.alertTimer = 180;
      m.path = null;
      m.pathTimer = 0;
    }
  }
}

// SKILLS
function gunakanSkillGhost() {
  if (window.gameState !== "playing" || localStorage.getItem('skill_ghost') !== 'true' || pemain.ghostCooldown > 0) return;
  pemain.ghostActive = true;
  pemain.ghostTimer = 300;
  pemain.ghostCooldown = 900;
  mainkanSuara('magic');
  tambahVFX(pemain.x, pemain.y, "#00e5ff", "gelombang");
  munculkanTeks(pemain.x, pemain.y - 25, "GHOST WALK!", "#00e5ff");
}

function gunakanSkillBlink() {
  if (window.gameState !== "playing" || localStorage.getItem('skill_blink') !== 'true' || pemain.blinkCooldown > 0) return;
  let tM = null;
  let jT = 600;
  let tI = -1;
  for (let i = 0; i < musuh.length; i++) {
    let j = Math.hypot(pemain.x - musuh[i].x, pemain.y - musuh[i].y);
    if (j < jT) {
      jT = j;
      tM = musuh[i];
      tI = i;
    }
  }
  if (tM) {
    pemain.state = 'dash';
    pemain.actionTimer = 15;
    tambahVFX(pemain.x, pemain.y, "#e74c3c", "ledakan");
    pemain.x = tM.x;
    pemain.y = tM.y;
    daftarTebasan.push({ x: pemain.x, y: pemain.y, sudut: 0, frame: 0 });
    tambahVFX(pemain.x, pemain.y, "#e74c3c", "ledakan");

    // Blood decal
    kotoran.push({ x: tM.x, y: tM.y, r: tM.tipe === "boss" ? 14 : 9, isBlood: true, a: 0.8 });

    tM.hp -= 2;
    if (tM.hp <= 0) {
      daftarKoinPeta.push({ x: tM.x, y: tM.y, collected: false, drop: true });
      dropRegenItem(tM.x, tM.y);
      musuh.splice(tI, 1);
      statistikPermainan.killCount++;
      munculkanTeks(pemain.x, pemain.y - 20, Teks.blinkKill, "#e74c3c");
    } else {
      tM.stunTimer = 25;
      munculkanTeks(tM.x, tM.y - 15, `-2 HP (${tM.hp}/${tM.maxHp})`, "#e74c3c");
    }
    pemain.blinkCooldown = 600;
    getarLayar = 15;
    mainkanSuara('slash');
  }
}

function gunakanSkillTime() {
  if (window.gameState !== "playing" || localStorage.getItem('skill_time') !== 'true' || pemain.timeCooldown > 0) return;
  pemain.timeActive = true;
  pemain.timeTimer = 240;
  pemain.timeCooldown = 1200;
  mainkanSuara('magic');
  munculkanTeks(pemain.x, pemain.y - 20, Teks.timeFreeze, "#9b59b6");
  tambahVFX(pemain.x, pemain.y, "#9b59b6", "gelombang");
}

function gunakanSkillClone() {
  if (window.gameState !== "playing" || localStorage.getItem('skill_clone') !== 'true' || pemain.cloneCooldown > 0) return;
  pemain.cloneActive = true;
  pemain.cloneTimer = 300;
  pemain.cloneCooldown = 1200;
  pemain.cloneX = pemain.x;
  pemain.cloneY = pemain.y;
  mainkanSuara('magic');
  munculkanTeks(pemain.x, pemain.y - 20, Teks.shadowClone, "#2ecc71");
  tambahVFX(pemain.x, pemain.y, "#2ecc71", "ledakan");
}

function gunakanSkillRapidSlash() {
  if (window.gameState !== "playing") return;
  if (pemain.rapidCooldown > 0) {
    let sisa = (pemain.rapidCooldown / 60).toFixed(1);
    munculkanTeks(pemain.x, pemain.y - 20, `RAPID CD (${sisa}s)`, "#f59e0b");
    mainkanSuara('block');
    return;
  }
  // Cek kepemilikan skill di storage (default true agar langsung aktif atau via toko)
  if (localStorage.getItem('skill_rapid') === 'false') return;

  pemain.state = 'serang';
  pemain.actionTimer = 120;
  pemain.rapidActive = true;
  pemain.rapidTimer = 120; // 2 Detik (120 frame pada 60fps)
  pemain.rapidCooldown = 900; // 15 Detik Cooldown
  pemain.rapidHitDone = 0;
  mainkanSuara('slash');
  playTone('sawtooth', 320, 750, 0.25, 0.35);
  munculkanTeks(pemain.x, pemain.y - 25, "🌪️ RAPID SLASHES! (-3 BAR HP)", "#f59e0b");
  tambahVFX(pemain.x, pemain.y, "#f59e0b", "gelombang");
  getarLayar = 15;
}

function lemparShuriken() {
  if (window.gameState !== "playing" || pemain.ammo <= 0) return;
  pemain.ammo--;
  pemain.state = 'serang';
  pemain.actionTimer = 12;
  daftarShuriken.push({
    x: pemain.x,
    y: pemain.y,
    dx: Math.cos(pemain.sudut) * 13,
    dy: Math.sin(pemain.sudut) * 13,
    rot: 0
  });
  mainkanSuara('shuriken');
}

// UPDATE LOGIC
function update() {
  if (window.gameState !== "playing") return;
  penghitungBingkai++;
  if (getarLayar > 0) getarLayar--;
  if (penghitungAlarmCCTV > 0) penghitungAlarmCCTV--;
  if (jedaSuaraWaspada > 0) jedaSuaraWaspada--;

  // Update Teks Melayang
  for (let i = teksMelayang.length - 1; i >= 0; i--) {
    let tm = teksMelayang[i];
    tm.y += tm.vy;
    tm.a -= 0.018;
    if (tm.a <= 0) teksMelayang.splice(i, 1);
  }

  // Update Shurikens 
  for (let i = daftarShuriken.length - 1; i >= 0; i--) {
    let s = daftarShuriken[i];
    s.x += s.dx;
    s.y += s.dy;
    s.rot += 0.5;

    if (cekTabrakanTembok(s.x, s.y, 5)) {
      picuSuara(s.x, s.y, 180);
      tambahVFX(s.x, s.y, s.isEnemy ? "#ef4444" : "#bdc3c7", "partikel");
      daftarShuriken.splice(i, 1);
      continue;
    }

    // Jika Shuriken Musuh (Rival Assassin) Menyerang Pemain
    if (s.isEnemy) {
      if (Math.hypot(s.x - pemain.x, s.y - pemain.y) < pemain.radius + 6 && !pemain.ghostActive && !pemain.isHiding) {
        if (pemain.invincibleTimer <= 0) {
          pemain.hp -= 2;
          pemain.invincibleTimer = 45;
          getarLayar = 12;
          munculkanTeks(pemain.x, pemain.y - 20, "-2 HP (KUNAI RIVAL)", "#ef4444");
          playTone('sawtooth', 180, 80, 0.2, 0.35);
          updateHpUI();
          tambahVFX(pemain.x, pemain.y, "#ef4444", "ledakan");
          if (pemain.hp <= 0) {
            pemain.hp = 0;
            updateHpUI();
            window.gameState = "lose";
            mainkanSuara('lose');
          }
        }
        daftarShuriken.splice(i, 1);
      }
      continue;
    }

    let hit = false;
    for (let j = 0; j < musuh.length; j++) {
      let mTarget = musuh[j];
      if (Math.hypot(s.x - mTarget.x, s.y - mTarget.y) < mTarget.radius + 6) {
        if (mTarget.tipe === "juggernaut") {
          let sP = Math.abs(Math.atan2(s.y - mTarget.y, s.x - mTarget.x) - mTarget.sudut);
          if (sP > Math.PI) sP = 2 * Math.PI - sP;
          if (sP < Math.PI / 2) {
            munculkanTeks(mTarget.x, mTarget.y, Teks.blocked, "#94a3b8");
            mainkanSuara('block');
            getarLayar = 8;
            daftarShuriken.splice(i, 1);
            hit = true;
            break;
          }
        }

        // Rival Assassin menepis shuriken jika tidak sedang stun / vulnerable
        if (mTarget.tipe === "rival" && !pemain.timeActive && (!mTarget.stunTimer || mTarget.stunTimer <= 0) && (!mTarget.vulnerableTimer || mTarget.vulnerableTimer <= 0)) {
          munculkanTeks(mTarget.x, mTarget.y - 18, "⚔️ KUNAI DEFLECTED!", "#ef4444");
          mainkanSuara('block');
          playTone('triangle', 650, 120, 0.15, 0.3);
          tambahVFX(mTarget.x, mTarget.y, "#ef4444", "ledakan");
          getarLayar = 7;
          daftarShuriken.splice(i, 1);
          hit = true;
          break;
        }

        mTarget.hp--;
        mTarget.stunTimer = 16;
        let kx = (s.dx > 0 ? 1 : -1) * 20;
        let ky = (s.dy > 0 ? 1 : -1) * 20;
        if (!cekTabrakanTembok(mTarget.x + kx, mTarget.y, mTarget.radius)) mTarget.x += kx;
        if (!cekTabrakanTembok(mTarget.x, mTarget.y + ky, mTarget.radius)) mTarget.y += ky;
        bebaskanMusuhDariTembok(mTarget);

        if (mTarget.hp <= 0) {
          kotoran.push({ x: mTarget.x, y: mTarget.y, r: mTarget.tipe === "boss" ? 14 : 8, isBlood: true, a: 0.8 });
          daftarKoinPeta.push({ x: mTarget.x, y: mTarget.y, collected: false, drop: true });
          dropRegenItem(mTarget.x, mTarget.y);
          let tipeMati = mTarget.tipe;
          musuh.splice(j, 1);
          statistikPermainan.killCount++;
          if (tipeMati === "rival") {
            munculkanTeks(s.x, s.y, "RIVAL DEFEATED!", "#ef4444");
          } else if (tipeMati === "rival_clone") {
            munculkanTeks(s.x, s.y, "CLONE DISSOLVED!", "#9333ea");
          } else {
            munculkanTeks(s.x, s.y, Teks.headshot, "#e74c3c");
          }
          mainkanSuara('slash');
          getarLayar = 10;
        } else {
          mainkanSuara('block');
          munculkanTeks(mTarget.x, mTarget.y - 12, `-1 HP (${mTarget.hp}/${mTarget.maxHp})`, "gold");
          tambahVFX(mTarget.x, mTarget.y, mTarget.warnaBase, "ledakan");
        }
        daftarShuriken.splice(i, 1);
        hit = true;
        break;
      }
    }
  }
  // Update Peluru Musuh (Enemy Tracer Bullets - Hunter Assassin Mechanics)
  for (let bIdx = daftarPeluruMusuh.length - 1; bIdx >= 0; bIdx--) {
    let eb = daftarPeluruMusuh[bIdx];
    eb.x += eb.vx;
    eb.y += eb.vy;
    eb.life--;

    // Tabrakan Peluru ke Tembok (Percikan Sparks)
    if (cekTabrakanTembok(eb.x, eb.y, 4)) {
      tambahVFX(eb.x, eb.y, "#facc15", "partikel");
      daftarPeluruMusuh.splice(bIdx, 1);
      continue;
    }

    // Tabrakan Peluru ke Pemain (Kena Tembak)
    let radiusKenaPeluru = pemain.radius + (eb.isBoss ? 7 : 4);
    if (!pemain.ghostActive && !pemain.isHiding && Math.hypot(eb.x - pemain.x, eb.y - pemain.y) < radiusKenaPeluru) {
        let dmg = eb.damage !== undefined ? eb.damage : (eb.isVIP ? 7 : (eb.isBoss ? 6 : 4));
        pemain.hp -= dmg;
        pemain.invincibleTimer = (eb.isBoss || eb.isVIP) ? 45 : 35;
        getarLayar = (eb.isBoss || eb.isVIP) ? 25 : 12;
        let teksPop = eb.isVIP ? `-${dmg} HP (VIP CANNON!)` : (eb.isBoss ? `-${dmg} HP (BOSS CANNON!)` : `-${dmg} HP (SHOT)`);
        munculkanTeks(pemain.x, pemain.y - 20, teksPop, "#ef4444");
        playTone('sawtooth', eb.isBoss ? 160 : 200, 60, 0.22, 0.45);
        updateHpUI();
        tambahVFX(pemain.x, pemain.y, eb.isBoss ? "#ef4444" : "#f59e0b", "ledakan");
        if (pemain.hp <= 0) {
          pemain.hp = 0;
          updateHpUI();
          window.gameState = "lose";
          mainkanSuara('lose');
        }
        daftarPeluruMusuh.splice(bIdx, 1);
        continue;
      }

    if (eb.life <= 0) {
      daftarPeluruMusuh.splice(bIdx, 1);
    }
  }


  // Update Timers & Cooldowns
  if (pemain.actionTimer > 0) pemain.actionTimer--;
  if (pemain.invincibleTimer > 0) pemain.invincibleTimer--;
  if (pemain.ghostTimer > 0) {
    pemain.ghostTimer--;
    if (pemain.ghostTimer <= 0) pemain.ghostActive = false;
  }
  if (pemain.ghostCooldown > 0) pemain.ghostCooldown--;
  if (pemain.blinkCooldown > 0) pemain.blinkCooldown--;
  if (pemain.timeTimer > 0) {
    pemain.timeTimer--;
    if (pemain.timeTimer <= 0) pemain.timeActive = false;
  }
  if (pemain.timeCooldown > 0) pemain.timeCooldown--;
  if (pemain.cloneTimer > 0) {
    pemain.cloneTimer--;
    if (pemain.cloneTimer <= 0) pemain.cloneActive = false;
  }
  if (pemain.cloneCooldown > 0) pemain.cloneCooldown--;

  // Update Slash Limiter (2x tebas, cooldown 2 detik)
  if (pemain.slashCooldown > 0) {
    pemain.slashCooldown--;
    if (pemain.slashCooldown <= 0) {
      pemain.slashCharges = 2;
    }
  } else if (pemain.slashResetTimer > 0) {
    pemain.slashResetTimer--;
    if (pemain.slashResetTimer <= 0) {
      pemain.slashCharges = 2;
    }
  }

  // Update Skill Baru: Tebasan Pedang Sangat Cepat & Bertubi-tubi (2 Detik, Mengurangi 3 Bar HP)
  if (pemain.rapidActive && pemain.rapidTimer > 0) {
    pemain.rapidTimer--;

    // Efek flurry daftarTebasan & audio setiap 6 frame
    if (pemain.rapidTimer % 6 === 0) {
      let randA = pemain.sudut + (Math.random() - 0.5) * 1.6;
      daftarTebasan.push({
        x: pemain.x + Math.cos(randA) * (20 + Math.random() * 20),
        y: pemain.y + Math.sin(randA) * (20 + Math.random() * 20),
        sudut: randA,
        frame: 0
      });
      playTone('sawtooth', 380 + Math.random() * 260, 180, 0.08, 0.18);
      getarLayar = Math.max(getarLayar, 5);
      tambahVFX(pemain.x + Math.cos(randA) * 22, pemain.y + Math.sin(randA) * 22, "#f59e0b", "partikel");
    }

    pemain.trail.push({ x: pemain.x, y: pemain.y, alpha: 0.65, sudut: pemain.sudut });

    // 3 Serangan Pukulan Utama berurutan dalam durasi 2 detik (mengurangi total 3 Bar HP)
    if (pemain.rapidTimer === 100 || pemain.rapidTimer === 60 || pemain.rapidTimer === 20) {
      pemain.rapidHitDone = (pemain.rapidHitDone || 0) + 1;
      for (let mIdx = musuh.length - 1; mIdx >= 0; mIdx--) {
        let m = musuh[mIdx];
        if (Math.hypot(pemain.x - m.x, pemain.y - m.y) < 115) {
          // Jika Rival Assassin dan tidak sedang beku / vulnerable, dia berpeluang menghindar
          if (m.tipe === "rival" && !pemain.timeActive && m.vulnerableTimer <= 0 && m.dashCooldown <= 0) {
            m.x += (Math.random() > 0.5 ? 1 : -1) * 80;
            bebaskanMusuhDariTembok(m);
            m.dashCooldown = 90;
            munculkanTeks(m.x, m.y - 20, "DODGED FLURRY!", "#ef4444");
            continue;
          }

          m.hp--;
          m.stunTimer = 18;
          tambahVFX(m.x, m.y, "#f59e0b", "ledakan");
          munculkanTeks(m.x, m.y - 15, `-1 BAR HP [Hit ${pemain.rapidHitDone}/3]`, "#f59e0b");
          getarLayar = 12;

          if (m.hp <= 0) {
            kotoran.push({ x: m.x, y: m.y, r: (m.tipe === "boss" || m.tipe === "rival") ? 14 : 9, isBlood: true, a: 0.8 });
            daftarKoinPeta.push({ x: m.x, y: m.y, collected: false, drop: true });
            dropRegenItem(m.x, m.y);
            let tipeMati = m.tipe;
            musuh.splice(mIdx, 1);
            statistikPermainan.killCount++;
            if (tipeMati === "rival") {
              munculkanTeks(m.x, m.y, "RIVAL DEFEATED!", "#ef4444");
            } else if (tipeMati === "boss") {
              munculkanTeks(m.x, m.y, "BOSS DOWN!", "#2ecc71");
            } else if (tipeMati === "rival_clone") {
              munculkanTeks(m.x, m.y, "CLONE DISSOLVED!", "#9333ea");
            } else {
              munculkanTeks(m.x, m.y, Teks.assassinated, "#e74c3c");
            }
          }
        }
      }
    }

    if (pemain.rapidTimer <= 0) {
      pemain.rapidActive = false;
    }
  }
  if (pemain.rapidCooldown > 0) pemain.rapidCooldown--;

  let pengaliKecepatan = pemain.timeActive ? 0.2 : 1;

  // Cek Tempat Sembunyi
  pemain.isHiding = false;
  for (let s of sembunyi) {
    if (pemain.x > s.x && pemain.x < s.x + s.w && pemain.y > s.y && pemain.y < s.y + s.h) {
      pemain.isHiding = true;
    }
  }

  // Cek Hazards: Trap Duri Lantai
  for (let h of daftarJebakan) {
    if (h.tipe === "trap") {
      h.active = Math.floor(penghitungBingkai / 90) % 2 === 0;
      h.telegraph = (!h.active && (penghitungBingkai % 90 > 70));
      if (h.active && !pemain.ghostActive && Math.hypot(pemain.x - (h.x + h.w / 2), pemain.y - (h.y + h.h / 2)) < pemain.radius + h.w / 2 - 6) {
        if (pemain.invincibleTimer <= 0) {
          pemain.hp -= 4;
          pemain.invincibleTimer = 50;
          getarLayar = 14;
          munculkanTeks(pemain.x, pemain.y - 20, "-4 HP (TRAP)", "#ef4444");
          playTone('sawtooth', 140, 60, 0.25, 0.4);
          updateHpUI();
          if (pemain.hp <= 0) {
            pemain.hp = 0;
            updateHpUI();
            window.gameState = "lose";
            mainkanSuara('lose');
          }
        }
      }
    }
  }

  // Gerak & Dash Pemain (Fluid & Realistic Physics)
  let currentSpeed = pemain.kecepatanNormal;
  pemain.noiseR = 0;
  let adaInputGerakan = statusTombol.w || statusTombol.s || statusTombol.a || statusTombol.d;

  if (statusTombol.shift && pemain.energiDash > 0 && adaInputGerakan) {
    if (!sedangNgedash) {
      mainkanSuara('dash');
      sedangNgedash = true;
    }
    currentSpeed = pemain.kecepatanDash;
    pemain.energiDash -= 2.2;
    pemain.noiseR = 150;
    picuSuara(pemain.x, pemain.y, pemain.noiseR);
  } else {
    sedangNgedash = false;
    if (pemain.energiDash < 100) pemain.energiDash += 0.65;
  }

  pemain.trail.forEach(t => t.alpha -= 0.05);
  pemain.trail = pemain.trail.filter(t => t.alpha > 0);
  daftarTebasan.forEach(s => s.frame++);
  daftarTebasan = daftarTebasan.filter(s => s.frame < 15);

  let inputX = 0, inputY = 0;
  if (statusTombol.w) inputY -= 1;
  if (statusTombol.s) inputY += 1;
  if (statusTombol.a) inputX -= 1;
  if (statusTombol.d) inputX += 1;

  // Normalisasi gerakan diagonal
  if (inputX !== 0 && inputY !== 0) {
    inputX *= 0.7071;
    inputY *= 0.7071;
  }

  let targetVx = inputX * currentSpeed;
  let targetVy = inputY * currentSpeed;

  // Smooth Acceleration & Deceleration (Mencegah Gerakan Kaku)
  let kecepatanInterpolasi = sedangNgedash ? 0.38 : 0.28;
  pemain.vx = (pemain.vx || 0) + (targetVx - (pemain.vx || 0)) * kecepatanInterpolasi;
  pemain.vy = (pemain.vy || 0) + (targetVy - (pemain.vy || 0)) * kecepatanInterpolasi;
  if (Math.abs(pemain.vx) < 0.04) pemain.vx = 0;
  if (Math.abs(pemain.vy) < 0.04) pemain.vy = 0;

  let kecepatanGerak = Math.hypot(pemain.vx, pemain.vy);
  let sedangBergerak = kecepatanGerak > 0.25;

  if (sedangBergerak) {
    let sudutTarget = Math.atan2(pemain.vy, pemain.vx);
    pemain.sudut = sudutTarget;
    if (pemain.visualSudut === undefined) pemain.visualSudut = sudutTarget;
    // Rotasi 8-arah & 360 derajat sangat mulus dan tidak kaku
    pemain.visualSudut = lerpAngle(pemain.visualSudut, sudutTarget, sedangNgedash ? 0.38 : 0.26);

    // Tentukan penamaan 8 arah
    let deg = ((sudutTarget * 180 / Math.PI) + 360) % 360;
    if (deg >= 337.5 || deg < 22.5) pemain.arah = 'kanan';
    else if (deg >= 22.5 && deg < 67.5) pemain.arah = 'bawah_kanan';
    else if (deg >= 67.5 && deg < 112.5) pemain.arah = 'bawah';
    else if (deg >= 112.5 && deg < 157.5) pemain.arah = 'bawah_kiri';
    else if (deg >= 157.5 && deg < 202.5) pemain.arah = 'kiri';
    else if (deg >= 202.5 && deg < 247.5) pemain.arah = 'atas_kiri';
    else if (deg >= 247.5 && deg < 292.5) pemain.arah = 'atas';
    else pemain.arah = 'atas_kanan';

    pemain.walkDistance = (pemain.walkDistance || 0) + kecepatanGerak;
  }

  // Tilt/Lean dinamis untuk postur tubuh lincah
  if (sedangBergerak) {
    let targetKemiringan = (pemain.arah === 'kiri' ? -0.1 : (pemain.arah === 'kanan' ? 0.1 : 0));
    pemain.leanAngle = (pemain.leanAngle || 0) + (targetKemiringan - (pemain.leanAngle || 0)) * 0.18;
  } else {
    pemain.leanAngle = (pemain.leanAngle || 0) * 0.8;
  }

  // 2. STATE MACHINE (MESIN STATUS & ANIMASI LENGKAP)
  if (pemain.actionTimer > 0 || (pemain.rapidActive && pemain.rapidTimer > 0)) {
    pemain.state = 'serang';
    if (pemain.rapidActive) {
      pemain.animFrame = Math.floor(penghitungBingkai / 4) % 3;
    } else {
      let maxT = pemain.actionMaxTimer || 18;
      let p = 1 - (pemain.actionTimer / maxT);
      pemain.animFrame = p < 0.28 ? 0 : (p < 0.72 ? 1 : 2);
    }
  } else if (sedangNgedash && sedangBergerak) {
    pemain.state = 'dash';
    pemain.animFrame = Math.floor(penghitungBingkai / 4) % 4;
    // Merekam jejak bayangan halus (afterimage shadow) saat dash
    if (penghitungBingkai % 3 === 0) {
      let kunciBaju = petaWarnaBaju[warnaPemain] || 'navy';
      let gambarLembarSprite = asetGame.spritesheets[kunciBaju] || asetGame.spritesheets.navy;
      let sData = DATA_LEMBAR_SPRITE[kunciBaju] || DATA_LEMBAR_SPRITE['navy'];
      let sRect = (sData.walk && sData.walk[3]) ? sData.walk[3] : sData.idle;
      pemain.trail.push({
        x: pemain.x,
        y: pemain.y,
        sudut: pemain.visualSudut !== undefined ? pemain.visualSudut : pemain.sudut,
        alpha: 0.45,
        sRect: sRect,
        gambarLembarSprite: gambarLembarSprite
      });
      if (pemain.trail.length > 5) pemain.trail.shift();
    }
  } else if (sedangBergerak) {
    pemain.state = 'jalan';
    pemain.animFrame = Math.floor(pemain.walkDistance / 14) % 8;
  } else {
    pemain.state = 'diam';
    pemain.animFrame = 0;
  }

  // Sliding Tembok Halus Tanpa Nyangkut
  pemain.x += pemain.vx;
  if (cekTabrakanTembok(pemain.x, pemain.y, pemain.radius)) {
    pemain.x -= pemain.vx;
    pemain.vx = 0;
  }
  pemain.y += pemain.vy;
  if (cekTabrakanTembok(pemain.x, pemain.y, pemain.radius)) {
    pemain.y -= pemain.vy;
    pemain.vy = 0;
  }

  // Ambil Koin
  for (let k of daftarKoinPeta) {
    if (!k.collected && Math.hypot(pemain.x - k.x, pemain.y - k.y) < 25) {
      k.collected = true;
      statistikPermainan.koinDiArena += 50;
      munculkanTeks(k.x, k.y, "+50 Koin", "#f1c40f");
      mainkanSuara('coin');
      tambahVFX(k.x, k.y, "#f1c40f", "partikel");
    }
  }

  // Ambil Regen Item (Penambah Darah)
  for (let i = daftarItemPemulih.length - 1; i >= 0; i--) {
    let r = daftarItemPemulih[i];
    r.frame = (r.frame || 0) + 0.06;
    if (!r.collected && Math.hypot(pemain.x - r.x, pemain.y - r.y) < pemain.radius + 15) {
      r.collected = true;
      let jumlahPenyembuhan = 3;
      pemain.hp = Math.min(pemain.maxHp, pemain.hp + jumlahPenyembuhan);
      updateHpUI();
      munculkanTeks(pemain.x, pemain.y - 25, `+${jumlahPenyembuhan} HP ❤️`, "#22c55e");
      playTone('sine', 523, 784, 0.22, 0.35); // Arpeggio pleasant heal sound
      tambahVFX(r.x, r.y, "#22c55e", "ledakan");
      daftarItemPemulih.splice(i, 1);
    }
  }
  // Ambil Berlian (Diamonds - Hunter Assassin Currency)
  for (let i = daftarBerlian.length - 1; i >= 0; i--) {
    let d = daftarBerlian[i];
    if (!d.collected && Math.hypot(pemain.x - d.x, pemain.y - d.y) < pemain.radius + 18) {
      d.collected = true;
      let val = d.value || 5;
      statistikPermainan.diamonds = (statistikPermainan.diamonds || 0) + val;
      localStorage.setItem('ninjaDiamonds', statistikPermainan.diamonds);
      munculkanTeks(d.x, d.y - 20, `+💎 ${val}`, "#00e5ff");
      playTone('sine', 1046, 1318, 0.18, 0.35, false);
      tambahVFX(d.x, d.y, "#00e5ff", "partikel");
      daftarBerlian.splice(i, 1);
    }
  }


  // Hazards: CCTV, Daun Kering, Laser
  for (let h of daftarJebakan) {
    if (h.tipe === "cctv") {
      h.sudut = h.sBase + Math.sin(penghitungBingkai / 40) * h.sw;
      let cctvSees = cekMelihatPemain({ x: h.x, y: h.y, sudut: h.sudut });
      h.alertActive = cctvSees;
      if (cctvSees) {
        if (penghitungAlarmCCTV <= 0) {
          mainkanSuara('alarm');
          munculkanTeks(h.x, h.y - 15, Teks.cctvAlert, "red");
          penghitungAlarmCCTV = 40;
        }
        for (let m of musuh) {
          m.status = "investigate";
          m.targetX = pemain.x;
          m.targetY = pemain.y;
          m.alertTimer = 240;
          m.path = null;
          m.pathTimer = 0;
        }
      }
    } else if (h.tipe === "daun") {
      if (Math.hypot(pemain.x - h.x, pemain.y - h.y) < h.r) {
        picuSuara(h.x, h.y, 300);
      }
    } else if (h.tipe === "laser") {
      h.active = Math.floor(penghitungBingkai / 120) % 2 === 0;
      h.warning = (!h.active && (penghitungBingkai % 120 > 95));
      if (h.active && !pemain.ghostActive && pemain.x > h.x && pemain.x < h.x + h.w && pemain.y > h.y - 10 && pemain.y < h.y + h.h + 10) {
        if (pemain.invincibleTimer <= 0) {
          pemain.hp -= 4;
          pemain.invincibleTimer = 50;
          getarLayar = 14;
          munculkanTeks(pemain.x, pemain.y - 20, "-4 HP (LASER)", "#ef4444");
          playTone('sawtooth', 160, 70, 0.25, 0.4);
          updateHpUI();
          if (pemain.hp <= 0) {
            pemain.hp = 0;
            updateHpUI();
            window.gameState = "lose";
            mainkanSuara('lose');
          }
        }
      }
    }
  }


  // Cek Status Misi & Pintu Berpindah Tempat (Pintu Terbuka HANYA jika SEMUA musuh dihabisi!)
  let tahapVIP = (tahapSekarang === 3 || tahapSekarang === 4);

  let targetVIP = musuh ? musuh.find(m => m.isVIP || (m.tipe && m.tipe.startsWith("viplevel"))) : null;
  let sisaMusuh = musuh ? musuh.length : 0;

  if (sisaMusuh === 0) {
    if (!portalKeluar.active) {
      portalKeluar.active = true;
      if (tahapVIP) {
        munculkanTeks(canvas.width / 2, canvas.height / 2 - 25, "👑 VIP & BOSS TELAH DIELIMINASI!", "#22c55e");
        munculkanTeks(canvas.width / 2, canvas.height / 2 + 5, "🚪 PINTU TERBUKA ➔ MASUK UNTUK BERPINDAH TEMPAT!", "#00e5ff");
      } else {
        munculkanTeks(canvas.width / 2, canvas.height / 2 - 25, "⚔️ AREA TELAH DIBERSIHKAN!", "#22c55e");
        munculkanTeks(canvas.width / 2, canvas.height / 2 + 5, "🚪 PINTU TERBUKA ➔ MASUK UNTUK BERPINDAH TEMPAT!", "#00e5ff");
      }
      playTone('sine', 587, 880, 0.4, 0.4);
      getarLayar = 12;
      updateTeksStatus();
    }
  } else {
    portalKeluar.active = false;
  }

  // Jika pemain menyentuh pintu keluar saat masih ada musuh yang hidup
  if (!portalKeluar.active && Math.hypot(pemain.x - portalKeluar.x, pemain.y - portalKeluar.y) < portalKeluar.radius + 18) {
    if (penghitungBingkai % 45 === 0) {
      if (tahapVIP && targetVIP) {
        munculkanTeks(portalKeluar.x, portalKeluar.y - 25, `🔒 PINTU TERKUNCI! ELIMINASI VIP & BOSS (${sisaMusuh} MUSUH TERSISA)!`, "#ef4444");
      } else {
        munculkanTeks(portalKeluar.x, portalKeluar.y - 25, `🔒 PINTU TERKUNCI! HABISI SEMUA MUSUH (${sisaMusuh} TERSISA)!`, "#ef4444");
      }
      playTone('square', 140, 110, 0.15, 0.2, false);
    }
  }

  if (portalKeluar.active && Math.hypot(pemain.x - portalKeluar.x, pemain.y - portalKeluar.y) < portalKeluar.radius + 14 && window.gameState !== "win") {
    window.gameState = "win";
    recordDailyStat('daily_stages', 1);
    mainkanSuara('win');

    // Kalkulasi Rating 3 Bintang (⭐⭐⭐ Hunter Assassin System)
    let bintangDiperoleh = 3;
    if ((statistikPermainan.alarmsTriggered || 0) > 2) bintangDiperoleh = 1;
    else if ((statistikPermainan.alarmsTriggered || 0) > 0) bintangDiperoleh = 2;

    let kunciBintang = 'stars_' + levelSekarang + '_' + tahapSekarang;
    let bintangSebelumnya = parseInt(localStorage.getItem(kunciBintang)) || 0;
    if (bintangDiperoleh > bintangSebelumnya) localStorage.setItem(kunciBintang, bintangDiperoleh);

    let koinTersimpan = localStorage.getItem('koinPemain');
    let totalKoinLokal = (koinTersimpan !== null && !isNaN(parseInt(koinTersimpan))) ? parseInt(koinTersimpan) : 250;
    // Koin tidak terlalu banyak didapatkan
    let bonusKoin = (levelSekarang === 3 && (tahapSekarang === 3 || tahapSekarang === 4)) ? 500 : (statistikPermainan.koinDiArena + (bintangDiperoleh * 25));
    localStorage.setItem('koinPemain', totalKoinLokal + bonusKoin);

    // Simpan Total Berlian
    localStorage.setItem('ninjaDiamonds', statistikPermainan.diamonds);

    let tk = parseInt(localStorage.getItem('totalKills')) || 0;
    localStorage.setItem('totalKills', tk + statistikPermainan.killCount);
    if (statistikPermainan.alarmsTriggered === 0) localStorage.setItem('ach_ghost', 'true');
    if (penghitungBingkai < 1500) localStorage.setItem('ach_speed', 'true');

    if (levelSekarang === 3 && (tahapSekarang === 3 || tahapSekarang === 4)) {
      localStorage.setItem('ach_impossible', 'true');
      localStorage.setItem('title_impossible', 'true');
    }

    if (tahapSekarang >= 3) {
      let unlocked = parseInt(localStorage.getItem('unlockedLevel')) || 1;
      if (levelSekarang >= unlocked && levelSekarang < 3) {
        localStorage.setItem('unlockedLevel', levelSekarang + 1);
        localStorage.setItem('justUnlocked', levelSekarang + 1);
      }
    }
  }

  // Logika & AI Musuh
  let kecMengejar = 3.5 + (levelSekarang * 0.4) + (tahapSekarang * 0.4);
  for (let i = musuh.length - 1; i >= 0; i--) {
    let m = musuh[i];
    if (m.stunTimer > 0) {
      m.stunTimer--;
      continue;
    }

    bebaskanMusuhDariTembok(m);

    // TARGET VIP: Hanya bisa diam di tempat, tidak menyerang, orang lemah yang hanya bisa dilindungi
    let adalahVIP = (m.isVIP || (m.tipe && m.tipe.startsWith("viplevel")));
    if (adalahVIP) {
      m.status = "idle";
      m.dx = 0;
      m.dy = 0;
      m.patrolDx = 0;
      m.patrolDy = 0;
      m.damage = 0;
      m.walkDistance = 0;
      let distKePemain = Math.hypot(pemain.x - m.x, pemain.y - m.y);
      // VIP orang lemah yang pasrah, pemain bisa mengeksekusinya kapan saja jika berada di dekatnya
      m.canTakedown = (distKePemain < 70 && !pemain.ghostActive);
      continue;
    }

    // Update Timer Khusus Rival Assassin
    if (m.tipe === "rival") {
      if (m.vulnerableTimer > 0) m.vulnerableTimer--;
      if (m.dashCooldown > 0) m.dashCooldown--;
      if (m.cloneCooldown > 0) m.cloneCooldown--;
      if (m.smokeCooldown > 0) m.smokeCooldown--;
      if (m.shurikenCooldown > 0) m.shurikenCooldown--;
      if (m.parryCooldown > 0) m.parryCooldown--;

      if (m.isStealth && m.stealthTimer > 0) {
        m.stealthTimer--;
        if (m.stealthTimer <= 0) {
          m.isStealth = false;
          munculkanTeks(m.x, m.y - 20, "🗡️ AMBUSH STRIKE!", "#ef4444");
          tambahVFX(m.x, m.y, "#ef4444", "ledakan");
          m.vulnerableTimer = 40; // Jendela celah serang balik bagi pemain
        }
      }

      // 1. Skill Kage Bunshin: Rival Memanggil 2 Bayangan Clone
      if (m.status === "chase" && m.cloneCooldown <= 0 && musuh.filter(e => e.tipe === "rival_clone").length === 0) {
        m.cloneCooldown = 500; // Lebih sering summon clone
        munculkanTeks(m.x, m.y - 25, "👥 KAGE BUNSHIN!", "#ef4444");
        tambahVFX(m.x, m.y, "#9333ea", "ledakan");
        playTone('sawtooth', 300, 600, 0.25, 0.35);

        for (let c = 0; c < 2; c++) {
          let offsetA = (c === 0 ? 1 : -1) * (Math.PI / 3);
          let cx = m.x + Math.cos(m.sudut + offsetA) * 45;
          let cy = m.y + Math.sin(m.sudut + offsetA) * 45;
          if (!cekTabrakanTembok(cx, cy, 16)) {
            musuh.push({
              x: cx,
              y: cy,
              radius: 16,
              warnaBase: "#991b1b",
              tipe: "rival_clone",
              hp: 3,
              maxHp: 3,
              damage: 3,
              patrolDx: 0,
              patrolDy: 0,
              dx: 0,
              dy: 0,
              sudut: m.sudut,
              status: "chase",
              prevStatus: "chase",
              alertTimer: 250,
              stunTimer: 0,
              dashTimer: 0
            });
            tambahVFX(cx, cy, "#9333ea", "partikel");
          }
        }
        m.vulnerableTimer = 18; // Jeda sangat singkat
      }

      // 2. Skill Crimson Kunai Fan: Rival Melempar 3 Shuriken Beracun
      let distKePemain = Math.hypot(pemain.x - m.x, pemain.y - m.y);
      if (m.status === "chase" && m.shurikenCooldown <= 0 && m.vulnerableTimer <= 0 && distKePemain > 120 && distKePemain < 460) {
        m.shurikenCooldown = 160; // Lebih cepat & agresif (~2.6 detik)
        munculkanTeks(m.x, m.y - 20, "🗡️ CRIMSON KUNAI STORM!", "#ef4444");
        playTone('square', 520, 240, 0.18, 0.25);
        let baseA = Math.atan2(pemain.y - m.y, pemain.x - m.x);
        [-0.35, -0.18, 0, 0.18, 0.35].forEach(offset => {
          let a = baseA + offset;
          daftarShuriken.push({
            x: m.x,
            y: m.y,
            dx: Math.cos(a) * 9.5,
            dy: Math.sin(a) * 9.5,
            rot: 0,
            isEnemy: true
          });
        });
        m.vulnerableTimer = 18; // Jeda celah lebih singkat dan menantang
      }

      // 3. Skill Smoke Bomb & Flank Stealth
      if (m.hp <= 18 && m.smokeCooldown <= 0 && !m.isStealth) {
        m.smokeCooldown = 600; // Tiap 10 detik saat HP rendah
        m.isStealth = true;
        m.stealthTimer = 80;
        munculkanTeks(m.x, m.y - 20, "💨 SMOKE BOMB!", "#94a3b8");
        tambahVFX(m.x, m.y, "#94a3b8", "ledakan");
        playTone('sine', 160, 60, 0.3, 0.3);

        let sudutFlank = pemain.sudut + Math.PI + (Math.random() - 0.5);
        let fx = pemain.x + Math.cos(sudutFlank) * 115;
        let fy = pemain.y + Math.sin(sudutFlank) * 115;
        if (!cekTabrakanTembok(fx, fy, m.radius)) {
          m.x = fx;
          m.y = fy;
        }
      }

      // 4. Skill Offensive Shunpo Dash
      if (m.status === "chase" && m.dashCooldown <= 0 && m.vulnerableTimer <= 0 && distKePemain > 90 && distKePemain < 260) {
        m.dashCooldown = 130;
        munculkanTeks(m.x, m.y - 20, "⚡ SHUNPO DASH!", "#dc2626");
        playTone('triangle', 320, 800, 0.2, 0.3);
        let sudutDash = Math.atan2(pemain.y - m.y, pemain.x - m.x);
        let dDist = Math.min(distKePemain - 35, 120);
        let dX = Math.cos(sudutDash) * dDist;
        let dY = Math.sin(sudutDash) * dDist;
        if (!cekTabrakanTembok(m.x + dX, m.y + dY, m.radius)) {
          m.x += dX;
          m.y += dY;
        }
        tambahVFX(m.x, m.y, "#dc2626", "gelombang");
        m.vulnerableTimer = 16; // Jeda pemulihan sangat cepat
      }
    }

    // ==========================================
    // INI LOGIKA MUSUH MENGECEK APAKAH PEMAIN TERKENA SENTER
    // ==========================================
    let melihatPemain = cekMelihatPemain(m);
    let distKePemain = Math.hypot(pemain.x - m.x, pemain.y - m.y);

    if (pemain.cloneActive && Math.hypot(pemain.cloneX - m.x, pemain.cloneY - m.y) < 400) {
      // Ini logika jika pemain membuat clone/bayangan pengalih perhatian
      m.status = "investigate";
      m.targetX = pemain.cloneX;
      m.targetY = pemain.cloneY;
      m.isAlerted = false;
    } else if (melihatPemain) {
      // ==========================================
      // INI LOGIKA KETIKA PEMAIN TERKENA SENTER MUSUH:
      // MUSUH BERUBAH MENJADI MODE WASPADA & MENGEJAR (CHASE)
      // ==========================================
      if (m.status !== "chase") {
        if (jedaSuaraWaspada <= 0) {
          mainkanSuara('alert');
          jedaSuaraWaspada = 150; // Jeda 2.5 detik agar suara senter tidak berulang-ulang berlebihan
        }
        getarLayar = 3;
        statistikPermainan.alarmsTriggered = (statistikPermainan.alarmsTriggered || 0) + 1;
        
        // Ini logika memanggil musuh/penjaga lain di sekitar (radius 380px) untuk ikut memeriksa
        for (let other of musuh) {
          if (other !== m && Math.hypot(other.x - m.x, other.y - m.y) < 380) {
            other.status = "investigate";
            other.targetX = pemain.x;
            other.targetY = pemain.y;
            other.alertTimer = 180;
            other.path = null;
            other.pathTimer = 0;
          }
        }
      }
      m.status = "chase";      // Mengubah status musuh menjadi mengejar player
      m.alertTimer = 180;      // Timer waspada (3 detik pada 60fps)
      m.isAlerted = true;      // Indikator bahwa musuh sedang dalam kondisi alert/waspada penuh
    } else {
      // ==========================================
      // INI LOGIKA KETIKA PEMAIN LEPAS DARI SENTER MUSUH:
      // MUSUH BERALIH KE MODE INVESTIGASI TITIK TERAKHIR
      // ==========================================
      m.isAlerted = false;
      if (m.status === "chase") {
        m.status = "investigate";
        m.targetX = pemain.x;  // Menuju ke titik koordinat terakhir pemain terlihat
        m.targetY = pemain.y;
      }
    }
    m.prevStatus = m.status;

    // ==========================================
    // INI LOGIKA MUSUH MENYERANG DENGAN MENEMBAK KETIKA TERKENA SENTER & STATUS CHASE
    // (Khusus musuh Keroco Pistol & Boss)
    // ==========================================
    m.shootCooldown = (m.shootCooldown !== undefined ? m.shootCooldown - 1 : 0);
    let tembakanBoss = (m.tipe === "boss");
    let bisaMenembak = (m.tipe === "keroco_pistol" || tembakanBoss);
    if (m.status === "chase" && melihatPemain && m.shootCooldown <= 0 && bisaMenembak) {
      if (distKePemain < 460 && !pemain.isHiding && !pemain.ghostActive) {
        m.shootCooldown = tembakanBoss ? 30 : 45;
        m.attackTimer = 20; // Picu pose menembak (attack frame)
        let sudutPeluru = Math.atan2(pemain.y - m.y, pemain.x - m.x) + (Math.random() - 0.5) * 0.1;
        let ujungMoncongX = m.x + Math.cos(m.sudut) * (m.radius + 14);
        let ujungMoncongY = m.y + Math.sin(m.sudut) * (m.radius + 14);
        let damagePeluru = tembakanBoss ? 6 : 4; // Damage sangat sakit!
        daftarPeluruMusuh.push({
          x: ujungMoncongX,
          y: ujungMoncongY,
          vx: Math.cos(sudutPeluru) * (tembakanBoss ? 11.5 : 9.8),
          vy: Math.sin(sudutPeluru) * (tembakanBoss ? 11.5 : 9.8),
          life: 85,
          isBoss: tembakanBoss,
          damage: damagePeluru
        });
        tambahVFX(ujungMoncongX, ujungMoncongY, tembakanBoss ? "#ef4444" : "#f59e0b", "partikel");
        playTone('sawtooth', tembakanBoss ? 320 : 480, 80, 0.12, 0.4);
      }
    }

    if (m.attackTimer > 0) m.attackTimer--;

    // ==========================================
    // INI LOGIKA SYARAT STEALTH TAKEDOWN (MENYERANG DARI BELAKANG TANPA TERLIHAT SENTER)
    // ==========================================
    m.canTakedown = (!melihatPemain && distKePemain < 70 && !pemain.ghostActive);

    // ==========================================
    // INI LOGIKA MUSUH BERGERAK MENGEJAR PEMAIN (CHASE / INVESTIGATE)
    // ==========================================
    let rivalSlow = (m.tipe === "rival" && m.vulnerableTimer > 0) ? 0.45 : 1;
    if (m.status === "chase" || m.status === "investigate") {
      // 1. Penentuan koordinat target: jika "chase" kejar pemain langsung, jika "investigate" datangi titik terakhir
      let tX = (m.status === "chase") ? pemain.x : m.targetX;
      let tY = (m.status === "chase") ? pemain.y : m.targetY;

      // 2. Kecepatan lari mengejar sesuai tipe musuh (Rival, Boss, Juggernaut, atau Keroco)
      let spdTarget = (m.status === "chase"
        ? (m.tipe === "rival" ? 5.0 : (m.tipe === "rival_clone" ? 4.2 : (m.tipe === "boss" ? 3.4 : (m.tipe === "juggernaut" ? 2.4 : kecMengejar)))) * rivalSlow
        : 2.2) * pengaliKecepatan;

      // 3. Ini logika navigasi cerdas: cek apakah jalur ke pemain terhalang tembok
      let garisPandangLangsung = hasLineOfSight(m.x, m.y, tX, tY, m.radius);
      m.pathTimer = (m.pathTimer !== undefined ? m.pathTimer - 1 : 0);

      if (!garisPandangLangsung) {
        // Terdapat tembok pembatas: gunakan algoritma A* Pathfinding mencari rute jalan memutar
        if (!m.path || m.path.length === 0 || m.pathTimer <= 0) {
          m.path = cariJalanAStar(m.x, m.y, tX, tY);
          m.pathTimer = 16 + Math.floor(Math.random() * 8); // Sebar waktu kalkulasi path
        }
      } else {
        // Jalur langsung terbuka tanpa terhalang tembok: lari lurus ke arah pemain
        m.path = [{ x: tX, y: tY }];
      }

      // Ikuti waypoint pathfinding
      let targetWaypoint = { x: tX, y: tY };
      if (m.path && m.path.length > 0) {
        // Lewati waypoint jika sudah sangat dekat
        while (m.path.length > 1 && Math.hypot(m.path[0].x - m.x, m.path[0].y - m.y) < 20) {
          m.path.shift();
        }
        // Jalan pintas jika waypoint kedua sudah terlihat langsung
        if (m.path.length > 1 && hasLineOfSight(m.x, m.y, m.path[1].x, m.path[1].y, m.radius)) {
          m.path.shift();
        }
        targetWaypoint = m.path[0];
      }

      let sudutGerak = Math.atan2(targetWaypoint.y - m.y, targetWaypoint.x - m.x);
      let stepX = Math.cos(sudutGerak) * spdTarget;
      let stepY = Math.sin(sudutGerak) * spdTarget;

      // Eksekusi pergerakan & pelurusan sudut
      if (!cekTabrakanTembok(m.x + stepX, m.y + stepY, m.radius)) {
        m.x += stepX;
        m.y += stepY;
        m.dx = stepX;
        m.dy = stepY;
        m.sudut = lerpAngle(m.sudut, sudutGerak, 0.25);
        m.walkDistance = (m.walkDistance || 0) + spdTarget;
      } else {
        // Geser sumbu bebas jika bersentuhan tepi
        let moved = false;
        if (!cekTabrakanTembok(m.x + stepX, m.y, m.radius)) {
          m.x += stepX; m.dx = stepX; m.dy = 0; moved = true;
        } else if (!cekTabrakanTembok(m.x, m.y + stepY, m.radius)) {
          m.y += stepY; m.dx = 0; m.dy = stepY; moved = true;
        }

        if (moved) {
          m.sudut = lerpAngle(m.sudut, sudutGerak, 0.2);
          m.walkDistance = (m.walkDistance || 0) + spdTarget;
        } else {
          // Segarkan path segera jika mentok sudut
          m.pathTimer = 0;
        }
      }

      if (m.status === "investigate") {
        if (m.alertTimer > 0) m.alertTimer--;
        if (Math.hypot(m.targetX - m.x, m.targetY - m.y) < 22 || m.alertTimer <= 0) {
          if (!pemain.cloneActive) {
            m.status = "patrol";
            m.dx = m.patrolDx;
            m.dy = m.patrolDy;
            m.path = null;
          }
        }
      }
    } else {
      // Status Patroli Rutin
      let vx = m.dx * pengaliKecepatan;
      let vy = m.dy * pengaliKecepatan;
      if (vx !== 0 || vy !== 0) m.sudut = Math.atan2(vy, vx);

      let movedPatrol = false;
      if (vx !== 0) {
        if (!cekTabrakanTembok(m.x + vx, m.y, m.radius)) {
          m.x += vx;
          movedPatrol = true;
        } else {
          m.dx *= -1;
          m.patrolDx *= -1;
        }
      }

      if (vy !== 0) {
        if (!cekTabrakanTembok(m.x, m.y + vy, m.radius)) {
          m.y += vy;
          movedPatrol = true;
        } else {
          m.dy *= -1;
          m.patrolDy *= -1;
        }
      }

      if (movedPatrol) {
        m.walkDistance = (m.walkDistance || 0) + Math.hypot(vx, vy);
      }
    }

    // Pemisahan antar musuh agar tidak saling menumpuk (Anti-clumping / Anti-stacking)
    for (let j = i - 1; j >= 0; j--) {
      let other = musuh[j];
      let sepDx = m.x - other.x;
      let sepDy = m.y - other.y;
      let sepDist = Math.hypot(sepDx, sepDy);
      let minSep = m.radius + other.radius + 6;
      if (sepDist < minSep && sepDist > 0.001) {
        let push = (minSep - sepDist) * 0.5;
        let pushX = (sepDx / sepDist) * push;
        let pushY = (sepDy / sepDist) * push;
        if (!cekTabrakanTembok(m.x + pushX, m.y + pushY, m.radius)) {
          m.x += pushX;
          m.y += pushY;
        }
        if (!cekTabrakanTembok(other.x - pushX, other.y - pushY, other.radius)) {
          other.x -= pushX;
          other.y -= pushY;
        }
      }
    }

    bebaskanMusuhDariTembok(m);

    // ==========================================
    // INI LOGIKA MUSUH MENYERANG PEMAIN KETIKA BERHASIL MENDEKAT (MELEE DAMAGE)
    // ==========================================
    if (Math.hypot(pemain.x - m.x, pemain.y - m.y) < m.radius + pemain.radius + 2 && !pemain.isHiding && !pemain.ghostActive) {
      if ((!m.stunTimer || m.stunTimer <= 0) && pemain.invincibleTimer <= 0) {
        let dmg = m.damage || 3;
        m.attackTimer = 22;             // Frame animasi serangan musuh
        pemain.hp -= dmg;               // Mengurangi HP pemain saat terkena serangan
        pemain.invincibleTimer = 55;    // Jeda kebal sementara (invincibility frame)
        getarLayar = (m.tipe === "boss" || m.tipe === "rival") ? 18 : 12; // Efek layar bergetar saat terpukul
        updateHpUI();

        // Ini logika efek knockback (pemain terlempar mundur saat terpukul)
        let angle = Math.atan2(pemain.y - m.y, pemain.x - m.x);
        let pushDist = 36;
        let px = Math.cos(angle) * pushDist;
        let py = Math.sin(angle) * pushDist;
        if (!cekTabrakanTembok(pemain.x + px, pemain.y, pemain.radius)) pemain.x += px;
        if (!cekTabrakanTembok(pemain.x, pemain.y + py, pemain.radius)) pemain.y += py;

        munculkanTeks(pemain.x, pemain.y - 25, `-${dmg} HP!`, "#ef4444");
        playTone('sawtooth', 130, 50, 0.25, 0.45);
        tambahVFX(pemain.x, pemain.y, "#ef4444", "ledakan");

        // Ini logika jika HP pemain habis -> GAME OVER (Kalah)
        if (pemain.hp <= 0) {
          pemain.hp = 0;
          updateHpUI();
          window.gameState = "lose";
          mainkanSuara('lose');
        }
      }
    }
  }
}

// ==========================================
// INI LOGIKA EKSEKUSI STEALTH TAKEDOWN (MENYERANG SECARA DIAM-DIAM DARI BELAKANG)
// ==========================================
function executeStealthTakedown(m, index) {
  if (!m || m.hp <= 0) return;

  // Rival Assassin Sixth Sense: Menghindar dari serangan diam-diam jika tidak sedang stun/slow-mo
  if (m.tipe === "rival" && !pemain.timeActive && (!m.stunTimer || m.stunTimer <= 0) && (!m.vulnerableTimer || m.vulnerableTimer <= 0)) {
    m.dashCooldown = 60;
    let dodgeA = pemain.sudut + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
    let dX = Math.cos(dodgeA) * 110;
    let dY = Math.sin(dodgeA) * 110;
    if (!cekTabrakanTembok(m.x + dX, m.y + dY, m.radius)) {
      m.x += dX; m.y += dY;
    }
    bebaskanMusuhDariTembok(m);
    munculkanTeks(m.x, m.y - 20, "⚡ SIXTH SENSE: EVADED!", "#dc2626");
    playTone('sine', 550, 200, 0.15, 0.3);
    tambahVFX(m.x, m.y, "#dc2626", "gelombang");
    return;
  }

  let adalahVIP = (m.isVIP || (m.tipe && m.tipe.startsWith("viplevel")));
  let musuhBerat = (m.tipe === "boss" || m.tipe === "rival" || m.tipe === "juggernaut");
  let dmg = adalahVIP ? m.hp : (m.tipe === "boss" ? 4 : (m.tipe === "rival" ? 3 : (m.tipe === "juggernaut" ? 4 : m.hp)));
  m.hp -= dmg;

  // Garis tebasan kilat merah menusuk musuh
  let sAngle = Math.atan2(m.y - pemain.y, m.x - pemain.x);
  daftarTebasan.push({
    x: m.x,
    y: m.y,
    sudut: sAngle,
    frame: 0
  });

  // Decal darah di lantai
  kotoran.push({ x: m.x, y: m.y, r: musuhBerat ? 15 : 10, isBlood: true, a: 0.85 });

  // Efek suara tebasan fatal & VFX
  playTone('sawtooth', 750, 100, 0.22, 0.45);
  tambahVFX(m.x, m.y, "#ef4444", "ledakan");
  tambahVFX(m.x, m.y, "#facc15", "partikel");
  getarLayar = 15;

  statistikPermainan.stealthKills = (statistikPermainan.stealthKills || 0) + 1;
  recordDailyStat('daily_stealth', 1);
  munculkanTeks(m.x, m.y - 25, "⚡ SILENT TAKEDOWN!", "#facc15");

  if (m.hp <= 0) {
    dropRegenItem(m.x, m.y);
    daftarKoinPeta.push({ x: m.x, y: m.y, collected: false, drop: true });

    // Drop Berlian / Diamonds: Sangat langka & susah didapat!
    // Kroco biasa: 0 diamond. Juggernaut: 25% drop 1 diamond. VIP: drop 2 daftarBerlian.
    let dCount = adalahVIP ? 2 : (m.tipe === "juggernaut" && Math.random() < 0.25 ? 1 : 0);
    for (let d = 0; d < dCount; d++) {
      let rA = Math.random() * Math.PI * 2;
      let rD = Math.random() * 25 + 10;
      daftarBerlian.push({
        x: m.x + Math.cos(rA) * rD,
        y: m.y + Math.sin(rA) * rD,
        value: 1,
        collected: false,
        frame: Math.random() * 100
      });
    }

    let tipeMati = m.tipe;
    let sebelumnyaVIP = adalahVIP;
    musuh.splice(index, 1);
    statistikPermainan.killCount++;
    recordDailyStat('daily_kills', 1);

    if (sebelumnyaVIP || tipeMati === "boss" || tipeMati === "rival") {
      recordDailyStat('daily_boss', 1);
    }

    if (sebelumnyaVIP) {
      munculkanTeks(m.x, m.y, "👑 TARGET VIP DIELIMINASI!", "#22c55e");
    } else if (tipeMati === "rival") {
      munculkanTeks(m.x, m.y, "👑 RIVAL ASSASSIN DEFEATED!", "#ef4444");
    } else if (tipeMati === "boss") {
      munculkanTeks(m.x, m.y, "BOSS ELIMINATED!", "#2ecc71");
    } else if (tipeMati === "juggernaut") {
      munculkanTeks(m.x, m.y, "JUGGERNAUT ASSASSINATED!", "#f59e0b");
    } else {
      munculkanTeks(m.x, m.y, "TARGET NEUTRALIZED!", "#38bdf8");
    }
  } else {
    m.stunTimer = 60; // Heavy stun pada musuh kuat yang selamat
    munculkanTeks(m.x, m.y - 12, `-${dmg} HIT! (${m.hp}/${m.maxHp})`, "#ef4444");
  }
}

// EKSEKUSI TEBASAN PISAU (MELEE ATTACK - TOMBOL L)
// Dibatasi hanya 2 kali berturut-turut, lalu cooldown 2 detik
function bunuhMusuh() {
  if (window.gameState !== "playing") return;

  // Cek Batasan Cooldown Tebasan
  if (pemain.slashCooldown > 0) {
    let sisa = (pemain.slashCooldown / 60).toFixed(1);
    munculkanTeks(pemain.x, pemain.y - 20, `COOLDOWN! (${sisa}s)`, "#ef4444");
    mainkanSuara('block');
    return;
  }

  // Konsumsi 1 kuota tebasan
  pemain.slashCharges = (pemain.slashCharges !== undefined) ? pemain.slashCharges - 1 : 1;
  if (pemain.slashCharges <= 0) {
    pemain.slashCooldown = 120; // 2 Detik Cooldown
    pemain.slashCharges = 0;
  } else {
    pemain.slashResetTimer = 90; // Jeda 1.5s untuk reset kuota ke 2x jika berhenti menebas
  }

  pemain.state = 'serang';
  pemain.actionTimer = 18;

  daftarTebasan.push({
    x: pemain.x + Math.cos(pemain.sudut) * 20,
    y: pemain.y + Math.sin(pemain.sudut) * 20,
    sudut: pemain.sudut,
    frame: 0
  });
  mainkanSuara('slash');

  for (let i = 0; i < musuh.length; i++) {
    let m = musuh[i];
    if (Math.hypot(pemain.x - m.x, pemain.y - m.y) < 75) {
      // Jika menyerang musuh tanpa terlihat (dari belakang / bayangan) -> STEALTH TAKEDOWN!
      if (!cekMelihatPemain(m)) {
        executeStealthTakedown(m, i);
        return;
      }
      // Juggernaut Frontal Shield Logic
      if (m.tipe === "juggernaut") {
        let sP = Math.abs(Math.atan2(pemain.y - m.y, pemain.x - m.x) - m.sudut);
        if (sP > Math.PI) sP = 2 * Math.PI - sP;
        if (sP < Math.PI / 2) {
          munculkanTeks(pemain.x, pemain.y - 20, Teks.blocked, "#94a3b8");
          mainkanSuara('block');
          getarLayar = 15;
          tambahVFX(pemain.x + Math.cos(pemain.sudut) * 15, pemain.y + Math.sin(pemain.sudut) * 15, "#94a3b8", "ledakan");
          return;
        }
      }

      // Reaksi Khusus Rival Assassin: Dodge atau Parry jika tidak beku/vulnerable
      if (m.tipe === "rival" && !pemain.timeActive && m.stunTimer <= 0 && m.vulnerableTimer <= 0) {
        if (m.dashCooldown <= 0) {
          m.dashCooldown = 150;
          let dodgeA = pemain.sudut + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
          let dX = Math.cos(dodgeA) * 90;
          let dY = Math.sin(dodgeA) * 90;
          if (!cekTabrakanTembok(m.x + dX, m.y + dY, m.radius)) {
            m.x += dX; m.y += dY;
          }
          bebaskanMusuhDariTembok(m);
          munculkanTeks(m.x, m.y - 20, "⚡ SHUNPO DODGE!", "#dc2626");
          playTone('sine', 450, 200, 0.12, 0.25);
          tambahVFX(m.x, m.y, "#dc2626", "gelombang");
          return;
        } else if (m.parryCooldown <= 0 && Math.random() < 0.75) {
          m.parryCooldown = 75;
          munculkanTeks(m.x, m.y - 20, "⚔️ PARRIED & COUNTER!", "#ef4444");
          mainkanSuara('block');
          tambahVFX(m.x, m.y, "#ef4444", "ledakan");
          if (pemain.invincibleTimer <= 0) {
            pemain.hp -= 2;
            pemain.invincibleTimer = 45;
            updateHpUI();
            munculkanTeks(pemain.x, pemain.y - 25, "-2 HP (COUNTER)", "#ef4444");
            if (pemain.hp <= 0) {
              pemain.hp = 0;
              updateHpUI();
              window.gameState = "lose";
              mainkanSuara('lose');
            }
          }
          return;
        }
      }

      // Serangan Masuk ke Musuh
      let adalahVIP = (m.isVIP || (m.tipe && m.tipe.startsWith("viplevel")));
      if (adalahVIP) m.hp = 0; // VIP orang lemah langsung tewas seketika
      else m.hp--;
      mainkanSuara('block');
      getarLayar = (m.tipe === "boss" || m.tipe === "rival") ? 14 : 10;
      tambahVFX(m.x, m.y, m.warnaBase || "#c0392b", "ledakan");

      // Knockback mundur dan hit-stun pada musuh
      let sDorong = Math.atan2(m.y - pemain.y, m.x - pemain.x);
      let push = (m.tipe === "boss" || m.tipe === "rival" || m.tipe === "juggernaut") ? 32 : 45;
      let kx = Math.cos(sDorong) * push;
      let ky = Math.sin(sDorong) * push;
      if (!cekTabrakanTembok(m.x + kx, m.y, m.radius)) m.x += kx;
      if (!cekTabrakanTembok(m.x, m.y + ky, m.radius)) m.y += ky;
      bebaskanMusuhDariTembok(m);
      m.stunTimer = 22;

      if (m.hp <= 0) {
        kotoran.push({ x: m.x, y: m.y, r: (m.tipe === "boss" || m.tipe === "rival" || adalahVIP) ? 14 : 9, isBlood: true, a: 0.8 });
        daftarKoinPeta.push({ x: m.x, y: m.y, collected: false, drop: true });
        dropRegenItem(m.x, m.y); // Drop item penambah darah setiap musuh mati

        // Drop diamond jika VIP atau 25% Juggernaut
        let dCount = adalahVIP ? 2 : (m.tipe === "juggernaut" && Math.random() < 0.25 ? 1 : 0);
        for (let d = 0; d < dCount; d++) {
          let rA = Math.random() * Math.PI * 2;
          let rD = Math.random() * 25 + 10;
          daftarBerlian.push({
            x: m.x + Math.cos(rA) * rD,
            y: m.y + Math.sin(rA) * rD,
            value: 1,
            collected: false,
            frame: Math.random() * 100
          });
        }

        let tipeMati = m.tipe;
        let sebelumnyaVIP = adalahVIP;
        musuh.splice(i, 1);
        statistikPermainan.killCount++;
        recordDailyStat('daily_kills', 1);
        if (sebelumnyaVIP || tipeMati === "boss" || tipeMati === "rival") {
          recordDailyStat('daily_boss', 1);
        }

        if (sebelumnyaVIP) {
          munculkanTeks(m.x, m.y, "👑 TARGET VIP DIELIMINASI!", "#22c55e");
        } else if (tipeMati === "rival") {
          munculkanTeks(m.x, m.y, "👑 RIVAL ASSASSIN DEFEATED!", "#ef4444");
        } else if (tipeMati === "rival_clone") {
          munculkanTeks(m.x, m.y, "CLONE DISSOLVED!", "#9333ea");
        } else if (tipeMati === "boss") {
          munculkanTeks(m.x, m.y, "BOSS DOWN!", "#2ecc71");
        } else if (tipeMati === "juggernaut") {
          munculkanTeks(m.x, m.y, "JUGGERNAUT DOWN!", "#f59e0b");
        } else {
          munculkanTeks(m.x, m.y, Teks.assassinated, "#e74c3c");
        }
      } else {
        let labelNama = adalahVIP ? "VIP" : (m.tipe === "rival" ? "RIVAL" : (m.tipe === "rival_clone" ? "CLONE" : (m.tipe === "boss" ? "BOSS" : (m.tipe === "juggernaut" ? "JUGG" : "KROCO"))));
        munculkanTeks(m.x, m.y - 15, `${labelNama}: ${m.hp}/${m.maxHp}`, "gold");
      }
      break;
    }
  }
}

// UPDATE STATUS MISI HUD
function updateTeksStatus() {
  if (!teksStatus) return;
  let sisaMusuh = musuh ? musuh.length : 0;
  let isAlert = musuh && musuh.some(m => m.isAlerted);
  let lencanaStatus = isAlert ? "<span style='color:#ef4444;'>🔴 ALERTED</span>" : "<span style='color:#22c55e;'>🟢 UNSEEN</span>";

  let tahapVIP = (tahapSekarang === 3 || tahapSekarang === 4);

  let targetVIP = musuh ? musuh.find(m => m.isVIP || (m.tipe && m.tipe.startsWith("viplevel"))) : null;
  let bosPengawal = musuh ? musuh.find(m => m.tipe === "boss") : null;
  let vipMasihHidup = !!targetVIP;
  let bossMasihHidup = !!bosPengawal;

  let lencanaObjektif = "";
  if (sisaMusuh === 0) {
    lencanaObjektif = `<span style='color:#22c55e; font-weight:900;'>🚪 PINTU TERBUKA ➔ MASUK UNTUK BERPINDAH TEMPAT!</span>`;
  } else if (tahapVIP) {
    let vLabel = levelSekarang === 1 ? "VIP LVL 1" : (levelSekarang === 2 ? "VIP LVL 2" : "VIP LVL 3");
    if (vipMasihHidup && bossMasihHidup) {
      lencanaObjektif = `<span style='color:#ef4444; font-weight:900;'>👑 ELIMINASI ${vLabel} & BIG BOSS (${sisaMusuh} SISA)</span>`;
    } else if (vipMasihHidup) {
      lencanaObjektif = `<span style='color:#f59e0b; font-weight:900;'>✓ BOSS TEWAS ➔ HABISI ${vLabel} (${sisaMusuh} SISA)</span>`;
    } else if (bossMasihHidup) {
      lencanaObjektif = `<span style='color:#f59e0b; font-weight:900;'>✓ VIP MATI ➔ HABISI BIG BOSS (${sisaMusuh} SISA)</span>`;
    } else {
      lencanaObjektif = `<span style='color:#f59e0b; font-weight:900;'>✓ TARGET UTAMA MATI ➔ HABISI SISA PENGAWAL (${sisaMusuh} SISA)</span>`;
    }
  } else {
    lencanaObjektif = `<span style='color:#38bdf8; font-weight:800;'>🗡️ HABISI SEMUA MUSUH (${sisaMusuh} SISA)</span>`;
  }

  let judulEl = document.getElementById("teks-misi-judul");
  if (judulEl) {
    let teksMode = tahapVIP ? "👑 VIP & BOSS ELIMINATION" : "🗡️ TOTAL ELIMINATION";
    judulEl.innerText = `SECTOR ${levelSekarang}-${tahapSekarang}: ${teksMode}`;
  }

  teksStatus.innerHTML = `<b>SEKTOR ${levelSekarang}-${tahapSekarang}</b> | ${lencanaObjektif} | <span style='color:#f87171;'>🎯 MUSUH: ${sisaMusuh}</span> | <span style='color:#38bdf8;'>💎 ${statistikPermainan.diamonds || 0}</span> | ${lencanaStatus}`;
}

// ==========================================
// 3. FUNGSI MENGGAMBAR KARAKTER
// ==========================================
function gambarKarakter(x, y, radius, sudut, warnaBase, alpha = 1, isPemain = false, tipeMusuh = null, lvlTheme = levelSekarang, enemyObj = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  if (isPemain) {
    // Proporsi Karakter Assassin
    const size = radius * 4.3;

    // 1. Ghost Active Ethereal Aura
    if (pemain.ghostActive) {
      let gradienAura = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius * 2.2);
      gradienAura.addColorStop(0, "rgba(0, 229, 255, 0.45)");
      gradienAura.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = gradienAura;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tentukan State & Arah
    let st = pemain.state || 'diam';
    let arah = pemain.arah || 'bawah';

    // Jika dipanggil untuk shadow clone
    if (warnaBase === "#22c55e") {
      st = 'diam';
      arah = 'bawah';
    }

    // Ambil mapping key warna & data koordinat sprite
    let kunciBaju = petaWarnaBaju[warnaBase] || petaWarnaBaju[warnaPemain] || 'navy';
    let sData = DATA_LEMBAR_SPRITE[kunciBaju] || DATA_LEMBAR_SPRITE['navy'];
    let tema = WARNA_TEMA[kunciBaju] || WARNA_TEMA['navy'];

    // Soft drop shadow di bawah kaki pemain agar menapak realistis
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(0, radius * 1.15, radius * 1.1, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sudut hadap karakter 8-arah & 360 derajat halus
    let sudutKarakter = (pemain.visualSudut !== undefined ? pemain.visualSudut : (pemain.sudut || 0));

    if (st === 'dash') {
      // Dash dengan postur sprint aerodinamis halus (tanpa kilatan neon berlebihan)
      let sRect = (sData.walk && sData.walk[3]) ? sData.walk[3] : sData.idle;
      let gambarLembarSprite = asetGame.spritesheets[kunciBaju] || asetGame.spritesheets.navy;
      if (gambarLembarSprite && gambarLembarSprite.complete && gambarLembarSprite.naturalWidth > 0 && sRect) {
        let is600 = gambarLembarSprite.naturalWidth <= 800;
        let skalaLembarX = is600 ? 1 : gambarLembarSprite.naturalWidth / 1536;
        let skalaLembarY = is600 ? 1 : gambarLembarSprite.naturalHeight / 1024;
        let sx = sRect.x * skalaLembarX;
        let sy = sRect.y * skalaLembarY;
        let sw = sRect.w * skalaLembarX;
        let sh = sRect.h * skalaLembarY;

        ctx.save();
        ctx.rotate(sudutKarakter - Math.PI / 2);
        ctx.scale(1.15, 0.92);
        let targetH = size * 1.05;
        let targetW = targetH * (sRect.w / sRect.h);
        let anchorX = sRect.anchorX !== undefined ? sRect.anchorX : 0.5;
        let anchorY = sRect.anchorY !== undefined ? sRect.anchorY : 0.5;
        ctx.drawImage(gambarLembarSprite, sx, sy, sw, sh, -targetW * anchorX, -targetH * anchorY, targetW, targetH);
        ctx.restore();
      } else {
        let imgFallback = asetGame.baju[kunciBaju] || asetGame.baju.navy;
        if (imgFallback && imgFallback.complete && imgFallback.naturalWidth > 0) {
          ctx.save();
          ctx.rotate(sudutKarakter - Math.PI / 2);
          ctx.drawImage(imgFallback, -size / 2, -size / 2, size, size);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fillStyle = warnaBase || "#2c3e50";
          ctx.fill();
        }
      }
    } else {
      // 2. SAAT JALAN / DIAM / SERANG: Menggunakan spritesheet warna resmi
      let sRect = null;
      let skalaAnimasiX = 1;
      let skalaAnimasiY = 1;

      if (st === 'serang') {
        let fIdx = Math.min(2, Math.max(0, pemain.animFrame || 0));
        sRect = sData.attack[fIdx];
        skalaAnimasiX = (fIdx === 1 ? 1.08 : 1.0);
        skalaAnimasiY = (fIdx === 1 ? 0.94 : 1.0);

        if (fIdx === 1) {
          ctx.save();
          ctx.rotate(sudutKarakter);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, radius * 2.2, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.stroke();
          ctx.restore();
        }
      } else if (st === 'jalan') {
        let fIdx = Math.min(7, Math.max(0, pemain.animFrame || 0));
        sRect = sData.walk[fIdx];
        let siklusLangkah = (pemain.walkDistance || 0) / 10;
        skalaAnimasiX = 1 + Math.sin(siklusLangkah) * 0.035;
        skalaAnimasiY = 1 - Math.sin(siklusLangkah) * 0.035;
      } else {
        // Idle / Diam: animasi bernapas halus
        let breath = Math.sin(penghitungBingkai * 0.065);
        skalaAnimasiY = 1 + breath * 0.025;
        skalaAnimasiX = 1 - breath * 0.015;
        sRect = sData.idle;
      }

      let gambarLembarSprite = asetGame.spritesheets[kunciBaju] || asetGame.spritesheets.navy;
      if (gambarLembarSprite && gambarLembarSprite.complete && gambarLembarSprite.naturalWidth > 0 && sRect) {
        let is600 = gambarLembarSprite.naturalWidth <= 800;
        let skalaLembarX = is600 ? 1 : gambarLembarSprite.naturalWidth / 1536;
        let skalaLembarY = is600 ? 1 : gambarLembarSprite.naturalHeight / 1024;
        let sx = sRect.x * skalaLembarX;
        let sy = sRect.y * skalaLembarY;
        let sw = sRect.w * skalaLembarX;
        let sh = sRect.h * skalaLembarY;

        ctx.save();
        ctx.rotate(sudutKarakter - Math.PI / 2);
        ctx.scale(skalaAnimasiX, skalaAnimasiY);
        let targetH = size;
        let targetW = targetH * (sRect.w / sRect.h);
        let anchorX = sRect.anchorX !== undefined ? sRect.anchorX : 0.5;
        let anchorY = sRect.anchorY !== undefined ? sRect.anchorY : 0.5;
        ctx.drawImage(gambarLembarSprite, sx, sy, sw, sh, -targetW * anchorX, -targetH * anchorY, targetW, targetH);
        ctx.restore();
      } else {
        let imgFallback = asetGame.baju[kunciBaju] || asetGame.baju.navy;
        if (imgFallback && imgFallback.complete && imgFallback.naturalWidth > 0) {
          ctx.save();
          ctx.rotate(sudutKarakter - Math.PI / 2);
          ctx.drawImage(imgFallback, -size / 2, -size / 2, size, size);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fillStyle = warnaBase || "#2c3e50";
          ctx.fill();
        }
      }
    }
  } else {
    // ==========================================
    // RENDER MUSUH MENGGUNAKAN SPRITESHEET RESMI
    // ==========================================
    let adalahVIP = (tipeMusuh && (tipeMusuh.startsWith("viplevel") || tipeMusuh.startsWith("VIPlevel"))) || (enemyObj && enemyObj.isVIP);
    let enemyKey = tipeMusuh ? tipeMusuh.toLowerCase() : "keroco";
    if (enemyKey === "kroco") enemyKey = "keroco";
    if (enemyKey === "rival_clone") enemyKey = "rival";

    let gambarLembarSprite = asetGame.musuh[enemyKey] || asetGame.musuh.keroco;
    let sData = SPRITE_MUSUH[enemyKey] || SPRITE_MUSUH.keroco;

    // Drop shadow di bawah kaki musuh
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, radius * 1.05, radius * 1.05, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Efek aura untuk VIP, Boss dan Rival Assassin
    if (adalahVIP) {
      let gradienAura = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius * 1.6);
      gradienAura.addColorStop(0, "rgba(234, 179, 8, 0.4)");
      gradienAura.addColorStop(0.6, "rgba(234, 179, 8, 0.15)");
      gradienAura.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradienAura;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (tipeMusuh === "rival" || tipeMusuh === "rival_clone") {
      let gradienAura = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius * 2.2);
      gradienAura.addColorStop(0, tipeMusuh === "rival_clone" ? "rgba(147, 51, 234, 0.5)" : "rgba(220, 38, 38, 0.55)");
      gradienAura.addColorStop(0.6, "rgba(147, 51, 234, 0.2)");
      gradienAura.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradienAura;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tipeMusuh === "boss") {
      let gradienAura = ctx.createRadialGradient(0, 0, radius * 0.6, 0, 0, radius * 2.0);
      gradienAura.addColorStop(0, "rgba(220, 38, 38, 0.5)");
      gradienAura.addColorStop(0.6, "rgba(245, 158, 11, 0.25)");
      gradienAura.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradienAura;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tentukan Frame Animasi Musuh
    let sRect = sData.idle;
    let skalaAnimasiX = 1;
    let skalaAnimasiY = 1;

    let sedangBergerak = false;
    let sedangMenyerang = false;
    let walkDist = 0;

    if (enemyObj) {
      walkDist = enemyObj.walkDistance || 0;
      sedangBergerak = Math.hypot(enemyObj.dx || 0, enemyObj.dy || 0) > 0.1;
      sedangMenyerang = (enemyObj.attackTimer && enemyObj.attackTimer > 0) || (enemyObj.status === "attack");

      if (enemyObj.isStealth) {
        ctx.globalAlpha = Math.min(ctx.globalAlpha, 0.3);
      }
    }

    if (adalahVIP) {
      sedangMenyerang = false;
      sedangBergerak = false;
      let breath = Math.sin(penghitungBingkai * 0.05 + (x % 7));
      skalaAnimasiY = 1 + breath * 0.02;
      skalaAnimasiX = 1 - breath * 0.015;
      sRect = sData.idle;
    } else if (sedangMenyerang) {
      let fIdx = Math.min(2, Math.floor(penghitungBingkai / 5) % 3);
      sRect = sData.attack[fIdx] || sData.idle;
      skalaAnimasiX = fIdx === 1 ? 1.08 : 1.0;
      skalaAnimasiY = fIdx === 1 ? 0.94 : 1.0;
    } else if (sedangBergerak) {
      let fIdx = Math.floor(walkDist / 12) % 8;
      sRect = (sData.walk && sData.walk[fIdx]) ? sData.walk[fIdx] : sData.idle;
      let siklusLangkah = walkDist / 10;
      skalaAnimasiX = 1 + Math.sin(siklusLangkah) * 0.035;
      skalaAnimasiY = 1 - Math.sin(siklusLangkah) * 0.035;
    } else {
      let breath = Math.sin(penghitungBingkai * 0.065 + (x % 7));
      skalaAnimasiY = 1 + breath * 0.025;
      skalaAnimasiX = 1 - breath * 0.015;
      sRect = sData.idle;
    }

    // Rotasi: hadap sudut (kurang 90 derajat karena top-down spritesheet menghadap bawah)
    ctx.rotate(sudut - Math.PI / 2);
    ctx.scale(skalaAnimasiX, skalaAnimasiY);

    const size = adalahVIP ? (radius * 3.3) : (radius * 4.3);

    if (gambarLembarSprite && gambarLembarSprite.complete && gambarLembarSprite.naturalWidth > 0 && sRect) {
      let targetH = size;
      let targetW = targetH * (sRect.w / sRect.h);
      let anchorX = sRect.anchorX !== undefined ? sRect.anchorX : 0.5;
      let anchorY = sRect.anchorY !== undefined ? sRect.anchorY : 0.5;

      ctx.drawImage(
        gambarLembarSprite,
        sRect.x, sRect.y, sRect.w, sRect.h,
        -targetW * anchorX, -targetH * anchorY,
        targetW, targetH
      );
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = warnaBase || "#dc2626";
      ctx.fill();
    }
  }

  ctx.restore();
}

// RENDER VISION CONE DENGAN RAYCASTING
function gambarVisionCone(titikAsalX, titikAsalY, sudut, jarak, lebar, warnaCone) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(titikAsalX, titikAsalY);

  const jumlahSinar = 24;
  for (let i = 0; i <= jumlahSinar; i++) {
    let ang = sudut - lebar + (lebar * 2 * (i / jumlahSinar));
    let cos = Math.cos(ang);
    let sin = Math.sin(ang);
    let dist = hitRayWall(titikAsalX, titikAsalY, cos, sin, jarak);
    ctx.lineTo(titikAsalX + cos * dist, titikAsalY + sin * dist);
  }

  ctx.closePath();
  let gradienKerucut = ctx.createRadialGradient(titikAsalX, titikAsalY, 5, titikAsalX, titikAsalY, jarak);
  gradienKerucut.addColorStop(0, warnaCone.replace("ALPHA", "0.4"));
  gradienKerucut.addColorStop(1, warnaCone.replace("ALPHA", "0.02"));
  ctx.fillStyle = gradienKerucut;
  ctx.fill();
  ctx.restore();
}

// DRAW LOOP
function draw() {
  ctx.save();
  if (getarLayar > 0) {
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }

  canvas.style.backgroundColor = warnaLantai;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (pemain.timeActive) {
    ctx.fillStyle = "rgba(155, 89, 182, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (temaPeta === "lab") {
    ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }
  }

  for (let p of partikelAmbien) {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.glow;
    ctx.globalAlpha = p.a;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (let k of kotoran) {
    ctx.beginPath();
    ctx.arc(k.x, k.y, k.r, 0, Math.PI * 2);
    ctx.fillStyle = k.isBlood ? `rgba(185, 28, 28, ${k.a})` : warnaKotoran;
    ctx.globalAlpha = k.isBlood ? 1 : opasitasKotoran;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  for (let h of daftarJebakan) {
    if (h.tipe === "daun") {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 69, 19, 0.35)";
      ctx.fill();
      ctx.strokeStyle = "#5c2e0b";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (h.tipe === "laser") {
      ctx.fillStyle = "#334155";
      ctx.fillRect(h.x - 4, h.y - 3, 6, 12);
      ctx.fillRect(h.x + h.w - 2, h.y - 3, 6, 12);

      if (h.active) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
        ctx.fillRect(h.x, h.y, h.w, h.h);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(h.x, h.y + 1.5, h.w, 3);
        ctx.shadowColor = 'transparent';
      } else if (h.warning) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(h.x, h.y + 2, h.w, 1);
        ctx.setLineDash([]);
      }
    } else if (h.tipe === "trap") {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(h.x, h.y, h.w, h.h);
      ctx.strokeStyle = "#334155";
      ctx.strokeRect(h.x, h.y, h.w, h.h);

      if (h.active) {
        ctx.fillStyle = "#ef4444";
        for (let sx = 0; sx < h.w; sx += 12) {
          ctx.beginPath();
          ctx.moveTo(h.x + sx, h.y + h.h);
          ctx.lineTo(h.x + sx + 6, h.y);
          ctx.lineTo(h.x + sx + 12, h.y + h.h);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = h.telegraph ? "#f59e0b" : "#475569";
        for (let sx = 0; sx < h.w; sx += 12) {
          ctx.beginPath();
          ctx.arc(h.x + sx + 6, h.y + h.h / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  ctx.fillStyle = temaPeta === "hutan" ? "rgba(22, 101, 52, 0.85)" : "rgba(30, 41, 59, 0.75)";
  for (let s of sembunyi) {
    if (temaPeta === "hutan") {
      ctx.beginPath();
      ctx.arc(s.x + s.w / 2, s.y + s.h / 2, s.w / 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#14532d";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.strokeRect(s.x + 4, s.y + 4, s.w - 8, s.h - 8);
    }
  }

  for (let h of daftarJebakan) {
    if (h.tipe === "cctv") {
      let warnaKerucut = h.alertActive ? "rgba(239, 68, 68, ALPHA)" : "rgba(0, 229, 255, ALPHA)";
      gambarVisionCone(h.x, h.y, h.sudut, JARAK_PANDANG, LEBAR_PANDANG, warnaKerucut);

      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(h.x, h.y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = h.alertActive ? "#ef4444" : "#22c55e";
      ctx.beginPath();
      ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let m of musuh) {
    let adalahVIP = (m.isVIP || (m.tipe && m.tipe.startsWith("viplevel")));
    if (!adalahVIP) {
      let warnaKerucut = m.status === "chase" ? "rgba(239, 68, 68, ALPHA)" : (m.status === "investigate" ? "rgba(249, 115, 22, ALPHA)" : "rgba(250, 204, 21, ALPHA)");
      gambarVisionCone(m.x, m.y, m.sudut, JARAK_PANDANG, LEBAR_PANDANG, warnaKerucut);
    }

    let barW = adalahVIP ? 44 : (m.tipe === "boss" ? 64 : (m.tipe === "rival" ? 80 : (m.tipe === "juggernaut" ? 48 : (m.tipe === "rival_clone" ? 36 : 32))));
    let barH = adalahVIP ? 6 : ((m.tipe === "boss" || m.tipe === "rival") ? 8 : 5);
    let barY = m.y - m.radius - (adalahVIP ? 15 : ((m.tipe === "boss" || m.tipe === "rival") ? 16 : 11));
    let barX = m.x - barW / 2;
    let rasioHp = Math.max(0, Math.min(1, m.hp / m.maxHp));

    ctx.fillStyle = "rgba(10, 15, 25, 0.85)";
    ctx.fillRect(barX, barY, barW, barH);

    let warnaBar = rasioHp > 0.5 ? "#22c55e" : (rasioHp > 0.25 ? "#f59e0b" : "#ef4444");
    if (adalahVIP) warnaBar = "#eab308";
    if (m.tipe === "rival") warnaBar = rasioHp > 0.5 ? "#dc2626" : "#ef4444";
    if (m.tipe === "rival_clone") warnaBar = "#9333ea";
    ctx.fillStyle = warnaBar;
    ctx.fillRect(barX, barY, barW * rasioHp, barH);

    ctx.strokeStyle = adalahVIP ? "#facc15" : (m.tipe === "boss" ? "#f59e0b" : (m.tipe === "rival" ? "#ef4444" : (m.tipe === "rival_clone" ? "#a855f7" : "rgba(255, 255, 255, 0.4)")));
    ctx.lineWidth = adalahVIP ? 1.5 : 1;
    ctx.strokeRect(barX, barY, barW, barH);

    for (let k = 1; k < m.maxHp; k++) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(barX + (k / m.maxHp) * barW, barY, 1, barH);
    }

    if (adalahVIP) {
      let vTitle = "👑 TARGET VIP (LEMAH)";
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 10px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(vTitle, m.x, barY - 4);
    } else if (m.tipe === "boss" || m.tipe === "rival") {
      ctx.fillStyle = m.tipe === "rival" ? "#fca5a5" : "#fef08a";
      ctx.font = "bold 9px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(m.tipe === "rival" ? "👑 RIVAL ASSASSIN" : "BIG BOSS", m.x, barY - 3);

      if (m.tipe === "rival" && m.vulnerableTimer > 0) {
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 10px 'Segoe UI', sans-serif";
        ctx.fillText("⚡ OPENING / SERANG! ⚡", m.x, barY - 14);
      }
    } else if (m.tipe === "rival_clone") {
      ctx.fillStyle = "#d8b4fe";
      ctx.font = "bold 8px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CLONE", m.x, barY - 3);
    }
  }

  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  for (let t of tembok) {
    if (temaPeta === "lab") {
      ctx.fillStyle = warnaAtasTembok;
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.strokeStyle = warnaTembok;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(t.x, t.y, t.w, t.h);
    } else if (temaPeta === "hutan") {
      ctx.fillStyle = warnaAtasTembok;
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.strokeStyle = warnaTembok;
      ctx.lineWidth = 2;
      ctx.strokeRect(t.x, t.y, t.w, t.h);
    } else {
      ctx.fillStyle = warnaTembok;
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = warnaAtasTembok;
      ctx.fillRect(t.x + 2, t.y + 2, t.w - 4, t.h - 4);
    }
  }
  ctx.shadowColor = 'transparent';

  for (let k of daftarKoinPeta) {
    if (!k.collected) {
      let pulse = Math.sin(penghitungBingkai * 0.1) * 1.5;
      ctx.save();
      ctx.translate(k.x, k.y);
      ctx.beginPath();
      ctx.arc(0, 0, 8 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#854d0e";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 1);
      ctx.restore();
    }
  }


  // 1. RENDER BERLIAN / DIAMONDS (HUNTER ASSASSIN COLLECTIBLES)
  for (let d of daftarBerlian) {
    if (!d.collected) {
      d.frame = (d.frame || 0) + 0.06;
      let bob = Math.sin(d.frame) * 3;
      let sz = 9 + Math.sin(d.frame * 2) * 1.5;
      ctx.save();
      ctx.translate(d.x, d.y + bob);
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 12;

      // Bentuk Poligon Permata Berlian
      ctx.fillStyle = "#00e5ff";
      ctx.beginPath();
      ctx.moveTo(0, -sz);
      ctx.lineTo(sz * 0.85, 0);
      ctx.lineTo(0, sz);
      ctx.lineTo(-sz * 0.85, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.7);
      ctx.lineTo(sz * 0.4, 0);
      ctx.lineTo(0, sz * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // 2. RENDER PELURU MUSUH (ENEMY TRACER BULLETS)
  for (let eb of daftarPeluruMusuh) {
    ctx.save();
    if (eb.isBoss) {
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#ff2222";
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(eb.x, eb.y);
      ctx.lineTo(eb.x - eb.vx * 3.5, eb.y - eb.vy * 3.5);
      ctx.stroke();
    } else {
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eb.x, eb.y);
      ctx.lineTo(eb.x - eb.vx * 2, eb.y - eb.vy * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 3. RENDER PINTU BIASA DI DINDING POJOK (CORNER WALL DOOR)
  let ep = portalKeluar;
  let pintuTerbuka = ep.active;
  let pulsasi = (Math.sin(penghitungBingkai * 0.08) + 1) * 0.5;

  ctx.save();
  ctx.translate(ep.x, ep.y);

  let lebarPintu = 52;
  let tinggiKusen = 28;

  // 3.1 Efek Lantai & Area Interaksi Depan Pintu
  ctx.beginPath();
  ctx.arc(0, 10, ep.radius || 34, 0, Math.PI);
  ctx.fillStyle = pintuTerbuka ? `rgba(34, 197, 94, ${0.09 + pulsasi * 0.09})` : "rgba(239, 68, 68, 0.04)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = pintuTerbuka ? "rgba(34, 197, 94, 0.65)" : "rgba(239, 68, 68, 0.25)";
  ctx.stroke();
  ctx.setLineDash([]);

  // 3.2 Ambang Pintu / Threshold di Lantai
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = pintuTerbuka ? "#22c55e" : "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(-lebarPintu / 2 - 2, 6, lebarPintu + 4, 10, 2);
  } else {
    ctx.rect(-lebarPintu / 2 - 2, 6, lebarPintu + 4, 10);
  }
  ctx.fill();
  ctx.stroke();

  if (pintuTerbuka) {
    // 3.3 Bias Cahaya Terang dari Balik Pintu Masuk ke Lantai Ruangan
    let gradienCahaya = ctx.createLinearGradient(0, -10, 0, 55);
    gradienCahaya.addColorStop(0, "rgba(74, 222, 128, 0.85)");
    gradienCahaya.addColorStop(0.3, "rgba(34, 197, 94, 0.45)");
    gradienCahaya.addColorStop(1, "rgba(34, 197, 94, 0)");
    ctx.fillStyle = gradienCahaya;
    ctx.beginPath();
    ctx.moveTo(-lebarPintu / 2, -6);
    ctx.lineTo(lebarPintu / 2, -6);
    ctx.lineTo(lebarPintu / 2 + 18, 55);
    ctx.lineTo(-lebarPintu / 2 - 18, 55);
    ctx.closePath();
    ctx.fill();

    // Lubang Lorong di Dinding (Gelap di dalam dinding)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-lebarPintu / 2 + 3, -tinggiKusen / 2, lebarPintu - 6, tinggiKusen);

    // Daun Pintu Kayu Terbuka Mengayun Masuk ke Ruangan
    ctx.save();
    ctx.translate(-lebarPintu / 2 + 2, -tinggiKusen / 2 + 2);
    ctx.rotate(0.8); // Mengayun terbuka ke dalam
    ctx.fillStyle = "#92400e";
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 1.5;
    ctx.fillRect(0, 0, lebarPintu * 0.85, 7);
    ctx.strokeRect(0, 0, lebarPintu * 0.85, 7);
    // Gagang pintu emas
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(lebarPintu * 0.7, 3.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Panah Bergerak Masuk ke Dinding
    let geserPanah = Math.sin(penghitungBingkai * 0.12) * 3;
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("▲", 0, 10 + geserPanah);

  } else {
    // 3.4 Daun Pintu Kayu / Baja Tertutup Kokoh di Dinding
    ctx.fillStyle = "#78350f";
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 2;
    ctx.fillRect(-lebarPintu / 2 + 3, -tinggiKusen / 2, lebarPintu - 6, tinggiKusen);
    ctx.strokeRect(-lebarPintu / 2 + 3, -tinggiKusen / 2, lebarPintu - 6, tinggiKusen);

    // Panel Ukiran Pintu Kayu
    let pW = (lebarPintu - 18) / 2;
    let pH = tinggiKusen - 6;
    ctx.fillStyle = "#92400e";
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1;
    ctx.fillRect(-lebarPintu / 2 + 6, -tinggiKusen / 2 + 3, pW, pH);
    ctx.strokeRect(-lebarPintu / 2 + 6, -tinggiKusen / 2 + 3, pW, pH);
    ctx.fillRect(3, -tinggiKusen / 2 + 3, pW, pH);
    ctx.strokeRect(3, -tinggiKusen / 2 + 3, pW, pH);

    // Gagang Pintu Emas (Doorknob)
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(-2, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(-2, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Gembok Keamanan Terkunci di Pintu
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔒", 10, 0);
  }

  // 3.5 Kusen Samping & Balok Atas di Dinding (Door Frame & Lintel)
  ctx.fillStyle = "#334155";
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.5;
  // Kusen Kiri
  ctx.fillRect(-lebarPintu / 2 - 3, -tinggiKusen / 2 - 4, 6, tinggiKusen + 14);
  ctx.strokeRect(-lebarPintu / 2 - 3, -tinggiKusen / 2 - 4, 6, tinggiKusen + 14);
  // Kusen Kanan
  ctx.fillRect(lebarPintu / 2 - 3, -tinggiKusen / 2 - 4, 6, tinggiKusen + 14);
  ctx.strokeRect(lebarPintu / 2 - 3, -tinggiKusen / 2 - 4, 6, tinggiKusen + 14);
  // Balok Atas Kusen (Header Lintel)
  ctx.fillRect(-lebarPintu / 2 - 3, -tinggiKusen / 2 - 7, lebarPintu + 6, 6);
  ctx.strokeRect(-lebarPintu / 2 - 3, -tinggiKusen / 2 - 7, lebarPintu + 6, 6);

  // 3.6 Neon Signbox "EXIT" di Dinding Atas Pintu
  ctx.save();
  ctx.translate(0, -tinggiKusen / 2 - 13);
  ctx.fillStyle = pintuTerbuka ? "rgba(20, 83, 45, 0.95)" : "rgba(127, 29, 29, 0.95)";
  ctx.strokeStyle = pintuTerbuka ? "#22c55e" : "#ef4444";
  ctx.lineWidth = 1.5;
  if (pintuTerbuka) {
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 10;
  }
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(-22, -6, 44, 12, 2);
  } else {
    ctx.rect(-22, -6, 44, 12);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = pintuTerbuka ? "#4ade80" : "#fca5a5";
  ctx.font = "900 8.5px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pintuTerbuka ? "EXIT ➔" : "LOCKED", 0, 0);
  ctx.restore();

  // 3.7 Label Status Pintu di Bawah Pintu (di Area Ruangan)
  let tahapVIP = (tahapSekarang === 3 || tahapSekarang === 4);
  let pesanTerkunci = tahapVIP ? "🔒 PINTU TERKUNCI (HABISI VIP & BOSS!)" : "🔒 PINTU TERKUNCI (HABISI SEMUA MUSUH!)";
  ctx.font = "bold 11px 'Rajdhani', sans-serif";
  ctx.fillStyle = pintuTerbuka ? "#4ade80" : "#ef4444";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pintuTerbuka ? "🚪 PINTU TERBUKA (MASUK) ➔" : pesanTerkunci, 0, 30);

  ctx.restore();

  if (pemain.noiseR > 0) {
    ctx.beginPath();
    ctx.arc(pemain.x, pemain.y, pemain.noiseR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (let s of daftarShuriken) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    if (s.isEnemy) {
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-10, -2.5, 20, 5);
      ctx.fillRect(-2.5, -10, 5, 20);
      ctx.fillStyle = "#7f1d1d";
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(-9, -2.5, 18, 5);
      ctx.fillRect(-2.5, -9, 5, 18);
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (pemain.cloneActive) {
    gambarKarakter(pemain.cloneX, pemain.cloneY, pemain.radius, 0, "#22c55e", 0.6, true);
  }

  // Efek bayangan dash ninja halus (subtle shadow afterimages)
  for (let t of pemain.trail) {
    if (t.alpha <= 0) continue;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(0.32, t.alpha * 0.7));
    ctx.translate(t.x, t.y);
    ctx.rotate((t.sudut !== undefined ? t.sudut : 0) - Math.PI / 2);

    if (t.sheetImg && t.sheetImg.complete && t.sheetImg.naturalWidth > 0 && t.sRect) {
      let is600 = t.sheetImg.naturalWidth <= 800;
      let skalaLembarX = is600 ? 1 : t.sheetImg.naturalWidth / 1536;
      let skalaLembarY = is600 ? 1 : t.sheetImg.naturalHeight / 1024;
      let sx = t.sRect.x * skalaLembarX;
      let sy = t.sRect.y * skalaLembarY;
      let sw = t.sRect.w * skalaLembarX;
      let sh = t.sRect.h * skalaLembarY;
      let targetH = pemain.radius * 3.8;
      let targetW = targetH * (t.sRect.w / t.sRect.h);
      let anchorX = t.sRect.anchorX !== undefined ? t.sRect.anchorX : 0.5;
      let anchorY = t.sRect.anchorY !== undefined ? t.sRect.anchorY : 0.5;

      // Siluet bayangan gelap alami (tanpa kilatan neon)
      ctx.filter = "brightness(0) opacity(0.75)";
      ctx.drawImage(t.sheetImg, sx, sy, sw, sh, -targetW * anchorX, -targetH * anchorY, targetW, targetH);
      ctx.filter = "none";
    } else {
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
      ctx.beginPath();
      ctx.ellipse(0, 0, pemain.radius * 1.1, pemain.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  for (let r of daftarItemPemulih) {
    let bob = Math.sin((r.frame || 0) * 2) * 3;
    ctx.save();
    ctx.translate(r.x, r.y + bob);
    let gradienPendar = ctx.createRadialGradient(0, 0, 3, 0, 0, 16);
    gradienPendar.addColorStop(0, "rgba(34, 197, 94, 0.75)");
    gradienPendar.addColorStop(1, "rgba(34, 197, 94, 0)");
    ctx.fillStyle = gradienPendar;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.roundRect(-8, -8, 16, 16, 4);
    ctx.fill();
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-2, -5, 4, 10);
    ctx.fillRect(-5, -2, 10, 4);

    ctx.fillStyle = "#86efac";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("+HP", 0, -11);
    ctx.restore();
  }

  for (let m of musuh) {
    gambarKarakter(m.x, m.y, m.radius, m.sudut, m.warnaBase, 1, false, m.tipe, levelSekarang, m);

    // Banner Indikator Stealth Takedown saat Pemain Mengendap di Belakang Musuh
    if (m.canTakedown && !pemain.ghostActive) {
      ctx.save();
      ctx.translate(m.x, m.y - m.radius - 22);
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-46, -10, 92, 20, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#facc15";
      ctx.font = "900 10px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚡ TAKEDOWN [L]", 0, 0);
      ctx.restore();
    }
  }

  let pWarna = pemain.ghostActive ? "#94a3b8" : pemain.warnaBase;
  let pAlpha = pemain.ghostActive ? 0.35 : (pemain.isHiding ? 0.45 : 1.0);
  if (pemain.invincibleTimer > 0 && Math.floor(penghitungBingkai / 4) % 2 === 0) pAlpha = 0.25;
  gambarKarakter(pemain.x, pemain.y, pemain.radius, pemain.sudut, pWarna, pAlpha, true);

  for (let i = daftarVFX.length - 1; i >= 0; i--) {
    let v = daftarVFX[i];
    if (v.tipe === 'partikel') {
      v.x += v.dx;
      v.y += v.dy;
      v.a -= 0.04;
      ctx.globalAlpha = Math.max(0, v.a);
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fillStyle = v.c;
      ctx.fill();
    } else if (v.tipe === 'gelombang') {
      v.r += v.dr;
      v.a -= 0.035;
      ctx.globalAlpha = Math.max(0, v.a);
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.strokeStyle = v.c;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    if (v.a <= 0) daftarVFX.splice(i, 1);
  }
  ctx.globalAlpha = 1;

  for (let s of daftarTebasan) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.sudut);
    ctx.beginPath();
    ctx.arc(0, 0, 36 + s.frame * 1.5, -Math.PI / 1.5, Math.PI / 1.5);
    ctx.lineWidth = 7 * (1 - s.frame / 15);
    ctx.globalAlpha = 1 - (s.frame / 15);
    ctx.strokeStyle = warnaSenjata;
    if (tipeSenjata === "bentuk-saber") {
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 15;
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  ctx.font = "bold 15px 'Segoe UI', Tahoma, sans-serif";
  ctx.textAlign = "center";
  for (let t of teksMelayang) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, t.a);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
    ctx.lineWidth = 3;
    ctx.strokeText(t.t, t.x, t.y);
    ctx.fillStyle = t.c;
    ctx.fillText(t.t, t.x, t.y);
    ctx.restore();
  }
  ctx.textAlign = "left";

  let persenHp = Math.max(0, Math.min(1, pemain.hp / pemain.maxHp));
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(pemain.x - 22, pemain.y - 36, 44, 6);
  ctx.fillStyle = persenHp > 0.5 ? "#22c55e" : (persenHp > 0.25 ? "#f59e0b" : "#ef4444");
  ctx.fillRect(pemain.x - 22, pemain.y - 36, persenHp * 44, 6);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(pemain.x - 22, pemain.y - 36, 44, 6);
  for (let i = 1; i < 4; i++) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(pemain.x - 22 + (i / 4) * 44, pemain.y - 36, 1, 6);
  }

  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  ctx.fillRect(pemain.x - 22, pemain.y - 27, 44, 5);
  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(pemain.x - 22, pemain.y - 27, (pemain.energiDash / 100) * 44, 5);

  renderHUDBar();
  ctx.restore();

  if (window.gameState === "lose") {
    ctx.fillStyle = "rgba(10, 15, 25, 0.88)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ef4444";
    ctx.font = "900 48px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(Teks.tertangkap, canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 20px 'Segoe UI', sans-serif";
    ctx.fillText(Teks.ulang + tahapSekarang + " (atau Klik Layar)", canvas.width / 2, canvas.height / 2 + 35);
  } else if (window.gameState === "win") {
    ctx.fillStyle = "rgba(10, 15, 25, 0.92)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";

    if (levelSekarang === 3 && (tahapSekarang === 3 || tahapSekarang === 4)) {
      ctx.fillStyle = "#eab308";
      ctx.font = "900 36px 'Segoe UI', sans-serif";
      ctx.fillText("👑 SUPREME VIP LEVEL 3 & BOSS DITAKLUKKAN! 👑", canvas.width / 2, canvas.height / 2 - 50);

      ctx.fillStyle = "#ef4444";
      ctx.font = "900 26px 'Segoe UI', sans-serif";
      ctx.fillText("GELAR TERBUKA: THE MASTER VIP ASSASSIN", canvas.width / 2, canvas.height / 2 - 5);

      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.fillText("Bonus Kemenangan Misi Akhir: +500 KOIN LOBI!", canvas.width / 2, canvas.height / 2 + 40);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "600 18px 'Segoe UI', sans-serif";
      ctx.fillText("Tekan [ ENTER ] atau Klik Layar untuk Kembali ke Lobi", canvas.width / 2, canvas.height / 2 + 95);

    } else {
      let stars = ((statistikPermainan.alarmsTriggered || 0) === 0) ? 3 : (((statistikPermainan.alarmsTriggered || 0) <= 2) ? 2 : 1);
      let teksBintang = stars === 3 ? "⭐⭐⭐" : (stars === 2 ? "⭐⭐" : "⭐");
      let judulBintang = stars === 3 ? "GHOST MASTER (SEMPURNA!)" : (stars === 2 ? "SILENT SHINOBI" : "SURVIVOR ASSASSIN");

      let tahapVIP = (tahapSekarang === 3 || tahapSekarang === 4);
      let judulMenang = tahapVIP ? `👑 SEKTOR ${levelSekarang} - VIP & BOSS DIELIMINASI!` : `SEKTOR ${levelSekarang} - TAHAP ${tahapSekarang} SELESAI!`;

      ctx.fillStyle = "#facc15";
      ctx.font = "900 36px 'Segoe UI', sans-serif";
      ctx.fillText(judulMenang, canvas.width / 2, canvas.height / 2 - 70);

      ctx.font = "900 40px 'Segoe UI', sans-serif";
      ctx.fillText(teksBintang, canvas.width / 2, canvas.height / 2 - 15);

      ctx.fillStyle = stars === 3 ? "#00e5ff" : (stars === 2 ? "#facc15" : "#94a3b8");
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.fillText(judulBintang, canvas.width / 2, canvas.height / 2 + 25);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "600 17px 'Segoe UI', sans-serif";
      ctx.fillText(`⚡ Stealth Kills: ${statistikPermainan.stealthKills || 0} | 💎 Berlian: ${statistikPermainan.diamonds || 0} | 🚨 Alarm: ${statistikPermainan.alarmsTriggered || 0}`, canvas.width / 2, canvas.height / 2 + 65);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 18px 'Segoe UI', sans-serif";
      if (tahapSekarang < 3) {
        ctx.fillText("Tekan [ ENTER ] atau Klik untuk Berpindah ke Tahap Berikutnya ➔", canvas.width / 2, canvas.height / 2 + 115);
      } else {
        ctx.fillText("Tekan [ ENTER ] atau Klik untuk Kembali ke HQ Lobi ➔", canvas.width / 2, canvas.height / 2 + 115);
      }
    }
  }
}

// RENDER HUD SKILL BAR BAWAH
function renderHUDBar() {
  let daftarSkill = [];

  // 1. Tebas Dasar (Tombol L) - Menampilkan Status 2 Kuota / Cooldown
  daftarSkill.push({
    key: "L",
    name: "Slash",
    isSlash: true,
    charges: pemain.slashCharges !== undefined ? pemain.slashCharges : 2,
    cd: pemain.slashCooldown || 0,
    maxCd: 120,
    active: (pemain.slashCooldown || 0) <= 0,
    color: "#38bdf8"
  });

  // 2. Skill Baru: Rapid Slash (Tombol J)
  if (localStorage.getItem('skill_rapid') !== 'false') {
    daftarSkill.push({
      key: "J",
      name: "Rapid",
      cd: pemain.rapidCooldown || 0,
      maxCd: 900,
      active: pemain.rapidActive,
      color: "#f59e0b"
    });
  }

  // 3. Ghost Walk (Tombol Q)
  if (localStorage.getItem('skill_ghost') === 'true') {
    daftarSkill.push({ key: "Q", name: "Ghost", cd: pemain.ghostCooldown, maxCd: 900, active: pemain.ghostActive, color: "#00e5ff" });
  }

  // 4. Blink Kill (Tombol P - Baru)
  if (localStorage.getItem('skill_blink') === 'true') {
    daftarSkill.push({ key: "P", name: "Blink", cd: pemain.blinkCooldown, maxCd: 600, active: false, color: "#ef4444" });
  }

  // 5. Time Freeze (Tombol I - Baru)
  if (localStorage.getItem('skill_time') === 'true') {
    daftarSkill.push({ key: "I", name: "Freeze", cd: pemain.timeCooldown, maxCd: 1200, active: pemain.timeActive, color: "#9b59b6" });
  }

  // 6. Shadow Clone (Tombol T - Baru)
  if (localStorage.getItem('skill_clone') === 'true') {
    daftarSkill.push({ key: "T", name: "Clone", cd: pemain.cloneCooldown, maxCd: 1200, active: pemain.cloneActive, color: "#22c55e" });
  }

  // 7. Pisau Lempar (Tombol C)
  if (localStorage.getItem('item_shuriken') === 'true') {
    daftarSkill.push({ key: "C", name: "Knife", ammo: pemain.ammo, color: "#facc15" });
  }

  if (daftarSkill.length === 0) return;

  let lebarItem = 82;
  let jarakCelah = 8;
  let totalLebar = daftarSkill.length * lebarItem + (daftarSkill.length - 1) * jarakCelah;
  let startX = (canvas.width - totalLebar) / 2;
  let posisiYHud = 645;

  ctx.save();
  for (let i = 0; i < daftarSkill.length; i++) {
    let item = daftarSkill[i];
    let x = startX + i * (lebarItem + jarakCelah);

    // Box Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(x, posisiYHud, lebarItem, 42);
    ctx.strokeStyle = item.active ? item.color : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = item.active ? 2.5 : 1;
    ctx.strokeRect(x, posisiYHud, lebarItem, 42);

    // Hotkey Badge
    ctx.fillStyle = item.color;
    ctx.fillRect(x + 4, posisiYHud + 4, 18, 16);
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.key, x + 13, posisiYHud + 12);

    // Skill Name / Ammo
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(item.name, x + 26, posisiYHud + 12);

    // Status Cooldown Bar or Ammo count or Slash charges
    if (item.isSlash) {
      if (item.cd > 0) {
        let pct = 1 - (item.cd / item.maxCd);
        ctx.fillStyle = "#334155";
        ctx.fillRect(x + 5, posisiYHud + 26, lebarItem - 10, 8);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x + 5, posisiYHud + 26, pct * (lebarItem - 10), 8);
      } else {
        // Tampilkan 2 indikator kuota tebasan
        for (let c = 0; c < 2; c++) {
          let dotX = x + 18 + c * 24;
          let dotY = posisiYHud + 30;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = c < item.charges ? item.color : "#475569";
          ctx.fill();
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    } else if (item.ammo !== undefined) {
      ctx.fillStyle = "#facc15";
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`x${item.ammo}`, x + lebarItem / 2, posisiYHud + 31);
    } else {
      let isReady = item.cd <= 0;
      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 5, posisiYHud + 26, lebarItem - 10, 8);
      if (isReady) {
        ctx.fillStyle = item.color;
        ctx.fillRect(x + 5, posisiYHud + 26, lebarItem - 10, 8);
      } else {
        let pct = 1 - (item.cd / item.maxCd);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x + 5, posisiYHud + 26, pct * (lebarItem - 10), 8);
      }
    }
  }
  ctx.restore();
}

// INTI GAME LOOP
let targetLevelLobi = parseInt(localStorage.getItem('selectedLevel')) || 1;
resetGame(targetLevelLobi, 1);

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();