# Iteration 2 Feature List

## Features implemented in this iteration

### 1. Search conversation history
- Search box in the sidebar
- Backend query parameter `search`
- Matching is performed against:
  - conversation title
  - message contents
- Clicking a result opens the matching conversation

### 2. Continue a previous conversation
- Clicking a sidebar history item loads the full transcript
- Sending another prompt uses the existing `conversationId`
- New user and assistant messages are appended to the same thread

## Supporting features retained from the earlier iteration

### 3. Chat with an assistant
- User sends a prompt
- Assistant response is generated and returned
- User and assistant messages render in chat bubbles

### 4. Save conversation history
- Messages are saved after each send
- Refreshing the page does not erase saved threads

### 5. View conversation history
- Dashboard sidebar shows all saved conversations
- Most recent conversations appear first
- Conversation title, preview, and updated timestamp are shown

## Code development proof

Primary implementation files:

### Backend
- `backend/src/routes/conversationRoutes.js`
- `backend/src/controllers/conversationController.js`
- `backend/src/services/conversationService.js`
- `backend/src/services/llmService.js`
- `backend/src/database/fileStore.js`

### Frontend
- `frontend/assets/js/dashboard.js`
- `frontend/dashboard.html`

## User-story coverage

| User Story | Implemented? | Main files |
|---|---:|---|
| Chat with an LLM | Yes | `conversationService.js`, `llmService.js`, `dashboard.js` |
| Save conversation history | Yes | `fileStore.js`, `conversationService.js` |
| View conversation history | Yes | `fileStore.js`, `dashboard.js`, `dashboard.html` |
| Search conversation history | Yes | `fileStore.js`, `conversationController.js`, `dashboard.js` |
| Continue previous conversation | Yes | `conversationService.js`, `dashboard.js` |
