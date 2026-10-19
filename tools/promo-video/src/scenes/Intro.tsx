import {
  CanvasImage,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Badge, Frame, green, mono, muted } from "../ui";
import { blue, coral, purple } from "../motion";

export function Intro() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Frame
      chapter="01 / INTRODUCTION"
      caption="请求的每一个瞬间，都在掌控之中。"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
        <div style={{ flex: 1 }}>
          <Badge>ASYNC. UNDER CONTROL.</Badge>
          <div
            style={{
              fontSize: 112,
              fontWeight: 650,
              letterSpacing: -7,
              lineHeight: 1.2,
              marginTop: 28,
            }}
          >
            {"vue3-request".split("").map((char, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: i > 3 ? green : "#eefaf6",
                  translate: `0 ${(1 - spring({ frame: f - i * fps * 0.045, fps, config: { damping: 17 } })) * 100}px`,
                  opacity: interpolate(
                    f,
                    [i * fps * 0.045, i * fps * 0.045 + 5],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 500, margin: "30px 0 18px" }}>
            让每一次请求，都有章法。
          </h1>
          <p style={{ color: muted, fontSize: 28 }}>
            缓存 · 重试 · 中止 · 聚焦刷新 · 轮询
          </p>
          <div
            style={{
              marginTop: 44,
              fontFamily: mono,
              fontSize: 25,
              color: green,
            }}
          >
            const &#123; data, loading &#125; = useRequest(service)
          </div>
        </div>
        <div
          style={{
            width: 350,
            height: 350,
            position: "relative",
            display: "grid",
            placeItems: "center",
            border: "1px solid #00e6a044",
            borderRadius: 72,
            background: "linear-gradient(145deg, #173b2e, #091b14)",
            rotate: `${interpolate(f, [0, 2 * fps], [-18, 0], { extrapolateRight: "clamp" }) + Math.sin((f / fps) * 1.5) * 2}deg`,
            scale: interpolate(f, [0, fps], [0.8, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <CanvasImage
            src={staticFile("logo.svg")}
            style={{ width: 200, height: 200 }}
          />
          {[green, blue, coral, purple].map((color, i) => (
            <div
              key={color}
              style={{
                position: "absolute",
                width: 440 + i * 34,
                height: 440 + i * 34,
                borderRadius: "50%",
                border: `1px solid ${color}25`,
                rotate: `${(f / fps) * (i % 2 ? -12 : 12) + i * 45}deg`,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: color,
                  borderRadius: "50%",
                  margin: "-7px auto 0",
                  boxShadow: `0 0 25px ${color}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
