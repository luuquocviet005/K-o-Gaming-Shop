# Graph Report - keo-gaming-shop  (2026-09-19)

## Corpus Check
- Large corpus: 507 files · ~1,442,073 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 537 nodes · 1010 edges · 36 communities (31 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 84,307 input · 0 output

## Community Hubs (Navigation)
- Next.js Pages & Routing
- Build Config & Dependencies
- Deploy & Sheet Sync Workflows
- Sold-Stock & Sheet Sync Scripts
- Root Layout & Theming
- Product Image Loader
- Icon Library
- Logo & Cover Image Generators
- Contact Page & Footer
- TypeScript Config
- Mascot SVG Builder
- Deploy Check & Git Push
- Sheet Data Normalization
- Policy & Cart Pages
- Automation Scheduler
- Header & Theme Toggle
- CSV & Google Sheet Reader
- Broken Link Checker
- SEO Metadata Audit
- Lock File & Manual Runner
- Logo Design Guidelines
- Post-Build Report
- Cart UI Components
- Marquee & Contact Widgets
- Color Contrast Checker
- Product Placeholder Art
- Share Image Generator
- Product Name Matching
- Search Box
- Gallery Navigation Icons
- Candy Confetti Effect
- Mascot Gallery Page
- Contact Form Logic
- Image Gallery Slider
- Robots.txt Route
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `next` - 23 edges
2. `site` - 18 edges
3. `compilerOptions` - 16 edges
4. `boDau()` - 14 edges
5. `react` - 13 edges
6. `toCard()` - 13 edges
7. `formatVND()` - 12 edges
8. `formatGia()` - 12 edges
9. `scripts` - 11 edges
10. `useCart()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Hình minh hoạ vector khi thiếu ảnh thật` --semantically_similar_to--> `Build thử trước khi commit`  [INFERRED] [semantically similar]
  README.md → .github/workflows/dong-bo-sheet.yml
- `Bản cắt tròn cho cỡ nhỏ / favicon` --semantically_similar_to--> `Tương phản WCAG AA (--primary tối thiểu 4.5:1)`  [INFERRED] [semantically similar]
  design/logo/README.md → README.md
- `scripts/sync-sheet.mjs (bước Đọc Google Sheet)` --calls--> `scripts/lib/normalize.mjs — chuẩn hoá giá và tình trạng`  [INFERRED]
  .github/workflows/dong-bo-sheet.yml → README.md
- `scripts/sync-sheet.mjs (bước Đọc Google Sheet)` --references--> `sync.config.json — ánh xạ tab Sheet sang danh mục`  [INFERRED]
  .github/workflows/dong-bo-sheet.yml → README.md
- `Workflow Build & Deploy lên Hostinger` --shares_data_with--> `scripts/postbuild.mjs copy deploy/.htaccess vào out/`  [INFERRED]
  .github/workflows/deploy-hostinger.yml → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Đường ống Sheet → JSON → commit → Hostinger deploy** — readme_google_sheet_source_of_truth, _github_workflows_dong_bo_sheet_sync_sheet_script, _github_workflows_dong_bo_sheet_products_json, _github_workflows_dong_bo_sheet_dong_bo_sheet_workflow, _github_workflows_deploy_hostinger_hostinger_auto_deploy [EXTRACTED 1.00]
- **Một bộ màu dùng chung cho web và logo** — readme_globals_css_theme_tokens, design_logo_readme_bang_mau_logo, readme_contrast_wcag_aa, design_logo_readme_mascot_keo [INFERRED 0.85]
- **Cơ chế khớp ảnh với sản phẩm** — public_products_readme_quy_tac_dat_ten_anh, public_products_readme_cot_anh_uu_tien, readme_anh_san_pham_tu_dong, readme_placeholder_vector [EXTRACTED 1.00]

## Communities (36 total, 5 thin omitted)

### Community 0 - "Next.js Pages & Routing"
Cohesion: 0.06
Nodes (61): nextConfig, next, AllProductsPage(), metadata, CategoryPage(), generateMetadata(), Props, NotFound() (+53 more)

### Community 1 - "Build Config & Dependencies"
Cohesion: 0.05
Nodes (41): eslintConfig, dependencies, next, react, react-dom, devDependencies, eslint, eslint-config-next (+33 more)

### Community 2 - "Deploy & Sheet Sync Workflows"
Cohesion: 0.07
Nodes (31): Workflow Build & Deploy lên Hostinger, Bước đẩy lên Hostinger qua FTP (FTP-Deploy-Action), FTP_SERVER / FTP_USERNAME / FTP_PASSWORD secrets, Hostinger tự kéo code từ GitHub và deploy, Tắt tự chạy deploy workflow — cố ý, Build thử trước khi commit, Commit kèm da-ban.json cùng products.json, src/data/da-ban.json (kho hàng đã bán) (+23 more)

### Community 3 - "Sold-Stock & Sheet Sync Scripts"
Cohesion: 0.08
Nodes (26): ref_node_fs, capNhatKho(), docKhoDaBan(), ghiKho(), rutGon(), anhTheoThuMuc, boSlug, canhBao (+18 more)

### Community 4 - "Root Layout & Theming"
Cohesion: 0.08
Nodes (21): src_app_globals, baloo, inter, jsonLdCuaHang, metadata, viewport, AddToCartButton(), DoLienHe() (+13 more)

### Community 5 - "Product Image Loader"
Cohesion: 0.09
Nodes (20): ref_node_os, boQua, cache, cacheMoi, cuaHangDaBan, daBan, daNhan, dong (+12 more)

### Community 7 - "Logo & Cover Image Generators"
Cohesion: 0.12
Nodes (18): sharp, BONG, DO_O, doVungO(), main(), OG, APDUNG, CAT_BADGE (+10 more)

### Community 8 - "Contact Page & Footer"
Cohesion: 0.15
Nodes (13): channels, metadata, Errors, Fields, policies, socials, ClockIcon(), MailIcon() (+5 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "Mascot SVG Builder"
Cohesion: 0.18
Nodes (9): badge(), figure(), keyboard(), limb(), Cắt tròn quanh đầu và cây kẹo — dùng cho favicon, avatar., Mascot KẸO Gaming Gear — bám nguyên bố cục bản phác: cậu bé đứng ôm bàn phím…, Bàn phím cơ nghiêng, đầu phải hếch lên như bản gốc., shoe() (+1 more)

### Community 11 - "Deploy Check & Git Push"
Cohesion: 0.20
Nodes (12): docDiaChiWeb(), docMocTrenWeb(), doiWebCapNhat(), ghiMocPhienBan(), custom, goRebaseKet(), now, { out: ahead } (+4 more)

### Community 12 - "Sheet Data Normalization"
Cohesion: 0.24
Nodes (13): BANG_MAU, boDau(), chuanTenFile(), docAnh(), docGia(), docMotMocGia(), docSoNguyen(), docTinhTrang() (+5 more)

### Community 13 - "Policy & Cart Pages"
Cohesion: 0.18
Nodes (6): metadata, sections, metadata, Breadcrumbs(), Crumb, CartView()

### Community 14 - "Automation Scheduler"
Cohesion: 0.17
Nodes (8): config, day, dongBo, khongCoGiMoi, napAnh, root, webChuaLen, webDaLen

### Community 15 - "Header & Theme Toggle"
Cohesion: 0.18
Nodes (9): ChevronDownIcon(), GridIcon(), MenuIcon(), MoonIcon(), SearchIcon(), SunIcon(), THEME_KEY, themeInitScript (+1 more)

### Community 16 - "CSV & Google Sheet Reader"
Cohesion: 0.25
Nodes (8): RFC-4180, csvUrl, { headers, keys, records }, rows, normalizeHeader(), parseCsv(), toRecords(), taiTab()

### Community 17 - "Broken Link Checker"
Cohesion: 0.18
Nodes (9): broken, external, fileSet, htmlFiles, missing, out, required, root (+1 more)

### Community 18 - "SEO Metadata Audit"
Cohesion: 0.20
Nodes (8): descs, dupDescs, dupTitles, out, problems, root, titles, walk()

### Community 19 - "Lock File & Manual Runner"
Cohesion: 0.28
Nodes (6): ref_node_child_process, ref_node_path, duongDan, giuKhoa(), root, thuMuc

### Community 20 - "Logo Design Guidelines"
Cohesion: 0.25
Nodes (8): Bản cắt tròn cho cỡ nhỏ / favicon, Bảng màu logo (khớp globals.css, không thêm màu mới), _build_gallery.py — nhúng SVG vào gallery.html, _build_mascot.py — sinh toàn bộ SVG mascot, Convert chữ Fredoka sang path trước khi in, Mascot KẸO Gaming Gear, Tương phản WCAG AA (--primary tối thiểu 4.5:1), src/app/globals.css — biến màu sáng/tối

### Community 21 - "Post-Build Report"
Cohesion: 0.25
Nodes (5): dirSize(), mb, nextDir, out, root

### Community 22 - "Cart UI Components"
Cohesion: 0.32
Nodes (6): CartIcon(), CheckIcon(), MinusIcon(), PlusIcon(), TrashIcon(), TruckIcon()

### Community 23 - "Marquee & Contact Widgets"
Cohesion: 0.29
Nodes (4): react, BangChuyen(), Window, SparkIcon()

### Community 24 - "Color Contrast Checker"
Cohesion: 0.38
Nodes (5): luminance(), pairs, ratio(), root, toRgb()

### Community 25 - "Product Placeholder Art"
Cohesion: 0.33
Nodes (6): ArtProps, banThuNho(), Displayable, ProductArt(), shade(), shapes

### Community 26 - "Share Image Generator"
Cohesion: 0.33
Nodes (4): ref_node_url, NEN, root, thuMuc

### Community 27 - "Product Name Matching"
Cohesion: 0.73
Nodes (5): chamDiem(), khoaKhit(), soTuThua(), timSanPham(), tuKhoa()

### Community 28 - "Search Box"
Cohesion: 0.40
Nodes (5): haystack, normalize(), SearchBox(), go(), onKeyDown()

### Community 29 - "Gallery Navigation Icons"
Cohesion: 0.40
Nodes (4): react-dom, ChevronLeftIcon(), ChevronRightIcon(), CloseIcon()

### Community 30 - "Candy Confetti Effect"
Cohesion: 0.40
Nodes (3): dan, RacKeo(), ViKeo

### Community 32 - "Contact Form Logic"
Cohesion: 0.67
Nodes (3): ContactForm(), onSubmit(), validate()

## Knowledge Gaps
- **195 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 284 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Next.js Pages & Routing` to `Build Config & Dependencies`, `Robots.txt Route`, `Root Layout & Theming`, `Contact Page & Footer`, `Policy & Cart Pages`, `Header & Theme Toggle`, `Cart UI Components`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Why does `sharp` connect `Logo & Cover Image Generators` to `Build Config & Dependencies`, `Share Image Generator`, `Product Image Loader`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Why does `react` connect `Marquee & Contact Widgets` to `Next.js Pages & Routing`, `Build Config & Dependencies`, `Root Layout & Theming`, `Contact Page & Footer`, `Header & Theme Toggle`, `Cart UI Components`, `Gallery Navigation Icons`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Next.js Pages & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.06468858593958834 - nodes in this community are weakly interconnected._
- **Should `Build Config & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Deploy & Sheet Sync Workflows` be split into smaller, more focused modules?**
  _Cohesion score 0.07096774193548387 - nodes in this community are weakly interconnected._