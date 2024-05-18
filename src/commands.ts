import * as vscode from "vscode";

export default [
  vscode.commands.registerCommand(
    "django-tree.openFile",
    (location: string, index: number) => {
      vscode.window
        .showTextDocument(vscode.Uri.file(location))
        .then((editor) => {
          const position = editor.document.positionAt(index);
          const range = editor.document.lineAt(position.line).range;
          editor.selection = new vscode.Selection(range.start, range.end);
          editor.revealRange(range);
        });
    }
  ),
];
