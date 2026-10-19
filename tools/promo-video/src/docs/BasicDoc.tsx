import { FeatureSegment } from "./FeatureSegment";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Button, DemoCard, DocStage, gray, primary, red, row } from "./DocStage";

export function BasicDoc() {
  return <FeatureSegment name="Basic 基础请求" purpose="观察 data、res、error、loading 如何随请求成功与失败变化。"><BasicDocDemo /></FeatureSegment>;
}

function BasicDocDemo() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const loading = t < 1 || (t >= 4 && t < 5) || (t >= 8 && t < 9);
  const failed = t >= 5 && t < 9;
  const hasData = (t >= 1 && t < 5) || t >= 9;
  const fields = [
    { name: "data", note: "完整响应", value: hasData ? '{ "code": 200, "msg": "success",\n  "data": "番茄意面" }' : "undefined" },
    { name: "res", note: "提取 data 字段", value: hasData ? '"番茄意面"' : "undefined" },
    { name: "error", note: "失败原因；成功后清除", value: failed ? 'Error("请求失败")' : "undefined" },
    { name: "loading", note: "请求进行中为 true", value: String(loading) },
  ];
  return (
    <DocStage title="Basic · 四个响应式状态，一起观察" source="basic" demoSeconds={12}
      codePages={[[
        'const { run, data, res, error, loading } =',
        '  useRequest(service);',
        '',
        '// 挂载后自动请求；按钮调用 run() 再次请求',
        '// data：完整响应；res：默认提取 data 字段',
        '// error：失败原因；loading：是否请求中',
      ]]}
      action={t < 1 ? "① 自动请求：loading=true，其他状态尚无值" : t < 4 ? "② 成功：data 保存完整响应，res 提取业务数据" : t < 5 ? "③ 再次请求：loading=true，暂时保留上次数据" : t < 8 ? "④ 失败：error 有值，data 和 res 清空，loading=false" : t < 9 ? "⑤ 点击重试：loading=true，等待新结果" : "⑥ 恢复成功：重新填充 data、res，并清除 error"}>
      <DemoCard>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <b style={{ fontSize: 32 }}>{t < 4 ? "首次请求：成功" : t < 8 ? "第二次请求：失败" : "第三次请求：恢复成功"}</b>
          <Button active={t >= 4 && t < 4.7 || t >= 8 && t < 8.7}>{t >= 5 ? "重试 run()" : "再次请求 run()"}</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          {fields.map(field => <div key={field.name} style={{ padding: 24, borderRadius: 12, background: "#f1f7f3", minHeight: 170 }}>
            <div style={{ ...row, justifyContent: "space-between" }}><b style={{ color: primary, fontSize: 36 }}>{field.name}</b><span style={{ color: gray, fontSize: 23 }}>{field.note}</span></div>
            <pre style={{ margin: "20px 0 0", fontSize: 29, lineHeight: 1.5, whiteSpace: "pre-wrap", color: field.name === "error" && failed ? red : primary }}>{field.value}</pre>
          </div>)}
        </div>
      </DemoCard>
    </DocStage>
  );
}
