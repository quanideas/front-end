"use client"
import React, { useState } from 'react';
import UserLayout from "@/components/layout/userLayout/UserLayout";
import UserProfile from "@/components/common/userProfile/UserProfile";
import UserRequest from "@/components/common/userRequest/UserRequest";
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';

const Profile = () => {

  const [showUserProfile, setShowUserProfile] = useState(true);

  const toggleToUserProfile = () => setShowUserProfile(true);
  const toggleToUserRequest = () => setShowUserProfile(false);

  return (
<UserLayout>
    <ContainerWrapper>
      <div>
        <div className="flex justify-between border-b-2 border-secondary w-[250px]">
          <button
            onClick={toggleToUserProfile}
            className={`px-2 py-1 w-1/2 rounded-t-xl ${showUserProfile ? 'bg-secondary text-white' : 'bg-gray-100 text-black'}`}
          >
            User Profile
          </button>
          <button
            onClick={toggleToUserRequest}
            className={`px-2 py-1 w-1/2 rounded-t-xl ${!showUserProfile ? 'bg-secondary text-white' : 'bg-gray-100 text-black'}`}
          >
            Help
          </button>
        </div>
        <div className="mt-8">
          {showUserProfile ? <UserProfile /> : <UserRequest />}
        </div>
      </div>
      </ContainerWrapper>
    </UserLayout>
  );
};

export default Profile;