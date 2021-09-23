import { NodePath, ParseResult } from "@babel/core";
import generate from "@babel/generator";
import * as t from "@babel/types";
import traverse from "@babel/traverse";

const str = "12345";
const str2 = "hello";
const str3 = "你好";
console.debug(str, str2, str3);
function hasChinese(str: string): boolean {
	return /[\u4E00-\u9FFF]+/g.test(str);
}

function toINTLAst(chineseStr: string): t.CallExpression {
	const code = "this is code";
	return t.callExpression(
		t.memberExpression(
			t.callExpression(
				t.memberExpression(t.identifier("intl"), t.identifier("get")),
				[t.stringLiteral(code)],
			),
			t.identifier("d"),
		),
		[t.stringLiteral(chineseStr)],
	);
}

function needReplace(path: NodePath<any>): boolean {
	// intl.get('xxx').d('xxx');
	// d('chinese')
	const { parent } = path;
	if (t.isCallExpression(parent)) {
		// .d
		if (
			t.isMemberExpression(parent.callee) &&
			t.isIdentifier(parent.callee.property) &&
			parent.callee.property.name === "d"
		) {
			// intl.get('xxx')
			const object = parent.callee.object;
			if (
				t.isCallExpression(object) &&
				t.isMemberExpression(object.callee) &&
				t.isIdentifier(object.callee.object) &&
				t.isIdentifier(object.callee.property)
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

function replaceWithINTLNode(path: NodePath<t.StringLiteral>) {
	if (!needReplace(path)) {
		return;
	}
	// 检查是否是 JSXAttribute
	if (t.isJSXAttribute(path.parent)) {
		path.replaceWith(t.jsxExpressionContainer(toINTLAst(path.node.value)));
	} else {
		path.replaceWith(toINTLAst(path.node.value));
	}
}
function replaceWithINTLNodeJSXText(path: NodePath<t.JSXText>) {
	path.replaceWith(t.jsxExpressionContainer(toINTLAst(path.node.value)));
}
function replaceWithINTLNodeTemplateElement(path: NodePath<t.TemplateLiteral>) {
	// `${a}我${b}我${c}`
	// ['', '我', '我', '',]
	// [a, b, c]
	// `${a}${xxx.xxx.()}${b}我${c}`
	// ['', '', '', 我, '']
	// [a,xxx.xxx.(), b, c]
	const newQuasi: t.TemplateElement[] = [];
	const newExpressions: t.Expression[] = [];
	path.node.quasis.forEach((quasi, index) => {
		if (hasChinese(quasi.value.raw)) {
			// 增加的是空字符串 所以不需要添加新的代码
			newQuasi.push({
				...quasi,
				tail: false,
				value: {
					...quasi.value,
					raw: "",
					cooked: "",
				},
			});
			newExpressions.push(toINTLAst(quasi.value.raw));
			newQuasi.push({
				...quasi,
				tail: false,
				value: {
					...quasi.value,
					raw: "",
					cooked: "",
				},
			});
		} else {
			newQuasi.push(quasi);
		}
		if (path.node.expressions[index]) {
			newExpressions.push(path.node.expressions[index] as t.Expression);
		}
	});
	path.replaceWith({
		...path.node,
		quasis: newQuasi,
		expressions: newExpressions,
	});
}

export function traverseScanChinese(ast: ParseResult | null) {
	if (!ast) {
		throw new Error("not parse ok");
	}
	let hasChinese = false;
	traverse(ast, {
		StringLiteral(path: NodePath<t.StringLiteral>) {
			if (/[\u4E00-\u9FFF]+/g.test(path.node.value)) {
				hasChinese = true;
				// 开始替换成标准的国际化字符串
				replaceWithINTLNode(path);
			}
		},
		JSXText(path: NodePath<t.JSXText>) {
			if (/[\u4E00-\u9FFF]+/g.test(path.node.value)) {
				hasChinese = true;
				// 开始替换成标准的国际化字符串
				replaceWithINTLNodeJSXText(path);
			}
		},
		TemplateLiteral(path: NodePath<t.TemplateLiteral>) {
			if (
				path.node.quasis.some((quasi) =>
					/[\u4E00-\u9FFF]+/g.test(quasi.value.raw),
				)
			) {
				hasChinese = true;
				replaceWithINTLNodeTemplateElement(path);
			}
		},
	});
	if (hasChinese) {
		console.info(generate(ast).code);
	}
}
