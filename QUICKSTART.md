# 🚀 HackMe'26 Quick Start Guide

Get up and running in 5 minutes!

---

## Option 1: Automated Startup (Windows)

### Using PowerShell Script
```powershell
# Run from project root
.\start-all.ps1
```

### Using Batch File
```cmd
# Run from project root
start-all.bat
```

This will open 3 terminal windows running all services!

---

## Option 2: Manual Startup

### Terminal 1 - Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
python manage.py migrate
python manage.py runserver 4000
```

### Terminal 2 - Main Website
```bash
npm install
npm run dev
```

### Terminal 3 - Admin Panel
```bash
cd admin
npm install
npm run dev
```

---

## ✅ Verify It Works

| Service | URL | Expected |
|---------|-----|----------|
| Main Website | http://localhost:5173 | Homepage with pixel art theme |
| Admin Panel | http://localhost:5174 | Admin login page |
| Admin Portal | http://localhost:5173/admin-portal | Access gateway page |
| Backend API | http://localhost:4000/api/v1/participants/ | JSON array |

---

## 📚 Need More Help?

- **Full Setup Guide**: See [SETUP.md](./SETUP.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Documentation**: See [README.md](./README.md)
- **All Docs**: See [DOCS_INDEX.md](./DOCS_INDEX.md) for complete documentation index

---

## 🎯 Quick Commands

```bash
# Start main website
npm run dev

# Start admin panel
npm run dev:admin

# Start backend (from backend/)
python manage.py runserver 4000

# Seed sample data
cd backend && python manage.py seed_data

# Build for production
npm run build              # Main website
npm run build:admin        # Admin panel
```

---

## 🛑 Stop All Services

Press `Ctrl + C` in each terminal window

---

**Happy Hacking! 🎉**
