import { TSESLint } from "@typescript-eslint/experimental-utils";
import { importNoIndex } from "../../rules/import-no-index";

const ruleTester = new TSESLint.RuleTester({
	parser: require.resolve("@typescript-eslint/parser"),
});
ruleTester.run("import-no-index", importNoIndex, {
	valid: [
		{
			code: `
			import {a} from 'src/foo/foo';
			import {b} from 'src/foo/foo';
			import { isCallExpression } from '@babel/types';
			export * from 'src/foo/foo';
			import type {c} from 'src/foo/foo';
			import type { CallExpression } from '@babel/types';
			`,
			options: [{ dir: "src/foo", index: "src/foo/index.ts" }],
			filename: "src/foo/index.ts",
		},
		{
			code: "export const a = 1; export const b = 2;",
			options: [{ dir: "src/foo", index: "src/foo/index.ts" }],
			filename: "src/foo/foo.ts",
		},
	],
	invalid: [],
});
