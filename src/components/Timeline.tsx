import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timeline, TimelineRow, TimelineModel, TimelineOptions, TimelineScrollEvent } from 'animation-timeline-js';

export default function Timeline2({ timelineRows, updateTimelinePosition, time }: { timelineRows: Array<any>, updateTimelinePosition: Function, time: number }) {
  const [loading, setLoading] = useState(true);
  const timelineElRef = useRef(null);
  const outlineHeaderRef = useRef(null);
  const outlineScrollContainerRef = useRef(null);
  const outlineContainerRef = useRef(null);
  const timelineRef = useRef<Timeline>();

  useEffect(() => {
    // react error workaround
    const onwheel = (e) => e.preventDefault();
    document.body.addEventListener('onwheel', onwheel, {passive: false});

    if (timelineElRef.current && timelineRows.length) {
      const timeline = new Timeline({ id: timelineElRef.current, stepVal: 1000 }, { rows: timelineRows } as TimelineModel);
      const options = timeline.getOptions();
      timelineRef.current = timeline;

      if (outlineHeaderRef.current) {
        const outlineHeaderEl = outlineHeaderRef.current as HTMLElement;

        outlineHeaderEl.style.maxHeight = `${options.headerHeight}px` || outlineHeaderEl.style.maxHeight;
        outlineHeaderEl.style.minHeight = `${options.headerHeight}px` || outlineHeaderEl.style.minHeight;
      }

      timeline.onScroll((obj) => {
        if (options) {

          if (outlineScrollContainerRef.current) {
            const outlineScrollContainerEl = outlineScrollContainerRef.current as HTMLElement;

            outlineScrollContainerEl.scrollTop = obj.scrollTop || outlineScrollContainerEl.scrollTop;
          }

          if (outlineContainerRef.current) {
            const outlineContainerEl = outlineContainerRef.current as HTMLElement;

            outlineContainerEl.style.minHeight = `${obj.scrollHeight}px` || outlineContainerEl.style.minHeight;
          }
        }
      });

      timeline.onTimeChanged(({val, source}) => {
        if (source !== "setTimeMethod") {
          updateTimelinePosition(val/1000);
        }
      });
    }

    setLoading(true);
    // cleanup
    return () => { document.body.removeEventListener('onwheel', onwheel); }
  }, [timelineRows]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.setTime(time*1000);
    }
  }, [time])

  const outlineMouseWheelHandler = (event) => {  
    // workaround react issue
    // eslint-disable-next-line no-param-reassign
    event.preventDefault = () => {};

    if (timelineRef.current) {
      // eslint-disable-next-line no-underscore-dangle
      timelineRef.current._handleWheelEvent(event);
    }
  };

  const outlineRows = useMemo(() => {
    const options = timelineRef.current?.getOptions();

    return timelineRows.map((row: any, index: number) => {
      const style = {
        minHeight: options?.rowsStyle?.height || 24,
        maxHeight: options?.rowsStyle?.height || 24,
        marginBottom: options?.rowsStyle?.marginBottom || 2,
      };

        return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className='outline-node hover:bg-zinc-500 pl-[20px] [user-select:none] w-full text-white text-xs items-center flex' style={style}>
          {row.title || `Track ${index}`}
        </div>
      );
    });
  }, [timelineRows, loading]);

  return (
    <div className='timeline-container flex h-[600px] overflow-hidden bg-zinc-800'>
      <div className='outline flex flex-col overflow-hidden min-w-[150px] h-full items-stretch [align-content:stretch]'>
        <div className='outline-header min-h-[30px] bg-[#101011]' ref={outlineHeaderRef} />
        <div
          className='outline-scroll-container overflow-hidden'
          ref={outlineScrollContainerRef}
          onWheel={outlineMouseWheelHandler}
        >
          <div className='timeline outline-container w-full h-full' ref={outlineContainerRef}>
            {outlineRows}
          </div>
        </div>
      </div>
      <div className='flex-1' ref={timelineElRef} />
    </div>
  );
}
