from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from dotenv import load_dotenv

import os
import json
import secrets
import sqlite3
import re
import smtplib
from pathlib import Path
from email.message import EmailMessage

from database import initialize_database, get_connection


# =========================================================
# CONFIGURATION
# =========================================================

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv(
    "FLASK_SECRET_KEY",
    "development-secret-key"
)


BASE_DIR = Path(__file__).resolve().parent

PASS_DIR = BASE_DIR / "generated_passes"


SMTP_HOST = os.getenv(
    "SMTP_HOST",
    "smtp.gmail.com"
)

SMTP_PORT = int(
    os.getenv(
        "SMTP_PORT",
        "587"
    )
)

SMTP_USERNAME = os.getenv(
    "SMTP_USERNAME",
    ""
)

SMTP_PASSWORD = os.getenv(
    "SMTP_PASSWORD",
    ""
)

SMTP_FROM = os.getenv(
    "SMTP_FROM",
    SMTP_USERNAME
)

VERIFY_BASE_URL = os.getenv(
    "VERIFY_BASE_URL",
    "http://127.0.0.1:5000/verify/"
)


# =========================================================
# DATABASE
# =========================================================

initialize_database()


# =========================================================
# SEND EMAIL
# =========================================================

def send_pass_email(
    name,
    email,
    pass_id,
    pass_file
):
    """
    Send the generated HACK26 e-pass.

    Returns:
        True  -> email successfully sent
        False -> failed
    """

    if not email:
        raise ValueError(
            "Participant email address is missing."
        )

    if not SMTP_USERNAME:
        raise ValueError(
            "SMTP_USERNAME is missing in .env"
        )

    if not SMTP_PASSWORD:
        raise ValueError(
            "SMTP_PASSWORD is missing in .env"
        )

    if not pass_file.exists():
        raise FileNotFoundError(
            f"Pass image not found: {pass_file}"
        )

    # -----------------------------------------------------
    # EMAIL
    # -----------------------------------------------------

    message = EmailMessage()

    message["Subject"] = (
        "HACK26 Participant E-Pass"
    )

    message["From"] = SMTP_FROM

    message["To"] = email

    message.set_content(
        f"""
Hello {name},

Your HACK26 participant e-pass has been verified and activated.

Pass ID: {pass_id}

Please keep this e-pass safely available on your phone during the event.

Your QR code will be used for verification and event access.

HACK26
24 Hour Hackathon
VISAT Engineering College
25 & 26 September 2026

See you at HACK26!

CYBORGS
CSE Technical Association
"""
    )

    # -----------------------------------------------------
    # ATTACH PASS IMAGE
    # -----------------------------------------------------

    with open(
        pass_file,
        "rb"
    ) as file:

        image_data = file.read()

    message.add_attachment(
        image_data,
        maintype="image",
        subtype="png",
        filename=pass_file.name
    )

    # -----------------------------------------------------
    # SMTP
    # -----------------------------------------------------

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT,
        timeout=30
    ) as server:

        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(
            message
        )

    return True


# =========================================================
# DASHBOARD
# =========================================================

