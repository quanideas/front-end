"use client"
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import Pagination from '@/components/common/pagination/Pagination';
import SearchByCategories from '@/components/common/searchByCategories/SearchByCategories';
import Overview from '@/components/pages/user/root/dashboard/Overview';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import { postData } from '@/components/utils/UserApi';


const END_POINT = '/company/get-all'

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

const Companies = () => {
    const { t } = useTranslation("common");
    const [count, setCount] = useState(getCountBasedOnScreenSize());
    const categories = {
        [t('general.company_name')]: 'name',
        [t('general.city')]: 'city',
        [t('general.country')]: 'country',
        [t('general.update_date')]: 'modified_time',
        [t('general.status')]: 'is_disabled'
    };

    // State management
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        key: '',
        value: ''
    });

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

    // Fetch companies
    const fetchCompanies = useCallback(async (page, query = '') => {
        setLoading(true);
        try {
            const data = await postData(END_POINT, {
                page,
                count: count,
                sort: [],
                search: query ? [{ by: query.key, value: query.value }] : []
            });

            setCompanies(data.Data.List);
            setTotalPages(Math.ceil(data.Data.Total / count));
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies(currentPage);
    }, [currentPage, fetchCompanies]);

    // Search handler
    const handleSearch = useCallback(() => {
        setIsSearching(true);
        fetchCompanies(1, searchQuery);  // Call API with search query
        setCurrentPage(1);  // Reset to the first page
    }, [searchQuery, fetchCompanies]);

    // Clear search
    const handleClearSearch = useCallback(() => {
        setSearchQuery('');  // Clear search query
        setIsSearching(false);
        fetchCompanies(1);  // Fetch all companies again
        setSearchQuery({ key: '', value: '' });
    }, [fetchCompanies]);

    // Sorting
    const sortedCompanies = useMemo(() => {
        const sorted = [...companies];
        sorted.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sorted;
    }, [companies, sortConfig]);

    const requestSort = useCallback((key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    }, []);

    // Handlers
    const handleNext = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalPages]);

    const handlePrevious = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);
    return (
        <ContainerWrapper>
            <Overview />
            <div className="w-full md:w-1/2 pb-4">
                <SearchByCategories
                    categories={categories}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}  // Pass searchQuery
                    setSearchQuery={setSearchQuery}  // Pass setSearchQuery
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
            <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm font-extralight xl:font-light text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-primary-gradient">
                            <tr>
                                <th scope="col" className="px-4 py-3 w-72">
                                    <button type="button" onClick={() => requestSort('name')}>
                                        {t('general.company_name')} {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-48">
                                    <button type="button" onClick={() => requestSort('address_line1')}>
                                        {t('general.city')}  {sortConfig.key === 'address_line1' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-48">
                                    <button type="button" onClick={() => requestSort('country')}>
                                        {t('general.nation')} {sortConfig.key === 'country' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-48">
                                    <button type="button" onClick={() => requestSort('modified_time')}>
                                        {t('general.update_date')} {sortConfig.key === 'modified_time' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-48">
                                    <button type="button" onClick={() => requestSort('is_disabled')}>
                                        {t('general.status')} {sortConfig.key === 'is_disabled' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-32 text-center">
                                    {t('general.users')}
                                </th>
                                <th scope="col" className="px-4 py-3 w-24 text-center">
                                    {t('general.projects')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCompanies.map((company, index) => (
                                <tr key={index} className="border-b hover:bg-slate-50">
                                    <th scope="row" className="px-4 py-3 w-12 font-medium text-gray-700">
                                        {company.name}
                                    </th>
                                    <td className="px-4 py-3">{company.city}</td>
                                    <td className="px-4 py-3">{company.country}</td>
                                    <td className="px-4 py-3">
                                        {company.modified_time ? new Date(company.modified_time).toLocaleDateString() : t('general.not_yet_update')}
                                    </td>
                                    <td className=" px-4 py-3">
                                        <div className="flex items-center">
                                        <div className={`h-3 w-3 rounded-md ${company.is_disabled ? 'bg-red-500' : 'bg-primary'}`}></div>
                                        <div className={`pl-4 ${company.is_disabled ? 'text-red-500' : 'text-primary'}`}>{`${company.is_disabled ? t('general.inactive') : t('general.active')}`}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {company.UserCount}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {company.ProjectCount}
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
        </ContainerWrapper>
    );
};

export default Companies;
