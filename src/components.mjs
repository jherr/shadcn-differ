import path from "node:path";
import fs from "node:fs";

const WHITELISTED_COMPONENTS = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "table",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "input-otp",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
];

export function findComponentFiles(config, originalFiles) {
  const registryDependencies = [];
  const compDir = config.ui.replace("@/", config.isSrcDir ? "src/" : "");
  for (const { path: filePath } of originalFiles) {
    if (filePath.startsWith(compDir)) {
      const fileExtension = path.extname(filePath);
      const fileName = path.basename(filePath, fileExtension);
      if (
        (fileExtension === ".tsx" || fileExtension === ".jsx") &&
        WHITELISTED_COMPONENTS.includes(fileName)
      ) {
        registryDependencies.push(path.basename(filePath, fileExtension));
      }
    }
  }
  return registryDependencies;
}

export function readComponentsManifest(dir) {
  const manifestPath = path.join(dir, "./components.json");
  if (fs.existsSync(manifestPath)) {
    const config = JSON.parse(fs.readFileSync(manifestPath, "utf-8")).aliases;
    return config;
  } else {
    console.error("Components manifest not found");
    process.exit(1);
  }
}

export function getAliasedPaths(config) {
  return [
    config.components.replace("@/", ""),
    config.utils.replace("@/", ""),
    config.ui.replace("@/", ""),
    config.lib.replace("@/", ""),
    config.hooks.replace("@/", ""),
  ];
}

export function isBuiltinComponent(config, filePath) {
  if (filePath.startsWith(config.ui.replace("@/", ""))) {
    const component = path.basename(filePath, path.extname(filePath));
    return WHITELISTED_COMPONENTS.includes(component);
  }
  return false;
}
