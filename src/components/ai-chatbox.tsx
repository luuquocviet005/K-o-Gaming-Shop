"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { products, getProduct, getSoldProduct } from "@/lib/products";
import { formatGia, formatVND } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { CloseIcon, FacebookIcon, ZaloIcon, PhoneIcon } from "@/components/icons";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  qrUrl?: string | null;
};

type QuickChip = {
  label: string;
  prompt: string;
};

const API_ENDPOINTS = [site.chatbot.apiMayNha, site.chatbot.api];

/**
 * Biến link trong câu trả lời của bot thành link bấm được. Bot gửi link
 * Zalo / Messenger cho khách hỏi tình trạng — để dạng chữ thì
 * khách trên điện thoại phải tự chép, nhiều người bỏ luôn.
 * Chỉ nhận http(s) và cắt dấu câu dính ở cuối link.
 */
function coLink(text: string) {
  return text.split(/(https?:\/\/[^\s]+[^\s.,!?;:)])/g).map((doan, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={doan}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-semibold underline underline-offset-2"
      >
        {doan}
      </a>
    ) : (
      doan
    ),
  );
}

/**
 * Render bản miễn phí ngủ sau ~15 phút không ai gọi và mất gần một phút để
 * dậy. Chờ khách gõ xong câu đầu mới gọi thì câu đó gần như chắc chắn rơi vào
 * trả lời dự phòng. Nên vừa mở khung chat là gọi đánh thức luôn.
 */
// Render miễn phí dậy mất 50–60 giây. Chờ ngắn hơn thế thì câu đầu tiên của
// khách gần như luôn rơi vào trả lời dự phòng.
const CHO_TRA_LOI_MS = 65000;
// Chờ quá lâu thì đổi dòng "đang tra kho" thành lời báo đang khởi động
const BAO_CHO_LAU_MS = 8000;
let daDanhThuc = false;
function danhThucMayChu() {
  if (daDanhThuc) return;
  daDanhThuc = true;
  fetch(new URL("/", site.chatbot.api), { mode: "no-cors" }).catch(() => {});
}

/** Mã phiên để backend nhớ mạch hội thoại. Tab ẩn danh có thể chặn
 * localStorage — khi đó dùng mã tạm trong bộ nhớ, chat vẫn chạy bình thường. */
let maPhienTam: string | null = null;
function getSessionId(): string {
  if (typeof window === "undefined") return "web_ssr";
  const key = "keo_chat_session_id";
  const taoMoi = () =>
    "web_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  try {
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid = taoMoi();
      window.localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    maPhienTam ??= taoMoi();
    return maPhienTam;
  }
}

/**
 * Mã QR chuyển khoản VietQR — có số tiền thì điền sẵn, không thì khách tự nhập.
 * KHÔNG điền nội dung chuyển khoản: chủ shop không muốn sao kê ghi sẵn chữ
 * "Keo Gaming" / "Coc COD".
 */
function qrChuyenKhoan(soTien: number | null): string {
  const { ma, soTaiKhoan, chuTaiKhoan } = site.nganHang;
  const qs = new URLSearchParams({ accountName: chuTaiKhoan });
  if (soTien) qs.set("amount", String(soTien));
  return `https://img.vietqr.io/image/${ma}-${soTaiKhoan}-compact2.png?${qs}`;
}

/**
 * Khách xin STK / chọn chuyển khoản lúc máy chủ chưa trả lời được.
 *
 * STK là thông tin cố định nên trình duyệt tự đưa ngay, kèm mã QR — khách
 * nhắn "bankfull, cho mình xin stk" mà chỉ nhận lại quy tắc ship thì phải hỏi
 * đi hỏi lại.
 */
