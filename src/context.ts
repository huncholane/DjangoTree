import * as vscode from "vscode";
import * as path from "path";

export const setDjangoContext = () => {
  vscode.workspace.findFiles("manage.py", "", 1).then((files) => {
    let isDjangoProject = files.length > 0;
    vscode.commands.executeCommand(
      "setContext",
      "isDjangoProject",
      isDjangoProject
    );
  });
};
