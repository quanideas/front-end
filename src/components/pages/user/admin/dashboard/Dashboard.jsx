"use client"
import { useState, useEffect, useCallback } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Pagination from '@/components/common/pagination/Pagination';
import { postData } from '@/components/utils/ProjectApi';
import Overview from '@/components/pages/user/admin/dashboard/Overview';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';

import MapProjects from '@/components/common/mapProjects/MapProjects';
import { useTranslation } from 'next-i18next';


const END_POINT = '/project/get-all';
// Get count based on screen size
const getCountBasedOnScreenSize = () => {
    if (typeof window === 'undefined') {
      return 0; // Server-side rendering
    }
    const width = window.innerWidth;
    if (width < 500) {
      return 5; // Small screen
    } else if (width < 1441) {
      return 8; // Small screen
    } else if (width < 1921) {
      return 10; // Medium screen
    } else {
      return 10; // Large screen
    }
  };
  

const Dashboard = () => {

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

    // Get Projects
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);


    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const fetchProjects = useCallback(async (page) => {
        setLoading(true);
        const response = await postData(END_POINT, {
            page,
            count: count,
            sort: [],
        });
        setProjects(response.Data.List);
        setTotalPages(Math.ceil(response.Data.Total / count));
        setLoading(false);
    }, []);


    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage, fetchProjects]);

    // Handle sort
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const sortedProjects = [...projects].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    console.log(projects);

    return (
        <ContainerWrapper>
            <div className="bg-gray-100 min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-4 gap-4 h-full">
                    <div className="lg:col-span-2 lg:row-span-1 bg-gray-100">
                        <Overview />
                    </div>
                    <div className="lg:col-span-1 lg:row-span-4 bg-gray-100 h-[200px] md:h-[200px] lg:h-[550px] xl:h-[680px] 2xl:h-[750px]">
                        <MapProjects projects={projects} />
                    </div>
                    <div className="lg:col-span-2 lg:row-span-3 rounded-lg  bg-gray-100">
                        <div>
                            <div className="mx-auto max-w-screen-xl">
                                <div className="bg-white sm:rounded-lg overflow-hidden md:h-[200px]  lg:h-[310px] xl:h-[445px] 2xl:h-[510px]">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-sm text-gray-700 uppercase bg-primary-gradient">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 w-4/6 ">
                                                        <button type="button" onClick={() => requestSort('first_name')}>
                                                        {t('general.project_name')}{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                                        </button>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 w-1/6 text-right">
                                                        <button type="button" onClick={() => requestSort('is_admin')}>
                                                        {t('general.last_update')}{sortConfig.key === 'modified_time' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                                        </button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedProjects.map((project, index) => (
                                                    <tr key={index} className=" border-b hover:bg-slate-50">
                                                        <th scope="row" className="px-4 py-3 font-extralight text-gray-900">
                                                            {project.name}
                                                        </th>
                                                        <th scope="row" className="px-4 py-3 text-right font-extralight text-gray-900 whitespace-nowrap">

                                                            <div className="flex items-center justify-between">
                                                                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                                <p>
                                                                    {new Date(project.modified_time).toLocaleDateString('en-GB', {
                                                                        year: 'numeric',
                                                                        month: '2-digit',
                                                                        day: '2-digit'
                                                                    }).replace(/\//g, '-')}
                                                                </p>
                                                            </div>
                                                        </th>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default Dashboard;
