# Product

<!-- impeccable:product-schema 1 -->

> Nguồn: `.agents/product-marketing.md` (v2, chủ shop xác nhận 2026-11-03) và prompt làm lại giao diện ngày 2026-11-09. Chưa phỏng vấn lại trực tiếp trong phiên này; mục nào suy ra từ hai nguồn đó được đánh dấu (suy ra).

## Platform

web

## Users

Học sinh, sinh viên chơi game, tiền có hạn, muốn gear tốt hơn mà không trả giá mới. Người đi làm có nhưng rất ít. Đa số đơn là ship COD đi các tỉnh; khách Đà Nẵng vào xem rồi hẹn qua test trực tiếp. Họ mở bằng điện thoại, mở đầu bằng hai câu "món này còn không ạ" và "tình trạng sao ạ", và sợ nhất là mua về mới thấy lỗi.

## Product Purpose

Tiệm gaming gear cũ và mới ở Đà Nẵng: chuột, bàn phím, tai nghe, lót chuột, phụ kiện. Web là chỗ khách xem đúng tình trạng từng món rồi chốt qua Messenger, Zalo hoặc khung chat AI. Thành công là khách nhắn chốt hoặc hẹn test, và quay lại mua lần sau.

## Positioning

Nói đúng tình trạng (trầy chỗ nào, thiếu gì, ghi thẳng lên trang), cho test trước khi trả tiền, bảo hành 1 tháng mọi món, shop chịu ship bảo hành hai chiều, sai mô tả hoàn tiền trong 3 ngày. Slogan: "Gear ngon, giá thật."

## Operating Context

- Web tĩnh Next.js 16, Tailwind 4, xuất tĩnh, chạy trên Hostinger. Hàng hoá sinh từ Google Sheet, không sửa tay.
- Thông tin liên hệ, ship, tài khoản chỉ nằm ở `src/lib/site.ts`.
- Khách chốt qua Messenger (ưu tiên), Zalo, khung chat AI; giỏ hàng chép nội dung đơn rồi mở Messenger/Zalo.
- Có bot nạp ảnh tự động 15 phút, nên mọi thay đổi làm trong worktree riêng, không đụng thư mục chính.

## Capabilities and Constraints

- Không đổi dữ liệu, giá, URL, nội dung chính sách, luồng nhắn chốt món.
- Giữ `sitemap.xml`, `robots.txt`, `llms.txt`, `merchant-feed.xml`, JSON-LD, meta.
- Giữ chế độ sáng và tối; tương phản đạt WCAG AA (`npm run contrast`).
- Không thêm thư viện giao diện lớn; hiệu ứng ưu tiên CSS; tôn trọng `prefers-reduced-motion`.
- Câu chữ hiển thị cho khách chỉ đổi khi soạn nháp cho chủ shop duyệt trước.
- Repo Public: không đưa thông tin riêng tư vào code.
- Nhãn tình trạng đang dùng: Mới nguyên seal, Mới, Cũ đủ hộp, Cũ không hộp.

## Brand Commitments

- Tên: Kẹo Gaming Gear. Giữ nguyên logo và mascot (`design/logo/`, `public/mascot.png`), không vẽ lại.
- Giọng: thẳng thắn, thân như người quen ("tụi mình", "bạn"), ngắn, hứa ít giữ lời.
- Tránh: "cam kết 100%", "như mới" khi có trầy, "rẻ nhất", câu quảng cáo kiểu AI.
- Chủ shop muốn trông như shop có người thật đứng sau, không giống web do AI làm ra (suy ra từ prompt 2026-11-09).

## Evidence on Hand

- 69 món lúc soạn (41 cũ, 26 mới, 2 khác), 48 món đã bán (`src/data/da-ban.json`).
- Ảnh sản phẩm thật, video shop quay cho khách ở xa.
- Chưa có: đánh giá Google Maps, lời khen của khách, số đơn. Không được bịa.

## Product Principles

1. Tình trạng thật lên trước, trang trí xuống sau.
2. Điện thoại là màn hình chính; ngón cái với tới nút nhắn chốt.
3. Trả lời sẵn "còn không" và "tình trạng sao" ngay trên thẻ và trang sản phẩm.
4. Cá tính của tiệm đến từ chi tiết thật của nghề bán gear cũ, không đến từ khuôn mẫu web.
5. Hứa ít, giữ lời: giao diện không được hứa hơn chính sách.

## Accessibility & Inclusion

WCAG AA, tương phản kiểm bằng `npm run contrast`. Chữ tối thiểu 12px. Font phải đủ dấu tiếng Việt. Có nút dừng cho chuyển động tự chạy và tôn trọng giảm chuyển động.
