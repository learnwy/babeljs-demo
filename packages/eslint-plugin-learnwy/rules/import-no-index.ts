import { TSESLint } from "@typescript-eslint/experimental-utils";
import eslintModuleUtilsResolve from "eslint-module-utils/resolve";
import * as Path from "path";

interface ImportNoIndexOptionItem {
	dir: string;
	index?: string;
	innerNoImportIndex?: boolean;
}

type ImportNoIndexOptions = ImportNoIndexOptionItem[];

export const importNoIndex: TSESLint.RuleModule<
	"outImportNoIndex" | "innerImportIndex" | "indexNotExists",
	ImportNoIndexOptions
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
		// 先将 options 处理成绝对路径
		const options = (context.options.slice(0) as ImportNoIndexOptions)
			.sort((a, b) => (a.dir > b.dir ? 1 : -1))
			.map((option) => {
				if (option.index) {
					const resolveIndexPath = eslintModuleUtilsResolve(
						option.index,
						context,
					);
					if (!resolveIndexPath) {
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
						return undefined;
					}
					return {
						...option,
						index: resolveIndexPath,
					};
				} else {
					// 查找默认的 index 文件
					const indexPath = [
						"index.ts",
						"index.tsx",
						"index.js",
						"index.jsx",
					].find((i) => eslintModuleUtilsResolve(i, context));
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
			})
			// 失效的配置会报错并且过滤掉
			.filter((t) => t !== undefined) as Required<ImportNoIndexOptionItem>[];

		return {
			ImportDeclaration(importDeclaration) {
				if (importDeclaration.importKind === "type") {
					// is typescript type import
					return;
				}
				if (typeof importDeclaration.source.value === "string") {
					const importPath = eslintModuleUtilsResolve(
						importDeclaration.source.value,
						context,
					);
					if (!importPath) {
						// import 文件不存在, 交给其他 lint 报错
						return;
					}

					// import 命中 dir
					const currentOption = options.find((option) => {
						const index = importPath.indexOf(option.index);
						return (
							index === 0 &&
							importPath.startsWith(option.index) &&
							importPath[index] === Path.sep
						);
					});
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
