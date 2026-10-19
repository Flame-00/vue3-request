import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Code, Frame, green, Heading, mono, muted, Panel } from "../ui";
import { amber, clamp, coral, Flash, Reveal, Ring } from "../motion";

export function Retry() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const failed = t >= 2 && t < 4;
  const retrying = t >= 4 && t < 6;
  const success = t >= 6;
  const color = success ? green : failed ? coral : amber;
  return (
    <Frame
      chapter="03 / ERROR RETRY"
      accent={amber}
      caption="重连场景以失败重试演示：最多重试 3 次，间隔 2000ms。"
    >
      <Heading
        eyebrow="FAIL. RETRY. RECOVER."
        title="一次失败，不必手动重来。"
        detail="声明重试次数和间隔，让失败的请求重新出发。"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <Reveal side={-1}>
          <Panel title="连接恢复 / 自动重试">
            <Badge color={color}>
              {success
                ? "✓ CONNECTION RECOVERED"
                : failed
                  ? "× SERVICE ERROR"
                  : retrying
                    ? "↻ RETRY #1"
                    : "● CONNECTING"}
            </Badge>
            <Ring
              color={color}
              progress={
                success
                  ? 1
                  : failed
                    ? interpolate(t, [2, 4], [1, 0], clamp)
                    : retrying
                      ? (t - 4) / 2
                      : t / 2
              }
              label={
                success
                  ? "200"
                  : failed
                    ? `${Math.max(0, 4 - t).toFixed(1)}s`
                    : retrying
                      ? "↻"
                      : "···"
              }
              detail={
                success
                  ? "重试成功，恢复数据"
                  : failed
                    ? "请求失败，等待重试"
                    : retrying
                      ? "复用参数，再次请求"
                      : "首次连接服务"
              }
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: 24,
                background: "#0003",
                borderRadius: 16,
              }}
            >
              <span style={{ color: coral, fontFamily: mono, fontSize: 30 }}>
                503
              </span>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: `linear-gradient(90deg, ${coral}, ${success ? green : amber})`,
                }}
              />
              <span
                style={{
                  color: success ? green : muted,
                  fontFamily: mono,
                  fontSize: 30,
                }}
              >
                {success ? "200 OK" : "RETRY"}
              </span>
            </div>
            <span style={{ color: muted, fontSize: 20 }}>
              示意服务在第一次重试时恢复
            </span>
          </Panel>
        </Reveal>
        <Reveal delay={0.2}>
          <Code
            filename="Reconnect.vue · script setup"
            highlight={failed ? 3 : 2}
            lines={[
              "const { data, error, loading } =",
              "  useRequest(connectService, {",
              "    errorRetryCount: 3,",
              "    errorRetryInterval: 2000,",
              "  });",
              "",
              "// 请求失败后定时重试",
              "// 成功后重置重试计数",
              "// cancel() 清理待执行重试",
            ]}
          />
        </Reveal>
      </div>
      <Flash at={2} color={coral} />
      <Flash at={6} />
    </Frame>
  );
}
