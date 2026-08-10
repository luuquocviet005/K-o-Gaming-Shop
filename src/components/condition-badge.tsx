import type { NhomTinhTrang } from "@/lib/products";

/**
 * Nhãn tình trạng, tạo hình như một mẩu giấy bọc kẹo.
 *
 * Màu KHÔNG phải trang trí ngẫu nhiên — mỗi "vị kẹo" ứng với một mức độ
 * nguyên vẹn của món hàng, dùng nhất quán khắp trang để khách nhìn màu là
 * đoán được:
 *   bạc hà  → hàng mới
 *   caramel → cũ nhưng đủ hộp
 *   dâu     → cũ, thiếu hộp hoặc không hộp
 *   nho     → dạng khác (kit, chỉ có phím và dây…)
 *
 * Chữ vẫn ghi nguyên văn tình trạng ngay bên cạnh — không bao giờ để màu
 * gánh một mình, vì người mù màu sẽ không đọc được thông tin quan trọng nhất.
 */
export function viTinhTrang(tinhTrang: string, nhom: NhomTinhTrang) {
  if (nhom === "moi") return "bacha";
  if (nhom === "cu") return tinhTrang.includes("đủ hộp") ? "caramel" : "dau";
  return "nho";
}

const bangVi = {
  bacha: "bg-vi-bacha-nen text-vi-bacha-chu",
  caramel: "bg-vi-caramel-nen text-vi-caramel-chu",
  dau: "bg-vi-dau-nen text-vi-dau-chu",
  nho: "bg-vi-nho-nen text-vi-nho-chu",
} as const;

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

  const vi = viTinhTrang(tinhTrang, nhom);
  const co = size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-[0.68rem]";

  return (
    <span
      className={`relative inline-flex items-center rounded-full font-bold ${bangVi[vi]} ${co}`}
    >
      {/* Hai đầu xoắn của giấy bọc kẹo */}
      <span
        aria-hidden="true"
        className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 rounded-[2px] bg-inherit"
      />
      <span
        aria-hidden="true"
        className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rotate-45 rounded-[2px] bg-inherit"
      />
      <span className="relative">{tinhTrang}</span>
    </span>
  );
}
