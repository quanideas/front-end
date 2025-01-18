"use client";
import { React, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';


const UserInfo = ({email, first_name, middle_name, last_name, is_admin}) => {
  const { t } = useTranslation("common");
  const [companyName, setCompanyName] = useState('');


  useEffect(() => {
    const storedCompanyName = localStorage.getItem('company_name');
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }
  }, []); 


  return (
    <div className="bg-white z-[10]  px-4 w-full lg:w-1/4 rounded-md shadow-lg md:shadow-sm shadow-yellow-200 laptop:h-[650px] desktop:h-[750px] overflow-y-auto">
        
        <div className=" bg-white p-4 rounded-lg shadow-md shadow-lime-100">
        <div className="flex flex-col items-center">
          <Image
            src="/images/common/default_avatar.jpg"
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-md"
          />
          <h2 className="mt-4 text-xl font-bold">
            {first_name + " " + last_name}
          </h2>
          <p className="text-gray-600 text-sm">{email}</p>
        </div>

      </div>
        <form>
          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex flex-col col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.first_name')}</label>
              <input
                type="text"
                name="first_name"
                value={first_name}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.middle_name')}</label>
              <input
                type="text"
                name="middle_name"
                value={middle_name}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter middle name"
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.last_name')}</label>
              <input
                type="text"
                name="last_name"
                value={last_name}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter middle name"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-sm">{t('general.email')}</label>
              <input
                type="email"
                name="email"
                value={email}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
                placeholder="Enter email ID"
              />
            </div>
            <div className="flex flex-col sm:col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.company')}</label>
              <input
                type="text"
                name="username"
                value={companyName || ''}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex flex-col sm:col-span-1">
              <label className="mb-2 font-semibold text-sm">{t('general.account_type')}</label>
              <input
                type="text"
                value={is_admin ? "Admin" : "Normal User"}
                disabled
                className="p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </form>
      </div>
  );
};

export default UserInfo;
