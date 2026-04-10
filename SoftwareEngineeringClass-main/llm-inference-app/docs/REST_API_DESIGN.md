# REST API Design

Base URL: `/api/v1`

| Endpoint | Method | Auth Required | Purpose | Request Body / Query |
|---|---|---:|---|---|
| `/health` | GET | No | Health check for backend availability | None |
| `/auth/register` | POST | No | Create a new user account | `{ email, password }` |
| `/auth/login` | POST | No | Authenticate user and return JWT | `{ email, password }` |
| `/auth/logout` | POST | No/Optional | Client-facing logout confirmation | None |
| `/users/profile` | GET | Yes | Return authenticated user profile | None |
| `/users/profile` | PUT | Yes | Update basic profile fields | `{ firstName?, lastName? }` |
| `/users/change-password` | PUT | Yes | Change user password | `{ oldPassword, newPassword, confirmPassword }` |
| `/conversations` | GET | Yes | Return list of saved conversations; supports search | `?search=keyword` |
| `/conversations` | POST | Yes | Create a new conversation and send first prompt | `{ prompt }` |
| `/conversations/:conversationId` | GET | Yes | Return a full conversation transcript | None |
| `/conversations/:conversationId/messages` | POST | Yes | Append a new message to an existing conversation | `{ prompt }` |
| `/conversations/:conversationId` | DELETE | Yes | Delete a saved conversation | None |

## Why these endpoints satisfy iteration 2

- **Feature 4: Search conversation history**
  - implemented by `GET /conversations?search=keyword`

- **Feature 5: Continue a previous conversation**
  - implemented by:
    - `GET /conversations/:conversationId`
    - `POST /conversations/:conversationId/messages`

## Example payloads

### Register
```json
{
  "email": "student@example.com",
  "password": "StrongPass123!"
}
```

### Login success response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "userId": "uuid",
      "email": "student@example.com"
    }
  }
}
```

### Create conversation
```json
{
  "prompt": "Help me understand iteration 2 requirements."
}
```

### Send another message in the same thread
```json
{
  "prompt": "Now summarize that in three bullets."
}
```
