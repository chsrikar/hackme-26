import os
import json
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

TEMPLATE_PATH = (
    BASE_DIR
    / "pass_template"
    / "hack26_pass_template.png"
)

OUTPUT_DIR = BASE_DIR / "generated_passes"

OUTPUT_DIR.mkdir(exist_ok=True)


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

VERIFY_BASE_URL = os.getenv(
    "VERIFY_BASE_URL",
    "http://127.0.0.1:5000/verify/"
)


# =========================================================
# FONTS
# =========================================================

WINDOWS_FONT_DIR = Path("C:/Windows/Fonts")

FONT_BOLD = WINDOWS_FONT_DIR / "arialbd.ttf"
FONT_REGULAR = WINDOWS_FONT_DIR / "arial.ttf"


def get_font(path, size):
    """
    Load a Windows font.
    """

    if path.exists():
        return ImageFont.truetype(
            str(path),
            size
        )

    return ImageFont.load_default()


# =========================================================
# CENTER TEXT
# =========================================================

def draw_centered_text(
    draw,
    text,
    y,
    font,
    fill,
    image_width
):
    """
    Draw text horizontally centered.
    """

    bbox = draw.textbbox(
        (0, 0),
        text,
        font=font
    )

    text_width = bbox[2] - bbox[0]

    x = (image_width - text_width) // 2

    draw.text(
        (x, y),
        text,
        font=font,
        fill=fill
    )


# =========================================================
# FIT NAME
# =========================================================

def get_name_font(name):
    """
    Dynamically scale name font so it never overflows.
    """

    length = len(name.strip())

    if length <= 14:
        size = 56
    elif length <= 20:
        size = 46
    elif length <= 26:
        size = 38
    else:
        size = 32

    return get_font(FONT_BOLD, size)


# =========================================================
# VALIDATE PASS ID
# =========================================================

def validate_pass_id(pass_id):
    """
    Strict validation for permanent Pass IDs.

    Must follow:
        HM26-001
        HM26-002
        HM26-003
        ...
    """

    if not pass_id:
        raise ValueError("Pass ID cannot be empty.")

    if not pass_id.startswith("HM26-"):
        raise ValueError(
            f"Invalid Pass ID: {pass_id}. Must start with 'HM26-'"
        )

    if len(pass_id) != 8:
        raise ValueError(
            f"Invalid Pass ID: {pass_id}. Must be exactly 8 characters (HM26-XXX)."
        )

    number_part = pass_id[5:]

    if not number_part.isdigit():
        raise ValueError(
            f"Invalid Pass ID: {pass_id}. "
            "The last three characters must be numbers."
        )


# =========================================================
# GENERATE QR (Option 2: Embedded JSON)
# =========================================================

def create_qr(token, payload_dict=None):
    """
    Create QR code containing Option 2 embedded JSON payload or verification URL.
    """

    if payload_dict:
        qr_data = json.dumps(payload_dict)
    else:
        qr_data = (
            VERIFY_BASE_URL.rstrip("/")
            + "/"
            + str(token)
        )

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2
    )

    qr.add_data(qr_data)

    qr.make(
        fit=True
    )

    qr_image = qr.make_image(
        fill_color="black",
        back_color="white"
    ).convert("RGB")

    qr_image = qr_image.resize(
        (245, 245),
        Image.Resampling.LANCZOS
    )

    return qr_image


# =========================================================
# GENERATE PASS
# =========================================================

def generate_pass(
    name,
    mobile,
    pass_id,
    verification_token,
    team="Team Alpha",
    roll_number=None,
    college=None
):
    """
    Generate a complete participant pass with Option 2 embedded JSON QR.

    The Pass ID is permanent and must use:

        HM26-001
        HM26-002
        HM26-003
        ...
    """

    # -----------------------------------------------------
    # Validate Pass ID before generating anything
    # -----------------------------------------------------

    validate_pass_id(pass_id)

    # -----------------------------------------------------
    # Check template
    # -----------------------------------------------------

    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(
            f"Pass template not found:\n{TEMPLATE_PATH}"
        )

    # -----------------------------------------------------
    # Load template
    # -----------------------------------------------------

    image = Image.open(
        TEMPLATE_PATH
    ).convert("RGB")

    image_width, image_height = image.size

    draw = ImageDraw.Draw(image)

    # -----------------------------------------------------
    # Colors
    # -----------------------------------------------------

    DARK_BLUE = (
        8,
        31,
        63
    )

    WHITE = (
        255,
        255,
        255
    )

    # =====================================================
    # PARTICIPANT NAME
    # =====================================================

    name_font = get_name_font(name)

    draw_centered_text(
        draw=draw,
        text=name.upper(),
        y=770,
        font=name_font,
        fill=DARK_BLUE,
        image_width=image_width
    )

    # =====================================================
    # MOBILE NUMBER
    # =====================================================

    mobile_font = get_font(
        FONT_REGULAR,
        38
    )

    draw_centered_text(
        draw=draw,
        text=mobile,
        y=895,
        font=mobile_font,
        fill=DARK_BLUE,
        image_width=image_width
    )

    # =====================================================
    # QR CODE (Option 2: Embedded JSON)
    # =====================================================

    qr_payload = {
        "name": name,
        "rollNumber": roll_number or pass_id,
        "team": team or "Team Alpha",
        "passId": pass_id,
        "mobile": mobile
    }
    if college:
        qr_payload["college"] = college

    # Generate verification URL QR code for smartphone camera scanning
    qr_image = create_qr(
        verification_token
    )

    qr_x = (
        image_width - qr_image.width
    ) // 2

    qr_y = 992

    image.paste(
        qr_image,
        (
            qr_x,
            qr_y
        )
    )

    # =====================================================
    # PASS ID
    # =====================================================

    pass_font = get_font(
        FONT_BOLD,
        30
    )

    draw_centered_text(
        draw=draw,
        text=pass_id,
        y=1274,
        font=pass_font,
        fill=WHITE,
        image_width=image_width
    )

    # =====================================================
    # OUTPUT
    # =====================================================

    output_path = (
        OUTPUT_DIR
        / f"{pass_id}.png"
    )

    image.save(
        output_path,
        "PNG"
    )

    print(
        f"Pass generated: {output_path}"
    )

    return output_path


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    print(
        "Testing HACK26 pass generator..."
    )

    test_path = generate_pass(
        name="PARTHIV DAS",
        mobile="+91 8547637499",
        pass_id="HM26-999",
        verification_token="TEST-TOKEN-123456"
    )

    print()
    print("SUCCESS!")
    print(
        f"Generated file: {test_path}"
    )