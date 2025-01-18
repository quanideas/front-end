'use client'
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { FaArrowLeft, FaBook, FaExclamationCircle } from "react-icons/fa";
import VersionDropdown from "./VersionDropdown";
import { useSearchParams, usePathname } from 'next/navigation';
import { postData } from '@/components/utils/ProjectApi';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';

// Endpoint to get project data by ID
const END_POINT_GET_PRJ_BY_ID = '/project/get';

const Navigator = () => {
  const [projectInfo, setProjectInfo] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

  const currentPath = usePathname()
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const fetchProjectInfo = useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await postData(END_POINT_GET_PRJ_BY_ID, { id: projectId });
      if (data?.Data) {
        console.log(data);
        setProjectInfo(data.Data);
      }
    } catch (error) {
      console.error("Failed to fetch project info", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProjectInfo();
  }, [fetchProjectInfo]);

  if (loading) {
    return <LoadingPage />;
  }

// Construct the route for navigation back to the project management page
const backRoute = projectInfo ? `${currentPath.replace("/workspace", "")}?company_id=${projectInfo.company_id}` : "";

  return (
    <div>
    <div className="fixed flex item-center top-0 left-0 mx-3 my-2 z-50">
      <header className="flex items-center bg-white bg-opacity-75 backdrop-blur-lg rounded-md h-8 shadow-md">
        <div className="container mx-auto px-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/common/logo_1.jpg"
              alt="Logo"
              width="100"
              height="40"
              className="border border-gray-300 rounded-lg"
            />
            {projectInfo && ( // Check if projectInfo is not null before accessing its properties
              <span className="hidden md:block text-gray-800 text-sm mx-4 px-4 border-x">
                {projectInfo.name.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <Link
              href={backRoute}
              className="flex items-center border border-gray-800 text-gray-700 hover:text-primary-hover hover:border-primary-hover font-bold py-1 px-2 rounded-md mx-2"
            >
              <FaArrowLeft className="mr-1" />
            </Link>
            <Link
              href="/user/projects"
              className="bg-primary hover:bg-primary-hover text-sm text-white font-bold py-1 px-2 rounded-md"
            >
              Chia sẻ
            </Link>
          </div>
        </div>
      </header>
    </div>
      {projectInfo && ( // Check if projectInfo is not null before passing it to VersionDropdown
        <VersionDropdown projectIteration={projectInfo.ProjectIteration} />
      )}
    </div>
  );
};

export default Navigator;
