"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import Image from "next/legacy/image";
import ActionButton from '@/components/common/actionButton/ActionButton';

import UploadForm from '@/components/common/uploadForm/UploadForm';
import UpdateAssetForm from '@/components/common/updateAssetForm/UpdateAssetForm';
import NavRoute from '@/components/pages/user/share/navRoute/NavRoute';
import ContainerWrapper from '@/components/pages/user/share/containerWrapper/ContainerWrapper';
import { postData } from '@/components/utils/ProjectApi';
import { postData as postAsset } from '@/components/utils/UploadDownloadApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Endpoint to get project data by ID
const END_POINT_GET_PRJ_BY_ID = '/project/get';
const END_POINT_DELETE = '/project/remove-iteration';

/**
 * ProjectAssets component
 * Displays a list of assets for a given project and allows the user to upload new assets.
 */
const ProjectAssets = () => {
    // Translation hook
    const { t } = useTranslation("common");

    const toastOptions = {
        position: "top-center", // Change position as needed
        autoClose: 2000, // Set duration in milliseconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      };

    // State to manage project assets and loading status
    const [projectAssets, setProjectAssets] = useState({ ProjectIteration: [] });
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [iterationId, setIterationId] = useState(null);

    const [existingAssets, setExistingAssets] = useState({});

    // Hooks for current path and query parameters
    const currentPath = usePathname();
    const searchParams = useSearchParams();

    /**
     * Fetches project assets from the API based on the project ID from the search params.
     * Uses useCallback to memoize the function and avoid re-creating it on each render.
     */
    const fetchProjectAssets = useCallback(async () => {
        setLoading(true);
        try {
            const projectId = searchParams.get('project_id');
            const data = await postData(END_POINT_GET_PRJ_BY_ID, { id: projectId });
            if (data?.Data) {
                setProjectAssets(data.Data);
            }
        } catch (error) {
            console.error("Failed to fetch project assets", error);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    // Fetch project assets when the component mounts or when the search params change
    useEffect(() => {
        fetchProjectAssets();
    }, [fetchProjectAssets]);

    // Toggles the state of the upload form modal
    const toggleModal = () => {
        setIsOpen(prev => !prev);
    };

    // On successful asset upload, add the new asset to the project assets list
    const onAddAsset = () => {
        setIsOpen(false);
        fetchProjectAssets();
    };

    const closeEditForm = () => {
        setIsEdit(prev => !prev);
    };

    const openEditForm = (iterationId, index) => {
        setExistingAssets({
            tile3dUrl: projectAssets.ProjectIteration[index].tile_3d_url,
            orthoPhotoUrl: projectAssets.ProjectIteration[index].ortho_photo_url,
            geojsonUrl: projectAssets.ProjectIteration[index].geojson_url
          })
        setIterationId(iterationId);
        setIsEdit(true);
    };

    const handleDelete = (iterationId) => {
        const deleteAsset = async () => {
            try {
                // Call API to delete the asset
                await postAsset(END_POINT_DELETE, { id: iterationId });
                
                // Update the state to remove the deleted asset
                setProjectAssets(prev => ({
                    ...prev,
                    ProjectIteration: prev.ProjectIteration.filter(asset => asset.id !== iterationId)
                }));
                toast.success(t('toast_message.delete_iteration_success') , toastOptions);
            } catch (error) {
                console.error("Failed to delete project asset", error);
                toast.error(t('toast_message.delete_iteration_fail') , toastOptions);
            }
        };
    
        // Call the deleteAsset function
        deleteAsset();
    };

    // Construct the route for navigation back to the project management page
    const backRoute = `${currentPath.replace("/assets", "")}?company_id=${projectAssets.company_id}`;

    return (
        <ContainerWrapper>
            <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    {/* Navigation route component */}
                    <NavRoute 
                        backRoute={backRoute} 
                        origin={projectAssets.name} 
                        target={t('general.project_asset_manager')} 
                    />
                    {/* Upload button */}
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="flex items-center justify-between text-black border bg-gray-100 hover:shadow-md hover:shadow-secondary-light focus:ring-2 focus:ring-primary font-medium rounded-lg text-sm px-4 py-2 space-x-2"
                        >
                            <Image 
                                src="/icons/common/upload.svg" 
                                alt="Upload Icon" 
                                width="25" 
                                height="25" 
                                className="border mx-2 rounded-lg" 
                            />
                            <span>{t('general.upload')} </span>
                        </button>
                    </div>
                </div>

                {/* Table displaying project assets */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-primary-gradient">
                            <tr>
                                <th className="px-4 py-2 w-20 text-center">{t('general.order')}</th>
                                <th className="px-4 py-2 w-44">{t('general.create_date')}</th>
                                <th className="px-4 py-2 w-50">{t('general.revision_name')}</th>
                                <th className="px-4 py-2 text-left">{t('general.data_type')}</th>
                                <th className="px-4 py-2 w-32 text-center">{t('general.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectAssets.ProjectIteration?.length > 0 ? (
                                projectAssets.ProjectIteration.map((asset, index) => (
                                    <tr key={index} className="border-b hover:bg-slate-50">
                                        <th scope="row" className="px-4 py-2 w-8 font-medium text-gray-900 text-center">{index + 1}</th>
                                        <td className="px-4 py-2">{new Date(asset.created_time).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{asset.revision}</td>
                                        <td className="flex px-4 py-2 items-center justify-start space-x-2">
                                            {asset.tile_3d_url && (
                                                <div className="flex flex-col items-left">
                                                    <p className="text-gray-800 text-sm border border-blue-300 rounded-md px-1">3D Tiles</p>
                                                </div>
                                            )}
                                            {asset.ortho_photo_url && (
                                                <div className="flex flex-col items-left">
                                                    <p className="text-gray-800 text-sm border border-yellow-300 rounded-md px-1">Imagery</p>
                                                </div>
                                            )}
                                            {asset.geojson_url && (
                                                <div className="flex flex-col items-left">
                                                    <p className="text-gray-800 text-sm border border-fuchsia-300 rounded-md px-1">GeoJson</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className=" px-4 py-2 ">
                                            <ActionButton
                                                onEdit={() => openEditForm(asset.id, index)}
                                                onDelete={() => handleDelete(asset.id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-2   text-center">
                                        {loading ? t("Loading...") : t("No data available")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload form modal */}
            <UploadForm 
                isOpen={isOpen} 
                onClose={onAddAsset} 
            />
            {/* Update form modal */}
            <UpdateAssetForm 
                isOpen={isEdit} 
                onClose={closeEditForm} 
                onUpdateAsset={(newAsset) => 
                    setProjectAssets(prev => ({
                        ...prev,
                        ProjectIteration: [...prev.ProjectIteration, newAsset]
                    }))
                }
                iterationId={iterationId}
                existingAssets =  {existingAssets}
            />
        </ContainerWrapper>
    );
};

export default ProjectAssets;
