function fixAlias(alias) {
  return alias.replace("@", ".");
}

export function parseFilePath(wasInSrcDir, config, filePath, content) {
  const out = {
    path: filePath,
    content,
    type: "registry:example",
    target: wasInSrcDir ? filePath : `~/${filePath.replace("./", "")}`,
  };

  if (filePath.startsWith(fixAlias(config.ui))) {
    out.type = "registry:ui";
    out.target = undefined;
  } else if (filePath.startsWith(fixAlias(config.components))) {
    out.type = "registry:block";
    out.target = undefined;
  } else if (filePath.startsWith(fixAlias(config.hooks))) {
    out.type = "registry:hook";
    out.target = undefined;
  } else if (filePath.startsWith(fixAlias(config.lib))) {
    out.type = "registry:lib";
    out.target = undefined;
  }

  if (out.type === "registry:example") {
    out.path = filePath;
  }

  return out;
}
