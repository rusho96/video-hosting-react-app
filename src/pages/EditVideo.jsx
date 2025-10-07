
import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetVideoByIdQuery } from '../api/videoApi'
import VideoForm from '../components/PostForm'

export default function EditVideo() {
  const { videoId } = useParams()
  const { data: videoData, isLoading, error } = useGetVideoByIdQuery(videoId)

  if (isLoading) return <div>Loading...</div>
  if (error || !videoData?.data) return <div>Video not found</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Video</h1>
      <VideoForm video={videoData.data} />
    </div>
  )
}
