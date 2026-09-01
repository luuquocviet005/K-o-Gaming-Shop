# -*- coding: utf-8 -*-
"""Mascot KẸO Gaming Gear — bám nguyên bố cục bản phác: cậu bé đứng ôm bàn phím cơ, mút kẹo."""

INK = "#3c1428"; HOT = "#c2185b"; SOFT = "#ff9bc3"; PALE = "#ffe9f1"; W = "#ffffff"

SPIRAL = ("M50,50 A3,3 0 0 1 56,50 A8,8 0 0 1 40,50 A13,13 0 0 1 66,50 "
          "A18,18 0 0 1 30,50 A23,23 0 0 1 76,50 A28,28 0 0 1 20,50")


def swirl(cx, cy, r, color=HOT, weight=8):
    s = r / 28.0
    return ('<g transform="translate(%g,%g) scale(%.4f) translate(-48,-50)">'
            '<path d="%s" fill="none" stroke="%s" stroke-width="%.2f" stroke-linecap="round"/></g>'
            % (cx, cy, s, SPIRAL, color, weight / s))


def limb(d, w=26, ow=9):
    return ('<path d="%s" fill="none" stroke="%s" stroke-width="%g" stroke-linecap="round" stroke-linejoin="round"/>'
            '<path d="%s" fill="none" stroke="%s" stroke-width="%g" stroke-linecap="round" stroke-linejoin="round"/>'
            % (d, INK, w + ow * 2, d, W, w))


def shoe(tag, x0, x1, y0, y1, toe_left=True):
    if toe_left:
        body = ("M%g,%g L%g,%g Q%g,%g %g,%g L%g,%g Q%g,%g %g,%g L%g,%g Q%g,%g %g,%g Z"
                % (x1, y0, x0 + 26, y0, x0, y0 + 4, x0, y0 + 22,
                   x0, y1 - 12, x0, y1, x0 + 14, y1,
                   x1 - 8, y1, x1, y1, x1, y1 - 12))
    else:
        body = ("M%g,%g L%g,%g Q%g,%g %g,%g L%g,%g Q%g,%g %g,%g L%g,%g Q%g,%g %g,%g Z"
                % (x0, y0, x1 - 26, y0, x1, y0 + 4, x1, y0 + 22,
                   x1, y1 - 12, x1, y1, x1 - 14, y1,
                   x0 + 8, y1, x0, y1, x0, y1 - 12))
    sole = ('<rect x="%g" y="%g" width="%g" height="%g" fill="%s"/>'
            % (x0 - 2, y1 - 14, x1 - x0 + 4, 20, W))
    return ('<g><path d="%s" fill="%s" stroke="%s" stroke-width="9" stroke-linejoin="round"/>'
            '<clipPath id="%s"><path d="%s"/></clipPath>'
            '<g clip-path="url(#%s)">%s</g>'
            '<path d="%s" fill="none" stroke="%s" stroke-width="9" stroke-linejoin="round"/></g>'
            % (body, HOT, INK, tag, body, tag, sole, body, INK))


def keyboard():
    """Bàn phím cơ nghiêng, đầu phải hếch lên như bản gốc."""
    ks = []
    accents = {(1, 2), (2, 1), (2, 2), (2, 3)}          # cụm WASD
    for r in range(3):
        for c in range(12):
            fill = HOT if (r, c) in accents else PALE
            ks.append('<rect x="%.1f" y="%.1f" width="10" height="8" rx="2.3" fill="%s"/>'
                      % (110 + c * 13.4, 302 + r * 11, fill))
    ks.append('<rect x="110" y="335" width="26" height="8" rx="2.3" fill="%s"/>' % PALE)
    ks.append('<rect x="140" y="335" width="72" height="8" rx="2.3" fill="%s"/>' % PALE)
    ks.append('<rect x="216" y="335" width="44" height="8" rx="2.3" fill="%s"/>' % PALE)
    return ('<g transform="rotate(-12 190 319)">'
            '<path d="M100,344 L280,344 L280,352 Q280,360 272,360 L108,360 Q100,360 100,352 Z" '
            'fill="%s" stroke="%s" stroke-width="9" stroke-linejoin="round"/>'
            '<rect x="100" y="292" width="180" height="54" rx="10" fill="%s" stroke="%s" stroke-width="9"/>'
            '%s</g>' % (SOFT, INK, W, INK, "".join(ks)))