function traLoiChuyenKhoan(userText: string): { text: string; qrUrl: string } | null {
  const q = userText.toLowerCase();
  const xinStk = /stk|số tài khoản|so tai khoan|tài khoản|chuyển khoản|mã qr|\bqr\b/.test(q);
  const bankFull = /bank\s*full/.test(q);
  if (!xinStk && !bankFull) return null;

  const laCoc = /cọc|\bcod\b/.test(q) && !bankFull;
  const { ma, soTaiKhoan, chuTaiKhoan } = site.nganHang;
  const stk = `${ma} – ${soTaiKhoan} – ${chuTaiKhoan}`;
  const text = laCoc
    ? `Dạ STK nhận cọc của shop: ${stk}. Bạn cọc ${formatVND(site.shipping.cocCod)} theo mã QR bên dưới nha, tiền cọc trừ thẳng vào tiền thu hộ COD. Chuyển xong bạn nhắn Messenger hoặc Zalo (nút ở đầu khung chat) gửi ảnh chuyển khoản + Họ tên, SĐT, địa chỉ để shop lên đơn ạ!`
    : `Dạ STK của shop: ${stk}. Bạn quét mã QR bên dưới rồi nhập số tiền đơn hàng nha (đơn từ ${formatVND(site.shipping.freeshipChuyenKhoanTu)} được freeship). Chuyển xong bạn nhắn Messenger hoặc Zalo (nút ở đầu khung chat) gửi ảnh chuyển khoản + Họ tên, SĐT, địa chỉ để shop lên đơn ạ!`;
  return {
    text,
    qrUrl: qrChuyenKhoan(laCoc ? site.shipping.cocCod : null),
  };
}

/**
 * Trả lời dự phòng tức thì ngay trên trình duyệt nếu máy chủ Cloud Render đang khởi động lại.
 * Lúc này KHÔNG có gì được gửi về cho chủ shop — đừng hứa "đã ghi nhận" hay
 * "để lại SĐT", mà chỉ khách sang Messenger/Zalo/điện thoại.
 * Phân biệt TUYỆT ĐỐI danh mục (chuot / ban-phim / tai-nghe / pad-chuot / phu-kien) để không bao giờ lẫn bàn phím vào chuột.
 */
function buildInstantLocalReply(
  userText: string,
  currentProductSlug: string | null,
  cartTotal: number,
  cartSummary: string,
): string {
  const q = userText.toLowerCase().trim();
  const curProd = currentProductSlug ? getProduct(currentProductSlug) : undefined;
  const curSold = currentProductSlug ? getSoldProduct(currentProductSlug) : undefined;

  // 1. Hỏi về Ship COD / Bank full / Thanh toán / Freeship
  if (/ship\s*cod|bank\s*full|chuyển khoản|thanh toán|freeship|free\s*ship|phí ship|cọc/i.test(q)) {
    return `Dạ, Ship COD bên mình cọc ${formatVND(site.shipping.cocCod)} giúp shop nha, cọc trừ thẳng vào tiền thu hộ COD. Bank full thì đơn từ ${formatVND(site.shipping.freeshipChuyenKhoanTu)} mình freeship, dưới mức đó phí ship tính theo thực tế bưu điện nhưng sẽ rẻ hơn so với COD ạ.`;
  }

  // 2. Hỏi địa chỉ / Đà Nẵng / GDTT / Qua shop test
  if (/địa chỉ|ở đâu|đà nẵng|gdtt|qua test|trực tiếp|giờ mở cửa/i.test(q)) {
    return `Dạ Kẹo Gaming Shop ở tại: ${site.contact.address} (Mở cửa ${site.contact.hours}). Hàng có sẵn tại shop, mời bạn ghé test trực tiếp thoải mái trước khi trả tiền nha! Bạn định ghé khoảng mấy giờ nhắn mình chuẩn bị sẵn đồ nhé.`;
  }

  // 3. Nếu khách đang đứng ở trang 1 sản phẩm cụ thể và hỏi về món đó
  if (curProd && /món này|con này|còn không|còn hàng|giá|chốt|mua/i.test(q)) {
    const giaText = formatGia(curProd);
    if (curProd.soLuong <= 0) {
      return `Dạ mẫu ${curProd.hang} ${curProd.ten} hiện vừa hết hàng rồi ạ. Bạn nhắn Messenger hoặc Zalo cho tụi mình (nút ở đầu khung chat), khi nào có kèo tương tự về shop báo bạn đầu tiên nha!`;
    }
    return `Dạ mẫu ${curProd.hang} ${curProd.ten} (${curProd.tinhTrang}) đang sẵn hàng tại Đà Nẵng, giá ${giaText}${curProd.note ? ` — ${curProd.note}` : ""}. Bạn muốn qua shop test trực tiếp hay chốt Ship COD / Bank full ạ?`;
  }

  if (curSold && /món này|con này|còn không/i.test(q)) {
    return `Dạ mẫu ${curSold.hang} ${curSold.ten} này shop vừa bán mất rồi ạ. Bạn nhắn Messenger hoặc Zalo cho tụi mình (nút ở đầu khung chat), khi nào có kèo lướt tương tự về mình nhắn bạn ngay nha!`;
  }

  // 4. Phân loại đúng Danh mục khách đang hỏi (Chuột vs Bàn phím vs Tai nghe)
  const askingMouse = /chuột|mouse|spl|gpx|viper|deathadder|da v3|da v4|superlight|zowie|pulsar|lamzu|cầm|tay to|tay nhỏ|claw|palm|fingertip/i.test(q);
  const askingKeyboard = /bàn phím|phím|he\b|rapid trigger|switch|keycap|layout|60%|68%|75%|80%|tkl|hex80|rs7|edge60|wooting|aula|akko/i.test(q);
  const askingHeadset = /tai nghe|headset|iem|mic|hyperx|cloud|blackshark|barracuda/i.test(q);

  let pool = products.filter((p) => p.soLuong > 0);
  if (askingMouse && !askingKeyboard) {
    pool = pool.filter((p) => p.danhMuc === "chuot");
  } else if (askingKeyboard && !askingMouse) {
    pool = pool.filter((p) => p.danhMuc === "ban-phim");
  } else if (askingHeadset) {
    pool = pool.filter((p) => p.danhMuc === "tai-nghe");
  }

  if (askingMouse && /tay.*to|tay.*lớn/i.test(q)) {
    pool = pool.filter((p) => !/mini/i.test(p.ten));
  }

  if (askingMouse || askingKeyboard || askingHeadset) {
    const top = pool.slice(0, 5);
    if (top.length > 0) {
      const listStr = top
        .map((p) => `• ${p.hang} ${p.ten} (${p.tinhTrang}): ${formatGia(p)}`)
        .join("\n");
      return `Dạ hiện tại trong danh mục bạn tìm, shop đang sẵn mấy mẫu này phù hợp nè:\n${listStr}\nBạn thích form cầm hay tầm giá khoảng bao nhiêu nhắn mình lọc chuẩn hơn cho bạn nha!`;
    }
  }

  if (cartSummary && /giỏ hàng|chốt đơn/i.test(q)) {
    return `Dạ mình thấy trong giỏ của bạn đang có: ${cartSummary} (Tổng: ${formatVND(cartTotal)}). Bạn muốn chốt đơn này theo hình thức Ship COD hay Bank full ạ?`;
  }

  return `Dạ trợ lý đang bận chút nên chưa trả lời kỹ được câu này ạ. Bạn nhắn Messenger hoặc Zalo (nút ở đầu khung chat) hay gọi ${site.contact.phone} để chủ shop trả lời ngay nha!`;
}

