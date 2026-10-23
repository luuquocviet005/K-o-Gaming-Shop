import { useEffect } from "react";

/** Ảnh QR phóng to phủ kín màn hình. QR nhỏ quá thì app ngân hàng khó quét. */
export function QrPhongTo({ url, onDong }: { url: string; onDong: () => void }) {
  // Bấm Esc để đóng.
  useEffect(() => {
    const dong = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDong();
    };
    window.addEventListener("keydown", dong);
    return () => window.removeEventListener("keydown", dong);
  }, [onDong]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mã QR chuyển khoản phóng to"
      onClick={() => onDong()}
      className="fixed inset-0 z-[70] flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-black/70 p-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Mã QR chuyển khoản Kẹo Gaming Shop"
        className="max-h-[80vh] w-auto max-w-full rounded-2xl bg-white p-3 shadow-2xl"
      />
      <button
        type="button"
        onClick={() => onDong()}
        className="rounded-full bg-white px-5 py-2 text-sm font-bold text-fg shadow"
      >
        Đóng
      </button>
    </div>
  );
}
