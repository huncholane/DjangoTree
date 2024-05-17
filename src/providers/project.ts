import * as vscode from "vscode";
import DjangoProject from "../project";

export default class ProjectDataProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = new vscode.EventEmitter<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<
    void | vscode.TreeItem | vscode.TreeItem[] | null | undefined
  > = this._onDidChangeTreeData.event;

  project: DjangoProject;

  constructor() {
    this.project = vscode.workspace
      .getConfiguration("django-overview")
      .get("project") as DjangoProject;
  }

  setContext(context: DjangoProject) {
    this.project = context;
    console.log(`Setting project to ${context}`);
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    console.log(this.project);
    console.log(element?.contextValue);
    if (element === undefined) {
      // Return the root items
      return Promise.resolve([this.createModelsTreeItem()]);
    } else if (element.contextValue === "models") {
      // const models = [];
      // for (const app of this.project.apps) {
      //   for (const model of app.models) {
      //     models.push
      //   }
      // }
      const models = this.project.apps.flatMap((app) => app.models);
      console.log(models);
      console.log("Adding the models");
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
