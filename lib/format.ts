import { GameProps } from "@/types/game";

export function safeParseMetadata(input: unknown, maxDepth = 3): Record<string, any> {
  let value: unknown = input;
  let depth = 0;

  while (depth <= maxDepth) {
    if (value == null) return {};

    if (typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, any>;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return {};

      // 1) 直接尝试 JSON.parse（即使不是以 { 或 [ 开头）
      try {
        const parsed = JSON.parse(trimmed);
        value = parsed;
        depth++;
        continue;
      } catch {}

      // 2) 尝试去掉首尾引号再解析（处理形如 "{...}" 的情况）
      const hasWrappedDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
      const hasWrappedSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");
      if (hasWrappedDoubleQuotes || hasWrappedSingleQuotes) {
        const unwrapped = trimmed.slice(1, -1);
        try {
          const parsed = JSON.parse(unwrapped);
          value = parsed;
          depth++;
          continue;
        } catch {}
      }

      // 3) 放弃并返回空对象
      return {};
    }

    return {};
  }

  return {};
}

export function transformDbResultToGame(row: any): GameProps {
    try {
      const projectMetadata = safeParseMetadata(row.metadata);
      const baseMetadata = safeParseMetadata((row as any).baseMetadata);

  
      return {
        id: row.gameId,
        title: row.title || '',
        image: row.imageUrl || '',
        rating: {
          averageRating: parseFloat(row.averageRating) || 0,
          totalRatings: parseInt(row.totalRatings) || 0
        },
        categories: row.categories
          ? row.categories.split(',').map((c: string) => c.trim()).filter(Boolean)
          : [],
        iframeUrl: row.iframeUrl || '',
        createdAt: row.createdAt || '',
        content: row.content || '',
        metadata: ((): GameProps['metadata'] => {
          const source = (projectMetadata && Object.keys(projectMetadata).length > 0)
            ? projectMetadata
            : baseMetadata || {};

          const title = typeof source.title === 'string' && source.title.trim() ? source.title.trim() : '';
          const description = typeof source.description === 'string' && source.description.trim() ? source.description.trim() : '';

          // keywords 支持数组或以逗号分隔的字符串；缺失时回退到 tags
          let keywords: string[] = [];
          const rawKeywords = source.keywords ?? source.tags;
          if (Array.isArray(rawKeywords)) {
            keywords = rawKeywords.map(k => String(k).trim()).filter(Boolean);
          } else if (typeof rawKeywords === 'string') {
            keywords = rawKeywords.split(',').map(k => k.trim()).filter(Boolean);
          }

          return {
            title,
            description,
            keywords
          };
        })()
      };
    } catch (error) {
      console.error('[transform] error:', error);
      return {
        id: row.gameId || '',
        title: row.title || 'Unknown Game',
        image: row.imageUrl || '',
        rating: { averageRating: 0, totalRatings: 0 },
        categories: [],
        iframeUrl: row.iframeUrl || '',
        createdAt: row.createdAt || '',
        content: '',
        metadata: { title: '', description: '', keywords: [] }
      };
    }
  }
  
  