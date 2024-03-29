"use strict";

import * as vscode from "vscode";
import * as child_process from "child_process";

export class ExternalCommand {
  public readonly configPrefix = "mog.ext";
  private config: { [key: string]: string };
  private output: vscode.OutputChannel;

  constructor(configRoot: vscode.WorkspaceConfiguration) {
    this.config = configRoot.get(this.configPrefix, {});
    this.output = vscode.window.createOutputChannel("External commands");
  }

  public execute(id: string) {
    vscode.commands.executeCommand("workbench.action.files.saveAll").then(() => {
      const cmd_id = "cmd_" + id;
      const cmd = this.config[cmd_id];
      this.output.clear();
      if (!cmd) {
        this.output.appendLine("Command not defined: " + this.configPrefix + "." + cmd_id);
        // todo: add help messages
      } else {
        this.output.appendLine("Executing: " + cmd);
        try {
          const proc = child_process.spawn(cmd, [], {
            shell: true,
            cwd: vscode.workspace.rootPath,
          });
          proc.stdout.on("data", (data: any) => this.output.append(data.toString()));
          proc.stderr.on("data", (data: any) => this.output.append(data.toString()));
        } catch (error: unknown) {
          if (error instanceof Error) this.output.appendLine(error.message);
        }
      }
      this.output.show();
    });
  }
}
