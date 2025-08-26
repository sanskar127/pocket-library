import React, { useRef, useState } from 'react';
import { formatTime } from '../../../utils';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<Props> = ({ currentTime, duration, onSeek }) => {
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const barRef = useRef<HTMLInputElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverTime(Math.max(0, Math.min(duration, percent * duration)));
  };

  const handleMouseLeave = () => setHoverTime(null);

  return (
    <div className="relative w-full group">
      <input
        ref={barRef}
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="slider w-full"
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${progressPercent}%, #444 ${progressPercent}%, #444 100%)`
        }}
      />
      {hoverTime !== null && (
        <div
          className="absolute bottom-full left-0 transform -translate-x-1/2 translate-y-[-6px] text-xs text-white bg-black/80 rounded px-2 py-1 shadow pointer-events-none transition-all"
          style={{
            left: `${(hoverTime / duration) * 100}%`
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
