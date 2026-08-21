/**
 * Xác minh WEB THẬT đã nhận bản vừa đẩy lên chưa.
 *
 * VÌ SAO CẦN: `git push` xanh KHÔNG có nghĩa là web đã cập nhật. Còn một chặng
 * nữa — Hostinger tự kéo code về rồi build lại. Chặng đó đứng thì mọi thứ phía
 * máy này vẫn báo thành công: push xanh, bảng hàng đã đồng bộ, ảnh đã nén — mà
 * khách vào web vẫn thấy bản cũ. Đã xảy ra thật: hàng thêm vào Sheet hơn một
 * ngày không lên web, và không đâu báo cho biết cả.
 *
 * CÁCH LÀM: trước khi commit, ghi một cái mốc vào `public/version.txt`. Đẩy
 * lên xong thì hỏi lại chính web thật xem file đó đã mang mốc mới chưa. Đúng
 * mốc nghĩa là web đã dựng lại từ commit này — chắc chắn, không phải suy đoán.
 *
 * VÌ SAO KHÔNG HỎI GITHUB ACTIONS NHƯ TRƯỚC: bản cũ hỏi workflow FTP
 * (deploy-hostinger.yml). Workflow đó đã cố ý tắt từ 20/8/2026 vì Hostinger
 * deploy theo đường riêng — nên nó canh một con đường KHÔNG còn ai đi, và lần
 * chạy hỏng cuối cùng thì đứng yên đó mãi, đẻ ra một dòng báo động giả ở mỗi
 * lần push. Canh sai chỗ còn tệ hơn không canh: báo động giả lặp mãi thì tới
 * lần hỏng thật cũng bị lướt qua.
 */

import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";

/** Tên file mốc, đặt trong public/ nên web thật phục vụ ở ngay gốc tên miền */
const TEN_FILE = "version.txt";

/** Địa chỉ web thật — lấy từ src/lib/site.ts để chỉ khai báo một chỗ duy nhất */
async function docDiaChiWeb(root) {
  try {
    const ts = await readFile(join(root, "src", "lib", "site.ts"), "utf8");
    return ts.match(/url:\s*"([^"]+)"/)?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * Ghi mốc phiên bản vào public/version.txt.
 *
 * CHỈ gọi khi đã chắc chắn có thứ khác để commit. Gọi vô tội vạ thì lượt tự
 * động 15 phút nào cũng có một file đổi, thành ra lượt nào cũng commit và
 * deploy lại — mỗi ngày gần trăm lần dựng web mà chẳng có gì mới.
 *
 * @returns {Promise<string>} mốc vừa ghi
 */
export async function ghiMocPhienBan(root) {
  const moc = new Date().toISOString();
  await writeFile(join(root, "public", TEN_FILE), `${moc}\n`, "utf8");
  return moc;
}

/**
 * Hỏi web thật cho tới khi thấy đúng mốc, hoặc hết giờ chờ.
 *
 * Hỏng thì trả về kết quả bình thường chứ không ném lỗi: việc này chỉ để BÁO
 * TIN, không được phép làm hỏng một lệnh push vốn đã thành công.
 *
 * @returns {Promise<{xong: boolean, ly_do: string, giay: number, dia_chi: string|null}>}
 */
export async function doiWebCapNhat(
  root,
  moc,
  { hanMs = 5 * 60 * 1000, cachNhauMs = 15 * 1000 } = {},
) {
  const goc = await docDiaChiWeb(root);
  const batDau = Date.now();
  const giay = () => Math.round((Date.now() - batDau) / 1000);

  if (!goc) {
    return { xong: false, ly_do: "khong-biet-dia-chi", giay: 0, dia_chi: null };
  }

  const diaChi = `${goc}/${TEN_FILE}`;

  while (Date.now() - batDau < hanMs) {
    try {
      // `cache: no-store` + tham số ngẫu nhiên: CDN của Hostinger giữ bản cũ
      // thì mình lại tưởng web chưa cập nhật trong khi nó cập nhật rồi.
      const res = await fetch(`${diaChi}?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok && (await res.text()).trim() === moc) {
        return { xong: true, ly_do: "khop", giay: giay(), dia_chi: diaChi };
      }
    } catch {
      /* mạng chập chờn hoặc web đang dựng lại — cứ thử tiếp */
    }
    await new Promise((r) => setTimeout(r, cachNhauMs));
  }

  return { xong: false, ly_do: "het-gio", giay: giay(), dia_chi: diaChi };
}
