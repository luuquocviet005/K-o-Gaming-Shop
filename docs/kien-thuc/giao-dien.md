# Giao diện web

- Thông tin shop (SĐT, địa chỉ, link, STK, quy tắc ship, backend chatbot): chỉ
  ở `src/lib/site.ts`. Lint chặn viết cứng ở chỗ khác.
- Tên shop là "Kẹo Gaming Gear" (`site.name`), trùng tên miền và hồ sơ Google
  Business. Tên cũ "Kẹo Gaming Shop" chỉ còn ở `alternateName` (JSON-LD Store
  trong `khung-trang.tsx`) và từ khoá. Viết tên shop trong code thì dùng
  `site.name`, đừng gõ cứng.
- Màu thương hiệu: nguồn duy nhất `src/app/globals.css`; script sinh ảnh đọc
  qua `scripts/lib/mau.mjs`.
- Ảnh chia sẻ link (Zalo/Facebook): `ANH_CHIA_SE` trong `site.ts`, sinh bằng
  `scripts/tao-anh-bia.mjs`. Đổi ảnh thì TĂNG SỐ trong tên file — Facebook nhớ
  ảnh theo đường dẫn.
- Ảnh sản phẩm mang `?v=<băm nội dung>` (sync-sheet gắn, xem bang-hang-sheet.md).
  `_nho.webp` (`banThuNho`) và `chia-se.jpg` (`anhChiaSeSanPham`) mượn ?v của
  ảnh bìa. Tự ghép đường dẫn ảnh ở chỗ khác thì giữ nguyên phần ?v, không thì
  khách lại thấy ảnh cũ sau khi thay ảnh.
- Món đã bán vẫn có trang ("đã bán" + gợi ý món tương tự), link cũ không 404.
- Trang 404 khai `metadata` ở `src/app/global-not-found.tsx`.

## Nút nổi
- Di động: MỘT nút tròn 🍬, bấm bung Chat AI / Zalo / Messenger ("Hỏi về món
  này" trên trang sản phẩm, đặt sát ngón tay vì chủ shop rep Messenger nhanh
  nhất). Đừng thêm nút nổi riêng — nhiều nút chồng nhau che nút "Thêm vào giỏ".
- Máy tính: nút "Chat tư vấn Kẹo AI".

## Liên hệ và đánh giá
- `DoLienHe` đếm lượt bấm nút liên hệ (GA4) bằng một bộ lắng nghe ở cấp trang —
  nút mới tự được đếm.
- `site.contact.reviewUrl` mở thẳng khung chấm sao Google Maps; placeid suy ra
  từ `mapUrl` — đổi ghim thì lấy lại cả hai. Có ở chân trang và `/lien-he`.

## Trang sản phẩm và giỏ hàng (khách ở tỉnh là đông nhất)
- Dưới nút mua: link "Ở xa? Nhắn xin video món này" (chép sẵn câu hỏi kèm link
  món rồi mở Messenger) và 3 dòng ship COD / bảo hành 1 tháng / hoàn tiền 3
  ngày, thêm dòng "N món đã tới tay khách" (N = số dòng `da-ban.json`, tự tăng).
  Số cọc COD lấy từ `site.shipping`.
- Nút phụ "Nhắn chốt món này" chép sẵn câu chốt (tên, số lượng, giá, link) rồi
  mở Messenger, không qua giỏ; nút "Thêm vào giỏ" vẫn để khách gom nhiều món.
- Ô số lượng chỉ hiện khi món còn từ 2 chiếc trở lên.
- Giỏ hàng: bấm "Đặt hàng qua Messenger/Zalo" là tự chép nội dung đơn trước,
  vì m.me và zalo.me không cho điền sẵn tin nhắn. Đơn dưới mức freeship có
  thanh "thêm X nữa là được freeship khi chuyển khoản đủ".

## Danh mục
- Góc ảnh thẻ sản phẩm: trái là loại hàng (`tenDanhMuc` = cột "Loại" trong
  Sheet, trống thì `short` của danh mục chính; gắn trong `toCard`), phải là tình trạng. Nhiều món tên chỉ là
  mã/tên riêng ("Crimson", "X83") nên khách không biết đó là pad hay phím —
  đừng bỏ nhãn loại. Shop chỉ bán ở Đà Nẵng nên thẻ không ghi địa điểm và
  trang danh sách không có bộ lọc địa điểm.
- Chuột, bàn phím, tai nghe, pad chuột, phụ kiện. Hình vẽ/icon switch, ghế, tay
  cầm, màn hình vẫn giữ trong kho hình dùng chung dù chưa dùng.

## Trang theo hãng (`/hang/<slug>/`)
- Sinh từ `tatCaTrangHang()` trong `src/lib/products.ts`, không viết tay. Slug
  bằng `slugHang()` nên "AttackShark" và "Attackshark" về chung một trang.
