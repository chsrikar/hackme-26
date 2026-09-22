# HackMe'26 — Department of Computer Science & Engineering

The official website for **HackMe'26**, a 24-hour hackathon organized by Cyborgs, CSE Technical Association at VISAT Engineering College.

Built with **React**, **Vite**, **React Router DOM**, and custom CSS with a retro-futuristic pixel-art theme.

---

## 🚀 Project Structure

This repository contains **two applications**:

1. **Main Website** (`/src`) - Public-facing hackathon website
2. **Admin Panel** (`/admin`) - Operations dashboard for organizers
3. **Backend API** (`/backend`) - Django REST API

---

## Event Details

- **Date**: September 25-26, 2026
- **Venue**: VISAT Engineering College, Ernakulam, Kerala
- **Duration**: 24 hours
- **Prize Pool**: ₹1,45,000+
- **Registration Fee**: ₹50 per person

---

## Tech Stack

### Main Website
- **Frontend Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router DOM
- **Styling**: Custom CSS with design tokens
- **Animations**: Anime.js
- **Icons**: Lucide React

### Admin Panel
- **Frontend**: React 19 + Vite
- **UI Components**: Custom design system
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Charts**: Recharts
- **QR Scanner**: html5-qrcode

### Backend
- **Framework**: Django 5.1 + Django REST Framework
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **CORS**: django-cors-headers
- **Authentication**: JWT tokens

---

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- pip and virtualenv

### 1. Setup Backend (Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Seed with sample data
python manage.py seed_data

# Start Django server (port 4000)
python manage.py runserver 4000
```

### 2. Setup Main Website

```bash
# From project root
npm install

# Start main website (port 5173)
npm run dev

# Open http://localhost:5173
```

### 3. Setup Admin Panel

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start admin panel (port 5174)
npm run dev

# Open http://localhost:5174
```

### 🎯 Access Points

Once all three servers are running:

- **Main Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5174 (direct access)
- **Admin Portal Page**: http://localhost:5173/admin-portal (gateway from main site)
- **Backend API**: http://localhost:4000/api/v1

---

## 📂 Project Structure

```
hackme26/
├── backend/             # Django REST API
│   ├── api/             # API app with models, views, serializers
│   ├── backend/         # Django project settings
│   ├── manage.py
│   └── requirements.txt
│
├── admin/               # Admin Operations Panel
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API & socket services
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js   # Proxy config for API
│
├── src/                 # Main Website
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   ├── App.jsx
│   └── main.jsx
│
├── public/              # Static assets
├── package.json         # Main website dependencies
└── vite.config.js       # Main website config
```

---

## 🔑 Admin Panel Features

### Live Operations Dashboard
- **Real-time Attendance**: QR code scanning and manual check-in
- **Hall Pass Management**: Track participant movements (washroom, food, breaks)
- **Overdue Alerts**: Monitor participants who haven't returned
- **Food Request Queue**: Manage team food orders with status tracking
- **Mentor Assistance**: Queue system for technical help requests

### Day Session Management
- Start/close daily hackathon sessions
- Track participant attendance per day
- View historical session data

### Reports & Analytics
- Attendance trends and charts
- Hall pass frequency analysis
- Food demand patterns
- Export data to CSV/Excel

### Access Control
- Role-based authentication
- Secure JWT token system
- Protected routes

---

## 🔌 API Endpoints

### Core Resources
- `GET /api/v1/days/` - List all day sessions
- `POST /api/v1/days/` - Start new day session
- `GET /api/v1/participants/` - Get participant roster
- `POST /api/v1/participants/scan/` - Process QR scan
- `GET /api/v1/passes/` - Get active hall passes
- `POST /api/v1/passes/{id}/mark_returned/` - Mark pass returned
- `GET /api/v1/food/` - Get food requests
- `POST /api/v1/food/` - Create food request
- `GET /api/v1/mentors/` - Get mentor requests
- `POST /api/v1/reports/summary/` - Get analytics summary

See `backend/api/urls.py` and `backend/api/views.py` for complete API documentation.

---

## 🌐 Connecting Admin to Website

The admin panel is connected to the main website through:

1. **Admin Portal Page** (`/admin-portal`)
   - Access point for organizers from main site
   - Provides information about admin features
   - Opens admin panel in new tab

2. **Footer Link**
   - Subtle "🔒 Admin Portal" link in Resources section
   - Easy access for staff without cluttering main navigation

3. **API Proxy Configuration**
   - Both apps proxy API requests to `localhost:4000`
   - Configured in respective `vite.config.js` files

---

## 🚀 Production Deployment

### Backend (Railway/Render/Heroku)

```bash
# Update ALLOWED_HOSTS in settings.py
ALLOWED_HOSTS = ['your-domain.com', 'api.your-domain.com']

# Set environment variables
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=your-postgres-url

# Deploy using platform CLI or Git push
```

### Frontend Apps (Vercel/Netlify)

#### Main Website
```bash
# Set build settings
Build Command: npm run build
Output Directory: dist
Install Command: npm install

# Deploy
vercel --prod
```

#### Admin Panel
```bash
cd admin

# Set build settings
Build Command: npm run build
Output Directory: dist
Install Command: npm install

# Set environment variable
VITE_API_BASE_URL=https://your-api-domain.com/api/v1

# Deploy to separate subdomain
vercel --prod
```

### Environment Variables

**Admin Panel (.env)**
```env
VITE_API_BASE_URL=https://api.hackme26.com/api/v1
```

**Backend (Django)**
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=api.hackme26.com,hackme26.com
CORS_ALLOWED_ORIGINS=https://hackme26.com,https://admin.hackme26.com
```

---

## 🧪 Development Workflow

### Running All Services Simultaneously

**Option 1: Multiple Terminals**
```bash
# Terminal 1 - Backend
cd backend && python manage.py runserver 4000

# Terminal 2 - Main Website
npm run dev

# Terminal 3 - Admin Panel
cd admin && npm run dev
```

**Option 2: Using Concurrently (recommended)**
```bash
# Install concurrently globally
npm install -g concurrently

# Add to root package.json scripts:
"dev:all": "concurrently \"npm run dev\" \"cd admin && npm run dev\" \"cd backend && python manage.py runserver 4000\""

# Run all services
npm run dev:all
```

---

## Key Pages

### Main Website
- `/` - Home page with hero, tracks, and event info
- `/schedule` - Event timeline and schedule
- `/vectors` - Innovation tracks
- `/prizes` - Prize pool and rewards
- `/team` - Organizing team members
- `/contact` - Contact information
- `/faq` - Frequently asked questions
- `/rules` - Hackathon rules and guidelines
- `/admin-portal` - Admin access gateway

### Admin Panel
- `/` - Dashboard overview
- `/live` - Live operations (scanning, passes, queues)
- `/history` - Day session history
- `/reports` - Analytics and reports

---

## 🔐 Admin Authentication

The admin panel requires valid credentials to access. 

**For organizers**: Contact the tech team leads for access credentials (see CREDENTIALS.example.md for details).

**For developers**: Credentials are configured in `admin/src/services/api.js`. Never commit actual credentials to the repository.

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🤝 Contributing

This is the official website for HackMe'26. For suggestions or issues, contact the organizing team.

---

## 📄 License

© 2026 HackMe'26 • VISAT Engineering College • Cyborgs CSE Association

---

## 📞 Contact

For inquiries:
- **Sabeel**: 91882 68972
- **Parthiv**: 85476 37499
- **Nandhana**: 70125 87783

---

**Event organized by**: Cyborgs, CSE Technical Association  
**Venue**: VISAT Engineering College, Ernakulam, Kerala
