
import React from 'react';
import Link from 'next/link';

const NavRoute = ({ backRoute, origin, target }) => {
  return (
    <div className="flex items-center p-2 space-x-2 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm sm:text-sm sm:space-x-4">
      <Link href={backRoute}>
        <li className="flex items-center hover:text-blue-600 group">
        {origin}
          <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-0 group-hover:rotate-180 transition-transform" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
          </svg>
        </li>
      </Link>
      <li className="flex items-center">{target}</li>
    </div>
  );
};

export default NavRoute;