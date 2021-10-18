declare module "eslint-module-utils/moduleVisitor";
declare module "eslint-module-utils/resolve" {
	import { RuleContext } from "eslint";

	declare function resolve(
		path: string,
		context: RuleContext,
	): string | null | undefined;
	export default resolve;
}
