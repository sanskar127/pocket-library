import type { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { DirectoryInterface } from "../../types/types";
import { Link } from "expo-router";

const Directory: FC<{ details: DirectoryInterface }> = ({ details }) => {
  const { name, url } = details;

  return (
    <div className="w-full lg:w-md flex flex-col h-full overflow-hidden transition-all">
      <Link
        href={url}
        className="relative aspect-video flex items-center justify-center bg-primary text-dark cursor-pointer"
      >
        <Ionicons name="folder-open" size={64} color="currentColor" />
      </Link>
      <div className="flex flex-col gap-1 px-3 py-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default Directory;
