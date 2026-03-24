import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const packageJsonPath = join(rootDir, "package.json");
const distDir = join(rootDir, "dist");

const releaseArg = process.argv[2] || "patch";
const BUMP_TYPES = new Set(["patch", "minor", "major"]);

const run = (command, options = {}) => {
  return execSync(command, {
    cwd: rootDir,
    shell: true,
    stdio: options.stdio ?? "inherit",
    encoding: "utf-8",
  });
};

const readPackageJson = () =>
  JSON.parse(readFileSync(packageJsonPath, { encoding: "utf-8" }));

const writePackageJson = (pkg) => {
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, {
    encoding: "utf-8",
  });
};

const parseSemver = (version) => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Unsupported version format: ${version}`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
};

const bumpVersion = (version, type) => {
  if (!BUMP_TYPES.has(type)) {
    const parsed = parseSemver(type);
    return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  }

  const parsed = parseSemver(version);
  if (type === "major") {
    return `${parsed.major + 1}.0.0`;
  }
  if (type === "minor") {
    return `${parsed.major}.${parsed.minor + 1}.0`;
  }
  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
};

const ensureOnMainBranch = () => {
  const branch = run("git rev-parse --abbrev-ref HEAD", {
    stdio: "pipe",
  }).trim();
  if (branch !== "main") {
    throw new Error(`当前分支是 "${branch}". 请切换到 "main".`);
  }
};
  
const ensureCleanWorktree = () => {
  const status = run("git status --porcelain", { stdio: "pipe" }).trim();
  if (status) {
    throw new Error(
      "请先提交代码",
    );
  }
};

const ensureLoggedIn = () => {
  try {
    run("pnpm whoami", { stdio: "pipe" });
  } catch {
    throw new Error(
      "请先登录 npm",
    );
  }
};

const removeDist = () => {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }
};

const main = () => {
  console.log("正在检查 Git 状态...");
  ensureOnMainBranch();
  ensureCleanWorktree();

  const pkg = readPackageJson();
  const oldVersion = pkg.version;
  const nextVersion = bumpVersion(oldVersion, releaseArg);
  pkg.version = nextVersion;
  writePackageJson(pkg);
  console.log(`版本号已更新: ${oldVersion} -> ${nextVersion}`);

  console.log("正在删除 dist 目录...");
  removeDist();

  console.log("正在执行构建...");
  run("pnpm build");

  console.log("正在检查 npm 登录状态...");
  ensureLoggedIn();

  console.log("正在发布到 npm...");
  run("pnpm publish --no-git-checks");

  console.log(`发布完成: v${nextVersion}`);
  // console.log("建议继续执行以下命令:");
  // console.log("git add package.json pnpm-lock.yaml dist");
  // console.log(`git commit -m "release: v${nextVersion}"`);
  // console.log(`git tag v${nextVersion}`);
  // console.log("git push origin main --tags");
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
