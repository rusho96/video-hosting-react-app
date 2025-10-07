import React, { useState, useRef, useEffect } from "react";
import { FiPlay, FiThumbsUp, FiMoreVertical, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const VideoCard = ({
  videoId,
  title,
  channel,
  views,
  timestamp,
  thumbnail,
  previewVideo,
  duration,
  currentUserId, 
  showChannelAvatar = true,
  showActions = true,
  horizontalLayout = false,
  className = "",
  onLike,
  onAddToPlaylist,
  onEdit,
  onDelete,
  optionsMenuClassName = "" 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (previewVideo) {
        setShowPreview(true);
        setIsVideoLoading(true);

        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch((e) => {
            console.log("Auto-play prevented:", e);
            setShowPreview(false);
            setIsVideoLoading(false);
          });
        }
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    setShowPreview(false);
    setIsVideoLoading(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.load();
    }

   
  };

  const handleCardClick = () => {
    navigate(`/watchVideo/${videoId}`);
  };

  
  const handleMenuToggle = (e) => {
    e.stopPropagation(); 
    setMenuOpen(!menuOpen);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    
    if (action === 'like' && onLike) onLike(videoId);
    if (action === 'playlist' && onAddToPlaylist) onAddToPlaylist(videoId);
    if (action === 'edit' && onEdit) onEdit(videoId);
    if (action === 'delete' && onDelete) onDelete(videoId);
  };

  const isOwner = currentUserId && channel?.id === currentUserId;

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  return (
    <div
      className={`group cursor-pointer relative ${
        horizontalLayout ? "flex gap-4" : "w-full"
      } bg-white dark:bg-gray-800 rounded-lg overflow-visible shadow hover:shadow-lg transition-shadow ${className}`} 
      
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      <div className={`relative ${horizontalLayout ? "w-40 flex-shrink-0" : "w-full"}`}>
        {(!showPreview || isVideoLoading) && (
          <img
            src={thumbnail}
            alt={title}
            className={`${horizontalLayout ? "h-24" : "h-48"} w-full object-cover`}
            loading="lazy"
          />
        )}

        {showPreview && previewVideo && (
          <video
            ref={videoRef}
            className={`${horizontalLayout ? "h-24" : "h-48"} w-full object-cover`}
            muted
            loop
            playsInline
            onCanPlay={() => setIsVideoLoading(false)}
            onError={() => {
              setShowPreview(false);
              setIsVideoLoading(false);
            }}
          >
            <source src={previewVideo} type="video/mp4" />
          </video>
        )}

        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
          {duration}
        </span>

        <div className="absolute inset-0 m-auto flex items-center justify-center w-6 h-6 bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <FiPlay className="text-white text-xl" />
        </div>
      </div>

      
      <div className={`p-3 flex-1`}>
        <div className="flex gap-3">
          {showChannelAvatar && !horizontalLayout && (
            <img
              src={channel?.avatar}
              alt={channel?.name}
              className="w-10 h-10 rounded-full mt-1 flex-shrink-0"
              loading="lazy"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/channel/${channel?.name}`);
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm md:text-base line-clamp-2 break-words">
              {title}
            </h3>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-1">
              {showChannelAvatar && horizontalLayout && (
                <span
                  className="mr-2 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/channel/${channel.name}`);
                  }}
                >
                  {channel?.name}
                </span>
              )}
              {!horizontalLayout && (
                <span
                  className="cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/channel/${channel.name}`);
                  }}
                >
                  {channel?.name}
                </span>
              )}
              <span>•</span>
              <span>{views} views</span>
              <span>•</span>
              <span>{timestamp}</span>
            </div>
          </div>

          
          {showActions && (
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={handleMenuToggle}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiMoreVertical className="text-lg" />
              </button>

              
              {menuOpen && (
                <div 
                  className={`absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 min-w-[150px] z-50 border border-gray-200 dark:border-gray-700 ${optionsMenuClassName}`}
                >
                  
                  <button
                    onClick={(e) => handleActionClick(e, 'like')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <FiThumbsUp className="text-gray-600 dark:text-gray-300" />
                    <span>Like</span>
                  </button>

                  
                  <button
                    onClick={(e) => handleActionClick(e, 'playlist')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <FiPlus className="text-gray-600 dark:text-gray-300" />
                    <span>Add to Playlist</span>
                  </button>

                  
                  {isOwner && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                      
                      <button
                        onClick={(e) => handleActionClick(e, 'edit')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                      >
                        <FiEdit2 className="text-gray-600 dark:text-gray-300" />
                        <span>Edit Video</span>
                      </button>

                      <button
                        onClick={(e) => handleActionClick(e, 'delete')}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 flex items-center gap-3"
                      >
                        <FiTrash2 className="text-red-600 dark:text-red-400" />
                        <span>Delete Video</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
