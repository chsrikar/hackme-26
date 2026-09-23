import sqlite3
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database" / "hack26.db"
OUTPUT_FILE = BASE_DIR.parent / "admin" / "src" / "data" / "participantDirectory.js"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all participants with passes
cursor.execute("""
    SELECT p.id, p.name, p.mobile, p.college, p.department_batch, p.registration_status,
           ps.pass_id, ps.verification_token
    FROM participants p
    LEFT JOIN passes ps ON p.id = ps.participant_id
    ORDER BY p.id ASC
""")
rows = cursor.fetchall()

directory = {}

# Only map participants who actually have an issued pass record
for r in rows:
    if not r["pass_id"]:
        continue
    clean_phone = (r['mobile'] or '').strip()
    pass_code = r["pass_id"].strip().upper()
    item = {
        "id": str(r["id"]),
        "name": (r["name"] or "Participant").strip(),
        "phone": clean_phone,
        "passId": pass_code,
        "college": (r["college"] or "VISAT").strip(),
        "department": (r["department_batch"] or "CSE").strip()
    }

    directory[pass_code] = item
    directory[pass_code.lower()] = item

    if r["verification_token"]:
        token = r["verification_token"].strip()
        directory[token] = item
        directory[token.upper()] = item
        directory[token.lower()] = item

# Ensure active passes are strictly defined
directory["HM26-006"] = {
    "id": "155",
    "name": "Manu Saju Pulickal",
    "phone": "",
    "passId": "HM26-006",
    "college": "Visat Engineering College",
    "department": "CSE, 4th Year"
}
directory["hm26-006"] = directory["HM26-006"]
directory["AyxSNB3bx4s59YoC0sCaefJUgDvsrzrW01Rn_fQOyFM"] = directory["HM26-006"]

directory["HM26-004"] = {
    "id": "156",
    "name": "Ashik Madhu",
    "phone": "",
    "passId": "HM26-004",
    "college": "Visat Engineering College",
    "department": "CSE, 4th Year"
}
directory["hm26-004"] = directory["HM26-004"]
directory["HM26-001"] = {
    "id": "121",
    "name": "Anto Jerom T",
    "phone": "8590532885",
    "passId": "HM26-001",
    "college": "VISAT ENGINEERING COLLEGE",
    "department": "CSE AI ML, 2nd year"
}
directory["3MbN2t1Krlsh6SCFJieTKyA9ZiV5oE6VC8lZso8jqwM"] = directory["HM26-001"]

directory["HM26-002"] = {
    "id": "124",
    "name": "Nimisha S A",
    "phone": "7591946259",
    "passId": "HM26-002",
    "college": "VISAT Engineering college",
    "department": "CSE AI ML,2nd year"
}
directory["Z7gsGbY3rTAHBZLFxr3H9O63A3_8P24fldoKL7sCYGQ"] = directory["HM26-002"]

directory["HM26-003"] = {
    "id": "125",
    "name": "Parthiv das",
    "phone": "8547637499",
    "passId": "HM26-003",
    "college": "VISAT ENGINEERING COLLEGE",
    "department": "Cse (ai&ml) , 3rd year"
}
directory["l_fLNMf51kLh8YSrxdk3YPxiRZuIBOTKdOPZsWZ6NVY"] = directory["HM26-003"]

directory["HM26-999"] = {
    "id": "146",
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

