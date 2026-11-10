    // Waktu tunggu (cooldown) dalam tick/frame sebelum skill Ghost Walk dapat diaktifkan kembali
    ghostCooldown: 0,
    // Waktu tunggu (cooldown) dalam tick/frame untuk skill Blink Kill
    blinkCooldown: 0,
    // Status penanda apakah skill penghenti/pembeku waktu (Time Freeze) sedang aktif
    timeActive: false,
    // Durasi sisa (timer) aktifnya efek pembekuan waktu dalam hitungan frame
    timeTimer: 0,
    // Waktu tunggu (cooldown) sebelum skill pembeku waktu dapat digunakan kembali
    timeCooldown: 0,
    // Status penanda apakah clone bayangan (Shadow Clone) sedang aktif di arena
    cloneActive: false,
    // Koordinat posisi sumbu X dari clone bayangan yang ditempatkan
    cloneX: 0,
    // Koordinat posisi sumbu Y dari clone bayangan yang ditempatkan
    cloneY: 0,
    // Durasi sisa eksistensi clone bayangan sebelum menghilang
    cloneTimer: 0,
    // Waktu tunggu (cooldown) sebelum pemain bisa mengeluarkan clone bayangan lagi
    cloneCooldown: 0,
    // Jumlah kuota tebasan pedang berturut-turut yang tersedia (maksimal 2 kali tebas)
    slashCharges: 2,
    // Waktu tunggu cooldown tebasan pedang setelah kuota tebasan habis (durasi 2 detik / 120 frame)
    slashCooldown: 0,
    // Timer reset untuk mengembalikan kuota tebasan kembali penuh jika pemain tidak menebas lagi
    slashResetTimer: 0,
    // Status penanda apakah skill tebasan cepat bertubi-tubi (Rapid Slash) sedang berjalan
    rapidActive: false,
    // Timer durasi berjalannya serangan tebasan cepat bertubi-tubi
    rapidTimer: 0,
    // Waktu tunggu (cooldown) sebelum skill Rapid Slash dapat dipicu kembali
    rapidCooldown: 0,
    // Penghitung jumlah pukulan/tebasan utama yang telah berhasil dilancarkan dalam siklus Rapid Slash
    rapidHitDone: 0
  };

  // Mengosongkan daftar jejak tebasan visual pada arena saat reset game
  slashes = [];
  // Mengosongkan daftar proyektil shuriken yang melayang di udara
  shurikens = [];
  // Mengosongkan daftar item penambah darah/regenerasi HP di lantai
  regenItems = [];
  // Mengosongkan daftar teks efek melayang (floating text) di layar
  teksMelayang = [];
  // Mengosongkan daftar peluru yang ditembakkan oleh musuh
  enemyBullets = [];
  // Mengosongkan daftar permata berlian (diamonds) yang tersebar di arena
  diamonds = [];
  // Mengatur ulang jumlah pembunuhan musuh secara sembunyi-sembunyi (stealth kills) ke nilai nol
  stats.stealthKills = 0;
  // Mengatur ulang jumlah alarm yang terpicu pada level ini ke nilai nol
  stats.alarmsTriggered = 0;
  // Memanggil fungsi untuk membangkitkan partikel-partikel ambien di latar belakang peta
  inisialisasiPartikelAmbien();
  // Memperbarui tampilan indikator bar darah (HP UI) di antarmuka layar
  updateHpUI();

  // Mengambil data tata letak peta berdasarkan level dan tahapan (stage) saat ini
  let mData = mapData[currentLevel][currentStage];
  // Menyalin data array tembok/dinding dari level secara mendalam (deep copy)
  tembok = JSON.parse(JSON.stringify(mData.tembok));
  // Menyalin data area semak/tempat persembunyian secara mendalam dari data level
  sembunyi = JSON.parse(JSON.stringify(mData.sembunyi));
  // Membangun grid navigasi untuk algoritma pencarian rute (A* pathfinding) musuh
  bangunNavGrid();

  // Mengosongkan array daftar musuh sebelum memuat data musuh baru pada stage ini
  musuh = [];
  // Mengiterasi setiap entri konfigurasi musuh dari data peta untuk diinisialisasi
  mData.musuh.forEach((m, mIdx) => {
    // Kecepatan gerak standar untuk musuh biasa
    let baseSpd = 3.0;
    // Nilai darah (HP) bawaan musuh standar
    let hpDefault = 2;
    // Besaran daya rusak serangan standar musuh ke pemain
    let damageDefault = 3;
    // Ukuran radius fisik tabrakan standar musuh
    let radiusDefault = 16;
    // Warna dasar visual musuh standar (merah bata)
    let mColor = "#c0392b";

    // Mengambil string tipe musuh dari konfigurasi data peta
    let enemyType = m.tipe;
    // Menyesuaikan tipe kroco secara bergantian antara tipe melee dan penembak pistol
    if (enemyType === "kroco" || enemyType === "keroco") {
      enemyType = (mIdx % 2 === 1) ? "keroco_pistol" : "keroco";
    }

    // Penyesuaian atribut khusus jika tipe musuh adalah Rival Assassin (musuh rival legendaris)
    if (enemyType === "rival") {
      baseSpd = 5.0; // Kecepatan gerak sangat tinggi dan lincah
      hpDefault = 16; // Darah tebal untuk pertarungan bos mini
      damageDefault = 5; // Serangan mematikan
      radiusDefault = 18; // Radius tubuh sedikit lebih besar
      mColor = "#dc2626"; // Warna tema merah menyala
    // Penyesuaian atribut untuk bos utama sektor
    } else if (enemyType === "boss") {
      baseSpd = 3.2; // Kecepatan gerak sedang
      hpDefault = 8; // Darah tebal
      damageDefault = 6; // Serangan meriam berat berdaya rusak tinggi
      radiusDefault = 28; // Ukuran tubuh besar
      mColor = "#8e44ad"; // Warna tema ungu gelap
    // Penyesuaian atribut untuk musuh tipe Juggernaut dengan perisai depan
    } else if (enemyType === "juggernaut") {
      baseSpd = 2.2; // Gerakan lambat karena beban baju zirah dan perisai berat
      hpDefault = 4; // Darah cukup tebal
      damageDefault = 4; // Serangan gada berat
      radiusDefault = 21; // Ukuran fisik kekar
      mColor = "#475569"; // Warna abu-abu baja lapis baja
    // Penyesuaian atribut untuk keroco tipe penembak pistol
    } else if (enemyType === "keroco_pistol") {
      baseSpd = 3.0; // Kecepatan gerak patroli standar
      hpDefault = 2; // Darah standar kroco
      damageDefault = 2; // Kerusakan peluru pistol standar
      radiusDefault = 16; // Radius tubuh standar
      mColor = "#f97316"; // Warna oranye peringatan
    } else {
      // Atribut untuk keroco tipe melee (petarung jarak dekat)
      baseSpd = 3.2; // Kecepatan gerak lari melee
      hpDefault = 2; // Darah standar
      damageDefault = 3; // Serangan pisau/pentungan
      radiusDefault = 16; // Ukuran fisik standar
      mColor = "#c0392b"; // Warna merah musuh
    }

    // Menghitung vektor kecepatan patroli sumbu X berdasarkan konfigurasi arah pDx
    let dx = m.pDx > 0 ? baseSpd : (m.pDx < 0 ? -baseSpd : 0);
    // Menghitung vektor kecepatan patroli sumbu Y berdasarkan konfigurasi arah pDy
    let dy = m.pDy > 0 ? baseSpd : (m.pDy < 0 ? -baseSpd : 0);

    // Memasukkan objek musuh yang telah dikonfigurasi lengkap ke dalam array daftar musuh
    musuh.push({
      // Posisi koordinat horizontal musuh di kanvas
      x: m.x,
      // Posisi koordinat vertikal musuh di kanvas
      y: m.y,
      // Radius lingkaran fisik karakter musuh
      radius: m.r || radiusDefault,
      // Warna dasar representasi karakter musuh
      warnaBase: mColor,
      // String pengenal tipe musuh
      tipe: enemyType,
      // Nilai darah saat ini
      hp: m.hp || hpDefault,
      // Nilai batas darah maksimal musuh
      maxHp: m.maxHp || hpDefault,
      // Besaran pengurangan darah yang diakibatkan jika mengenai pemain
      damage: damageDefault,
      // Komponen kecepatan patroli arah horizontal
      patrolDx: dx,
      // Komponen kecepatan patroli arah vertikal
      patrolDy: dy,
      // Komponen kecepatan gerak horizontal aktif
      dx: dx,
      // Komponen kecepatan gerak vertikal aktif
      dy: dy,
      // Sudut orientasi hadap musuh dalam satuan radian
      sudut: Math.atan2(dy, dx) || 0,
      // Status AI awal musuh, yaitu berpatroli
      status: "patrol",
      // Pencatat status AI sebelumnya untuk perbandingan transisi
      prevStatus: "patrol",
      // Waktu hitung mundur status waspada (alert)
      alertTimer: 0,
      // Waktu hitung mundur efek pingsan/stun akibat serangan
      stunTimer: 0,
      // Waktu jeda acak awal sebelum musuh penembak dapat meluncurkan peluru pertama kali
      shootCooldown: Math.floor(Math.random() * 40),
      // Penanda boolean apakah musuh dalam kondisi sangat waspada
      isAlerted: false,
      // Penanda apakah musuh berada dalam posisi rentan untuk dihabisi diam-diam (takedown)
      canTakedown: false,
      // Timer durasi pergerakan dash khusus
      dashTimer: 0,
      // Waktu tunggu cooldown skill dash musuh Rival
      dashCooldown: 120,
      // Waktu tunggu cooldown skill pemanggilan bayangan (Kage Bunshin) milik Rival
      cloneCooldown: 360,
      // Waktu tunggu cooldown pelemparan bom asap milik Rival
      smokeCooldown: 600,
      // Waktu tunggu cooldown badai shuriken musuh Rival
      shurikenCooldown: 220,
      // Timer jendela kelemahan (vulnerable window) saat Rival membuka celah serang
      vulnerableTimer: 0,
      // Waktu tunggu cooldown tangkisan serangan (parry counter) Rival
      parryCooldown: 180,
      // Timer durasi menghilang dalam asap (stealth mode) Rival
      stealthTimer: 0,
      // Penanda boolean apakah Rival sedang berada dalam mode kamuflase tak terlihat
      isStealth: false,
      // Akumulasi jarak langkah kaki untuk kalkulasi siklus animasi berjalan
      walkDistance: 0,
      // Timer animasi ancang-ancang melancarkan serangan
      attackTimer: 0,
      // Array waypoint titik jalur rute hasil pencarian jalan algoritma A*
      path: null,
      // Timer interval jeda sebelum melakukan kalkulasi ulang rute navigasi A*
      pathTimer: 0,
      // Penghitung frekuensi terjebak rute untuk penanganan anti macet
      stuckCount: 0,
      // Array penyimpan jejak bayangan animasi musuh
      trail: []
    });
  });

  // Mengosongkan daftar dokumen intel rahasia pada level
  intels = [];
  // Mengisi ulang daftar dokumen intel berdasarkan data peta yang belum terkumpul
  mData.intels.forEach(i => intels.push({ x: i.x, y: i.y, collected: false }));

  // Mengosongkan array daftar rintangan berbahaya (hazards)
  hazards = [];
  // Mengisi daftar bahaya (CCTV, laser, jebakan duri, tumpukan daun) jika didefinisikan pada peta
  if (mData.hazards) {
    mData.hazards.forEach(h => hazards.push(Object.assign({ active: false, alertActive: false }, h)));
  }

  // Mengosongkan daftar koin yang tersebar di peta
  koinMaps = [];
  // Memasukkan setiap entri koordinat koin dari data level
  if (mData.koin) {
    mData.koin.forEach(k => koinMaps.push({ x: k.x, y: k.y, collected: false }));
  }

  // Muat Berlian / Diamonds dari mapData
  // Memeriksa dan mengisi array koleksi permata berlian bernilai tinggi dari data level
  if (mData.diamonds) {
    mData.diamonds.forEach(d => diamonds.push({ x: d.x, y: d.y, value: d.val || 5, collected: false, frame: Math.random() * 100 }));
  }

  // Titik Ekstraksi Helipad
  // Inisialisasi objek titik portal evakuasi atau pendaratan helipad untuk menyelesaikan misi
  exitPortal = {
    // Koordinat posisi horizontal pintu keluar evakuasi
    x: mData.exit ? mData.exit.x : 900,
    // Koordinat posisi vertikal pintu keluar evakuasi
    y: mData.exit ? mData.exit.y : 580,
    // Status keaktifan portal, terkunci sebelum semua dokumen intel terkumpul
    active: false,
    // Radius area sensor deteksi ekstraksi
    radius: 36
  };

  // Menghitung jarak jangkauan pandangan senter musuh yang semakin jauh di tingkat kesulitan tinggi
  JARAK_PANDANG = 220 + (currentLevel * 15) + (currentStage * 15);
  // Menyimpan total target dokumen intel yang wajib dikumpulkan untuk membuka jalan keluar
  stats.intelMaks = intels.length;
  // Memperbarui teks ringkasan status misi pada elemen HUD tampilan atas
  updateTeksStatus();
}

