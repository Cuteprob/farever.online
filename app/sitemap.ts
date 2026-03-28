import { MetadataRoute } from 'next';
import { getAllGames, getAllCategories } from '@/models/games';
import { guidePages } from '@/data/guides';

// 基础 URL 配置 - 确保使用正确的生产环境 URL
const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || '';

// 生成静态页面配置 - 使用函数确保每次调用时都生成新的日期
function getStaticPages() {
  const now = new Date();
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...guidePages.map((guide) => ({
      url: `${BASE_URL}/${guide.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    console.log('Generating sitemap...');
    const startTime = Date.now();

    // 获取所有游戏数据
    const games = await getAllGames({});
    console.log(`Found ${games.length} games for sitemap`);

    // 获取所有分类数据
    const categories = await getAllCategories();
    console.log(`Found ${categories.length} categories for sitemap`);

    // 生成游戏页面 URL
    const gameUrls: MetadataRoute.Sitemap = games.map((game) => ({
      url: `${BASE_URL}/${game.id}`,
      lastModified: new Date(game.createdAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // 生成分类页面 URL
    const categoryUrls: MetadataRoute.Sitemap = categories
      .filter(category => category.gameCount > 0) // 只包含有游戏的分类
      .map((category) => ({
        url: `${BASE_URL}/games/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }));

    // 合并所有 URL
    const allUrls = [
      ...getStaticPages(),
      ...gameUrls,
      ...categoryUrls,
    ];

    const endTime = Date.now();
    console.log(`Sitemap generated with ${allUrls.length} URLs in ${endTime - startTime}ms`);

    return allUrls;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // 出错时返回基本的静态页面
    return getStaticPages();
  }
}

// 设置运行时环境（可选）
export const runtime = 'edge';

// 重新验证配置 - 确保 sitemap 能够动态更新
// 设置较短的重新验证时间，确保新游戏能够及时出现在 sitemap 中
export const revalidate = 300; // 5分钟重新验证一次，平衡性能和实时性
