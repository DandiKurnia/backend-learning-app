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

## Error Responses

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