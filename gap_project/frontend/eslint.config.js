export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: ["react"], // Add the react plugin
    extends: ["eslint:recommended", "plugin:react/recommended"], // Extend recommended rules
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/jsx-uses-react": "error", // Ensure JSX syntax is handled correctly
      "react/jsx-uses-vars": "error",  // Ensure variables used in JSX are not considered unused
      "react/react-in-jsx-scope": "off", // Disable react-in-jsx-scope rule (React 17+ doesn't require React in scope)
      "react/prop-types": "off" // Disable prop-types check if you're using TypeScript (not needed)
    }
  }
];
