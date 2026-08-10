import { SparkIcon } from "@/components/icons";

/**
 * Băng chuyền chạy ngang — dải chữ trôi liên tục như bảng đèn trước cửa tiệm.
 *
 * CẤU TRÚC PHẢI ĐÚNG THẾ NÀY:
 *   khung (overflow hidden)
 *     └── đường ray (w-max, animate translateX -50%)
 *           ├── bản 1
 *           └── bản 2 (giống hệt)
 *
 * Một đường ray DUY NHẤT chứa hai bản, dịch 50% chiều rộng đường ray = đúng
 * bằng một bản. Khi hết vòng, bản 2 đã nằm chính xác chỗ bản 1 xuất phát nên
 * mắt không thấy điểm nối.
 *
 * Cho hai bản tự chạy riêng thì mỗi bản dịch 50% CỦA CHÍNH NÓ — hở khoảng và
 * giật. Đó là lỗi ở bản trước.
 */
export function BangChuyen({ muc }: { muc: string[] }) {
  if (muc.length === 0) return null;

  const banSao = (an: boolean) => (
    <ul
      aria-hidden={an || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {muc.map((m, i) => (
        <li key={i} className="flex shrink-0 items-center gap-8">
          <span className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.18em]">
            {m}
          </span>
          <SparkIcon width={14} height={14} className="shrink-0 opacity-60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-border bg-dai-dam-nen py-3 text-dai-dam-chu">
      <div className="bang-chuyen flex w-max">
        {banSao(false)}
        {banSao(true)}
      </div>
    </div>
  );
}
