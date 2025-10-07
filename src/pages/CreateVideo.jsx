
import React from 'react'
import VideoForm from '../components/PostForm'

export default function CreateVideo() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Upload New Video</h1>
      <VideoForm />
    </div>
  )
}