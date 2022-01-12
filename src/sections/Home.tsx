import React from 'react';
import { Link } from 'react-router-dom';

import Footer from '../foundation/Footer';

export interface HomeProps {
  viewerAvailable: boolean;
}

export default function Home({ viewerAvailable }: HomeProps) {
  return (
    <section className='flex flex-col justify-between min-h-screen'>
      <main className='hero flex-grow'>
        <div className='text-center hero-content'>
          <div className='max-w-md'>
            <h1 className='mb-5 text-5xl font-bold'>Ready to parse Tesla lightshow?</h1>

            {!viewerAvailable && (
              <Link to='upload' className='btn btn-primary'>
                Get started
              </Link>
            )}
            {viewerAvailable && (
              <div>
                <Link to='upload' className='btn btn-primary'>
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
