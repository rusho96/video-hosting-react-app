
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/subscriptions" }),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    toggleSubscription: builder.mutation({
      query: (channelId) => ({
        url: `/toggleSubscription/${channelId}`,
        method: "GET",
      }),
      invalidatesTags: ["Subscription"],
    }),
    getChannelSubscribers: builder.query({
      query: (channelId) => ({
        url: `/getChannelSubscribers/${channelId}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    getSubscribedToChannels: builder.query({
      query: (channelId) => ({
        url: `/getSubscribedToChannels/${channelId}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useToggleSubscriptionMutation,
  useGetChannelSubscribersQuery,
  useGetSubscribedToChannelsQuery,
} = subscriptionApi;
