"use client"
import React, { useState, useEffect } from 'react';
import NavbarAdmin from "@/components/pages/user/share/navbarUser/NavbarUser";
import SidebarAdmin from "@/components/pages/user/admin/sidebarAdmin/SidebarAdmin";
import { useTranslation } from 'next-i18next';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';
import { ToastContainer } from 'react-toastify';


const AdminLayout = ({ children }) => {
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
      <NavbarAdmin />
      <SidebarAdmin />
      <ToastContainer/>
      {children}
    </div>
  );
};

export default AdminLayout;