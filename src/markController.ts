"use strict";

import * as vscode from "vscode";

import { removeSelection, hasSelectedText } from "./util/selectionUtil";

import TextEditor = vscode.TextEditor;
import executeCommand = vscode.commands.executeCommand;

class EditorMarkController {
  constructor(private textEditor: TextEditor, private isMarked: boolean = false, private eventCount: number = 0) {}

  public reset(): void {
    if (this.isMarked) {
      if (this.eventCount > 0) {
        --this.eventCount;
      } else {
        this.isMarked = false;
      }
    } else {
      this.eventCount = 0;
    }
  }

  public incrementEvnetCount(): void {
    ++this.eventCount;
  }

  public enter(): void {
    if (hasSelectedText(this.textEditor) && !this.isMarked) this.incrementEvnetCount();
    removeSelection(this.textEditor);
    this.isMarked = !this.isMarked;
  }

  public exit(): void {
    removeSelection(this.textEditor);
    this.isMarked = false;
  }

  public moveCursor(command: string, isSelect: boolean): void {
    const cmd = isSelect || this.isMarked ? command + "Select" : command;
    executeCommand(cmd);
    this.incrementEvnetCount();
  }
}

export class GlobalMarkController {
  private editorMarkControllers: Map<TextEditor, EditorMarkController> = new Map();

  constructor() {}

  private getMarkController(t: TextEditor): EditorMarkController {
    const ret = this.editorMarkControllers.get(t);
    if (ret) {
      return ret;
    } else {
      const mc = new EditorMarkController(t);
      this.editorMarkControllers.set(t, mc);
      return mc;
    }
  }

  public enter(t: TextEditor): void {
    this.getMarkController(t).enter();
  }

  public exit(t: TextEditor): void {
    this.getMarkController(t).exit();
  }

  public reset(t: TextEditor): void {
    this.getMarkController(t).reset();
  }

  public moveCursor(t: TextEditor, command: string, isSelect: boolean): void {
    this.getMarkController(t).moveCursor(command, isSelect);
  }
}
