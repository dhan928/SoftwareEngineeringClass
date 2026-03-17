# LLM Inference Web App 

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=llm_inference_db
```

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE llm_inference_db;

# Exit psql
\q

# Run schema
psql -U postgres -d llm_inference_db -f src/database/schema.sql
```

### 4. Start Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3000`

## Frontend Setup

### 1. Serve Frontend

The frontend is static HTML/CSS/JavaScript. You can use any simple HTTP server:

**Using Python (v3):**
```bash
cd frontend
python -m http.server 5500
```

**Using Node (http-server):**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

**Using Node (Live Server):**
```bash
npm install -g live-server
cd frontend
live-server --port=5500
```

Frontend will be available at `http://localhost:5500`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### User
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `PUT /api/v1/users/change-password` - Change password

### Inference
- `POST /api/v1/inference/submit` - Submit inference request
- `GET /api/v1/inference` - Get history
- `GET /api/v1/inference/:id` - Get inference result
- `DELETE /api/v1/inference/:id` - Delete inference

## Testing

### Run Unit Tests

```bash
cd backend
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## Features Implemented

### ✅ Authentication
- User registration with password validation
- User login with JWT tokens
- User logout
- JWT token refresh

### ✅ User Management
- View user profile
- Update user profile
- Change password

### ✅ Inference System
- Submit inference requests
- Store inference history
- Retrieve inference results
- Delete inference records

### ✅ Frontend Pages
1. **Landing Page** - Hero section with call-to-action buttons
2. **Login Page** - Email/password authentication
3. **Create Account Page** - User registration with validation
4. **Dashboard Page** - Chat interface with inference history

### ✅ Security Features
- Password hashing with bcrypt
- JWT authentication
- CORS protection
- Input validation
- Error handling

## Development Workflow

1. **TDD (Test-Driven Development)**
   - Write unit tests first
   - Implement code to pass tests
   - Refactor and improve

2. **Testing Tools**
   - Jasmine for unit tests
   - Jest for integration tests

3. **API Design**
   - RESTful endpoints
   - JSON request/response format
   - Consistent error handling

4. **Database**
   - PostgreSQL for data persistence
   - Migration scripts for schema changes

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_NAME` | Database name |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRATION` | JWT token expiration |
| `CORS_ORIGIN` | CORS origin for frontend |

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists and schema is created

### API Not Responding
- Check backend server is running on port 3000
- Verify CORS_ORIGIN in `.env` matches frontend URL
- Check browser console for error messages

### Frontend Not Connecting
- Verify frontend is served on correct port (5500)
- Check browser console for API errors
- Verify authentication tokens are being stored

## Next Steps

1. Implement LLM service integration
2. Add WebSocket support for real-time updates
3. Implement email verification
4. Add user profile pictures
5. Implement rate limiting
6. Add logging and monitoring
7. Deploy to production

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Write tests first (TDD)
3. Implement feature
4. Commit changes: `git commit -am 'Add my-feature'`
5. Push to branch: `git push origin feature/my-feature`
6. Create pull request

## License

MIT
