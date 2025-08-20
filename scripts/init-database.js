#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 
 * 功能：
 * 1. 创建数据库表
 * 2. 插入初始数据
 * 3. 验证数据完整性
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import { 
  projects, 
  gamesBase, 
  projectGames, 
  categories, 
  projectCategories,
  projectGameCategories,
  projectComments,
  projectRatings
} from '../data/schema.js';

// 创建数据库连接
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_DATABASE_AUTH_TOKEN || "",
});

const db = drizzle(turso);

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 初始项目数据
const initialProject = {
  id: 1,
  name: "Sprunki Games Hub",
  description: "A gaming platform featuring Sprunki and related games",
  domain: "localhost:3000",
  defaultLocale: "en",
  locales: JSON.stringify(["en", "zh", "es"]),
  aiConfig: JSON.stringify({
    enabled: true,
    model: "gpt-3.5-turbo",
    features: ["auto-translation", "content-generation"]
  }),
  isActive: true
};

// 初始分类数据
const initialCategories = [
  {
    id: "MUSIC",
    name: "Music Games",
    description: "Interactive music and rhythm games",
    icon: "🎵"
  },
  {
    id: "PUZZLE",
    name: "Puzzle Games", 
    description: "Mind-bending puzzle and logic games",
    icon: "🧩"
  },
  {
    id: "ACTION",
    name: "Action Games",
    description: "Fast-paced action and adventure games", 
    icon: "⚡"
  },
  {
    id: "CREATIVE",
    name: "Creative Games",
    description: "Build, create and express your creativity",
    icon: "🎨"
  },
  {
    id: "NEW_GAMES",
    name: "New Games",
    description: "Latest and newest games added to our collection",
    icon: "🆕"
  }
];

// 初始游戏数据
const initialGames = [
  {
    id: "sprunki-incredibox",
    title: "Sprunki Incredibox",
    iframeUrl: "https://sprunki.com/game/sprunki-incredibox",
    imageUrl: "/images/games/sprunki-incredibox.jpg",
    rating: 4.8,
    metadata: JSON.stringify({
      tags: ["music", "rhythm", "creative"],
      difficulty: "easy",
      duration: "10-30 minutes",
      multiplayer: false
    }),
    content: "# Sprunki Incredibox\n\nCreate amazing music with the Sprunki characters in this unique beatboxing experience.",
    createdAt: new Date().toISOString()
  },
  {
    id: "sprunki-phase-3",
    title: "Sprunki Phase 3",
    iframeUrl: "https://sprunki.com/game/sprunki-phase-3", 
    imageUrl: "/images/games/sprunki-phase-3.jpg",
    rating: 4.7,
    metadata: JSON.stringify({
      tags: ["music", "horror", "creative"],
      difficulty: "medium",
      duration: "15-45 minutes",
      multiplayer: false
    }),
    content: "# Sprunki Phase 3\n\nExplore the darker side of Sprunki with new characters and haunting melodies.",
    createdAt: new Date().toISOString()
  }
];

