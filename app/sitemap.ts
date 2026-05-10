import { MetadataRoute } from 'next';
import { guidePages } from '@/data/guides';

const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://farever.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Guide pages
    ...guidePages.map((guide) => ({
      url: `${BASE_URL}/${guide.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Legal pages
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];
}