// Fungsi pembantu untuk mendeteksi apakah lingkaran (titik tengah x,y dan radius) bersinggungan dengan salah satu dinding
function cekTabrakanTembok(x, y, radius) {
  // Melakukan iterasi ke seluruh objek kotak dinding yang ada di peta
  for (let t of tembok) {
    // Pemeriksaan tabrakan bounding box lingkaran terhadap persegi panjang dinding
    if (x + radius > t.x && x - radius < t.x + t.w && y + radius > t.y && y - radius < t.y + t.h) {
      // Mengembalikan true jika terjadi tumpang tindih fisik
      return true;
    }
  }
  // Mengembalikan false jika tidak ada tabrakan dengan dinding mana pun
  return false;
}

// ANTI-NYANGKUT: Mengeluarkan musuh/boss jika sedikit terperangkap di tepi tembok
// Fungsi ini memisahkan entitas musuh dari dalam blok dinding jika terdorong oleh serangan atau knockback
function bebaskanMusuhDariTembok(m) {
  // Lakukan iterasi sebanyak dua lintasan koreksi posisi
  for (let iter = 0; iter < 2; iter++) {
    // Penanda boolean apakah terjadi tabrakan pada iterasi ini
    let collided = false;
    // Memeriksa setiap blok tembok yang bersinggungan dengan tubuh musuh
    for (let t of tembok) {
      // Uji tumpang tindih batas fisik musuh dengan sisi tembok
      if (m.x + m.radius > t.x && m.x - m.radius < t.x + t.w &&
        m.y + m.radius > t.y && m.y - m.radius < t.y + t.h) {
        collided = true;
        // Hitung jarak penetrasi ke sisi kiri dinding
        let dKiri = (m.x + m.radius) - t.x;
        // Hitung jarak penetrasi ke sisi kanan dinding
        let dKanan = (t.x + t.w) - (m.x - m.radius);
        // Hitung jarak penetrasi ke sisi atas dinding
        let dAtas = (m.y + m.radius) - t.y;
        // Hitung jarak penetrasi ke sisi bawah dinding
        let dBawah = (t.y + t.h) - (m.y - m.radius);
        // Cari sisi penetrasi terdekat/terkecil untuk arah dorongan keluar yang paling minimal
        let minD = Math.min(dKiri, dKanan, dAtas, dBawah);
        // Geser koordinat posisi musuh keluar dari sisi yang bersangkutan
        if (minD === dKiri) m.x = t.x - m.radius - 0.5;
        else if (minD === dKanan) m.x = t.x + t.w + m.radius + 0.5;
        else if (minD === dAtas) m.y = t.y - m.radius - 0.5;
        else if (minD === dBawah) m.y = t.y + t.h + m.radius + 0.5;
      }
    }
    // Jika tidak ada tabrakan yang terdeteksi, hentikan proses koreksi lebih awal
    if (!collided) break;
  }
  // Cegah musuh terdorong ke luar batas arena kanvas
  // Membatasi koordinat X musuh agar tetap berada dalam kanvas
  m.x = Math.max(m.radius + 2, Math.min(canvas.width - m.radius - 2, m.x));
  // Membatasi koordinat Y musuh agar tetap berada dalam kanvas
  m.y = Math.max(m.radius + 2, Math.min(canvas.height - m.radius - 2, m.y));
}

// Fungsi untuk mengecek apakah musuh m dapat melihat pemain berdasarkan jarak, sudut pandang dan halangan dinding
function cekMelihatPemain(m) {
  // Jika pemain sedang bersembunyi di semak atau dalam wujud tak kasat mata (Ghost Walk), pemain tidak bisa dilihat
  if (pemain.isHiding || pemain.ghostActive) return false;
  // Selisih jarak horizontal antara pemain dan musuh
  let jX = pemain.x - m.x;
  // Selisih jarak vertikal antara pemain dan musuh
  let jY = pemain.y - m.y;
  // Jarak garis lurus (hipotenusa) antara musuh dan pemain
  let jTot = Math.hypot(jX, jY);
  // Jika jarak pemain melebihi batas jangkauan jarak pandang senter, musuh tidak bisa melihat
  if (jTot > JARAK_PANDANG) return false;

  // Menghitung sudut arah dari musuh menuju ke arah pemain dalam radian
  let sPemain = Math.atan2(jY, jX);
  // Menghitung selisih sudut hadap senter musuh terhadap posisi pemain
  let selisih = Math.abs(sPemain - m.sudut);
  // Normalisasi perbedaan sudut agar tetap dalam rentang 0 hingga Pi radian
  if (selisih > Math.PI) selisih = 2 * Math.PI - selisih;
  // Jika selisih sudut berada di luar sudut kerucut pandangan, pemain tidak terdeteksi
  if (selisih > LEBAR_PANDANG) return false;

  // Raycast cek rintangan dinding
  // Melakukan uji tembak garis (raycasting) untuk memastikan pandangan tidak terhalang oleh tembok di antaranya
  let hitDist = hitRayWall(m.x, m.y, jX / jTot, jY / jTot, jTot);
  // Mengembalikan true jika jarak benturan raycast menyentuh pemain tanpa terhalang dinding
  return hitDist >= jTot - 5;
}

// Fungsi untuk memicu peringatan suara (kebisingan) di area koordinat (x,y) dalam radius tertentu
function picuSuara(x, y, radius) {
  // Memeriksa respon seluruh musuh di arena
  for (let m of musuh) {
    // Jika jarak sumber suara berada di dalam radius pendengaran musuh
    if (Math.hypot(x - m.x, y - m.y) < radius) {
      // Ubah perilaku AI musuh menjadi menyelidiki lokasi asal suara
      m.status = "investigate";
      // Menentukan koordinat target penyelidikan ke titik sumber suara
      m.targetX = x;
      m.targetY = y;
      // Memberikan durasi waktu waspada penyelidikan selama 180 frame (3 detik)
      m.alertTimer = 180;
      // Mengosongkan rute navigasi lama agar membentuk jalur baru ke arah sumber suara
      m.path = null;
      // Mereset penghitung waktu pathfinding
      m.pathTimer = 0;
    }
  }
}

// SKILLS
// Fungsi untuk mengeksekusi skill tembus pandang / Ghost Walk pemain
function gunakanSkillGhost() {
  // Validasi: game harus dalam kondisi bermain, pemain telah membeli skill, dan skill tidak sedang dalam cooldown
  if (window.gameState !== "playing" || localStorage.getItem('skill_ghost') !== 'true' || pemain.ghostCooldown > 0) return;
  // Mengaktifkan wujud transparan pemain
  pemain.ghostActive = true;
  // Mengatur durasi aktif skill Ghost Walk selama 300 frame (5 detik)
  pemain.ghostTimer = 300;
  // Mengatur waktu cooldown skill Ghost Walk selama 900 frame (15 detik)
  pemain.ghostCooldown = 900;
  // Memainkan efek suara mantra gaib
  mainkanSuara('magic');
  // Memunculkan efek visual gelombang lingkaran berwarna biru muda terang
  tambahVFX(pemain.x, pemain.y, "#00e5ff", "gelombang");
  // Menampilkan teks melayang pemberitahuan aktivasi skill
  munculkanTeks(pemain.x, pemain.y - 25, "GHOST WALK!", "#00e5ff");
}

// Fungsi untuk mengeksekusi skill teleportasi serang instan (Blink Kill) ke musuh terdekat
function gunakanSkillBlink() {
  // Validasi kelayakan eksekusi skill Blink Kill
  if (window.gameState !== "playing" || localStorage.getItem('skill_blink') !== 'true' || pemain.blinkCooldown > 0) return;
  // Variabel penampung objek musuh yang menjadi target terdekat
  let tM = null;
  // Batas jarak pencarian target terdekat (maksimal 600 piksel)
  let jT = 600;
  // Indeks musuh target di dalam array
  let tI = -1;
  // Melakukan iterasi ke setiap musuh untuk mencari target dengan jarak terdekat dari pemain
  for (let i = 0; i < musuh.length; i++) {
    let j = Math.hypot(pemain.x - musuh[i].x, pemain.y - musuh[i].y);
    if (j < jT) {
      jT = j;
      tM = musuh[i];
      tI = i;
    }
  }
  // Jika target musuh ditemukan dalam jangkauan teleportasi
  if (tM) {
    // Mengubah state gerak pemain menjadi dash
    pemain.state = 'dash';
    // Menetapkan durasi timer aksi serangan instan
    pemain.actionTimer = 15;
    // Menambahkan efek visual ledakan partikel di titik awal teleportasi
    tambahVFX(pemain.x, pemain.y, "#e74c3c", "ledakan");
    // Memindahkan koordinat posisi pemain langsung ke lokasi musuh secara instan
    pemain.x = tM.x;
    pemain.y = tM.y;
    // Mendaftarkan efek visual tebasan pedang kilat di koordinat tujuan
    slashes.push({ x: pemain.x, y: pemain.y, sudut: 0, frame: 0 });
    // Menambahkan efek partikel merah di titik kemunculan teleportasi
    tambahVFX(pemain.x, pemain.y, "#e74c3c", "ledakan");

    // Blood decal
    // Meninggalkan bercak darah permanen di lantai lokasi serangan
    kotoran.push({ x: tM.x, y: tM.y, r: tM.tipe === "boss" ? 14 : 9, isBlood: true, a: 0.8 });

    // Mengurangi darah musuh target sebanyak 2 poin kerusakan
    tM.hp -= 2;
    // Jika darah musuh target telah habis
    if (tM.hp <= 0) {
      // Menjatuhkan koin hasil rampasan di lokasi tewasnya musuh
      koinMaps.push({ x: tM.x, y: tM.y, collected: false, drop: true });
      // Menjatuhkan item pemulih darah (HP)
      dropRegenItem(tM.x, tM.y);
      // Menghapus musuh dari array daftar musuh aktif
      musuh.splice(tI, 1);
      // Menambah catatan total musuh yang dihabisi
      stats.killCount++;
      // Menampilkan teks melayang notifikasi Blink Kill
      munculkanTeks(pemain.x, pemain.y - 20, Teks.blinkKill, "#e74c3c");
    } else {
      // Jika musuh bertahan, berikan efek pingsan/stun sejenak
      tM.stunTimer = 25;
      // Menampilkan teks sisa HP musuh
      munculkanTeks(tM.x, tM.y - 15, `-2 HP (${tM.hp}/${tM.maxHp})`, "#e74c3c");
    }
    // Mengatur waktu cooldown skill Blink selama 600 frame (10 detik)
    pemain.blinkCooldown = 600;
    // Mengguncang layar kanvas sebagai efek hantaman kuat
    getarLayar = 15;
    // Memainkan efek audio tebasan pedang
    mainkanSuara('slash');
  }
}

// Fungsi untuk mengeksekusi skill penghenti waktu / Time Freeze
function gunakanSkillTime() {
  // Validasi kelayakan pemanggilan skill Time Freeze
  if (window.gameState !== "playing" || localStorage.getItem('skill_time') !== 'true' || pemain.timeCooldown > 0) return;
  // Mengaktifkan status perlambatan waktu dunia
  pemain.timeActive = true;
  // Mengatur durasi waktu beku selama 240 frame (4 detik)
  pemain.timeTimer = 240;
  // Mengatur waktu cooldown selama 1200 frame (20 detik)
  pemain.timeCooldown = 1200;
  // Memainkan efek suara sihir
  mainkanSuara('magic');
  // Memunculkan teks pengumuman pembekuan waktu
  munculkanTeks(pemain.x, pemain.y - 20, Teks.timeFreeze, "#9b59b6");
  // Memunculkan efek visual gelombang berwarna ungu
  tambahVFX(pemain.x, pemain.y, "#9b59b6", "gelombang");
}

// Fungsi untuk mengeksekusi skill bayangan pengalih perhatian / Shadow Clone
function gunakanSkillClone() {
  // Validasi ketersediaan dan status cooldown skill Shadow Clone
  if (window.gameState !== "playing" || localStorage.getItem('skill_clone') !== 'true' || pemain.cloneCooldown > 0) return;
  // Mengaktifkan status clone bayangan
  pemain.cloneActive = true;
  // Durasi bertahannya umpan clone bayangan selama 300 frame (5 detik)
  pemain.cloneTimer = 300;
  // Cooldown skill bayangan selama 1200 frame (20 detik)
  pemain.cloneCooldown = 1200;
  // Menempatkan titik umpan clone persis di koordinat pemain saat ini
  pemain.cloneX = pemain.x;
  pemain.cloneY = pemain.y;
  // Memainkan efek suara mantra
  mainkanSuara('magic');
  // Memunculkan teks notifikasi munculnya clone bayangan
  munculkanTeks(pemain.x, pemain.y - 20, Teks.shadowClone, "#2ecc71");
  // Memunculkan efek visual partikel ledakan hijau
  tambahVFX(pemain.x, pemain.y, "#2ecc71", "ledakan");
}

