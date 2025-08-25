import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 部署时不需要 Next.js 图片优化
  
  async headers() {
    return [
      {
        // 为所有页面添加基本的安全头
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // 特别为游戏页面添加额外的防爬虫头
        source: '/:gameId',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
