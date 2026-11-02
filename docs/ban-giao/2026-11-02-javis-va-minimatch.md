# Vá cảnh báo lỗ hổng minimatch trên hPanel — javis, 02/11/2026

**Nhánh / PR:** `javis/va-minimatch`

## Đã làm
- hPanel > Bảo mật > Lỗ hổng báo 2 lỗ hổng mức "Kiểm duyệt": CVE-2026-118764 (GHSA-g3hv-75wg-m249) ở `minimatch@3.1.5` và `@10.2.6`, bản vá chỉ có từ 11.0.1.
- Chỉ ESLint và các plugin lint kéo `minimatch` vào. Bản mới nhất của `eslint` và `eslint-config-next` vẫn dùng minimatch 10, nên nâng ESLint không hết lỗi.
- `package.json` thêm `overrides: { minimatch: "^11.0.1" }`, cài lại lock. `npm audit` còn 0 lỗ hổng.
- Đã chạy typecheck, lint, build, check đều xanh. Thử lint một file lỗi cố ý: vẫn bắt đủ cảnh báo của typescript-eslint, next và jsx-a11y.

## Còn dở / cần chủ shop quyết
- Không có.

## AI sau cần biết
- Ghi chú ở `docs/kien-thuc/deploy-va-kiem-tra.md` mục "Bộ kiểm tra": khi ESLint tự dùng minimatch >= 11.0.1 thì bỏ `overrides`.
