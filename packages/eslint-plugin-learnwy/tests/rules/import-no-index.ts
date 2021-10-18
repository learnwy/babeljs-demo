import { TSESLint } from "@typescript-eslint/experimental-utils";
import { importNoIndex } from "../../rules/import-no-index";

const ruleTester = new TSESLint.RuleTester({
	parser: require.resolve("@typescript-eslint/parser"),
});
ruleTester.run("import-no-index", importNoIndex, {
	valid: [
		{
			code: `
			import {a} from './foo';
			import {b} from './foo';
			import { isCallExpression } from '@babel/types';
			export * from './foo';
			import type {c} from './foo';
			import type { CallExpression } from '@babel/types';
			`,
			options: [{ dir: "@/foo", index: "@/foo/index.ts" }],
			filename: "src/foo/index.ts",
		},
		{
			code: "export const a = 1; export const b = 2;",
			options: [{ dir: "@/foo", index: "@/foo/index.ts" }],
			filename: "src/foo/foo.ts",
		},
	],
	invalid: [],
});

console.debug("rule test failure");
