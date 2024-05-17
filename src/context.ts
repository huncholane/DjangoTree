import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import DjangoProject from "./project";
import { onDjangoProject } from "./listeners";

export const setDjangoContext = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  let dir = vscode.workspace
    .getConfiguration("django-overview")
    .get("projectDir") as string;
  if (workspaceFolders && !dir) {
    for (const folder of workspaceFolders) {
      dir = folder.uri.fsPath;
      const isDjango = await isDjangoProject(dir);
      const inDjango = isDjango || (await isInDjangoProject(path.dirname(dir)));
      if (isDjango || inDjango) {
        vscode.commands.executeCommand(
          "setContext",
          "django-overview.projectDir",
          dir
        );
      }
    }
  } else {
    vscode.commands.executeCommand(
      "setContext",
      "django-overview.projectDir",
      null
    );
  }
  if (dir) {
    const project = new DjangoProject(dir);
    await project.read();
    vscode.commands.executeCommand(
      "setContext",
      "django-overview.project",
      project
    );
    onDjangoProject.fire(project);
    console.log("Django context set");
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

export const getDjangoProjectDir = (): string | undefined => {
  return vscode.workspace.getConfiguration("django-overview").get("projectDir");
};

export const getSkipDirs = () => {
  return vscode.workspace.getConfiguration("django-overview").get("skipDirs");
};
