import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { featureVideos } from "./feature-videos.mjs";

const require = createRequire(import.meta.url);
const cli = fileURLToPath(
  new URL(
    "remotion-cli.js",
    pathToFileURL(require.resolve("@remotion/cli/package.json")),
  ),
);
const root = fileURLToPath(new URL("../", import.meta.url));
mkdirSync(new URL("../out/features/", import.meta.url), { recursive: true });

const requested = process.argv.slice(2);
if (requested.some(name => !featureVideos.some(video => video.name === name))) {
  throw new Error("存在未注册的功能视频名称");
}
for (const { name, composition } of featureVideos.filter(video => !requested.length || requested.includes(video.name))) {
  console.log(`导出单功能视频：${name}`);
  for (const args of [
    [
      "render",
      "src/index.ts",
      composition,
      `out/features/${name}.mp4`,
      "--codec=h264",
      "--crf=18",
      "--concurrency=2",
    ],
    [
      "still",
      "src/index.ts",
      composition,
      `out/features/${name}.png`,
      "--frame=45",
    ],
  ]) {
    const result = spawnSync(process.execPath, [cli, ...args], {
      cwd: root,
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
