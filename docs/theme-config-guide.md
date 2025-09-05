# 主题配置指南

## 🎯 核心配置文件

### 1. 颜色主题 - `tailwind.config.ts`
```typescript
// 修改这四个颜色系统即可适配新项目
theme: {
  fire: { 500: 'hsl(14, 100%, 57%)' },    // 主色调 - 改为你的品牌色
  ocean: { 500: 'hsl(200, 100%, 50%)' },  // 次要色 - 改为辅助色
  neon: { 500: 'hsl(120, 100%, 50%)' },   // 强调色 - 改为高亮色
  dark: { 900: 'hsl(220, 15%, 8%)' }      // 背景色 - 改为主背景色
}
```

### 2. 字体配置 - `app/layout.tsx`
```typescript
// 更换字体导入，保持变量名格式
const primaryFont = YourFont({ variable: '--font-primary' });
const bodyFont = YourBodyFont({ variable: '--font-body' });
```

### 3. CSS变量 - `app/globals.css`
```css
:root {
  --primary: 14 100% 57%;        // 对应主色调
  --background: 220 15% 8%;      // 对应背景色
  --foreground: 0 0% 95%;        // 对应文字色
}
```

## 🔧 快速适配步骤

1. **修改颜色** - 在 `tailwind.config.ts` 中更新四个颜色系统
2. **更换字体** - 在 `app/layout.tsx` 中导入新字体
3. **同步变量** - 在 `app/globals.css` 中更新对应的CSS变量值

## ✅ 优势特点

- 🎨 **语义化命名** - 使用 `theme-fire`、`btn-primary` 等通用类名
- 🔄 **统一配置** - 只需修改配置文件，无需改动组件代码
- 📚 **组件样式库** - `globals.css` 中预定义了完整的样式系统
- 📱 **响应式支持** - 内置完整的响应式设计工具

> **提示：** 这个模板已经建立了完善的设计系统，可以作为其他项目的基础模板使用。
