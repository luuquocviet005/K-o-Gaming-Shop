import Link from "next/link";
import {
  categories,
  hangDocNhat,
  hangMoi,
  hangNoiBat,
  products,
  tatCaDiaDiem,
  tatCaHang,
  toCard,
} from "@/lib/products";
import { formatGia } from "@/lib/format";
import { site } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-art";
import { ConditionBadge } from "@/components/condition-badge";
import { RacKeo } from "@/components/rac-keo";
import { BangChuyen } from "@/components/bang-chuyen";
import {
  ArrowRightIcon,
  CategoryIcon,
  CheckIcon,
  MapPinIcon,
  PhoneIcon,
  SparkIcon,
} from "@/components/icons";

const hero = hangNoiBat(1)[0];

/**
 * Nhịp trang là thứ chống đơn điệu, không phải hoạ tiết.
 *
 * Trang chạy theo bốn tầng nền xen kẽ — nền trang, nền thẻ, dải hồng phấn,
 * dải tối — nên cuộn xuống mắt luôn thấy có chuyện xảy ra, thay vì một nền
 * duy nhất kéo từ đầu tới cuối.
 */
const camKet = [
  { title: "Nói đúng tình trạng", text: "Trầy chỗ nào, thiếu gì, ghi thẳng lên trang" },
  { title: "Test trước khi trả tiền", text: "Gặp trực tiếp, dùng thử ưng mới lấy" },
  { title: "Hàng có sẵn trong tay", text: "Không đặt trước, không ôm cọc" },
  { title: "Sai mô tả thì chịu", text: "Hoàn tiền trong 3 ngày" },
];

