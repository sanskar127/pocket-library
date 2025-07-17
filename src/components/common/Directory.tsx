import type { FC } from "react";
import { FaFolderOpen } from "react-icons/fa6";
import type { DirectoryInterface } from "../../types/types";
import { Link } from "react-router-dom";

const Directory: FC<{ details: DirectoryInterface }> = ({ details }) => {
  const { name, url } = details
  return (
    <div className="max-w-sm overflow-hidden flex flex-col h-full">
      <Link to={url} className="relative w-full h-40 flex items-center justify-center text-dark bg-primary object-cover cursor-pointer">
        <FaFolderOpen className="text-7xl" />
      </Link>
      <div className="flex flex-col gap-1 px-3 py-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{name}</h3>
      </div>
    </div>
  );
};

export default Directory
