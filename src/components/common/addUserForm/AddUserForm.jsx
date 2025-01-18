"use client";

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { postData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT = '/user/create';

const AddUserForm = ({ isOpen, onClose}) => {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const company_id = searchParams.get('company_id');

  const toastOptions = {
    position: "top-center", // Change position as needed
    autoClose: 2000, // Set duration in milliseconds
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    is_root: false,
    is_admin: false,
    company_id: company_id,
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (value === 'admin') {
      setFormData({
        ...formData,
        is_admin: true,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error(t('toast_message.password_not_match'), toastOptions);
      return;
    }

    const newUser = await postData(END_POINT, formData);
    if (newUser) {
      toast.success(t('toast_message.add_user_success'), toastOptions);
      setFormData({
        username: '',
        password: '',
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        is_root: false,
        is_admin: false,
        company_id: company_id,
      });
      onClose();
      setConfirmPassword('');
    } else {
      toast.error(t('toast_message.add_user_fail'), toastOptions);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[500]"></div>
      )}
      <div className={`${isOpen ? 'flex' : 'hidden'} fixed inset-0 z-[500] justify-center items-center`}>
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
              {t('general.add_user')}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-red-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">{t('general.first_name')}</label>
                  <input type="text" name="first_name" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={t('general.first_name')} value={formData.first_name} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="middle_name" className="block mb-2 text-sm font-medium text-gray-900">{t('general.middle_name')}</label>
                  <input type="text" name="middle_name" id="middle_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={t('general.middle_name')}value={formData.middle_name} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">{t('general.last_name')}</label>
                  <input type="text" name="last_name" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={t('general.last_name')} value={formData.last_name} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">{t('general.user_name')}</label>
                  <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={t('general.user_name')}value={formData.username} onChange={handleChange} required />
                </div>
                <div className="col-span-1">
                  <label htmlFor="email" className="block  mb-2 text-sm font-medium text-gray-900">{t('general.email')}</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={t('general.email')} value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">{t('general.password')}</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-2 top-[37px] text-gray-500 hover:text-gray-900 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="sm" />
                  </button>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">{t('general.confirm_password')}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900">{t('general.upload_image')}</label>
                  <div className="flex items-center space-x-4">
                    {/* <Image layout='fill' className="w-10 h-10 rounded-md" src="https://via.placeholder.com/150" alt="User avatar" /> */}
                    <input type="file" name="avatar" id="avatar" className="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">{t('general.set_role')}</label>
                  <div className="flex items-center space-x-4">
                    <div>
                      <input type="radio" name="role" id="admin" value="admin" className="form-radio text-primary-600" onChange={handleChange} />
                      <label htmlFor="admin" className="ml-2 text-sm font-medium text-gray-900">{t('general.admin')}</label>
                    </div>
                    <div>
                      <input type="radio" name="role" id="member" value="member" className="form-radio text-primary-600" onChange={handleChange} />
                      <label htmlFor="member" className="ml-2 text-sm font-medium text-gray-900">{t('general.normal_user')}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" className="text-gray-600 border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5" onClick={onClose}>{t('general.cancel')}</button>
                <button type="submit" className="text-gray-600 bg-secondary hover:bg-secondary-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5">{t('general.add_user')}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

AddUserForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddUserForm;
