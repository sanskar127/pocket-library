import type { ImageInterface } from "../types/types";
import NotFound from "../components/common/NotFound";
import { useLocation, useParams } from "react-router";
import { IoClose } from "react-icons/io5";
import { useGetSelectedMediaQuery } from "../api/mediaApi";
import { useEffect, useState } from "react";

const View = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { data: response } = useGetSelectedMediaQuery({ pathname, id })
  const [entry, setEntry] = useState<ImageInterface | null>(null)


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

  if (!entry) return <NotFound itemName="Image" />

  return (
    <div className='bg-black relative flex items-center justify-center'>
      <div className="w-full absolute top-0 z-10 bg-black/40 p-4">
        <h3 className="text-xl text-white font-semibold">{entry.name}</h3>
        <button><IoClose/></button>
      </div>
      <img src={entry.url} alt={entry.name} className="max-h-screen max-w-screen" />
    </div>
  )
}

export default View
