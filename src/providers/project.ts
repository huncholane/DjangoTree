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
      return Promise.resolve([
        new vscode.TreeItem(
          "Item 1",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
        new vscode.TreeItem(
          "Item 2",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
        new vscode.TreeItem(
          "Item 3",
          vscode.TreeItemCollapsibleState.Collapsed
        ),
      ]);
    } else {
      // Return the child items for the given parent item
      return Promise.resolve([
        this.createSettingsTreeItem(),
        new vscode.TreeItem("Subitem 2"),
        new vscode.TreeItem("Subitem 3"),
      ]);
    }
  }

  private createSettingsTreeItem(): vscode.TreeItem {
    const treeItem = new vscode.TreeItem("Settings");
    treeItem.checkboxState = {
      state: vscode.TreeItemCheckboxState.Checked,
    };
    treeItem.command = {
      command: "django-overview.openSettings",
      title: "Open Settings",
    };
    return treeItem;
  }
}
