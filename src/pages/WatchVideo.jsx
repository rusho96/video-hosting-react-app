import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiShare2,
  FiChevronDown,
} from "react-icons/fi";
import VideoCard from "../components/VideoCard";
import CommentSection from "../components/CommentSection"; // নতুন কম্পোনেন্ট

import { useGetVideoByIdQuery, useGetAllVideosQuery } from "../api/videoApi";
import {
  useToggleVideoLikeMutation,
  useGetVideoLikeCountQuery,
  useGetVideoLikersQuery
} from "../api/likeApi";
import {
  useGetVideoCommentQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "../api/commentApi";
import {
  useToggleSubscriptionMutation,
  useGetChannelSubscribersQuery,
} from "../api/subscriptionApi";

const WatchVideoPage = () => {
  const { videoId } = useParams();
  
 
 const currentUser = useSelector(state=>state.auth.userData?._id)
 
  
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState([]);
  const videoRef = useRef(null);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);

  
  const { data: videoResponse, isLoading, error: videoError } = useGetVideoByIdQuery(videoId);
  const video = videoResponse?.data;

  
  const { data: allVideosResponse, error: allVideosError } = useGetAllVideosQuery({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortType: "desc",
  });
  const allVideos = allVideosResponse?.data?.[0]?.videos || [];

  
  const [toggleVideoLike] = useToggleVideoLikeMutation();
  const { data: likeCountResponse } = useGetVideoLikeCountQuery(videoId);
  const {data: videoLikers, error: likersError} =  useGetVideoLikersQuery(videoId)
  

  
  const { data: commentsResponse, error: commentsError } = useGetVideoCommentQuery(videoId);
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  //console.log(commentsResponse)

  
  const [toggleSubscription, { isLoading: isTogglingSubscription }] = useToggleSubscriptionMutation();
  const { data: subscribersResponse, error: subscribersError } = useGetChannelSubscribersQuery(
    video?.owner
  );
  const subscribers = subscribersResponse?.data || [];
  useEffect(() => {
    
    if (subscribers?.length > 0 && currentUser) {
      const found = subscribers.some((sub) => sub.subscriberId === currentUser);
      setIsSubscribed(found);
    }
     else {
        setIsSubscribed(false); 
    }
  }, [subscribersResponse, currentUser]);
  
  useEffect(() => {
    const likersArray = videoLikers?.data || []; 
    if (likersArray?.length > 0 && currentUser) {
      const found = likersArray.some((item) => item.user.userId === currentUser);
      setIsLiked(found);
    }
  }, [videoLikers, currentUser]);

  
  
  const handleToggleSubscription = async () => {
    try {
      const res = await toggleSubscription(video?.owner).unwrap();
      console.log("Subscription toggled:", res);
      setIsSubscribed(res.data);
    } catch (err) {
      console.error("Failed to toggle subscription:", err);
    }
  };

 

  useEffect(() => { 
    if (videoId !== currentVideoId) { 
      setCurrentVideoId(videoId); 
    } 
  }, [videoId, currentVideoId]);

  const handleToggleLike = async () => {
    try {
      
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);

      
      await toggleVideoLike(videoId).unwrap();
    } catch (err) {
      console.error("Failed to toggle like:", err);
      
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      setIsLiked((prev) => !prev);
    }
  };

  
  const handleAddComment = async (commentText) => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    try {
      const result = await addComment({
        videoId,
        data: { content: trimmed },
      }).unwrap();
      setComments((prev) => [...prev, result.data]);
      return true; 
    } catch (err) {
      console.error("Failed to add comment:", err);
      throw new Error("Failed to add comment. Try again.");
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id).unwrap();
      setComments((prev) => prev.filter((c) => c._id !== id));
      return true; 
    } catch (err) {
      console.error("Failed to delete comment:", err);
      throw new Error("Failed to delete comment.");
    }
  };

  const handleRetryComments = () => {
    window.location.reload();
  };

  
  useEffect(() => {
    if (commentsResponse?.data) {
      setComments(commentsResponse.data);
    } else {
      setComments([]);
    }
  }, [commentsResponse, videoId]);

  
  
  useEffect(() => {
    if (likeCountResponse?.data?.likeCount !== undefined) {
      setLikeCount(likeCountResponse.data.likeCount);
    }
  }, [likeCountResponse]);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, [videoId]);

  
  useEffect(() => {
    if (video && videoRef.current) {
      
      videoRef.current.src = video.videoFile;
      videoRef.current.load();
      
      
      videoRef.current.play().catch(e => {
        console.log("Auto-play prevented, user will manually play:", e);
      });
    }
  }, [video, videoId]);


  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  
  if (videoError) return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-center">
      <p className="text-red-500">Video not found or failed to load.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div
      key={videoId}
      className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6"
    >
      
      <div className="flex-1">
        
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          {video ? (
            <video 
              ref={videoRef}
              controls 
              className="w-full h-full"
              key={videoId}
              preload="auto"
            >
              <source src={video.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <p className="text-white">Video not available</p>
            </div>
          )}
        </div>

        
        {video && (
          <div className="mt-4">
            <h1 className="text-xl font-bold">{video.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{new Date(video.createdAt).toDateString()}</span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${isLiked
                    ? "bg-blue-100 text-blue-600 border border-blue-400"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <FiThumbsUp /> {likeCount}
              </button>

            </div>

            
            <div className="flex items-center justify-between mt-4 py-3 border-t border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={
                    video.owner?.avatar ||
                    `https://via.placeholder.com/40?text=U`
                  }
                  alt={video.owner?.name || "Unknown"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{video.owner?.name || "Unknown"}</h3>
                  <p className="text-sm text-gray-600">{subscribers?.length} subscribers</p>
                </div>
              </div>
              <button
                onClick={handleToggleSubscription}
                disabled={isTogglingSubscription}
                className={`px-4 py-2 rounded-full font-medium 
    ${isSubscribed ? "bg-gray-400" : "bg-red-600"} 
    text-red disabled:opacity-50`}
              >
                {isTogglingSubscription
                  ? "Processing..."
                  : isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"}
              </button>

            </div>

            
            <div
              className={`mt-3 bg-gray-50 rounded-lg p-3 ${
                showDescription ? "" : "max-h-20 overflow-hidden"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <span>Description</span>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-blue-600"
                >
                  <FiChevronDown
                    className={`transition-transform ${
                      showDescription ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="whitespace-pre-line text-sm">{video.description}</p>
            </div>
          </div>
        )}

        
        <CommentSection
          video={video}
          comments={comments}
          currentUser={currentUser} 
          isAddingComment={isAddingComment}
          isDeletingComment={isDeletingComment}
          commentsError={!!commentsError}
          showComments={showComments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onRetry={handleRetryComments}
        />
      </div>

      
      <div className="lg:w-80 space-y-4">
        <h3 className="font-medium">Recommended</h3>
        {allVideosError ? (
          <p className="text-red-500 text-sm">Failed to load recommendations</p>
        ) : allVideos.filter((v) => v._id !== videoId).length === 0 ? (
          <p className="text-gray-500 text-sm">No recommendations available</p>
        ) : (
          allVideos
            .filter((v) => v._id !== videoId)
            .map((v) => (
              <VideoCard
                key={v._id}
                horizontalLayout
                title={v.title}
                channel={{ name: v.owner?.name || "Unknown" }}
                views={v.views}
                thumbnail={v.thumbnail}
                previewVideo={v.videoFile}
                duration={v.duration}
                videoId={v._id}
                className="!shadow-none hover:!bg-gray-50"
                showChannelAvatar={false}
                onClick={() => {
                  setCurrentVideoId(v._id);
                }}
                showActions={false}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default WatchVideoPage;