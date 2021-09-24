import { TSESLint } from "@typescript-eslint/experimental-utils";
import * as Path from "path";
import * as Fs from "fs";

interface ImportNoIndexOptionItem {
	dir: string;
	index?: string;
	innerNoImportIndex?: boolean;
}

type ImportNoIndexOptions = ImportNoIndexOptionItem[];

export const importNoIndex: TSESLint.RuleModule<
	"outImportNoIndex" | "innerImportIndex" | "indexNotExists",
	any
> = {
	meta: {
		type: "problem",
		docs: {
			description: "更好的模块化",
			recommended: "error",
			category: "Best Practices",
			url: "https://eslint.org/docs/rules/no-unused-vars",
		},
		schema: [
			{
				items: [
					{
						type: "object",
						properties: {
							dir: {
								type: "string",
							},
							index: {
								type: "string",
							},
							innerNoImportIndex: {
								type: "boolean",
								default: true,
							},
						},
						additionalProperties: false,
					},
				],
			},
		],
		messages: {
			outImportNoIndex: "'{{file}}' import {{dir}}.",
			innerImportIndex: "'{{file}}' import {{dir}}.",
			indexNotExists: "'{{dir}}' not exists file {{index}}.",
		},
	},
	create(context) {
		// relative path
		const sourceCodePath = context.getFilename();
		if (sourceCodePath === "<text>") return {}; // can't check a non-file
		const options: ImportNoIndexOptions = (
			context.options.slice(0) as ImportNoIndexOptions
		)
			.sort((a, b) => (a.dir > b.dir ? 1 : -1))
			.map((option) => {
				if (option.index) {
					if (!Fs.existsSync(option.index)) {
						context.report({
							loc: {
								line: 0,
								column: 0,
							},
							messageId: "indexNotExists",
							data: {
								dir: option.dir,
								index: option.index,
							},
						});
					}
					return option;
				} else {
					const indexPath = [
						"index.ts",
						"index.tsx",
						"index.js",
						"index.jsx",
					].find((i) => Fs.existsSync(Path.join(option.dir, i)));
					if (!indexPath) {
						context.report({
							loc: {
								line: 0,
								column: 0,
							},
							messageId: "indexNotExists",
							data: {
								dir: option.dir,
								index: "",
							},
						});
					}
					return {
						...option,
						index: indexPath || "",
					};
				}
			});

		// 需要收集 对应 index 目录的所有 import 和 export

		return {
			ImportDeclaration(importDeclaration) {
				if (importDeclaration.importKind === "type") {
					// is typescript type import
					return;
				}
				if (typeof importDeclaration.source.value === "string") {
					const importPath = importDeclaration.source.value;
					// check is in some
					// TODO: we first assume all is absolute path

					// import 命中 dir
					const currentOption = options.find(
						(option) => importPath.indexOf(option.index!) === 0,
					);
					if (currentOption) {
						const isInnerFile = sourceCodePath.indexOf(currentOption.dir) === 0;
						if (isInnerFile) {
							// 1. 检查内部文件是否 import 了 index 文件
							if (importPath === currentOption.index) {
								context.report({
									node: importDeclaration,
									messageId: "innerImportIndex",
									loc: importDeclaration.loc,
									data: {
										file: sourceCodePath,
										dir: currentOption.dir,
									},
								});
							}
						} else {
							// 2. 检查外部文件是否 import 了 非index 文件
							if (importPath !== currentOption.index) {
								context.report({
									node: importDeclaration,
									messageId: "outImportNoIndex",
									loc: importDeclaration.loc,
									data: {
										file: sourceCodePath,
										dir: currentOption.dir,
									},
								});
							}
						}
					}
				}
			},
		};
	},
};
