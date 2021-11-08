import template, { TemplateBuilderOptions } from "@babel/template";
import {
	ExpressionStatement,
	JSXAttribute,
	JSXElement,
	JSXExpressionContainer,
	TemplateLiteral,
} from "@babel/types";
const reactAttributeStringTemplate = "<a title={`我是谁${a}`}></a>";

function noop(..._args: any) {
	//
}

const reactAttributeStringTemplateAst = template.ast(
	reactAttributeStringTemplate,
	{
		plugins: ["jsx"],
		sourceFilename: "index.jsx",
	} as TemplateBuilderOptions,
) as ExpressionStatement;
noop(
	(
		(
			(
				(reactAttributeStringTemplateAst.expression as JSXElement)
					.openingElement.attributes[0] as JSXAttribute
			).value as JSXExpressionContainer
		).expression as TemplateLiteral
	).quasis[0],
);
const reactAttributeStringTemplateCall =
	"<a title={`${intl.get('xxx').d('我是谁$')}你好${1}${哦}a${2}`}></a>";
const reactAttributeStringTemplateCallAst = template.ast(
	reactAttributeStringTemplateCall,
	{
		plugins: ["jsx"],
		sourceFilename: "index.jsx",
	} as TemplateBuilderOptions,
) as ExpressionStatement;
console.info(
	//(
	//	(
	//		(
	//			(reactAttributeStringTemplateCallAst.expression as JSXElement)
	//				.openingElement.attributes[0] as JSXAttribute
	//		).value as JSXExpressionContainer
	//	).expression as TemplateLiteral
	//).expressions,
	(
		(
			(
				(reactAttributeStringTemplateCallAst.expression as JSXElement)
					.openingElement.attributes[0] as JSXAttribute
			).value as JSXExpressionContainer
		).expression as TemplateLiteral
	).quasis, //(
	//	(
	//		(reactAttributeStringTemplateCallAst.expression as JSXElement)
	//			.openingElement.attributes[0] as JSXAttribute
	//	).value as JSXExpressionContainer
	//).expression as TemplateLiteral,
);
