"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { useTranslation } from 'react-i18next';

const LocaleSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState();

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const currentLang = localStorage.getItem('i18nextLng') || 'en'; // Default to 'en' if nothing is stored
    setIsEnglish(currentLang === 'en');
  }, []);

  const handleLanguageChange = () => {
    const newLang = isEnglish ? 'vi' : 'en';
    setIsEnglish(!isEnglish);
    i18n.changeLanguage(newLang);
  };

  return (
    <button className="relative flex items-center justify-center w-14 h-6 rounded-full border bg-gray-50 border-gray-00 hover:bg-gray-100" onClick={handleLanguageChange}>
      <div className={`absolute rounded-full w-5 h-5 ${isEnglish ? 'left-0' : 'right-0'} transition-all duration-300`}>
        <Image
          src={!isEnglish ? '/images/common/vietnam_flag.png' : '/images/common/uk_flag.png'}
          alt={t(!isEnglish ? 'english' : 'vietnamese')} // Use translated alt text
          layout="fill" 
          className="mx-auto"
        />
      </div>
      <span className="absolute   lg:font-semibold" style={{ bot: '1px', right: isEnglish ? '6px' : 'auto', left: isEnglish ? 'auto' : '8px' }}>
        {!isEnglish ? 'VI' : 'EN'}
      </span>
    </button>
  );
};

export default LocaleSwitcher;
