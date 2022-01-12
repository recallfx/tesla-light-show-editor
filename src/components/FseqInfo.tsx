import React from 'react';
import Fseq from '../utils/Fseq';

export interface FseqProps {
  fseq: Fseq | undefined | null;
}

export default function FseqInfo({ fseq }: FseqProps) {

  const onClickHandler = () => {
    if (!arrayBuffer) {
      return;
    }

    const a = document.createElement('a');
    document.body.appendChild(a);
    // @ts-ignore
    a.style = 'display: none';

    const blob = new Blob([arrayBuffer], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'lightshow.fseq';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {fseq && (
        <div className='font-mono text-sm break-words'>{fseq.toString()}</div>
      )}

      <button className='btn btn-primary mt-3 hidden' onClick={onClickHandler} type='button'>Save</button>
    </div>
  );
}
