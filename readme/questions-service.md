# Tutorial Questions Service Documentation

## Overview

Service untuk mengelola pertanyaan quiz/exam dalam tutorial.

**Service File:** `src/services/prisma/developer_journey_tutorial_questions.js`

---

## Functions

### 1. `getAllTutorialQuestionsService(req)`

**Deskripsi:** Mendapatkan semua pertanyaan dalam sebuah tutorial.

**Parameters:**

- `req` (Request) - Express request object dengan `params.tutorialId`

**Returns:** Array of question objects

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan

**Example:**

```javascript
// GET /api/tutorials/5/questions
const questions = await getAllTutorialQuestionsService(req);
```

---

### 2. `getTutorialQuestionByIdService(req)`

**Deskripsi:** Mendapatkan detail pertanyaan berdasarkan ID.

**Parameters:**

- `req` (Request) - Express request object dengan `params.questionId` dan `params.tutorialId`

**Returns:** Object question dengan options

**Throws:**

- `NotFoundError` - Jika question tidak ditemukan

**Example:**

```javascript
// GET /api/tutorials/5/questions/10
const question = await getTutorialQuestionByIdService(req);
```

---

### 3. `createTutorialQuestionService(req)`

**Deskripsi:** Membuat pertanyaan baru dalam tutorial (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.tutorialId` (number)
  - `body`:
    - `question_text` (string) - Teks pertanyaan
    - `position` (number) - Urutan pertanyaan

**Returns:** Object question yang baru dibuat

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan
- `BadRequestError` - Jika position sudah digunakan

**Example:**

```javascript
// POST /api/tutorials/5/questions
// Body:
{
  "question_text": "What is Node.js?",
  "position": 1
}
```

---

### 4. `updateTutorialQuestionService(req)`

**Deskripsi:** Update pertanyaan yang sudah ada (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan `params.questionId` dan data di `body`

**Returns:** Object question yang sudah diupdate

**Throws:**

- `NotFoundError` - Jika question tidak ditemukan

**Example:**

```javascript
// PUT /api/tutorials/5/questions/10
// Body:
{
  "question_text": "What is Node.js and why is it popular?",
  "position": 2
}
```

---

### 5. `deleteTutorialQuestionService(req)`

**Deskripsi:** Hapus pertanyaan (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan `params.questionId`

**Returns:** Object question yang dihapus

**Throws:**

- `NotFoundError` - Jika question tidak ditemukan

**Example:**

```javascript
// DELETE /api/tutorials/5/questions/10
await deleteTutorialQuestionService(req);
```

---

## Notes untuk Frontend

1. **Question Order:** Tampilkan pertanyaan berdasarkan `position` (ascending)
2. **Options:** Setiap question memiliki multiple options (lihat Options Service)
3. **Question Types:** Saat ini hanya support multiple choice
4. **Validation:** Pastikan setiap question memiliki minimal 2 options
5. **Correct Answer:** Hanya 1 option yang `is_correct = true`

---

## API Endpoints

| Method | Endpoint                                   | Function                         | Auth     |
| ------ | ------------------------------------------ | -------------------------------- | -------- |
| GET    | `/api/tutorials/:tutorialId/questions`     | `getAllTutorialQuestionsService` | ✅       |
| GET    | `/api/tutorials/:tutorialId/questions/:id` | `getTutorialQuestionByIdService` | ✅       |
| POST   | `/api/tutorials/:tutorialId/questions`     | `createTutorialQuestionService`  | ✅ Admin |
| PUT    | `/api/tutorials/:tutorialId/questions/:id` | `updateTutorialQuestionService`  | ✅ Admin |
| DELETE | `/api/tutorials/:tutorialId/questions/:id` | `deleteTutorialQuestionService`  | ✅ Admin |
