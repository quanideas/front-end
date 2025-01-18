
import { useState } from 'react';
import { postData as postUserData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT_ADD_USERS = "/role/add-user";

/**
 * AddUserModal Component
 *
 * A modal component that allows the user to select projects from a list and add them with specific permissions to a role. 
 * The selected projects are sent as API requests to add permissions for the provided role.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines if the modal is open or closed.
 * @param {function} props.onClose - Callback function to handle closing the modal.
 * @param {Array} props.remainingUsers - An array of projects that can be selected.
 * @param {string} props.roleId - The ID of the role to which the projects are added.
 * @param {function} props.onUsersAdded - Callback function triggered when projects are successfully added.
 * 
 * @returns {JSX.Element|null} The rendered modal component if `isOpen` is true, otherwise returns null.
 *
 * @example
 * const remainingUsers = [{ id: '1', project_name: 'Project A' }, { id: '2', project_name: 'Project B' }];
 * const roleId = '123';
 * 
 * <AddUserModal
 *   isOpen={isModalOpen}
 *   onClose={() => setModalOpen(false)}
 *   remainingUsers={remainingUsers}
 *   roleId={roleId}
 *   onUsersAdded={() => fetchUpdatedProjects()}
 * />
 * 
 * @function handleCheckboxChange
 * Handles the change event of a checkbox to add/remove the project ID to/from the `selectedUsers` array.
 *
 * @function onAddUsers
 * Asynchronously sends API requests to add the selected projects with permission levels to the specified role. 
 * Clears the selected projects after successful completion and triggers the `onUsersAdded` callback.
 */
const AddUserModal = ({ isOpen, onClose, remainingUsers, roleId, onUsersAdded }) => {
  const { t } = useTranslation("common");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Handle checkbox change
  /**
   * Handles the change event of a checkbox.
   * @param {string} projectId - The ID of the project.
   * @returns {void}
   */
  const handleCheckboxChange = (username) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(username)
        ? prevSelectedUsers.filter((id) => id !== username) // Uncheck: Remove project
        : [...prevSelectedUsers, username] // Check: Add project
    );
  };

  // Handle Add button click
  /**
   * Function to add projects with specified permissions.
   * 
   * @async
   * @function onAddUsers
   * @returns {Promise<void>} - A promise that resolves when all API requests are completed.
   * @throws {Error} - If there is an error adding projects.
   */
  const onAddUsers = async () => {
    // Loop through selected projects and make API requests
    const addUsersRequests = selectedUsers.map((username) =>
      postUserData(END_POINT_ADD_USERS, {
        role_id: roleId, // Pass the role ID prop
        username: username, // Project ID from the checked items
      })
    );
    
    try {
      await Promise.all(addUsersRequests); // Wait for all requests to finish
      setSelectedUsers([]); // Clear the selected projects
      onUsersAdded(); // Callback to refresh data or update the UI
    } catch (error) {
      console.error('Error adding projects:', error);
      // Optionally handle the error, show a notification, etc.
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[500]">
      <div className="bg-white  p-6 rounded-lg shadow-lg ">
        <h3 className="font-semibold mb-4 pb-2 border-b">{t('general.select_user_to_add')}</h3>
        {remainingUsers.map((user) => (
          <div key={user.username} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={user.username}
              className="w-4 h-4"
              onChange={() => handleCheckboxChange(user.username)}
              checked={selectedUsers.includes(user.username)} // Show if it's checked
            />
            <label htmlFor={user.username} className="ml-2 text-sm">
            {user.full_name}
            </label>
          </div>
        ))}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 text-sm py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            {t('general.cancel')}
          </button>
          <button
            onClick={onAddUsers}
            className="px-4 text-sm py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {t('general.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
