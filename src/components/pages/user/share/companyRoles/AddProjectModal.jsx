"use client"
import { useState } from 'react';
import { postData as postUserData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT_CREATE_PERMISSION = "/role/add-permission";

const AddProjectModal = ({ isOpen, onClose, remainingProjects, roleId, onProjectsAdded }) => {
  const { t } = useTranslation("common");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState('view'); // New state for permission level

  // Handle checkbox change
  const handleCheckboxChange = (projectId) => {
    setSelectedProjects((prevSelectedProjects) =>
      prevSelectedProjects.includes(projectId)
        ? prevSelectedProjects.filter((id) => id !== projectId) // Uncheck: Remove project
        : [...prevSelectedProjects, projectId] // Check: Add project
    );
  };

  // Handle permission change
  const handlePermissionChange = (e) => {
    setSelectedPermission(e.target.value); // Set the selected permission level
  };

  // Handle Add button click
  const onAddProjects = async () => {
    // Loop through selected projects and make API requests
    const addPermissionRequests = selectedProjects.map((projectId) =>
      postUserData(END_POINT_CREATE_PERMISSION, {
        role_id: roleId, // Pass the role ID prop
        project_id: projectId, // Project ID from the checked items
        permission_type: 'project', // Constant value
        permission_level: selectedPermission, // Use selected permission level
      })
    );

    try {
      await Promise.all(addPermissionRequests); // Wait for all requests to finish
      setSelectedProjects([]); // Clear the selected projects
      onProjectsAdded(); // Callback to refresh data or update the UI
    } catch (error) {
      console.error('Error adding projects:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[500]">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-4 pb-2 border-b">{t('general.select_project_to_add')}</h3>
        
        {remainingProjects.map((project) => (
          <div key={project.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={project.id}
              className="w-4 h-4"
              onChange={() => handleCheckboxChange(project.id)}
              checked={selectedProjects.includes(project.id)} // Show if it's checked
            />
            <label htmlFor={project.id} className="ml-2 text-sm">
              {project.project_name}
            </label>
          </div>
        ))}

        {/* New radio button group for permission selection */}
        <div className="mt-4">
          <h4 className="text-sm pt-4 font-semibold mb-2 border-t border-green-500">{t('general.permission_level')}</h4>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="view"
                checked={selectedPermission === 'view'}
                onChange={handlePermissionChange}
                className="w-4 h-4"
              />
              <span className="ml-2 text-sm">{t('general.view')}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="edit"
                checked={selectedPermission === 'edit'}
                onChange={handlePermissionChange}
                className="w-4 h-4"
              />
              <span className="ml-2 text-sm">{t('general.edit')}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="full"
                checked={selectedPermission === 'full'}
                onChange={handlePermissionChange}
                className="w-4 h-4"
              />
              <span className="ml-2 text-sm">{t('general.full')}</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 text-sm py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            {t('general.cancel')}
          </button>
          <button
            onClick={onAddProjects}
            className="px-4 text-sm py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {t('general.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
