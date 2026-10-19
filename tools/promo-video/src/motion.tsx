import type { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { green, mono, muted } from "./ui";

export const coral = "#ff7b82";
export const blue = "#70b9ff";
export const amber = "#ffd080";
export const purple = "#b8a0ff";
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export function Reveal({
  children,
  delay = 0,
  side = 1,
}: {
  children: ReactNode;
  delay?: number;
  side?: number;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: f - delay * fps,
    fps,
    config: { damping: 22, stiffness: 100 },
  });
  return (
    <div
      style={{
        opacity: p,
        translate: `${side * (1 - p) * 100}px 0`,
        rotate: `${side * (1 - p) * 2}deg`,
        scale: 0.94 + 0.06 * p,
      }}
    >
      {children}
    </div>
  );
}

export function Metric({
  value,
  label,
  color = green,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 70,
          lineHeight: 1.1,
          fontFamily: mono,
          letterSpacing: -4,
          color,
        }}
      >
        {value}
      </div>
      <div style={{ color: muted, fontSize: 20, marginTop: 12 }}>{label}</div>
    </div>
  );
}

export function SignalPath({
  stopped = false,
  color = green,
  start = 0,
}: {
  stopped?: boolean;
  color?: string;
  start?: number;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg viewBox="0 0 680 150" style={{ width: "100%", overflow: "visible" }}>
      <path
        d="M90 75 H590"
        stroke={`${color}25`}
        strokeWidth="3"
        strokeDasharray="7 9"
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={
            stopped
              ? 330 - i * 40
              : 100 +
                (((((f - start * fps) / (fps * 1.8) + i / 3) % 1) + 1) % 1) *
                  480
          }
          cy="75"
          r={stopped ? 4 : 7}
          fill={color}
          opacity={stopped ? 0.3 : 0.9}
        />
      ))}
      <rect
        x="12"
        y="25"
        width="125"
        height="100"
        rx="20"
        fill="#102b22"
        stroke={`${color}66`}
      />
      <text
        x="74"
        y="84"
        textAnchor="middle"
        fill={color}
        fontFamily={mono}
        fontSize="23"
      >
        CLIENT
      </text>
      <rect
        x="535"
        y="25"
        width="130"
        height="100"
        rx="20"
        fill="#102b22"
        stroke={`${color}66`}
      />
      <text
        x="600"
        y="84"
        textAnchor="middle"
        fill={color}
        fontFamily={mono}
        fontSize="23"
      >
        API
      </text>
      {stopped && (
        <g>
          <circle
            cx="340"
            cy="75"
            r="29"
            fill="#391b23"
            stroke={coral}
            strokeWidth="2"
          />
          <path d="m330 65 20 20 m0-20-20 20" stroke={coral} strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}

export function Ring({
  progress,
  label,
  color = green,
  detail,
}: {
  progress: number;
  label: string;
  color?: string;
  detail: string;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
      <div
        style={{ width: 170, height: 170, position: "relative", flexShrink: 0 }}
      >
        <svg viewBox="0 0 170 170" style={{ width: "100%", rotate: "-90deg" }}>
          <circle
            cx="85"
            cy="85"
            r="73"
            fill="none"
            stroke={`${color}18`}
            strokeWidth="9"
          />
          <circle
            cx="85"
            cy="85"
            r="73"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={459}
            strokeDashoffset={
              459 * (1 - Math.min(1, Math.max(0.015, progress)))
            }
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: mono,
            fontSize: 40,
            color,
            scale: 1 + Math.sin((f / fps) * 4) * 0.015,
          }}
        >
          {label}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 31, color }}>{detail}</div>
        <div style={{ marginTop: 14, color: muted, fontSize: 21 }}>
          请求状态演示
        </div>
      </div>
    </div>
  );
}

export function Event({
  name,
  active,
  color = green,
  detail,
}: {
  name: string;
  active: boolean;
  color?: string;
  detail: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "12px 20px",
        borderRadius: 12,
        border: `1px solid ${active ? `${color}99` : "#ffffff12"}`,
        background: active ? `${color}13` : "#ffffff03",
      }}
    >
      <div
        style={{
          width: 9,
          height: 9,
          borderRadius: 20,
          background: active ? color : "#385044",
          boxShadow: active ? `0 0 18px ${color}` : "none",
        }}
      />
      <span
        style={{
          color: active ? color : muted,
          fontFamily: mono,
          fontSize: 24,
        }}
      >
        {name}
      </span>
      <span style={{ marginLeft: "auto", color: muted, fontSize: 18 }}>
        {detail}
      </span>
    </div>
  );
}

export function Flash({ at, color = green }: { at: number; color?: string }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, ${color}28, transparent 75%)`,
        opacity: interpolate(
          f,
          [(at - 0.05) * fps, at * fps, (at + 0.65) * fps],
          [0, 1, 0],
          clamp,
        ),
      }}
    />
  );
}
