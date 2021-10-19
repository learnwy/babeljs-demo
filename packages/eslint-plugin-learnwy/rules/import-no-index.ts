import { TSESLint } from "@typescript-eslint/experimental-utils";
import eslintModuleUtilsResolve from "eslint-module-utils/resolve";
import * as Path from "path";
import * as Fs from "fs";

interface ImportNoIndexOptionItem {
	dir: string;
	index?: string;
	innerNoImportIndex?: boolean;
}

type ImportNoIndexOptions = ImportNoIndexOptionItem[];
type NormalOptionItem = Required<ImportNoIndexOptionItem>;

export const importNoIndex: TSESLint.RuleModule<
	"outImportNoIndex" | "innerImportIndex" | "indexNotExists",
	[ImportNoIndexOptions]
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
				type: "array",
				items: [
					{
						type: "object",
						properties: {
							dir: {
								type: "string",
								required: true,
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
			outImportNoIndex: "out {{file}} import {{import}}.",
			innerImportIndex: "in {{file}} import {{index}}.",
			indexNotExists: "'{{dir}}' not exists file {{index}}.",
		},
	},
	create(context) {
		// relative path
		const sourceCodePath = context.getFilename();
		if (sourceCodePath === "<text>") return {}; // can't check a non-file
		// normal options
		const options: NormalOptionItem[] = context.options[0]
			.sort((a, b) => (a.dir > b.dir ? 1 : -1))
			.map((option): NormalOptionItem | undefined => {
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
						innerNoImportIndex: true,
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
					].find((i) => {
						const resolveIndex = eslintModuleUtilsResolve(
							Path.resolve(option.dir, i),
							context,
						);
						return resolveIndex && Fs.existsSync(resolveIndex);
					});
					if (!indexPath) {
						context.report({
							loc: {
								line: 0,
								column: 0,
							},
							messageId: "indexNotExists",
							data: {
								dir: option.dir,
								index: "t|jsx?",
							},
						});
						return undefined;
					}
					return {
						innerNoImportIndex: true,
						...option,
						index: Path.resolve(option.dir, indexPath),
					};
				}
			})
			// filter invalid option
			.filter((t): t is NormalOptionItem => t !== undefined);
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

					// if out import no index file

					// if in import index file

					// find option that apply
					for (const option of options) {
						if (option.index === importPath) {
							// check source file is in dir import index
							if (
								sourceCodePath.startsWith(option.dir) &&
								sourceCodePath[option.dir.length] === Path.sep
							) {
								context.report({
									node: importDeclaration,
									messageId: "innerImportIndex",
									loc: importDeclaration.loc,
									data: {
										file: sourceCodePath,
										index: option.index,
									},
								});
								break;
							}
						} else if (
							importPath.startsWith(option.dir) &&
							importPath !== option.index
						) {
							// check source file out dir that import no index
							if (
								!sourceCodePath.startsWith(option.dir) ||
								sourceCodePath[option.dir.length] !== Path.sep
							) {
								context.report({
									node: importDeclaration,
									messageId: "outImportNoIndex",
									loc: importDeclaration.loc,
									data: {
										file: sourceCodePath,
										import: importPath,
									},
								});
								break;
							}
						}
					}
				}
			},
		};
	},
};
