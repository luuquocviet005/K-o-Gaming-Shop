/**
 * Dựng ảnh bìa Facebook từ nền do Gemini vẽ + mascot của shop.
 *
 *   node scripts/tao-anh-bia.mjs "<đường dẫn nền>" [file ra]
 *
 * Ba việc:
 *   1. Xoá watermark Gemini và hình phím mờ nằm trong ô Hotline, để chữ địa
 *      chỉ đọc rõ.
 *   2. Ghép mascot vào khoảng trống bên trái, kèm bóng đổ cùng hướng với bóng
 *      của các phím trong ảnh.
 *   3. Cắt và xuất đúng khung ảnh bìa Facebook.
 *
 * Nền phải là bản KHÔNG có nhân vật. Đổi nền khác thì phải đo lại KHUNG_O bên
 * dưới — script tự dò mép ô, nhưng vùng dò thì cố định theo bố cục hiện tại.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const NGUON = process.argv[2];
const RA = process.argv[3] ?? path.join("design", "anh-bia-facebook.png");
if (!NGUON) {
  console.error('Thiếu đường dẫn ảnh nền.\nVí dụ: node scripts/tao-anh-bia.mjs "D:\\\\Tạo trang web bán hàng\\\\Claude Code\\\\bia-moi.png"');
  process.exit(1);
}

const MASCOT = "design/logo/mascot-anh/mascot-toan-than.png";

/* Khung ảnh bìa Facebook: hiển thị 820×312 trên máy tính. Xuất gấp đôi cho nét
   trên màn hình mật độ cao. Điện thoại chỉ hiện phần giữa theo tỉ lệ 640×360,
   nên script báo lại vùng an toàn để còn kiểm tra bằng mắt. */
const RA_RONG = 1640, RA_CAO = 624;
const TI_LE_MOBILE = 640 / 360;

/* Mascot: phần thân từ đỉnh đầu tới ngang đùi chiếm 85% chiều cao tấm bìa,
   phần dưới đùi để lọt ra ngoài mép dưới. Tỉ lệ 379:825 là khung nhân vật gốc
   sau khi cắt sát. */
const MASCOT_TI_LE_CAO = 0.85;
const MASCOT_TRAI = 0.1357; // vị trí ngang, tính theo bề ngang tấm bìa
const MASCOT_KHUNG = 379 / 825;

/* Bóng đổ: nguồn sáng trong ảnh ở trên bên phải nên bóng ngả xuống bên trái. */
const BONG = { dx: -30, dy: 22, nhoe: 22, dam: 0.34, mau: { r: 60, g: 32, b: 44 } };

/* Vùng dò ô Hotline. Ô có nền sáng đều (độ sáng ~221) nằm hẳn trên nền mặt bàn
   tối hơn (~175), nên dò mép bằng ngưỡng độ sáng là đủ chắc. */
const DO_O = { x0: 2300, x1: 3360, y0: 760, y1: 1270 };
const O_SANG = 200;   // sáng hơn mức này trong ô: nền ô, watermark, phím mờ
const CHU_TOI = 150;  // tối hơn mức này: chữ và icon, phải giữ nguyên
const O_LE = 10;      // chừa mép để không đụng góc bo của ô

