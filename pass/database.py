import sqlite3
from pathlib import Path


# =========================================================
# PROJECT PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

DATABASE_DIR = BASE_DIR / "database"
DATABASE_PATH = DATABASE_DIR / "hack26.db"


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_connection():
    """
    Create a connection to the SQLite database.
    """

    DATABASE_DIR.mkdir(exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)

    # Access columns by name:
    # row["name"], row["pass_id"], etc.
    connection.row_factory = sqlite3.Row

    return connection


def get_db():
    """
    Return a database connection.

    Used by the Flask application and sync system.
    """

    return get_connection()


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def initialize_database():
    """
    Create all required HACK26 tables.

    Existing tables/data are NOT deleted.
    """

    connection = get_connection()
    cursor = connection.cursor()

    # =====================================================
    # PARTICIPANTS
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS participants (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            -- Stable identifier for the Google Form submission
            source_key TEXT UNIQUE,

            form_timestamp TEXT,

            name TEXT NOT NULL,
            college TEXT,
            department_batch TEXT,
            mobile TEXT,
            email TEXT,

            -- Original Google Form answers
            payment_response TEXT,
            payment_proof_url TEXT,
            referral_code TEXT,

            -- Human/admin verified payment status
            -- PENDING = not verified
            -- PAID = manually verified
            payment_status TEXT NOT NULL DEFAULT 'PENDING',

            -- 0 = hostel access not allowed
            -- 1 = hostel access allowed
            hostel_access INTEGER NOT NULL DEFAULT 0,

            registration_status TEXT NOT NULL DEFAULT 'ACTIVE',

            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # =====================================================
    # PASSES
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS passes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            -- One participant can have only one pass
            participant_id INTEGER NOT NULL UNIQUE,

            -- Permanent public Pass ID
            --
            -- Format:
            -- HM26-001
            -- HM26-002
            -- HM26-003
            --
            -- NEVER reuse an existing Pass ID.
            pass_id TEXT NOT NULL UNIQUE,

            -- Secret token stored inside the QR code
            verification_token TEXT NOT NULL UNIQUE,

            -- INACTIVE until admin successfully sends the pass
            status TEXT NOT NULL DEFAULT 'INACTIVE',

            generated_at TEXT,

            -- 0 = not sent
            -- 1 = successfully sent
            sent INTEGER NOT NULL DEFAULT 0,

            sent_at TEXT,

            FOREIGN KEY (participant_id)
                REFERENCES participants(id)
        )
    """)

    # =====================================================
    # SCAN LOGS
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scan_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            pass_id TEXT NOT NULL,

            participant_id INTEGER NOT NULL,

            -- EVENT ENTRY
            -- EVENT EXIT
            -- HOSTEL ENTRY
            -- HOSTEL EXIT
            scan_type TEXT NOT NULL,

            location TEXT,

            timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

            scanned_by TEXT,

            FOREIGN KEY (participant_id)
                REFERENCES participants(id)
        )
    """)

    # =====================================================
    # ADMINS
    # =====================================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admins (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT NOT NULL UNIQUE,

            -- Password is stored only as a secure hash
            password_hash TEXT NOT NULL,

            -- ADMIN
            -- SECURITY
            -- HOSTEL_SECURITY
            role TEXT NOT NULL DEFAULT 'ADMIN',

            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # =====================================================
    # INDEXES
    # =====================================================

    # Fast participant searching
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_participants_name
        ON participants(name)
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_participants_mobile
        ON participants(mobile)
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_participants_email
        ON participants(email)
    """)

    # Fast pass lookup during QR verification
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_passes_pass_id
        ON passes(pass_id)
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_passes_token
        ON passes(verification_token)
    """)

    connection.commit()
    connection.close()


# =========================================================
# DIRECT EXECUTION
# =========================================================

if __name__ == "__main__":

    initialize_database()

    print("========================================")
    print("HACK26 DATABASE INITIALIZED")
    print("========================================")
    print(f"Database: {DATABASE_PATH}")