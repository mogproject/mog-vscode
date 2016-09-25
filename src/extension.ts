"use strict";

import * as vscode from "vscode";

import { removeSelection, hasSelectedText } from "./util/selectionUtil";
import { GlobalMarkController } from "./markController";
import { joinLines } from "./command/join";
import { toggleLetterCase } from "./command/letterCase";
import { selectRectangle } from "./command/selection";
import { commentLine } from "./command/comment";
import { clipboardCopyAction, duplicateAction, killLineAction, duplicateAndCommentLine } from "./command/copy";

import Window = vscode.window;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;
import executeCommand = vscode.commands.executeCommand;


const supportedCursorMoves: string[] = [
    "cursorUp", "cursorDown", "cursorLeft", "cursorRight", "cursorHome", "cursorEnd",
    "cursorWordLeft", "cursorWordRight", "cursorPageDown", "cursorPageUp", "cursorTop", "cursorBottom"
];

export function activate(context: vscode.ExtensionContext) {
    type Cmd = [string, { (): void }];
    type EditCmd = [string, { (t: TextEditor, e: TextEditorEdit): void }];

    const mc = new GlobalMarkController();

    // Prepare non-edit command definitions
    let commands: Cmd[] = [
        ["mog.editor.action.enterMarkMode", () => mc.enter(Window.activeTextEditor)],
        ["mog.editor.action.exitMarkMode", () => mc.exit(Window.activeTextEditor)],
        ["mog.editor.action.clipboardCopyAction", () => clipboardCopyAction(Window.activeTextEditor)],
        ["mog.editor.action.clipboardCutAction", () => executeCommand("editor.action.clipboardCutAction")],
        ["mog.editor.action.commentLine", commentLine],
        ["mog.editor.action.duplicateAndCommentLine", duplicateAndCommentLine],
        ["mog.editor.action.selectRectangle", () => selectRectangle(Window.activeTextEditor)]
    ];

    // cursor moves
    supportedCursorMoves.forEach(s => {
        commands.push(["mog." + s, () => mc.moveCursor(Window.activeTextEditor, s, false)]);
        commands.push(["mog." + s + "Select", () => mc.moveCursor(Window.activeTextEditor, s, true)]);
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
    Window.onDidChangeTextEditorSelection(ev => mc.reset(Window.activeTextEditor));

    console.log("Activated extension: mog-vscode");
}

export function deactivate() {
}