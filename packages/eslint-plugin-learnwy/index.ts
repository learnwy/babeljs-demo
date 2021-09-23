/**
 * @fileoverview eslint plugin for learnwy
 * @author WangYang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import requireIndex from "requireindex";

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules

export const rules = requireIndex(__dirname + "/rules");
