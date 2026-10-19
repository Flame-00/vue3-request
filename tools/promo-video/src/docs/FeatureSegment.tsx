import type { ReactNode } from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

function FeatureTitle({ name, purpose }: { name: string; purpose: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22 } });
  return (
    <AbsoluteFill style={{
      background: "#071e18", color: "#f1fff7", padding: "100px 140px",
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      justifyContent: "center", gap: 38,
      translate: `${interpolate(frame, [72, 84], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0`,
    }}>
      <div style={{ color: "#65e2ad", fontSize: 28, letterSpacing: 5 }}>VUE3-REQUEST / 功能演示</div>
      <div style={{ width: interpolate(frame, [0, 24], [0, 140], { extrapolateRight: "clamp" }), height: 6, background: "#65e2ad" }} />
      <h1 style={{ margin: 0, fontSize: 112, lineHeight: 1.2, opacity: enter, translate: `0 ${(1 - enter) * 45}px` }}>{name}</h1>
      <p style={{ margin: 0, maxWidth: 1450, color: "#c4ddd0", fontSize: 43, lineHeight: 1.6, opacity: interpolate(frame, [8, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{purpose}</p>
      <div style={{ marginTop: 40, color: "#65e2ad", fontSize: 27 }}>接下来：操作示例 → 状态变化 → 对应配置</div>
    </AbsoluteFill>
  );
}

export function FeatureSegment({ name, purpose, children }: { name: string; purpose: string; children: ReactNode }) {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#f4f7f5" }}>
      <Sequence from={72} premountFor={fps} name="操作演示与配置">{children}</Sequence>
      <Sequence durationInFrames={84} premountFor={fps} name="功能名称与作用">
        <FeatureTitle name={name} purpose={purpose} />
      </Sequence>
    </AbsoluteFill>
  );
}
