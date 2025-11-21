# Phase 1 Testing Guide - Muted Age Backend

## Prerequisites
- Server should be running on `http://localhost:5000`
- MongoDB connection working

---

## 🧪 Testing Methods

You can test using:
1. **curl** (command line) - examples below
2. **Postman** - GUI tool (recommended for beginners)
3. **Thunder Client** (VS Code extension)
4. **REST Client** (VS Code extension)

---

## 1. Test Health Check ✅

### curl Command:
```bash
curl http://localhost:5000/api/health
```

### Expected Response:
```json
{
  "success": true,
  "message": "Muted Age Backend Server is running!",
  "environment": "development",
  "timestamp": "2024-11-21T..."
}
```

### What This Tests:
- Server is running
- Environment configuration loaded
- Basic routing works

---

## 2. Test User Registration 👤

### curl Command:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### Expected Success Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "674f1234567890abcdef1234",
      "username": "testuser123",
      "email": "testuser@example.com",
      "role": "user",
      "createdAt": "2024-11-21T..."
    }
  }
}
```

### What This Tests:
- User model validation
- Password hashing (bcrypt)
- JWT token generation
- Error handling (try registering same user twice)
- Database connection

### Test Error Cases:

**Missing fields:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Please provide username, email, and password"
}
```

**Short password:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "12345"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Password must be at least 6 characters long"
}
```

**Duplicate username:**
```bash
# Try registering with same username again
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "different@example.com",
    "password": "password123"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

---

## 3. Test User Login 🔐

### curl Command:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### Expected Success Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "674f1234567890abcdef1234",
      "username": "testuser123",
      "email": "testuser@example.com",
      "role": "user",
      "createdAt": "2024-11-21T..."
    }
  }
}
```

### What This Tests:
- User authentication
- Password comparison (bcrypt)
- JWT token generation
- Last login update

### Test Error Cases:

**Wrong password:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Non-existent user:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

## 4. Test Get Current User (Protected Route) 🔒

### Step 1: Get Token from Login
First, login and copy the token from the response:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### Step 2: Use Token to Access Protected Route

Replace `YOUR_TOKEN_HERE` with the actual token from step 1:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Success Response:
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "674f1234567890abcdef1234",
      "username": "testuser123",
      "email": "testuser@example.com",
      "role": "user",
      "profile": {
        "avatar": "https://via.placeholder.com/150"
      },
      "createdAt": "2024-11-21T...",
      "addresses": [],
      "wishlist": []
    }
  }
}
```

### What This Tests:
- JWT authentication middleware
- Protected route access
- User profile with relationships
- Token validation

### Test Error Cases:

**No token provided:**
```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Expected Error:**
```json
{
  "success": false,
  "error": "No token provided"
}
```

**Invalid token:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Error:**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

---

## 5. Test Rate Limiting 🚦

Try making 6+ authentication requests rapidly:

```bash
for i in {1..7}; do
  echo "Request $i:"
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testuser@example.com",
      "password": "wrongpassword"
    }'
  echo ""
done
```

### Expected Behavior:
- First 5 requests: Normal error response
- 6th request onwards: Rate limit error

**Expected Rate Limit Response:**
```json
{
  "success": false,
  "error": "Too many authentication attempts, please try again later."
}
```

### What This Tests:
- Rate limiting middleware
- Security measures

---

## 📱 Testing with Postman (Recommended for Beginners)

### Setup:
1. Download Postman: https://www.postman.com/downloads/
2. Create a new Collection called "Muted Age Backend"
3. Add these requests:

### Request 1: Health Check
- **Method**: GET
- **URL**: `http://localhost:5000/api/health`
- **Headers**: None
- **Body**: None

### Request 2: Register User
- **Method**: POST
- **URL**: `http://localhost:5000/api/auth/register`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "password123"
}
```

### Request 3: Login User
- **Method**: POST
- **URL**: `http://localhost:5000/api/auth/login`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

### Request 4: Get Current User (Protected)
- **Method**: GET
- **URL**: `http://localhost:5000/api/auth/me`
- **Headers**: 
  - `Authorization: Bearer <paste_token_here>`
- **Body**: None

**Tip**: In Postman, you can use Variables to store the token automatically!

---

## 🧪 Advanced Testing with Thunder Client (VS Code)

### Install:
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Search "Thunder Client"
4. Install it

### Benefits:
- Test directly from VS Code
- Save requests in workspace
- Environment variables support
- No need to switch apps

### Setup Collections:
Same requests as Postman, but inside VS Code!

---

## ✅ Success Criteria Checklist

Run through these tests and check off each one:

### Basic Functionality:
- [ ] Health check returns 200 OK
- [ ] Can register new user
- [ ] Can login with correct credentials
- [ ] Can access protected route with valid token
- [ ] MongoDB saves user data correctly

### Error Handling:
- [ ] Duplicate username returns error
- [ ] Duplicate email returns error
- [ ] Short password returns error
- [ ] Missing fields return error
- [ ] Wrong password returns 401
- [ ] No token returns 401
- [ ] Invalid token returns 401

### Security:
- [ ] Passwords are hashed (not stored plain text)
- [ ] Rate limiting works on auth routes
- [ ] JWT tokens expire (test with 24h+ old token)
- [ ] Helmet security headers present

### Response Format:
- [ ] All success responses have `success: true`
- [ ] All success responses have `message` field
- [ ] All success responses have `data` field
- [ ] All error responses have `success: false`
- [ ] All error responses have `error` field

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: Check your `.env` file has correct `MONGODB_URI`

### Issue: "Port 5000 already in use"
**Solution**: Kill the process:
```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: "No token provided"
**Solution**: Make sure you're adding the Authorization header:
```
Authorization: Bearer <your_token>
```

### Issue: "Invalid credentials" but password is correct
**Solution**: Make sure you registered the user first

### Issue: Rate limit hit immediately
**Solution**: Wait 15 minutes or restart server

---

## 📊 Testing Logs

Check server logs for detailed information:

### In Terminal where server is running:
You should see:
```
🚀 Server running on port 5000
🌍 Environment: development
🔗 Frontend URL: http://localhost:3000
✅ MongoDB connected successfully
📊 Database: muted-age-db
```

### Request logs (with Morgan):
```
POST /api/auth/register 201 123ms
POST /api/auth/login 200 89ms
GET /api/auth/me 200 45ms
```

---

## 🎯 Next Steps

Once all tests pass:
1. ✅ Phase 1 is complete
2. 🚀 Ready for Phase 2: Product Management
3. 📝 Can start building frontend integration

---

## 💡 Tips

1. **Save your tokens**: You'll need them for protected routes
2. **Use different emails**: For testing multiple users
3. **Test error cases**: Don't just test happy paths
4. **Check MongoDB**: Verify data is actually saved
5. **Monitor logs**: Watch for any warnings or errors

---

**Last Updated**: November 21, 2024
**Phase**: 1 - Foundation & Core Setup
**Status**: Ready for Testing 🧪
