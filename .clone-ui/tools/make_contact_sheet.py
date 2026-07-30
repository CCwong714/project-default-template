from __future__ import annotations

import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


FRAME_PATTERN = re.compile(r"t(?P<timestamp>\d+\.\d+)\.png$")
THUMBNAIL_SIZE = (384, 186)
COLUMNS = 4
ROWS = 4
LABEL_HEIGHT = 24


def get_timestamp(path: Path) -> str:
    match = FRAME_PATTERN.search(path.name)
    if match is None:
        return path.stem
    return f"{float(match.group('timestamp')):.2f}s"


def create_sheet(paths: list[Path], output_path: Path) -> None:
    width = THUMBNAIL_SIZE[0] * COLUMNS
    height = (THUMBNAIL_SIZE[1] + LABEL_HEIGHT) * ROWS
    sheet = Image.new("RGB", (width, height), "#111111")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)

    for index, path in enumerate(paths):
        row, column = divmod(index, COLUMNS)
        x = column * THUMBNAIL_SIZE[0]
        y = row * (THUMBNAIL_SIZE[1] + LABEL_HEIGHT)

        with Image.open(path) as source:
            frame = source.convert("RGB")
            frame.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
            frame_x = x + (THUMBNAIL_SIZE[0] - frame.width) // 2
            frame_y = y + LABEL_HEIGHT
            sheet.paste(frame, (frame_x, frame_y))

        draw.text(
            (x + 8, y + 4),
            get_timestamp(path),
            fill="#ffffff",
            font=font,
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path, quality=94)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: make_contact_sheet.py <frames-dir> <output-dir>")

    frames_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    frame_paths = sorted(frames_dir.glob("frame-*.png"))
    batch_size = COLUMNS * ROWS

    for batch_index, offset in enumerate(range(0, len(frame_paths), batch_size)):
        batch = frame_paths[offset : offset + batch_size]
        output_path = output_dir / f"contact-sheet-{batch_index + 1:02d}.jpg"
        create_sheet(batch, output_path)

    print(f"Created {(len(frame_paths) + batch_size - 1) // batch_size} sheets")


if __name__ == "__main__":
    main()
