import {
  findComponentFiles,
  getAliasedPaths,
  isBuiltinComponent,
} from "./components.mjs";
import { parseFilePath } from "./parse-file-path.mjs";

function addFile(output, config, inSrcDir, relativeFilePath, content) {
  if (!isBuiltinComponent(config, relativeFilePath)) {
    output.files.push(
      parseFilePath(inSrcDir, config, `./${relativeFilePath}`, content)
    );
  }
}

function addDependencies(
  output,
  initialPackageContents,
  currentPackageContents
) {
  const initialPackageJson = JSON.parse(initialPackageContents);
  const currentPackageJson = JSON.parse(currentPackageContents);

  output.dependencies = Object.keys(
    currentPackageJson.dependencies || {}
  ).filter((dep) => !initialPackageJson.dependencies.hasOwnProperty(dep));
  output.devDependencies = Object.keys(
    currentPackageJson.devDependencies || {}
  ).filter((dep) => !initialPackageJson.devDependencies.hasOwnProperty(dep));
}

function scanWithSrcDir(output, config, alteredFiles) {
  for (const { path, content } of alteredFiles) {
    if (path.startsWith("src/")) {
      addFile(output, config, true, path.replace("src/", ""), content);
    } else {
      addFile(output, config, false, path, content);
    }
  }
}

function isInAppDir(path) {
  return path.startsWith("app/");
}

function scanWithoutSrcDir(output, config, alteredFiles) {
  const aliasedPaths = getAliasedPaths(config);

  for (const { path, content } of alteredFiles) {
    addFile(
      output,
      config,
      aliasedPaths.includes(path) || isInAppDir(path),
      path,
      content
    );
  }
}

export function createDiff({
  name,
  config,
  alteredFiles,
  specificFiles,
  currentFiles,
  currentPackageJson,
}) {
  const output = {
    name,
    type: "registry:block",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [],
    tailwind: {},
    cssVars: {},
    meta: {},
  };

  if (config.isSrcDir) {
    scanWithSrcDir(output, config, alteredFiles);
  } else {
    scanWithoutSrcDir(output, config, alteredFiles);
  }

  output.registryDependencies = findComponentFiles(config, currentFiles);

  addDependencies(output, specificFiles["./package.json"], currentPackageJson);

  return output;
}
