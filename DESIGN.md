---
name: Kẹo Gaming Gear (Phiếu kiểm hàng)
description: Hồng pastel làm nền, mực đậm làm chữ và viền, phiếu kiểm hàng có bóng đổ cứng, tem dán nghiêng nhẹ, chữ đơn cách cho giá và nhãn.
colors:
  bg: "#fde9f1"
  surface: "#fff8fb"
  surface-2: "#fbd9e7"
  surface-3: "#f6c3d8"
  fg: "#2a1620"
  fg-muted: "#5c3a4b"
  fg-subtle: "#664253"
  border: "#efb5cb"
  border-strong: "#a8506f"
  primary: "#c2185b"
  primary-hover: "#a31249"
  primary-ink: "#b01654"
  primary-soft: "#f9c9dc"
  candy: "#be123c"
  vi-bacha-nen: "#d3ecdf"
  vi-bacha-chu: "#0a5b43"
  vi-caramel-nen: "#f6e3b4"
  vi-caramel-chu: "#6b4306"
  vi-dau-nen: "#fbd9e5"
  vi-dau-chu: "#a3124f"
  vi-nho-nen: "#e9e0f6"
  vi-nho-chu: "#5b2d9b"
  dai-dam-nen: "#f7a8c4"
  dai-dam-chu: "#2a1620"
  dark-bg: "#1c1218"
  dark-surface: "#271a22"
  dark-primary: "#ff7fb0"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
  body:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
rounded:
  card: "0.75rem"
  pill: "999px"
  focus: "4px"
---

# Design System: Kẹo Gaming Gear (Phiếu kiểm hàng)

> Ghi lại hệ thiết kế đang chạy ở nhánh `giao-dien-moi`, lập ngày 2026-11-09 sau vòng critique và polish. Nguồn chân lý của màu là `src/app/globals.css`; font nằm ở `src/app/khung-trang.tsx`. File này thay bản hiện trạng cũ (Baloo 2 + Inter, hũ kẹo).

## Overview

**Creative North Star: "Bàn soi hàng màu hồng"**

Tiệm đồ gaming cũ, nên giao diện trả lời thẳng câu khách hay hỏi: "tình trạng sao ạ". Mỗi món như một tấm phiếu kiểm hàng đặt trên bàn setup hồng: viền mực, bóng đổ cứng, số liệu bằng chữ đơn cách, tem dán nghiêng nhẹ như dán tay. Màu chủ đạo vẫn là hồng pastel (chủ shop yêu cầu giữ), mực đậm làm chữ và viền.

**Key Characteristics:**
- Nền hồng pastel `#fde9f1`, mảng sáng `#fff8fb`, chữ mực `#2a1620`
- Hồng đậm `#c2185b` chỉ cho nút và chữ nhấn, luôn đi với chữ trắng
- Viền mực 2px + bóng đổ cứng cho phiếu và thẻ; không đổ bóng mờ
- Bố cục xếp lệch tầng như kệ trưng bày, không phải lưới đều
- Có chế độ sáng và tối, đều đạt tương phản WCAG AA (script `check` kiểm)

## Colors

### Primary
- **Hồng mận** (`#c2185b`): nền nút, luôn chữ trắng. Tối: `#ff7fb0` chữ `#2b0713`.
- **Hồng phấn** (`#f9c9dc`, `#fbd9e7`, `#f6c3d8`): mảng nền lớn, chữ mực đè lên.
- **Đỏ kẹo** (`#be123c`): chỉ cho nhãn giảm giá.

### Tình trạng hàng (bốn màu giấy bọc)
- **Bạc hà** (`#d3ecdf` / `#0a5b43`): hàng mới.
- **Caramel** (`#f6e3b4` / `#6b4306`): cũ đủ hộp.
- **Dâu** (`#fbd9e5` / `#a3124f`): cũ không hộp.
- **Nho** (`#e9e0f6` / `#5b2d9b`): dạng khác (kit, đồ rời).

### Neutral
- **Mực** (`#2a1620`): chữ và viền phiếu. **Mận xám** (`#5c3a4b`, `#664253`): chữ phụ.
- **Viền đậm** (`#a8506f`): bóng đổ cứng, nét đứt, chấm bi nền.
- **Khối ghi chú** (`#f7a8c4`, chữ mực): khối "Đây là tiệm bán đồ cũ" dạng bảng ghi chú, không còn là dải tối.

### Named Rules
**Màu tình trạng chỉ để chỉ tình trạng.** Chữ vẫn ghi rõ bên cạnh, không để màu gánh một mình.
**Chữ mực trên mảng hồng lớn.** Hồng đậm + chữ trắng chỉ dành cho nút.

## Typography

- **Display:** Bricolage Grotesque (bộ ký tự vietnamese), tiêu đề.
- **Body:** Be Vietnam Pro, chữ thân, mô tả, chính sách.
- **Mono:** IBM Plex Mono, giá, nhãn tình trạng, tiêu đề phiếu ("MỤC 01"), số lượng.

