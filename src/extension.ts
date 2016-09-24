'use strict';

import * as vscode from 'vscode';
import * as clipboard from 'copy-paste';

import Window = vscode.window;
import Position = vscode.Position;
import Range = vscode.Range;
import Selection = vscode.Selection;
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
    supportedCursorMoves.forEach(s => {
        commands.push(["mog." + s, () => {
            executeCommand(inMarkMode ? s + "Select" : s);
            keepMark += 1;
        }]);
        commands.push(["mog." + s + "Select", () => {
            executeCommand(s + "Select");
            keepMark += 1;
        }])
    });

    // Prepare edit command definitions
    const editCommands: EditCmd[] = [
        ["mog.editor.action.duplicateAction", duplicateAction],
        ["mog.editor.action.killLineAction", killLineAction],
        ["mog.editor.action.toggleLetterCase", toggleLetterCase]
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
    Window.onDidChangeTextEditorSelection(resetMarkMode);

    console.log("Activated extension: mog-vscode");
}

export function deactivate() {
}

// Helper functions
function isUpper(s: string): boolean {
    return s == s.toUpperCase();
}

function resetMarkMode(ev: vscode.TextEditorSelectionChangeEvent): void {
    if (inMarkMode) {
        if (keepMark) {
            keepMark -= 1;
        } else {
            inMarkMode = false;
        }
    } else {
        keepMark = 0;
    }
}

function getCurrentPos(t: TextEditor): Position {
    return t.selection.active;
}

function moveCursor(t: TextEditor, pos: Position): void {
    t.selection = new Selection(pos, pos);
}

function removeSelection(t: TextEditor): void {
    const curPos = getCurrentPos(t);
    moveCursor(t, curPos);
}

function resetSelection(t: TextEditor): void {
    t.selections = t.selections.map((s) => new Selection(s.active, s.active));
}

function hasSelectedText(t: TextEditor): boolean {
    return !t.selection.isEmpty;
}

function currentLineHome(pos: Position): Position {
    return pos.with(undefined, 0)
}

function nextLineHome(pos: Position): Position {
    return currentLineHome(pos).translate(1);
}

function copyToClipboard(text: string): void {
    clipboard.copy(text)
}

// Commands
function enterMarkMode(t: TextEditor): void {
    if (hasSelectedText(t) && !inMarkMode) keepMark += 1;
    removeSelection(t);
    removeSelection(t);
    inMarkMode = !inMarkMode;
}

function exitMarkMode(t: TextEditor): void {
    removeSelection(t);
    inMarkMode = false;
}

function selectRectangle(t: TextEditor): void {
    if (!inMarkMode) {
        // The mark is not set now, so there is no region
        return;
    }
    const a = t.selection.anchor;
    const b = t.selection.active;

    let selections: Selection[] = []
    for (let i = Math.min(a.line, b.line); i <= Math.max(a.line, b.line); ++i) {
        selections.push(new Selection(new Position(i, a.character), new Position(i, b.character)));
    }
    t.selections = selections;
}

function clipboardCopyAction(t: TextEditor) {
    return executeCommand("editor.action.clipboardCopyAction").then(() => {
        resetSelection(t);
        inMarkMode = false;
    });
}

function duplicateAction(t: TextEditor, e: TextEditorEdit): void {
    const expandSelection = !hasSelectedText(t) || (t.selections.length == 1 && !t.selection.isSingleLine);
    const selections: Selection[] = expandSelection
        ? [new Selection(currentLineHome(t.selection.start), nextLineHome(t.selection.end))]
        : t.selections;

    selections.forEach((s) => e.insert(s.start, t.document.getText(s)));
}

function killLineAction(t: TextEditor, e: TextEditorEdit): void {
    const curPos = getCurrentPos(t);
    const lineEnd = t.document.lineAt(curPos.line).range.end;
    const endPos = curPos.isEqual(lineEnd) ? nextLineHome(curPos) : lineEnd;
    const target = new Range(curPos, endPos);
    const txt = t.document.getText(target);

    // Do nothing when the cursor is at the end of file.
    if (!txt) return;

    e.delete(target);
    copyToClipboard(txt);
}

function commentLine(): PromiseLike<void> {
    const t = Window.activeTextEditor;
    return executeCommand("editor.action.commentLine").then(() => {
        if (!hasSelectedText(t)) {
            const curPos = getCurrentPos(t);
            moveCursor(t, curPos.translate(1));
        };
    });
}

function duplicateAndCommentLine(): PromiseLike<void> {
    const t = Window.activeTextEditor;
    return executeCommand("editor.action.addCommentLine")
        .then(() => { t.edit((e) => duplicateAction(t, e)) })
        .then(() => { executeCommand("editor.action.removeCommentLine") });
}

function toggleLetterCase(t: TextEditor, e: TextEditorEdit): void {
    if (hasSelectedText(t)) {
        const isAllUpperCase = t.selections.every((s) => isUpper(t.document.getText(s)));
        t.selections.forEach((s) => {
            const text = t.document.getText(s)
            e.replace(s, isAllUpperCase ? text.toLowerCase() : text.toUpperCase());
        })
    } else {
        const curPos = getCurrentPos(t);
        if (curPos.character == 0) return;
        const target = new Range(curPos.translate(undefined, -1), curPos)
        const text = t.document.getText(target)
        e.replace(target, isUpper(text) ? text.toLowerCase() : text.toUpperCase());
    }
}