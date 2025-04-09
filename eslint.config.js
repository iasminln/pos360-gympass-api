import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { prettier: prettierPlugin },
    rules: { "prettier/prettier": "error" },
  },
  tseslint.configs.recommended,
  { ignores: ["node_modules", "build"] },
  prettierConfig,
]);
