'use strict';

import * as vscode from 'vscode';

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
    type Cmd = [string, { (): void }];

    // Prepare command definitions
    let commands: Cmd[] = [
        ["mog.enterMarkMode", enterMarkMode],
        ["mog.exitMarkMode", exitMarkMode],
        ["mog.editor.action.duplicateAction", duplicateAction]
    ];

    supportedCursorMoves.forEach(s =>
        commands.push(["mog." + s, () => vscode.commands.executeCommand(inMarkMode ? s + "Select" : s)])
    );

    supportedClipboardActions.forEach(s =>
        commands.push(["mog.editor.action.clipboard" + s + "Action", () => clipboardAction(s)])
    );

    // Register commands
    commands.forEach(c =>
        context.subscriptions.push(vscode.commands.registerCommand(c[0], c[1]))
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

function clipboardAction(verb: string) {
    return vscode.commands.executeCommand("editor.action.clipboard" + verb + "Action").then(() => {
        if (inMarkMode) {
            if (verb != "Cut") removeSelection();
            inMarkMode = false;
        }
    });
}

function duplicateAction() {
    return vscode.commands.executeCommand("mog.editor.action.clipboardCopyAction").then(() => {
        vscode.commands.executeCommand("editor.action.clipboardPasteAction")
    });
}

function removeSelection(): void {
    let currentPosition: vscode.Position = vscode.window.activeTextEditor.selection.active;
    vscode.window.activeTextEditor.selection = new vscode.Selection(currentPosition, currentPosition);
}
