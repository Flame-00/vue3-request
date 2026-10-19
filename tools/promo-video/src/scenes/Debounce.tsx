import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Badge,
  Code,
  columns,
  Frame,
  green,
  Heading,
  mono,
  muted,
  Panel,
} from "../ui";

export function Debounce() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 5 次输入相隔 100ms，最后一次输入后等待 300ms。
  const typed = Math.max(0, Math.min(5, Math.floor((f / fps - 3) / 0.1) + 1));
  const sent = f >= 3.7 * fps;
  const loaded = f >= 4.5 * fps;
  return (
    <Frame
      chapter="03 / DEBOUNCE"
      caption="连续输入时推迟执行；停止输入 300ms 后，只发起最后一次请求。"
    >
      <Heading
        eyebrow="TYPE MORE. REQUEST LESS."
        title="输入可以快，请求更从容。"
        detail="给搜索框加上防抖，只需声明 debounceWait。"
      />
      <div style={columns}>
        <Code
          filename="Search.vue · script setup"
          highlight={3}
          lines={[
            "const { data, loading, run } =",
            "  useRequest(searchUsers, {",
            "    manual: true,",
            "    debounceWait: 300,",
            "  });",
            "",
            "// 输入事件传入最新关键词",
            "const onInput = (keyword: string) => {",
            "  run(keyword);",
            "};",
          ]}
        />
        <Panel title="搜索开发者">
          <div
            style={{
              padding: "22px 24px",
              borderRadius: 14,
              border: `1px solid ${green}88`,
              fontSize: 32,
              background: "#081a12",
            }}
          >
            <span style={{ color: muted, marginRight: 20 }}>⌕</span>
            {"flame".slice(0, typed)}
            <span
              style={{
                color: green,
                opacity: Math.floor(f / (fps * 0.4)) % 2 ? 0 : 1,
              }}
            >
              |
            </span>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <Stat value={typed} label="输入次数" />
            <Stat value={sent ? 1 : 0} label="实际请求" />
          </div>
          <div
            style={{
              height: 5,
              background: "#294237",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: green,
                width: `${interpolate(f, [3.4 * fps, 3.7 * fps], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
              }}
            />
          </div>
          <Badge>
            {loaded
              ? "✓ 找到 Flame · Vue 开发者"
              : sent
                ? "● 正在搜索 flame"
                : typed
                  ? "等待输入结束 · 300ms"
                  : "等待输入关键词"}
          </Badge>
          <span style={{ color: muted, fontSize: 18 }}>
            输入阶段慢放示意 · 非性能测试
          </span>
        </Panel>
      </div>
    </Frame>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 16,
        background: "#ffffff05",
        border: "1px solid #2a4238",
      }}
    >
      <div style={{ color: green, fontFamily: mono, fontSize: 64 }}>
        {value.toString().padStart(2, "0")}
      </div>
      <div style={{ color: muted, fontSize: 22 }}>{label}</div>
    </div>
  );
}
