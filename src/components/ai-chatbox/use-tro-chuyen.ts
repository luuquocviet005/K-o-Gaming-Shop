import { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { formatGia, formatVND } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { BAO_CHO_LAU_MS, hoiBackend } from "./may-chu";
import { buildInstantLocalReply, traLoiChuyenKhoan } from "./tra-loi-du-phong";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  qrUrl?: string | null;
};

/**
 * Trạng thái cuộc trò chuyện. Nằm ở cấp nút nổi (không phải trong khung chat)
 * để đóng khung chat rồi mở lại vẫn còn nguyên tin nhắn và chữ đang gõ dở.
 */
export function useTroChuyen(
  pathname: string | null,
  currentProductSlug: string | null,
  currentProduct: Product | undefined,
) {
  const { lines, total } = useCart();
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
  const msgCounterRef = useRef(1);

  /*
   * Khách hay nhắn rời từng mẩu: tên, rồi SĐT, rồi địa chỉ. Nên KHÔNG khoá ô
   * nhập lúc đang chờ trả lời (khoá thì khách gõ xong không gửi được, tưởng web
   * lỗi): tin nhắn hiện ngay, gom vào hàng chờ, trả lời xong câu trước thì gửi
   * cả cụm còn lại một lượt.
   */
  const dangChoRef = useRef(false);
  const hangChoRef = useRef<string[]>([]);

  const cartSummary = lines
    .map((l) => `${l.product.hang} ${l.product.ten}${l.product.loai ? ` (${l.product.loai.ten})` : ""} x${l.quantity}`)
    .join(", ");

  function themTinTroLy(text: string, qrUrl: string | null) {
    msgCounterRef.current += 1;
    const id = "a_" + msgCounterRef.current;
    setMessages((prev) => [...prev, { id, role: "assistant", text, qrUrl }]);
  }

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

    const traLoi = await hoiBackend(clean, {
      path: pathname || "/",
      title: currentProduct ? `${currentProduct.hang} ${currentProduct.ten} (${formatGia(currentProduct)})` : document.title,
      cartSummary: cartSummary ? `${cartSummary} - Tổng: ${formatVND(total)}` : "Trống",
    });

    clearTimeout(henBaoChoLau);
    setChoLau(false);

    if (traLoi) {
      themTinTroLy(traLoi.reply, traLoi.qrUrl);
    } else {
      const chuyenKhoan = traLoiChuyenKhoan(clean);
      themTinTroLy(
        chuyenKhoan?.text ?? buildInstantLocalReply(clean, currentProductSlug, total, cartSummary),
        chuyenKhoan?.qrUrl ?? null,
      );
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

  return { messages, input, setInput, loading, choLau, sendMessage };
}

export type TroChuyen = ReturnType<typeof useTroChuyen>;
