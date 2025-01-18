"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/legacy/image";
import LocaleSwitcher from "@/components/common/localeSwitcher/LocaleSwitcher";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {usePathname , useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link'

const NavbarUser = () => {
  const { t } = useTranslation("common");
  const [userName, setUserName] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const currentPath = usePathname()
  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    setUserName(storedUserName || "");
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    // Clear local storage
    Cookies.remove('token', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    localStorage.removeItem("username");
    localStorage.removeItem("company_name");
    // Redirect to home page
    window.location.href = "/";
  };
  const handleProfileClick = () => {
    const pathSegments = currentPath.split('/');
    // Get the first segment of the path
    const baseRoute = pathSegments[1];

    // Navigate to /baseRoute/account
    router.push(`/${baseRoute}/account`);
  };

  return (
    <nav className="fixed content-center z-[100] h-16 w-full bg-white rounded-2xl border-b border-gray-200">
      <div className="flex justify-between items-center pl-3 pr-10 ">
        <div className="border-b border-primary rounded-md ">
          <Link href="/">
            <Image
              src="/images/common/logo_main.png"
              alt="Home"
              width={130}
              height={45}
              className="items-center"
            />
          </Link>
        </div>
        <div className="relative flex items-center space-x-8">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>

          {/* <div className="relative">
            <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-gray-700" />
            <div className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full"></div>
          </div> */}
          <div className="relative">
            <div
              className="flex items-center space-x-4 rounded-md py-1 px-2 cursor-pointer"
              onClick={() => setMenuVisible(!menuVisible)}
            >
              <p className="capitalize">{userName}</p>
              <div className="w-8 h-8 flex shadow-md items-center justify-center bg-primary rounded-md text-white font-bold">
                {getInitials(userName)}
              </div>
            </div>
            {menuVisible && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary rounded-full text-white font-bold text-xl">
                      {getInitials(userName)}
                    </div>
                    <div>
                      <p className="text-gray-700">{t("navbarUser.hello")}</p>
                      <p className="text-xl text-gray-500">{userName}</p>
                    </div>
                  </div>
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => setMenuVisible(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <hr className="my-2" />
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleProfileClick}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {t("navbarUser.profile")}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-500 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  {t("navbarUser.logout")}
                </button>
                <div className="sm:hidden p-4">
                <LocaleSwitcher />
              </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;
