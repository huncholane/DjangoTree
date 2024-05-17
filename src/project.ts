import * as childProcess from "child_process";
import { getDjangoProjectDir } from "./context";
import * as fs from "fs";
import { promisify } from "util";
import regex from "./regex";
import path from "path";
import * as vscode from "vscode";

const readFile = promisify(fs.readFile);

export type Field = {
  name: string;
  type: string;
  index: number;
  raw: string;
};

export type Model = {
  name: string;
  index: number;
  fields: Map<string, Field>;
};

export class App {
  name: string;
  module: string;
  path: string;
  models: Map<string, Model>;

  constructor(module: string) {
    this.module = module;
    this.models = new Map();
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
        .execSync(`${pythonPath} -c "${pythonScript}" 2>/dev/null`)
        .toString();
      this.path = result.trim();
    } catch (error) {
      throw new Error(`Error getting path for app ${this.name}`);
    }
    try {
      const data = fs.readFileSync(`${this.path}/models.py`, "utf-8");
      const models = data.matchAll(regex.model);
      for (const modelMatch of models) {
        const model: Model = {
          name: modelMatch[1],
          index: modelMatch.index || 0,
          fields: new Map(),
        };
        const fields = modelMatch[2].matchAll(regex.modelField);
        for (const fieldMatch of fields) {
          const field: Field = {
            name: fieldMatch[1],
            type: fieldMatch[2],
            index: fieldMatch.index || 0,
            raw: fieldMatch[0],
          };
          model.fields.set(field.name, field);
        }
        this.models.set(model.name, model);
      }
    } catch (err) {
      // throw new Error(`Error reading models.py for app ${this.name}`);
    }
  }
}

export default class DjangoProject {
  projectDir: string;
  name?: string;
  apps: Map<string, App>;

  constructor(rootDir: string) {
    this.projectDir = rootDir;
    this.apps = new Map();
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
      try {
        this.apps.set(app[1], new App(app[1]));
      } catch {}
    }
  }
}
