"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaUserTie, FaUserEdit, FaUser } from 'react-icons/fa';
import ActionButton from '@/components/common/actionButton/ActionButton';
import AddUser from '@/components/common/addUserForm/AddUserForm';
import EditUser from '@/components/common/editUser/EditUser';
import Pagination from '@/components/common/pagination/Pagination';
import SearchByCategories from '@/components/common/searchByCategories/SearchByCategories';
import NavRoute from '@/components/pages/user/share/navRoute/NavRoute';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import { postData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT = '/user/getlist';

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

const CompanyUsers = ({ backRoute, isRoot = true }) => {
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

    const categories = {
        [t('general.first_name')]: 'first_name',
        [t('general.last_name')]: 'last_name',
        [t('general.email')]: 'email',
        [t('general.is_admin')]: 'is_admin',
        [t('general.modify_date')]: 'modified_time',
    };
    const searchParams = useSearchParams();
    const companyId = searchParams.get('company_id');


    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'first_name', direction: 'ascending' });
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        key: '',
        value: ''
    });


    // Fetch users
    const fetchUsers = useCallback(async (page, query = '') => {
        setLoading(true);
        try {
            const data = await postData(END_POINT, {
                page,
                count: count,
                sort: [],
                search: query ? [{ by: query.key, value: query.value }] : [],
                company_id: isRoot ? companyId : null
            });

            setUsers(data.Data.List);
            setTotalPages(Math.ceil(data.Data.Total / count));
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);
    
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Search logic
    const handleSearch = useCallback(() => {
        setIsSearching(true);
        fetchUsers(1, searchQuery);  // Call API with search query
        setCurrentPage(1);  // Reset to the first page
    }, [searchQuery, fetchUsers]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');  // Clear search query
        setIsSearching(false);
        fetchUsers(1);  // Fetch all companies again
        setSearchQuery({ key: '', value: '' });
    }, [fetchUsers]);

    // Merge first name, middle name and last name
    const getFullName = (first_name, middle_name, last_name) => {
        return middle_name ? `${first_name} ${middle_name} ${last_name}` : `${first_name} ${last_name}`;
    };

    // Get role label
    const getRoleLabel = (is_admin) => {
        return is_admin ? t('general.admin') : t('general.normal_user');
    };

    // Sorting logic
    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    // Toggle modal
    const toggleModal = () => setIsOpen(prev => !prev);

    // On add user
    const onAddUser = () => {
        setIsOpen(false);
        fetchUsers(currentPage);
    };

    const handleEditUserClick = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
    };

    return (
        <ContainerWrapper>
            <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    {backRoute && <NavRoute backRoute={backRoute} origin={t('general.companies')}  target={t('general.user')}  />}
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <button type="button" onClick={toggleModal} className="flex items-center justify-center text-black bg-secondary hover:bg-secondary-hover focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2">
                            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            {t('general.add_user')}
                        </button>
                    </div>
                </div>
                <div className="pb-4 pl-4">
                    <SearchByCategories
                        categories={categories}
                        onSearch={handleSearch}
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                    />
                    {isSearching && (
                        <div className="flex justify- mt-2">
                            <button onClick={handleClearSearch} className="flex items-center text-red-300 hover:text-red-600 text-sm p-2">
                                <svg
                                    className="w-5 h-5 mr-2 bg-red-200 rounded-md"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                                {t('general.clear_search')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm font-extralight xl:font-light text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-primary-gradient">
                            <tr>
                                <th scope="col" className="px-4 py-3">
                                    <button type="button" onClick={() => requestSort('first_name')}>
                                        {t('general.user_name')} {sortConfig.key === 'first_name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-[180px]">
                                    <button type="button" onClick={() => requestSort('is_admin')}>
                                        {t('general.role')} {sortConfig.key === 'is_admin' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    <button type="button" onClick={() => requestSort('email')}>
                                    {t('general.email')}  {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-[180px]">
                                    <button type="button" onClick={() => requestSort('modified_time')}>
                                        {t('general.modify_date')} {sortConfig.key === 'modified_time' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-[150px]">
                                    <button type="button" onClick={() => requestSort('status')}>
                                        {t('general.status')} {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-[150px] text-center">
                                    {t('general.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => (
                                <tr key={index} className="border-b hover:bg-slate-50">
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                        {getFullName(user.first_name, user.middle_name, user.last_name)}
                                    </th>
                                    <td className="px-4 py-3">
                                        {getRoleLabel(user.is_admin) === t('general.admin') && (
                                            <div className="bg-blue-100 text-blue-800 px-1 rounded flex items-center">
                                                <FaUserTie className="mr-2" />{t('general.admin')}
                                            </div>
                                        )}
                                        {getRoleLabel(user.is_admin) === t('general.normal_user') && (
                                            <div className="bg-violet-200 text-violet-800 px-1 rounded flex items-center">
                                                <FaUserEdit className="mr-2" />{t('general.normal_user')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.modified_time ? new Date(user.modified_time).toLocaleDateString() : t('general.not_yet_update')}
                                    </td>
                                    <td className="flex px-4 py-3 items-center">
                                        <div className={`h-3 w-3 rounded-md ${user.status ? 'bg-red-500' : 'bg-primary'}`}></div>
                                        <div className={`pl-4 ${user.status ? 'text-red-500' : 'text-secondary'}`}>{`${user.status ? t('general.inactive'): t('general.active')}`}</div>
                                    </td>
                                    <td className="py-2 px-4 border-b relative text-center">
                                        <ActionButton rowIndex={index} totalRows={users.length} onEdit={() => handleEditUserClick(user)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
            />
            {isEditing && <EditUser user={currentUser} onClose={() => setIsEditing(false)} />}
            <AddUser isOpen={isOpen} onClose={onAddUser}/>
        </ContainerWrapper>
    );
};

export default CompanyUsers;
