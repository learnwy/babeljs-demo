/**
 * @fileoverview eslint plugin for learnwy
 * @author WangYang
 */
"use strict";

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules

import { TSESLint } from "@typescript-eslint/experimental-utils";
import { importNoIndex } from "./rules/import-no-index";

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
	"import-no-index": importNoIndex,
};
