import type { FC } from 'react';
import type { VideoInterface } from "../../types/types"
import { NavLink } from 'react-router';
import { formatTime, formatSize, formatRelativeTime } from '../../utils';
import { MdOutlineOndemandVideo } from 'react-icons/md';

const Video: FC<{ details: VideoInterface }> = ({ details }) => {
  const { id, thumbnail, name, duration, modifiedAt, size, type } = details;

  return (
    <div className="w-full lg:w-md flex flex-col h-full overflow-hidden transition-all">
      <NavLink to={`/watch/${id}`} className="relative w-full" style={{ paddingTop: '56.25%' }}>
        {
          thumbnail ? (
            <img
              src={thumbnail}
              alt={`${name} thumbnail`}
              className="bg-black absolute top-0 left-0 w-full h-full object-contain object-center"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center border-2 border-primary text-primary">
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

      <div className="w-full flex flex-col gap-1 px-3 py-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
          {name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatSize(size)} • {type}</p>
      </div>
    </div>
  );
};

export default Video;
