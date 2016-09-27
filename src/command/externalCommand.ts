"use strict";

import * as vscode from "vscode";
import * as child_process from "child_process";


export class ExternalCommand {
    public readonly configPrefix = "mog.ext";
    private config: {};
    private output: vscode.OutputChannel;

    constructor(configRoot: vscode.WorkspaceConfiguration) {
        this.config = configRoot.get(this.configPrefix, {});
        this.output = vscode.window.createOutputChannel("External commands");
    }

    public execute(id: string) {
        const cmd_id = "cmd_" + id
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
                proc.stdout.on("data", (data: any)=>this.output.append(data.toString()));
                proc.stderr.on("data", (data: any)=>this.output.append(data.toString()));
            } catch (error) {
                this.output.appendLine(error);
            }
        }
        this.output.show();
    }
}