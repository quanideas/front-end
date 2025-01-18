"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const NotFound = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          return prev; 
        }
        return prev - 1; 
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

  useEffect(() => {
    if (countdown === 1) {
      router.push('/'); 
    }
  }, [countdown, router]);

  return (
    <div className="inset-0 bg-gray-white z-50 flex flex-col items-center justify-center text-center">
      <div className="mt-16 ml-12">
        <Image
          height={500}
          width={500}
          src="/images/common/not_found.jpg"
          alt="Logo"
          className="border p-1 border-gray-300 rounded-lg my-10"
        />
        <div>
          <div className="px-3 py-1 text-xl font-medium leading-none text-center text-black bg-red-500 rounded-full animate-pulse">
            {t('wrong_page')}
          </div>
          <div className="mt-4 text-lg">
            {t('redirect_to_home')}
          </div>
          <div className="mt-4 text-primary text-4xl">
            {countdown}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
