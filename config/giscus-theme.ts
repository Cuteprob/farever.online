export const giscusTheme = {
  "theme": "light",
  "css": `
    /* 主容器样式 */
    .giscus, .giscus-frame {
      width: 100%;
      background-color: transparent !important;
    }

    /* 隐藏 powered by giscus */
    .gsc-footer {
      display: none !important;
    }

    /* 隐藏排序和过滤选项 */
    .gsc-timeline-header {
      display: none !important;
    }

    /* 隐藏回复按钮 */
    .gsc-reply-button {
      display: none !important;
    }

    /* 输入框容器 - 移除边框 */
    .gsc-comment-box-main {
      border: none !important;
      background-color: transparent !important;
    }

    /* 输入框样式 */
    .gsc-comment-box {
      background-color: transparent !important;
      border: none !important;
      padding: 0 !important;
    }

    /* 输入框文本区域 */
    .gsc-comment-box textarea {
      border: 1px solid hsl(var(--border)) !important;
      background-color: hsl(var(--input)) !important;
      padding: 1rem !important;
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
      color: hsl(var(--foreground)) !important;
      border-radius: var(--radius) !important;
      font-family: var(--font-nunito), sans-serif !important;
    }

    /* 按钮样式 */
    .gsc-comment-box-buttons button {
      border-radius: 9999px !important;
      padding: 0.5rem 1rem !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      transition: all 0.2s !important;
      font-family: var(--font-nunito), sans-serif !important;
    }

    /* 主按钮 */
    .gsc-comment-box-buttons button.gsc-submit {
      background-color: hsl(var(--primary)) !important;
      color: hsl(var(--primary-foreground)) !important;
    }

    .gsc-comment-box-buttons button.gsc-submit:hover {
      opacity: 0.9 !important;
    }

    /* 评论列表样式 - 移除边框 */
    .gsc-comment {
      border: none !important;
      padding: 1rem 0 !important;
      margin-bottom: 1rem !important;
      display: flex !important;
      gap: 1rem !important;
    }

    /* 头像容器 */
    .gsc-comment-author-avatar {
      margin-right: 0 !important;
    }

    /* 头像样式 */
    .gsc-comment-author-avatar img {
      width: 2.5rem !important;
      height: 2.5rem !important;
      border-radius: 9999px !important;
    }

    /* 评论内容容器 */
    .gsc-comment-content {
      flex: 1 !important;
      background: transparent !important;
      padding: 0 !important;
    }

    /* 评论头部信息 */
    .gsc-comment-header {
      margin-bottom: 0.5rem !important;
    }

    /* 用户名样式 */
    .gsc-comment-author-name {
      color: hsl(var(--foreground)) !important;
      font-weight: 500 !important;
      font-family: var(--font-fredoka-one), cursive !important;
    }

    /* 时间戳样式 */
    .gsc-comment-timestamp {
      color: hsl(var(--muted-foreground)) !important;
      font-size: 0.75rem !important;
      font-family: var(--font-nunito), sans-serif !important;
    }

    /* 评论文本样式 */
    .gsc-comment-content .gsc-comment-text {
      color: hsl(var(--muted-foreground)) !important;
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
      font-family: var(--font-nunito), sans-serif !important;
    }

    /* 移除所有分割线 */
    .gsc-timeline > div:not(:last-child)::after {
      display: none !important;
    }

    /* 移除评论之间的边距和分隔线 */
    .gsc-timeline {
      border: none !important;
      gap: 1rem !important;
    }
  `
} 