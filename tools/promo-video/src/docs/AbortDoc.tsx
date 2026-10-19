import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Button,
  DemoCard,
  DocStage,
  gray,
  primary,
  row,
  Status,
} from "./DocStage";

export function AbortDoc() {
  return <FeatureSegment name="中止请求" purpose="主动中止正在进行的网络请求，取消后仍可再次发起。"><AbortDocDemo /></FeatureSegment>;
}

function AbortDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const loading = (t >= 1 && t < 3) || (t >= 5 && t < 6.5);
  const done = t >= 6.5 && t < 8.5;
  const destroyed = t >= 8.5;
  return (
    <DocStage
      demoSeconds={10}
      title="中止请求 · Run → Abort → Run"
      source="abort-request"
      codeSeconds={8}
      codePages={[
        [
          "const service = (): Promise<IResult> => {",
          "  return axiosInstance.get(",
          '    "https://v2.xxapi.cn/api/aiqinggongyu", {',
          "      signal: signal.value,",
          "    });",
          "};",
        ],
        [
          "const { run, data, error, signal, loading, abort } =",
          "  useRequest(service, {",
          "    manual: true,",
          "  });",
          "",
          "// 文档中的按钮分别调用 run 和 abort",
        ],
      ]}
      action={
        destroyed
          ? "销毁子组件，清理未完成请求"
          : t >= 5
            ? "再次点击 Run，仍然可以正常请求"
            : t >= 3
              ? "点击 Abort，loading 立即结束"
              : t >= 1
                ? "点击 Run，等待请求返回"
                : "文档原有操作：创建 / 销毁、Run、Run x3、Abort"
      }
    >
      <DemoCard>
        <div style={row}>
          <Button active={destroyed}>
            {destroyed ? "Create child component" : "Destroy child component"}
          </Button>
          <span style={{ color: gray, fontSize: 26 }}>
            子组件：{destroyed ? "已销毁" : "已创建"}
          </span>
        </div>
        {!destroyed ? (
          <>
            <div style={row}>
              <Button active={(t >= 1 && t < 3) || (t >= 5 && t < 6.5)}>
                Run
              </Button>
              <Button>Run x3</Button>
              <Button danger active={t >= 3 && t < 5}>
                Abort
              </Button>
              <span
                style={{ marginLeft: "auto", color: primary, fontSize: 28 }}
              >
                loading: {String(loading)}
              </span>
            </div>
            <Status loading={loading}>
              {done ? (
                <pre style={{ margin: 0, fontSize: 30, lineHeight: 1.6 }}>
                  {
                    '{\n  "code": 200,\n  "msg": "请求成功",\n  "data": "爱情公寓示例响应"\n}'
                  }
                </pre>
              ) : undefined}
            </Status>
          </>
        ) : (
          <div
            style={{
              minHeight: 300,
              display: "grid",
              placeItems: "center",
              color: gray,
              fontSize: 38,
            }}
          >
            子组件已销毁
          </div>
        )}
      </DemoCard>
    </DocStage>
  );
}
