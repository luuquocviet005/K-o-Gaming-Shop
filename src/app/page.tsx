import Link from "next/link";
import type { CSSProperties } from "react";
import {
  categories,
  hangDocNhat,
  hangMoi,
  hangNoiBat,
  products,
  tatCaDiaDiem,
  toCard,
} from "@/lib/products";
import { site } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { BanXap } from "@/components/ban-xap";
import {
  ArrowRightIcon,
  CategoryIcon,
  CheckIcon,
  ZaloIcon,
  FacebookIcon,
} from "@/components/icons";

/** Bốn mảnh giấy note: màu giấy lấy từ bốn "vị kẹo" để đổi theo giao diện sáng/tối */
const camKet = [
  { title: "Nói đúng tình trạng", text: "Trầy chỗ nào, thiếu gì, ghi thẳng lên trang", giay: "bg-vi-caramel-nen text-vi-caramel-chu", goc: "-2deg" },
  { title: "Test trước khi trả tiền", text: "Gặp trực tiếp, dùng thử ưng mới lấy", giay: "bg-vi-bacha-nen text-vi-bacha-chu", goc: "1.5deg" },
  { title: "Hàng có sẵn trong tay", text: "Không đặt trước, không ôm cọc", giay: "bg-surface text-fg", goc: "-1deg" },
  { title: "Sai mô tả thì chịu", text: "Hoàn tiền trong 3 ngày", giay: "bg-vi-nho-nen text-vi-nho-chu", goc: "2deg" },
];

/** Mỗi danh mục một màu giấy bọc; ô to nhất là hồng đậm cho nổi */
const mauHu = [
  "bg-primary text-on-primary",
  "bg-vi-bacha-nen text-vi-bacha-chu",
  "bg-vi-caramel-nen text-vi-caramel-chu",
  "bg-vi-nho-nen text-vi-nho-chu",
  "bg-vi-dau-nen text-vi-dau-chu",
];

