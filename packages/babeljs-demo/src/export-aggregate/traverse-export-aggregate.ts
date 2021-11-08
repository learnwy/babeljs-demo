import { NodePath, ParseResult } from "@babel/core";
import generate from "@babel/generator";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import * as fs from "fs";

function pickVariableDeclaration(
	variableDeclaration: t.VariableDeclaration,
): string[] {
	return variableDeclaration.declarations
		.map((del) => pickFromMayHasId(del))
		.flat();
}

function pickFromMayHasId(node: unknown) {
	const mayBeId = (node as any).id;

	if (t.isIdentifier(mayBeId)) {
		return [mayBeId.name];
	}

	throw new Error("node not contains id prop");
}

function pickDeclareName(declarationNode: t.Declaration): string[] {
	try {
		return pickFromMayHasId(declarationNode);
	} catch {
		// do nothing
	}

	if (t.isVariableDeclaration(declarationNode)) {
		return pickVariableDeclaration(declarationNode);
	}

	const error = new Error("不支持的节点类型");
	(error as any).__declarationNode = declarationNode;
	throw error;
}

// 有一个问题, 经过转化后注释的位置对不上了
// 是否可以只增加最后一条
function traverseExportAggregate(ast: ParseResult | null, file: string) {
	if (!ast) {
		throw new Error("not parse ok");
	}

	const exportSpecifiers: t.ExportSpecifier[] = [];
	const exportIds: string[] = [];
	traverse(ast, {
		ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
			if (path.node.source !== null) {
				// 不替换从新 export
				return;
			}

			if (path.node.specifiers) {
				// 归并在一起
				exportSpecifiers.push(...(path.node.specifiers as t.ExportSpecifier[]));
				path.node.specifiers = [];
			} // 搜集并替换

			if (path.node.declaration) {
				exportIds.push(...pickDeclareName(path.node.declaration));
				path.replaceWith(path.node.declaration);
			} else {
				path.remove();
			}
		},

		Program: {
			exit(path) {
				const exports = t.exportNamedDeclaration(null, [...exportSpecifiers]);
				exportIds.forEach((id) => {
					exports.specifiers.push(
						t.exportSpecifier(t.identifier(id), t.identifier(id)),
					);
				});

				if (exports.specifiers.length) {
					path.node.body.push(exports);
				}
			},
		},
	});
	fs.writeFileSync(file, generate(ast).code);
}

export { traverseExportAggregate };
