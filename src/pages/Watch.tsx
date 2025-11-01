import { useParams } from "react-router";

import VideoPlayer from "../components/ui/VideoPlayer";
import type { ItemType, VideoInterface } from "../types/types";
import NotFound from "../components/common/NotFound";
import type { FC } from "react";

interface WatchInterface {
  data: ItemType[]
  isPending: boolean
}

const Watch: FC<WatchInterface> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const entry = data.find(item => item.id === id) as VideoInterface

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
