import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Badge,
  Code,
  columns,
  Frame,
  green,
  Heading,
  mono,
  Panel,
} from "../ui";
import { clamp, coral, Flash, Reveal, SignalPath } from "../motion";

export function Abort() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const stopped = t >= 4 && t < 7;
  const restarted = t >= 7;
  const done = t >= 9;
  const color = stopped ? coral : green;
  return (
    <Frame
      chapter="02 / ABORT CONTROL"
      accent={coral}
      caption="service 接入 signal；abort() 中止请求，旧结果不再更新状态。"
    >
      <Heading
        eyebrow="STOP MEANS STOP"
        title="不需要的请求，立即叫停。"
        detail="中止当前请求，再发起一次全新的请求。"
      />
      <div style={columns}>
        <Reveal side={-1}>
          <Code
            filename="Report.vue · script setup"
            highlight={stopped ? 9 : 2}
            lines={[
              "const loadReport = () =>",
              '  fetch("/api/report", {',
              "    signal: signal.value,",
              "  }).then((r) => r.json());",
              "",
              "const { run, abort, signal, loading } =",
              "  useRequest(loadReport, { manual: true });",
              "",
              "run(); // 发起请求",
              "abort(); // 点击终止按钮时调用",
            ]}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <Panel title="REPORT / 请求控制台">
            <Badge color={color}>
              {stopped
                ? "■ ABORTED"
                : done
                  ? "✓ COMPLETED"
                  : restarted
                    ? "● NEW REQUEST"
                    : "● REQUEST IN FLIGHT"}
            </Badge>
            <SignalPath stopped={stopped} color={color} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ color, fontSize: 58, fontWeight: 600 }}>
                {stopped
                  ? "已终止"
                  : done
                    ? "已完成"
                    : restarted
                      ? "重新出发"
                      : "正在请求"}
              </span>
              <span style={{ color, fontFamily: mono, fontSize: 24 }}>
                {stopped ? "signal.aborted" : "loading"}:{" "}
                {stopped || !done ? "true" : "false"}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: "#ffffff0b",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: color,
                  width: `${done ? 100 : stopped ? 45 : restarted ? interpolate(t, [7, 9], [0, 100], clamp) : interpolate(t, [0, 4], [0, 45], clamp)}%`,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  background: `${coral}20`,
                  border: `1px solid ${coral}88`,
                  color: coral,
                  padding: 20,
                  borderRadius: 14,
                  textAlign: "center",
                  fontSize: 26,
                  scale: interpolate(t, [3.85, 4, 4.2], [1, 0.9, 1], clamp),
                }}
              >
                ■ abort()
              </div>
              <div
                style={{
                  flex: 1,
                  background: restarted ? green : "#ffffff08",
                  color: restarted ? "#062218" : "#9ab2a9",
                  padding: 20,
                  borderRadius: 14,
                  textAlign: "center",
                  fontSize: 26,
                  scale: interpolate(t, [6.85, 7, 7.2], [1, 0.9, 1], clamp),
                }}
              >
                ↗ run()
              </div>
            </div>
          </Panel>
        </Reveal>
      </div>
      <Flash at={4} color={coral} />
      <Flash at={7} />
    </Frame>
  );
}
