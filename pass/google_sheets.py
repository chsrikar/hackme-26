import os
import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

load_dotenv()

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly"
]


def get_google_sheet():
    credentials_file = os.getenv("GOOGLE_CREDENTIALS_FILE")
    spreadsheet_id = os.getenv("GOOGLE_SPREADSHEET_ID")
    worksheet_name = os.getenv("GOOGLE_WORKSHEET_NAME")

    if not credentials_file:
        raise ValueError("GOOGLE_CREDENTIALS_FILE is missing in .env")

    if not spreadsheet_id:
        raise ValueError("GOOGLE_SPREADSHEET_ID is missing in .env")

    if not worksheet_name:
        raise ValueError("GOOGLE_WORKSHEET_NAME is missing in .env")

    credentials = Credentials.from_service_account_file(
        credentials_file,
        scopes=SCOPES
    )

    client = gspread.authorize(credentials)

    spreadsheet = client.open_by_key(spreadsheet_id)

    worksheet = spreadsheet.worksheet(worksheet_name)

    return worksheet


def get_all_participants():
    worksheet = get_google_sheet()
    return worksheet.get_all_records()


if __name__ == "__main__":
    print("Connecting to Google Sheets...")

    records = get_all_participants()

    print("Successfully connected!")
    print(f"Rows found: {len(records)}")

    if records:
        print("\nColumns found:")

        for column in records[0].keys():
            print(f"- {column}")