// Service Worker for the current game site template
// 提供离线缓存和性能优化

const CACHE_NAME = 'game-site-v1';
const STATIC_CACHE = 'game-site-static-v1';
const API_CACHE = 'game-site-api-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/logo.png',
  '/placeholder.png',
  // 字体文件会被浏览器自动缓存
];

// 需要缓存的API路由
const API_ROUTES = [
  '/api/getMainGames',
  '/api/getAllGames',
  '/api/getGamesByCategory',
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // 立即激活新的Service Worker
      self.skipWaiting()
    ])
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 清理旧版本缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 立即接管所有页面
      self.clients.claim()
    ])
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== self.location.origin) {
    return;
  }

  // API请求策略：网络优先，缓存备用
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // 静态资源策略：缓存优先
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // 页面请求策略：网络优先，缓存备用
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
});

// 处理API请求 - 网络优先策略
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 尝试网络请求
    const response = await fetch(request);
    
    // 只缓存成功的GET请求
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      // 缓存响应副本
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果是主游戏API，返回空数据而不是错误
    if (url.pathname === '/api/getMainGames') {
      return new Response(JSON.stringify({
        success: true,
        data: null,
        message: 'Offline mode - no data available'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// 处理静态资源 - 缓存优先策略
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // 返回占位符图片（如果是图片请求）
    if (request.url.includes('.png') || request.url.includes('.jpg') || request.url.includes('.jpeg')) {
      const placeholderResponse = await cache.match('/placeholder.png');
      if (placeholderResponse) {
        return placeholderResponse;
      }
    }
    throw error;
  }
}

// 处理页面导航 - 网络优先策略
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    
    // 缓存成功的页面响应
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果没有缓存，返回离线页面
    const offlineResponse = await cache.match('/');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    throw error;
  }
}

// 判断是否为静态资源
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/static/') ||
         pathname.includes('.png') ||
         pathname.includes('.jpg') ||
         pathname.includes('.jpeg') ||
         pathname.includes('.gif') ||
         pathname.includes('.svg') ||
         pathname.includes('.ico') ||
         pathname.includes('.css') ||
         pathname.includes('.js');
}

// 后台同步 - 用于评论提交等
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // 处理离线时提交的评论等操作
  console.log('Background sync triggered');
}
