# Developer Journeys Service Documentation

## Overview

Service untuk mengelola perjalanan pengembang (Developer Journeys) termasuk durasi yang direncanakan untuk setiap perjalanan.

**Service File:** `src/services/prisma/developer_journeys.js`

---

## Functions

### 1. `createJourney(req)`

**Deskripsi:** Membuat perjalanan pengembang baru dengan durasi yang direncanakan.

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `body.name` (string) - Nama perjalanan
  - `body.summary` (string) - Ringkasan perjalanan
  - `body.point` (number) - Poin perjalanan
  - `body.required_point` (number) - Poin yang dibutuhkan
  - `body.xp` (number) - XP perjalanan
  - `body.required_xp` (number) - XP yang dibutuhkan
  - `body.status` (number) - Status perjalanan
  - `body.listed` (number) - Status publikasi
  - `body.duration` (number) - Durasi yang direncanakan dalam JAM (akan dikonversi ke menit)
  - `body.dead_line` (date) - Tanggal tenggat waktu

**Returns:** Object developer journey

### 2. `updateJourney(req)`

**Deskripsi:** Memperbarui perjalanan pengembang yang sudah ada termasuk durasi yang direncanakan.

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.id` (number) - ID perjalanan yang akan diperbarui
  - `body.name` (string) - Nama perjalanan
  - `body.summary` (string) - Ringkasan perjalanan
  - `body.point` (number) - Poin perjalanan
  - `body.required_point` (number) - Poin yang dibutuhkan
  - `body.xp` (number) - XP perjalanan
  - `body.required_xp` (number) - XP yang dibutuhkan
  - `body.status` (number) - Status perjalanan
  - `body.listed` (number) - Status publikasi
  - `body.duration` (number) - Durasi yang direncanakan dalam JAM (akan dikonversi ke menit)
  - `body.dead_line` (date) - Tanggal tenggat waktu

**Returns:** Object developer journey

### 3. `getAllJourneys()`

**Deskripsi:** Mengambil semua perjalanan pengembang.

**Returns:** Array of developer journey objects

### 4. `getOneJourney(req)`

**Deskripsi:** Mengambil satu perjalanan pengembang berdasarkan ID.

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.id` (number) - ID perjalanan

**Returns:** Object developer journey

### 5. `deleteJourney(req)`

**Deskripsi:** Menghapus perjalanan pengembang berdasarkan ID.

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.id` (number) - ID perjalanan

**Returns:** Object developer journey yang dihapus

---

## Field Details

### `duration` Field

- **Tipe:** Integer
- **Satuan:** Menit (disimpan dalam database)
- **Input:** Jam (dikonversi otomatis ke menit)
- **Default:** 0
- **Deskripsi:** Durasi yang direncanakan untuk menyelesaikan perjalanan ini. Digunakan untuk menghitung rasio penyelesaian dalam analisis gaya belajar.

**Contoh:**

```
{
  "duration": 40 // 40 jam, akan disimpan sebagai 2400 menit
}
```

---

## Notes untuk Frontend

1. **Durasi:** Kirim durasi dalam satuan JAM (akan dikonversi ke menit secara otomatis)
2. **Konsistensi:** Durasi disimpan dalam menit untuk konsistensi dengan `study_duration`
3. **Validasi:** Pastikan durasi adalah angka positif

---

## API Endpoints

| Method | Endpoint            | Function         | Auth |
| ------ | ------------------- | ---------------- | ---- |
| GET    | `/api/journeys`     | `getAllJourneys` | ✅   |
| POST   | `/api/journeys`     | `createJourney`  | ✅   |
| GET    | `/api/journeys/:id` | `getOneJourney`  | ✅   |
| PUT    | `/api/journeys/:id` | `updateJourney`  | ✅   |
| DELETE | `/api/journeys/:id` | `deleteJourney`  | ✅   |
