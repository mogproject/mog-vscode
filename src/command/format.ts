"use strict";

import * as vscode from "vscode";

import { hasSelectedText } from "../util/selectionUtil";

import TextEditor = vscode.TextEditor;
import executeCommand = vscode.commands.executeCommand;

export function formatAction() {
    const t = vscode.window.activeTextEditor;
    const cmd = hasSelectedText(t) ? "editor.action.formatSelection" : "editor.action.formatDocument";
    return executeCommand(cmd);
}
