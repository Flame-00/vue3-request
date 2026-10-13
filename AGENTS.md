# 项目开发约束

本文件适用于整个仓库。修改前先理解现有代码，以最小、可靠的改动完成需求。用户本次明确指令优先；有更具体的目录约束时同步检查。

## 沟通与工作方式

- 默认使用简体中文回复、说明和注释，技术名词、API、命令和标识符保持英文。
- 先检查 `git status --short`，再阅读实现、类型、调用方和相关文档；不得覆盖、回滚或混入用户的无关修改。
- 仅请求分析时保持只读；明确要求修改时直接实施。能依据源码判断的细节自行处理，行为或范围存在重大歧义时再确认。
- 排查顺序：现象与错误 → 根因及调用链 → 最小修复 → 验证。禁止通过隐藏错误、移除校验或关闭类型检查绕过问题。
- 不进行无关重构、整文件格式化、重命名、依赖升级或功能删除。不主动 commit、push、发布、reset 或清理用户数据。

## 项目结构与入口

- pnpm workspace：`pnpm-workspace.yaml` 管理 `packages/*`，保留 `pnpm-lock.yaml` 与已有依赖策略。
- `packages/request/vue3-request/`：请求库源码。`useRequest.ts` 定义公开重载及插件顺序，`useRequestImpl.ts` 连接 Vue 生命周期与响应式返回值，`request.ts` 管理请求执行和状态。
- `types.ts` 定义公共契约；`index.ts` 是库导出入口；`plugins/` 实现内置插件；`utils/` 包含插件定义、中间件、缓存及事件订阅工具。
- `packages/vue3/`：Vue 3 + TypeScript + Vite 演示应用，沿用 `<script setup lang="ts">` 和现有 Naive UI 组件。
- `packages/vitepress-demo/docs/`：VitePress 文档与示例；配置和演示组件位于 `.vitepress/`。
- 根目录 `vite.config.ts`、`build/` 构建库并生成类型声明；`scripts/release.mjs` 负责发布；`.github/workflows/deploy.yml` 构建并部署文档。
- 分清示例使用的本地 `@async-handler/request/vue3-request` 和已发布的 `vue3-request`，验证前确认 import 实际指向，不能默认示例已覆盖当前源码。

## 实现与类型约束

- 优先复用现有 hooks、插件、工具和缓存机制，避免为简单需求新增依赖或复杂抽象。
- 沿用附近代码的命名、import 和格式。保留 strict 检查；历史 `any` 和 `@ts-ignore` 不作为新增代码的模板，不扩大它们的使用范围。
- 公共行为变化同步检查实现、`types.ts`、`useRequest.ts` 重载、`index.ts` 导出、文档和示例，包括 service 参数推导和 `resKey` 返回类型。
- 当前 `data` 保存原始响应，`res` 根据 `resKey` 提取；生命周期参数和返回值以当前源码为准，不套用其他请求库 API。
- 插件通过 `utils/definePlugin.ts` 定义。变更前阅读 `Plugin` / `PluginReturn`、`executePlugin` 与 `composeMiddleware`，确认生命周期返回值和组合顺序。
- `useRequest` 当前先组合自定义插件，再组合默认插件；不能随意改变顺序或绕过 `Request` 的状态管理。
- 响应式选项按实际类型处理普通值、Ref、getter；适用时使用 `toValue`，并确认 watcher 或执行时读取能响应后续变化。
- 保留 `currentRequestId` 对过期结果的保护；修改异步流程时检查并发、重复执行、错误传播、loading 和完成状态。
- `cancel` 会触发 `onCancel` 并使旧请求失效；默认 abort 插件的 `onCancel` 也会中止当前 AbortController，`abort` 则显式中止并调用 `cancel`。service 需要使用对应 signal 才能实际中止网络请求。卸载当前调用 `cancel`，但手动取消不等于永久销毁。
- watcher、定时器、事件订阅、缓存订阅必须有明确清理路径；改变取消逻辑时检查后续刷新、重试、轮询是否还能正常工作。
- 不手工编辑 `dist/`、`.vitepress/dist/`、`.vitepress/cache/` 或 `node_modules/` 等生成产物。不留下临时日志、调试配置、占位实现或无依据的类型断言。

## 验证与命令

执行前读取相关 `package.json` 并确认依赖和环境；以下是当前已有命令，不代表它们已在本次任务中执行。

- 开发：`pnpm dev:vue3`、`pnpm dev:docs`；需要两者时使用 `pnpm dev:all`。
- 核心库改动：`pnpm build`，检查库打包和声明生成结果；不能据此声称演示应用类型检查通过。
- 演示改动或类型影响：`pnpm --filter @async-handler/vue3 type-check`；构建使用 `pnpm build:vue3`（该命令仅执行 `build-only`）。
- 文档和示例改动：`pnpm build:docs`；该脚本先注册演示组件，检查生成文件是否产生意外差异。
- 规则或纯文本改动：检查文件内容与 `git diff --check`，通常无需运行应用构建。
- 当前根目录没有 lint、test、type-check 脚本，request 子包也没有检查脚本；不要编造命令或将构建等同于单元测试。新增测试应针对真实风险，沿用已有设施（若后续引入）。
- 不以 `pnpm rf` 或 `pnpm release*` 验证修改：前者清理目录，后者涉及版本与发布操作，需要用户明确授权。
- 检查失败时区分环境、已有问题和本次回归；只修复本次相关问题。收尾说明修改文件、执行的验证、结果及未验证的运行行为。

## 规则维护

- `.cursor/rules/vue3-request-project.mdc` 是 Cursor 全项目规则摘要，本文件提供完整约束和入口；修改共同约束时同步更新，避免互相矛盾。
- `.agents/skills/project-development-workflow/SKILL.md` 和 `.cursor/skills/project-development-workflow/SKILL.md` 提供开发流程；使用前确认当前内容，不把示例命令或历史描述当成真实项目契约。
