# Developer Journey Completions Service Documentation

## Overview

Service untuk mengelola pelacakan durasi belajar dan penyelesaian perjalanan pengembang oleh user.

**Service File:** `src/services/prisma/developer_journey_completions.js`

---

## Functions

### 1. `createStudyDuration(req)`

**Deskripsi:** Mencatat durasi belajar user untuk suatu perjalanan pengembang. Jika user sudah pernah mencatat durasi untuk perjalanan ini, durasi baru akan ditambahkan ke durasi yang sudah ada.

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.journeyId` (number) - ID perjalanan pengembang
  - `user.userId` (number) - ID user yang sedang login
  - `body.duration` (number) - Durasi belajar dalam satuan detik

**Returns:** Object developer journey completion

- `id`: ID record completion
- `user_id`: ID user
- `journey_id`: ID perjalanan
- `study_duration`: Total durasi belajar dalam detik
- `enrolling_times`: Jumlah kali user mencatat durasi
- `enrollments_at`: Waktu pertama kali user mencatat durasi
- `last_enrolled_at`: Waktu terakhir user mencatat durasi

**Throws:**

- `BadRequestError` - Jika durasi tidak valid atau perjalanan tidak ditemukan
- `NotFoundError` - Jika perjalanan tidak ditemukan

**Example:**

```javascript
// POST /api/journeys/5/study-duration
// Request body: { "duration": 180 }
const completion = await createStudyDuration(req);
// completion = {
//   id: 10,
//   user_id: 101,
//   journey_id: 5,
//   study_duration: 360, // 6 menit total (180 detik baru + 180 detik sebelumnya)
//   enrolling_times: 2,
//   enrollments_at: "2023-01-01T10:00:00.000Z",
//   last_enrolled_at: "2023-01-01T10:30:00.000Z"
// }
```

---

## Logic

1. Validasi input durasi (harus angka positif)
2. Cek apakah perjalanan dengan ID tersebut ada
3. Cari apakah user sudah pernah mencatat durasi untuk perjalanan ini
4. Jika belum ada record:
   - Buat record baru
   - Set `enrolling_times` = 1
   - Set `enrollments_at` = waktu sekarang
   - Set `last_enrolled_at` = waktu sekarang
   - Set `study_duration` = durasi dari request
5. Jika sudah ada record:
   - Update record yang ada
   - Tambahkan durasi baru ke `study_duration` yang sudah ada
   - Update `last_enrolled_at` = waktu sekarang
   - `enrolling_times` dan `enrollments_at` tetap (tidak berubah)

---

## Notes untuk Frontend

1. **Durasi:** Kirim durasi dalam satuan detik
2. **Akumulasi:** Durasi akan terus terakumulasi setiap kali user mengirim durasi
3. **Timestamp:** Gunakan `last_enrolled_at` untuk mengetahui kapan terakhir user belajar
4. **Progress Tracking:** Gunakan `study_duration` untuk menampilkan progress belajar user
5. **Frequency:** `enrolling_times` menunjukkan berapa kali user mencatat durasi belajar

---

## API Endpoints

| Method | Endpoint                                | Function            | Auth |
| ------ | --------------------------------------- | ------------------- | ---- |
| POST   | `/api/journeys/:journeyId/study-duration` | `createStudyDuration` | ✅   |