Chữ nhỏ nhất 12px. Nội dung trang chính sách giới hạn khoảng 68 ký tự mỗi dòng (bản cũ dài tới 111).

## Layout

Khung `container-page` rộng tối đa 84rem, đệm ngang 1rem / 1.5rem / 2rem.
- **Hero:** ba ảnh sản phẩm xếp nghiêng lệch như bàn setup, mascot đứng cạnh, chữ "Gear ngon, giá thật" đè lên.
- **Danh mục:** nút to mỗi loại một màu pastel (`nut-hu`), loại đầu to hơn.
- **"Đáng chú ý":** dải cuộn ngang, thẻ cao theo nội dung nên lệch tầng.
- **Lưới còn lại:** thẻ thứ 2 và thứ 4 hạ xuống một nhịp.

## Elevation & Depth

Không đổ bóng mờ. Chiều sâu bằng bóng đổ cứng một màu:
- Phiếu (`phieu`): viền 2px mực, `box-shadow: 4px 5px 0 var(--border-strong)`.
- Nút chính (`nut-nhan`): bóng `0 4px 0` màu hồng đậm, bấm thì lún xuống 4px.
- Nút danh mục (`nut-hu`): bóng `0 5px 0`, hover nhấc lên 2px, bấm lún 5px.

## Shapes

Bo góc vừa: thẻ và phiếu `0.75rem`, nút lọc và nhãn dạng viên thuốc. Tem giá nghiêng -1.5 độ (`tem-gia`), tem dán nghiêng theo biến `--goc` (`tem-dan`). Nền chấm bi (`nen-cham`) mờ dần xuống dưới.

## Components

### Phiếu tình trạng (trang sản phẩm)
- Viền mực, bóng đổ cứng, tiêu đề chữ đơn cách, các dòng ngăn bằng nét đứt.
- Nhãn tình trạng đóng dấu nghiêng ở góc phải. Chân phiếu: "Cho test trước khi trả tiền · Sai mô tả thì shop chịu".
- Chỉ dùng dữ liệu có thật: hãng, tình trạng, nơi có hàng, số lượng, nhóm. **Chưa có ngày kiểm hay độ mòn** vì Sheet chưa có cột; không bịa.

### Thẻ sản phẩm
- Viền mực, `rounded-xl`, bóng đổ cứng. Giá là tem hồng dâu chữ đơn cách. Ghi chú "Lưu ý" là khối nền hồng nhạt bo tròn (không dùng viền dày một bên).
- Chân thẻ trên mobile: tồn kho một dòng, nhãn "n phân loại" một dòng riêng.

### Buttons
- Chính: hồng mận, chữ trắng, có chiều sâu (`nut-nhan`). Nút "Nhắn chốt món này" và ô chọn số lượng cùng viền mực.

### Form, giỏ hàng, chính sách, liên hệ, 404
- Cùng ngôn ngữ phiếu. Chính sách: mỗi mục một phiếu, ngăn bằng nét đứt. Liên hệ: 7 kênh là 7 phiếu. 404: con dấu "404" nghiêng, mascot đứng trên.

### Chuyển động
- Ảnh trượt vào khi cuộn bằng CSS (`animation-timeline: view()`, không đổi độ mờ). Tắt hoàn toàn khi người dùng bật giảm chuyển động.

## Do's and Don'ts

### Do:
- **Do** giữ hồng pastel làm màu chủ đạo, mực đậm cho chữ và viền.
- **Do** giữ logo, mascot, nhãn loại hàng ở góc thẻ, cả hai chế độ sáng và tối.
- **Do** giữ nguyên câu chữ chính sách và bảo hành; soạn nháp cho chủ shop duyệt trước khi đổi.
- **Do** dùng màu từ token trong `globals.css`, không hardcode hex trong component.

### Don't:
- **Don't** dùng nền kem nâu hay dải nâu mận (đã thử ở bản demo đầu, lệch khỏi hồng pastel).
- **Don't** dùng dải chữ chạy vô tận, sọc kẹo, răng cưa, hiệu ứng nhún nảy `cubic-bezier(0.34, 1.56, 0.64, 1)`, nhãn pill "Đà Nẵng".
- **Don't** dùng viền dày một bên làm điểm nhấn thẻ, gradient tím-xanh, hay thẻ lồng thẻ.
- **Don't** để chữ dưới 12px.
- **Don't** ghi "ngày kiểm" hay "độ mòn" trên phiếu khi dữ liệu chưa có.

## Việc còn lệch
- Giỏ hàng khi có món: đã sửa code, chưa nhìn bằng ảnh chụp vì giỏ lưu trong trình duyệt.
- Phiếu chưa có ngày kiểm và độ mòn vì Sheet chưa có cột. Không bịa.
