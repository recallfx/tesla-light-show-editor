import React, { useRef, useMemo, useEffect, useState } from 'react';

import FseqParser from '../utils/FseqParser';
import Fseq from '../utils/Fseq';

import FseqInfo from './FseqInfo';
import Timeline from './Timeline';

import { ILightshow } from '../sections/Upload';
import ModelView from './ModelView';
import AudioView from './AudioView';
import { channelsConfig } from '../Config';

export interface LightshowProps {
  lightshow: ILightshow;
}

interface ITimelineRow {
  selected: boolean;
  hidden: boolean;
  keyframes: Array<any>;
  data: any;
  title: string;
  channel: any;
}
interface IKeyFrameIntervals {
  start: { val: number; state: number } | undefined;
  end: { val: number; state: number } | undefined;
}

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

export default function Lightshow({ lightshow }: LightshowProps) {
  const eventBusRef = useRef<Array<Function>>([]);
  const [fseq, setFseq] = useState<Fseq | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0.0);
  const [channels, setChannels] = useState<Array<number>>(new Array(48));

  useEffect(() => {
    const arrayBuffer = lightshow?.fseq?.arrayBuffer;

    if (arrayBuffer) {
      const fseqParser = new FseqParser(arrayBuffer);

      setFseq(fseqParser.fseq);
    }
  }, [lightshow]);

  const timelineRows = useMemo(() => {
    if (fseq) {
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
    }

    return [];
  }, [fseq]);

  useEffect(() => {
    if (fseq) {
      const numberOfFrames = fseq?.numberOfFrames || 0;
      const frameIndex = Math.floor((currentTime * 1000) / fseq.stepTimeInMs);

      if (frameIndex < numberOfFrames) {
        // setChannels([...fseq.get_frame(frameIndex)]);
        eventBusRef.current.forEach((calback) => calback([...fseq.get_frame(frameIndex)]));
      }
    }
  }, [fseq, currentTime]);

  const modelView = useMemo(
    () => <ModelView channels={channels} subscribe={(callback: Function) => eventBusRef.current.push(callback)} />,
    [],
  );

  const hasAudio = Boolean(lightshow?.audio?.arrayBuffer);
  const hasFseq = Boolean(lightshow?.fseq?.arrayBuffer);
  const showModel = true;

  return (
    <div className='flex flex-col'>
      {showModel && <div className='h-[220px]'>{modelView}</div>}
      <div>
        <div className='text-xs absolute -mt-4 z-10'>
          <span className='text-info'>Loaded files</span> fseq {lightshow?.fseq?.name || 'N/A'}, audio{' '}
          {lightshow?.audio?.name || 'N/A'}
        </div>
        {hasAudio && (
          <AudioView audioArrayBuffer={lightshow?.audio?.arrayBuffer} updateTimelinePosition={setCurrentTime} />
        )}
        <Timeline timelineRows={timelineRows} updateTimelinePosition={setCurrentTime} time={currentTime} />
        {hasFseq && <FseqInfo fseq={fseq} />}
      </div>
    </div>
  );
}
