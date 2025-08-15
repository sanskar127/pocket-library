import type { DirectoryInterface, ItemType, VideoInterface } from "../types/types";
import Directory from "../components/common/Directory";
import Navbar from "../components/common/Navbar";
import Video from "../components/common/Video";
import type { FC } from "react";

interface HomeInterface {
  data: ItemType[]
  isPending: boolean
}

const Home: FC<HomeInterface> = ({ data, isPending }) => {
  if (isPending) {
    return (
      <div className="w-full min-h-screen text-foreground">
        <Navbar />
        <div className="text-center text-lg text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen text-foreground">
      <Navbar />
      <div className="m-auto grid gap-6 container px-4 py-2 custom-grid">
        {data.map((item: ItemType) => {
          if (item.type === 'directory')
            return <Directory key={item.id} details={item as DirectoryInterface} />
          else
            return <Video key={item.id} details={item as VideoInterface} />
        })}
      </div>
    </div>
  );
};

export default Home;
