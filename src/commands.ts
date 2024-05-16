import * as vscode from "vscode";

const managePyExists = () => {
  vscode.workspace
    .findFiles("**/manage.py", "**/node_modules/**", 1)
    .then((files) => {
      let managePyExists = files.length > 0;
      vscode.commands.executeCommand(
        "setContext",
        "managePyExists",
        managePyExists
      );
    });
};

export default [
  vscode.commands.registerCommand(
    "django-overview.managePyExists",
    managePyExists
  ),
];
