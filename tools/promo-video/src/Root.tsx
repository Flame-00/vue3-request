import { ParametersDoc, RefreshDoc, CancelDoc, ReadyDoc, ThrottleDoc, DebounceDoc } from "./docs/MoreDocs";
import { Composition, Folder, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./scenes/Intro";
import { Abort } from "./scenes/Abort";
import { Retry } from "./scenes/Retry";
import { Focus } from "./scenes/Focus";
import { Polling } from "./scenes/Polling";
import { Basic } from "./scenes/Basic";
import { Debounce } from "./scenes/Debounce";
import { Cache } from "./scenes/Cache";
import { Outro } from "./scenes/Outro";
import { CacheDoc } from "./docs/CacheDoc";
import { BasicDoc } from "./docs/BasicDoc";
import { AbortDoc } from "./docs/AbortDoc";
import { RetryDoc } from "./docs/RetryDoc";
import { FocusDoc } from "./docs/FocusDoc";
import { PollingDoc } from "./docs/PollingDoc";
import { LifecycleDoc } from "./docs/LifecycleDoc";

export function Promo() {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence
        name="品牌开场"
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="文档 · 中止请求"
        durationInFrames={Math.round(20.4 * fps)}
        premountFor={fps}
      >
        <AbortDoc />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="文档 · 缓存与 SWR"
        durationInFrames={Math.round(20.4 * fps)}
        premountFor={fps}
      >
        <CacheDoc />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="文档 · 错误重试"
        durationInFrames={Math.round(29.4 * fps)}
        premountFor={fps}
      >
        <RetryDoc />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="文档 · 聚焦刷新"
        durationInFrames={Math.round(18.4 * fps)}
        premountFor={fps}
      >
        <FocusDoc />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="文档 · 系统状态轮询"
        durationInFrames={Math.round(19.4 * fps)}
        premountFor={fps}
      >
        <PollingDoc />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="文档 · 请求生命周期"
        durationInFrames={Math.round(24.4 * fps)}
        premountFor={fps}
      >
        <LifecycleDoc />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
      />
      <TransitionSeries.Sequence
        name="安装与项目地址"
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

export const RemotionRoot = () => (
  <>
    <Composition
      id="Vue3RequestPromo"
      component={Promo}
      durationInFrames={4119}
      fps={30}
      width={1920}
      height={1080}
    />
    <Folder name="Documentation-Examples">
      <Composition
        id="BasicDoc"
        component={BasicDoc}
        durationInFrames={642}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CacheDoc"
        component={CacheDoc}
        durationInFrames={612}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AbortDoc"
        component={AbortDoc}
        durationInFrames={612}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RetryDoc"
        component={RetryDoc}
        durationInFrames={882}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FocusDoc"
        component={FocusDoc}
        durationInFrames={552}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PollingDoc"
        component={PollingDoc}
        durationInFrames={582}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LifecycleDoc"
        component={LifecycleDoc}
        durationInFrames={732}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition id="ParametersDoc" component={ParametersDoc} durationInFrames={552} fps={30} width={1920} height={1080} />
      <Composition id="RefreshDoc" component={RefreshDoc} durationInFrames={552} fps={30} width={1920} height={1080} />
      <Composition id="CancelDoc" component={CancelDoc} durationInFrames={582} fps={30} width={1920} height={1080} />
      <Composition id="ReadyDoc" component={ReadyDoc} durationInFrames={552} fps={30} width={1920} height={1080} />
      <Composition id="ThrottleDoc" component={ThrottleDoc} durationInFrames={552} fps={30} width={1920} height={1080} />
      <Composition id="DebounceDoc" component={DebounceDoc} durationInFrames={552} fps={30} width={1920} height={1080} />
    </Folder>
    <Folder name="Previous-Examples">
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Abort"
        component={Abort}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Retry"
        component={Retry}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Focus"
        component={Focus}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Polling"
        component={Polling}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Basic"
        component={Basic}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Debounce"
        component={Debounce}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Cache"
        component={Cache}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
  </>
);
