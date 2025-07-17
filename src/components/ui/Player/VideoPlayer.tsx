import { useCallback, useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import TimeDisplay from './TimeDisplay';
import FullscreenToggle from './FullscreenToggle';
import PlaybackSpeedControl from './PlaybackSpeedControl';
import { IoChevronBack, IoPauseCircleOutline, IoPlayCircleOutline } from "react-icons/io5";
import { useItems } from "../../../context/itemsContext"
import type { VideoInterface } from "../../../types/types"
import { useNavigate } from 'react-router-dom';


const VideoPlayer: FC<{ id: string | unknown }> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { items } = useItems()
  const entry = (items as VideoInterface[]).find(item => item.id === id)
  const navigate = useNavigate()
  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setShowControls(true); // Show controls on activity

    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false); // Hide after delay
    }, 3000); // 3 seconds
  }, []);

  const {
    videoRef,
    isPlaying,
    togglePlay,
    volume,
    changeVolume,
    currentTime,
    setCurrentTime,
    duration,
    isFullscreen,
    toggleFullscreen,
    playbackRate,
    setPlaybackRate,
  } = useVideoPlayer();

  // Focus the container when the component mounts
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus()
    const handleUserActivity = () => resetHideTimeout();

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleUserActivity);
    container.addEventListener('click', handleUserActivity);
    container.addEventListener('keydown', handleUserActivity);

    // Initialize hide timer
    resetHideTimeout();

    return () => {
      container.removeEventListener('mousemove', handleUserActivity);
      container.removeEventListener('click', handleUserActivity);
      container.removeEventListener('keydown', handleUserActivity);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimeout]);

  const handleInputs = (event: KeyboardEvent<HTMLDivElement>) => { // Changed type to HTMLDivElement
    // let newVolume: number; // Declare variables to hold the calculated new values
    let newTime: number;
    switch (event.key) {
      case ' ':
        event.preventDefault(); // Prevent default spacebar behavior (e.g., page scroll)
        togglePlay();
        break;

      case 'f':
        event.preventDefault(); // Prevent any default 'f' key behavior
        toggleFullscreen();
        break;

      case 'ArrowRight': // Seek forward
        event.preventDefault();
        // Calculate new time BEFORE passing to setCurrentTime
        newTime = Math.min(duration, currentTime + 5);
        setCurrentTime(newTime);
        break;

      case 'ArrowLeft': // Seek backward
        event.preventDefault();
        // Calculate new time BEFORE passing to setCurrentTime
        newTime = Math.max(0, currentTime - 5);
        setCurrentTime(newTime);
        break;

      case 'ArrowUp':
        event.preventDefault();
        changeVolume(Math.min(1, volume + 0.1)); // Increase volume by 10%
        break;

      case 'ArrowDown':
        event.preventDefault();
        changeVolume(Math.max(0, volume - 0.1)); // Decrease volume by 10%
        break;

      // Add more cases for other shortcuts if needed
      // For example, 'm' for mute/unmute
    }
  };

  if (!entry) {
    return <div>Video not found</div>  // Handle case when video is not found
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full max-w-screen max-h-screen relative flex justify-center items-center ${showControls ? "cursor-auto" : "cursor-none"}`}
      tabIndex={0}
      onKeyDown={handleInputs}
      autoFocus
    >
      <video
        ref={videoRef}
        src={entry.url}
        // poster={poster}
        autoPlay
        // Added 'object-contain' and 'h-full' to ensure the video scales within the container
        className="w-full h-full object-contain"
        controls={false}
        onClick={togglePlay}
      >
      </video>

      {/* Title, Details Header */}
      <div className={`w-full absolute  ${showControls ? 'opacity-100' : 'opacity-0'} top-0 z-10 bg-gradient-to-b from-black/90 to-black/10 backdrop-blur-xs p-4 flex items-center gap-2 text-white`}>
        <button onClick={() => navigate(-1)} className='text-3xl cursor-pointer hover:text-primary'><IoChevronBack /></button>
        <h2 className="text-2xl font-semibold">{entry.name}</h2>
      </div>

      {/* Controls at Footer */}
      <div className={`${showControls ? 'opacity-100' : 'opacity-0'} w-full flex flex-col gap-2 px-6 pb-1 pt-4 bg-gradient-to-t from-black/90 to-black/10 backdrop-blur-xs text-white absolute bottom-0 z-10`}>
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={setCurrentTime} />

        <div className="flex justify-between items-center">
          <div className='flex items-center gap-4'>
            <button className='text-3xl cursor-pointer hover:text-primary' onClick={togglePlay}>
              {isPlaying ? <IoPauseCircleOutline /> : <IoPlayCircleOutline />}
            </button>

            <VolumeControl volume={volume} onChange={changeVolume} />
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>

          <div className='flex items-center gap-4'>
            <PlaybackSpeedControl playbackRate={playbackRate} onChange={setPlaybackRate} />
            <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;