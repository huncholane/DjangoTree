import * as childProcess from "child_process";
import { getDjangoProjectDir } from "./context";
import * as fs from "fs";
import { promisify } from "util";
import regex from "./regex";

type Field = {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  default: string;
  max_length: number;
  choices: [string];
};

type Model = {
  name: string;
  fields: [Field];
};

type App = {
  name: string;
  //   path: string;
  //   urls: [string];
  //   models: [{string: Model}];
};

type Project = {
  name: string;
};

const readFile = promisify(fs.readFile);

export default class DjangoProject {
  projectDir?: string;
  name?: string;

  constructor(rootDir: string) {
    this.projectDir = rootDir;
  }

  async parseManagePy() {
    const managePyPath = `${this.projectDir}/manage.py`;
    const text = await readFile(managePyPath, "utf-8");
    const match = text.match(regex.projectName);
    this.name = match ? match[1] : undefined;
  }
}

export const getProject = async () => {};

export const getAvailableApps = async () => {
  const projectDir = getDjangoProjectDir();
};
