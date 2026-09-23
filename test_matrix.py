import json
import urllib.request
import urllib.error
import sqlite3
import threading
from pathlib import Path

BASE_URL = "http://127.0.0.1:5000/api/scan"
DB_PATH = Path("pass/database/hack26.db")

def make_req(payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(BASE_URL, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def query_db(query, params=()):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    return rows

print("==================================================")
print("RUNNING HACK26 INTEGRATION TEST MATRIX (1 - 11)")
print("==================================================")

# TEST 1: Valid existing QR (HM26-001)
print("\n--- TEST 1: Valid Existing QR (HM26-001) ---")
status, res = make_req({"passId": "HM26-001", "type": "EVENT ENTRY", "location": "Main Gate"})
assert status == 200, f"Expected 200, got {status}: {res}"
assert res["success"] is True
assert res["participant"]["passId"] == "HM26-001"
print(f"PASSED: Resolved {res['participant']['name']} ({res['participant']['passId']}), totalScans={res['totalScans']}")

# TEST 2: First-time participant auto-creation
print("\n--- TEST 2: First-Time Participant Auto-Creation ---")
unique_mobile = "+91 9876501234"
status, res = make_req({
    "name": "Kiran Kumar",
    "mobile": unique_mobile,
    "college": "VISAT",
    "department": "ECE 4th Year",
    "type": "EVENT ENTRY",
    "location": "Registration Desk"
})
assert status == 200, f"Expected 200, got {status}: {res}"
new_pid = res["participant"]["id"]
new_pass_id = res["participant"]["passId"]
print(f"PASSED: Created {res['participant']['name']} with {new_pass_id} (Internal ID: {new_pid})")

# Verify only 1 record exists in participants for this mobile
parts = query_db("SELECT id, name, mobile FROM participants WHERE mobile = ?", (unique_mobile,))
assert len(parts) == 1, f"Expected 1 participant record, found {len(parts)}"
print("PASSED: Verified exactly ONE participant record in database.")

# TEST 3: Existing participant reuse (no duplicate)
print("\n--- TEST 3: Existing Participant Reuse ---")
status, res = make_req({"passId": new_pass_id, "type": "EVENT ENTRY"})
assert status == 200
assert res["participant"]["id"] == new_pid
parts = query_db("SELECT id, name, mobile FROM participants WHERE mobile = ?", (unique_mobile,))
assert len(parts) == 1, f"Expected 1 participant record, found {len(parts)}"
print(f"PASSED: Existing participant {new_pass_id} reused without duplicate.")

# TEST 4: Repeated QR scans (5 scans)
print("\n--- TEST 4: Repeated Scans for Same Participant ---")
for i in range(3):
    status, res = make_req({"passId": new_pass_id, "type": "EVENT ENTRY"})
    assert status == 200
parts = query_db("SELECT id FROM participants WHERE mobile = ?", (unique_mobile,))
assert len(parts) == 1
logs = query_db("SELECT id FROM scan_logs WHERE pass_id = ?", (new_pass_id,))
print(f"PASSED: Exactly 1 participant record exists with {len(logs)} activity log entries.")

# TEST 5: Check-in Activity
print("\n--- TEST 5: Check-In Workflow ---")
status, res = make_req({"passId": new_pass_id, "type": "EVENT ENTRY", "location": "Main Entrance"})
assert status == 200
last_log = query_db("SELECT * FROM scan_logs WHERE pass_id = ? ORDER BY id DESC LIMIT 1", (new_pass_id,))[0]
assert last_log["scan_type"] == "EVENT ENTRY"
assert last_log["location"] == "Main Entrance"
print(f"PASSED: Check-in recorded in scan_logs at {last_log['timestamp']}.")

# TEST 6: Food Pickup Workflow
print("\n--- TEST 6: Food Pickup Workflow ---")
status, res = make_req({"passId": new_pass_id, "type": "FOOD_PICKUP", "location": "Food Counter 01"})
assert status == 200
last_log = query_db("SELECT * FROM scan_logs WHERE pass_id = ? ORDER BY id DESC LIMIT 1", (new_pass_id,))[0]
assert last_log["scan_type"] == "FOOD_PICKUP"
print(f"PASSED: Food pickup logged into database.")

# TEST 7: Washroom Workflow
print("\n--- TEST 7: Washroom Workflow ---")
status, res = make_req({"passId": new_pass_id, "type": "WASHROOM", "location": "Floor 2 Restroom"})
assert status == 200
last_log = query_db("SELECT * FROM scan_logs WHERE pass_id = ? ORDER BY id DESC LIMIT 1", (new_pass_id,))[0]
assert last_log["scan_type"] == "WASHROOM"
print(f"PASSED: Washroom movement logged into database.")

# TEST 8: Return Workflow with Duration
print("\n--- TEST 8: Return Workflow (with Away Duration) ---")
status, res = make_req({
    "passId": new_pass_id,
    "type": "RETURN (WASHROOM)",
    "location": "Pass Return Desk",
    "duration": "4m 12s",
    "metadata": {"passType": "WASHROOM", "duration": "4m 12s"}
})
assert status == 200
last_log = query_db("SELECT * FROM scan_logs WHERE pass_id = ? ORDER BY id DESC LIMIT 1", (new_pass_id,))[0]
assert "RETURN" in last_log["scan_type"]
assert "4m 12s" in (last_log["metadata"] or "")
print(f"PASSED: Return recorded with metadata: {last_log['metadata']}.")

# TEST 9: Check-out Workflow
print("\n--- TEST 9: Check-out Workflow ---")
status, res = make_req({"passId": new_pass_id, "type": "CHECK-OUT", "location": "Exit Gate"})
assert status == 200
last_log = query_db("SELECT * FROM scan_logs WHERE pass_id = ? ORDER BY id DESC LIMIT 1", (new_pass_id,))[0]
assert last_log["scan_type"] == "CHECK-OUT"
print(f"PASSED: Permanent CHECK-OUT recorded in database.")

# TEST 10: Invalid QR / Inactive Pass Rejection
print("\n--- TEST 10: Invalid QR / Inactive Pass Rejection ---")
# 10a: Removed / inactive participant (id 5)
status, res = make_req({"passId": "HM26-005"})
assert status in (403, 404), f"Expected 403 or 404 for removed attendee, got {status}"
print(f"PASSED: Inactive attendee correctly rejected with HTTP {status}: {res.get('error')}")

# 10b: Completely invalid token
status, res = make_req({"token": "INVALID-NONEXISTENT-TOKEN-XYZ-999"})
assert status == 404, f"Expected 404 for invalid token, got {status}"
print(f"PASSED: Invalid token correctly rejected with HTTP {status}: {res.get('error')}")

# TEST 11: Concurrent / Simultaneous Scanning Safety
print("\n--- TEST 11: Concurrent Scanning Safety ---")
concurrent_mobile = "+91 9112233445"
results = []

def worker(idx):
    st, r = make_req({
        "name": "Concurrent Attendee",
        "mobile": concurrent_mobile,
        "college": "VISAT",
        "type": f"EVENT ENTRY Worker {idx}"
    })
    results.append((st, r))

threads = [threading.Thread(target=worker, args=(i,)) for i in range(8)]
for t in threads:
    t.start()
for t in threads:
    t.join()

parts = query_db("SELECT p.id, ps.pass_id FROM participants p JOIN passes ps ON ps.participant_id = p.id WHERE p.mobile = ?", (concurrent_mobile,))
assert len(parts) == 1, f"Expected exactly 1 participant created under 8 concurrent scans, found {len(parts)}!"
print(f"PASSED: Under 8 simultaneous threads, exactly ONE participant was created: {parts[0]['pass_id']}.")

print("\n==================================================")
print("ALL 11 TESTS IN THE TEST MATRIX PASSED SUCCESSFULLY!")
print("==================================================")
