import { NodePath, ParseResult } from "@babel/core";
import generate from "@babel/generator";
import {
	isCallExpression,
	isIdentifier,
	isMemberExpression,
	StringLiteral,
} from "@babel/types";
import traverse from "@babel/traverse";
import template from "@babel/template";
import { ExpressionStatement } from "@babel/types";

const str = "12345";
const str2 = "hello";
const str3 = "你好";
console.info(str, str2, str3);

function needReplace(path: NodePath<StringLiteral>): boolean {
	// intl.get('xxx').d('xxx');
	// d('chinese')
	const { parent } = path;
	if (isCallExpression(parent)) {
		// .d
		if (
			isMemberExpression(parent.callee) &&
			isIdentifier(parent.callee.property) &&
			parent.callee.property.name === "d"
		) {
			// get('xxx')
			const object = parent.callee.object;
			if (
				isCallExpression(object) &&
				isMemberExpression(object.callee) &&
				isIdentifier(object.callee.object) &&
				isIdentifier(object.callee.property)
			) {
				return !(
					object.callee.object.name === "intl" &&
					object.callee.property.name === "get"
				);
			}
		}
	}
	return true;
}

function replaceWithINTLNode(path: NodePath<StringLiteral>) {
	if (!needReplace(path)) {
		return;
	}
	const code = "this is code";
	path.replaceWith(
		template.ast(
			`intl.get('${code}').d('${path.node.value}')`,
		) as ExpressionStatement,
	);
}

/**
 *
 Block                                   Range       Comment
 --------------------------------------- ----------- ----------------------------------------------------
 CJK Unified Ideographs                  4E00-9FFF   Common
 CJK Unified Ideographs Extension A      3400-4DBF   Rare
 CJK Unified Ideographs Extension B      20000-2A6DF Rare, historic
 CJK Unified Ideographs Extension C      2A700–2B73F Rare, historic
 CJK Unified Ideographs Extension D      2B740–2B81F Uncommon, some in current use
 CJK Unified Ideographs Extension E      2B820–2CEAF Rare, historic
 CJK Compatibility Ideographs            F900-FAFF   Duplicates, unifiable variants, corporate characters
 CJK Compatibility Ideographs Supplement 2F800-2FA1F Unifiable variants
 CJK Symbols and Punctuation             3000-303F
 * @param {ParseResult | null} ast
 */

export function traverseScanChinese(ast: ParseResult | null) {
	if (!ast) {
		throw new Error("not parse ok");
	}
	let hasChinese = false;
	traverse(ast, {
		StringLiteral(path: NodePath<StringLiteral>) {
			if (/[\u4E00-\u9FFF]+/g.test(path.node.value)) {
				hasChinese = true;
				// 开始替换成标准的国际化字符串
				replaceWithINTLNode(path);
			}
		},
	});
	if (hasChinese) {
		console.info(generate(ast).code);
	}
}
