import React from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';

const CommentSection = ({ 
  video, 
  comments = [], 
  currentUser, 
  isAddingComment = false, 
  isDeletingComment = false,
  commentsError = false,
  showComments = true,
  onAddComment,
  onDeleteComment,
  onRetry 
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await onAddComment(data.comment);
      reset(); 
    } catch (error) {
      
      console.error("Error in CommentSection:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">
        Comments • {comments.length}
      </h2>

      
      {video && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mt-3 items-center">
          <Input
            type="text"
            placeholder="Add a comment..."
            className="flex-1"
            {...register("comment", { 
              required: "Comment is required",
              minLength: {
                value: 1,
                message: "Comment cannot be empty"
              }
            })}
          />
          <button
            type="submit"
            disabled={isAddingComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {isAddingComment ? "Posting..." : "Comment"}
          </button>
        </form>
      )}

   
      {errors.comment && (
        <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
      )}

      {commentsError && (
        <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm">
          Failed to load comments. 
          <button onClick={onRetry} className="underline ml-1">Retry</button>
        </div>
      )}

     
      {showComments && (
        <div className="space-y-4 mt-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {video ? "No comments yet." : "Comments will appear here once video is loaded."}
            </p>
          ) : (
            [...comments]
              .sort((a, b) => {
                
                const isCurrentUserA = currentUser && a.owner === currentUser;
                const isCurrentUserB = currentUser && b.owner === currentUser;
                
                if (isCurrentUserA && !isCurrentUserB) return -1;
                if (!isCurrentUserA && isCurrentUserB) return 1;
                
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((c) => {
                
                const isCurrentUserComment = currentUser && c.owner === currentUser;
                
                return (
                  <div key={c._id} className="flex gap-3">
                    <img
                      src={
                        c.owner?.avatar ||
                        `https://via.placeholder.com/40?text=${
                          c.owner?.userName || "?"
                        }`
                      }
                      alt={c.owner?.userName || "Unknown"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {c.owner?.userName || "Unknown"}
                          {isCurrentUserComment && (
                            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">You</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{c.content}</p>
                      
                      {isCurrentUserComment && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          disabled={isDeletingComment}
                          className="text-xs text-red-500 mt-1 disabled:opacity-50 hover:text-red-700"
                        >
                          {isDeletingComment ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;