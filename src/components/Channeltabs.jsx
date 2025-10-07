import React from 'react';

const ChannelTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Videos', 'Playlists', 'About'];

  return (
    <div className="flex gap-4 border-b mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-sm font-medium ${
            activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ChannelTabs;