import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Badge,
  Code,
  columns,
  Frame,
  green,
  Heading,
  muted,
  Panel,
} from "../ui";

export function Cache() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cached = f >= 4 * fps;
  return (
    <Frame
      chapter="04 / CACHE"
      caption="同一 cacheKey 在 staleTime 内复用数据，减少重复请求。"
    >
      <Heading
        eyebrow="REUSE WHAT YOU ALREADY HAVE"
        title="相同的数据，无需重复等待。"
        detail="用 cacheKey 标识数据，用 staleTime 定义新鲜时间。"
      />
      <div style={columns}>
        <Code
          filename="UserCard.vue · script setup"
          highlight={cached ? 2 : 3}
          lines={[
            "const { data, loading } =",
            "  useRequest(getUser, {",
            '    cacheKey: "user-profile",',
            "    staleTime: 60_000,",
            "  });",
            "",
            "// 60 秒内，同一 key 复用缓存",
          ]}
        />
        <Panel title="两次挂载，同一份资料">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Step
              label="01 · 首次访问"
              value="请求 service → 写入缓存"
              active={!cached}
            />
            <Step
              label="02 · 再次访问"
              value={cached ? "命中缓存 → 展示资料" : "等待再次访问"}
              active={cached}
            />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontSize: 86, color: green, fontWeight: 600 }}>
              1
            </span>
            <span style={{ fontSize: 27, color: muted }}>次网络请求</span>
          </div>
          <Badge>
            {cached
              ? "✓ 新鲜缓存 · 无需再次请求"
              : "● 第一次请求完成后缓存数据"}
          </Badge>
        </Panel>
      </div>
    </Frame>
  );
}

function Step({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${active ? "#00e6a080" : "#2b4238"}`,
        borderRadius: 14,
        padding: 22,
        background: active ? "#00e6a00b" : "transparent",
      }}
    >
      <div style={{ color: muted, fontSize: 20, marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontSize: 27, color: active ? green : "#bed0c7" }}>
        {value}
      </div>
    </div>
  );
}
