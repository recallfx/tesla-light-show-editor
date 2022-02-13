import { atom, selector, selectorFamily } from 'recoil';
import { channelsConfig } from '../Config';
import { IKeyFrameIntervals, ILightshow, ITimelineRow } from '../types';
import Fseq from '../utils/Fseq';
import FseqParser from '../utils/FseqParser';

export const lightShowState = atom<ILightshow | null>({
  key: 'lightShowState',
  default: null,
});

export const fseqBufferState = selector<ArrayBuffer | null>({
  key: 'fseqBufferState',
  get: ({ get }) => {
    const lightShow = get(lightShowState);

    return lightShow?.fseq?.arrayBuffer || null;
  },
});

export const audioBufferState = selector<ArrayBuffer | null>({
  key: 'audioBufferState',
  get: ({ get }) => {
    const lightShow = get(lightShowState);

    return lightShow?.audio?.arrayBuffer || null;
  },
});

export const fseqState = selector<Fseq | null>({
  key: 'fseqState',
  get: ({ get }) => {
    const fseqBuffer = get(fseqBufferState);

    if (fseqBuffer) {
      const fseqParser = new FseqParser(fseqBuffer);

      return fseqParser.fseq;
    }

    return null;
  },
});

export const infoModalOpenState = atom({
  key: 'infoModalOpenState',
  default: false,
});

export const currentTimeState = atom<number>({
  key: 'currentTimeState',
  default: 0,
});

export const fseqFrameState = selector({
  key: 'fseqFrameState',
  get: ({ get }) => {
    const fseq: Fseq | null = get(fseqState);
    const currentTime: number = get(currentTimeState);

    if (fseq) {
      const numberOfFrames = fseq.numberOfFrames || 0;
      const frameIndex = Math.floor((currentTime * 1000) / fseq.stepTimeInMs);

      if (frameIndex < numberOfFrames) {
        return [...fseq.get_frame(frameIndex)];
      }
    }

    return null;
  },
});

export const channelValueStateFamily = selectorFamily({
  key: 'channelValue',
  get: (index: number) => ({get}) => {
    const fseqFrame = get(fseqFrameState);

    if (fseqFrame) { // length 48
      return fseqFrame[index];
    }

    return 0;
  },
});

export const timelineRowsState = selector<Array<ITimelineRow>>({
  key: 'timelineRowsState',
  get: ({ get }) => {
    function setKeyframeIntervals(
      intervals: Array<IKeyFrameIntervals>,
      state: number,
      index: number,
      stepTimeInMs: number,
    ): void {
      let lastInterval = intervals[intervals.length - 1];
    
      if (!lastInterval) {
        lastInterval = {} as IKeyFrameIntervals;
        intervals.push(lastInterval);
      }
    
      // state = value, val = time
      if (state) {
        if (!lastInterval.start) {
          lastInterval.start = { val: index * stepTimeInMs, state };
          lastInterval.end = { val: index * stepTimeInMs + stepTimeInMs, state };
        } else {
          lastInterval.end = { val: index * stepTimeInMs + stepTimeInMs, state };
        }
      } else if (lastInterval.end) {
        // setnew last keyframe
        lastInterval = {} as IKeyFrameIntervals;
        intervals.push(lastInterval);
      }
    }
    
    const fseq = get(fseqState);

    if (!fseq) {
      return [];
    }

    const rows: Array<ITimelineRow> = [];

    channelsConfig.forEach((channel) => {
      const data = [fseq.numberOfFrames];
      const keyframeIntervals: Array<IKeyFrameIntervals> = [];

      for (let i = 0; i < fseq?.numberOfFrames; i++) {
        const frame = fseq.get_frame(i);
        const frameChannelValue = frame[channel.id];

        data[i] = frameChannelValue;

        setKeyframeIntervals(keyframeIntervals, frameChannelValue, i, fseq.stepTimeInMs);
      }

      const keyframes = keyframeIntervals.reduce((acc: Array<any>, interval, index) => {
        const group = `group_${channel.id}_${index}`;

        if (interval.start && interval.end) {
          acc.push({ ...interval.start, group });
          acc.push({ ...interval.end, group });
        }

        return acc;
      }, []);

      rows.push({
        selected: false,
        hidden: false,
        keyframes,
        data,
        title: channel.title,
        channel,
      });
    });

    return rows;
  },
});

export const progressState = atom<number>({
  key: 'progressState',
  default: 0,
});