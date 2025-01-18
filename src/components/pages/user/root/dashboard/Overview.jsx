import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';


const END_POINT = '/dashboard/stats';

export default function StatsCards() {
  const { t } = useTranslation("common");
  const initialStats = [
    {
      id: 1,
      icon: "/icons/common/company.svg",
      label: t('general.total_companies'),
      type: 'num_of_companies',
      value: '0',
      bgColor: 'bg-orange-100 shadow-orange-100',
      shadowColor: 'shadow-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      id: 2,
      icon: "/icons/common/projects.svg",
      label: t('general.total_projects') ,
      type: 'num_of_projects',
      value: '0',
      bgColor: 'bg-green-100',
      shadowColor: 'shadow-green-100',
      iconColor: 'text-green-500'
    },
    {
      id: 3,
      icon: "/icons/common/users.svg",
      label: t('general.total_users') ,
      type: 'num_of_users',
      value: '0',
      bgColor: 'bg-blue-100',
      shadowColor: 'shadow-blue-100',
      iconColor: 'text-blue-500'
    },
  ];
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData(END_POINT);
        const apiData = response.Data;
        const updatedStats = stats.map(stat => {
          switch (stat.type) {
            case 'num_of_companies':
              return { ...stat, value: apiData.CompanyCount };
            case 'num_of_projects':
              return { ...stat, value: apiData.ProjectCount };
            case 'num_of_users':
              return { ...stat, value: apiData.UserCount };
            default:
              return stat;
          }
        });
        setStats(updatedStats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 pb-6 md:space-x-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`flex group items-center p-4 bg-white rounded-lg shadow-md ${stat.shadowColor}`}
        >
          <div
            className={`p-3 rounded-full  ${stat.bgColor}`}
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
          <div className="ml-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-semibold group-hover:scale-110 duration-500">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
