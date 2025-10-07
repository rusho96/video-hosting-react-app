import { useState } from "react"

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChannelPage from "./pages/Channelpage";
import CreateVideo from "./pages/CreateVideo";
import EditVideo from "./pages/EditVideo";
import AuthLayout from "./components/AuthLayout"
import Signup from "./pages/Signup";
import Layout from './components/Layout';
import WatchVideoPage from "./pages/WatchVideo"
import LikedVideosPage from "./pages/LikedVideos"
import WatchHistoryPage from "./pages/WatchHistory"
import PlaylistPage from "./pages/PlaylistPage"
import Home from "./pages/Home"
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import './App.css'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:[  
      {
            path: "",
            element: <Home />,
      },
      {
           path: "WatchHistory",
           element:(
            <AuthLayout authentication={true}>
              <WatchHistoryPage />
            </AuthLayout>
            ) ,
      },
      {
           path: "WatchVideo/:videoId",
           element:(
            <AuthLayout authentication={true}>
              <WatchVideoPage />
            </AuthLayout>
            ) ,
      },
      {
           path: "upload",
           element:(
            <AuthLayout authentication={true}>
              <CreateVideo/>
            </AuthLayout>
            ) ,
      },
      {
           path: "edit/:videoId",
           element:(
            <AuthLayout authentication={true}>
              <EditVideo/>
            </AuthLayout>
            ) ,
      },
      {
           path:"settings",
           element:(
            <AuthLayout authentication={true}>
              <ProfileSettingsPage/>
            </AuthLayout>
            ) ,
      },
      
      {    
           path:"playlist/:playlistId",
           element:(
            <AuthLayout authentication={true}>
              <PlaylistPage/>
            </AuthLayout>
            ) ,
      },
      {
           path: "channel/:username",
           element:(
            <AuthLayout authentication={true}>
              <ChannelPage/>
            </AuthLayout>
            ) ,
      },
      
      {
           path: "Signup",
           element:(
            <AuthLayout authentication={false}>
              <Signup/>
            </AuthLayout>
           )
      },
      {     path: "Login",
           element:(
            <AuthLayout authentication={false}>
              <Login/>
            </AuthLayout>
            )
      },
      {     path: "search",
           element:(
            <AuthLayout authentication={false}>
              <SearchResults/>
            </AuthLayout>
            )
      }
     ]
  }

]);

function App() {
  let colorObj={
    "red":"black",
    "black":"red"
  }
  let [color,setColor] = useState("red")

  let changeColor=function(){
    setColor(colorObj[color])
    console.log(colorObj[color])
  }

  const likedVideos = [
    { 
      title: 'Dark',
      channel: 'RT-Videos',
      views: '5k',
      duration: "08:43",
      videoSrc: '/videos/Dark Season 3 _ Official Trailer _ Netflix.mp4',
      thumbnail:'/image/dark-season-3 trailer.jpg',
      channelImage:'/image/ch.jpg',
    },
    {
      title: 'Dark',
      channel: 'RT-Videos',
      views: '5k',
      duration: "08:43",
      videoSrc: '/videos/Dark Season 3 _ Official Trailer _ Netflix.mp4',
      thumbnail:'/image/dark-season-3 trailer.jpg',
      channelImage:'/image/ch.jpg',
    },
    
    {
      title: 'Dark',
      channel: 'RT-Videos',
      views: '5k',
      duration: "08:43",
      videoSrc: '/videos/Dark Season 3 _ Official Trailer _ Netflix.mp4',
      thumbnail:'/image/dark-season-3 trailer.jpg',
      channelImage:'/image/ch.jpg',
    },
    {
      title: 'Dark',
      channel: 'RT-Videos',
      views: '5k',
      duration: "08:43",
      videoSrc: '/videos/Dark Season 3 _ Official Trailer _ Netflix.mp4',
      thumbnail:'/image/dark-season-3 trailer.jpg',
      channelImage:'/image/ch.jpg',
    },
    {
      title: 'Dark',
      channel: 'RT-Videos',
      views: '5k',
      duration: "08:43",
      videoSrc: '/videos/Dark Season 3 _ Official Trailer _ Netflix.mp4',
      thumbnail:'/image/dark-season-3 trailer.jpg',
      channelImage:'/image/ch.jpg',
    },
]
  

  
  return <RouterProvider router={router} />
}

export default App
