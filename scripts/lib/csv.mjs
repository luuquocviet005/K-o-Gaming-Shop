/**
 * Bộ đọc CSV tối giản nhưng đúng chuẩn RFC 4180.
 *
 * Không dùng thư viện ngoài vì file này chạy trong GitHub Actions — càng ít
 * phụ thuộc càng ít thứ có thể hỏng lúc 3 giờ sáng.
 *
 * Xử lý đúng các trường hợp Google Sheets hay sinh ra:
 *   - Ô có dấu phẩy:      "Chuột, bàn phím"
 *   - Ô có dấu nháy kép:  "Màn hình 27"" 4K"   (nháy kép nhân đôi)
 *   - Ô xuống dòng:       "Dòng 1\nDòng 2"
 *   - Kết thúc dòng kiểu Windows (\r\n)
 */
export function parseCsv(text) {
  // Bỏ BOM nếu có — Google Sheets thỉnh thoảng chèn vào đầu file
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'; // nháy kép nhân đôi = một dấu nháy thật
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // bỏ qua, \n ngay sau sẽ kết thúc dòng
    } else {
      field += c;
    }
  }

  // Dòng cuối không có ký tự xuống dòng
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Bỏ các dòng trống hoàn toàn (Google Sheets hay để thừa hàng trắng cuối bảng)
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/**
 * Chuyển bảng CSV thành mảng object, khoá là tiêu đề cột.
 * Tiêu đề được chuẩn hoá (bỏ dấu, thường hoá) để "Giá bán", "gia ban",
 * "GIÁ BÁN" đều tra cứu được như nhau.
 */
export function toRecords(rows) {
  if (rows.length < 2) return { headers: [], records: [] };

  const rawHeaders = rows[0].map((h) => h.trim());
  const keys = rawHeaders.map(normalizeHeader);

  const records = rows.slice(1).map((r, i) => {
    const obj = { __dong: i + 2 }; // số dòng thật trong Sheet, để báo lỗi
    keys.forEach((k, j) => {
      if (k) obj[k] = (r[j] ?? "").trim();
    });
    return obj;
  });

  return { headers: rawHeaders, keys, records };
}

/** "Giá gốc (VNĐ)" -> "gia goc vnd" */
export function normalizeHeader(h) {
  return h
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
