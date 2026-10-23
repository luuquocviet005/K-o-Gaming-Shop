import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import type { Product } from "@/lib/products";
import { CloseIcon, FacebookIcon, ZaloIcon } from "@/components/icons";
import { danhThucMayChu } from "./may-chu";

/*
 * MỘT nút nổi duy nhất trên di động: bấm vào mới bung ra Chat AI / Zalo /
 * Messenger. Đừng thêm nút nổi riêng — ba nút chồng nhau ở góc dưới chiếm
 * gần 1/5 chiều cao màn iPhone, đè tên món và che nửa nút "Thêm vào giỏ hàng".
 * Máy tính đủ chỗ nên vẫn giữ nút "Chat tư vấn Kẹo AI" như cũ.
 */
export function NutNoi({
  currentProduct,
  onMoChat,
}: {
  currentProduct: Product | undefined;
  onMoChat: () => void;
}) {
  const [menu, setMenu] = useState(false);

  // Bấm Esc thì gập menu. Không cần gập khi đổi trang: lúc menu mở, lớp nền
  // phủ kín trang nên khách phải gập menu rồi mới bấm được link khác.
  useEffect(() => {
    if (!menu) return;
    const dong = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", dong);
    return () => window.removeEventListener("keydown", dong);
  }, [menu]);

  return (
    <>
      {/* Máy tính: nút "Chat tư vấn Kẹo AI" như cũ */}
      <button
        type="button"
        onClick={onMoChat}
        aria-expanded={false}
        aria-label="Mở trợ lý AI tư vấn Kẹo Gaming Shop"
        className="group hidden h-14 cursor-pointer items-center gap-2.5 rounded-full bg-primary px-5 text-on-primary shadow-lg transition-all duration-200 hover:bg-primary-hover active:scale-95 lg:flex"
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-400" />
        </span>
        <span className="font-display text-base font-extrabold tracking-tight">
          Chat tư vấn Kẹo AI 🍬
        </span>
      </button>

      {/* Di động: một nút tròn, bấm mới bung menu liên hệ */}
      {menu && (
        <>
          {/* Bấm ra ngoài thì gập menu */}
          <div className="fixed inset-0 lg:hidden" onClick={() => setMenu(false)} aria-hidden />
          <div id="menu-lien-he" className="relative mb-3 flex flex-col items-end gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                onMoChat();
              }}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-sm font-bold text-fg shadow-lg"
            >
              <span className="size-2 rounded-full bg-emerald-400" />
              Chat với Kẹo AI 🍬
            </button>
            <a
              href={site.social.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-surface px-5 text-sm font-bold text-fg shadow-lg"
            >
              <ZaloIcon width={18} height={18} />
              Nhắn Zalo
            </a>
            {/* Messenger nằm sát ngón tay nhất — chủ shop rep Messenger nhanh nhất */}
            <a
              href={site.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-on-primary shadow-lg"
            >
              <FacebookIcon width={18} height={18} />
              {currentProduct ? "Hỏi về món này" : "Nhắn Messenger"}
            </a>
          </div>
        </>
      )}
      <button
        type="button"
        onClick={() => {
          // Mở menu là lúc đánh thức máy chủ chat — khách chọn xong thì nó đã dậy
          if (!menu) danhThucMayChu();
          setMenu((m) => !m);
        }}
        aria-expanded={menu}
        aria-controls="menu-lien-he"
        aria-label={menu ? "Đóng menu liên hệ" : "Mở menu liên hệ: chat AI, Zalo, Messenger"}
        className="relative grid size-14 cursor-pointer place-items-center rounded-full bg-primary text-2xl text-on-primary shadow-lg transition-transform duration-200 active:scale-95 lg:hidden"
      >
        {menu ? (
          <CloseIcon width={22} height={22} />
        ) : (
          <>
            🍬
            <span className="absolute right-0.5 top-0.5 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-400" />
            </span>
          </>
        )}
      </button>
    </>
  );
}
