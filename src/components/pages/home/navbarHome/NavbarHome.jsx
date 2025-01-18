"use client"
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll'; 
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './navbar.module.css'; // Import CSS module
import { useTranslation } from 'next-i18next';
import LocaleSwitcher from "@/components/common/localeSwitcher/LocaleSwitcher";
import { ArrowLeftEndOnRectangleIcon as LoginIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Cookies from 'js-cookie'; // Import js-cookie
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import { useRouter } from 'next/navigation'; // Import useRouter

const NavbarHome = () => {
    const { t, i18n } = useTranslation("common");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        const loadTranslations = async () => {
            await i18n.loadNamespaces('common');
            setIsLoaded(true);
        };
  
        loadTranslations();
    }, [i18n]);

    useEffect(() => {
        const token = Cookies.get('token'); // Get the token from cookies

        if (token) {
            // Decode the token to get user information
            const decodedToken = jwtDecode(token);
            setIsAuthenticated(true);
            setUserRole(decodedToken); // Assuming decodedToken contains is_root and is_admin
        }
    }, []);

    const handleDashboardClick = () => {
        // Navigate based on user role
        if (userRole?.is_root) {
            router.push('/root/dashboard');
        } else if (userRole?.is_admin) {
            router.push('/admin/dashboard');
        } else {
            router.push('/user/dashboard');
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    if (!isLoaded) {
        return <div></div>;
    }

    return (
        <nav className={`${styles['nav-container']}`}>
            <nav className={`bg-white bg-opacity-50 backdrop-blur-lg backdrop-filter w-full top-0 start-0 border-b border-primary relative z-10 pl-1 pr-8`}>
                <div className="max-w-screen-xxl flex flex-wrap items-center justify-between mx-auto p-1">
                    <div className="border-b border-primary rounded-md">
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

                    <div className="flex items-center xl:order-2 space-x-3 xl:space-x-3 rtl:space-x-reverse">

                        {!isAuthenticated ? (
                            <>
                                <Link href="/login" className="hidden sm:block">
                                    <button className="w-28 text-black border-primary border hover:border-primary-hover hover:text-primary shadow-md font-medium rounded-lg text-sm px-4 py-2 text-center">
                                        {t("navbarHome.login")}
                                    </button>
                                </Link>
                                <Link href="/login" className="block sm:hidden">
                                    <UserCircleIcon className="h-10 w-10 text-gray-500 hover:shadow-md p-2 rounded-md" aria-hidden="true" />
                                </Link>
                            </>
                        ) : (
                            <div>
                                <button
                                    onClick={handleDashboardClick}
                                    className="hidden sm:block text-black border-primary border hover:border-primary-hover hover:text-primary shadow-md font-medium rounded-lg text-sm px-4 py-2 text-center"
                                >
                                    {t("sidebarUser.dashboard")}
                                </button>
                                <button
                                    onClick={handleDashboardClick}
                                    className="block h-10 w-10 sm:hidden hover:shadow-md font-medium p-2 rounded-md"
                                    >
                                    <Image
                                        src="/icons/common/dashboard.svg"
                                        alt="Dashboard Icon"
                                        width={25} 
                                        height={25}
                                    />
                                    </button>
                               
                            </div>
                        )}

                        <Link href="/quotes" className="hidden sm:block">
                            <button className="w-32 text-white bg-primary border border-primary hover:bg-primary-hover hover:text-gray-800 font-medium rounded-lg shadow-md text-sm px-4 py-2 text-center">
                                {t("navbarHome.quote")}
                            </button>
                        </Link>

                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-sticky" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className={`xl:flex flex-col items-center justify-center w-full xl:w-auto xl:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
                        <ul className="flex flex-col p-4 xl:p-0 mt-4 font-extralight lg:font-medium border border-gray-100 rounded-lg xl:space-x-8 rtl:space-x-reverse xl:flex-row xl:justify-center xl:mt-0 xl:border-0 ">
                            <ScrollLink
                                to="short-info"
                                smooth={true}
                                duration={800}
                                className="block text-gray-900 rounded hover:bg-gray-100 xl:hover:bg-transparent xl:hover:text-primary-hover xl:p-0"
                                activeClass={styles.active}
                                spy={true}
                                offset={-50}
                                onClick={closeMenu}
                            >
                                {t("navbarHome.about_us")}
                            </ScrollLink>
                            <ScrollLink
                                to="project"
                                smooth={true}
                                duration={800}
                                className="block text-gray-900 rounded hover:bg-gray-100 xl:hover:bg-transparent xl:hover:text-primary-hover xl:p-0"
                                activeClass={styles.active}
                                spy={true}
                                offset={-50}
                                onClick={closeMenu}
                            >
                                {t("navbarHome.projects")}
                            </ScrollLink>
                            <ScrollLink
                                to="service"
                                smooth={true}
                                duration={800}
                                className="block text-gray-900 rounded hover:bg-gray-100 xl:hover:bg-transparent xl:hover:text-primary-hover xl:p-0"
                                activeClass={styles.active}
                                spy={true}
                                offset={-50}
                                onClick={closeMenu}
                            >
                                {t("navbarHome.services")}
                            </ScrollLink>
                            
                            <ScrollLink
                                to="equipment"
                                smooth={true}
                                duration={800}
                                className="block text-gray-900 rounded hover:bg-gray-100 xl:hover:bg-transparent xl:hover:text-primary-hover xl:p-0"
                                activeClass={styles.active}
                                spy={true}
                                offset={-50}
                                onClick={closeMenu}
                            >
                                {t("navbarHome.equipments")}
                            </ScrollLink>

                            <ScrollLink
                                to="contact"
                                smooth={true}
                                duration={800}
                                className="block text-gray-900 rounded hover:bg-gray-100 xl:hover:bg-transparent xl:hover:text-primary-hover xl:p-0"
                                activeClass={styles.active}
                                spy={true}
                                offset={-50}
                                onClick={closeMenu}
                            >
                                {t("navbarHome.contact")}
                            </ScrollLink>
                            <div className='xl:py-0 py-2'>
                                <LocaleSwitcher />
                            </div>
                        </ul>
                    </div>
                </div>
            </nav>
        </nav>
    );
};

export default NavbarHome;
