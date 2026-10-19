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

export function Basic() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loading = f < 4 * fps || (f >= 7 * fps && f < 8.3 * fps);
  const done = f >= 8.3 * fps;
  return (
    <Frame
      chapter="02 / REQUEST STATE"
      caption="loading、data、error 随请求更新；refresh 复用当前参数。"
    >
      <Heading
        eyebrow="LESS BOILERPLATE"
        title="把状态管理，交给 useRequest。"
        detail="声明请求方法，直接使用响应式返回值。"
      />
      <div style={columns}>
        <Code
          filename="UserCard.vue · script setup"
          highlight={f < 4 * fps ? 6 : done ? 7 : 5}
          lines={[
            'import { useRequest } from "vue3-request";',
            "",
            "const getUser = async () => {",
            '  const r = await fetch("/api/user");',
            "  return r.json();",
            "};",
            "const { data, loading, error, refresh } =",
            "  useRequest(getUser);",
          ]}
        />
        <Panel title="用户资料">
          <Badge>{loading ? "● 请求进行中" : "✓ 请求成功"}</Badge>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              minHeight: 150,
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 28,
                background: "#00e6a01b",
                display: "grid",
                placeItems: "center",
                color: green,
                fontSize: 42,
              }}
            >
              {loading ? "···" : "F"}
            </div>
            <div>
              <div style={{ fontSize: 38, marginBottom: 10 }}>
                {loading ? "正在加载资料" : "Flame"}
              </div>
              <div style={{ color: muted, fontSize: 23 }}>
                {loading ? "等待 service 返回" : "Vue 开发者 · 热爱开源"}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 12,
              background: "#071810",
              fontFamily: mono,
              color: green,
              fontSize: 22,
            }}
          >
            loading: {String(loading)}
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: 18,
              background: green,
              color: "#062218",
              textAlign: "center",
              fontSize: 24,
              scale: interpolate(
                f,
                [6.8 * fps, 7 * fps, 7.2 * fps],
                [1, 0.96, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          >
            {done ? "✓ 已刷新" : "↻ refresh() 刷新资料"}
          </div>
        </Panel>
      </div>
    </Frame>
  );
}
