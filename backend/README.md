# HackMe '26 — Django REST & SQLite Backend

Robust, lightweight backend powering the **HackMe '26 Digital Pass & Operations Admin Panel**. Built with **Django 5**, **Django REST Framework (DRF)**, and **SQLite** for rapid local deployment and zero-configuration operations.

---

## 🛠 Tech Stack

- **Framework:** Django 5.1.4
- **API Engine:** Django REST Framework 3.15.2
- **CORS Handling:** `django-cors-headers` 4.6.0
- **Database:** SQLite 3 (`backend/db.sqlite3`)
- **Python Version:** Python 3.10+ (tested on Python 3.14)

---

## 📁 Data Models

1. **`DaySession`** — Tracks hackathon session blocks (e.g. Day 1 24H sprint, Day 2 polish & demos) with start/end timestamps and session status (`active`, `closed`).
2. **`Team`** — Registered hackathon squads with table assignments and project titles.
3. **`Participant`** — Hackathon attendees tied to teams, badge/roll number, real-time check-in status (`present`, `not_scanned`, `absent`), QR scan timestamps, and override audit notes.
4. **`MovementPass`** — Real-time venue movement tracking supporting:
   - `WASHROOM` (10m threshold)
   - `FOOD_PICKUP` (20m threshold)
   - `REST_BREAK` (45m threshold)
   - `LEFT_VENUE` (90m safety critical alert threshold)
5. **`FoodRequest`** — Operations catering queue (`pending` → `preparing` → `ready` → `delivered`).
6. **`MentorRequest`** — Participant help tickets (`pending` → `claimed` → `resolved`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Apply Migrations
```bash
python manage.py makemigrations api
python manage.py migrate
```

### 3. Seed Realistic Cohort Data
```bash
python manage.py seed_data
```
*Seeds 2 Day Sessions, 8 Teams, 24 Participants, active movement passes, food orders, and mentor tickets into `db.sqlite3`.*

### 4. Run Django Server
```bash
python manage.py runserver 127.0.0.1:8000
```

---

## 🌐 API Reference (`/api/v1/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/days/` | List all hackathon day sessions |
| `POST` | `/api/v1/days/{id}/close/` | Close session, auto-lock roster, and force-close open passes |
| `GET` | `/api/v1/participants/` | List cohort participants (filter by `?team=...` or `?status=...`) |
| `POST` | `/api/v1/participants/scan/` | Unified QR scan engine (checkin, departure, return) |
| `POST` | `/api/v1/participants/{id}/override/` | Faculty/Ops manual status override |
| `GET` | `/api/v1/passes/?status=active` | Active movement passes with overdue tracking |
| `POST` | `/api/v1/passes/{id}/mark_returned/` | Mark pass returned |
| `POST` | `/api/v1/passes/{id}/force_close/` | Force-close pass with reason |
| `GET` | `/api/v1/food/` | Food request queue |
| `PATCH` | `/api/v1/food/{id}/advance/` | Advance food status (`pending` → `preparing` → `ready` → `delivered`) |
| `GET` | `/api/v1/mentors/` | Mentor assistance tickets |
| `PATCH` | `/api/v1/mentors/{id}/claim/` | Assign mentor to ticket |
| `PATCH` | `/api/v1/mentors/{id}/resolve/` | Resolve mentor ticket |
| `GET` | `/api/v1/reports/summary/` | Aggregate metrics (attendance rate, active passes, pass breakdown) |

---

## 🖥 Admin Panel
Create a superuser to inspect and manage data via Django's graphical admin:
```bash
python manage.py createsuperuser
```
Then visit: `http://127.0.0.1:8000/admin/`
