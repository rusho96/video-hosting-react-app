
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/video" }),
  tagTypes: ["Video","WatchHistory"],
  endpoints: (builder) => ({
    getVideoById: builder.query({
      query: (videoId) => ({ url: `/getVideoById/${videoId}`, method: "GET" }),
      providesTags: ["Video"],
    }),
    publishAVideo: builder.mutation({
      query: (formData) => ({
        url: "/publishAVideo",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Video"],
    }),
    updateVideo: builder.mutation({
      query: ({ videoId, formData }) => ({
        url: `/updateVideo/${videoId}`,
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Video"],
    }),
    deleteVideo: builder.mutation({
      query: (videoId) => ({
        url: `/deleteVideo/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"],
    }),
    togglePublishStatus: builder.mutation({
      query: (videoId) => ({
        url: `/togglePublishStatus/${videoId}`,
        method: "GET",
      }),
      invalidatesTags: ["Video"],
    }),
    removeFromWatchHistory: builder.mutation({
      query: (videoId) => ({
        url: `/removeFromWatchHistory/${videoId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Video"],
    }),
    clearWatchHistory: builder.mutation({
      query: () => ({
        url: "/clearWatchHistory",
        method: "DELETE",
      }),
      invalidatesTags: ["WatchHistory"],
    }),

    
    /*getAllVideos: builder.query({
      query: ({ userId, page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" }) => ({
        url: `/getAllVideos?userId=${userId}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`,
        method: "GET",
      }),
    }),*/

    getAllVideos: builder.query({
      query: ({ userId = "", page = 1, limit = 50, sortBy = "createdAt", sortType = "desc" } = {}) => {
        const queryParams = new URLSearchParams({
          page,
          limit,
          sortBy,
          sortType,
        });


        if (userId) queryParams.append("userId", userId);

        return {
          url: `/getAllVideos?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    getUserLikedVideos: builder.query({
      query: (userId) => ({
        url: `/getUserLikedVideos/${userId}`,
        method: "GET",
      }),
      providesTags: ["Video"],
    }),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  usePublishAVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useTogglePublishStatusMutation,
  useRemoveFromWatchHistoryMutation,
  useClearWatchHistoryMutation,
  useGetUserLikedVideosQuery,
} = videoApi;

