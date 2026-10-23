/**
 * Luật ESLint riêng của shop — "rào chắn cứng".
 *
 * Luật chỉ ghi trong AGENTS.md là rào chắn mềm: AI đọc rồi vẫn có thể quên.
 * Luật nào đã phải nhắc AI tới lần thứ hai thì chuyển vào đây, để `npm run lint`
 * (và workflow kiểm tra PR) chặn luôn, AI phải tự sửa mới qua được.
 */

/**
 * Chú thích chỉ ghi điều CÒN ĐÚNG về code: quy tắc, lý do, hậu quả nếu làm
 * khác. Ngày tháng, câu kể chuyện cũ, số PR, mã commit là lịch sử — chỗ của nó là
 * git log và docs/ban-giao/. Để trong code thì nó cũ đi mà không ai sửa, và AI
 * sau đọc một lời dặn của một lần sửa rồi hiểu thành luật vĩnh viễn.
 */
const MAU_LICH_SU = [
  { re: /\b\d{1,2}\/\d{1,2}\/20\d{2}\b/, ten: "ngày tháng" },
  { re: /\b20\d{2}-\d{2}-\d{2}\b/, ten: "ngày tháng" },
  { re: /trước đây/i, ten: "\"trước đây…\"" },
  { re: /\bPR\s*#\d+/, ten: "số Pull Request" },
  { re: /\bcommit\s+[0-9a-f]{7,40}\b/i, ten: "mã commit" },
];

const khongChuThichLichSu = {
  meta: {
    type: "suggestion",
    docs: { description: "Cấm chú thích kể lịch sử (ngày tháng, \"trước đây\", số PR)" },
    schema: [],
    messages: {
      lichSu:
        "Chú thích có {{ten}} — đây là lịch sử, ghi vào lời nhắn commit hoặc docs/ban-giao/. Trong code chỉ giữ quy tắc còn đúng và lý do của nó.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const c of context.sourceCode.getAllComments()) {
          // Bỏ qua chỉ thị của công cụ (eslint-disable…, @ts-…).
          if (/^\s*(eslint|@ts-)/.test(c.value)) continue;
          const trung = MAU_LICH_SU.find((m) => m.re.test(c.value));
          if (trung) {
            context.report({ loc: c.loc, messageId: "lichSu", data: { ten: trung.ten } });
          }
        }
      },
    };
  },
};

/**
 * SĐT, link Zalo/Messenger/Facebook/TikTok, email của shop chỉ nằm ở
 * src/lib/site.ts. Viết cứng ở component thì đổi số là sót chỗ, khách gọi
 * nhầm số cũ.
 */
const MAU_LIEN_HE = [
  /\b0\d{2,3}[ .]?\d{3}[ .]?\d{3}\b/, // số điện thoại
  /tel:[\d+]/,
  /zalo\.me\/\w/,
  /m\.me\/\w/,
  /facebook\.com\/\w/,
  /tiktok\.com\/@/,
  /[\w.]+@[\w-]+\.(com|vn|net)\b/, // email
];

const khongVietCungLienHe = {
  meta: {
    type: "problem",
    docs: { description: "Cấm viết cứng thông tin liên hệ ngoài src/lib/site.ts" },
    schema: [],
    messages: {
      lienHe: "Thông tin liên hệ viết cứng — lấy từ `site` trong src/lib/site.ts.",
    },
  },
  create(context) {
    function soi(node, chu) {
      if (typeof chu === "string" && MAU_LIEN_HE.some((re) => re.test(chu))) {
        context.report({ node, messageId: "lienHe" });
      }
    }
    return {
      Literal: (node) => soi(node, node.value),
      TemplateElement: (node) => soi(node, node.value.raw),
      JSXText: (node) => soi(node, node.value),
    };
  },
};

export const luatShop = {
  rules: {
    "khong-chu-thich-lich-su": khongChuThichLichSu,
    "khong-viet-cung-lien-he": khongVietCungLienHe,
  },
};
