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

Response:

```json
{
  "data": {
    "id": 1,
    "display_name": "John Doe",
    "name": "John",
    "email": "john@example.com",
    "phone": "1234567890",
    "user_role": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "status": 201
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
    "user": {
      "id": 1,
      "display_name": "John Doe",
      "name": "John",
      "email": "john@example.com",
      "phone": "1234567890",
      "user_role": 1,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "status": 201
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

Response:

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "status": 200
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

Response:

```json
{
  "data": {
    "message": "Refresh token deleted successfully"
  },
  "status": 200
}
```

## Developer Journeys

### Get All Journeys

**GET** `/api/journeys`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Frontend Developer",
      "summary": "Learn frontend development",
      "point": 100,
      "required_point": 50,
      "xp": 200,
      "required_xp": 100,
      "status": 1,
      "listed": 1,
      "dead_line": "2023-12-31T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": 200,
  "message": "Retrieved successfully"
}
```

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

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Frontend Developer",
    "summary": "Learn frontend development",
    "point": 100,
    "required_point": 50,
    "xp": 200,
    "required_xp": 100,
    "status": 1,
    "listed": 1,
    "dead_line": "2023-12-31T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "status": 201,
  "message": "Created successfully"
}
```

### Get Journey by ID

**GET** `/api/journeys/{id}`

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Frontend Developer",
    "summary": "Learn frontend development",
    "point": 100,
    "required_point": 50,
    "xp": 200,
    "required_xp": 100,
    "status": 1,
    "listed": 1,
    "dead_line": "2023-12-31T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Retrieved successfully"
}
```

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

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Frontend Developer",
    "summary": "Learn frontend development",
    "point": 100,
    "required_point": 50,
    "xp": 200,
    "required_xp": 100,
    "status": 1,
    "listed": 1,
    "dead_line": "2023-12-31T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Updated successfully"
}
```

### Delete Journey

**DELETE** `/api/journeys/{id}`

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Frontend Developer",
    "summary": "Learn frontend development",
    "point": 100,
    "required_point": 50,
    "xp": 200,
    "required_xp": 100,
    "status": 1,
    "listed": 1,
    "dead_line": "2023-12-31T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Deleted successfully"
}
```

## Developer Journey Tutorials

### Get All Tutorials for a Journey

**GET** `/api/journeys/{developerJourneyId}/tutorials`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "developer_journey_id": 1,
      "title": "Introduction to HTML",
      "position": 1,
      "status": "published",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z",
      "developer_journey_name": "Frontend Developer",
      "developer_journey_summary": "Learn frontend development"
    }
  ],
  "status": 200,
  "message": "Data retrieved successfully"
}
```

### Create Tutorial

**POST** `/api/journeys/{developerJourneyId}/tutorials`

Request body:

```json
{
  "title": "string",
  "position": "number",
  "status": "string"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "developer_journey_id": 1,
    "title": "Introduction to HTML",
    "position": 1,
    "status": "published",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 201,
  "message": "Created successfully"
}
```

### Get Tutorial by ID

**GET** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

Response:

```json
{
  "data": {
    "id": 1,
    "developer_journey_id": 1,
    "title": "Introduction to HTML",
    "position": 1,
    "status": "published",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "developerJourney": {
      "name": "Frontend Developer",
      "summary": "Learn frontend development"
    },
    "questions": [
      {
        "id": 1,
        "question_text": "What is HTML?",
        "position": 1
      }
    ],
    "developer_journey_name": "Frontend Developer",
    "developer_journey_summary": "Learn frontend development"
  },
  "status": 200,
  "message": "Data retrieved successfully"
}
```

### Update Tutorial

**PUT** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

Request body:

```json
{
  "title": "string",
  "position": "number",
  "status": "string"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "developer_journey_id": 1,
    "title": "Introduction to HTML",
    "position": 1,
    "status": "published",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "developerJourney": {
      "name": "Frontend Developer",
      "summary": "Learn frontend development"
    }
  },
  "status": 200,
  "message": "Updated successfully"
}
```

### Delete Tutorial

**DELETE** `/api/journeys/{developerJourneyId}/tutorials/{tutorialId}`

Response:

```json
{
  "data": {
    "id": 1,
    "developer_journey_id": 1,
    "title": "Introduction to HTML",
    "position": 1,
    "status": "published",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "status": 200,
  "message": "Deleted successfully"
}
```

## Tutorial Questions

### Get All Questions for a Tutorial

**GET** `/api/tutorials/{tutorialId}/questions`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "tutorial_id": 1,
      "question_text": "What is HTML?",
      "position": 1,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": 200,
  "message": "Data retrieved successfully"
}
```

### Create Question

**POST** `/api/tutorials/{tutorialId}/questions`

Request body:

```json
{
  "question_text": "string",
  "position": "number"
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
  "status": 201,
  "message": "Data created successfully"
}
```

### Get Question by ID

**GET** `/api/tutorials/{tutorialId}/questions/{questionId}`

Response:

```json
{
  "data": {
    "id": 1,
    "tutorial_id": 1,
    "question_text": "What is HTML?",
    "position": 1,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "options": [
      {
        "option_label": "A",
        "option_text": "Hyper Text Markup Language"
      }
    ]
  },
  "status": 200,
  "message": "Data retrieved successfully"
}
```

### Update Question

**PUT** `/api/tutorials/{tutorialId}/questions/{questionId}`

Request body:

```json
{
  "question_text": "string",
  "position": "number"
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
  "message": "Data updated successfully"
}
```

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
