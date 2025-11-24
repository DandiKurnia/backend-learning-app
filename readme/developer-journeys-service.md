# Developer Journeys Service Documentation

## Overview

Service untuk mengelola learning journey/path yang tersedia.

**Service File:** `src/services/prisma/developer_journeys.js`

---

## Functions

### 1. `getAllDeveloperJourneysService()`

**Deskripsi:** Mendapatkan semua developer journeys yang tersedia.

**Parameters:** None

**Returns:** Array of journey objects

**Example:**

```javascript
const journeys = await getAllDeveloperJourneysService();
// [{ id: 1, name: "Backend Developer", summary: "...", ... }]
```

---

### 2. `getDeveloperJourneyByIdService(id)`

**Deskripsi:** Mendapatkan detail journey berdasarkan ID.

**Parameters:**

- `id` (number) - ID journey

**Returns:** Object journey

**Throws:**

- `NotFoundError` - Jika journey tidak ditemukan

**Example:**

```javascript
const journey = await getDeveloperJourneyByIdService(1);
```

---

### 3. `createDeveloperJourneyService(data)`

**Deskripsi:** Membuat journey baru (Admin only).

**Parameters:**

- `data` (Object):
  - `name` (string) - Nama journey
  - `summary` (string) - Deskripsi journey
  - `point` (number) - Point yang diberikan
  - `required_point` (number) - Point yang dibutuhkan untuk unlock
  - `xp` (number) - XP yang diberikan
  - `required_xp` (number) - XP yang dibutuhkan untuk unlock
  - `status` (string) - Status journey (active/inactive)
  - `listed` (boolean) - Apakah ditampilkan di list
  - `dead_line` (date) - Deadline journey (optional)

**Returns:** Object journey yang baru dibuat

**Example:**

```javascript
const journeyData = {
  name: "Frontend Developer",
  summary: "Learn modern frontend development",
  point: 100,
  required_point: 0,
  xp: 500,
  required_xp: 0,
  status: "active",
  listed: true,
  dead_line: new Date("2025-12-31"),
};
const newJourney = await createDeveloperJourneyService(journeyData);
```

---

### 4. `updateDeveloperJourneyService(id, data)`

**Deskripsi:** Update journey yang sudah ada (Admin only).

**Parameters:**

- `id` (number) - ID journey
- `data` (Object) - Data yang akan diupdate (sama seperti create)

**Returns:** Object journey yang sudah diupdate

**Throws:**

- `NotFoundError` - Jika journey tidak ditemukan

**Example:**

```javascript
const updatedJourney = await updateDeveloperJourneyService(1, {
  name: "Advanced Backend Developer",
  point: 150,
});
```

---

## Notes untuk Frontend

1. **Public Access:** `getAllDeveloperJourneysService` bisa diakses tanpa auth
2. **Admin Only:** Create dan Update hanya untuk admin
3. **Journey Status:** Filter journey berdasarkan status untuk menampilkan yang active
4. **Prerequisites:** Check `required_point` dan `required_xp` untuk unlock logic
5. **Deadline:** Tampilkan countdown jika ada deadline

---

## API Endpoints

| Method | Endpoint            | Function                         | Auth     |
| ------ | ------------------- | -------------------------------- | -------- |
| GET    | `/api/journeys`     | `getAllDeveloperJourneysService` | ❌       |
| GET    | `/api/journeys/:id` | `getDeveloperJourneyByIdService` | ✅       |
| POST   | `/api/journeys`     | `createDeveloperJourneyService`  | ✅ Admin |
| PUT    | `/api/journeys/:id` | `updateDeveloperJourneyService`  | ✅ Admin |
