"""
ALAT PENCARI KOORDINAT SPRITE OTOMATIS
=======================================
Script ini membuka file PNG sprite sheet dan membiarkan kamu
klik di atas gambar untuk mendapat koordinat x, y, w, h tiap frame.

CARA PAKAI:
1. Install Pillow dulu: pip install pillow
2. Jalankan: python cari_koordinat_sprite.py
3. Ubah NAMA_FILE di bawah sesuai file yang mau dicari koordinatnya
4. Klik pojok KIRI ATAS frame, lalu klik pojok KANAN BAWAH frame
5. Koordinat langsung tercetak dalam format JavaScript!

CATATAN:
- Klik pertama  = pojok kiri atas  (menentukan x dan y)
- Klik kedua    = pojok kanan bawah (menentukan lebar & tinggi)
- Setelah 2 klik, hasil langsung muncul di terminal
"""

import tkinter as tk
from PIL import Image, ImageTk
import math

# ==========================================
# UBAH INI: nama file PNG yang mau dicari
# ==========================================
NAMA_FILE = "../musuh/keroco.png"
NAMA_KEY  = "keroco"        # nama yang muncul di output JavaScript
# ==========================================

class SpriteCutter:
    def __init__(self, root, image_path):
        self.root = root
        self.root.title(f"Sprite Cutter - {image_path}")

        # Muat gambar asli
        self.img_asli = Image.open(image_path)
        self.lebar_asli, self.tinggi_asli = self.img_asli.size
        print(f"\n✅ Gambar dimuat: {image_path}")
        print(f"   Ukuran asli: {self.lebar_asli} x {self.tinggi_asli} pixel\n")
        print("=" * 55)
        print("CARA PAKAI:")
        print("  Klik KIRI ATAS  frame → lalu klik KANAN BAWAH frame")
        print("  Hasil koordinat muncul di sini (terminal)")
        print("  Tekan R untuk Reset klik")
        print("=" * 55)

        # Skala tampilan (supaya gambar tidak terlalu kecil di layar)
        skala_maks = min(1200 / self.lebar_asli, 800 / self.tinggi_asli, 3.0)
        self.skala = max(1.0, skala_maks)
        lebar_tampil = int(self.lebar_asli * self.skala)
        tinggi_tampil = int(self.tinggi_asli * self.skala)

        # Resize untuk tampilan
        img_tampil = self.img_asli.resize((lebar_tampil, tinggi_tampil), Image.NEAREST)
        
        # Kalau ada transparency, tambah background checker (kotak abu-abu putih)
        if img_tampil.mode in ('RGBA', 'LA'):
            checker = self.buat_checker(lebar_tampil, tinggi_tampil)
            checker.paste(img_tampil, mask=img_tampil.split()[3])
            img_tampil = checker

        self.photo = ImageTk.PhotoImage(img_tampil)

        # Canvas untuk tampilkan gambar
        self.canvas = tk.Canvas(
            root, 
            width=lebar_tampil, 
            height=tinggi_tampil,
            cursor="crosshair"
        )
        self.canvas.pack(side=tk.TOP)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.photo)

        # Label status di bawah
        self.label_status = tk.Label(
            root, 
            text="Klik KIRI ATAS frame pertama",
            font=("Consolas", 12),
            bg="#1e293b", fg="#e2e8f0",
            pady=8
        )
        self.label_status.pack(fill=tk.X)

        self.label_info = tk.Label(
            root,
            text=f"Skala tampilan: {self.skala:.1f}x  |  Asli: {self.lebar_asli}×{self.tinggi_asli}px  |  [R] Reset  |  [Q] Keluar",
            font=("Consolas", 10),
            bg="#0f172a", fg="#64748b",
            pady=4
        )
        self.label_info.pack(fill=tk.X)

        # State klik
        self.klik1 = None       # Klik pertama (kiri atas)
        self.rect_preview = None
        self.frame_ke = 0
        self.mode = "walk"      # walk / attack / idle
        self.hasil_frames = []

        # Event
        self.canvas.bind("<Button-1>", self.on_klik)
        self.canvas.bind("<Motion>", self.on_gerak)
        root.bind("<r>", self.reset)
        root.bind("<R>", self.reset)
        root.bind("<q>", lambda e: root.quit())
        root.bind("<Q>", lambda e: root.quit())

        self.root.configure(bg="#1e293b")

    def buat_checker(self, w, h):
        """Buat background kotak-kotak abu putih untuk background transparan"""
        checker = Image.new("RGB", (w, h), (200, 200, 200))
        for y in range(0, h, 16):
            for x in range(0, w, 16):
                if (x // 16 + y // 16) % 2 == 0:
                    for py in range(min(16, h - y)):
                        for px in range(min(16, w - x)):
                            checker.putpixel((x + px, y + py), (240, 240, 240))
        return checker

    def layar_ke_asli(self, lx, ly):
        """Konversi koordinat layar (tampilan) ke koordinat asli file PNG"""
        return int(lx / self.skala), int(ly / self.skala)

    def on_gerak(self, event):
        """Tampilkan koordinat real-time saat mouse bergerak"""
        ax, ay = self.layar_ke_asli(event.x, event.y)
        info = f"Skala tampilan: {self.skala:.1f}x  |  Asli: {self.lebar_asli}×{self.tinggi_asli}px  |  Kursor: x={ax}, y={ay}  |  [R] Reset  |  [Q] Keluar"
        self.label_info.config(text=info)

        # Preview kotak saat klik 1 sudah ada
        if self.klik1 and self.rect_preview:
            x1_l = self.klik1[0] * self.skala
            y1_l = self.klik1[1] * self.skala
            self.canvas.coords(self.rect_preview, x1_l, y1_l, event.x, event.y)

    def on_klik(self, event):
        ax, ay = self.layar_ke_asli(event.x, event.y)

        if self.klik1 is None:
            # KLIK PERTAMA — pojok kiri atas
            self.klik1 = (ax, ay)
            # Gambar titik merah
            r = 4
            self.canvas.create_oval(
                event.x - r, event.y - r, event.x + r, event.y + r,
                fill="red", outline="white", width=1, tags="marker"
            )
            # Mulai preview kotak
            self.rect_preview = self.canvas.create_rectangle(
                event.x, event.y, event.x, event.y,
                outline="#f59e0b", width=2, dash=(4, 4), tags="marker"
            )
            self.label_status.config(
                text=f"✅ Klik 1: x={ax}, y={ay}  →  Sekarang klik KANAN BAWAH frame",
                fg="#4ade80"
            )

        else:
            # KLIK KEDUA — pojok kanan bawah
            x1, y1 = self.klik1
            x2, y2 = ax, ay

            # Pastikan urutan benar (kiri atas ke kanan bawah)
            if x2 < x1: x1, x2 = x2, x1
            if y2 < y1: y1, y2 = y2, y1

            w = x2 - x1
            h = y2 - y1

            self.frame_ke += 1
            self.hasil_frames.append((x1, y1, w, h))

            # Gambar kotak final berwarna hijau
            lx1 = x1 * self.skala
            ly1 = y1 * self.skala
            lx2 = x2 * self.skala
            ly2 = y2 * self.skala
            self.canvas.create_rectangle(lx1, ly1, lx2, ly2, outline="#4ade80", width=2, tags="marker")
            self.canvas.create_text(
                lx1 + 3, ly1 + 3, 
                anchor=tk.NW, 
                text=str(self.frame_ke), 
                fill="#f59e0b", 
                font=("Consolas", 10, "bold"),
                tags="marker"
            )

            # Cetak hasil ke terminal
            self.cetak_hasil(x1, y1, w, h)

            # Reset klik pertama untuk frame berikutnya
            self.klik1 = None
            self.rect_preview = None
            self.label_status.config(
                text=f"Frame {self.frame_ke} disimpan ✅ → Klik frame berikutnya (atau R untuk reset semua)",
                fg="#93c5fd"
            )

    def cetak_hasil(self, x, y, w, h):
        """Cetak koordinat dalam format JavaScript"""
        anchor_x = 0.5
        anchor_y = 0.5
        print(f"\n  Frame {self.frame_ke}:")
        print(f"  {{ x: {x:>4}, y: {y:>4}, w: {w:>4}, h: {h:>4}, anchorX: {anchor_x}, anchorY: {anchor_y} }},")
        
        # Kalau sudah ada beberapa frame, tampilkan rangkuman
        if len(self.hasil_frames) >= 2:
            print(f"\n  -- RANGKUMAN {len(self.hasil_frames)} FRAME --")
            for i, (fx, fy, fw, fh) in enumerate(self.hasil_frames):
                print(f"  Frame {i+1}: x={fx}, y={fy}, w={fw}, h={fh}")

    def reset(self, event=None):
        self.klik1 = None
        self.rect_preview = None
        self.frame_ke = 0
        self.hasil_frames = []
        self.canvas.delete("marker")
        self.label_status.config(
            text="Reset! Klik KIRI ATAS frame pertama",
            fg="#e2e8f0"
        )
        print("\n🔄 Reset - mulai dari awal\n")


def main():
    root = tk.Tk()
    app = SpriteCutter(root, NAMA_FILE)
    root.mainloop()

    # Setelah selesai, cetak output JavaScript lengkap
    if app.hasil_frames:
        print("\n" + "=" * 55)
        print(f"📋 OUTPUT JAVASCRIPT LENGKAP untuk '{NAMA_KEY}':")
        print("=" * 55)
        
        if len(app.hasil_frames) == 1:
            x, y, w, h = app.hasil_frames[0]
            print(f"  idle: {{ x: {x:>4}, y: {y:>4}, w: {w:>4}, h: {h:>4}, anchorX: 0.5, anchorY: 0.5 }},")
        
        elif len(app.hasil_frames) > 1:
            print(f"  walk: [")
            for i, (x, y, w, h) in enumerate(app.hasil_frames):
                print(f"    {{ x: {x:>4}, y: {y:>4}, w: {w:>4}, h: {h:>4}, anchorX: 0.5, anchorY: 0.5 }},  // Frame {i+1}")
            print(f"  ],")
        
        print("=" * 55)


if __name__ == "__main__":
    main()
