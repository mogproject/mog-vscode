"use strict";

import * as vscode from "vscode";

import { removeSelection, hasSelectedText } from "./util/selectionUtil";
import { joinLines } from "./command/join";
import { toggleLetterCase } from "./command/letterCase";
import { selectRectangle } from "./command/selection";
import { commentLine } from "./command/comment";
import { clipboardCopyAction, duplicateAction, killLineAction, duplicateAndCommentLine } from "./command/copy";

import Window = vscode.window;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;
import executeCommand = vscode.commands.executeCommand;


let inMarkMode = false;
let keepMark = 0;  // todo: refactor

const supportedCursorMoves: string[] = [
    "cursorUp", "cursorDown", "cursorLeft", "cursorRight", "cursorHome", "cursorEnd",
    "cursorWordLeft", "cursorWordRight", "cursorPageDown", "cursorPageUp", "cursorTop", "cursorBottom"
];

export function activate(context: vscode.ExtensionContext) {
    type Cmd = [string, { (): void }];
    type EditCmd = [string, { (t: TextEditor, e: TextEditorEdit): void }];

    // Prepare non-edit command definitions
    let commands: Cmd[] = [
        ["mog.editor.action.enterMarkMode", () => enterMarkMode(Window.activeTextEditor)],
        ["mog.editor.action.exitMarkMode", () => exitMarkMode(Window.activeTextEditor)],
        ["mog.editor.action.clipboardCopyAction", () => clipboardCopyAction(Window.activeTextEditor)],
        ["mog.editor.action.clipboardCutAction", () => executeCommand("editor.action.clipboardCutAction")],
        ["mog.editor.action.commentLine", commentLine],
        ["mog.editor.action.duplicateAndCommentLine", duplicateAndCommentLine],
        ["mog.editor.action.selectRectangle", () => selectRectangle(Window.activeTextEditor)]
    ];

    // cursor moves
    supportedCursorMoves.map(s => {
        const sl = s + "Select";
        return [[s, () => inMarkMode ? sl : s], [sl, () => sl]];
    }).forEach(xss => {
        xss.forEach((xs: [string, { (): string }]) =>
            commands.push(["mog." + xs[0], () => {
                executeCommand(xs[1]());
                ++keepMark;
            }])
        )
    });

    // Prepare edit command definitions
    const editCommands: EditCmd[] = [
        ["mog.editor.action.duplicateAction", duplicateAction],
        ["mog.editor.action.killLineAction", killLineAction],
        ["mog.editor.action.toggleLetterCase", toggleLetterCase],
        ["mog.editor.action.joinLines", joinLines]
    ];

    // Register commands
    commands.map(c => vscode.commands.registerCommand(c[0], c[1]))
        .concat(editCommands.map(c => vscode.commands.registerTextEditorCommand(c[0], c[1])))
        .forEach(r => context.subscriptions.push(r));

    // Subscribe listeners
    Window.onDidChangeTextEditorSelection(resetMarkMode);

    console.log("Activated extension: mog-vscode");
}

export function deactivate() {
}

// Helper functions
function resetMarkMode(ev: vscode.TextEditorSelectionChangeEvent): void {
    if (inMarkMode) {
        if (keepMark > 0) {
            --keepMark;
        } else {
            inMarkMode = false;
        }
    } else {
        keepMark = 0;
    }
}

// Commands
function enterMarkMode(t: TextEditor): void {
    if (hasSelectedText(t) && !inMarkMode) { ++keepMark; }
    removeSelection(t);
    inMarkMode = !inMarkMode;
}

function exitMarkMode(t: TextEditor): void {
    removeSelection(t);
    inMarkMode = false;
}