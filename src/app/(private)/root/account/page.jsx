"use client"
import React, { useState } from 'react';
import RootLayout from "@/components/layout/rootLayout/RootLayout";
import UserProfile from "@/components/common/userProfile/UserProfile";
import ContactFrom from "@/components/common/userRequest/UserRequest";
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import { useTranslation } from 'next-i18next';
const Profile = () => {
  const { t } = useTranslation("common");
  const [showUserProfile, setShowUserProfile] = useState(true);

  const toggleToUserProfile = () => setShowUserProfile(true);
  const toggleToUserRequest = () => setShowUserProfile(false);

  return (
<RootLayout>
    <ContainerWrapper>
      <div>
        <div className="flex justify-between border-b-2 border-secondary w-[250px]">
          <button
            onClick={toggleToUserProfile}
            className={`px-2 py-1 w-1/2 rounded-t-xl ${showUserProfile ? 'bg-secondary text-white' : 'bg-gray-100 text-black'}`}
          >
            {t('general.account')}
          </button>
          <button
            onClick={toggleToUserRequest}
            className={`px-2 py-1 w-1/2 rounded-t-xl ${!showUserProfile ? 'bg-secondary text-white' : 'bg-gray-100 text-black'}`}
          >
            {t('general.get_help')}
          </button>
        </div>
        <div className="mt-8">
          {showUserProfile ? <UserProfile /> : <ContactFrom />}
        </div>
      </div>
      </ContainerWrapper>
    </RootLayout>
  );
};

export default Profile;