"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SelectContext;
(function (SelectContext) {
    /** Select node after add. Open editor right away  */
    SelectContext[SelectContext["ADD_NODE"] = 0] = "ADD_NODE";
    /** Select node by key. The selection is delayed */
    SelectContext[SelectContext["SELECT_BY_KEY"] = 1] = "SELECT_BY_KEY";
})(SelectContext = exports.SelectContext || (exports.SelectContext = {}));
