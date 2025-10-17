import React from "react";
import { useParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { useGetPlaylistByIdQuery } from "../api/playlistApi";

const PlaylistPage = () => {
  const { playlistId } = useParams(); 
  const { data, isLoading, isError } = useGetPlaylistByIdQuery(playlistId);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading playlist...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load playlist</p>;
  }

  
  const playlist = data?.data?.[0] || {};
  const videos = playlist?.playlistVideos || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        
        <div className="w-full md:w-1/3 lg:w-1/4 relative">
          <img
            src={
              videos[0]?.thumbnail || "https://via.placeholder.com/400x225"
            }
            alt={playlist.name}
            className="w-full rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <button className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {playlist.name}
          </h1>
          <p className="text-gray-700 mb-4">{playlist.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{videos.length} videos</span>
            <span>
              Last updated{" "}
              {playlist.updatedAt
                ? new Date(playlist.updatedAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              Play All
            </button>
            <button className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
              Share
            </button>
          </div>
        </div>
      </div>

      
      <div className="space-y-4">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={video._id} className="flex items-center gap-4">
              <span className="text-gray-500 w-8">{index + 1}</span>
              <VideoCard
                horizontalLayout={true}
                videoId={video._id}
                title={video.title}
                channel={{ name: video.owner?.userName }}
                views={video.views}
                timestamp={video.createdAt}
                thumbnail={video.thumbnail}
                duration={video.duration}
                previewVideo={video.videoFile}
                className="flex-1"
                showActions={false}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No videos in this playlist</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;

