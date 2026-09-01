import re

def raw(n):
    s = open(n, encoding="utf-8").read()
    s = re.sub(r'\s(width|height)="[^"]*"', '', s, count=2)
    return s.strip()

M = [
 ("mark-01-keo-mut", "Kẹo Mút",
  "Viên kẹo mút cắm trên một keycap cơ.",
  "Ký hiệu thuần, không mặt người. Đọc được ở 16px, in thêu được, khó lỗi thời nhất trong ba hướng.",
  ["Favicon, app icon, tem dán hộp", "Watermark ảnh sản phẩm", "Con dấu, thêu áo nhân viên"]),
 ("mark-02-keycap-k", "Keycap K",
  "Chữ K nằm trong keycap; tay trên của chữ K chính là cây kẹo.",
  "Chữ cái thương hiệu và sản phẩm gộp vào một hình. Khối vuông bo góc vừa khít mọi ô avatar.",
  ["Avatar Zalo, Facebook, Shopee", "App icon, favicon", "Nút và badge trong giao diện web"]),
 ("mark-03-mascot", "Cậu Bé Kẹo",
  "Bản rút gọn của hình gốc: chỉ giữ đầu và vai, cắt vào khối tròn.",
  "Giữ đúng nhân vật bạn đã vẽ nhưng bỏ khoảng 80% chi tiết. Ấm, có cá tính, dễ nhớ nhất.",
  ["Ảnh đại diện shop, sticker Zalo", "Bao bì, thẻ cảm ơn trong đơn", "Nhân vật minh hoạ trên banner"]),
]

DIAG = [
 ("Vẽ toàn thân", "Ở 32px cho favicon, cả nhân vật gộp lại thành một vệt mực. Logo phải đọc được ở cỡ móng tay."),
 ("Chỉ có nét, không có mảng đặc", "Đặt lên nền hồng hoặc nền tối là hình biến mất. Logo cần một silhouette đặc."),
 ("Nét đều một độ dày", "Không có phân cấp, mắt không biết nhìn vào đâu trước."),
 ("Bàn phím vẽ khoảng 60 phím rời", "Thu nhỏ một chút là các phím dính lại thành mảng xám."),
 ("Không có màu thương hiệu", "Đen trắng, không liên hệ gì với bộ hồng phấn đang chạy trên website."),
 ("Không có khối bao, bố cục lệch trái", "Không cắt được thành ô vuông hay ô tròn cho avatar, không căn được vào lưới."),
]

def tile(svg, bg):
    return ('<div class="tile" style="background:' + bg + '">'
            '<div class="tile-in">' + svg + '</div></div>')

cards = []
for i, (f, name, desc, why, uses) in enumerate(M, 1):
    full = raw(f + ".svg")
    wh = raw(f + "-mono-white.svg")
    lockh = raw("lockup-h-%02d.svg" % i)
    fav = "".join('<div class="fav" style="width:%dpx">%s</div>' % (s, full) for s in (40, 28, 18))
    uses_html = "".join("<li>%s</li>" % u for u in uses)
    cards.append("""
    <article class="card">
      <header class="card-head">
        <span class="eyebrow">Hướng %s</span>
        <h3>%s</h3>
        <p class="lede">%s</p>
      </header>
      <div class="hero-mark">%s</div>
      <div class="proof">%s%s%s%s</div>
      <div class="lockup">%s</div>
      <div class="card-foot">
        <div><h4>Vì sao đổi</h4><p>%s</p></div>
        <div><h4>Dùng ở đâu</h4><ul>%s</ul></div>
        <div><h4>Thu nhỏ thật</h4><div class="favrow">%s</div><p class="mono-note">40 / 28 / 18 px</p></div>
      </div>
      <div class="files"><span>%s.svg</span><span>%s-mono.svg</span><span>%s-mono-white.svg</span><span>lockup-h-%02d.svg</span><span>lockup-v-%02d.svg</span></div>
    </article>""" % (chr(64 + i), name, desc, full,
                     tile(full, "#ffffff"), tile(full, "#ffe9f1"),
                     tile(wh, "#c2185b"), tile(wh, "#3c1428"),
                     lockh, why, uses_html, fav, f, f, f, i, i))

diag = "".join("<li><strong>%s</strong><span>%s</span></li>" % (t, d) for t, d in DIAG)

SW = [("#3c1428", "Mực", "Viền và chữ. Nâu mận, không dùng đen thuần."),
      ("#c2185b", "Hồng đậm", "Màu chính, đã có sẵn ở biến <code>--primary</code>."),
      ("#ff9bc3", "Hồng phấn", "Mảng phụ, và là màu chính khi nền tối."),
      ("#ffe9f1", "Hồng nhạt", "Nền viên kẹo, nền khối tròn."),
      ("#ffffff", "Trắng", "Khoảng thở, mặt nhân vật.")]
swatches = "".join(
    '<li><span class="chip" style="background:%s"></span><b>%s</b><code>%s</code>'
    '<span class="sw-note">%s</span></li>' % (c, n, c, d) for c, n, d in SW)

