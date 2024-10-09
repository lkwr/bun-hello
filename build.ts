import { EOL } from "node:os";
import { name } from "./package.json";

const result = await Bun.build({
  entrypoints: [import.meta.dirname + "/src/index.ts"],
  format: "esm",
  target: "bun",
  outdir: "./dist",
  minify: true,
});

for (const file of result.outputs) {
  await Bun.write(file.path, `#!/usr/bin/env bun${EOL}${await file.text()}`);
}

const now = new Date();

const dateString = `${now.getFullYear()}${
  now.getMonth() + 1
}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

const type = Bun.argv[2];

const packageJson = {
  name,
  version: `0.0.0-${type}.${dateString}`,
  type: "module",
  bin: {
    "bun-hello": "./index.js",
  },
};

await Bun.write("./dist/package.json", JSON.stringify(packageJson, null, 2));

console.log(`Built ${packageJson.version}`);
