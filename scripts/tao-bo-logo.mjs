/**
 * Cắt bộ logo mascot từ một file ảnh gốc nền trắng.
 *
 * Chạy:  node scripts/tao-bo-logo.mjs "D:\\Tạo trang web bán hàng\\logo-goc.png"
 *
 * Ảnh gốc là nhân vật toàn thân, nền trắng đặc. Script làm ba việc:
 *   1. Xoá nền trắng (loang từ mép ảnh vào, nên vùng trắng BÊN TRONG nhân vật
 *      — tròng mắt, vạch áo — vẫn giữ nguyên).
 *   2. Cắt sát nhân vật, xuất bản toàn thân nền trong suốt.
 *   3. Cắt vùng đầu + vai + tay cầm kẹo thành huy hiệu tròn cho header,
 *      favicon và avatar.
 *
 * Vùng cắt huy hiệu khai báo ở CAT_BADGE bên dưới theo TỈ LỆ của khung nhân
 * vật sau khi đã cắt sát — không phải toạ độ pixel tuyệt đối. Làm vậy để đổi
 * ảnh gốc kích thước khác vẫn chạy được.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const NGUON = process.argv[2];
if (!NGUON) {
  console.error("Thiếu đường dẫn ảnh gốc.\nVí dụ: node scripts/tao-bo-logo.mjs \"D:\\\\Tạo trang web bán hàng\\\\logo-goc.png\"");
  process.exit(1);
}

/* Mặc định script chỉ ghi vào thư mục nháp để xem trước. Thêm cờ --apply mới
   chép đè vào public/ và src/app/ — tức là mới đổi logo của web thật. */
const APDUNG = process.argv.includes("--apply");
const RA_PUBLIC = path.join(process.cwd(), "public");
const RA_APP = path.join(process.cwd(), "src", "app");
const RA_NHAP = path.join(process.cwd(), "design", "logo", "mascot-anh");

/** Ghi file nháp; khi có --apply thì ghi thêm vào vị trí thật trên web. */
async function xuat(tenNhap, buf, dichThat) {
  await writeFile(path.join(RA_NHAP, tenNhap), buf);
  if (APDUNG && dichThat) await writeFile(dichThat, buf);
  console.log(`  ${tenNhap}${APDUNG && dichThat ? "  -> " + path.relative(process.cwd(), dichThat) : ""}`);
}

/* Tỉ lệ khung cắt huy hiệu, tính trên khung nhân vật đã cắt sát.
   0 = mép trái/trên, 1 = mép phải/dưới. Chỉnh bốn số này là dịch được khung. */
const CAT_BADGE = { trai: 0.0, tren: 0.0, phai: 1.0, duoi: 0.465 };

/* Icon tab trình duyệt dùng CHUNG khung với logo header — chủ shop chọn vậy để
   giữ cây kẹo mút, thứ gắn với cái tên KẸO. Đánh đổi đã biết trước: ở 32px khuôn
   mặt chỉ còn khoảng 14px nên nhoè. Nếu sau này muốn icon tab rõ mặt hơn thì cắt
   sát mặt bằng khung { trai: 0.13, tren: 0, phai: 0.75, duoi: 0.34 }. */

const HONG_PHAN = { r: 255, g: 228, b: 238, alpha: 1 }; // --primary-soft
const HONG_DAM = "#c2185b"; // --primary

/* Ảnh gốc là JPEG nên quanh nét vẽ có một quầng nhiễu sáng, không phải trắng
   tinh. Vì vậy dùng ngưỡng loang khá lỏng (NGUONG_NEN) để ăn hết quầng đó, rồi
   làm mềm riêng lớp pixel sát biên bằng MEM_TU/MEM_DEN — nếu không, mascot đặt
   lên nền hồng sẽ hiện một viền trắng lởm chởm quanh người.
   Nét viền của nhân vật là nâu đậm (~70-110) nên loang tới 205 vẫn không xuyên
   thủng vào trong. */
