import { useLocation, useParams } from "react-router";
import VideoPlayer from "../components/ui/VideoPlayer";
import type { VideoInterface } from "../types/types";
import NotFound from "../components/common/NotFound";
import { useGetSelectedMediaQuery } from "../api/mediaApi";
import { useEffect, useState } from "react";

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { data: response } = useGetSelectedMediaQuery({ pathname, id })
  const [entry, setEntry] = useState<VideoInterface | null>(null)


  useEffect(() => {
    (async () => {
      try {
        const { data } = response
        setEntry(data)
      } catch (error) {
        console.error('Failed to fetch media:', error)
      }
    })()
  }, [response])

  if (!entry) return <NotFound itemName="Video" />

  // if (entry.type !== ".mp4" || entry.size > 314572800) {
  //   return (
  //     <>
  //     <h1>Invaild Video Type</h1>
  //     </>
  //   )
  // }

  return (
    <div className="relative">
      <VideoPlayer content={entry} />
    </div>
  );
};

export default Watch;
