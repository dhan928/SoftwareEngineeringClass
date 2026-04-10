# Database Design

## Storage model

The application uses a local JSON file:

`backend/data/db.json`

It stores two top-level collections:

```json
{
  "users": [],
  "conversations": []
}
```

## Users schema

Each user record contains:

| Field | Type | Description |
|---|---|---|
| `user_id` | string (UUID) | Primary identifier for the user |
| `email` | string | Unique email address |
| `password_hash` | string | Bcrypt-hashed password |
| `created_at` | string (ISO datetime) | Account creation timestamp |

Example:
```json
{
  "user_id": "uuid",
  "email": "student@example.com",
  "password_hash": "$2a$10$...",
  "created_at": "2026-04-09T19:00:00.000Z"
}
```

## Conversations schema

Each conversation record contains:

| Field | Type | Description |
|---|---|---|
| `conversation_id` | string (UUID) | Primary identifier for the conversation |
| `user_id` | string (UUID) | Owner of the conversation |
| `title` | string | Derived from the first user message |
| `created_at` | string (ISO datetime) | Conversation creation time |
| `updated_at` | string (ISO datetime) | Last activity time |
| `messages` | array | Ordered message transcript |

Example:
```json
{
  "conversation_id": "uuid",
  "user_id": "uuid",
  "title": "How do I run this project?",
  "created_at": "2026-04-09T19:01:00.000Z",
  "updated_at": "2026-04-09T19:05:00.000Z",
  "messages": [
    {
      "message_id": "uuid",
      "role": "user",
      "content": "How do I run this project?",
      "created_at": "2026-04-09T19:01:00.000Z"
    },
    {
      "message_id": "uuid",
      "role": "assistant",
      "content": "Open the backend and frontend in two terminals...",
      "created_at": "2026-04-09T19:01:01.000Z"
    }
  ]
}
```

## Why this design fits iteration 2

This schema directly supports:

- **saved history** because conversations persist in `db.json`
- **view history** because the sidebar can list every conversation for a given `user_id`
- **search history** because the backend searches conversation titles plus message contents
- **resume conversation** because new messages append to the existing `messages` array inside the selected conversation
