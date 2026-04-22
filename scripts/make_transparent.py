"""Make white/gray product backdrop transparent (edge flood fill, keeps color)."""
from __future__ import annotations

import sys
from collections import deque
from PIL import Image


def is_background(r: int, g: int, b: int) -> bool:
    # Near-white/gray: high luminance, low chroma (not yellow/mango)
    if r < 210 or g < 210 or b < 210:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn > 50:
        return False
    return (r + g + b) / 3 >= 235


def main() -> int:
    path = sys.argv[1] if len(sys.argv) > 1 else "public/images/products/topbar-mango-9900.png"
    out = sys.argv[2] if len(sys.argv) > 2 else path

    img = Image.open(path).convert("RGBA")
    w, h = img.size
    data = bytearray(img.tobytes())
    step = 4

    def idx(x: int, y: int) -> int:
        return (y * w + x) * step

    bg = [False] * (w * h)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            q.append((x, y))
    for y in range(1, h - 1):
        for x in (0, w - 1):
            q.append((x, y))

    seen = [False] * (w * h)
    while q:
        x, y = q.popleft()
        p = y * w + x
        if seen[p]:
            continue
        seen[p] = True
        i = idx(x, y)
        r, g, b = data[i], data[i + 1], data[i + 2]
        if not is_background(r, g, b):
            continue
        bg[p] = True
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                q.append((nx, ny))

    for p in range(w * h):
        if bg[p]:
            i = p * step
            data[i + 3] = 0

    Image.frombytes("RGBA", (w, h), bytes(data)).save(out, "PNG")
    print(f"Wrote {out} ({w}x{h})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
