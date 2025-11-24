# Exam Registrations Service Documentation

## Overview

Service untuk mengelola pendaftaran ujian, pengerjaan soal, dan penilaian.

**Service File:** `src/services/prisma/exam_registrations.js`

---

## Functions

### 1. `getAllExamRegistrationsService(req)`

**Deskripsi:** Mendapatkan riwayat pendaftaran ujian user untuk tutorial tertentu.

**Parameters:**

- `req` (Request) - Express request object dengan `params.tutorialId`

**Returns:** Array of exam registration objects

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan

**Example:**

```javascript
// GET /api/tutorials/5/exams
const exams = await getAllExamRegistrationsService(req);
```

---

### 2. `registerExamService(tutorialId, userId)`

**Deskripsi:** Mendaftarkan user untuk ujian baru. Jika ada ujian lama yang belum selesai, akan ditandai sebagai deleted (soft delete) dan membuat sesi baru.

**Parameters:**

- `tutorialId` (number) - ID tutorial
- `userId` (number) - ID user yang login

**Returns:** Object exam registration baru

- `status`: 'ongoing'
- `deadline_at`: Waktu sekarang + 30 menit

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan

**Example:**

```javascript
// POST /api/tutorials/5/exams/register
const newExam = await registerExamService(5, 101);
```

---

### 3. `submitBulkAnswersService(examId, answers)`

**Deskripsi:** Menyimpan jawaban user secara massal (bisa satu atau banyak sekaligus).

**Parameters:**

- `examId` (number) - ID registrasi ujian
- `answers` (Array of Objects):
  - `question_id` (number)
  - `option_id` (number)

**Returns:** Array of saved exam answers

**Logic:**

- Loop setiap jawaban.
- Cek apakah jawaban untuk soal tersebut sudah ada.
- Jika ada, update. Jika belum, create.
- Validasi apakah option tersebut valid.

**Example:**

```javascript
// POST /api/exams/25/answers/bulk
const answers = [
  { question_id: 10, option_id: 45 },
  { question_id: 11, option_id: 48 },
];
await submitBulkAnswersService(25, answers);
```

---

### 4. `finishExamService(examId)`

**Deskripsi:** Menyelesaikan ujian dan menghitung nilai akhir.

**Parameters:**

- `examId` (number) - ID registrasi ujian

**Returns:** Object exam result

- `total_questions`: Jumlah soal yang dijawab
- `score`: Nilai akhir (0-100)
- `is_passed`: Boolean (true jika score >= 70)

**Logic:**

- Ambil semua jawaban user untuk exam ini.
- Hitung jumlah jawaban benar.
- Hitung score: `(benar / total_soal) * 100`.
- Update status exam menjadi 'finished'.
- Simpan hasil ke tabel `ExamResult`.

**Example:**

```javascript
// POST /api/exams/25/finish
const result = await finishExamService(25);
```

---

## Notes untuk Frontend

1. **Exam Flow:**
   - User klik "Start Exam" -> Panggil `registerExamService`.
   - Frontend simpan `examId` dan `deadline_at`.
   - Tampilkan soal-soal.
   - User menjawab -> Bisa simpan per soal atau bulk saat klik "Next"/"Submit" menggunakan `submitBulkAnswersService`.
   - Waktu habis atau User klik "Finish" -> Panggil `finishExamService`.
2. **Timer:** Gunakan `deadline_at` dari response register untuk menampilkan hitung mundur.
3. **Auto Submit:** Jika waktu habis, otomatis panggil `finishExamService`.

---

## API Endpoints

| Method | Endpoint                                    | Function                         | Auth |
| ------ | ------------------------------------------- | -------------------------------- | ---- |
| GET    | `/api/tutorials/:tutorialId/exams`          | `getAllExamRegistrationsService` | ✅   |
| POST   | `/api/tutorials/:tutorialId/exams/register` | `registerExamService`            | ✅   |
| POST   | `/api/exams/:examId/answers/bulk`           | `submitBulkAnswersService`       | ✅   |
| POST   | `/api/exams/:examId/finish`                 | `finishExamService`              | ✅   |
