'use client'
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
const CesiumView2D = lazy(() => import('@/components/common/projectWorkspace/cesiumView2D/CesiumView2D'));
const CesiumView3DTiles = lazy(() => import('@/components/common/projectWorkspace/cesiumView3DTiles/CesiumView3DTiles'));
import LoadingPage from '@/components/common/loadingPage/LoadingPage';

const VersionDropdown = ({ projectIteration }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [latestIteration, setLatestIteration] = useState(null);
  const [activeView, setActiveView] = useState('2D');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (projectIteration && projectIteration.length > 0) {
      const sortedIterations = [...projectIteration].sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
      setLatestIteration(sortedIterations[0]);
      if (sortedIterations[0].tile_3d_url) {
        setActiveView('3D');
      } else if (sortedIterations[0].geojson_url || sortedIterations[0].ortho_photo_url) {
        setActiveView('2D');
      }
    }

  }, [projectIteration]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleIterationChange = (iteration) => {
    setLatestIteration(iteration);
    if (iteration.tile_3d_url) {
      setActiveView('3D');
    } else if (iteration.geojson_url || iteration.ortho_photo_url) {
      setActiveView('2D');
    }
    setIsOpen(false); // Close dropdown after selection
  };

  const handleViewSwitch = (view) => {
    setActiveView(view);
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Render the view component based on active view */}
      <Suspense fallback={LoadingPage}>
        <div className="absolute inset-0 z-0">
          {activeView === '3D' && latestIteration?.tile_3d_url && (
            <CesiumView3DTiles url={latestIteration.tile_3d_url} />
          )}
          {activeView === '2D' && (latestIteration?.geojson_url || latestIteration?.ortho_photo_url) && (
            <CesiumView2D urlGeoJson={latestIteration.geojson_url} urlImagery={latestIteration.ortho_photo_url} />
          )}
        </div>
      </Suspense>

      {/* Overlay buttons and dropdown */}
      <div className="absolute top-12 md:top-2 left-3 md:left-auto md:right-24 z-10 flex">
        <div>
          <button
            onClick={toggleDropdown}
            className="flex items-center h-8 justify-center w-full rounded-md shadow-md px-2 bg-white bg-opacity-75 backdrop-blur-lg text-sm  text-gray-700 focus:outline-none"
          >
            <span className="pr-2">Bản cập nhật:</span>
            <span className="bg-primary px-2 rounded">
              {latestIteration ? latestIteration.revision: "Chưa đặt tên"}
            </span>
            <span className="px-2 rounded">
              {latestIteration ? new Date(latestIteration.modified_time).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : "DATE"}
            </span>
            <svg
              className="-mr-1 ml-2 h-5 w-5 hover:text-primary-hover"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div ref={dropdownRef} className="relative flex flex-cols">
            <div className="absolute left-1/2 transform -translate-x-1/2 md:right-0 md:-translate-x-full z-20 mt-12 w-52 rounded-md shadow-lg bg-white bg-opacity-75 backdrop-blur-lg ring-1 ring-black ring-opacity-5">
              <div>
                {projectIteration.length <= 1 ? (
                  <div className="px-4 py-1 text-sm text-gray-700">
                    Không có bản cập nhật mới
                  </div>
                ) : (
                  projectIteration
                    .filter((item) => item.modified_time !== latestIteration.modified_time) // Hide selected iteration
                    .map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleIterationChange(item)}
                        className="flex  text:sm md:text-base justify-between px-4 py-1 text-sm text-gray-700 hover:bg-gray-200 hover:rounded-md cursor-pointer"
                      >
                        <span className = "text-sm border-b ">
                        <span className="px-2 rounded text-sm bg-blue-300 truncate max-w-8 overflow-hidden">
                            {item.revision}
                          </span>
                          <span className="px-2 rounded text-sm">
                            {new Date(item.modified_time).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
                          </span>
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3D and 2D buttons */}
        <div className="flex items-center h-8 rounded-md z-10 mx-2 shadow-md bg-white bg-opacity-75 backdrop-blur-lg">
          <button
            onClick={() => handleViewSwitch('3D')}
            className={`text-gray-700 font-bold py-1 px-2 rounded-md ${latestIteration?.tile_3d_url ? ' hover:bg-primary-hover' : 'cursor-not-allowed opacity-50'} ${activeView === '3D' ? 'bg-primary text-white' : ''}`}
            disabled={!latestIteration?.tile_3d_url}
          >
            3D
          </button>
        </div>

        <div className="flex items-center h-8 rounded-md z-10 mx-l-2 shadow-md bg-white bg-opacity-75 backdrop-blur-lg">
          <button
            onClick={() => handleViewSwitch('2D')}
            className={`text-gray-700 font-bold py-1 px-2 rounded-md ${latestIteration?.geojson_url || latestIteration?.ortho_photo_url ? 'hover:bg-primary-hover' : 'cursor-not-allowed opacity-50'} ${activeView === '2D' ? 'bg-primary text-white' : ''}`}
            disabled={!latestIteration?.geojson_url && !latestIteration?.ortho_photo_url}
          >
            2D
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionDropdown;
