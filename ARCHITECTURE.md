# HackMe'26 System Architecture

This document describes how the three components of HackMe'26 are connected and communicate with each other.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        HackMe'26 Platform                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Main Website    │         │   Admin Panel    │         │   Backend API    │
│                  │         │                  │         │                  │
│  React + Vite    │◄───────►│  React + Vite    │◄───────►│  Django + DRF    │
│  Port: 5173      │         │  Port: 5174      │         │  Port: 4000      │
│                  │         │                  │         │                  │
│  Public Access   │         │  Staff Only      │         │  REST API        │
└──────────────────┘         └──────────────────┘         └──────────────────┘
         │                            │                            │
         │                            │                            │
         └────────────────────────────┴────────────────────────────┘
                              HTTP/WebSocket
```

---

## Component Details

### 1. Main Website (Public)
**Technology**: React 19 + Vite 8  
**Port**: 5173 (development)  
**Purpose**: Public-facing hackathon website

#### Features
- Event information and schedule
- Track/vector descriptions
- Prize information
- Team showcase
- Registration link
- FAQ and contact info
- **Admin Portal Gateway** (`/admin-portal`)

#### Key Routes
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero section |
| `/schedule` | Event timeline |
| `/vectors` | Innovation tracks |
| `/prizes` | Prize pool details |
| `/team` | Organizing team |
| `/faq` | FAQ section |
| `/admin-portal` | Gateway to admin panel |

#### API Integration
- Minimal direct API calls
- Primarily static content
- Admin portal provides link to separate admin app

---

### 2. Admin Panel (Staff)
**Technology**: React 19 + Vite 8 + Socket.io  
**Port**: 5174 (development)  
**Purpose**: Operations dashboard for event staff

#### Features
- **Authentication**: JWT-based login system
- **Live Operations**: Real-time participant tracking
- **QR Scanning**: Check-in/check-out system
- **Hall Pass Management**: Track participant movements
- **Food Queue**: Manage team food orders
- **Mentor Assistance**: Technical help request queue
- **Reports & Analytics**: Attendance, trends, exports

#### Key Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Authentication page | Public |
| `/` | Dashboard overview | Protected |
| `/live` | Live operations center | Protected |
| `/history` | Day session history | Protected |
| `/reports` | Analytics and reports | Protected |

#### API Integration
```javascript
// admin/src/services/api.js

