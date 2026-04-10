# Setup

## Backend
```bash
cd backend
npm install
npm run dev
```

## Frontend
```bash
cd frontend
python -m http.server 5500
```

Open: `http://127.0.0.1:5500`

## Notes
- No Supabase setup is required for this packaged local version.
- All persisted data is stored in `backend/data/db.json`.
- Jasmine unit tests live in `backend/tests/`.
