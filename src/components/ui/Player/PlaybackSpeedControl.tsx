import React, { useState } from 'react';
import { SiSpeedtest } from "react-icons/si";

interface Props {
  playbackRate: number;
  onChange: (rate: number) => void;
}

const PlaybackSpeedControl: React.FC<Props> = ({ playbackRate, onChange }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div
      className="relative inline-block"
      onClick={() => setShow(prev => !prev)}
    >
      {show && (
        <select
          value={playbackRate}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm shadow-lg p-2 focus:outline-none"
        >
          {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>
      )}

      <button
        className="text-white text-2xl cursor-pointer hover:text-primary p-2 rounded-full transition duration-200"
        aria-label="Change playback speed"
      >
        <SiSpeedtest />
      </button>
    </div>
  );
};

export default PlaybackSpeedControl;
