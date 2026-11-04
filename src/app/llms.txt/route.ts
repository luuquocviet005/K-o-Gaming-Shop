import { formatGia, formatVND } from "@/lib/format";
import { categories, conHang, products, soldProducts, tieuDeSanPham } from "@/lib/products";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — bản tóm tắt shop cho ChatGPT, Perplexity, Claude đọc (chuẩn llmstxt.org).
 *
 * Sinh từ cùng dữ liệu với web lúc build, nên hàng về hay bán hết thì file tự
 * đúng theo. Chỉ ghi điều có thật trên web: không thêm lời khen, số sao hay
 * con số nào không đo được, vì AI sẽ trích nguyên văn cho khách.
 */
export function GET() {
  const conBan = products.filter(conHang);
  const dong = (p: (typeof products)[number]) =>
    `- [${tieuDeSanPham(p)}](${site.url}/san-pham/${p.slug}/): ${formatGia(p)}. Tình trạng: ${p.tinhTrang}`;

  const noiDung = `# ${site.name}

> ${site.description}

Tiệm bán gaming gear cũ và mới (chuột, bàn phím, tai nghe, pad chuột, phụ kiện) ở Đà Nẵng, ship COD đi các tỉnh. Mỗi món ghi đúng tình trạng thật trên trang, kể cả trầy xước. Khách ở Đà Nẵng qua test trực tiếp trước khi trả tiền; khách ở tỉnh nhắn để shop quay video đúng món trước khi gửi. Shop không phải đại lý uỷ quyền, không xuất VAT.

## Thông tin cửa hàng

- Địa chỉ: ${site.contact.address} ([Google Maps](${site.contact.mapUrl}))
- Giờ mở cửa: ${site.contact.hours}
- Điện thoại / Zalo: ${site.contact.phone}
- Messenger: ${site.social.messenger}
- Đặt hàng: nhắn Messenger hoặc Zalo, shop xác nhận còn hàng rồi chốt đơn.

## Chính sách

- [Chính sách đầy đủ](${site.url}/chinh-sach/)
- Bảo hành 1 tháng mọi món. Không nhận va đập, vào nước, tự sửa, rách tem shop, hao mòn tự nhiên. Shop chịu phí ship bảo hành cả hai chiều, xử lý thường 3-7 ngày.
- Hàng khác mô tả: nhận lại và hoàn tiền đầy đủ trong 3 ngày kể từ khi nhận.
- Vận chuyển: ${site.shipping.ghiChu} Ship COD cọc trước ${formatVND(site.shipping.cocCod)}.

## Danh mục

${categories.map((c) => `- [${c.name}](${site.url}/danh-muc/${c.slug}/): ${c.soLuong} món`).join("\n")}

## Hàng đang bán (${conBan.length} món)

${conBan.map(dong).join("\n")}

## Optional

- Đã bán ${soldProducts.length} món. [Xem hàng đang có](${site.url}/danh-muc/)
- [Liên hệ](${site.url}/lien-he/)
`;

  return new Response(noiDung, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
