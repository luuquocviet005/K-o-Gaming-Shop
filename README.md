# KẸO GAMING SHOP

Website bán gaming gear — Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript.
Web thật (https://keogaminggear.com) do **Hostinger tự kéo code từ nhánh `main`
về và build**, chạy ở chế độ máy chủ. Trên máy, `npm run build` vẫn xuất ra
thư mục `out/` để kiểm tra, nhưng `out/` không phải thứ được đưa lên web.
Chi tiết ở [`docs/kien-thuc/deploy-va-kiem-tra.md`](docs/kien-thuc/deploy-va-kiem-tra.md).

---

## Mục lục

1. [Chạy trên máy](#1-chạy-trên-máy)
2. [Đổi nội dung của shop](#2-đổi-nội-dung-của-shop)
3. [Đưa code lên GitHub](#3-đưa-code-lên-github)
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
> Không cần build hay upload gì lên Hostinger bằng tay: Hostinger tự build mỗi
> khi `main` có code mới (xem mục 4).

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
| `npm run build` | Build thử trên máy, xuất ra `out/` (để kiểm tra, không upload) |
| `npm run preview` | Chạy thử thư mục `out/` tại http://localhost:4000 |
| `npm run check` | Quét link chết + kiểm tra SEO + tương phản màu |
| `npm run push` | Kiểm tra hết → commit → đẩy thẳng `main` → Hostinger tự deploy. Chỉ chủ shop và lượt nạp ảnh dùng; AI làm qua PR (xem `AGENTS.md`) |
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
| **Tự động** (khuyến nghị) | Chạy `Bat tu dong 15 phut.bat` **một lần duy nhất**. Từ đó chỉ cần bỏ ảnh vào thư mục, vài phút sau là web tự cập nhật (5 phút kiểm tra một lần, máy tắt thì bật lên chạy bù ngay). Muốn dừng: `Tat tu dong.bat`. |
| **Thủ công** | Kéo thả thư mục ảnh vào `Tai anh len web.bat`. |

Ở chế độ tự động, mọi file `.zip` trong thư mục ảnh (ví dụ tải từ Google Drive về)
được **giải nén rồi xoá** ngay đầu mỗi lượt: `Bàn phím/Akko M1 V5 HE.zip` thành
thư mục `Bàn phím/Akko M1 V5 HE/`. Zip nằm trong thư mục của một món thì ảnh đổ
thẳng vào thư mục đó. Không bao giờ ghi đè ảnh có sẵn; zip hỏng thì giữ nguyên và
ghi vào `BAO CAO.txt`. Muốn giải nén ngay khỏi chờ 5 phút: `Giai nen zip ngay.bat`.

Sản phẩm chưa có ảnh thật thì website tự vẽ hình minh hoạ vector theo danh mục —
không bao giờ bị vỡ layout.

### Màu sắc / giao diện

Toàn bộ màu nằm trong [`src/app/globals.css`](src/app/globals.css), phần
`:root` (chế độ sáng) và `[data-theme="dark"]` (chế độ tối). Đổi biến ở đó là
cả website đổi theo — không cần sửa từng component.

> ⚠️ Nếu đổi màu `--primary`, giữ nó đủ đậm để chữ trắng đè lên vẫn đọc được
> (tối thiểu tỉ lệ tương phản 4.5:1). Bản hiện tại đạt 5.02:1.

---

## 3. Đưa code lên GitHub

Repo: https://github.com/luuquocviet005/K-o-Gaming-Shop (nhánh chính `main`).

- **Chủ shop / máy shop:** `npm run push` tự kiểm tra hết rồi đẩy thẳng `main`.
  Lượt nạp ảnh tự động cũng đẩy theo cách này.
- **AI (Claude Code, Javis OS, Antigravity):** không đẩy thẳng `main`. Làm trên
  nhánh riêng, mở Pull Request, chờ workflow "Kiểm tra PR" xanh rồi mới merge.
  Luật đầy đủ ở [`AGENTS.md`](AGENTS.md).

---

## 4. Deploy lên Hostinger

**Không cần làm gì bằng tay.** `main` có code mới là Hostinger tự kéo về, tự
build và chạy web ở chế độ máy chủ. Không upload thư mục `out/`, không dùng FTP.

- Mỗi PR có một bản xem thử trên Hostinger (hostinger[bot] comment link vào PR).
- Kiểm tra web đã nhận bản mới: mở trang vừa sửa bằng tab mới. Bản đẩy bằng
  `npm run push` thì đối chiếu thêm `https://keogaminggear.com/version.txt`.
- Hostinger có lúc không build lại sau khi merge. Web vẫn cũ thì vào hPanel bấm
  deploy lại.
- Ở chế độ máy chủ không có Apache, nên `deploy/.htaccess` và bản vá HTML sau
  build (`postbuild.mjs`) không tới được web thật. Header và cache khai trong
  `next.config.ts`.
- HTTPS do Hostinger tự chuyển http sang https, không cần sửa `.htaccess`.

### Dự phòng: workflow FTP

`.github/workflows/deploy-hostinger.yml` (đẩy `out/` qua FTP) cố ý **tắt**, chỉ
chạy tay ở tab Actions. Muốn bật tự động thì làm theo hướng dẫn ở đầu file đó,
và phải tắt deploy tự động của Hostinger để hai bên không cùng ghi vào web.

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
│       ├── products.ts             # Đọc dữ liệu sản phẩm từ src/data/
│       └── cart.tsx                # Logic giỏ hàng (localStorage)
├── public/                         # Ảnh, file tĩnh
├── deploy/.htaccess                # Cấu hình Apache cho Hostinger
├── scripts/postbuild.mjs           # Copy .htaccess vào out/ sau khi build
├── .github/workflows/              # Kiểm tra PR, đồng bộ Sheet, FTP dự phòng
└── out/                            # ← Build thử trên máy (không commit, không upload)
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
