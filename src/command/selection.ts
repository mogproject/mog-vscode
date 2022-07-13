"use strict";

import * as vscode from "vscode";

import { getCurrentPos, removeSelection, hasSelectedText } from "../util/selectionUtil";
import Position = vscode.Position;
import Selection = vscode.Selection;
import TextEditor = vscode.TextEditor;

export function selectRectangle(t: TextEditor): void {
  const a = t.selection.anchor;
  const b = t.selection.active;
  const minLine = Math.min(a.line, b.line);
  const maxLine = Math.max(a.line, b.line);

  let selections: Selection[] = [];
  for (let i = minLine; i <= maxLine; ++i) {
    selections.push(new Selection(new Position(i, a.character), new Position(i, b.character)));
  }
  t.selections = selections;
}