async function doVungO(data, W, H) {
  const L = (x, y) => {
    const p = (y * W + x) * 4;
    return (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
  };
  // hàng có dải sáng liên tục dài nhất chính là hàng cắt ngang thân ô
  let tot = null;
  for (let y = DO_O.y0; y <= Math.min(DO_O.y1, H - 1); y += 4) {
    let cur = 0, curA = -1, dai = 0, a = -1, b = -1;
    for (let x = DO_O.x0; x < Math.min(DO_O.x1, W); x++) {
      if (L(x, y) > O_SANG) {
        if (cur === 0) curA = x;
        cur++;
        if (cur > dai) { dai = cur; a = curA; b = x; }
      } else cur = 0;
    }
    if (dai > 300 && (!tot || dai > tot.dai)) tot = { y, dai, a, b };
  }
  if (!tot) return null;
  /* Không dò mép trên/dưới bằng một cột đơn: cột nào cũng có thể vướng chữ và
     dừng sớm giữa ô. Xét cả bề ngang ô — hàng nào quá nửa số điểm là nền sáng
     thì vẫn còn nằm trong ô, dù có chữ cắt ngang. */
  const trongO = (y) => {
    let s = 0, n = 0;
    for (let x = tot.a; x <= tot.b; x += 3) { n++; if (L(x, y) > O_SANG) s++; }
    return s / n > 0.5;
  };
  let t = tot.y, d = tot.y;
  while (t > DO_O.y0 && trongO(t - 1)) t--;
  while (d < H - 1 && trongO(d + 1)) d++;
  return { x0: tot.a, x1: tot.b, y0: t, y1: d };
}

async function main() {
  const { data, info } = await sharp(NGUON).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  console.log(`Nền: ${W}×${H} (tỉ lệ ${(W / H).toFixed(3)})`);

  const ra = Buffer.from(data);

  /* --- 1. Làm sạch ô Hotline --- */
  const o = await doVungO(data, W, H);
  if (!o) {
    console.warn("! Không dò được ô Hotline — bỏ qua bước xoá watermark.");
  } else {
    console.log(`Ô Hotline: x ${o.x0}-${o.x1}, y ${o.y0}-${o.y1}`);
    // màu nền ô = trung vị các điểm sáng bên trong
    const mau = [[], [], []];
    for (let y = o.y0 + O_LE; y <= o.y1 - O_LE; y += 3)
      for (let x = o.x0 + O_LE; x <= o.x1 - O_LE; x += 3) {
        const p = (y * W + x) * 4;
        const l = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
        if (l > 215) for (let c = 0; c < 3; c++) mau[c].push(data[p + c]);
      }
    const nenO = mau.map((v) => { v.sort((a, b) => a - b); return v[v.length >> 1]; });
    console.log(`  Màu nền ô: rgb(${nenO.join(",")}) từ ${mau[0].length} mẫu`);

    /* Trộn mềm theo độ sáng thay vì cắt ngưỡng cứng: chữ có khử răng cưa, cắt
       cứng sẽ để lại viền rỗ quanh từng nét. */
    let doi = 0;
    for (let y = o.y0 + O_LE; y <= o.y1 - O_LE; y++)
      for (let x = o.x0 + O_LE; x <= o.x1 - O_LE; x++) {
        const p = (y * W + x) * 4;
        const l = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
        if (l < CHU_TOI) continue;
        const giu = Math.max(0, Math.min(1, (O_SANG - l) / (O_SANG - CHU_TOI)));
        for (let c = 0; c < 3; c++) ra[p + c] = Math.round(data[p + c] * giu + nenO[c] * (1 - giu));
        if (giu < 0.98) doi++;
      }
    console.log(`  Đã làm phẳng ${doi} px nền ô (xoá watermark và phím mờ)`);

    /* Watermark nằm ĐÈ lên chữ nên nó không chỉ thêm một hình mờ, nó còn làm
       phai chính nét chữ bên dưới. Xoá xong thì "KĐT" vẫn xám nhạt trong khi
       chữ xung quanh đen. Nên khoanh lại đúng chỗ watermark từng phủ rồi kéo
       tương phản chữ ở đó về bằng phần còn lại. */
    const nenL = (nenO[0] * 299 + nenO[1] * 587 + nenO[2] * 114) / 1000;
    let wx0 = W, wx1 = -1, wy0 = H, wy1 = -1, wn = 0;
    for (let y = o.y0 + O_LE; y <= o.y1 - O_LE; y++)
      for (let x = o.x0 + O_LE; x <= o.x1 - O_LE; x++) {
        const p = (y * W + x) * 4;
        const l = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
        if (l > nenL + 7) { wn++; if (x < wx0) wx0 = x; if (x > wx1) wx1 = x; if (y < wy0) wy0 = y; if (y > wy1) wy1 = y; }
      }
    if (wn > 200) {
      const LE = 8;
      wx0 = Math.max(o.x0, wx0 - LE); wx1 = Math.min(o.x1, wx1 + LE);
      wy0 = Math.max(o.y0, wy0 - LE); wy1 = Math.min(o.y1, wy1 + LE);
      const K = 2.6; // 150 (chữ bị phai) -> ~25 (chữ bình thường)
      let dam = 0;
      for (let y = wy0; y <= wy1; y++)
        for (let x = wx0; x <= wx1; x++) {
          const p = (y * W + x) * 4;
          const l = (ra[p] * 299 + ra[p + 1] * 587 + ra[p + 2] * 114) / 1000;
          if (l >= O_SANG) continue; // nền, đã phẳng rồi
          /* Chỉ đụng nét chữ TRUNG TÍNH. Chữ "Hotline"/"Address" và hai icon
             tròn màu nâu đỏ thương hiệu: nhân hệ số lên cả ba kênh sẽ đẩy kênh
             lục và lam xuống 0 và biến chúng thành đen. */
          const mx = Math.max(ra[p], ra[p + 1], ra[p + 2]);
          const mn = Math.min(ra[p], ra[p + 1], ra[p + 2]);
          if (mx - mn > 22) continue;
          for (let c = 0; c < 3; c++)
            ra[p + c] = Math.max(0, Math.round(nenO[c] - (nenO[c] - ra[p + c]) * K));
          dam++;
        }
      console.log(`  Watermark từng phủ x ${wx0}-${wx1}, y ${wy0}-${wy1} — đã kéo lại độ đậm cho ${dam} px chữ`);
    }
  }

  /* --- 2. Ghép mascot --- */
  const hien = Math.round(H * MASCOT_TI_LE_CAO);
  const toanCao = Math.round(hien / 0.816); // 0.816 = tỉ lệ từ đỉnh đầu tới ngang đùi
  const toanRong = Math.round(toanCao * MASCOT_KHUNG);
  const left = Math.round(W * MASCOT_TRAI);
  const top = H - hien;

  const full = await sharp(MASCOT).resize(toanRong, toanCao, { kernel: "lanczos3" }).png().toBuffer();
  const mas = await sharp(full).extract({ left: 0, top: 0, width: toanRong, height: hien }).png().toBuffer();

  const caoBong = Math.min(hien, H - (top + BONG.dy));
  // .raw() là bắt buộc: thiếu nó sharp trả về PNG đã nén, mà joinChannel bên
  // dưới lại được bảo là nhận dữ liệu thô nên báo sai kích thước vùng nhớ.
  const alphaBong = await sharp(mas).extractChannel(3).blur(BONG.nhoe).linear(BONG.dam, 0).raw().toBuffer();
  const bongDay = await sharp({ create: { width: toanRong, height: hien, channels: 3, background: BONG.mau } })
    .joinChannel(alphaBong, { raw: { width: toanRong, height: hien, channels: 1 } })
    .png()
    .toBuffer();
  const bong = await sharp(bongDay).extract({ left: 0, top: 0, width: toanRong, height: caoBong }).png().toBuffer();

  const nenSach = await sharp(ra, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const ghep = await sharp(nenSach)
    .composite([
      { input: bong, left: left + BONG.dx, top: top + BONG.dy },
      { input: mas, left, top },
    ])
    .png()
    .toBuffer();
  console.log(`Mascot: ${toanRong}×${toanCao}, phần hiện cao ${hien}, đặt tại (${left}, ${top})`);

  /* --- 3. Cắt đúng khung rồi xuất --- */
  const caoDung = Math.round(W / (RA_RONG / RA_CAO));
  const cat = Math.max(0, Math.floor((H - caoDung) / 2));
  const cuoi = await sharp(ghep)
    .extract({ left: 0, top: cat, width: W, height: Math.min(caoDung, H - cat) })
    .resize(RA_RONG, RA_CAO, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(RA, cuoi);

  /* Cảnh báo vùng an toàn: điện thoại chỉ hiện phần giữa theo tỉ lệ 640×360. */
  const anToanRong = Math.round(RA_CAO * TI_LE_MOBILE);
  const bien = Math.round((RA_RONG - anToanRong) / 2);
  const masTraiRa = Math.round((left / W) * RA_RONG);
  const masPhaiRa = Math.round(((left + toanRong) / W) * RA_RONG);
  console.log(`\n${RA} — ${RA_RONG}×${RA_CAO}, ${(cuoi.length / 1024).toFixed(0)} KB`);
  console.log(`Vùng điện thoại còn thấy: x ${bien}-${RA_RONG - bien} (cắt ${bien}px mỗi bên)`);
  console.log(`Mascot nằm ở x ${masTraiRa}-${masPhaiRa}` + (masTraiRa < bien ? ` — hụt ${bien - masTraiRa}px bên trái trên điện thoại` : " — trọn trong vùng an toàn"));
}

main().catch((e) => { console.error(e); process.exit(1); });
