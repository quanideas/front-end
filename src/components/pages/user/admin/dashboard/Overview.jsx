import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';


export default function StatsCards() {
  const { t } = useTranslation("common");
  const stats = [
    {
      id: 2,
      icon: "/icons/common/projects.svg",
      label: t('general.total_projects'),
      value: '100',
      bgColor: 'bg-green-100',
      border: 'border-green-100',
      iconColor: 'text-green-500'
    },
    {
      id: 3,
      icon: "/icons/common/users.svg",
      label: t('general.total_users'),
      value: '100',
      bgColor: 'bg-blue-100',
      border: 'border-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      id: 4,
      icon: "/icons/common/pending_contact.svg",
      label: t('general.total_storage'),
      value: '35 Gb',
      bgColor: 'bg-cyan-100',
      border: 'border-cyan-100',
      iconColor: 'text-cyan-500'
    },
  ];
  return (
    // <div className="flex space-x-4 bg-primary-gradient p-4 rounded-md">
    <div className="flex flex-col bg-gray-100 space-y-4 md:flex-row md:space-y-0  md:space-x-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`flex group flex-col items-center w-full p-4 bg-white  rounded-lg shadow-sm border-b-8 ${stat.border}`}
        >
          <div
            className={`p-3 rounded-full ${stat.bgColor}`}
          >
            <span className={`text-2xl ${stat.iconColor}`}>
            <Image
                src={stat.icon}             
                alt="Icon"                
                width={32}                
                height={32}                 
                className={stat.iconColor}  
                />
            </span>
          </div>
          <div>
            <p className="flex justify-center text-sm text-gray-500">{stat.label}</p>
            <p className="flex justify-center text-2xl font-semibold group-hover:scale-110 duration-500">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
