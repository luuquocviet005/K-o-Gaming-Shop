/** Định dạng tiền Việt: 3190000 -> "3.190.000₫" */
export function formatVND(amount: number): string {
  return `${Math.round(amount).toLocaleString("vi-VN")}₫`;
}

/** Rút gọn số lượng lớn: 1240 -> "1,2k" */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")}k`;
}
