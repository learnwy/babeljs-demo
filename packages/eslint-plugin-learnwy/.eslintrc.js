module.exports = {
	root: true,
	env: {
		es2021: true,
	},
	settings: {
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
		},
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@learnwy", "import"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"@learnwy/import-no-index": [
			"error",
			[
				{
					dir: "tests/foo",
					index: "index.ts",
				},
			],
		],
	},
};
