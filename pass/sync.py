import hashlib
import secrets
from pathlib import Path

from google_sheets import get_all_participants
from database import get_db
from pass_generator import generate_pass


# =========================================================
# GOOGLE FORM COLUMN NAMES
# =========================================================

NAME = "Name"
COLLEGE = "College"
DEPARTMENT = "Department & Batch (eg:Cse ,3rd year )"
MOBILE = "Mobile no:"
EMAIL = "Emai id:"
PAYMENT_RESPONSE = "Are u ready to pay registration fee now ? (50₹ per person)"
PAYMENT_PROOF = "Attach your payment screenshot"
REFERRAL = "Referal code"
TIMESTAMP = "Timestamp"


# =========================================================
# HELPERS
# =========================================================

def clean(value):
    if value is None:
        return ""

    return str(value).strip()


def normalize_header(value):
    return " ".join(
        str(value).strip().split()
    )


def get_value(row, expected_header):

    expected = normalize_header(
        expected_header
    )

    for key, value in row.items():

        if normalize_header(key) == expected:
            return clean(value)

    return ""


def make_source_key(
    timestamp,
    email,
    mobile,
    name
):
    """
    Stable identifier for the current Google Form submission.
    """

    raw = (
        f"{timestamp}|"
        f"{email}|"
        f"{mobile}|"
        f"{name}"
    )

    return hashlib.sha256(
        raw.encode("utf-8")
    ).hexdigest()


# =========================================================
# PASS ID GENERATOR
# =========================================================

def generate_pass_id(db):
    """
    Generate the next HACK26 Pass ID.

    HM26-001
    HM26-002
    HM26-003
    HM26-004
    ...
    """

    rows = db.execute(
        """
        SELECT pass_id
        FROM passes
        WHERE pass_id LIKE 'HM26-%'
        """
    ).fetchall()

    highest_number = 0

    for row in rows:

        pass_id = clean(
            row["pass_id"]
        )

        if not pass_id.startswith("HM26-"):
            continue

        try:

            number = int(
                pass_id[5:]
            )

        except ValueError:

            continue

        if number > highest_number:
            highest_number = number

    return f"HM26-{highest_number + 1:03d}"


# =========================================================
# QR TOKEN
# =========================================================

def generate_token():

    return secrets.token_urlsafe(32)


# =========================================================
# MAIN SYNC
# =========================================================

