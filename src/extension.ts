import * as vscode from "vscode";
import ProjectDataProvider from "./providers/project";
import providers from "./providers";
import commands from "./commands";
import { setDjangoContext } from "./context";

export function activate(context: vscode.ExtensionContext) {
  setDjangoContext();
  context.subscriptions.concat(providers);
  context.subscriptions.concat(commands);
}

// This method is called when your extension is deactivated
export function deactivate() {}
