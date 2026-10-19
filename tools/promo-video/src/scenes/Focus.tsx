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
} from "../ui";
import { blue, clamp, Flash, Reveal } from "../motion";

export function Focus() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const away = t >= 2.5 && t < 5;
  const back = t >= 5;
  const fresh = t >= 6.2;
  const reveal = interpolate(t, [5, 5.6], [0, 1], clamp);
  return (
    <Frame
      chapter="04 / WINDOW FOCUS"
      accent={blue}
      caption="页面可见且在线时，聚焦触发刷新；refocusTimespan 限制频繁触发。"
    >
      <Heading
        eyebrow="WELCOME BACK. STAY FRESH."
        title="切回来，数据也跟上。"
        detail="聚焦窗口时刷新，让页面及时获得新数据。"
      />
      <div style={columns}>
        <Reveal side={-1}>
          <Code
            filename="Dashboard.vue · script setup"
            highlight={back ? 2 : 3}
            lines={[
              "const { data, loading } =",
              "  useRequest(getDashboard, {",
              "    refreshOnWindowFocus: true,",
              "    refocusTimespan: 5000,",
              "  });",
              "",
              "// 可见 + 在线 → 聚焦刷新",
              "// 5 秒窗口内限制重复触发",
            ]}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ position: "relative", perspective: 1200 }}>
            <div
              style={{
                background: "#10221d",
                border: `1px solid ${back ? blue : "#315044"}`,
                borderRadius: 24,
                overflow: "hidden",
                rotate: `${interpolate(t, [2.5, 3, 5, 5.6], [0, -3, -3, 0], clamp)}deg`,
                scale: interpolate(
                  t,
                  [2.5, 3, 5, 5.6],
                  [1, 0.91, 0.91, 1],
                  clamp,
                ),
                opacity: away ? 0.45 : 1,
                boxShadow: `0 24px 80px ${back ? `${blue}20` : "#0005"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  padding: "22px 28px",
                  background: "#ffffff05",
                  borderBottom: "1px solid #ffffff12",
                  fontSize: 20,
                }}
              >
                <span style={{ color: green }}>●</span>
                <span style={{ color: away ? muted : blue }}>数据看板</span>
                <span style={{ color: muted }}>其他窗口</span>
              </div>
              <div
                style={{
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                }}
              >
                <Badge color={away ? muted : blue}>
                  {away
                    ? "WINDOW BLURRED"
                    : back
                      ? "FOCUS → REFRESH"
                      : "WINDOW ACTIVE"}
                </Badge>
                <div style={{ color: muted, fontSize: 22 }}>今日完成任务</div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 20 }}
                >
                  <span
                    style={{
                      fontSize: 104,
                      fontFamily: mono,
                      color: fresh ? green : "#d2e4dc",
                    }}
                  >
                    {Math.round(
                      128 + 14 * interpolate(t, [5.8, 6.2], [0, 1], clamp),
                    )}
                  </span>
                  <span style={{ color: green, fontSize: 28 }}>
                    {fresh ? "+14" : "条"}
                  </span>
                </div>
                <svg viewBox="0 0 600 110" style={{ width: "100%" }}>
                  <path
                    d="M0 95 60 80 120 90 180 55 240 65 300 35 360 55 420 25 480 40 540 15 600 5"
                    fill="none"
                    stroke={blue}
                    strokeWidth="4"
                    strokeDasharray="900"
                    strokeDashoffset={900 * (1 - Math.max(0.5, reveal))}
                  />
                </svg>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: muted,
                    fontSize: 22,
                  }}
                >
                  <span>
                    {fresh
                      ? "✓ 刚刚更新"
                      : back
                        ? "↻ 正在刷新"
                        : "上次更新的数据"}
                  </span>
                  <span>refocusTimespan: 5000</span>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 90,
                left: 55,
                right: 35,
                background: "#20312d",
                border: "1px solid #9cb5ab44",
                padding: 42,
                borderRadius: 20,
                boxShadow: "0 25px 60px #0007",
                opacity: interpolate(
                  t,
                  [2.5, 3, 4.8, 5.3],
                  [0, 1, 1, 0],
                  clamp,
                ),
                translate: `${interpolate(t, [2.5, 3, 4.8, 5.3], [100, 0, 0, 140], clamp)}px 0`,
                pointerEvents: "none",
              }}
            >
              <span style={{ fontSize: 22, color: muted }}>另一个窗口</span>
              <div style={{ fontSize: 38, marginTop: 24 }}>
                先处理一点别的事。
              </div>
              <div style={{ color: blue, fontSize: 24, marginTop: 18 }}>
                切回页面，触发 refresh()
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <Flash at={5} color={blue} />
    </Frame>
  );
}
