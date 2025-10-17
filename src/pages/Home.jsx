import React, { useState } from "react";
import { FiTrendingUp, FiClock, FiMusic } from "react-icons/fi";
import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import CategoryChip from "../components/CategoryChip";
import PlaylistCard from "../components/PlaylistCard";

import {
  useGetAllVideosQuery,
} from "../api/videoApi";
import { useGetUserPlaylistsQuery } from "../api/playlistApi";

const HomePage = () => {
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;

  
  const {
    data: trendingResponse,
    error: trendingError,
    isLoading: trendingLoading,
  } = useGetAllVideosQuery({
    page: 1,
    limit: 8,
    sortBy: "views",
    sortType: "desc",
  });
  const trendingVideos = trendingResponse?.data?.[0]?.videos || [];

  //console.log(trendingResponse)

  const {
    data: recentResponse,
    error: recentError,
    isLoading: recentLoading,
  } = useGetAllVideosQuery({
    page: 1,
    limit: 8,
    sortBy: "createdAt",
    sortType: "desc",
  });
  const recentVideos = recentResponse?.data?.[0]?.videos || [];

  
  const { data: playlistsResponse } = useGetUserPlaylistsQuery(userId);
  const playlists = playlistsResponse?.data || [];

  const categories = ["All", "Music", "Gaming", "Programming", "Cooking"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-3 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex space-x-2 w-max">
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isActive={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/*  Trending Section */}
        <SectionHeader
          icon={<FiTrendingUp className="text-red-500" />}
          title="Trending Now"
        />
        {trendingLoading ? (
          <p className="text-gray-500">Loading trending videos...</p>
        ) : trendingError ? (
          <p className="text-red-500">Failed to load recent videos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {trendingVideos.map((video) => (
              <VideoCard
                key={video._id}
                videoId={video._id}
                horizontalLayout={false}
                className="flex-1 min-w-0"
                title={video.title}
                channel={{ name: video.owner?.userName || "Unknown channel",
                           avatar:video.owner?.profilePic
                         }}
                views={`${video.views} views`}
                timestamp={new Date(video.createdAt).toLocaleDateString()}
                thumbnail={video.thumbnail || ""}
                duration={video.duration || "N/A"}
                previewVideo={video.videoFile}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/*  Recently Uploaded Section */}
        <SectionHeader
          icon={<FiClock className="text-blue-500" />}
          title="Recently Uploaded"
        />
        {recentLoading ? (
          <p className="text-gray-500">Loading recent videos...</p>
        ) : recentError ? (
          <p className="text-red-500">Failed to load recent videos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {recentVideos.map((video) => (
              <VideoCard
                key={video._id}
                videoId={video._id}
                horizontalLayout={false}
                title={video.title}
                channel={{ name: video.owner?.userName || "Unknown channel" }}
                views={`${video.views} views`}
                timestamp={new Date(video.createdAt).toLocaleDateString()}
                thumbnail={video.thumbnail || ""}
                duration={video.duration || "N/A"}
                previewVideo={video.videoFile}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/* Recommended Playlists */}
        <SectionHeader
          icon={<FiMusic className="text-purple-500" />}
          title="Recommended Playlists"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlistId={playlist._id}
              title={playlist.title}
              videoCount={playlist.videos?.length || 0}
              thumbnail={playlist.thumbnail?.url || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable Section Header Component
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">{icon}</div>
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

export default HomePage;

