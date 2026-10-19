# vue3-request 文档示例视频

独立的 Remotion + React 工程，不参与仓库 pnpm workspace。未修改请求库和文档原示例；文档首页已接入自动弹框播放器。

## 运行与导出

```bash
cd /Users/Admin/Code/vue3-request/tools/promo-video
npm ci
npm run dev
```

预览：[Vue3RequestPromo](http://localhost:8826/Vue3RequestPromo)。必须在本目录执行命令。

```bash
npm run lint
npm run build
npm run poster
npm run render
npm run render:features
npm run sync:docs-video
```

- 新版成片：out/vue3-request-v4.mp4，1920 × 1080、30fps、137.3 秒。
- 封面：out/poster-v4.png。
- 保留上一版视频和场景，Previous-Examples 可单独预览旧版。
- 第一次渲染可能下载官方 Chromium，需要联网。
- node_modules、build、out 均不提交。

## 文档清晰版：先看操作与结果，再看配置

主片改为浅色文档界面。代码字号 36px，全屏展示；演示界面先于代码出现，独占画面；当前操作按钮带箭头，底部高亮大字说明操作与结果。场景间使用 0.3 秒淡入淡出，示例中不再使用粒子、翻转和闪光。

- 中止请求：文档 Run / Run x3 / Abort 按钮、创建和销毁子组件，演示中止后再次 Run。
- 缓存与 SWR：文档 Cached / Not cached 对比。销毁后重建时，Cached 立即恢复旧资料，再由后台请求更新；无缓存组件需要等待。
- 错误重试：文档默认的 3 次重试、已重试计数和用户资料。按 1 秒 service 耗时及默认 2 / 4 / 8 秒指数退避演示，最后一次重试成功。
- 聚焦刷新：沿用文档 refocusTimespan: 2000、刷新开关和用户资料最后更新时间。
- 轮询：沿用文档系统状态示例，展示 CPU、内存、最后更新时间、轮询次数和隐藏时轮询开关。
- 生命周期：独立场景，展示文档 Obtain user information 按钮，以及 onBefore → onSuccess/onError → onFinally 的消息顺序。

## 来源与适配边界

代码和界面依据 packages/vitepress-demo/docs/guide/demo 下的以下文件：

- cache.md → src/docs/CacheDoc.tsx
- abort-request.md → src/docs/AbortDoc.tsx
- retry.md → src/docs/RetryDoc.tsx
- focus-refresh.md → src/docs/FocusDoc.tsx
- polling.md → src/docs/PollingDoc.tsx
- lifecycle.md → src/docs/LifecycleDoc.tsx

为方便视频阅读，对原代码进行换行、节选，省略 import、类型定义、随机数据生成和部分提示回调；生命周期分两页展示。文档中的 service Promise 返回类型、signal.value、响应式配置等关键用法予以保留。

示例界面使用 React 按原文档控件和字段复现，不是原 Vue 组件录屏，也不执行真实 HTTP。随机姓名、头像、CPU、时间等替换为固定演示数据；每个效果画面均标注“文档示例界面复现 · 固定数据”。Abort 请求故意延长，便于观察中止；重试与轮询的等待按文档配置演示。不能把画面当作运行验证或性能测试。

## 编辑入口

- src/Root.tsx：主时间轴与独立文档场景注册。
- src/docs/DocStage.tsx：浅色画面、代码/操作分阶段、大字控件与用户资料。
- src/docs/*Doc.tsx：各文档的代码节选、固定数据与操作阶段。
- src/ui.tsx：共享代码高亮，支持独立设置字号。
- src/scenes、src/motion.tsx：前两版场景，保留供参考。

主片场景时长依次为 3、20.4、20.4、29.4、18.4、19.4、24.4、4 秒，减去七个 0.3 秒转场，共 137.3 秒（4119 帧）。起始帧依次为 0、81、684、1287、2160、2703、3276、3999。修改场景时，需同步主时间轴、独立场景和主合成总帧数。

当前无配音和背景音乐，字体优先使用系统 PingFang SC。所有动画按帧计算，跨平台渲染应重新检查排版。

## 文档首页弹框

执行 npm run render、npm run poster、npm run render:features 和 npm run sync:docs-video 后，成片与封面复制到 packages/vitepress-demo/docs/public/media/，供文档直接部署。不要只提交被忽略的 out/ 文件。

播放器位于 docs/.vitepress/theme/HomeVideoModal.vue，通过 Layout.vue 的 home-hero-actions-after 插槽仅在首页挂载。每次刷新后的首次进入首页自动弹框，站内往返不重复弹出；关闭后可点“观看功能演示”重看。视频默认静音自动播放，保留原生播放、进度和全屏控件；关闭或离开首页会停止播放。路径使用 withBase，适配 /vue3-request 部署前缀，不依赖本地 Remotion 服务。

文档验证在仓库根目录执行 pnpm build:docs。

## 弹框按功能观看

首页弹框提供完整演示及截图导航对应的 13 个功能 Tabs：基本使用、参数管理、生命周期、刷新、取消响应、中止请求、轮询、Ready、缓存 & SWR、错误重试、节流、防抖、屏幕聚焦重新请求。Tabs 使用可换行的卡片样式，支持左右方向键和 Home / End 切换。切换时复用 video 节点，从头播放所选文件；首帧就绪前用 canvas 保留上一帧，并在视频帧回调后跨过浏览器绘制周期再交接画面，避免解码与合成层绘制不同步时露出空白。文档首屏直接展示操作效果，取消画面淡入；代码阶段完整展示，取消逐行淡入。底部直接打开链接和封面同步切换。关闭后重开保留当前功能，重新进入首页默认选择完整演示。

npm run render:features 根据 scripts/feature-videos.mjs 导出十三段独立视频及封面到 out/features/，sync:docs-video 会将所有视频复制到文档 public/media/。单功能视频直接使用对应独立 composition，无相邻场景转场和越界播放。Basic 以四张状态卡展示完整 data、提取后的 res、error 与 loading，依次演示首次成功、再次失败与重试恢复，时长 21.4 秒。

弹框关闭时先暂停播放，视频内容由 NModal 在退出动画结束后统一销毁，不能用 v-if="show" 提前移除，否则会造成高度塌陷和关闭闪动。关闭时取消帧回调，保持现有遮罩，退出结束后再清理遮罩状态。

每个功能片段开头新增 2.4 秒名称与作用介绍（src/docs/FeatureSegment.tsx），大标题弹性入场、说明淡入后向左移开，进入原有操作演示。完整视频与十三个独立片段使用同一入口，保留操作和代码阶段原时长；基础功能标记为 Basic，不标为插件。

新增六段场景位于 src/docs/MoreDocs.tsx，依据对应文档的默认参数、refresh、无 signal 的 cancel、登录 ready、默认 leading/trailing 配置制作固定数据演示。取消响应的请求耗时放慢为 2 秒以便观察。完整演示保留原六段串讲；13 个功能各有独立视频。可用 npm run render:features -- basic parameters refresh cancel ready throttle debounce 仅导出指定片段，再执行 npm run sync:docs-video。
