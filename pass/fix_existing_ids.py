from pathlib import Path

from database import get_db
from pass_generator import generate_pass


# =========================================================
# EXISTING PARTICIPANTS
# =========================================================

OLD_ANTO_ID = "H26-A5F9887C"
NEW_ANTO_ID = "HM26-001"

OLD_NIMISHA_ID = "H26-BC208471"
NEW_NIMISHA_ID = "HM26-002"


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
PASS_DIR = BASE_DIR / "generated_passes"


# =========================================================
# CHANGE PASS ID
# =========================================================

def change_pass_id(
    db,
    old_id,
    new_id
):
    """
    Change an existing Pass ID while keeping
    the same participant and QR verification token.
    """

    row = db.execute(
        """
        SELECT
            passes.id,
            passes.participant_id,
            passes.verification_token,
            participants.name,
            participants.mobile
        FROM passes
        JOIN participants
            ON participants.id = passes.participant_id
        WHERE passes.pass_id = ?
        """,
        (old_id,)
    ).fetchone()

    if not row:
        print(f"WARNING: {old_id} was not found.")
        return False

    # -----------------------------------------------------
    # Make sure new ID isn't already assigned
    # -----------------------------------------------------

    existing = db.execute(
        """
        SELECT id
        FROM passes
        WHERE pass_id = ?
        """,
        (new_id,)
    ).fetchone()

    if existing:
        print(
            f"ERROR: {new_id} is already assigned."
        )
        return False

    # -----------------------------------------------------
    # Update database
    # -----------------------------------------------------

    db.execute(
        """
        UPDATE passes
        SET pass_id = ?
        WHERE id = ?
        """,
        (
            new_id,
            row["id"]
        )
    )

    # -----------------------------------------------------
    # Rename existing image
    # -----------------------------------------------------

    old_file = PASS_DIR / f"{old_id}.png"
    new_file = PASS_DIR / f"{new_id}.png"

    if old_file.exists():

        if new_file.exists():
            print(
                f"ERROR: {new_file.name} already exists."
            )
            db.rollback()
            return False

        old_file.rename(new_file)

        print(
            f"Image renamed: "
            f"{old_file.name} -> {new_file.name}"
        )

    else:
        print(
            f"WARNING: {old_file.name} not found."
        )

    print(
        f"{row['name']}: "
        f"{old_id} -> {new_id}"
    )

    return True


# =========================================================
# MAIN
# =========================================================

def main():

    print()
    print("========================================")
    print("FIXING EXISTING HACK26 PASS IDs")
    print("========================================")

    db = get_db()

    try:

        # -------------------------------------------------
        # ANTO
        # -------------------------------------------------

        change_pass_id(
            db,
            OLD_ANTO_ID,
            NEW_ANTO_ID
        )

        # -------------------------------------------------
        # NIMISHA
        # -------------------------------------------------

        change_pass_id(
            db,
            OLD_NIMISHA_ID,
            NEW_NIMISHA_ID
        )

        # -------------------------------------------------
        # SAVE
        # -------------------------------------------------

        db.commit()

        print()
        print("========================================")
        print("SUCCESS")
        print("========================================")
        print("Anto    -> HM26-001")
        print("Nimisha -> HM26-002")
        print("========================================")

    except Exception as error:

        db.rollback()

        print()
        print("ERROR:")
        print(error)

        raise

    finally:

        db.close()


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    main()