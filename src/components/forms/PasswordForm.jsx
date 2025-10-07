import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../../api/apiSlice";

export const PasswordForm = function () {
  const { register, handleSubmit } = useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      await changePassword(data).unwrap();
      alert("Password changed!");
    } catch {
      alert("Failed to change password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Current Password</label>
        <input type="password" {...register("currentPassword", { required: true })} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm">New Password</label>
        <input type="password" {...register("newPassword", { required: true })} className="w-full border rounded p-2" />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}
