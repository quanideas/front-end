"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/pagination/Pagination';
import SearchByCategories from '@/components/common/searchByCategories/SearchByCategories';
import CompanyCard from '@/components/pages/user/share/companyCard/CompanyCard';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import slugify from '@/components/utils/Slugify';
import { postData } from '@/components/utils/UserApi';
import { useTranslation } from 'next-i18next';

const END_POINT = '/company/get-all';

// Get count based on screen size
const getCountBasedOnScreenSize = () => {
  if (typeof window === 'undefined') {
    return 0; // Server-side rendering
  }
  const width = window.innerWidth;
  if (width < 1441) {
    return 10; // Small screen
  } else if (width < 1921) {
    return 15; // Medium screen
  } else {
    return 15; // Large screen
  }
};

// Main component
const CompaniesHandler = () => {
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
  const categories = {
    "Name": 'name',
    "Update date": 'modified_time',
  };

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    key: '',
    value: ''
  });

  // Fetch companies
  const fetchCompanies = useCallback(async (page, query = '') => {
    setLoading(true);
    console.log(query);
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

  const handleCompanyClick = useCallback((path, company_id) => {
    router.push(`${path}?company_id=${company_id}`);
  }, [router]);

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

  return (
    <ContainerWrapper>
      <div className="px-4">
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
      <div className="p-6">
        <h2 className="text-2xl text-gray-700 font-bold">{t('general.company_list')}</h2>
        <p className="my-2 text-sm text-gray-500">{t('general.choose_one_company_to_see_users')}</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
        {companies.map((company, index) => (
          <CompanyCard
            key={company.id}
            company={company}
            onClick={() => handleCompanyClick(`/root/users/${slugify(company.name)}`, company.id)}>

          </CompanyCard>

        ))}
      </div>
      <div className="px-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          handlePrevious={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          handleNext={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        />
      </div>
    </ContainerWrapper>
  );
};

export default CompaniesHandler;
