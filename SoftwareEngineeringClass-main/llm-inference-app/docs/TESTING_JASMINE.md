# Testing (Jasmine)

## Test framework

The backend uses **Jasmine** for unit tests.

Test folder:
- `backend/tests/`

## Current Jasmine suites

| File | Purpose |
|---|---|
| `validators.spec.js` | Validates email and password rules |
| `userService.spec.js` | Tests user registration, login, and profile lookup |
| `conversationService.spec.js` | Tests creating conversations, searching history, resuming threads, and deleting conversations |
| `llmService.spec.js` | Tests assistant reply generation behavior |

## How the suites were designed

### Validator tests
These cover the smallest pure functions first:
- valid email addresses
- invalid email addresses
- strong password rules
- invalid password combinations
- combined auth input validation

### Service tests
These test business rules:
- registering a new user
- preventing duplicate emails
- authenticating users correctly
- creating a new conversation
- saving and reloading messages
- searching history
- appending messages to an existing thread
- deleting a conversation

## Running tests

```bash
cd backend
npm test
```

or

```bash
npm run test:unit
```

## What counts as unit testing here

The tests focus on:
- functions and services in isolation
- deterministic behavior of business logic
- correctness of iteration 2 requirements

The tests intentionally avoid browser-heavy UI automation because the assignment section you shared specifically calls for **Jasmine unit tests**.
