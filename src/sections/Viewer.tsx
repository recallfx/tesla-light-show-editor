import React from 'react';
import { Navigate } from 'react-router-dom';

import { ILightshow } from './Upload';
import Footer from '../foundation/Footer';

import Lightshow from '../components/Lightshow';

// workaround esbuild issue with spilling variables to global (this will rename other definitions)
// @ts-ignore
const audioContext = AudioContext;

export interface ViewerProps {
  lightshow: ILightshow | undefined;
}

export default function Viewer({ lightshow }: ViewerProps) {
  const hasLightshow = Boolean(lightshow?.fseq?.arrayBuffer);

  return (
    <section className='flex flex-col justify-between min-h-screen'>
      <main className='flex-grow container mx-auto'>
        {hasLightshow && lightshow && <Lightshow lightshow={lightshow} />}
        {!hasLightshow && <Navigate to='/upload' replace />}
      </main>

      <Footer />
    </section>
  );
}
