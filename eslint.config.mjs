import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { luatShop } from "./eslint/luat-shop.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Luật riêng của shop — xem eslint/luat-shop.mjs.
  {
    plugins: { shop: luatShop },
    rules: { "shop/khong-chu-thich-lich-su": "error" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/site.ts"],
    rules: { "shop/khong-viet-cung-lien-he": "error" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
