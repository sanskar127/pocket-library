import { useParams } from "react-router";
import { isMobile, isTablet, MobileView } from "react-device-detect";

import VideoPlayer from "../components/ui/VideoPlayer";
import MobilePlayer from "../components/ui/MobilePlayer";
import Video from "../components/common/Video";

import { formatRelativeTime } from "../utils";
import type { ItemType, VideoInterface } from "../types/types";
import VideoNotFound from "../components/common/VideoNotFound";
import { IoMdCloudDownload } from "react-icons/io";
import type { FC } from "react";

interface WatchInterface {
  data: ItemType[]
  isPending: boolean
}

const Watch: FC<WatchInterface> = ({ data }) => {
  const { videoId } = useParams<{ videoId: string }>();

  const entry = data.find(item => item.type === 'video/mp4' && item.id === videoId) as VideoInterface
  const relatedVideos = data.filter(item => item.type === 'video/mp4' && item.id !== videoId) as VideoInterface[]

  if (!entry) return <VideoNotFound />

  return (
    <>
      {(isMobile || isTablet) ? (
        <MobileView className="text-foreground min-h-screen">
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
            </a>
          </div>

          {/* Related Videos */}
          <div className="grid gap-4 px-4 pb-6">
            {relatedVideos.map((item) => (
              <Video key={item.id} details={item} />
            ))}
          </div>
        </MobileView>
      ) : (
        <div className="relative">
          <VideoPlayer content={entry} />
        </div>
      )}
    </>
  );
};

export default Watch;