def figure():
    p = []
    # ---- chân, quần thụng ----
    p.append('<path d="M146,282 L196,282 C194,338 192,398 190,450 L144,450 '
             'C140,398 142,338 146,282 Z" fill="%s" stroke="%s" stroke-width="9" '
             'stroke-linejoin="round"/>' % (PALE, INK))
    p.append('<path d="M214,282 L264,282 C264,338 266,400 268,456 L220,456 '
             'C216,400 214,338 214,282 Z" fill="%s" stroke="%s" stroke-width="9" '
             'stroke-linejoin="round"/>' % (PALE, INK))
    p.append('<path d="M224,372 L254,372 L254,412 L224,412 Z" fill="none" stroke="%s" '
             'stroke-width="7" stroke-linejoin="round"/>' % INK)
    p.append('<path d="M221,372 L257,372" stroke="%s" stroke-width="7" stroke-linecap="round"/>' % INK)
    # ---- giày ----
    p.append(shoe("shA", 118, 196, 438, 484, toe_left=True))
    p.append(shoe("shB", 214, 294, 446, 492, toe_left=False))
    # ---- tay trái, buông xuống đỡ bàn phím ----
    p.append(limb("M136,240 L120,298 L116,350"))
    # ---- cổ + áo ----
    p.append('<rect x="186" y="140" width="28" height="36" fill="%s" stroke="%s" stroke-width="9"/>'
             % (W, INK))
    p.append('<path d="M200,162 C169,162 149,171 141,187 L122,228 L150,246 L139,306 '
             'C171,318 231,318 263,306 L252,246 L280,228 L259,187 C251,171 231,162 200,162 Z" '
             'fill="%s" stroke="%s" stroke-width="9" stroke-linejoin="round"/>' % (SOFT, INK))
    p.append('<path d="M180,168 Q200,184 220,168" fill="none" stroke="%s" stroke-width="8" '
             'stroke-linecap="round"/>' % INK)
    # ---- đầu ----
    p.append('<circle cx="152" cy="116" r="12" fill="%s" stroke="%s" stroke-width="9"/>' % (W, INK))
    p.append('<ellipse cx="200" cy="104" rx="50" ry="54" fill="%s" stroke="%s" stroke-width="9"/>'
             % (W, INK))
    p.append('<ellipse cx="167" cy="131" rx="12" ry="7.5" fill="%s"/>' % SOFT)
    p.append('<ellipse cx="236" cy="122" rx="9" ry="6" fill="%s" opacity=".85"/>' % SOFT)
    p.append('<path d="M148,108 C142,56 168,32 200,32 C234,32 258,56 254,106 '
             'L243,78 L230,96 L218,70 L204,90 L190,64 L176,86 L164,68 L155,90 Z" fill="%s"/>' % INK)
    p.append('<circle cx="185" cy="110" r="8.5" fill="%s"/>' % INK)
    p.append('<circle cx="225" cy="110" r="8.5" fill="%s"/>' % INK)
    p.append('<path d="M174,92 Q185,84 196,90" fill="none" stroke="%s" stroke-width="6" '
             'stroke-linecap="round"/>' % INK)
    p.append('<path d="M216,90 Q227,84 238,92" fill="none" stroke="%s" stroke-width="6" '
             'stroke-linecap="round"/>' % INK)
    p.append('<ellipse cx="219" cy="139" rx="9" ry="7" fill="%s"/>' % INK)
    # ---- tay phải giơ lên, cầm que kẹo ----
    p.append(limb("M270,228 L296,254 L258,200"))
    # ---- kẹo mút ----
    p.append('<path d="M252,164 L258,192" stroke="%s" stroke-width="11" stroke-linecap="round"/>' % INK)
    p.append('<circle cx="258" cy="196" r="18" fill="%s" stroke="%s" stroke-width="9"/>' % (W, INK))
    p.append('<circle cx="259" cy="142" r="24" fill="%s" stroke="%s" stroke-width="9"/>' % (PALE, INK))
    p.append(swirl(259, 142, 17, HOT, 5.5))
    # ---- bàn phím + tay đỡ ----
    p.append(keyboard())
    p.append('<circle cx="118" cy="356" r="18" fill="%s" stroke="%s" stroke-width="9"/>' % (W, INK))
    return "".join(p)


