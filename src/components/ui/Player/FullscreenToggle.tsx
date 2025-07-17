import React from 'react';
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";

interface Props {
  isFullscreen: boolean;
  onToggle: () => void;
}

const FullscreenToggle: React.FC<Props> = ({ isFullscreen, onToggle }) => (
  <button onClick={onToggle} className="text-white text-2xl cursor-pointer hover:text-primary">
    {isFullscreen ? <BiExitFullscreen/> : <BiFullscreen/> }
  </button>
);

export default FullscreenToggle;
