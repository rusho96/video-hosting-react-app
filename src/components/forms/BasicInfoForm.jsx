import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../../api/apiSlice";

export const BasicInfoForm = function ({ user }) {
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm({
        defaultValues: {
            userName: user?.userName || "",
            fullName: user?.fullName || "",
            bio: user?.bio || "",
        },
    });
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const onSubmit = async (data) => {

        console.log(data)
        try {
            await updateUser(data).unwrap();
            alert("Profile updated!");
            navigate(`/channel/${data.userName}`)

        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm">Username</label>
                <input {...register("userName", { required: true })} className="w-full border rounded p-2" />
            </div>
            <div>
                <label className="block text-sm">Full Name</label>
                <input {...register("fullName")} className="w-full border rounded p-2" />
            </div>
            <div>
                <label className="block text-sm">Bio</label>
                <textarea {...register("bio")} className="w-full border rounded p-2" />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {isLoading ? "Updating..." : "Save Changes"}
            </button>
        </form>
    );
}

