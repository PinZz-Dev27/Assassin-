# MASTER DOKUMENTASI & BEDAH KODE GAME: SPEED ASSASSIN
**Proyek Game:** Speed Assassin (Florence Guild HQ & Arena Game)  
**Teknologi:** HTML5, CSS3 Modern, Vanilla JavaScript (Canvas 2D API & Web Audio API)  
**Kesesuaian Kode:** 100% Sesuai Implementasi `game.js`, `game.html`, dan `index.html`  

---

## DAFTAR ISI MENU LENGKAP
1. [Arsitektur Proyek dan Alur Kerja Data](#1-arsitektur-proyek-dan-alur-kerja-data)
2. [Sintaks Spesifik JavaScript & Manajemen Memori](#2-sintaks-spesifik-javascript--manajemen-memori)
3. [Sistem Tembok, Collision & Raycasting](#3-sistem-tembok-collision--raycasting)
4. [Mekanika Berjalan (Walking)](#4-mekanika-berjalan-walking)
5. [Mekanika Lari & Konsumsi Stamina (Running & Sprint)](#5-mekanika-lari--konsumsi-stamina-running--sprint)
6. [Sistem Dash & Efek Bayangan (Afterimage Trail)](#6-sistem-dash--efek-bayangan-afterimage-trail)
7. [Efek Slash, Pedang Katana & Rapid Slashes](#7-efek-slash-pedang-katana--rapid-slashes)
8. [Sistem Tembakan & Proyektil (Shooting Mechanics)](#8-sistem-tembakan--proyektil-shooting-mechanics)
9. [Logika Kecerdasan Buatan (AI) Musuh & FSM](#9-logika-kecerdasan-buatan-ai-musuh--fsm)
10. [Ragam & Hirarki Musuh (Enemy Hierarchy)](#10-ragam--hirarki-musuh-enemy-hierarchy)
11. [Mekanika Stealth & Silent Takedown](#11-mekanika-stealth--silent-takedown)
12. [Audio Prosedural Synthesizer (Web Audio API)](#12-audio-prosedural-synthesizer-web-audio-api)
13. [Sistem Rendering Canvas 2D & Lapisan HUD](#13-sistem-rendering-canvas-2d--lapisan-hud)
14. [Bank Soal Ujian Praktik & Presentasi Guru (30+ Soal)](#14-bank-soal-ujian-praktik--presentasi-guru-30-soal)

---

## 1. Arsitektur Proyek dan Alur Kerja Data

Game **Speed Assassin** dirancang murni menggunakan **Vanilla JavaScript** tanpa framework atau game engine pihak ketiga (tanpa Phaser, Pixi, atau Unity). Seluruh engine rendering, fisika, audio sintetis, dan AI dibuat sendiri dari nol dengan prinsip *Separation of Concerns*:

```
[index.html] (Florence Guild HQ / Lobby)
   │
   ├── Manajemen Profil & Nama Pemain
   ├── Toko Kostum / Skin Ninja (Merah, Emas, Abu, Navy, Ungu, Hitam, Putih)
   ├── Toko Senjata (Katana, Dagger, Cyber Saber) & Upgrade Skill
   ├── Misi Harian & Pencapaian (Daily Quests & Achievements)
   ├── Pemilihan Map / Level / Sektor
   └── Penyimpanan State -> [localStorage Browser]
                                │
                                ▼
                       [game.html] (Arena Game)
                                │
                        Memuat [game.js] (Game Engine)
                                │
                                ├── Canvas 2D Rendering Engine (1000 x 700 px)
                                ├── Web Audio Synthesizer (OscillatorNode & GainNode)
                                ├── NavGrid & A* Pathfinding AI Navigation
                                ├── Collision Detection & Raycasting Line of Sight
                                ├── Skills Cooldowns & Stealth Takedowns
                                └── State Engine (Playing, Paused, Win, GameOver)
```

### Jembatan Komunikasi Antar File: `localStorage`
Semua konfigurasi pemain (skin aktif, senjata terpilih, level terbuka, koin, diamond) disimpan permanen di memori browser dengan `localStorage.setItem('kunci', nilai)`. Saat tombol "DEPLOY" di lobi ditekan, browser berpindah ke `game.html`, lalu `game.js` membaca konfigurasi tersebut saat pemanggilan `resetGame()`.

---

## 2. Sintaks Spesifik JavaScript & Manajemen Memori

### Perbandingan Mendalam: `let`, `const`, dan `var`
- **`const`:** Digunakan untuk konstanta yang tidak boleh di-reassign, seperti ukuran grid `KOLOM_NAV = 50`, referensi kanvas, dan tabel konfigurasi warna.
- **`let`:** Digunakan untuk variabel dinamis yang berganti nilai setiap frame, seperti posisi `pemain.x`, stamina, timer cooldown, dan loop iterator.
- **`var` (Ditinggalkan):** Tidak digunakan karena bersifat *Function Scope* dan rentan bug *hoisting*.

### Struktur Data Biner: `Uint8Array`
```javascript
let kisiNavigasi = new Uint8Array(KOLOM_NAV * BARIS_NAV);
```
Grid peta berukuran 50x35 = 1750 sel. Tiap sel hanya berukuran 1 byte (0 = bebas, 1 = dinding). Ini mencegah *garbage collection stutter* saat ribuan iterasi A* dieksekusi.

---

## 3. Sistem Tembok, Collision & Raycasting

### 1. Struktur Data Tembok & Tabrakan (AABB vs Circle)
Tembok didefinisikan sebagai array persegi panjang `{ x, y, w, h }`:
```javascript
function cekTabrakanTembok(posisiX, posisiY, radius) {
  for (let t of tembok) {
    if (posisiX + radius > t.x && 
        posisiX - radius < t.x + t.w && 
        posisiY + radius > t.y && 
        posisiY - radius < t.y + t.h) {
      return true; // Terjadi benturan
    }
  }
  return false; // Ruang bebas
}
```
*Penjelasan Matematika:* Logika ini memperluas kotak tembok sebesar radius lingkaran entitas di setiap sisi, memungkinkan pengecekan tumpang tindih (*overlap*) super cepat dalam mikrodetik.

### 2. Algoritma Anti-Nyangkut (`bebaskanMusuhDariTembok`)
Jika musuh terdorong ke dalam dinding akibat knockback serangan:
```javascript
function bebaskanMusuhDariTembok(m) {
  for (let iter = 0; iter < 2; iter++) {
    let collided = false;
    for (let t of tembok) {
      if (m.x + m.radius > t.x && m.x - m.radius < t.x + t.w &&
          m.y + m.radius > t.y && m.y - m.radius < t.y + t.h) {
        collided = true;
        let dKiri  = (m.x + m.radius) - t.x;
        let dKanan = (t.x + t.w) - (m.x - m.radius);
        let dAtas  = (m.y + m.radius) - t.y;
        let dBawah = (t.y + t.h) - (m.y - m.radius);
        let minD = Math.min(dKiri, dKanan, dAtas, dBawah);

        if (minD === dKiri)       m.x = t.x - m.radius - 0.5;
        else if (minD === dKanan) m.x = t.x + t.w + m.radius + 0.5;
        else if (minD === dAtas)  m.y = t.y - m.radius - 0.5;
        else if (minD === dBawah) m.y = t.y + t.h + m.radius + 0.5;
      }
    }
    if (!collided) break;
  }
}
```
*Penjelasan:* Mengukur jarak penetrasi ke 4 sisi tembok dan mendorong musuh keluar ke arah sisi terdekat ditambah buffer 0.5px.

### 3. Raycasting Garis Pandang (`hitRayWall`)
Menggunakan algoritma *Slab Method* (Line-AABB Intersection) untuk menghitung jarak benturan dinding sinar senter atau laser tanpa loop piksel:
```javascript
function hitRayWall(asalX, asalY, arahX, arahY, jarakMaksimal) {
  let jarakTerdekat = jarakMaksimal;
  for (let i = 0; i < tembok.length; i++) {
    let t = tembok[i];
    let invDirX = 1 / (arahX !== 0 ? arahX : 0.00001);
    let invDirY = 1 / (arahY !== 0 ? arahY : 0.00001);
    let t1 = (t.x - asalX) * invDirX;
    let t2 = (t.x + t.w - asalX) * invDirX;
    let t3 = (t.y - asalY) * invDirY;
    let t4 = (t.y + t.h - asalY) * invDirY;
    let tMin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    let tMax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    if (tMax >= 0 && tMin <= tMax && tMin < jarakTerdekat) {
      if (tMin >= 0) jarakTerdekat = tMin;
    }
  }
  return jarakTerdekat;
}
```

### 4. Visual Tembok 2.5D Pseudo-Depth
Digambar berlapis: dinding dasar gelap dengan bayangan `ctx.shadowColor = 'rgba(0,0,0,0.7)'`, diikuti atap tembok lebih terang dengan inset bevel 2px.

---

## 4. Mekanika Berjalan (Walking)

### 1. Input WASD & Normalisasi Diagonal
```javascript
let currentSpeed = pemain.kecepatanNormal; // 3.8 px/frame
let inputX = 0, inputY = 0;
if (statusTombol.w) inputY -= 1;
if (statusTombol.s) inputY += 1;
if (statusTombol.a) inputX -= 1;
if (statusTombol.d) inputX += 1;

// Normalisasi diagonal agar tidak lebih cepat 41.4%
if (inputX !== 0 && inputY !== 0) {
  inputX *= 0.7071; // 1 / sqrt(2)
  inputY *= 0.7071;
}

let targetVx = inputX * currentSpeed;
let targetVy = inputY * currentSpeed;

// Smooth Acceleration
let kecepatanInterpolasi = 0.28;
pemain.vx = (pemain.vx || 0) + (targetVx - (pemain.vx || 0)) * kecepatanInterpolasi;
pemain.vy = (pemain.vy || 0) + (targetVy - (pemain.vy || 0)) * kecepatanInterpolasi;
```

### 2. Wall Sliding (Meluncur Mulus di Sisi Dinding)
Pergerakan sumbu X dan Y dipisahkan:
```javascript
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
```
Jika menabrak dinding vertikal, sumbu X ditahan nol tetapi sumbu Y tetap meluncur bebas.

### 3. Rotasi 360° & Dynamic Lean
Arah hadap dihitung dengan `Math.atan2(pemain.vy, pemain.vx)` dan dihaluskan dengan `lerpAngle(visualSudut, target, 0.26)` untuk mencegah putaran patah saat melintasi $-\pi \leftrightarrow +\pi$. Tubuh ninja juga miring secara elastis (-0.1 rad ke kiri, +0.1 rad ke kanan) saat bergerak.

---

## 5. Mekanika Lari & Konsumsi Stamina (Running & Sprint)

### 1. Pemicu Shift Key & Kecepatan Berlari
Saat menahan tombol `Shift` bersama tombol arah:
```javascript
if (statusTombol.shift && pemain.energiDash > 0 && adaInputGerakan) {
  if (!sedangNgedash) {
    mainkanSuara('dash');
    sedangNgedash = true;
  }
  currentSpeed = pemain.kecepatanDash; // Meningkat ke 7.6 px/frame (+100%)
  pemain.energiDash -= 2.2;            // Menguras stamina per frame
  pemain.noiseR = 150;                 // Memancarkan gelombang suara derap langkah 150px!
  picuSuara(pemain.x, pemain.y, pemain.noiseR);
} else {
  sedangNgedash = false;
  if (pemain.energiDash < 100) pemain.energiDash += 0.65; // Regenerasi stamina
}
```

### 2. Radius Suara & Reaksi Musuh (`picuSuara`)
- **Berjalan:** `noiseR = 0` (Hening mutlak, musuh di belakang tidak mendengar).
- **Berlari (Sprint):** `noiseR = 150 px`. Seluruh musuh dalam jarak 150px langsung kaget, berubah status ke `investigate`, dan berbalik mendatangi lokasi derap kaki.

---

## 6. Sistem Dash & Efek Bayangan (Afterimage Trail)

### 1. Merekam Snapshot Bayangan Ninja
Setiap 3 frame saat berlari kencang/dash:
```javascript
pemain.trail.push({
  x: pemain.x,
  y: pemain.y,
  sudut: pemain.visualSudut,
  alpha: 0.45,
  sRect: sRect,
  gambarLembarSprite: gambarSprite
});
if (pemain.trail.length > 5) pemain.trail.shift();
```

### 2. Pemudaran Bayangan & Kemudi Drift
- Setiap frame: `pemain.trail.forEach(t => t.alpha -= 0.05)`.
- Nilai interpolasi akselerasi dinaikkan ke `0.38` saat dash, menghasilkan rasa kemudi ninja yang sangat responsif saat bermanuver menghindari peluru.

---

## 7. Efek Slash, Pedang Katana & Rapid Slashes

### 1. Tebasan Melee Biasa (Tombol [L] / `bunuhMusuh`)
Dibatasi maksimal 2 kali tebasan berturut-turut untuk menjaga keseimbangan permainan:
```javascript
// Kuota 2x tebas, lalu cooldown 2 detik (120 frame)
pemain.slashCharges = (pemain.slashCharges !== undefined) ? pemain.slashCharges - 1 : 1;
if (pemain.slashCharges <= 0) {
  pemain.slashCooldown = 120; // 2 Detik Cooldown
  pemain.slashCharges = 0;
} else {
  pemain.slashResetTimer = 90; // Reset ke 2x jika berhenti menebas selama 1.5 detik
}
```

### 2. Menggambar Busur Sabit Katana pada Canvas
```javascript
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
```
Busur sabit melingkar $240^\circ$ membesar dan memudar seiring naiknya `s.frame` dari 0 ke 15.

### 3. Skill Rapid Slash (Tombol [R] / -3 Bar HP)
Flurry tebasan kilat selama 2 detik penuh. Setiap 6 frame menghasilkan tebasan acak dan percikan api, dengan 3 serangan fatal beruntun pada frame 100, 60, dan 20 yang memotong 3 Bar HP penuh musuh/boss. Cooldown: 15 detik (`rapidCooldown = 900`).

---

## 8. Sistem Tembakan & Proyektil (Shooting Mechanics)

### 1. Shuriken Ninja Pemain (`lemparShuriken`)
- Tombol: [K] atau Klik Kanan.
- Kecepatan: 13 px/frame (`dx = Math.cos(sudut) * 13, dy = Math.sin(sudut) * 13`).
- Rotasi visual bintang berputar: `s.rot += 0.5` per frame.
- Tabrakan tembok: `cekTabrakanTembok(s.x, s.y, 5)` memicu suara pantulan logam dan suara derap 180px yang bisa memancing musuh.
- Tabrakan musuh: Damage 1 HP, stun 16 frame, knockback 20px. Tertangkis (*Deflected*) jika mengenai perisai depan Juggernaut atau ditepis oleh Rival Assassin.

### 2. Peluru Musuh (Keroco Pistol & Boss Cannon)
- Ditembakkan dari moncong laras: `ujungMoncongX = m.x + Math.cos(m.sudut) * (m.radius + 14)`.
- Kecepatan peluru: 9.8 px/frame (Keroco Pistol) atau 11.5 px/frame (Boss Cannon).
- Damage: 4 HP (Keroco) atau 6-7 HP (Boss Cannon dengan getar layar dahsyat 25 frame).
- Percikan tembok: Memercikkan partikel bunga api kuning `#facc15`.

### 3. Crimson Kunai Fan Rival Assassin
Musuh Rival melempar 5 kunai menyebar berbentuk kipas `[-0.35, -0.18, 0, 0.18, 0.35] rad` dengan kecepatan 9.5 px/frame. Mengakibatkan `-2 HP` pada pemain.

---

## 9. Logika Kecerdasan Buatan (AI) Musuh & FSM

### 1. Finite State Machine (FSM)
- `patrol`: Berjalan bolak-balik di rutenya. Berbalik arah saat menabrak dinding (`dx *= -1`).
- `chase`: Dipicu saat pemain terlihat senter. Mengejar lari kencang, menembak peluru, memanggil musuh lain dalam radius 380px.
- `investigate`: Dipicu oleh suara lari/klon atau saat kehilangan jejak pandang pemain dari `chase`. Mendatangi titik koordinat terakhir selama 180 frame (3 detik).
- `idle`: Status khusus target VIP atau saat terkena stun.

### 2. Logika Senter Penglihatan (`cekMelihatPemain`)
Mengevaluasi 4 lapisan pengujian fisik setiap frame:
1. Pemain sedang sembunyi di kardus atau mengaktifkan skill ghost? $\rightarrow$ Lolos.
2. Jarak Euclidean $\sqrt{\Delta x^2 + \Delta y^2} > 240\text{ px}$? $\rightarrow$ Lolos.
3. Selisih sudut terhadap arah hadap musuh $> 35^\circ$? $\rightarrow$ Lolos.
4. Raycast `hitRayWall()` terhalang tembok? $\rightarrow$ Lolos.

### 3. A* Pathfinding (`cariJalanAStar`)
Grid 50x35 sel berukuran 20px pada `Uint8Array`. Evaluasi biaya $f(n) = g(n) + h(n)$ dengan batasan 450 langkah. Hanya dijalankan jika garis pandang lurus terhalang tembok.

---

## 10. Ragam & Hirarki Musuh (Enemy Hierarchy)

1. **Keroco Patroli (Melee):** HP 2-3, kecepatan 3.5 px/f. Menyerang saat kontak fisik (Damage 3 HP).
2. **Keroco Pistol (Ranged):** HP 2-3, kecepatan 3.5 px/f. Menembakkan peluru pistol (Damage 4 HP, fire rate 0.75s).
3. **Juggernaut Guard:** HP 5-6, kecepatan 2.4 px/f. Membawa perisai besi depan yang kebal terhadap shuriken dan tebasan dari depan. Wajib diserang dari punggung belakang.
4. **Rival Assassin (Elit):** HP 15-20, kecepatan 5.0 px/f. Memiliki Kage Bunshin (2 clone), Crimson Kunai Fan, Smoke Bomb, Shunpo Dash, Parry & Counter. Menghindari takedown jika tidak dalam kondisi stun/slow-mo.
5. **Boss Cyborg & VIP:** Boss ber-HP tebal dengan meriam Boss Cannon mematikan (Damage 6-7 HP). VIP adalah orang lemah tanpa senjata (HP 1) yang dilindungi ketat dan langsung tewas dengan 1 takedown.

---

## 11. Mekanika Stealth & Silent Takedown

### 1. Logika Eksekusi dari Belakang (`executeStealthTakedown`)
Syarat mutlak: Jarak $< 70\text{ px}$, musuh tidak sedang melihat pemain (`!cekMelihatPemain`), dan pemain tidak berstatus ghost.
```javascript
m.canTakedown = (!melihatPemain && distKePemain < 70 && !pemain.ghostActive);
```
- Memotong langsung seluruh sisa HP musuh (Instant Kill).
- Memunculkan garis kilat merah menusuk jantung target dan genangan darah di lantai.
- Menjatuhkan koin dan medkit penambah darah (`dropRegenItem`).
- **Zero Alarm:** Variabel `alarmsTriggered` tidak bertambah, memastikan rating **3 Bintang (⭐⭐⭐)** tetap diraih.

---

## 12. Audio Prosedural Synthesizer (Web Audio API)

Dihasilkan secara sintetis tanpa file MP3/WAV eksternal menggunakan `OscillatorNode` dan `GainNode`:
```javascript
function playTone(tipeGelombang, frekuensiAwal, frekuensiAkhir, durasi, nilaiPenguat = 0.3) {
  let waktuSekarang = konteksAudio.currentTime;
  let osilator = konteksAudio.createOscillator();
  let nodePenguat = konteksAudio.createGain();

  osilator.type = tipeGelombang; // 'sine', 'sawtooth', 'triangle', 'square'
  osilator.frequency.setValueAtTime(frekuensiAwal, waktuSekarang);
  osilator.frequency.exponentialRampToValueAtTime(frekuensiAkhir, waktuSekarang + durasi);

  nodePenguat.gain.setValueAtTime(nilaiPenguat, waktuSekarang);
  nodePenguat.gain.exponentialRampToValueAtTime(0.001, waktuSekarang + durasi);

  osilator.connect(nodePenguat);
  nodePenguat.connect(konteksAudio.destination);
  osilator.start(waktuSekarang);
  osilator.stop(waktuSekarang + durasi);
}
```
- **Slash:** Gelombang `sawtooth` (380 Hz $\rightarrow$ 70 Hz, 0.15s).
- **Dash:** Gelombang `triangle` (240 Hz $\rightarrow$ 60 Hz, 0.2s).
- **Koin Emas:** Gelombang `sine` (987 Hz $\rightarrow$ 1318 Hz, 0.12s).
- **Alarm:** Gelombang `square` (440 Hz $\rightarrow$ 880 Hz).

---

## 13. Sistem Rendering Canvas 2D & Lapisan HUD

### Urutan Lapisan Visual (Z-Order) di `draw()`
1. Lantai dasar dan petak ubin grid arena map.
2. Ceceran darah (`kotoran`) dan item drop di lantai.
3. Afterimage bayangan dash.
4. Kerucut cahaya senter musuh (Vision Cone).
5. Karakter ninja pemain, klon bayangan, dan musuh.
6. Tembok labirin 2.5D beserta bayangan balok.
7. Proyektil peluru dan bintang shuriken.
8. Busur sabit efek tebasan katana (`daftarTebasan`).
9. Partikel percikan api dan teks melayang angka damage.
10. Lapisan HUD: Bar darah HP pemain, stamina dash, amunisi, dan timer skill.

---

## 14. Bank Soal Ujian Praktik & Presentasi Guru (30+ Soal)

### Q1. Mengapa kamu memilih `let` dan `const` dibandingkan `var`?
`let` dan `const` adalah standar modern JavaScript (ES6) yang memiliki sifat *Block Scope*. Artinya, variabel hanya hidup di dalam kurung kurawal tempat ia dibuat, sehingga mencegah kebocoran variabel atau tertimpa secara tidak sengaja di luar blok loop atau kondisi. `const` digunakan untuk nilai konstan yang tidak boleh diubah (seperti dimensi grid atau referensi canvas), sedangkan `let` digunakan untuk nilai yang dinamis (seperti posisi koordinat X/Y pemain, HP, dan kecepatan). Sedangkan `var` sudah ditinggalkan karena bersifat *Function Scope* dan rentan mengalami *hoisting bug*.

### Q2. Bagaimana cara kerja siklus perulangan `gameLoop()` di kode ini?
Siklus perulangan digerakkan oleh `requestAnimationFrame(gameLoop)`. Pola arsitektur ini membagi alur setiap frame menjadi dua tahap teratur:
1. `update()`: Menghitung matematika gerak, memproses input keyboard/mouse, mendeteksi tabrakan fisik, dan menjalankan AI musuh.
2. `draw()`: Menggambar ulang seluruh elemen grafis ke kanvas.  
`requestAnimationFrame` secara otomatis menyelaraskan diri dengan refresh rate monitor (biasanya 60 FPS) dan otomatis menghentikan loop saat browser diminimalkan untuk menghemat daya baterai.

### Q3. Saat tombol W dan D ditekan bersamaan (diagonal), mengapa pemain tidak berjalan lebih cepat?
Karena di dalam fungsi `update()` vektor kecepatan dinormalisasi. Jika berjalan lurus kecepatannya adalah $V$, jika diagonal tanpa normalisasi maka kecepatannya menjadi $\sqrt{V^2 + V^2} \approx 1.414 \times V$ (41.4% lebih cepat). Kami mengatasinya dengan mengalikan vektor diagonal dengan $\frac{1}{\sqrt{2}} \approx 0.7071$ sehingga kecepatan tetap konsisten sama di semua arah gerak.

### Q4. Bagaimana algoritma Wall Sliding bekerja saat karakter menabrak dinding secara miring?
Dengan memisahkan pembaruan koordinat sumbu X dan sumbu Y. Pertama, posisi X ditambah `vx`; jika terjadi tabrakan dinding lewat `cekTabrakanTembok()`, hanya posisi X yang dibatalkan dan `vx` direset ke nol. Setelah itu, posisi Y ditambah `vy` dan diuji secara independen. Dengan demikian, jika pemain menabrak dinding tegak lurus sumbu X, ia tetap bisa meluncur bebas ke atas atau ke bawah di sepanjang sumbu Y tanpa tersangkut.

### Q5. Mengapa serangan tebasan katana dibatasi 2 kali berturut-turut lalu terkena cooldown?
Untuk mencegah strategi *button-mashing* (menekan tombol serang tanpa henti) yang merusak nilai taktis game stealth. Dengan sistem `slashCharges = 2` dan jeda cooldown 2 detik (120 frame), pemain dituntut berpikir strategis kapan waktu terbaik untuk menebas, mengutamakan pendekatan senyap dari belakang daripada bertarung terbuka secara brutal.

### Q6. Bagaimana busur efek tebasan katana digambar dan memudar di kanvas?
Di fungsi `draw()`, setiap objek tebasan dirender menggunakan perintah `ctx.arc(0, 0, radius, sudutMulai, sudutAkhir)` dengan sudut $-\frac{2\pi}{3}$ hingga $+\frac{2\pi}{3}$ ($240^\circ$ sapuan sabit). Seiring bertambahnya `s.frame` dari 0 ke 15, ketebalan garis `lineWidth` dan transparansi `globalAlpha` dikurangi menggunakan rumus linier $1 - \frac{\text{frame}}{15}$, menciptakan ilusi visual kilatan pedang yang melebar lalu memudar lenyap.

### Q7. Apa yang terjadi ketika shuriken mengenai perisai depan musuh Juggernaut?
Sistem menghitung selisih sudut datangnya shuriken terhadap arah hadap Juggernaut. Jika sudut berada dalam rentang $\pm 90^\circ$ di depan perisai, shuriken dianggap tertangkis (*Deflected*). Shuriken dihapus, suara denting pelindung berbunyi, layar bergetar 8 frame, dan muncul teks pop-up `'BLOCKED!'` tanpa mengurangi HP Juggernaut.

### Q8. Bagaimana musuh bisa mendeteksi pemain menggunakan kerucut senter (Vision Cone)?
Melalui 4 lapisan validasi di fungsi `cekMelihatPemain()`:
1. Memeriksa apakah pemain sedang sembunyi di kardus atau mengaktifkan skill ghost.
2. Memeriksa jarak Euclidean $\sqrt{\Delta x^2 + \Delta y^2}$ kurang dari jarak senter (240px).
3. Menghitung sudut posisi pemain terhadap arah hadap musuh menggunakan `Math.atan2`, apakah berada di dalam sudut kerucut $\pm 35^\circ$.
4. Menembakkan sinar raycast `hitRayWall()` untuk memastikan tidak ada balok tembok yang memutus pandangan.

### Q9. Kapan algoritma A* Pathfinding dijalankan dan bagaimana optimasinya agar tidak lag?
A* hanya dijalankan jika musuh berstatus waspada (*Chase* atau *Investigate*) DAN garis pandang lurusnya terhalang oleh tembok. Jika garis pandang lurus terbuka, musuh langsung lari lurus tanpa memanggil A*. Optimasi yang diterapkan: NavGrid berukuran sel 20px disimpan dalam `Uint8Array`, pencarian dibatasi maksimal 450 langkah, dan kalkulasi rute disebar bergantian antar musuh (*Time-slicing*).

### Q10. Mengapa kamu menggunakan Web Audio API daripada memutar file audio MP3 biasa?
Terdapat 3 keunggulan krusial:
1. **Ukuran File 0 KB:** Tidak membutuhkan unduhan aset eksternal, membuat game sangat cepat dimuat.
2. **Zero Latency:** Panggilan file audio biasa sering mengalami jeda (lag audio) saat diputar beruntun. Web Audio API membangkitkan gelombang instan di prosesor suara tanpa delay.
3. **Modulasi Dinamis:** Pitch nada, frekuensi sweep, dan volume bisa diubah-ubah secara matematis langsung melalui kode program.

### Q11. Mengapa Rival Assassin bisa menghindari serangan Stealth Takedown dari belakang?
Rival Assassin dirancang sebagai ninja elit yang memiliki insting *Sixth Sense*. Di fungsi `executeStealthTakedown`, terdapat logika pengaman khusus: jika musuh bertipe `'rival'` dan tidak sedang dalam status beku slow-motion waktu (`!pemain.timeActive`) serta tidak sedang terkena stun, ia langsung melakukan Shunpo Dash menghindar ke samping sejauh 110px. Satu-satunya cara mengeksekusinya adalah dengan membekukan waktu terlebih dahulu atau menyerangnya tepat saat jendela pemulihannya (*Vulnerable Window*) terbuka.

### Q12. Bagaimana arsitektur game ini memastikan pintu stage hanya terbuka saat seluruh musuh gugur?
Di dalam fungsi `update()`, variabel `sisaMusuh = musuh.length` diperiksa setiap frame. Selama `sisaMusuh > 0`, flag `portalKeluar.active = false`. Jika pemain nekat menyentuh koordinat pintu keluar saat masih ada musuh hidup, game memicu suara penolakan `'square'` dan memunculkan teks merah `'PINTU TERKUNCI! HABISI SEMUA MUSUH'`. Begitu array `musuh.length === 0`, pintu otomatis terbuka dengan efek suara arpeggio kemenangan dan pemain diizinkan melintasi pintu menuju stage berikutnya.
