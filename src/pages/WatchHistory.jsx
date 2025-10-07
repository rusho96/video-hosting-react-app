import React, { useState } from "react";
import { FiClock, FiTrash2, FiX, FiFilter, FiSearch } from "react-icons/fi";
import VideoCard from "../components/VideoCard";
import {
  useRemoveFromWatchHistoryMutation,
  useClearWatchHistoryMutation,
} from "../api/videoApi"; 
import { useGetWatchHistoryQuery } from "../api/apiSlice"; 

const WatchHistoryPage = () => {
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  
  const { data: res = {}, isLoading } = useGetWatchHistoryQuery();
  const historyItems = res.data || [];


  console.log(historyItems);

  
  const [removeFromHistory] = useRemoveFromWatchHistoryMutation();
  const [clearHistory] = useClearWatchHistoryMutation();

  
  const filteredItems = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearAll = async () => {
    await clearHistory();
    setShowClearConfirmation(false);
  };

  const handleRemove = async (videoId) => {
    await removeFromHistory(videoId);
  };

  if (isLoading) {
    return <p className="text-center py-8">Loading history...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <FiClock className="text-2xl text-red-600" />
          <h1 className="text-2xl font-bold">Watch History</h1>
        </div>

        <div className="flex gap-3">
          
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          
          <button
            onClick={() => setShowClearConfirmation(true)}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
          >
            <FiTrash2 className="text-gray-600" />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      
      {showClearConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Clear all watch history?</h3>
              <button onClick={() => setShowClearConfirmation(false)}>
                <FiX className="text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              This will remove all videos from your watch history. This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirmation(false)}
                className="px-4 py-2 border rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium">No watch history found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try a different search"
                : "Videos you watch will appear here"}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-4 p-3 hover:bg-gray-50 rounded-lg group"
            >
              <VideoCard
                horizontalLayout
                className="flex-1 min-w-0"
                videoId={item._id}   
                title={item.title}
                channel={{
                  id: item.owner?._id,
                  name: item.owner?.userName,
                  avatar: item.owner?.avatar || "/default-avatar.png" 
                }}
                views={item.views}
                timestamp={new Date(item.createdAt).toLocaleDateString()} 
                thumbnail={item.thumbnail}
                duration={`${Math.floor(item.duration)}s`} 
                previewVideo={item.videoFile} 
                currentUserId={"679f3d13c9e720e60babe6c7"} 
                onLike={(id) => console.log("Liked:", id)}
                onAddToPlaylist={(id) => console.log("Add to playlist:", id)}
                onEdit={(id) => console.log("Edit:", id)}
                onDelete={(id) => console.log("Delete:", id)}
              />


              
              <div className="flex sm:flex-col justify-between sm:justify-start gap-2">
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
                >
                  <FiX />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full">
                  <FiFilter />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchHistoryPage;
