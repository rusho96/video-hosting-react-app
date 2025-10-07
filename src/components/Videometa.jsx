import React from 'react';

const VideoMeta = ({ title, views, timeAgo }) => (
  <div className="mt-4">
    <h1 className="text-2xl font-semibold">{title}</h1>
    <p className="text-sm text-gray-600 mt-1">{views} • {timeAgo}</p>
  </div>
);

export default VideoMeta;