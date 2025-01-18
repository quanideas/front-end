"use client"
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from "next/legacy/image";
import SearchByCategories from '@/components/common/searchByCategories/SearchByCategories';
import Pagination from '@/components/common/pagination/Pagination';
import { postData } from '@/components/utils/ProjectApi';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import MapProjects from '@/components/common/mapProjects/MapProjects';
import { useTranslation } from 'next-i18next';

const DEFAULT_AVATAR_SRC = '/images/common/projects.png';
const END_POINT = '/project/get-all';
// Get count based on screen size
const getCountBasedOnScreenSize = () => {
  if (typeof window === 'undefined') {
    return 0; // Server-side rendering
  }
  const width = window.innerWidth;
  if (width < 640) {
    return 4; // xs
  } else if (width >= 640 && width < 768) {
    return 4; // sm
  } else if (width >= 768 && width < 1024) {
    return 4; // md
  } else if (width >= 1024 && width < 1280) {
    return 4; // lg
  } else if (width >= 1280 && width < 1536) {
    return 5; // xl
  } else {
    return 5; // 2xl
  }
};

const Projects = () => {
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
  const router = useRouter();
  const currentPath = usePathname()


  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = {
    [t('general.project_name')]: 'name',
    [t('general.share_level')]: 'share_level',
    [t('general.update_date')]: 'modified_time',
    [t('general.location')]: 'location',
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
  const handleEnterProject = (projectId) => {
    router.push(`${currentPath}/workspace?project_id=${projectId}`);
  };

  return (
    <ContainerWrapper>
      <div className="bg-gray-100">
        <div className="grid grid-cols-1 grid-rows-3 lg:grid-cols-5 lg:grid-rows-1 gap-4 h-full">
          <div className="order-2 row-span-2 lg:col-span-2 lg:row-span-1 rounded-lg">
            <div>
              <div className="w-full space-y-2">
                <SearchByCategories
                  categories={categories}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}  // Pass searchQuery
                  setSearchQuery={setSearchQuery}  // Pass setSearchQuery
                />
                {isSearching && (
                  <div className="flex mt-2">
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
                <div className="h-[480px] md:h-[450px] lg:h-[453px] xl:h-[583px] 2xl:h-[655px]">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-top mt-2 justify-between bg-white p-4 cursor-pointer  shadow rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition duration-300 ease-in-out"
                      onClick={() => handleEnterProject(project.id)}
                    >
                      <div className="w-2/3 ">
                        <h2 className="text-gray-800 font-semibold py-2">{project.name}</h2>
                        <p className="text-gray-600 text-xs">{project.address}</p>
                        <p className="text-gray-600 text-xs truncate ...">{t('general.last_update')}: {new Date(project.modified_time).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-xs">{t('general.num_of_update')}: 3</p>
                      </div>
                      <div className="w-[75px] md:h-[75px] 2xl:w-[90px] 2xl:h-[90px]">
                    <Image 
                      src={DEFAULT_AVATAR_SRC} 
                      alt={project.name} 
                      layout="responsive" 
                      width={120} 
                      height={120} 
                      className="rounded-lg" 
                    />
                  </div>
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
            </div>
          </div>
          <div className="order-1 lg:col-span-3 lg:row-span-1 bg-gray-100 h-[300px] md:h-[300px] lg:h-[550px] xl:h-[680px] 2xl:h-[750px]">
            <MapProjects projects={projects} />
          </div>
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default Projects;
