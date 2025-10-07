
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const likeApi = createApi({
  reducerPath: "likeApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/like" }),
  tagTypes: ["Like"],
  endpoints: (builder) => ({
    toggleVideoLike: builder.mutation({
      query: (videoId) => ({
        url: `/toggleVideoLike/${videoId}`,
        method: "GET",
      }),
      invalidatesTags: ["Like"],
    }),
    toggleCommentLike: builder.mutation({
      query: (commentId) => ({
        url: `/toggleCommentLike/${commentId}`,
        method: "GET",
      }),
      invalidatesTags: ["Like"],
    }),
    getAllLikedVideos: builder.query({
      query: () => ({
        url: `/getAllLikedVideos`,
        method: "GET",
      }),
      providesTags: ["Like"],
    }),
    getVideoLikeCount: builder.query({
      query: (videoId) => ({
        url: `/getVideoLikeCount/${videoId}`,
        method: "GET",
      }),
      providesTags: ["Like"],
    }),
    
    getVideoLikers: builder.query({
      query: (videoId) => ({
        url: `/getVideoLikers/${videoId}`,
        method: "GET",
      }),
      providesTags: ["Like"],
    }),
  }),
});

export const {
  useToggleVideoLikeMutation,
  useToggleCommentLikeMutation,
  useGetAllLikedVideosQuery,
  useGetVideoLikeCountQuery,
  useGetVideoLikersQuery, 
} = likeApi;
