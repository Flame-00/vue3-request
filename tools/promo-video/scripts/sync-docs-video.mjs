import { copyFile, mkdir, stat } from "node:fs/promises";
import { featureVideos } from "./feature-videos.mjs";

const root = new URL("../", import.meta.url);
const source = new URL("out/vue3-request-v4.mp4", root);
const poster = new URL("out/poster-v4.png", root);
const destination = new URL(
  "../../packages/vitepress-demo/docs/public/media/",
  root,
);

const assets = [
  { source, name: "vue3-request-demo.mp4" },
  { source: poster, name: "vue3-request-demo-poster.png" },
  ...featureVideos.flatMap(({ name }) => [
    { source: new URL(`out/features/${name}.mp4`, root), name: `${name}.mp4` },
    { source: new URL(`out/features/${name}.png`, root), name: `${name}.png` },
  ]),
];
for (const { source: asset } of assets) {
  const info = await stat(asset);
  if (!info.isFile() || info.size === 0) {
    throw new Error(`视频素材无效：${asset.pathname}`);
  }
}
await mkdir(destination, { recursive: true });
for (const asset of assets) {
  await copyFile(asset.source, new URL(asset.name, destination));
}
console.log("已将完整演示、单功能视频及封面同步到文档 public/media。");
