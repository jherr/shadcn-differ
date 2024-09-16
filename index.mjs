#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { program } from "commander";

import { scanForAlteredFiles, scanForFiles, hasSrcDir } from "./src/git.mjs";
import { readComponentsManifest } from "./src/components.mjs";
import { createDiff } from "./src/create-diff.mjs";

program.option("-n, --name <name>");
program.parse();

const options = program.opts();

const main = () => {
  const name = options.name || path.basename(process.cwd());

  const { alteredFiles, specificFiles } = scanForAlteredFiles([
    "./package.json",
  ]);
  const currentFiles = scanForFiles(process.cwd());

  const currentPackageJson = fs.readFileSync("./package.json", "utf-8");

  const config = readComponentsManifest(process.cwd());
  config.isSrcDir = hasSrcDir(process.cwd());

  const output = createDiff({
    name,
    config,
    alteredFiles,
    currentFiles,
    specificFiles,
    currentPackageJson,
  });

  console.log(JSON.stringify(output, null, 2));
};

main();
