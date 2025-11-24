# Users Service Documentation

## Overview

Service untuk mengelola autentikasi dan manajemen user.

**Service File:** `src/services/prisma/users.js`

---

## Functions

### 1. `registerUserService(data)`

**Deskripsi:** Mendaftarkan user baru ke sistem.

**Parameters:**

- `data` (Object):
  - `display_name` (string) - Nama tampilan user
  - `name` (string) - Nama lengkap user
  - `email` (string) - Email user (harus unique)
  - `password` (string) - Password (akan di-hash)
  - `phone` (string) - Nomor telepon
  - `user_role` (number) - Role user (1 = admin, 2 = user, dll)

**Returns:** Object user yang baru dibuat (tanpa password)

**Throws:**

- `BadRequestError` - Jika email sudah terdaftar

**Example:**

```javascript
const userData = {
  display_name: "John Doe",
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123",
  phone: "081234567890",
  user_role: 2,
};
const newUser = await registerUserService(userData);
```

---

### 2. `loginUserService(email, password)`

**Deskripsi:** Login user dan generate access token + refresh token.

**Parameters:**

- `email` (string) - Email user
- `password` (string) - Password user

**Returns:** Object berisi:

- `accessToken` (string) - JWT token untuk autentikasi (expired 15 menit)
- `refreshToken` (string) - Token untuk refresh access token (expired 7 hari)

**Throws:**

- `UnauthorizedError` - Jika email tidak ditemukan atau password salah

**Example:**

```javascript
const tokens = await loginUserService("john@example.com", "securePassword123");
// tokens = { accessToken: "eyJ...", refreshToken: "eyJ..." }
```

---

### 3. `refreshAccessTokenService(refreshToken)`

**Deskripsi:** Generate access token baru menggunakan refresh token.

**Parameters:**

- `refreshToken` (string) - Refresh token yang valid

**Returns:** Object berisi:

- `accessToken` (string) - JWT token baru

**Throws:**

- `UnauthorizedError` - Jika refresh token invalid atau expired

**Example:**

```javascript
const newToken = await refreshAccessTokenService(oldRefreshToken);
// newToken = { accessToken: "eyJ..." }
```

---

### 4. `logoutUserService(refreshToken)`

**Deskripsi:** Logout user dengan menghapus refresh token dari database.

**Parameters:**

- `refreshToken` (string) - Refresh token yang akan dihapus

**Returns:** Object berisi pesan sukses

**Throws:**

- `NotFoundError` - Jika refresh token tidak ditemukan

**Example:**

```javascript
await logoutUserService(refreshToken);
```

---

## Notes untuk Frontend

1. **Access Token:** Simpan di memory/state (jangan di localStorage untuk keamanan)
2. **Refresh Token:** Simpan di httpOnly cookie atau secure storage
3. **Token Expiry:**
   - Access token: 15 menit
   - Refresh token: 7 hari
4. **Auto Refresh:** Implement auto-refresh sebelum access token expired
5. **Error Handling:** Handle 401 error untuk redirect ke login

---

## API Endpoints

| Method | Endpoint             | Function                    |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | `registerUserService`       |
| POST   | `/api/auth/login`    | `loginUserService`          |
| PUT    | `/api/auth/refresh`  | `refreshAccessTokenService` |
| DELETE | `/api/auth/logout`   | `logoutUserService`         |
