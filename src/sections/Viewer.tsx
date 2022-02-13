import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import InfoModal from '../components/InfoModal';

import Lightshow from '../components/Lightshow';
import Nav from '../foundation/Nav';
import { fseqBufferState } from '../foundation/state';

// workaround esbuild issue with spilling variables to global (this will rename other definitions)
// @ts-ignore
const audioContext = AudioContext;

export default function Viewer() {
  const fseqBuffer = useRecoilValue(fseqBufferState);

  const hasLightshow = Boolean(fseqBuffer);

  return (
    <section className='flex flex-col justify-between min-h-screen'>
      <Nav>
        <main className='flex-grow'>
          {hasLightshow ? <Lightshow /> : <Navigate to='/upload' replace />}
        </main>
        <InfoModal />
      </Nav>
    </section>
  );
}
