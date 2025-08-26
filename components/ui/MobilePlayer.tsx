import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { FaExpand, FaCompress } from 'react-icons/fa';

import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import type { VideoInterface } from "../../types/types";
import { PlaybackSpeedControl, ProgressBar, TimeDisplay } from './Player';
import NotFound from '../common/NotFound';
import useDoubleTap from '../../hooks/useDoubleTap';

const MobilePlayer: FC<{ content: VideoInterface | undefined }> = ({ content }) => {
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  const {
    videoRef,
    isPlaying,
    togglePlay,
    currentTime,
    setCurrentTime,
    duration,
    isFullscreen,
    toggleFullscreen,
    playbackRate,
    setPlaybackRate,
  } = useVideoPlayer();

  const resetHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowControls(true);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const safeSetCurrentTime = useCallback((newTime: number) => {
    if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
      setCurrentTime(newTime);
    }
  }, [duration, setCurrentTime]);

  const handleRewind = useCallback(() => {
    const newTime = currentTime - 5;
    safeSetCurrentTime(Math.max(newTime, 0));
  }, [currentTime, safeSetCurrentTime]);

  const handleFastForward = useCallback(() => {
    const newTime = currentTime + 5;
    safeSetCurrentTime(Math.min(newTime, duration));
  }, [currentTime, duration, safeSetCurrentTime]);

  const handleLeftDoubleTap = useDoubleTap(handleRewind);
  const handleRightDoubleTap = useDoubleTap(handleFastForward);

  const handleVideoTap = useCallback((e: React.TouchEvent) => {
    // Get the actual touch target
    const target = e.target as HTMLElement;
    
    // Check if we're tapping on an interactive element
    const isInteractiveElement = 
      target.tagName === 'BUTTON' || 
      target.closest('button') ||
      target.closest('.progress-bar') || // Add your progress bar class if different
      target.closest('.playback-speed-control'); // Add your playback speed control class
    
    if (!isInteractiveElement) {
      setShowControls(prev => {
        const next = !prev;
        if (next) resetHideTimeout();
        else if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        return next;
      });
    }
  }, [resetHideTimeout]);

  const handlePlayButtonTap = useCallback((e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to video container
    togglePlay();
    resetHideTimeout(); // Keep controls visible after interaction
  }, [togglePlay, resetHideTimeout]);

  const handleFullscreenTap = useCallback((e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to video container
    toggleFullscreen();
    resetHideTimeout(); // Keep controls visible after interaction
  }, [toggleFullscreen, resetHideTimeout]);

  useEffect(() => {
    resetHideTimeout();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimeout]);

  if (!content) return <NotFound itemName='Video' />;

  return (
    <div
      tabIndex={0}
      onTouchStart={handleVideoTap}
      className='relative w-full max-h-1/2 bg-black outline-none'
    >
      <video
        ref={videoRef}
        src={content.url}
        onTouchStart={handleVideoTap}
        className="w-full h-full object-contain"
        controls={false}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 w-full flex justify-between items-center px-5 py-3 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4 text-white">
        </div>
        <PlaybackSpeedControl playbackRate={playbackRate} onChange={setPlaybackRate} />
      </div>

      {/* Center Actions */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div aria-label='rewind fastforward'>
          <div 
            className='absolute top-0 left-0 bg-black/30 h-full w-1/2' 
            onTouchStart={(e) => {
              e.stopPropagation();
              handleLeftDoubleTap();
            }}
          ></div>
          <div 
            className='absolute top-0 right-0 bg-black/30 h-full w-1/2' 
            onTouchStart={(e) => {
              e.stopPropagation();
              handleRightDoubleTap();
            }}
          ></div>
        </div>

        <div className={`flex items-center gap-10 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 pointer-events-auto`}>
          <button
            onTouchStart={handlePlayButtonTap}
            className="text-white text-6xl md:text-7xl hover:text-primary"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <IoIosPause /> : <IoIosPlay />}
          </button>
        </div>

        {isBuffering && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 px-6 pb-3 pt-4 bg-gradient-to-t from-black/90 to-transparent z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mt-3 flex justify-between items-center text-white text-sm">
          <div className="flex items-center gap-5">
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>
          <div className="flex items-center gap-5">
            <button 
              onTouchStart={handleFullscreenTap}
              className="text-xl hover:text-primary transition"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={setCurrentTime} />
      </div>
    </div>
  );
};

export default MobilePlayer;