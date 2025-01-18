"use client"
import React, { useState, useCallback, useEffect } from 'react';
import ProjectPermission from './ProjectPermission';
import SettingPermission from './SettingPermission';
import UserList from './UserList';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import { PencilSquareIcon as PencilAltIcon, TrashIcon, ArrowDownOnSquareIcon as SaveIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { postData } from '@/components/utils/UserApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'next-i18next';

const END_POINT_GET_ALL = "/role/get-all";
const END_POINT_GET_BY_ID = "/role/get";
const END_POINT_CREATE = "/role/create";
const END_POINT_UPDATE = "/role/update";
const END_POINT_DELETE = "/role/delete";

// Get count based on screen size
const getCountBasedOnScreenSize = () => {
  if (typeof window === 'undefined') {
    return 0; // Server-side rendering
  }
  const width = window.innerWidth;
  if (width < 1441) {
    return 8; // Small screen
  } else if (width < 1921) {
    return 12; // Medium screen
  } else {
    return 15; // Large screen
  }
};


/**
 * Component to manage role permissions settings.
 * @returns {JSX.Element} The RolePermissionSettings component.
 */
const RolePermissionSettings = () => {
  const { t } = useTranslation("common");
  const [count, setCount] = useState(getCountBasedOnScreenSize());

    // Update count based on screen size
    useEffect(() => {
        const handleResize = () => {
            setCount(getCountBasedOnScreenSize());
        };
    
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        }, []);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState({id: ""});
  const [showInput, setShowInput] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editRoles, setEditRoles] = useState([]);

  const [roleSettingPermissions, setRoleSettingPermissions] = useState([]);
  const [roleProjectPermissions, setRoleProjectPermissions] = useState([]);
  const [userList, setUserList] = useState([]);

  const toastOptions = {
    position: "top-center", // Change position as needed
    autoClose: 2000, // Set duration in milliseconds
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  /**
   * Handles the click event for selecting a role.
   * @param {Object} role - The role object.
   */
  const handleClick = (role) => {
    setSelectedRole(role);
    fetchRoleInfo(role.id);
  };

  /**
   * Handles the event to show the input for adding a new role.
   */
  const handleAddRole = () => {
    setShowInput(true);
  };

  /**
   * Handles the event to save a new role.
   */
  const handleSaveRole = async () => {
    if (newRole.trim() !== '') {
      try {
        const response = await postData(END_POINT_CREATE, { name: newRole });
        if (response) {
          toast.success(t('toast_message.add_role_success'), toastOptions);
          fetchRoles(1);
          setNewRole('');
          setShowInput(false);
        } else {
          toast.error(t('toast_message.add_role_fail'), toastOptions);
          console.error('Failed to create role');
        }
      } catch (error) {
        toast.error(t('toast_message.error_message'), toastOptions);
        console.error('Error creating role:', error);
      }
    }
  };

  /**
   * Handles the event to cancel adding a new role.
   */
  const handleCancel = () => {
    setNewRole('');
    setShowInput(false);
  };

  /**
   * Toggles the editing mode for roles.
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSelectedRole(roles[0]);
  };

  /**
   * Handles the change event for editing a role name.
   * @param {number} index - The index of the role being edited.
   * @param {string} newValue - The new value for the role name.
   */
  const handleRoleChange = (index, newValue) => {
    const updatedRoles = [...editRoles];
    updatedRoles[index].name = newValue;
    setEditRoles(updatedRoles);
  };

  /**
   * Handles the event to save edits to a role.
   * @param {number} index - The index of the role being edited.
   */
  const handleSaveEdits = async (index) => {
    if (editRoles[index].name.trim() !== '') {
      try {
        const response = await postData(END_POINT_UPDATE, {
          id: roles[index].id,
          name: editRoles[index].name,
        });
        if (response) {
          setRoles(editRoles);
          setSelectedRole(roles[0]);
          toast.success(t('toast_message.update_role_success'), toastOptions);
        } else {
          toast.error(t('toast_message.update_role_fail'), toastOptions);
          console.error('Failed to update role');
        }
      } catch (error) {
        toast.error(t('toast_message.error_message'), toastOptions);
        console.error('Error updating role:', error);
      }
    }
  };

  /**
   * Handles the event to delete a role.
   * @param {number} index - The index of the role being deleted.
   */
  const handleDeleteRole = async (index) => {
    try {
      const response = await postData(END_POINT_DELETE, { id: roles[index].id });
      if (response) {
        const updatedRoles = editRoles.filter((_, i) => i !== index);
        setRoles(updatedRoles);
        setSelectedRole(roles[0]);
        toast.success(t('toast_message.delete_role_success'), toastOptions);
      } else {
        toast.error(t('toast_message.delete_role_fail'), toastOptions);
        console.error('Failed to delete role');
      }
    } catch (error) {
      toast.error(t('toast_message.error_message'), toastOptions);
      console.error('Error deleting role:', error);
    }
  };

  /**
   * Handles the event to update the selected role.
   */
  const handleUpdate = () => {
    fetchRoleInfo(selectedRole.id);
  };

  /**
   * Fetches information for a specific role by ID.
   * @param {string} roleId - The ID of the role to fetch information for.
   */
  const fetchRoleInfo = useCallback(async (roleId) => {
    setLoading(true);
    try {
      const data = await postData(END_POINT_GET_BY_ID, {
        id: roleId,
      });

      if (data && data.Data) {
        setRoleSettingPermissions(data.Data.SettingPermissions);
        setRoleProjectPermissions(data.Data.ProjectPermissions);
        setUserList(data.Data.Users);  
      } else {
        console.error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches the list of roles.
   * @param {number} page - The page number to fetch.
   */
  const fetchRoles = useCallback(async (page) => {
    setLoading(true);
    try {
      const data = await postData(END_POINT_GET_ALL, {
        page,
        count: count,
        sort: [],
        search: [],
      });

      if (data && data.Data && data.Data.List) {
        if (data.Data.List.length > 0) {
          setRoles(data.Data.List);
          setSelectedRole(data.Data.List[0]);
        }
      } else {
        console.error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      // Fetch the first role (index 0) when the component mounts
      fetchRoleInfo(roles[0].id);
      setSelectedRole(roles[0]);
    }
  }, [roles, fetchRoleInfo]);

  useEffect(() => {
    fetchRoles(1);
    if (selectedRole && selectedRole.id)
      fetchRoleInfo(selectedRole.id);
  }, [fetchRoles, fetchRoleInfo]);

  // Synchronize editRoles with roles
  useEffect(() => {
    setEditRoles(roles);
  }, [roles]);

  return (
    <ContainerWrapper>
      <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-8 lg:space-y-0 bg-gray-100 rounded-xl">
        {/* Role/User List */}
        <div className="bg-gray-200 p-4 lg:w-1/4 rounded-xl lg:h-[650px] xl:h-[750px] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">{t('general.role_list')}</h2>
            <button onClick={handleEditToggle}>
              <PencilAltIcon className={`h-5 w-5 ${isEditing ? 'text-blue-500' : 'text-gray-600'}`} />
            </button>
          </div>
          <ul>
            {roles.map((role, index) => (
              <li key={index} className="rounded-md border flex items-center justify-center text-sm">
                {isEditing ? (
                  <>
                    <input
                      className="my-0.5 w-full p-2 rounded-md cursor-pointer border flex justify-between hover:border-secondary"
                      value={editRoles[index]?.name || ''}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                    />
                    <div className="flex space-x-1 pl-1">
                      <button onClick={() => handleSaveEdits(index)}>
                        <SaveIcon className="h-5 w-5 text-primary" />
                      </button>
                      <button onClick={() => handleDeleteRole(index)}>
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className={`my-0.5 w-full p-2 rounded-md cursor-pointer border flex justify-between hover:border-secondary-hover ${selectedRole.name === role.name ? 'bg-secondary' : 'bg-white'}`}
                    onClick={() => handleClick(role)}
                  >
                    {role.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {showInput && (
            <div className="flex items-center space-x-2 my-1">
              <input
                type="text"
                className="w-full p-2 rounded-md border text-sm"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter role name"
              />
              <button
                className="text-red-500 font-bold border-red-500 border rounded-md p-1"
                onClick={handleCancel}
              >
                X
              </button>
            </div>
          )}
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <button
              type="button"
              className="my-1 mx-0.5 w-full flex items-center justify-center text-sm text-gray-800 border border-secondary hover:bg-secondary font-medium rounded-md px-2 py-1"
              onClick={showInput ? handleSaveRole : handleAddRole}
            >
              <PlusCircleIcon className="w-5 h-5 mx-1" />
              {showInput ? t('general.save_role') : t('general.add_role')}
            </button>
          </div>
        </div>
        {/* Projects */}
        <ProjectPermission roleId = {selectedRole.id} roleProjectPermissions={roleProjectPermissions} onAddProject={handleUpdate}  />
        {/* Settings */}
        <SettingPermission roleId = {selectedRole.id} roleSettingPermissions={roleSettingPermissions} onAddSetting={handleUpdate}/>
          {/* Users */}
          <UserList roleId = {selectedRole.id} userList={userList} onAddUsers={handleUpdate}/>
        </div>
    </ContainerWrapper>
  );
};

export default RolePermissionSettings;