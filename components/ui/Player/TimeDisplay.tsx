import React from 'react';
import { formatTime } from '../../../utils';

interface Props {
  currentTime: number;
  duration: number;
}

const TimeDisplay: React.FC<Props> = ({ currentTime, duration }) => (
  <span className="text-sm text-white font-mono tracking-wider">
    {formatTime(currentTime)} / {formatTime(duration)}
  </span>
);

export default TimeDisplay;
