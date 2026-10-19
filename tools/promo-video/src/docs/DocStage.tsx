import type { ReactNode } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Code, mono } from "../ui";

export const ink = "#17332b";
export const gray = "#65786f";
export const primary = "#16865e";
export const red = "#cc414c";
export const border = "#dce5df";

export function DocStage({
  title,
  source,
  codePages,
  codeSeconds = 7,
  demoSeconds = 9,
  action,
  children,
}: {
  title: string;
  source: string;
  codePages: string[][];
  codeSeconds?: number;
  demoSeconds?: number;
  action: string;
  children: ReactNode;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const demoEnd = demoSeconds * fps;
  const demo = f < demoEnd;
  const page = Math.min(
    codePages.length - 1,
    Math.floor(Math.max(0, f - demoEnd) / ((codeSeconds * fps) / codePages.length)),
  );
  return (
    <AbsoluteFill
      style={{
        background: "#f4f7f5",
        color: ink,
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        padding: "44px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: gray,
          fontSize: 23,
        }}
      >
        <b style={{ color: primary }}>vue3-request / 文档示例</b>
        <span>{demo ? "01 · 操作与结果" : "02 · 对应配置"}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: 60, letterSpacing: -1, margin: 0 }}>{title}</h1>
        <span
          style={{
            fontSize: 24,
            padding: "12px 22px",
            border: `1px solid ${border}`,
            borderRadius: 10,
            background: "white",
            color: primary,
          }}
        >
          {demo ? "示例效果" : `代码节选 ${page + 1}/${codePages.length}`}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,

        }}
      >
        {demo ? (
          <>
            {children}
            <div
              style={{
                color: ink,
                background: "#e2f3e9",
                borderLeft: `6px solid ${primary}`,
                borderRadius: 10,
                padding: "22px 28px",
                fontSize: 36,
                fontWeight: 550,
                textAlign: "center",
                minHeight: 50,
              }}
            >
              {action}
            </div>
          </>
        ) : (
          <div style={{ width: "100%" }}>
            <Code
              filename={`${source} · 文档代码节选`}
              fontSize={36}
              animate={false}
              lines={codePages[page]}
            />
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 24,
          borderTop: `1px solid ${border}`,
          paddingTop: 20,
          color: gray,
          fontSize: 22,
        }}
      >
        <span style={{ fontFamily: mono }}>guide/demo/{source}.md</span>
        <span>
          {demo
            ? "文档示例界面复现 · 固定数据"
            : "省略类型定义、消息提示及无关代码"}
        </span>
      </div>
    </AbsoluteFill>
  );
}

export function DemoCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: "32px 44px",
        display: "flex",
        flexDirection: "column",
        gap: 26,
        boxShadow: "0 14px 40px #244f3210",
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  active = false,
  danger = false,
}: {
  children: ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  const color = danger ? red : primary;
  return (
    <div
      style={{
        border: `2px solid ${color}`,
        background: active ? color : "white",
        color: active ? "white" : color,
        padding: "15px 32px",
        borderRadius: 8,
        fontSize: 31,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 150,
      }}
    >
      {active ? "↖ " : ""}{children}
    </div>
  );
}

export function Control({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{ display: "flex", gap: 22, alignItems: "center", fontSize: 29 }}
    >
      <span>{label}</span>
      <div
        style={{
          border: `1px solid ${border}`,
          borderRadius: 6,
          padding: "12px 24px",
          fontFamily: mono,
          background: "#fcfdfc",
          minWidth: 140,
          display: "flex",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {value}
        <span style={{ color: gray }}>⌃⌄</span>
      </div>
    </div>
  );
}

export function Switch({ on }: { on: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        background: on ? primary : "#bcc8c1",
        width: 78,
        height: 40,
        padding: 5,
        borderRadius: 6,
      }}
    >
      <span
        style={{ background: "white", width: 30, height: 30, borderRadius: 4 }}
      />
    </span>
  );
}

export function Profile({ lastUpdate }: { lastUpdate?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 44,
        padding: "18px 0",
      }}
    >
      <div
        style={{
          background: "#e2f2e9",
          border: "1px solid #b3d6c3",
          borderRadius: 12,
          width: 170,
          height: 170,
          display: "grid",
          placeItems: "center",
          color: primary,
          fontSize: 78,
        }}
      >
        林
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.7fr",
          gap: "18px 70px",
          fontSize: 31,
        }}
      >
        <span>
          姓名：<b>林小夏</b>
        </span>
        <span>邮箱：lin@example.com</span>
        <span>部门：技术部</span>
        <span>身份：user</span>
        {lastUpdate && (
          <span style={{ gridColumn: "1 / -1", color: primary }}>
            最后更新：{lastUpdate}
          </span>
        )}
      </div>
    </div>
  );
}

export function Status({
  loading,
  error,
  children,
}: {
  loading?: boolean;
  error?: string;
  children?: ReactNode;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        minHeight: 215,
        display: "flex",
        alignItems: "center",
        justifyContent: loading || error ? "center" : "flex-start",
        borderTop: `1px solid ${border}`,
        paddingTop: 24,
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            color: primary,
            fontSize: 34,
          }}
        >
          <span
            style={{
              display: "block",
              width: 40,
              height: 40,
              border: "4px solid #d5e8df",
              borderTopColor: primary,
              borderRadius: "50%",
              rotate: `${(f / fps) * 220}deg`,
            }}
          />
          请求中…
        </div>
      ) : error ? (
        <div style={{ color: red, fontSize: 34 }}>{error}</div>
      ) : (
        (children ?? (
          <div
            style={{
              color: gray,
              fontSize: 34,
              width: "100%",
              textAlign: "center",
            }}
          >
            暂无数据
          </div>
        ))
      )}
    </div>
  );
}

export const row = { display: "flex", alignItems: "center", gap: 22 } as const;