- Hãng có trang khi (còn hàng + đã bán) ≥ 2. Chỉ hãng có ≥ `NGUONG_TRANG_HANG`
  (2) món CÒN HÀNG mới được index, vào sitemap, hiện ở dòng "Mua theo hãng"
  trên `/danh-muc/` và được gắn link từ tên hãng trên trang sản phẩm. Dưới
  ngưỡng thì trang vẫn sống (link cũ, Google đã lập chỉ mục) nhưng `noindex`
  và gợi ý món khác. Đừng xoá trang hãng khi hết hàng: thành 404 là mất điểm.
- Tiêu đề ghép 2 loại hàng đông nhất của hãng ("Bàn phím, chuột ATK cũ và mới
  tại Đà Nẵng"), tự bớt loại cho vừa ≤ 52 ký tự.
- Chưa có trang ghép hãng + loại (`/hang/atk/chuot/`): chỉ thêm khi Search
  Console cho thấy khách tìm nhiều cụm kiểu đó.

## Ảnh sản phẩm (`thu-vien-anh.tsx`)
- Khung phóng to có bảng chỉnh mức (1x tới 5x): thanh trượt, nút +/-, nút về
  vừa khung; thêm con lăn chuột, chụm hai ngón, bấm vào chỗ muốn soi (2.5x),
  kéo để di ảnh, phím + / - / 0. Không đặt sẵn vài mức cố định: khách cần tự
  soi vết trầy của hàng cũ.
- Vuốt ngang chỉ chuyển ảnh khi ảnh đang ở cỡ vừa khung; đang phóng thì vuốt
  là kéo ảnh. Đổi ảnh hoặc đóng khung thì mức phóng về 1x.

## Tiêu đề và mô tả cho Google (SEO)

- Tiêu đề trang sản phẩm do `tieuDeSanPham()` trong `src/lib/products.ts` ghép:
  loại hàng + hãng + tên + "mới"/"cũ" (vd "Chuột Logitech Superlight 2 cũ"),
  vì khách tìm đúng kiểu đó. Phần này ≤ 52 ký tự để cả câu kèm
  " | Kẹo Gaming Gear" ≤ 70 (`scripts/audit.mjs` chặn); dài quá thì tự bỏ dần
  loại hàng rồi tình trạng. Phụ kiện không có chữ loại hàng đứng đầu.
- Tiêu đề danh mục: "<tên danh mục> cũ và mới tại Đà Nẵng".
- Dưới tiêu đề danh mục có đoạn giới thiệu `gioiThieuDanhMuc()` ghép từ hàng
  đang bán (số món, hãng nhiều nhất, khoảng giá, ship COD toàn quốc), tự đúng
  khi Sheet đổi. Đừng thay bằng chữ viết tay có con số cố định.
- `description` trong JSON-LD Product luôn có một câu ghép từ dữ liệu thật
  (tình trạng, giá, nơi có hàng) vì đa số món để trống Mô tả/Ghi chú.
- KHÔNG khai `shippingDetails` (phí ship tỉnh tính theo thực tế, không có con
  số cố định) và KHÔNG khai `hasMerchantReturnPolicy` (shop chỉ hoàn khi sai mô
  tả, không nhận đổi ý, schema không tả đúng được) - khai sai là vi phạm chính
  sách mua sắm của Google.

## Tóm tắt cho AI đọc (`/llms.txt`)

- `src/app/llms.txt/route.ts` sinh `/llms.txt` (chuẩn llmstxt.org) lúc build
  từ cùng dữ liệu với web: thông tin cửa hàng, chính sách, danh mục, toàn bộ
  hàng đang bán kèm giá và tình trạng. ChatGPT, Perplexity đọc file này để giới
  thiệu shop.
- Chỉ ghi điều có thật trên web. Đổi chính sách ở `/chinh-sach` thì sửa luôn
  mục Chính sách trong file này, kẻo AI trả lời khách theo chính sách cũ.
- Tự đặt `Content-Type: text/plain; charset=utf-8`: thiếu charset thì chữ có
  dấu thành ký tự rác.

## Nguồn cấp sản phẩm Google Merchant Center (`/merchant-feed.xml`)

- `src/app/merchant-feed.xml/route.ts` sinh tệp XML chuẩn RSS 2.0 lúc build cho
  Google Merchant Center đọc định kỳ.
- Chỉ xuất món còn hàng (`soLuong > 0`), có giá (`gia > 0`) và đã có ảnh gốc
  `.webp`. Không dùng ảnh `chia-se.jpg` vì Google cấm ảnh chèn chữ/giá.
- Giá, tình trạng (`new`/`used`) và mô tả khớp với JSON-LD trên trang sản phẩm;
  `g:identifier_exists` đặt `no` vì bảng hàng không có mã vạch GTIN.

## Chữ trang danh mục
- Meta description và khối tư vấn dưới lưới của 5 danh mục nằm ở `src/lib/tu-van-danh-muc.ts` (khóa theo slug). Chỉ ghi điều chủ shop đã chốt, không ghi thông số kỹ thuật.
- H1 trang sản phẩm và alt ảnh thẻ dùng `tieuDeSanPham()` (loại + hãng + tên + tình trạng) cho khớp title.
