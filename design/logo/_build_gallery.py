# -*- coding: utf-8 -*-
"""Dựng trang trình bày gallery.html cho mascot KẸO Gaming Gear."""
import re


def raw(n, tag):
    s = open(n, encoding="utf-8").read()
    s = re.sub(r'\s(width|height)="[^"]*"', '', s, count=2)
    for i in ("kbg", "shA", "shB", "la", "lb", "lc"):
        s = s.replace('id="%s"' % i, 'id="%s%s"' % (tag, i)).replace('url(#%s)' % i, 'url(#%s%s)' % (tag, i))
    return s.strip()


KEEP = [
    ("Dáng đứng ba phần tư", "Đứng thẳng, hơi nghiêng, nhìn về phía người xem."),
    ("Ôm bàn phím ngang hông", "Bàn phím vẫn hếch đầu phải lên, một tay đỡ ở đầu trái."),
    ("Kẹo mút đưa lên miệng", "Tay phải gập lên, que kẹo chạm môi — đúng khoảnh khắc bản gốc."),
    ("Tóc dựng lởm chởm", "Giữ nguyên mái tóc nhọn và cái tai lộ ra."),
    ("Quần túi hộp, giày sneaker", "Vẫn là bộ đồ streetwear trong bản phác."),
]

FIX = [
    ("Nét dày, có phân cấp", "Viền ngoài 9px, chi tiết trong 6–7px. Nhìn xa vẫn thấy khối."),
    ("Tô mảng đặc màu hồng phấn", "Áo <code>#ff9bc3</code>, quần <code>#ffe9f1</code>, giày <code>#c2185b</code>. Không còn là hình rỗng ruột."),
    ("Bàn phím còn 3 hàng phím", "Từ ~60 phím rời xuống 40 phím to, thêm cụm WASD hồng đậm làm điểm nhấn."),
    ("Tỉ lệ 4,5 đầu", "Bản gốc gần 5,5 đầu nên nhìn gầy. Rút lại cho tròn và thân thiện hơn."),
    ("Có bản cắt tròn", "Cắt sát mặt và cây kẹo thành khối tròn — đây mới là bản chạy được ở favicon."),
    ("Bố cục căn giữa", "Bản gốc lệch trái và thừa khoảng trắng; nay cân trục, hết mép là hết hình."),
]

SW = [("#3c1428", "Mực", "Viền và tóc. Nâu mận, không dùng đen thuần."),
      ("#c2185b", "Hồng đậm", "Giày, cụm WASD, chữ KẸO. Đã có ở <code>--primary</code>."),
      ("#ff9bc3", "Hồng phấn", "Màu chủ đạo — áo và nền phím."),
      ("#ffe9f1", "Hồng nhạt", "Quần, viên kẹo, nền khối tròn."),
      ("#ffffff", "Trắng", "Da, thân bàn phím, đế giày.")]

full = raw("mascot-full.svg", "a")
fullw = raw("mascot-full-mono-white.svg", "b")
fullm = raw("mascot-full-mono.svg", "c")
badge = raw("mascot-badge.svg", "d")
badgew = raw("mascot-badge-mono-white.svg", "e")
badgem = raw("mascot-badge-mono.svg", "f")
lk_badge = raw("lockup-badge-h.svg", "g")
lk_full = raw("lockup-full-h.svg", "h")
lk_vert = raw("lockup-full-v.svg", "i")

keep = "".join("<li><strong>%s</strong><span>%s</span></li>" % t for t in KEEP)
fix = "".join("<li><strong>%s</strong><span>%s</span></li>" % t for t in FIX)
swatches = "".join(
    '<li><span class="chip" style="background:%s"></span><b>%s</b><code>%s</code>'
    '<span class="sw-note">%s</span></li>' % (c, n, c, d) for c, n, d in SW)
favs = "".join('<div class="fav" style="width:%dpx">%s</div>' % (s, badge) for s in (64, 44, 32, 22, 16))

