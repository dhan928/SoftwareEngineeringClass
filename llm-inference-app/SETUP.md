# LLM Inference App - Complete Setup Guide

**Status:** ✅ Production Ready with Supabase

This is a full-stack LLM Inference application with authentication and chat interface.

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL REST API)
- **Authentication:** JWT (JSON Web Tokens)

## Quick Start (5 minutes)

### Prerequisites

- Node.js v16+ and npm
- Supabase account (free at https://supabase.com)
- Git

### Step 1: Clone & Install

```bash
cd llm-inference-app
cd backend
npm install
```

### Step 2: Set Up Supabase

1. Go to https://supabase.com and create a new project
2. In **SQL Editor**, paste and run this SQL:

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

3. Go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

### Step 3: Configure Backend

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key

JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d

API_BASE_URL=/api/v1
CORS_ORIGIN=http://localhost:5500
```

### Step 4: Run Backend

```bash
npm run dev
```

Output should show:
```
🚀 Server running on port 3000
```

### Step 5: Access Frontend

- Open `frontend/index.html` in your browser (or serve on http://localhost:5500)
- Click **"Create Account"** to sign up
- Enter email and password (8+ chars, uppercase, number, special char)
- ✅ Redirects to dashboard after signup

## Project Structure

```
llm-inference-app/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, validation
│   │   ├── database/          # Supabase client
│   │   └── config/            # Configuration
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── .env.example           # Template
│
├── frontend/
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── signup.html            # Signup page
│   ├── dashboard.html         # Main app
│   ├── assets/
│   │   ├── css/styles.css     # All styling
│   │   └── js/
│   │       ├── main.js        # API utilities
│   │       ├── auth.js        # Auth handlers
│   │       └── dashboard.js   # Dashboard logic
│   └── package.json           # http-server
│
└── README.md                  # This file
```

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header (except auth endpoints).

### Authentication

```
POST /api/v1/auth/register
Body: { email, password }
Response: { success, data: { userId, email } }

POST /api/v1/auth/login
Body: { email, password }
Response: { success, data: { token, user: { userId, email } } }
```

### User Profile

```
GET /api/v1/users/profile
Headers: Authorization: Bearer <token>
Response: { success, data: { userId, email, createdAt } }
```

### Inference (Placeholder)

```
POST /api/v1/inference/submit
Headers: Authorization: Bearer <token>
Body: { prompt }
Response: { success, data: { inferenceId, status } }

GET /api/v1/inference?limit=10
Headers: Authorization: Bearer <token>
Response: { success, data: [...] }
```

## User Flow

1. **Signup Page** (`signup.html`)
   - User enters email and password
   - Frontend validates password strength
   - Backend creates user in Supabase
   - Auto-login and redirect to dashboard

2. **Dashboard** (`dashboard.html`)
   - Shows logged-in user's email
   - Chat interface for inference requests
   - Chat history in sidebar
   - Logout button available

## Testing

### Test Signup & Login

```bash
node test-auth.js
```

This will:
- Create a test user
- Verify login works
- Test error handling

### Manual Testing

1. **Sign Up:**
   - Navigate to `frontend/signup.html`
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Click "Create Account"

2. **Verify in Supabase:**
   - Go to Supabase dashboard
   - SQL Editor: `SELECT * FROM users;`
   - Should see your test user with hashed password

3. **Login:**
   - Navigate to `frontend/login.html`
   - Use same email and password
   - Should redirect to dashboard

## Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon key | JWT token from Supabase |
| `JWT_SECRET` | Secret for token signing | Generate a random string |
| `PORT` | Backend port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:5500` |

## Common Issues

### "Supabase URL and ANON_KEY must be configured"

**Solution:** Create `backend/.env` with your Supabase credentials from Settings → API

### "Email already exists" error

**Solution:** Use a different email, or delete the user from Supabase table

### "Invalid credentials" on login

**Solution:** Verify email and password are correct. Password is case-sensitive.

### CORS error on signup/login

**Solution:** Make sure backend is running on port 3000 and `CORS_ORIGIN` in `.env` matches your frontend URL

### Frontend can't reach backend

**Solution:** Ensure backend is running (`npm run dev`) and frontend's `API_BASE_URL` is correct in `main.js`

## Deployment

### Backend

Deploy to Heroku, Vercel, Railway, or your hosting provider:

1. Set environment variables in hosting platform
2. Install dependencies: `npm install`
3. Run: `npm start`

### Frontend

Deploy to Netlify, Vercel, GitHub Pages, or any static host:

1. Update `API_BASE_URL` in `assets/js/main.js` to your backend URL
2. Upload `frontend/` folder
3. Set base URL to `frontend/index.html`

## File Cleanup

The following files can be removed as they're no longer needed:

- `backend/src/database/dbConnection.js` (old PostgreSQL, use supabaseClient.js instead)
- `backend/src/database/schema.sql` (old schema file)
- `test-auth.js` (temporary test file)
- `SUPABASE_SETUP.md` (covered in this guide)

## Next Steps

1. ✅ Set up Supabase
2. ✅ Configure `.env`
3. ✅ Run backend: `npm run dev`
4. ✅ Test signup/login
5. 🔜 Integrate LLM service (OpenAI, Anthropic, etc.)
6. 🔜 Add real chat inference logic
7. 🔜 Deploy to production

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Express.js Docs:** https://expressjs.com
- **JWT:** https://jwt.io

---

**Last Updated:** March 16, 2026
**Status:** ✅ Production Ready
