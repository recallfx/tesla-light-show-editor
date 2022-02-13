import React, { ReactChild, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { FiFile, FiMenu, FiMoreHorizontal } from "react-icons/fi";

import { infoModalOpenState } from './state';

export interface NavProps {
  children: ReactChild | ReactChild[];
}

export default function Nav({ children }: NavProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const setInfoModalOpen = useSetRecoilState(infoModalOpenState);

  const toggleDrawerVisibility = () => {
    setDrawerVisible(!drawerVisible);
  };

  const infoClickHandler = () => {
    setDrawerVisible(false);
    setInfoModalOpen(true);
  };

  return (
    <div className='bg-base-200 drawer h-full'>
      <input id='drawer' type='checkbox' className='drawer-toggle' checked={drawerVisible} onChange={() => {}} />
      <div className='flex flex-col drawer-content'>
        <div className='w-full navbar bg-base-300'>
          <div className='flex-none lg:hidden'>
            <button type='button' className='btn btn-square btn-ghost' onClick={toggleDrawerVisibility}>
              <FiMenu className='inline-block w-6 h-6 stroke-current' />
            </button>
          </div>

          <div className='flex-none px-2 mx-2'>
            <span className='text-lg font-bold'>Tesla Light Show Editor</span>
          </div>

          <div className='flex-1 px-2 mx-2'>
            <div className='items-stretch hidden lg:flex'>
              <button type='button' className='btn btn-ghost btn-sm rounded-btn' onClick={infoClickHandler}>
                <FiFile className='inline-block mr-2' />File info
              </button>
            </div>
          </div>

          <div className='flex-none'>
            <button type='button' className='btn btn-square btn-ghost'>
              <FiMoreHorizontal className='inline-block w-6 h-6 stroke-current' />
            </button>
          </div>
        </div>
        {children}
      </div>
      <div className='drawer-side'>
        <div className='drawer-overlay' aria-hidden='true' onClick={toggleDrawerVisibility} />
        <ul className='p-4 overflow-y-auto menu w-80 bg-base-100'>
          <li>
            <button type='button' className='btn btn-ghost' onClick={infoClickHandler}>
              <FiFile className='inline-block mr-2' />File info
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
