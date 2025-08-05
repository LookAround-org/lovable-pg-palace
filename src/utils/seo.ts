
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export const updatePageSEO = (seoData: SEOData) => {
  // Update title
  if (seoData.title) {
    document.title = seoData.title;
    updateMetaTag('og:title', seoData.title);
    updateMetaTag('twitter:title', seoData.title);
  }

  // Update description
  if (seoData.description) {
    updateMetaTag('description', seoData.description);
    updateMetaTag('og:description', seoData.description);
    updateMetaTag('twitter:description', seoData.description);
  }

  // Update keywords
  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }

  // Update image
  if (seoData.image) {
    updateMetaTag('og:image', seoData.image);
    updateMetaTag('twitter:image', seoData.image);
  }

  // Update URL
  if (seoData.url) {
    updateMetaTag('og:url', seoData.url);
    updateLinkTag('canonical', seoData.url);
  }

  // Update type
  if (seoData.type) {
    updateMetaTag('og:type', seoData.type);
  }

  // Add structured data
  if (seoData.structuredData) {
    addStructuredData(seoData.structuredData);
  }
};

const updateMetaTag = (name: string, content: string) => {
  let selector = `meta[name="${name}"]`;
  if (name.startsWith('og:') || name.startsWith('twitter:')) {
    selector = `meta[property="${name}"]`;
  }
  
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const addStructuredData = (data: object) => {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing && existing.textContent?.includes('"@type"')) {
    existing.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export const generatePropertyStructuredData = (property: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": property.title,
    "description": property.description,
    "image": property.images?.[0],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location
    },
    "priceRange": `₹${property.price_single} - ₹${property.price_triple}`,
    "aggregateRating": property.rating ? {
      "@type": "AggregateRating",
      "ratingValue": property.rating,
      "reviewCount": property.reviewCount || 0
    } : undefined,
    "amenityFeature": property.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }))
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};
