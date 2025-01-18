"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from "next/legacy/image";
import SearchByCategories from '@/components/common/searchByCategories/SearchByCategories';
import NavRoute from '@/components/pages/user/share/navRoute/NavRoute';
import Pagination from '@/components/common/pagination/Pagination';
import { postData } from '@/components/utils/ProjectApi';
import AddProjectForm from '@/components/common/addProjectForm/AddProjectForm';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import { useTranslation } from 'next-i18next';


const END_POINT = '/project/get-all';
const DEFAULT_AVATAR_SRC = '/images/common/projects.png';

// Get count based on screen size
const getCountBasedOnScreenSize = () => {
    if (typeof window === 'undefined') {
      return 0; // Server-side rendering
    }
    const width = window.innerWidth;
    if (width < 1441) {
      return 5; // Small screen
    } else if (width < 1921) {
      return 5; // Medium screen
    } else {
      return 8; // Large screen
    }
  };

const CompanyProjects = ({ backRoute, isRoot = true }) => {
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

    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const currentPath = usePathname()
    const searchParams = useSearchParams();
    const companyId = searchParams.get('company_id');

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const categories = {
        [t('general.project_name')]: 'name',
        [t('general.share_level')]: 'share_level',
        [t('general.update_date')]: 'modified_time',
    };
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        key: '',
        value: ''
    });


    const fetchProjects = useCallback(async (page, query = '') => {
        setLoading(true);
        const response = await postData(END_POINT, {
            page,
            count: count,
            sort: [],
            search: query ? [{ by: query.key, value: query.value }] : [],
            company_id: isRoot ? companyId : null
        });
        setProjects(response.Data.List);
        setTotalPages(Math.ceil(response.Data.Total / count));
        setLoading(false);
    }, []);


    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage, fetchProjects]);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Toggle modal
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    // On add project
    const onAddProject = () => {
        setIsOpen(false);
        fetchProjects(currentPage);
    };


    // Search logic
    const handleSearch = useCallback(() => {
        setIsSearching(true);
        fetchProjects(1, searchQuery);  // Call API with search query
        setCurrentPage(1);  // Reset to the first page
    }, [searchQuery, fetchProjects]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');  // Clear search query
        setIsSearching(false);
        fetchProjects(1);  // Fetch all companies again
        setSearchQuery({ key: '', value: '' });
    }, [fetchProjects]);

    // Go to upload page
    const handleUpload = (projectId) => {
        router.push(`${currentPath}/assets?project_id=${projectId}`);
    };

    // Go to upload page
    const handleEnterProject = (projectId) => {
        router.push(`${currentPath}/workspace?project_id=${projectId}`);
    };

    return (
        <ContainerWrapper>
            <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-3 md:space-y-0 md:space-x-4">
                    {backRoute && <NavRoute backRoute={backRoute} origin={t('general.companies')} target={t('general.projects')} />}
                    <div className="flex justify-end items-center space-x-3">
                        {isRoot && (
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="flex items-center text-black bg-lime-300 hover:bg-lime-500 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
                            >
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                                {t('general.add_project')}
                            </button>
                        )}
                    </div>
                </div>
                <div className="pb-4 pl-4">
                    <SearchByCategories
                        categories={categories}
                        onSearch={handleSearch}
                        searchQuery={searchQuery}  // Pass searchQuery
                        setSearchQuery={setSearchQuery}  // Pass setSearchQuery
                    />
                    {isSearching && (
                        <div className="flex  mt-2">
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

                <div className="p-4 space-y-4">
                    {projects.map((project, index) => (
                        <div key={index} className="flex items-center cursor-pointer  justify-between bg-white p-4 shadow rounded-lg border border-gray-200 hover:bg-gray-50"
                            onClick={() => handleEnterProject(project.id)}>
                            <div className="flex items-top sm:w-1/2 space-x-4">
                                <Image src={DEFAULT_AVATAR_SRC} alt={project.name} width={80} height={80} className="rounded-lg bg-gray-200" />
                                <div>
                                    <h2 className="text-gray-800 font-semibold py-2">{project.name}</h2>
                                    <p className="text-gray-600 font-extralight xl:font-light text-sm">{t('general.last_update')}: {new Date(project.modified_time).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="hidden md:flex space-x-8">
                                <div className=" flex flex-col items-left space-y-4">
                                    <p className="text-gray-500 text-sm"><span className="text-blue-500 font-bold">| </span>{t('general.num_of_update')}</p>
                                    <p className="text-gray-800 font-extralight xl:font-light px-2 text-sm">0</p>
                                </div>
                                <div className="   flex flex-col items-left space-y-4">
                                    <p className="text-gray-500 text-sm"><span className="text-yellow-500 font-bold">| </span>{t('general.share_level')}</p>
                                    <p className="text-gray-800 font-extralight xl:font-light px-2 text-sm">{t('general.public')}</p>
                                </div>
                            </div>
                            {isRoot && (
                            <div className="border rounded-md border-gray-200 py-4 px-4 hover:bg-gray-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpload(project.id);
                                }}
                            >
                                <Image src="/icons/common/upload.svg" alt="Logo" width="40" height="40" className="border p-1 rounded-lg" />
                            </div> )}
                        </div>
                    ))}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
            />
            <AddProjectForm isOpen={isOpen} onClose={onAddProject} />
        </ContainerWrapper>
    );
};

export default CompanyProjects;
