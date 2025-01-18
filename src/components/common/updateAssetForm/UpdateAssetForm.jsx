"use client";

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { postFileData } from '@/components/utils/UploadDownloadApi';

const END_POINT = "/project/edit-iteration"; // Change endpoint to reflect asset editing

const UpdateAssetForm = ({ isOpen, onClose, iterationId, onUpdateAsset, existingAssets }) => {

  const [formData, setFormData] = useState({
    id: iterationId,
    tile_3d: null,
    ortho_photo: null,
    geojson: null,
    removeTile3D: false,
    removeOrthoPhoto: false,
    removeGeoJson: false,
  });

  /**
   * Handles form submission to update files and possibly remove old ones.
   * @param {Object} e - Event object.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
  
    // Create FormData object for file uploads
    let data = new FormData();
    data.append('id', iterationId);

    // Only append files if they exist
    data.append('tile_3d', formData.tile_3d);
    data.append('ortho_photo', formData.ortho_photo);
    data.append('geojson', formData.geojson);

    // Append remove options
    data.append('removeTile3D', formData.removeTile3D);
    data.append('removeOrthoPhoto', formData.removeOrthoPhoto);
    data.append('removeGeoJson', formData.removeGeoJson);

    try {
      // Call API using postData with FormData
      const editedAsset = await postFileData(END_POINT, data);

      if (editedAsset) {
        // Reset form data and close modal on success
        onUpdateAsset(editedAsset["Data"]);
        setFormData({
          id: iterationId,
          tile_3d: null,
          ortho_photo: null,
          geojson: null,
          removeTile3D: false,
          removeOrthoPhoto: false,
          removeGeoJson: false,
        });
        onClose();
      } else {
        // Handle failure (e.g., toast notification)
      }
    } catch (error) {
      // Handle errors (e.g., toast notification)
    }
  };

  /**
   * Handles input field changes for file uploads.
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    const { name, files } = e.target; // Use files for file input
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Save the file object in the correct field
    }));
  };

  const handleRemoveChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };


  return (
    <div>
      {isOpen && (
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
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa dữ liệu
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-red-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => {
                    onClose();
                }}
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
            <form action="#">
              <div className="grid gap-4 mb-4 sm:grid-cols-3">
                {/* File Inputs with Remove Options */}
                {existingAssets.tile3dUrl && (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="tile_3d"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Tải dữ liệu 3D Tiles
                    </label>
                    <input
                      type="file"
                      name="tile_3d"
                      id="tile_3d"
                      onChange={handleChange}
                      className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                    />
                    <div className="mt-2">
                      <label htmlFor="removeTile3D" className="text-sm">
                        <input
                          type="checkbox"
                          name="removeTile3D"
                          checked={formData.removeTile3D}
                          onChange={handleRemoveChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Ghi đè dữ liệu 3D Tiles</span>
                      </label>
                    </div>
                  </div>
                )}

                {existingAssets.orthoPhotoUrl && (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="ortho_photo"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Tải dữ liệu ảnh trực giao
                    </label>
                    <input
                      type="file"
                      name="ortho_photo"
                      id="ortho_photo"
                      onChange={handleChange}
                      className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                    />
                    <div className="mt-2">
                      <label htmlFor="removeOrthoPhoto" className="text-sm">
                        <input
                          type="checkbox"
                          name="removeOrthoPhoto"
                          checked={formData.removeOrthoPhoto}
                          onChange={handleRemoveChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Ghi đè ảnh trực giao</span>
                      </label>
                    </div>
                  </div>
                )}

                {existingAssets.geojsonUrl && (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="geojson"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Tải dữ liệu GeoJson
                    </label>
                    <input
                      type="file"
                      name="geojson"
                      id="geojson"
                      onChange={handleChange}
                      className="appearance-none block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                    />
                    <div className="mt-2">
                      <label htmlFor="removeGeoJson" className="text-sm">
                        <input
                          type="checkbox"
                          name="removeGeoJson"
                          checked={formData.removeGeoJson}
                          onChange={handleRemoveChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Ghi đè dữ liệu GeoJson</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                className="inline-flex items-center justify-end px-4 py-2 bg-secondary text-black text-sm font-medium rounded-md hover:bg-secondary-hover focus:outline-none"
              >
                Cập nhật dữ liệu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

UpdateAssetForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  iterationId: PropTypes.string.isRequired,  
  onUpdateAsset: PropTypes.func.isRequired,
  existingAssets: PropTypes.object.isRequired,
};

export default UpdateAssetForm;
