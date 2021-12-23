// convert enum to options and xxx

import * as tsc from "typescript";

const enumCode = `
enum Direction {
  Up, Down, Left, Right
}

const a = Direction.Up;
`;

const sourceFile = tsc.createSourceFile(
	"test.ts",
	enumCode,
	tsc.ScriptTarget.ES5,
);

sourceFile.statements.forEach((stat) => {
	console.debug(stat);
});
