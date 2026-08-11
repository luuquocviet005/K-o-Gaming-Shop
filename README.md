# KẸO GAMING SHOP

Website bán gaming gear — Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript.
Xuất ra HTML/CSS/JS **tĩnh** nên chạy được trên **mọi gói Hostinger** (kể cả
Shared Hosting rẻ nhất), không cần Node.js trên máy chủ.

---

## Mục lục

1. [Chạy trên máy](#1-chạy-trên-máy)
2. [Đổi nội dung của shop](#2-đổi-nội-dung-của-shop)
3. [Push lên GitHub](#3-push-lên-github)
4. [Deploy lên Hostinger](#4-deploy-lên-hostinger)
5. [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6. [Nâng cấp về sau](#6-nâng-cấp-về-sau)

---

## 1. Chạy trên máy

> ### ⚠️ Bắt buộc Node.js 20.9 trở lên
>
> Next.js 16 **không chạy** trên Node 18. Nếu thấy lỗi:
>
> ```
> You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.
> npm warn EBADENGINE Unsupported engine ...
> ```
>
> thì môi trường đang dùng Node quá cũ. Kiểm tra bằng `node -v`.
> Tải bản mới tại [nodejs.org](https://nodejs.org) (chọn LTS), hoặc trên Windows:
>
> ```bash
> winget install -e --id OpenJS.NodeJS.LTS
> ```
>
> **Đừng build trên Hostinger.** Hostinger Shared Hosting dùng Node cũ và không
> cần build ở đó — website này là trang tĩnh, chỉ cần upload thư mục `out/` đã
> build sẵn từ máy bạn hoặc từ GitHub Actions.

```bash
npm install
```

```bash
npm run dev
```

Mở http://localhost:3000

Build bản chạy thật (kết quả nằm trong thư mục `out/`):

```bash
npm run build
```

Xem thử bản đã build đúng như trên hosting:

```bash
npm run preview
```

| Lệnh | Việc nó làm |
|------|-------------|
| `npm run dev` | Máy chủ phát triển, sửa file là trang tự cập nhật |
| `npm run build` | Xuất trang tĩnh ra `out/` + copy `.htaccess` |
| `npm run preview` | Chạy thử thư mục `out/` tại http://localhost:4000 |
| `npm run check` | Quét link chết + kiểm tra SEO + tương phản màu |
| `npm run push` | Kiểm tra hết → commit → đẩy lên GitHub → Hostinger tự deploy |
| `npm run typecheck` | Kiểm tra lỗi TypeScript |
| `npm run lint` | Kiểm tra lỗi code |

---

## 2. Đổi nội dung của shop

### Tên shop, số điện thoại, địa chỉ, mạng xã hội

Sửa **một file duy nhất**: [`src/lib/site.ts`](src/lib/site.ts)

```ts
contact: {
  phone: "0900 000 000",           // ← đổi số thật
  phoneHref: "tel:0900000000",     // ← đổi luôn cả dòng này
  email: "hello@keogamingshop.com",
  address: "123 Đường ABC, ...",
},
social: {
  facebook: "https://facebook.com/trang-cua-ban",
  zalo: "https://zalo.me/0900000000",
  ...
}
```

Trong file này còn có: phí ship, ngưỡng miễn phí ship, và danh sách mã giảm giá.

### Logo

Mở [`src/components/logo.tsx`](src/components/logo.tsx), thay khối `<svg>` bên
trong bằng:

```tsx
<img src="/logo.svg" alt="" width={40} height={40} />
```

rồi bỏ file logo vào `public/logo.svg`. Đổi cả `src/app/icon.svg` để favicon
(icon trên tab trình duyệt) khớp với logo mới.

### Sản phẩm

Danh sách hàng **không** nằm trong code — nó lấy từ Google Sheet. Sửa Sheet là
sửa web. Mỗi tab trong Sheet là một danh mục; ánh xạ tab → danh mục khai báo ở
[`sync.config.json`](sync.config.json).

Kéo dữ liệu về ngay lập tức:

```bash
npm run sync
```

Ngoài ra GitHub Actions tự chạy lệnh này 20 phút một lần, nên kể cả không đụng
gì thì Sheet vẫn tự lên web.

Tên cột, cách viết giá (`650k`, `1tr2`, `5m7`, `1tr2 - 1tr5`) và cách viết tình
trạng đều được đọc rất thoáng — xem [`scripts/lib/normalize.mjs`](scripts/lib/normalize.mjs)
nếu cần biết chính xác quy tắc.

### Ảnh sản phẩm

Bỏ ảnh vào thư mục ảnh (khai báo ở `sync.config.json` > `thuMucAnh`), chia theo
danh mục rồi mỗi sản phẩm một thư mục con (hoặc một file `.zip` — script tự bung):

```
Ảnh gear/
  Chuột/
    Razer Naga v2 Hyperspeed/   ← tên trùng tên trong Sheet là khớp được
    ATK F1 Extreme.zip
  Bàn phím/
    ...
```

Script tự nén ảnh (thường nhẹ đi ~20 lần), tự khớp với sản phẩm trong Sheet, và
ghi kết quả vào file **`BAO CAO.txt`** ngay trong thư mục ảnh — mở file đó ra là
biết ảnh nào đã lên, ảnh nào chưa khớp được tên.

**Cách chạy — chọn một:**

| Cách | Làm gì |
| --- | --- |
| **Tự động** (khuyến nghị) | Chạy `Bat tu dong 15 phut.bat` **một lần duy nhất**. Từ đó chỉ cần bỏ ảnh vào thư mục, tối đa 15 phút sau là web tự cập nhật. Muốn dừng: `Tat tu dong.bat`. |
| **Thủ công** | Kéo thả thư mục ảnh vào `Tai anh len web.bat`. |

Sản phẩm chưa có ảnh thật thì website tự vẽ hình minh hoạ vector theo danh mục —
không bao giờ bị vỡ layout.

### Màu sắc / giao diện

Toàn bộ màu nằm trong [`src/app/globals.css`](src/app/globals.css), phần
`:root` (chế độ sáng) và `[data-theme="dark"]` (chế độ tối). Đổi biến ở đó là
cả website đổi theo — không cần sửa từng component.

> ⚠️ Nếu đổi màu `--primary`, giữ nó đủ đậm để chữ trắng đè lên vẫn đọc được
> (tối thiểu tỉ lệ tương phản 4.5:1). Bản hiện tại đạt 5.02:1.

---

## 3. Push lên GitHub

Repo đã được `git init` sẵn và có commit đầu tiên. Việc còn lại:

**Bước 1 —** Tạo repo rỗng trên https://github.com/new (đặt tên
`keo-gaming-shop`, **không** tick "Add a README").

**Bước 2 —** Chạy trong thư mục dự án (thay `TEN-GITHUB` bằng tên tài khoản):

```bash
git remote add origin https://github.com/TEN-GITHUB/keo-gaming-shop.git
```

```bash
git push -u origin main
```

Lần đầu GitHub sẽ hỏi đăng nhập — dùng **Personal Access Token** thay cho mật
khẩu (GitHub > Settings > Developer settings > Personal access tokens).

Những lần sau, mỗi khi sửa xong:

```bash
git add . && git commit -m "Cập nhật sản phẩm" && git push
```

---

## 4. Deploy lên Hostinger

Có 2 cách. **Cách A** đơn giản, làm được ngay. **Cách B** tự động — push code là
website tự cập nhật, nên làm sau khi đã quen.

### Cách A — Upload thủ công (5 phút, chắc chắn chạy)

1. Chạy `npm run build` → sinh ra thư mục `out/`
2. Nén **toàn bộ nội dung bên trong** `out/` thành file `.zip`
   (⚠️ nén *nội dung bên trong*, không nén cả thư mục `out`)
3. Đăng nhập [hPanel](https://hpanel.hostinger.com) → **Files → File Manager**
4. Vào thư mục `public_html/` → xoá hết file cũ (nếu có `default.php` thì xoá)
5. Bấm **Upload** → chọn file `.zip` → sau khi lên xong, chuột phải → **Extract**
6. Xong. Mở tên miền của bạn để kiểm tra.

> Nhớ kiểm tra trong `public_html/` phải có file `index.html` nằm **ngay ở gốc**,
> không nằm trong thư mục con.

### Cách B — Tự động qua GitHub Actions (push là deploy)

File cấu hình đã có sẵn: `.github/workflows/deploy-hostinger.yml`

**Bước 1 — Lấy thông tin FTP từ Hostinger**

hPanel → **Files → FTP Accounts**. Ghi lại 3 thứ:

| Thông tin | Ví dụ |
|-----------|-------|
| FTP hostname | `ftp.tenmiencuaban.com` hoặc dạng `82.180.xxx.xxx` |
| FTP username | `u123456789.tenmien` |
| FTP password | mật khẩu bạn đặt (bấm *Change account password* nếu quên) |

**Bước 2 — Khai báo vào GitHub**

Vào repo trên GitHub → **Settings → Secrets and variables → Actions** →
**New repository secret**. Tạo đúng 3 secret với tên chính xác:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

**Bước 3 — Push code**

```bash
git push
```

Vào tab **Actions** trên GitHub để xem tiến trình. Lần đầu mất khoảng 2–3 phút
(upload toàn bộ), những lần sau chỉ vài giây vì chỉ upload file thay đổi.

### Bật HTTPS (nên làm)

hPanel → **Websites → SSL** → cài chứng chỉ miễn phí. Sau khi cài xong, mở file
`deploy/.htaccess`, bỏ dấu `#` ở 3 dòng cuối phần "Ép HTTPS", rồi build và
deploy lại.

### Đổi domain thật

Sau khi trỏ tên miền, sửa `url` trong `src/lib/site.ts`:

```ts
url: "https://tenmiencuaban.com",
```

Việc này giúp `sitemap.xml` và thẻ chia sẻ mạng xã hội trỏ đúng địa chỉ.

---

## 5. Cấu trúc thư mục

```
keo-gaming-shop/
├── src/
│   ├── app/                        # Các trang (mỗi thư mục = một URL)
│   │   ├── page.tsx                #  /                Trang chủ
│   │   ├── danh-muc/               #  /danh-muc/       Tất cả sản phẩm
│   │   │   └── [slug]/             #  /danh-muc/chuot/ Theo danh mục
│   │   ├── san-pham/[slug]/        #  /san-pham/...    Chi tiết sản phẩm
│   │   ├── gio-hang/               #  /gio-hang/       Giỏ hàng
│   │   ├── khuyen-mai/             #  /khuyen-mai/     Hàng giảm giá
│   │   ├── lien-he/                #  /lien-he/
│   │   ├── chinh-sach/             #  /chinh-sach/
│   │   ├── layout.tsx              # Khung chung: header, footer, font
│   │   └── globals.css             # ★ TOÀN BỘ MÀU SẮC nằm ở đây
│   ├── components/                 # Các khối giao diện dùng lại
│   └── lib/
│       ├── site.ts                 # ★ Thông tin cửa hàng
│       ├── products.ts             # ★ Dữ liệu sản phẩm
│       └── cart.tsx                # Logic giỏ hàng (localStorage)
├── public/                         # Ảnh, file tĩnh
├── deploy/.htaccess                # Cấu hình Apache cho Hostinger
├── scripts/postbuild.mjs           # Copy .htaccess vào out/ sau khi build
├── .github/workflows/              # Tự động deploy
└── out/                            # ← Kết quả build (không commit lên git)
```

---

## 6. Nâng cấp về sau

### Nâng cấp form liên hệ (gửi thẳng vào email, không cần backend)

Hiện tại form ở trang Liên hệ mở sẵn ứng dụng email của khách. Muốn nhận thẳng
vào hộp thư:

1. Đăng ký miễn phí tại [Web3Forms](https://web3forms.com) hoặc
   [Formspree](https://formspree.io) → lấy một đường dẫn endpoint
2. Mở `src/components/contact-form.tsx`, thay phần `window.location.href = ...`
   bằng một lệnh `fetch(POST)` tới endpoint đó

### Thêm thanh toán online (VNPay / MoMo)

Cổng thanh toán cần máy chủ để xác thực chữ ký giao dịch — **không làm được
trên trang tĩnh**. Cần nâng cấp lên VPS Hostinger, rồi:

1. Bỏ dòng `output: "export"` trong `next.config.ts`
2. Viết API route trong `src/app/api/` để tạo và xác thực giao dịch
3. Chạy bằng PM2 + Nginx reverse proxy trên VPS

### Thêm trang quản trị sản phẩm

Cũng cần máy chủ + cơ sở dữ liệu. Hướng đơn giản nhất là dùng CMS dạng
headless miễn phí (Sanity, Contentful) — giữ nguyên trang tĩnh, chỉ cần
build lại mỗi khi sửa nội dung.

---

## Ghi chú kỹ thuật

- **Giỏ hàng** lưu trong `localStorage` của trình duyệt, đồng bộ giữa nhiều tab,
  và tự tính lại giá theo `products.ts` — nên khi bạn đổi giá, giỏ hàng cũ của
  khách cũng cập nhật, không bị kẹt giá cũ.
- **Tìm kiếm** chạy hoàn toàn phía trình duyệt, bỏ dấu tiếng Việt (gõ "ban phim"
  vẫn ra "bàn phím"), điều hướng được bằng phím ↑ ↓ Enter Esc.
- **Chế độ sáng/tối** ghi nhớ lựa chọn, mặc định theo cài đặt hệ điều hành, và
  không bị nháy trắng khi tải trang.
- **Khả năng tiếp cận**: tương phản chữ đạt WCAG AA ở cả hai chế độ, mọi thao
  tác làm được bằng bàn phím, vùng bấm tối thiểu 44px, tôn trọng cài đặt "giảm
  chuyển động" của hệ điều hành.
- **SEO**: mỗi trang có tiêu đề/mô tả riêng, có `sitemap.xml`, `robots.txt` và
  dữ liệu có cấu trúc (JSON-LD) để Google hiện giá + sao trên kết quả tìm kiếm.