def build(fname, body, vb="0 0 220 500", w=220, h=500, shift="translate(-92,-14)",
          label="KEO Gaming Gear"):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" width="%d" height="%d" '
           'role="img" aria-label="%s">\n<g transform="%s" stroke-linejoin="round" '
           'stroke-linecap="round">%s</g>\n</svg>\n' % (vb, w, h, label, shift, body))
    open(fname, "w", encoding="utf-8").write(svg)
    return svg


def badge():
    """Cắt tròn quanh đầu và cây kẹo — dùng cho favicon, avatar."""
    return ('<defs><clipPath id="kbg"><circle cx="206" cy="114" r="90"/></clipPath></defs>'
            '<circle cx="206" cy="114" r="90" fill="%s"/>'
            '<g clip-path="url(#kbg)">%s</g>'
            '<circle cx="206" cy="114" r="90" fill="none" stroke="%s" stroke-width="10"/>'
            % (PALE, figure(), INK))


ORDER = [INK, HOT, SOFT, PALE, W]


def recolor(s, targets, tag):
    for i, c in enumerate(ORDER):
        s = s.replace(c, "\x01%d\x02" % i)
    for i, c in enumerate(targets):
        s = s.replace("\x01%d\x02" % i, c)
    return s.replace('id="sh', 'id="%ssh' % tag).replace('url(#sh', 'url(#%ssh' % tag)


full = build("mascot-full.svg", figure())
open("mascot-full-mono.svg", "w", encoding="utf-8").write(recolor(full, [INK, INK, W, W, W], "m"))
open("mascot-full-mono-white.svg", "w", encoding="utf-8").write(recolor(full, [W, W, INK, INK, INK], "w"))

bdg = build("mascot-badge.svg", badge(), vb="111 19 190 190", w=190, h=190, shift="translate(0,0)")
open("mascot-badge-mono.svg", "w", encoding="utf-8").write(
    recolor(bdg, [INK, INK, W, W, W], "m").replace('id="kbg"', 'id="kbgm"').replace('url(#kbg)', 'url(#kbgm)'))
open("mascot-badge-mono-white.svg", "w", encoding="utf-8").write(
    recolor(bdg, [W, W, INK, INK, INK], "w").replace('id="kbg"', 'id="kbgw"').replace('url(#kbg)', 'url(#kbgw)'))

FONT = "Fredoka, 'Baloo 2', Nunito, 'Segoe UI', sans-serif"


def inner(path):
    t = open(path, encoding="utf-8").read()
    t = t[t.index(">", t.index("<svg")) + 1:t.rindex("</svg>")]
    return t.strip()


def wordmark(x, y, anchor="start", big=76, small=29, gap=45, track=7.4):
    return ('<text x="%g" y="%g" text-anchor="%s" font-family="%s" font-size="%g" '
            'font-weight="700" fill="%s" letter-spacing="1">KẸO</text>'
            '<text x="%g" y="%g" text-anchor="%s" font-family="%s" font-size="%g" '
            'font-weight="600" fill="%s" letter-spacing="%g">GAMING GEAR</text>'
            % (x, y, anchor, FONT, big, HOT, x, y + gap, anchor, FONT, small, INK, track))


def lockup(fname, vb, w, h, mark_svg, mark_tf, text_svg, tag):
    body = ('<g transform="%s">%s</g>%s' % (mark_tf, mark_svg.replace('"kbg"', '"%s"' % tag)
            .replace('url(#kbg)', 'url(#%s)' % tag).replace('id="sh', 'id="%ssh' % tag)
            .replace('url(#sh', 'url(#%ssh' % tag), text_svg))
    open(fname, "w", encoding="utf-8").write(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" width="%d" height="%d" '
        'role="img" aria-label="KEO Gaming Gear">\n%s\n</svg>\n' % (vb, w, h, body))


bi, fi = inner("mascot-badge.svg"), inner("mascot-full.svg")

# ngang, dùng badge — cho header website
lockup("lockup-badge-h.svg", "0 0 660 200", 660, 200, bi,
       "translate(10,10) scale(0.947) translate(-111,-19)", wordmark(210, 104), "la")
# ngang, dùng dáng đứng đủ — cho banner
lockup("lockup-full-h.svg", "0 0 640 330", 640, 330, fi,
       "translate(20,15) scale(0.6) translate(0,0)", wordmark(200, 165), "lb")
# dọc — cho bao bì, standee
lockup("lockup-full-v.svg", "0 0 400 470", 400, 470, fi,
       "translate(133,6) scale(0.68) translate(0,0)", wordmark(200, 390, "middle"), "lc")

print("ok")
