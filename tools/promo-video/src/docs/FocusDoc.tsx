import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Control,
  DemoCard,
  DocStage,
  gray,
  primary,
  Profile,
  row,
  Status,
  Switch,
} from "./DocStage";

export function FocusDoc() {
  return <FeatureSegment name="窗口聚焦刷新" purpose="用户重新回到页面时自动刷新，及时获取最新数据。"><FocusDocDemo /></FeatureSegment>;
}

function FocusDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const away = t >= 2 && t < 5;
  const loading = t >= 5 && t < 5.8;
  const updated = t >= 5.8;
  return (
    <DocStage
      title="屏幕聚焦重新请求 · 看最后更新时间"
      source="focus-refresh"
      codePages={[
        [
          "const refocusTimespan = ref(2000);",
          "const refreshOnWindowFocus = ref(true);",
          "",
          "const { data, error, loading } =",
          "  useRequest(getUserInfo, {",
          "    refreshOnWindowFocus,",
          "    refocusTimespan,",
          "  });",
        ],
      ]}
      action={
        away
          ? "切到其他标签页，离开当前页面"
          : updated
            ? "回到页面后，请求完成，最后更新时间改变"
            : loading
              ? "重新聚焦窗口，自动发起请求"
              : "开启自动刷新，聚焦间隔设为 2000ms"
      }
    >
      <DemoCard>
        <div
          style={{
            ...row,
            justifyContent: "space-between",
            borderBottom: "1px solid #dce5df",
            paddingBottom: 22,
          }}
        >
          <span style={{ fontSize: 30, color: primary }}>
            {away ? "其他标签页" : "当前文档示例"}
          </span>
          <span style={{ fontSize: 26, color: gray }}>
            {away ? "当前页面失焦" : "当前页面获得焦点"}
          </span>
        </div>
        <div style={row}>
          <Control label="重新聚焦间隔：" value="2000" />
          <span style={{ fontSize: 29, marginLeft: 30 }}>
            窗口聚焦时是否自动刷新：
          </span>
          <Switch on />
          <span style={{ fontSize: 28 }}>true</span>
        </div>
        <div style={{ opacity: away ? 0.45 : 1 }}>
          <Status loading={loading}>
            <Profile lastUpdate={updated ? "10:00:06" : "10:00:00"} />
          </Status>
        </div>
      </DemoCard>
    </DocStage>
  );
}
