
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updatePageSEO, SEOData } from '@/utils/seo';

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();

  useEffect(() => {
    const fullUrl = `${window.location.origin}${location.pathname}`;
    const updatedSEOData = {
      ...seoData,
      url: seoData.url || fullUrl
    };
    
    updatePageSEO(updatedSEOData);
  }, [seoData, location.pathname]);
};

export const usePageSEO = (
  title: string,
  description: string,
  keywords?: string,
  image?: string,
  structuredData?: object
) => {
  const seoData: SEOData = {
    title: `${title} | FindMyPG`,
    description,
    keywords,
    image,
    structuredData
  };

  useSEO(seoData);
};
