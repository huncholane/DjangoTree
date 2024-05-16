import * as vscode from "vscode";
import ProjectDataProvider from "./providers/project";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.concat([
    vscode.window.registerTreeDataProvider(
      "django-overview.project",
      new ProjectDataProvider()
    ),
  ]);
}

// This method is called when your extension is deactivated
export function deactivate() {}
