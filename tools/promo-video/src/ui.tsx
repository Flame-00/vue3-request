import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  CanvasImage,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const green = "#00e6a0";
export const muted = "#819b95";
export const mono = '"SFMono-Regular", Menlo, Consolas, monospace';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function Frame({
  children,
  chapter,
  caption,
  accent = green,
}: {
  children: ReactNode;
  chapter: string;
  caption: string;
  accent?: string;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: "#071310",
        color: "#eefaf6",
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(ellipse at ${70 + Math.sin(f / (fps * 3)) * 12}% 15%, ${accent}20 0%, transparent 60%), linear-gradient(#ffffff03 1px, transparent 1px), linear-gradient(90deg, #ffffff03 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 72px 72px, 72px 72px",
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          padding: "58px 96px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <CanvasImage
              src={staticFile("logo.svg")}
              style={{ width: 36, height: 36 }}
            />
            <b>vue3-request</b>
          </div>
          <span style={{ color: muted, fontFamily: mono, fontSize: 20 }}>
            {chapter}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: interpolate(f, [0, 0.3 * fps], [0, 1], clamp),
            translate: `0 ${interpolate(f, [0, 0.7 * fps], [64, 0], clamp)}px`,
            scale:
              0.97 + 0.03 * spring({ frame: f, fps, config: { damping: 22 } }),
          }}
        >
          {children}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #244238",
            paddingTop: 26,
            gap: 32,
          }}
        >
          <span style={{ fontSize: 28, color: "#bbd0c9" }}>{caption}</span>
          <span style={{ color: muted, fontSize: 18, whiteSpace: "nowrap" }}>
            Vue 3 · TypeScript · 插件扩展
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function Heading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div style={{ marginBottom: 38 }}>
      <div
        style={{
          color: green,
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: 4,
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </div>
      <h1
        style={{ margin: 0, fontSize: 68, fontWeight: 600, letterSpacing: -2 }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 28, color: muted, margin: "18px 0 0" }}>{detail}</p>
    </div>
  );
}

const tokenPattern =
  /("[^"\n]*"|'[^'\n]*'|\/\/.*$|\b(?:import|from|const|async|await|return|true|false)\b|\b\d+\b|\b(?:useRequest|fetch|searchUsers|getUser|run|refresh)\b)/g;
function Tokens({ line }: { line: string }) {
  return (
    <>
      {line.split(tokenPattern).map((part, i) => (
        <span
          key={i}
          style={{
            color: /^['"]/.test(part)
              ? "#b3e88c"
              : part.startsWith("//")
                ? muted
                : /^(import|from|const|async|await|return|true|false)$/.test(
                      part,
                    )
                  ? "#bda4f9"
                  : /^\d+$/.test(part)
                    ? "#f5c57b"
                    : /^(useRequest|fetch|searchUsers|getUser|run|refresh)$/.test(
                          part,
                        )
                      ? green
                      : "#d3e5df",
          }}
        >
          {part}
        </span>
      ))}
    </>
  );
}

export function Code({
  filename,
  lines,
  highlight,
  fontSize = 24,
  animate = true,
}: {
  filename: string;
  lines: string[];
  highlight?: number;
  fontSize?: number;
  animate?: boolean;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        background: "#0b1a16",
        border: "1px solid #2a443b",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 24px 60px #0004",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "22px 26px",
          borderBottom: "1px solid #243a32",
          background: "#11221c",
        }}
      >
        <i style={dot("#ef7d78")} />
        <i style={dot("#e7c26e")} />
        <i style={dot(green)} />
        <span
          style={{
            marginLeft: 18,
            fontFamily: mono,
            fontSize: 20,
            color: muted,
          }}
        >
          {filename}
        </span>
        <span style={{ marginLeft: "auto", color: green, fontSize: 16 }}>
          VUE / TS
        </span>
      </div>
      <div
        style={{
          padding: "24px 0 30px",
          fontFamily: mono,
          fontSize,
          lineHeight: fontSize > 24 ? 1.6 : 1.95,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              padding: "0 24px",
              background: highlight === i ? "#00e6a013" : "transparent",
              borderLeft: `3px solid ${highlight === i ? green : "transparent"}`,
              opacity: animate
                ? interpolate(
                    f,
                    [i * fps * 0.07, i * fps * 0.07 + fps * 0.25],
                    [0, 1],
                    clamp,
                  )
                : 1,
            }}
          >
            <span
              style={{
                width: 42,
                flexShrink: 0,
                color: "#456056",
                fontSize: 18,
                paddingTop: 6,
              }}
            >
              {i + 1}
            </span>
            <span style={{ whiteSpace: "pre" }}>
              <Tokens line={line} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function dot(color: string): CSSProperties {
  return { width: 12, height: 12, borderRadius: "50%", background: color };
}

export function Badge({
  children,
  color = green,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        color,
        background: `${color}12`,
        border: `1px solid ${color}40`,
        padding: "10px 18px",
        borderRadius: 100,
        fontSize: 20,
      }}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  children,
  compact = false,
}: {
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        background: "#11231d",
        border: "1px solid #2b493d",
        borderRadius: 22,
        padding: compact ? 28 : 32,
        display: "flex",
        flexDirection: "column",
        gap: compact ? 20 : 25,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 24 }}>{title}</span>
        <span style={{ fontSize: 16, color: muted }}>功能示意</span>
      </div>
      {children}
    </div>
  );
}

export const columns: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.18fr 1fr",
  gap: 40,
  alignItems: "center",
};
