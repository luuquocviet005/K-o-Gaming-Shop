import type { NhomTinhTrang } from "@/lib/products";

/**
 * Nhãn tình trạng hàng.
 *
 * Với shop bán đồ cũ, đây là thông tin khách nhìn TRƯỚC cả giá. Hàng mới và
 * hàng cũ phải phân biệt được ngay từ xa, không bắt khách đọc kỹ mới thấy.
 */
export function ConditionBadge({
  tinhTrang,
  nhom,
  size = "sm",
}: {
  tinhTrang: string;
  nhom: NhomTinhTrang;
  size?: "sm" | "md";
}) {
  if (!tinhTrang) return null;

  const kieu =
    nhom === "moi"
      ? "bg-primary text-on-primary"
      : nhom === "cu"
        ? "bg-surface-3 text-fg"
        : "bg-candy-soft text-candy-ink";

  const co = size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-[0.68rem]";

  return (
    <span className={`inline-flex rounded-full font-bold ${kieu} ${co}`}>
      {tinhTrang}
    </span>
  );
}
