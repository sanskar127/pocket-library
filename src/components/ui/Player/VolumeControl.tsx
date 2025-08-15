import React, { useRef, useState } from 'react';
// import { IoVolumeOff, IoVolumeLow, IoVolumeMedium, IoVolumeHigh } from "react-icons/io5";
import { MdVolumeUp, MdVolumeDown, MdVolumeMute } from "react-icons/md";

interface Props {
  volume: number;
  onChange: (volume: number) => void;
}

const VolumeControl: React.FC<Props> = ({ volume, onChange }) => {
  const previousVolumeRef = useRef<number>(1); // defaults to full volume
  const [show, setShow] = useState<boolean>(false);

  const handleMute = () => {
    if (volume === 0) {
      onChange(previousVolumeRef.current || 1);
    } else {
      previousVolumeRef.current = volume;
      onChange(0);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <MdVolumeMute />;
    if (volume < 0.5) return <MdVolumeDown />;
    // if (volume < 0.66) return <IoVolumeMedium />;
    return <MdVolumeUp />;
  };

  return (
    <div
      className="flex items-center gap-4"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button className="text-2xl cursor-pointer hover:text-primary" onClick={handleMute}>
        {getVolumeIcon()}
      </button>

      {show && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, #A76545 0%, #A76545 ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)` }}
          className="slider w-18"
        />
      )}
    </div>
  );
};

export default VolumeControl;
