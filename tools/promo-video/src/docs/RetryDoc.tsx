import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Button,
  Control,
  DemoCard,
  DocStage,
  gray,
  primary,
  Profile,
  red,
  row,
  Status,
} from "./DocStage";

export function RetryDoc() {
  return <FeatureSegment name="错误重试" purpose="请求失败后按退避间隔自动重试，提高请求成功率。"><RetryDocDemo /></FeatureSegment>;
}

function RetryDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  // 文档默认指数退避：请求各耗时 1 秒，三次重试前分别等待 2、4、8 秒。
  const attempt = t >= 17 ? 3 : t >= 8 ? 2 : t >= 3 ? 1 : 0;
  const executeCount = t >= 18 ? 3 : t >= 9 ? 2 : t >= 4 ? 1 : 0;
  const starts = [0, 3, 8, 17];
  const loading = t >= starts[attempt] && t < starts[attempt] + 1;
  const success = t >= 18;
  const error = !loading && !success && t >= 1;
  return (
    <DocStage
      demoSeconds={20}
      title="错误重试 · 失败三次后获得用户信息"
      source="retry"
      codePages={[
        [
          "const currentRetryCount = ref(0);",
          "const errorRetryCount = ref(3);",
          "",
          "const { data, error, loading, refresh } =",
          "  useRequest(getUserInfo, {",
          "    errorRetryCount,",
          "    onFinally: () => {",
          "      currentRetryCount.value++;",
          "    },",
          "  });",
        ],
      ]}
      action={
        success
          ? "第 3 次重试成功，文档示例展示用户资料"
          : loading
            ? `正在执行${attempt === 0 ? "首次请求" : `第 ${attempt} 次重试`}`
            : error
              ? `请求失败，等待 ${attempt === 0 ? 2 : attempt === 1 ? 4 : 8} 秒后重试`
              : "文档设定：重试 3 次后成功"
      }
    >
      <DemoCard>
        <div
          style={{
            padding: "18px 24px",
            borderLeft: `5px solid ${primary}`,
            background: "#eef6f1",
            fontSize: 31,
          }}
        >
          假设重试 <b>3</b> 次就会成功
        </div>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <Control label="重试次数：" value="3" />
          <div style={row}>
            <span style={{ fontSize: 32 }}>
              已重试：<b style={{ color: red, fontSize: 42 }}>{executeCount}</b>{" "}
              次
            </span>
            <Button>Refresh</Button>
          </div>
        </div>
        <Status
          loading={loading}
          error={error ? "Failed to obtain user information!" : undefined}
        >
          {success ? <Profile /> : undefined}
        </Status>
        <div style={{ color: gray, fontSize: 26 }}>
          默认退避等待：2s → 4s → 8s
        </div>
      </DemoCard>
    </DocStage>
  );
}
