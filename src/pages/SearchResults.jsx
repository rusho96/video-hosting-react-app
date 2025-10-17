

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAllVideosQuery } from '../api/videoApi';
import VideoCard from '../components/VideoCard';
import { useSelector } from 'react-redux';

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);

  const { data: videosData, isLoading } = useGetAllVideosQuery();
  const { userData } = useSelector((state) => state.auth);
  const { searchResults, searchQuery: reduxSearchQuery } = useSelector((state) => state.search);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchQuery(query);

    console.log('🔍 DEBUG - URL Query:', query);
    console.log('🔍 DEBUG - Redux Query:', reduxSearchQuery);
    console.log('🔍 DEBUG - Redux Results:', searchResults.length);

    
    if (searchResults.length > 0 && reduxSearchQuery === query) {
      console.log('✅ Using Redux search results');
      setFilteredVideos(searchResults);
      return;
    }

    

    
    if (videosData?.data?.[0]?.videos) {
      let filtered = videosData.data[0].videos;
      if (query.trim()) {
        filtered = filtered.filter(video =>
          video.title?.toLowerCase().includes(query.toLowerCase()) ||
          (video.description || '')?.toLowerCase().includes(query.toLowerCase()) ||
          video.owner?.userName?.toLowerCase().includes(query.toLowerCase())
          
        );
      }
      
      setFilteredVideos(filtered);

      
      dispatch(setSearchResults({
        results: filtered,
        query: query
      }));
    }
  }, [location.search, videosData, searchResults, reduxSearchQuery]);

  const handleLike = (videoId) => console.log('Like video:', videoId);
  const handleAddToPlaylist = (videoId) => console.log('Add to playlist:', videoId);
  const handleEditVideo = (videoId) => console.log('Edit video:', videoId);
  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      console.log('Delete video:', videoId);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views?.toString() || '0';
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-6">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          No search query provided.
        </h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results for: "{searchQuery}"
        </h1>
        {filteredVideos.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-6">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            No videos found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try different search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video._id}
              videoId={video._id}
              title={video.title}
              channel={{
                id: video.owner?._id,
                name: video.owner?.userName || 'Unknown Channel',
                avatar: video.owner?.profilePic || '/default-avatar.png'
              }}
              views={formatViews(video.views)}
              timestamp={formatTimestamp(video.createdAt)}
              thumbnail={video.thumbnail}
              previewVideo={video.videoFile} 
              duration={formatDuration(video.duration)}
              currentUserId={userData?._id}
              showChannelAvatar={true}
              showActions={false}
              horizontalLayout={false}
              className="hover:scale-105 transition-transform duration-200"
              optionsMenuClassName="min-w-[180px]"
              onLike={handleLike}
              onAddToPlaylist={handleAddToPlaylist}
              onEdit={handleEditVideo}
              onDelete={handleDeleteVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