def sync_participants():

    print("Reading Google Sheet...")

    rows = get_all_participants()

    db = get_db()

    created = 0
    updated = 0
    passes_created = 0
    passes_generated = 0
    removed = 0

    # Keep track of every participant currently
    # present in the Google Form response sheet.
    current_source_keys = set()

    try:

        # =====================================================
        # PROCESS CURRENT GOOGLE SHEET
        # =====================================================

        for row in rows:

            name = get_value(
                row,
                NAME
            )

            # Ignore completely empty rows
            if not name:
                continue

            email = get_value(
                row,
                EMAIL
            )

            mobile = get_value(
                row,
                MOBILE
            )

            timestamp = get_value(
                row,
                TIMESTAMP
            )

            college = get_value(
                row,
                COLLEGE
            )

            department = get_value(
                row,
                DEPARTMENT
            )

            payment_response = get_value(
                row,
                PAYMENT_RESPONSE
            )

            payment_proof = get_value(
                row,
                PAYMENT_PROOF
            )

            referral = get_value(
                row,
                REFERRAL
            )

            # -------------------------------------------------
            # SOURCE KEY
            # -------------------------------------------------

            source_key = make_source_key(
                timestamp,
                email,
                mobile,
                name
            )

            current_source_keys.add(
                source_key
            )

            # -------------------------------------------------
            # FIND EXISTING PARTICIPANT
            # -------------------------------------------------

            existing = db.execute(
                """
                SELECT id
                FROM participants
                WHERE source_key = ?
                """,
                (source_key,)
            ).fetchone()

            if existing:

                participant_id = existing["id"]

                db.execute(
                    """
                    UPDATE participants
                    SET
                        form_timestamp = ?,
                        name = ?,
                        college = ?,
                        department_batch = ?,
                        mobile = ?,
                        email = ?,
                        payment_response = ?,
                        payment_proof_url = ?,
                        referral_code = ?,
                        registration_status = 'ACTIVE',
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (
                        timestamp,
                        name,
                        college,
                        department,
                        mobile,
                        email,
                        payment_response,
                        payment_proof,
                        referral,
                        participant_id
                    )
                )

                updated += 1

            else:

                cursor = db.execute(
                    """
                    INSERT INTO participants (
                        source_key,
                        form_timestamp,
                        name,
                        college,
                        department_batch,
                        mobile,
                        email,
                        payment_response,
                        payment_proof_url,
                        referral_code,
                        registration_status
                    )
                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        'ACTIVE'
                    )
                    """,
                    (
                        source_key,
                        timestamp,
                        name,
                        college,
                        department,
                        mobile,
                        email,
                        payment_response,
                        payment_proof,
                        referral
                    )
                )

                participant_id = cursor.lastrowid

                created += 1

            # =================================================
            # PASS GENERATION
            # =================================================

            if payment_proof:

                existing_pass = db.execute(
                    """
                    SELECT
                        id,
                        pass_id,
                        verification_token,
                        status,
                        sent
                    FROM passes
                    WHERE participant_id = ?
                    """,
                    (participant_id,)
                ).fetchone()

                # =================================================
                # EXISTING PASS
                # =================================================

                if existing_pass:

                    pass_id = clean(
                        existing_pass["pass_id"]
                    )

                    verification_token = (
                        existing_pass[
                            "verification_token"
                        ]
                    )

                    pass_file = (
                        Path("generated_passes")
                        / f"{pass_id}.png"
                    )

                    # Never regenerate a pass that
                    # has already been successfully sent.
                    if existing_pass["sent"] == 1:
                        continue

                    # If image was deleted/missing,
                    # recreate it using the SAME ID/token.
                    if not pass_file.exists():

                        generate_pass(
                            name=name,
                            mobile=mobile,
                            pass_id=pass_id,
                            verification_token=verification_token
                        )

                        passes_generated += 1

                # =================================================
                # NEW PASS
                # =================================================

                else:

                    pass_id = generate_pass_id(
                        db
                    )

                    verification_token = (
                        generate_token()
                    )

                    db.execute(
                        """
                        INSERT INTO passes (
                            participant_id,
                            pass_id,
                            verification_token,
                            status,
                            generated_at,
                            sent
                        )
                        VALUES (
                            ?,
                            ?,
                            ?,
                            'INACTIVE',
                            CURRENT_TIMESTAMP,
                            0
                        )
                        """,
                        (
                            participant_id,
                            pass_id,
                            verification_token
                        )
                    )

                    passes_created += 1

                    generate_pass(
                        name=name,
                        mobile=mobile,
                        pass_id=pass_id,
                        verification_token=verification_token
                    )

                    passes_generated += 1

        # =====================================================
        # MARK OLD/MISSING FORM RESPONSES
        # =====================================================
        #
        # IMPORTANT:
        #
        # We DO NOT DELETE them.
        #
        # Their Pass IDs and history remain safe.
        #
        # They simply stop appearing as current registrations.
        # =====================================================

        all_participants = db.execute(
            """
            SELECT id, source_key
            FROM participants
            WHERE registration_status = 'ACTIVE'
            """
        ).fetchall()

        for participant in all_participants:

            if participant["source_key"] not in current_source_keys:

                db.execute(
                    """
                    UPDATE participants
                    SET
                        registration_status =
                            'REMOVED_FROM_FORM',
                        updated_at =
                            CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (
                        participant["id"],
                    )
                )

                removed += 1

        # =====================================================
        # COMMIT
        # =====================================================

        db.commit()

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()

    # =========================================================
    # RESULT
    # =========================================================

    print()
    print("========================================")
    print("HACK26 SYNC COMPLETE")
    print("========================================")
    print(
        f"Google Sheet rows : {len(rows)}"
    )
    print(
        f"New participants  : {created}"
    )
    print(
        f"Updated            : {updated}"
    )
    print(
        f"New pass records   : {passes_created}"
    )
    print(
        f"Pass images made   : {passes_generated}"
    )
    print(
        f"Old records marked : {removed}"
    )
    print("========================================")


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    sync_participants()