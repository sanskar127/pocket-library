import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the video metadata from the backend API
    axios.get('http://localhost:3000/api/videos')
      .then(response => {
        setVideos(response.data);
      })
      .catch(err => {
        setError('Failed to fetch videos');
      });
  }, []);

  const handleVideoClick = (videoPath) => {
    const videoUrl = `http://localhost:3000/api/video/${encodeURIComponent(videoPath)}`;
    window.open(videoUrl, '_blank');  // Open video in a new tab
  };

  const handleDownloadClick = (videoPath) => {
    const downloadUrl = `http://localhost:3000/api/video/${encodeURIComponent(videoPath)}`;
    window.location.href = downloadUrl;  // Trigger download
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <h1>Video List</h1>
      <div>
        {videos.map((video, index) => (
          <div key={index}>
            {video.directory ? (
              <h2>{video.name}</h2>
            ) : (
              <div>
                <h3>{video.name}</h3>
                <p>Size: {video.size} bytes</p>
                <p>Last Modified: {new Date(video.modified).toLocaleString()}</p>
                <img src={`http://localhost:3000/api/thumbnail/${encodeURIComponent(video.name)}`} alt={video.name} width="320" height="240" />
                <button onClick={() => handleVideoClick(video.path)}>Watch</button>
                <button onClick={() => handleDownloadClick(video.path)}>Download</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
