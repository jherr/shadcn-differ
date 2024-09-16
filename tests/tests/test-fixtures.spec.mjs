import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { scanForFiles, hasSrcDir } from "../../src/git.mjs";
import { readComponentsManifest } from "../../src/components.mjs";
import { createDiff } from "../../src/create-diff.mjs";

const EXPECTED_FILES = [
  {
    path: "./.env.example",
    content: "example env;",
    type: "registry:example",
    target: "~/.env.example",
  },
  {
    path: "./non-src-sub/test.ts",
    content: "non - src - sub;\n",
    type: "registry:example",
    target: "~/non-src-sub/test.ts",
  },
  {
    path: "./app/page.tsx",
    content: "page;\n",
    type: "registry:example",
    target: "./app/page.tsx",
  },
  {
    path: "./components/comp.tsx",
    content: "comp;\n",
    type: "registry:block",
    target: undefined,
  },
  {
    path: "./components/ui/new-ui-comp.tsx",
    content: "new-ui-comp;",
    type: "registry:ui",
    target: undefined,
  },
  {
    path: "./hooks/hook.ts",
    content: "hook;\n",
    type: "registry:hook",
    target: undefined,
  },
  {
    path: "./lib/lib.ts",
    content: "lib;\n",
    type: "registry:lib",
    target: undefined,
  },
];

function createDiffRequest(dir) {
  const currentFiles = scanForFiles(dir);

  const config = readComponentsManifest(dir);
  config.isSrcDir = hasSrcDir(dir);

  const specificFiles = {
    "./package.json": fs.readFileSync(
      path.join(dir, "./package.json"),
      "utf-8"
    ),
  };

  return {
    name: "example",
    config,
    alteredFiles: currentFiles,
    specificFiles,
    currentFiles,
    currentPackageJson: specificFiles["./package.json"],
  };
}

describe("fixture tests", () => {
  test("should diff a src directory project", () => {
    const diff = createDiff(createDiffRequest("./tests/fixtures/src-dir"));
    expect(diff).toMatchSnapshot();
  });
  test("should diff a non-src directory project", () => {
    const diff = createDiff(createDiffRequest("./tests/fixtures/non-src-dir"));
    expect(diff).toMatchSnapshot();
  });
});
