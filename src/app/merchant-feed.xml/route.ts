import { formatGia } from "@/lib/format";
import {
  conHang,
  HANG_TRONG,
  type Product,
  products,
  tieuDeSanPham,
} from "@/lib/products";
import { anhDayDu, site } from "@/lib/site";

export const dynamic = "force-static";

function thoatXml(chuoi: string): string {
  return chuoi
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/*
 * Lấy ảnh gốc .webp của sản phẩm, không dùng ảnh chia-se.jpg.
 * Google Merchant Center từ chối ảnh có chèn chữ, giá hoặc khung trang trí.
 */
function layAnhSanPham(p: Product): string[] {
  const ds = p.phanLoai
    ? [
        ...new Set(
          p.phanLoai.flatMap((v) => v.anhs ?? (v.anh ? [v.anh] : [])),
        ),
      ]
    : (p.anhs ?? (p.anh ? [p.anh] : []));
  return ds.map(anhDayDu);
}

/*
 * Mô tả khớp với trường description trong JSON-LD trên trang sản phẩm để
 * Google đối chiếu trang đích không báo lệch thông tin.
 */
function moTaSanPham(p: Product): string {
  return [
    p.moTa,
    p.note,
    `${p.hang} ${p.ten}${p.tinhTrang ? `, tình trạng: ${p.tinhTrang}` : ""}. Giá ${formatGia(p)}, hàng ở ${p.diaDiem}. Cho test trước khi trả tiền, ship COD toàn quốc.`,
  ]
    .filter(Boolean)
    .map((s) => String(s).replace(/\s+/g, " ").trim())
    .join(" ");
}

/**
 * /merchant-feed.xml - nguồn cấp sản phẩm chuẩn RSS 2.0 cho Google Merchant Center.
 *
 * Sinh từ cùng dữ liệu với web lúc build: chỉ xuất các món còn hàng, có giá
 * và đã có ảnh thật. Khi món bán hết và rút khỏi Sheet thì tự rời khỏi tệp,
 * tránh hiện hàng đã bán trên lưới Google Shopping.
 */
export function GET() {
  const dsMon = products
    .map((p) => ({ p, anh: layAnhSanPham(p) }))
    .filter(({ p, anh }) => conHang(p) && p.gia > 0 && anh.length > 0);

  const cacMuc = dsMon
    .map(({ p, anh }) => {
      const [anhChinh, ...anhPhu] = anh;
      const tinhTrang = p.nhomTinhTrang === "moi" ? "new" : "used";
      const coHang = Boolean(p.hang && p.hang !== HANG_TRONG);

      const dong = [
        `      <g:id>${thoatXml(p.id)}</g:id>`,
        `      <g:title>${thoatXml(tieuDeSanPham(p))}</g:title>`,
        `      <g:description>${thoatXml(moTaSanPham(p))}</g:description>`,
        `      <g:link>${thoatXml(`${site.url}/san-pham/${p.slug}/`)}</g:link>`,
        `      <g:image_link>${thoatXml(anhChinh)}</g:image_link>`,
        ...anhPhu
          .slice(0, 10)
          .map(
            (u) =>
              `      <g:additional_image_link>${thoatXml(u)}</g:additional_image_link>`,
          ),
        `      <g:condition>${tinhTrang}</g:condition>`,
        `      <g:availability>in_stock</g:availability>`,
        `      <g:price>${Math.round(p.gia)} VND</g:price>`,
        ...(coHang ? [`      <g:brand>${thoatXml(p.hang)}</g:brand>`] : []),
        `      <g:identifier_exists>no</g:identifier_exists>`,
      ];

      return `    <item>\n${dong.join("\n")}\n    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${thoatXml(site.name)}</title>
    <link>${thoatXml(`${site.url}/`)}</link>
    <description>${thoatXml(site.description)}</description>
${cacMuc}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
