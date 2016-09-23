'use strict';

import * as vscode from 'vscode';
const ncp = require("copy-paste");

import Window = vscode.window;
// import QuickPickItem = vscode.QuickPickItem;
// import QuickPickOptions = vscode.QuickPickOptions;
// import Document = vscode.TextDocument;
import Position = vscode.Position;
import Range = vscode.Range;
import Selection = vscode.Selection;
// import TextDocument = vscode.TextDocument;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;


let inMarkMode = false;
let keepMark = false;  // todo: refactor

const supportedCursorMoves: string[] = [
    "cursorUp", "cursorDown", "cursorLeft", "cursorRight", "cursorHome", "cursorEnd",
    "cursorWordLeft", "cursorWordRight", "cursorPageDown", "cursorPageUp", "cursorTop", "cursorBottom"
];

export function activate(context: vscode.ExtensionContext) {
    type Cmd = [string, { (): void }];
    type EditCmd = [string, { (t: TextEditor, e: TextEditorEdit): void }];

    // Prepare non-edit command definitions
    let commands: Cmd[] = [
        ["mog.enterMarkMode", () => enterMarkMode(Window.activeTextEditor)],
        ["mog.exitMarkMode", () => exitMarkMode(Window.activeTextEditor)],
        ["mog.editor.action.clipboardCopyAction", () => clipboardAction(Window.activeTextEditor, "Copy")]
    ];

    supportedCursorMoves.forEach(s =>
        commands.push(["mog." + s, () => {
            vscode.commands.executeCommand(inMarkMode ? s + "Select" : s);
            keepMark = inMarkMode;
        }])
    );

    // Prepare edit command definitions
    const editCommands: EditCmd[] = [
        ["mog.editor.action.clipboardCutAction", (t, e) => clipboardAction(t, "Cut")],
        ["mog.editor.action.duplicateAction", (t, e) => duplicateAction(t, e)],
        ["mog.editor.action.killLineAction", (t, e) => killLineAction(t, e)]
    ]

    // Register non-edit commands
    commands.forEach(c =>
        context.subscriptions.push(vscode.commands.registerCommand(c[0], c[1]))
    );

    // Register edit commands
    editCommands.forEach(c =>
        context.subscriptions.push(vscode.commands.registerTextEditorCommand(c[0], c[1]))
    );

    // Subscribe listeners
    Window.onDidChangeTextEditorSelection((e) => {
        if (keepMark) {
            keepMark = false;
        } else {
            inMarkMode = false;
        }
    });

    console.log("Activated extension: mog-vscode");
}

export function deactivate() {
}

// Helper functions
function getCurrentPos(editor: TextEditor): Position {
    return editor.selection.active;
}

function moveCursor(editor: TextEditor, pos: Position): void {
    editor.selection = new Selection(pos, pos);
}

function removeSelection(editor: TextEditor): void {
    const curPos = getCurrentPos(editor);
    moveCursor(Window.activeTextEditor, curPos);
}

function hasSelectedText(editor: vscode.TextEditor): boolean {
    return !editor.selection.isEmpty;
}

function currentLineHome(pos: Position): Position {
    return pos.with(undefined, 0)
}

function nextLineHome(pos: Position): Position {
    return currentLineHome(pos).translate(1);
}

function clipboardAction(editor: TextEditor, verb: string) {
    // todo: refactor logic
    return vscode.commands.executeCommand("editor.action.clipboard" + verb + "Action").then(() => {
        if (inMarkMode) {
            if (verb != "Cut") removeSelection(editor);
            inMarkMode = false;
        }
    });
}

function copyToClipboard(text: string): void {
    ncp.copy(text)
}

// Commands
function enterMarkMode(editor: TextEditor): void {
    removeSelection(editor);
    inMarkMode = !inMarkMode;
}

function exitMarkMode(editor: TextEditor): void {
    removeSelection(editor);
    inMarkMode = false;
}

function duplicateAction(editor: TextEditor, edit: TextEditorEdit): void {
    const curPos = getCurrentPos(editor);
    const selections: Selection[] = hasSelectedText(editor)
        ? editor.selections
        : [new Selection(currentLineHome(curPos), nextLineHome(curPos))];

    selections.forEach((s) => edit.insert(s.start, editor.document.getText(s)));
}

function killLineAction(editor: TextEditor, edit: TextEditorEdit): void {
    const curPos = getCurrentPos(editor);
    const lineEnd = editor.document.lineAt(curPos.line).range.end;
    const endPos = curPos.isEqual(lineEnd) ? nextLineHome(curPos) : lineEnd;
    const target = new Range(curPos, endPos);
    const txt = editor.document.getText(target);

    // Do nothing when the cursor is at the end of file.
    if (!txt) return;

    edit.delete(target);
    copyToClipboard(txt);
}
