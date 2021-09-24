module.exports = {
	root: true,
	env: {
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@learnwy/eslint-plugin"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"@learnwy/import-no-index": [
			"error",
			{
				dir: "tests/foo",
				index: "tests/foo/index.ts",
			},
		],
	},
};
