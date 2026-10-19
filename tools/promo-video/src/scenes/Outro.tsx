import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Frame, green, mono, muted } from "../ui";

export function Outro() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Frame
      chapter="06 / START BUILDING"
      caption="vue3-request · 为 Vue 3 简化异步操作与 API 调用。"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 35,
          textAlign: "center",
        }}
      >
        <Badge>更少重复逻辑，更多产品体验</Badge>
        <h1
          style={{
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: -3,
            margin: 0,
          }}
        >
          下一个请求，<span style={{ color: green }}>从这里开始。</span>
        </h1>
        <div style={{ display: "flex", gap: 18, marginBottom: 8 }}>
          {[
            "缓存与 SWR",
            "终止请求",
            "失败重试",
            "聚焦刷新",
            "轮询生命周期",
          ].map((label, i) => (
            <span
              key={label}
              style={{
                border: "1px solid #2b4b3d",
                padding: "14px 22px",
                borderRadius: 12,
                color: "#c0d5cb",
                fontSize: 24,
                opacity: interpolate(
                  f,
                  [i * fps * 0.12, i * fps * 0.12 + fps * 0.4],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ),
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div
          style={{
            padding: "25px 48px",
            borderRadius: 18,
            background: "#00e6a010",
            border: `1px solid ${green}66`,
            fontFamily: mono,
            fontSize: 38,
          }}
        >
          <span style={{ color: muted }}>$ </span>pnpm add{" "}
          <span style={{ color: green }}>vue3-request</span>
        </div>
        <div style={{ color: muted, fontSize: 27, fontFamily: mono }}>
          github.com/Flame-00/vue3-request
        </div>
      </div>
    </Frame>
  );
}
