import React from 'react';
import { useTranslation } from 'next-i18next';

const Pagination = ({ currentPage, totalPages, setCurrentPage, handlePrevious, handleNext }) => {
    const { t } = useTranslation("common");
    return (
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            {t('general.showing')} <span className="font-semibold text-gray-900">{currentPage}</span> {t('general.of')} <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <button
                        onClick={handlePrevious}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        {t('general.previous')}
                    </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                        <button
                            onClick={() => setCurrentPage(index + 1)}
                            className={`${currentPage === index + 1
                                ? "flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                                : "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                }`}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={handleNext}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        {t('general.next')}
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
