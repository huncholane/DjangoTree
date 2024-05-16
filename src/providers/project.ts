import * as vscode from "vscode";

export default class ProjectDataProvider
  implements vscode.TreeDataProvider<number>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    number | undefined | null | void
  > = new vscode.EventEmitter<number | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<number | undefined | null | void> =
    this._onDidChangeTreeData.event;

  getTreeItem(element: number): vscode.TreeItem {
    return {
      label: `Number: ${element}`,
      iconPath: new vscode.ThemeIcon("gear"),
      //   collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    };
  }

  getChildren(element?: number): Thenable<number[]> {
    if (element === undefined) {
      return Promise.resolve([1, 2, 3, 4, 5]);
    } else {
      return Promise.resolve([]);
    }
  }
}
