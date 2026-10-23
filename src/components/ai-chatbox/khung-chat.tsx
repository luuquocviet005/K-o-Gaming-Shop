import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import type { Product } from "@/lib/products";
import { CloseIcon, FacebookIcon, ZaloIcon, PhoneIcon } from "@/components/icons";
import { coLink } from "./co-link";
import type { TroChuyen } from "./use-tro-chuyen";

type QuickChip = {
  label: string;
  prompt: string;
};

/** Khung chat đang mở: đầu khung, danh sách tin nhắn, nút gợi ý, ô nhập. */
export function KhungChat({
  troChuyen,
  currentProduct,
  expanded,
  setExpanded,
  onDong,
  onPhongToQr,
}: {
  troChuyen: TroChuyen;
  currentProduct: Product | undefined;
  expanded: boolean;
  setExpanded: (capNhat: (v: boolean) => boolean) => void;
  onDong: () => void;
  onPhongToQr: (url: string | null) => void;
}) {
  const { messages, input, setInput, loading, choLau, sendMessage } = troChuyen;
  const listRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Ô nhập tự cao lên theo số dòng (tối đa ~5 dòng), gửi xong thì thu về 1 dòng
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    // scrollHeight không tính viền — thiếu 2px viền là trình duyệt hiện thanh
    // cuộn ngay cả khi mới gõ một dòng
    const cao = el.scrollHeight + (el.offsetHeight - el.clientHeight);
    el.style.height = `${Math.min(cao, 128)}px`;
    el.style.overflowY = cao > 128 ? "auto" : "hidden";
  }, [input]);

  // Cuộn thông minh: Khi có tin nhắn mới từ AI, cuộn tới ĐẦU tin nhắn đó để khách đọc từ dòng đầu tiên dễ dàng, không bị trôi mất đầu đoạn!
  useEffect(() => {
    if (loading && listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      return;
    }
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, loading]);

  /*
   * Enter: máy tính thì gửi, Shift+Enter xuống dòng. Điện thoại không có phím
   * Shift nên Enter là xuống dòng, gửi bằng nút "Gửi".
   * isComposing: đang gõ dở chữ có dấu bằng bộ gõ thì Enter thuộc về bộ gõ.
   */
  function onKeyDownNhap(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    e.preventDefault();
    sendMessage();
  }

  // Các nút bấm gợi ý rút gọn thành nhãn ngắn 1 dòng (không chiếm diện tích đọc tin nhắn!)
  const quickChips: QuickChip[] = currentProduct
    ? [
        { label: "✨ Tình trạng món này", prompt: `Món ${currentProduct.ten} này còn hàng và tình trạng sao shop?` },
        { label: "📦 Ship COD / Bank full", prompt: `Mình muốn chốt món ${currentProduct.ten} này thì Ship COD hay Bank full thế nào?` },
        { label: "📍 Qua shop Đà Nẵng test", prompt: `Mình ở Đà Nẵng muốn qua shop test trực tiếp món này` },
      ]
    : [
        { label: "📦 Quy định Ship & Cọc", prompt: "Quy định Ship COD và Bank full của shop thế nào?" },
        { label: "🖱️ Tư vấn Chuột", prompt: "Tư vấn giúp mình chuột chơi game đang sẵn hàng tại shop" },
        { label: "⌨️ Tư vấn Phím HE/Cơ", prompt: "Tư vấn bàn phím HE / Phím cơ đang sẵn hàng tại shop" },
        { label: "📍 Địa chỉ Đà Nẵng", prompt: "Địa chỉ shop ở Đà Nẵng và giờ mở cửa để qua test trực tiếp" },
      ];

  return (
    <div
      role="dialog"
      aria-label="Chat tư vấn Kẹo Gaming Shop"
      className={`flex flex-col overflow-hidden rounded-[1.5rem] border border-border-strong bg-surface shadow-2xl transition-all duration-200 ${
        expanded
          ? "h-[85vh] w-[calc(100vw-2rem)] sm:h-[44rem] sm:w-[34rem]"
          : "h-[78vh] max-h-[37rem] w-[calc(100vw-2rem)] sm:h-[36rem] sm:w-[26.5rem]"
      }`}
    >
      {/* Header gọn gàng + Tích hợp sẵn link Messenger/Zalo & nút Phóng to */}
      <div className="flex items-center justify-between gap-2 bg-primary px-4 py-3 text-on-primary">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/20 text-base">
            🍬
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-300" />
              <p className="truncate font-display text-[0.95rem] font-extrabold leading-tight">
                Trợ lý Kẹo Gaming
              </p>
            </div>
            <p className="truncate text-[0.7rem] opacity-90">
              Kho hàng trực tiếp · Báo đúng tình trạng
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={site.social.messenger}
            target="_blank"
            rel="noopener noreferrer"
            title="Nhắn Messenger với chủ shop (Xem video test)"
            className="inline-flex h-8 items-center gap-1 rounded-full bg-white/20 px-2.5 text-xs font-semibold text-on-primary transition-colors hover:bg-white/30"
          >
            <FacebookIcon width={13} height={13} />
            <span className="hidden sm:inline">Messenger</span>
          </a>
          <a
            href={site.social.zalo}
            target="_blank"
            rel="noopener noreferrer"
            title="Nhắn Zalo với chủ shop"
            className="inline-flex size-8 items-center justify-center rounded-full bg-white/20 text-on-primary transition-colors hover:bg-white/30"
          >
            <ZaloIcon width={14} height={14} />
          </a>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Thu nhỏ khung chat" : "Mở rộng khung chat để đọc thoải mái hơn"}
            aria-label={expanded ? "Thu nhỏ khung chat" : "Mở rộng khung chat"}
            className="hidden size-8 cursor-pointer place-items-center rounded-full bg-white/15 text-xs font-bold text-on-primary transition-colors hover:bg-white/30 sm:grid"
          >
            {expanded ? "⤡" : "⤢"}
          </button>
          <button
            type="button"
            onClick={onDong}
            title="Thu gọn"
            aria-label="Đóng khung chat"
            className="grid size-8 cursor-pointer place-items-center rounded-full bg-white/15 text-on-primary transition-colors hover:bg-white/30"
          >
            <CloseIcon width={17} height={17} />
          </button>
        </div>
      </div>

      {/* Vùng đọc tin nhắn: Chiếm trọn 82% chiều cao khung chat, không bị các nút gợi ý che khuất */}
      <div
        ref={listRef}
        className="flex-1 space-y-3.5 overflow-y-auto bg-bg px-4 py-4 text-[0.92rem]"
      >
        {messages.map((m, idx) => {
          const isLast = idx === messages.length - 1;
          return (
            <div
              key={m.id}
              ref={isLast ? lastMsgRef : null}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={` whitespace-pre-line rounded-2xl px-4 py-3 leading-relaxed shadow-xs ${
                  m.role === "user"
                    ? "max-w-[85%] rounded-br-xs bg-primary text-on-primary"
                    : "max-w-[94%] rounded-bl-xs border border-border bg-surface text-fg"
                }`}
              >
                {m.role === "assistant" ? coLink(m.text) : m.text}
              </div>
              {m.qrUrl && (
                <button
                  type="button"
                  onClick={() => onPhongToQr(m.qrUrl ?? null)}
                  aria-label="Phóng to mã QR chuyển khoản"
                  className="group mt-2 block cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-white p-2 text-left shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.qrUrl}
                    alt="Mã QR chuyển khoản Kẹo Gaming Shop"
                    className="h-44 w-auto object-contain"
                  />
                  <span className="block pt-1 text-center text-[0.7rem] font-semibold text-fg-muted group-hover:text-primary">
                    🔍 Bấm để phóng to
                  </span>
                </button>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start">
            <div className="rounded-2xl rounded-bl-xs border border-border bg-surface px-4 py-2.5 text-xs font-medium text-fg-muted">
              {choLau
                ? "🍬 Trợ lý đang khởi động, chờ mình xíu nha (lần đầu có thể mất gần 1 phút)…"
                : "🍬 Kẹo đang tra kho hàng..."}
            </div>
          </div>
        )}
      </div>

      {/* Thanh gợi ý 1 dòng gọn gàng (Cuộn ngang, không bao giờ đẩy trôi tin nhắn!) */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border bg-surface-2 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => sendMessage(chip.prompt)}
            className="shrink-0 cursor-pointer rounded-full border border-border-strong bg-surface px-3 py-1 text-xs font-semibold text-fg transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary-ink disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
        <a
          href={site.contact.phoneHref}
          className="shrink-0 inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-3 py-1 text-xs font-semibold text-fg transition-colors hover:border-primary hover:text-primary-ink"
        >
          <PhoneIcon width={12} height={12} />
          {site.contact.phone}
        </a>
      </div>

      {/* Ô nhập tin nhắn */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-end gap-2 border-t border-border bg-surface px-3 py-2.5"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDownNhap}
          aria-label="Nhập tin nhắn cho trợ lý Kẹo Gaming"
          placeholder="Hỏi về chuột, phím, tình trạng hoặc SĐT..."
          className="max-h-32 min-h-10 flex-1 resize-none rounded-[1.25rem] border border-border-strong bg-bg px-4 py-2.5 text-sm leading-5 text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-on-primary transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
