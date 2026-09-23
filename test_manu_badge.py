import urllib.request
import json
import os

BASE_URL = "http://127.0.0.1:5000"
MANU_BADGE_URL = "https://hack26-public-verifier.onrender.com/verify/AyxSNB3bx4s59YoC0sCaefJUgDvsrzrW01Rn_fQOyFM"

def post_json(path, data):
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def test_manu_badge():
    print("Testing badge scan for Manu Saju Pulickal (HM26-006)...")
    
    # 1. Resolve pass
    resolve_res = post_json("/api/resolve-pass", {"url": MANU_BADGE_URL})
    assert resolve_res["success"] is True
    p = resolve_res["participant"]
    assert p["passId"] == "HM26-006"
    assert "Manu" in p["name"]
    print("[OK] Passed: /api/resolve-pass correctly resolved:", p["name"], f"({p['passId']})", p["department"])

    # 2. Food pickup scan
    food_res = post_json("/api/scan", {
        "qrToken": MANU_BADGE_URL,
        "type": "FOOD_PICKUP",
        "location": "Cafeteria Counter 2"
    })
    assert food_res["success"] is True
    assert food_res["participant"]["passId"] == "HM26-006"
    print("[OK] Passed: FOOD_PICKUP logged for Manu Saju Pulickal")

    # 3. Washroom scan
    wash_res = post_json("/api/scan", {
        "qrToken": MANU_BADGE_URL,
        "type": "WASHROOM",
        "location": "North Wing Restroom"
    })
    assert wash_res["success"] is True
    print("[OK] Passed: WASHROOM logged for Manu Saju Pulickal")

    # 4. Return scan
    ret_res = post_json("/api/scan", {
        "qrToken": "HM26-006",
        "type": "RETURN (WASHROOM)",
        "location": "Pass Return Desk",
        "duration": "3m 15s"
    })
    assert ret_res["success"] is True
    print("[OK] Passed: RETURN logged with duration for Manu Saju Pulickal")

    # 5. Check attendance live export
    csv_file = "pass/database/attendance_live_export.csv"
    assert os.path.exists(csv_file)
    with open(csv_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "Manu Saju Pulickal" in content
    assert "HM26-006" in content
    print("[OK] Passed: Live attendance CSV contains all logged scans on disk")

    print("\nALL MANU BADGE SCAN & DB PERSISTENCE TESTS PASSED 100%!")

if __name__ == "__main__":
    test_manu_badge()
