
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/user" }),
  tagTypes: ["User","WatchHistory"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (formData) => ({ url: "/register", method: "POST", data: formData }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({ url: "/login", method: "POST", data: credentials }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation({
      query: () => ({ url: "/logout", method: "GET" }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query({
      query: () => ({ url: "/CurrentUser", method: "GET" }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({ url: "/updateUser", method: "PATCH", data }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: "/changePassword", method: "POST", data }),
    }),
    getChannelProfile: builder.query({
      query: (username) => ({ url: `/currentChannelProfile/${username}`, method: "GET" }),
      providesTags: ["User"],
    }),
    checkCookies: builder.query({
      query: () => ({ url: "/checkCookies", method: "GET" }),
    }),
    updateProfilePic: builder.mutation({
      query: (formData) => ({
        url: "/updateProfilePic",
        method: "PATCH",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["User"],
    }),
    updateCoverPic: builder.mutation({
      query: (formData) => ({
        url: "/updateCoverPic",
        method: "PATCH",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["User"],
    }),
    getWatchHistory: builder.query({
      query: () => ({url: "/getWatchHistory", method: "GET"}),
      providesTags: ["WatchHistory"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetChannelProfileQuery,
  useCheckCookiesQuery,
  useUpdateProfilePicMutation,
  useUpdateCoverPicMutation,
  useGetWatchHistoryQuery, 
} = userApi;
