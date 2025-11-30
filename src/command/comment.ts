"use strict";

import * as vscode from "vscode";

import { getCurrentPos, hasSelectedText, moveCursor } from "../util/selection-util";
import executeCommand = vscode.commands.executeCommand;

export async function commentLine(): Promise<void> {
  const t = vscode.window.activeTextEditor;
  await executeCommand("editor.action.commentLine");
  if (t && !hasSelectedText(t)) {
    const curPos = getCurrentPos(t);
    moveCursor(t, curPos.translate(1));
  }
}
