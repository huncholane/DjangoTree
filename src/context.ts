import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export const setDjangoContext = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    for (const folder of workspaceFolders) {
      const dir = folder.uri.fsPath;
      const isDjango = await isDjangoProject(dir);
      const inDjango = isDjango || (await isInDjangoProject(path.dirname(dir)));
      vscode.commands.executeCommand("setContext", "isDjangoProject", isDjango);
      vscode.commands.executeCommand("setContext", "inDjangoProject", inDjango);
    }
  } else {
    vscode.commands.executeCommand("setContext", "isDjangoProject", false);
    vscode.commands.executeCommand("setContext", "inDjangoProject", false);
  }
};

const isDjangoProject = async (dir: string): Promise<boolean> => {
  const managePyPath = path.join(dir, "manage.py");
  return fs.existsSync(managePyPath);
};

const isInDjangoProject = async (dir: string): Promise<boolean> => {
  const managePyPath = path.join(dir, "manage.py");
  if (fs.existsSync(managePyPath)) {
    return true;
  }

  const parentDir = path.dirname(dir);
  if (parentDir === dir) {
    return false;
  }

  return isInDjangoProject(parentDir);
};
