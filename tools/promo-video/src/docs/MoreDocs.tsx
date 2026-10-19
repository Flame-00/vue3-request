import type { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FeatureSegment } from "./FeatureSegment";
import { Button, DemoCard, DocStage, Profile, Status, Switch, primary, gray, row } from "./DocStage";

const useSeconds = () => {
  const { fps } = useVideoConfig();
  return useCurrentFrame() / fps;
};
function Value({ label, children }: { label: string; children: ReactNode }) {
  return <div style={{ background: "#eef6f1", borderRadius: 10, padding: "22px 28px", fontSize: 32, lineHeight: 1.6 }}><span style={{ color: gray }}>{label}：</span><b style={{ color: primary }}>{children}</b></div>;
}

export function ParametersDoc() {
  return <FeatureSegment name="参数管理" purpose="默认参数用于首次请求，run 传入新参数，params 自动记录。"><ParametersDemo /></FeatureSegment>;
}
function ParametersDemo() {
  const t = useSeconds();
  const changed = t >= 4;
  const loading = t < 1 || t >= 4 && t < 5;
  return <DocStage title="参数管理 · 默认参数 → 动态传参" source="parameter-management" demoSeconds={9}
    codePages={[[ 'const { run, data, params, loading } =', '  useRequest(service, {', '    defaultParams: ["林"],', '  });', '', '// 点击按钮，使用输入框中的姓氏', 'run(lastName.value);', '// params 自动更新为 ["范"]' ]]}
    action={t < 1 ? '自动执行 service("林")，使用 defaultParams' : t < 3 ? '首次请求完成：params=["林"]，姓名为林小夏' : t < 4 ? '输入姓氏“范”，输入本身还没有改变请求参数' : t < 5 ? '点击 Add the surname → run("范")，params 同步更新' : '新请求完成：姓名变为范小夏，params=["范"]'}>
    <DemoCard><div style={row}><Value label="输入姓氏">{t >= 3 ? "范" : "林"}</Value><Button active={t >= 4 && t < 5}>Add the surname</Button></div><Value label="params">{changed ? '["范"]' : '["林"]'}</Value><Status loading={loading}><Value label="data.data">{changed ? "范小夏" : "林小夏"}</Value></Status></DemoCard>
  </DocStage>;
}

export function RefreshDoc() {
  return <FeatureSegment name="刷新 · 重复上一次请求" purpose="refresh 不需要重新传参，使用上一次 params 获取最新数据。"><RefreshDemo /></FeatureSegment>;
}
function RefreshDemo() {
  const t = useSeconds();
  const loading = t < 1 || t >= 4 && t < 5;
  return <DocStage title="刷新 · 不传参数，仍请求同一个用户" source="refresh" demoSeconds={9}
    codePages={[[ 'const { run: getUserInfo, refresh, params, data } =', '  useRequest(service, { manual: true });', '', 'getUserInfo(1);', '// 点击 Refresh，无需再次传入用户 ID', 'refresh();', '// 再次执行 service(1)，params 仍为 [1]' ]]}
    action={t < 1 ? '先调用 getUserInfo(1)，请求用户 1' : t < 4 ? '初次完成，记录 params=[1]' : t < 5 ? '点击 Refresh：自动复用上次参数 1' : '同一个用户获得新资料，params 始终为 [1]'}>
    <DemoCard><div style={row}><Button active={t >= 4 && t < 5}>Refresh</Button><Value label="params">[1]</Value><Value label="service 调用次数">{t >= 4 ? 2 : 1}</Value></div><Status loading={loading}><Profile /></Status><Value label="用户 ID / 本次数据版本">1 / {t >= 5 ? "最新资料 v2" : "初始资料 v1"}</Value></DemoCard>
  </DocStage>;
}

export function CancelDoc() {
  return <FeatureSegment name="取消响应" purpose="cancel 让当前响应失效；未使用 signal 的 Promise 仍会继续执行。"><CancelDemo /></FeatureSegment>;
}
function CancelDemo() {
  const t = useSeconds();
  const loading = t >= 1 && t < 2 || t >= 6 && t < 7;
  return <DocStage title="取消响应 · Promise 返回，也不再写入状态" source="cancel-response" demoSeconds={10}
    codePages={[[ 'const service = (name: string) => new Promise(resolve => {', '  setTimeout(() => resolve({ data: name }), 2000);', '}); // 不使用 AbortSignal', 'const { run, cancel, data, loading } =', '  useRequest(service, { manual: true });', 'run("李小夏");', 'cancel(); // 当前结果失效，后续仍可 run()' ]]}
    action={t < 1 ? '准备执行没有使用 AbortSignal 的 Promise' : t < 2 ? '点击 Add the surname，Promise 执行中' : t < 3 ? '点击 Cancel：loading 立即结束，当前响应失效' : t < 6 ? 'Promise 已返回，但 data 仍为空，成功回调也不触发' : t < 7 ? '再次点击请求，开启新一轮' : '新请求可以正常写入 data，取消不等于永久销毁'}>
    <DemoCard><div style={row}><Button active={t >= 1 && t < 2 || t >= 6 && t < 7}>Add the surname</Button><Button danger active={t >= 2 && t < 3}>Cancel</Button></div><Value label="原 Promise">{t < 1 ? "尚未执行" : t < 3 ? "执行中（请求耗时放慢展示）" : "已返回；本次结果被忽略"}</Value><Value label="loading">{String(loading)}</Value><Status loading={loading}><Value label="data">{t >= 7 ? '{ data: "李小夏" }' : "undefined"}</Value></Status></DemoCard>
  </DocStage>;
}

