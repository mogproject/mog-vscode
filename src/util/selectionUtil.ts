"use strict";

import * as vscode from "vscode";

import Position = vscode.Position;
import Selection = vscode.Selection;
import TextEditor = vscode.TextEditor;


export function getCurrentPos(t: TextEditor): Position {
    return t.selection.active;
}

export function moveCursor(t: TextEditor, pos: Position): void {
    t.selection = new Selection(pos, pos);
}

export function removeSelection(t: TextEditor): void {
    moveCursor(t, getCurrentPos(t));
}

export function resetSelection(t: TextEditor): void {
    t.selections = t.selections.map((s) => new Selection(s.active, s.active));
}

export function hasSelectedText(t: TextEditor): boolean {
    return !t.selection.isEmpty;
}

export function currentLineHome(pos: Position): Position {
    return pos.with(undefined, 0)
}

export function nextLineHome(pos: Position): Position {
    return currentLineHome(pos).translate(1);
}