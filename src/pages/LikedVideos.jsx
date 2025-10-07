import React from "react";
import VideoCard from "../components/VideoCard";
import { useGetUserLikedVideosQuery } from "../api/videoApi";

const LikedVideosPage = () => {
  
  const { data, isLoading, isError } = useGetUserLikedVideosQuery();

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading liked videos...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load liked videos</p>;
  }

  return (
    <div className="space-y-4">
      {data?.videos?.length > 0 ? (
        data.videos.map((video) => (
          <VideoCard
            key={video._id}
            title={video.title}
            channel={{ name: video.owner.username, avatar: video.owner.avatar }}
            views={video.views}
            timestamp={video.createdAt}
            thumbnail={video.thumbnail}
            duration={video.duration}
            showActions={true}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No liked videos found</p>
      )}
    </div>
  );
};

export default LikedVideosPage;
