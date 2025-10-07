import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChannelHeader from "../components/ChannelHeader";
import ChannelTabs from "../components/ChannelTabs";
import ChannelVideos from "../components/Channelvideos";
import ChannelPlaylists from "../components/Channelplaylist";
import ChannelAbout from "../components/ChannelAbout";

import { useGetChannelProfileQuery } from "../api/apiSlice";

const ChannelPage = () => {
  const { username } = useParams(); 
  const [activeTab, setActiveTab] = useState("Videos");

  // Channel info fetch
  const { data, isLoading, error } = useGetChannelProfileQuery(username);

  if (isLoading) return <p>Loading channel...</p>;
  if (error) return <p>Failed to load channel info!</p>;

  const channel = data?.data; 
  console.log(channel)

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <ChannelHeader
          name={channel?.name}
          subscribers={channel?.subscribersCount}
          banner={channel?.coverPic}
          avatar={channel?.profilePic}
        />

        <ChannelTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Videos" && <ChannelVideos userId={channel?._id} />}
        {activeTab === "Playlists" && <ChannelPlaylists userId={channel?._id} />}
        {activeTab === "About" && <ChannelAbout bio={channel?.bio} />}
      </div>
    </div>
  );
};

export default ChannelPage;
