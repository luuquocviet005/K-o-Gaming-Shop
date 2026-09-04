import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Chính sách mua bán",
  description:
    "Cách KẸO GAMING SHOP bán hàng cũ: mô tả tình trạng, cho test trước, đổi trả và bảo hành. Nói rõ làm được gì và không làm được gì.",
  alternates: { canonical: "/chinh-sach/" },
};

/**
 * Nội dung ở đây phải khớp với thứ shop LÀM ĐƯỢC THẬT.
 *
 * Phần lớn hàng là đồ đã qua sử dụng, mua đi bán lại — không có hoá đơn VAT,
 * không có tem bảo hành hãng cho từng món, và không thể "đổi mới không hỏi lý
 * do". Viết những điều đó lên web là hứa hão, khách phát hiện ra thì mất cả
 * đơn lẫn uy tín.
 */
const sections = [
  {
    id: "tinh-trang",
    title: "Cách tụi mình mô tả tình trạng",
    body: [
      "Mỗi món đều có nhãn tình trạng ngay trên ảnh. **Mới, nguyên seal** là chưa bóc hộp. **Mới** là hàng chưa qua sử dụng nhưng có thể đã bóc để kiểm tra. **Cũ · đủ hộp** là hàng đã dùng, còn hộp và phụ kiện. **Cũ · không hộp** là chỉ còn sản phẩm.",
      "Món nào có khuyết điểm, tụi mình ghi thẳng vào phần Tình trạng thực tế — ví dụ trầy chỗ nào, thiếu chi tiết gì, hay bộ phận nào đã thay. Đọc kỹ phần đó trước khi chốt.",
      "Hàng cũ thì mỗi món một tình trạng riêng, không có hai con giống hệt nhau. Ảnh minh hoạ trên web là hình vẽ chung theo nhóm sản phẩm — muốn xem ảnh chụp thật của đúng món đó, nhắn tụi mình gửi.",
    ],
  },
  {
    id: "test-truoc",
    title: "Xem và test trước khi trả tiền",
    body: [
      `Hàng nằm ở Đà Nẵng và Sài Gòn. Bạn ở gần thì hẹn gặp trực tiếp, cắm thử, bấm thử, ưng mới lấy — đây là cách an toàn nhất cho cả hai bên.`,
      "Ở xa thì tụi mình quay video món hàng gửi trước khi đóng gói. Nhận hàng nhớ quay video lúc mở hộp, có gì lệch so với mô tả thì tụi mình xử lý.",
    ],
  },
  {
    id: "doi-tra",
    title: "Đổi trả",
    body: [
      "**Mô tả sai thì tụi mình chịu.** Nếu món hàng khác với những gì ghi trên web — hỏng chức năng không báo trước, trầy nặng hơn mô tả, thiếu phụ kiện đã hứa — nhận lại và hoàn tiền đầy đủ trong 3 ngày kể từ khi bạn nhận hàng.",
      "**Đổi ý thì không.** Hàng cũ mỗi món một cái, bán rồi khó tìm lại người mua tiếp. Nên hãy hỏi kỹ trước khi chốt, tụi mình sẵn sàng trả lời tới lúc bạn chắc chắn.",
      "Không áp dụng đổi trả với hư hỏng phát sinh sau khi bạn nhận hàng: rơi vỡ, vào nước, tự tháo ra sửa.",
    ],
  },
  {
    id: "bao-hanh",
    title: "Bảo hành",
    body: [
      "**Hàng còn bảo hành hãng**: một số món vẫn trong thời hạn bảo hành chính hãng — tụi mình ghi rõ hạn ở phần Tình trạng thực tế của món đó. Bạn mang thẳng ra trung tâm bảo hành của hãng.",
      "**Hàng hết bảo hành hãng**: đa số hàng cũ rơi vào nhóm này. Tụi mình bảo hành lỗi phần cứng trong **1 tháng** kể từ ngày bạn nhận — đủ lâu để dùng thật và phát hiện lỗi ẩn, không chỉ là bật lên thấy chạy.",
      "Mức bảo hành 1 tháng này áp dụng cho **mọi món**, kể cả switch bán lẻ và phụ kiện nhỏ. Món nào hỏng trong thời gian đó thì báo tụi mình đổi hoặc sửa.",
      "Tụi mình không phải đại lý uỷ quyền của hãng nào, nên không cấp được tem bảo hành hãng hay hoá đơn VAT.",
    ],
  },
  {
    id: "van-chuyen",
    title: "Giao hàng",
    body: [
      "**Phí ship tính đúng theo thực tế từng đơn**, tụi mình không cộng thêm đồng nào. Con số cụ thể báo cho bạn trước khi gửi hàng — thà nói trước còn hơn ghi một mức cố định rồi thu khác.",
      "**Nội thành Đà Nẵng**: sắp xếp được thì tụi mình hẹn lịch mang tới tận nơi. Không tiện thì book Grab, cước bao nhiêu bạn trả bấy nhiêu. Hoặc hẹn gặp trực tiếp nếu bạn ở gần.",
      "**Đi tỉnh**: gửi qua nhà xe hoặc đơn vị vận chuyển, khách trả phí. Phí thay đổi theo tỉnh và theo từng nhà xe nên tụi mình không ghi cố định ở đây.",
      "Hàng ở Sài Gòn thì thời gian giao sẽ lâu hơn một chút vì phải chuyển ra — tụi mình báo rõ khi bạn đặt.",
      "Chuột và tai nghe được bọc chống sốc. Bàn phím đóng thùng riêng, chèn xốp kín.",
    ],
  },
  {
    id: "bao-mat",
    title: "Thông tin của bạn",
    body: [
      "Tụi mình chỉ hỏi tên, số điện thoại và địa chỉ khi cần giao hàng. Không thu thập gì thêm.",
      "Không bán, không cho thuê, không chia sẻ thông tin của bạn cho bên thứ ba — trừ đơn vị vận chuyển để giao hàng cho chính bạn.",
      "Giỏ hàng trên web lưu ngay trong trình duyệt của bạn, không gửi về máy chủ nào. Xoá dữ liệu duyệt web là mất giỏ hàng.",
      `Muốn xoá thông tin của mình khỏi tin nhắn của tụi mình? Nhắn tới ${site.contact.email} hoặc Zalo, tụi mình xoá.`,
    ],
  },
];

/** In đậm phần **...** mà không cần thư viện markdown */
function DamPhanNhanManh({ text }: { text: string }) {
  const phan = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {phan.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-fg">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function PolicyPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Chính sách" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          Chính sách mua bán
        </h1>
        <p className="mt-3 text-fg-muted">
          Viết thẳng, không cài chữ nhỏ. Phần lớn hàng ở đây là đồ đã qua sử
          dụng, nên trang này nói rõ tụi mình làm được gì và không làm được gì.
          Có chỗ nào chưa rõ, gọi{" "}
          <a
            href={site.contact.phoneHref}
            className="font-semibold text-primary-ink underline underline-offset-2"
          >
            {site.contact.phone}
          </a>
          .
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <nav
          aria-label="Mục lục chính sách"
          className="lg:sticky lg:top-28 lg:self-start"
        >
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
              <h2 className="font-display text-xl font-extrabold text-fg">{s.title}</h2>
              <div className="mt-4 space-y-3.5">
                {s.body.map((p) => (
                  <p key={p} className="text-[0.95rem] leading-[1.75] text-fg-muted">
                    <DamPhanNhanManh text={p} />
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
