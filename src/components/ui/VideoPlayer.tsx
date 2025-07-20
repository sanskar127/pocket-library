import { useCallback, useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import type { VideoInterface } from "../../types/types";
import { useNavigate } from 'react-router';

// Icons
import { IoIosPlay, IoIosPause, IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import { FaExpand, FaCompress, FaAngleLeft } from 'react-icons/fa';

// External Components
import { PlaybackSpeedControl, VolumeControl, ProgressBar, TimeDisplay } from './Player';
import VideoNotFound from '../common/VideoNotFound';

const VideoPlayer: FC<{ content: VideoInterface | undefined }> = ({ content }) => {
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

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

  const resetHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowControls(true);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.focus();

    const handleActivity = () => resetHideTimeout();
    container.addEventListener('mousemove', handleActivity);
    container.addEventListener('click', handleActivity);
    container.addEventListener('keydown', handleActivity);
    resetHideTimeout();

    return () => {
      container.removeEventListener('mousemove', handleActivity);
      container.removeEventListener('click', handleActivity);
      container.removeEventListener('keydown', handleActivity);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimeout]);

  const handleKeyboardShortcuts = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case ' ': event.preventDefault(); togglePlay(); break;
      case 'f': event.preventDefault(); toggleFullscreen(); break;
      case 'ArrowRight': setCurrentTime(Math.min(duration, currentTime + 5)); break;
      case 'ArrowLeft': setCurrentTime(Math.max(0, currentTime - 5)); break;
      case 'ArrowUp': changeVolume(Math.min(1, volume + 0.1)); break;
      case 'ArrowDown': changeVolume(Math.max(0, volume - 0.1)); break;
    }
  };

  if (!content) return <VideoNotFound />

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyboardShortcuts}
      className={`relative w-full h-screen bg-black outline-none ${showControls ? 'cursor-auto' : 'cursor-none'}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={content.url}
        poster={content?.thumbnail}
        autoPlay
        className="w-full h-full object-contain"
        controls={false}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 w-full flex justify-between items-center px-5 py-3 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => navigate(-1)} className="text-3xl hover:text-primary">
            <FaAngleLeft />
          </button>
          <h2 className="text-lg md:text-2xl font-semibold">{content.name}</h2>
        </div>
        <div className="hidden md:block">
        </div>
      </div>

      {/* Center Actions */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {/* Wrapper with pointer events to allow button interaction */}
        <div className={`flex items-center gap-10 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 pointer-events-auto`}>
          {/* Skip Back */}
          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            className="text-4xl text-white hover:text-primary"
            aria-label="Skip back 10 seconds"
          >
            <IoIosSkipBackward />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white text-6xl md:text-7xl hover:text-primary"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <IoIosPause /> : <IoIosPlay />}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            className="text-4xl text-white hover:text-primary"
            aria-label="Skip forward 10 seconds"
          >
            <IoIosSkipForward />
          </button>
        </div>

        {/* Buffering Spinner */}
        {isBuffering && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 px-6 pb-3 pt-4 bg-gradient-to-t from-black/90 to-transparent z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={setCurrentTime} />
        <div className="mt-3 flex justify-between items-center text-white text-sm">
          {/* Left Controls */}
          <div className="flex items-center gap-5">
            <TimeDisplay currentTime={currentTime} duration={duration} />
            <VolumeControl volume={volume} onChange={changeVolume} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <PlaybackSpeedControl playbackRate={playbackRate} onChange={setPlaybackRate} />
            </div>
            <button onClick={toggleFullscreen} className="text-xl hover:text-primary transition">
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
