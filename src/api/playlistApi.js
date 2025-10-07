
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const playlistApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/playlist" }),
  tagTypes: ["Playlist"],
  endpoints: (builder) => ({
    createPlaylist: builder.mutation({
      query: ({ videoId, data }) => ({
        url: `/createPlaylist/${videoId}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Playlist"],
    }),
    getUserPlaylists: builder.query({
      query: (userId) => ({
        url: `/getPlaylist/${userId}`,
        method: "GET",
      }),
      providesTags: ["Playlist"],
    }),
    getPlaylistById: builder.query({
      query: (playlistId) => ({
        url: `/getPlaylistById/${playlistId}`,
        method: "GET",
      }),
      providesTags: ["Playlist"],
    }),
    addVideoToPlaylist: builder.mutation({
      query: ({ playlistId, videoId, data }) => ({
        url: `/addVideoToPlaylist/${playlistId}/${videoId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Playlist"],
    }),
    removeVideoFromPlaylist: builder.mutation({
      query: ({ playlistId, videoId, data }) => ({
        url: `/removeVideFromPlaylist/${playlistId}/${videoId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylist: builder.mutation({
      query: (playlistId) => ({
        url: `/deletePlaylist/${playlistId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Playlist"],
    }),
  }),
});

export const {
  useCreatePlaylistMutation,
  useGetUserPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useAddVideoToPlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
  useDeletePlaylistMutation,
} = playlistApi;
