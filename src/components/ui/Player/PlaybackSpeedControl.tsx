import React, { useState } from 'react';
import { SiSpeedtest } from "react-icons/si";

interface Props {
  playbackRate: number;
  onChange: (rate: number) => void;
}

const PlaybackSpeedControl: React.FC<Props> = ({ playbackRate, onChange }) => {
  const [show, setShow] = useState(false);
  const speeds = [0.5, 1, 1.25, 1.5, 2];

  return (
    <div className="relative inline-block text-white">
      <button
        onClick={() => setShow(prev => !prev)}
        className="text-xl hover:text-primary p-2 rounded-full transition duration-200"
        aria-label="Change playback speed"
      >
        <SiSpeedtest />
      </button>

      {show && (
        <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-sm rounded shadow-lg p-1 z-20 w-24">
          {speeds.map(rate => (
            <button
              key={rate}
              onClick={() => { onChange(rate); setShow(false); }}
              className={`w-full text-left px-3 py-1 hover:bg-primary/30 ${playbackRate === rate ? 'text-primary font-semibold' : 'text-white'}`}
            >
              {rate}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaybackSpeedControl;
