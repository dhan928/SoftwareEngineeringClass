# Test Mapping to Use Cases

## Use case to test mapping

| Use Case / Scenario | Expected Behavior | Jasmine Test Coverage |
|---|---|---|
| Register a valid user | User account is created with a unique ID | `userService.spec.js` → `should register a new user with valid email and password` |
| Reject duplicate registration | Duplicate email is blocked | `userService.spec.js` → `should reject with duplicate email` |
| Login with correct credentials | JWT token and user object returned | `userService.spec.js` → `should login user with correct credentials` |
| Reject wrong password | Authentication fails | `userService.spec.js` → `should reject with wrong password` |
| Start a new conversation | Conversation is created and first exchange is saved | `conversationService.spec.js` → `should create a conversation with the initial user and assistant messages` |
| View saved conversation | Transcript can be retrieved later | `conversationService.spec.js` → `should retrieve an existing conversation by id` |
| Search conversation history | Keyword returns matching conversation(s) | `conversationService.spec.js` → `should search conversations by keyword` |
| Resume previous conversation | New messages append to the same thread | `conversationService.spec.js` → `should append a new message to an existing thread` |
| Delete a conversation | Thread is removed from history | `conversationService.spec.js` → `should delete a conversation` |
| Validate strong password rules | Weak passwords are blocked | `validators.spec.js` suite |
| Generate assistant reply | App returns a non-empty assistant message | `llmService.spec.js` suite |

## Mapping rationale

Each scenario was translated into a small, concrete assertion:
- inputs were defined first
- expected outputs were written next
- implementation was then verified against those expectations

That gives you a clean mapping from **user story → scenario → unit test → implementation file**.
