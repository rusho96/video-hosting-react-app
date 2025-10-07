import React from "react";
import PlaylistCard from "./PlaylistCard";
import { useGetUserPlaylistsQuery } from "../api/playlistApi";
import { Link } from "react-router-dom";

const ChannelPlaylists = ({ userId }) => {
  const { data, isLoading, error } = useGetUserPlaylistsQuery(userId);

  if (isLoading) return <p>Loading playlists...</p>;
  if (error) return <p>Failed to load playlists!</p>;

  const playlists = data?.data || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlistId={playlist._id}
            title={playlist.title}
            videoCount={playlist.videos?.length || 0}
            thumbnail={playlist.thumbnail || "/default-thumbnail.jpg"}
            channelName={playlist.owner?.username}
            views={`${playlist.views || 0} views`}
            lastUpdated={playlist.updatedAt}
          />
        ))
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default ChannelPlaylists;
