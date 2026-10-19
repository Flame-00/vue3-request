import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Control,
  DemoCard,
  DocStage,
  gray,
  primary,
  row,
  Switch,
} from "./DocStage";

export function PollingDoc() {
  return <FeatureSegment name="轮询" purpose="定时获取最新状态，并按配置在页面隐藏时暂停。"><PollingDocDemo /></FeatureSegment>;
}

function PollingDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const paused = t >= 4 && t < 7;
  // 首次请求 500ms，完成后等待 2s。隐藏期间下一轮等待重新可见。
  const count = t >= 7.5 ? 3 : t >= 3 ? 2 : 1;
  const cpu = [34, 58, 41][count - 1];
  const memory = [46, 52, 49][count - 1];
  const loading = t < 0.5 || (t >= 2.5 && t < 3) || (t >= 7 && t < 7.5);
  return (
    <DocStage
      demoSeconds={10}
      title="轮询 · 观察 CPU、内存与轮询次数"
      source="polling"
      codePages={[
        [
          "const pollingInterval = ref(2000);",
          "const pollingWhenHidden = ref(true);",
          "",
          "const { data, error, loading } =",
          "  useRequest(getSystemStatus, {",
          "    pollingInterval,",
          "    pollingWhenHidden,",
          "  });",
        ],
      ]}
      action={
        paused
          ? "页面隐藏，轮询次数停在 2，等待重新可见"
          : t >= 7
            ? "回到页面，轮询恢复，CPU 与内存数据继续更新"
            : t >= 3
              ? "把隐藏时继续轮询设为 No，然后切走页面"
              : "请求完成后等待 2000ms，再获取一次系统状态"
      }
    >
      <DemoCard>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <span
            style={{
              background: "#e6f4ed",
              color: primary,
              padding: "10px 24px",
              fontSize: 32,
              borderRadius: 6,
            }}
          >
            在线
          </span>
          <span style={{ color: gray, fontSize: 27 }}>
            {paused
              ? "页面已隐藏 · 等待重新可见"
              : loading
                ? "正在获取系统状态…"
                : "系统状态已更新"}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 80px",
            fontSize: 34,
            padding: "12px 0",
          }}
        >
          <div>
            CPU 使用率：<b style={{ color: primary, fontSize: 44 }}>{cpu}%</b>
          </div>
          <div>
            内存使用率：
            <b style={{ color: primary, fontSize: 44 }}>{memory}%</b>
          </div>
          <div>
            最后更新：10:00:{count === 1 ? "00" : count === 2 ? "03" : "08"}
          </div>
          <div>
            轮询次数：<b style={{ fontSize: 48, color: primary }}>{count}</b>
          </div>
        </div>
        <div style={{ ...row, borderTop: "1px solid #dce5df", paddingTop: 24 }}>
          <Control label="轮询间隔：" value="2000" />
          <span style={{ fontSize: 29, marginLeft: 20 }}>
            页面隐藏时是否继续轮询：
          </span>
          <Switch on={t < 3} />
          <span style={{ fontSize: 29 }}>{t < 3 ? "Yes" : "No"}</span>
        </div>
      </DemoCard>
    </DocStage>
  );
}
