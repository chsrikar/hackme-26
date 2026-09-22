from flask import Flask, render_template, request, redirect, url_for, flash
from dotenv import load_dotenv

import os
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

    cursor.execute("""
        SELECT
            p.id AS participant_id,
            p.name,
            p.college,
            p.department_batch,
            p.mobile,
            p.email,
            p.payment_status,
            p.hostel_access,
            p.registration_status,

            ps.id AS pass_record_id,
            ps.pass_id,
            ps.status,
            ps.sent

        FROM passes ps

        JOIN participants p
            ON p.id = ps.participant_id

        WHERE
            ps.verification_token = ? OR ps.pass_id = ?
    """, (
        token,
        token
    ))

    participant = cursor.fetchone()

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


# =========================================================
# API SCAN (FOR EXTERNAL SCANNERS & ADMIN PORTAL)
# =========================================================

@app.route("/api/scan", methods=["POST"])
def api_scan():
    """
    REST API endpoint for scanning passes programmatically
    (e.g., from Admin Portal webcam or handheld scanners).
    """
    data = request.get_json(silent=True) or {}
    token = data.get("token") or data.get("qrToken") or data.get("passId")

    if not token:
        return {"success": False, "error": "Missing QR token or passId"}, 400

    # Extract token if a full URL was scanned
    if "/verify/" in token:
        token = token.split("/verify/")[-1].split("?")[0].strip()

    connection = get_connection()
    cursor = connection.cursor()

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

            ps.pass_id,
            ps.status,
            ps.sent
        FROM passes ps
        JOIN participants p ON p.id = ps.participant_id
        WHERE ps.verification_token = ? OR ps.pass_id = ?
    """, (token, token))

    participant = cursor.fetchone()

    if not participant:
        connection.close()
        return {"success": False, "error": "Participant or pass not found"}, 404

    is_active = (
        participant["registration_status"] == "ACTIVE"
        and participant["status"] == "ACTIVE"
        and participant["sent"] == 1
    )

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

    scan_type = data.get("type", "EVENT ENTRY")
    location = data.get("location", "Admin Desk")
    scanned_by = data.get("scannedBy", "Admin Portal")

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
            "hostelAccess": bool(participant["hostel_access"])
        },
        "totalScans": total_scans
    }




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
        host="127.0.0.1",
        port=5000,
        debug=True
    )