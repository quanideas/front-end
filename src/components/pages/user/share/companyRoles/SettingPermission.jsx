"use client";
import React, { useState, useEffect } from "react";
import { PencilSquareIcon as PencilAltIcon, PlusIcon, TrashIcon, ArrowDownOnSquareIcon as SaveIcon } from '@heroicons/react/24/outline';
import AddSettingModal from './AddSettingModal';
import { postData as postUserData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT_REMOVE = "/role/remove-permission";

/**
 * Component to manage project permissions for a specific role.
 * @param {Object} props - Component props.
 * @param {string} props.roleId - The ID of the role to manage permissions for.
 * @param {Array} props.roleSettingPermissions - List of current project permissions for the role.
 * @param {Function} props.onAddSetting - Callback function to refresh the project list.
 */
const SettingPermission = ({ roleId, roleSettingPermissions, onAddSetting }) => {
  const { t } = useTranslation("common");
  const [radioStates, setRadioStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredSettings, setFilteredSettings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [initialRadioStates, setInitialRadioStates] = useState({});


  /**
   * Handles radio button state changes for project permission types.
   * @param {Object} event - The radio input change event.
   * @param {string} projectId - The ID of the project being modified.
   */
  const handleRadioChange = (event, projectId) => {
    if (isEditing) {
      setRadioStates(prevState => ({
        ...prevState,
        [projectId]: event.target.id,
      }));
    }
  };

  /**
   * Toggles the editing mode for project permissions.
   */
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Removes a project permission from the list.
   * @param {string} permissionID - The ID of the project to delete.
   */
  const handleDelete = async (permissionID) => {
    try {
      const response = await postUserData(END_POINT_REMOVE, { id: permissionID });
      if (response) {
        onAddSetting(); // Refresh project list
      } else {
        console.error('Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  /**
   * Saves changes made to a specific project's permissions.
   * @param {string} projectId - The ID of the project being saved.
   */
  const handleSave = (projectId) => {
    console.log(`Save project: ${projectId}`);
  };

  useEffect(() => {
    setFilteredSettings(roleSettingPermissions);
    if (isEditing) {
      const initialStates = {};
      roleSettingPermissions.forEach(permission => {
        initialStates[permission.id] = permission.permission_level;
      });
      setInitialRadioStates(initialStates);
    }
  }, [isEditing, roleSettingPermissions])
  /**
   * Opens the modal for adding new projects to the permission list.
   */
  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  /**
   * Closes the modal for adding new projects.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Adds selected projects to the project permission list.
   */
  const handleAddSettings = () => {
    setIsModalOpen(false); // Close modal
    onAddSetting(); // Refresh project list
  };

  /**
   * Handles the search functionality.
   * Filters the project list based on the search term and updates the filtered projects state.
   * @param {Event} event - The event object from the form submission.
   */
  const handleSearch = (event) => {
    event.preventDefault();
    if (!roleSettingPermissions) return;
    setOnSearch(true);
    const filtered = searchTerm
      ? roleSettingPermissions.filter(setting =>
        convertSnakeToNormalText(setting.permission_type)?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : roleSettingPermissions;
    setFilteredSettings(filtered);
  };

  /**
   * Clears the search input and resets the filtered projects list.
   * Resets the search term and filtered projects state to the original project list.
   */
  const handleClearSearch = () => {
    setOnSearch(false);
    setSearchTerm(""); // Reset search term
    setFilteredSettings(roleSettingPermissions); // Reset project list to the original
  };

  /**
 * Converts a snake_case string to Normal Text.
 * @param {string} snakeCaseString - The snake_case string to convert.
 * @returns {string} - The converted Normal Text string.
 */
  const convertSnakeToNormalText = (snakeCaseString) => {
    return snakeCaseString
      .split('_') // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string
  };

  return (
    <div className="bg-white z[10] px-4 w-full lg:w-1/3 rounded-md shadow-lg md:shadow-sm shadow-blue-200 lg:h-[650px] xl:h-[750px] overflow-y-auto">
      <div className="flex flex-row items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="font-semibold bg-blue-200 mb-4 mt-4 px-4 rounded-md">{t('general.setting_permission')}</h2>
        <div className="flex space-x-2">
          <button onClick={handleEditClick}>
            <PencilAltIcon className={`h-5 w-5 ${isEditing ? 'text-blue-500' : 'text-gray-600'}`} />
          </button>
          <button onClick={handleAddClick}>
            <PlusIcon className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
      <form className="flex items-center w-full pb-2 sticky top-12 bg-white z-10" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-l-lg focus:ring-secondary focus:border-secondary block w-full p-1.5"
          placeholder={t('general.search_setting')}
          required
        />
        <button
          type="submit"
          className="p-1.5 text-sm font-medium text-white bg-secondary rounded-r-lg border border-secondary hover:bg-secondary-hover"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </button>
        {onSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="ml-2 p-1.5 text-xs font-medium text-white bg-red-300 rounded-lg  hover:bg-red-500"
          >
            {t('general.clear')}
          </button>
        )}
      </form>
      {/* Render modal */}
      <AddSettingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPermissionAdded={handleAddSettings}
        roleId={roleId}
      />

      {filteredSettings.map(permission => (
        <div key={permission.permission_type} className="mb-2 p-2  border rounded-md bg-gray-50 hover:shadow-md">
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
            <h3 className="text-sm">{convertSnakeToNormalText(permission.permission_type)}</h3>
            {isEditing && (
              <div className="flex space-x-2">
                <button onClick={() => handleSave(permission.id)}>
                  <SaveIcon className="h-5 w-5 text-primary" />
                </button>
                <button onClick={() => handleDelete(permission.id)}>
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            )}
          </div>
          <div className="pt-3 font-extralight grid grid-cols-3 md:grid-cols-1 gap-4">
            <PermissionRadio
              permissionId={permission.id}
              radioId={`radio-${permission.id}-1`}
              label="Full quyền"
              isChecked={isEditing ? (radioStates[permission.id] === `radio-${permission.id}-1` || (!radioStates[permission.id] && initialRadioStates[permission.id] === 'full')) : permission.permission_level === 'full'}
              isEditing={isEditing}
              handleRadioChange={handleRadioChange}
            />
            <PermissionRadio
              permissionId={permission.id}
              radioId={`radio-${permission.id}-2`}
              label="Chỉnh sửa"
              isChecked={isEditing ? (radioStates[permission.id] === `radio-${permission.id}-2` || (!radioStates[permission.id] && initialRadioStates[permission.id] === 'edit')) : permission.permission_level === 'edit'}
              isEditing={isEditing}
              handleRadioChange={handleRadioChange}
            />
            <PermissionRadio
              permissionId={permission.id}
              radioId={`radio-${permission.id}-3`}
              label="Chỉ xem"
              isChecked={isEditing ? (radioStates[permission.id] === `radio-${permission.id}-3` || (!radioStates[permission.id] && initialRadioStates[permission.id] === 'view')) : permission.permission_level === 'view'}
              isEditing={isEditing}
              handleRadioChange={handleRadioChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Component for rendering permission radio buttons.
 * @param {Object} props - Component props.
 * @param {string} props.permissionId - ID of the permission.
 * @param {string} props.radioId - ID of the radio button.
 * @param {string} props.label - Label for the radio button.
 * @param {boolean} props.isChecked - Whether the radio button is checked.
 * @param {boolean} props.isEditing - Whether the editing mode is active.
 * @param {Function} props.handleRadioChange - Function to handle radio button changes.
 */
const PermissionRadio = ({ permissionId, radioId, label, isChecked, isEditing, handleRadioChange }) => (
  <div className="flex items-center">
    <input
      type="radio"
      name={`project-${permissionId}`}
      id={radioId}
      className="w-4 h-4"
      checked={isChecked}
      onChange={(e) => handleRadioChange(e, permissionId)}
      disabled={!isEditing}

    />
    <label htmlFor={radioId} className="ml-2 text-xs">
      {label}
    </label>
  </div>
);

export default SettingPermission;