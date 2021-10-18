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
	plugins: ["@learnwy/eslint-plugin", "import"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"@learnwy/import-no-index": [
			"error",
			{
				// eslint-disable-next-line no-undef
				dir: __dirname + "/tests/foo",
				// eslint-disable-next-line no-undef
				index: __dirname + "/tests/foo/index.ts",
			},
		],
	},
};
