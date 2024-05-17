import * as vscode from "vscode";
import DjangoProject, { Model } from "../project";

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
    if (!this.project) {
      return Promise.resolve([]);
    }
    if (element === undefined) {
      const items = [];
      for (const [app_name, app] of this.project.apps.entries()) {
        items.push(this.createAppTreeItem(app_name));
      }
      return Promise.resolve(items);
    } else if (element.contextValue?.includes("-app")) {
      const appName = element.contextValue.split("-")[0];
      return Promise.resolve([this.createModelsTreeItem(appName)]);
    } else if (element.contextValue?.includes("-models")) {
      const appName = element.contextValue.split("-")[0];
      const app = this.project.apps.get(appName);
      const items = [];
      if (app) {
        for (const [modelName, model] of app.models) {
          items.push(this.createModelTreeItem(appName, model));
        }
      }
      return Promise.resolve(items);
    } else if (element.contextValue?.includes("-model")) {
      console.log(`Getting fields for ${element.label}`);
      const appName = element.contextValue.split("-")[0];
      const modelName = element.contextValue.split("-")[1];
      const app = this.project.apps.get(appName);
      const model = app?.models.get(modelName);
      console.log(model);
      const items = [];
      if (model) {
        for (const [fieldName, field] of model.fields) {
          items.push(this.createFieldTreeItem(appName, modelName, field));
        }
      }
      return Promise.resolve(items);
    }
    return Promise.resolve([]);
  }

  private createFieldTreeItem(appName: string, modelName: string, field: any) {
    const treeItem = new vscode.TreeItem(field.name);
    treeItem.contextValue = `${appName}-${modelName}-${field.name}-field`;
    treeItem.iconPath = new vscode.ThemeIcon("symbol-field");
    return treeItem;
  }

  private createModelTreeItem(appName: string, model: Model) {
    const treeItem = new vscode.TreeItem(model.name);
    treeItem.contextValue = `${appName}-${model.name}-model`;
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    treeItem.iconPath = new vscode.ThemeIcon("symbol-class");
    treeItem.command = {
      command: "django-overview.openFile",
      title: "Open File",
      arguments: [model.filename, model.index],
    };
    return treeItem;
  }

  private createModelsTreeItem(appName: string): vscode.TreeItem {
    const treeItem = new vscode.TreeItem("Models");
    treeItem.contextValue = `${appName}-models`;
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    treeItem.iconPath = new vscode.ThemeIcon("database");
    return treeItem;
  }

  private createAppTreeItem(appName: string): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(appName);
    treeItem.contextValue = `${appName}-app`;
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    treeItem.iconPath = new vscode.ThemeIcon("project");
    return treeItem;
  }
}
