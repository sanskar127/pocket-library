import type { ItemType, UseFetchMediaResult } from "./types/types";
import { Routes, Route } from "react-router"
import ServerOffline from "./components/common/ServerOffline";
import InfiniteScroll from "react-infinite-scroll-component";
import useFetchMedia from "./hooks/useFetchMedia";
import Watch from "./pages/Watch"
import Home from "./pages/Home"

const App = () => {
  const { data, hasNextPage, fetchNextPage, isPending, isError } = useFetchMedia() as UseFetchMediaResult
  const entries: ItemType[] = data?.pages.flatMap(page => page.media) ?? []

  if (isError) return <ServerOffline />

  return (

    <InfiniteScroll
      dataLength={entries.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<div className="text-center text-lg text-white">Loading...</div>}
    >
      <Routes>
        <Route path='*' element={<Home data={entries} isPending={isPending} />} />
        <Route path='watch/:videoId' element={<Watch data={entries} isPending={isPending} />} />
      </Routes>
    </InfiniteScroll>
  )
}

export default App
