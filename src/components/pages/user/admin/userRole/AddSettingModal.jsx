"use client";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { postData as postUserData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT_CREATE_PERMISSION = "/role/add-permission";

const AddSettingModal = ({ isOpen, onClose, roleId, onPermissionAdded }) => {
  const { t } = useTranslation("common");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Set dropdown state
  const [selectedOption, setSelectedOption] = useState('Manage Permissions');
  const [selectedPermission, setSelectedPermission] = useState('full');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false); // Close the dropdown
  };

  const handlePermissionChange = (e) => {
    setSelectedPermission(e.target.value);
  };

  const handleAddPermission = async () => {
    try {
      let type;
      if (selectedOption === 'Manage Permissions') {
        type = 'manage_permission';
      } else if (selectedOption === 'Manage Users') {
        type = 'manage_user';
      } else {
        type = 'view_all_projects';
      }
      let level;
      if (selectedPermission === 'Full') {
        level = 'full';
      } else if (selectedOption === 'View Only') {
        level = 'view';
      } else {
        level = 'edit';
      }
      console.log (roleId, type, level);
      const response = await postUserData(END_POINT_CREATE_PERMISSION, {
        role_id: roleId,
        permission_type: type,
        permission_level: level,
      });

      if (response) {
        onPermissionAdded(); // Call the callback function to update the parent component
        onClose(); // Close the modal
      } else {
        const errorMessage = response ? response.statusText : 'Failed to add permission';
        console.error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding permission:', error);
    }
  };

  return (
    <div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <label className="block text-gray-700 font-semibold mb-4 pb-2 border-b">
            {t('general.select_permission_type')}
            </label>
            {/* Dropdown as button */}
            <div className="mb-4 relative w-52">
              <button
                id="dropdownDelayButton"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 py-1.5 text-center text-sm inline-flex items-center"
                type="button"
                aria-expanded={dropdownOpen}
              >
                {selectedOption}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  id="dropdownDelay"
                  className="absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-52"
                >
                  <ul
                    className="py-2 text-sm text-gray-700"
                    aria-labelledby="dropdownDelayButton"
                  >
                    <li>
                      <a
                        href="#"
                        onClick={() => handleOptionChange('Manage Permissions')}
                        className="block text-sm px-4 py-2 hover:bg-gray-100"
                      >
                        {t('general.manage_permission')}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={() => handleOptionChange('Manage Users')}
                        className="block text-sm px-4 py-2 hover:bg-gray-100"
                      >
                        {t('general.manage_users')}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={() => handleOptionChange('Manage Projects')}
                        className="block text-sm px-4 py-2 hover:bg-gray-100"
                      >
                        {t('general.manage_projects')}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Radio List */}
            <div className="mb-4">
              <div className="mt-2 space-y-2">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="permission"
                      value="Full"
                      checked={selectedPermission === 'Full'}
                      onChange={handlePermissionChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm">{t('general.full')}</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="permission"
                      value="View Only"
                      checked={selectedPermission === 'View Only'}
                      onChange={handlePermissionChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm">{t('general.view')}</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="permission"
                      value="Edit"
                      checked={selectedPermission === 'Edit'}
                      onChange={handlePermissionChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm">{t('general.edit')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-700 text-sm px-4 py-1 rounded-md"
                onClick={onClose}
              >
                {t('general.cancel')}
              </button>
              <button
                className="bg-green-500 text-white text-sm px-4 py-1 rounded-md"
                onClick={handleAddPermission}
              >
                {t('general.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AddSettingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  roleId: PropTypes.string.isRequired,
  onPermissionAdded: PropTypes.func.isRequired,
};

export default AddSettingModal;
