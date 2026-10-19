import { useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, Code, Frame, green, Heading, mono, muted, Panel } from "../ui";
import { amber, coral, Event, Flash, purple, Reveal } from "../motion";

export function Polling() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const hidden = t >= 4.6 && t < 7;
  const cancelled = t >= 9.8;
  const unmounted = t >= 11.5;
  const starts = [0.8, 3.3, 7, 9.5];
  const current = starts.reduce((n, s, i) => (t >= s ? i : n), -1);
  const inFlight = current >= 0 && t < starts[current] + 0.5 && !cancelled;
  const justFinished =
    current >= 0 &&
    t >= starts[current] + 0.5 &&
    t < starts[current] + 0.9 &&
    !cancelled;
  const color = cancelled ? coral : hidden ? amber : purple;
  return (
    <Frame
      chapter="05 / POLLING LIFECYCLE"
      accent={purple}
      caption="请求完成后等待 2 秒再轮询；隐藏时暂停，取消清定时器，卸载时取消。"
    >
      <Heading
        eyebrow="A LOOP WITH A LIFECYCLE"
        title="持续更新，也懂得停下来。"
        detail="看见每一轮请求如何开始、完成、等待与清理。"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.08fr 1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <Reveal side={-1}>
          <Code
            filename="Jobs.vue · script setup"
            highlight={cancelled ? 9 : hidden ? 4 : 3}
            lines={[
              "const { data, cancel, signal } = useRequest(",
              '  () => fetch("/api/jobs", {',
              "    signal: signal.value }).then(r => r.json()),",
              "  { pollingInterval: 2000,",
              "    pollingWhenHidden: false,",
              '    onBefore: () => log("开始"),',
              '    onSuccess: () => log("成功"),',
              '    onFinally: () => log("结束"),',
              "  });",
              "cancel(); // 停止当前请求与轮询",
            ]}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <Panel title="轮询调度 / 生命周期" compact>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Badge color={color}>
                {unmounted
                  ? "COMPONENT UNMOUNTED"
                  : cancelled
                    ? "CANCELLED"
                    : hidden
                      ? "PAGE HIDDEN"
                      : "POLLING ACTIVE"}
              </Badge>
              <span style={{ color, fontFamily: mono, fontSize: 25 }}>
                #
                {Math.max(0, current + 1)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                height: 64,
              }}
            >
              {Array.from({ length: 32 }, (_, i) => {
                const second = i / 2.4;
                const isRequest = starts.some(
                  (s) => second >= s && second < s + 0.5,
                );
                const paused = second >= 5.8 && second < 7;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: isRequest ? 54 : paused ? 12 : 25,
                      borderRadius: 5,
                      background:
                        second > t
                          ? "#ffffff0a"
                          : second >= 9.8
                            ? coral
                            : paused
                              ? amber
                              : isRequest
                                ? purple
                                : "#b8a0ff40",
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Event
                name="onBefore"
                active={inFlight}
                color={purple}
                detail="开始一轮请求"
              />
              <Event name="onSuccess" active={justFinished} detail="更新结果" />
              <Event
                name="onFinally"
                active={!inFlight && !cancelled && current >= 0}
                color={purple}
                detail={hidden ? "等待页面重新可见" : "完成后等待 2000ms"}
              />
              <Event
                name="onCancel"
                active={cancelled}
                color={coral}
                detail={
                  unmounted ? "卸载 → cancel → 清理" : "取消 → 清理定时器"
                }
              />
            </div>
            <div
              style={{
                fontSize: 23,
                color: cancelled ? coral : hidden ? amber : green,
              }}
            >
              {unmounted
                ? "组件卸载，释放轮询与订阅"
                : cancelled
                  ? "待执行轮询已清理"
                  : hidden
                    ? "页面隐藏，下一轮暂不发送"
                    : inFlight
                      ? "● 正在请求最新任务"
                      : "○ 等待下一轮"}
            </div>
            <span style={{ color: muted, fontSize: 17 }}>
              条形仅示意调度阶段，不代表实测请求耗时
            </span>
          </Panel>
        </Reveal>
      </div>
      <Flash at={7} color={purple} />
      <Flash at={9.8} color={coral} />
    </Frame>
  );
}
