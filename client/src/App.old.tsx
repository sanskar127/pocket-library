import React, { useEffect, useState } from 'react';

interface Video {
  name: string;
  path: string;
  size: number;
  modified: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/videos')
      .then(res => res.json())
      .then(setVideos)
      .catch(err => console.error('Error fetching videos:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 My Video Library</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {videos.map(video => (
          <div
            key={video.path}
            className="bg-white shadow rounded overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedVideo(video)}
          >
            <img
              src={`http://localhost:3000${video.thumbnailUrl}`}
              alt={video.name}
              className="w-full aspect-video object-cover"
            />
            <div className="p-2">
              <p className="text-sm font-medium truncate">{video.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{selectedVideo.name}</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <video
              src={`http://localhost:3000${selectedVideo.videoUrl}`}
              controls
              autoPlay
              className="w-full rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
