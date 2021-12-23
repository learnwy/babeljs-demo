// eslint-disable-next-line no-undef
module.exports = {
	env: {
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "@learnwy"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"@learnwy/import-no-index": [
			"error",
			[
				{
					// eslint-disable-next-line no-undef
					dir: __dirname + "/packages/eslint-plugin-learnwy/tests/foo",
				},
			],
		],
	},
};
