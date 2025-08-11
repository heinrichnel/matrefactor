/* eslint-env node */
/* /workspaces/matrefactor/WialonMaps/.eslintrc.cjs */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime" // new JSX transform
  ],
  settings: {
    react: { version: "detect" }
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: null
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off"
  },
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "coverage"
  ],
  overrides: [
    // Ensure Node globals (module, require, __dirname) are defined for config/build scripts
    {
      files: [
        "*.cjs",
        "*.js",
        "vite.config.ts",
        "tailwind.config.ts",
        "postcss.config.cjs"
      ],
      env: { node: true }
    }
  ]
};
