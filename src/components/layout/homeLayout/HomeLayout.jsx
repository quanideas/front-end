"use client"
import NavbarHome from '@/components/pages/home/navbarHome/NavbarHome';
import FooterHome from '@/components/pages/home/footerHome/FooterHome';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';

const HomeLayout = ({ children }) => {
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
    <div>
      <NavbarHome />
        <main className=" -mt-6">{children}</main>
      <FooterHome />
    </div>
  );
};

export default HomeLayout;
