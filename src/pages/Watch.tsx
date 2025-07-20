import { useParams } from "react-router"
import VideoPlayer from "../components/ui/VideoPlayer"
import { isMobile, isTablet, MobileView } from "react-device-detect"
import type { ItemType, VideoInterface } from "../types/types";
import { useQueryClient } from '@tanstack/react-query';
import MobilePlayer from "../components/ui/MobilePlayer";
import Video from "../components/common/Video";
import { formatRelativeTime, formatSize } from "../utils";

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>()

  const queryClient = useQueryClient()
  const data = queryClient.getQueriesData({ queryKey: ['media'] })
  const entries = data.flatMap(([_, value]) => value) as ItemType[]
  const entry = (entries as VideoInterface[]).find(item => item.id === videoId);

  return (
    <>
      {(isMobile || isTablet) ? (
        <MobileView className="bg-dark text-foreground min-h-screen">
          {/* Video Display */}
          <MobilePlayer content={entry} />

          {/* Details */}
          <div className="px-4 py-2">
            <h3 className="text-xl font-bold sm:text-lg">{entry?.name}</h3>
            <h4 className="text-sm text-gray-600 sm:text-base">{entry?.type}</h4>
            <h4 className="text-sm text-gray-600 sm:text-base">{formatRelativeTime(entry?.modifiedAt)}</h4>
            <h4 className="text-sm text-gray-600 sm:text-base">{formatSize(entry?.size)}</h4>
          </div>


          <div className="grid gap-6 container px-4 py-2 custom-grid">
            {entries?.map((item: ItemType) => {
              if ((item.id !== videoId) && (item.type !== 'directory')) {
                return <Video key={item.id} details={item as VideoInterface} />
              }
            })}
          </div>
        </MobileView>
      ) :
        <VideoPlayer content={entry} />
      }
    </>
  )
}

export default Watch
