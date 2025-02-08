import eslintPluginReact from "eslint-plugin-react";
import js from "@eslint/js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";

export default [
  js.configs.recommended, // JavaScript recommended rules
  reactRecommended, // React recommended rules
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      react: eslintPluginReact,
    },
    languageOptions: {
      sourceType: "module", // Ensures ES modules are used
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];
