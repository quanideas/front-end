"use client"
import React, { useState, Suspense, lazy } from 'react';
import AdminLayout from "@/components/layout/adminLayout/AdminLayout";
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';

// Lazy load the components
const UserProfile = lazy(() => import("@/components/common/userProfile/UserProfile"));
const UserRequest = lazy(() => import("@/components/common/userRequest/UserRequest"));

const Profile = () => {
  const [showUserProfile, setShowUserProfile] = useState(true);

  const toggleToUserProfile = () => setShowUserProfile(true);
  const toggleToUserRequest = () => setShowUserProfile(false);

  return (
    <AdminLayout>
      <ContainerWrapper>
        <div>
          <div className="flex justify-between border-b-2 border-secondary w-[250px]">
            <button
              onClick={toggleToUserProfile}
              className={`px-2 py-1 w-1/2 rounded-t-xl ${showUserProfile ? 'bg-secondary text-white' : 'bg-gray-100 text-black'}`}
            >
              Tài khoản
            </button>
            <button
              onClick={toggleToUserRequest}
              className={`px-2 py-1 w-1/2 rounded-t-xl ${!showUserProfile ? 'bg-secondary text-white' : 'bg-gray-100 text-black'}`}
            >
              Trợ giúp
            </button>
          </div>
          <div className="mt-8">
            <Suspense fallback={<div>Loading...</div>}>
              {showUserProfile ? <UserProfile /> : <UserRequest />}
            </Suspense>
          </div>
        </div>
      </ContainerWrapper>
    </AdminLayout>
  );
};

export default Profile;