HTML = """<title>Mascot KẸO Gaming Gear</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --paper:#fdf7f9; --surface:#ffffff; --sunk:#f7ecf0;
  --line:#ecd7e0; --line-strong:#d9b6c5;
  --text:#33131f; --muted:#7d5a67; --accent:#c2185b;
  --display:"Fredoka","Baloo 2",system-ui,sans-serif;
  --body:"Be Vietnam Pro","Segoe UI",system-ui,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --paper:#170a0f; --surface:#23111a; --sunk:#2c1622;
    --line:#3d2130; --line-strong:#553146;
    --text:#f7e8ee; --muted:#c096a6; --accent:#ff9bc3;
  }
}
:root[data-theme="dark"]{
  --paper:#170a0f; --surface:#23111a; --sunk:#2c1622;
  --line:#3d2130; --line-strong:#553146;
  --text:#f7e8ee; --muted:#c096a6; --accent:#ff9bc3;
}
*{box-sizing:border-box}
body{background:var(--paper);color:var(--text);font-family:var(--body);
  font-size:16px;line-height:1.65;margin:0;padding:0 24px 96px;-webkit-font-smoothing:antialiased}
.wrap{max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:64px}
h1,h2,h3,h4{font-family:var(--display);margin:0;text-wrap:balance;line-height:1.15}
p{margin:0}
code{font-family:var(--mono);font-size:.85em;background:var(--sunk);padding:1px 5px;border-radius:5px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)}
.masthead{padding-top:72px;display:flex;flex-direction:column;gap:18px}
.masthead h1{font-size:clamp(36px,6vw,60px);font-weight:600;letter-spacing:-.01em}
.masthead h1 em{font-style:normal;color:var(--accent)}
.masthead p{max-width:62ch;color:var(--muted);font-size:18px}
.rule{height:3px;background:var(--accent);width:64px;border-radius:3px}
section{display:flex;flex-direction:column;gap:24px}
h2{font-size:clamp(24px,3.2vw,32px);font-weight:600}
.sec-head{display:flex;flex-direction:column;gap:8px;padding-bottom:6px;border-bottom:1px solid var(--line)}
.sec-head p{color:var(--muted);max-width:66ch}

/* giữ / sửa */
.twocol{display:grid;gap:24px}
@media(min-width:820px){.twocol{grid-template-columns:1fr 1fr}}
.col{display:flex;flex-direction:column;gap:12px}
.col h3{font-size:19px;font-weight:600;display:flex;align-items:center;gap:9px}
.dot{width:11px;height:11px;border-radius:50%;flex:0 0 auto}
.checks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px;
  background:var(--line);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.checks li{background:var(--surface);padding:15px 18px;display:flex;flex-direction:column;gap:3px}
.checks strong{font-family:var(--display);font-weight:600;font-size:16px}
.checks span{color:var(--muted);font-size:14.5px;line-height:1.55}

/* trưng bày */
.stage{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:28px;
  display:flex;flex-direction:column;gap:24px}
.stage-main{display:grid;gap:24px;align-items:center}
@media(min-width:760px){.stage-main{grid-template-columns:auto 1fr}}
.figbox{background:#ffffff;border:1px solid var(--line-strong);border-radius:16px;
  padding:22px;display:flex;justify-content:center}
.figbox svg{height:320px;width:auto;display:block}
.grounds{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(min-width:560px){.grounds{grid-template-columns:repeat(4,1fr)}}
.tile{border-radius:14px;border:1px solid var(--line-strong);display:flex;align-items:center;
  justify-content:center;padding:14px;min-height:150px}
.tile svg{height:118px;width:auto;display:block}
.tile.round svg{height:96px}
.caption{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--muted)}
.favrow{display:flex;align-items:flex-end;gap:18px;flex-wrap:wrap}
.fav svg{width:100%;height:auto;display:block}
.lock{background:#ffffff;border:1px solid var(--line-strong);border-radius:14px;padding:20px 24px;
  display:flex;justify-content:center;align-items:center}
.lock svg{width:100%;height:auto;display:block}
.lock.tall svg{max-width:260px}
.lockgrid{display:grid;gap:16px}
@media(min-width:820px){.lockgrid{grid-template-columns:1.35fr 1fr}}
.files{display:flex;flex-wrap:wrap;gap:8px}
.files span{font-family:var(--mono);font-size:11.5px;color:var(--muted);
  background:var(--sunk);border-radius:6px;padding:4px 8px}

/* bảng màu */
.pal{list-style:none;margin:0;padding:0;display:grid;gap:12px}
@media(min-width:720px){.pal{grid-template-columns:repeat(5,1fr)}}
.pal li{background:var(--surface);border:1px solid var(--line);border-radius:14px;
  padding:14px;display:flex;flex-direction:column;gap:6px}
.chip{height:44px;border-radius:9px;border:1px solid var(--line-strong)}
.pal b{font-family:var(--display);font-weight:600}
.pal code{font-size:12px;color:var(--muted);background:none;padding:0}
.pal .sw-note{font-size:12px;color:var(--muted);line-height:1.45}
.notes{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px 24px}
.notes ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:9px;font-size:15px}
</style>

<div class="wrap">
  <header class="masthead">
    <div class="rule"></div>
    <h1>Mascot <em>KẸO Gaming Gear</em></h1>
    <p>Vẽ lại đúng bản phác bạn gửi — vẫn là cậu bé đứng ôm bàn phím cơ, ngậm cây kẹo mút. Không đổi ý tưởng, chỉ dựng lại bằng vector: nét dày có phân cấp, tô mảng đặc bằng hồng phấn, và thêm bản cắt tròn để chạy được ở cỡ favicon.</p>
  </header>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Đối chiếu</span>
      <h2>Giữ gì, sửa gì</h2>
      <p>Mọi thứ làm nên nhân vật đều giữ nguyên. Chỉ sửa những chỗ khiến bản phác không dùng được như một logo.</p>
    </div>
    <div class="twocol">
      <div class="col">
        <h3><span class="dot" style="background:#ff9bc3"></span>Giữ nguyên</h3>
        <ul class="checks">__KEEP__</ul>
      </div>
      <div class="col">
        <h3><span class="dot" style="background:#c2185b"></span>Đã sửa</h3>
        <ul class="checks">__FIX__</ul>
      </div>
    </div>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Bản chính</span>
      <h2>Dáng đứng đầy đủ</h2>
      <p>Dùng cho banner, bao bì, standee, sticker — chỗ nào có đủ chiều cao thì dùng bản này.</p>
    </div>
    <div class="stage">
      <div class="stage-main">
        <div class="figbox">__FULL__</div>
        <div class="grounds">
          <div class="tile" style="background:#ffe9f1">__FULL2__</div>
          <div class="tile" style="background:#ff9bc3">__FULL3__</div>
          <div class="tile" style="background:#c2185b">__FULLW__</div>
          <div class="tile" style="background:#3c1428">__FULLW2__</div>
        </div>
      </div>
      <div class="files"><span>mascot-full.svg</span><span>mascot-full-mono.svg</span><span>mascot-full-mono-white.svg</span></div>
    </div>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Bản cắt tròn</span>
      <h2>Khối tròn cho avatar và favicon</h2>
      <p>Cắt sát mặt và cây kẹo từ chính bản vẽ trên, nên vẫn là một nhân vật. Đây là bản dùng cho ô vuông nhỏ — dáng đứng đầy đủ sẽ nát ở cỡ này.</p>
    </div>
    <div class="stage">
      <div class="grounds">
        <div class="tile round" style="background:#ffffff">__BADGE__</div>
        <div class="tile round" style="background:#ff9bc3">__BADGE2__</div>
        <div class="tile round" style="background:#c2185b">__BADGEW__</div>
        <div class="tile round" style="background:#3c1428">__BADGEW2__</div>
      </div>
      <div>
        <p class="caption" style="margin-bottom:14px">Thu nhỏ thật — 64 / 44 / 32 / 22 / 16 px</p>
        <div class="favrow">__FAVS__</div>
      </div>
      <div class="files"><span>mascot-badge.svg</span><span>mascot-badge-mono.svg</span><span>mascot-badge-mono-white.svg</span></div>
    </div>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Lockup</span>
      <h2>Ghép với chữ</h2>
      <p>Bản khối tròn ghép ngang là bản dùng cho header website. Hai bản còn lại cho banner và bao bì.</p>
    </div>
    <div class="lock">__LKBADGE__</div>
    <div class="lockgrid">
      <div class="lock">__LKFULL__</div>
      <div class="lock tall">__LKVERT__</div>
    </div>
    <div class="files"><span>lockup-badge-h.svg</span><span>lockup-full-h.svg</span><span>lockup-full-v.svg</span></div>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Bảng màu</span>
      <h2>Hồng phấn làm chủ đạo</h2>
      <p>Không thêm màu mới — cả năm giá trị đều lấy từ <code>globals.css</code> của website.</p>
    </div>
    <ul class="pal">__SWATCH__</ul>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Bàn giao</span>
      <h2>Cần biết trước khi dùng</h2>
    </div>
    <div class="notes">
      <ul>
        <li>File nằm ở <code>design/logo/</code> trong repo, định dạng SVG — phóng to bao nhiêu cũng nét.</li>
        <li>Chữ trong lockup dùng font <b>Fredoka</b> (có bộ dấu tiếng Việt). Trước khi gửi nhà in phải <b>convert chữ sang path</b>, không thì máy thiếu font sẽ hiện sai chữ KẸO.</li>
        <li>Nền tối hoặc nền hồng đậm thì dùng bản <code>-mono-white.svg</code>; in một màu, khắc dấu, thêu áo thì dùng <code>-mono.svg</code>.</li>
        <li>Dưới 44px đừng dùng dáng đứng đầy đủ — chuyển sang bản cắt tròn.</li>
        <li>Khoảng trống tối thiểu quanh logo bằng đường kính viên kẹo. Không kéo méo, không xoay, không đổi màu ngoài bảng trên.</li>
      </ul>
    </div>
  </section>
</div>
"""

for k, v in [("__KEEP__", keep), ("__FIX__", fix), ("__SWATCH__", swatches), ("__FAVS__", favs),
             ("__FULL__", full), ("__FULL2__", full), ("__FULL3__", full),
             ("__FULLW__", fullw), ("__FULLW2__", fullw),
             ("__BADGE__", badge), ("__BADGE2__", badge),
             ("__BADGEW__", badgew), ("__BADGEW2__", badgew),
             ("__LKBADGE__", lk_badge), ("__LKFULL__", lk_full), ("__LKVERT__", lk_vert)]:
    HTML = HTML.replace(k, v)

open("gallery.html", "w", encoding="utf-8").write(HTML)
print("bytes:", len(HTML))
