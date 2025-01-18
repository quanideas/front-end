import React from 'react';
import { MapPinIcon as LocationMarkerIcon, PhoneIcon, EnvelopeIcon as MailIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';

const ContactForm = () => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg">
      <div className="md:w-1/3 bg-secondary-light text-gray-600 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">{t('general.contact_us')}</h2>
        <p className="mb-4 text-sm">{t('general.we_always_here_to_help')}</p>
        <div className="mb-4">
          <p className="flex items-center mb-2 text-sm">
            <LocationMarkerIcon className="mr-2 h-6 w-10" />
            {t('general.address')}: {t('general.ideasdrone_address')}
          </p>
          <p className="flex items-center mb-2 text-sm">
            <PhoneIcon className="mr-2 h-6 w-6" />
            {t('general.phone_number')}: + 00 000 000 000
          </p>
          <p className="flex items-center mb-2 text-sm">
            <MailIcon className="mr-2 h-6 w-6" />
            {t('general.address')}: phungngocanhbk@gmail.com
          </p>
        </div>
      </div>
      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0 md:ml-6">
        <h3 className="text-xl font-bold mb-4">{t('general.contact_now')}</h3>
        <form>
          <div className="flex flex-col mt-4">
            <label className="mb-2 font-semibold text-sm">{t('general.title')}</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded text-sm"
              placeholder="Subject"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="mb-2 font-semibold text-sm">{t('general.content')}</label>
            <textarea
              className="p-2 border border-gray-300 rounded h-24 text-sm"
              placeholder="Message"
            />
          </div>
          <div className="flex justify-start mt-6">
            <button type="submit" className="px-4 py-2 bg-secondary hover:bg-secondary-hover text-black rounded text-sm">
            {t('general.send_message')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
