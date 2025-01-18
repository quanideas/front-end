"use client"

import NotFound from '@/components/common/notFound/NotFound';
import LoadingPage from '@/components/common/loadingPage/LoadingPage';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const NotFoundPage = () =>{
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
        <NotFound />
        </div>
    )
    }
    
export default NotFoundPage