// Base configuration
const apiClient = axios.create({
  baseURL: '/api/v1',  // Proxied to backend
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// JWT token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ops_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

#### Key API Modules
- `authApi` - Authentication
- `daySessionApi` - Day session management
- `rosterApi` - Participant management
- `passesApi` - Hall pass operations
- `foodApi` - Food request management
- `mentorApi` - Mentor assistance queue
- `reportsApi` - Analytics and reports

---

### 3. Backend API (Django)
**Technology**: Django 5.1 + Django REST Framework  
**Port**: 4000 (development)  
**Purpose**: Central data management and business logic

#### Database Schema
```
┌─────────────┐       ┌──────────────┐       ┌────────────┐
│ DaySession  │       │ Participant  │       │    Team    │
├─────────────┤       ├──────────────┤       ├────────────┤
│ id          │       │ id           │       │ id         │
│ code        │       │ name         │       │ name       │
│ name        │       │ rollNo       │──────►│ table      │
│ start_time  │       │ team ────────┘       │ members    │
│ end_time    │       │ status       │       └────────────┘
│ status      │       │ scanned_at   │
└─────────────┘       └──────────────┘
        │
        │
        ▼
┌─────────────┐       ┌──────────────┐       ┌────────────────┐
│MovementPass │       │ FoodRequest  │       │ MentorRequest  │
├─────────────┤       ├──────────────┤       ├────────────────┤
│ id          │       │ id           │       │ id             │
│ participant │       │ team         │       │ team           │
│ pass_type   │       │ table        │       │ topic          │
│ depart_time │       │ items        │       │ urgency        │
│ return_time │       │ status       │       │ status         │
│ status      │       │ requested_at │       │ requested_at   │
└─────────────┘       └──────────────┘       └────────────────┘
```

#### API Endpoints

##### Authentication
- `POST /api/v1/auth/login/` - Staff login

##### Day Sessions
- `GET /api/v1/days/` - List all day sessions
- `POST /api/v1/days/` - Create new day session
- `POST /api/v1/days/{id}/close/` - Close day session
- `GET /api/v1/days/{id}/` - Get day session details

##### Participants
- `GET /api/v1/participants/` - List all participants
- `GET /api/v1/participants/{id}/` - Get participant details
- `POST /api/v1/participants/scan/` - Process QR scan
- `POST /api/v1/participants/{id}/override/` - Manual check-in

##### Movement Passes
- `GET /api/v1/passes/` - List passes (filter by status)
- `POST /api/v1/passes/` - Issue new pass
- `POST /api/v1/passes/{id}/mark_returned/` - Mark pass returned
- `POST /api/v1/passes/{id}/force_close/` - Force close pass

##### Food Requests
- `GET /api/v1/food/` - List food requests
- `POST /api/v1/food/` - Create food request
- `PATCH /api/v1/food/{id}/advance/` - Advance status
- `DELETE /api/v1/food/{id}/` - Cancel request

##### Mentor Requests
- `GET /api/v1/mentors/` - List mentor requests
- `POST /api/v1/mentors/` - Create mentor request
- `PATCH /api/v1/mentors/{id}/claim/` - Claim ticket
- `PATCH /api/v1/mentors/{id}/resolve/` - Resolve ticket

##### Reports
- `GET /api/v1/reports/summary/` - Analytics summary

---

## Connection Flow

### Main Website → Admin Panel

```
User on Main Website
         │
         ▼
   /admin-portal page
         │
         ▼
   Click "Access Admin Panel"
         │
         ▼
Opens http://localhost:5174
    (new tab/window)
         │
         ▼
   Admin Login Page
```

### Admin Panel → Backend API

```
Admin Panel Component
         │
         ▼
   Call API function
   (e.g., rosterApi.getParticipants())
         │
         ▼
   axios.get('/api/v1/participants/')
         │
         ▼
   Vite Proxy intercepts /api/v1
         │
         ▼
   Forward to http://localhost:4000/api/v1
         │
         ▼
   Django REST Framework
         │
         ▼
   Return JSON response
         │
         ▼
   Admin Panel updates UI
```

---

## Proxy Configuration

### Main Website (vite.config.js)
```javascript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

### Admin Panel (vite.config.js)
```javascript
export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

---

## CORS Configuration

### Backend (settings.py)
```python
# Allow requests from both frontend apps
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Main Website
    'http://localhost:5174',  # Admin Panel
]

# Development setting (less restrictive)
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!

CORS_ALLOW_CREDENTIALS = True
```

---

## Authentication Flow

```
1. Admin visits http://localhost:5174
         │
         ▼
2. Redirected to /login
         │
         ▼
3. Enter email + password
         │
         ▼
4. POST /api/v1/auth/login/
         │
         ▼
5. Backend validates credentials
         │
         ▼
6. Returns JWT token + user info
         │
         ▼
7. Token stored in localStorage
         │
         ▼
8. All API requests include:
   Authorization: Bearer <token>
         │
         ▼
9. Backend validates token on each request
```

---

## Real-time Communication

### WebSocket Connection (Socket.io)

```javascript
// admin/src/services/socket.js

import io from 'socket.io-client';

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
  auth: {
    token: localStorage.getItem('ops_token')
  }
});

// Real-time events
socket.on('participant:scanned', (data) => {
  // Update UI with new check-in
});

socket.on('pass:issued', (data) => {
  // Add new pass to active passes
});

socket.on('food:requested', (data) => {
  // Update food queue
});
```

---

## Development vs Production

### Development URLs
| Component | URL |
|-----------|-----|
| Main Website | http://localhost:5173 |
| Admin Panel | http://localhost:5174 |
| Backend API | http://localhost:4000 |

### Production URLs (Example)
| Component | URL |
|-----------|-----|
| Main Website | https://hackme26.com |
| Admin Panel | https://admin.hackme26.com |
| Backend API | https://api.hackme26.com |

### Environment Variables

**Admin Panel (.env.production)**
```env
VITE_API_BASE_URL=https://api.hackme26.com/api/v1
```

**Backend (settings.py)**
```python
ALLOWED_HOSTS = ['api.hackme26.com']
CORS_ALLOWED_ORIGINS = [
    'https://hackme26.com',
    'https://admin.hackme26.com'
]
```

---

## Security Considerations

1. **JWT Tokens**: Stored in localStorage, sent with each request
2. **CORS**: Configured to allow only specific origins in production
3. **HTTPS**: Required for production deployment
4. **Environment Variables**: Sensitive data not committed to repo
5. **Protected Routes**: Admin routes require authentication
6. **SQL Injection**: Django ORM prevents SQL injection
7. **XSS Protection**: React escapes content by default

---

## Monitoring & Debugging

### Browser DevTools
- **Network Tab**: Monitor API requests/responses
- **Console**: Check for errors and logs
- **Application Tab**: Inspect localStorage for tokens

### Backend Logs
```bash
# Django development server shows all requests
python manage.py runserver 4000

# Output shows:
# [timestamp] "GET /api/v1/participants/ HTTP/1.1" 200
```

### Common Issues
1. **CORS errors**: Check CORS settings in Django
2. **404 errors**: Verify proxy configuration in vite.config.js
3. **Authentication errors**: Check JWT token in localStorage
4. **Port conflicts**: Ensure ports 4000, 5173, 5174 are free

---

## Deployment Architecture

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │  Load Balancer │
              └────────────────┘
                       │
         ┬─────────────┼─────────────┬
         │             │             │
         ▼             ▼             ▼
  ┌───────────┐ ┌───────────┐ ┌───────────┐
  │  Website  │ │   Admin   │ │    API    │
  │  (Vercel) │ │ (Vercel)  │ │ (Railway) │
  │           │ │           │ │           │
  │   CDN     │ │   CDN     │ │ Postgres  │
  └───────────┘ └───────────┘ └───────────┘
```

---

**For detailed setup instructions, see SETUP.md**  
**For deployment guides, see README.md**

© 2026 HackMe'26 • VISAT Engineering College
