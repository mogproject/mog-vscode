"use strict";

import * as vscode from "vscode";

import { getCurrentPos, removeSelection, hasSelectedText } from "../util/selectionUtil";
import Position = vscode.Position;
import Range = vscode.Range;
import Selection = vscode.Selection;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;


function joinOneLine(t: TextEditor, e: TextEditorEdit, line: number): void {
    const lineEnd = t.document.lineAt(line).range.end;
    const nextLineChar = t.document.lineAt(line + 1).firstNonWhitespaceCharacterIndex;
    const r = new Range(lineEnd, new Position(line + 1, nextLineChar));
    e.replace(r, " ");
}

export function joinLines(t: TextEditor, e: TextEditorEdit): void {
    const curPos = getCurrentPos(t);
    const target: number[][] = hasSelectedText(t)
        ? t.selections.map(s => [s.start.line, s.end.line])
        : [[curPos.line, curPos.line + 1]];
    target.forEach((xs) => {
        for (let i = xs[0]; i < xs[1]; ++i) {
            joinOneLine(t, e, i);
        }
    });
    removeSelection(t);
}