"use strict";

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // Add @typescript-eslint/recommended and configure parser
  extends: [
    "eslint:recommended", // ESLint's recommended rules
    "plugin:react/recommended", // React recommended rules
    "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
    "plugin:react-hooks/recommended", // Add React Hooks recommended rules
    "prettier", // Prettier configuration (must be last)
    "plugin:prettier/recommended", // Prettier plugin for ESLint (must be last)
  ],
  parser: "@typescript-eslint/parser", // Specify the ESLint parser for TypeScript
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // Configuration for React JSX transform
    ecmaFeatures: {
      jsx: true,
    },
    // Project for TypeScript files (if using parserOptions.project)
    // project: './tsconfig.json', // Uncomment if you want type-aware linting
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
  plugins: ["react", "@typescript-eslint", "prettier", "react-hooks"], // Add React and TypeScript plugins
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  rules: {
    // Disable rules handled by Prettier
    "prettier/prettier": "error",
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],

    // General ESLint rules
    strict: ["error", "global"],
    camelcase: "off", // You might want to enable this, but keeping it off as per original
    "no-var": "error",
    eqeqeq: ["error", "always"],
    "prefer-const": "error",
    "func-style": ["error", "expression"],
    "prefer-rest-params": "error",
    "prefer-spread": "error",

    // React specific rules
    "react/prop-types": "off", // Often turned off when using TypeScript for prop validation
    "react/display-name": "off",
    "react/react-in-jsx-scope": "off", // Disable for new JSX transform (React 17+)

    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn for unused vars
    "@typescript-eslint/explicit-module-boundary-types": "off", // Adjust as needed
  },
};
