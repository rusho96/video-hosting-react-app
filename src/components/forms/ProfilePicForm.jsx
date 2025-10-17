import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfilePicMutation } from "../../api/apiSlice";
import { useNavigate } from "react-router-dom";



export const ProfilePicForm = function ({ user }) {
    const { register, handleSubmit } = useForm();
    const [updateProfilePic, { isLoading }] = useUpdateProfilePicMutation();
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        if (!data.profilePic?.[0]) return;
        const formData = new FormData();
        formData.append("profilePic", data.profilePic[0]);

        try {
            await updateProfilePic(formData).unwrap();
            alert("Profile picture updated!");
            navigate(`/channel/${data.userName}`)
        } catch {
            alert("Failed to update profile pic");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="file" accept="image/*" {...register("profilePic", { required: true })} />
            {user?.avatar && <img src={user.avatar} alt="Profile" className="mt-2 w-20 h-20 rounded-full" />}
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {isLoading ? "Uploading..." : "Upload"}
            </button>
        </form>
    );
}
