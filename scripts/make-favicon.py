#!/usr/bin/env python3
"""Generate favicon.ico and apple-touch-icon.png from the same shape as favicon.svg.

The SVG is the source of truth for how the mark looks; this script exists so the
raster fallbacks can be regenerated from it without pulling in ImageMagick or
Pillow, neither of which is available in CI. Pure stdlib: zlib + struct.

    python3 scripts/make-favicon.py

Writes static/favicon.ico (32x32) and static/apple-touch-icon.png (180x180).
"""
import struct, zlib, os

BRAND = (0x5D, 0x5F, 0xEF)          # --color-primary
GLYPH = (0xFF, 0xFF, 0xFF)
SS = 4                               # supersampling factor, for smooth edges

# The "V", as a closed polygon in 0..1 space. Matches the path in favicon.svg.
V = [(0.22, 0.25), (0.36, 0.25), (0.50, 0.585),
     (0.64, 0.25), (0.78, 0.25), (0.50, 0.775)]


def in_poly(x, y, poly):
    inside = False
    n = len(poly)
    for i in range(n):
        x0, y0 = poly[i]
        x1, y1 = poly[(i + 1) % n]
        if (y0 > y) != (y1 > y):
            xint = (x1 - x0) * (y - y0) / (y1 - y0) + x0
            if x < xint:
                inside = not inside
    return inside


def in_rounded_square(x, y, r=0.20):
    if x < 0 or x > 1 or y < 0 or y > 1:
        return False
    cx = min(max(x, r), 1 - r)
    cy = min(max(y, r), 1 - r)
    dx, dy = x - cx, y - cy
    return dx * dx + dy * dy <= r * r


def render(size):
    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(SS):
                for sx in range(SS):
                    x = (px + (sx + 0.5) / SS) / size
                    y = (py + (sy + 0.5) / SS) / size
                    if not in_rounded_square(x, y):
                        continue
                    col = GLYPH if in_poly(x, y, V) else BRAND
                    acc[0] += col[0]; acc[1] += col[1]; acc[2] += col[2]; acc[3] += 255
            n = SS * SS
            a = acc[3] // n
            if a == 0:
                row += bytes((0, 0, 0, 0))
            else:
                # un-premultiply against covered samples so edges stay true colour
                cov = acc[3] // 255 or 1
                row += bytes((acc[0] // cov, acc[1] // cov, acc[2] // cov, a))
        rows.append(bytes(row))
    return rows


def png(rows, size):
    raw = b''.join(b'\x00' + r for r in rows)
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b''))


def ico(png_bytes, size):
    # ICO with a single PNG-encoded image; supported everywhere since Vista.
    header = struct.pack('<HHH', 0, 1, 1)
    entry = struct.pack('<BBBBHHII', size, size, 0, 0, 1, 32, len(png_bytes), 22)
    return header + entry + png_bytes


root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
p32 = png(render(32), 32)
open(os.path.join(root, 'static/favicon.ico'), 'wb').write(ico(p32, 32))
open(os.path.join(root, 'static/apple-touch-icon.png'), 'wb').write(png(render(180), 180))
print('wrote static/favicon.ico and static/apple-touch-icon.png')
