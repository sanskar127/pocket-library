import type { ItemType, UseFetchMediaResult } from "./types/types";
import { Routes, Route } from "react-router";
import ServerOffline from "./components/common/ServerOffline";
import InfiniteScroll from "react-infinite-scroll-component";
import useFetchMedia from "./hooks/useFetchMedia";
import Watch from "./pages/Watch";
import Home from "./pages/Home";
import View from "./pages/View";
import DeviceNotSupported from "./components/common/DeviceNotSupported";

const App = () => {
  const { data, hasNextPage, fetchNextPage, isPending, isError } = useFetchMedia() as UseFetchMediaResult;
  const entries: ItemType[] = data?.pages.flatMap(page => page.media) ?? [];

  if (window.innerWidth < 1280) return <DeviceNotSupported />
  if (isError) return <ServerOffline />;

  return (
    <InfiniteScroll
      dataLength={entries.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={isPending ? <div className="text-center text-lg text-white">Loading...</div> : null}
    >
      <Routes>
        <Route path="*" element={<Home data={entries} isPending={isPending} />} />
        <Route path="watch/:id" element={<Watch data={entries} isPending={isPending} />} />
        <Route path="view/:id" element={<View data={entries} isPending={isPending} />} />
      </Routes>
    </InfiniteScroll>
  );
};

export default App;
