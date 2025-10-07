import React from 'react';
import { FiPlay, FiMusic, FiMoreVertical } from 'react-icons/fi';
import { Link } from "react-router-dom";

const PlaylistCard = ({
  playlistId,
  title,
  videoCount,
  thumbnail,
  channelName,
  views,
  lastUpdated,
  isPrivate = false,
  className = ""
}) => {
  return (
    <Link to={`/playlist/${playlistId}`}>
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${className}`}>
      {/* Thumbnail with Video Count */}
      <div className="relative aspect-video"> 
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <FiPlay className="text-xs" />
            <span>{videoCount} videos</span>
          </div>
        </div>
        {isPrivate && (
          <div className="absolute top-2 left-2 bg-gray-800/90 text-white text-xs px-2 py-1 rounded">
            Private
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          {channelName}
        </p>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{views} views</span>
          <span>Updated {lastUpdated}</span>
        </div>
      </div>

      {/* Hover Actions (Optional) */}
      <div className="px-4 pb-4 hidden group-hover:block">
        <button className="w-full py-2 bg-red-600 text-white rounded-full flex items-center justify-center gap-2">
          <FiPlay /> Play All
        </button>
      </div>
    </div>
    </Link>
  );
};

export default PlaylistCard;