import os
import socket
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
import psycopg2

from flask import Flask, render_template


# =========================================================
# CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing from .env")


# =========================================================
# FLASK
# =========================================================

app = Flask(__name__)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_connection():

    parsed = urlparse(DATABASE_URL)

    hostname = parsed.hostname

    if not hostname:
        raise RuntimeError(
            "Could not determine PostgreSQL hostname."
        )

    try:
        ipv4_address = socket.gethostbyname(hostname)

    except socket.gaierror as error:

        raise RuntimeError(
            f"Could not resolve PostgreSQL hostname: {hostname}"
        ) from error

    return psycopg2.connect(
        DATABASE_URL,
        hostaddr=ipv4_address,
        connect_timeout=10
    )


# =========================================================
# PUBLIC QR VERIFICATION
# =========================================================

@app.route("/verify/<token>")
def verify_pass(token):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            p.name,
            p.college,
            p.department_batch,
            p.registration_status,

            ps.pass_id,
            ps.status,
            ps.sent

        FROM passes ps

        JOIN participants p
            ON p.id = ps.participant_id

        WHERE
            ps.verification_token = %s
        """,
        (token,)
    )

    participant = cursor.fetchone()

    cursor.close()
    connection.close()


    # -----------------------------------------------------
    # INVALID QR
    # -----------------------------------------------------

    if not participant:

        return render_template(
            "verify.html",
            valid=False,
            participant=None
        )


    # -----------------------------------------------------
    # CHECK PASS STATUS
    # -----------------------------------------------------

    is_active = (
        participant[3] == "ACTIVE"
        and participant[5] == "ACTIVE"
        and participant[6] == 1
    )


    # -----------------------------------------------------
    # CONVERT RESULT TO TEMPLATE DICTIONARY
    # -----------------------------------------------------

    participant_data = {
        "name": participant[0],
        "college": participant[1],
        "department_batch": participant[2],
        "registration_status": participant[3],
        "pass_id": participant[4],
        "status": participant[5],
        "sent": participant[6]
    }


    # -----------------------------------------------------
    # SHOW RESULT
    # -----------------------------------------------------

    return render_template(
        "verify.html",
        valid=is_active,
        participant=participant_data
    )


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/")
def home():

    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>HACK26 Verification</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #0b0d12;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                text-align: center;
            }

            div {
                padding: 30px;
            }

            h1 {
                margin-bottom: 10px;
            }

            p {
                color: #aaa;
            }
        </style>
    </head>

    <body>
        <div>
            <h1>HACK26</h1>
            <p>Pass Verification Service</p>
            <p>✓ Online</p>
        </div>
    </body>
    </html>
    """


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=False
    )
