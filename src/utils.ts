import { isBrowser, isMobile, isTablet } from "react-device-detect"

export const formatRelativeTime = (dateString: Date | undefined): string => {
  if (!dateString) return ""
  const date = new Date(dateString);
  const now = new Date();

  const diff = now.getTime() - date.getTime(); // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

export const formatSize = (bytes: number | undefined, decimals = 2): string => {
  if (!bytes) return ""
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const paddedMinutes = hours > 0 ? `${minutes}`.padStart(2, '0') : `${minutes}`;
  const paddedSeconds = `${seconds}`.padStart(2, '0');

  return hours > 0
    ? `${hours}:${paddedMinutes}:${paddedSeconds}`
    : `${minutes}:${paddedSeconds}`;
};

export const getDevice = () => {
    if (isMobile) return { device: "mobile", limit: 2}
    else if (isTablet) return { device: "tablet", limit: 2}
    else if (isBrowser) return { device: "laptop", limit: 5}
    else return { device: "desktop", limit: 6}
}
