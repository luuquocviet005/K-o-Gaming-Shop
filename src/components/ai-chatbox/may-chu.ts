import { site } from "@/lib/site";

const API_ENDPOINTS = [site.chatbot.apiMayNha, site.chatbot.api];

// Render miễn phí dậy mất 50–60 giây. Chờ ngắn hơn thế thì câu đầu tiên của
// khách gần như luôn rơi vào trả lời dự phòng.
const CHO_TRA_LOI_MS = 65000;
// Chờ quá lâu thì đổi dòng "đang tra kho" thành lời báo đang khởi động
export const BAO_CHO_LAU_MS = 8000;

/**
 * Render bản miễn phí ngủ sau ~15 phút không ai gọi và mất gần một phút để
 * dậy. Chờ khách gõ xong câu đầu mới gọi thì câu đó gần như chắc chắn rơi vào
 * trả lời dự phòng. Nên vừa mở khung chat là gọi đánh thức luôn.
 */
let daDanhThuc = false;
export function danhThucMayChu() {
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

export type PageContext = { path: string; title: string; cartSummary: string };

/**
 * Hỏi backend chatbot, thử lần lượt từng địa chỉ. Không địa chỉ nào trả lời
 * được thì trả về null để khung chat dùng câu trả lời dự phòng.
 */
export async function hoiBackend(
  message: string,
  pageContext: PageContext,
): Promise<{ reply: string; qrUrl: string | null } | null> {
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
          message,
          pageContext,
        }),
        signal: AbortSignal.timeout(CHO_TRA_LOI_MS),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.reply) return { reply: data.reply, qrUrl: data.bankQrUrl || null };
    } catch {
      // Chuyển sang endpoint tiếp theo
    }
  }
  return null;
}
