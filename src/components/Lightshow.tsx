import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Timeline from './Timeline';

import ModelView from './ModelView';
import AudioView from './AudioView';
import { lightShowState } from '../foundation/state';


export default function Lightshow() {
  console.log('Lightshow');

  const lightShow = useRecoilValue(lightShowState);

  const hasAudio = Boolean(lightShow?.audio?.arrayBuffer);
  const showModel = true;

  return (
    <div className='flex flex-col'>
      {showModel && <div className='h-[220px]'><ModelView /></div>}
      <div>
        {hasAudio && (
          <AudioView audioArrayBuffer={lightShow?.audio?.arrayBuffer} />
        )}
        <Timeline />
      </div>
    </div>
  );
}
