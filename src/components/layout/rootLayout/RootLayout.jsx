"use client"
import React, { useState, useEffect } from 'react';
import NavbarUser from "../../pages/user/share/navbarUser/NavbarUser";
import SidebarRoot from "../../pages/user/root/sidebarRoot/SidebarRoot";
import { useTranslation } from 'next-i18next';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';
import { ToastContainer } from 'react-toastify';

const RootLayout = ({ children }) => {
  const { i18n } = useTranslation("common");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      await i18n.loadNamespaces('common');
      setIsLoaded(true);
    };

    loadTranslations();
  }, [i18n]);

  if (!isLoaded) {
    return <LoadingPage/>;
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarUser/>
      <SidebarRoot/>
      <ToastContainer/>
      {children}
    </div>
  );
};

export default RootLayout;