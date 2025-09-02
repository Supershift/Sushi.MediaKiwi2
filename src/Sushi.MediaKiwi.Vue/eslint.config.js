// eslint.config.js
import { globalIgnores } from "eslint/config";
import globals from "globals";
import parser from "vue-eslint-parser";
import pluginVue from "eslint-plugin-vue";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfigWithVueTs(
  pluginVue.configs["flat/essential"],
  pluginVue.configs["flat/recommended"],
  eslint.configs.recommended,
  vueTsConfigs.recommended,
  tseslint.configs.eslintRecommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      parser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaFeatures: {
          jsx: false,
        },
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-var": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "function",
          format: ["camelCase"],
        },
        {
          selector: "method",
          format: ["camelCase"],
        },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
      "vue/multi-word-component-names": "off",
    },
  },
  // Globally ignored files
  globalIgnores(["**/node_modules/*", "**/dist/*", "**/public/*", "**/__tests__/**/*"]),
  // Jest-specific config for tests
  {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/*.{t}s?(x)"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
