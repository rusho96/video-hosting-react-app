import React from 'react';

const ChannelHeader = ({ 
  name, 
  subscribers, 
  videosCount,
  joinDate,
  description,
  banner, 
  avatar,
  isVerified = false,
  isSubscribed = false
}) => (
  <div className="w-full bg-white rounded-xl shadow overflow-hidden">
    
    <div className="relative h-40 w-full">
      <img src={banner} alt="Banner" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
    
    
    <div className="px-6 pb-6 relative">
      
      <div className="flex justify-center -mt-16 mb-4">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
          {isVerified && (
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-3xl font-bold">{name}</h2>
          {isVerified && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <div className="flex justify-center gap-6 text-gray-600 mb-4 " >
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {subscribers} subscribers
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8h1V5h-1v2zm2 4h1V9h-1v2zm0 4h1v-2h-1v2zm-4 0h1v-2h-1v2zm-4 0h1v-2H9v2zm0-4h1V9H9v2zm0-4h1V5H9v2zm-1 8v2h1v-2H8zm-1-4v2h1V9H7zm-1-4v2h1V5H6z" clipRule="evenodd" />
            </svg>
            {videosCount} videos
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Joined {joinDate}
          </span>
        </div>
        
        
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">{description}</p>
        
        
        <div className="flex justify-center gap-4">
          <button className={`px-6 py-2 rounded-full font-medium ${isSubscribed ? 'bg-gray-200 text-black' : 'bg-red-600 text-white'}`}>
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
          <button className="px-6 py-2 rounded-full font-medium bg-gray-100 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ChannelHeader;