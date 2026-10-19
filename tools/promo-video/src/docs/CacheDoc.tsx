import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Button, DemoCard, DocStage, gray, primary, row } from "./DocStage";

export function CacheDoc() {
  return <FeatureSegment name="缓存 & SWR" purpose="先展示缓存数据，再在后台更新，减少重复等待。"><CacheDocDemo /></FeatureSegment>;
}

function CacheDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const destroyed = t >= 3 && t < 4.5;
  const rebuilding = t >= 4.5 && t < 5.5;
  const updated = t >= 5.5;
  return (
    <DocStage
      demoSeconds={11}
      title="缓存 & SWR · 重建组件时，先看到缓存"
      source="cache"
      codePages={[
        [
          "const { data, loading } = useRequest(service, {",
          '  cacheKey: "cacheKey-demo",',
          "});",
          "",
          "// 文档中 Cached 组件的加载判断",
          "show: data.value === undefined && loading.value",
          "",
          "// Not cached 组件不设置 cacheKey",
        ],
      ]}
      action={
        destroyed
          ? "销毁两个子组件，请求结果保留在缓存中"
          : rebuilding
            ? "重新创建：Cached 立即展示旧数据，无缓存组件继续等待"
            : updated
              ? "后台请求完成，两边都更新为最新资料（SWR）"
              : t >= 1
                ? "首次请求完成，准备销毁并重新创建组件"
                : "首次进入：两个组件都需要等待请求"
      }
    >
      <DemoCard>
        <div style={row}>
          <Button active={destroyed}>
            {destroyed ? "Create child component" : "Destroy child component"}
          </Button>
          <span style={{ fontSize: 27, color: gray }}>
            文档示例：Cached / Not cached
          </span>
        </div>
        {destroyed ? (
          <div
            style={{
              height: 320,
              display: "grid",
              placeItems: "center",
              fontSize: 36,
              color: gray,
            }}
          >
            子组件已销毁
          </div>
        ) : (
          <>
            <CacheRow
              title="Cached"
              loading={t < 1}
              updated={updated}
              note={
                rebuilding
                  ? "已恢复缓存 · 后台更新中"
                  : updated
                    ? "已更新"
                    : "使用 cacheKey"
              }
            />
            <CacheRow
              title="Not cached"
              loading={t < 1 || rebuilding}
              updated={updated}
              note={
                rebuilding
                  ? "没有缓存 · 等待请求"
                  : updated
                    ? "已更新"
                    : "不使用 cacheKey"
              }
            />
          </>
        )}
      </DemoCard>
    </DocStage>
  );
}

function CacheRow({
  title,
  loading,
  updated,
  note,
}: {
  title: string;
  loading: boolean;
  updated: boolean;
  note: string;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid #dce5df",
        paddingTop: 22,
        display: "flex",
        gap: 32,
        alignItems: "center",
        minHeight: 150,
      }}
    >
      <div style={{ width: 280, flexShrink: 0 }}>
        <b style={{ fontSize: 34, color: primary }}>{title}</b>
        <div style={{ color: gray, fontSize: 23, marginTop: 15 }}>{note}</div>
      </div>
      {loading ? (
        <span style={{ color: gray, fontSize: 33 }}>正在获取用户资料…</span>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "18px 50px",
            fontSize: 30,
          }}
        >
          <span>
            姓名：<b>{updated ? "陈一诺" : "林小夏"}</b>
          </span>
          <span>邮箱：{updated ? "chen" : "lin"}@example.com</span>
          <span>部门：{updated ? "产品部" : "技术部"}</span>
          <span>身份：user</span>
        </div>
      )}
    </div>
  );
}
