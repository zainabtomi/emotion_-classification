# Emotion Backend API Documentation

## ✅ Auth Routes

### POST /auth/register
- Body: { name, email, password }
- Response: { token }

### POST /auth/login
- Body: { email, password }
- Response: { token }

---

## ✅ Analysis Routes

### POST /analysis/analyze
- Header: Authorization: Bearer TOKEN
- Body: { sentence }
- Response: { sentence, label, confidence }

### GET /analysis/history
- Header: Authorization: Bearer TOKEN
- Response: [ { sentence, label, confidence, created_at } ]