// Fungsi untuk mengeksekusi skill serangan badai tebasan beruntun (Rapid Slashes)
function gunakanSkillRapidSlash() {
  // Validasi: game harus dalam kondisi bermain aktif
  if (window.gameState !== "playing") return;
  // Memeriksa jika skill masih dalam status cooldown
  if (pemain.rapidCooldown > 0) {
    let sisa = (pemain.rapidCooldown / 60).toFixed(1);
    munculkanTeks(pemain.x, pemain.y - 20, `RAPID CD (${sisa}s)`, "#f59e0b");
    mainkanSuara('block');
    return;
  }
  // Cek kepemilikan skill di storage (default true agar langsung aktif atau via toko)
  if (localStorage.getItem('skill_rapid') === 'false') return;

  // Mengubah status animasi karakter menjadi serang
  pemain.state = 'serang';
  // Mengatur durasi waktu pose animasi serang
  pemain.actionTimer = 120;
  // Mengaktifkan status eksekusi Rapid Slash
  pemain.rapidActive = true;
  pemain.rapidTimer = 120; // 2 Detik (120 frame pada 60fps)
  pemain.rapidCooldown = 900; // 15 Detik Cooldown
  // Mereset penghitung jumlah tebasan utama yang masuk
  pemain.rapidHitDone = 0;
  // Memainkan suara tebasan pedang
  mainkanSuara('slash');
  // Memainkan efek nada sintetis tebasan tajam
  playTone('sawtooth', 320, 750, 0.25, 0.35);
  // Menampilkan teks melayang jurus Rapid Slashes
  munculkanTeks(pemain.x, pemain.y - 25, "🌪️ RAPID SLASHES! (-3 BAR HP)", "#f59e0b");
  // Menampilkan efek visual gelombang energi berwarna kuning keemasan
  tambahVFX(pemain.x, pemain.y, "#f59e0b", "gelombang");
  // Mengguncang kanvas layar permainan
  getarLayar = 15;
}

// Fungsi untuk melempar senjata rahasia shuriken ke arah hadap pemain
function lemparShuriken() {
  // Validasi: game sedang berjalan dan persediaan amunisi shuriken masih ada
  if (window.gameState !== "playing" || pemain.ammo <= 0) return;
  // Mengurangi satu butir amunisi shuriken pemain
  pemain.ammo--;
  // Mengubah state animasi menjadi menyerang melempar
  pemain.state = 'serang';
  // Durasi jeda animasi lemparan shuriken
  pemain.actionTimer = 12;
  // Mendaftarkan proyektil shuriken baru ke dalam array
  shurikens.push({
    // Titik awal posisi horizontal proyektil
    x: pemain.x,
    // Titik awal posisi vertikal proyektil
    y: pemain.y,
    // Kecepatan laju horizontal shuriken sesuai sudut hadap pemain
    dx: Math.cos(pemain.sudut) * 13,
    // Kecepatan laju vertikal shuriken sesuai sudut hadap pemain
    dy: Math.sin(pemain.sudut) * 13,
    // Sudut rotasi putaran visual shuriken saat terbang
    rot: 0
  });
  // Memainkan efek suara desingan shuriken
  mainkanSuara('shuriken');
}