export function AiChatbox() {
  const pathname = usePathname();
  const { lines, total } = useCart();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Ảnh QR đang phóng to (null = đóng). QR nhỏ quá thì app ngân hàng khó quét.
  const [qrPhongTo, setQrPhongTo] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [choLau, setChoLau] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Chào bạn! 🍬 Mình là trợ lý Kẹo Gaming Shop (Đà Nẵng). Bạn cần tư vấn chuột, phím cơ/HE, hỏi tình trạng thật hay chốt đơn cứ nhắn mình nha! Nếu bạn cần thêm bất kỳ thông tin nào thì nhắn trực tiếp cho chủ shop qua Messenger hoặc Zalo (nút ở đầu khung chat) nhé.",
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const msgCounterRef = useRef(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /*
   * Khách hay nhắn rời từng mẩu: tên, rồi SĐT, rồi địa chỉ. Nên KHÔNG khoá ô
   * nhập lúc đang chờ trả lời (khoá thì khách gõ xong không gửi được, tưởng web
   * lỗi): tin nhắn hiện ngay, gom vào hàng chờ, trả lời xong câu trước thì gửi
   * cả cụm còn lại một lượt.
   */
  const dangChoRef = useRef(false);
  const hangChoRef = useRef<string[]>([]);

  // Bấm Esc để đóng ảnh QR phóng to.
  useEffect(() => {
    if (!qrPhongTo) return;
    const dong = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQrPhongTo(null);
    };
    window.addEventListener("keydown", dong);
    return () => window.removeEventListener("keydown", dong);
  }, [qrPhongTo]);

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
  }, [input, open]);

  // Nhận diện sản phẩm khách đang xem từ URL (/san-pham/<slug>)
  const productSlugMatch = pathname?.match(/^\/san-pham\/([^/]+)/);
  const currentProductSlug = productSlugMatch ? productSlugMatch[1] : null;
  const currentProduct = currentProductSlug ? getProduct(currentProductSlug) : undefined;

  /*
   * MỘT nút nổi duy nhất trên di động: bấm vào mới bung ra Chat AI / Zalo /
   * Messenger. Đừng thêm nút nổi riêng — ba nút chồng nhau ở góc dưới chiếm
   * gần 1/5 chiều cao màn iPhone, đè tên món và che nửa nút "Thêm vào giỏ hàng".
   * Máy tính đủ chỗ nên vẫn giữ nút "Chat tư vấn Kẹo AI" như cũ.
   */
  const [menu, setMenu] = useState(false);
  const viTri = "bottom-4 right-4 sm:bottom-5 sm:right-5";

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

  // Cuộn thông minh: Khi có tin nhắn mới từ AI, cuộn tới ĐẦU tin nhắn đó để khách đọc từ dòng đầu tiên dễ dàng, không bị trôi mất đầu đoạn!
  useEffect(() => {
    if (!open) return;
    if (loading && listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      return;
    }
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, open, loading]);

  const cartSummary = lines
    .map((l) => `${l.product.hang} ${l.product.ten}${l.product.loai ? ` (${l.product.loai.ten})` : ""} x${l.quantity}`)
    .join(", ");

  function sendMessage(textToSend?: string) {
    const clean = (textToSend ?? input).trim();
    if (!clean) return;

    msgCounterRef.current += 1;
    const userMsg: ChatMessage = {
      id: "u_" + msgCounterRef.current,
      role: "user",
      text: clean,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    if (dangChoRef.current) {
      hangChoRef.current.push(clean);
      return;
    }
    void hoiMayChu(clean);
  }

  async function hoiMayChu(clean: string) {
    dangChoRef.current = true;
    setLoading(true);
    const henBaoChoLau = setTimeout(() => setChoLau(true), BAO_CHO_LAU_MS);

    const pageContext = {
      path: pathname || "/",
      title: currentProduct ? `${currentProduct.hang} ${currentProduct.ten} (${formatGia(currentProduct)})` : document.title,
      cartSummary: cartSummary ? `${cartSummary} - Tổng: ${formatVND(total)}` : "Trống",
    };

    let replied = false;
    for (const endpoint of API_ENDPOINTS) {
      if (
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1" &&
        endpoint.includes("localhost")
      ) {
        continue;
      }
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: getSessionId(),
            message: clean,
            pageContext,
          }),
          signal: AbortSignal.timeout(CHO_TRA_LOI_MS),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data?.reply) {
          msgCounterRef.current += 1;
          const replyId = "a_" + msgCounterRef.current;
          setMessages((prev) => [
            ...prev,
            {
              id: replyId,
              role: "assistant",
              text: data.reply,
              qrUrl: data.bankQrUrl || null,
            },
          ]);
          replied = true;
          break;
        }
      } catch {
        // Chuyển sang endpoint tiếp theo hoặc dùng bộ trả lời tức thì
      }
    }

    clearTimeout(henBaoChoLau);
    setChoLau(false);

    if (!replied) {
      const chuyenKhoan = traLoiChuyenKhoan(clean);
      const fallbackText =
        chuyenKhoan?.text ?? buildInstantLocalReply(clean, currentProductSlug, total, cartSummary);
      msgCounterRef.current += 1;
      const fallbackId = "a_" + msgCounterRef.current;
      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          role: "assistant",
          text: fallbackText,
          qrUrl: chuyenKhoan?.qrUrl ?? null,
        },
      ]);
    }

    // Khách nhắn thêm trong lúc chờ → gửi cả cụm thành một tin
    const nhanThem = hangChoRef.current.splice(0);
    if (nhanThem.length) {
      await hoiMayChu(nhanThem.join("\n"));
      return;
    }

    dangChoRef.current = false;
    setLoading(false);
  }

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
    <div className={`fixed ${viTri} z-50 flex flex-col items-end`}>
      {open ? (
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
                onClick={() => setOpen(false)}
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
                      onClick={() => setQrPhongTo(m.qrUrl ?? null)}
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
      ) : (
        <>
          {/* Máy tính: nút "Chat tư vấn Kẹo AI" như cũ */}
          <button
            type="button"
            onClick={() => {
              danhThucMayChu();
              setOpen(true);
            }}
            aria-expanded={open}
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
                    setOpen(true);
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
      )}
      {qrPhongTo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mã QR chuyển khoản phóng to"
          onClick={() => setQrPhongTo(null)}
          className="fixed inset-0 z-[70] flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-black/70 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrPhongTo}
            alt="Mã QR chuyển khoản Kẹo Gaming Shop"
            className="max-h-[80vh] w-auto max-w-full rounded-2xl bg-white p-3 shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setQrPhongTo(null)}
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-fg shadow"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}