const NGUONG_NEN = 205;
const MEM_DEN = 205; // sáng hơn mức này ở lớp biên coi như trong suốt hẳn
const MEM_TU = 140; // tối hơn mức này ở lớp biên coi như đục hẳn

/**
 * Xoá nền trắng bằng cách loang từ mép ảnh. Dùng loang thay vì "mọi pixel
 * trắng đều trong suốt" vì kiểu thứ hai sẽ khoét thủng cả áo trắng và tròng
 * mắt của nhân vật.
 */
async function xoaNenTrang(buf) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const laNen = new Uint8Array(W * H);

  const trang = (i) => {
    const p = i * 4;
    return data[p] >= NGUONG_NEN && data[p + 1] >= NGUONG_NEN && data[p + 2] >= NGUONG_NEN;
  };

  // Hàng đợi phẳng (Int32Array) thay cho mảng JS — ảnh 1024px là hơn 1 triệu
  // pixel, dùng array.push/shift ở cỡ đó chậm thấy rõ.
  const hang = new Int32Array(W * H);
  let dau = 0;
  let cuoi = 0;
  const nap = (i) => {
    if (!laNen[i] && trang(i)) {
      laNen[i] = 1;
      hang[cuoi++] = i;
    }
  };
  for (let x = 0; x < W; x++) {
    nap(x);
    nap((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    nap(y * W);
    nap(y * W + W - 1);
  }
  while (dau < cuoi) {
    const i = hang[dau++];
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) nap(i - 1);
    if (x < W - 1) nap(i + 1);
    if (y > 0) nap(i - W);
    if (y < H - 1) nap(i + W);
  }

  // Lớp pixel đục nằm sát nền: cho alpha giảm dần theo độ sáng, để biên mượt
  // thay vì cắt ngang phát một. Tính trước khi ghi alpha nền, vì phép kiểm tra
  // "kề nền" đọc chính mảng laNen.
  const alphaBien = new Map();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (laNen[i]) continue;
      const keNen =
        (x > 0 && laNen[i - 1]) ||
        (x < W - 1 && laNen[i + 1]) ||
        (y > 0 && laNen[i - W]) ||
        (y < H - 1 && laNen[i + W]);
      if (!keNen) continue;
      const p = i * 4;
      const sang = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
      const t = (MEM_DEN - sang) / (MEM_DEN - MEM_TU);
      alphaBien.set(i, Math.max(0, Math.min(255, Math.round(t * 255))));
    }
  }
  for (let i = 0; i < W * H; i++) if (laNen[i]) data[i * 4 + 3] = 0;
  for (const [i, a] of alphaBien) data[i * 4 + 3] = a;

  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

/** Cắt sát nhân vật, bỏ hết viền trong suốt thừa. */
async function catSat(buf) {
  return sharp(buf).trim({ threshold: 1 }).png().toBuffer();
}

/**
 * Đóng nhiều ảnh PNG vào một file .ico — sharp không xuất được định dạng này.
 *
 * Định dạng ICO cho phép nhét thẳng khối PNG vào thay vì bitmap thô; mọi trình
 * duyệt còn dùng ngày nay đều đọc được. Cấu trúc: 6 byte tiêu đề, rồi mỗi ảnh
 * một mục 16 byte, rồi lần lượt dữ liệu các ảnh.
 */
async function taoIco(nguon, cacCo) {
  const anh = [];
  for (const n of cacCo) anh.push({ n, png: await sharp(nguon).resize(n, n).png({ compressionLevel: 9 }).toBuffer() });

  const dau = Buffer.alloc(6);
  dau.writeUInt16LE(0, 0); // dành riêng, luôn 0
  dau.writeUInt16LE(1, 2); // 1 = icon (2 là con trỏ chuột)
  dau.writeUInt16LE(anh.length, 4);

  let viTri = 6 + anh.length * 16;
  const muc = [];
  for (const { n, png } of anh) {
    const m = Buffer.alloc(16);
    m.writeUInt8(n >= 256 ? 0 : n, 0); // 0 nghĩa là 256
    m.writeUInt8(n >= 256 ? 0 : n, 1);
    m.writeUInt8(0, 2); // số màu bảng màu — 0 vì ảnh nhiều hơn 256 màu
    m.writeUInt8(0, 3);
    m.writeUInt16LE(1, 4); // số lớp
    m.writeUInt16LE(32, 6); // số bit một điểm ảnh
    m.writeUInt32LE(png.length, 8);
    m.writeUInt32LE(viTri, 12);
    viTri += png.length;
    muc.push(m);
  }
  return Buffer.concat([dau, ...muc, ...anh.map((a) => a.png)]);
}

