# 环境配置说明

## .env.local 配置

请在项目根目录创建 `.env.local` 文件，并添加以下配置：

```env
# 数据库配置
TURSO_DATABASE_URL="your_turso_database_url_here"
TURSO_DATABASE_AUTH_TOKEN="your_turso_auth_token_here"

# 项目配置
PROJECT_ID="bunnymarket-app"

# 网站配置
NEXT_PUBLIC_WEB_URL="https://bunnymarket.app"

# Google Analytics 配置
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-K8RC4LFETZ"

# Google AdSense 配置  
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-8480929139790231"

# Next.js 配置
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# 性能监控配置（可选）
ENABLE_PERFORMANCE_MONITORING="true"
LOG_SLOW_QUERIES="true"
SLOW_QUERY_THRESHOLD="1000"

# 缓存配置（可选）
CACHE_TTL="300"
MAX_CACHE_SIZE="1000"
```

## 配置说明

### 必需配置

- `TURSO_DATABASE_URL`: Turso 数据库连接URL
- `TURSO_DATABASE_AUTH_TOKEN`: Turso 数据库认证令牌
- `PROJECT_ID`: 项目标识符，用于数据库查询过滤
- `NEXT_PUBLIC_WEB_URL`: 网站主域名，用于元数据和结构化数据
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Google Analytics 跟踪ID
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`: Google AdSense 发布商ID
- `NEXT_PUBLIC_BASE_URL`: 应用基础URL，用于SSR中的API调用

### 可选配置

- `ENABLE_PERFORMANCE_MONITORING`: 启用性能监控日志
- `LOG_SLOW_QUERIES`: 记录慢查询
- `SLOW_QUERY_THRESHOLD`: 慢查询阈值（毫秒）
- `CACHE_TTL`: 缓存生存时间（秒）
- `MAX_CACHE_SIZE`: 最大缓存条目数

## 数据库优化

运行数据库优化脚本：

```bash
# 如果使用 Turso CLI
turso db shell your-database < scripts/optimize-database.sql

# 或者在应用中执行优化
npm run optimize-db
```
