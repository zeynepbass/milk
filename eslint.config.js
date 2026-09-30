import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

const noCommentsRule = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: { noComment: "Yorum satırı kullanılmaz; kodu isimlendirme ve testlerle açıklayın." },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          context.report({ loc: comment.loc, messageId: "noComment" });
        }
      },
    };
  },
};

const localPlugin = { rules: { "no-comments": noCommentsRule } };

const sharedRules = {
  "no-console": "error",
  "local/no-comments": "error",
  "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
  "prefer-const": "error",
  eqeqeq: ["error", "always"],
  "import/first": "error",
  "import/no-duplicates": "error",
  "import/newline-after-import": "error",
};

export default [
  {
    ignores: ["**/node_modules/**", "**/build/**", "**/coverage/**", "server/uploads/**"],
  },
  js.configs.recommended,
  {
    linterOptions: { reportUnusedDisableDirectives: "error", noInlineConfig: true },
    plugins: { local: localPlugin, import: importPlugin },
    rules: sharedRules,
  },
  {
    files: ["client/src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, process: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "19.0" } },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      "react/prop-types": "off",
      "react/no-array-index-key": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./client/src/shared/components",
              from: "./client/src/features",
              message: "shared/components feature katmanına bağımlı olamaz.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["server/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
  {
    files: ["*.js", "*.cjs", "client/*.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ["client/*.js", "*.cjs"],
    languageOptions: { sourceType: "commonjs" },
  },
];
