"use client";

import { useState } from "react";
import type { MonDangXem, Product } from "@/lib/products";
import { formatGia, formatVND, moTaTonKho } from "@/lib/format";
import { site } from "@/lib/site";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ODanhSachPhanLoai, useMonDangXem } from "@/components/phan-loai";
import {
  ZaloIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  FacebookIcon,
  CheckIcon,
} from "@/components/icons";

/**
 * Khối chọn mua.
 *
 * Phần lớn món là hàng cũ, mỗi dòng Sheet là MỘT món cụ thể. Món nào chủ shop
 * điền cột "Phân loại" (nhiều màu, nhiều layout) thì có thêm hàng ô chọn, và
 * giá / ghi chú / tồn kho bên dưới đổi theo phân loại đang chọn.
 */
export function ProductPurchase({ product, soDaBan }: { product: Product; soDaBan: number }) {
  const mon = useMonDangXem(product);
  // key: đổi phân loại thì số lượng về 1 — 3 cái màu hồng không chuyển thành 3 cái màu đen
  return <KhoiMua key={mon.loai?.id ?? ""} product={mon} soDaBan={soDaBan} />;
}

function KhoiMua({ product, soDaBan }: { product: MonDangXem; soDaBan: number }) {
  const [qty, setQty] = useState(1);
  const [daChep, setDaChep] = useState<"video" | "don" | null>(null);

  const hetHang = product.soLuong <= 0;
  const chuaCoGia = product.gia === 0;
  const tonKho = moTaTonKho(product);
  const tongTien = product.gia * qty;

  // Hàng cũ đa số chỉ có 1 chiếc: ô số lượng lúc đó chỉ là nút + bị mờ, ẩn đi cho gọn
  const chonSoLuong = !hetHang && !chuaCoGia && product.soLuong > 1;
  const tenDayDu = `${product.hang} ${product.loai ? `${product.ten} (${product.loai.ten})` : product.ten}`;

  // m.me không cho điền sẵn tin nhắn, nên chép sẵn câu để khách chỉ việc dán
  function chep(loai: "video" | "don") {
    const link = window.location.href;
    const cau =
      loai === "video"
        ? `Cho mình xin video ${tenDayDu} nha: ${link}`
        : `Mình muốn chốt ${tenDayDu}${qty > 1 ? ` x${qty}` : ""} (${formatVND(tongTien)}): ${link}`;
    navigator.clipboard
      ?.writeText(cau)
      .then(() => setDaChep(loai))
      .catch(() => {});
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight text-fg">
          {formatGia(product)}
        </span>
        {product.donViGia && (
          <span className="text-sm text-fg-muted">
            giá cho 1 {product.donViGia}
          </span>
        )}
      </div>

      {/* Sheet ghi khoảng giá thì nói thẳng là giá còn tuỳ, đừng để khách đoán */}
      {product.ghiChuGia && (
        <p className="mt-3 flex gap-2.5 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-fg-muted">
          <InfoIcon width={18} height={18} className="mt-px shrink-0 text-candy-ink" />
          <span>
            Giá ghi trong bảng hàng là{" "}
            <strong className="font-semibold text-fg">{product.ghiChuGia}</strong> — mức
            cuối tuỳ tình trạng và phụ kiện đi kèm, nhắn tin để chốt chính xác.
          </span>
        </p>
      )}

      {/* Ghi chú tình trạng — đặt ngay dưới giá vì đây là thứ quyết định mua hay không */}
      {product.note && (
        <div className="mt-4 rounded-2xl border border-candy/30 bg-candy-soft px-4 py-3.5">
          <p className="text-xs font-bold uppercase tracking-wider text-candy-ink">
            Tình trạng thực tế
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[0.95rem] leading-relaxed text-fg">
            {product.note}
          </p>
        </div>
      )}

      <ODanhSachPhanLoai product={product} />

      <div className="mt-7 flex flex-wrap items-center gap-5">
        {chonSoLuong && (
          <div>
            <p id="nhan-so-luong" className="font-display text-sm font-bold text-fg">
              Số lượng
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Giảm số lượng"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <MinusIcon width={18} height={18} />
              </button>
              <output
                aria-labelledby="nhan-so-luong"
                className="min-w-10 text-center font-display text-lg font-bold text-fg"
              >
                {qty}
              </output>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.soLuong, q + 1))}
                disabled={qty >= product.soLuong}
                aria-label="Tăng số lượng"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <PlusIcon width={18} height={18} />
              </button>
            </div>
          </div>
        )}

        <div className={chonSoLuong ? "pt-8" : ""}>
          <p
            className={`text-sm font-semibold ${
              tonKho.mau === "het"
                ? "text-danger"
                : tonKho.mau === "sapHet"
                  ? "text-candy-ink"
                  : "text-primary-ink"
            }`}
          >
            {tonKho.chu}
          </p>
          {qty > 1 && (
            <p className="mt-1 text-sm text-fg-muted">
              Tạm tính:{" "}
              <strong className="font-semibold text-fg">{formatVND(tongTien)}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {hetHang ? (
          <p className="rounded-2xl bg-surface-2 px-6 py-4 text-sm text-fg-muted">
            {product.loai ? `Bản ${product.loai.ten} đã bán hết.` : "Món này đã bán."} Nhắn{" "}
            <a
              href={site.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-ink underline"
            >
              Messenger
            </a>{" "}
            hoặc{" "}
            <a
              href={site.social.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-ink underline"
            >
              Zalo
            </a>{" "}
            để tụi mình báo khi có hàng tương tự.
          </p>
        ) : chuaCoGia ? (
          <>
            <a
              href={site.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
            >
              <FacebookIcon width={19} height={19} />
              Nhắn hỏi giá
            </a>
            <a
              href={site.social.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2.5 rounded-full border border-border-strong bg-surface px-7 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
            >
              <ZaloIcon width={20} height={20} />
              Hỏi qua Zalo
            </a>
          </>
        ) : (
          <>
            <AddToCartButton
              productId={product.id}
              loai={product.loai?.id}
              quantity={qty}
              productName={product.loai ? `${product.ten} (${product.loai.ten})` : product.ten}
              className="flex-1 sm:flex-none"
            />
            {/* Đơn nào cũng chốt qua tin nhắn, nên nút phụ đi thẳng vào Messenger thay vì qua giỏ */}
            <a
              href={site.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => chep("don")}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full border border-border-strong bg-surface px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97] sm:flex-none"
            >
              <FacebookIcon width={19} height={19} />
              Nhắn chốt món này
            </a>
          </>
        )}
      </div>

      {!hetHang && (
        <>
          <a
            href={site.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => chep("video")}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-ink underline underline-offset-2"
          >
            <FacebookIcon width={17} height={17} />
            Ở xa? Nhắn xin video món này
          </a>
          {daChep && (
            <p role="status" className="text-xs text-fg-muted">
              {daChep === "don" ? "Đã chép đơn" : "Đã chép tên món"}, dán vào khung chat là xong.
            </p>
          )}

          <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
            {[
              `Ship đi tỉnh, nhận hàng trả tiền (cọc ${formatVND(site.shipping.cocCod)})`,
              "Bảo hành 1 tháng",
              "Sai mô tả hoàn tiền trong 3 ngày",
              ...(soDaBan > 0 ? [`${soDaBan} món đã tới tay khách`] : []),
            ].map((dong) => (
              <li key={dong} className="flex items-center gap-2">
                <CheckIcon width={16} height={16} className="shrink-0 text-primary" />
                {dong}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
