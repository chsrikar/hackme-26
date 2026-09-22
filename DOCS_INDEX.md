# 📚 HackMe'26 Documentation Index

Complete guide to all project documentation.

---

## 🚀 Getting Started

### For New Developers
1. **[QUICKSTART.md](./QUICKSTART.md)** ⚡ - Get running in 5 minutes
2. **[SETUP.md](./SETUP.md)** 🛠️ - Detailed setup instructions
3. **[README.md](./README.md)** 📖 - Project overview and features

### For Understanding Architecture
1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🏗️ - System design and connections
2. **Component Diagrams** - See ARCHITECTURE.md for visual flows

---

## 📁 Documentation Files

### Core Documentation

#### [README.md](./README.md)
**Purpose**: Main project documentation  
**Contents**:
- Event details
- Tech stack overview
- Project structure
- All three applications explained
- Admin panel features
- API endpoints
- Deployment guides
- Quick commands

**Read this if**: You want a complete overview of the project

---

#### [QUICKSTART.md](./QUICKSTART.md)
**Purpose**: Fast track to running the application  
**Contents**:
- Automated startup (scripts)
- Manual startup (3 terminals)
- Verification checklist
- Quick commands reference

**Read this if**: You want to start coding immediately

---

#### [SETUP.md](./SETUP.md)
**Purpose**: Comprehensive setup guide  
**Contents**:
- Prerequisites and verification
- Step-by-step backend setup
- Main website setup
- Admin panel setup
- Virtual environment creation
- Database migrations
- Sample data seeding
- Common issues and solutions
- Development workflow

**Read this if**: You're setting up for the first time or troubleshooting

---

#### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Purpose**: Technical architecture documentation  
**Contents**:
- System overview diagram
- Component details (Frontend/Backend)
- Database schema
- API endpoint reference
- Connection flow diagrams
- Proxy configuration
- CORS setup
- Authentication flow
- WebSocket communication
- Security considerations
- Deployment architecture

**Read this if**: You need to understand how everything connects

---

### Helper Scripts

#### [start-all.ps1](./start-all.ps1)
**Purpose**: PowerShell script to launch all services  
**Usage**:
```powershell
.\start-all.ps1
```
**What it does**:
- Checks for backend virtual environment
- Creates venv if missing
- Opens 3 PowerShell windows
- Starts backend (port 4000)
- Starts main website (port 5173)
- Starts admin panel (port 5174)

---

#### [start-all.bat](./start-all.bat)
**Purpose**: Batch script for CMD users  
**Usage**:
```cmd
start-all.bat
```
**What it does**:
- Opens 3 command prompt windows
- Starts all three services
- Shows access URLs

---

#### [test-connection.ps1](./test-connection.ps1)
**Purpose**: Verify all services are running  
**Usage**:
```powershell
.\test-connection.ps1
```
**What it does**:
- Tests HTTP connection to all services
- Reports which services are up/down
- Shows access URLs if all pass
- Provides startup instructions if failures

---

### Configuration Files

#### [admin/.env.example](./admin/.env.example)
**Purpose**: Environment variable template for admin panel  
**Contents**:
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```
**Usage**: Copy to `.env` and customize for your environment

---

## 🗺️ Quick Navigation

### I want to...

**...get started quickly**  
→ [QUICKSTART.md](./QUICKSTART.md)

**...set everything up properly**  
→ [SETUP.md](./SETUP.md)

**...understand how it all works**  
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

**...see all features and capabilities**  
→ [README.md](./README.md)

**...start all services at once**  
→ Run `.\start-all.ps1` or `start-all.bat`

**...check if everything is running**  
→ Run `.\test-connection.ps1`

**...find API endpoints**  
→ [ARCHITECTURE.md](./ARCHITECTURE.md) (API Endpoints section)

**...deploy to production**  
→ [README.md](./README.md) (Production Deployment section)

**...troubleshoot issues**  
→ [SETUP.md](./SETUP.md) (Common Issues section)

**...understand admin features**  
→ [README.md](./README.md) (Admin Panel Features section)

---

## 📊 Document Hierarchy

```
Documentation Structure

├── QUICKSTART.md           ⚡ Start here for speed
│
├── SETUP.md                🛠️ Detailed first-time setup
│
├── README.md               📖 Complete project reference
│   ├── Tech Stack
│   ├── Features
│   ├── Admin Panel Details
│   ├── API Reference
│   └── Deployment
│
├── ARCHITECTURE.md         🏗️ Technical deep-dive
│   ├── System Diagrams
│   ├── Database Schema
│   ├── Connection Flows
│   └── Security
│
├── Helper Scripts
│   ├── start-all.ps1       Launch all services (PowerShell)
│   ├── start-all.bat       Launch all services (CMD)
│   └── test-connection.ps1 Verify services running
│
└── Configuration
    └── admin/.env.example  Environment variables template
```

---

## 🎯 Reading Order Recommendations

### For First-Time Setup
1. QUICKSTART.md (overview)
2. SETUP.md (detailed steps)
3. Test with test-connection.ps1
4. Explore README.md for features

### For Understanding the System
1. README.md (overview)
2. ARCHITECTURE.md (technical details)
3. Code exploration in src/ and admin/src/

### For Development Work
1. ARCHITECTURE.md (understand connections)
2. README.md (API reference)
3. Code files directly

### For Deployment
1. README.md (deployment section)
2. ARCHITECTURE.md (production architecture)
3. Set up environment variables

---

## 📝 Documentation Standards

All documentation follows these standards:

- **Markdown formatting** for readability
- **Code blocks** with syntax highlighting
- **Visual diagrams** for complex concepts
- **Step-by-step instructions** where applicable
- **Clear section headers** for navigation
- **Examples** for clarity
- **Troubleshooting sections** for common issues

---

## 🔄 Keeping Documentation Updated

When making changes to the project:

1. **Update README.md** if adding new features
2. **Update ARCHITECTURE.md** if changing structure
3. **Update SETUP.md** if changing setup process
4. **Update scripts** if changing ports/commands
5. **Update .env.example** if adding environment variables

---

## 🤝 Contributing to Documentation

To improve documentation:

1. Use clear, concise language
2. Include code examples
3. Add diagrams for complex flows
4. Test all instructions before committing
5. Keep formatting consistent
6. Update this index when adding new docs

---

## 📞 Getting Help

If documentation doesn't answer your question:

1. Check the specific document's troubleshooting section
2. Search for error messages in SETUP.md
3. Review ARCHITECTURE.md for connection issues
4. Contact the development team

---

## 🎉 Quick Links Summary

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [QUICKSTART.md](./QUICKSTART.md) | Fast start | Want to run immediately |
| [SETUP.md](./SETUP.md) | Detailed setup | First time or troubleshooting |
| [README.md](./README.md) | Complete reference | Need full overview |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical design | Understanding system |
| start-all.ps1 | Launch script | Starting development |
| test-connection.ps1 | Verify services | Testing setup |

---

**Last Updated**: September 22, 2026  
**Maintained By**: HackMe'26 Development Team  
**Contact**: See README.md for team contact information

---

**© 2026 HackMe'26 • VISAT Engineering College • Cyborgs CSE Association**
