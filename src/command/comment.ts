"use strict";

import * as vscode from "vscode";

import { getCurrentPos, hasSelectedText, moveCursor } from "../util/selectionUtil";
import Position = vscode.Position;
import Selection = vscode.Selection;
import TextEditor = vscode.TextEditor;
import executeCommand = vscode.commands.executeCommand;


export function commentLine(): PromiseLike<void> {
    const t = vscode.window.activeTextEditor;
    return executeCommand("editor.action.commentLine").then(() => {
        if (!hasSelectedText(t)) {
            const curPos = getCurrentPos(t);
            moveCursor(t, curPos.translate(1));
        };
    });
}
