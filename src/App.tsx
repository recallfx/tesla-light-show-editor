import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Home from './sections/Home';
import Upload from './sections/Upload';
import Viewer from './sections/Viewer';
import { lightShowState } from './foundation/state';
import { ILightshow } from './types';
import './style.css';

export default function App() {
  const setLightShow = useSetRecoilState(lightShowState);
  const navigate = useNavigate();

  const onReceived = (data: ILightshow): void => {
    setLightShow(data);
    navigate('/viewer');
  };

  return (
    <div data-theme='cupcake' className='min-h-screen'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='upload' element={<Upload received={onReceived} />} />
        <Route path='viewer' element={<Viewer />} />
      </Routes>
    </div>
  );
}