// UPDATE LOGIC
// Fungsi inti siklus logika pembaruan permainan (game loop physics & logic update)
function update() {
  // Menghentikan kalkulasi jika game tidak sedang dalam status bermain aktif
  if (window.gameState !== "playing") return;
  // Menambah penghitung frame global setiap siklus logika
  frameCount++;
  // Mengurangi timer getaran layar jika masih aktif
  if (getarLayar > 0) getarLayar--;
  // Mengurangi jeda hitung mundur alarm CCTV
  if (cctvAlarmTimer > 0) cctvAlarmTimer--;
  // Mengurangi waktu tunggu pemutaran suara alarm agar tidak berisik
  if (alertSoundCooldown > 0) alertSoundCooldown--;

  // Update Teks Melayang
  // Mengiterasi dan memperbarui setiap entri teks efek melayang dari indeks belakang
  for (let i = teksMelayang.length - 1; i >= 0; i--) {
    let tm = teksMelayang[i];
    // Menggerakkan teks naik ke atas secara vertikal
    tm.y += tm.vy;
    // Mengurangi transparansi (alpha) teks melayang secara bertahap
    tm.a -= 0.018;
    // Menghapus objek teks jika sudah memudar sepenuhnya (alpha <= 0)
    if (tm.a <= 0) teksMelayang.splice(i, 1);
  }

  // Update Shurikens 
  // Mengiterasi dan memperbarui pergerakan serta tabrakan proyektil shuriken
  for (let i = shurikens.length - 1; i >= 0; i--) {
    let s = shurikens[i];
    // Memperbarui posisi koordinat horizontal shuriken
    s.x += s.dx;
    // Memperbarui posisi koordinat vertikal shuriken
    s.y += s.dy;
    // Menambah sudut rotasi visual shuriken
    s.rot += 0.5;

    // Memeriksa tabrakan shuriken dengan dinding/tembok
    if (cekTabrakanTembok(s.x, s.y, 5)) {
      // Memunculkan efek suara denting benturan pada radius 180 piksel
      picuSuara(s.x, s.y, 180);
      // Memunculkan percikan partikel benturan pada tembok
      tambahVFX(s.x, s.y, s.isEnemy ? "#ef4444" : "#bdc3c7", "partikel");
      // Menghapus shuriken dari arena
      shurikens.splice(i, 1);
      continue;
    }

    // Jika Shuriken Musuh (Rival Assassin) Menyerang Pemain
    if (s.isEnemy) {
      // Memeriksa tabrakan shuriken musuh dengan tubuh pemain jika pemain tidak kebal atau tidak bersembunyi
      if (Math.hypot(s.x - pemain.x, s.y - pemain.y) < pemain.radius + 6 && !pemain.ghostActive && !pemain.isHiding) {
        // Pemain hanya menerima kerusakan jika masa kekebalan sementara (invincibleTimer) telah habis
        if (pemain.invincibleTimer <= 0) {
          // Mengurangi darah pemain sebanyak 2 poin kerusakan
          pemain.hp -= 2;
          // Memberikan masa kebal sementara selama 45 frame
          pemain.invincibleTimer = 45;
          // Menggetarkan layar kanvas
          getarLayar = 12;
          // Menampilkan teks melayang pengurangan HP pemain akibat kunai lawan
          munculkanTeks(pemain.x, pemain.y - 20, "-2 HP (KUNAI RIVAL)", "#ef4444");
          // Memainkan nada hantaman rasa sakit
          playTone('sawtooth', 180, 80, 0.2, 0.35);
          // Memperbarui indikator darah pada UI
          updateHpUI();
          // Menambahkan efek visual percikan darah
          tambahVFX(pemain.x, pemain.y, "#ef4444", "ledakan");
          // Memeriksa kondisi jika darah pemain telah habis
          if (pemain.hp <= 0) {
            pemain.hp = 0;
            updateHpUI();
            // Menetapkan status permainan kalah (game over)
            window.gameState = "lose";
            mainkanSuara('lose');
          }
        }
        // Menghapus proyektil shuriken musuh setelah mengenai sasaran
        shurikens.splice(i, 1);
      }
      continue;
    }

    // Variabel penanda apakah shuriken mengenai musuh
    let hit = false;
    // Menguji tabrakan shuriken pemain terhadap seluruh daftar musuh
    for (let j = 0; j < musuh.length; j++) {
      let mTarget = musuh[j];
      // Jika jarak shuriken dan pusat musuh kurang dari radius tubuh ditambah margin
      if (Math.hypot(s.x - mTarget.x, s.y - mTarget.y) < mTarget.radius + 6) {
        // Logika penangkisan shuriken oleh perisai depan musuh tipe Juggernaut
        if (mTarget.tipe === "juggernaut") {
          let sP = Math.abs(Math.atan2(s.y - mTarget.y, s.x - mTarget.x) - mTarget.sudut);
          if (sP > Math.PI) sP = 2 * Math.PI - sP;
          // Jika shuriken datang dari arah depan perisai Juggernaut (< 90 derajat)
          if (sP < Math.PI / 2) {
            munculkanTeks(mTarget.x, mTarget.y, Teks.blocked, "#94a3b8");
            mainkanSuara('block');
            getarLayar = 8;
            shurikens.splice(i, 1);
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
          shurikens.splice(i, 1);
          hit = true;
          break;
        }

        // Mengurangi 1 HP musuh yang terkena shuriken
        mTarget.hp--;
        // Memberikan efek stun sejenak selama 16 frame
        mTarget.stunTimer = 16;
        // Efek dorongan mundur (knockback) pada musuh
        let kx = (s.dx > 0 ? 1 : -1) * 20;
        let ky = (s.dy > 0 ? 1 : -1) * 20;
        if (!cekTabrakanTembok(mTarget.x + kx, mTarget.y, mTarget.radius)) mTarget.x += kx;
        if (!cekTabrakanTembok(mTarget.x, mTarget.y + ky, mTarget.radius)) mTarget.y += ky;
        bebaskanMusuhDariTembok(mTarget);

        // Jika darah musuh habis akibat tembakan shuriken
        if (mTarget.hp <= 0) {
          // Menambahkan noda darah di lantai
          kotoran.push({ x: mTarget.x, y: mTarget.y, r: mTarget.tipe === "boss" ? 14 : 8, isBlood: true, a: 0.8 });
          // Menjatuhkan koin di posisi musuh mati
          koinMaps.push({ x: mTarget.x, y: mTarget.y, collected: false, drop: true });
          // Menjatuhkan item pemulihan darah
          dropRegenItem(mTarget.x, mTarget.y);
          let tipeMati = mTarget.tipe;
          // Menghapus musuh dari permainan
          musuh.splice(j, 1);
          // Menambah skor total kill
          stats.killCount++;
          // Menampilkan teks pengumuman eliminasi musuh
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
          // Jika musuh masih bertahan hidup
          mainkanSuara('block');
          munculkanTeks(mTarget.x, mTarget.y - 12, `-1 HP (${mTarget.hp}/${mTarget.maxHp})`, "gold");
          tambahVFX(mTarget.x, mTarget.y, mTarget.warnaBase, "ledakan");
        }
        // Menghapus proyektil shuriken setelah mengenai musuh
        shurikens.splice(i, 1);
        hit = true;
        break;
      }
    }
  }
  // Update Peluru Musuh (Enemy Tracer Bullets - Hunter Assassin Mechanics)
  // Mengiterasi dan memperbarui posisi seluruh peluru yang ditembakkan musuh
  for (let bIdx = enemyBullets.length - 1; bIdx >= 0; bIdx--) {
    let eb = enemyBullets[bIdx];
    // Memperbarui posisi koordinat horizontal peluru
    eb.x += eb.vx;
    // Memperbarui posisi koordinat vertikal peluru
    eb.y += eb.vy;
    // Mengurangi masa aktif hidup (lifespan) peluru
    eb.life--;

    // Tabrakan Peluru ke Tembok (Percikan Sparks)
    if (cekTabrakanTembok(eb.x, eb.y, 4)) {
      tambahVFX(eb.x, eb.y, "#facc15", "partikel");
      enemyBullets.splice(bIdx, 1);
      continue;
    }

    // Tabrakan Peluru ke Pemain (Kena Tembak)
    let bulletHitR = pemain.radius + (eb.isBoss ? 7 : 4);
    if (!pemain.ghostActive && !pemain.isHiding && Math.hypot(eb.x - pemain.x, eb.y - pemain.y) < bulletHitR) {
      if (pemain.invincibleTimer <= 0) {
        let dmg = eb.damage !== undefined ? eb.damage : (eb.isBoss ? 6 : 2);
        pemain.hp -= dmg;
        pemain.invincibleTimer = eb.isBoss ? 45 : 35;
        getarLayar = eb.isBoss ? 25 : 12;
        let popText = eb.isBoss ? `-${dmg} HP (BOSS CANNON!)` : `-${dmg} HP (SHOT)`;
        munculkanTeks(pemain.x, pemain.y - 20, popText, "#ef4444");
        playTone('sawtooth', eb.isBoss ? 160 : 200, 60, 0.22, 0.45);
        updateHpUI();
        tambahVFX(pemain.x, pemain.y, eb.isBoss ? "#ef4444" : "#f59e0b", "ledakan");
        if (pemain.hp <= 0) {
          pemain.hp = 0;
          updateHpUI();
          window.gameState = "lose";
          mainkanSuara('lose');
        }
      }
      enemyBullets.splice(bIdx, 1);
      continue;
    }

    // Menghapus peluru yang masa hidupnya telah habis di udara
    if (eb.life <= 0) {
      enemyBullets.splice(bIdx, 1);
    }
  }


  // Update Timers & Cooldowns
  // Mengurangi durasi timer aksi pose animasi pemain jika sedang aktif
  if (pemain.actionTimer > 0) pemain.actionTimer--;
  // Mengurangi durasi kekebalan sementara pemain
  if (pemain.invincibleTimer > 0) pemain.invincibleTimer--;
  // Memperbarui timer durasi wujud tak kasat mata Ghost Walk
  if (pemain.ghostTimer > 0) {
    pemain.ghostTimer--;
    if (pemain.ghostTimer <= 0) pemain.ghostActive = false;
  }
  // Memperbarui cooldown skill Ghost Walk
  if (pemain.ghostCooldown > 0) pemain.ghostCooldown--;
  // Memperbarui cooldown skill Blink Kill
  if (pemain.blinkCooldown > 0) pemain.blinkCooldown--;
  // Memperbarui durasi penghentian waktu Time Freeze
  if (pemain.timeTimer > 0) {
    pemain.timeTimer--;
    if (pemain.timeTimer <= 0) pemain.timeActive = false;
  }
  // Memperbarui cooldown skill Time Freeze
  if (pemain.timeCooldown > 0) pemain.timeCooldown--;
  // Memperbarui durasi hidup clone bayangan pemain
  if (pemain.cloneTimer > 0) {
    pemain.cloneTimer--;
    if (pemain.cloneTimer <= 0) pemain.cloneActive = false;
  }
  // Memperbarui cooldown skill Shadow Clone
  if (pemain.cloneCooldown > 0) pemain.cloneCooldown--;

  // Update Slash Limiter (2x tebas, cooldown 2 detik)
  // Menghitung mundur masa tunggu tebasan pedang jika kuota tebasan habis
  if (pemain.slashCooldown > 0) {
    pemain.slashCooldown--;
    if (pemain.slashCooldown <= 0) {
      pemain.slashCharges = 2;
    }
  // Menghitung mundur timer reset kuota tebasan jika pemain berhenti menyerang
  } else if (pemain.slashResetTimer > 0) {
    pemain.slashResetTimer--;
    if (pemain.slashResetTimer <= 0) {
      pemain.slashCharges = 2;
    }
  }

  // Update Skill Baru: Tebasan Pedang Sangat Cepat & Bertubi-tubi (2 Detik, Mengurangi 3 Bar HP)
  // Memperbarui eksekusi jurus Rapid Slashes selama durasi 2 detik
  if (pemain.rapidActive && pemain.rapidTimer > 0) {
    pemain.rapidTimer--;

    // Efek flurry slashes & audio setiap 6 frame
    if (pemain.rapidTimer % 6 === 0) {
      let randA = pemain.sudut + (Math.random() - 0.5) * 1.6;
      slashes.push({
        x: pemain.x + Math.cos(randA) * (20 + Math.random() * 20),
        y: pemain.y + Math.sin(randA) * (20 + Math.random() * 20),
        sudut: randA,
        frame: 0
      });
      playTone('sawtooth', 380 + Math.random() * 260, 180, 0.08, 0.18);
      getarLayar = Math.max(getarLayar, 5);
      tambahVFX(pemain.x + Math.cos(randA) * 22, pemain.y + Math.sin(randA) * 22, "#f59e0b", "partikel");
    }

    // Menambahkan efek jejak bayangan pemain selama melancarkan badai tebasan
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

          // Mengurangi 1 bar darah musuh pada setiap hantaman utama
          m.hp--;
          m.stunTimer = 18;
          tambahVFX(m.x, m.y, "#f59e0b", "ledakan");
          munculkanTeks(m.x, m.y - 15, `-1 BAR HP [Hit ${pemain.rapidHitDone}/3]`, "#f59e0b");
          getarLayar = 12;

          // Memeriksa kematian musuh akibat tebasan beruntun
          if (m.hp <= 0) {
            kotoran.push({ x: m.x, y: m.y, r: (m.tipe === "boss" || m.tipe === "rival") ? 14 : 9, isBlood: true, a: 0.8 });
            koinMaps.push({ x: m.x, y: m.y, collected: false, drop: true });
            dropRegenItem(m.x, m.y);
            let tipeMati = m.tipe;
            musuh.splice(mIdx, 1);
            stats.killCount++;
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

    // Mengakhiri status Rapid Slash jika timer habis
    if (pemain.rapidTimer <= 0) {
      pemain.rapidActive = false;
    }
  }
  // Menghitung mundur cooldown skill Rapid Slash
  if (pemain.rapidCooldown > 0) pemain.rapidCooldown--;

  // Faktor pengali kecepatan dunia: melambat drastis menjadi 0.2 jika Time Freeze aktif
  let speedMultiplier = pemain.timeActive ? 0.2 : 1;

  // Cek Tempat Sembunyi
  // Memeriksa apakah posisi pemain berada di dalam salah satu kotak semak/tempat sembunyi
  pemain.isHiding = false;
  for (let s of sembunyi) {
    if (pemain.x > s.x && pemain.x < s.x + s.w && pemain.y > s.y && pemain.y < s.y + s.h) {
      pemain.isHiding = true;
    }
  }

  // Cek Hazards: Trap Duri Lantai
  // Memeriksa siklus aktif jebakan duri di lantai
  for (let h of hazards) {
    if (h.tipe === "trap") {
      // Jebakan berganti status aktif/non-aktif setiap 90 frame
      h.active = Math.floor(frameCount / 90) % 2 === 0;
      // Memberikan sinyal visual peringatan sesaat sebelum jebakan muncul
      h.telegraph = (!h.active && (frameCount % 90 > 70));
      // Memeriksa jika pemain menginjak jebakan saat duri sedang aktif menyembul
      if (h.active && !pemain.ghostActive && Math.hypot(pemain.x - (h.x + h.w / 2), pemain.y - (h.y + h.h / 2)) < pemain.radius + h.w / 2 - 6) {
        if (pemain.invincibleTimer <= 0) {
          // Kerusakan berat akibat jebakan duri
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
  // Menentukan kecepatan gerak dasar pemain
  let currentSpeed = pemain.kecepatanNormal;
  pemain.noiseR = 0;
  // Memeriksa apakah pemain menekan tombol navigasi gerak WASD
  let isMovingInput = keys.w || keys.s || keys.a || keys.d;

  // Logika dash lari cepat menggunakan tombol Shift dan energi stamina
  if (keys.shift && pemain.energiDash > 0 && isMovingInput) {
    if (!isDashing) {
      mainkanSuara('dash');
      isDashing = true;
    }
    // Meningkatkan kecepatan gerak ke batas kecepatan dash
    currentSpeed = pemain.kecepatanDash;
    // Mengurangi bar stamina energi dash
    pemain.energiDash -= 2.2;
    // Menghasilkan suara derap langkah kaki keras yang memicu pendengaran musuh
    pemain.noiseR = 150;
    picuSuara(pemain.x, pemain.y, pemain.noiseR);
  } else {
    isDashing = false;
    // Pemulihan stamina energi dash secara perlahan saat tidak melakukan sprint
    if (pemain.energiDash < 100) pemain.energiDash += 0.65;
  }

  // Memudarkan transparansi jejak bayangan pemain
  pemain.trail.forEach(t => t.alpha -= 0.05);
  // Menyaring dan mempertahankan jejak bayangan yang masih memiliki transparansi
  pemain.trail = pemain.trail.filter(t => t.alpha > 0);
  // Menambah frame animasi tebasan pedang
  slashes.forEach(s => s.frame++);
  // Menghapus efek tebasan yang telah selesai diputar
  slashes = slashes.filter(s => s.frame < 15);

  // Menghitung vektor arah masukan tombol keyboard
  let inputX = 0, inputY = 0;
  if (keys.w) inputY -= 1;
  if (keys.s) inputY += 1;
  if (keys.a) inputX -= 1;
  if (keys.d) inputX += 1;

  // Normalisasi gerakan diagonal
  // Menjaga agar kecepatan diagonal tidak lebih cepat daripada kecepatan lurus
  if (inputX !== 0 && inputY !== 0) {
    inputX *= 0.7071;
    inputY *= 0.7071;
  }

  // Menentukan target kecepatan horizontal dan vertikal
  let targetVx = inputX * currentSpeed;
  let targetVy = inputY * currentSpeed;

  // Smooth Acceleration & Deceleration (Mencegah Gerakan Kaku)
  // Tingkat interpolasi linear (lerp) akselerasi dan deselerasi
  let lerpRate = isDashing ? 0.38 : 0.28;
  pemain.vx = (pemain.vx || 0) + (targetVx - (pemain.vx || 0)) * lerpRate;
  pemain.vy = (pemain.vy || 0) + (targetVy - (pemain.vy || 0)) * lerpRate;
  // Menghilangkan desimal kecil kecepatan saat berhenti total
  if (Math.abs(pemain.vx) < 0.04) pemain.vx = 0;
  if (Math.abs(pemain.vy) < 0.04) pemain.vy = 0;

  // Menghitung magnitudo total kecepatan gerak aktif pemain
  let speedMoving = Math.hypot(pemain.vx, pemain.vy);
  let isMoving = speedMoving > 0.25;

  // Pembaruan arah hadap dan sudut rotasi visual karakter
  if (isMoving) {
    let targetAngle = Math.atan2(pemain.vy, pemain.vx);
    pemain.sudut = targetAngle;
    if (pemain.visualSudut === undefined) pemain.visualSudut = targetAngle;
    // Rotasi 8-arah & 360 derajat sangat mulus dan tidak kaku
    pemain.visualSudut = lerpAngle(pemain.visualSudut, targetAngle, isDashing ? 0.38 : 0.26);

    // Tentukan penamaan 8 arah
    // Mengonversi sudut hadap radian ke derajat untuk menentukan sektor 8-arah mata angin
    let deg = ((targetAngle * 180 / Math.PI) + 360) % 360;
    if (deg >= 337.5 || deg < 22.5) pemain.arah = 'kanan';
    else if (deg >= 22.5 && deg < 67.5) pemain.arah = 'bawah_kanan';
    else if (deg >= 67.5 && deg < 112.5) pemain.arah = 'bawah';
    else if (deg >= 112.5 && deg < 157.5) pemain.arah = 'bawah_kiri';
    else if (deg >= 157.5 && deg < 202.5) pemain.arah = 'kiri';
    else if (deg >= 202.5 && deg < 247.5) pemain.arah = 'atas_kiri';
    else if (deg >= 247.5 && deg < 292.5) pemain.arah = 'atas';
    else pemain.arah = 'atas_kanan';

    // Akumulasi jarak tempuh langkah untuk penentuan siklus frame animasi berjalan
    pemain.walkDistance = (pemain.walkDistance || 0) + speedMoving;
  }

  // Tilt/Lean dinamis untuk postur tubuh lincah
  // Memberikan efek kemiringan tubuh saat bergerak menyamping
  if (isMoving) {
    let leanTarget = (pemain.arah === 'kiri' ? -0.1 : (pemain.arah === 'kanan' ? 0.1 : 0));
    pemain.leanAngle = (pemain.leanAngle || 0) + (leanTarget - (pemain.leanAngle || 0)) * 0.18;
  } else {
    pemain.leanAngle = (pemain.leanAngle || 0) * 0.8;
  }

  // 2. STATE MACHINE (MESIN STATUS & ANIMASI LENGKAP)
  // Menentukan status animasi karakter (serang, dash, jalan, atau diam)
  if (pemain.actionTimer > 0 || (pemain.rapidActive && pemain.rapidTimer > 0)) {
    pemain.state = 'serang';
    if (pemain.rapidActive) {
      pemain.animFrame = Math.floor(frameCount / 4) % 3;
    } else {
      let maxT = pemain.actionMaxTimer || 18;
      let p = 1 - (pemain.actionTimer / maxT);
      pemain.animFrame = p < 0.28 ? 0 : (p < 0.72 ? 1 : 2);
    }
  } else if (isDashing && isMoving) {
    pemain.state = 'dash';
    pemain.animFrame = Math.floor(frameCount / 4) % 4;
    // Merekam jejak bayangan halus (afterimage shadow) saat dash
    if (frameCount % 3 === 0) {
      let bKey = mapBajuWarna[playerColor] || 'navy';
      let sheetImg = assets.spritesheets[bKey] || assets.spritesheets.navy;
      let sData = SPRITE_SHEET_DATA[bKey] || SPRITE_SHEET_DATA['navy'];
      let sRect = (sData.walk && sData.walk[3]) ? sData.walk[3] : sData.idle;
      pemain.trail.push({
        x: pemain.x,
        y: pemain.y,
        sudut: pemain.visualSudut !== undefined ? pemain.visualSudut : pemain.sudut,
        alpha: 0.45,
        sRect: sRect,
        sheetImg: sheetImg
      });
      if (pemain.trail.length > 5) pemain.trail.shift();
    }
  } else if (isMoving) {
    pemain.state = 'jalan';
    pemain.animFrame = Math.floor(pemain.walkDistance / 14) % 8;
  } else {
    pemain.state = 'diam';
    pemain.animFrame = 0;
  }

  // Sliding Tembok Halus Tanpa Nyangkut
  // Menerapkan perpindahan sumbu X dan mengoreksi jika menabrak dinding
  pemain.x += pemain.vx;
  if (cekTabrakanTembok(pemain.x, pemain.y, pemain.radius)) {
    pemain.x -= pemain.vx;
    pemain.vx = 0;
  }
  // Menerapkan perpindahan sumbu Y dan mengoreksi jika menabrak dinding
  pemain.y += pemain.vy;
  if (cekTabrakanTembok(pemain.x, pemain.y, pemain.radius)) {
    pemain.y -= pemain.vy;
    pemain.vy = 0;
  }

  // Ambil Koin
  // Memeriksa pemungutan koin yang ada di arena oleh pemain
  for (let k of koinMaps) {
    if (!k.collected && Math.hypot(pemain.x - k.x, pemain.y - k.y) < 25) {
      k.collected = true;
      // Menambah pundi koin perolehan di arena sebanyak 50 koin
      stats.koinDiArena += 50;
      munculkanTeks(k.x, k.y, "+50 Koin", "#f1c40f");
      mainkanSuara('coin');
      tambahVFX(k.x, k.y, "#f1c40f", "partikel");
    }
  }

  // Ambil Regen Item (Penambah Darah)
  // Memeriksa pemungutan item kotak obat penambah HP
  for (let i = regenItems.length - 1; i >= 0; i--) {
    let r = regenItems[i];
    r.frame = (r.frame || 0) + 0.06;
    if (!r.collected && Math.hypot(pemain.x - r.x, pemain.y - r.y) < pemain.radius + 15) {
      r.collected = true;
      let healAmt = 3;
      // Memulihkan darah pemain tanpa melampaui batas maxHp
      pemain.hp = Math.min(pemain.maxHp, pemain.hp + healAmt);
      updateHpUI();
      munculkanTeks(pemain.x, pemain.y - 25, `+${healAmt} HP ❤️`, "#22c55e");
      playTone('sine', 523, 784, 0.22, 0.35); // Arpeggio pleasant heal sound
      tambahVFX(r.x, r.y, "#22c55e", "ledakan");
      regenItems.splice(i, 1);
    }
  }
  // Ambil Berlian (Diamonds - Hunter Assassin Currency)
  // Memeriksa pengambilan permata berlian oleh pemain
  for (let i = diamonds.length - 1; i >= 0; i--) {
    let d = diamonds[i];
    if (!d.collected && Math.hypot(pemain.x - d.x, pemain.y - d.y) < pemain.radius + 18) {
      d.collected = true;
      let val = d.value || 5;
      // Menambahkan jumlah berlian ke statistik pemain
      stats.diamonds = (stats.diamonds || 0) + val;
      // Menyimpan perolehan berlian ke penyimpanan lokal
      localStorage.setItem('ninjaDiamonds', stats.diamonds);
      munculkanTeks(d.x, d.y - 20, `+💎 ${val}`, "#00e5ff");
      playTone('sine', 1046, 1318, 0.18, 0.35, false);
      tambahVFX(d.x, d.y, "#00e5ff", "partikel");
      diamonds.splice(i, 1);
    }
  }


  // Hazards: CCTV, Daun Kering, Laser
  // Memperbarui bahaya lingkungan interaktif di peta
  for (let h of hazards) {
    // Bahaya kamera pengawas CCTV dengan lampu sorot berputar
    if (h.tipe === "cctv") {
      // Mengayunkan sudut sorot CCTV secara osilasi bolak-balik
      h.sudut = h.sBase + Math.sin(frameCount / 40) * h.sw;
      // Memeriksa apakah sorot CCTV mendeteksi keberadaan pemain
      let cctvSees = cekMelihatPemain({ x: h.x, y: h.y, sudut: h.sudut });
      h.alertActive = cctvSees;
      if (cctvSees) {
        if (cctvAlarmTimer <= 0) {
          mainkanSuara('alarm');
          munculkanTeks(h.x, h.y - 15, Teks.cctvAlert, "red");
          cctvAlarmTimer = 40;
        }
        // Memerintahkan seluruh musuh untuk menyelidiki posisi pemain yang terpantau CCTV
        for (let m of musuh) {
          m.status = "investigate";
          m.targetX = pemain.x;
          m.targetY = pemain.y;
          m.alertTimer = 240;
          m.path = null;
          m.pathTimer = 0;
        }
      }
    // Bahaya tumpukan daun kering yang bergemerisik jika terinjak
    } else if (h.tipe === "daun") {
      if (Math.hypot(pemain.x - h.x, pemain.y - h.y) < h.r) {
        picuSuara(h.x, h.y, 300);
      }
    // Bahaya pagar laser berkedip periodik
    } else if (h.tipe === "laser") {
      h.active = Math.floor(frameCount / 120) % 2 === 0;
      h.warning = (!h.active && (frameCount % 120 > 95));
      // Memeriksa jika pemain melintasi sinar laser yang sedang aktif
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

  // Ambil Intel (Dokumen Rahasia)
  // Menghitung perolehan berkas dokumen intelijen rahasia
  let intelTerkumpul = 5;
  for (let i of intels) {
    if (!i.collected) {
      if (Math.hypot(pemain.x - i.x, pemain.y - i.y) < 30) {
        i.collected = true;
        // Mencatat misi harian pengambilan dokumen intel
        recordDailyStat('daily_intel', 1);
        updateTeksStatus();
        mainkanSuara('coin');
        munculkanTeks(i.x, i.y - 15, "INTEL +1", "#00e5ff");
        tambahVFX(i.x, i.y, "#00e5ff", "partikel");
      }
    } else {
      intelTerkumpul++;
    }
  }

  // Cek Status Misi & Titik Ekstraksi (Hunter Assassin Extraction Portal)
  // OBJEKTIF UTAMA WAJIB: Harus mengambil SEMUA dokumen intel yang ada di level agar portal terbuka!
  let totalDokumen = intels ? intels.length : 0;
  let sisaDokumen = intels ? intels.filter(i => !i.collected).length : 0;
  let allIntelCollected = (totalDokumen > 0) ? (sisaDokumen === 0) : true;

  // Membuka portal ekstraksi helipad saat semua dokumen berhasil dikumpulkan
  if (allIntelCollected && !exitPortal.active) {
    exitPortal.active = true;
    munculkanTeks(canvas.width / 2, canvas.height / 2 - 25, "📂 SEMUA DOKUMEN BERHASIL DIAMBIL!", "#22c55e");
    munculkanTeks(canvas.width / 2, canvas.height / 2 + 5, "PORTAL TERBUKA ➔ SEGERA KABUR!", "#00e5ff");
    playTone('sine', 587, 880, 0.4, 0.4);
  }

  // Jika pemain menginjak titik portal padahal dokumen belum lengkap, tolak dan beri peringatan
  if (!exitPortal.active && Math.hypot(pemain.x - exitPortal.x, pemain.y - exitPortal.y) < exitPortal.radius + 18) {
    if (frameCount % 45 === 0) {
      munculkanTeks(exitPortal.x, exitPortal.y - 25, `🔒 AMBIL SEMUA DOKUMEN! (SISA ${sisaDokumen})`, "#ef4444");
      playTone('square', 140, 110, 0.15, 0.2, false);
    }
  }

  // Eksekusi kemenangan misi saat pemain mencapai portal ekstraksi yang aktif
  if (exitPortal.active && Math.hypot(pemain.x - exitPortal.x, pemain.y - exitPortal.y) < exitPortal.radius + 14 && window.gameState !== "win") {
    window.gameState = "win";
    recordDailyStat('daily_stages', 1);
    mainkanSuara('win');

    // Kalkulasi Rating 3 Bintang (⭐⭐⭐ Hunter Assassin System)
    let starsEarned = 3;
    if ((stats.alarmsTriggered || 0) > 2) starsEarned = 1;
    else if ((stats.alarmsTriggered || 0) > 0) starsEarned = 2;

    let starKey = 'stars_' + currentLevel + '_' + currentStage;
    let prevStars = parseInt(localStorage.getItem(starKey)) || 0;
    if (starsEarned > prevStars) localStorage.setItem(starKey, starsEarned);

    // Menyimpan perolehan koin pemain beserta bonus bintang
    let storedKoin = localStorage.getItem('koinPemain');
    let totalKoinLokal = (storedKoin !== null && !isNaN(parseInt(storedKoin))) ? parseInt(storedKoin) : 8400;
    let bonusKoin = (currentLevel === 3 && currentStage === 4) ? 15000 : (stats.koinDiArena + (starsEarned * 200));
    localStorage.setItem('koinPemain', totalKoinLokal + bonusKoin);

    // Simpan Total Berlian
    localStorage.setItem('ninjaDiamonds', stats.diamonds);

    // Memperbarui rekor pembunuhan dan pencapaian (achievements)
    let tk = parseInt(localStorage.getItem('totalKills')) || 0;
    localStorage.setItem('totalKills', tk + stats.killCount);
    if (stats.alarmsTriggered === 0) localStorage.setItem('ach_ghost', 'true');
    if (frameCount < 1500) localStorage.setItem('ach_speed', 'true');

    // Membuka gelar spesial jika berhasil menuntaskan babak rahasia mustahil
    if (currentLevel === 3 && currentStage === 4) {
      localStorage.setItem('ach_impossible', 'true');
      localStorage.setItem('title_impossible', 'true');
    }

    // Membuka akses ke sektor level berikutnya jika telah menyelesaikan stage 3
    if (currentStage >= 3) {
      let unlocked = parseInt(localStorage.getItem('unlockedLevel')) || 1;
      if (currentLevel >= unlocked && currentLevel < 3) {
        localStorage.setItem('unlockedLevel', currentLevel + 1);
        localStorage.setItem('justUnlocked', currentLevel + 1);
      }
    }
  }

  // Logika & AI Musuh
  // Menghitung kecepatan mengejar musuh berdasarkan tingkat sektor dan stage
  let kecMengejar = 3.5 + (currentLevel * 0.4) + (currentStage * 0.4);
  for (let i = musuh.length - 1; i >= 0; i--) {
    let m = musuh[i];
    // Jika musuh sedang terkena stun, lewati pembaruan gerakan pada frame ini
    if (m.stunTimer > 0) {
      m.stunTimer--;
      continue;
    }

    bebaskanMusuhDariTembok(m);

    // Update Timer Khusus Rival Assassin
    if (m.tipe === "rival") {
      if (m.vulnerableTimer > 0) m.vulnerableTimer--;
      if (m.dashCooldown > 0) m.dashCooldown--;
      if (m.cloneCooldown > 0) m.cloneCooldown--;
      if (m.smokeCooldown > 0) m.smokeCooldown--;
      if (m.shurikenCooldown > 0) m.shurikenCooldown--;
      if (m.parryCooldown > 0) m.parryCooldown--;

      // Menghitung mundur durasi mode menghilang dalam bayangan (stealth) milik Rival
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

        // Memunculkan dua bayangan clone di samping kiri dan kanan Rival
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
        // Menyebarkan lima bilah kunai shuriken kipas mematikan
        [-0.35, -0.18, 0, 0.18, 0.35].forEach(offset => {
          let a = baseA + offset;
          shurikens.push({
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

        // Berpindah posisi menyergap di belakang sudut pandang pemain
        let flankA = pemain.sudut + Math.PI + (Math.random() - 0.5);
        let fx = pemain.x + Math.cos(flankA) * 115;
        let fy = pemain.y + Math.sin(flankA) * 115;
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
        let dashA = Math.atan2(pemain.y - m.y, pemain.x - m.x);
        let dDist = Math.min(distKePemain - 35, 120);
        let dX = Math.cos(dashA) * dDist;
        let dY = Math.sin(dashA) * dDist;
        if (!cekTabrakanTembok(m.x + dX, m.y + dY, m.radius)) {
          m.x += dX;
          m.y += dY;
        }
        tambahVFX(m.x, m.y, "#dc2626", "gelombang");
        m.vulnerableTimer = 16; // Jeda pemulihan sangat cepat
      }
    }

    // Memeriksa apakah musuh mendeteksi pemain dengan senter pandangannya
    let seesPlayer = cekMelihatPemain(m);
    let distKePemain = Math.hypot(pemain.x - m.x, pemain.y - m.y);

    // Pengalihan perhatian musuh jika clone bayangan sedang aktif
    if (pemain.cloneActive && Math.hypot(pemain.cloneX - m.x, pemain.cloneY - m.y) < 400) {
      m.status = "investigate";
      m.targetX = pemain.cloneX;
      m.targetY = pemain.cloneY;
      m.isAlerted = false;
    // Musuh melihat pemain secara langsung
    } else if (seesPlayer) {
      if (m.status !== "chase") {
        if (alertSoundCooldown <= 0) {
          mainkanSuara('alert');
          alertSoundCooldown = 150; // Jeda 2.5 detik agar suara senter tidak berulang-ulang berlebihan
        }
        munculkanTeks(m.x, m.y - 20, "⚠️ ALERT!", "red");
        getarLayar = 3;
        stats.alarmsTriggered = (stats.alarmsTriggered || 0) + 1;
        // Panggil guard lain di radius sekitar untuk investigasi
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
      // Mengubah mode menjadi mengejar langsung pemain
      m.status = "chase";
      m.alertTimer = 180;
      m.isAlerted = true;
    } else {
      m.isAlerted = false;
      // Jika kehilangan kontak pandangan saat mengejar, beralih ke posisi terakhir pemain untuk menyelidiki
      if (m.status === "chase") {
        m.status = "investigate";
        m.targetX = pemain.x;
        m.targetY = pemain.y;
      }
    }
    m.prevStatus = m.status;

    // Musuh Menembak Peluru saat Waspada & Melihat Pemain (Keroco Pistol & Boss)
    m.shootCooldown = (m.shootCooldown !== undefined ? m.shootCooldown - 1 : 0);
    let canShoot = (m.tipe === "keroco_pistol" || m.tipe === "boss");
    if (m.status === "chase" && seesPlayer && m.shootCooldown <= 0 && canShoot) {
      if (distKePemain < 420 && !pemain.isHiding && !pemain.ghostActive) {
        let isBossShot = (m.tipe === "boss");
        m.shootCooldown = isBossShot ? 24 : 45;
        m.attackTimer = 20; // Picu pose menembak (attack frame)
        let bAngle = Math.atan2(pemain.y - m.y, pemain.x - m.x) + (Math.random() - 0.5) * (isBossShot ? 0.08 : 0.12);
        let muzzleX = m.x + Math.cos(m.sudut) * (m.radius + 14);
        let muzzleY = m.y + Math.sin(m.sudut) * (m.radius + 14);
        enemyBullets.push({
          x: muzzleX,
          y: muzzleY,
          vx: Math.cos(bAngle) * (isBossShot ? 11.5 : 9.5),
          vy: Math.sin(bAngle) * (isBossShot ? 11.5 : 9.5),
          life: 85,
          isBoss: isBossShot,
          damage: isBossShot ? 6 : 2
        });
        tambahVFX(muzzleX, muzzleY, isBossShot ? "#ef4444" : "#f59e0b", "partikel");
        playTone('sawtooth', isBossShot ? 320 : 480, 80, 0.12, 0.4);
      }
    }

    if (m.attackTimer > 0) m.attackTimer--;

    // Cek Kondisi Stealth Takedown (MANUAL: player must press L to strike!)
    // Musuh berada dalam jangkauan serang diam-diam dari belakang tanpa melihat pemain
    m.canTakedown = (!seesPlayer && distKePemain < 70 && !pemain.ghostActive);

    // Faktor perlambatan gerak Rival saat sedang membuka celah rentan
    let rivalSlow = (m.tipe === "rival" && m.vulnerableTimer > 0) ? 0.45 : 1;
    if (m.status === "chase" || m.status === "investigate") {
      let tX = (m.status === "chase") ? pemain.x : m.targetX;
      let tY = (m.status === "chase") ? pemain.y : m.targetY;

      // Menentukan kecepatan gerak target berdasarkan status dan tipe musuh
      let spdTarget = (m.status === "chase"
        ? (m.tipe === "rival" ? 5.0 : (m.tipe === "rival_clone" ? 4.2 : (m.tipe === "boss" ? 3.4 : (m.tipe === "juggernaut" ? 2.4 : kecMengejar)))) * rivalSlow
        : 2.2) * speedMultiplier;

      // Navigasi Cerdas Mengitari Tembok (A* Pathfinding & Line-of-Sight)
      let directLOS = hasLineOfSight(m.x, m.y, tX, tY, m.radius);
      m.pathTimer = (m.pathTimer !== undefined ? m.pathTimer - 1 : 0);

      if (!directLOS) {
        // Terdapat tembok pembatas: cari rute koridor / lorong alternatif tanpa menabrak dinding
        if (!m.path || m.path.length === 0 || m.pathTimer <= 0) {
          m.path = cariJalanAStar(m.x, m.y, tX, tY);
          m.pathTimer = 16 + Math.floor(Math.random() * 8); // Sebar waktu kalkulasi path
        }
      } else {
        // Jalur langsung terbuka tanpa terhalang tembok
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

      // Menghitung sudut arah langkah menuju titik target waypoint
      let moveAngle = Math.atan2(targetWaypoint.y - m.y, targetWaypoint.x - m.x);
      let stepX = Math.cos(moveAngle) * spdTarget;
      let stepY = Math.sin(moveAngle) * spdTarget;

      // Eksekusi pergerakan & pelurusan sudut
      if (!cekTabrakanTembok(m.x + stepX, m.y + stepY, m.radius)) {
        m.x += stepX;
        m.y += stepY;
        m.dx = stepX;
        m.dy = stepY;
        m.sudut = lerpAngle(m.sudut, moveAngle, 0.25);
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
          m.sudut = lerpAngle(m.sudut, moveAngle, 0.2);
          m.walkDistance = (m.walkDistance || 0) + spdTarget;
        } else {
          // Segarkan path segera jika mentok sudut
          m.pathTimer = 0;
        }
      }

      // Logika pemulihan status patroli setelah selesai menyelidiki lokasi target
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
      let vx = m.dx * speedMultiplier;
      let vy = m.dy * speedMultiplier;
      if (vx !== 0 || vy !== 0) m.sudut = Math.atan2(vy, vx);

      let movedPatrol = false;
      // Pergerakan horizontal patroli dengan pembalikan arah saat membentur dinding
      if (vx !== 0) {
        if (!cekTabrakanTembok(m.x + vx, m.y, m.radius)) {
          m.x += vx;
          movedPatrol = true;
        } else {
          m.dx *= -1;
          m.patrolDx *= -1;
        }
      }

      // Pergerakan vertikal patroli dengan pembalikan arah saat membentur dinding
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

    // Cek Musuh Menyentuh & Menyerang Pemain
    if (Math.hypot(pemain.x - m.x, pemain.y - m.y) < m.radius + pemain.radius + 2 && !pemain.isHiding && !pemain.ghostActive) {
      if ((!m.stunTimer || m.stunTimer <= 0) && pemain.invincibleTimer <= 0) {
        let dmg = m.damage || 3;
        m.attackTimer = 22;
        pemain.hp -= dmg;
        pemain.invincibleTimer = 55;
        getarLayar = (m.tipe === "boss" || m.tipe === "rival") ? 18 : 12;
        updateHpUI();

        // Mendorong mundur pemain saat terkena serangan musuh
        let angle = Math.atan2(pemain.y - m.y, pemain.x - m.x);
        let pushDist = 36;
        let px = Math.cos(angle) * pushDist;
        let py = Math.sin(angle) * pushDist;
        if (!cekTabrakanTembok(pemain.x + px, pemain.y, pemain.radius)) pemain.x += px;
        if (!cekTabrakanTembok(pemain.x, pemain.y + py, pemain.radius)) pemain.y += py;

        munculkanTeks(pemain.x, pemain.y - 25, `-${dmg} HP!`, "#ef4444");
        playTone('sawtooth', 130, 50, 0.25, 0.45);
        tambahVFX(pemain.x, pemain.y, "#ef4444", "ledakan");

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

// EKSEKUSI STEALTH TAKEDOWN (MENYERANG SECARA DIEM-DIEM DARI BELAKANG / BAYANGAN)
// Fungsi khusus untuk mengeksekusi pembunuhan senyap instan saat berada di belakang musuh
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

  // Menentukan besaran kerusakan fatal stealth takedown
  let isHeavy = (m.tipe === "boss" || m.tipe === "rival" || m.tipe === "juggernaut");
  let dmg = m.tipe === "boss" ? 2 : (m.tipe === "rival" ? 2 : (m.tipe === "juggernaut" ? 3 : m.hp)); // Boss & Rival damage tidak terlalu besar
  m.hp -= dmg;

  // Garis tebasan kilat merah menusuk musuh
  let sAngle = Math.atan2(m.y - pemain.y, m.x - pemain.x);
  slashes.push({
    x: m.x,
    y: m.y,
    sudut: sAngle,
    frame: 0
  });

  // Decal darah di lantai
  kotoran.push({ x: m.x, y: m.y, r: isHeavy ? 15 : 10, isBlood: true, a: 0.85 });

  // Efek suara tebasan fatal & VFX
  playTone('sawtooth', 750, 100, 0.22, 0.45);
  tambahVFX(m.x, m.y, "#ef4444", "ledakan");
  tambahVFX(m.x, m.y, "#facc15", "partikel");
  getarLayar = 15;

  stats.stealthKills = (stats.stealthKills || 0) + 1;
  munculkanTeks(m.x, m.y - 25, "⚡ SILENT TAKEDOWN!", "#facc15");

  if (m.hp <= 0) {
    dropRegenItem(m.x, m.y);
    koinMaps.push({ x: m.x, y: m.y, collected: false, drop: true });

    // Drop Berlian / Diamonds (Signature Hunter Assassin)
    let dCount = (m.tipe === "boss" || m.tipe === "rival") ? 5 : (m.tipe === "juggernaut" ? 3 : 2);
    for (let d = 0; d < dCount; d++) {
      let rA = Math.random() * Math.PI * 2;
      let rD = Math.random() * 25 + 10;
      diamonds.push({
        x: m.x + Math.cos(rA) * rD,
        y: m.y + Math.sin(rA) * rD,
        value: 5,
        collected: false,
        frame: Math.random() * 100
      });
    }

    let tipeMati = m.tipe;
    musuh.splice(index, 1);
    stats.killCount++;

    if (tipeMati === "rival") {
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

  slashes.push({
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

      // Serangan Masuk ke Musuh: Kurangi 1 HP per Hit!
      m.hp--;
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
        kotoran.push({ x: m.x, y: m.y, r: (m.tipe === "boss" || m.tipe === "rival") ? 14 : 9, isBlood: true, a: 0.8 });
        koinMaps.push({ x: m.x, y: m.y, collected: false, drop: true });
        dropRegenItem(m.x, m.y); // Drop item penambah darah setiap musuh mati
        let tipeMati = m.tipe;
        musuh.splice(i, 1);
        stats.killCount++;
        recordDailyStat('daily_kills', 1);
        if (tipeMati === "boss" || tipeMati === "rival") {
          recordDailyStat('daily_boss', 1);
        }

        if (tipeMati === "rival") {
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
        let labelNama = m.tipe === "rival" ? "RIVAL" : (m.tipe === "rival_clone" ? "CLONE" : (m.tipe === "boss" ? "BOSS" : (m.tipe === "juggernaut" ? "JUGG" : "KROCO")));
        munculkanTeks(m.x, m.y - 15, `${labelNama}: ${m.hp}/${m.maxHp}`, "gold");
      }
      break;
    }
  }
}

// UPDATE STATUS MISI HUD
// Fungsi untuk memformat dan memperbarui indikator teks status HUD di bagian atas layar
function updateTeksStatus() {
  if (!teksStatus) return;
  // Menghitung jumlah sisa musuh yang masih hidup
  let sisaMusuh = musuh ? musuh.length : 0;
  // Memeriksa jika ada musuh yang sedang dalam status waspada (alert)
  let isAlert = musuh && musuh.some(m => m.isAlerted);
  let statusBadge = isAlert ? "<span style='color:#ef4444;'>🔴 ALERTED</span>" : "<span style='color:#22c55e;'>🟢 UNSEEN</span>";

  // Menghitung jumlah dokumen intelijen yang telah diambil
  let totalIntel = (intels && intels.length) || 0;
  let collectedIntel = intels ? intels.filter(i => i.collected).length : 0;
  let sisaDok = totalIntel - collectedIntel;
  let intelColor = (sisaDok === 0 && totalIntel > 0) ? "#22c55e" : "#00e5ff";
  let statusDokumen = (sisaDok === 0 && totalIntel > 0) ? "✓ PORTAL TERBUKA" : `(SISA ${sisaDok})`;
  let intelBadge = totalIntel > 0 ? `<span style='color:${intelColor}; font-weight:800;'>📂 DOKUMEN: ${collectedIntel}/${totalIntel} ${statusDokumen}</span>` : "";

  // Merender kode HTML status misi ke elemen DOM teksStatus
  teksStatus.innerHTML = `<b>SEKTOR ${currentLevel}-${currentStage}</b> | ${intelBadge ? intelBadge + " | " : ""}<span style='color:#f87171;'>🎯 MUSUH: ${sisaMusuh}</span> | <span style='color:#38bdf8;'>💎 ${stats.diamonds || 0}</span> | ${statusBadge}`;
}

// ==========================================
// 3. FUNGSI MENGGAMBAR KARAKTER
// ==========================================
// Fungsi komprehensif untuk merender karakter pemain atau musuh pada koordinat (x,y)
function gambarKarakter(x, y, radius, sudut, warnaBase, alpha = 1, isPemain = false, tipeMusuh = null, lvlTheme = currentLevel, enemyObj = null) {
  // Menyimpan status transformasi kanvas saat ini
  ctx.save();
  // Memindahkan titik pusat transformasi ke posisi koordinat karakter (x, y)
  ctx.translate(x, y);
  // Mengatur nilai transparansi render kanvas
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  if (isPemain) {
    // Proporsi Karakter Assassin
    // Menghitung skala ukuran visual karakter proporsional terhadap radius
    const size = radius * 4.3;

    // 1. Ghost Active Ethereal Aura
    // Merender pendaran aura gaib warna biru toska jika Ghost Walk aktif
    if (pemain.ghostActive) {
      let gAura = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius * 2.2);
      gAura.addColorStop(0, "rgba(0, 229, 255, 0.45)");
      gAura.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = gAura;
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
    let bKey = mapBajuWarna[warnaBase] || mapBajuWarna[playerColor] || 'navy';
    let sData = SPRITE_SHEET_DATA[bKey] || SPRITE_SHEET_DATA['navy'];
    let theme = WARNA_TEMA[bKey] || WARNA_TEMA['navy'];

    // Soft drop shadow di bawah kaki pemain agar menapak realistis
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(0, radius * 1.15, radius * 1.1, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sudut hadap karakter 8-arah & 360 derajat halus
    let charAngle = (pemain.visualSudut !== undefined ? pemain.visualSudut : (pemain.sudut || 0));

    if (st === 'dash') {
      // Dash dengan postur sprint aerodinamis halus (tanpa kilatan neon berlebihan)
      let sRect = (sData.walk && sData.walk[3]) ? sData.walk[3] : sData.idle;
      let sheetImg = assets.spritesheets[bKey] || assets.spritesheets.navy;
      if (sheetImg && sheetImg.complete && sheetImg.naturalWidth > 0 && sRect) {
        let is600 = sheetImg.naturalWidth <= 800;
        let scaleSheetX = is600 ? 1 : sheetImg.naturalWidth / 1536;
        let scaleSheetY = is600 ? 1 : sheetImg.naturalHeight / 1024;
        let sx = sRect.x * scaleSheetX;
        let sy = sRect.y * scaleSheetY;
        let sw = sRect.w * scaleSheetX;
        let sh = sRect.h * scaleSheetY;

        ctx.save();
        ctx.rotate(charAngle - Math.PI / 2);
        ctx.scale(1.15, 0.92);
        let targetH = size * 1.05;
        let targetW = targetH * (sRect.w / sRect.h);
        let anchorX = sRect.anchorX !== undefined ? sRect.anchorX : 0.5;
        let anchorY = sRect.anchorY !== undefined ? sRect.anchorY : 0.5;
        ctx.drawImage(sheetImg, sx, sy, sw, sh, -targetW * anchorX, -targetH * anchorY, targetW, targetH);
        ctx.restore();
      } else {
        let imgFallback = assets.baju[bKey] || assets.baju.navy;
        if (imgFallback && imgFallback.complete && imgFallback.naturalWidth > 0) {
          ctx.save();
          ctx.rotate(charAngle - Math.PI / 2);
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
      let scaleXAnim = 1;
      let scaleYAnim = 1;

      if (st === 'serang') {
        let fIdx = Math.min(2, Math.max(0, pemain.animFrame || 0));
        sRect = sData.attack[fIdx];
        scaleXAnim = (fIdx === 1 ? 1.08 : 1.0);
        scaleYAnim = (fIdx === 1 ? 0.94 : 1.0);

        // Menggambar busur tebasan visual putih di depan karakter saat mengayunkan senjata
        if (fIdx === 1) {
          ctx.save();
          ctx.rotate(charAngle);
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
        let stepCycle = (pemain.walkDistance || 0) / 10;
        scaleXAnim = 1 + Math.sin(stepCycle) * 0.035;
        scaleYAnim = 1 - Math.sin(stepCycle) * 0.035;
      } else {
        // Idle / Diam: animasi bernapas halus
        let breath = Math.sin(frameCount * 0.065);
        scaleYAnim = 1 + breath * 0.025;
        scaleXAnim = 1 - breath * 0.015;
        sRect = sData.idle;
      }

      let sheetImg = assets.spritesheets[bKey] || assets.spritesheets.navy;
      if (sheetImg && sheetImg.complete && sheetImg.naturalWidth > 0 && sRect) {
        let is600 = sheetImg.naturalWidth <= 800;
        let scaleSheetX = is600 ? 1 : sheetImg.naturalWidth / 1536;
        let scaleSheetY = is600 ? 1 : sheetImg.naturalHeight / 1024;
        let sx = sRect.x * scaleSheetX;
        let sy = sRect.y * scaleSheetY;
        let sw = sRect.w * scaleSheetX;
        let sh = sRect.h * scaleSheetY;

        ctx.save();
        ctx.rotate(charAngle - Math.PI / 2);
        ctx.scale(scaleXAnim, scaleYAnim);
        let targetH = size;
        let targetW = targetH * (sRect.w / sRect.h);
        let anchorX = sRect.anchorX !== undefined ? sRect.anchorX : 0.5;
        let anchorY = sRect.anchorY !== undefined ? sRect.anchorY : 0.5;
        ctx.drawImage(sheetImg, sx, sy, sw, sh, -targetW * anchorX, -targetH * anchorY, targetW, targetH);
        ctx.restore();
      } else {
        let imgFallback = assets.baju[bKey] || assets.baju.navy;
        if (imgFallback && imgFallback.complete && imgFallback.naturalWidth > 0) {
          ctx.save();
          ctx.rotate(charAngle - Math.PI / 2);
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
    let enemyKey = tipeMusuh;
    if (enemyKey === "kroco") enemyKey = "keroco";
    if (enemyKey === "rival_clone") enemyKey = "rival";

    let sheetImg = assets.musuh[enemyKey] || assets.musuh.keroco;
    let sData = MUSUH_SPRITES[enemyKey] || MUSUH_SPRITES.keroco;

    // Drop shadow di bawah kaki musuh
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, radius * 1.05, radius * 1.05, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Efek aura untuk Boss dan Rival Assassin
    if (tipeMusuh === "rival" || tipeMusuh === "rival_clone") {
      let auraGrad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius * 2.2);
      auraGrad.addColorStop(0, tipeMusuh === "rival_clone" ? "rgba(147, 51, 234, 0.5)" : "rgba(220, 38, 38, 0.55)");
      auraGrad.addColorStop(0.6, "rgba(147, 51, 234, 0.2)");
      auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tipeMusuh === "boss") {
      let auraGrad = ctx.createRadialGradient(0, 0, radius * 0.6, 0, 0, radius * 2.0);
      auraGrad.addColorStop(0, "rgba(220, 38, 38, 0.5)");
      auraGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.25)");
      auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tentukan Frame Animasi Musuh
    let sRect = sData.idle;
    let scaleXAnim = 1;
    let scaleYAnim = 1;

    let isMoving = false;
    let isAttacking = false;
    let walkDist = 0;

    if (enemyObj) {
      walkDist = enemyObj.walkDistance || 0;
      isMoving = Math.hypot(enemyObj.dx || 0, enemyObj.dy || 0) > 0.1;
      isAttacking = (enemyObj.attackTimer && enemyObj.attackTimer > 0) || (enemyObj.status === "attack");

      // Menyesuaikan transparansi saat Rival Assassin berada dalam mode stealth
      if (enemyObj.isStealth) {
        ctx.globalAlpha = Math.min(ctx.globalAlpha, 0.3);
      }
    }

    if (isAttacking) {
      let fIdx = Math.min(2, Math.floor(frameCount / 5) % 3);
      sRect = sData.attack[fIdx] || sData.idle;
      scaleXAnim = fIdx === 1 ? 1.08 : 1.0;
      scaleYAnim = fIdx === 1 ? 0.94 : 1.0;
    } else if (isMoving) {
      let fIdx = Math.floor(walkDist / 12) % 8;
      sRect = (sData.walk && sData.walk[fIdx]) ? sData.walk[fIdx] : sData.idle;
      let stepCycle = walkDist / 10;
      scaleXAnim = 1 + Math.sin(stepCycle) * 0.035;
      scaleYAnim = 1 - Math.sin(stepCycle) * 0.035;
    } else {
      let breath = Math.sin(frameCount * 0.065 + (x % 7));
      scaleYAnim = 1 + breath * 0.025;
      scaleXAnim = 1 - breath * 0.015;
      sRect = sData.idle;
    }

    // Rotasi: hadap sudut (kurang 90 derajat karena top-down spritesheet menghadap bawah)
    ctx.rotate(sudut - Math.PI / 2);
    ctx.scale(scaleXAnim, scaleYAnim);

    const size = radius * 4.3;

    if (sheetImg && sheetImg.complete && sheetImg.naturalWidth > 0 && sRect) {
      let targetH = size;
      let targetW = targetH * (sRect.w / sRect.h);
      let anchorX = sRect.anchorX !== undefined ? sRect.anchorX : 0.5;
      let anchorY = sRect.anchorY !== undefined ? sRect.anchorY : 0.5;

      ctx.drawImage(
        sheetImg,
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

  // Mengembalikan kondisi kanvas sebelum transformasi
  ctx.restore();
}

// RENDER VISION CONE DENGAN RAYCASTING
// Fungsi untuk menggambar kerucut lampu sorot pandangan menggunakan algoritma raycasting
function gambarVisionCone(originX, originY, sudut, jarak, lebar, warnaCone) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(originX, originY);

  // Jumlah berkas sinar raycast untuk menghitung batas tepi bayangan dinding
  const numRays = 24;
  for (let i = 0; i <= numRays; i++) {
    let ang = sudut - lebar + (lebar * 2 * (i / numRays));
    let cos = Math.cos(ang);
    let sin = Math.sin(ang);
    let dist = hitRayWall(originX, originY, cos, sin, jarak);
    ctx.lineTo(originX + cos * dist, originY + sin * dist);
  }

  ctx.closePath();
  // Membuat gradasi warna melingkar agar ujung sorot memudar lembut
  let gradCone = ctx.createRadialGradient(originX, originY, 5, originX, originY, jarak);
  gradCone.addColorStop(0, warnaCone.replace("ALPHA", "0.4"));
  gradCone.addColorStop(1, warnaCone.replace("ALPHA", "0.02"));
  ctx.fillStyle = gradCone;
  ctx.fill();
  ctx.restore();
}

// DRAW LOOP
// Fungsi utama untuk merender semua elemen visual permainan ke kanvas (rendering loop)
function draw() {
  ctx.save();
  // Memberikan efek guncangan kamera layar jika getarLayar aktif
  if (getarLayar > 0) {
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }

  // Mengatur warna latar belakang kanvas sesuai tema lantai
  canvas.style.backgroundColor = warnaLantai;
  // Membersihkan seluruh bidang gambar kanvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Memberikan overlay warna ungu lembut jika skill Time Freeze sedang aktif
  if (pemain.timeActive) {
    ctx.fillStyle = "rgba(155, 89, 182, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Menggambar garis-garis grid teknologi futuristik jika tema level adalah laboratorium (lab)
  if (mapTheme === "lab") {
    ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }
  }

  // Merender partikel-partikel debu ambien yang melayang perlahan di udara
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

  // Merender noda kotoran dan bercak darah di lantai
  for (let k of kotoran) {
    ctx.beginPath();
    ctx.arc(k.x, k.y, k.r, 0, Math.PI * 2);
    ctx.fillStyle = k.isBlood ? `rgba(185, 28, 28, ${k.a})` : kotoranColor;
    ctx.globalAlpha = k.isBlood ? 1 : opacityKotoran;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Merender rintangan interaktif (daun, laser, jebakan duri)
  for (let h of hazards) {
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

  // Merender area persembunyian (semak rimbun atau kotak ventilasi)
  ctx.fillStyle = mapTheme === "hutan" ? "rgba(22, 101, 52, 0.85)" : "rgba(30, 41, 59, 0.75)";
  for (let s of sembunyi) {
    if (mapTheme === "hutan") {
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

  // Merender kamera CCTV dan kerucut pandangannya
  for (let h of hazards) {
    if (h.tipe === "cctv") {
      let coneWarna = h.alertActive ? "rgba(239, 68, 68, ALPHA)" : "rgba(0, 229, 255, ALPHA)";
      gambarVisionCone(h.x, h.y, h.sudut, JARAK_PANDANG, LEBAR_PANDANG, coneWarna);

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

  // Merender kerucut pandangan senter musuh dan bar darah (HP) di atas kepala
  for (let m of musuh) {
    let coneColor = m.status === "chase" ? "rgba(239, 68, 68, ALPHA)" : (m.status === "investigate" ? "rgba(249, 115, 22, ALPHA)" : "rgba(250, 204, 21, ALPHA)");
    gambarVisionCone(m.x, m.y, m.sudut, JARAK_PANDANG, LEBAR_PANDANG, coneColor);

    let barW = m.tipe === "boss" ? 64 : (m.tipe === "rival" ? 80 : (m.tipe === "juggernaut" ? 44 : (m.tipe === "rival_clone" ? 36 : 32)));
    let barH = (m.tipe === "boss" || m.tipe === "rival") ? 8 : 5;
    let barY = m.y - m.radius - (m.tipe === "boss" || m.tipe === "rival" ? 16 : 11);
    let barX = m.x - barW / 2;
    let hpRatio = Math.max(0, Math.min(1, m.hp / m.maxHp));

    // Latar belakang bar darah musuh
    ctx.fillStyle = "rgba(10, 15, 25, 0.85)";
    ctx.fillRect(barX, barY, barW, barH);

    // Pengisian warna bar HP musuh
    let barColor = hpRatio > 0.5 ? "#22c55e" : (hpRatio > 0.25 ? "#f59e0b" : "#ef4444");
    if (m.tipe === "rival") barColor = hpRatio > 0.5 ? "#dc2626" : "#ef4444";
    if (m.tipe === "rival_clone") barColor = "#9333ea";
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barW * hpRatio, barH);

    // Garis tepi bingkai bar HP
    ctx.strokeStyle = (m.tipe === "boss" ? "#f59e0b" : (m.tipe === "rival" ? "#ef4444" : (m.tipe === "rival_clone" ? "#a855f7" : "rgba(255, 255, 255, 0.4)")));
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Garis pemisah segmen HP
    for (let k = 1; k < m.maxHp; k++) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(barX + (k / m.maxHp) * barW, barY, 1, barH);
    }

    // Nama label dan indikator pembuka celah untuk bos dan Rival
    if (m.tipe === "boss" || m.tipe === "rival") {
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

  // Mengatur bayangan drop shadow untuk tembok agar tampak menonjol dari lantai
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  // Merender blok tembok dinding sesuai tema
  for (let t of tembok) {
    if (mapTheme === "lab") {
      ctx.fillStyle = warnaAtasTembok;
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.strokeStyle = warnaTembok;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(t.x, t.y, t.w, t.h);
    } else if (mapTheme === "hutan") {
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

  // Merender koin emas yang berdenyut lembut
  for (let k of koinMaps) {
    if (!k.collected) {
      let pulse = Math.sin(frameCount * 0.1) * 1.5;
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

  // Merender berkas dokumen intel yang melayang naik turun
  for (let i of intels) {
    if (!i.collected) {
      let floatY = Math.sin(frameCount * 0.08) * 3;
      ctx.save();
      ctx.translate(i.x, i.y + floatY);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(-11, -14, 22, 26);
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(-9, -11, 18, 5);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-7, -4, 14, 12);
      ctx.restore();
    }
  }

  // 1. RENDER BERLIAN / DIAMONDS (HUNTER ASSASSIN COLLECTIBLES)
  // Merender permata berlian berkilau yang melayang di arena
  for (let d of diamonds) {
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
  // Merender jejak lintasan peluru merah/oranye yang ditembakkan musuh
  for (let eb of enemyBullets) {
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

  // 3. RENDER HELIPAD EXTRACTION ZONE (TITIK KABUR HUNTER ASSASSIN)
  // Merender area pendaratan helipad zona evakuasi
  let ep = exitPortal;
  let isExtractReady = ep.active;
  let pColor = isExtractReady ? "#22c55e" : "rgba(239, 68, 68, 0.5)";
  let rotPad = frameCount * 0.02;

  ctx.save();
  ctx.translate(ep.x, ep.y);

  // Lingkaran luar helipad
  ctx.strokeStyle = pColor;
  ctx.lineWidth = 3;
  if (isExtractReady) {
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 18;
  }
  ctx.beginPath();
  ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
  ctx.stroke();

  // Strip hazard berputar
  ctx.save();
  ctx.rotate(rotPad);
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = isExtractReady ? "#facc15" : "rgba(239, 68, 68, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, ep.radius - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Simbol Helipad
  ctx.fillStyle = isExtractReady ? "#22c55e" : "rgba(239, 68, 68, 0.65)";
  ctx.font = "900 24px 'Rajdhani', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(isExtractReady ? "H" : "🔒", 0, 0);

  let sisaDok = intels ? intels.filter(i => !i.collected).length : 0;
  ctx.font = "bold 11px sans-serif";
  ctx.fillStyle = isExtractReady ? "#4ade80" : "#ef4444";
  ctx.fillText(isExtractReady ? "➔ EXTRACTION OPEN!" : `🔒 LOCKED (${sisaDok} DOKUMEN LAGI)`, 0, -ep.radius - 8);
  ctx.restore();

  // Merender lingkaran gelombang radius kebisingan suara langkah dash pemain
  if (pemain.noiseR > 0) {
    ctx.beginPath();
    ctx.arc(pemain.x, pemain.y, pemain.noiseR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Merender proyektil shuriken berputar yang melayang
  for (let s of shurikens) {
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

  // Merender karakter clone bayangan jika sedang aktif
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
      let scaleSheetX = is600 ? 1 : t.sheetImg.naturalWidth / 1536;
      let scaleSheetY = is600 ? 1 : t.sheetImg.naturalHeight / 1024;
      let sx = t.sRect.x * scaleSheetX;
      let sy = t.sRect.y * scaleSheetY;
      let sw = t.sRect.w * scaleSheetX;
      let sh = t.sRect.h * scaleSheetY;
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

  // Merender kotak obat pemulih darah (HP) di lantai
  for (let r of regenItems) {
    let bob = Math.sin((r.frame || 0) * 2) * 3;
    ctx.save();
    ctx.translate(r.x, r.y + bob);
    let gGlow = ctx.createRadialGradient(0, 0, 3, 0, 0, 16);
    gGlow.addColorStop(0, "rgba(34, 197, 94, 0.75)");
    gGlow.addColorStop(1, "rgba(34, 197, 94, 0)");
    ctx.fillStyle = gGlow;
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

  // Merender seluruh karakter musuh
  for (let m of musuh) {
    gambarKarakter(m.x, m.y, m.radius, m.sudut, m.warnaBase, 1, false, m.tipe, currentLevel, m);

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

  // Merender karakter utama pemain
  let pWarna = pemain.ghostActive ? "#94a3b8" : pemain.warnaBase;
  let pAlpha = pemain.ghostActive ? 0.35 : (pemain.isHiding ? 0.45 : 1.0);
  if (pemain.invincibleTimer > 0 && Math.floor(frameCount / 4) % 2 === 0) pAlpha = 0.25;
  gambarKarakter(pemain.x, pemain.y, pemain.radius, pemain.sudut, pWarna, pAlpha, true);

  // Merender efek visual partikel dan gelombang (VFX)
  for (let i = vfxArray.length - 1; i >= 0; i--) {
    let v = vfxArray[i];
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
    if (v.a <= 0) vfxArray.splice(i, 1);
  }
  ctx.globalAlpha = 1;

  // Merender efek garis tebasan pedang (slash arc)
  for (let s of slashes) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.sudut);
    ctx.beginPath();
    ctx.arc(0, 0, 36 + s.frame * 1.5, -Math.PI / 1.5, Math.PI / 1.5);
    ctx.lineWidth = 7 * (1 - s.frame / 15);
    ctx.globalAlpha = 1 - (s.frame / 15);
    ctx.strokeStyle = weaponColor;
    if (weaponType === "bentuk-saber") {
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 15;
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Merender teks informasi melayang di layar
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

  // Merender mini bar HP di atas kepala pemain
  let hpPct = Math.max(0, Math.min(1, pemain.hp / pemain.maxHp));
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(pemain.x - 22, pemain.y - 36, 44, 6);
  ctx.fillStyle = hpPct > 0.5 ? "#22c55e" : (hpPct > 0.25 ? "#f59e0b" : "#ef4444");
  ctx.fillRect(pemain.x - 22, pemain.y - 36, hpPct * 44, 6);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(pemain.x - 22, pemain.y - 36, 44, 6);
  for (let i = 1; i < 4; i++) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(pemain.x - 22 + (i / 4) * 44, pemain.y - 36, 1, 6);
  }

  // Merender mini bar stamina energi dash di bawah bar HP pemain
  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  ctx.fillRect(pemain.x - 22, pemain.y - 27, 44, 5);
  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(pemain.x - 22, pemain.y - 27, (pemain.energiDash / 100) * 44, 5);

  // Merender bilah panel HUD skill di bagian bawah layar
  renderHUDBar();
  ctx.restore();

  // Tampilan layar Game Over saat tertangkap/mati
  if (window.gameState === "lose") {
    ctx.fillStyle = "rgba(10, 15, 25, 0.88)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ef4444";
    ctx.font = "900 48px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(Teks.tertangkap, canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 20px 'Segoe UI', sans-serif";
    ctx.fillText(Teks.ulang + currentStage, canvas.width / 2, canvas.height / 2 + 35);
  // Tampilan layar kemenangan misi (Victory Screen)
  } else if (window.gameState === "win") {
    ctx.fillStyle = "rgba(10, 15, 25, 0.92)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";

    // Kemenangan di akhir Sektor 3 Tahap 3 (Membuka Pintu Rahasia Tahap 4)
    if (currentLevel === 3 && currentStage === 3) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "900 36px 'Segoe UI', sans-serif";
      ctx.fillText(Teks.secretStage, canvas.width / 2, canvas.height / 2 - 50);

      ctx.fillStyle = "#facc15";
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.fillText("⚠️ PERINGATAN: RIVAL ASSASSIN TELAH MUNCUL DI TAHAP 4!", canvas.width / 2, canvas.height / 2 - 5);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "600 17px 'Segoe UI', sans-serif";
      ctx.fillText("Kalahkan Rival untuk meraih Gelar Legendaris & +15.000 Koin Lobi!", canvas.width / 2, canvas.height / 2 + 30);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.fillText("Tekan [ ENTER ] untuk Menghadapi UJIAN MUSTAHIL!", canvas.width / 2, canvas.height / 2 + 85);

    // Kemenangan mutlak setelah menaklukkan Sektor 3 Tahap 4 (Rival Assassin)
    } else if (currentLevel === 3 && currentStage === 4) {
      ctx.fillStyle = "#eab308";
      ctx.font = "900 36px 'Segoe UI', sans-serif";
      ctx.fillText("👑 " + Teks.secretCleared + " 👑", canvas.width / 2, canvas.height / 2 - 50);

      ctx.fillStyle = "#ef4444";
      ctx.font = "900 26px 'Segoe UI', sans-serif";
      ctx.fillText(Teks.titleUnlocked, canvas.width / 2, canvas.height / 2 - 5);

      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.fillText("Bonus Kemenangan Legendaris: +15,000 KOIN LOBI!", canvas.width / 2, canvas.height / 2 + 40);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "600 18px 'Segoe UI', sans-serif";
      ctx.fillText(Teks.kembali, canvas.width / 2, canvas.height / 2 + 95);

    // Kemenangan level standar dengan penilaian bintang 1-3
    } else {
      let stars = ((stats.alarmsTriggered || 0) === 0) ? 3 : (((stats.alarmsTriggered || 0) <= 2) ? 2 : 1);
      let starStr = stars === 3 ? "⭐⭐⭐" : (stars === 2 ? "⭐⭐" : "⭐");
      let starTitle = stars === 3 ? "GHOST MASTER (SEMPURNA!)" : (stars === 2 ? "SILENT SHINOBI" : "SURVIVOR ASSASSIN");

      ctx.fillStyle = "#facc15";
      ctx.font = "900 44px 'Segoe UI', sans-serif";
      ctx.fillText(`SEKTOR ${currentLevel} - TAHAP ${currentStage} SELESAI!`, canvas.width / 2, canvas.height / 2 - 70);

      ctx.font = "900 40px 'Segoe UI', sans-serif";
      ctx.fillText(starStr, canvas.width / 2, canvas.height / 2 - 15);

      ctx.fillStyle = stars === 3 ? "#00e5ff" : (stars === 2 ? "#facc15" : "#94a3b8");
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.fillText(starTitle, canvas.width / 2, canvas.height / 2 + 25);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "600 17px 'Segoe UI', sans-serif";
      ctx.fillText(`⚡ Stealth Kills: ${stats.stealthKills || 0} | 💎 Berlian: ${stats.diamonds || 0} | 🚨 Alarm: ${stats.alarmsTriggered || 0}`, canvas.width / 2, canvas.height / 2 + 65);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 18px 'Segoe UI', sans-serif";
      if (currentStage < 3) {
        ctx.fillText("Tekan [ ENTER ] untuk Melanjutkan ke Tahap Berikutnya ➔", canvas.width / 2, canvas.height / 2 + 115);
      } else {
        ctx.fillText("Tekan [ ENTER ] untuk Kembali ke HQ Lobi ➔", canvas.width / 2, canvas.height / 2 + 115);
      }
    }
  }
}

// RENDER HUD SKILL BAR BAWAH
// Fungsi untuk merender bilah kotak-kotak hotkey skill di bagian bawah layar kanvas
function renderHUDBar() {
  let skillItems = [];

  // 1. Tebas Dasar (Tombol L) - Menampilkan Status 2 Kuota / Cooldown
  skillItems.push({
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
    skillItems.push({
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
    skillItems.push({ key: "Q", name: "Ghost", cd: pemain.ghostCooldown, maxCd: 900, active: pemain.ghostActive, color: "#00e5ff" });
  }

  // 4. Blink Kill (Tombol P - Baru)
  if (localStorage.getItem('skill_blink') === 'true') {
    skillItems.push({ key: "P", name: "Blink", cd: pemain.blinkCooldown, maxCd: 600, active: false, color: "#ef4444" });
  }

  // 5. Time Freeze (Tombol I - Baru)
  if (localStorage.getItem('skill_time') === 'true') {
    skillItems.push({ key: "I", name: "Freeze", cd: pemain.timeCooldown, maxCd: 1200, active: pemain.timeActive, color: "#9b59b6" });
  }

  // 6. Shadow Clone (Tombol T - Baru)
  if (localStorage.getItem('skill_clone') === 'true') {
    skillItems.push({ key: "T", name: "Clone", cd: pemain.cloneCooldown, maxCd: 1200, active: pemain.cloneActive, color: "#22c55e" });
  }

  // 7. Pisau Lempar (Tombol C)
  if (localStorage.getItem('item_shuriken') === 'true') {
    skillItems.push({ key: "C", name: "Knife", ammo: pemain.ammo, color: "#facc15" });
  }

  if (skillItems.length === 0) return;

  // Pengaturan tata letak dan posisi bilah skill HUD
  let itemW = 82;
  let gap = 8;
  let totalW = skillItems.length * itemW + (skillItems.length - 1) * gap;
  let startX = (canvas.width - totalW) / 2;
  let hudY = 645;

  ctx.save();
  for (let i = 0; i < skillItems.length; i++) {
    let item = skillItems[i];
    let x = startX + i * (itemW + gap);

    // Box Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(x, hudY, itemW, 42);
    ctx.strokeStyle = item.active ? item.color : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = item.active ? 2.5 : 1;
    ctx.strokeRect(x, hudY, itemW, 42);

    // Hotkey Badge
    ctx.fillStyle = item.color;
    ctx.fillRect(x + 4, hudY + 4, 18, 16);
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.key, x + 13, hudY + 12);

    // Skill Name / Ammo
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(item.name, x + 26, hudY + 12);

    // Status Cooldown Bar or Ammo count or Slash charges
    if (item.isSlash) {
      if (item.cd > 0) {
        let pct = 1 - (item.cd / item.maxCd);
        ctx.fillStyle = "#334155";
        ctx.fillRect(x + 5, hudY + 26, itemW - 10, 8);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x + 5, hudY + 26, pct * (itemW - 10), 8);
      } else {
        // Tampilkan 2 indikator kuota tebasan
        for (let c = 0; c < 2; c++) {
          let dotX = x + 18 + c * 24;
          let dotY = hudY + 30;
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
      ctx.fillText(`x${item.ammo}`, x + itemW / 2, hudY + 31);
    } else {
      let isReady = item.cd <= 0;
      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 5, hudY + 26, itemW - 10, 8);
      if (isReady) {
        ctx.fillStyle = item.color;
        ctx.fillRect(x + 5, hudY + 26, itemW - 10, 8);
      } else {
        let pct = 1 - (item.cd / item.maxCd);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x + 5, hudY + 26, pct * (itemW - 10), 8);
      }
    }
  }
  ctx.restore();
}

// INTI GAME LOOP
// Mengambil level target yang dipilih dari lobi utama (default level 1 jika belum ada)
let targetLevelLobi = parseInt(localStorage.getItem('selectedLevel')) || 1;
// Memulai ulang inisialisasi status permainan ke level target pada tahap (stage) 1
resetGame(targetLevelLobi, 1);

// Fungsi utama siklus pembaruan animasi dan logika berkelanjutan (game loop)
function gameLoop() {
  // Menjalankan kalkulasi fisika, posisi, tabrakan, dan logika musuh
  update();
  // Menjalankan proses render grafis kanvas ke layar
  draw();
  // Meminta frame animasi berikutnya dari peramban web
  requestAnimationFrame(gameLoop);
}
// Menjalankan game loop untuk pertama kalinya
gameLoop();
