import { useEffect, useRef, useState } from 'react';

export const useVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const changeVolume = (val: number) => {
    const video = videoRef.current;
    if (video) {
      video.volume = val;
      setVolume(val);
    }
  };

  const toggleFullscreen = () => {
    const player = videoRef.current?.parentElement;
    if (!player) return;
    if (!document.fullscreenElement) {
      player.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return {
    videoRef,
    isPlaying,
    togglePlay,
    volume,
    changeVolume,
    currentTime,
    setCurrentTime: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
    duration,
    isFullscreen,
    toggleFullscreen,
    playbackRate,
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
      }
    },
  };
};
