import Directory from "../components/common/Directory";
import Video from "../components/common/Video";
import type { DirectoryInterface, VideoInterface, ItemType } from "../types/types";
import Navbar from "../components/common/Navbar";
import useFetchMedia from "../hooks/useFetchMedia";
import ServerOffline from "../components/common/ServerOffline";

const Home = () => {
  const { data, isPending, isError } = useFetchMedia();

  if (isPending) {
    return (
      <div className="w-full min-h-screen bg-dark text-foregroundY">
        <Navbar />
        <div className="text-center text-lg text-white">Loading...</div>
      </div>
    )
  }

  if (isError) {
    return <ServerOffline />
  }

  return (
    <div className="w-full min-h-screen bg-dark text-foreground">
      <Navbar />
      <div className="grid gap-6 container px-4 py-2 custom-grid">
        {data?.map((item: ItemType) => {
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
