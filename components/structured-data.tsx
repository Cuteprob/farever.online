'use client';

import React from 'react';
import { GameProps } from '@/types/game';
import { createGameFallbackDescription, siteConfig } from '@/lib/site-config';

interface StructuredDataProps {
  game: GameProps;
  isMainPage?: boolean;
}

export function StructuredData({ game, isMainPage = false }: StructuredDataProps) {
  const baseUrl = siteConfig.siteUrl;

  // Website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.siteName,
    "url": baseUrl,
    "description": siteConfig.siteDescription,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.siteName,
      "url": baseUrl
    },
  };

  // Game structured data
  const gameStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.metadata?.description || createGameFallbackDescription(game.title),
    "url": isMainPage ? baseUrl : `${baseUrl}/${game.id}`,
    "image": game.image || `${baseUrl}/og-image.jpg`,
    "genre": game.categories?.join(", ") || "Online Game",
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": game.rating?.totalRatings > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": game.rating.averageRating,
      "ratingCount": game.rating.totalRatings,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "datePublished": game.createdAt,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.siteName,
      "url": baseUrl
    },
    "inLanguage": siteConfig.siteLocale
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.siteName,
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": siteConfig.siteDescription,
    "sameAs": [
      baseUrl
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gameStructuredData)
        }}
      />
      {isMainPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData)
          }}
        />
      )}
    </>
  );
}
