# HackMe'26 Full Stack Setup Guide

This guide will help you set up and run the complete HackMe'26 platform with all three components: Backend API, Main Website, and Admin Panel.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **pip** (comes with Python)
- **Git** ([Download](https://git-scm.com/))

### Verify Installation

```bash
node --version   # Should show v18 or higher
npm --version    # Should show 8 or higher
python --version # Should show 3.10 or higher
pip --version    # Should show pip version
```

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hackme26
```

---

### 2. Backend Setup (Django)

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

If you don't have a `requirements.txt`, install manually:
```bash
pip install django djangorestframework django-cors-headers
```

#### 2.4 Run Database Migrations

```bash
python manage.py migrate
```

#### 2.5 (Optional) Seed Sample Data

```bash
# Load sample participants, teams, and test data
python manage.py seed_data
```

#### 2.6 Start Django Development Server

```bash
python manage.py runserver 4000
```

✅ Backend should now be running at: **http://localhost:4000**

You can test it by visiting: http://localhost:4000/api/v1/participants/

**Keep this terminal open!**

---

### 3. Main Website Setup

#### 3.1 Open New Terminal

Open a **new terminal window/tab** and navigate to project root:

```bash
cd hackme26  # or wherever your project is
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Start Development Server

```bash
npm run dev
```

✅ Main website should now be running at: **http://localhost:5173**

**Keep this terminal open!**

---

### 4. Admin Panel Setup

#### 4.1 Open Another New Terminal

Open a **third terminal window/tab**:

```bash
cd hackme26/admin
```

#### 4.2 Install Dependencies

```bash
npm install
```

#### 4.3 (Optional) Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env if needed (default values work for local development)
```

#### 4.4 Start Admin Development Server

```bash
npm run dev
```

✅ Admin panel should now be running at: **http://localhost:5174**

**Keep this terminal open!**

---

## Verify Everything Works

### Backend API
Visit: http://localhost:4000/api/v1/participants/

Should see: JSON response with participants list (or empty array)

### Main Website
Visit: http://localhost:5173

Should see: HackMe'26 homepage with pixel-art theme

### Admin Panel
Visit: http://localhost:5174

Should see: Admin login page

### Admin Portal (from main site)
Visit: http://localhost:5173/admin-portal

Should see: Admin portal gateway page with access button

---

## Admin Panel Access

Contact the organizing team for admin panel credentials.

---

## Running All Services Together

You need **3 terminal windows** running simultaneously:

| Terminal | Command | Port | URL |
|----------|---------|------|-----|
| Terminal 1 | `cd backend && python manage.py runserver 4000` | 4000 | http://localhost:4000 |
| Terminal 2 | `npm run dev` (in root) | 5173 | http://localhost:5173 |
| Terminal 3 | `cd admin && npm run dev` | 5174 | http://localhost:5174 |

### Alternative: Using Concurrently

Install `concurrently` to run all services with one command:

```bash
npm install -g concurrently
```

Add to root `package.json`:
```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev\" \"cd admin && npm run dev\" \"cd backend && python manage.py runserver 4000\""
  }
}
```

Then run:
```bash
npm run dev:all
```

---

## Common Issues & Solutions

### Issue: Port Already in Use

**Error**: `Address already in use` or port conflict

**Solution**:
```bash
# Windows - Kill process on port
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4000 | xargs kill -9
```

### Issue: Python Virtual Environment Not Activating

**Windows PowerShell Execution Policy Error**

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database errors in Django

**Solution**:
```bash
# Delete database and recreate
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py seed_data
```

### Issue: CORS errors in browser console

**Solution**: Ensure backend `settings.py` has:
```python
CORS_ALLOW_ALL_ORIGINS = True  # Development only
```

---

## Development Workflow

### Making Changes

#### Frontend (Main Website or Admin Panel)
1. Edit files in `src/` or `admin/src/`
2. Changes hot-reload automatically
3. Check browser console for errors

#### Backend (Django API)
1. Edit files in `backend/api/`
2. Server restarts automatically for most changes
3. For model changes, create and run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### Testing API Endpoints

Use tools like:
- **Browser**: Direct GET requests
- **Postman**: Full API testing
- **curl**: Command-line testing

Example:
```bash
# Get all participants
curl http://localhost:4000/api/v1/participants/

# Create food request
curl -X POST http://localhost:4000/api/v1/food/ \
  -H "Content-Type: application/json" \
  -d '{"team": "Team Alpha", "table": "A1", "items": ["Pizza"]}'
```

---

## Next Steps

1. ✅ **Explore the Admin Panel**: Login and explore live operations features
2. ✅ **Test QR Scanning**: Use the scanner in Live Ops page
3. ✅ **Check Reports**: View analytics in Reports page
4. ✅ **Customize Content**: Update team info, prizes, schedule
5. ✅ **Deploy to Production**: See README.md for deployment guides

---

## Getting Help

- **Documentation**: Check README.md for detailed info
- **Issues**: Review error messages carefully
- **Contact**: Reach out to the development team

---

## Quick Reference

### Start All Services
```bash
# Terminal 1 - Backend
cd backend
.\venv\Scripts\Activate.ps1  # Windows
python manage.py runserver 4000

# Terminal 2 - Main Site
npm run dev

# Terminal 3 - Admin Panel
cd admin
npm run dev
```

### Access URLs
- Main Website: http://localhost:5173
- Admin Panel: http://localhost:5174
- Admin Portal: http://localhost:5173/admin-portal
- Backend API: http://localhost:4000/api/v1

---

**Happy Hacking! 🚀**

© 2026 HackMe'26 • VISAT Engineering College • Cyborgs CSE Association
