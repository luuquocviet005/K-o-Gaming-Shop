// Kiểm tra nhanh bộ khớp tên thư mục ảnh. Chạy trong `npm run check`.
import assert from "node:assert/strict";
import { timSanPham } from "./lib/khop-ten.mjs";

// Thư mục tên ngắn khít món ĐÃ BÁN, chỉ na ná món đang bán tên dài hơn:
// bằng điểm nhưng bên đã bán ít từ thừa hơn.
const dangBan = [{ hang: "Razer", ten: "Blackwidow v4 75% Pro", slug: "razer-blackwidow-v4-75-pro" }];
const daBan = [{ hang: "Razer", ten: "Blackwidow v4 75%", slug: "razer-blackwidow-v4-75" }];
const voiDangBan = timSanPham("Razer Blackwidow v4 75%", dangBan);
const voiDaBan = timSanPham("Razer Blackwidow v4 75%", daBan);
assert.equal(voiDangBan.diem, voiDaBan.diem);
assert.ok(voiDaBan.thua < voiDangBan.thua);
assert.equal(timSanPham("Razer Blackwidow v4 75% Pro", dangBan).thua, 0);

console.log("✓ Bộ khớp tên ảnh đúng.");
