# Backend Learning App API

API documentation for the Backend Learning App.

Base URL: `https://api.danbildad.my.id`

## Authentication

Most endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Register User

**POST** `/api/auth/register`

Request body:

```json
{
  "display_name": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "user_role": "number"
}
```

### Login User

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "status": 200,
  "message": "Login successful"
}
```

### Refresh Access Token

**PUT** `/api/auth/refresh`

🔒 **Requires Authentication**

Request body:

```json
{
  "refreshToken": "string"
}
```

### Logout User

**DELETE** `/api/auth/logout`

🔒 **Requires Authentication**

Request body:

```json
{
  "refreshToken": "string"
}
```

---

## Developer Journeys

### Get All Journeys

**GET** `/api/journeys`

No authentication required (public endpoint).

### Create Journey

**POST** `/api/journeys`

🔒 **Requires Authentication**

Request body:

```json
{
  "name": "string",
  "summary": "string",
  "point": "number",
  "required_point": "number",
  "xp": "number",
  "required_xp": "number",
  "status": "string",
  "listed": "boolean",
  "dead_line": "date"
}
```

### Get Journey by ID

**GET** `/api/journeys/{id}`

🔒 **Requires Authentication**

### Update Journey

**PUT** `/api/journeys/{id}`

🔒 **Requires Authentication**

Request body:

```json
{
  "name": "string",
  "summary": "string",
  "point": "number",
  "required_point": "number",
  "xp": "number",
  "required_xp": "number",
  "status": "string",
  "listed": "boolean",
  "dead_line": "date"
}
```

### Delete Journey

**DELETE** `/api/journeys/{id}`

🔒 **Requires Authentication**

---

## Developer Journey Tutorials

### Get All Tutorials for a Journey

**GET** `/api/journeys/{developerJourneyId}/tutorials`

🔒 **Requires Authentication**

### Get Tutorial by ID

**GET** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

🔒 **Requires Authentication**

### Create Tutorial

**POST** `/api/journeys/{developerJourneyId}/tutorials`

🔒 **Requires Authentication**

Request body:

```json
{
  "title": "string",
  "content": "string",
  "video_url": "string",
  "duration": "number"
}
```

### Update Tutorial

**PUT** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

🔒 **Requires Authentication**

Request body:

```json
{
  "title": "string",
  "content": "string",
  "video_url": "string",
  "duration": "number"
}
```

### Delete Tutorial

**DELETE** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

🔒 **Requires Authentication**

---

## Tutorial Questions

### Get All Questions for a Tutorial

**GET** `/api/tutorials/{tutorialId}/questions`

🔒 **Requires Authentication**

### Get Question by ID

**GET** `/api/tutorials/{tutorialId}/questions/{questionId}`

🔒 **Requires Authentication**

### Create Question

**POST** `/api/tutorials/{tutorialId}/questions`

🔒 **Requires Authentication**

Request body:

```json
{
  "question_text": "string",
  "position": "number"
}
```

### Update Question

**PUT** `/api/tutorials/{tutorialId}/questions/{questionId}`

🔒 **Requires Authentication**

Request body:

```json
{
  "question_text": "string",
  "position": "number"
}
```

### Delete Question

**DELETE** `/api/tutorials/{tutorialId}/questions/{questionId}`

🔒 **Requires Authentication**

---

## Tutorial Questions Options

### Get All Options for a Question

**GET** `/api/questions/{questionId}/options`

🔒 **Requires Authentication**

### Get Option by ID

**GET** `/api/questions/{questionId}/options/{optionId}`

🔒 **Requires Authentication**

### Create Option

**POST** `/api/questions/{questionId}/options`

🔒 **Requires Authentication**

Request body:

```json
{
  "option_label": "string",
  "option_text": "string",
  "is_correct": "boolean"
}
```

### Update Option

**PUT** `/api/questions/{questionId}/options/{optionId}`

🔒 **Requires Authentication**

Request body:

```json
{
  "option_text": "string",
  "is_correct": "boolean"
}
```

### Delete Option

**DELETE** `/api/questions/{questionId}/options/{optionId}`

🔒 **Requires Authentication**

---

## Exam Registrations

### Get All Exam Registrations for a Tutorial

**GET** `/api/tutorials/{tutorialId}/exams`

🔒 **Requires Authentication**

Returns all exam registrations for the specified tutorial.

### Register/Start a New Exam

**POST** `/api/tutorials/{tutorialId}/exams/register`

🔒 **Requires Authentication**

Starts a new exam session for the authenticated user. Creates a new exam registration with:

- Status: `ongoing`
- Deadline: 30 minutes from start time

Response:

```json
{
  "data": {
    "id": "number",
    "tutorial_id": "number",
    "examinees_id": "number",
    "status": "ongoing",
    "deadline_at": "datetime",
    "created_at": "datetime"
  },
  "status": 201,
  "message": "Exam Started"
}
```

### Submit Bulk Answers

**POST** `/api/exams/{examId}/answers/bulk`

🔒 **Requires Authentication**

Submit multiple answers for an exam. Supports both creating new answers and updating existing ones.

Request body:

```json
{
  "answers": [
    {
      "question_id": "number",
      "option_id": "number"
    },
    {
      "question_id": "number",
      "option_id": "number"
    }
  ]
}
```

Response:

```json
{
  "data": [
    {
      "id": "number",
      "exam_registration_id": "number",
      "question_id": "number",
      "option_id": "number",
      "is_correct": "boolean",
      "created_at": "datetime"
    }
  ],
  "status": 201,
  "message": "Bulk Answers Saved"
}
```

### Finish Exam

**POST** `/api/exams/{examId}/finish`

🔒 **Requires Authentication**

Finishes the exam and calculates the final score. Updates exam status to `finished` and creates an exam result.

Response:

```json
{
  "data": {
    "id": "number",
    "exam_registration_id": "number",
    "total_questions": "number",
    "score": "number",
    "is_passed": "boolean",
    "created_at": "datetime"
  },
  "status": 200,
  "message": "Exam Finished"
}
```

**Note:** Passing score is 70 or higher.

---

## Response Format

### Success Response

```json
{
  "data": {},
  "status": "number",
  "message": "string"
}
```

### Error Response

```json
{
  "error": {
    "code": "number",
    "message": "string"
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

- All timestamps are in ISO 8601 format
- All endpoints marked with 🔒 require a valid JWT access token
- Exam duration is 30 minutes from start time
- Minimum passing score for exams is 70%
