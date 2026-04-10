# Software Architecture & Design

## 1. Software architecture overview

The system uses a simple **three-layer backend** and a **static frontend**.

### Frontend
The frontend is a static HTML/CSS/JavaScript client served locally with Python's built-in HTTP server. It handles:
- signup and login forms
- dashboard rendering
- sending prompts
- loading saved history
- searching history
- reopening an old thread

### Backend
The backend is an Express REST API. It is split into the following layers:

- **Routes**: define HTTP endpoints
- **Controllers**: validate requests and shape responses
- **Services**: implement business logic
- **Database/File store**: persist users and conversations
- **Middleware**: authentication and validation handling

### Persistence layer
Instead of an external database, this iteration stores data in `backend/data/db.json`. This gives the project:
- persistence across browser refreshes
- persistence across server restarts
- an easy way for graders to inspect saved data

## 2. Major runtime flow

### A. Register / Login
1. User submits credentials from the frontend
2. Frontend calls `/api/v1/auth/register` or `/api/v1/auth/login`
3. Backend validates the request
4. `UserService` writes to or reads from `FileStore`
5. On login, backend returns a JWT
6. Frontend stores the JWT in `localStorage`

### B. Start a new chat
1. User sends the first message from the dashboard
2. Frontend calls `POST /api/v1/conversations`
3. `ConversationService.createConversation()` creates a conversation
4. The user's first message is appended
5. `LlmService.generateReply()` creates the assistant response
6. Both messages are saved
7. Updated conversation is returned to the frontend

### C. Resume an old chat
1. User clicks a previous conversation from the history sidebar
2. Frontend calls `GET /api/v1/conversations/:conversationId`
3. Full transcript is loaded
4. User sends a new message
5. Frontend calls `POST /api/v1/conversations/:conversationId/messages`
6. The new user message and assistant reply are appended to the same thread

### D. Search history
1. User types in the sidebar search box
2. Frontend calls `GET /api/v1/conversations?search=keyword`
3. `FileStore.listConversations()` filters by conversation title and message contents
4. Matching conversations are returned and rendered

## 3. Design choices

- **REST API** because the class specifically asks for route design and endpoint mapping
- **JWT auth** because protected user history should not be public
- **Service layer** to separate business logic from route/controller code
- **File-backed persistence** to keep the project launchable and demoable without external infrastructure
- **Conversation/message split in memory model** because iteration 2 requires resumable threads, not just isolated prompt-response pairs
