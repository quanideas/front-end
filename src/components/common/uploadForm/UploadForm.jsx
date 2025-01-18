"use client"

import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { postFileData } from '@/components/utils/UploadDownloadApi';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from './ProgressBar';
import axios from 'axios';

const END_POINT = "/project/upload-iteration"
const UPLOAD_TIMEOUT = 120000; // Set timeout duration (120 seconds)

const UploadForm = ({ isOpen, onClose }) => {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const project_id = searchParams.get('project_id');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0); // State to manage upload progress
  const [uploadToastId, setUploadToastId] = useState(null); // State to manage toast ID
  const [formData, setFormData] = useState({
    project_id: project_id,
    tile_3d: null,
    ortho_photo: null,
    geojson: null,
    revision_name: '', // Add revision_name to formData
  });

  const [show3DTiles, setShow3DTiles] = useState(true);
  const [showOrthophoto, setShowOrthophoto] = useState(false);
  const [showGeoJson, setShowGeoJson] = useState(false);
  const [modalClosedDuringUpload, setModalClosedDuringUpload] = useState(false); // Flag to track if modal was closed during upload

  // Refs for file input elements
  const tile3DRef = useRef(null);
  const orthoPhotoRef = useRef(null);
  const geojsonRef = useRef(null);
  const timeoutRef = useRef(null); // Ref to store the timeout ID
  const abortControllerRef = useRef(null); // Ref to store the AbortController

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form state when modal is closed
      setFormData({
        project_id: project_id,
        tile_3d: null,
        ortho_photo: null,
        geojson: null,
        revision_name: '', // Reset revision_name
      });
      setShow3DTiles(true);
      setShowOrthophoto(false);
      setShowGeoJson(false);
      setProgress(0);
      setIsUploading(false);
      setModalClosedDuringUpload(false); // Reset the flag
      setUploadToastId(null); // Reset the toast ID

      // Clear file input values using refs
      if (tile3DRef.current) tile3DRef.current.value = '';
      if (orthoPhotoRef.current) orthoPhotoRef.current.value = '';
      if (geojsonRef.current) geojsonRef.current.value = '';
    }
  }, [isOpen, project_id]);

  /**
   * Handles form submission to upload files.
   * @param {Object} e - Event object.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true); 

    // Create an AbortController to cancel the upload if needed
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Set a timeout to handle upload timeout
    timeoutRef.current = setTimeout(() => {
      abortController.abort(); // Cancel the upload
      toast.error(t('toast_message.upload_timeout'), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsUploading(false);
      setProgress(0);
      onClose();
    }, UPLOAD_TIMEOUT);

    // Create FormData object for file uploads
    let data = new FormData();
    data.append('project_id', formData.project_id);
    data.append('tile_3d', formData.tile_3d);
    data.append('ortho_photo', formData.ortho_photo);
    data.append('geojson', formData.geojson);
    data.append('revision', formData.revision_name); // Append revision_name

    try {
      // Call API using postFileData with FormData
      await postFileData(END_POINT, data, {
        signal: abortController.signal, // Pass the abort signal to the fetch request
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted); // Update progress state
          if (modalClosedDuringUpload && uploadToastId) {
            toast.update(uploadToastId, {
              render: `${t('toast_message.uploading_data')} ${percentCompleted}%`,
            });
          }
        }
      });

      clearTimeout(timeoutRef.current); // Clear the timeout if upload completes

      if (uploadToastId) {
        toast.update(uploadToastId, {
          render: t('toast_message.upload_data_success'),
          type: "success",
          autoClose: 2000,
        });
      } else {
        toast.success(t('toast_message.upload_data_success'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      // Reset form data on success
      setFormData({
        project_id: project_id,
        tile_3d: null,
        ortho_photo: null,
        geojson: null,
        revision_name: '', // Reset revision_name
      });
      setShow3DTiles(false);
      setShowOrthophoto(false);
      setShowGeoJson(false);
      onClose(); // Close modal on success
    } catch (error) {
      clearTimeout(timeoutRef.current); // Clear the timeout if an error occurs

      if (uploadToastId) {
        toast.update(uploadToastId, {
          render: t('toast_message.error_message'),
          type: "error",
          autoClose: 2000,
        });
      } else {
        if (!axios.isCancel(error)) {
          toast.error(t('toast_message.error_message'), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.log("Request canceled due to timeout or user action");
        }
      }
      console.error("Upload error", error);
    } finally {
      setIsUploading(false);
      setProgress(0); // Reset progress state
    }
  };

  /**
   * Handles input field changes for file uploads.
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target; // Use files for file input
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Save the file object or value in the correct field
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { checked } = e.target;
    if (!checked) {
      setFormData((prevData) => ({
        ...prevData,
        [type]: null, // Clear the file when checkbox is unchecked
      }));
    }
    switch (type) {
      case 'tile_3d':
        setShow3DTiles(checked);
        break;
      case 'ortho_photo':
        setShowOrthophoto(checked);
        break;
      case 'geojson':
        setShowGeoJson(checked);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    if (isUploading) {
      setModalClosedDuringUpload(true); // Set the flag
      if (!uploadToastId) {
        const toastId = toast.info(`${t('toast_message.uploading_in_background')}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setUploadToastId(toastId); // Save the toast ID
      }
    }
    onClose();
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the upload
    }
    setShow3DTiles(false);
    setShowOrthophoto(false);
    setShowGeoJson(false);
  };

  return (
    <div>     
      {isOpen  && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[500]"></div>
      )}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed inset-0 z-[500] justify-center items-center`}
      >
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
                  {isUploading ? (
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t('toast_message.uploading_data')}
                    </h2>
                  ) : (
                      <h3 className="text-lg font-semibold text-gray-900">
                    {t('general.add_data')}
                      </h3>
                  )}
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-red-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={handleClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleUpload}>
              {!isUploading && (
                <div className="grid gap-4 mb-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                    {t('general.choose_data_type')} 
                    </label>
                    <div className="flex items-center space-x-4">
                      <div>
                        <input
                          type="checkbox"
                          name="data-type"
                          id="3d-tiles"
                          checked={show3DTiles}
                          className="form-checkbox text-primary-600"
                          onChange={(e) => handleCheckboxChange(e, 'tile_3d')}
                        />
                        <label
                          htmlFor="3d-tiles"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          3D Tiles
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="data-type"
                          id="orthophoto"
                          checked={showOrthophoto}
                          className="form-checkbox text-primary-600"
                          onChange={(e) => handleCheckboxChange(e, 'ortho_photo')}
                        />
                        <label
                          htmlFor="orthophoto"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Imagery
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="data-type"
                          id="geo-json"
                          checked={showGeoJson}
                          className="form-checkbox text-primary-600"
                          onChange={(e) => handleCheckboxChange(e, 'geojson')}
                        />
                        <label
                          htmlFor="geojson"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          GeoJson
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <div className = "mb-4">
                      <label
                        htmlFor="revision_name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        {t('general.revision_name')}
                      </label>
                      <input
                        type="text"
                        name="revision_name"
                        id="revision_name"
                        value={formData.revision_name}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tile_3d"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        {t('general.upload_3d_tiles_data')} 
                      </label>
                      <input
                        type="file"
                        name="tile_3d"
                        id="tile_3d"
                        ref={tile3DRef} // Attach ref
                        onChange={handleChange}
                        disabled={!show3DTiles}
                        className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ortho_photo"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        {t('general.upload_imagery_data')} 
                      </label>
                      <input
                        type="file"
                        name="ortho_photo"
                        id="ortho_photo"
                        ref={orthoPhotoRef} // Attach ref
                        onChange={handleChange}
                        disabled={!showOrthophoto}
                        className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="geojson"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        {t('general.upload_geojson_data')} 
                      </label>
                      <input
                        type="file"
                        name="geojson"
                        id="geojson"
                        ref={geojsonRef} // Attach ref
                        onChange={handleChange}
                        disabled={!showGeoJson}
                        className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
              {isUploading && (
                <div>
                  <ProgressBar progress={progress} /> {/* Use the ProgressBar component */}
                </div>
              )}
              <div className="flex justify-end space-x-4">
                {!isUploading && (
                  <button
                    type="button"
                    className="text-gray-600 border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={() => {
                      cancelUpload();
                      onClose();
                    }}
                  >
                    {t('general.cancel')}
                  </button>
                )}
                {!isUploading && (
                  <button
                    type="submit"
                    onClick={handleUpload}
                    className="text-gray-600 bg-secondary hover:bg-secondary-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    {t('general.upload')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

UploadForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default UploadForm;