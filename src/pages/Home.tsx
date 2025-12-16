import type { DirectoryInterface, ImageInterface, VideoInterface } from "../types/types";
import Directory from "../components/common/Directory";
import Navbar from "../components/common/Navbar";
import Video from "../components/common/Video";
import { groupByDate, groupOrder } from "../utils";
import Image from "../components/common/Image";
import useFetchMedia from "../hooks/useFetchMedia";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const { data, isLoading, updateOffset, hasMore } = useFetchMedia()
  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-foreground">
        <Navbar />
        <div className="text-center text-lg text-white">Loading...</div>
      </div>
    )
  }

  console.log(data)

  const groupedData = groupByDate(data)

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={updateOffset}
      hasMore={hasMore}
      loader={isLoading ? <div className="text-center text-lg text-white">Loading...</div> : null}
    >
      <div className="w-full min-h-screen text-foreground">
        <Navbar />
        <div className="px-4 py-2 flex flex-wrap justify-center gap-6">
          {groupOrder.map((group) =>
            groupedData[group] ? (
              <div key={group} className="w-full">
                <h2 className="text-white text-xl font-semibold mb-4">{group}</h2>
                <div className="grid custom-grid lg:flex flex-wrap gap-6">
                  {groupedData[group].map((item) => {
                    if (item.type === "directory") {
                      return <Directory key={item.id} details={item as DirectoryInterface} />;
                    }

                    if (item.type.startsWith("image/")) {
                      return <Image key={item.id} details={item as ImageInterface} />;
                    }

                    if (item.type.startsWith("video/")) {
                      return <Video key={item.id} details={item as VideoInterface} />;
                    }
                  })}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </InfiniteScroll>
  );
};

export default Home;