HTML = """<title>Logo KẸO Gaming Gear</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --hot:#c2185b;
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
.diag{list-style:none;margin:0;padding:0;display:grid;gap:1px;background:var(--line);
  border:1px solid var(--line);border-radius:14px;overflow:hidden}
@media(min-width:720px){.diag{grid-template-columns:1fr 1fr}}
.diag li{background:var(--surface);padding:18px 20px;display:flex;flex-direction:column;gap:4px}
.diag strong{font-family:var(--display);font-weight:600;font-size:17px}
.diag span{color:var(--muted);font-size:14.5px;line-height:1.55}
.cards{display:flex;flex-direction:column;gap:36px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:20px;
  padding:28px;display:flex;flex-direction:column;gap:22px}
.card-head{display:flex;flex-direction:column;gap:6px}
.card-head h3{font-size:28px;font-weight:600}
.lede{color:var(--muted);max-width:60ch}
.hero-mark{display:flex;justify-content:center;padding:4px 0}
.hero-mark svg{width:192px;height:192px}
.proof{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(min-width:640px){.proof{grid-template-columns:repeat(4,1fr)}}
.tile{border-radius:14px;border:1px solid var(--line-strong);display:flex;align-items:center;
  justify-content:center;padding:16px;aspect-ratio:1/.8}
.tile-in{width:96px}
.tile-in svg{width:100%;height:auto;display:block}
.lockup{background:#ffffff;border:1px solid var(--line-strong);border-radius:14px;padding:18px 24px;display:flex;justify-content:center}
.lockup svg{width:100%;max-width:400px;height:auto}
.card-foot{display:grid;gap:22px;padding-top:14px;border-top:1px solid var(--line)}
@media(min-width:760px){.card-foot{grid-template-columns:1.15fr 1fr .75fr}}
.card-foot h4{font-size:11px;font-family:var(--mono);font-weight:500;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted);margin:0 0 8px}
.card-foot p{font-size:15px}
.card-foot ul{margin:0;padding-left:18px;font-size:15px;display:flex;flex-direction:column;gap:3px}
.favrow{display:flex;align-items:flex-end;gap:14px}
.fav svg{width:100%;height:auto;display:block}
.mono-note{font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:10px}
.files{display:flex;flex-wrap:wrap;gap:8px}
.files span{font-family:var(--mono);font-size:11.5px;color:var(--muted);
  background:var(--sunk);border-radius:6px;padding:4px 8px}
.pal{list-style:none;margin:0;padding:0;display:grid;gap:12px}
@media(min-width:720px){.pal{grid-template-columns:repeat(5,1fr)}}
.pal li{background:var(--surface);border:1px solid var(--line);border-radius:14px;
  padding:14px;display:flex;flex-direction:column;gap:6px}
.chip{height:44px;border-radius:9px;border:1px solid var(--line-strong)}
.pal b{font-family:var(--display);font-weight:600}
.pal code{font-family:var(--mono);font-size:12px;color:var(--muted)}
.pal .sw-note{font-size:12px;color:var(--muted);line-height:1.45}
.notes{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px 24px}
.notes ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:9px;font-size:15px}
code{font-family:var(--mono);font-size:13px;background:var(--sunk);padding:1px 5px;border-radius:5px}
</style>

<div class="wrap">
  <header class="masthead">
    <div class="rule"></div>
    <h1>Ba hướng logo cho <em>KẸO Gaming Gear</em></h1>
    <p>Vẽ lại từ bản phác cậu bé cầm bàn phím. Vẫn một ý đó — kẹo gặp bàn phím cơ — nhưng dựng thành hình dùng được thật: chạy từ biển hiệu xuống favicon 18px, có bản một màu để in và thêu, và bám đúng bộ hồng đã nằm sẵn trong code website.</p>
  </header>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Chẩn đoán</span>
      <h2>Bản hiện tại vướng ở đâu</h2>
      <p>Hình vẽ tay rất có duyên, nhưng nó đang là một bức minh hoạ chứ chưa phải một logo. Sáu điểm khiến nó chưa dùng được:</p>
    </div>
    <ul class="diag">__DIAG__</ul>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Đề xuất</span>
      <h2>Ba hướng</h2>
      <p>Mỗi hướng đều có bản màu, bản một màu, bản đảo cho nền tối, lockup ngang và lockup dọc. Chọn một hướng rồi tôi hoàn thiện nốt và gắn lên website.</p>
    </div>
    <div class="cards">__CARDS__</div>
  </section>

  <section>
    <div class="sec-head">
      <span class="eyebrow">Bảng màu</span>
      <h2>Đúng bộ màu website đang chạy</h2>
      <p>Không thêm màu mới. Bốn giá trị đầu đã có sẵn trong <code>globals.css</code>.</p>
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
        <li>Chữ trong lockup dùng font <b>Fredoka</b> (có bộ dấu tiếng Việt). Trước khi gửi nhà in phải <b>convert chữ sang path</b>, không thì máy nào thiếu font sẽ hiện sai dấu.</li>
        <li>Khoảng trống tối thiểu quanh logo bằng bán kính viên kẹo. Đừng đặt logo sát mép hay sát chữ khác.</li>
        <li>Không kéo méo, không xoay, không đổi màu ngoài bảng trên, không thêm bóng đổ.</li>
        <li>Nền tối hoặc nền hồng đậm thì dùng bản <code>-mono-white.svg</code>.</li>
      </ul>
    </div>
  </section>
</div>
"""

HTML = HTML.replace("__DIAG__", diag).replace("__CARDS__", "".join(cards)).replace("__SWATCH__", swatches)
open("gallery.html", "w", encoding="utf-8").write(HTML)
print("bytes:", len(HTML))
