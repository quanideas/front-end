"use client";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useTranslation } from 'next-i18next';
import styles from './intro.module.css'; // Import CSS module

function Intro() {
  const { t } = useTranslation("public");

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="px-4 py-20 lg:px-8 lg:py-24">
        <div className="relative lg:container lg:mx-auto xl:px-16 px-4">
          <div className="gap-16 lg:flex">
            <div className="lg:w-1/2 relative overflow-hidden rounded-md bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100">
              <div className={`${styles['float-effect']} `}>
                <Image
                  alt=""
                  src="/images/homepage/phantom4_RPK4.png"
                  width={500}
                  height={300}
                  className="transform transition duration-500 xl:hover:scale-105"
                  layout="responsive"
                  priority
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:px-8 pr-2 space-y-4 md:space-y-6 xl:space-y-8 pt-8 lg:pt-0">
              <h2 className="text-2xl lg:text-3xl xl:text-5xl leading-relaxed text-center pb-3 font-semibold">
                {t('intro.title')} 
                <span className="hidden xl:inline"><br /></span>
                <span className="text-primary"> IDEAS DRONE</span>
              </h2>
              <div className="flex items-top space-x-2">
                <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="font-extralight md:text-md lg:text-xl">
                  {t('intro.para_1')}
                </p>
              </div>
              <div className="flex items-top space-x-2">
                <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="font-extralight md:text-md lg:text-xl">
                  {t('intro.para_2')}
                </p>
              </div>
              <div className="flex items-top space-x-2">
                <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="font-extralight md:text-md lg:text-xl">
                  {t('intro.para_3')}
                </p>
              </div>
              <div className="flex items-top space-x-2">
                <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="font-extralight md:text-md lg:text-xl">
                  {t('intro.para_4')}
                </p>
              </div>
              {/* <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse pt-2">
                <Link href="/aboutus">
                  <button
                    type="button"
                    className="text-white bg-primary hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-6 py-2 text-center"
                  >
                    {t('intro.find_out')}
                  </button>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
