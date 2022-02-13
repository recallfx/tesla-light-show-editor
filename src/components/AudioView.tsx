import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import WaveSurfer from 'wavesurfer.js';
import playhead from 'wavesurfer.js/src/plugin/playhead';
import throttle from 'lodash/throttle';
import { currentTimeState, progressState } from '../foundation/state';
import Progress from './Progress';

export interface AudioViewProps {
  audioArrayBuffer: ArrayBuffer | undefined | null;
}

export default function AudioView({ audioArrayBuffer }: AudioViewProps) {
  const setCurrentTime = useSetRecoilState(currentTimeState);
  const setProgress = useSetRecoilState(progressState);

  const [loading, setLoading] = useState<Boolean>(true);
  const wavesurferContainerRef = useRef(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);


  const audioProcessHandler = () => {
    if (wavesurferRef.current) {
      const localCurrentTime = wavesurferRef.current.getCurrentTime();
      setProgress(localCurrentTime);
      setCurrentTime(localCurrentTime);
    }
  };

  const throttledAudioProcess = useMemo(
    () => throttle(audioProcessHandler, 20)
  , []);

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

      wavesurferRef.current.on('seek', throttledAudioProcess);
      wavesurferRef.current.on('audioprocess', throttledAudioProcess);
    }
  }, [audioArrayBuffer, setCurrentTime]);

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
            <Progress />
          </>
        )}
      </div>
    </div>
  );
}
