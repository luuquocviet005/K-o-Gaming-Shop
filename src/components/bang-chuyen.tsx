"use client";

import { useEffect, useState } from "react";
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
 * mắt không thấy điểm nối. Cho hai bản chạy riêng thì mỗi bản dịch 50% CỦA
 * CHÍNH NÓ — hở khoảng và giật.
 *
 * NÚT DỪNG là bắt buộc, không phải tuỳ chọn: WCAG 2.2.2 yêu cầu mọi nội dung
 * tự chạy quá 5 giây phải có cách dừng lại. Nút này cũng là lối thoát cho
 * người đang bật "giảm chuyển động" trong hệ điều hành mà vẫn muốn xem nó chạy.
 */
export function BangChuyen({ muc }: { muc: string[] }) {
  // Khởi đầu là dừng để bản dựng trên máy chủ và trên trình duyệt giống nhau;
  // sau khi mount mới đọc cài đặt hệ thống rồi quyết định có chạy hay không.
  const [chay, setChay] = useState(false);

  useEffect(() => {
    const giamChuyenDong = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChay(!giamChuyenDong);
  }, []);

  if (muc.length === 0) return null;

  const banSao = (an: boolean) => (
    <ul aria-hidden={an || undefined} className="flex shrink-0 items-center gap-8 pr-8">
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
    <div className="relative flex items-center border-y border-border bg-dai-dam-nen text-dai-dam-chu">
      <div className="min-w-0 flex-1 overflow-hidden py-3">
        <div
          className="bang-chuyen flex w-max"
          data-chay={chay ? "true" : "false"}
          style={{ animationPlayState: chay ? "running" : "paused" }}
        >
          {banSao(false)}
          {banSao(true)}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setChay((v) => !v)}
        aria-label={chay ? "Dừng dòng chữ đang chạy" : "Cho dòng chữ chạy"}
        title={chay ? "Dừng dòng chữ đang chạy" : "Cho dòng chữ chạy"}
        className="mr-3 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-dai-dam-chu/15 text-dai-dam-chu transition-colors hover:bg-dai-dam-chu/30 sm:mr-4"
      >
        {chay ? (
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
            <rect x="6.5" y="5" width="4" height="14" rx="1.4" />
            <rect x="13.5" y="5" width="4" height="14" rx="1.4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M8 5.4v13.2a1 1 0 0 0 1.5.87l11-6.6a1 1 0 0 0 0-1.74l-11-6.6A1 1 0 0 0 8 5.4Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
