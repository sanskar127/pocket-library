import { useParams } from "react-router-dom"
import VideoPlayer from "../components/ui/Player/VideoPlayer"

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>()

  return (
    <div className="bg-black w-full h-screen">
        <VideoPlayer id={videoId} />
    </div>
  )
}

export default Watch
