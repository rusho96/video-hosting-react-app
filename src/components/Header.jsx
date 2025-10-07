
import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiUser, FiPlusSquare } from 'react-icons/fi';
import LogoutBtn from './LogOutBtn';
import SearchBox from './SearchBox';
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const { status: isAuthenticated, userData } = useSelector((state) => state.auth);

  
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
  }, []);

  const handleSearch = (query) => {
    // Update recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // Navigate to search page with query
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleVoiceSearch = () => {
    return new Promise((resolve) => {
      // Mock voice search - replace with Web Speech API later
      setTimeout(() => {
        const mockVoiceResult = 'react tutorial';
        resolve(mockVoiceResult);
      }, 1500);
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-14">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FiMenu className="text-xl" />
          </button>
          <Link to="/" className="flex items-center">
            <img
              src="/image/ch.jpg"
              alt="Logo"
              className="h-8 cursor-pointer"
            />
          </Link>
        </div>

        {/* Middle Section - Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <SearchBox
            onSearch={handleSearch}
            onVoiceSearch={handleVoiceSearch}
            recentSearches={recentSearches}
            placeholder="Search videos..."
            autoFocus={false}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => navigate('/upload')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Create Post"
            >
              <FiPlusSquare className="text-xl" />
            </button>
          )}

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiBell className="text-xl" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <FiUser />
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                {isAuthenticated ? (
                  <ul>
                    <Link
                      to={`/channel/${userData?.userName}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Your Channel
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogoutBtn />
                    </li>
                  </ul>
                ) : (
                  <>
                    <Link
                      to="/Login"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/Signup"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
