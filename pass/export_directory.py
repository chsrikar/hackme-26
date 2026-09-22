import sqlite3
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database" / "hack26.db"
OUTPUT_FILE = BASE_DIR.parent / "admin" / "src" / "data" / "participantDirectory.js"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
    SELECT p.id, p.name, p.mobile, p.college, p.department_batch,
           ps.pass_id, ps.verification_token
    FROM participants p
    LEFT JOIN passes ps ON p.id = ps.participant_id
""")
rows = cursor.fetchall()

directory = {}
for r in rows:
    p_id_str = f"HM26-{r['id']:03d}"
    clean_phone = (r['mobile'] or '').strip()
    item = {
        "id": str(r["id"]),
        "name": r["name"] or "Participant",
        "phone": clean_phone,
        "passId": r["pass_id"] or p_id_str,
        "college": r["college"] or "VISAT",
        "department": r["department_batch"] or "CSE"
    }
    # Map by passId
    if r["pass_id"]:
        directory[r["pass_id"].upper()] = item
        directory[r["pass_id"].lower()] = item
    # Map by verification_token
    if r["verification_token"]:
        directory[r["verification_token"]] = item
        directory[r["verification_token"].upper()] = item
        directory[r["verification_token"].lower()] = item
    # Also map by id
    directory[str(r["id"])] = item

# Test pass HM26-999
directory["HM26-999"] = {
    "id": "999",
    "name": "Adithyan Rajesh",
    "phone": "9876543210",
    "passId": "HM26-999",
    "college": "VISAT",
    "department": "CSE"
}
directory["test_token_1234567890_test_token"] = directory["HM26-999"]

content = "// Participant Directory exported from HACK26 Database\nexport const PARTICIPANT_DIRECTORY = " + json.dumps(directory, indent=2) + ";\n"
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Generated {OUTPUT_FILE} with {len(directory)} keys successfully!")
