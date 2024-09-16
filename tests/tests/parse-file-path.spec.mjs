import { describe, expect, test } from "vitest";
import { parseFilePath } from "../../src/parse-file-path.mjs";

const CONFIG_IN_SRC = {
  components: "@/components",
  utils: "@/lib/utils",
  ui: "@/components/ui",
  lib: "@/lib",
  hooks: "@/hooks",
  isSrcDir: true,
};
const CONFIG = {
  ...CONFIG_IN_SRC,
  isSrcDir: false,
};

const trim = ({ path, type, target }) => ({
  path,
  type,
  target,
});

describe("parseFilePath", () => {
  test("should handle a new component in a src directory", () => {
    expect(
      trim(
        parseFilePath(
          true,
          CONFIG_IN_SRC,
          "./components/spinning-credit-card.tsx"
        )
      )
    ).toEqual({
      type: "registry:block",
      path: "./components/spinning-credit-card.tsx",
    });
  });

  test("should handle a new component", () => {
    expect(
      trim(
        parseFilePath(false, CONFIG, "./components/spinning-credit-card.tsx")
      )
    ).toEqual({
      type: "registry:block",
      path: "./components/spinning-credit-card.tsx",
    });
  });

  test("should handle a new page in a src directory", () => {
    expect(trim(parseFilePath(true, CONFIG_IN_SRC, "./app/page.tsx"))).toEqual({
      type: "registry:example",
      target: "./app/page.tsx",
      path: "./app/page.tsx",
    });
  });

  test("should handle a new page in an app directory", () => {
    expect(trim(parseFilePath(true, CONFIG, "./app/page.tsx"))).toEqual({
      type: "registry:example",
      target: "./app/page.tsx",
      path: "./app/page.tsx",
    });
  });

  test("should handle an environment file with a src directory", () => {
    expect(trim(parseFilePath(false, CONFIG_IN_SRC, "./.env.example"))).toEqual(
      {
        type: "registry:example",
        target: "~/.env.example",
        path: "./.env.example",
      }
    );
  });

  test("should handle an environment file", () => {
    expect(trim(parseFilePath(false, CONFIG, "./.env.example"))).toEqual({
      type: "registry:example",
      target: "~/.env.example",
      path: "./.env.example",
    });
  });

  test("should handle a new hook", () => {
    expect(
      trim(
        parseFilePath(
          false,
          CONFIG_IN_SRC,
          "./hooks/use-spinning-credit-card.ts"
        )
      )
    ).toEqual({
      type: "registry:hook",
      path: "./hooks/use-spinning-credit-card.ts",
    });
  });

  test("should handle a new library file", () => {
    expect(trim(parseFilePath(true, CONFIG_IN_SRC, "./lib/utils.ts"))).toEqual({
      type: "registry:lib",
      path: "./lib/utils.ts",
    });
  });
});
