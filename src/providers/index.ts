import * as vscode from "vscode";
import ProjectDataProvider from "./project";

export default [
  vscode.window.registerTreeDataProvider(
    "django-overview.project",
    new ProjectDataProvider()
  ),
];
