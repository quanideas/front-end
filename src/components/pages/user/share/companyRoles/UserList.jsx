"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { PencilSquareIcon as PencilAltIcon, PlusIcon, TrashIcon, ArrowDownOnSquareIcon as SaveIcon } from '@heroicons/react/24/outline';
import AddUserModal from './AddUserModal';
import { postData as postUserData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT_GET_ALL = "/user/getlist";
const END_POINT_REMOVE = "/role/remove-user";

/**
 * Component to manage project permissions for a specific role.
 * @param {Object} props - Component props.
 * @param {string} props.roleId - The ID of the role to manage permissions for.
 * @param {Array} props.userList - List of current project permissions for the role.
 * @param {Function} props.onAddUsers - Callback function to refresh the project list.
 */
const UserList = ({ roleId, userList, onAddUsers }) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUserList, setAllUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [onSearch, setOnSearch] = useState(false);

  /**
   * Fetches the list of all projects and updates the state.
   */
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postUserData(END_POINT_GET_ALL, {
        page: 1,
        count: 100,
        sort: [],
        search: [],
      });

      if (data && data.Data) {
        setAllUserList(data.Data.List);
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
   * Filters remaining projects that are not included in the current project permissions.
   * @returns {Array} List of remaining projects.
   */

    const listRemainingUsers = allUserList.filter(user2 => {
      return !userList.some(user1 => user1.username === user2.username);
  }).map(user2 => ({
      username: user2.username,
      full_name: `${user2.first_name} ${user2.middle_name} ${user2.last_name}`.trim()
  }));


  useEffect(() => {
    fetchAllUsers();
    setFilteredUsers(userList);
  }, [fetchAllUsers, userList]);

  /**
   * Toggles the editing mode for project permissions.
   */
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Removes a project permission from the list.
   * @param {string} username - The ID of the project to delete.
   */
  const handleDelete = async (username) => {
    try {
      const response = await postUserData(END_POINT_REMOVE, 
        { 
          role_id: roleId,
          username: username 
        });
      if (response) {
        onAddUsers(); // Refresh project list
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
    console.log(`Save user: ${projectId}`);
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
  const handleAddUsers = () => {
    setIsModalOpen(false); // Close modal
    onAddUsers(); // Refresh project list
  };

  const joinName = (firstName, midName, lastName) => {
    return [firstName, midName, lastName].filter(Boolean).join(' ');
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
      ? userList.filter(user =>
        joinName(user.first_name, user.middle_name, user.last_name).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : userList;
    setFilteredUsers(filtered);
  };


  
  /**
   * Clears the search input and resets the filtered projects list.
   * Resets the search term and filtered projects state to the original project list.
   */
  const handleClearSearch = () => {
    setOnSearch(false);
    setSearchTerm(""); // Reset search term
    setFilteredUsers(userList); // Reset project list to the original
  };

  return (
    <div className="bg-white z-[10]  px-4 w-full lg:w-1/4 rounded-md shadow-lg md:shadow-sm shadow-yellow-200 lg:h-[650px] xl:h-[750px] overflow-y-auto">
      <div className="flex flex-row items-center justify-between sticky top-0 bg-white z-0">
        <h2 className="font-semibold bg-yellow-200 mb-4 mt-4 px-2 rounded-md"> {t('general.users')}</h2>
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-l-lg focus:ring-green-500 focus:border-green-500 block w-full p-1.5"
          placeholder={t('general.search_user')}
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
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUsersAdded={handleAddUsers}
        remainingUsers={listRemainingUsers}
        roleId={roleId}
      />

      {filteredUsers.map(user => (
        <div key={user.username} className="flex items-center mb-2 p-1 border rounded-md bg-gray-50 hover:shadow-md">
            <Image
            src='/images/common/default_avatar_1.png'
            alt="avatar"
            width={40} 
            height={40}
            className="rounded-full mr-2"
          />
          <div className="flex justify-between items-center w-full">
          <h3 className="font-extralight text-xs md:text-sm">
          {joinName(user.first_name, user.middle_name, user.last_name)}
        </h3>
            {isEditing && (
                <button onClick={() => handleDelete(user.username)}>
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
            )}

          
        </div>
        </div>
      ))}
    </div>
  );
};


export default UserList;