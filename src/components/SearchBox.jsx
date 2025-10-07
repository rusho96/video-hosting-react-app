
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiMic, FiX, FiClock } from 'react-icons/fi';
import Input from './Input';
import { useGetAllVideosQuery } from '../api/videoApi';

const SearchBox = ({
    onSearch,
    onVoiceSearch,
    recentSearches = [],
    placeholder = "Search videos...",
    autoFocus = false
}) => {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const inputRef = useRef(null);
    const searchBoxRef = useRef(null);

   
    const { data: videosData, isLoading: videosLoading } = useGetAllVideosQuery();

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Frontend search filtering
    useEffect(() => {
        if (query.trim() && videosData?.videos) {
            const filtered = videosData.videos.filter(video => 
                video.title?.toLowerCase().includes(query.toLowerCase()) ||
                video.description?.toLowerCase().includes(query.toLowerCase()) ||
                video.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 5); 
            
            setFilteredVideos(filtered);
        } else {
            setFilteredVideos([]);
        }
    }, [query, videosData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setShowDropdown(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        
        if (value.trim()) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (searchTerm) => {
        setQuery(searchTerm);
        onSearch(searchTerm);
        setShowDropdown(false);
    };

    const handleVideoClick = (video) => {
        setQuery(video.title);
        onSearch(video.title);
        setShowDropdown(false);
    };

    // handleVoiceSearchClick function 
    const handleVoiceSearchClick = async () => {
        if (onVoiceSearch) {
            try {
                const result = await onVoiceSearch();
                setQuery(result);
                onSearch(result);
            } catch (error) {
                console.error('Voice search failed:', error);
            }
        } else {
            // Fallback voice search implementation
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                
                recognition.start();
                
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setQuery(transcript);
                    onSearch(transcript);
                };
                
                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                };
            } else {
                alert('Speech recognition not supported in this browser');
            }
        }
    };

    const clearSearch = () => {
        setQuery('');
        setFilteredVideos([]);
        inputRef.current?.focus();
    };

    const clearRecentSearches = () => {
        localStorage.removeItem('recentSearches');
        window.dispatchEvent(new Event('storage'));
    };

    const showRecentSearches = recentSearches.length > 0;
    const showVideoSuggestions = filteredVideos.length > 0;

    return (
        <div className="relative w-full" ref={searchBoxRef}>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <div className="relative">
                        <Input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => setShowDropdown(true)}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            className="pr-10 pl-10"
                        />
                        
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FiSearch />
                        </div>

                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FiX />
                            </button>
                        )}
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (showVideoSuggestions || showRecentSearches) && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            
                            {/* Video Suggestions */}
                            {showVideoSuggestions && (
                                <div className="p-2">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                        Videos
                                    </div>
                                    {filteredVideos.map((video) => (
                                        <button
                                            key={video._id}
                                            onClick={() => handleVideoClick(video)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 rounded"
                                        >
                                            <img 
                                                src={video.thumbnail} 
                                                alt={video.title}
                                                className="w-8 h-6 object-cover rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">
                                                    {video.title}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {video.description}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Recent Searches */}
                            {showRecentSearches && (
                                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center px-2 py-1">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <FiClock className="text-sm" />
                                            Recent Searches
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(search)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 rounded"
                                        >
                                            <FiSearch className="text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{search}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center justify-center min-w-12"
                >
                    <FiSearch className="text-lg" />
                </button>

                {/* Voice Search Button */}
                {onVoiceSearch && (
                    <button
                        type="button"
                        onClick={handleVoiceSearchClick} 
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Voice search"
                    >
                        <FiMic className="text-lg" />
                    </button>
                )}
            </form>
        </div>
    );
};

export default SearchBox;