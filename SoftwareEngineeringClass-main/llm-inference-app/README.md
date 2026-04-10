# LLM Chat App — Iteration 2

This project is a lightweight full-stack chat application built for the Software Engineering class. It supports account creation, login, starting a chat, saving conversation history, searching conversation history, and resuming a previous thread.

## Iteration 2 features implemented

- Chat with an LLM-style assistant
- Save conversation history automatically
- View conversation history in the sidebar
- Search conversation history by keyword
- Resume a previous conversation and keep appending messages
- JWT-based authentication for protected routes
- Local file-backed persistence for demo and grading

## Project structure

```text
llm-inference-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── data/db.json
├── frontend/
│   ├── assets/css/
│   ├── assets/js/
│   └── *.html
├── docs/
└── change.log
```

## Running the app

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`.

### Frontend

Open a second terminal:

```bash
cd frontend
python -m http.server 5500
```

Then open `http://127.0.0.1:5500`.

## Test commands

```bash
cd backend
npm test
npm run test:unit
```

## Documentation included for the dev-team report

See the `docs/` folder:

- `SOFTWARE_ARCHITECTURE.md`
- `REST_API_DESIGN.md`
- `DATABASE_DESIGN.md`
- `FEATURES_ITERATION2.md`
- `TESTING_JASMINE.md`
- `TEST_MAPPING.md`
- `TDD_EVIDENCE.md`
- `GITHUB_ISSUES_GUIDE.md`

## Notes

This version uses a local JSON file (`backend/data/db.json`) instead of Supabase so the required iteration behavior can be demonstrated consistently on a local machine during grading.
