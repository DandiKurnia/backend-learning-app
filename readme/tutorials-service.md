# Developer Journey Tutorials Service Documentation

## Overview

Service untuk mengelola tutorial dalam sebuah journey.

**Service File:** `src/services/prisma/developer_journey_tutorials.js`

---

## Functions

### 1. `getAllTutorialsService(req)`

**Deskripsi:** Mendapatkan semua tutorial dalam sebuah journey.

**Parameters:**

- `req` (Request) - Express request object dengan `params.developerJourneyId`

**Returns:** Array of tutorial objects

**Throws:**

- `NotFoundError` - Jika journey tidak ditemukan

**Example:**

```javascript
// GET /api/journeys/1/tutorials
const tutorials = await getAllTutorialsService(req);
```

---

### 2. `getTutorialByIdService(req)`

**Deskripsi:** Mendapatkan detail tutorial berdasarkan ID.

**Parameters:**

- `req` (Request) - Express request object dengan `params.tutorialId` dan `params.developerJourneyId`

**Returns:** Object tutorial

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan

**Example:**

```javascript
// GET /api/journeys/1/tutorials/5
const tutorial = await getTutorialByIdService(req);
```

---

### 3. `createTutorialService(req)`

**Deskripsi:** Membuat tutorial baru dalam journey (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan:
  - `params.developerJourneyId` (number)
  - `body`:
    - `title` (string) - Judul tutorial
    - `content` (string) - Konten tutorial (markdown/HTML)
    - `video_url` (string) - URL video tutorial (optional)
    - `duration` (number) - Durasi tutorial dalam menit

**Returns:** Object tutorial yang baru dibuat

**Throws:**

- `NotFoundError` - Jika journey tidak ditemukan

**Example:**

```javascript
// POST /api/journeys/1/tutorials
// Body:
{
  "title": "Introduction to Node.js",
  "content": "# Node.js Basics\n\nNode.js is...",
  "video_url": "https://youtube.com/watch?v=...",
  "duration": 45
}
```

---

### 4. `updateTutorialService(req)`

**Deskripsi:** Update tutorial yang sudah ada (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan `params.tutorialId` dan data di `body`

**Returns:** Object tutorial yang sudah diupdate

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan

**Example:**

```javascript
// PUT /api/journeys/1/tutorials/5
// Body:
{
  "title": "Advanced Node.js Concepts",
  "duration": 60
}
```

---

### 5. `deleteTutorialService(req)`

**Deskripsi:** Hapus tutorial (Admin only).

**Parameters:**

- `req` (Request) - Express request object dengan `params.tutorialId`

**Returns:** Object tutorial yang dihapus

**Throws:**

- `NotFoundError` - Jika tutorial tidak ditemukan

**Example:**

```javascript
// DELETE /api/journeys/1/tutorials/5
await deleteTutorialService(req);
```

---

## Notes untuk Frontend

1. **Tutorial Order:** Tampilkan tutorial berdasarkan urutan creation atau tambahkan field `order`
2. **Video Player:** Embed video dari `video_url` menggunakan iframe atau video player
3. **Markdown Rendering:** Gunakan markdown parser untuk render `content`
4. **Duration Display:** Format durasi dalam format yang user-friendly (e.g., "45 min")
5. **Progress Tracking:** Track tutorial completion status per user

---

## API Endpoints

| Method | Endpoint                                 | Function                 | Auth     |
| ------ | ---------------------------------------- | ------------------------ | -------- |
| GET    | `/api/journeys/:journeyId/tutorials`     | `getAllTutorialsService` | ✅       |
| GET    | `/api/journeys/:journeyId/tutorials/:id` | `getTutorialByIdService` | ✅       |
| POST   | `/api/journeys/:journeyId/tutorials`     | `createTutorialService`  | ✅ Admin |
| PUT    | `/api/journeys/:journeyId/tutorials/:id` | `updateTutorialService`  | ✅ Admin |
| DELETE | `/api/journeys/:journeyId/tutorials/:id` | `deleteTutorialService`  | ✅ Admin |
