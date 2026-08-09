import type { Metadata } from "next";
import { site } from "@/lib/site";
import { formatVND } from "@/lib/format";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Chính sách",
  description:
    "Chính sách bảo hành, đổi trả, vận chuyển và bảo mật thông tin của KẸO GAMING SHOP.",
};

const sections = [
  {
    id: "bao-hanh",
    title: "Chính sách bảo hành",
    body: [
      "Toàn bộ sản phẩm tại KẸO GAMING SHOP là hàng chính hãng, có tem bảo hành và hoá đơn VAT. Thời gian bảo hành cụ thể được ghi trong phần Thông số kỹ thuật của từng sản phẩm (thường 12 – 36 tháng).",
      "Bảo hành được thực hiện tại cửa hàng — bạn không phải tự gửi về hãng. Với sản phẩm cần thời gian xử lý trên 7 ngày, chúng tôi cho mượn thiết bị tương đương để bạn dùng tạm.",
      "Không áp dụng bảo hành với các trường hợp: rơi vỡ, vào nước, cháy nổ do nguồn điện, tự ý tháo máy làm mất tem, hoặc hao mòn tự nhiên (mòn chân chuột, bong keycap, xẹp đệm tai nghe).",
    ],
  },
  {
    id: "doi-tra",
    title: "Chính sách đổi trả",
    body: [
      "Đổi mới trong 7 ngày kể từ ngày nhận hàng nếu sản phẩm có lỗi từ nhà sản xuất — không cần giải thích lý do, không mất phí.",
      "Đổi sang sản phẩm khác trong 3 ngày nếu bạn đổi ý, với điều kiện sản phẩm còn nguyên hộp, đầy đủ phụ kiện và chưa có dấu hiệu sử dụng. Chênh lệch giá được bù trừ trực tiếp.",
      "Sản phẩm thuộc nhóm vệ sinh cá nhân (đệm tai nghe rời, tai nghe in-ear) không áp dụng đổi trả sau khi đã bóc niêm phong.",
    ],
  },
  {
    id: "van-chuyen",
    title: "Chính sách vận chuyển",
    body: [
      `Miễn phí vận chuyển toàn quốc cho đơn hàng từ ${formatVND(site.shipping.freeThreshold)}. Đơn nhỏ hơn áp dụng phí cố định ${formatVND(site.shipping.fee)}.`,
      "Nội thành TP. Hồ Chí Minh và Hà Nội: giao trong 2 giờ với đơn đặt trước 17h. Các tỉnh thành khác: 1 – 3 ngày làm việc.",
      "Ghế gaming và màn hình được đóng thùng gỗ hoặc bọc xốp nhiều lớp. Riêng ghế gaming khu vực nội thành có hỗ trợ lắp đặt tại nhà miễn phí.",
      "Bạn được kiểm tra hàng trước khi thanh toán. Nếu thùng hàng móp, ướt hoặc rách niêm phong, hãy từ chối nhận và báo lại cho chúng tôi.",
    ],
  },
  {
    id: "bao-mat",
    title: "Bảo mật thông tin",
    body: [
      "Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng: họ tên, số điện thoại, địa chỉ giao hàng.",
      "Thông tin của bạn không được bán, cho thuê hay chia sẻ với bên thứ ba, ngoại trừ đơn vị vận chuyển để giao hàng cho bạn.",
      "Giỏ hàng trên website được lưu ngay trong trình duyệt của bạn (localStorage) và không được gửi về máy chủ nào cả. Xoá dữ liệu duyệt web sẽ xoá luôn giỏ hàng.",
      `Muốn xoá thông tin của mình khỏi hệ thống? Gửi yêu cầu tới ${site.contact.email}, chúng tôi xử lý trong 3 ngày làm việc.`,
    ],
  },
];

export default function PolicyPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Chính sách" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          Chính sách mua hàng
        </h1>
        <p className="mt-3 text-fg-muted">
          Viết ngắn gọn, không cài chữ nhỏ. Có gì chưa rõ, cứ gọi{" "}
          <a
            href={site.contact.phoneHref}
            className="font-semibold text-primary-ink underline underline-offset-2"
          >
            {site.contact.phone}
          </a>
          .
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <nav aria-label="Mục lục chính sách" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-primary-ink lg:w-full"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-28 rounded-[1.75rem] border border-border bg-surface p-7 sm:p-9"
            >
              <h2 className="font-display text-xl font-extrabold text-fg">
                {s.title}
              </h2>
              <div className="mt-4 space-y-3.5">
                {s.body.map((p) => (
                  <p key={p} className="text-[0.95rem] leading-[1.75] text-fg-muted">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
