# Sistem Analisis Gaya Belajar dengan Machine Learning

## Gambaran Umum

Sistem ini menganalisis gaya belajar pengguna secara berkala menggunakan model Machine Learning. Analisis dilakukan setiap bulan dan hasilnya disimpan dalam database untuk referensi personalisasi pembelajaran.

## Arsitektur Sistem

```
┌─────────────────┐    Data Agregasi    ┌────────────────────┐
│   Express App   │ ──────────────────▶ │   Flask ML Model   │
│ (Orchestrator)  │ ◀────────────────── │   (Inference Only) │
└─────────────────┘    Prediksi         └────────────────────┘
       │
       ▼
┌─────────────────┐
│  PostgreSQL DB  │
│                 │
│ UserLearningStyle│
└─────────────────┘
```

## Komponen Utama

### 1. Model Prisma: UserLearningStyle

Model ini menyimpan hasil prediksi gaya belajar bulanan untuk setiap pengguna.

**Field-field:**

- `user_id`: ID pengguna
- `period`: Periode analisis (tanggal pertama bulan)
- `learning_style`: Gaya belajar (Fast Learner / Reflective / Consistent)
- `description`: Deskripsi gaya belajar untuk pengguna
- `recommendations`: Rekomendasi belajar dalam format JSON
- `avg_completion_ratio`: Rasio penyelesaian rata-rata sebagai dasar prediksi
- `created_at`: Timestamp pembuatan

**Constraint:**

- Relasi ke model User
- Constraint unik pada kombinasi `user_id` dan `period`

### 2. Cron Job Bulanan

Berjalan otomatis setiap tanggal 1 pukul 02:00 pagi untuk memproses data gaya belajar.

**Langkah-langkah:**

1. Mengambil data dari 1 bulan sebelumnya
2. Melakukan agregasi data per pengguna:
   - `module_count`: Jumlah modul yang diikuti
   - `total_study_duration`: Total durasi belajar dalam satuan menit
   - `avg_study_per_module`: Rata-rata durasi belajar per modul dalam satuan menit
   - `avg_completion_ratio`: Rasio penyelesaian rata-rata (dihitung berdasarkan durasi belajar dibagi durasi yang direncanakan per modul)
   - `avg_submission_rating`: Rating rata-rata pengumpulan tugas
3. Mengirim data agregasi ke Flask API
4. Menerima hasil prediksi dari ML service
5. Menyimpan hasil ke tabel `UserLearningStyle`

### 3. Endpoint Manual Trigger

Endpoint API untuk memicu proses secara manual:

```
POST /api/process-learning-style
```

**Parameter:**

```json
{
  "period": "2025-01" // Format: YYYY-MM
}
```

**Response:**

```json
{
  "data": {
    "processedUsers": 45,
    "period": "2025-01",
    "status": "success",
    "message": "Processed 45 users"
  },
  "status": 200,
  "message": "Learning style processing completed"
}
```

## Alur Sistem

1. **Agregasi Data**: Setiap bulan, sistem mengumpulkan data aktivitas belajar pengguna selama sebulan sebelumnya
2. **Pengolahan Data**: Data diolah menjadi metrik yang relevan untuk prediksi
3. **Prediksi ML**: Data dikirim ke Flask service untuk inferensi
4. **Penyimpanan Hasil**: Hasil prediksi disimpan dalam database
5. **Pemanfaatan Data**: Data dapat digunakan untuk personalisasi pengalaman belajar

## Pengaturan Environment

Tambahkan variabel berikut ke file `.env`:

```env
ML_API_URL=http://localhost:5001  # URL service Flask ML
```

## Struktur Direktori

```
src/
├── api/
│   └── user_learning_styles/
│       ├── controller.js
│       └── router.js
├── cron/
│   └── learning_style_cron.js
├── services/prisma/
│   └── user_learning_styles.js
└── app.js
```

## Prinsip Desain

1. **Flask API TIDAK mengakses database** - Semua operasi database ditangani oleh Express
2. **Flask API TIDAK melakukan training ulang** - Hanya digunakan untuk inferensi
3. **Model ML bersifat read-only** - Tidak ada modifikasi model saat runtime
4. **Express bertindak sebagai orchestrator data** - Mengelola alur kerja keseluruhan
5. **Prediksi TIDAK dilakukan setiap hari** - Hanya dilakukan secara berkala (bulanan)
6. **Model retrain dilakukan TERPISAH** - Proses retraining dilakukan terpisah dan tidak bagian dari sistem ini

## Pengujian

Untuk menguji sistem:

1. Pastikan service Flask ML berjalan
2. Gunakan endpoint manual untuk memicu proses:
   ```
   curl -X POST http://localhost:5000/api/process-learning-style \
        -H "Content-Type: application/json" \
        -d '{"period": "2025-01"}'
   ```

## Maintenance

- Pastikan cron job berjalan dengan benar
- Monitor log untuk error dalam proses prediksi
- Pastikan service Flask ML selalu tersedia saat cron job berjalan
