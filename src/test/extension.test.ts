import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import DjangoProject from "../project";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Get project.", async () => {
    console.log("HELLO");
    const project = new DjangoProject("sample");
    await project.parseManagePy();
    await project.parseSettings();
    console.log("Project:");
    console.log(JSON.stringify(project, null, 2));
  });
});
