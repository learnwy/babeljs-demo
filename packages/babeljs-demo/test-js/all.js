const t = require("@babel/types");
const generate = require("@babel/generator");

const ids = ["a", "n", "c"];

const ast = t.exportNamedDeclaration(
	null,
	ids.map((id) => t.exportSpecifier(t.identifier(id), t.identifier(id))),
);

console.info(generate.default(ast).code);