export default function HomePage() {
  const ban = hangNoiBat(3);
  const noiBat = hangNoiBat(8);
  const moi = hangMoi(4);
  const docNhat = hangDocNhat(4);
  const diaDiem = tatCaDiaDiem();

  const dsDanhMuc = [...categories].sort((a, b) => b.soLuong - a.soLuong);

  return (
    <>
      {/* ═══════════════ 1 · HERO: BÀN GÓC MÁY ═══════════════ */}
      <section className="relative overflow-hidden border-b-2 border-border-strong">
        <div aria-hidden className="nen-cham pointer-events-none absolute inset-0" />

        <div className="container-page relative grid items-center gap-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div className="animate-rise lg:relative lg:z-30 lg:-mr-16">
            <h1 className="font-display text-[3.25rem] font-extrabold leading-[0.95] tracking-tight text-fg sm:text-7xl lg:text-[5.5rem]">
              Gear ngon,
              <br />
              <span className="bg-[linear-gradient(transparent_62%,var(--surface-3)_62%)] px-1 text-primary-ink">
                giá thật.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
              Tiệm gaming gear ở {diaDiem.join(" · ")}, phần lớn là hàng đã qua sử dụng. Món nào trầy, thiếu gì, còn bảo
              hành tới bao giờ, ghi rõ trên từng sản phẩm.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/danh-muc/"
                className="nut-nhan inline-flex h-14 items-center gap-2.5 rounded-xl bg-primary px-7 text-base font-semibold text-on-primary hover:bg-primary-hover"
              >
                Xem {products.length} món
                <ArrowRightIcon width={20} height={20} />
              </Link>
              {/* Keycap Enter: nút chốt mua, bấm là lún xuống */}
              <a
                href={site.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="nut-nhan inline-flex h-14 items-center gap-2.5 rounded-xl border-2 border-fg bg-surface px-6 text-base font-semibold text-fg [--primary-hover:var(--fg)]"
              >
                <FacebookIcon width={19} height={19} />
                Nhắn Messenger
                <span aria-hidden className="rounded-md bg-surface-2 px-1.5 font-mono text-sm text-fg-muted">
                  ↵
                </span>
              </a>
              <a
                href={site.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2 px-3 text-sm font-semibold text-fg-muted transition-colors hover:text-primary-ink"
              >
                <ZaloIcon width={18} height={18} />
                hoặc Zalo
              </a>
            </div>
            <p className="mt-3 text-sm text-fg-muted">
              Nhắn Messenger là tụi mình rep nhanh nhất nha.
            </p>
          </div>

          {/* Mặt bàn: ba món xếp lệch, mascot ngồi góc */}
          <div className="relative mx-auto h-[23rem] w-full max-w-[34rem] sm:h-[32rem] lg:h-[40rem] lg:max-w-none">
            <div
              aria-hidden
              className="absolute inset-x-[4%] inset-y-[6%] rounded-[3rem] bg-surface-3 opacity-70"
            />
            <BanXap items={ban} />
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img
              src="/mascot.png"
              alt=""
              width={551}
              height={1200}
              className="pointer-events-none absolute -bottom-1 right-[2%] z-30 h-[42%] w-auto drop-shadow-md sm:left-0 sm:right-auto sm:h-[46%]"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ 2 · DANH MỤC: NÚT TO ═══════════════ */}
      <section className="container-page mt-16 lg:mt-24">
        <SectionHead title="Trong tiệm có gì" subtitle="Bấm vào hũ bạn quan tâm" />

        <ul className="hien-dan mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          <li className="col-span-2 lg:row-span-2">
            <HuKeo danhMuc={dsDanhMuc[0]} mau={mauHu[0]} lon />
          </li>
          {dsDanhMuc.slice(1).map((c, i) => (
            <li key={c.slug}>
              <HuKeo danhMuc={c} mau={mauHu[(i + 1) % mauHu.length]} />
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════ 3 · ĐÁNG CHÚ Ý: KỆ CUỘN NGANG ═══════════════ */}
      <section className="mt-16 lg:mt-24">
        <div className="container-page">
          <SectionHead
            title="Đáng chú ý"
            subtitle="Món tốt nhất mỗi nhóm. Vuốt ngang để xem thêm."
            href="/danh-muc/"
          />
        </div>
        <ul
          className="container-page mt-4 flex items-start no-scrollbar snap-x snap-mandatory gap-5 overflow-x-auto pb-7 pt-8"
          aria-label="Món đáng chú ý, cuộn ngang"
        >
          {noiBat.map((p, i) => (
            <li
              key={p.id}
              className={`shrink-0 snap-start ${
                i % 3 === 2 ? "w-[18.5rem]" : "w-[15.5rem] sm:w-[16.5rem]"
              } ${i % 2 === 1 ? "mt-8" : ""}`}
            >
              <ProductCard product={toCard(p)} priority={i < 4} />
            </li>
          ))}
        </ul>
        {/* Tấm ván kệ */}
        <div aria-hidden className="container-page -mt-4">
          <div className="h-3 rounded-full bg-surface-3 shadow-[0_4px_0_0_var(--border)]" />
        </div>
      </section>

      {/* ═══════════════ 4 · CAM KẾT: GIẤY NOTE DÁN ═══════════════ */}
      <section className="mt-16 bg-dai-dam-nen py-16 text-dai-dam-chu lg:mt-24 lg:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-dai-dam-mo">
              Đọc trước khi mua
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
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
              className="nut-nhan mt-8 inline-flex h-14 items-center gap-2.5 rounded-xl bg-dai-dam-chu px-7 text-base font-bold text-dai-dam-nen [--primary-hover:var(--dai-dam-mo)]"
            >
              Xem chính sách mua bán
              <ArrowRightIcon width={20} height={20} />
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {camKet.map((c) => (
              <li
                key={c.title}
                className={`tem-dan hien-dan relative rounded-md p-5 pt-7 shadow-[3px_5px_0_0_rgb(0_0_0/0.18)] ${c.giay}`}
                style={{ "--goc": c.goc } as CSSProperties}
              >
                {/* Miếng băng keo dán giấy */}
                <span
                  aria-hidden
                  className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-3deg] bg-white/55"
                />
                <span className="flex items-start gap-2.5">
                  <CheckIcon width={18} height={18} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block text-base font-bold">{c.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed opacity-90">{c.text}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════ 5 · HÀNG MỚI ═══════════════ */}
      {moi.length > 0 && (
        <section className="container-page mt-16 lg:mt-24">
          <SectionHead title="Chưa qua sử dụng" subtitle="Nguyên seal hoặc mới bóc, chưa dùng" />
          <div className="hien-dan mt-10 grid grid-cols-2 items-start gap-x-4 gap-y-8 lg:grid-cols-4">
            {moi.map((p, i) => (
              <div key={p.id} className={i % 2 === 1 ? "mt-8" : ""}>
                <ProductCard product={toCard(p)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ 6 · CHỈ CÒN MỘT ═══════════════ */}
      {docNhat.length > 0 && (
        <section className="mt-16 bg-surface-2 py-14 lg:mt-24 lg:py-16">
          <div className="container-page">
            <SectionHead title="Chỉ còn một chiếc" subtitle="Bán rồi là hết, không có con thứ hai" />
            <div className="hien-dan mt-10 grid grid-cols-2 items-start gap-x-4 gap-y-8 lg:grid-cols-4">
              {docNhat.map((p) => (
                <ProductCard key={p.id} product={toCard(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ 7 · CTA ═══════════════ */}
      <section className="container-page my-16 lg:my-24">
        <div className="grid items-center gap-8 rounded-[2rem] border-2 border-fg bg-surface p-8 shadow-[6px_7px_0_0_var(--border-strong)] sm:p-12 lg:grid-cols-[auto_1fr_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img
            src="/mascot.png"
            alt=""
            width={551}
            height={1200}
            loading="lazy"
            className="mx-auto hidden h-60 w-auto lg:block"
          />
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
              Chưa thấy món cần?
              <br />
              Nhắn tụi mình.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
              Bảng hàng đổi liên tục, có món về rồi chưa kịp lên web. Nói tên
              món và tầm giá, có hàng tụi mình báo ngay. Nhắn Messenger là
              tụi mình trả lời nhanh nhất.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="nut-nhan inline-flex h-14 items-center gap-2.5 rounded-xl bg-primary px-7 text-base font-semibold text-on-primary hover:bg-primary-hover"
              >
                <FacebookIcon width={19} height={19} />
                Nhắn Messenger
              </a>
              <a
                href={site.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-xl border-2 border-fg bg-surface px-6 text-base font-semibold text-fg transition-colors hover:bg-primary-soft"
              >
                <ZaloIcon width={20} height={20} />
                Zalo
              </a>
              <Link
                href="/lien-he/"
                className="inline-flex h-14 items-center rounded-xl border-2 border-fg bg-surface px-6 text-base font-semibold text-fg transition-colors hover:bg-primary-soft"
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
                className="flex items-center gap-3 rounded-xl bg-surface-2 p-4 text-sm font-medium text-fg"
              >
                <span className="shrink-0 text-primary-ink">
                  <CheckIcon width={18} height={18} />
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

/** Nút danh mục: khối màu bo tròn to, đổ bóng cứng, bấm thì lún */
function HuKeo({
  danhMuc,
  mau,
  lon = false,
}: {
  danhMuc: (typeof categories)[number];
  mau: string;
  lon?: boolean;
}) {
  return (
    <Link
      href={`/danh-muc/${danhMuc.slug}/`}
      className={`nut-hu group relative flex h-full flex-col rounded-[1.75rem] border-2 border-border-strong p-4 sm:p-5 ${mau} ${
        lon ? "min-h-[12rem] justify-end gap-4 sm:min-h-[16rem] lg:p-8" : "items-start gap-3"
      }`}
    >
      <CategoryIcon khoa={danhMuc.icon} width={lon ? 56 : 30} height={lon ? 56 : 30} />

      <span className="block">
        <span
          className={`block font-bold leading-tight ${
            lon ? "font-display text-3xl lg:text-4xl" : "text-base"
          }`}
        >
          {lon ? danhMuc.name : danhMuc.short}
        </span>

        {lon && (
          <span className="mt-2 block max-w-sm text-sm leading-relaxed opacity-90">
            {danhMuc.blurb}
          </span>
        )}

        <span className="mt-2 block font-mono text-xs font-semibold opacity-90">
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
        {subtitle && <p className="mt-2 text-sm text-fg-muted sm:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-border-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors duration-200 hover:border-primary hover:text-primary-ink"
        >
          Xem tất cả
          <ArrowRightIcon width={17} height={17} />
        </Link>
      )}
    </div>
  );
}
