import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

import testReducer from "./TestSlice";
import authReducer from "./AuthSlice";
import { userApi } from "../api/apiSlice";
import { videoApi } from "../api/videoApi";
import { subscriptionApi } from "../api/subscriptionApi";
import { playlistApi } from "../api/playlistApi";
import { commentApi } from "../api/commentApi";
import { likeApi } from "../api/likeApi";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};


const rootReducer = combineReducers({
  changedVal: testReducer,
  auth: authReducer,
  [userApi.reducerPath]: userApi.reducer,
  [videoApi.reducerPath]: videoApi.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  [playlistApi.reducerPath]: playlistApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [likeApi.reducerPath]: likeApi.reducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(
      userApi.middleware,
      videoApi.middleware,
      subscriptionApi.middleware,
      playlistApi.middleware,
      commentApi.middleware,
      likeApi.middleware
    ),
});


export const persistor = persistStore(store);
