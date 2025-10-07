import React from "react";
import { useForm } from "react-hook-form";
import { useCreatePlaylistMutation } from "../../api/playlistApi";

export default function CreatePlaylistForm({ videoId, onSuccess }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      privacy: "public",
    },
  });

  const [createPlaylist, { isLoading }] = useCreatePlaylistMutation();

  const onSubmit = async (data) => {
    try {
      await createPlaylist({ videoId, data }).unwrap();
      alert("Playlist created successfully!");
      reset();
      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold">Create New Playlist</h2>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="w-full border rounded p-2"
          placeholder="My Awesome Playlist"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded p-2"
          placeholder="What's this playlist about?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Privacy</label>
        <select {...register("privacy")} className="w-full border rounded p-2">
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="unlisted">Unlisted</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isLoading ? "Creating..." : "Create Playlist"}
      </button>
    </form>
  );
}
