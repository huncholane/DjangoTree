import * as vscode from "vscode";
import DjangoProject from "./project";
import { projectDataProvider } from "./providers";

export const djangoProjectUpdate = new vscode.EventEmitter<DjangoProject>();

export default [
  djangoProjectUpdate.event((project) => {
    projectDataProvider.update(project);
  }),
];
