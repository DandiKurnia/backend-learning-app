# Tutorial Questions Options Service Documentation

## Overview

Service untuk mengelola pilihan jawaban (options) untuk setiap pertanyaan tutorial.

**Service File:** `src/services/prisma/tutorial_questions_options.js`

---

## Functions

### 1. `getAllTutorialQuestionsOptions(req)`

**Deskripsi:** Mendapatkan semua pilihan jawaban untuk sebuah pertanyaan.

**Parameters:**

- `req` (Request) - Express request object dengan `params.questionId`

**Returns:** Array of option objects

**Throws:**

- `NotFoundError` - Jika pertanyaan tidak ditemukan

**Example:**

```javascript
// GET /api/questions/10/options
const options = await getAllTutorialQuestionsOptions(req);
```

---

### 2. `getTutorialQuestionOption(req)`

**Deskripsi:** Mendapatkan detail satu pilihan jawaban berdasarkan ID.

**Parameters:**

- `req` (Request) - Express request object dengan `params.optionId`

**Returns:** Object option

**Throws:**

- `NotFoundError` - Jika option tidak ditemukan

**Example:**

```javascript
// GET /api/questions/10/options/5
const option = await getTutorialQuestionOption(req);
```

---

### 3. `createTutorialQuestionOption(req)`

**Deskripsi:** Membuat pilihan jawaban baru (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.questionId` (number)
  - `body`:
    - `option_label` (string) - Label opsi (e.g., "A", "B")
    - `option_text` (string) - Teks jawaban
    - `is_correct` (boolean) - Apakah ini jawaban benar

**Returns:** Object option yang baru dibuat

**Throws:**

- `NotFoundError` - Jika pertanyaan tidak ditemukan
- `BadRequestError` - Jika option dengan label/text yang sama sudah ada

**Example:**

```javascript
// POST /api/questions/10/options
// Body:
{
  "option_label": "A",
  "option_text": "Hyper Text Markup Language",
  "is_correct": true
}
```

---

### 4. `updateTutorialQuestionOption(req)`

**Deskripsi:** Update pilihan jawaban yang sudah ada (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan `params.optionId` dan data di `body`

**Returns:** Object option yang sudah diupdate

**Throws:**

- `NotFoundError` - Jika option tidak ditemukan
- `BadRequestError` - Jika update menyebabkan duplikasi

**Example:**

```javascript
// PUT /api/questions/10/options/5
// Body:
{
  "option_text": "Hypertext Markup Language",
  "is_correct": true
}
```

---

### 5. `deleteTutorialQuestionOption(req)`

**Deskripsi:** Hapus pilihan jawaban (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan `params.optionId`

**Returns:** Object option yang dihapus

**Throws:**

- `NotFoundError` - Jika option tidak ditemukan

**Example:**

```javascript
// DELETE /api/questions/10/options/5
await deleteTutorialQuestionOption(req);
```

---

## Notes untuk Frontend

1. **Multiple Options:** Satu pertanyaan biasanya memiliki 4 opsi (A, B, C, D).
2. **Correct Answer:** Pastikan user (admin) hanya menandai satu jawaban sebagai benar (walaupun di DB bisa multiple, logic UI sebaiknya membatasi).
3. **Display:** Tampilkan opsi sesuai urutan label atau ID.

---

## API Endpoints

| Method | Endpoint                                       | Function                         | Auth     |
| ------ | ---------------------------------------------- | -------------------------------- | -------- |
| GET    | `/api/questions/:questionId/options`           | `getAllTutorialQuestionsOptions` | ✅       |
| GET    | `/api/questions/:questionId/options/:optionId` | `getTutorialQuestionOption`      | ✅       |
| POST   | `/api/questions/:questionId/options`           | `createTutorialQuestionOption`   | ✅ Admin |
| PUT    | `/api/questions/:questionId/options/:optionId` | `updateTutorialQuestionOption`   | ✅ Admin |
| DELETE | `/api/questions/:questionId/options/:optionId` | `deleteTutorialQuestionOption`   | ✅ Admin |