async function initializeDatabase() {
  log('🚀 开始初始化数据库...', 'cyan');
  
  try {
    // 1. 插入项目数据
    log('📁 创建初始项目...', 'blue');
    await db.insert(projects).values(initialProject);
    log('✅ 项目创建成功', 'green');
    
    // 2. 插入基础游戏数据
    log('🎮 创建基础游戏数据...', 'blue');
    await db.insert(gamesBase).values(initialGames);
    log('✅ 基础游戏数据创建成功', 'green');
    
    // 3. 插入分类数据  
    log('📂 创建分类数据...', 'blue');
    await db.insert(categories).values(initialCategories);
    log('✅ 分类数据创建成功', 'green');
    
    // 4. 创建项目特定的分类
    log('🏷️ 创建项目分类关联...', 'blue');
    const projectCategoryData = initialCategories.map(cat => ({
      projectId: 1,
      categoryId: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      isActive: true,
      sortOrder: initialCategories.indexOf(cat) + 1
    }));
    await db.insert(projectCategories).values(projectCategoryData);
    log('✅ 项目分类关联创建成功', 'green');
    
    // 5. 创建项目特定的游戏
    log('🎯 创建项目游戏关联...', 'blue');
    const projectGameData = initialGames.map((game, index) => ({
      projectId: 1,
      gameId: game.id,
      title: game.title,
      description: game.content.split('\n\n')[1] || game.title,
      slug: game.id,
      isActive: true,
      isMain: index === 0, // 第一个游戏设为主游戏
      sortOrder: index + 1,
      localeContent: JSON.stringify({
        en: { title: game.title, description: game.content }
      })
    }));
    await db.insert(projectGames).values(projectGameData);
    log('✅ 项目游戏关联创建成功', 'green');
    
    // 6. 创建游戏分类关联
    log('🔗 创建游戏分类关联...', 'blue');
    const gameCategoryData = [
      { projectId: 1, gameId: "sprunki-incredibox", categoryId: "MUSIC" },
      { projectId: 1, gameId: "sprunki-incredibox", categoryId: "CREATIVE" },
      { projectId: 1, gameId: "sprunki-phase-3", categoryId: "MUSIC" },
      { projectId: 1, gameId: "sprunki-phase-3", categoryId: "ACTION" }
    ];
    await db.insert(projectGameCategories).values(gameCategoryData);
    log('✅ 游戏分类关联创建成功', 'green');
    
    // 7. 创建示例评论
    log('💬 创建示例评论...', 'blue');
    const sampleComments = [
      {
        projectId: 1,
        gameId: "sprunki-incredibox",
        userName: "Music Lover",
        userEmail: "musiclover@example.com",
        content: "This game is absolutely amazing! The music creation possibilities are endless.",
        isApproved: true,
        ipAddress: "192.168.1.1",
        userAgent: "Test Browser",
        createdAt: new Date().toISOString()
      },
      {
        projectId: 1,
        gameId: "sprunki-phase-3", 
        userName: "Gamer123",
        userEmail: "gamer@example.com",
        content: "Love the darker theme in Phase 3. Really adds to the atmosphere!",
        isApproved: true,
        ipAddress: "192.168.1.2",
        userAgent: "Test Browser",
        createdAt: new Date().toISOString()
      }
    ];
    await db.insert(projectComments).values(sampleComments);
    log('✅ 示例评论创建成功', 'green');
    
    // 8. 创建示例评分
    log('⭐ 创建示例评分...', 'blue');
    const sampleRatings = [
      {
        projectId: 1,
        gameId: "sprunki-incredibox",
        rating: 5,
        userName: "Music Lover",
        userEmail: "musiclover@example.com",
        ipAddress: "192.168.1.1",
        userAgent: "Test Browser",
        createdAt: new Date().toISOString()
      },
      {
        projectId: 1,
        gameId: "sprunki-incredibox",
        rating: 4,
        userName: "CasualPlayer",
        userEmail: "casual@example.com", 
        ipAddress: "192.168.1.3",
        userAgent: "Test Browser",
        createdAt: new Date().toISOString()
      },
      {
        projectId: 1,
        gameId: "sprunki-phase-3",
        rating: 5,
        userName: "Gamer123",
        userEmail: "gamer@example.com",
        ipAddress: "192.168.1.2", 
        userAgent: "Test Browser",
        createdAt: new Date().toISOString()
      }
    ];
    await db.insert(projectRatings).values(sampleRatings);
    log('✅ 示例评分创建成功', 'green');
    
    log('\n🎉 数据库初始化完成！', 'green');
    
  } catch (error) {
    log(`❌ 数据库初始化失败: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 验证数据完整性
async function verifyData() {
  log('\n🔍 验证数据完整性...', 'cyan');
  
  try {
    // 检查项目数量
    const projectCount = await db.select().from(projects);
    log(`📁 项目数量: ${projectCount.length}`, projectCount.length > 0 ? 'green' : 'red');
    
    // 检查游戏数量
    const gameCount = await db.select().from(gamesBase);
    log(`🎮 基础游戏数量: ${gameCount.length}`, gameCount.length > 0 ? 'green' : 'red');
    
    const projectGameCount = await db.select().from(projectGames);
    log(`🎯 项目游戏数量: ${projectGameCount.length}`, projectGameCount.length > 0 ? 'green' : 'red');
    
    // 检查分类数量
    const categoryCount = await db.select().from(categories);
    log(`📂 基础分类数量: ${categoryCount.length}`, categoryCount.length > 0 ? 'green' : 'red');
    
    const projectCategoryCount = await db.select().from(projectCategories);
    log(`🏷️ 项目分类数量: ${projectCategoryCount.length}`, projectCategoryCount.length > 0 ? 'green' : 'red');
    
    // 检查评论数量
    const commentCount = await db.select().from(projectComments);
    log(`💬 评论数量: ${commentCount.length}`, commentCount.length > 0 ? 'green' : 'red');
    
    // 检查评分数量
    const ratingCount = await db.select().from(projectRatings);
    log(`⭐ 评分数量: ${ratingCount.length}`, ratingCount.length > 0 ? 'green' : 'red');
    
    log('\n✅ 数据验证完成', 'green');
    
  } catch (error) {
    log(`❌ 数据验证失败: ${error.message}`, 'red');
    console.error(error);
  }
}

// 主函数
async function main() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_AUTH_TOKEN) {
    log('❌ 缺少数据库环境变量:', 'red');
    log('  TURSO_DATABASE_URL', 'yellow');
    log('  TURSO_DATABASE_AUTH_TOKEN', 'yellow');
    log('\n请设置这些环境变量后重试。', 'cyan');
    process.exit(1);
  }
  
  await initializeDatabase();
  await verifyData();
  
  log('\n🎊 初始化完成！您现在可以启动应用程序进行测试。', 'green');
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log(`💥 发生错误: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

export { initializeDatabase, verifyData };
