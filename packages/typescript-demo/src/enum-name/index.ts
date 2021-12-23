import * as ts from "typescript";
import { constantCase } from "change-case";

const enumNameTransformerFactory: ts.TransformerFactory<ts.SourceFile> = (
	ctx,
) => {
	function visit(ctx: ts.TransformationContext) {
		const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<any> => {
			if (ts.isEnumMember(node)) {
				if (ts.isIdentifier(node.name)) {
					return ts.factory.createEnumMember(
						ts.factory.createIdentifier(constantCase(node.name.escapedText!)),
						node.initializer,
					);
				}
			}
			return ts.visitEachChild(node, visitor, ctx);
		};
		return visitor;
	}
	return (sf) => ts.visitNode(sf, visit(ctx));
};

export function transformEnumName(sourceCode: string): string {
	const sourceFile = ts.createSourceFile(
		"test.ts",
		sourceCode,
		ts.ScriptTarget.ES5,
	);
	const result = ts.transform(sourceFile, [enumNameTransformerFactory]);
	if (result.transformed[0]) {
		const newSourceCode = ts.createPrinter().printFile(result.transformed[0]);
		console.log("new source code", newSourceCode);
		return newSourceCode;
	}
	throw new Error("transform error");
}

transformEnumName(`
enum Xxx {
  Xxx, Yyy, Zzz
}
`);
