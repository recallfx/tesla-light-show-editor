import React from 'react';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fseqState, infoModalOpenState, lightShowState } from '../foundation/state';
import FseqInfo from './FseqInfo';

export default function InfoModal() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useRecoilState(infoModalOpenState)
  const lightShow = useRecoilValue(lightShowState);
  const fseq = useRecoilValue(fseqState);

  const closeClickHandler = () => {
    setIsInfoModalOpen(false);
  }

  return (
    <div
      className={classNames({
        modal: true,
        'modal-open': isInfoModalOpen,
      })}
    >
      <div className='modal-box'>
        <div>
          <h3 className='text-info'>Loaded files</h3>
          <div>fseq {lightShow?.fseq?.name || 'N/A'}</div>
          <div>audio {lightShow?.audio?.name || 'N/A'}</div>

          <h3 className='text-info'>FSEQ info</h3>

          <FseqInfo fseq={fseq} />
        </div>
        <div className='modal-action'>
          <button type='button' className='btn' onClick={closeClickHandler}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
