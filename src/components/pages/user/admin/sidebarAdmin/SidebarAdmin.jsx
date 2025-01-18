"use client"
import Image from "next/legacy/image"
import { usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import Link from 'next/link'

const SidebarAdmin = () => {
   const currentPath = usePathname();
   const { t } = useTranslation("common");

   return (
      <div className='fixed mt-20 z-[100] border border-t sm:border-0 bottom-0 sm:bottom-auto'>
         <aside id="logo-sidebar" className="w-screen px-4 sm:px-0 sm:top-0 sm:left-0 sm:z-40 rounded-r-2xl sm:w-full xl:w-52 pt-2 sm:h-screen transition-transform  bg-white  sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto ">
               <ul className="flex sm:flex-col justify-between sm:space-y-2 space-x-4 sm:space-x-0 font-medium">
                     <li>
                        <Link href="/admin/dashboard" className={`flex flex-row items-center justify-left ${currentPath === '/admin/dashboard' ? 'bg-gray-200' : ''} border-b border-gray-300 p-2 text-gray-900 rounded-lg hover:bg-gray-200 group`}>
                           <Image src="/icons/common/dashboard.svg" alt="Logo" width="40" height="40" className="border p-1 border-gray-300 rounded-lg" />
                           <span className="hidden xl:block pl-4 mt-2 whitespace-nowrap text-sm">{t('sidebarAdmin.dashboard')}</span>
                        </Link>
                     </li>

                     <li>
                        <Link href="/admin/projects" className={`flex flex-row items-center justify-left ${currentPath === '/admin/projects' ? 'bg-gray-200' : ''} border-b border-gray-300 p-2 text-gray-900 rounded-lg hover:bg-gray-200 group`}>
                           <Image src="/icons/common/projects.svg" alt="Logo" width="40" height="40" className="border p-1 border-gray-300 rounded-lg" />
                           <span className="hidden xl:block pl-4 mt-2 whitespace-nowrap text-sm">{t('sidebarAdmin.projects')}</span>
                        </Link>
                     </li>
                     <li>
                        <Link href="/admin/users" className={`flex flex-row items-center justify-left ${currentPath === '/admin/users' ? 'bg-gray-200' : ''} border-b border-gray-300 p-2 text-gray-900 rounded-lg hover:bg-gray-200 group`}>
                           <Image src="/icons/common/users.svg" alt="Logo" width="40" height="40" className="border p-1 border-gray-300 rounded-lg" />
                           <span className="hidden xl:block pl-4 mt-2 whitespace-nowrap text-sm">{t('sidebarAdmin.users')}</span>
                        </Link>
                     </li>
                     <li>
                        <Link href="/admin/role-permission" className={`flex flex-row items-center justify-left ${currentPath === '/admin/role-permission' ? 'bg-gray-200' : ''} border-b border-gray-300 p-2 text-gray-900 rounded-lg hover:bg-gray-200 group`}>
                           <Image src="/icons/common/permission.svg" alt="Logo" width="40" height="40" className="border p-1 border-gray-300 rounded-lg" />
                           <span className="hidden xl:block pl-4 mt-2 whitespace-nowrap text-sm">{t('sidebarAdmin.permission')}</span>
                        </Link>
                     </li>
                     <li>
                        <Link href="/admin/account" className={`flex flex-row items-center justify-left ${currentPath === '/admin/account' ? 'bg-gray-200' : ''} border-b border-gray-300 p-2 text-gray-900 rounded-lg hover:bg-gray-200 group`}>
                           <Image src="/icons/common/account.svg" alt="Logo" width="40" height="40" className="border p-1 border-gray-300 rounded-lg" />
                           <span className="hidden xl:block pl-4 mt-2 whitespace-nowrap text-sm">{t('sidebarAdmin.account')}</span>
                        </Link>
                     </li>
                  </ul>
               </div>
            </aside>
         </div>
    );
  };
  
  export default SidebarAdmin;