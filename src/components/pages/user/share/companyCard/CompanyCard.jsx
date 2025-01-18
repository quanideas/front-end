import React from "react";
import { useTranslation } from 'next-i18next';
import Image from "next/image";

// Card component
const CompanyCard = ({ company, onClick }) => {
  const { t } = useTranslation("common");
  
  return (
    <div
    className={`relative border rounded-lg overflow-hidden flex flex-col justify-center items-center shadow-sm group ${company.is_disabled ? 'bg-gray-200 pointer-events-none opacity-50' : 'bg-yellow-50'}`}
    onClick={company.is_disabled ? null : onClick}
  >
      <div className="relative w-full flex justify-center items-center">
        <Image
          width={161}
          height={112}
          src="/images/common/company.png"
          alt={company.name}
          className="w-28 h-28 object-cover p-2"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg bg-opacity-100">{t('general.view')}</span>
        </div>
      </div>
      <div className="p-2 w-full h-full bg-white ">
        <div className="text-gray-800 text-sm text-left">
          {company.name}
        </div>
        <div className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {t('general.last_update')}: {new Date(company.modified_time).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

  export default CompanyCard;