export default function HomePage() {
  const noiBat = hangNoiBat(8);
  const moi = hangMoi(4);
  const docNhat = hangDocNhat(4);
  const hangs = tatCaHang();
  const diaDiem = tatCaDiaDiem();

  // Danh mục đông hàng nhất được ô lớn trong lưới bento
  const [dauBang, ...conLai] = [...categories].sort((a, b) => b.soLuong - a.soLuong);

  return (
    <>
      {/* ═══════════════ TẦNG 1 · HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/15 blur-3xl"
        />
        <RacKeo className="hidden lg:block" />

        <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:py-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-ink">
              <SparkIcon width={15} height={15} />
              {diaDiem.join(" · ")}
            </span>

            {/* Chữ cỡ lớn, dòng sát nhau — sức nặng thị giác nằm ở đây */}
            <h1 className="mt-5 font-display text-[3.2rem] font-extrabold leading-[0.92] tracking-tight text-fg sm:text-7xl lg:text-[5.2rem]">
              Gear ngon,
              <br />
              <span className="text-primary-ink">giá thật.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
              Phần lớn là hàng đã qua sử dụng. Món nào trầy, thiếu gì, còn bảo
              hành tới bao giờ — ghi rõ trên từng sản phẩm.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/danh-muc/"
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                Xem {products.length} món
                <ArrowRightIcon width={20} height={20} />
              </Link>
              <a
                href={site.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-full border border-border-strong bg-surface px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
              >
                <PhoneIcon width={19} height={19} />
                Nhắn Zalo
              </a>
            </div>
          </div>

          {hero && (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <Link
                href={`/san-pham/${hero.slug}/`}
                className="group block overflow-hidden rounded-[2.25rem] border border-border bg-surface shadow-[0_30px_80px_-40px_rgba(60,20,40,0.55)] transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="relative bg-surface-2 px-7 pb-8 pt-7">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                      Đắt giá nhất tiệm
                    </p>
                    <ConditionBadge
                      tinhTrang={hero.tinhTrang}
                      nhom={hero.nhomTinhTrang}
                    />
                  </div>
                  <div className="mx-auto mt-3 aspect-square w-full max-w-[17rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                    <ProductMedia product={hero} priority sizes="340px" />
                  </div>
                  <div
                    aria-hidden="true"
                    className="rang-cua pointer-events-none absolute inset-x-0 bottom-0 h-3.5"
                  />
                </div>

                <div className="px-7 pb-7 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                    {hero.hang}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-fg">
                    {hero.ten}
                  </h2>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="tem-gia rounded-xl bg-primary-soft px-3 py-1.5 font-display text-2xl font-extrabold text-primary-ink">
                      {formatGia(hero)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
                      <MapPinIcon width={15} height={15} />
                      {hero.diaDiem}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ BĂNG CHUYỀN HÃNG ═══════════════ */}
      <BangChuyen muc={hangs} />

      {/* ═══════════════ TẦNG 2 · DANH MỤC (lưới bento) ═══════════════ */}
      <section className="container-page mt-16 lg:mt-24">
        <SectionHead title="Trong tiệm có gì" subtitle="Bấm vào hũ bạn quan tâm" />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Ô lớn chiếm 2x2 — phá thế lưới đều tăm tắp */}
          <li className="lg:col-span-2 lg:row-span-2">
            <HuKeo danhMuc={dauBang} lon />
          </li>
          {conLai.map((c) => (
            <li key={c.slug} className="lg:col-span-1">
              <HuKeo danhMuc={c} />
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════ TẦNG 3 · HÀNG NỔI BẬT ═══════════════ */}
      <section className="container-page mt-16 lg:mt-24">
        <SectionHead
          title="Đáng chú ý"
          subtitle="Món tốt nhất mỗi nhóm"
          href="/danh-muc/"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {noiBat.map((p, i) => (
            <ProductCard key={p.id} product={toCard(p)} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* ═══════════════ TẦNG 4 · DẢI TỐI (điểm nghỉ mắt) ═══════════════ */}
      <section className="mt-16 bg-dai-dam-nen py-16 text-dai-dam-chu lg:mt-24 lg:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-dai-dam-chu/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              Đọc trước khi mua
            </span>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
              Đây là tiệm
              <br />
              bán đồ cũ.
            </h2>
            <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-dai-dam-mo sm:text-base">
              Giá mềm hơn hàng mới khá nhiều, đổi lại món nào cũng có lịch sử
              riêng. Tụi mình ghi rõ từng món trầy ở đâu, thiếu gì, còn bảo hành
              hãng tới khi nào. Không giấu để bán cho nhanh.
            </p>
            <Link
              href="/chinh-sach/"
              className="mt-8 inline-flex h-14 items-center gap-2.5 rounded-full bg-dai-dam-chu px-8 text-base font-bold text-dai-dam-nen transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Xem chính sách mua bán
              <ArrowRightIcon width={20} height={20} />
            </Link>
          </div>

          <ul className="grid gap-2.5">
            {camKet.map((c) => (
              <li
                key={c.title}
                className="flex items-start gap-3.5 rounded-2xl bg-dai-dam-chu/10 p-4"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-dai-dam-chu text-dai-dam-nen">
                  <CheckIcon width={16} height={16} />
                </span>
                <span>
                  <span className="block text-sm font-bold">{c.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-dai-dam-mo">
                    {c.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════ TẦNG 5 · HÀNG MỚI ═══════════════ */}
      {moi.length > 0 && (
        <section className="container-page mt-16 lg:mt-24">
          <SectionHead
            title="Chưa qua sử dụng"
            subtitle="Nguyên seal hoặc mới bóc, chưa dùng"
          />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {moi.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ TẦNG 6 · CHỈ CÒN MỘT ═══════════════ */}
      {docNhat.length > 0 && (
        <section className="mt-16 bg-primary-soft py-14 lg:mt-24 lg:py-16">
          <div className="container-page">
            <SectionHead
              title="Chỉ còn một chiếc"
              subtitle="Bán rồi là hết, không có con thứ hai"
            />
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {docNhat.map((p) => (
                <ProductCard key={p.id} product={toCard(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ TẦNG 7 · CTA ═══════════════ */}
      <section className="container-page mt-16 lg:mt-24">
        <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-surface p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
              Chưa thấy món cần?
              <br />
              Nhắn tụi mình.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
              Bảng hàng đổi liên tục, có món về rồi chưa kịp lên web. Nói tên
              món và tầm giá, có hàng tụi mình báo ngay.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                <PhoneIcon width={20} height={20} />
                Gọi {site.contact.phone}
              </a>
              <Link
                href="/lien-he/"
                className="inline-flex h-14 items-center rounded-full border border-border-strong bg-bg px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
              >
                Cách liên hệ khác
              </Link>
            </div>
          </div>

          <ul className="grid gap-3">
            {[
              `Hàng ở ${diaDiem.join(" và ")} — hẹn gặp test trực tiếp`,
              "Nhận tìm hộ món cụ thể theo yêu cầu",
              "Thu lại gear cũ của bạn nếu còn dùng được",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-3 rounded-2xl bg-surface-2 p-4 text-sm font-medium text-fg"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                  <CheckIcon width={16} height={16} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/** Thẻ danh mục tạo hình hũ kẹo — ô lớn hiện thêm mô tả */
function HuKeo({
  danhMuc,
  lon = false,
}: {
  danhMuc: (typeof categories)[number];
  lon?: boolean;
}) {
  return (
    <Link
      href={`/danh-muc/${danhMuc.slug}/`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 pt-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_-24px_rgba(60,20,40,0.45)] ${
        lon ? "justify-end gap-4 lg:p-8 lg:pt-10" : "items-center gap-3 text-center"
      }`}
    >
      <span
        aria-hidden="true"
        className="nap-hu absolute inset-x-0 top-0 h-2.5 bg-primary-soft"
      />

      <span
        className={`grid place-items-center rounded-full bg-primary-soft text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary ${
          lon ? "size-20" : "size-14"
        }`}
      >
        <CategoryIcon khoa={danhMuc.icon} width={lon ? 38 : 26} height={lon ? 38 : 26} />
      </span>

      <span className={lon ? "" : "contents"}>
        <span
          className={`block font-bold leading-tight text-fg ${
            lon ? "font-display text-2xl lg:text-3xl" : "text-sm"
          }`}
        >
          {lon ? danhMuc.name : danhMuc.short}
        </span>

        {lon && (
          <span className="mt-2 block max-w-sm text-sm leading-relaxed text-fg-muted">
            {danhMuc.blurb}
          </span>
        )}

        <span
          className={`text-xs text-fg-subtle ${lon ? "mt-3 block" : "-mt-1.5 block"}`}
        >
          {danhMuc.soLuong} món
        </span>
      </span>
    </Link>
  );
}

function SectionHead({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        <span aria-hidden="true" className="gach-keo mt-2.5 block h-1.5 w-16 rounded-full" />
        {subtitle && <p className="mt-2.5 text-sm opacity-70 sm:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-fg transition-colors duration-200 hover:border-primary hover:text-primary-ink"
        >
          Xem tất cả
          <ArrowRightIcon width={17} height={17} />
        </Link>
      )}
    </div>
  );
}
