# Backend Learning App API

API documentation for the Backend Learning App.

Base URL: `https://api.danbildad.my.id`

## Authentication

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

### Refresh Access Token

**PUT** `/api/auth/refresh`

Request body:

```json
{
  "refreshToken": "string"
}
```

### Logout User

**DELETE** `/api/auth/logout`

Request body:

```json
{
  "refreshToken": "string"
}
```

## Developer Journeys

### Get All Journeys

**GET** `/api/journeys`

### Create Journey

**POST** `/api/journeys`

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

### Update Journey

**PUT** `/api/journeys/{id}`

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

## Developer Journey Tutorials

### Get All Tutorials for a Journey

**GET** `/api/journeys/{developerJourneyId}/tutorials`

### Create Tutorial

**POST** `/api/journeys/{developerJourneyId}/tutorials`

Request body:

```json
{
  "title": "string",
  "content": "string",
  "video_url": "string",
  "duration": "number"
}
```

### Get Tutorial by ID

**GET** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

### Update Tutorial

**PUT** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

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

## Tutorial Questions

### Get All Questions for a Tutorial

**GET** `/api/tutorials/{tutorialId}/questions`

### Create Question

**POST** `/api/tutorials/{tutorialId}/questions`

Request body:

```json
{
  "question_text": "string",
  "position": "number"
}
```

### Get Question by ID

**GET** `/api/tutorials/{tutorialId}/questions/{questionId}`

### Delete Question

**DELETE** `/api/tutorials/{tutorialId}/questions/{questionId}`

Response:

```json
{
  "data": {
    "id": 1,
    "tutorial_id": 1,
    "question_text": "What is HTML?",
    "position": 1,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Data deleted successfully"
}
```

## Tutorial Question Options

### Get All Options for a Question

**GET** `/api/questions/{questionId}/options`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "question_id": 1,
      "option_label": "A",
      "option_text": "Hyper Text Markup Language",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": 200,
  "message": "Retrieved successfully"
}
```

### Create Option

**POST** `/api/questions/{questionId}/options`

Request body:

```json
{
  "option_label": "string",
  "option_text": "string"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "question_id": 1,
    "option_label": "A",
    "option_text": "Hyper Text Markup Language",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 201,
  "message": "Created successfully"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "tutorial_id": 1,
    "question_text": "What is HTML?",
    "position": 1,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Data deleted successfully"
}
```

## Tutorial Question Options

### Get All Options for a Question

**GET** `/api/questions/{questionId}/options`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "question_id": 1,
      "option_label": "A",
      "option_text": "Hyper Text Markup Language",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": 200,
  "message": "Retrieved successfully"
}
```

### Create Option

**POST** `/api/questions/{questionId}/options`

Request body:

```json
{
  "option_label": "string",
  "option_text": "string"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "question_id": 1,
    "option_label": "A",
    "option_text": "Hyper Text Markup Language",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 201,
  "message": "Created successfully"
}
```

### Get Option by ID

**GET** `/api/questions/{questionId}/options/{optionId}`

Response:

```json
{
  "data": {
    "id": 1,
    "question_id": 1,
    "option_label": "A",
    "option_text": "Hyper Text Markup Language",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Retrieved successfully"
}
```

### Update Option

**PUT** `/api/questions/{questionId}/options/{optionId}`

Request body:

```json
{
  "option_text": "string"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "question_id": 1,
    "option_label": "A",
    "option_text": "Hyper Text Markup Language",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Updated successfully"
}
```

### Delete Option

**DELETE** `/api/questions/{questionId}/options/{optionId}`

Response:

```json
{
  "data": {
    "id": 1,
    "question_id": 1,
    "option_label": "A",
    "option_text": "Hyper Text Markup Language",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Deleted successfully"
}
```

## Exam Registrations

### Get All Exam Registrations for a Tutorial

**GET** `/api/tutorials/{tutorialId}/exams`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "tutorial_id": 1,
      "examinees_id": 1,
      "status": "ongoing",
      "deadline_at": "2023-01-01T00:30:00.000Z",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": 200,
  "message": "Retrieved successfully"
}
```

### Register/Start a New Exam

**POST** `/api/tutorials/{tutorialId}/exams/register`

Response:

```json
{
  "data": {
    "id": 1,
    "tutorial_id": 1,
    "examinees_id": 1,
    "status": "ongoing",
    "deadline_at": "2023-01-01T00:30:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 201,
  "message": "Exam Started"
}
```

### Submit Bulk Answers

**POST** `/api/exams/{examId}/answers/bulk`

Request body:

```json
{
  "answers": [
    {
      "question_id": 1,
      "option_id": 1
    },
    {
      "question_id": 2,
      "option_id": 5
    }
  ]
}
```

Response:

```json
{
  "data": [
    {
      "id": 1,
      "exam_registration_id": 1,
      "question_id": 1,
      "option_id": 1,
      "is_correct": true,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": 201,
  "message": "Bulk Answers Saved"
}
```

### Finish Exam

**POST** `/api/exams/{examId}/finish`

Response:

```json
{
  "data": {
    "id": 1,
    "exam_registration_id": 1,
    "total_questions": 10,
    "score": 80,
    "is_passed": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Exam Finished"
}
```

## Developer Journey Completions

### Record Study Duration

**POST** `/api/journeys/{journeyId}/study-duration`

Request body:

```json
{
  "duration": "number" // Durasi belajar dalam detik
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "journey_id": 1,
    "study_duration": 3600, // 1 jam dalam detik
    "enrolling_times": 5,
    "enrollments_at": "2023-01-01T00:00:00.000Z",
    "last_enrolled_at": "2023-01-01T01:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T01:00:00.000Z"
  },
  "status": 201,
  "message": "Created successfully"
}
```

All error responses follow this format:

```json
{
  "error": {
    "code": "number",
    "message": "string"
  }
}
```

Common HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error