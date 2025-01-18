"use client";
import { React, useEffect, useState } from 'react';
import Image from 'next/image';
import { getData, postData } from '@/components/utils/UserApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'next-i18next';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';

const GET_PERSONAL_INFO = "/user/get";
const UPDATE_PERSONAL_INFO = "/user/update";

const UserProfile = () => {
  const { t } = useTranslation("common");
  const [info, setInfo] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    is_admin: false,
  });
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  const toastOptions = {
    position: "top-center", // Change position as needed
    autoClose: 2000, // Set duration in milliseconds
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    const storedCompanyName = localStorage.getItem('company_name');
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }
    const fetchUserInfo = async () => {
      try {
        const data = await getData(GET_PERSONAL_INFO);
        if (data && data.Data) {
          setInfo(data.Data);
          console.log("User info fetched successfully");
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []); 

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateDataResponse = await postData(UPDATE_PERSONAL_INFO, {
        email: info.email,
        first_name: info.first_name,
        middle_name: info.middle_name,
        last_name: info.last_name
      });

      if (updateDataResponse.Meta.Status === 200) {
        toast.success(t('toast_message.update_user_success') , toastOptions);
      } else {
        toast.error(t('toast_message.update_user_fail'), toastOptions);
      }
    } catch (error) {
      toast.error(t('toast_message.error_message'), toastOptions);
      console.error("Error updating user info:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 rounded-lg">
      <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src="/images/common/default_avatar.jpg"
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-md"
          />
          <h2 className="mt-4 text-xl font-bold">
            {info.first_name + " " + info.last_name}
          </h2>
          <p className="text-gray-600 text-sm">{info.email}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">{t('general.introduction')}</h3>
          <p className="text-gray-700 mt-2 text-sm">
          {t('general.intro_description')}
          </p>
        </div>
      </div>

      <div className="md:w-2/3 bg-white p-6 ml-0 md:ml-6 rounded-lg shadow-md mt-6 md:mt-0">
        <h3 className="text-xl font-bold text-gray-600 mb-4">{t('general.user_information')}</h3>
        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.first_name')}</label>
              <input
                type="text"
                name="first_name"
                value={info.first_name}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.middle_name')}</label>
              <input
                type="text"
                name="middle_name"
                value={info.middle_name || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter middle name"
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.last_name')}</label>
              <input
                type="text"
                name="last_name"
                value={info.last_name || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter middle name"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-sm">{t('general.email')}</label>
              <input
                type="email"
                name="email"
                value={info.email || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter email ID"
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="mb-2 font-semibold text-sm">{t('general.company')}</label>
              <input
                type="text"
                name="username"
                value={companyName || ''}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex flex-col sm:col-span-3">
              <label className="mb-2 font-semibold text-sm">{t('general.account_type')}</label>
              <input
                type="text"
                value={info.is_admin ? "Admin" : "Normal User"}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" className="px-4 py-2 bg-secondary hover:bg-secondary-hover text-white rounded text-sm">
            {t('general.update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
