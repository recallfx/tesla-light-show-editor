import React, { useRef, useEffect, useState } from 'react';
import { RGBM7Encoding } from 'three';
import WaveSurfer from 'wavesurfer.js';
import playhead from 'wavesurfer.js/src/plugin/playhead';

export interface AudioViewProps {
  audioArrayBuffer: ArrayBuffer | undefined | null;
  updateTimelinePosition: Function;
}

export default function AudioView({ audioArrayBuffer, updateTimelinePosition }: AudioViewProps) {
  const [loading, setLoading] = useState<Boolean>(true);
  const [progress, setProgress] = useState<number>(0.0);
  const wavesurferContainerRef = useRef(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (wavesurferContainerRef.current && audioArrayBuffer) {
      wavesurferRef.current = WaveSurfer.create({
        container: wavesurferContainerRef.current,
        waveColor: '#D9DCFF',
        progressColor: '#4353FF',
        cursorColor: '#4353FF',
        height: 64,

        backgroundColor: '#27272a',
        barWidth: 2,
        cursorWidth: 1,
        plugins: [
          playhead.create({
            returnOnPause: true,
            moveOnSeek: true,
            draw: true,
          }),
        ],
      });

      wavesurferRef.current.loadBlob(new Blob([audioArrayBuffer]));

      wavesurferRef.current.on('ready', () => {
        setLoading(false);
      });

      wavesurferRef.current.on('seek', () => {
        if (wavesurferRef.current) {
          const currentTime = wavesurferRef?.current?.getCurrentTime();
          updateTimelinePosition(currentTime);
          setProgress(currentTime);
        }
      });

      wavesurferRef.current.on('audioprocess', () => {
        if (wavesurferRef.current && wavesurferRef.current.isPlaying()) {
          const currentTime = wavesurferRef.current.getCurrentTime();
          setProgress(currentTime);
          updateTimelinePosition(currentTime);
        }
      });
    }
  }, [audioArrayBuffer]);

  const onPlayPauseHandler = () => {
    if (wavesurferRef.current?.isPlaying()) {
      wavesurferRef.current?.pause();
    } else {
      wavesurferRef.current?.play();
    }
  };

  return (
    <div>
      <div ref={wavesurferContainerRef} />
      <div className='absolute ml-1 z-10'>
        {loading && <>Loading</>}
        {!loading && (
          <>
            <button className='btn btn-primary btn-xs mr-3' type='button' onClick={onPlayPauseHandler}>
              Play/pause
            </button>
            <span>T:{Math.round(progress * 100) / 100}</span>
          </>
        )}
      </div>
    </div>
  );
}
