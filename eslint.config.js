import globals from "globals";
import typescript from "typescript-eslint";
import jsRules from "@joshuaavalon/eslint-config-javascript";
import tsRules from "@joshuaavalon/eslint-config-typescript";

export default [
  { ignores: ["node_modules", "dist"] },
  {
    ...jsRules,
    files: [
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs"
    ],
    languageOptions: { globals: { ...globals.node } }
  },
  {
    ...tsRules,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        project: true,
        tsconfigDirName: import.meta.dirname,
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.nodeBuiltin
      }
    }
  }
];
