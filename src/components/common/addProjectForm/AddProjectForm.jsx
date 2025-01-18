"use client";

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { postData } from '@/components/utils/ProjectApi';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const END_POINT = '/project/create';

/**
 * AddProjectForm component to handle project addition form functionality.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Indicates if the form modal is open.
 * @param {Function} props.onClose - Function to close the modal.
 */
const AddProjectForm = ({ isOpen, onClose }) => {
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
    company_id: company_id,
    name: '',
    share_level: '',
    share_url: '',
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  /**
   * Handles input field changes.
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  /**
   * Handles form submission to add a new project.
   * @param {Object} e - Event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProject = await postData(END_POINT, formData);

      if (newProject) {
        toast.success(t('toast_message.add_project_success'), toastOptions);
        setFormData({
          company_id: company_id,
          name: '',
          location: '',
        });
        onClose();
      } else {
        toast.error(t('toast_message.add_project_fail'), toastOptions);
      }
    } catch (error) {
      toast.error(t('toast_message.error_message'), toastOptions);
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
              <h3 className="text-lg font-semibold text-gray-900">{t('general.add_project')}</h3>
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
              <div className="grid gap-4 mb-4 sm:grid-cols-3">
                <div className="col-span-2">
                  <div className='py-4'>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">{t('general.project_name')}</label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="text-gray-900 border-b border-gray-300 text-sm focus:border-b-primary-600 focus:border-t-0 focus:border-x-0 focus:ring-0 block w-full p-2" 
                      placeholder={t('general.project_name')} 
                      required 
                    />
                  </div>
                  <div className='py-4'>
                    <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-900">{t('general.address')}</label>
                    <input 
                      type="text" 
                      name="location" 
                      id="location" 
                      value={formData.location}
                      onChange={handleChange}
                      className="border-b border-gray-300 text-gray-900 text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2" 
                      placeholder={t('general.address')} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center text-center px-2 pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{t('general.upload_project_image')} </span> {t('general.drag_and_drop')} </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div> 
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">{t('general.description')}</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                    placeholder={t('general.project_description')}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end">
              <button type="submit" className="text-gray-600 bg-secondary hover:bg-secondary-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5">{t('general.add_project')}</button>
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};

AddProjectForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddProjectForm;
