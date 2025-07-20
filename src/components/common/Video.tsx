import type { FC } from 'react';
import type { VideoInterface } from "../../types/types"
import { NavLink } from 'react-router';
import { formatTime, formatSize, formatRelativeTime } from '../../utils';
import { MdOutlineOndemandVideo } from 'react-icons/md';

const Video: FC<{ details: VideoInterface }> = ({ details }) => {
  const { id, thumbnail, name, duration, modifiedAt, size } = details;
  const newTitle = name.length > 53 ? name.slice(0, 53) + "..." : name;

  return (
    <div className="flex flex-col h-full overflow-hidden transition-all">
      <NavLink to={`/watch/${id}`} className="relative aspect-video w-full">
        {
          thumbnail ? (
            <img
              src={thumbnail}
              alt={`${newTitle} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) :
            (
              <div className="relative aspect-video w-full flex flex-col items-center justify-center border-2 border-primary text-primary">
                <MdOutlineOndemandVideo className="text-8xl md:text-6xl lg:text-7xl mb-2" />
              </div>
            )
        }

        <span className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5">
          {formatRelativeTime(modifiedAt)}
        </span>
        <span className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5">
          {formatTime(duration)}
        </span>
      </NavLink>
      <div className="flex flex-col gap-1 px-3 py-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
          {newTitle}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatSize(size)}</p>
      </div>
    </div>
  );
};

export default Video;
