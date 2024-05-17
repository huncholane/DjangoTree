import * as vscode from "vscode";
import DjangoProject from "./project";

export const onDjangoProject = new vscode.EventEmitter<DjangoProject>();

export default [
  onDjangoProject.event((e) => {
    console.log("Django project updated", e);
  }),
];
