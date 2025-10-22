import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
//import RTE from "./RTE";
import Input from "./Input";
import Select from "./Select";
import {
  usePublishAVideoMutation,
  useUpdateVideoMutation,
} from "../api/videoApi";

export default function VideoForm({ video }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  console.log(`userdata ${userData}`)
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
      category: video?.category || "General",
      visibility: video?.visibility || "Public",
    },
  });

  const [publishAVideo, { isLoading: isPublishing }] = usePublishAVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  const categoryOptions = [
    "General", "Education", "Entertainment", "Gaming",
    "Music", "Technology", "Sports", "News", "Travel"
  ];

  const visibilityOptions = ["Public", "Private", "Unlisted"];

  const submit = async (data) => {
    //console.log("🔥 Form Data:", data);
    console.log(`clicked`);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("visibility", data.visibility);

    try {
      if (!video) {
         
        if (data.videoFile && data.videoFile.length > 0)
          formData.append("videoFile", data.videoFile[0]);
        if (data.thumbnail && data.thumbnail.length > 0)
          formData.append("thumbnail", data.thumbnail[0]);

        const res = await publishAVideo(formData).unwrap();
        if (res?.data?._id) {
          navigate(`/watchVideo/${res.data._id}`);
        }
      } else {
         
        if (data.thumbnail?.[0])
          formData.append("thumbnail", data.thumbnail[0]);

        const res = await updateVideo({ videoId: video._id, formData }).unwrap();
        if (res?.data?._id) {
          navigate(`/watchVideo/${res.data._id}`);
        }
      }
    } catch (error) {
      console.error("Video upload/update failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {video ? "Edit Video" : "Upload New Video"}
      </h2>

      <form onSubmit={handleSubmit(submit)} className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 space-y-4">
          {/* Title */}
          <Input
            label="Title"
            placeholder="Enter video title"
            {...register("title", { required: true })}
          />

          {/* Description */}
          {/*<div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RTE
                  name={field.name}
                  control={control}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>*/}


          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description" , {required:true})}
              placeholder="Enter video description"
              className="w-full border rounded p-2 text-sm"
              rows={6}
            ></textarea>
          </div>

          {/* Category & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              {...register("category", { required: true })}
            />
            <Select
              label="Visibility"
              options={visibilityOptions}
              {...register("visibility", { required: true })}
            />
          </div>
        </div>

        {/* Right column: Video file + Thumbnail */}
        <div className="w-full md:w-1/3 space-y-4">
          {!video && (
            <Input
              label="Video File"
              type="file"
              accept="video/mp4,video/mkv,video/webm"
              onChange={(e) => setValue("videoFile", e.target.files)}
            />
          )}

          <Input
            label="Thumbnail"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={(e) => setValue("thumbnail", e.target.files)}
          />

          {video && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Thumbnail</p>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="rounded-lg w-full h-auto max-h-48 object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg w-full"
            disabled={isPublishing || isUpdating}
          >
            {video ? "Update Video" : "Publish Video"}
          </button>
        </div>
      </form>
    </div>
  );
}

