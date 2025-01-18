"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PencilSquareIcon as PencilAltIcon, PlusIcon, TrashIcon, ArrowDownOnSquareIcon as SaveIcon } from '@heroicons/react/24/outline';
import AddProjectModal from './AddProjectModal';
import { postData as postProjectData } from '@/components/utils/ProjectApi';
import { postData as postUserData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT_GET_ALL = "/project/get-all";
const END_POINT_REMOVE = "/role/remove-permission";

/**
 * Component to manage project permissions for a specific role.
 * @param {Object} props - Component props.
 * @param {string} props.roleId - The ID of the role to manage permissions for.
 * @param {Array} props.roleProjectPermissions - List of current project permissions for the role.
 * @param {Function} props.onAddProject - Callback function to refresh the project list.
 */
const ProjectPermission = ({ roleId, roleProjectPermissions, onAddProject }) => {
  const { t } = useTranslation("common");
  const [radioStates, setRadioStates] = useState({});
  const [initialRadioStates, setInitialRadioStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [onSearch, setOnSearch] = useState(false);

  /**
   * Fetches the list of all projects and updates the state.
   */
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postProjectData(END_POINT_GET_ALL, {
        page: 1,
        count: 10,
        sort: [],
        search: [],
      });

      if (data && data.Data) {
        setProjectList(data.Data.List);
        setFilteredProjects(data.Data.List);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filters project permissions with the project names from the project list.
   * @returns {Array} List of project permissions with project names.
   */
  const projectNamesWithPermissions = roleProjectPermissions
    .map(permission => {
      const project = filteredProjects.find(proj => proj.id === permission.project_id);
      return project
        ? { id: permission.id,
          project_name: project.name,
          permission_level: permission.permission_level }
        : null;
    })
    .filter(item => item !== null);

  /**
   * Filters remaining projects that are not included in the current project permissions.
   * @returns {Array} List of remaining projects.
   */
  const listRemainingProjects = projectList
    .filter(project => !roleProjectPermissions.some(permission => permission.project_id === project.id))
    .map(project => ({ id: project.id, project_name: project.name }));

  useEffect(() => {
    fetchProjects();
    if (isEditing) {
      const initialStates = {};
      roleProjectPermissions.forEach(permission => {
        initialStates[permission.id] = permission.permission_level;
      });
      setInitialRadioStates(initialStates);
    }
  }, [isEditing, roleProjectPermissions, fetchProjects]);

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
        onAddProject(); // Refresh project list
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
  const handleAddProjects = () => {
    setIsModalOpen(false); // Close modal
    onAddProject(); // Refresh project list
  };

  /**
   * Handles the search functionality.
   * Filters the project list based on the search term and updates the filtered projects state.
   * @param {Event} event - The event object from the form submission.
   */
  const handleSearch = (event) => {
    setOnSearch(true);
    event.preventDefault();
    const filtered = searchTerm
      ? projectList.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : projectList;
    setFilteredProjects(filtered);
  };
  
  /**
   * Clears the search input and resets the filtered projects list.
   * Resets the search term and filtered projects state to the original project list.
   */
  const handleClearSearch = () => {
    setOnSearch(false);
    setSearchTerm(""); // Reset search term
    setFilteredProjects(projectList); // Reset project list to the original
  };

  return (
    <div className="bg-white px-4 w-full lg:w-1/3 rounded-md shadow-lg md:shadow-sm shadow-green-200 laptop:h-[650px] desktop:h-[750px] overflow-y-auto">
      <div className="flex flex-row items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="font-semibold bg-green-200 mb-2 mt-4 px-2 rounded-md">{t('general.project_permission')}</h2>
        <div className="flex space-x-2">
          <button onClick={handleEditClick}>
            <PencilAltIcon className={`h-5 w-5 ${isEditing ? 'text-blue-500' : 'text-gray-600'}`} />
          </button>
          <button onClick={handleAddClick}>
            <PlusIcon className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
      <form className="flex items-center w-full pb-2 sticky top-12 bg-white z-10" onSubmit = {handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-l-lg focus:ring-secondary focus:border-secondary block w-full p-1.5"
          placeholder={t('general.search_project_name')}
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
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProjectsAdded={handleAddProjects}
        remainingProjects={listRemainingProjects}
        roleId={roleId}
      />
      {console.log(projectNamesWithPermissions)}
      {console.log(initialRadioStates)}
      {projectNamesWithPermissions.map(permission => (
        <div key={permission.project_name} className="mb-2 p-2 border rounded-md bg-gray-50 hover:shadow-md">
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-t-md">
            <h3 className="text-sm">{permission.project_name}</h3>
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
    <label htmlFor={radioId} className="ml-2 text-xs md:text-sm">
      {label}
    </label>
  </div>
);

export default ProjectPermission;