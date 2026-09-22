from google_sheets import get_all_participants

rows = get_all_participants()

print("\nPAYMENT SCREENSHOT CHECK")
print("========================")

count = 0

for i, row in enumerate(rows, start=2):
    name = str(row.get("Name", "")).strip()
    proof = str(row.get("Attach your payment screenshot", "")).strip()

    if proof:
        count += 1
        print(f"\nRow {i}")
        print(f"Name : {name}")
        print(f"Proof: {proof}")

print("\n========================")
print(f"Rows with payment proof: {count}")