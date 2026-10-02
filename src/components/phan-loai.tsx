"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  apDungPhanLoai,
  phanLoaiMacDinh,
  type MonDangXem,
  type Product,
} from "@/lib/products";
import { banThuNho } from "@/components/product-art";
import { ConditionBadge } from "@/components/condition-badge";
import { formatVND } from "@/lib/format";

/**
 * Chọn phân loại (màu, layout, loại switch…) trên trang sản phẩm.
 *
 * Thư viện ảnh nằm cột trái, khối giá và nút mua nằm cột phải, bảng thông tin
 * nằm dưới nữa — cả ba cùng phải đổi theo một lựa chọn. Nên lựa chọn sống ở
 * một context bọc cả lưới, mỗi khối tự đọc `useMonDangXem`.
 *
 * Phân loại đang chọn ghi lên đường dẫn (?loai=hong) để chủ shop gửi link cho
 * khách là mở đúng màu. Đọc đường dẫn SAU khi mount chứ không dùng
 * useSearchParams: trang xuất tĩnh, HTML dựng sẵn luôn là phân loại mặc định.
 */
type GiaTri = { mon: MonDangXem; chon: (id: string) => void };

const NgCanh = createContext<GiaTri | null>(null);

export function PhanLoaiProvider({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const [loaiId, setLoaiId] = useState(() => phanLoaiMacDinh(product)?.id);

  useEffect(() => {
    const tuLink = new URLSearchParams(window.location.search).get("loai");
    if (tuLink && product.phanLoai?.some((v) => v.id === tuLink)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- chỉ trình duyệt mới có đường dẫn
      setLoaiId(tuLink);
    }
  }, [product]);

  function chon(id: string) {
    setLoaiId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("loai", id);
    window.history.replaceState(null, "", url);
  }

  return (
    <NgCanh.Provider value={{ mon: apDungPhanLoai(product, loaiId), chon }}>
      {children}
    </NgCanh.Provider>
  );
}

/** Sản phẩm đã áp phân loại đang chọn; ngoài provider thì trả nguyên sản phẩm */
export function useMonDangXem(product: Product): MonDangXem {
  return useContext(NgCanh)?.mon ?? product;
}

/** Nhãn tình trạng góc ảnh — đổi theo phân loại (bản đen có thể là hàng cũ) */
export function NhanTinhTrang({ product }: { product: Product }) {
  const mon = useMonDangXem(product);
  return <ConditionBadge tinhTrang={mon.tinhTrang} nhom={mon.nhomTinhTrang} size="md" />;
}

/**
 * Hàng ô chọn phân loại.
 *
 * Mỗi ô là ảnh thu nhỏ của chính phân loại đó kèm tên bên dưới; phân loại chưa
 * có ảnh thì chỉ hiện chữ. Hết hàng vẫn bấm được — khách xem ảnh rồi nhắn hỏi
 * khi nào có lại — nhưng mờ đi và có gạch chéo để khỏi nhầm.
 */
export function ODanhSachPhanLoai({ product }: { product: Product }) {
  const ctx = useContext(NgCanh);
  if (!ctx || !product.phanLoai) return null;
  const dangChon = ctx.mon.loai?.id;
  // Các phân loại khác giá thì ghi giá ngay dưới từng ô — khách so được mà
  // không phải bấm lần lượt từng cái. Cùng giá thì khỏi lặp, giá to ở trên là đủ.
  const khacGia = new Set(product.phanLoai.map((v) => v.gia)).size > 1;

  return (
    <fieldset className="mt-7">
      <legend className="font-display text-sm font-bold text-fg">
        Phân loại:{" "}
        <span className="font-sans font-semibold text-primary-ink">{ctx.mon.loai?.ten}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {product.phanLoai.map((v) => {
          const on = v.id === dangChon;
          const het = v.soLuong <= 0;
          const anh = v.anh ? (banThuNho(v.anh) ?? v.anh) : null;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => ctx.chon(v.id)}
              aria-pressed={on}
              aria-label={`${v.ten}${het ? " — đã bán hết" : ""}`}
              className="group w-[5rem] cursor-pointer text-center"
            >
              <span
                className={`relative grid h-[4.25rem] place-items-center overflow-hidden rounded-xl border bg-surface-2 transition-all duration-200 ${
                  on
                    ? "border-2 border-primary"
                    : "border-border-strong group-hover:border-primary/60"
                } ${het ? "opacity-45" : ""}`}
              >
                {anh ? (
                  // eslint-disable-next-line @next/next/no-img-element -- trang tĩnh, ảnh đã nén sẵn
                  <img
                    src={anh}
                    alt=""
                    width={68}
                    height={68}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <span className="px-1 text-xs font-semibold leading-tight text-fg">{v.ten}</span>
                )}
                {het && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 top-1/2 -rotate-[24deg] border-t-[1.5px] border-fg-muted"
                  />
                )}
              </span>
              {anh && (
                <span
                  className={`mt-1 block truncate text-xs ${
                    on ? "font-semibold text-fg" : "text-fg-muted"
                  }`}
                >
                  {v.ten}
                </span>
              )}
              {khacGia && (
                <span className="block text-[0.68rem] font-semibold text-primary-ink">
                  {v.gia ? formatVND(v.gia) : "Liên hệ"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Khối "Mô tả" + "Thông tin món hàng" dưới nút mua.
 *
 * Tách ra khỏi trang (vốn dựng ở máy chủ) vì tình trạng và số lượng còn đổi
 * theo phân loại đang chọn.
 */
export function ChiTietMon({ product, tenNhom }: { product: Product; tenNhom?: string }) {
  const mon = useMonDangXem(product);

  const thongTin = [
    { nhan: "Hãng", giaTri: mon.hang },
    ...(mon.loai ? [{ nhan: "Phân loại", giaTri: mon.loai.ten }] : []),
    { nhan: "Tình trạng", giaTri: mon.tinhTrang || "Chưa ghi" },
    { nhan: "Hàng đang ở", giaTri: mon.diaDiem },
    { nhan: "Số lượng còn", giaTri: mon.soLuong > 0 ? `${mon.soLuong}` : "Đã hết" },
    ...(tenNhom ? [{ nhan: "Nhóm", giaTri: tenNhom }] : []),
  ];

  return (
    <>
      {/*
        Mô tả: cấu hình, phụ kiện kèm theo. Đặt TRƯỚC bảng thông số vì đây
        là thứ khách hàng cũ đọc kỹ nhất — cái case gì, switch gì, có kèm
        hộp không. `whitespace-pre-line` để chủ shop xuống dòng trong ô
        Google Sheet (Alt+Enter) thì trên web cũng xuống dòng đúng chỗ.
      */}
      {mon.moTa && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold text-fg">Mô tả</h2>
          <p className="mt-3 whitespace-pre-line rounded-2xl border border-border bg-surface px-5 py-4 text-[0.95rem] leading-relaxed text-fg">
            {mon.moTa}
          </p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-fg">Thông tin món hàng</h2>
        <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface px-5">
          {thongTin.map((t) => (
            <div key={t.nhan} className="flex justify-between gap-6 py-3.5">
              <dt className="text-sm text-fg-muted">{t.nhan}</dt>
              <dd className="text-right text-sm font-semibold text-fg">{t.giaTri}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
