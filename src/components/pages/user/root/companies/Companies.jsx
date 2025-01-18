"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

import AddCompanyForm from '@/components/common/addCompanyForm/AddCompanyForm';
import EditCompanyForm from '@/components/common/editCompany/EditCompany';
import ActionButton from '@/components/common/actionButton/ActionButton';
import Pagination from '@/components/common/pagination/Pagination';
import SearchByCategories from '@/components/common/searchByCategories/SearchByCategories';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import slugify from '@/components/utils/Slugify';
import { postData } from '@/components/utils/UserApi';

const END_POINT_GET_ALL = '/company/get-all';
const END_POINT_GET = '/company/get';

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
        [t('general.company_name')]: 'name',
        [t('general.city')]: 'city',
        [t('general.country')]: 'country',
        [t('general.update_date')]: 'modified_time',
        [t('general.status')]: 'is_disabled'
    };
    const router = useRouter();

    // State management
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        key: '',
        value: ''
    });

    // Fetch companies
    const fetchCompanies = useCallback(async (page, query = '') => {
        setLoading(true);
        try {
            const data = await postData(END_POINT_GET_ALL, {
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

    // Search logic
    const handleSearch = useCallback(() => {
        setIsSearching(true);
        fetchCompanies(1, searchQuery);  // Call API with search query
        setCurrentPage(1);  // Reset to the first page
    }, [searchQuery, fetchCompanies]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');  // Clear search query
        setIsSearching(false);
        fetchCompanies(1);  // Fetch all companies again
        setSearchQuery({ key: '', value: '' });
    }, [fetchCompanies]);

    // Edit logic
    const getCompanyInfo = async (company_id) => {
        try {
          const data = await postData(END_POINT_GET, { id: company_id });
          const company = await data.Data;
          return company;
        } catch (error) {
          console.error('Failed to fetch company info:', error);
          return null;
        }
      };

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
  
    const openEditForm = async (company_id) => {
        const company = await getCompanyInfo(company_id);
        if (company) {
            setSelectedCompany({
        company_id: company.id,
        name: company.name,
        address_line_1: company.address_line_1 || '',
        address_line_2: company.address_line_2 || '',
        city: company.city,
        state: company.state || '',
        country: company.country,
        zip_code: company.zip_code || '',
        is_disabled: company.is_disabled
        });
        }
      setIsFormOpen(true);
    };
  
    const onEditCompany = () => {
      setIsFormOpen(false);
      setSelectedCompany(null);
      fetchCompanies(currentPage);
    };

    const onAddCompany = () => {
        setIsOpen(false);
        fetchCompanies(currentPage);
    };
  
    // Sorting logic
    const sortedCompanies = [...companies].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const requestSort = useCallback((key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    }, []);

    // Handlers pagination logic
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
    
    const toggleModal = () => setIsOpen(prev => !prev);

    // Handle company click
    const handleCompanyClick = useCallback((path, company_id) => {
        router.push(`${path}?company_id=${company_id}`);
    }, [router]);


    return (
        <ContainerWrapper>
            <div className="bg-white  shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
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
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <button type="button" onClick={toggleModal} className="flex items-center justify-center text-black bg-secondary hover:bg-secondary-hover focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2">
                            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            {t('general.add_company')}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm font-extralight xl:font-light text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-primary-gradient">
                            <tr>
                                <th scope="col" className="px-4 py-3 w-72">
                                    <button type="button" onClick={() => requestSort('name')}>
                                        {t('general.company_name')} {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-44">
                                    <button type="button" onClick={() => requestSort('address_line1')}>
                                        {t('general.city')}  {sortConfig.key === 'address_line1' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-44">
                                    <button type="button" onClick={() => requestSort('country')}>
                                        {t('general.nation')}{sortConfig.key === 'country' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-3 w-44">
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
                                <th scope="col" className="px-4 py-3 w-32 text-center">
                                {t('general.actions')} 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCompanies.map((company, index) => (
                                <tr key={index} className="border-b hover:bg-slate-50">
                                    <th scope="row" className="px-4 py-3 w-12 font-medium text-gray-900">
                                        {company.name}
                                    </th>
                                    <td className="px-4 py-3">{company.city}</td>
                                    <td className="px-4 py-3">{company.country}</td>
                                    <td className="px-4 py-3">
                                        {new Date(company.modified_time).toLocaleDateString()}
                                    </td>
                                    <td className=" px-4 py-3">
                                        <div className="flex items-center">
                                        <div className={`h-3 w-3 rounded-md ${company.is_disabled ? 'bg-red-500' : 'bg-primary'}`}></div>
                                        <div className={`pl-4 ${company.is_disabled ? 'text-red-500' : 'text-primary'}`}>{`${company.is_disabled ? t('general.inactive') : t('general.active')}`}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button
                                            className="border text-black hover:bg-secondary-light hover:text-blue-700 px-2 py-1 rounded mr-2"
                                            onClick={() => handleCompanyClick(`/root/companies/users/${slugify(company.name)}`, company.id)}>
                                            {company.ProjectCount}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex flex-row items-center">
                                       
                                        <button
                                            className="border text-black hover:bg-secondary-light hover:text-blue-700 px-2 py-1 rounded"
                                            onClick={() => handleCompanyClick(`/root/companies/projects/${slugify(company.name)}`, company.id)}>
                                            {company.UserCount}
                                        </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <ActionButton
                                            onEdit={() => openEditForm(company.id)}
                                        />
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
            <AddCompanyForm isOpen={isOpen}
                            onClose={onAddCompany}        
            />
            <EditCompanyForm
                isOpen={isFormOpen}
                onClose={onEditCompany}
                companyData={selectedCompany}
            />
        </ContainerWrapper>
    );
};

export default Companies;
