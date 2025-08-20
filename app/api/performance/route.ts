import { NextResponse } from 'next/server';
import { performanceMonitor, getMemoryUsage, cacheMonitor } from '@/utils/performance';
import { getCacheStats } from '@/models/games';

// 性能监控需要Node.js runtime以访问process对象
export const runtime = 'edge';

export async function GET() {
  try {
    // 收集性能指标
    const performanceStats = performanceMonitor.getStats();
    const memoryUsage = getMemoryUsage();
    const cacheStats = getCacheStats();
    const cacheHitStats = cacheMonitor.getStats();

    const response = {
      timestamp: new Date().toISOString(),
      performance: performanceStats,
      memory: memoryUsage,
      cache: {
        internal: cacheStats,
        hitRates: cacheHitStats
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Performance API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to collect performance metrics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 清除性能指标
export async function DELETE() {
  try {
    performanceMonitor.clearMetrics();
    cacheMonitor.clearStats();
    
    return NextResponse.json(
      { 
        message: 'Performance metrics cleared',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Performance API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to clear performance metrics' },
      { status: 500 }
    );
  }
}
