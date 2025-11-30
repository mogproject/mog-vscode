import * as vscode from 'vscode';

import { GlobalMarkController } from './GlobalMarkController';
import { clipboardCopyAction, duplicateAction, killLineAction, duplicateAndCommentLine } from "./command/copy";
import { commentLine } from './command/comment';
import { formatAction } from './command/format';
import { selectRectangle } from './command/select';

import Window = vscode.window;
import TextEditor = vscode.TextEditor;
import TextEditorEdit = vscode.TextEditorEdit;
import executeCommand = vscode.commands.executeCommand;

const supportedCursorMoves: string[] = [
  "cursorUp",
  "cursorDown",
  "cursorLeft",
  "cursorRight",
  "cursorHome",
  "cursorEnd",
  "cursorWordLeft",
  "cursorWordRight",
  "cursorPageDown",
  "cursorPageUp",
  "cursorTop",
  "cursorBottom",
];

export function activate(context: vscode.ExtensionContext) {
  type Cmd = [string, { (): void }];
  type EditCmd = [string, { (t: TextEditor, e: TextEditorEdit): void }];

  const mc = new GlobalMarkController();

  // Prepare non-edit command definitions
  let commands: Cmd[] = [
    ["mog.editor.action.enterMarkMode", () => Window.activeTextEditor && mc.enter(Window.activeTextEditor)],
    ["mog.editor.action.exitMarkMode", () => Window.activeTextEditor && mc.exit(Window.activeTextEditor)],
    ["mog.editor.action.clipboardCopyAction", () => Window.activeTextEditor && clipboardCopyAction(Window.activeTextEditor)],
    ["mog.editor.action.clipboardCutAction", () => executeCommand("editor.action.clipboardCutAction")],
    ["mog.editor.action.commentLine", commentLine],
    ["mog.editor.action.duplicateAndCommentLine", duplicateAndCommentLine],
    ["mog.editor.action.selectRectangle", () => Window.activeTextEditor && selectRectangle(Window.activeTextEditor)],
    ["mog.editor.action.format", formatAction],
  ];

  // cursor moves
  supportedCursorMoves.forEach((s) => {
    commands.push(["mog." + s, () => Window.activeTextEditor && mc.moveCursor(Window.activeTextEditor, s, false)]);
    commands.push(["mog." + s + "Select", () => Window.activeTextEditor && mc.moveCursor(Window.activeTextEditor, s, true)]);
  });

  // Prepare edit command definitions
  const editCommands: EditCmd[] = [
    ["mog.editor.action.duplicateAction", duplicateAction],
    ["mog.editor.action.killLineAction", killLineAction],
  ];

  // Register commands
  commands
    .map((c) => vscode.commands.registerCommand(c[0], c[1]))
    .concat(editCommands.map((c) => vscode.commands.registerTextEditorCommand(c[0], c[1])))
    .forEach((r) => context.subscriptions.push(r));

  // Subscribe listeners
  Window.onDidChangeTextEditorSelection((ev) => Window.activeTextEditor && mc.reset(Window.activeTextEditor));

  console.log("Activated extension: mog-vscode");
}

// This method is called when your extension is deactivated
export function deactivate() { }
