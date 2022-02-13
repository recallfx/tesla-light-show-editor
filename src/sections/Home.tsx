import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Footer from '../foundation/Footer';
import { lightShowState } from '../foundation/state';

export default function Home() {
  const lightShow = useRecoilValue(lightShowState);
  const viewerAvailable = Boolean(lightShow);

  return (
    <section className='flex flex-col justify-between min-h-screen'>
      <main className='hero flex-grow'>
        <div className='text-center hero-content'>
          <div className='max-w-md'>
            <h1 className='mb-5 text-5xl font-bold whitespace-nowrap'>Tesla Light Show editor</h1>

            {!viewerAvailable && (
              <Link to='upload' className='btn btn-primary'>
                Get started
              </Link>
            )}
            {viewerAvailable && (
              <div>
                <Link to='upload' className='btn btn-primary mr-2'>
                  Upload new file
                </Link>
                <Link to='viewer' className='btn btn-secondary'>
                  Back to viewer
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
