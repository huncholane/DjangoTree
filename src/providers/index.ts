import * as vscode from "vscode";
import ProjectDataProvider from "./project";

export const projectDataProvider = new ProjectDataProvider();

export default [
  vscode.window.registerTreeDataProvider(
    "django-overview.project",
    projectDataProvider
  ),
];
