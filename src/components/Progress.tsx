import React from 'react';
import { useRecoilValue } from 'recoil';
import { progressState } from '../foundation/state';

export default function Progress() {
  const progress = useRecoilValue(progressState);

  return <span>{Math.round(progress * 100) / 100}</span>;
}
