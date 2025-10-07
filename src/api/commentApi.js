
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/comment" }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getVideoComment: builder.query({
      query: (videoId) => ({
        url: `/getVideoComment/${videoId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    addComment: builder.mutation({
      query: ({ videoId, data }) => ({
        url: `/addComment/${videoId}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Comment"],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `/updateComment/${commentId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Comment"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/deleteComment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetVideoCommentQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
