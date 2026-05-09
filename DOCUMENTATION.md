# LaptopPilih - Documentation

Sistem Pendukung Keputusan (SPK) Rekomendasi Laptop Mahasiswa menggunakan Metode **SAW (Simple Additive Weighting)**.

## 1. Rumus Metode SAW

Metode SAW juga dikenal sebagai metode penjumlahan terbobot. Konsep dasar metode SAW adalah mencari penjumlahan terbobot dari rating kinerja pada setiap alternatif pada semua atribut.

### Langkah 1: Normalisasi Matriks (R)
Nilai rating kinerja ternormalisasi (r_ij) dihitung dengan:
- **Kriteria Benefit (Keuntungan):** `r_ij = x_ij / max(x_j)`
- **Kriteria Cost (Biaya):** `r_ij = min(x_j) / x_ij`

Keterangan:
- `x_ij`: nilai kriteria laptop ke-i ke-j.
- `max(x_j)`: nilai terbesar dari kriteria j.
- `min(x_j)`: nilai terkecil dari kriteria j.

### Langkah 2: Perhitungan Nilai Preferensi (V)
Nilai preferensi untuk setiap alternatif (V_i) dihitung dengan:
`V_i = Σ(w_j * r_ij)`

Keterangan:
- `w_j`: bobot kriteria j.
- `r_ij`: nilai normalisasi kriteria j.
- `V_i`: nilai akhir alternatif i (skor ranking).

---

## 2. Kriteria & Bobot
Sistem ini menggunakan 7 kriteria utama:
1. **C1 - Harga** (Cost): 20%
2. **C2 - RAM** (Benefit): 15%
3. **C3 - Processor** (Benefit): 20%
4. **C4 - VGA/GPU** (Benefit): 15%
5. **C5 - Storage** (Benefit): 10%
6. **C6 - Baterai** (Benefit): 10%
7. **C7 - Berat** (Cost): 10%

*Note: Bobot dapat berubah otomatis berdasarkan profil penggunaan (Pengembang, Desainer, dll).*

---

## 3. Database Schema (ERD)

### Users
- `id` (PK, Int)
- `email` (String, Unique)
- `password` (Hashed String)
- `role` (Enum: admin, mahasiswa)

### Laptops
- `id` (PK, Int)
- `brand` (String)
- `model` (String)
- `price` (Int)
- `ram` (Int)
- `cpu_score` (Int)
- `gpu_score` (Int)
- `storage` (Int)
- `battery` (Int)
- `weight` (Float)
- `image_url` (String)

### Criteria
- `id` (PK, Int)
- `code` (String, Unique)
- `name` (String)
- `type` (Enum: benefit, cost)
- `weight` (Float)

---

## 4. Diagram Alir (Flowchart)

1. **Start**
2. **Login/Register**
3. **Role Check?**
   - **Admin**: Kelola Laptop & Bobot -> Simpan -> Database.
   - **Mahasiswa**: Pilih Kebutuhan & Budget -> Hitung SAW -> Tampilkan Ranking -> Selesai.
4. **End**

---

## 5. Struktur Folder Proyek
```text
/
├── server.ts           # Express + SQLite Backend & API
├── spk_laptop.db       # Database SQLite (File Physical)
├── package.json        # Dependencies & Scripts
├── index.html          # Frontend Entry
├── src/
│   ├── App.tsx         # Routing & Auth State
│   ├── main.tsx        # React Root
│   ├── types.ts        # TS Interfaces
│   ├── lib/
│   │   └── utils.ts    # Formatting & CN helpers
│   └── pages/
│       ├── Auth.tsx      # Login & Reset UI
│       ├── Dashboard.tsx # Student/Mahasiswa View
│       └── Admin.tsx     # Admin Management View
└── ...config files
```
