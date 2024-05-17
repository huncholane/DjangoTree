import * as childProcess from "child_process";
import { getDjangoProjectDir } from "./context";
import * as fs from "fs";
import { promisify } from "util";
import regex from "./regex";
import path from "path";
import * as vscode from "vscode";

const readFile = promisify(fs.readFile);

type Field = {
  name: string;
  type: string;
  index: number;
};

type Model = {
  name: string;
  index: number;
  fields: Field[];
};

class App {
  name: string;
  module: string;
  path: string;
  models: Model[];

  constructor(module: string) {
    this.module = module;
    this.models = [];
    let name = module.split(".").pop();
    const pythonPath =
      vscode.workspace.getConfiguration("python").get("pythonPath") ||
      "python3";
    if (name) {
      this.name = name;
    } else {
      throw new Error("Invalid module name");
    }
    const pythonScript = `
import importlib.util
import os
module = '${this.module}'
spec = importlib.util.find_spec(module)
if spec is not None and spec.origin is not None:
    print(os.path.dirname(spec.origin))
  `;
    try {
      const result = childProcess
        .execSync(`${pythonPath} -c "${pythonScript}"`)
        .toString();
      this.path = result.trim();
    } catch (error) {
      console.error(error);
      throw new Error(`Error getting path for app ${this.name}`);
    }
    console.log(`Reading models.py for app ${this.name}`);
    try {
      const data = fs.readFileSync(`${this.path}/models.py`, "utf-8");
      const models = data.matchAll(regex.model);
      for (const modelMatch of models) {
        const model: Model = {
          name: modelMatch[1],
          index: modelMatch.index || 0,
          fields: [],
        };
        const fields = modelMatch[2].matchAll(regex.modelField);
        for (const fieldMatch of fields) {
          const field: Field = {
            name: fieldMatch[1],
            type: fieldMatch[2],
            index: fieldMatch.index || 0,
          };
          model.fields.push(field);
        }
        this.models.push(model);
      }
      console.log(models);
    } catch (err) {
      console.error(`Error reading models.py for app ${this.name}`);
      // throw new Error(`Error reading models.py for app ${this.name}`);
    }
  }
}

export default class DjangoProject {
  projectDir: string;
  name?: string;
  apps: App[];

  constructor(rootDir: string) {
    this.projectDir = rootDir;
    this.apps = [];
  }

  async read() {
    const originalDir = process.cwd();
    process.chdir(this.projectDir);
    try {
      await this.parseManagePy();
      await this.parseSettings();
    } finally {
      process.chdir(originalDir);
    }
  }

  async parseManagePy() {
    const managePyPath = `${this.projectDir}/manage.py`;
    const text = await readFile(managePyPath, "utf-8");
    const match = text.match(regex.projectName);
    this.name = match ? match[1] : undefined;
  }

  async parseSettings() {
    const settingsPath = `${this.projectDir}/${this.name}/settings.py`;
    const text = await readFile(settingsPath, "utf-8");
    const appContainerMatch = text.match(regex.appContainer);
    const appContainer = appContainerMatch ? appContainerMatch[1] : "";
    const apps = appContainer.matchAll(regex.module);
    for (const app of apps ? apps : []) {
      this.apps.push(new App(app[1]));
    }
    console.log(apps);
  }
}

export const getProject = async () => {};

export const getAvailableApps = async () => {
  const projectDir = getDjangoProjectDir();
};
