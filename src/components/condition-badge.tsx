import type { NhomTinhTrang } from "@/lib/products";

/**
 * Nhãn tình trạng, tạo hình như con dấu trên phiếu kiểm hàng.
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
  const co = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";

  // Dấu tình trạng: khung vuông, chữ đơn cách, như con dấu đóng lên phiếu
  return (
    <span
      className={`dap-dau inline-flex items-center rounded-[3px] border border-current/40 font-mono font-semibold leading-tight ${bangVi[vi]} ${co}`}
    >
      {tinhTrang}
    </span>
  );
}
