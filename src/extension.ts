import * as vscode from "vscode";
import ProjectDataProvider from "./providers/project";

export function activate(context: vscode.ExtensionContext) {
  const settingsDataProvider = new ProjectDataProvider();
  [
    vscode.window.registerTreeDataProvider(
      "django-overview.project",
      settingsDataProvider
    ),
  ].forEach((disposable) => context.subscriptions.push(disposable));
  console.log("Added the providers");
}

// This method is called when your extension is deactivated
export function deactivate() {}
