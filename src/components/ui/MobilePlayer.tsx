import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { FaExpand, FaCompress, FaAngleDown } from 'react-icons/fa';

import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import type { VideoInterface } from "../../types/types";
import { PlaybackSpeedControl, ProgressBar, TimeDisplay } from './Player';
import VideoNotFound from '../common/VideoNotFound';

const MobilePlayer: FC<{ content: VideoInterface | undefined }> = ({ content }) => {
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    resetHideTimeout();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimeout]);

  if (!content) return <VideoNotFound />;

  return (
    <div
      tabIndex={0}
      onTouchStart={() => {
        setShowControls(prev => {
          const next = !prev;
          if (next) resetHideTimeout();
          else if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          return next;
        });
      }}
      className='relative w-full max-h-1/2 bg-black outline-none'
    >
      <video
        ref={videoRef}
        src={content.url}
        autoPlay
        className="w-full h-full object-contain"
        controls={false}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 w-full flex justify-between items-center px-5 py-3 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 z-10 ${showControls ? 'block' : 'hidden'}`}>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => navigate(-1)} className="text-3xl hover:text-primary">
            <FaAngleDown />
          </button>
        </div>
        <PlaybackSpeedControl playbackRate={playbackRate} onChange={setPlaybackRate} />
      </div>

      {/* Center Actions */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className={`flex items-center gap-10 ${showControls ? 'block' : 'hidden'} transition-opacity duration-300 pointer-events-auto`}>
          <button
            onClick={togglePlay}
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
      <div className={`absolute bottom-0 left-0 right-0 px-6 pb-3 pt-4 bg-gradient-to-t from-black/90 to-transparent z-10 transition-opacity duration-300 ${showControls ? 'block' : 'hidden'}`}>
        <div className="mt-3 flex justify-between items-center text-white text-sm">
          <div className="flex items-center gap-5">
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>
          <div className="flex items-center gap-5">
            <button onClick={toggleFullscreen} className="text-xl hover:text-primary transition">
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
