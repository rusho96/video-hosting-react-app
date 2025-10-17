
import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchResults: [],
    searchQuery: '',
    recentSearches: [],
    lastSearchTime: null
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.results;
      state.searchQuery = action.payload.query;
      state.lastSearchTime = Date.now();
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addRecentSearch: (state, action) => {
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter(s => s !== action.payload)
      ].slice(0, 5);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    }
  }
});

export const { 
  setSearchResults, 
  setSearchQuery, 
  addRecentSearch, 
  clearSearchResults 
} = searchSlice.actions;

export default searchSlice.reducer;