import React from 'react';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<Props> = ({ currentTime, duration, onSeek }) => {
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <input
      type="range"
      min={0}
      max={duration}
      step={0.1}
      value={currentTime}
      onChange={(e) => onSeek(Number(e.target.value))}
      className="slider w-full"
      style={{
        background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${progressPercent}%, #d1d5db ${progressPercent}%, #d1d5db 100%)`
      }}
    />
  );
};

export default ProgressBar;
