import { useNavigate } from 'react-router';
import { FaRegSadTear } from 'react-icons/fa'

const VideoNotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-center min-h-screen bg-dark text-white px-4">
            <div className="text-center">
                <FaRegSadTear className="text-6xl text-primary mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2">Video Not Found</h1>
                <p className="text-lg text-gray-400 mb-6">The video you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-primary/90 hover:bg-primary text-white px-6 py-2 rounded transition"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    )
}

export default VideoNotFound