export function ReadyDoc() {
  return <FeatureSegment name="Ready · 依赖请求" purpose="ready=false 时不请求，条件满足后自动获取数据。"><ReadyDemo /></FeatureSegment>;
}
function ReadyDemo() {
  const t = useSeconds();
  const loggedIn = t >= 2 && t < 6;
  return <DocStage title="Ready · 登录后才自动请求用户资料" source="ready" demoSeconds={9}
    codePages={[[ 'const isLoggedIn = ref(false);', 'const { data, loading } = useRequest(service, {', '  ready: isLoggedIn,', '});', 'watch(isLoggedIn, (loggedIn) => {', '  if (!loggedIn) data.value = undefined;', '}); // 文档通过 watcher 在登出时清空资料' ]]}
    action={t < 2 ? '未登录：ready=false，service 调用次数为 0' : t < 3 ? '切换为登录：ready=true，自动发起请求' : t < 6 ? '请求成功，显示用户资料' : '登出：ready=false；文档中的 watcher 清空 data'}>
    <DemoCard><div style={row}><Switch on={loggedIn} /><Value label="登录 / ready">{String(loggedIn)}</Value><Value label="service 调用次数">{t >= 2 ? 1 : 0}</Value></div><Status loading={t >= 2 && t < 3}>{loggedIn && t >= 3 ? <Profile /> : undefined}</Status></DemoCard>
  </DocStage>;
}

export function ThrottleDoc() {
  return <FeatureSegment name="节流" purpose="持续输入时限制请求频率，默认首尾都执行。"><SearchDemo mode="throttle" /></FeatureSegment>;
}
export function DebounceDoc() {
  return <FeatureSegment name="防抖" purpose="等待输入停下 1000ms 后再请求，连续输入只执行一次。"><SearchDemo mode="debounce" /></FeatureSegment>;
}
function SearchDemo({ mode }: { mode: "throttle" | "debounce" }) {
  const t = useSeconds();
  const throttled = mode === "throttle";
  const inputTimes = [1, 1.2, 1.4, 1.6, 1.8];
  const inputs = ["L", "Li", "Lin", "Linx", "Linxia"];
  const index = inputTimes.filter(time => t >= time).length - 1;
  const count = throttled ? t >= 2 ? 2 : t >= 1 ? 1 : 0 : t >= 2.8 ? 1 : 0;
  const loading = throttled ? t >= 1 && t < 1.4 || t >= 2 && t < 2.4 : t >= 2.8 && t < 3.2;
  const result = throttled ? t >= 1.4 : t >= 3.2;
  const option = throttled ? "throttle" : "debounce";
  return <DocStage title={`${throttled ? "节流" : "防抖"} · 同样 5 次输入，观察请求次数`} source={mode} demoSeconds={9}
    codePages={[[ 'const searchQuery = ref("");', 'const { run, data, loading } = useRequest(searchUsers, {', '  manual: true,', `  ${option}Wait: 1000,`, `  ${option}Options: { leading: ${throttled}, trailing: true },`, '});', 'watch(searchQuery, value => {', '  if (value.trim()) run(value.trim());', '});' ]]}
    action={t < 1 ? '准备快速连续输入 5 次，每次间隔 200ms' : t < 1.8 ? throttled ? '首个输入立即请求，其余输入合并到窗口末尾' : '连续输入中：每次输入都重新开始 1000ms 等待' : t < 2.8 ? throttled ? '第 1 秒窗口结束：trailing 使用最后一个输入再请求一次' : '已经停止输入，等待最后一次输入后的 1000ms' : throttled ? '5 次输入 → 2 次请求：leading 一次，trailing 一次' : '5 次输入 → 1 次请求：停止输入后执行'}>
    <DemoCard><div style={{ fontSize: 29, color: gray }}>{option}Wait: 1000ms · leading: {String(throttled)} · trailing: true</div><div style={row}><Value label="搜索框">{index >= 0 ? inputs[index] : "等待输入…"}</Value><Value label="搜索请求次数">{count}</Value></div><div style={{ ...row, flexWrap: "wrap" }}>{inputs.map((input, i) => <span key={input} style={{ padding: "12px 20px", borderRadius: 8, background: t >= inputTimes[i] ? "#d6efe2" : "#f0f2f1", fontSize: 26 }}>{inputTimes[i].toFixed(1)}s · {input}</span>)}</div><div style={{ minHeight: 100, display: "grid", alignItems: "center", fontSize: 31, color: primary }}>{loading ? "搜索请求中…" : result ? `搜索结果：${throttled && t < 2.4 ? "L" : "Linxia"} · 技术部用户` : "尚未发起搜索请求"}</div></DemoCard>
  </DocStage>;
}