/** Mặt nạ tròn kích thước n×n, dùng để bo huy hiệu. */
function matNaTron(n) {
  return Buffer.from(
    `<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="#fff"/></svg>`,
  );
}

async function main() {
  await mkdir(RA_NHAP, { recursive: true });

  const goc = await sharp(NGUON).png().toBuffer();
  const sach = await catSat(await xoaNenTrang(goc));
  const m = await sharp(sach).metadata();
  console.log(`Nhân vật sau khi cắt sát: ${m.width}×${m.height}`);

  /* Nét vẽ hoạt hình chỉ dùng vài chục màu, nên ép về bảng màu 256 màu giảm
     dung lượng khoảng bốn lần mà nhìn không ra khác biệt (đã soi thử ở mức
     phóng to 2 lần). Ảnh nào cũng nằm trên đường truyền của khách nên đáng. */
  const NEN_CHAT = { compressionLevel: 9, palette: true };

  /* --- 1. Mascot toàn thân, nền trong suốt --- */
  const CAO_FULL = 1200;
  const full = await sharp(sach)
    .resize({ height: CAO_FULL, fit: "inside", withoutEnlargement: false })
    .png(NEN_CHAT)
    .toBuffer();
  await xuat("mascot-toan-than.png", full, path.join(RA_PUBLIC, "mascot.png"));

  /* --- 2. Huy hiệu tròn: đầu + vai + tay cầm kẹo --- */
  /** Cắt một vùng theo tỉ lệ rồi đệm về khung vuông, canh giữa theo bề ngang. */
  const catVuong = async (k) => {
    const cl = Math.round(m.width * k.trai);
    const ct = Math.round(m.height * k.tren);
    const cw = Math.round(m.width * (k.phai - k.trai));
    const ch = Math.round(m.height * (k.duoi - k.tren));
    const canh = Math.max(cw, ch);
    return sharp({
      create: { width: canh, height: canh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([
        {
          input: await sharp(sach).extract({ left: cl, top: ct, width: cw, height: ch }).toBuffer(),
          left: Math.round((canh - cw) / 2),
          top: Math.round((canh - ch) / 2),
        },
      ])
      .png()
      .toBuffer();
  };

  /** Đặt ảnh vuông lên đĩa tròn hồng phấn, chừa mép trong `dem`. */
  const boTron = async (vuong, N, dem) => {
    const trong = Math.round(N * (1 - dem * 2));
    return sharp({ create: { width: N, height: N, channels: 4, background: HONG_PHAN } })
      .composite([
        {
          input: await sharp(vuong)
            .resize(trong, trong, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toBuffer(),
          left: Math.round(N * dem),
          top: Math.round(N * dem),
        },
        { input: matNaTron(N), blend: "dest-in" },
      ])
      .png()
      .toBuffer();
  };

  const vuong = await catVuong(CAT_BADGE);
  const badge = await boTron(vuong, 512, 0.06);
  await xuat("huy-hieu-tron.png", badge);
  /* Bản lên web chỉ cần 160px: ô logo trong header rộng 40px, màn hình dày đặc
     nhất hiện nay là 3 lần nên 120px đã đủ. Đẩy nguyên bản 512px lên là bắt mỗi
     khách tải thừa hơn 260KB ở mọi trang. */
  await xuat("logo-web-160.png", await sharp(badge).resize(160, 160).png(NEN_CHAT).toBuffer(), path.join(RA_PUBLIC, "logo.png"));

  /* --- 3. Icon tab trình duyệt + icon màn hình điện thoại ---
     Cả hai file PHẢI nằm trong src/app/, không phải public/. Next.js chỉ sinh
     thẻ <link rel="icon"> và <link rel="apple-touch-icon"> cho file đặt theo
     quy ước trong thư mục app; để trong public/ thì file vẫn tải được nhưng
     không có thẻ nào trỏ tới, iPhone lưu ra màn hình sẽ dùng ảnh chụp trang. */
  await xuat("favicon-96.png", await sharp(badge).resize(96, 96).png().toBuffer(), path.join(RA_APP, "icon.png"));
  await xuat(
    "apple-icon-180.png",
    await sharp(await boTron(vuong, 180, 0.06)).flatten({ background: HONG_PHAN }).png().toBuffer(),
    path.join(RA_APP, "apple-icon.png"),
  );
  /* favicon.ico phải thay luôn, không bỏ lại bản cũ: Next.js sinh thẻ riêng cho
     nó bên cạnh thẻ của icon.png, mà trình duyệt tự chọn thẻ nào — để lẫn thì
     có máy hiện mascot, có máy vẫn hiện viên kẹo cũ. */
  await xuat("favicon.ico", await taoIco(badge, [16, 32, 48]), path.join(RA_APP, "favicon.ico"));

  /* --- 4. Avatar fanpage / Zalo: vuông 1000, nền đặc (Zalo không nhận alpha) --- */
  await xuat(
    "avatar-fanpage-1000.png",
    await sharp(await boTron(vuong, 1000, 0.07)).flatten({ background: HONG_PHAN }).png().toBuffer(),
  );

  /* --- 5. Ảnh chia sẻ Zalo / Facebook (1200×630) ---
     KHÔNG có chữ trong
     ảnh, vì librsvg lấy font từ hệ điều hành và máy dựng web không chắc có font
     đọc được dấu tiếng Việt. Zalo với Facebook đã hiện tên shop ngay dưới ảnh. */
  const CAO_MASCOT = 500;
  const mascotOg = await sharp(sach).resize({ height: CAO_MASCOT }).png().toBuffer();
  const mOg = await sharp(mascotOg).metadata();
  const nenOg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#fdf7f9"/>
  <rect width="1200" height="22" fill="${HONG_DAM}"/>
  <rect y="608" width="1200" height="22" fill="${HONG_DAM}"/>
  <circle cx="600" cy="330" r="250" fill="#ffe4ee"/>
  ${[
    [180, 150, -22, 1.6],
    [1020, 165, 24, 1.35],
    [1045, 500, -16, 1.6],
    [165, 495, 18, 1.4],
  ]
    .map(
      ([x, y, xoay, to]) => `<g transform="translate(${x} ${y}) rotate(${xoay}) scale(${to})">
      <path d="M-34 0 -47 -14 -43 0 -47 14Z" fill="#ffd9e7"/>
      <path d="M34 0 47 -14 43 0 47 14Z" fill="#ffd9e7"/>
      <ellipse rx="34" ry="21" fill="#ffd9e7"/>
      <ellipse cx="-10" cy="-6" rx="10" ry="5" fill="#ffffff" opacity="0.55"/></g>`,
    )
    .join("\n  ")}
</svg>`;
  await xuat(
    "anh-chia-se.png",
    await sharp(Buffer.from(nenOg))
      .composite([{ input: mascotOg, left: Math.round((1200 - mOg.width) / 2), top: Math.round((630 - CAO_MASCOT) / 2) }])
      .png(NEN_CHAT)
      .toBuffer(),
    path.join(RA_PUBLIC, "anh-chia-se.png"),
  );

  console.log(
    APDUNG
      ? "\nXong — ĐÃ áp dụng vào web thật."
      : "\nXong — mới chỉ xuất bản nháp để xem trước. Thêm --apply mới đổi logo web.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
