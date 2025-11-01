import type { FC } from "react";
import { FaFolderOpen } from "react-icons/fa6";
import type { DirectoryInterface } from "../../types/types";
import { NavLink } from "react-router";

const Directory: FC<{ details: DirectoryInterface }> = ({ details }) => {
  const { name, url } = details;

  return (
    <div className="w-full lg:w-md flex flex-col h-full overflow-hidden transition-all">
      <NavLink to={url} className="relative aspect-video flex items-center justify-center bg-primary text-dark cursor-pointer">
        <FaFolderOpen className="text-6xl md:text-6xl lg:text-8xl" />
      </NavLink>
      <div className="flex flex-col gap-1 px-3 py-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default Directory;
