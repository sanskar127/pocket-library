import type { FC } from 'react';
import type { VideoInterface } from "../../types/types"
import { Link } from 'react-router-dom'
import { formatTime, formatSize, formatRelativeTime } from '../../utils'

const Video: FC<{ details: VideoInterface }> = ({ details }) => {
  const { id, thumbnail, name, duration, modifiedAt, size } = details;
  const newTitle = name.length > 53 ? name.slice(0, 53) + "..." : name;

  return (
    <div className="max-w-sm overflow-hidden flex flex-col h-full">
      <Link to={`watch/${id}`} className="relative w-full h-40">
        <img
          src={thumbnail}
          alt={`${newTitle} thumbnail`}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-0 right-0 bg-black/70 text-white text-xs px-2 py-1">
          {formatRelativeTime(modifiedAt)}
        </span>
        <span className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1">
          {formatTime(duration)}
        </span>
      </Link>
      <div className="flex flex-col gap-1 px-3 py-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{newTitle}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatSize(size)}</p>
      </div>
    </div>
  );
};


export default Video;
