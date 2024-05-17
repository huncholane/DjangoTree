import * as vscode from "vscode";

export default class ProjectDataProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element === undefined) {
      // Return the root items
      return Promise.resolve([this.createModelsTreeItem()]);
    } else {
      // Return the child items for the given parent item
      return Promise.resolve([
        new vscode.TreeItem("Subitem 2"),
        new vscode.TreeItem("Subitem 3"),
      ]);
    }
  }

  private createModelsTreeItem(): vscode.TreeItem {
    const treeItem = new vscode.TreeItem("Models");
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    return treeItem;
  }
}