@app.route("/")
def dashboard():

    connection = get_connection()

    cursor = connection.cursor()

    # -----------------------------------------------------
    # REGISTERED
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM participants
        WHERE registration_status = 'ACTIVE'
    """)

    total_registered = (
        cursor.fetchone()["total"]
    )

    # -----------------------------------------------------
    # PAID
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM participants
        WHERE
            registration_status = 'ACTIVE'
            AND payment_status = 'PAID'
    """)

    total_paid = (
        cursor.fetchone()["total"]
    )

    # -----------------------------------------------------
    # GENERATED PASSES
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM passes ps
        JOIN participants p
            ON p.id = ps.participant_id
        WHERE p.registration_status = 'ACTIVE'
    """)

    total_passes = (
        cursor.fetchone()["total"]
    )

    # -----------------------------------------------------
    # ACTIVE PASSES
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM passes ps
        JOIN participants p
            ON p.id = ps.participant_id
        WHERE
            p.registration_status = 'ACTIVE'
            AND ps.status = 'ACTIVE'
    """)

    total_active = (
        cursor.fetchone()["total"]
    )

    # -----------------------------------------------------
    # HOSTEL
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM participants
        WHERE
            registration_status = 'ACTIVE'
            AND hostel_access = 1
    """)

    total_hostel = (
        cursor.fetchone()["total"]
    )

    # -----------------------------------------------------
    # SCANNED / CHECKED IN PARTICIPANTS
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(DISTINCT participant_id) AS total
        FROM scan_logs
    """)
    total_checked_in = cursor.fetchone()["total"]

    # -----------------------------------------------------
    # TOTAL SCANS RECORDED
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM scan_logs
    """)
    total_scans = cursor.fetchone()["total"]

    # -----------------------------------------------------
    # PARTICIPANTS
    # -----------------------------------------------------

    cursor.execute("""
        SELECT
            p.id,
            p.name,
            p.college,
            p.department_batch,
            p.mobile,
            p.email,
            p.payment_status,
            p.payment_proof_url,
            p.hostel_access,
            p.registration_status,

            ps.pass_id,
            ps.status AS pass_status,
            ps.sent,
            ps.sent_at,

            (SELECT COUNT(*) FROM scan_logs WHERE scan_logs.pass_id = ps.pass_id) AS scan_count,
            (SELECT MAX(timestamp) FROM scan_logs WHERE scan_logs.pass_id = ps.pass_id) AS last_scanned_at

        FROM participants p

        LEFT JOIN passes ps
            ON p.id = ps.participant_id

        WHERE
            p.registration_status = 'ACTIVE'

        ORDER BY p.id DESC
    """)

    participants = cursor.fetchall()

    # -----------------------------------------------------
    # RECENT SCANS LOG
    # -----------------------------------------------------

    cursor.execute("""
        SELECT
            sl.id,
            sl.pass_id,
            sl.participant_id,
            p.name AS participant_name,
            p.college,
            p.department_batch,
            sl.scan_type,
            sl.location,
            sl.timestamp,
            sl.scanned_by
        FROM scan_logs sl
        LEFT JOIN participants p
            ON p.id = sl.participant_id
        ORDER BY sl.id DESC
        LIMIT 50
    """)
    recent_scans = cursor.fetchall()

    connection.close()

    return render_template(
        "dashboard.html",

        total_registered=total_registered,
        total_paid=total_paid,
        total_passes=total_passes,
        total_active=total_active,
        total_hostel=total_hostel,
        total_checked_in=total_checked_in,
        total_scans=total_scans,

        participants=participants,
        recent_scans=recent_scans
    )


# =========================================================
# SEND PASS
# =========================================================

@app.post("/send-pass/<int:participant_id>")
def send_pass(participant_id):
    print("========== SEND PASS DEBUG ==========")
    print("SMTP USER:", SMTP_USERNAME)
    print("SMTP PASSWORD LENGTH:", len(SMTP_PASSWORD))
    print("SMTP PASSWORD SPACES:", SMTP_PASSWORD.count(" "))
    print("=====================================")

    connection = get_connection()

    cursor = connection.cursor()

    try:

        # -------------------------------------------------
        # GET PARTICIPANT + PASS
        # -------------------------------------------------

        cursor.execute("""
            SELECT
                p.id,
                p.name,
                p.email,
                p.payment_proof_url,

                ps.id AS pass_record_id,
                ps.pass_id,
                ps.status,
                ps.sent

            FROM participants p

            JOIN passes ps
                ON p.id = ps.participant_id

            WHERE
                p.id = ?
                AND p.registration_status = 'ACTIVE'
        """, (participant_id,))

        participant = cursor.fetchone()

        if not participant:

            flash(
                "Participant or pass not found.",
                "error"
            )

            return redirect(
                url_for("dashboard")
            )

        # -------------------------------------------------
        # ALREADY SENT
        # -------------------------------------------------

        if participant["sent"] == 1:

            flash(
                "This pass has already been sent.",
                "warning"
            )

            return redirect(
                url_for("dashboard")
            )

        # -------------------------------------------------
        # EMAIL CHECK
        # -------------------------------------------------

        if not participant["email"]:

            flash(
                "Participant has no email address.",
                "error"
            )

            return redirect(
                url_for("dashboard")
            )

        # -------------------------------------------------
        # PASS IMAGE
        # -------------------------------------------------

        pass_file = (
            PASS_DIR
            / f"{participant['pass_id']}.png"
        )

        if not pass_file.exists():

            flash(
                "Generated pass image is missing.",
                "error"
            )

            return redirect(
                url_for("dashboard")
            )

        # -------------------------------------------------
        # SEND EMAIL
        # -------------------------------------------------

        send_pass_email(
            name=participant["name"],
            email=participant["email"],
            pass_id=participant["pass_id"],
            pass_file=pass_file
        )

        # -------------------------------------------------
        # EMAIL SUCCESS
        #
        # ONLY NOW ACTIVATE THE PASS
        # -------------------------------------------------

        cursor.execute("""
            UPDATE participants

            SET
                payment_status = 'PAID',
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?
        """, (
            participant_id,
        ))

        cursor.execute("""
            UPDATE passes

            SET
                status = 'ACTIVE',
                sent = 1,
                sent_at = CURRENT_TIMESTAMP

            WHERE id = ?
        """, (
            participant["pass_record_id"],
        ))

        connection.commit()

        flash(
            f"Pass {participant['pass_id']} "
            f"sent successfully and activated.",
            "success"
        )

    except Exception as error:

        connection.rollback()

        print(
            "SEND PASS ERROR:",
            error
        )

        flash(
            f"Pass was NOT activated. "
            f"Email error: {error}",
            "error"
        )

    finally:

        connection.close()

    return redirect(
        url_for("dashboard")
    )


# =========================================================
# HELPER: CANONICAL PARTICIPANT & PASS RESOLUTION
# =========================================================

def resolve_or_create_participant_and_pass(cursor, token_str, client_data):
    """
    Safely and canonically resolves a participant and their corresponding HACK26 pass.
    Guarantees:
      ONE HACK26 PASS -> ONE PARTICIPANT -> MANY ACTIVITY RECORDS.
    If the participant exists in participants table without a row in passes,
    atomically links/creates their passes row with unique pass_id & verification_token.
    If the participant is newly arriving or not in database, creates the participant
    and assigns a unique pass_id.
    Handles concurrent scans safely with sqlite3 UNIQUE constraints.
    """
    token_str = str(token_str or "").strip()

    # 1. Check if token_str contains JSON payload
    if token_str.startswith("{") and token_str.endswith("}"):
        try:
            parsed = json.loads(token_str)
            token_str = str(parsed.get("passId") or parsed.get("pass_id") or parsed.get("rollNumber") or parsed.get("rollNo") or parsed.get("id") or "").strip()
            for k, v in parsed.items():
                if k not in client_data or not client_data[k]:
                    client_data[k] = v
        except Exception:
            pass

    # Extract token if a full URL was scanned
    if "/verify/" in token_str:
        token_str = token_str.split("/verify/")[-1].split("?")[0].split("#")[0].strip()

    # Direct query in passes JOIN participants (only if token_str provided)
    if token_str:
        cursor.execute("""
            SELECT
                p.id AS participant_id,
                p.name,
                p.college,
                p.department_batch,
                p.mobile,
                p.email,
                p.hostel_access,
                p.registration_status,
                ps.id AS pass_record_id,
                ps.pass_id,
                ps.verification_token,
                ps.status,
                ps.sent
            FROM passes ps
            JOIN participants p ON p.id = ps.participant_id
            WHERE ps.verification_token = ?
               OR ps.pass_id = ?
               OR UPPER(ps.pass_id) = UPPER(?)
               OR (LENGTH(?) >= 8 AND ps.verification_token LIKE ?)
        """, (token_str, token_str, token_str, token_str, f"%{token_str}%"))

        row = cursor.fetchone()
        if row:
            return dict(row), None

    # 2. If not found in passes, look up participant in participants table
    part_id = None
    hm_match = re.match(r"^HM26-(\d{3,4})$", token_str, re.IGNORECASE)
    if hm_match:
        part_id = int(hm_match.group(1))
    elif token_str.isdigit():
        part_id = int(token_str)
    elif client_data.get("participantId") and str(client_data.get("participantId")).isdigit():
        part_id = int(client_data.get("participantId"))

    part_name = (client_data.get("name") or client_data.get("participantName") or "").strip()
    part_phone = (client_data.get("mobile") or client_data.get("phone") or "").strip()

    participant_row = None
    if part_id:
        cursor.execute("SELECT * FROM participants WHERE id = ?", (part_id,))
        participant_row = cursor.fetchone()

    if not participant_row and part_phone:
        cursor.execute("SELECT * FROM participants WHERE mobile = ? OR mobile LIKE ?", (part_phone, f"%{part_phone[-10:]}%"))
        participant_row = cursor.fetchone()

    if not participant_row and part_name:
        cursor.execute("SELECT * FROM participants WHERE UPPER(name) = UPPER(?)", (part_name,))
        participant_row = cursor.fetchone()

    # 3. If participant exists in participants table:
    if participant_row:
        p_id = participant_row["id"]
        # Check if pass already exists for this participant
        cursor.execute("SELECT * FROM passes WHERE participant_id = ?", (p_id,))
        existing_pass = cursor.fetchone()

        if not existing_pass:
            # Generate or reuse permanent Pass ID
            assigned_pass_id = f"HM26-{p_id:03d}"
            cursor.execute("SELECT id FROM passes WHERE pass_id = ?", (assigned_pass_id,))
            if cursor.fetchone():
                cursor.execute("SELECT pass_id FROM passes WHERE pass_id LIKE 'HM26-%'")
                existing_numbers = [
                    int(r["pass_id"][5:]) for r in cursor.fetchall()
                    if r["pass_id"][5:].isdigit()
                ]
                highest = max(existing_numbers, default=0)
                assigned_pass_id = f"HM26-{highest + 1:03d}"

            v_token = secrets.token_urlsafe(32)
            try:
                cursor.execute("""
                    INSERT INTO passes (
                        participant_id,
                        pass_id,
                        verification_token,
                        status,
                        generated_at,
                        sent,
                        sent_at
                    ) VALUES (?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
                """, (p_id, assigned_pass_id, v_token))
            except sqlite3.IntegrityError:
                pass

        # Re-query joined record
        cursor.execute("""
            SELECT
                p.id AS participant_id,
                p.name,
                p.college,
                p.department_batch,
                p.mobile,
                p.email,
                p.hostel_access,
                p.registration_status,
                ps.id AS pass_record_id,
                ps.pass_id,
                ps.verification_token,
                ps.status,
                ps.sent
            FROM passes ps
            JOIN participants p ON p.id = ps.participant_id
            WHERE p.id = ?
        """, (p_id,))
        joined = cursor.fetchone()
        if joined:
            return dict(joined), None

    # 4. If participant does NOT exist at all, only create if explicit participant name is provided (e.g. valid intake/QR payload)
    if part_name:
        final_name = part_name
        final_college = client_data.get("college", "VISAT")
        final_dept = client_data.get("department", "CSE")
        final_mobile = part_phone or ""
        final_email = client_data.get("email", "")

        # Generate a deterministic unique source_key for participant deduplication
        norm_phone = re.sub(r"[^\d+]", "", final_mobile) if final_mobile else ""
        norm_name = re.sub(r"\s+", " ", final_name).strip().upper()
        if norm_phone:
            participant_key = f"M:{norm_phone}"
        else:
            participant_key = f"N:{norm_name}"

        try:
            cursor.execute("""
                INSERT INTO participants (
                    source_key,
                    name,
                    college,
                    department_batch,
                    mobile,
                    email,
                    payment_status,
                    registration_status
                ) VALUES (?, ?, ?, ?, ?, ?, 'PAID', 'ACTIVE')
            """, (participant_key, final_name, final_college, final_dept, final_mobile, final_email))
            new_pid = cursor.lastrowid
        except sqlite3.IntegrityError:
            # Another concurrent request already inserted this participant; fetch it
            cursor.execute("SELECT * FROM participants WHERE source_key = ? OR (mobile = ? AND mobile != '')", (participant_key, final_mobile))
            participant_row = cursor.fetchone()
            if participant_row:
                return resolve_or_create_participant_and_pass(cursor, f"HM26-{participant_row['id']:03d}", client_data)

        new_pass_id = f"HM26-{new_pid:03d}"
        cursor.execute("SELECT id FROM passes WHERE pass_id = ?", (new_pass_id,))
        if cursor.fetchone():
            cursor.execute("SELECT pass_id FROM passes WHERE pass_id LIKE 'HM26-%'")
            existing_numbers = [
                int(r["pass_id"][5:]) for r in cursor.fetchall()
                if r["pass_id"][5:].isdigit()
            ]
            highest = max(existing_numbers, default=0)
            new_pass_id = f"HM26-{highest + 1:03d}"

        v_token = secrets.token_urlsafe(32)
        try:
            cursor.execute("""
                INSERT INTO passes (
                    participant_id,
                    pass_id,
                    verification_token,
                    status,
                    generated_at,
                    sent,
                    sent_at
                ) VALUES (?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
            """, (new_pid, new_pass_id, v_token))
        except sqlite3.IntegrityError:
            pass

        cursor.execute("""
            SELECT
                p.id AS participant_id,
                p.name,
                p.college,
                p.department_batch,
                p.mobile,
                p.email,
                p.hostel_access,
                p.registration_status,
                ps.id AS pass_record_id,
                ps.pass_id,
                ps.verification_token,
                ps.status,
                ps.sent
            FROM passes ps
            JOIN participants p ON p.id = ps.participant_id
            WHERE p.id = ?
        """, (new_pid,))
        created_row = cursor.fetchone()
        if created_row:
            return dict(created_row), None

    return None, "Participant or pass not found"


# =========================================================
# VERIFY QR & STORE SCAN IN DATABASE
# =========================================================

@app.route("/verify/<token>")
def verify_pass(token):
    """
    Called whenever a participant e-pass QR code is scanned.
    Validates pass and automatically records the scan in scan_logs.
    """
    connection = get_connection()
    cursor = connection.cursor()

    # First attempt resolve_or_create to seamlessly recognize any registered attendee
    participant, _ = resolve_or_create_participant_and_pass(cursor, token, {})

    # -----------------------------------------------------
    # INVALID QR
    # -----------------------------------------------------

    if not participant:
        connection.close()
        return render_template(
            "verify.html",
            valid=False,
            participant=None,
            total_scans=0,
            scan_logged=False,
            message="Unrecognized or invalid pass token."
        )

    # -----------------------------------------------------
    # CHECK PASS STATUS
    # -----------------------------------------------------

    is_active = (
        participant["registration_status"] == "ACTIVE"
        and participant["status"] == "ACTIVE"
        and participant["sent"] == 1
    )

    scan_logged = False
    scan_type = request.args.get("type", "EVENT ENTRY")
    location = request.args.get("loc", "Main Entrance")
    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "127.0.0.1")
    user_agent = request.headers.get("User-Agent", "Mobile Scanner")[:80]
    scanned_by = f"{client_ip} ({user_agent})"[:120]

    if is_active:
        # -------------------------------------------------
        # RECORD SCAN EVENT IN DATABASE
        # -------------------------------------------------
        cursor.execute("""
            INSERT INTO scan_logs (
                pass_id,
                participant_id,
                scan_type,
                location,
                timestamp,
                scanned_by
            ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
        """, (
            participant["pass_id"],
            participant["participant_id"],
            scan_type,
            location,
            scanned_by
        ))
        connection.commit()
        scan_logged = True

    # -----------------------------------------------------
    # TOTAL SCAN COUNT FOR THIS PASS
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total_scans, MAX(timestamp) AS last_scan
        FROM scan_logs
        WHERE pass_id = ?
    """, (participant["pass_id"],))

    stats = cursor.fetchone()
    total_scans = stats["total_scans"] if stats else 0
    last_scan = stats["last_scan"] if stats else None

    connection.close()

    # -----------------------------------------------------
    # SHOW RESULT
    # -----------------------------------------------------

    return render_template(
        "verify.html",
        valid=is_active,
        participant=participant,
        total_scans=total_scans,
        last_scan=last_scan,
        scan_logged=scan_logged,
        location=location,
        scan_type=scan_type
    )


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return response


# =========================================================
# API SCAN (FOR EXTERNAL SCANNERS & ADMIN PORTAL)
# =========================================================

@app.route("/api/scan", methods=["POST", "OPTIONS"])
def api_scan():
    """
    REST API endpoint for scanning passes programmatically
    (e.g., from Admin Portal webcam or handheld scanners).
    """
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}
    token = data.get("token") or data.get("qrToken") or data.get("passId") or data.get("rollNo") or data.get("mobile") or data.get("phone")

    if not token and not data.get("name"):
        return {"success": False, "error": "Missing QR token or passId"}, 400

    token_str = str(token or "").strip()

    connection = get_connection()
    cursor = connection.cursor()

    try:
        participant, err = resolve_or_create_participant_and_pass(cursor, token_str, data)
        if not participant:
            connection.close()
            return {"success": False, "error": err or "Participant or pass not found"}, 404

        # Allow scan logging for any registered participant
        is_active = (participant["registration_status"] == "ACTIVE")

        if not is_active:
            connection.close()
            return {
                "success": False,
                "error": "Pass is inactive or unapproved",
                "participant": {
                    "name": participant["name"],
                    "passId": participant["pass_id"],
                    "status": participant["status"]
                }
            }, 403

        scan_type = data.get("type") or data.get("scanType") or "EVENT ENTRY"
        location = data.get("location", "Admin Scanner Station")
        scanned_by = data.get("scannedBy", "Admin Portal")
        metadata = data.get("metadata") or data.get("duration") or ""
        if isinstance(metadata, dict):
            metadata = json.dumps(metadata)
        elif data.get("duration") and not metadata:
            metadata = f"duration: {data.get('duration')}"

        cursor.execute("""
            INSERT INTO scan_logs (
                pass_id,
                participant_id,
                scan_type,
                location,
                timestamp,
                scanned_by,
                metadata
            ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
        """, (
            participant["pass_id"],
            participant["participant_id"],
            scan_type,
            location,
            scanned_by,
            metadata
        ))
        connection.commit()

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM scan_logs
            WHERE pass_id = ?
        """, (participant["pass_id"],))

        total_scans = cursor.fetchone()["total"]
        connection.close()

        return {
            "success": True,
            "message": "Scan recorded successfully in database",
            "participant": {
                "id": participant["participant_id"],
                "name": participant["name"],
                "passId": participant["pass_id"],
                "college": participant["college"],
                "department": participant["department_batch"],
                "phone": participant["mobile"],
                "hostelAccess": bool(participant["hostel_access"])
            },
            "totalScans": total_scans
        }
    except Exception as e:
        connection.rollback()
        connection.close()
        return {"success": False, "error": str(e)}, 500


# =========================================================
# GET ROSTER / PARTICIPANTS (FOR REFRESH & HYDRATION)
# =========================================================

@app.route("/api/roster", methods=["GET", "OPTIONS"])
@app.route("/api/participants", methods=["GET", "OPTIONS"])
def api_roster():
    if request.method == "OPTIONS":
        return "", 200

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            p.id,
            p.name,
            p.college,
            p.department_batch,
            p.mobile,
            p.email,
            p.hostel_access,
            p.registration_status,

            ps.pass_id,
            ps.status AS pass_status,

            (SELECT COUNT(*) FROM scan_logs WHERE scan_logs.pass_id = ps.pass_id) AS scan_count,
            (SELECT MAX(timestamp) FROM scan_logs WHERE scan_logs.pass_id = ps.pass_id) AS last_scanned_at,
            (SELECT scan_type FROM scan_logs WHERE scan_logs.pass_id = ps.pass_id ORDER BY id DESC LIMIT 1) AS last_scan_type

        FROM participants p

        LEFT JOIN passes ps
            ON p.id = ps.participant_id

        WHERE
            p.registration_status = 'ACTIVE'

        ORDER BY p.id ASC
    """)

    rows = cursor.fetchall()
    connection.close()

    result = []
    for r in rows:
        pass_id = r["pass_id"] or f"HM26-{r['id']:03d}"
        is_present = (r["scan_count"] or 0) > 0
        scanned_at_str = None
        if r["last_scanned_at"]:
            try:
                # Format to HH:MM if standard timestamp
                parts = str(r["last_scanned_at"]).split(" ")
                scanned_at_str = parts[1][:5] if len(parts) > 1 else parts[0]
            except Exception:
                scanned_at_str = str(r["last_scanned_at"])

        result.append({
            "id": str(r["id"]),
            "name": r["name"],
            "rollNo": pass_id,
            "passId": pass_id,
            "team": r["department_batch"] or "Team Alpha",
            "table": "Table 01",
            "phone": r["mobile"] or "",
            "college": r["college"] or "VISAT",
            "department": r["department_batch"] or "CSE",
            "status": "present" if is_present else "not_scanned",
            "scannedAt": scanned_at_str,
            "scanCount": r["scan_count"] or 0,
            "lastScanType": r["last_scan_type"] or "",
            "markedBy": "qr_scan" if is_present else ""
        })

    return jsonify(result)


