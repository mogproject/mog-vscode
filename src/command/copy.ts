"use strict";

import * as vscode from "vscode";

import { getCurrentPos, resetSelection, hasSelectedText, currentLineHome, nextLineHome } from "../util/selection-util";

import Window = vscode.window;
import Range = vscode.Range;
import Selection = vscode.Selection;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;
import executeCommand = vscode.commands.executeCommand;

export async function clipboardCopyAction(t: TextEditor): Promise<void> {
    await executeCommand("editor.action.clipboardCopyAction");
    return resetSelection(t);
}

export function duplicateAction(t: TextEditor, e: TextEditorEdit): void {
    const expandSelection = !hasSelectedText(t) || (t.selections.length == 1 && !t.selection.isSingleLine);
    const selections: readonly Selection[] = expandSelection
        ? [new Selection(currentLineHome(t.selection.start), nextLineHome(t.selection.end))]
        : t.selections;

    selections.forEach((s) => e.insert(s.start, t.document.getText(s)));
}

export function killLineAction(t: TextEditor, e: TextEditorEdit): void {
    const curPos = getCurrentPos(t);
    const lineEnd = t.document.lineAt(curPos.line).range.end;
    const endPos = curPos.isEqual(lineEnd) ? nextLineHome(curPos) : lineEnd;
    const target = new Range(curPos, endPos);
    const text = t.document.getText(target);

    // Do nothing when the cursor is at the end of file.
    if (!text) return;

    e.delete(target);
    vscode.env.clipboard.writeText(text);
}

export async function duplicateAndCommentLine(): Promise<void> {
    const t = Window.activeTextEditor;

    await executeCommand("editor.action.addCommentLine");
    if (t) {
        t.edit((e) => duplicateAction(t, e));
    }
    executeCommand("editor.action.removeCommentLine");
}
