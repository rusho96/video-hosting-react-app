import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BasicInfoForm } from "../components/forms/BasicInfoForm";
import { CoverPicForm } from "../components/forms/CoverPicForm";
import { ProfilePicForm } from "../components/forms/ProfilePicForm";
import { PasswordForm } from "../components/forms/PasswordForm";

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState("basic");

  
  const user = useSelector((state) => state.auth.userData);

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow rounded-lg p-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {["basic", "profilePic", "coverPic", "password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-3 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab === "basic"
              ? "Basic Info"
              : tab === "profilePic"
              ? "Profile Picture"
              : tab === "coverPic"
              ? "Cover Picture"
              : "Change Password"}
          </button>
        ))}
      </div>

      
      {activeTab === "basic" && <BasicInfoForm user={user} />}
      {activeTab === "profilePic" && <ProfilePicForm user={user} />}
      {activeTab === "coverPic" && <CoverPicForm user={user} />}
      {activeTab === "password" && <PasswordForm />}
    </div>
  );
}
