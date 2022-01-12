import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './sections/Home';
import Upload, { Lightshow } from './sections/Upload';
import Viewer from './sections/Viewer';

import './style.css';

export default function App() {
  const navigate = useNavigate();
  const [lightshow, setLightshow] = useState<Lightshow | undefined>();

  const onReceived = (data: Lightshow): void => {
    setLightshow(data);
    navigate('/viewer');
  };

  return (
    <div data-theme="cupcake" className='min-h-screen'>
      <Routes>
        <Route path='/' element={<Home viewerAvailable={Boolean(lightshow)} />} />
        <Route path='upload' element={<Upload received={onReceived} />} />
        <Route path='viewer' element={<Viewer lightshow={lightshow} />} />
      </Routes>
    </div>
  );
}
