import * as vscode from "vscode";
import DjangoProject from "../project";

export default class ProjectDataProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  _update = new vscode.EventEmitter<void>();
  onDidChangeTreeData = this._update.event;
  project?: DjangoProject;

  update(project: DjangoProject) {
    console.log("updating the tree");
    this.project = project;
    this._update.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element === undefined) {
      // Return the root items
      return Promise.resolve([this.createModelsTreeItem()]);
    } else if (element.contextValue === "models") {
      if (!this.project) {
        return Promise.resolve([]);
      }
      const models = this.project.apps.flatMap((app) => app.models);
      return Promise.resolve(
        models.map((model) => new vscode.TreeItem(model.name))
      );
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
    treeItem.contextValue = "models";
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    treeItem.iconPath = new vscode.ThemeIcon("database");
    return treeItem;
  }
}
