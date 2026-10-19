import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Button,
  DemoCard,
  DocStage,
  gray,
  primary,
  Profile,
  red,
  row,
  Status,
} from "./DocStage";

export function LifecycleDoc() {
  return <FeatureSegment name="请求生命周期" purpose="在开始、成功、失败和结束时执行对应回调。"><LifecycleDocDemo /></FeatureSegment>;
}

function LifecycleDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const fail = t >= 5;
  const loading = (t >= 1 && t < 2) || (t >= 6 && t < 7);
  const success = t >= 2 && t < 6;
  const failed = t >= 7;
  const events =
    t < 1
      ? []
      : t < 2
        ? ["onBefore"]
        : t < 6
          ? ["onBefore", "onSuccess", "onFinally"]
          : t < 7
            ? ["onBefore"]
            : ["onBefore", "onError", "onFinally"];
  return (
    <DocStage
      demoSeconds={10}
      title="生命周期 · 成功与失败，都看得见"
      source="lifecycle"
      codeSeconds={12}
      codePages={[
        [
          "useRequest(service, {",
          "  manual: true,",
          "  onBefore: () => {",
          "    message.info(`onBefore 触发`);",
          "  },",
          "  onSuccess: () => {",
          "    message.success(`onSuccess 触发`);",
          "  },",
          "  // onError、onFinally 见下一屏",
          "});",
        ],
        [
          "useRequest(service, {",
          "  manual: true,",
          "  onError: () => {",
          "    message.error(`onError 触发`);",
          "  },",
          "  onFinally: () => {",
          "    message.info(`onFinally 触发`);",
          "  },",
          "});",
        ],
      ]}
      action={
        failed
          ? "失败路径：onBefore → onError → onFinally"
          : success
            ? "成功路径：onBefore → onSuccess → onFinally"
            : "点击 Obtain user information，观察消息提示顺序"
      }
    >
      <DemoCard>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <Button active={loading}>Obtain user information</Button>
          <span style={{ color: gray, fontSize: 27 }}>
            {fail ? "第二次：演示失败分支" : "第一次：演示成功分支"}
          </span>
        </div>
        <div style={{ ...row, minHeight: 66 }}>
          {events.map((event, i) => (
            <div key={event} style={{ ...row, gap: 16 }}>
              {i > 0 && <span style={{ color: gray, fontSize: 32 }}>→</span>}
              <span
                style={{
                  padding: "14px 25px",
                  borderRadius: 8,
                  color: event === "onError" ? red : primary,
                  background: event === "onError" ? "#fff0f0" : "#edf6f1",
                  fontSize: 30,
                }}
              >
                {event} 触发
              </span>
            </div>
          ))}
        </div>
        <Status
          loading={loading}
          error={failed ? "Failed to obtain user information!" : undefined}
        >
          {success ? <Profile /> : undefined}
        </Status>
      </DemoCard>
    </DocStage>
  );
}
