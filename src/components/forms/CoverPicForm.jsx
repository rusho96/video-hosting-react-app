import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateCoverPicMutation } from "../../api/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const CoverPicForm = function ({ user }) {
    const userData = useSelector((state) => state.auth.userData);
    const userName = userData?.userName;
    const { register, handleSubmit } = useForm();
    const [updateCoverPic, { isLoading }] = useUpdateCoverPicMutation();
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        if (!data.coverPic?.[0]) return;
        const formData = new FormData();
        formData.append("coverPic", data.coverPic[0]);

        try {
            await updateCoverPic(formData).unwrap();
            alert("Cover picture updated!");
            navigate(`/channel/${userName}`)
        } catch {
            alert("Failed to update cover pic");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="file" accept="image/*" {...register("coverPic", { required: true })} />
            {user?.cover && (
                <img src={user.cover} alt="Cover" className="mt-2 w-full h-32 object-cover rounded" />
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-700 text-white px-4 py-2 rounded"
            >
                {isLoading ? "Uploading..." : "Upload"}
            </button>
        </form>
    );
}

