/**
 * Sinh public/products/<slug>/chia-se.jpg cho mọi món đã có ảnh.
 *
 *   node scripts/anh-chia-se-san-pham.mjs
 *
 * Đây là ảnh CHỈ dùng cho thẻ xem trước trên Zalo / Messenger / Facebook,
 * khách vào web không bao giờ thấy nó.
 *
 * Vì sao không dùng thẳng ảnh .webp có sẵn:
 *
 *   1. ĐỊNH DẠNG. Ảnh sản phẩm là .webp cho nhẹ. Trình đọc link của Zalo và
 *      Facebook hỗ trợ webp không đồng đều — gặp máy không đọc được là thẻ
 *      mất ảnh, mà lỗi này chỉ lộ ra sau khi đã gửi link cho khách. JPEG thì
 *      chỗ nào cũng đọc được, không phải đoán.
 *
 *   2. TỈ LỆ. Ảnh sản phẩm là hình vuông, còn thẻ xem trước là khung ngang
 *      1200×630. Đưa ảnh vuông vào, Facebook tự cắt hai bên — dễ mất mất nửa
 *      con chuột. Ở đây ảnh được đặt GỌN trong khung (không cắt), phần thừa
 *      lấp bằng màu nền hồng của shop.
 *
 * Chạy lại nhiều lần không tốn công: món nào có chia-se.jpg mới hơn ảnh gốc
 * thì bỏ qua.
 */

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const thuMuc = join(root, "public", "products");

const RONG = 1200;
const CAO = 630;
const NEN = { r: 253, g: 247, b: 249 }; // --bg trong globals.css
const TEN = "chia-se.jpg";

/*
 * Bản thu nhỏ cho THẺ SẢN PHẨM.
 *
 * Ảnh gốc rộng 1400px, còn ô ảnh trong thẻ chỉ 256px — đo trên web thật thấy
 * một tấm nặng tới 190 KB cho một ô bé xíu, riêng trang chủ đã tải 537 KB ảnh.
 * Thừa gấp 4–5 lần.
 *
 * 512px = đủ nét cho màn hình Retina (256 × 2) mà nhẹ hơn cả chục lần.
 *
 * Tên bắt đầu bằng "_" để mọi nơi khác nhận ra ngay đây là ảnh do máy sinh ra,
 * không phải ảnh chụp của shop — sync-sheet dựa vào đó để không tính nhầm nó
 * thành một tấm ảnh của món.
 */
const TEN_NHO = "_nho.webp";
const RONG_NHO = 512;

if (!existsSync(thuMuc)) {
  console.log("Chưa có thư mục ảnh sản phẩm — không có gì để làm.");
  process.exit(0);
}

const muc = await readdir(thuMuc, { withFileTypes: true });
let tao = 0;
let boQua = 0;
let taoNho = 0;
let boQuaNho = 0;

for (const m of muc) {
  if (!m.isDirectory()) continue;

  const thuMucSp = join(thuMuc, m.name);
  const anhs = (await readdir(thuMucSp))
    .filter(
      (f) =>
        /\.(jpe?g|png|webp|avif)$/i.test(f) && f !== TEN && !f.startsWith("_"),
    )
    .sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));

  if (anhs.length === 0) continue;

  const nguon = join(thuMucSp, anhs[0]);

  /** Ảnh phái sinh còn mới hơn ảnh gốc thì khỏi vẽ lại */
  async function conMoi(dich) {
    if (!existsSync(dich)) return false;
    const [a, b] = await Promise.all([stat(nguon), stat(dich)]);
    return b.mtimeMs >= a.mtimeMs;
  }

  const dichChiaSe = join(thuMucSp, TEN);
  if (await conMoi(dichChiaSe)) {
    boQua++;
  } else {
    await sharp(nguon)
      .resize(RONG, CAO, { fit: "contain", background: NEN })
      .flatten({ background: NEN }) // ảnh nền trong suốt -> nền hồng, không ra đen
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dichChiaSe);
    tao++;
  }

  const dichNho = join(thuMucSp, TEN_NHO);
  if (await conMoi(dichNho)) {
    boQuaNho++;
  } else {
    await sharp(nguon)
      // `inside` = thu nhỏ vừa trong khung, giữ nguyên tỉ lệ, KHÔNG cắt xén.
      // Cắt thì mất mất chuôi chuột hay góc bàn phím — thẻ sản phẩm phải cho
      // thấy trọn món hàng.
      .resize(RONG_NHO, RONG_NHO, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dichNho);
    taoNho++;
  }
}

console.log(
  `✓ Ảnh chia sẻ : tạo mới ${tao}, giữ nguyên ${boQua} (public/products/*/${TEN})`,
);
console.log(
  `✓ Ảnh thu nhỏ: tạo mới ${taoNho}, giữ nguyên ${boQuaNho} (public/products/*/${TEN_NHO})`,
);
