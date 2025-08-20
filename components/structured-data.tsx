'use client';

import React from 'react';
import { GameProps } from '@/types/game';

interface StructuredDataProps {
  game: GameProps;
  isMainPage?: boolean;
}

export function StructuredData({ game, isMainPage = false }: StructuredDataProps) {
  // Website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BunnyMarket",
    "url": process.env.NEXT_PUBLIC_WEB_URL,
    "description": "Play the best free online games at BunnyMarket! Enjoy a collection of fun, engaging, and entertaining games for all ages.",
    "publisher": {
      "@type": "Organization",
      "name": "BunnyMarket",
      "url": process.env.NEXT_PUBLIC_WEB_URL
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${process.env.NEXT_PUBLIC_WEB_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Game structured data
  const gameStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.metadata?.description || `Play ${game.title} free online at BunnyMarket! A fun and engaging game for all ages.`,
    "url": isMainPage ? (process.env.NEXT_PUBLIC_WEB_URL) : `${process.env.NEXT_PUBLIC_WEB_URL}/${game.id}`,
    "image": game.image || `${process.env.NEXT_PUBLIC_WEB_URL}/og-image.jpg`,
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
      "name": "BunnyMarket",
      "url": process.env.NEXT_PUBLIC_WEB_URL
    },
    "inLanguage": "en-US"
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BunnyMarket",
    "url": process.env.NEXT_PUBLIC_WEB_URL,
    "logo": `${process.env.NEXT_PUBLIC_WEB_URL}/logo.png`,
    "description": "BunnyMarket offers the best collection of free online games for players of all ages.",
    "sameAs": [
      process.env.NEXT_PUBLIC_WEB_URL
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