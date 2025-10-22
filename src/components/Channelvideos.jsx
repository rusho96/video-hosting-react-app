import React, { useState } from "react";
import VideoCard from "./VideoCard";
import { useGetAllVideosQuery, useDeleteVideoMutation } from "../api/videoApi";
import { useToggleVideoLikeMutation } from "../api/likeApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetUserPlaylistsQuery, useAddVideoToPlaylistMutation } from "../api/playlistApi";
import CreatePlaylistForm from "./forms/PlaylistForm";

const ChannelVideos = ({ userId }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData?._id);
  //console.log(currentUser)
  const { data, isLoading, error } = useGetAllVideosQuery({
    userId,
    page: 1,
    limit: 12,
  });

  const { data: playlistsData, isLoading: playlistsLoading } = useGetUserPlaylistsQuery(currentUser, {
    skip: !currentUser,
  });

  const [toggleVideoLike] = useToggleVideoLikeMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();

  
  const [playlistVideoId, setPlaylistVideoId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [activeTab, setActiveTab] = useState("existing");

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p>Failed to load videos!</p>;

  const videos = data?.data?.[0]?.videos || [];
  const playlists = playlistsData?.data || [];
  //console.log(videos)
  const handleLike = async (videoId) => {
    try {
      await toggleVideoLike(videoId).unwrap();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleEditVideo = (videoId) => {
    navigate(`/edit/${videoId}`);
  };

  const handleDelete = async (videoId) => {
    try {
      await deleteVideo(videoId).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleAddToPlaylist = (videoId) => {
    setPlaylistVideoId(videoId);
  };

  const handleAddToExistingPlaylist = async () => {
    if (!selectedPlaylist || !playlistVideoId) return;
    try {
      await addVideoToPlaylist({
        playlistId: selectedPlaylist,
        videoId: playlistVideoId,
      }).unwrap();
      alert(" Video added to playlist!");
      setPlaylistVideoId(null);
      setSelectedPlaylist("");
    } catch (err) {
      console.error("Failed to add video:", err);
      alert(" Failed to add video to playlist");
    }
  };

  return (
    <div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            videoId={video._id}
            title={video.title}
            views={video.views}
            channel={{
              name: video.owner?.username || video.owner?.fullName,
              avatar:video.owner?.profilePic,
              id: video.owner._id,
            }}
            currentUserId={currentUser}
            timestamp={video.createdAt}
            thumbnail={video.thumbnail}
            duration={video.duration}
            previewVideo={video.videoFile}
            showActions={true}
            onLike={handleLike}
            onEdit={handleEditVideo}
            onDelete={() => handleDelete(video._id)}
            onAddToPlaylist={handleAddToPlaylist}
          />
        ))}
      </div>

      
      {playlistVideoId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Save to Playlist</h2>
              <button
                onClick={() => setPlaylistVideoId(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

           
            <div className="flex border-b border-gray-100 px-6">
              <button
                onClick={() => setActiveTab("existing")}
                className={`flex-1 py-4 font-medium text-sm transition-colors ${
                  activeTab === "existing"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Your Playlists
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-4 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Create New
              </button>
            </div>

          
            <div className="p-6 max-h-96 overflow-y-auto">
              
              {activeTab === "existing" && (
                <div>
                  {playlistsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : playlists && playlists.length > 0 ? (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Choose a playlist
                      </label>
                      
                     
                      <div className="space-y-3">
                        {playlists.map((playlist) => (
                          <div
                            key={playlist._id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedPlaylist === playlist._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedPlaylist(playlist._id)}
                          >
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{playlist.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {playlist.videos?.length || 0} videos
                                {playlist.description && ` • ${playlist.description}`}
                              </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedPlaylist === playlist._id
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}>
                              {selectedPlaylist === playlist._id && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                     
                      <button
                        onClick={handleAddToExistingPlaylist}
                        disabled={!selectedPlaylist}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-6"
                      >
                        Add to Playlist
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
                      <p className="text-gray-500 mb-4">Create your first playlist to get started</p>
                      <button
                        onClick={() => setActiveTab("create")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Create Playlist
                      </button>
                    </div>
                  )}
                </div>
              )}

              
              {activeTab === "create" && (
                <div>
                  <CreatePlaylistForm
                    videoId={playlistVideoId}
                    onSuccess={() => {
                      setPlaylistVideoId(null);
                      setActiveTab("existing");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelVideos;