import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { isMobile, isTablet, MobileView } from "react-device-detect";

import VideoPlayer from "../components/ui/VideoPlayer";
import MobilePlayer from "../components/ui/MobilePlayer";
import Video from "../components/common/Video";

import { formatRelativeTime } from "../utils";
import type { ItemType, VideoInterface } from "../types/types";
import VideoNotFound from "../components/common/VideoNotFound";
import { IoMdCloudDownload } from "react-icons/io";

interface dataInterface {
  data: ItemType[]
  isMore: boolean
}

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const queryClient = useQueryClient();

  // Flatten cached query data and find the relevant video entry
  const cache = queryClient.getQueriesData<dataInterface>({ queryKey: ["media"] });
  const entries: ItemType[] = cache.flatMap(([_, response]) => response?.data)
  const entry = (entries as VideoInterface[]).find(item => item.id === videoId);

  const filteredVideos = entries.filter(
    (item) => item.id !== videoId && item.type !== "directory"
  ) as VideoInterface[];

  if (!entry) {
    return (
      <VideoNotFound />
    );
  }

  return (
    <>
      {(isMobile || isTablet) ? (
        <MobileView className="bg-dark text-foreground min-h-screen">
          {/* Video Display */}
          <MobilePlayer content={entry} />

          {/* Video Info & Download */}
          <div className="px-4 py-3 space-y-2">
            <div>
              <h3 className="text-xl font-semibold">{entry.name}</h3>
              <p className="text-xs text-gray-500">
                Created {formatRelativeTime(entry.modifiedAt)}
              </p>
            </div>
            <a
              href={entry.url}
              download
              className="w-fit inline-flex items-center gap-2 text-xs px-2 py-1.5 bg-primary text-foreground rounded shadow hover:opacity-90 transition"
            >
              <IoMdCloudDownload className="w-4 h-4" />
              <span>Download</span>
              {/* <span className="text-gray-400">({formatSize(entry.size)})</span> */}
            </a>
          </div>

          {/* Related Videos */}
          <div className="grid gap-4 px-4 pb-6">
            {filteredVideos.map((item) => (
              <Video key={item.id} details={item} />
            ))}
          </div>
        </MobileView>
      ) : (
        <div className="relative">
          <VideoPlayer content={entry} />

          {/* Download Button for Desktop */}
          {/* <div className="absolute top-4 right-4 z-10">
            <a
              href={entry.url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              <FiDownloadCloud className="w-5 h-5" />
              Download ({formatSize(entry.size)})
            </a>
          </div> */}
        </div>
      )}
    </>
  );
};

export default Watch;
