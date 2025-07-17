import React from 'react';
import { formatTime } from '../../../utils';

interface Props {
  currentTime: number;
  duration: number;
}

const TimeDisplay: React.FC<Props> = ({ currentTime, duration }) => {
  return (
    <span className="text-sm text-white">
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  );
};

export default TimeDisplay;
