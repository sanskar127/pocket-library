import type { ItemType, ImageInterface } from "../types/types";
import NotFound from "../components/common/NotFound";
import { useParams } from "react-router";
import { IoClose } from "react-icons/io5";
import type { FC } from "react";

interface ViewInterface {
  data: ItemType[]
  isPending: boolean
}

const View: FC<ViewInterface> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const entry = data.find(item => item.id === id) as ImageInterface

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
