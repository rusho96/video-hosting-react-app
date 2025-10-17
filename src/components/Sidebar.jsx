import React, { useState } from 'react';
import { useGetSubscribedToChannelsQuery } from '../api/subscriptionApi';
import { useGetUserPlaylistsQuery } from '../api/playlistApi';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiClock,
  FiUser,
  FiYoutube,
  FiMusic,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';

const Sidebar = ({ toggle }) => {
  const [expandedSections, setExpandedSections] = useState({
    subscriptions: true,
    playlists: true,
  });

  const navigate = useNavigate();

  const isAuthenticate = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;
  const username = userData?.userName;
  //console.log(userData,userId,username)

  const { data: subscribedData } = useGetSubscribedToChannelsQuery(userId, { skip: !userId });
  const { data: playlistData } = useGetUserPlaylistsQuery(userId, { skip: !userId });

  const subscriptions = subscribedData?.data || [];
  const playlists = playlistData?.data || [];

  console.log(subscriptions)

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 ease-in-out ${
        toggle ? 'w-64 items-center' : 'w-16 items-center'
      }`}
    >
      
      <div className="pr-2 space-y-1 w-full">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center ${toggle ? 'justify-start' : 'justify-center'} gap-3 w-full p-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isActive ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiHome
                className={`text-lg shrink-0 ${
                  isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              />
              {toggle && (
                <span
                  className={`whitespace-nowrap ${
                    isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Home
                </span>
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="/WatchHistory"
          end
          className={({ isActive }) =>
            `flex items-center ${toggle ? 'justify-start' : 'justify-center'} gap-3 w-full p-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isActive ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiClock
                className={`text-lg shrink-0 ${
                  isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              />
              {toggle && (
                <span
                  className={`whitespace-nowrap ${
                    isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Watch History
                </span>
              )}
            </>
          )}
        </NavLink>

        
        {isAuthenticate && (
          <button
            onClick={() => navigate(`/channel/${username}`)}
            className={`flex items-center ${
              toggle ? 'justify-start' : 'justify-center'
            } gap-3 w-full p-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <FiUser className="text-lg shrink-0 text-gray-700 dark:text-gray-300" />
            {toggle && <span className="whitespace-nowrap">My Channel</span>}
          </button>
        )}
      </div>

      
      {isAuthenticate && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-1 w-full">
          <button
            onClick={() => toggleSection('subscriptions')}
            className={`flex items-center ${
              toggle ? 'justify-between' : 'justify-center'
            } gap-8 w-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <div className="flex items-center gap-4">
              <FiYoutube className="shrink-0" />
              {toggle && <span>Subscriptions</span>}
            </div>
            {toggle &&
              (expandedSections.subscriptions ? (
                <FiChevronDown className="text-gray-500 transition-transform duration-200" />
              ) : (
                <FiChevronRight />
              ))}
          </button>

          {toggle && expandedSections.subscriptions && (
            <div className="pl-4 pr-2 py-1 space-y-1">
              {subscriptions.length > 0 ? (
                subscriptions.map((channel) => (
                  <button
                    key={channel._id}
                    onClick={() =>{
                       //console.log(channel)
                       navigate(`/channel/${channel?.subscribedToChannelDetail.userName}`)
                    }}
                    className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img
                      src={channel.subscribedToChannelDetail.profilePic || '/default-avatar.png'}
                      alt={channel.subscribedToChannelDetail.userName}
                      className="w-6 h-6 rounded-full shrink-0"
                    />
                    <span className="text-sm whitespace-nowrap">{channel.subscribedToChannelDetail.userName}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 pl-2">No subscriptions yet</p>
              )}
            </div>
          )}
        </div>
      )}

      
      {isAuthenticate && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 w-full">
          <button
            onClick={() => toggleSection('playlists')}
            className={`flex items-center ${
              toggle ? 'justify-between' : 'justify-center'
            } gap-20 w-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <div className="flex items-center gap-2">
              <FiMusic className="shrink-0" />
              {toggle && <span>Playlists</span>}
            </div>
            {toggle &&
              (expandedSections.playlists ? <FiChevronDown /> : <FiChevronRight />)}
          </button>

          {toggle && expandedSections.playlists && (
            <div className="pl-4 pr-2 py-1 space-y-1">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() => navigate(`/playlist/${playlist._id}`)}
                    className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    <span className="whitespace-nowrap">{playlist.name}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {playlist.videoCount || 0}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 pl-2">No playlists yet</p>
              )}
            </div>
          )}
        </div>
      )}

      
      {toggle && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 w-full mt-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            © 2025 YourApp
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