# =========================================================
# GET ACTIVE MOVEMENT PASSES (FOR REFRESH & HYDRATION)
# =========================================================

@app.route("/api/active-passes", methods=["GET", "OPTIONS"])
def api_active_passes():
    if request.method == "OPTIONS":
        return "", 200

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            sl.id,
            sl.pass_id,
            sl.participant_id,
            sl.scan_type,
            sl.location,
            sl.timestamp,
            sl.metadata,
            p.name,
            p.mobile,
            p.department_batch
        FROM scan_logs sl
        JOIN (
            SELECT pass_id, MAX(id) AS max_id
            FROM scan_logs
            GROUP BY pass_id
        ) latest ON sl.id = latest.max_id
        JOIN participants p ON p.id = sl.participant_id
        WHERE sl.scan_type IN ('WASHROOM', 'FOOD_PICKUP', 'REST_BREAK', 'LEFT_VENUE')
        ORDER BY sl.id DESC
    """)

    rows = cursor.fetchall()
    connection.close()

    result = []
    for r in rows:
        result.append({
            "id": f"pass-db-{r['id']}",
            "studentId": str(r["participant_id"]),
            "participantName": r["name"],
            "rollNo": r["pass_id"],
            "passId": r["pass_id"],
            "phone": r["mobile"] or "",
            "team": r["department_batch"] or "Team Alpha",
            "passType": r["scan_type"],
            "reason": f"Authorized {r['scan_type']}",
            "departTime": r["timestamp"],
            "status": "active"
        })

    return jsonify(result)


# =========================================================
# GET RECENT SCANS ACTIVITY LOG (FOR REFRESH & HYDRATION)
# =========================================================

@app.route("/api/recent-scans", methods=["GET", "OPTIONS"])
def api_recent_scans():
    if request.method == "OPTIONS":
        return "", 200

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            sl.id,
            sl.pass_id,
            sl.participant_id,
            sl.scan_type,
            sl.location,
            sl.timestamp,
            sl.metadata,
            p.name,
            p.mobile,
            p.department_batch
        FROM scan_logs sl
        LEFT JOIN participants p ON p.id = sl.participant_id
        ORDER BY sl.id DESC
        LIMIT 100
    """)

    rows = cursor.fetchall()
    connection.close()

    result = []
    for r in rows:
        scan_t = r["scan_type"]
        if scan_t == "EVENT ENTRY":
            action_type = "CHECKIN"
        elif "RETURN" in scan_t:
            action_type = "RETURN"
        else:
            action_type = "PASS_OUT"

        ts_str = str(r["timestamp"])
        time_part = ts_str.split(" ")[1][:5] if " " in ts_str else ts_str

        result.append({
            "id": f"scan-{r['id']}",
            "timestamp": ts_str,
            "timeStr": time_part,
            "name": r["name"] or f"Participant {r['pass_id']}",
            "rollNo": r["pass_id"],
            "passId": r["pass_id"],
            "team": r["department_batch"] or "Team Alpha",
            "actionType": action_type,
            "passType": scan_t if action_type != "CHECKIN" else None,
            "location": r["location"] or "Admin Station",
            "metadata": r["metadata"] or ""
        })

    return jsonify(result)


# =========================================================
# SEARCH
# =========================================================

@app.route("/search")
def search():
    query = request.args.get("q", "").strip()
    return redirect(url_for("dashboard", q=query))


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )