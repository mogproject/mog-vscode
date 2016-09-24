"use strict";

import * as vscode from "vscode";

import { getCurrentPos, removeSelection, hasSelectedText } from "../util/selectionUtil";
import * as stringUtil from "../util/stringUtil";


export function toggleLetterCase(t: vscode.TextEditor, e: vscode.TextEditorEdit): void {
    if (hasSelectedText(t)) {
        const isAllUpperCase = t.selections.every(s => stringUtil.isUpper(t.document.getText(s)));
        t.selections.forEach(s => {
            const text = t.document.getText(s)
            e.replace(s, isAllUpperCase ? text.toLowerCase() : text.toUpperCase());
        })
    } else {
        const curPos = getCurrentPos(t);
        if (curPos.character == 0) return;
        const target = new vscode.Range(curPos.translate(undefined, -1), curPos)
        const text = t.document.getText(target)
        e.replace(target, stringUtil.isUpper(text) ? text.toLowerCase() : text.toUpperCase());
    }
}
