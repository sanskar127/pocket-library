import type { FC } from 'react';
import type { ImageInterface } from "../../types/types"
import { NavLink } from 'react-router';
import { formatSize, formatRelativeTime } from '../../utils';

const Image: FC<{ details: ImageInterface }> = ({ details }) => {
  const { name, modifiedAt, size, type, url } = details;

  return (
    <div className="w-full lg:w-md flex flex-col h-full overflow-hidden transition-all">
      <NavLink to={"#"} className="relative w-full" style={{ paddingTop: '56.25%' }}>
        {
          <img
              src={url}
              alt={`${name} thumbnail`}
              className="bg-black absolute top-0 left-0 w-full h-full object-contain object-center"
            />
        }

        <span className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5">
          {formatRelativeTime(modifiedAt)}
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

export default Image;
