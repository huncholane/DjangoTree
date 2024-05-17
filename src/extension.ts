import * as vscode from "vscode";
import ProjectDataProvider from "./providers/project";
import providers from "./providers";
import commands from "./commands";
import { setDjangoContext } from "./context";
import listeners from "./events";

export async function activate(context: vscode.ExtensionContext) {
  await setDjangoContext();
  context.subscriptions.concat(providers);
  context.subscriptions.concat(commands);
  context.subscriptions.concat(listeners);
}

// This method is called when your extension is deactivated
export function deactivate() {}
