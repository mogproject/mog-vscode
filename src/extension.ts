'use strict';

import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;
import Document = vscode.TextDocument;
import Position = vscode.Position;
import Range = vscode.Range;
import Selection = vscode.Selection;
import TextDocument = vscode.TextDocument;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;
const ncp = require("copy-paste");


let inMarkMode = false;

const supportedCursorMoves: string[] = [
    "cursorUp", "cursorDown", "cursorLeft", "cursorRight",
    "cursorHome", "cursorEnd",
    "cursorWordLeft", "cursorWordRight",
    "scrollPageDown", "scrollPageUp",
    "scrollLineDown", "scrollLineUp",
    "cursorTop", "cursorBottom"
];

const supportedClipboardActions: string[] = [
    "Copy", "Cut"
]

export function activate(context: vscode.ExtensionContext) {
    type Cmd = [string, { (e: TextEditor): void }];
    type EditCmd = [string, { (a: vscode.TextEditor, b: vscode.TextEditorEdit): void }];

    // Prepare command definitions
    let commands: Cmd[] = [
        ["mog.enterMarkMode", enterMarkMode],
        ["mog.exitMarkMode", exitMarkMode],
        //  ["mog.editor.action.duplicateAction", () => duplicateAction(vscode.window.activeTextEditor, vscode.window.activeTextEditor)]
    ];

    supportedCursorMoves.forEach(s =>
        commands.push(["mog." + s, () => vscode.commands.executeCommand(inMarkMode ? s + "Select" : s)])
    );

    supportedClipboardActions.forEach(s =>
        commands.push(["mog.editor.action.clipboard" + s + "Action", () => clipboardAction(s)])
    );

    // Commands for the editor mode
    const editCommands: EditCmd[] = [
        ["mog.editor.action.duplicateAction", (t, e) => duplicateAction(t, e)],
        ["mog.editor.action.killLineAction", (t, e) => killLineAction(t, e)]
    ];

    // Register commands
    commands.forEach(c =>
        context.subscriptions.push(vscode.commands.registerCommand(c[0], c[1]))
    );

    editCommands.forEach(c =>
        context.subscriptions.push(vscode.commands.registerTextEditorCommand(c[0], c[1]))
    );

    console.log("Loaded extension: mog-vscode");
}

export function deactivate() {
}

// Commands
function enterMarkMode(): void {
    removeSelection();
    inMarkMode = !inMarkMode;
}

function exitMarkMode(): void {
    removeSelection();
    inMarkMode = false;
}

// Helper functions
function getCurrentPos(editor: TextEditor): Position {
    return editor.selection.active;
}

function moveCursor(editor: TextEditor, pos: Position): void {
    editor.selection = new Selection(pos, pos);
}

function removeSelection(): void {
    const curPos = getCurrentPos(Window.activeTextEditor);
    moveCursor(Window.activeTextEditor, curPos);
}

function hasSelectedText(editor: vscode.TextEditor): boolean {
    return !editor.selection.isEmpty;
}

function nextLineHome(pos: Position): Position {
    return pos.with(undefined, 0).translate(1);
}

function clipboardAction(verb: string) {
    return vscode.commands.executeCommand("editor.action.clipboard" + verb + "Action").then(() => {
        if (inMarkMode) {
            if (verb != "Cut") removeSelection();
            inMarkMode = false;
        }
    });
}

function duplicateAction(editor: TextEditor, edit: TextEditorEdit): void {
    const curPos = getCurrentPos(editor);
    const startPos = hasSelectedText(editor) ? editor.selection.start : curPos.with(undefined, 0);
    const endPos = hasSelectedText(editor) ? editor.selection.end : nextLineHome(curPos);
    const txt = editor.document.getText(new Range(startPos, endPos));
    edit.insert(startPos, txt);
    inMarkMode = false;  // todo: to be a function
}

function killLineAction(editor: TextEditor, edit: TextEditorEdit): void {
    const curPos = getCurrentPos(editor);
    const lineEnd = editor.document.lineAt(curPos.line).range.end;
    const endPos = curPos.isEqual(lineEnd) ? nextLineHome(curPos) : lineEnd;
    const target = new Range(curPos, endPos);
    const txt = editor.document.getText(target);

    // Do nothing if the cursor is on the file end.
    if (!txt) return;

    copyToClipboard(txt);
    edit.delete(target);
}

function copyToClipboard(text: string): void {
    ncp.copy(text)
}
