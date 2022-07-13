"use strict";

import * as vscode from "vscode";

import { removeSelection, hasSelectedText } from "./util/selectionUtil";
import { GlobalMarkController } from "./markController";
import { joinLines } from "./command/join";
import { toggleLetterCase } from "./command/letterCase";
import { selectRectangle } from "./command/selection";
import { commentLine } from "./command/comment";
import { clipboardCopyAction, duplicateAction, killLineAction, duplicateAndCommentLine } from "./command/copy";
import { ExternalCommand } from "./command/externalCommand";
import { formatAction } from "./command/format";

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
  const ext = new ExternalCommand(vscode.workspace.getConfiguration());

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

  // external commands
  commands.push(["mog.ext.cmd_0", () => ext.execute("0")]);
  commands.push(["mog.ext.cmd_1", () => ext.execute("1")]);
  commands.push(["mog.ext.cmd_2", () => ext.execute("2")]);
  commands.push(["mog.ext.cmd_3", () => ext.execute("3")]);
  commands.push(["mog.ext.cmd_4", () => ext.execute("4")]);
  commands.push(["mog.ext.cmd_5", () => ext.execute("5")]);
  commands.push(["mog.ext.cmd_6", () => ext.execute("6")]);
  commands.push(["mog.ext.cmd_7", () => ext.execute("7")]);
  commands.push(["mog.ext.cmd_8", () => ext.execute("8")]);
  commands.push(["mog.ext.cmd_9", () => ext.execute("9")]);
  commands.push(["mog.ext.cmd_enter", () => ext.execute("enter")]);

  // Prepare edit command definitions
  const editCommands: EditCmd[] = [
    ["mog.editor.action.duplicateAction", duplicateAction],
    ["mog.editor.action.killLineAction", killLineAction],
    ["mog.editor.action.toggleLetterCase", toggleLetterCase],
    ["mog.editor.action.joinLines", joinLines],
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

export function deactivate() {}
