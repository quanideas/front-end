"use client";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "@/components/utils/UserApi";
import { useTranslation } from "next-i18next";

const END_POINT = "/company/update";

const EditCompanyForm = ({ isOpen, onClose, companyData }) => {
  const { t } = useTranslation("common");
  const [isDisabled, setIsDisabled] = useState(false);

  const toastOptions = {
    position: "top-center", // Change position as needed
    autoClose: 2000, // Set duration in milliseconds
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    toastId: "updateCompany",
  };

  const [formData, setFormData] = useState({
    company_id: "",
    name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    is_disabled: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (companyData) {
        setFormData(companyData);
        setIsDisabled(companyData.is_disabled);
      }
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, companyData]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? !isDisabled : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCompany = await postData(END_POINT, formData);

    if (updatedCompany) {
      toast.success(t("toast_message.update_company_success"), toastOptions);
      setFormData({
        company_id: "",
        name: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        is_disabled: false,
      });
      // setIsDisabled(false);
      onClose();
    } else {
      toast.error(t("toast_message.update_company_fail"), toastOptions);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[500]"></div>
      )}
      <div
        className={`${isOpen ? "flex" : "hidden"
          } fixed inset-0 z-[500] justify-center items-center`}
      >
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("general.update_company")}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-red-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
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
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-3">
                <div className="col-span-2">
                  <div className="py-4">
                    <label
                      htmlFor="name"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      {t("general.company_name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="text-gray-900 border-b border-gray-300 text-sm focus:border-b-primary-600 focus:border-t-0 focus:border-x-0 focus:ring-0 block w-full p-2"
                      placeholder={t("general.company_name")}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="py-4">
                    <label
                      htmlFor="address_line_1"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      {t("general.address")}
                    </label>
                    <input
                      type="text"
                      name="address_line_1"
                      id="address_line_1"
                      className="border-b border-gray-300 text-gray-900 text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                      placeholder={t("general.house_number_street_name")}
                      value={formData.address_line_1}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="address_line_2"
                      id="address_line_2"
                      className="border-b border-gray-300 text-gray-900 text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2 mt-2"
                      placeholder={t("general.district")}
                      value={formData.address_line_2}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className="border-b border-gray-300 text-gray-900 text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2 mt-2"
                      placeholder={t("general.province_city")}
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="py-4">
                    <label
                      htmlFor="country"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      {t("general.nation")}
                    </label>
                    <select
                      name="country"
                      id="country"
                      className="border-b border-gray-300 text-gray-900 text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t("general.choose_nation")}</option>
                      <option value="Vietnam">{t("general.viet_name")}</option>
                      <option value="United States">
                        {t("general.england")}
                      </option>
                      <option value="Japan">{t("general.japan")}</option>
                      <option value="South Korea">{t("general.korea")}</option>
                      <option value="United Kingdom">
                        {t("general.china")}
                      </option>
                      <option value="United Kingdom">
                        {t("general.russia")}
                      </option>
                      <option value="United Kingdom">{t("general.usa")}</option>
                    </select>
                  </div>
                  <div className="py-4">
                    {!isDisabled ? (
                      <div className="flex items-center p-2 rounded-md bg-red-100">
                        <input
                          id="disable-checkbox"
                          name="is_disabled"
                          type="checkbox"
                          checked={formData.is_disabled}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <label
                          htmlFor="disable-checkbox"
                          className="ml-2 text-sm text-red-500"
                        >
                          {t("general.disable_company")}
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center p-2 rounded-md bg-lime-100">
                        <input
                          id="enable-checkbox"
                          name="is_disabled"
                          type="checkbox"
                          checked={!formData.is_disabled}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <label
                          htmlFor="enable-checkbox"
                          className="ml-2 text-sm text-primary"
                        >
                          {t("general.enable_company")}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center w-full">
                    <Image
                      src="/images/common/company.png"
                      alt="Company image"
                      width={150}
                      height={150}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="text-gray-600 border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  onClick={onClose}
                >
                  {t("general.cancel")}
                </button>
                <button
                  type="submit"
                  className="text-gray-600 bg-secondary hover:bg-secondary-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  {t("general.update_company")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EditCompanyForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  companyData: PropTypes.object.isRequired,
};

export default EditCompanyForm;
